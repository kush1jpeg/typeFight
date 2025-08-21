import WebSocket from "ws";
import { playerInterface } from "../types";

//TypeScript classes don’t inherit properties from interfaces — only structure enforcement.
class Player implements playerInterface {
  public fuzzy: number;
  public gamerId: string;
  public uuid: string;
  public socket: WebSocket;
  public cursor: number;
  public typed: string;
  public ready: boolean;
  public words: string[] = [];
  public state: {
    isAlive: string;
    ping: number;
    lastPong: number;
    pingInterval?: NodeJS.Timeout;
    watchdogInterval?: NodeJS.Timeout;
  };

  constructor(gamerId: string, socket: WebSocket, uuid: string) {
    this.fuzzy = 0;
    this.gamerId = gamerId;
    this.socket = socket;
    this.uuid = uuid;
    this.cursor = 0;
    this.typed = "";
    this.ready = false;
    this.state = {
      isAlive: "idle",
      ping: 0,
      lastPong: 0,
    };
  }

  set_typed(typed: string) {
    this.typed += typed;
  }

  update_cursorPos(pos: number) {
    this.cursor = pos;
  }

  set_ready(bol: boolean) {
    console.log("set ");
    this.ready = bol;
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
  new_player.setIsAlive("alive");
  return new_player;
}
