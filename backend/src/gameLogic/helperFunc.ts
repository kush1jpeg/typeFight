import { distance } from "fastest-levenshtein";
import { WebSocket } from "ws";

export function fuzzyCheck(actual: string, typed: string): number {
  const dis = distance(typed, actual);
  if (dis >= Math.floor(actual.length * 0.3)) {
    console.log("Get squiggled."); // get squiggle
    return 1;
  } else {
    return 0;
  } //ignore as minor error for the ghost cursor
}

export function sendJSON(ws: WebSocket, obj: object) {
  ws.send(JSON.stringify(obj));
}
