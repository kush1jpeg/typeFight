import { WebSocket } from "ws";
import { RoomManager } from "../room/roomManager";
import { fuzzyCheck, sendJSON } from "../gameLogic/helperFunc";
import { messageTypes } from "../types";

export default function handleKeyPress(
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

  const cursor = player.cursor;
  const playerId = player.gamerId;

  switch (data.code) {
    case "WORD_BOUNDARY": {
      // This means: player hit space, enter, or moved cursor — commit word
      player.typed += data.word;

      // Checking for squiggle
      const split: Array<string> = sentence.split(" ");
      console.log(
        "typedWord - ",
        data.word.trim(),
        "actualWord - ",
        split[cursor],
      );
      const dist = fuzzyCheck(split[cursor], data.word.trim());
      if (dist > Math.floor(data.word.length * 0.3)) {
        // sending to opponent inorder to squiggle mine cursor on mistakes
        if (opponent) {
          sendJSON(opponent.socket, {
            type: "GAME_RES",
            code: "SQUIGGLE",
            player: playerId,
            data: {
              index: cursor,
              status: true,
            },
          });
        }
      } else {
        sendJSON(opponent.socket, {
          type: "GAME_RES",
          code: "UPDATE",
          player: playerId,
          data: {
            index: cursor,
            status: false,
          },
        });
      }

      // Save word and move cursor
      player.words[cursor] = data.word;
      player.update_cursorPos(cursor + 1);
      break;
    }
  }
}
