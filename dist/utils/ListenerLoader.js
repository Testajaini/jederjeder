"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListenerLoader = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
class ListenerLoader {
    constructor(client, path) {
        this.client = client;
        this.path = path;
    }
    async load() {
        const files = await fs_1.promises.readdir(path_1.resolve(this.path));
        for (const file of files) {
            const event = await this.import(path_1.resolve(this.path, file), this.client);
            if (event === undefined)
                throw new Error(`File ${file} is not a valid listener file`);
            this.client.on(event.name, (...args) => event.execute(...args));
            this.client.logger.info(`${this.client.shard ? `[Shard #${this.client.shard.ids[0]}]` : ""} Listener for ${event.name} event has been loaded`);
        }
        this.client.logger.info(`${this.client.shard ? `[Shard #${this.client.shard.ids[0]}]` : ""} A total of ${files.length} of listeners has been loaded`);
        return this.client;
    }
    async import(path, ...args) {
        const file = (await Promise.resolve().then(() => __importStar(require(path_1.resolve(path)))).then(m => m[path_1.parse(path).name]));
        return file ? new file(...args) : undefined;
    }
}
exports.ListenerLoader = ListenerLoader;
