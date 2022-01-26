"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playlist = void 0;
const Video_1 = require("./Video");
class Playlist {
    constructor(yt, raw) {
        this.yt = yt;
        this.raw = raw;
        this.id = raw.id;
        this.url = `https://youtube.com/playlist?vlist=${this.id}`;
        this.title = raw.snippet.title;
        this.description = raw.snippet.description;
        this.channel = {
            id: raw.snippet.channelId,
            name: raw.snippet.channelTitle,
            url: `https://www.youtube.com/channel/${raw.snippet.channelId}`
        };
        this.thumbnails = raw.snippet.thumbnails;
        this.itemCount = raw.contentDetails.itemCount;
        this.privacyStatus = raw.status.privacyStatus;
        this.createdAt = new Date(raw.snippet.publishedAt);
    }
    async getVideos() {
        const videos = await this.yt.makePaginatedRequest("playlistItems", { maxResults: 50, playlistId: this.id }, this.itemCount);
        return videos.map((i) => new Video_1.Video(this.yt, i, "playlistItem"));
    }
    get thumbnailURL() {
        var _a, _b, _c, _d;
        if (Object.keys(this.thumbnails).length === 0)
            return null;
        return ((_d = (_c = (_b = (_a = this.thumbnails.maxres) !== null && _a !== void 0 ? _a : this.thumbnails.high) !== null && _b !== void 0 ? _b : this.thumbnails.medium) !== null && _c !== void 0 ? _c : this.thumbnails.standard) !== null && _d !== void 0 ? _d : this.thumbnails.default).url;
    }
}
exports.Playlist = Playlist;
