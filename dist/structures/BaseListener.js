"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseListener = void 0;
class BaseListener {
    constructor(client, name) {
        this.client = client;
        this.name = name;
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    execute(...args) { }
}
exports.BaseListener = BaseListener;
