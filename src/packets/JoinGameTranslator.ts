import { Packet } from '../protocol/PacketCodec';

export class JoinGameTranslator {
  toMinecraft(packet: Packet): Packet {
    // Not used for client to server
    return { id: 0, data: Buffer.alloc(0) };
  }

  fromMinecraft(packet: Packet): Packet {
    // Server Join Game -> client opcode 0x01: Join World
    return {
      id: 0x01,
      data: packet.data
    };
  }
}