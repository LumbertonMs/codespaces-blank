"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisconnectTranslator = void 0;
class DisconnectTranslator {
    toMinecraft(packet) {
        // Not used
        return { id: 0, data: Buffer.alloc(0) };
    }
    fromMinecraft(packet) {
        // Server Disconnect -> client opcode 0x05
        return {
            id: 0x05,
            data: packet.data
        };
    }
}
exports.DisconnectTranslator = DisconnectTranslator;
