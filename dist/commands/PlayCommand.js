"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayCommand = void 0;
const tslib_1 = require("tslib");
/* eslint-disable block-scoped-var, @typescript-eslint/restrict-template-expressions */
const MusicHelper_1 = require("../utils/decorators/MusicHelper");
const DefineCommand_1 = require("../utils/decorators/DefineCommand");
const BaseCommand_1 = require("../structures/BaseCommand");
const ServerQueue_1 = require("../structures/ServerQueue");
const createEmbed_1 = require("../utils/createEmbed");
const discord_js_1 = require("discord.js");
const entities_1 = require("entities");
let disconnectTimer;
let PlayCommand = class PlayCommand extends BaseCommand_1.BaseCommand {
    constructor() {
        super(...arguments);
        this._playlistAlreadyQueued = [];
    }
    async execute(message, args) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const voiceChannel = message.member.voice.channel;
        if (!args[0]) {
            return message.channel.send(createEmbed_1.createEmbed("error", `Invalid usage, use **\`${this.client.config.prefix}help play\`** for more information`));
        }
        const searchString = args.join(" ");
        const url = searchString.replace(/<(.+)>/g, "$1");
        if (((_a = message.guild) === null || _a === void 0 ? void 0 : _a.queue) !== null && voiceChannel.id !== ((_c = (_b = message.guild) === null || _b === void 0 ? void 0 : _b.queue.voiceChannel) === null || _c === void 0 ? void 0 : _c.id)) {
            return message.channel.send(createEmbed_1.createEmbed("warn", `The music player is already playing to **${(_e = (_d = message.guild) === null || _d === void 0 ? void 0 : _d.queue.voiceChannel) === null || _e === void 0 ? void 0 : _e.name}** voice channel`));
        }
        if (/^https?:\/\/((www|music)\.youtube\.com|youtube.com)\/playlist(.*)$/.exec(url)) {
            try {
                const id = new URL(url).searchParams.get("list");
                const playlist = await this.client.youtube.getPlaylist(id);
                const videos = await playlist.getVideos();
                let skippedVideos = 0;
                const addingPlaylistVideoMessage = await message.channel.send(createEmbed_1.createEmbed("info", `Adding all videos in **[${playlist.title}](${playlist.url})** playlist, please wait...`)
                    .setThumbnail(playlist.thumbnailURL));
                for (const video of Object.values(videos)) {
                    if (video.isPrivate) {
                        skippedVideos++;
                        continue;
                    }
                    else {
                        const video2 = await this.client.youtube.getVideo(video.id);
                        await this.handleVideo(video2, message, voiceChannel, true);
                    }
                }
                if (skippedVideos !== 0) {
                    message.channel.send(createEmbed_1.createEmbed("warn", `${skippedVideos} ${skippedVideos >= 2 ? "videos" : "video"} are skipped because it's a private video`)).catch(e => this.client.logger.error("PLAY_CMD_ERR:", e));
                }
                if (this._playlistAlreadyQueued.length !== 0) {
                    let num = 1;
                    const songs = this._playlistAlreadyQueued.map(s => `**${num++}.** **[${s.title}](${s.url})**`);
                    message.channel.send(createEmbed_1.createEmbed("warn", `Over ${this._playlistAlreadyQueued.length} ${this._playlistAlreadyQueued.length >= 2 ? "videos" : "video"} are skipped because it was a duplicate` +
                        ` and this bot configuration disallow duplicated music in queue, please use \`${this.client.config.prefix}repeat\` instead`)
                        .setTitle("Already queued / duplicate")).catch(e => this.client.logger.error("PLAY_CMD_ERR:", e));
                    const pages = this.paginate(songs.join("\n"));
                    let howManyMessage = 0;
                    for (const page of pages) {
                        howManyMessage++;
                        const embed = createEmbed_1.createEmbed(`warn`, page);
                        if (howManyMessage === 1)
                            embed.setTitle("Duplicated music");
                        await message.channel.send(embed);
                    }
                    this._playlistAlreadyQueued.splice(0, this._playlistAlreadyQueued.length);
                }
                message.channel.messages.fetch(addingPlaylistVideoMessage.id, false).then(m => m.delete()).catch(e => this.client.logger.error("YT_PLAYLIST_ERR:", e));
                if (skippedVideos === playlist.itemCount) {
                    return message.channel.send(createEmbed_1.createEmbed("error", `Failed to load playlist **[${playlist.title}](${playlist.url})** because all of the items are private videos`)
                        .setThumbnail(playlist.thumbnailURL));
                }
                return message.channel.send(createEmbed_1.createEmbed("info", `✅ **|** All videos in **[${playlist.title}](${playlist.url})** DAFTAR PUTAR TELAH DI TAMBAHKAN KE ANTRIAN`)
                    .setThumbnail(playlist.thumbnailURL));
            }
            catch (e) {
                this.client.logger.error("YT_PLAYLIST_ERR:", new Error(e.stack));
                return message.channel.send(createEmbed_1.createEmbed("error", `I could not load the playlist\nError: **\`${e.message}\`**`));
            }
        }
        try {
            const id = new URL(url).searchParams.get("v");
            // eslint-disable-next-line no-var, block-scoped-var
            var video = await this.client.youtube.getVideo(id);
        }
        catch (e) {
            try {
                const videos = await this.client.youtube.searchVideos(searchString, this.client.config.searchMaxResults);
                if (videos.length === 0)
                    return message.channel.send(createEmbed_1.createEmbed("error", "I could not obtain any search results, please try again"));
                if (this.client.config.disableSongSelection) {
                    video = await this.client.youtube.getVideo(videos[0].id);
                }
                else {
                    let index = 0;
                    const msg = await message.channel.send(new discord_js_1.MessageEmbed()
                        .setColor(this.client.config.embedColor)
                        .setAuthor("Music Selection", (_f = message.client.user) === null || _f === void 0 ? void 0 : _f.displayAvatarURL())
                        .setDescription(`\`\`\`${videos.map(video => `${++index} - ${this.cleanTitle(video.title)}`).join("\n")}\`\`\`` +
                        "\nPlease select one of the results ranging from **\`1-10\`**")
                        .setFooter("• Type cancel or c to cancel the music selection"));
                    try {
                        // eslint-disable-next-line no-var
                        var response = await message.channel.awaitMessages((msg2) => {
                            if (message.author.id !== msg2.author.id)
                                return false;
                            if (msg2.content === "cancel" || msg2.content === "c")
                                return true;
                            return Number(msg2.content) > 0 && Number(msg2.content) < 13;
                        }, {
                            max: 1,
                            time: this.client.config.selectTimeout,
                            errors: ["time"]
                        });
                        msg.delete().catch(e => this.client.logger.error("PLAY_CMD_ERR:", e));
                        (_g = response.first()) === null || _g === void 0 ? void 0 : _g.delete({ timeout: 3000 }).catch(e => e);
                    }
                    catch (error) {
                        msg.delete().catch(e => this.client.logger.error("PLAY_CMD_ERR:", e));
                        return message.channel.send(createEmbed_1.createEmbed("error", "None or invalid value entered, the music selection has canceled"));
                    }
                    if (((_h = response.first()) === null || _h === void 0 ? void 0 : _h.content) === "c" || ((_j = response.first()) === null || _j === void 0 ? void 0 : _j.content) === "cancel") {
                        return message.channel.send(createEmbed_1.createEmbed("warn", "The music selection has canceled"));
                    }
                    const videoIndex = parseInt((_k = response.first()) === null || _k === void 0 ? void 0 : _k.content);
                    video = await this.client.youtube.getVideo(videos[videoIndex - 1].id);
                }
            }
            catch (err) {
                this.client.logger.error("YT_SEARCH_ERR:", err);
                return message.channel.send(createEmbed_1.createEmbed("error", `I could not obtain any search results\nError: **\`${err.message}\`**`));
            }
        }
        return this.handleVideo(video, message, voiceChannel);
    }
    async handleVideo(video, message, voiceChannel, playlist = false) {
        var _a, _b, _c;
        const song = {
            duration: this.milDuration(video.duration),
            id: video.id,
            thumbnail: video.thumbnailURL,
            title: this.cleanTitle(video.title),
            url: video.url
        };
        if ((_a = message.guild) === null || _a === void 0 ? void 0 : _a.queue) {
            if (!this.client.config.allowDuplicate && message.guild.queue.songs.find(s => s.id === song.id)) {
                if (playlist)
                    return this._playlistAlreadyQueued.push(song);
                return message.channel.send(createEmbed_1.createEmbed("warn", `🎶 **|** **[${song.title}](${song.url})** TELAH BERADA DI ANTRIAN, ` +
                    `TOLONG GUNAKAN **\`${this.client.config.prefix}repeat\`** command instead`)
                    .setTitle("Already Queued")
                    .setThumbnail(song.thumbnail));
            }
            message.guild.queue.songs.addSong(song);
            if (!playlist) {
                message.channel.send(createEmbed_1.createEmbed("info", `✅ **|** **[${song.title}](${song.url})** TELAH DITAMBAHKAN KE ANTRIAN`).setThumbnail(song.thumbnail))
                    .catch(e => this.client.logger.error("PLAY_CMD_ERR:", e));
            }
        }
        else {
            message.guild.queue = new ServerQueue_1.ServerQueue(message.channel, voiceChannel);
            (_b = message.guild) === null || _b === void 0 ? void 0 : _b.queue.songs.addSong(song);
            if (!playlist) {
                message.channel.send(createEmbed_1.createEmbed("info", `✅ **|** **[${song.title}](${song.url})** TELAH DITAMBAHKAN KE ANTRIAN`).setThumbnail(song.thumbnail))
                    .catch(e => this.client.logger.error("PLAY_CMD_ERR:", e));
            }
            try {
                const connection = await message.guild.queue.voiceChannel.join();
                message.guild.queue.connection = connection;
            }
            catch (error) {
                (_c = message.guild) === null || _c === void 0 ? void 0 : _c.queue.songs.clear();
                message.guild.queue = null;
                this.client.logger.error("PLAY_CMD_ERR:", error);
                message.channel.send(createEmbed_1.createEmbed("error", `An error occured while joining the voice channel, reason: **\`${error.message}\`**`))
                    .catch(e => this.client.logger.error("PLAY_CMD_ERR:", e));
                return undefined;
            }
            this.play(message.guild).catch(err => {
                message.channel.send(createEmbed_1.createEmbed("error", `An error occurred while trying to play music, reason: **\`${err.message}\`**`))
                    .catch(e => this.client.logger.error("PLAY_CMD_ERR:", e));
                return this.client.logger.error("PLAY_CMD_ERR:", err);
            });
        }
        return message;
    }
    async play(guild) {
        var _a, _b, _c, _d, _e, _f;
        const serverQueue = guild.queue;
        const song = serverQueue.songs.first();
        const timeout = this.client.config.deleteQueueTimeout;
        clearTimeout(disconnectTimer);
        if (!song) {
            if (serverQueue.lastMusicMessageID !== null)
                (_a = serverQueue.textChannel) === null || _a === void 0 ? void 0 : _a.messages.fetch(serverQueue.lastMusicMessageID, false).then(m => m.delete()).catch(e => this.client.logger.error("PLAY_ERR:", e));
            if (serverQueue.lastVoiceStateUpdateMessageID !== null)
                (_b = serverQueue.textChannel) === null || _b === void 0 ? void 0 : _b.messages.fetch(serverQueue.lastVoiceStateUpdateMessageID, false).then(m => m.delete()).catch(e => this.client.logger.error("PLAY_ERR:", e));
            (_c = serverQueue.textChannel) === null || _c === void 0 ? void 0 : _c.send(createEmbed_1.createEmbed("info", `⏹ **|** MUSIC YANG ANDA MINTA TELAH SELESAI, SILAHKAN GUNAKAN **\`${guild.client.config.prefix}play\`** UNTUK MEMAINKAN MUSIK`)).catch(e => this.client.logger.error("PLAY_ERR:", e));
            disconnectTimer = setTimeout(() => {
                var _a, _b;
                (_a = serverQueue.connection) === null || _a === void 0 ? void 0 : _a.disconnect();
                (_b = serverQueue.textChannel) === null || _b === void 0 ? void 0 : _b.send(createEmbed_1.createEmbed("info", `👋 **|** SAYA KELUAR DARI VOICE CHANNEL KARENA SAYA SENDIRIAN :( `)).then(m => m.delete({ timeout: 5000 })).catch(e => e);
            }, timeout);
            return guild.queue = null;
        }
        (_e = (_d = serverQueue.connection) === null || _d === void 0 ? void 0 : _d.voice) === null || _e === void 0 ? void 0 : _e.setSelfDeaf(true).catch(e => this.client.logger.error("PLAY_ERR:", e));
        const songData = await this.client.youtube.downloadVideo(song.url, {
            cache: this.client.config.cacheYoutubeDownloads,
            cacheMaxLength: this.client.config.cacheMaxLengthAllowed,
            skipFFmpeg: true
        });
        if (songData.cache)
            this.client.logger.info(`${this.client.shard ? `[Shard #${this.client.shard.ids}]` : ""} Using cache for music "${song.title}" on ${guild.name}`);
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        songData.on("error", err => { var _a, _b; err.message = `YTDLError: ${err.message}`; (_b = (_a = serverQueue.connection) === null || _a === void 0 ? void 0 : _a.dispatcher) === null || _b === void 0 ? void 0 : _b.emit("error", err); });
        (_f = serverQueue.connection) === null || _f === void 0 ? void 0 : _f.play(songData, { type: songData.info.canSkipFFmpeg ? "webm/opus" : "unknown", bitrate: "auto", highWaterMark: 1 }).on("start", () => {
            var _a, _b;
            serverQueue.playing = true;
            this.client.logger.info(`${this.client.shard ? `[Shard #${this.client.shard.ids}]` : ""} Music: "${song.title}" on ${guild.name} has started`);
            if (serverQueue.lastMusicMessageID !== null)
                (_a = serverQueue.textChannel) === null || _a === void 0 ? void 0 : _a.messages.fetch(serverQueue.lastMusicMessageID, false).then(m => m.delete()).catch(e => this.client.logger.error("PLAY_ERR:", e));
            (_b = serverQueue.textChannel) === null || _b === void 0 ? void 0 : _b.send(createEmbed_1.createEmbed("info", `▶ **|** SEDANG MEMUTAR: **[${song.title}](${song.url})**`).setThumbnail(song.thumbnail)).then(m => serverQueue.lastMusicMessageID = m.id).catch(e => this.client.logger.error("PLAY_ERR:", e));
        }).on("finish", () => {
            var _a, _b;
            this.client.logger.info(`${this.client.shard ? `[Shard #${this.client.shard.ids}]` : ""} Music: "${song.title}" on ${guild.name} has ended`);
            // eslint-disable-next-line max-statements-per-line
            if (serverQueue.loopMode === 0) {
                serverQueue.songs.deleteFirst();
            }
            else if (serverQueue.loopMode === 2) {
                serverQueue.songs.deleteFirst();
                serverQueue.songs.addSong(song);
            }
            if (serverQueue.lastMusicMessageID !== null)
                (_a = serverQueue.textChannel) === null || _a === void 0 ? void 0 : _a.messages.fetch(serverQueue.lastMusicMessageID, false).then(m => m.delete()).catch(e => this.client.logger.error("PLAY_ERR:", e));
            (_b = serverQueue.textChannel) === null || _b === void 0 ? void 0 : _b.send(createEmbed_1.createEmbed("info", `⏹ **|** BERHENTI MEMUTAR: **[${song.title}](${song.url})**`).setThumbnail(song.thumbnail)).then(m => serverQueue.lastMusicMessageID = m.id).catch(e => this.client.logger.error("PLAY_ERR:", e)).finally(() => {
                this.play(guild).catch(e => {
                    var _a, _b;
                    (_a = serverQueue.textChannel) === null || _a === void 0 ? void 0 : _a.send(createEmbed_1.createEmbed("error", `An error occurred while trying to play music, reason: **\`${e}\`**`)).catch(e => this.client.logger.error("PLAY_ERR:", e));
                    (_b = serverQueue.connection) === null || _b === void 0 ? void 0 : _b.dispatcher.end();
                    return this.client.logger.error("PLAY_ERR:", e);
                });
            });
        }).on("error", (err) => {
            var _a, _b, _c;
            (_a = serverQueue.textChannel) === null || _a === void 0 ? void 0 : _a.send(createEmbed_1.createEmbed("error", `An error occurred while playing music, reason: **\`${err.message}\`**`)).catch(e => this.client.logger.error("PLAY_CMD_ERR:", e));
            (_c = (_b = guild.queue) === null || _b === void 0 ? void 0 : _b.voiceChannel) === null || _c === void 0 ? void 0 : _c.leave();
            guild.queue = null;
            this.client.logger.error("PLAY_ERR:", err);
        }).setVolume(serverQueue.volume / guild.client.config.maxVolume);
    }
    paginate(text, limit = 2000) {
        const lines = text.trim().split("\n");
        const pages = [];
        let chunk = "";
        for (const line of lines) {
            if (chunk.length + line.length > limit && chunk.length > 0) {
                pages.push(chunk);
                chunk = "";
            }
            if (line.length > limit) {
                const lineChunks = line.length / limit;
                for (let i = 0; i < lineChunks; i++) {
                    const start = i * limit;
                    const end = start + limit;
                    pages.push(line.slice(start, end));
                }
            }
            else {
                chunk += `${line}\n`;
            }
        }
        if (chunk.length > 0) {
            pages.push(chunk);
        }
        return pages;
    }
    cleanTitle(title) {
        return discord_js_1.Util.escapeMarkdown(entities_1.decodeHTML(title));
    }
    milDuration(duration) {
        const days = duration.days * 86400000;
        const hours = duration.hours * 3600000;
        const minutes = duration.minutes * 60000;
        const seconds = duration.seconds * 1000;
        return days + hours + minutes + seconds;
    }
};
tslib_1.__decorate([
    MusicHelper_1.isUserInTheVoiceChannel(),
    MusicHelper_1.isValidVoiceChannel(),
    MusicHelper_1.isSameVoiceChannel(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Array]),
    tslib_1.__metadata("design:returntype", Promise)
], PlayCommand.prototype, "execute", null);
PlayCommand = tslib_1.__decorate([
    DefineCommand_1.DefineCommand({
        aliases: ["p", "add", "play-music"],
        description: "Play some music",
        name: "play",
        usage: "{prefix}play <youtube video or playlist link | youtube video name>"
    })
], PlayCommand);
exports.PlayCommand = PlayCommand;
