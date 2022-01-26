"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LyricsCommand = void 0;
const tslib_1 = require("tslib");
const DefineCommand_1 = require("../utils/decorators/DefineCommand");
const BaseCommand_1 = require("../structures/BaseCommand");
const createEmbed_1 = require("../utils/createEmbed");
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
let LyricsCommand = class LyricsCommand extends BaseCommand_1.BaseCommand {
    async execute(message, args) {
        var _a, _b, _c;
        const song = (_c = (_b = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.queue) === null || _b === void 0 ? void 0 : _b.songs.first()) === null || _c === void 0 ? void 0 : _c.title;
        if (args[0]) {
            await this.sendLyrics(message, args.join(" "));
        }
        else if (song) {
            await this.sendLyrics(message, song);
        }
        else {
            message.channel.send(createEmbed_1.createEmbed("error", "There is nothing playing or no query was provided")).catch(e => this.client.logger.error("LYRICS_CMD_ERR:", e));
        }
    }
    async sendLyrics(message, song) {
        const url = `https://api.lxndr.dev/lyrics?song=${encodeURI(song)}&from=disc-11`;
        await node_fetch_1.default(url)
            .then(response => response.json())
            .then(data => {
            var _a, _b, _c;
            if (data.error) {
                return message.channel.send(createEmbed_1.createEmbed("error", `Failed to fetch lyrics for **${song}**`));
            }
            let lyrics = data.lyrics;
            let albumArt = data.album_art;
            const charLength = lyrics.length;
            let cantEmbeds = 0;
            if (charLength < 2048) {
                cantEmbeds = 1;
            }
            else {
                for (let i = 2; i < 10; i++) {
                    if (charLength < 2048 * i) {
                        cantEmbeds = i;
                        break;
                    }
                }
            }
            let index = 0;
            const lyricsArr = [];
            const duration = (_c = (_b = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.queue) === null || _b === void 0 ? void 0 : _b.songs.first()) === null || _c === void 0 ? void 0 : _c.duration;
            if (!albumArt)
                albumArt = "https://api.zhycorp.net/assets/images/logo.png";
            lyricsArr.push([lyrics.substring(0, 2047)]);
            const embed = createEmbed_1.createEmbed("info")
                .setAuthor(song.toUpperCase()).setThumbnail(albumArt)
                .setDescription(lyricsArr[index].toString())
                .setFooter(`Lyrics page 1 of ${cantEmbeds}`, "https://raw.githubusercontent.com/zhycorp/disc-11/main/.github/images/info.png");
            lyrics = lyrics.replace(lyrics.substring(0, 2047), "");
            for (let i = 2; i <= cantEmbeds; i++) {
                lyricsArr.push([lyrics.substring(0, 2047)]);
                lyrics = lyrics.replace(lyrics.substring(0, 2048), "");
            }
            if (cantEmbeds > 1) {
                message.channel.send(embed).then(async (msg) => {
                    await msg.react("◀️");
                    await msg.react("▶️");
                    const filter = (reaction, user) => { var _a; return (reaction.emoji.name === "◀️" || reaction.emoji.name === "▶️") && user.id !== ((_a = msg.client.user) === null || _a === void 0 ? void 0 : _a.id); };
                    const collector = msg.createReactionCollector(filter, {
                        time: (duration > 0) && (duration !== undefined) ? duration : 60000
                    });
                    collector.on("collect", (reaction, user) => {
                        switch (reaction.emoji.name) {
                            case "◀️":
                                reaction.users.remove(user).catch(e => this.client.logger.error("LYRICS_CMD_ERR:", e));
                                if (index === 0)
                                    return undefined;
                                index--;
                                embed.setDescription(lyricsArr[index].toString()).setFooter(`Lyrics page ${index + 1} of ${lyricsArr.length}`, "https://raw.githubusercontent.com/zhycorp/disc-11/main/.github/images/info.png");
                                msg.edit(embed).catch(e => this.client.logger.error("LYRICS_CMD_ERR:", e));
                                break;
                            case "▶️":
                                reaction.users.remove(user).catch(e => this.client.logger.error("LYRICS_CMD_ERR:", e));
                                if (index + 1 === lyricsArr.length)
                                    return undefined;
                                index++;
                                embed.setDescription(lyricsArr[index]).setFooter(`Lyrics page ${index + 1} of ${lyricsArr.length}`, "https://raw.githubusercontent.com/zhycorp/disc-11/main/.github/images/info.png");
                                msg.edit(embed).catch(e => this.client.logger.error("LYRICS_CMD_ERR:", e));
                                break;
                            default:
                                reaction.users.remove(user).catch(e => this.client.logger.error("LYRICS_CMD_ERR:", e));
                                break;
                        }
                    });
                    collector.on("end", () => {
                        msg.reactions.removeAll().catch(e => this.client.logger.error("LYRICS_CMD_ERR:", e));
                    });
                }).catch(e => this.client.logger.error("LYRICS_CMD_ERR:", e));
            }
            else {
                message.channel.send(embed.setDescription(lyricsArr[index])).catch(e => this.client.logger.error("LYRICS_CMD_ERR:", e));
            }
        })
            .catch(e => this.client.logger.error("LYRICS_CMD_ERR:", e));
        return undefined;
    }
};
LyricsCommand = tslib_1.__decorate([
    DefineCommand_1.DefineCommand({
        aliases: ["ly"],
        description: "Get lyrics from the current music",
        name: "lyrics",
        usage: "{prefix}lyrics"
    })
], LyricsCommand);
exports.LyricsCommand = LyricsCommand;
