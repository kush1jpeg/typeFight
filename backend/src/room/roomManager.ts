import type Player from "../player/playerInit";
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
    this.rooms.delete(roomId);
  }

  has(roomId: string): boolean {
    return this.rooms.has(roomId);
  }

  addPlayer(room: Room, gamerId: string, player: Player) {
    room.players[gamerId] = player;
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
}
