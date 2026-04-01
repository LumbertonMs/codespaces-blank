import { PacketCodec } from './PacketCodec';
import { HandshakeTranslator } from '../packets/HandshakeTranslator';
import { KeepAliveTranslator } from '../packets/KeepAliveTranslator';
import { ChatMessageTranslator } from '../packets/ChatMessageTranslator';
import { PlayerPositionTranslator } from '../packets/PlayerPositionTranslator';
import { JoinGameTranslator } from '../packets/JoinGameTranslator';
import { DisconnectTranslator } from '../packets/DisconnectTranslator';
// Add more translators as needed

export class PacketRouter {
  private codec: PacketCodec;
  private clientTranslators: Map<number, any> = new Map();
  private serverTranslators: Map<number, any> = new Map();

  constructor() {
    this.codec = new PacketCodec();
    this.registerTranslators();
  }

  private registerTranslators(): void {
    // Client opcodes to translators
    this.clientTranslators.set(0x00, new HandshakeTranslator()); // Login Request
    this.clientTranslators.set(0x01, new KeepAliveTranslator()); // Keepalive Response
    this.clientTranslators.set(0x02, new PlayerPositionTranslator()); // Movement Input
    this.clientTranslators.set(0x03, new ChatMessageTranslator()); // Chat Message

    // Server packet IDs to translators
    this.serverTranslators.set(0x02, new HandshakeTranslator()); // Login Success
    this.serverTranslators.set(0x26, new JoinGameTranslator()); // Join Game
    this.serverTranslators.set(0x21, new KeepAliveTranslator()); // KeepAlive
    this.serverTranslators.set(0x14, new PlayerPositionTranslator()); // Player Position and Rotation
    this.serverTranslators.set(0x0F, new ChatMessageTranslator()); // Chat Message
    this.serverTranslators.set(0x1B, new DisconnectTranslator()); // Disconnect
    // Add more
  }

  handleClientPacket(session: any, data: Buffer): void {
    const packet = this.codec.decodeWebSocketFrame(data);
    const translator = this.clientTranslators.get(packet.id);
    if (translator) {
      const mcPacket = translator.toMinecraft(packet);
      session.tcp.send(this.codec.encodeMinecraftPacket(mcPacket));
    }
  }

  handleServerPacket(session: any, data: Buffer): void {
    const packet = this.codec.decodeMinecraftPacket(data);
    const translator = this.serverTranslators.get(packet.id);
    if (translator) {
      const wsFrame = translator.fromMinecraft(packet);
      session.ws.send(this.codec.encodeWebSocketFrame(wsFrame));
    }
  }
}