"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SongManager = void 0;
const discord_js_1 = require("discord.js");
class SongManager extends discord_js_1.Collection {
    constructor(data) {
        super(data);
    }
    addSong(song) {
        return this.set(discord_js_1.SnowflakeUtil.generate(), song);
    }
    deleteFirst() {
        return this.delete(this.firstKey());
    }
    clear() {
        this.forEach((v, k) => {
            this.delete(k);
        });
        return this;
    }
}
exports.SongManager = SongManager;
