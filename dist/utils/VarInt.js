"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VarInt = void 0;
class VarInt {
    static encode(value) {
        const buffer = [];
        while (true) {
            if ((value & ~0x7F) === 0) {
                buffer.push(value);
                break;
            }
            buffer.push((value & 0x7F) | 0x80);
            value >>>= 7;
        }
        return Buffer.from(buffer);
    }
    static read(buffer, offset = 0) {
        let result = 0;
        let shift = 0;
        let byte;
        do {
            byte = buffer[offset++];
            result |= (byte & 0x7F) << shift;
            shift += 7;
        } while ((byte & 0x80) !== 0);
        return result;
    }
    static encodingLength(value) {
        if (value < 0)
            throw new Error('VarInt cannot encode negative numbers');
        if (value < 0x80)
            return 1;
        if (value < 0x4000)
            return 2;
        if (value < 0x200000)
            return 3;
        if (value < 0x10000000)
            return 4;
        return 5;
    }
}
exports.VarInt = VarInt;
