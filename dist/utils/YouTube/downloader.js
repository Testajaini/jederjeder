"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playMusic = exports.downloadMusic = exports.getMusicInfo = void 0;
const fs_1 = require("fs");
const ytdl_core_1 = require("ytdl-core");
const path_1 = require("path");
// 1048576 * 1 = 1MB
const defaultOptions = { quality: "highestaudio", highWaterMark: 1048576 * 32 };
function getMusicInfo(link, options = defaultOptions) {
    return new Promise((resolve, reject) => {
        ytdl_core_1.getInfo(link).then(info => {
            const canSkipFFmpeg = info.formats.find(filter) !== undefined && options.skipFFmpeg === true;
            return resolve({ ...info, canSkipFFmpeg });
        }).catch(reject);
    });
}
exports.getMusicInfo = getMusicInfo;
function downloadMusic(info, options = defaultOptions) {
    options = info.canSkipFFmpeg ? { ...options, filter } : { ...options };
    return Object.assign(ytdl_core_1.downloadFromInfo(info, options), { info });
}
exports.downloadMusic = downloadMusic;
function playMusic(link, options = defaultOptions) {
    return new Promise((resolve, reject) => {
        getMusicInfo(link, options).then(info => {
            const stream = downloadMusic(info, options)
                .on("error", reject);
            if (options.cache && !info.videoDetails.isLiveContent && !(Number(info.videoDetails.lengthSeconds) >= options.cacheMaxLength)) {
                const cachePath = path_1.resolve(process.cwd(), "cache");
                const filePath = path_1.resolve(cachePath, `${info.videoDetails.videoId}.webm`);
                const finishMarkerPath = path_1.resolve(cachePath, `${filePath}.jukeboxCacheFinish.marker`);
                if (fs_1.existsSync(filePath) && fs_1.existsSync(finishMarkerPath)) {
                    const fileStream = fs_1.createReadStream(filePath)
                        .on("error", reject);
                    stream.destroy();
                    return resolve(Object.assign(fileStream, { info: stream.info, cache: true }));
                }
                cache(stream, filePath, finishMarkerPath).then(stream => resolve(Object.assign(stream, { cache: false }))).catch(reject);
            }
            return resolve(Object.assign(stream, { cache: false }));
        }).catch(reject);
    });
}
exports.playMusic = playMusic;
function cache(stream, filePath, finishMarkerPath) {
    return new Promise((resolve, reject) => {
        const cacheStream = fs_1.createWriteStream(filePath, { flags: "w" })
            .on("pipe", () => fs_1.unlinkSync(finishMarkerPath))
            .on("finish", () => fs_1.appendFileSync(finishMarkerPath, ""))
            .on("error", reject);
        stream.pipe(cacheStream);
        stream.on("error", reject);
        return resolve(Object.assign(stream, { info: stream.info }));
    });
}
function filter(f) {
    return f.hasAudio && f.codecs === "opus" && f.container === "webm" && Number(f.audioSampleRate) === 48000;
}
