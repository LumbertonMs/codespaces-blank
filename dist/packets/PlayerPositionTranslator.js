"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerPositionTranslator = void 0;
class PlayerPositionTranslator {
    toMinecraft(packet) {
        // Client opcode 0x02: Movement Input -> Player Position + Rotation
        return {
            id: 0x14, // Player Position and Rotation
            data: packet.data // Assume data is x,y,z,yaw,pitch,onGround
        };
    }
    fromMinecraft(packet) {
        // Server Player Position and Rotation -> client opcode 0x03
        return {
            id: 0x03,
            data: packet.data
        };
    }
}
exports.PlayerPositionTranslator = PlayerPositionTranslator;
