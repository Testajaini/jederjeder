"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCommand = void 0;
class BaseCommand {
    constructor(client, meta) {
        this.client = client;
        this.meta = meta;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    execute(message, args) { }
}
exports.BaseCommand = BaseCommand;
