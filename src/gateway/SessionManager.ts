import { WebSocket } from 'ws';
import { TcpClient } from '../tcp/TcpClient';
import { PacketRouter } from '../protocol/PacketRouter';

export class Session {
  public ws: WebSocket;
  public tcp: TcpClient;
  public id: string;

  constructor(ws: WebSocket, tcp: TcpClient, id: string) {
    this.ws = ws;
    this.tcp = tcp;
    this.id = id;
  }
}

export class SessionManager {
  private sessions: Map<string, Session> = new Map();
  private packetRouter: PacketRouter;

  constructor(packetRouter: PacketRouter) {
    this.packetRouter = packetRouter;
  }

  createSession(ws: WebSocket): Session {
    const id = this.generateId();
    const tcp = new TcpClient(this.packetRouter);
    const session = new Session(ws, tcp, id);
    this.sessions.set(id, session);
    return session;
  }

  getSession(id: string): Session | undefined {
    return this.sessions.get(id);
  }

  removeSession(id: string): void {
    this.sessions.delete(id);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}