import { create } from "zustand";
const URL = import.meta.env.VITE_SOCKET_URL ?? "ws://localhost:7654";
import type { messageTypes } from "../../types";
import { handleIncoming } from "../handler";
import { set_toast } from "./toast";

// to track the ws connection 
type WS_state = {
  ws: WebSocket | null;
  connect: () => void;
  disconnect: () => void;
  send: (msg: messageTypes) => void;
}

export const useSocketStore = create<WS_state>((set, get) => ({
  ws: null,
  connect: () => {
    const ws = new WebSocket(URL);
    ws.onopen = () => console.log("--> Connected to wServer");

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      console.log("Incoming message -->", msg);
      handleIncoming(msg);
    };

    ws.onerror = (e) => console.warn("X--> Socket error", e);

    set({ ws });
  },
  disconnect: () => {
    get().ws?.close(1000, "--> Manual disconnect");
    set({ ws: null });
  },
  send: (msg: messageTypes) => {
    const socket = get().ws;
    console.log("Attempting to send:", msg, "Socket state:", socket?.readyState);
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(msg));
    } else {
      set_toast("Can't send, socket not open bruh.", "error");
    }
  },
}));
