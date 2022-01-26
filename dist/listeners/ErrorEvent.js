"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorEvent = void 0;
const tslib_1 = require("tslib");
const DefineListener_1 = require("../utils/decorators/DefineListener");
const BaseListener_1 = require("../structures/BaseListener");
let ErrorEvent = class ErrorEvent extends BaseListener_1.BaseListener {
    execute(error) {
        this.client.logger.error("CLIENT_ERROR:", error);
    }
};
ErrorEvent = tslib_1.__decorate([
    DefineListener_1.DefineListener("error")
], ErrorEvent);
exports.ErrorEvent = ErrorEvent;
