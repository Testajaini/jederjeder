"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AboutCommand = void 0;
const tslib_1 = require("tslib");
const DefineCommand_1 = require("../utils/decorators/DefineCommand");
const BaseCommand_1 = require("../structures/BaseCommand");
const createEmbed_1 = require("../utils/createEmbed");
const path_1 = tslib_1.__importDefault(require("path"));
let AboutCommand = class AboutCommand extends BaseCommand_1.BaseCommand {
    async execute(message) {
        var _a;
        const opusEncoderName = this.getOpusEncoder().name;
        message.channel.send(createEmbed_1.createEmbed("info", `
\`\`\`asciidoc
Users count        :: ${await this.client.getUsersCount()}
Channels count     :: ${await this.client.getChannelsCount()}
Guilds count       :: ${await this.client.getGuildsCount()}
Shards count       :: ${this.client.shard ? `${this.client.shard.count}` : "N/A"}
Shard ID           :: ${this.client.shard ? `${this.client.shard.ids[0]}` : "N/A"}
Playing Music on   :: ${await this.client.getTotalPlaying()} guilds
Developer          :: Gooder
\`\`\`
        `)
            .setAuthor(`${(_a = this.client.user) === null || _a === void 0 ? void 0 : _a.username} - INFO`)).catch(e => this.client.logger.error("ABOUT_CMD_ERR:", e));
    }
    bytesToSize(bytes) {
        if (isNaN(bytes) && bytes !== 0)
            throw new Error(`[bytesToSize] (bytes) Error: bytes is not a Number/Integer, received: ${typeof bytes}`);
        const sizes = ["B", "KiB", "MiB", "GiB", "TiB", "PiB"];
        if (bytes < 2 && bytes > 0)
            return `${bytes} Byte`;
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
        if (i === 0)
            return `${bytes} ${sizes[i]}`;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (sizes[i] === undefined)
            return `${bytes} ${sizes[sizes.length - 1]}`;
        return `${Number(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
    }
    getPackageJSON(pkgName) {
        if (process.platform === "win32")
            pkgName = pkgName.replace("/", "\\");
        const resolvedPath = path_1.default.resolve(require.resolve(pkgName));
        return path_1.default.resolve(resolvedPath.split(pkgName)[0], pkgName, "package.json");
    }
    getOpusEncoder() {
        const list = ["@discordjs/opus", "opusscript"];
        const errorLog = [];
        for (const name of list) {
            try {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const data = require(name);
                data.name = name;
                return data;
            }
            catch (e) {
                errorLog.push(e);
            }
        }
        throw new Error(errorLog.join("\n"));
    }
};
AboutCommand = tslib_1.__decorate([
    DefineCommand_1.DefineCommand({
        aliases: ["botinfo", "info", "stats"],
        description: "Send the information about the bot",
        name: "about",
        usage: "{prefix}about"
    })
], AboutCommand);
exports.AboutCommand = AboutCommand;
