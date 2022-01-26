"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playlist = void 0;
const Video_1 = require("./Video");
const Item_1 = require("./Item");
class Playlist extends Item_1.Item {
    constructor(rawData, type) {
        super(rawData, type);
        this.rawData = rawData;
        this.type = type;
        this.channel = {
            id: type === "api" ? rawData.channel.id : rawData.author.channelID,
            name: type === "api" ? rawData.channel.name : rawData.author.name,
            url: type === "api" ? rawData.channel.url : rawData.author.url
        };
        this.itemCount = type === "api" ? rawData.itemCount : rawData.items.length;
        this.thumbnailURL = type === "api" ? rawData.thumbnailURL : rawData.bestThumbnail.url;
    }
    async getVideos() {
        let videos;
        if (this.type === "api")
            videos = await this.rawData.getVideos();
        else
            videos = this.rawData.items;
        return videos.map((i) => new Video_1.Video(i, this.type));
    }
}
exports.Playlist = Playlist;
