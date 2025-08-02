import { sendJSON } from "../gameLogic/helperFunc";
import { roomManager } from "../gameLogic/tokenHandler";
import { wsServer } from "../server/websocket";

export function handleDelete(roomId: string): boolean {
  //if the user deletes
  roomManager.delete(roomId);
  return !roomManager.has(roomId); //return true if deleted
}

export function handleRestart(roomId: string) {
  //restart
  roomManager.restart(roomId);
}

export function roundCheck(roomId:string){
  const room = roomManager.get(roomId);
  if(!room?.players){return console.log("no player present");}
  const allReady = Object.values(room?.players).every(p => p.ready);      // insane cracked way told by gpt!  
  if(allReady){
 for (const player of Object.values(room.players)) {
sendJSON(player.socket,{
   type: "FEEDBACK" ,
   code: "ROUND_START", 
   msg:String(Date.now())
  })
   }
  }
}