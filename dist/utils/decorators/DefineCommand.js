"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefineCommand = void 0;
function DefineCommand(meta) {
    return function decorate(target) {
        return new Proxy(target, {
            construct: (ctx, [client]) => new ctx(client, meta)
        });
    };
}
exports.DefineCommand = DefineCommand;
