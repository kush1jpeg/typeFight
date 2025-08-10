import { WebSocket } from "ws";
import handleJoin from "../handlers/onJoin";
import { RoomManager } from "../room/roomManager";
import { messageTypes } from "../types";
import handleCreate from "../handlers/onCreate";
import handleKeyPress from "../handlers/onKeyPress";
import { startPingLoop } from "../handlers/onPong";
import Player from "../player/playerInit";
import { handleDelete, roundCheck } from "../handlers/onResign";
import { sendJSON } from "./helperFunc";

export const roomManager = new RoomManager();

export async function handleTokens(
  uuid: string,
  data: messageTypes,
  connection: WebSocket,
) {
  let player: Player | null = null;
  switch (data.type) {
    case "TOKEN_JOIN":
      {
        player = await handleJoin(connection, uuid, data, roomManager);
      }
      break;

    case "TOKEN_CREATE":
      {
        player = await handleCreate(connection, uuid, data, roomManager);
      }
      break;

    case "WORD_TYPED":
      {
        handleKeyPress(connection, data, roomManager);
      }
      break;

    case "RESIGN":
      {
        const player = data.playerId;
        if (player) {
          handleDelete(data.roomId);
        }
      }
      break;

    case "TOKEN_PONG":
      {
        const player = roomManager.getPlayerByUUID(uuid);
        if (player) {
          const timestamp = Date.now();
          startPingLoop(player, timestamp);
        }
      }
      break;
    case "FEEDBACK": {
      if (data.code == "READY") {
        console.log("received ready by the backend");
        const player = roomManager.getPlayerByUUID(uuid);
        if (player) roundCheck(data.msg, player);
      }

      if (data.code == "NO_RESPONSE") {
        const roomId = data.msg;
        const room = roomManager.get(roomId);
        if (handleDelete(roomId) && room) {
          for (const p of Object.values(room.players)) {
            sendJSON(p.socket, {
              type: "FEEDBACK",
              code: "ROOM_DELETED",
              msg: "The room was deleted due to inactivity",
            });
          }
        }
      }
    }
  }
}
