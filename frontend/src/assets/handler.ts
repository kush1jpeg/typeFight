import type { messageTypes } from "../types";
import { useRoomStore } from "./zustand";
import { set_toast } from "./components/toast";
import { useSocketStore } from "./components/socket";

export function handleIncoming(data: messageTypes) {
  const sendWs = useSocketStore.getState().send;
  const setMode = useRoomStore.getState().setMode;
  switch (data.type) {
    case "FEEDBACK":
      {
        // for only when player joins an existing room
        if (data.code === "ROOM_JOIN") {
          set_toast(data.msg, "success");
          useRoomStore.getState().setJoined(true);
          return;
        }
        if (data.code === "OPP_JOINED") {
          set_toast(data.msg, "info");
          useRoomStore.getState().setJoined(true);
          return;
        }

        if (data.code === "ROOM_CREATED") {
          console.log("room created");
          set_toast(data.code, "success");
          return;
        }

        // for the round start when all the players are ready
        if (data.code === "ROUND_START") {
          set_toast(data.msg, "success");
          useRoomStore.getState().setStart(true);
          return;
        }
        if (data.code === "ROOM_FULL") {
          set_toast(data.msg, "warn");
          setMode("select");
          return;
        }

        set_toast(data.msg, "info");
      }
      break;

    case "TOKEN_PING":
      {
        //pong to be be send its like
        sendWs({ type: "TOKEN_PONG", timestamp: data.timestamp });
      }
      break;

    //i dont need  this in frontend like cases- shitted will send it as soon as a person clicks fucking join
  }
}
