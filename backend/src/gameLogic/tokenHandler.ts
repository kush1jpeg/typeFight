import { WebSocket } from "ws";
import handleJoin from "../handlers/onJoin";
import { RoomManager } from "../room/roomManager";
import { messageTypes } from "../types";
import handleCreate from "../handlers/onCreate";
import handleKeyPress from "../handlers/onKeyPress";
import Player from "../player/playerInit";
import { handleDelete, handleRestart, roundCheck } from "../handlers/onResign";
import { sendJSON } from "./helperFunc";
import { handlePingPong } from "../handlers/onPong";

// redis.ts
import Redis from "ioredis";
export const redis = new Redis(6379); // its the default dono why i even harcoded it->lol
redis.on("connect", () => {
  console.log("Redis server connected");
});

redis.on("error", (err) => {
  console.error(" Redis connection error:", err);
  return;
});

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
        player = await handleJoin(connection, uuid, data);
      }
      break;

    case "TOKEN_CREATE":
      {
        player = await handleCreate(connection, uuid, data);
      }
      break;

    case "WORD_TYPED":
      {
        handleKeyPress(connection, data);
      }
      break;

    case "ROOM_DELETE":
      {
        if (await handleDelete(data.roomId)) console.log("Room deleted");
      }
      break;

    case "ROUND_RESTART":
      {
        await handleRestart(data.roomId);
        console.log("Room Restart");
      }
      break;

    case "MESSAGE":
      {
        const room = roomManager.get(data.roomId);
        if (!room) return;
        const target = Object.values(room.players).find((p) => {
          p.gamerId != data.playerId;
        });
        if (!target) return;
        sendJSON(target.socket, {
          type: "SERVER_MESSAGE",
          msg: data.msg,
        });
      }
      break;

    case "TOKEN_PONG": {
      const player = roomManager.getPlayerByUUID(uuid);
      if (!player) break;
      handlePingPong(player, data.timestamp);
      const room = roomManager.getRoomByPlayerUUID(player.uuid);
      if (room) roomManager.broadcastPingUpdate(room);
      break;
    }

    case "FEEDBACK": {
      if (data.code == "READY") {
        console.log("received ready by the backend");
        const player = roomManager.getPlayerByUUID(uuid);
        console.log("Player name = ", player?.gamerId);
        if (player) await roundCheck(data.msg, player);
      }

      if (data.code == "NO_RESPONSE") {
        const roomId = data.msg;
        const room = roomManager.get(roomId);
        if ((await handleDelete(roomId)) && room) {
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
