"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteCommand = void 0;
const tslib_1 = require("tslib");
const DefineCommand_1 = require("../utils/decorators/DefineCommand");
const BaseCommand_1 = require("../structures/BaseCommand");
const createEmbed_1 = require("../utils/createEmbed");
const config_1 = require("../config");
let InviteCommand = class InviteCommand extends BaseCommand_1.BaseCommand {
    async execute(message) {
        message.channel.send(createEmbed_1.createEmbed("info")
            .addField(`${this.client.user.tag} - Invite Link`, `**[Click here to invite this bot](${await this.client.generateInvite({ permissions: 53857345 })})**`)).catch(e => this.client.logger.error("PLAY_CMD_ERR:", e));
    }
};
InviteCommand = tslib_1.__decorate([
    DefineCommand_1.DefineCommand({
        description: "Send the bot's invite link",
        disable: config_1.disableInviteCmd,
        name: "invite",
        usage: "{prefix}invite"
    })
], InviteCommand);
exports.InviteCommand = InviteCommand;
