"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerQueue = void 0;
const SongManager_1 = require("../utils/SongManager");
class ServerQueue {
    constructor(textChannel = null, voiceChannel = null) {
        this.textChannel = textChannel;
        this.voiceChannel = voiceChannel;
        this.connection = null;
        this.songs = new SongManager_1.SongManager();
        this.volume = 0;
        this.loopMode = 0;
        this.timeout = null;
        this._playing = false;
        this._lastMusicMessageID = null;
        this._lastvoiceStateUpdateMessageID = null;
        this.volume = textChannel.client.config.defaultVolume;
        Object.defineProperties(this, {
            _lastMusicMessageID: {
                enumerable: false
            },
            _lastvoiceStateUpdateMessageID: {
                enumerable: false
            },
            _playing: {
                enumerable: false
            },
            timeout: {
                enumerable: false
            }
        });
    }
    get playing() {
        return this._playing;
    }
    set playing(state) {
        this._playing = state;
    }
    get lastMusicMessageID() {
        return this._lastMusicMessageID;
    }
    set lastMusicMessageID(id) {
        this._lastMusicMessageID = id;
    }
    get lastVoiceStateUpdateMessageID() {
        return this._lastvoiceStateUpdateMessageID;
    }
    set lastVoiceStateUpdateMessageID(id) {
        this._lastvoiceStateUpdateMessageID = id;
    }
}
exports.ServerQueue = ServerQueue;
