"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TcpClient = void 0;
const net_1 = require("net");
const VarInt_1 = require("../utils/VarInt");
const PacketCodec_1 = require("../protocol/PacketCodec");
class TcpClient {
    constructor(packetRouter) {
        this.socket = null;
        this.host = '';
        this.port = 0;
        this.packetRouter = packetRouter;
        this.codec = new PacketCodec_1.PacketCodec();
    }
    connect(host, port, session) {
        this.host = host;
        this.port = port;
        this.session = session;
        this.socket = new net_1.Socket();
        this.socket.connect(port, host, () => {
            console.log(`TCP connected to ${host}:${port}`);
            // Handshake will be sent when client sends login
        });
        this.socket.on('data', (data) => {
            console.log('Received TCP data:', data.length, 'bytes');
            this.handleData(data);
        });
        this.socket.on('close', () => {
            console.log('TCP connection closed');
        });
        this.socket.on('error', (error) => {
            console.error('TCP error:', error);
        });
    }
    sendHandshake() {
        // Handshake packet: protocol version (VarInt), server address (string), server port (uint16), next state (VarInt: 2 for login)
        const protocolVersion = 763; // 1.20.1
        const serverAddress = this.host; // Use the actual host from config
        const serverPort = this.port;
        const nextState = 2; // login
        const protocolEncoded = VarInt_1.VarInt.encode(protocolVersion);
        const addressEncoded = Buffer.concat([VarInt_1.VarInt.encode(serverAddress.length), Buffer.from(serverAddress, 'utf8')]);
        const portEncoded = Buffer.alloc(2);
        portEncoded.writeUInt16BE(serverPort, 0);
        const nextStateEncoded = VarInt_1.VarInt.encode(nextState);
        const data = Buffer.concat([protocolEncoded, addressEncoded, portEncoded, nextStateEncoded]);
        const packet = { id: 0x00, data };
        console.log('Sending handshake packet with protocol', protocolVersion, 'address', serverAddress);
        this.send(this.codec.encodeMinecraftPacket(packet));
    }
    send(data) {
        if (this.socket) {
            this.socket.write(data);
        }
    }
    disconnect() {
        if (this.socket) {
            this.socket.end();
            this.socket = null;
        }
    }
    handleData(data) {
        // Decode Minecraft packet and route
        this.packetRouter.handleServerPacket(this.session, data);
    }
}
exports.TcpClient = TcpClient;
