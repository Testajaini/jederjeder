"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepeatCommand = void 0;
const tslib_1 = require("tslib");
/* eslint-disable sort-keys */
const MusicHelper_1 = require("../utils/decorators/MusicHelper");
const DefineCommand_1 = require("../utils/decorators/DefineCommand");
const BaseCommand_1 = require("../structures/BaseCommand");
const createEmbed_1 = require("../utils/createEmbed");
let RepeatCommand = class RepeatCommand extends BaseCommand_1.BaseCommand {
    execute(message, args) {
        const modes = {
            // Repeat All Music in Queue
            all: 2,
            queue: 2,
            "*": 2,
            2: 2,
            // Repeat current music
            current: 1,
            this: 1,
            one: 1,
            music: 1,
            1: 1,
            // Disable repeat
            disable: 0,
            none: 0,
            off: 0,
            0: 0
        };
        const modeTypes = ["OFF", "ONE", "ALL"];
        const modeEmoji = ["▶", "🔂", "🔁"];
        const mode = args[0];
        if (mode === undefined) {
            message.channel.send(createEmbed_1.createEmbed("info", `${modeEmoji[message.guild.queue.loopMode]} **|** Current repeat mode is set to **\`${modeTypes[message.guild.queue.loopMode]}\`**`))
                .catch(e => this.client.logger.error("REPEAT_CMD_ERR:", e));
        }
        else if (Object.keys(modes).includes(mode)) {
            message.guild.queue.loopMode = modes[mode];
            message.channel.send(createEmbed_1.createEmbed("info", `${modeEmoji[message.guild.queue.loopMode]} **|** The repeat mode has been set to **\`${modeTypes[message.guild.queue.loopMode]}\`**`))
                .catch(e => this.client.logger.error("REPEAT_CMD_ERR:", e));
        }
        else {
            message.channel.send(createEmbed_1.createEmbed("error", `Invalid usage, use **\`${this.client.config.prefix}help ${this.meta.name}\`** for more information`))
                .catch(e => this.client.logger.error("REPEAT_CMD_ERR:", e));
        }
    }
};
tslib_1.__decorate([
    MusicHelper_1.isUserInTheVoiceChannel(),
    MusicHelper_1.isMusicPlaying(),
    MusicHelper_1.isSameVoiceChannel(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Array]),
    tslib_1.__metadata("design:returntype", Object)
], RepeatCommand.prototype, "execute", null);
RepeatCommand = tslib_1.__decorate([
    DefineCommand_1.DefineCommand({
        aliases: ["loop", "music-repeat", "music-loop"],
        description: "Repeat current music or the queue",
        name: "repeat",
        usage: "{prefix}repeat [all | one | disable]"
    })
], RepeatCommand);
exports.RepeatCommand = RepeatCommand;
