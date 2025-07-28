import { WebSocket } from "ws";
import Player, { player_Init } from "../player/playerInit";
import { sendJSON } from "../gameLogic/helperFunc";
import { RoomManager } from "../room/roomManager";
import { messageTypes } from "../types";

export default function handleJoin(
  connection: WebSocket,
  uuid: string,
  data: Extract<messageTypes, { type: "TOKEN_JOIN" }>,
  roomManager: RoomManager,
) {
  let newPlayer = player_Init(data.gamerId, connection, uuid);
  if (roomManager.has(data.roomId)) {
    const room = roomManager.get(data.roomId);
    if (room && Object.keys(room.players).length < 2) {
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
  return newPlayer;
}
