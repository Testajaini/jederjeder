"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipCommand = void 0;
const tslib_1 = require("tslib");
const MusicHelper_1 = require("../utils/decorators/MusicHelper");
const DefineCommand_1 = require("../utils/decorators/DefineCommand");
const BaseCommand_1 = require("../structures/BaseCommand");
const createEmbed_1 = require("../utils/createEmbed");
let SkipCommand = class SkipCommand extends BaseCommand_1.BaseCommand {
    execute(message) {
        var _a, _b, _c, _d, _e, _f, _g;
        message.guild.queue.playing = true;
        (_c = (_b = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.queue) === null || _b === void 0 ? void 0 : _b.connection) === null || _c === void 0 ? void 0 : _c.dispatcher.once("speaking", () => { var _a, _b, _c; return (_c = (_b = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.queue) === null || _b === void 0 ? void 0 : _b.connection) === null || _c === void 0 ? void 0 : _c.dispatcher.end(); });
        (_e = (_d = message.guild.queue) === null || _d === void 0 ? void 0 : _d.connection) === null || _e === void 0 ? void 0 : _e.dispatcher.resume();
        const song = (_g = (_f = message.guild) === null || _f === void 0 ? void 0 : _f.queue) === null || _g === void 0 ? void 0 : _g.songs.first();
        message.channel.send(createEmbed_1.createEmbed("info", `⏭ **|** Skipped **[${song.title}](${song.url}})**`)
            .setThumbnail(song === null || song === void 0 ? void 0 : song.thumbnail)).catch(e => this.client.logger.error("SKIP_CMD_ERR:", e));
    }
};
tslib_1.__decorate([
    MusicHelper_1.isUserInTheVoiceChannel(),
    MusicHelper_1.isMusicPlaying(),
    MusicHelper_1.isSameVoiceChannel(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], SkipCommand.prototype, "execute", null);
SkipCommand = tslib_1.__decorate([
    DefineCommand_1.DefineCommand({
        aliases: ["s"],
        description: "Skip the current music",
        name: "skip",
        usage: "{prefix}skip"
    })
], SkipCommand);
exports.SkipCommand = SkipCommand;
