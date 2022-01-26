"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageEvent = void 0;
const tslib_1 = require("tslib");
const DefineListener_1 = require("../utils/decorators/DefineListener");
const BaseListener_1 = require("../structures/BaseListener");
const createEmbed_1 = require("../utils/createEmbed");
let MessageEvent = class MessageEvent extends BaseListener_1.BaseListener {
    async execute(message) {
        var _a, _b;
        if (message.author.bot || message.channel.type !== "text")
            return message;
        if (message.content.toLowerCase().startsWith(this.client.config.prefix))
            return this.client.commands.handle(message);
        if (((_a = (await this.getUserFromMention(message.content))) === null || _a === void 0 ? void 0 : _a.id) === ((_b = message.client.user) === null || _b === void 0 ? void 0 : _b.id)) {
            return message.channel.send(createEmbed_1.createEmbed("info", `👋 Hi, my name is **${this.client.user.username}** a simple Discord music bot, use **\`${this.client.config.prefix}help\`** to have a look at my commands`));
        }
    }
    getUserFromMention(mention) {
        const matches = /^<@!?(\d+)>$/.exec(mention);
        if (!matches)
            return Promise.resolve(undefined);
        const id = matches[1];
        return this.client.users.fetch(id);
    }
};
MessageEvent = tslib_1.__decorate([
    DefineListener_1.DefineListener("message")
], MessageEvent);
exports.MessageEvent = MessageEvent;
