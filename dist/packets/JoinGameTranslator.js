"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinGameTranslator = void 0;
class JoinGameTranslator {
    toMinecraft(session, packet) {
        // Not used for client to server
        return null;
    }
    fromMinecraft(packet) {
        // Server Join Game -> client opcode 0x01: Join World
        return {
            id: 0x01,
            data: packet.data
        };
    }
}
exports.JoinGameTranslator = JoinGameTranslator;
