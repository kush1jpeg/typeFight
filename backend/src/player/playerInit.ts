import WebSocket from "ws";
import { playerInterface } from "../types";

//TypeScript classes don’t inherit properties from interfaces — only structure enforcement.
class Player implements playerInterface {
  public gamerId: string;
  protected uuid: string;
  public socket: WebSocket;
  public cursor: number;
  public typeSpeed?: number | 0;
  public typed: string | "";
  public state: {
    isAlive: string;
    ping?: number | string;
  };

  constructor(gamerId: string, socket: WebSocket, uuid: string) {
    this.gamerId = gamerId;
    this.socket = socket;
    this.uuid = uuid;
    this.cursor = 0;
    this.typed = "";
    this.typeSpeed;
    this.state = {
      isAlive: "idle",
      ping: "connecting",
    };
  }

  update_speed(speed: number) {
    this.typeSpeed = speed;
  }
  set_typed(typed: string) {
    this.typed += typed;
  }
  set_backSpace() {
    if (this.cursor > 0 && this.typed.length > 0) {
      this.typed = this.typed.slice(0, -1); // remove last char
      this.cursor--;
    }
  }

  update_cursorPos(pos: number) {
    this.cursor = pos;
  }

  update_ping(ping: number) {
    this.state.ping = ping;
  }

  setIsAlive(newStatus: string) {
    this.state.isAlive = newStatus;
  }
}

export default Player;

export function player_Init(
  gamerId: string,
  connection: WebSocket,
  uuid: string,
): Player {
  const new_player = new Player(gamerId, connection, uuid);

  return new_player;
}
