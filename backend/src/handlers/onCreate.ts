import { WebSocket } from "ws";
import { player_Init } from "../player/playerInit";
import { generatePara, sendJSON } from "../gameLogic/helperFunc";
import { room_Init } from "../room/roomInit";
import { messageTypes } from "../types";
import { redis, roomManager } from "../gameLogic/tokenHandler";

export default async function handleCreate(
  connection: WebSocket,
  uuid: string,
  data: Extract<messageTypes, { type: "TOKEN_CREATE" }>,
) {
  let newPlayer = player_Init(data.gamerId, connection, uuid);

  const safeTime =
    typeof data.time === "number" && data.time > 0 && data.time <= 90
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

  // handling redis
  await redis.hset(`player:${uuid}`, {
    // to store the player as a hash
    uuid: uuid,
    gamerId: newPlayer.gamerId,
    roomId: data.roomId,
    status: "online",
    cursor: newPlayer.cursor,
    fuzzy: newPlayer.fuzzy,
  });

  await redis.expire(`player:${uuid}`, room.time + 90); // to auto expire after 90 seconds

  await redis.sadd(`room:${data.roomId}:players`, uuid); // to track the players linked to the room

  await redis.expire(`room:${data.roomId}:players`, room.time + 90);

  roomManager.add(room);
  if (roomManager.has(data.roomId)) {
    sendJSON(connection, {
      type: "FEEDBACK",
      code: "ROOM_CREATED",
      msg: "room created successfully",
    });
  }
  try {
    const groq_sentence = await generatePara(safeTime); //generate sentences through groq;
    room.setSentence(groq_sentence);
  } catch (err) {
    console.error("Sentence generation failed:", err);
  }
  return newPlayer;
}
