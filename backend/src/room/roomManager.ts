import type Player from "../player/playerInit";
import { connections } from "../server/websocket";
import { Room } from "../types";
import { generatePara, sendJSON } from "../gameLogic/helperFunc";
import { log } from "console";

//room manager is added for easier control and clarity otherwise i could have dont manually too

export class RoomManager {
  private rooms = new Map<string, Room>(); //collection of active rooms

  add(room: Room) {
    this.rooms.set(room.roomId, room);
  }

  get(roomId: string) {
    return this.rooms.get(roomId);
  }

  removePlayer(player: Player) {
    for (const room of this.rooms.values()) {
      if (room.players[player.uuid]) {
        delete room.players[player.uuid];

        if (Object.keys(room.players).length === 0) {
          this.rooms.delete(room.roomId);
        }
        break;
      }
    }
    connections.delete(player.uuid);
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
    generatePara(room.time); // regenerate some sentence using groq or some shite
    for (const playerId in room.players) {
      const player = room.players[playerId];
      player.cursor = 0;
      player.typed = "";
      player.state.isAlive = "alive";
      player.fuzzy = 0;
      player.ready = false;
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

  broadcastPingUpdate(room: Room) {
    const playersArray = Object.values(room.players);
    console.log("broadcastPingUpdate");

    for (const recipient of playersArray) {
      const opponent = playersArray.find(
        (p) => p.gamerId !== recipient.gamerId,
      );
      sendJSON(recipient.socket, {
        type: "PING_UPDATE",
        player: recipient.state.ping, // THEIR own ping
        opponent: opponent?.state.ping ?? 0, // Opponent’s ping
      });
    }
  }

  getWinner(room: Room): string {
    const [p1, p2] = Object.values(room.players);

    // Higher words typed = better
    // Lower fuzzy (mistakes) = better
    function score(p: typeof p1) {
      return p.typed.length * 2 - p.fuzzy * 3;
      // 2 points per word, minus 3 points per mistake
    }

    const score1 = score(p1);
    const score2 = score(p2);

    if (score1 > score2) return p1.gamerId;
    if (score2 > score1) return p2.gamerId;
    return Math.random() < 0.5 ? p1.gamerId : p2.gamerId; // incase of draw just send any random player
  }

  getRoomByPlayerUUID(uuid: string): Room | null {
    for (const room of this.rooms.values()) {
      for (const player of Object.values(room.players)) {
        if (player.uuid === uuid) {
          return room;
        }
      }
    }
    return null;
  }
}
