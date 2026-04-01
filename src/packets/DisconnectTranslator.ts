import { Packet } from '../protocol/PacketCodec';

export class DisconnectTranslator {
  toMinecraft(packet: Packet): Packet {
    // Not used
    return { id: 0, data: Buffer.alloc(0) };
  }

  fromMinecraft(packet: Packet): Packet {
    // Server Disconnect -> client opcode 0x05
    return {
      id: 0x05,
      data: packet.data
    };
  }
}