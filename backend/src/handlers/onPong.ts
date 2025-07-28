import Player from "../player/playerInit";

export function handlePingPong(player: Player, timestamp: number) {
  //  simple ping pong methd to calculate the ping;
  try {
    console.log("reached handlePingPong()");

    if (typeof timestamp === "number") {
      const ping = Date.now() - timestamp;
      player.update_ping(ping);
      player.setIsAlive("alive");
    } else {
      player.update_ping(0);
      player.setIsAlive("connecting");
    }

    //pong msg to be send from the frontend

    //      if (data.type === "ping") {
    //        console.log("reached pong");
    //        // Just echo back for latency tracking
    //        player.socket.send(
    //          JSON.stringify({ type: "pong", timestamp: data.timestamp }),
    //        );
    //      }
  } catch (err) {
    console.error("Invalid ping-pong packet:", err);
  }
}

export function startPingLoop(player: Player, timestamp: number) {
  handlePingPong(player, timestamp); // bind listener once gpt helped in it

  setInterval(() => {
    const timestamp = Date.now();
    player.socket.send(JSON.stringify({ type: "TOKEN_PING", timestamp }));
  }, 2000);
}
