"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandManager = void 0;
const createEmbed_1 = require("./createEmbed");
const discord_js_1 = require("discord.js");
const path_1 = require("path");
const fs_1 = require("fs");
class CommandManager extends discord_js_1.Collection {
    constructor(client, path) {
        super();
        this.client = client;
        this.path = path;
        this.aliases = new discord_js_1.Collection();
        this.cooldowns = new discord_js_1.Collection();
    }
    load() {
        fs_1.promises.readdir(path_1.resolve(this.path))
            .then(async (files) => {
            var _a, _b;
            let disabledCount = 0;
            for (const file of files) {
                const path = path_1.resolve(this.path, file);
                const command = await this.import(path, this.client, { path });
                if (command === undefined)
                    throw new Error(`File ${file} is not a valid command file`);
                command.meta = Object.assign(command.meta, { path });
                if (Number((_a = command.meta.aliases) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                    (_b = command.meta.aliases) === null || _b === void 0 ? void 0 : _b.forEach(alias => {
                        this.aliases.set(alias, command.meta.name);
                    });
                }
                this.set(command.meta.name, command);
                if (command.meta.disable === true)
                    disabledCount++;
            }
            this.client.logger.info(`${this.client.shard ? `[Shard #${this.client.shard.ids[0]}]` : ""} A total of ${files.length} commands has been loaded`);
            if (disabledCount !== 0)
                this.client.logger.info(`${this.client.shard ? `[Shard #${this.client.shard.ids[0]}]` : ""} ${disabledCount} out of ${files.length} commands is disabled`);
        })
            .catch(err => this.client.logger.error("CMD_LOADER_ERR:", err));
        return undefined;
    }
    handle(message) {
        var _a, _b, _c;
        const args = message.content.substring(this.client.config.prefix.length).trim().split(/ +/);
        const cmd = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        const command = (_b = this.get(cmd)) !== null && _b !== void 0 ? _b : this.get(this.aliases.get(cmd));
        if (!command || command.meta.disable)
            return undefined;
        if (!this.cooldowns.has(command.meta.name))
            this.cooldowns.set(command.meta.name, new discord_js_1.Collection());
        const now = Date.now();
        const timestamps = this.cooldowns.get(command.meta.name);
        const cooldownAmount = ((_c = command.meta.cooldown) !== null && _c !== void 0 ? _c : 3) * 1000;
        if (timestamps === null || timestamps === void 0 ? void 0 : timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                message.channel.send(createEmbed_1.createEmbed("warn", `<@${message.author.id}>, please wait **\`${timeLeft.toFixed(1)}\`** of cooldown time`)).then(msg => {
                    msg.delete({ timeout: 3500 }).catch(e => this.client.logger.error("CMD_HANDLER_ERR:", e));
                }).catch(e => this.client.logger.error("CMD_HANDLER_ERR:", e));
                return undefined;
            }
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }
        else {
            timestamps === null || timestamps === void 0 ? void 0 : timestamps.set(message.author.id, now);
            if (this.client.config.owners.includes(message.author.id))
                timestamps === null || timestamps === void 0 ? void 0 : timestamps.delete(message.author.id);
        }
        try {
            return command.execute(message, args);
        }
        catch (e) {
            this.client.logger.error("CMD_HANDLER_ERR:", e);
        }
        finally {
            this.client.logger.info(`${this.client.shard ? `[Shard #${this.client.shard.ids[0]}]` : ""} ${message.author.tag} is using ${command.meta.name} command on ${message.guild ? message.guild.name : "DM Channel"}`);
        }
    }
    async import(path, ...args) {
        const file = (await Promise.resolve().then(() => __importStar(require(path_1.resolve(path)))).then(m => m[path_1.parse(path).name]));
        return file ? new file(...args) : undefined;
    }
}
exports.CommandManager = CommandManager;
