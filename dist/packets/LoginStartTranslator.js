"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginStartTranslator = void 0;
class LoginStartTranslator {
    toMinecraft(packet) {
        // Login Start: username
        return {
            id: 0x00, // In login state
            data: packet.data
        };
    }
    fromMinecraft(packet) {
        return {
            id: 0x02, // Login Success
            data: packet.data
        };
    }
}
exports.LoginStartTranslator = LoginStartTranslator;
