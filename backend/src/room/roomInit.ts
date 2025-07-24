import type { Room } from "../types";
import Player from "../player/playerInit";

export class room_Init implements Room {
  public players: Record<string, Player> = {};

  constructor(
    public readonly roomId: string,
    public readonly roomPass: string,
    public sentence: string,
    public timeLeft: number,
    public player: Player,
  ) {
    this.players[player.gamerId] = player;
  }

  removePlayer(playerId: string) {
    delete this.players[playerId];
  }

  getPlayerCount(): number {
    return Object.keys(this.players).length;
  }
}
