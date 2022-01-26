"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NowPlayingCommand = void 0;
const tslib_1 = require("tslib");
const DefineCommand_1 = require("../utils/decorators/DefineCommand");
const MusicHelper_1 = require("../utils/decorators/MusicHelper");
const BaseCommand_1 = require("../structures/BaseCommand");
const createEmbed_1 = require("../utils/createEmbed");
let NowPlayingCommand = class NowPlayingCommand extends BaseCommand_1.BaseCommand {
    execute(message) {
        var _a, _b, _c, _d;
        const song = (_b = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.queue) === null || _b === void 0 ? void 0 : _b.songs.first();
        return message.channel.send(createEmbed_1.createEmbed("info", `${((_d = (_c = message.guild) === null || _c === void 0 ? void 0 : _c.queue) === null || _d === void 0 ? void 0 : _d.playing) ? "▶ **|** SEDANG MEMUTAR:" : "⏸ **|** Now Playing:"} ` +
            `**[${song === null || song === void 0 ? void 0 : song.title}](${song === null || song === void 0 ? void 0 : song.url})**`)
            .setThumbnail(song === null || song === void 0 ? void 0 : song.thumbnail));
    }
};
tslib_1.__decorate([
    MusicHelper_1.isMusicPlaying(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], NowPlayingCommand.prototype, "execute", null);
NowPlayingCommand = tslib_1.__decorate([
    DefineCommand_1.DefineCommand({
        aliases: ["np", "now-playing"],
        description: "Send information about current music player",
        name: "nowplaying",
        usage: "{prefix}nowplaying"
    })
], NowPlayingCommand);
exports.NowPlayingCommand = NowPlayingCommand;
