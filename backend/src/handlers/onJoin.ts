import { WebSocket } from "ws";
import { player_Init } from "../player/playerInit";
import { sendJSON } from "../gameLogic/helperFunc";
import { messageTypes } from "../types";
import { redis, roomManager } from "../gameLogic/tokenHandler";

export default async function handleJoin(
  connection: WebSocket,
  uuid: string,
  data: Extract<messageTypes, { type: "TOKEN_JOIN" }>,
) {
  let newPlayer = player_Init(data.gamerId, connection, uuid);
  if (roomManager.has(data.roomId)) {
    const room = roomManager.get(data.roomId);
    if (room && Object.keys(room.players).length < 2) {
      room.players[newPlayer.gamerId] = newPlayer;
      sendJSON(connection, {
        type: "FEEDBACK",
        code: "ROOM_JOIN",
        msg: "Room joined successfully",
      });

      // to send joining msg to the player
      const otherPlayer = Object.values(room.players).find(
        (p) => p.gamerId !== newPlayer.gamerId,
      );

      const otherPlayerWS = otherPlayer?.socket;
      otherPlayerWS &&
        sendJSON(otherPlayerWS, {
          type: "FEEDBACK",
          code: "OPP_JOINED",
          msg: `Room joined by ${data.gamerId}`,
        });

      // redis-
      await redis.hset(`player:${uuid}`, {
        uuid: uuid,
        gamerId: newPlayer.gamerId,
        roomId: data.roomId,
        status: "online",
        cursor: newPlayer.cursor,
        fuzzy: newPlayer.fuzzy,
      });

      await redis.sadd(`room:${data.roomId}:players`, uuid);

      // to send all the players about the roomInfo
      console.log(
        "[handleJoin] Current sentence length:",
        room.sentence.length,
      );
      if (otherPlayer && room.sentence.length > 0 && room.sentence) {
        console.log("[handleJoin] Sentence ready, skipping wait");
        const players = Object.values(room?.players);
        for (const p of players) {
          sendJSON(p.socket, {
            type: "ROOM_INFO",
            sentence: room.sentence,
            player1: newPlayer.gamerId,
            player2: otherPlayer.gamerId,
          });
        }
      } else {
        console.log("[handleJoin] Waiting for sentence event");
        // Sentence not ready, wait for event with timeout
        try {
          const sentence = await new Promise<string>((resolve, reject) => {
            const timeout = setTimeout(() => {
              room.removeListener("sentenceReady", onSentenceReady);
              reject(new Error("Timeout waiting for sentence"));
            }, 5000);

            function onSentenceReady(sen: string) {
              clearTimeout(timeout);
              if (!room) return;
              room.off("sentenceReady", onSentenceReady);
              resolve(sen);
            }

            room.on("sentenceReady", onSentenceReady);
          });
          room.sentence = sentence;
        } catch (err) {
          console.warn("Timeout waiting for sentence, proceeding anyway", err);
        }
      }
    } else {
      sendJSON(connection, {
        type: "FEEDBACK",
        code: "ROOM_FULL",
        msg: "Room full",
      });
    }
  } else {
    sendJSON(connection, {
      type: "FEEDBACK",
      code: "ROOM_NOT_FOUND",
      msg: "Requested room was not found",
    });
  }
  return newPlayer;
}
