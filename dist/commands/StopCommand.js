"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StopCommand = void 0;
const tslib_1 = require("tslib");
const MusicHelper_1 = require("../utils/decorators/MusicHelper");
const DefineCommand_1 = require("../utils/decorators/DefineCommand");
const BaseCommand_1 = require("../structures/BaseCommand");
const createEmbed_1 = require("../utils/createEmbed");
let StopCommand = class StopCommand extends BaseCommand_1.BaseCommand {
    execute(message) {
        var _a, _b, _c, _d, _e;
        if (message.guild.queue.lastMusicMessageID !== null)
            (_a = message.guild.queue.textChannel) === null || _a === void 0 ? void 0 : _a.messages.fetch(message.guild.queue.lastMusicMessageID, false).then(m => m.delete()).catch(e => this.client.logger.error("PLAY_ERR:", e));
        if (message.guild.queue.lastVoiceStateUpdateMessageID !== null)
            (_b = message.guild.queue.textChannel) === null || _b === void 0 ? void 0 : _b.messages.fetch(message.guild.queue.lastVoiceStateUpdateMessageID, false).then(m => m.delete()).catch(e => this.client.logger.error("PLAY_ERR:", e));
        (_e = (_d = (_c = message.guild) === null || _c === void 0 ? void 0 : _c.queue) === null || _d === void 0 ? void 0 : _d.voiceChannel) === null || _e === void 0 ? void 0 : _e.leave();
        message.guild.queue = null;
        message.channel.send(createEmbed_1.createEmbed("info", "⏹ **|** The music player has been stopped"))
            .catch(e => this.client.logger.error("STOP_CMD_ERR:", e));
    }
};
tslib_1.__decorate([
    MusicHelper_1.isUserInTheVoiceChannel(),
    MusicHelper_1.isMusicPlaying(),
    MusicHelper_1.isSameVoiceChannel(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], StopCommand.prototype, "execute", null);
StopCommand = tslib_1.__decorate([
    DefineCommand_1.DefineCommand({
        aliases: ["st", "disconnect", "dc"],
        description: "Stop the music player",
        name: "stop",
        usage: "{prefix}stop"
    })
], StopCommand);
exports.StopCommand = StopCommand;
