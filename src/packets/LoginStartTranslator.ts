import { Packet } from '../protocol/PacketCodec';

export class LoginStartTranslator {
  toMinecraft(packet: Packet): Packet {
    // Login Start: username
    return {
      id: 0x00, // In login state
      data: packet.data
    };
  }

  fromMinecraft(packet: Packet): Packet {
    return {
      id: 0x02, // Login Success
      data: packet.data
    };
  }
}