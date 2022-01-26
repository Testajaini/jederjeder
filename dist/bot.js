"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Disc_1 = require("./structures/Disc");
const config_1 = require("./config");
require("dotenv/config");
const intents = ["GUILDS", "GUILD_VOICE_STATES", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"];
const client = new Disc_1.Disc({
    disableMentions: "everyone",
    fetchAllMembers: config_1.fetchAllUsers,
    messageCacheLifetime: 60,
    messageCacheMaxSize: Infinity,
    messageEditHistoryMaxSize: Infinity,
    messageSweepInterval: 180,
    ws: {
        intents: config_1.fetchAllUsers ? intents.concat(["GUILD_MEMBERS"]) : intents
    }
});
process.on("unhandledRejection", e => {
    client.logger.error("UNHANDLED_REJECTION: ", e);
});
process.on("uncaughtException", e => {
    client.logger.error("UNCAUGHT_EXCEPTION: ", e);
    client.logger.warn("Uncaught Exception detected, restarting...");
    process.exit(1);
});
client.build(process.env.SECRET_DISCORD_TOKEN)
    .catch(e => client.logger.error("CLIENT_BUILD_ERR: ", e));
