"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PauseCommand = void 0;
const tslib_1 = require("tslib");
const MusicHelper_1 = require("../utils/decorators/MusicHelper");
const DefineCommand_1 = require("../utils/decorators/DefineCommand");
const BaseCommand_1 = require("../structures/BaseCommand");
const createEmbed_1 = require("../utils/createEmbed");
let PauseCommand = class PauseCommand extends BaseCommand_1.BaseCommand {
    execute(message) {
        var _a, _b, _c;
        if ((_b = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.queue) === null || _b === void 0 ? void 0 : _b.playing) {
            message.guild.queue.playing = false;
            (_c = message.guild.queue.connection) === null || _c === void 0 ? void 0 : _c.dispatcher.pause();
            return message.channel.send(createEmbed_1.createEmbed("info", "⏸ **|** The music player has been paused"));
        }
        message.channel.send(createEmbed_1.createEmbed("error", "The music player is already paused"))
            .catch(e => this.client.logger.error("PAUSE_CMD_ERR:", e));
    }
};
tslib_1.__decorate([
    MusicHelper_1.isUserInTheVoiceChannel(),
    MusicHelper_1.isMusicPlaying(),
    MusicHelper_1.isSameVoiceChannel(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], PauseCommand.prototype, "execute", null);
PauseCommand = tslib_1.__decorate([
    DefineCommand_1.DefineCommand({
        description: "Pause the music player",
        name: "pause",
        usage: "{prefix}pause"
    })
], PauseCommand);
exports.PauseCommand = PauseCommand;
