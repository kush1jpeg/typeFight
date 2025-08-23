import type { Room } from "../types";
import Player from "../player/playerInit";
import EventEmitter from "events";

export class room_Init extends EventEmitter implements Room {
  public players: Record<string, Player> = {};
  constructor(
    public readonly roomId: string,
    public readonly roomPass: string,
    public sentence: string,
    public time: number = 45, // by default the room is 45 cuz i am not asking for time in the frontend for now
    public player: Player,
  ) {
    super();
    this.players[player.gamerId] = player;
  }
  setSentence(sen: string) {
    if (this.sentence) return;
    console.log("[room] Emitting sentenceReady");
    this.sentence = sen;
    this.emit("sentenceReady", sen);
  }

  getPlayerCount(): number {
    return Object.keys(this.players).length;
  }
}
