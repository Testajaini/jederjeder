"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefineListener = void 0;
function DefineListener(name) {
    return function decorate(target) {
        return new Proxy(target, {
            construct: (ctx, [client]) => new ctx(client, name)
        });
    };
}
exports.DefineListener = DefineListener;
