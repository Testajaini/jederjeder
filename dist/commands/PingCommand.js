"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingCommand = void 0;
const tslib_1 = require("tslib");
const DefineCommand_1 = require("../utils/decorators/DefineCommand");
const BaseCommand_1 = require("../structures/BaseCommand");
const discord_js_1 = require("discord.js");
let PingCommand = class PingCommand extends BaseCommand_1.BaseCommand {
    execute(message) {
        message.channel.send("🏓").then((msg) => {
            var _a;
            const latency = msg.createdTimestamp - message.createdTimestamp;
            const wsLatency = this.client.ws.ping.toFixed(0);
            const embed = new discord_js_1.MessageEmbed()
                .setAuthor("🏓 PONG", (_a = message.client.user) === null || _a === void 0 ? void 0 : _a.displayAvatarURL())
                .setColor(this.searchHex(wsLatency))
                .addFields({
                name: "📶 **|** API",
                value: `**\`${latency}\`** ms`,
                inline: true
            }, {
                name: "🌐 **|** WebSocket",
                value: `**\`${wsLatency}\`** ms`,
                inline: true
            })
                .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
            msg.edit("", { embed }).catch(e => this.client.logger.error("PROMISE_ERR:", e));
        }).catch(e => this.client.logger.error("PROMISE_ERR:", e));
        return message;
    }
    searchHex(ms) {
        const listColorHex = [
            [0, 20, "GREEN"],
            [21, 50, "GREEN"],
            [51, 100, "YELLOW"],
            [101, 150, "YELLOW"],
            [150, 200, "YELLOW"]
        ];
        const defaultColor = "RED";
        const min = listColorHex.map(e => e[0]);
        const max = listColorHex.map(e => e[1]);
        const hex = listColorHex.map(e => e[2]);
        let ret = "#000000";
        for (let i = 0; i < listColorHex.length; i++) {
            if (min[i] <= ms && ms <= max[i]) {
                ret = hex[i];
                break;
            }
            else {
                ret = defaultColor;
            }
        }
        return ret;
    }
};
PingCommand = tslib_1.__decorate([
    DefineCommand_1.DefineCommand({
        aliases: ["pong", "pang", "pung", "peng", "pingpong"],
        description: "Show the current ping of the bot",
        name: "ping",
        usage: "{prefix}ping"
    })
], PingCommand);
exports.PingCommand = PingCommand;
