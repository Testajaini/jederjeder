"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
discord_js_1.Structures.extend("Guild", dJSGuild => class Guild extends dJSGuild {
    constructor(client, data) {
        super(client, data);
        this.queue = null;
    }
});
