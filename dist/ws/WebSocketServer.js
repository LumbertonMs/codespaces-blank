"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketServer = void 0;
const ws_1 = require("ws");
class WebSocketServer {
    constructor(sessionManager, packetRouter, maxClients, backendHost, backendPort) {
        this.wss = null;
        this.sessionManager = sessionManager;
        this.packetRouter = packetRouter;
        this.maxClients = maxClients;
        this.backendHost = backendHost;
        this.backendPort = backendPort;
    }
    start(port) {
        this.wss = new ws_1.WebSocketServer({ port });
        console.log(`WebSocket server starting on port ${port}`);
        this.wss.on('connection', (ws) => {
            console.log('New WebSocket connection established');
            if (this.wss.clients.size > this.maxClients) {
                ws.close();
                return;
            }
            const session = this.sessionManager.createSession(ws);
            session.tcp.connect(this.backendHost, this.backendPort, session);
            ws.on('message', (data) => {
                console.log('Received WebSocket message:', data.length, 'bytes');
                this.handleMessage(session, data);
            });
            ws.on('close', () => {
                console.log('WebSocket connection closed');
                session.tcp.disconnect();
                this.sessionManager.removeSession(session.id);
            });
            ws.on('error', (error) => {
                console.error('WebSocket error:', error);
                session.tcp.disconnect();
                this.sessionManager.removeSession(session.id);
            });
        });
        this.wss.on('error', (error) => {
            console.error('WebSocket server error:', error);
        });
    }
    handleMessage(session, data) {
        // Decode WebSocket frame and route packet
        this.packetRouter.handleClientPacket(session, data);
    }
}
exports.WebSocketServer = WebSocketServer;
