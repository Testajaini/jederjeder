"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMS = void 0;
const tslib_1 = require("tslib");
const pretty_ms_1 = tslib_1.__importDefault(require("pretty-ms"));
function formatMS(ms) {
    if (isNaN(ms))
        throw new Error("value is not a number.");
    return pretty_ms_1.default(ms, {
        verbose: true,
        compact: false,
        secondsDecimalDigits: 0
    });
}
exports.formatMS = formatMS;
