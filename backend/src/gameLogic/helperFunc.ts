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

export function checkChar(typeChar: string, actualChar: string): number {
  if (typeChar === actualChar)
    return 1; //truee
  else return 0;
}

export function generatePara(prompt: string): string {
  let sentence = "abc";
  return sentence; //shitty shit
}
