"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gateway = void 0;
const WebSocketServer_1 = require("../ws/WebSocketServer");
const SessionManager_1 = require("./SessionManager");
const PacketRouter_1 = require("../protocol/PacketRouter");
class Gateway {
    constructor(config) {
        this.config = config;
        this.packetRouter = new PacketRouter_1.PacketRouter();
        this.sessionManager = new SessionManager_1.SessionManager(this.packetRouter);
        this.wsServer = new WebSocketServer_1.WebSocketServer(this.sessionManager, this.packetRouter, config.max_clients, config.backend_host, config.backend_port);
    }
    start() {
        const port = process.env.PORT ? parseInt(process.env.PORT) : 8081;
        this.wsServer.start(port);
        console.log(`Gateway started on port ${port}`);
    }
}
exports.Gateway = Gateway;
