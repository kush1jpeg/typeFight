import { create } from 'zustand';

// to store the current player info in a atom
interface playerInterface {
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



type RoomState = {
  roomId: string;
  password: string;
  setRoomId: (id: string) => void;
  setPassword: (pw: string) => void;
};

export const useRoomStore = create<RoomState>((set) => ({
  roomId:'',
  password:'',
  player:defaultPlayer,
  
  setRoomId: (id:string) => set({ roomId: id }),
  setPassword: (pw:string) => set({ password: pw }),
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
