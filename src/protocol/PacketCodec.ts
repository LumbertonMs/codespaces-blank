import { VarInt } from '../utils/VarInt';

export interface Packet {
  id: number;
  data: Buffer;
}

export interface WebSocketFrame {
  opcode: number;
  payload: Buffer;
}

export class PacketCodec {
  decodeWebSocketFrame(data: Buffer): Packet {
    // Assume format: [packetId: uint8] [payload]
    const id = data.readUInt8(0);
    const payload = data.slice(1);
    return { id, data: payload };
  }

  encodeWebSocketFrame(frame: WebSocketFrame): Buffer {
    // Format: [opcode: uint8] [payload]
    const buffer = Buffer.alloc(1 + frame.payload.length);
    buffer.writeUInt8(frame.opcode, 0);
    frame.payload.copy(buffer, 1);
    return buffer;
  }

  decodeMinecraftPacket(data: Buffer): Packet {
    // Minecraft packet: [length (VarInt)] [packet id (VarInt)] [data]
    let offset = 0;
    const length = VarInt.read(data, offset);
    offset += VarInt.encodingLength(length);
    const id = VarInt.read(data, offset);
    offset += VarInt.encodingLength(id);
    const packetData = data.slice(offset, offset + length - VarInt.encodingLength(id));
    return { id, data: packetData };
  }

  encodeMinecraftPacket(packet: Packet): Buffer {
    const idEncoded = VarInt.encode(packet.id);
    const length = idEncoded.length + packet.data.length;
    const lengthEncoded = VarInt.encode(length);
    return Buffer.concat([lengthEncoded, idEncoded, packet.data]);
  }
}