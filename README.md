# Mini Teams-like Chat (Node + Express + Socket.IO)

A minimal Microsoft Teams-like chat: teams, channels, and real-time messaging with presence and typing indicators. Data is stored locally in `data/db.json`.

## Features
- Teams and channels CRUD (create via UI)
- Real-time messaging via Socket.IO
- Presence per team, typing indicators per channel
- JSON file persistence (no external DB)

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the server (port 3000 by default):

```bash
npm run start
```

If port 3000 is busy, run on another port:

```bash
PORT=3001 npm run start
```

3. Open the app:

- Navigate to `http://localhost:3000` (or your chosen port)

4. Dev mode with auto-restart:

```bash
npm run dev
```

## API (for reference)

- `GET /api/teams` → list teams
- `POST /api/teams` `{ name }` → create team
- `GET /api/teams/:teamId/channels` → list channels of a team
- `POST /api/teams/:teamId/channels` `{ name }` → create channel in a team
- `GET /api/channels/:channelId/messages?limit=50` → latest messages

## Socket Events

- Client → Server
  - `register` `{ name }`
  - `joinTeam` `{ teamId }`
  - `joinChannel` `{ channelId }`
  - `message:send` `{ channelId, text }`
  - `typing:start` `{ channelId }`
  - `typing:stop` `{ channelId }`

- Server → Client
  - `team:created` team
  - `channel:created` channel
  - `message:new` message
  - `presence:update` `{ teamId, count }`
  - `typing` `{ channelId, name, isTyping }`

## Project Structure

```
public/         # Static frontend (served by Express)
src/
  server.js     # Express + Socket.IO server
  store.js      # Simple JSON "database"
data/
  db.json       # Auto-created and persisted
```

## Notes
- This is a demo; no authentication or authorization.
- Single-process in-memory cache with disk persistence. Not suitable for multi-instance without a real DB.
- If you edit `data/db.json` manually, stop the server first to avoid partial writes.
