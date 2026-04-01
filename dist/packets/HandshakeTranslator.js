"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandshakeTranslator = void 0;
const VarInt_1 = require("../utils/VarInt");
class HandshakeTranslator {
    toMinecraft(packet) {
        // Client opcode 0x00: Login Request with username -> Login Start
        const username = packet.data.toString('utf8');
        const nameEncoded = Buffer.concat([VarInt_1.VarInt.encode(username.length), Buffer.from(username, 'utf8')]);
        const hasSigData = Buffer.from([0]); // false for offline mode
        const data = Buffer.concat([nameEncoded, hasSigData]);
        return {
            id: 0x00, // Login Start
            data: data
        };
    }
    fromMinecraft(packet) {
        // Server Login Success -> client opcode 0x00
        return {
            id: 0x00,
            data: packet.data
        };
    }
}
exports.HandshakeTranslator = HandshakeTranslator;
