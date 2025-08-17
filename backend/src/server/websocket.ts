import { WebSocket, WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import { sendJSON } from "../gameLogic/helperFunc";
import { IncomingMessage } from "http";
import { server } from "./express";
import { handleTokens, redis } from "../gameLogic/tokenHandler";
import { playerData } from "../types";

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
      console.log("received by backend", data);

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

        const playerData: playerData = {
          uuid: redisData.uuid,
          gamerId: redisData.gamerId,
          roomId: redisData.roomId,
          status: redisData.status,
          cursor: Number(redisData.cursor) || 0,
          fuzzy: Number(redisData.fuzzy) || 0,
        };
        sendJSON(connection, {
          type: "RECONNECT_SUCCESS",
          player: playerData,
          roomId: playerData.roomId,
        });
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
