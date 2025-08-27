import { roomManager } from "../gameLogic/tokenHandler";
import Player from "../player/playerInit";
import { connections } from "../server/websocket";

export function handlePingPong(player: Player, timestamp: number) {
  //  simple ping pong methd to calculate the ping;
  try {
    if (typeof timestamp === "number") {
      const ping = Date.now() - timestamp;
      player.update_ping(ping);
      player.state.ping;
      player.setIsAlive("alive");
      player.state.lastPong = Date.now();
    } else {
      player.update_ping(0);
      player.setIsAlive("connecting");
    }
  } catch (err) {
    console.error("Invalid ping-pong packet:", err);
  }
}

export function startPingLoop(player: Player) {
  player.state.pingInterval = setInterval(() => {
    const timestamp = Date.now();
    player.socket.send(JSON.stringify({ type: "TOKEN_PING", timestamp }));
  }, 2000);

  // Watchdog check every 5 seconds
  player.state.watchdogInterval = setInterval(() => {
    const diff = Date.now() - (player.state.lastPong || 0);
    if (diff > 5000) {
      console.log(`Player ${player.gamerId} timed out. Removing...`);
      cleanup();
    }
  }, 5000);

  function cleanup() {
    // not deleting from redis....
    clearInterval(player.state.pingInterval);
    clearInterval(player.state.watchdogInterval);
    roomManager.removePlayer(player);
    connections.delete(player.uuid);
    try {
      player.socket.close();
    } catch {
      console.log("error when closing the ws");
    }
  }
  player.socket.on("close", cleanup);
  player.socket.on("error", cleanup);
}
