import { Packet } from '../protocol/PacketCodec';

export class DisconnectTranslator {
  toMinecraft(session: any, packet: Packet): Packet | null {
    // Not used
    return null;
  }

  fromMinecraft(packet: Packet): Packet {
    // Server Disconnect -> client opcode 0x05
    return {
      id: 0x05,
      data: packet.data
    };
  }
}