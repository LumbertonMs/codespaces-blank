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

    console.log(`WebSocket server starting on port ${port}`);

    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New WebSocket connection established');
      if (this.wss!.clients.size > this.maxClients) {
        ws.close();
        return;
      }

      const session = this.sessionManager.createSession(ws);
      session.tcp.connect(this.backendHost, this.backendPort, session);

      ws.on('message', (data: Buffer) => {
        console.log('Received WebSocket message:', data.length, 'bytes');
        this.handleMessage(session, data);
      });

      ws.on('close', () => {
        console.log('WebSocket connection closed');
        session.tcp.disconnect();
        this.sessionManager.removeSession(session.id);
      });

      ws.on('error', (error: Error) => {
        console.error('WebSocket error:', error);
        session.tcp.disconnect();
        this.sessionManager.removeSession(session.id);
      });
    });

    this.wss.on('error', (error) => {
      console.error('WebSocket server error:', error);
    });
  }

  private handleMessage(session: any, data: Buffer): void {
    // Decode WebSocket frame and route packet
    this.packetRouter.handleClientPacket(session, data);
  }
}