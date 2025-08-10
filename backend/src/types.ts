import WebSocket from "ws"; //There are two different WebSocket types in play and ts is strict
import Player from "./player/playerInit";
import { EventEmitter } from "stream";

export interface playerInterface {
  gamerId: string;
  socket: WebSocket;
  cursor: number;
  typed: string | "";
  ready: boolean; // <-- to track inorder to trigger the shite
  words: Array<string>;
  //rating?: number to be implemented when i make my elo based ranking algortihm :)
  state: {
    isAlive: string; //rage quit and disconnect-> will add 10sec counter to reconnect otherwise gg
    ping?: number | string; // in ms}
  };
}
export interface Room extends EventEmitter {
  roomId: string; //user will give name for the room //obviously will keep it here
  roomPass: string;
  players: Record<string, Player>; //Record<string, Player> just means: “an object where every key is a string, and the value is a Player
  sentence: string;
  time: number;
}

export type messageTypes =
  | {
      type: "TOKEN_CREATE";
      roomId: string;
      roomPass: string;
      gamerId: string;
      time: number;
    }
  | {
      type: "TOKEN_JOIN";
      roomId: string;
      roomPass?: string;
      gamerId: string;
    }
  | {
      type: "WORD_TYPED";
      code: string;
      roomId: string;
      word: string;
      playerId: string;
    }
  | {
      type: "TOKEN_PONG";
      timestamp: number;
    }
  | {
      type: "FEEDBACK";
      code: string;
      msg: string;
    }
  | {
      type: "RESIGN";
      roomId: string;
      playerId: string;
    }
  | {
      type: "GAME_RES";
      code: string;
      player: string;
      data: {
        index: number; //cursor
        status: boolean;
      };
    }
  | {
      type: "MESSAGE";
      roomId: string;
      msg: string;
    }
  | {
      type: "ROOM_INFO";
      sentence: string;
      player1: string;
      player2: string;
    };
/* |

{
  type: 'ROUND_START';
  startTime: number;
}
|{
  type: 'CLIENT_READY';
  roomId: string;
}
|{
  type: 'ROUND_END';
  winnerId: string;  
} */
