import { WebSocketServer } from '../ws/WebSocketServer';
import { TcpClient } from '../tcp/TcpClient';
import { SessionManager } from './SessionManager';
import { PacketRouter } from '../protocol/PacketRouter';

interface Config {
  backend_host: string;
  backend_port: number;
  max_clients: number;
}

export class Gateway {
  private wsServer: WebSocketServer;
  private sessionManager: SessionManager;
  private packetRouter: PacketRouter;
  private config: Config;

  constructor(config: Config) {
    this.config = config;
    this.packetRouter = new PacketRouter();
    this.sessionManager = new SessionManager(this.packetRouter);
    this.wsServer = new WebSocketServer(this.sessionManager, this.packetRouter, config.max_clients, config.backend_host, config.backend_port);
  }

  start(): void {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 8081;
    this.wsServer.start(port);
    console.log(`Gateway started on port ${port}`);
  }
}