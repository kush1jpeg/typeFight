import WebSocket from "ws"; //There are two different WebSocket types in play and ts is strict
import Player from "./player/playerInit";
import { EventEmitter } from "stream";

export interface playerInterface {
  gamerId: string;
  socket: WebSocket;
  cursor: number;
  typed: string | "";
  ready: boolean; // <-- to track inorder to trigger the shite
  fuzzy: number;
  //rating?: number to be implemented when i make my elo based ranking algortihm :)
  state: {
    isAlive: string; //rage quit and disconnect-> will add 10sec counter to reconnect otherwise gg
    ping: number; // in ms}
    lastPong: number;
    pingInterval?: NodeJS.Timeout;
    watchdogInterval?: NodeJS.Timeout; // to track the ping pong timeout -> so much shit for just restart!
  };
}
export interface Room extends EventEmitter {
  roomId: string; //user will give name for the room //obviously will keep it here
  roomPass: string;
  players: Record<string, Player>; //Record<string, Player> just means: “an object where every key is a string, and the value is a Player
  sentence: string;
  time: number;
}

export interface playerData {
  // to store the player as a hash
  uuid: string;
  gamerId: string;
  roomId: string;
  status: string;
  cursor: number;
  oppId: string;
  oppCursor: number;
  timeLeft: number;
  sentence: string;
}

export type messageTypes =
  | {
      type: "RECONNECT_SUCCESS";
      player: playerData;
      roomId: string;
    }
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
      type: "TOKEN_PING";
      timestamp: number;
    }
  | {
      type: "FEEDBACK";
      code: string;
      msg: string;
    }
  | {
      type: "ROOM_DELETE";
      roomId: string;
    }
  | {
      type: "GAME_RES"; // to update about opponent position and squiggle or not!
      code: string;
      player: string;
      data: {
        index: number; //cursor
        status: boolean;
      };
    }
  | {
      type: "TIME_UPDATE";
      remaining: number;
    }
  | {
      type: "MESSAGE";
      roomId: string;
      playerId: string;
      msg: string;
    }
  | {
      type: "SERVER_MESSAGE";
      msg: string;
    }
  | {
      type: "ROOM_INFO";
      sentence: string;
      player1: string;
      player2: string;
    }
  | {
      type: "PING_UPDATE";
      player: number;
      opponent: number;
    }
  | {
      type: "ROUND_END";
      winnerId: string;
    }
  | {
      type: "UUID-SET";
      uuid: string;
    }
  | {
      type: "RECONNECT"; // uuid exists in the local storage;
      uuid: string;
    }
  | {
      type: "NEW"; // new player;
    };
