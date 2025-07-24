/src
├── server.ts                 ← WebSocket server bootstrap
├── types.ts                  ← shared types/interfaces (Player, Room, etc.)
├── player/
│   ├── index.ts              ← high-level player functions (createPlayer, updatePing)
│   ├── session.ts            ← handles reconnection, isAlive, ping
│   └── rating.ts             ← (future) ELO logic
├── room/
│   ├── index.ts              ← createRoom, joinRoom, leaveRoom, etc.
│   ├── turn.ts               ← logic for currentTurn, timer, next player
│   └── state.ts              ← serialization, syncing room state
├── ws/
│   ├── index.ts              ← connection handler
│   ├── router.ts             ← routes messages to handlers
│   ├── parser.ts             ← parse + validate incoming messages
│   └── handlers/
│       ├── handleJoin.ts
│       ├── handlePing.ts
│       ├── handleTyping.ts
│       └── ...

