import { Packet } from '../protocol/PacketCodec';
import { VarInt } from '../utils/VarInt';

export class HandshakeTranslator {
  toMinecraft(session: any, packet: Packet): Packet | null {
    // Client sends login request, send handshake first, then login start
    session.tcp.sendHandshake();
    // Then return login start
    let username = packet.data.toString('utf8');
    // Clean the username to make it valid (remove invalid characters)
    username = username.replace(/[^a-zA-Z0-9_]/g, '').substring(0, 16);
    if (username.length === 0) username = 'Player'; // fallback
    const nameEncoded = Buffer.concat([VarInt.encode(username.length), Buffer.from(username, 'utf8')]);
    const hasSigData = Buffer.from([0]); // false for offline mode
    const data = Buffer.concat([nameEncoded, hasSigData]);
    return {
      id: 0x00, // Login Start
      data: data
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