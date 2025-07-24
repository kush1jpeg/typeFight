import dotenv from "dotenv";
dotenv.config({ override: true });

import express from "express";
import { WebSocket, WebSocketServer } from "ws";
import http, { IncomingMessage } from "http";
import { v4 as uuidv4 } from "uuid";
import Player, { player_Init } from "./player/playerInit";
import { startPingLoop } from "./player/ping";
import { messageTypes } from "./types";
import { RoomManager } from "./room/roomManager";
import { room_Init } from "./room/roomInit";
import { fuzzyCheck, sendJSON } from "./gameLogic/helperFunc";
import { send } from "process";

const PORT = process.env.PORT || 4321;

const app = express();
app.use(express.json());
const server = http.createServer(app);

// to store all the connections with uuid as the key
export const connections = new Map<string, WebSocket>();

export const wsServer = new WebSocketServer({ server }); //new server

// player connects
wsServer.on("connection", (connection: WebSocket, request: IncomingMessage) => {
  console.log(`wsServer connected on ${PORT}`);
  const uuid = uuidv4();
  connections.set(uuid, connection);

  const roomManager = new RoomManager(); //main RoomManager for all the connections;
  if (!request.url) {
    console.error("Missing URL in WebSocket request.");
    return;
  }
  connection.on("message", (msg: string | Buffer) => {
    try {
      let newPlayer: Player | null = null;
      const data = JSON.parse(msg.toString()) as messageTypes;
      switch (data.type) {
        case "TOKEN_JOIN":
          {
            // iuse roomid and rooms to do so and add user
            newPlayer = player_Init(data.gamerId, connection, uuid);
            if (roomManager.has(data.roomId)) {
              const room = roomManager.get(data.roomId);
              if (room && Object.keys(room.players).length <= 2) {
                room.players[newPlayer.gamerId] = newPlayer;
              } else {
                sendJSON(connection, {
                  type: "ERROR",
                  code: "ROOM_FULL",
                });
              }
            } else {
              sendJSON(connection, {
                type: "ERROR",
                code: "ROOM_NOT_FOUND",
              });
            }
          }
          break;

        case "TOKEN_CREATE":
          {
            newPlayer = player_Init(data.gamerId, connection, uuid);
            const sentence = ""; //generate sentences through groq;
            const room = new room_Init(
              data.roomId,
              data.roomPass,
              sentence,
              data.time,
              newPlayer,
            );
            roomManager.add(room);
            if (roomManager.has(data.roomId)) {
              sendJSON(connection, {
                type: "SUCCESS",
                code: "ROOM_CREATED",
                sentence,
              });
            }
          }
          break;

        case "KEY_PRESS":
          {
            let player = roomManager.get(data.roomId)?.players[data.playerId];
            let room = roomManager.get(data.roomId);
            let playerId = player?.gamerId;
            let cursor = player?.cursor;
            let typedWord = "";
            let wordIndex = 0;

            if (!room || typeof cursor != "number" || !playerId) {
              sendJSON(connection, {
                type: "ERROR",
                code: "ROOM/CURSOR_NOT_FOUND",
              });
              return;
            }

            let actualWord = roomManager.get_actualWord(wordIndex, room);
            let opponent = roomManager.getOpponentId(room, playerId);

            //for the stupid fuzzy check
            if (data.char == " ") {
              //word complete
              wordIndex += 1;
              typedWord = roomManager.get_typedWord(wordIndex, room, playerId);
              let res = fuzzyCheck(actualWord, typedWord);
              if (res == 1) {
                sendJSON(connection, {
                  type: "SQUIGGLE",
                  player: opponent,
                  /*  to id bw the opp and player cursor <add fuzzy check to opponent's ghost cursor,
                            if the name is mine then squiggle the ghost cursor of the opponent */
                  data: {
                    index: cursor,
                    status: "FUZZY so squiggle",
                  },
                });
              }
              typedWord = "";
              actualWord = "";
            }
            if (data.char === "BACK_SPACE") {
              player?.set_backSpace();
            } else if (data.char == room?.sentence[cursor]) {
              player?.set_typed(data.char);
              player?.update_cursorPos(++cursor);
              sendJSON(connection, {
                type: "FEEDBACK",
                player: playerId,
                data: {
                  index: cursor,
                  status: "right_char",
                },
              });
            } else {
              player?.set_typed(data.char);
              player?.update_cursorPos(++cursor);
              sendJSON(connection, {
                type: "FEEDBACK",
                player: player?.gamerId,
                data: {
                  player: {
                    index: cursor,
                    status: "wrong_char",
                  },
                },
              });
            }
          }
          break;

        case "TOKEN_PONG":
          {
            if (newPlayer) {
              // calc the ping;
              const timestamp = Date.now();
              startPingLoop(newPlayer, timestamp); //client handles the pong
            }
          }
          break;

        default: {
          console.warn(`Unhandled message type: ${data}`);
        }
      }

      // using roomManager to add players and other info
    } catch (error) {}
  });
});

server.listen(PORT, () => console.log(`Server running on port:${PORT}/`));
