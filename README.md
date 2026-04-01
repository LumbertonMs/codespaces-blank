# WebSocket-to-Minecraft Gateway

A standalone Node.js application that acts as a gateway between browser-based clients using a custom WebSocket protocol and a modern Java Edition Minecraft server.

## Features

- WebSocket server accepting custom-framed binary messages from browser clients
- TCP client connecting to backend Minecraft server with standard protocol
- Packet translation between custom opcodes and Minecraft Java Edition protocol
- Modular packet translator architecture
- Support for login, keepalive, movement, chat, and disconnect events
- Deployable on Render.com

## Custom Protocol

### Client to Gateway (WebSocket Frames)
Frames use format: `[opcode: uint8] [length: VarInt] [payload: bytes]`

- `0x00`: Login Request - payload: username (string)
- `0x01`: Keepalive Response - payload: keepalive ID (int64)
- `0x02`: Movement Input - payload: x, y, z (double), yaw, pitch (float), onGround (bool)
- `0x03`: Chat Message - payload: message (string)

### Gateway to Client (WebSocket Frames)
- `0x00`: Login Success - payload: login success data
- `0x01`: Join World - payload: join game data
- `0x02`: Keepalive Request - payload: keepalive ID (int64)
- `0x03`: Movement Update - payload: x, y, z (double), yaw, pitch (float), onGround (bool)
- `0x04`: Chat Message - payload: message (string)
- `0x05`: Disconnect - payload: reason (string)

## Setup

1. Clone this repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Run the gateway: `npm start`

## Configuration

Edit `config.json` to change backend server settings:

```json
{
  "backend_host": "fluxskyblock.mcsh.io",
  "backend_port": 10395,
  "max_clients": 200
}
```

## Architecture

- `/src/gateway`: Main gateway logic and session management
- `/src/protocol`: Packet encoding/decoding
  - `/client`: Client-side protocol handling
  - `/server`: Server-side protocol handling
- `/src/packets`: Individual packet definitions and translators
- `/src/ws`: WebSocket server implementation
- `/src/tcp`: TCP client for backend connection
- `/src/utils`: Utility functions

## Deployment on Render.com

1. Connect your GitHub repository to Render.com
2. Create a new **Web Service**
3. Select **Node.js** as the runtime/language
4. Configure the following settings:
   - **Root Directory**: Leave empty (uses repository root)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Publish Directory**: Leave empty (not needed for Node.js apps)
5. Render will automatically set the `PORT` environment variable

## Packet Translators

The gateway uses a modular system for translating packets:

- `HandshakeTranslator`: Handles login requests and success
- `KeepAliveTranslator`: Manages keepalive packets
- `PlayerPositionTranslator`: Translates movement data
- `ChatMessageTranslator`: Handles chat messages
- `JoinGameTranslator`: Processes join game events
- `DisconnectTranslator`: Manages disconnections

## Notes

This implementation uses original packet structures and logic, not derived from proprietary sources. It is designed to work with Eaglercraft-inspired clients but implements its own protocol.