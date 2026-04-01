import { Packet } from '../protocol/PacketCodec';
import { VarInt } from '../utils/VarInt';

export class HandshakeTranslator {
  toMinecraft(packet: Packet): Packet {
    // Client opcode 0x00: Login Request with username -> Login Start
    const username = packet.data.toString('utf8');
    const nameEncoded = Buffer.concat([VarInt.encode(username.length), Buffer.from(username, 'utf8')]);
    return {
      id: 0x00, // Login Start
      data: nameEncoded
    };
  }

  fromMinecraft(packet: Packet): Packet {
    // Server Login Success -> client opcode 0x00
    return {
      id: 0x00,
      data: packet.data
    };
  }
}