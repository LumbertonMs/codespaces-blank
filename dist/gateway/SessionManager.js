"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionManager = exports.Session = void 0;
const TcpClient_1 = require("../tcp/TcpClient");
class Session {
    constructor(ws, tcp, id) {
        this.ws = ws;
        this.tcp = tcp;
        this.id = id;
    }
}
exports.Session = Session;
class SessionManager {
    constructor(packetRouter) {
        this.sessions = new Map();
        this.packetRouter = packetRouter;
    }
    createSession(ws) {
        const id = this.generateId();
        const tcp = new TcpClient_1.TcpClient(this.packetRouter);
        const session = new Session(ws, tcp, id);
        this.sessions.set(id, session);
        return session;
    }
    getSession(id) {
        return this.sessions.get(id);
    }
    removeSession(id) {
        this.sessions.delete(id);
    }
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
}
exports.SessionManager = SessionManager;
