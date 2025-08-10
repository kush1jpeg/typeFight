
export type messageTypes =
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
    type: "RESIGN";
    roomId: string;
    playerId: string;
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
    };
  }

