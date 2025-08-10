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

 
✅ Frontend Responsibilities
Render green/red letters based on sentence.

Update the cursor and typed array.

Do not trust the client to declare win/score.

🔁 Backend Responsibilities
Receive each keystroke or batch.

Validate char-by-char using the ground truth sentence.

Enforce cursor position to detect skipping.

Track accuracy/WPM.

Decide round over and declare winner.

Basically, you fake it on frontend for snappiness, but you trust only the backend to decide outcomes.
