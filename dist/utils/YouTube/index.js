"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YouTube = void 0;
const tslib_1 = require("tslib");
const downloader_1 = require("./downloader");
const Playlist_1 = require("./structures/Playlist");
const YouTubeAPI_1 = require("./utils/YouTubeAPI");
const Video_1 = require("./structures/Video");
const ytsr_1 = tslib_1.__importDefault(require("ytsr"));
const ytpl_1 = tslib_1.__importDefault(require("ytpl"));
class YouTube {
    constructor(mode, apiKey) {
        this.mode = mode;
        this.apiKey = apiKey;
        Object.defineProperty(this, "apiKey", {
            enumerable: false,
            writable: false
        });
        if (mode === "api") {
            if (!apiKey)
                throw new Error("Missing API Key for mode: api");
            this.engine = new YouTubeAPI_1.YoutubeAPI(apiKey);
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        }
        else if (mode === "scrape") {
            this.engine = {
                search: ytsr_1.default,
                playlist: ytpl_1.default,
                getVideo: downloader_1.getMusicInfo
            };
        }
        else {
            throw new Error("Unknown mode, available modes are 'api' and 'scrape'");
        }
    }
    downloadVideo(link, options) {
        return downloader_1.playMusic(link, options);
    }
    async getVideo(id) {
        let data;
        if (this.mode === "api")
            data = await this.engine.getVideo(id);
        if (this.mode === "scrape")
            data = (await this.engine.getVideo(`https://youtube.com/watch?v=${id}`));
        if (data === undefined)
            throw new Error("I could not get any data");
        return new Video_1.Video(data, this.mode === "scrape" ? "ytdl-core" : "api");
    }
    async getPlaylist(id) {
        let data;
        if (this.mode === "api")
            data = await this.engine.getPlaylist(id);
        if (this.mode === "scrape")
            data = (await this.engine.playlist(id, { limit: Infinity }));
        if (data === undefined)
            throw new Error("I could not get any data");
        return new Playlist_1.Playlist(data, this.mode);
    }
    async searchVideos(query, maxResults = 5) {
        let data;
        if (this.mode === "api")
            data = await this.engine.searchVideos(query, maxResults);
        if (this.mode === "scrape")
            data = (await this.engine.search(query, { limit: maxResults, safeSearch: false })).items;
        if (data === undefined)
            throw new Error("I could not get any data");
        // @ts-expect-error Error is expected
        return data.filter((x) => {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (this.mode === "scrape")
                return x.type === "video";
            return true;
        }).map((i) => new Video_1.Video(i, this.mode));
    }
}
exports.YouTube = YouTube;
