"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const env_1 = require("@config/env");
const socket_1 = require("@config/socket");
const app_1 = require("./app");
const server = http_1.default.createServer(app_1.app);
const io = (0, socket_1.initializeSocket)(server);
app_1.app.set('io', io);
server.listen(env_1.env.PORT, () => {
    console.log(`AssetFlow backend is running on port ${env_1.env.PORT}`);
});
