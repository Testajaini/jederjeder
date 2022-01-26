"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = void 0;
const tslib_1 = require("tslib");
const winston_1 = tslib_1.__importDefault(require("winston"));
// @ts-expect-error ignore
const dateFormat = Intl.DateTimeFormat("en", { dateStyle: "short", timeStyle: "medium", hour12: false });
function formatDateForLogFile(date) {
    const data = dateFormat.formatToParts(date);
    return `<year>-<month>-<day>-<hour>-<minute>-<second>`
        .replace(/<year>/g, data.find(({ type }) => type === "year").value)
        .replace(/<month>/g, data.find(({ type }) => type === "month").value)
        .replace(/<day>/g, data.find(({ type }) => type === "day").value)
        .replace(/<hour>/g, data.find(({ type }) => type === "hour").value)
        .replace(/<minute>/g, data.find(({ type }) => type === "minute").value)
        .replace(/<second>/g, data.find(({ type }) => type === "second").value);
}
function createLogger(serviceName, debug = false) {
    const logger = winston_1.default.createLogger({
        defaultMeta: {
            serviceName
        },
        format: winston_1.default.format.combine(winston_1.default.format.printf(info => {
            const { level, message, stack } = info;
            const prefix = `[${dateFormat.format(Date.now())}] [${level}]`;
            if (["error", "crit"].includes(level))
                return `${prefix}: ${stack}`;
            return `${prefix}: ${message}`;
        })),
        level: debug ? "debug" : "info",
        levels: {
            alert: 1,
            debug: 5,
            error: 0,
            info: 4,
            notice: 3,
            warn: 2
        },
        transports: [
            new winston_1.default.transports.File({ filename: `logs/${serviceName}/error-${formatDateForLogFile(Date.now())}.log`, level: "error" }),
            new winston_1.default.transports.File({ filename: `logs/${serviceName}/logs-${formatDateForLogFile(Date.now())}.log` })
        ]
    });
    logger.add(new winston_1.default.transports.Console({
        level: debug ? "debug" : "info",
        format: winston_1.default.format.combine(winston_1.default.format.printf(info => {
            const { level, message, stack } = info;
            const prefix = `[${dateFormat.format(Date.now())}] [${level}]`;
            if (["error", "alert"].includes(level))
                return `${prefix}: ${stack}`;
            return `${prefix}: ${message}`;
        }), winston_1.default.format.align(), winston_1.default.format.colorize({ all: true }))
    }));
    return logger;
}
exports.createLogger = createLogger;
