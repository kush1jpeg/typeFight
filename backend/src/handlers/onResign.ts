import { sendJSON } from "../gameLogic/helperFunc";
import { roomManager } from "../gameLogic/tokenHandler";
import Player from "../player/playerInit";

export function handleDelete(roomId: string): boolean {
  //if the user deletes
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
      sendJSON(p.socket, {
        type: "FEEDBACK",
        code: "ROUND_START",
        msg: "The round is starting",
      });
    }
    const currentTime = Date.now();
    roundTimeCHECK(currentTime);
  }
}

function roundTimeCHECK(time: number) {}
