"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessageTranslator = void 0;
class ChatMessageTranslator {
    toMinecraft(packet) {
        // Client opcode 0x03: Chat Message
        return {
            id: 0x05, // Chat Message
            data: packet.data
        };
    }
    fromMinecraft(packet) {
        // Server Chat Message -> client opcode 0x04
        return {
            id: 0x04,
            data: packet.data
        };
    }
}
exports.ChatMessageTranslator = ChatMessageTranslator;
