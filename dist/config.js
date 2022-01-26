"use strict";
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
Object.defineProperty(exports, "__esModule", { value: true });
exports.status = exports.fetchAllUsers = exports.debug = exports.disableInviteCmd = exports.cacheMaxLengthAllowed = exports.cacheYoutubeDownloads = exports.deleteQueueTimeout = exports.allowDuplicate = exports.selectTimeout = exports.searchMaxResults = exports.disableSongSelection = exports.maxVolume = exports.defaultVolume = exports.totalShards = exports.YouTubeDataRetrievingStrategy = exports.owners = exports.embedColor = exports.prefix = void 0;
// NOTE: Remove this when V5 is released. ///////////////////////////////////////////////////////////
if (!process.env.SECRET_DISCORD_TOKEN)
    process.env.SECRET_DISCORD_TOKEN = process.env.DISCORD_TOKEN;
if (!process.env.SECRET_YT_API_KEY)
    process.env.SECRET_YT_API_KEY = process.env.YT_API_KEY;
// //////////////////////////////////////////////////////////////////////////////////////////////////
exports.prefix = (_b = (_a = process.env.CONFIG_PREFIX) === null || _a === void 0 ? void 0 : _a.replace(/"/g, "")) !== null && _b !== void 0 ? _b : "!"; // Temporary workaround for https://github.com/docker/compose/issues/6951
exports.embedColor = (_d = (_c = process.env.CONFIG_EMBED_COLOR) === null || _c === void 0 ? void 0 : _c.toUpperCase()) !== null && _d !== void 0 ? _d : "7289DA";
exports.owners = (_f = (_e = process.env.CONFIG_OWNERS) === null || _e === void 0 ? void 0 : _e.replace(/  +/g, " ").split(/,[ ]?/)) !== null && _f !== void 0 ? _f : [];
exports.YouTubeDataRetrievingStrategy = (_h = (_g = process.env.CONFIG_YOUTUBE_DATA_STRATEGY) === null || _g === void 0 ? void 0 : _g.toLowerCase()) !== null && _h !== void 0 ? _h : "scrape";
exports.totalShards = (_k = (_j = process.env.CONFIG_TOTALSHARDS) === null || _j === void 0 ? void 0 : _j.toLowerCase()) !== null && _k !== void 0 ? _k : "auto";
exports.defaultVolume = Number(process.env.CONFIG_DEFAULT_VOLUME) || 50;
exports.maxVolume = Number(process.env.CONFIG_MAX_VOLUME) || 100;
exports.disableSongSelection = ((_l = process.env.CONFIG_DISABLE_SONG_SELECTION) === null || _l === void 0 ? void 0 : _l.toLowerCase()) === "yes";
exports.searchMaxResults = Number(process.env.CONFIG_SEARCH_MAX_RESULTS) || 10;
exports.selectTimeout = Number(process.env.CONFIG_SELECT_TIMEOUT) * 1000 || 20 * 1000;
exports.allowDuplicate = ((_m = process.env.CONFIG_ALLOW_DUPLICATE) === null || _m === void 0 ? void 0 : _m.toLowerCase()) === "yes";
exports.deleteQueueTimeout = Number(process.env.CONFIG_DELETE_QUEUE_TIMEOUT) * 1000 || 180 * 1000;
exports.cacheYoutubeDownloads = ((_o = process.env.CONFIG_CACHE_YOUTUBE_DOWNLOADS) === null || _o === void 0 ? void 0 : _o.toLowerCase()) === "yes";
exports.cacheMaxLengthAllowed = Number(process.env.CONFIG_CACHE_MAX_LENGTH) || 5400;
exports.disableInviteCmd = ((_p = process.env.CONFIG_DISABLE_INVITE_CMD) === null || _p === void 0 ? void 0 : _p.toLowerCase()) === "yes";
exports.debug = ((_q = process.env.CONFIG_DEBUG) === null || _q === void 0 ? void 0 : _q.toLowerCase()) === "yes";
exports.fetchAllUsers = ((_r = process.env.CONFIG_FETCH_ALL_USERS) === null || _r === void 0 ? void 0 : _r.toLowerCase()) === "yes";
exports.status = {
    type: (_t = (_s = process.env.STATUS_TYPE) === null || _s === void 0 ? void 0 : _s.toUpperCase()) !== null && _t !== void 0 ? _t : "PLAYING",
    activity: (_u = process.env.CONFIG_STATUS_ACTIVITY) !== null && _u !== void 0 ? _u : ".help for commands"
};
if (exports.searchMaxResults < 1)
    throw new Error("CONFIG_SEARCH_MAX_RESULTS cannot be smaller than 1");
if (exports.searchMaxResults > 12)
    throw new Error("CONFIG_SEARCH_MAX_RESULTS cannot be higher than 12");
if (exports.totalShards !== "auto" && isNaN(exports.totalShards))
    throw new Error("CONFIG_TOTALSHARDS must be a number or \"auto\"");
if (!["scrape", "api"].includes(exports.YouTubeDataRetrievingStrategy))
    throw new Error("CONFIG_YOUTUBE_DATA_STRATEGY must be scrape or api");
