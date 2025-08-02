import type { messageTypes } from "../types";
import { useRoomStore } from "./zustand";
import { set_toast } from "./components/toast";
import { useSocketStore } from "./components/socket";


export function handleIncoming(data: messageTypes) {
  const sendWs =(msg:messageTypes)=> useSocketStore(s=>s.send(msg))
  switch (data.type) {
    case "FEEDBACK":
      {
        // for only when player joins an existing room
          if (data.code === "ROOM_JOIN") {
          set_toast(data.msg, "success");
          useRoomStore((s)=>s.setJoined(true))
          return;
          }
        
          // for the round start when all the players are ready
          if (data.code === "ROUND_START") {
          useRoomStore(s=>s.setStart(true));
          return;
          }

        set_toast(data.msg,"info")
      }
      break;

    case "TOKEN_PING":
      {
//pong to be be send its like 
      sendWs({ type: "TOKEN_PONG", timestamp: data.timestamp })
      }
      break;

      //i dont need  this in frontend like cases- shitted will send it as soon as a person clicks fucking join
  }
}
