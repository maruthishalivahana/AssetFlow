"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
const env_1 = require("./env");
const socketOptions = {
    cors: {
        origin: env_1.env.CLIENT_URL,
        credentials: true,
    },
};
const initializeSocket = (httpServer) => {
    return new socket_io_1.Server(httpServer, socketOptions);
};
exports.initializeSocket = initializeSocket;
