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

export function handleTokens(
  uuid: string,
  data: messageTypes,
  connection: WebSocket,
) {
  let player: Player | null = null;
  switch (data.type) {
    case "TOKEN_JOIN":
      {
        player = handleJoin(connection, uuid, data, roomManager);
      }
      break;

    case "TOKEN_CREATE":
      {
        player = handleCreate(connection, uuid, data, roomManager);
      }
      break;

    case "KEY_PRESS":
      {
        handleKeyPress(connection, data, roomManager);
      }
      break;

    case "RESIGN":
      {
        if (player) {
          handleDelete(player);
        }
      }
      break;

    case "TOKEN_PONG":
      {
        if (player) {
          const timestamp = Date.now();
          startPingLoop(player, timestamp);
        }
      }
      break;
    case "FEEDBACK": {
      if (data.code == "READY") {
        console.log("received ready by the backend");
        player = roomManager.getPlayerByUUID(data.msg, uuid);
        if (player) roundCheck(data.msg, player);
      }

      if (data.code == "NO_RESPONSE") {
        const roomId = data.msg;
        if (handleDelete(roomId)) {
          sendJSON(connection, {
            type: "FEEDBACK",
            code: "ROOM_DELETED",
            msg: "The room was deleted due to inactivity",
          });
        }
      }
    }
  }
}
