"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveCommand = void 0;
const tslib_1 = require("tslib");
const MusicHelper_1 = require("../utils/decorators/MusicHelper");
const DefineCommand_1 = require("../utils/decorators/DefineCommand");
const BaseCommand_1 = require("../structures/BaseCommand");
const createEmbed_1 = require("../utils/createEmbed");
let RemoveCommand = class RemoveCommand extends BaseCommand_1.BaseCommand {
    execute(message, args) {
        var _a, _b, _c, _d, _e, _f, _g;
        if (isNaN(Number(args[0])))
            return message.channel.send(createEmbed_1.createEmbed("error", `Invalid usage, use **\`${this.client.config.prefix}help ${this.meta.name}\`** for more information`));
        const songs = message.guild.queue.songs.map(s => s);
        const currentSong = message.guild.queue.songs.first();
        const song = songs[Number(args[0]) - 1];
        if (currentSong.id === song.id) {
            message.guild.queue.playing = true;
            (_c = (_b = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.queue) === null || _b === void 0 ? void 0 : _b.connection) === null || _c === void 0 ? void 0 : _c.dispatcher.once("speaking", () => { var _a, _b, _c; return (_c = (_b = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.queue) === null || _b === void 0 ? void 0 : _b.connection) === null || _c === void 0 ? void 0 : _c.dispatcher.end(); });
            (_e = (_d = message.guild.queue) === null || _d === void 0 ? void 0 : _d.connection) === null || _e === void 0 ? void 0 : _e.dispatcher.resume();
        }
        else {
            (_g = (_f = message.guild) === null || _f === void 0 ? void 0 : _f.queue) === null || _g === void 0 ? void 0 : _g.songs.delete(message.guild.queue.songs.findKey(x => x.id === song.id));
        }
        message.channel.send(createEmbed_1.createEmbed("info", `✅ Removed **[${song.title}](${song.url}})**`)
            .setThumbnail(song.thumbnail)).catch(e => this.client.logger.error("REMOVE_COMMAND_ERR:", e));
    }
};
tslib_1.__decorate([
    MusicHelper_1.isMusicPlaying(),
    MusicHelper_1.isUserInTheVoiceChannel(),
    MusicHelper_1.isSameVoiceChannel(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Array]),
    tslib_1.__metadata("design:returntype", Object)
], RemoveCommand.prototype, "execute", null);
RemoveCommand = tslib_1.__decorate([
    DefineCommand_1.DefineCommand({
        aliases: ["rm", "delete"],
        description: "Remove a song from the current queue",
        name: "remove",
        usage: "{prefix}remove <Song number>"
    })
], RemoveCommand);
exports.RemoveCommand = RemoveCommand;
