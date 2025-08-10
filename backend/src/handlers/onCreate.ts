import { WebSocket } from "ws";
import { player_Init } from "../player/playerInit";
import { generatePara, sendJSON } from "../gameLogic/helperFunc";
import { RoomManager } from "../room/roomManager";
import { room_Init } from "../room/roomInit";
import { messageTypes } from "../types";

export default async function handleCreate(
  connection: WebSocket,
  uuid: string,
  data: Extract<messageTypes, { type: "TOKEN_CREATE" }>,
  roomManager: RoomManager,
) {
  let newPlayer = player_Init(data.gamerId, connection, uuid);

  const safeTime =
    typeof data.time === "number" && data.time > 0 && data.time <= 300
      ? data.time
      : 45;
  const sentence = "";
  const room = new room_Init(
    data.roomId,
    data.roomPass,
    sentence,
    safeTime,
    newPlayer,
  );
  roomManager.add(room);
  if (roomManager.has(data.roomId)) {
    sendJSON(connection, {
      type: "FEEDBACK",
      code: "ROOM_CREATED",
      msg: "room created successfully",
    });
    const groq_sentence = await generatePara(safeTime); //generate sentences through groq;
    room.setSentence(groq_sentence);
  }
  return newPlayer;
}
