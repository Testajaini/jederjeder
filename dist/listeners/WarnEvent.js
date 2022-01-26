"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarnEvent = void 0;
const tslib_1 = require("tslib");
const DefineListener_1 = require("../utils/decorators/DefineListener");
const BaseListener_1 = require("../structures/BaseListener");
let WarnEvent = class WarnEvent extends BaseListener_1.BaseListener {
    execute(warn) {
        this.client.logger.warn("CLIENT_WARN:", warn);
    }
};
WarnEvent = tslib_1.__decorate([
    DefineListener_1.DefineListener("warn")
], WarnEvent);
exports.WarnEvent = WarnEvent;
