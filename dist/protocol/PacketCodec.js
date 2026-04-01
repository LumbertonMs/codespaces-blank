"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacketCodec = void 0;
const VarInt_1 = require("../utils/VarInt");
class PacketCodec {
    decodeWebSocketFrame(data) {
        // Assume format: [packetId: uint8] [payload]
        const id = data.readUInt8(0);
        const payload = data.slice(1);
        return { id, data: payload };
    }
    encodeWebSocketFrame(frame) {
        // Format: [opcode: uint8] [payload]
        const buffer = Buffer.alloc(1 + frame.payload.length);
        buffer.writeUInt8(frame.opcode, 0);
        frame.payload.copy(buffer, 1);
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
