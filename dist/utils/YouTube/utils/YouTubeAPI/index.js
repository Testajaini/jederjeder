"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeAPI = void 0;
const tslib_1 = require("tslib");
const Playlist_1 = require("./structures/Playlist");
const Video_1 = require("./structures/Video");
const url_1 = require("url");
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
class YoutubeAPI {
    constructor(key) {
        this.key = key;
        this.baseURL = "https://www.googleapis.com/youtube/v3/";
        Object.defineProperty(this, "key", {
            enumerable: false,
            writable: false
        });
    }
    async getVideo(id) {
        const raw = await this.makeRequest("videos", { id, maxResults: 1 });
        return new Video_1.Video(this, await raw.items[0]);
    }
    getVideoByURL(url) {
        const id = new url_1.URL(url).searchParams.get("v");
        return this.getVideo(id);
    }
    async getPlaylist(id) {
        const raw = await this.makeRequest("playlists", { id, maxResults: 1 });
        return new Playlist_1.Playlist(this, raw.items[0]);
    }
    getPlaylistByURL(url) {
        const id = new url_1.URL(url).searchParams.get("list");
        return this.getPlaylist(id);
    }
    makeRequest(endpoint, searchParams) {
        const URI = new url_1.URL(endpoint, this.baseURL);
        URI.search = new url_1.URLSearchParams(Object.assign({ key: this.key, part: "snippet,id,status,contentDetails" }, searchParams)).toString();
        return node_fetch_1.default(URI)
            .then(res => res.json())
            .then(res => {
            if (res.error)
                return Promise.reject(res.error);
            return res;
        })
            .catch(e => Promise.reject(e));
    }
    makePaginatedRequest(endpoint, searchParams = {}, count = Infinity, fetched = [], pageToken = "") {
        if (count < 1)
            return Promise.reject(new Error("Cannot fetch less than 1."));
        const limit = count > 50 ? 50 : count;
        return this.makeRequest(endpoint, Object.assign(searchParams, { pageToken, maxResults: limit })).then(result => {
            const results = fetched.concat(result.items);
            if (result.nextPageToken && limit !== count)
                return this.makePaginatedRequest(endpoint, searchParams, count - limit, results, result.nextPageToken);
            return results;
        });
    }
    async searchVideos(q, maxResults = 5) {
        const videos = await this.makePaginatedRequest("search", { maxResults, part: "snippet", q, safeSearch: "none", type: "video" }, maxResults);
        return videos.map((i) => new Video_1.Video(this, i, "searchResults"));
    }
}
exports.YoutubeAPI = YoutubeAPI;
