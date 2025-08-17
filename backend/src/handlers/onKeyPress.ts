import { WebSocket } from "ws";
import { RoomManager } from "../room/roomManager";
import { fuzzyCheck, sendJSON } from "../gameLogic/helperFunc";
import { messageTypes } from "../types";
import { redis } from "../gameLogic/tokenHandler";

export default async function handleKeyPress(
  connection: WebSocket,
  data: Extract<messageTypes, { type: "WORD_TYPED" }>,
  roomManager: RoomManager,
) {
  const room = roomManager.get(data.roomId);
  const player = room?.players[data.playerId];

  if (!room || !player) {
    sendJSON(connection, {
      type: "FEEDBACK",
      code: "ROOM/PLAYER_NOT_FOUND",
      msg: "Room or player not found",
    });
    return;
  }
  const cursor = player.cursor;
  const playerId = player.gamerId;
  const opponent = Object.values(room.players).find(
    (pre) => pre.gamerId !== playerId,
  );

  const sentence = room.sentence;
  if (!sentence || typeof player.cursor !== "number" || !opponent) {
    sendJSON(connection, {
      type: "FEEDBACK",
      code: "DATA_NOT_FOUND",
      msg: "Cursor or sentence or opponent not found",
    });
    return;
  }

  switch (data.code) {
    case "WORD_BOUNDARY": {
      // This means: player hit space so commit word
      player.typed += data.word;

      // Checking for squiggle
      const split: Array<string> = sentence.split(" ");
      console.log(
        "typedWord - ",
        data.word.trim(),
        "actualWord - ",
        split[cursor],
      );
      const dist = fuzzyCheck(split[cursor].trim(), data.word.trim());

      const results = await redis
        .multi()
        .hincrby(`player:${player.uuid}`, "fuzzy", dist)
        .hincrby(`player:${player.uuid}`, "cursor", 1)
        .exec();

      if (!results) throw new Error("Redis multi failed");

      const newFuzzy = results[0][1] as number; // redis returns responses in the form of array
      const newCursor = results[1][1] as number;

      player.fuzzy = newFuzzy; // to calc the no of mistakes;
      player.update_cursorPos(newCursor);

      if (dist > Math.floor(data.word.length * 0.3)) {
        // sending to opponent inorder to squiggle mine cursor on mistakes
        if (opponent) {
          sendJSON(opponent.socket, {
            type: "GAME_RES",
            code: "SQUIGGLE",
            player: playerId,
            data: {
              index: data.word.length,
              status: true,
            },
          });
          console.log("squiggle");
        }
      } else {
        sendJSON(opponent.socket, {
          type: "GAME_RES",
          code: "UPDATE",
          player: playerId,
          data: {
            index: data.word.length,
            status: false,
          },
        });
      }

      break;
    }
  }
}
