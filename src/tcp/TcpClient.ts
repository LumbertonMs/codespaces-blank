import { Socket } from 'net';
import { PacketRouter } from '../protocol/PacketRouter';
import { VarInt } from '../utils/VarInt';
import { PacketCodec } from '../protocol/PacketCodec';

export class TcpClient {
  private socket: Socket | null = null;
  private packetRouter: PacketRouter;
  private codec: PacketCodec;
  private host: string = '';
  private port: number = 0;
  private session: any;

  constructor(packetRouter: PacketRouter) {
    this.packetRouter = packetRouter;
    this.codec = new PacketCodec();
  }

  connect(host: string, port: number, session: any): void {
    this.host = host;
    this.port = port;
    this.session = session;
    this.socket = new Socket();

    this.socket.connect(port, host, () => {
      console.log(`TCP connected to ${host}:${port}`);
      // Send handshake
      this.sendHandshake();
    });

    this.socket.on('data', (data: Buffer) => {
      console.log('Received TCP data:', data.length, 'bytes');
      this.handleData(data);
    });

    this.socket.on('close', () => {
      console.log('TCP connection closed');
    });

    this.socket.on('error', (error: Error) => {
      console.error('TCP error:', error);
    });
  }

  private sendHandshake(): void {
    // Handshake packet: protocol version (VarInt), server address (string), server port (uint16), next state (VarInt: 2 for login)
    const protocolVersion = 767; // 1.21
    const serverAddress = 'fluxskyblock.mcsh.io';
    const serverPort = 10395;
    const nextState = 2; // login

    const protocolEncoded = VarInt.encode(protocolVersion);
    const addressEncoded = Buffer.concat([VarInt.encode(serverAddress.length), Buffer.from(serverAddress, 'utf8')]);
    const portEncoded = Buffer.alloc(2);
    portEncoded.writeUInt16BE(serverPort, 0);
    const nextStateEncoded = VarInt.encode(nextState);

    const data = Buffer.concat([protocolEncoded, addressEncoded, portEncoded, nextStateEncoded]);
    const packet = { id: 0x00, data };
    console.log('Sending handshake packet');
    this.send(this.codec.encodeMinecraftPacket(packet));
  }

  send(data: Buffer): void {
    if (this.socket) {
      this.socket.write(data);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.end();
      this.socket = null;
    }
  }

  private handleData(data: Buffer): void {
    // Decode Minecraft packet and route
    this.packetRouter.handleServerPacket(this.session, data);
  }
}