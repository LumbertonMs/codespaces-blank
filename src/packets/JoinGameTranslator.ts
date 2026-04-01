import { Packet } from '../protocol/PacketCodec';

export class JoinGameTranslator {
  toMinecraft(session: any, packet: Packet): Packet | null {
    // Not used for client to server
    return null;
  }

  fromMinecraft(packet: Packet): Packet {
    // Server Join Game -> client opcode 0x01: Join World
    return {
      id: 0x01,
      data: packet.data
    };
  }
}