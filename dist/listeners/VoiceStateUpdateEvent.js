"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceStateUpdateEvent = void 0;
const tslib_1 = require("tslib");
const DefineListener_1 = require("../utils/decorators/DefineListener");
const BaseListener_1 = require("../structures/BaseListener");
const createEmbed_1 = require("../utils/createEmbed");
const formatMS_1 = require("../utils/formatMS");
const semver_1 = require("semver");
let VoiceStateUpdateEvent = class VoiceStateUpdateEvent extends BaseListener_1.BaseListener {
    execute(oldState, newState) {
        var _a, _b, _c, _d;
        const queue = newState.guild.queue;
        if (!queue)
            return undefined;
        const newVC = newState.channel;
        const oldVC = oldState.channel;
        const oldID = oldVC === null || oldVC === void 0 ? void 0 : oldVC.id;
        const newID = newVC === null || newVC === void 0 ? void 0 : newVC.id;
        const queueVC = queue.voiceChannel;
        const oldMember = oldState.member;
        const member = newState.member;
        const queueVCMembers = queueVC.members.filter(m => !m.user.bot);
        const newVCMembers = newVC === null || newVC === void 0 ? void 0 : newVC.members.filter(m => !m.user.bot);
        const botID = (_a = this.client.user) === null || _a === void 0 ? void 0 : _a.id;
        // Handle when bot gets kicked from the voice channel
        if ((oldMember === null || oldMember === void 0 ? void 0 : oldMember.id) === botID && oldID === queueVC.id && newID === undefined) {
            try {
                if (queue.lastMusicMessageID !== null)
                    (_b = queue.textChannel) === null || _b === void 0 ? void 0 : _b.messages.fetch(queue.lastMusicMessageID, false).then(m => m.delete()).catch(e => this.client.logger.error("VOICE_STATE_UPDATE_EVENT_ERR:", e));
                if (queue.lastVoiceStateUpdateMessageID !== null)
                    (_c = queue.textChannel) === null || _c === void 0 ? void 0 : _c.messages.fetch(queue.lastVoiceStateUpdateMessageID, false).then(m => m.delete()).catch(e => this.client.logger.error("VOICE_STATE_UPDATE_EVENT_ERR:", e));
                this.client.logger.info(`${this.client.shard ? `[Shard #${this.client.shard.ids[0]}]` : ""} Disconnected from the voice channel at ${newState.guild.name}, the queue has been deleted.`);
                (_d = queue.textChannel) === null || _d === void 0 ? void 0 : _d.send(createEmbed_1.createEmbed("error", "I was disconnected from the voice channel, the queue has been deleted.")).catch(e => this.client.logger.error("VOICE_STATE_UPDATE_EVENT_ERR:", e));
                return newState.guild.queue = null;
            }
            catch (e) {
                this.client.logger.error("VOICE_STATE_UPDATE_EVENT_ERR:", e);
            }
        }
        if (newState.mute !== oldState.mute || newState.deaf !== oldState.deaf)
            return undefined;
        // Handle when the bot is moved to another voice channel
        if ((member === null || member === void 0 ? void 0 : member.id) === botID && oldID === queueVC.id && newID !== queueVC.id && newID !== undefined) {
            if (!newVCMembers)
                return undefined;
            if (newVCMembers.size === 0 && queue.timeout === null)
                this.doTimeout(newVCMembers, queue, newState);
            else if (newVCMembers.size !== 0 && queue.timeout !== null)
                this.resumeTimeout(newVCMembers, queue, newState);
            newState.guild.queue.voiceChannel = newVC;
        }
        // Handle when user leaves voice channel
        if (oldID === queueVC.id && newID !== queueVC.id && !(member === null || member === void 0 ? void 0 : member.user.bot) && queue.timeout === null)
            this.doTimeout(queueVCMembers, queue, newState);
        // Handle when user joins voice channel or bot gets moved
        if (newID === queueVC.id && !(member === null || member === void 0 ? void 0 : member.user.bot))
            this.resumeTimeout(queueVCMembers, queue, newState);
    }
    doTimeout(vcMembers, queue, newState) {
        var _a, _b, _c;
        try {
            if (vcMembers.size !== 0)
                return undefined;
            clearTimeout(queue.timeout);
            newState.guild.queue.timeout = null;
            newState.guild.queue.playing = false;
            (_a = queue.connection) === null || _a === void 0 ? void 0 : _a.dispatcher.pause();
            const timeout = this.client.config.deleteQueueTimeout;
            const duration = formatMS_1.formatMS(timeout);
            if (queue.lastVoiceStateUpdateMessageID !== null)
                (_b = queue.textChannel) === null || _b === void 0 ? void 0 : _b.messages.fetch(queue.lastVoiceStateUpdateMessageID, false).then(m => m.delete()).catch(e => this.client.logger.error("VOICE_STATE_UPDATE_EVENT_ERR:", e));
            newState.guild.queue.timeout = setTimeout(() => {
                var _a, _b, _c, _d;
                (_a = queue.voiceChannel) === null || _a === void 0 ? void 0 : _a.leave();
                newState.guild.queue = null;
                if (queue.lastMusicMessageID !== null)
                    (_b = queue.textChannel) === null || _b === void 0 ? void 0 : _b.messages.fetch(queue.lastMusicMessageID, false).then(m => m.delete()).catch(e => this.client.logger.error("VOICE_STATE_UPDATE_EVENT_ERR:", e));
                if (queue.lastVoiceStateUpdateMessageID !== null)
                    (_c = queue.textChannel) === null || _c === void 0 ? void 0 : _c.messages.fetch(queue.lastVoiceStateUpdateMessageID, false).then(m => m.delete()).catch(e => this.client.logger.error("VOICE_STATE_UPDATE_EVENT_ERR:", e));
                (_d = queue.textChannel) === null || _d === void 0 ? void 0 : _d.send(createEmbed_1.createEmbed("error", `⏹ **|** **\`${duration}\`** have passed and there's no one who joined the voice channel, the queue has deleted.`)
                    .setTitle("Queue Deleted")).catch(e => this.client.logger.error("VOICE_STATE_UPDATE_EVENT_ERR:", e));
            }, timeout);
            (_c = queue.textChannel) === null || _c === void 0 ? void 0 : _c.send(createEmbed_1.createEmbed("warn", "⏸ **|** Everyone has left from the voice channel. To save resources, the queue has paused. " +
                `If there's no one who joins the voice channel in the next **\`${duration}\`**, the queue will be deleted.`)
                .setTitle("Music Player Paused")).then(m => queue.lastVoiceStateUpdateMessageID = m.id).catch(e => this.client.logger.error("VOICE_STATE_UPDATE_EVENT_ERR:", e));
        }
        catch (e) {
            this.client.logger.error("VOICE_STATE_UPDATE_EVENT_ERR:", e);
        }
    }
    resumeTimeout(vcMembers, queue, newState) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (vcMembers.size > 0) {
            if (queue.playing)
                return undefined;
            try {
                clearTimeout(queue.timeout);
                newState.guild.queue.timeout = null;
                const song = queue.songs.first();
                if (queue.lastVoiceStateUpdateMessageID !== null)
                    (_a = queue.textChannel) === null || _a === void 0 ? void 0 : _a.messages.fetch(queue.lastVoiceStateUpdateMessageID, false).then(m => m.delete()).catch(e => this.client.logger.error("VOICE_STATE_UPDATE_EVENT_ERR:", e));
                (_b = queue.textChannel) === null || _b === void 0 ? void 0 : _b.send(createEmbed_1.createEmbed("info", `▶ **|** Someone has joined the voice channel.\nNow Playing: **[${song.title}](${song.url})**`)
                    .setThumbnail(song.thumbnail)
                    .setTitle("Music Player Resumed")).then(m => queue.lastVoiceStateUpdateMessageID = m.id).catch(e => this.client.logger.error("VOICE_STATE_UPDATE_EVENT_ERR:", e));
                newState.guild.queue.playing = true;
                (_d = (_c = newState.guild.queue) === null || _c === void 0 ? void 0 : _c.connection) === null || _d === void 0 ? void 0 : _d.dispatcher.resume();
                // This will be reverted
                if (semver_1.satisfies(process.version, ">=14.17.0")) {
                    (_f = (_e = newState.guild.queue) === null || _e === void 0 ? void 0 : _e.connection) === null || _f === void 0 ? void 0 : _f.dispatcher.pause();
                    (_h = (_g = newState.guild.queue) === null || _g === void 0 ? void 0 : _g.connection) === null || _h === void 0 ? void 0 : _h.dispatcher.resume();
                }
            }
            catch (e) {
                this.client.logger.error("VOICE_STATE_UPDATE_EVENT_ERR:", e);
            }
        }
    }
};
VoiceStateUpdateEvent = tslib_1.__decorate([
    DefineListener_1.DefineListener("voiceStateUpdate")
], VoiceStateUpdateEvent);
exports.VoiceStateUpdateEvent = VoiceStateUpdateEvent;
