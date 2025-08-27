import { WebSocket, WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import { sendJSON } from "../gameLogic/helperFunc";
import { IncomingMessage } from "http";
import { server } from "./express";
import { handleTokens, redis, roomManager } from "../gameLogic/tokenHandler";
import { playerData } from "../types";
import { roundTimeCHECK } from "../handlers/onResign";

// to store all the connections with uuid as the key
export const connections = new Map<string, WebSocket>(); // to display the no of active users!

export const wsServer = new WebSocketServer({ server }); //new server

// player connects
wsServer.on("connection", (connection: WebSocket, request: IncomingMessage) => {
  console.log(`wsServer connected`);

  if (!request.url) {
    console.error("Missing URL in WebSocket request.");
    return;
  }

  let uuid: string | null = null; // we don’t assign this fucking yet

  connection.on("message", async (msg) => {
    try {
      const data = JSON.parse(msg.toString());

      // If this is a reconnect, use existing UUID
      if (data.type === "RECONNECT" && data.uuid) {
        uuid = data.uuid; // take the old UUID from client
        if (!uuid) {
          sendJSON(connection, {
            type: "FEEDBACK",
            msg: "UUID is missing",
            code: "UUID_MISS",
          });
          return;
        }
        connections.set(uuid, connection);
        console.log(uuid);
        const roomId = await redis.hget(`player:${uuid}`, "roomId");
        if (roomId) {
          if (!(await redis.sismember(`room:${roomId}:players`, uuid))) {
            sendJSON(connection, {
              type: "FEEDBACK",
              msg: "Room expired",
              code: "ROOM_NOT_FOUND",
            });

            // treat as a new player ->
            uuid = uuidv4();
            connections.set(uuid, connection);
            console.log("UUID Not found");
            sendJSON(connection, { type: "UUID-SET", uuid });
            return;
          }
        } else {
          console.log("received new");
          uuid = uuidv4();
          connections.set(uuid, connection);
          console.log(uuid, "->new connection");
          sendJSON(connection, { type: "UUID-SET", uuid });
          return;
        }

        const redisData = await redis.hgetall(`player:${uuid}`);
        console.log("redisData", redisData);
        const timeLeft = Number(await redis.hget(`room:${roomId}`, "timeLeft"));
        const players = await redis.smembers(`room:${roomId}:players`); // [uuid1, uuid2]
        const oppUuid = players.find((id) => id !== uuid);
        if (!oppUuid) return;
        const oppId = roomManager.getPlayerByUUID(oppUuid)?.gamerId;
        const oppCursor =
          Number(await redis.hget(`player:${oppUuid}`, "cursor")) || 0;
        const sentence =
          (await redis.hget(`room:${roomId}`, "sentence")) ||
          "No sentence found";
        if (!oppId) return;
        console.log("sending the reconnect data");
        const playerData: playerData = {
          uuid: redisData.uuid,
          gamerId: redisData.gamerId,
          roomId: redisData.roomId,
          status: redisData.status,
          cursor: Number(redisData.cursor) || 0,
          oppId: oppId,
          oppCursor: oppCursor,
          timeLeft,
          sentence,
        };
        sendJSON(connection, {
          type: "RECONNECT_SUCCESS",
          player: playerData,
          roomId: playerData.roomId,
        });

        sendJSON(connection, {
          type: "FEEDBACK",
          code: "ROUND_START",
          msg: "The round is starting",
        });

        const room = roomManager.get(roomId);
        if (room) roundTimeCHECK(timeLeft, room);
      }

      // If this is a new connection and uuid hasn’t been set yet
      if (!uuid && data.type == "NEW") {
        console.log("received new");
        uuid = uuidv4();
        connections.set(uuid, connection);
        console.log(uuid, "->new connection");
        sendJSON(connection, { type: "UUID-SET", uuid });
      }

      if (!uuid) return;
      handleTokens(uuid, data, connection);
    } catch (err) {
      console.error("Invalid message", err);
    }
  });

  connection.on("close", () => {
    console.log("WebSocket closed:", uuid);
    if (uuid) connections.delete(uuid);
  });
});
