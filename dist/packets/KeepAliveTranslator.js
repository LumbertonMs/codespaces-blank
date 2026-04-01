"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeepAliveTranslator = void 0;
class KeepAliveTranslator {
    toMinecraft(session, packet) {
        // Client opcode 0x01: Keepalive Response with id
        return {
            id: 0x0F, // KeepAlive response
            data: packet.data
        };
    }
    fromMinecraft(packet) {
        // Server KeepAlive -> client opcode 0x02: Keepalive Request
        return {
            id: 0x02,
            data: packet.data
        };
    }
}
exports.KeepAliveTranslator = KeepAliveTranslator;
