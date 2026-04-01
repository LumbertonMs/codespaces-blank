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
    // Custom format: [opcode (1 byte)] [length (VarInt)] [payload]
    const opcode = data.readUInt8(0);
    let offset = 1;
    const length = VarInt.read(data, offset);
    offset += VarInt.encodingLength(length);
    const payload = data.slice(offset, offset + length);
    return { id: opcode, data: payload };
  }

  encodeWebSocketFrame(frame: WebSocketFrame): Buffer {
    const lengthEncoded = VarInt.encode(frame.payload.length);
    const buffer = Buffer.alloc(1 + lengthEncoded.length + frame.payload.length);
    buffer.writeUInt8(frame.opcode, 0);
    lengthEncoded.copy(buffer, 1);
    frame.payload.copy(buffer, 1 + lengthEncoded.length);
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