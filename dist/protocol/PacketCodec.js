"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacketCodec = void 0;
const VarInt_1 = require("../utils/VarInt");
class PacketCodec {
    decodeWebSocketFrame(data) {
        // Custom format: [opcode (1 byte)] [length (VarInt)] [payload]
        const opcode = data.readUInt8(0);
        let offset = 1;
        const length = VarInt_1.VarInt.read(data, offset);
        offset += VarInt_1.VarInt.encodingLength(length);
        const payload = data.slice(offset, offset + length);
        return { id: opcode, data: payload };
    }
    encodeWebSocketFrame(frame) {
        const lengthEncoded = VarInt_1.VarInt.encode(frame.payload.length);
        const buffer = Buffer.alloc(1 + lengthEncoded.length + frame.payload.length);
        buffer.writeUInt8(frame.opcode, 0);
        lengthEncoded.copy(buffer, 1);
        frame.payload.copy(buffer, 1 + lengthEncoded.length);
        return buffer;
    }
    decodeMinecraftPacket(data) {
        // Minecraft packet: [length (VarInt)] [packet id (VarInt)] [data]
        let offset = 0;
        const length = VarInt_1.VarInt.read(data, offset);
        offset += VarInt_1.VarInt.encodingLength(length);
        const id = VarInt_1.VarInt.read(data, offset);
        offset += VarInt_1.VarInt.encodingLength(id);
        const packetData = data.slice(offset, offset + length - VarInt_1.VarInt.encodingLength(id));
        return { id, data: packetData };
    }
    encodeMinecraftPacket(packet) {
        const idEncoded = VarInt_1.VarInt.encode(packet.id);
        const length = idEncoded.length + packet.data.length;
        const lengthEncoded = VarInt_1.VarInt.encode(length);
        return Buffer.concat([lengthEncoded, idEncoded, packet.data]);
    }
}
exports.PacketCodec = PacketCodec;
