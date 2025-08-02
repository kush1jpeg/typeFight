import { create } from 'zustand';

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
  token:'TOKEN_CREATE' | 'TOKEN_JOIN' | null;
  roomId: string;
  password: string;
  gamerId:string;
  joined:boolean;
  time:number|null ;
  start:boolean;
  setRoomId: (id: string) => void;
  setPassword: (pw: string) => void;
  setgamerId:(pw:string)=>void;
  set_token:(pw:'TOKEN_CREATE' | 'TOKEN_JOIN')=>void;                 // to track the type of token to be sent
  setJoined: (pId:boolean) => void;          // if the player joined or not
  settime: (time:number|null) => void;             // room time
  setStart: (p:boolean) => void;             // to start the 3sec timer together for every device
};

export const useRoomStore = create<RoomState>((set) => ({
  token:null, 
  roomId:'',
  start:false,
  time:null,
  password:'',
  gamerId:'', 
  joined:false, 
  setStart:(p:boolean)=>set({start:p}),
  setJoined: (pId:boolean) => set({ joined: pId }),
  setRoomId: (id:string) => set({ roomId: id }),
  setPassword: (pw:string) => set({ password: pw }),
  setgamerId: (pId:string) => set({ gamerId: pId }),
  set_token:(m:'TOKEN_CREATE'|'TOKEN_JOIN')=>set({token:m}),
  settime:(m:number|null)=>set({time:m})
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

