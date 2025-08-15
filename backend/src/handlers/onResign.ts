import { sendJSON } from "../gameLogic/helperFunc";
import { roomManager } from "../gameLogic/tokenHandler";
import Player from "../player/playerInit";
import { Room } from "../types";
import { startPingLoop } from "./onPong";

export function handleDelete(roomId: string): boolean {
  //if the time passes...
  roomManager.delete(roomId);
  return !roomManager.has(roomId); //return true if deleted
}

export function handleRestart(roomId: string) {
  //restart
  roomManager.restart(roomId);
}

export function roundCheck(roomId: string, player: Player) {
  const room = roomManager.get(roomId);
  console.log("triggered");
  if (!room?.players) {
    return console.log("no player present");
  }
  player.set_ready(true);
  const allReady = Object.values(room?.players).every((p) => p.ready); // insane cracked way told by gpt!
  console.log("[🧠 roundCheck]", {
    playerReady: player.ready,
    allPlayers: Object.values(room.players).map((p) => ({
      id: p.gamerId,
      ready: p.ready,
    })),
  });
  if (allReady) {
    for (const p of Object.values(room.players)) {
      startPingLoop(p);
      sendJSON(p.socket, {
        type: "FEEDBACK",
        code: "ROUND_START",
        msg: "The round is starting",
      });
    }
    const Time = (room.time + 5) * 1000;
    roundTimeCHECK(Time, room);
  }
}

function roundTimeCHECK(remaining: number, room: Room) {
  // to bind it first
  broadcastTimeUpdate();
  const interval = setInterval(() => {
    remaining -= 1;

    if (remaining <= 0) {
      clearInterval(interval);

      const winner = roomManager.getWinner(room);
      for (const p of Object.values(room.players)) {
        sendJSON(p.socket, {
          type: "ROUND_END",
          winnerId: winner,
        });
      }
    } else {
      broadcastTimeUpdate();
    }
  }, 1000);

  function broadcastTimeUpdate() {
    for (const p of Object.values(room.players)) {
      sendJSON(p.socket, {
        type: "TIME_UPDATE",
        remaining,
      });
    }
  }
}
