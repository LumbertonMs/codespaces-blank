import { Packet } from '../protocol/PacketCodec';

export class ChatMessageTranslator {
  toMinecraft(packet: Packet): Packet {
    // Client opcode 0x03: Chat Message
    return {
      id: 0x05, // Chat Message
      data: packet.data
    };
  }

  fromMinecraft(packet: Packet): Packet {
    // Server Chat Message -> client opcode 0x04
    return {
      id: 0x04,
      data: packet.data
    };
  }
}