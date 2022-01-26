"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolumeCommand = void 0;
const tslib_1 = require("tslib");
const MusicHelper_1 = require("../utils/decorators/MusicHelper");
const DefineCommand_1 = require("../utils/decorators/DefineCommand");
const BaseCommand_1 = require("../structures/BaseCommand");
const createEmbed_1 = require("../utils/createEmbed");
let VolumeCommand = class VolumeCommand extends BaseCommand_1.BaseCommand {
    execute(message, args) {
        var _a;
        let volume = Number(args[0]);
        if (isNaN(volume))
            return message.channel.send(createEmbed_1.createEmbed("info", `🔊 **|** The current volume is **\`${message.guild.queue.volume.toString()}\`**`));
        if (volume < 0)
            volume = 0;
        if (volume === 0)
            return message.channel.send(createEmbed_1.createEmbed("error", "Please pause the music player instead of setting the volume to **\`0\`**"));
        if (Number(args[0]) > this.client.config.maxVolume) {
            return message.channel.send(createEmbed_1.createEmbed("error", `I can't set the volume above **\`${this.client.config.maxVolume}\`**`));
        }
        message.guild.queue.volume = Number(args[0]);
        (_a = message.guild.queue.connection) === null || _a === void 0 ? void 0 : _a.dispatcher.setVolume(Number(args[0]) / this.client.config.maxVolume);
        message.channel.send(createEmbed_1.createEmbed("info", `🔊 **|** Volume set to **\`${args[0]}\`**`)).catch(console.error);
    }
};
tslib_1.__decorate([
    MusicHelper_1.isUserInTheVoiceChannel(),
    MusicHelper_1.isMusicPlaying(),
    MusicHelper_1.isSameVoiceChannel(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Array]),
    tslib_1.__metadata("design:returntype", Object)
], VolumeCommand.prototype, "execute", null);
VolumeCommand = tslib_1.__decorate([
    DefineCommand_1.DefineCommand({
        aliases: ["vol"],
        description: "Show or change the music player's volume",
        name: "volume",
        usage: "{prefix}volume [new volume]"
    })
], VolumeCommand);
exports.VolumeCommand = VolumeCommand;
