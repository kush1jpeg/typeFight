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
      sendJSON(connection, {
        type: "FEEDBACK",
        code: "ROOM_JOIN",
        msg:"Room joined successfully"
      });
    } else {
      sendJSON(connection, {
        type: "FEEDBACK",
        code: "ROOM_FULL",
        msg:"Room full"
      });
    }
  } else {
    sendJSON(connection, {
      type: "FEEDBACK",
       code: "ROOM_NOT_FOUND",
      msg:"Requested room was not found"
    });
  }
  return newPlayer;
}
