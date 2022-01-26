"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadyEvent = void 0;
const tslib_1 = require("tslib");
const DefineListener_1 = require("../utils/decorators/DefineListener");
const BaseListener_1 = require("../structures/BaseListener");
let ReadyEvent = class ReadyEvent extends BaseListener_1.BaseListener {
    execute() {
        this.client.logger.info(`${this.client.shard ? `[Shard #${this.client.shard.ids[0]}]` : ""} I'm ready to serve ${this.client.guilds.cache.size} guilds ` +
            `with ${this.client.channels.cache.filter(c => c.type === "text").size} text channels and ` +
            `${this.client.channels.cache.filter(c => c.type === "voice").size} voice channels`);
        this.doPresence();
    }
    doPresence() {
        this.updatePresence()
            .then(() => setInterval(() => this.updatePresence(), 30 * 1000))
            .catch(e => {
            if (e.message === "Shards are still being spawned.")
                return this.doPresence();
            this.client.logger.error("DO_PRESENCE_ERR:", e);
        });
        return undefined;
    }
    async updatePresence() {
        var _a;
        const activityName = this.client.config.status.activity
            .replace(/{guildsCount}/g, (await this.client.getGuildsCount()).toString())
            .replace(/{playingCount}/g, (await this.client.getTotalPlaying()).toString())
            .replace(/{usersCount}/g, (await this.client.getUsersCount()).toString())
            .replace(/{botPrefix}/g, this.client.config.prefix);
        return (_a = this.client.user) === null || _a === void 0 ? void 0 : _a.setPresence({
            activity: { name: activityName, type: this.client.config.status.type }
        }).catch(e => { this.client.logger.error("CLIENT_UPDATE_PRESENCE_ERR:", e); return undefined; });
    }
};
ReadyEvent = tslib_1.__decorate([
    DefineListener_1.DefineListener("ready")
], ReadyEvent);
exports.ReadyEvent = ReadyEvent;
