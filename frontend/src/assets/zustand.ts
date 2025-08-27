import { create } from "zustand";

// to track the room state
type RoomState = {
  reset: () => void;
  winner: string | null;
  cursor: number;
  sentence: string;
  token: "TOKEN_CREATE" | "TOKEN_JOIN" | null;
  mistake: boolean;
  roomId: string;
  password: string;
  gamerId: string;
  joined: boolean;
  time: number;
  start: boolean;
  mode: string;
  opponent: string;
  Opp_cursor: number | 0;
  status: "connected" | "idle" | "connecting";
  setStatus: (s: RoomState["status"]) => void;
  player_ping: number;
  set_player_ping: (id: number) => void;
  setCursor: (id: number) => void;
  opp_ping: number;
  taunt: string | null;
  showTaunt: (emoji: string) => void;
  set_opp_ping: (id: number) => void;
  setRoomId: (id: string) => void;
  setMistake: (id: boolean) => void; // to track the fuzzy squiggle
  setPassword: (pw: string) => void;
  setWinner: (pw: string) => void;
  setgamerId: (pw: string) => void;
  set_token: (pw: "TOKEN_CREATE" | "TOKEN_JOIN") => void; // to track the type of token to be sent
  setJoined: (pId: boolean) => void; // if the player joined or not
  settime: (t0ime: number) => void; // room time
  setStart: (p: boolean) => void; // to start the 5sec timer together for every device
  setMode: (p0: string) => void; // to track the mode of the user.
  setSentence: (sent: string) => void; // to store sthe sentence
  setOpponent: (opp: string) => void; //to store the opponent
  setOpp_cursor: (opp: number) => void; // to store the opponents ghost cursor pos.
};

export const useRoomStore = create<RoomState>((set) => ({
  reset: () =>
    // to reset the roomState after resign or inactivity or gameEnd
    set({
      sentence: "",
      cursor: 0,
      Opp_cursor: 0,
      opponent: "",
      winner: null,
      mode: "select",
      token: null,
      roomId: "",
      mistake: false,
      start: false,
      time: 0,
      password: "",
      gamerId: "",
      joined: false,
      player_ping: 0,
      opp_ping: 0,
      taunt: null,
      status: "idle",
    }),
  sentence: "",
  Opp_cursor: 0,
  status: "idle",
  setStatus: (s: RoomState["status"]) => set({ status: s }), // for the checker shite
  opponent: "",
  winner: null,
  cursor: 0,
  mode: "select",
  token: null,
  roomId: "",
  mistake: false,
  start: false,
  time: 0,
  password: "",
  gamerId: "",
  joined: false,
  player_ping: 0,
  opp_ping: 0,
  taunt: null,
  showTaunt: (emoji) => {
    set({ taunt: emoji });
    setTimeout(() => {
      set({ taunt: null });
    }, 3000);
  },
  set_opp_ping: (ping: number) => set({ opp_ping: ping }),
  setCursor: (no: number) => set({ cursor: no }),
  set_player_ping: (ping: number) => set({ player_ping: ping }),
  setMistake: (opp: boolean) => set({ mistake: opp }),
  setOpp_cursor: (opp: number) => set({ Opp_cursor: opp }),
  setStart: (p: boolean) => set({ start: p }),
  setJoined: (pId: boolean) => set({ joined: pId }),
  setWinner: (id: string) => set({ winner: id }),
  setRoomId: (id: string) => set({ roomId: id }),
  setPassword: (pw: string) => set({ password: pw }),
  setgamerId: (pId: string) => set({ gamerId: pId }),
  set_token: (m: "TOKEN_CREATE" | "TOKEN_JOIN") => set({ token: m }),
  settime: (m: number) => set({ time: m }),
  setMode: (m: string) => set({ mode: m }),
  setSentence: (sent) => set({ sentence: sent }),
  setOpponent: (opp: string) => set({ opponent: opp }),
}));

// to track weather the 3d env has been loaded or not
type LoadingStore = {
  isLoaded: boolean;
  setLoaded: () => void;
};
export const useLoadingStore = create<LoadingStore>((set) => ({
  isLoaded: false,
  setLoaded: () => set({ isLoaded: true }),
}));
