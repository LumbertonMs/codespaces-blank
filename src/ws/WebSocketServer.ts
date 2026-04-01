import { WebSocketServer as WSServer, WebSocket } from 'ws';
import { SessionManager } from '../gateway/SessionManager';
import { PacketRouter } from '../protocol/PacketRouter';
import { TcpClient } from '../tcp/TcpClient';

export class WebSocketServer {
  private wss: WSServer | null = null;
  private sessionManager: SessionManager;
  private packetRouter: PacketRouter;
  private maxClients: number;
  private backendHost: string;
  private backendPort: number;

  constructor(sessionManager: SessionManager, packetRouter: PacketRouter, maxClients: number, backendHost: string, backendPort: number) {
    this.sessionManager = sessionManager;
    this.packetRouter = packetRouter;
    this.maxClients = maxClients;
    this.backendHost = backendHost;
    this.backendPort = backendPort;
  }

  start(port: number): void {
    this.wss = new WSServer({ port });

    this.wss.on('connection', (ws: WebSocket) => {
      if (this.wss!.clients.size > this.maxClients) {
        ws.close();
        return;
      }

      const session = this.sessionManager.createSession(ws);
      session.tcp.connect(this.backendHost, this.backendPort, session);

      ws.on('message', (data: Buffer) => {
        this.handleMessage(session, data);
      });

      ws.on('close', () => {
        session.tcp.disconnect();
        this.sessionManager.removeSession(session.id);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        session.tcp.disconnect();
        this.sessionManager.removeSession(session.id);
      });
    });
  }

  private handleMessage(session: any, data: Buffer): void {
    // Decode WebSocket frame and route packet
    this.packetRouter.handleClientPacket(session, data);
  }
}