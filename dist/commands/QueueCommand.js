"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueCommand = void 0;
const tslib_1 = require("tslib");
const DefineCommand_1 = require("../utils/decorators/DefineCommand");
const MusicHelper_1 = require("../utils/decorators/MusicHelper");
const BaseCommand_1 = require("../structures/BaseCommand");
const createEmbed_1 = require("../utils/createEmbed");
let QueueCommand = class QueueCommand extends BaseCommand_1.BaseCommand {
    execute(message) {
        var _a, _b, _c, _d, _e;
        const embed = createEmbed_1.createEmbed("info")
            .setTitle("Music Queue")
            .setThumbnail((_a = message.client.user) === null || _a === void 0 ? void 0 : _a.avatarURL());
        let num = 1;
        const songs = (_c = (_b = message.guild) === null || _b === void 0 ? void 0 : _b.queue) === null || _c === void 0 ? void 0 : _c.songs.map(s => `**${num++}.** **[${s.title}](${s.url})**`);
        if (Number((_e = (_d = message.guild) === null || _d === void 0 ? void 0 : _d.queue) === null || _e === void 0 ? void 0 : _e.songs.size) > 12) {
            const indexes = this.chunk(songs, 12);
            let index = 0;
            embed.setDescription(indexes[index]).setFooter(`Page ${index + 1} of ${indexes.length}`, "https://raw.githubusercontent.com/zhycorp/disc-11/main/.github/images/info.png");
            const reactions = ["◀️", "▶️"];
            message.channel.send(embed).then(msg => {
                msg.react("◀️").then(() => {
                    var _a;
                    msg.react("▶️").catch(e => this.client.logger.error("QUEUE_CMD_ERR:", e));
                    const isMessageManageable = (_a = msg.channel.permissionsFor(msg.client.user)) === null || _a === void 0 ? void 0 : _a.has("MANAGE_MESSAGES");
                    msg.createReactionCollector((reaction, user) => reactions.includes(reaction.emoji.name) && user.id === message.author.id, { time: 80 * 1000 })
                        .on("collect", (reaction, user) => {
                        if (isMessageManageable)
                            reaction.users.remove(user).catch(e => this.client.logger.error("QUEUE_CMD_ERR:", e));
                        switch (reaction.emoji.name) {
                            case "◀️":
                                if (index === 0)
                                    return undefined;
                                index--;
                                break;
                            case "▶️":
                                if (index + 1 === indexes.length)
                                    return undefined;
                                index++;
                                break;
                        }
                        embed.setDescription(indexes[index]).setFooter(`Page ${index + 1} of ${indexes.length}`, "https://raw.githubusercontent.com/zhycorp/disc-11/main/.github/images/info.png");
                        msg.edit(embed).catch(e => this.client.logger.error("QUEUE_CMD_ERR:", e));
                    })
                        .on("end", () => {
                        if (isMessageManageable)
                            msg.reactions.removeAll().catch(e => this.client.logger.error("QUEUE_CMD_ERR:", e));
                    });
                }).catch(e => this.client.logger.error("QUEUE_CMD_ERR:", e));
            }).catch(e => this.client.logger.error("QUEUE_CMD_ERR:", e));
        }
        else {
            message.channel.send(embed.setDescription(songs.join("\n"))).catch(e => this.client.logger.error("QUEUE_CMD_ERR:", e));
        }
    }
    chunk(array, chunkSize) {
        const temp = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            temp.push(array.slice(i, i + chunkSize));
        }
        return temp;
    }
};
tslib_1.__decorate([
    MusicHelper_1.isMusicPlaying(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], QueueCommand.prototype, "execute", null);
QueueCommand = tslib_1.__decorate([
    DefineCommand_1.DefineCommand({
        aliases: ["q"],
        description: "Show the current queue",
        name: "queue",
        usage: "{prefix}queue"
    })
], QueueCommand);
exports.QueueCommand = QueueCommand;
