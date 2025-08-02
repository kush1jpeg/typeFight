import dotenv from "dotenv";
dotenv.config({ override: true });

import { server } from "./server/express";
import "./server/websocket"

const PORT = process.env.PORT || 7654;
server.listen(PORT, () =>
  console.log(`http + wsServer running on port:${PORT}/`),
);
