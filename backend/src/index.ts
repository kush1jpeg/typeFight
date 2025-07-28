import dotenv from "dotenv";
dotenv.config({ override: true });

import { server } from "./server/express";

const PORT = process.env.PORT || 4321;
server.listen(PORT, () =>
  console.log(`http + wsServer running on port:${PORT}/`),
);
