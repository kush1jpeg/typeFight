import type { messageTypes } from "../types";
import { sendWs } from "./components/socket";
import { set_toast } from "./components/toast";


export function handleIncoming(data: messageTypes) {
  switch (data.type) {
    case "FEEDBACK":
      {
        set_toast(data.msg,"success")
      }
      break;

    case "TOKEN_PING":
      {
//pong to be be send its like 
sendWs({ type: "pong", timestamp: data.timestamp })
      }
      break;

    case "ERROR":
      {
      }
      break;
  }
}
