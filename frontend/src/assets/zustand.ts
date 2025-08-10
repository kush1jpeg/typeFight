import { create } from "zustand";

// to store the current player info in a atom

/* interface playerInterface {
  gamerId: string;
  cursor: number;
  typeSpeed?: number; //wpm logic
  typed: string | "";
  //rating?: number to be implemented when i make my elo based ranking algortihm :)
  state: {
    isAlive: string; //rage quit and disconnect-> will add 10sec counter to reconnect otherwise gg
    ping?: number | string; // in ms}
  };
}

const defaultPlayer: playerInterface = {
  gamerId: '',
  cursor: 0,
  typed: '',
  typeSpeed: 0,
  state: {
    isAlive: 'alive',
    ping: 0,
  },
};

 */

// to track the room state
type RoomState = {
  reset: () => void;
  sentence: string;
  token: "TOKEN_CREATE" | "TOKEN_JOIN" | null;
  mistake: boolean;
  roomId: string;
  password: string;
  gamerId: string;
  joined: boolean;
  time: number | null;
  start: boolean;
  mode: string;
  opponent: string;
  Opp_cursor: number | 0;
  setRoomId: (id: string) => void;
  setMistake: (id: boolean) => void; // to track the fuzzy squiggle
  setPassword: (pw: string) => void;
  setgamerId: (pw: string) => void;
  set_token: (pw: "TOKEN_CREATE" | "TOKEN_JOIN") => void; // to track the type of token to be sent
  setJoined: (pId: boolean) => void; // if the player joined or not
  settime: (time: number | null) => void; // room time
  setStart: (p: boolean) => void; // to start the 3sec timer together for every device
  setMode: (p: string) => void; // to track the mode of the user.
  setSentence: (sent: string) => void; // to store the sentence
  setOpponent: (opp: string) => void; //to store the opponent
  setOpp_cursor: (opp: number) => void; // to store the opponents ghost cursor pos.
};

export const useRoomStore = create<RoomState>((set) => ({
  reset: () =>
    // to reset the roomState after resign or inactivity or gameEnd
    set({
      opponent: "",
      mistake: false,
      Opp_cursor: 0,
      sentence: "",
      mode: "select",
      token: null,
      roomId: "",
      start: false,
      time: null,
      password: "",
      gamerId: "",
      joined: false,
    }),
  sentence: "",
  Opp_cursor: 0,
  opponent: "",
  mode: "select",
  token: null,
  roomId: "",
  mistake: false,
  start: false,
  time: null,
  password: "",
  gamerId: "",
  joined: false,
  setMistake: (opp: boolean) => set({ mistake: opp }),
  setOpp_cursor: (opp: number) => set({ Opp_cursor: opp }),
  setStart: (p: boolean) => set({ start: p }),
  setJoined: (pId: boolean) => set({ joined: pId }),
  setRoomId: (id: string) => set({ roomId: id }),
  setPassword: (pw: string) => set({ password: pw }),
  setgamerId: (pId: string) => set({ gamerId: pId }),
  set_token: (m: "TOKEN_CREATE" | "TOKEN_JOIN") => set({ token: m }),
  settime: (m: number | null) => set({ time: m }),
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
