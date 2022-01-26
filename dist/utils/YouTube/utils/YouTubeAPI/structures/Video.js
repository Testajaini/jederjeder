"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Video = void 0;
const iso8601_duration_1 = require("iso8601-duration");
class Video {
    constructor(yt, raw, type = "video") {
        var _a;
        this.yt = yt;
        this.raw = raw;
        this.id = type === "video"
            ? raw.id
            : type === "playlistItem" ? raw.snippet.resourceId.videoId : raw.id.videoId;
        this.url = `https://youtube.com/watch?v=${this.id}`;
        this.title = raw.snippet.title;
        this.description = raw.snippet.description;
        this.channel = {
            id: raw.snippet.channelId,
            name: raw.snippet.channelTitle,
            url: `https://www.youtube.com/channel/${raw.snippet.channelId}`
        };
        this.thumbnails = raw.snippet.thumbnails;
        this.duration = ((_a = raw.contentDetails) === null || _a === void 0 ? void 0 : _a.duration) ? iso8601_duration_1.parse(raw.contentDetails.duration) : null;
        this.durationMS = this.duration ? iso8601_duration_1.toSeconds(this.duration) * 1000 : null;
        this.status = type === "searchResults" ? { privacyStatus: "public" } : raw.status;
        this.publishedAt = new Date(raw.snippet.publishedAt);
    }
    get thumbnailURL() {
        var _a, _b, _c, _d;
        if (Object.keys(this.thumbnails).length === 0)
            return null;
        return ((_d = (_c = (_b = (_a = this.thumbnails.maxres) !== null && _a !== void 0 ? _a : this.thumbnails.high) !== null && _b !== void 0 ? _b : this.thumbnails.medium) !== null && _c !== void 0 ? _c : this.thumbnails.standard) !== null && _d !== void 0 ? _d : this.thumbnails.default).url;
    }
}
exports.Video = Video;
