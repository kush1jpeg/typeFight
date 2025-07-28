import { WebSocket, WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import { IncomingMessage } from "http";
import { server } from "./express";
import { handleTokens } from "../gameLogic/tokenHandler";

// to store all the connections with uuid as the key
export const connections = new Map<string, WebSocket>(); // to display the no of active users!

export const wsServer = new WebSocketServer({ server }); //new server

// player connects
wsServer.on("connection", (connection: WebSocket, request: IncomingMessage) => {
  console.log(`wsServer connected`);
  const uuid = uuidv4();
  connections.set(uuid, connection);

  if (!request.url) {
    console.error("Missing URL in WebSocket request.");
    return;
  }
  connection.on("message", (msg) => {
    try {
      const data = JSON.parse(msg.toString());
      handleTokens(uuid, data, connection);
    } catch (err) {
      console.error("Invalid message", err);
    }
  });

  connection.on("close", () => {
    console.log("WebSocket closed:", uuid);
    // Cleanup if needed
  });
});
