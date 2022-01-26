"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResumeCommand = void 0;
const tslib_1 = require("tslib");
const MusicHelper_1 = require("../utils/decorators/MusicHelper");
const DefineCommand_1 = require("../utils/decorators/DefineCommand");
const BaseCommand_1 = require("../structures/BaseCommand");
const createEmbed_1 = require("../utils/createEmbed");
const semver_1 = require("semver");
let ResumeCommand = class ResumeCommand extends BaseCommand_1.BaseCommand {
    execute(message) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        if ((_b = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.queue) === null || _b === void 0 ? void 0 : _b.playing) {
            message.channel.send(createEmbed_1.createEmbed("error", "The music player is not paused")).catch(e => this.client.logger.error("RESUME_CMD_ERR:", e));
        }
        else {
            message.guild.queue.playing = true;
            (_e = (_d = (_c = message.guild) === null || _c === void 0 ? void 0 : _c.queue) === null || _d === void 0 ? void 0 : _d.connection) === null || _e === void 0 ? void 0 : _e.dispatcher.resume();
            // This will be reverted
            if (semver_1.satisfies(process.version, ">=14.17.0")) {
                (_h = (_g = (_f = message.guild) === null || _f === void 0 ? void 0 : _f.queue) === null || _g === void 0 ? void 0 : _g.connection) === null || _h === void 0 ? void 0 : _h.dispatcher.pause();
                (_l = (_k = (_j = message.guild) === null || _j === void 0 ? void 0 : _j.queue) === null || _k === void 0 ? void 0 : _k.connection) === null || _l === void 0 ? void 0 : _l.dispatcher.resume();
            }
            message.channel.send(createEmbed_1.createEmbed("info", "▶ **|** The music player has been resumed")).catch(e => this.client.logger.error("RESUME_CMD_ERR:", e));
        }
    }
};
tslib_1.__decorate([
    MusicHelper_1.isUserInTheVoiceChannel(),
    MusicHelper_1.isMusicPlaying(),
    MusicHelper_1.isSameVoiceChannel(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], ResumeCommand.prototype, "execute", null);
ResumeCommand = tslib_1.__decorate([
    DefineCommand_1.DefineCommand({
        description: "Resume the music player",
        name: "resume",
        usage: "{prefix}resume"
    })
], ResumeCommand);
exports.ResumeCommand = ResumeCommand;
