import { WebSocket } from "ws";
import { RoomManager } from "../room/roomManager";
import { checkChar, fuzzyCheck, sendJSON } from "../gameLogic/helperFunc";
import { messageTypes } from "../types";

export default function handleKeyPress(
  connection: WebSocket,
  data:Extract <messageTypes, { type: "KEY_PRESS" }> ,
  roomManager: RoomManager,
) {
  let player = roomManager.get(data.roomId)?.players[data.playerId];
  let room = roomManager.get(data.roomId);
  let playerId = player?.gamerId;
  let cursor = player?.cursor;
  let typedWord = "";
  let wordIndex = 0;

  if (!room || typeof cursor != "number" || !playerId) {
    sendJSON(connection, {
      type: "FEEDBACK",
      code: "ROOM/CURSOR_NOT_FOUND",
      msg:"the room or the cursor not found"
    });
    return;
  }

  switch (data.char) {
    case " ":
      {
        let opponent = roomManager.getOpponentId(room, playerId);
        if (!opponent)return;
        let actualWord = roomManager.get_actualWord(wordIndex, room);
        typedWord = roomManager.get_typedWord(wordIndex, room, playerId);
        wordIndex += 1;
        let res = fuzzyCheck(actualWord, typedWord);
        if (res == 1) {
          sendJSON(connection, {
            type: "GAME_RES", 
            player: opponent,
            code:"FUZZY",
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
      break;

    case "BACK_SPACE":
      {
        player?.set_backSpace();
      }
      break;

    //                 handle for the RESIGN final using esc in the frontend!

    default:
      {
        let res = checkChar(data.char, room.sentence[cursor]);
        player?.set_typed(data.char);
        player?.update_cursorPos(++cursor);

        sendJSON(connection, {
          type: "GAME_RES",
          code:"CHAR_CHECK",
          player: playerId,
          data: {
            index: cursor,
            status: res == 1 ? "right_char" : "wrong char",
          },
        });
      }
      break;
  }
}
