import { roomManager } from "../gameLogic/tokenHandler";

export function handleDelete(roomId: string): boolean {
  //if the user deletes
  roomManager.delete(roomId);
  return !roomManager.has(roomId); //return true if deleted
}

export function handleRestart(roomId: string) {
  //restart
  roomManager.restart(roomId);
}
