interface playerData {
  // to store the player as a hash
  uuid: string;
  gamerId: string;
  roomId: string;
  status: string;
  cursor: number;
  oppId: string;
  oppCursor: number;
  timeLeft: number;
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
    typeOF_sen?: string; //the type of sentences he wants to practice on
  }
  | {
    type: "TOKEN_JOIN";
    roomId: string;
    roomPass: string;
    gamerId?: string;
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

    type: "WORD_TYPED";
    code: string;
    roomId: string;
    word: string;
    playerId: string;
  }
  | {
    type: "GAME_RES";
    code: string;
    player: string;
    data: {
      index: number; //cursor
      status: boolean;
    }
  }
  | {
    type: "PING_UPDATE";
    player: number;
    opponent: number;
  }
  | {
    type: "ROUND_END",
    winnerId: string,
  }
  | {
    type: "TIME_UPDATE",
    remaining: number,
  }
  | {
    type: "UUID-SET",
    uuid: string,
  }
  | {
    type: "RECONNECT", // uuid exists in the local storage;
    uuid: string
  }
  | {
    type: "NEW";    // new player;
  }


