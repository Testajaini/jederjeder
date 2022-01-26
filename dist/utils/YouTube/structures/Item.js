"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
class Item {
    constructor(rawData, type) {
        this.rawData = rawData;
        this.type = type;
        this.id = type === "ytdl-core" ? rawData.videoDetails.videoId : rawData.id;
        this.title = type === "ytdl-core" ? rawData.videoDetails.title : rawData.title;
        this.url = type === "ytdl-core" ? rawData.videoDetails.video_url : rawData.url;
    }
}
exports.Item = Item;
