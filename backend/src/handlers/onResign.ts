import { sendJSON } from "../gameLogic/helperFunc";
import { redis, roomManager } from "../gameLogic/tokenHandler";
import Player from "../player/playerInit";
import { Room } from "../types";
import { startPingLoop } from "./onPong";

export async function handleDelete(roomId: string): Promise<boolean> {
  //if the time passes...
  roomManager.delete(roomId);
  const room = roomManager.get(roomId);
  for (const player of Object.values(room?.players ?? {})) {
    await redis.srem(`room:${roomId}:players`, player.uuid);
    await redis.del(`player:${player.gamerId}`);
    await redis.del(`room:${roomId}`);
  }
  return !roomManager.has(roomId); //return true if deleted
}

export async function handleRestart(roomId: string) {
  //restart
  await roomManager.restart(roomId);
  const room = roomManager.get(roomId);
  if (!room?.players) throw new Error("Room has no players");
  await redis.hset(`room:${roomId}`, {
    // to store the room Info as hash
    roomId,
    timeLeft: room.time + 5,
    status: "active",
    sentence: room.sentence,
  });
  const players = Object.values(room.players);
  for (const player of players) {
    if (player.state.pingInterval) clearInterval(player.state.pingInterval);
    if (player.state.watchdogInterval)
      clearInterval(player.state.watchdogInterval);
    player.cursor = 0;
    player.fuzzy = 0;
    player.ready = false;
    player.typed = "";
    await redis.hset(`player:${player.uuid}`, {
      cursor: 0, // or whatever default value
      fuzzy: 0, // or default
    });
  }
}

export async function roundCheck(roomId: string, player: Player) {
  const room = roomManager.get(roomId);
  console.log("triggered");
  if (!room?.players) {
    return console.log("no player present");
  }
  console.log("before = ", player.ready);
  if (player.ready) return; // already ready
  player.set_ready(true);
  console.log("after = ", player.ready);

  const allReady = Object.values(room?.players).every((p) => p.ready); // insane cracked way told by gpt!
  console.log("[🧠 roundCheck]", {
    playerReady: player.ready,
    allPlayers: Object.values(room.players).map((p) => ({
      id: p.gamerId,
      ready: p.ready,
    })),
  });

  if (allReady) {
    await redis.hset(`room:${roomId}`, {
      // to store the room Info as hash
      roomId,
      timeLeft: room.time + 5,
      status: "active",
      sentence: room.sentence,
      winner: null,
    });

    for (const p of Object.values(room.players)) {
      startPingLoop(p);
      sendJSON(p.socket, {
        type: "FEEDBACK",
        code: "ROUND_START",
        msg: "The round is starting",
      });
    }
    const Time = room.time + 5;
    roundTimeCHECK(Time, room);
  }
}

async function roundTimeCHECK(remaining: number, room: Room) {
  // to bind it first
  broadcastTimeUpdate();
  const interval = setInterval(async () => {
    remaining -= 1;

    if (remaining <= 0) {
      clearInterval(interval);

      const winner = roomManager.getWinner(room);
      await redis.hset(`room:${room.roomId}`, "winner", winner);
      for (const p of Object.values(room.players)) {
        sendJSON(p.socket, {
          type: "ROUND_END",
          winnerId: winner,
        });
      }
    } else {
      broadcastTimeUpdate();
      await redis.hset(`room:${room.roomId}`, "timeLeft", remaining);
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
