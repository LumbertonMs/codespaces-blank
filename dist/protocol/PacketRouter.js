"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacketRouter = void 0;
const PacketCodec_1 = require("./PacketCodec");
const HandshakeTranslator_1 = require("../packets/HandshakeTranslator");
const KeepAliveTranslator_1 = require("../packets/KeepAliveTranslator");
const ChatMessageTranslator_1 = require("../packets/ChatMessageTranslator");
const PlayerPositionTranslator_1 = require("../packets/PlayerPositionTranslator");
const JoinGameTranslator_1 = require("../packets/JoinGameTranslator");
const DisconnectTranslator_1 = require("../packets/DisconnectTranslator");
// Add more translators as needed
class PacketRouter {
    constructor() {
        this.clientTranslators = new Map();
        this.serverTranslators = new Map();
        this.codec = new PacketCodec_1.PacketCodec();
        this.registerTranslators();
    }
    registerTranslators() {
        // Client opcodes to translators
        this.clientTranslators.set(0x00, new HandshakeTranslator_1.HandshakeTranslator()); // Login Request
        this.clientTranslators.set(0x01, new KeepAliveTranslator_1.KeepAliveTranslator()); // Keepalive Response
        this.clientTranslators.set(0x02, new PlayerPositionTranslator_1.PlayerPositionTranslator()); // Movement Input
        this.clientTranslators.set(0x03, new ChatMessageTranslator_1.ChatMessageTranslator()); // Chat Message
        // Server packet IDs to translators
        this.serverTranslators.set(0x02, new HandshakeTranslator_1.HandshakeTranslator()); // Login Success
        this.serverTranslators.set(0x26, new JoinGameTranslator_1.JoinGameTranslator()); // Join Game
        this.serverTranslators.set(0x21, new KeepAliveTranslator_1.KeepAliveTranslator()); // KeepAlive
        this.serverTranslators.set(0x14, new PlayerPositionTranslator_1.PlayerPositionTranslator()); // Player Position and Rotation
        this.serverTranslators.set(0x0F, new ChatMessageTranslator_1.ChatMessageTranslator()); // Chat Message
        this.serverTranslators.set(0x1B, new DisconnectTranslator_1.DisconnectTranslator()); // Disconnect
        // Add more
    }
    handleClientPacket(session, data) {
        const packet = this.codec.decodeWebSocketFrame(data);
        const translator = this.clientTranslators.get(packet.id);
        if (translator) {
            const mcPacket = translator.toMinecraft(packet);
            session.tcp.send(this.codec.encodeMinecraftPacket(mcPacket));
        }
    }
    handleServerPacket(session, data) {
        const packet = this.codec.decodeMinecraftPacket(data);
        const translator = this.serverTranslators.get(packet.id);
        if (translator) {
            const wsFrame = translator.fromMinecraft(packet);
            session.ws.send(this.codec.encodeWebSocketFrame(wsFrame));
        }
    }
}
exports.PacketRouter = PacketRouter;
