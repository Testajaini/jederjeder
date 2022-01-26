"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Video = void 0;
const tslib_1 = require("tslib");
const Item_1 = require("./Item");
const parse_ms_1 = tslib_1.__importDefault(require("parse-ms"));
class Video extends Item_1.Item {
    constructor(rawData, type) {
        super(rawData, type);
        this.rawData = rawData;
        this.type = type;
        this.channel = {
            id: type === "api"
                ? rawData.channel.id
                : type === "scrape"
                    ? rawData.author.channelID
                    : rawData.videoDetails.author.id,
            name: type === "api"
                ? rawData.channel.name
                : type === "scrape"
                    ? rawData.author.name
                    : rawData.videoDetails.author.name,
            url: type === "api"
                ? rawData.channel.url
                : type === "scrape"
                    ? rawData.author.url
                    : rawData.videoDetails.author.name
        };
        // TODO: API Should always fetch Videos
        this.duration = type === "api"
            ? rawData.durationMS
                ? parse_ms_1.default(rawData.durationMS)
                : null
            : type === "scrape"
                ? parse_ms_1.default(this.durationToMS(rawData.duration))
                : parse_ms_1.default(Number(rawData.videoDetails.lengthSeconds) * 1000);
        this.isPrivate = type === "api" ? rawData.status.privacyStatus === "private" : false;
        this.thumbnailURL = type === "api"
            ? rawData.thumbnailURL
            : type === "scrape"
                ? rawData.bestThumbnail.url
                : rawData.videoDetails.thumbnails[rawData.videoDetails.thumbnails.length - 1].url;
    }
    durationToMS(duration) {
        const args = duration.split(":");
        let dur = 0;
        switch (args.length) {
            case 3:
                dur = ((parseInt(args[0]) * 60) * 60) * ((1000 + parseInt(args[1])) * 60) * (1000 + parseInt(args[2])) * 1000;
                break;
            case 2:
                dur = (parseInt(args[0]) * 60) * (1000 + (parseInt(args[1]) * 1000));
                break;
            default:
                dur = parseInt(args[0]) * 1000;
        }
        return dur;
    }
}
exports.Video = Video;
