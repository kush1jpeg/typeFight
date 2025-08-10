import { roomManager } from "../gameLogic/tokenHandler";
import type Player from "../player/playerInit";
import { connections } from "../server/websocket";
import { Room } from "../types";

//room manager is added for easier control and clarity otherwise i could have dont manually too

export class RoomManager {
  private rooms = new Map<string, Room>(); //collection of active rooms

  add(room: Room) {
    this.rooms.set(room.roomId, room);
  }

  get(roomId: string) {
    return this.rooms.get(roomId);
  }

  delete(roomId: string) {
    // or map.delete and the map builtin func lowkey i fogot about them and made this shit
    this.rooms.delete(roomId);
  }

  has(roomId: string): boolean {
    return this.rooms.has(roomId);
  }

  addPlayer(room: Room, gamerId: string, player: Player) {
    room.players[gamerId] = player;
  }

  restart(roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) {
      return;
    }
    room.sentence = ""; ///                       regenerate some sentence using groq or some shite
    for (const playerId in room.players) {
      const player = room.players[playerId];
      player.cursor = 0;
      player.typed = "";
      player.state.isAlive = "alive";
    }
  }

  getOpponentId(room: Room, playerId: string): string | null {
    const opponentId = Object.keys(room.players).find((id) => id !== playerId);
    return opponentId || null;
  }
  get_actualWord(wordIndex: number, room: Room): string {
    const words = room.sentence.split(" ");
    return words[wordIndex] || "";
  }
  get_typedWord(wordIndex: number, room: Room, gamerId: string): string {
    const words = room.players[gamerId].typed.split(" ");
    return words[wordIndex] || "";
  }

  getPlayerByUUID(uuid: string): Player | undefined {
    for (const room of this.rooms.values()) {
      const player = Object.values(room.players).find((p) => p.uuid === uuid);
      if (player) return player;
    }
    return undefined;
  }
}
