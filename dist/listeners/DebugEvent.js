"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugEvent = void 0;
const tslib_1 = require("tslib");
const DefineListener_1 = require("../utils/decorators/DefineListener");
const BaseListener_1 = require("../structures/BaseListener");
let DebugEvent = class DebugEvent extends BaseListener_1.BaseListener {
    execute(message) {
        this.client.logger.debug(message);
    }
};
DebugEvent = tslib_1.__decorate([
    DefineListener_1.DefineListener("debug")
], DebugEvent);
exports.DebugEvent = DebugEvent;
