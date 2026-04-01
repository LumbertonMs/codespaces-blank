import { Packet } from '../protocol/PacketCodec';

export class KeepAliveTranslator {
  toMinecraft(packet: Packet): Packet {
    // Client opcode 0x01: Keepalive Response with id
    return {
      id: 0x0F, // KeepAlive response
      data: packet.data
    };
  }

  fromMinecraft(packet: Packet): Packet {
    // Server KeepAlive -> client opcode 0x02: Keepalive Request
    return {
      id: 0x02,
      data: packet.data
    };
  }
}