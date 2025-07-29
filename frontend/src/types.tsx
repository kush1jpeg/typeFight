
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
      type: "KEY_PRESS";
      roomId: string;
      char: string;
      playerId: string;
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
      type: "ERROR";
      timestamp: number;
      uuid: string;
    }
  | {
      type: "RESIGN";
      roomId: string;
      playerId: string;
    };