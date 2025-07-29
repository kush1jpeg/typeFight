import { handleIncoming } from "../handler";

const URL = import.meta.env.VITE_SOCKET_URL ??"ws://localhost:7654";
let ws: WebSocket|null = null;

export function WSconnect() {
  ws = new WebSocket(URL);
  ws.onopen = () => {
    console.log("WebSocket rockss!");
  }


  ws.onmessage = (event) => { //listen types
    try {
      const data = JSON.parse(event.data);
      handleIncoming(data)

    } catch (err) {
      console.warn("Invalid WS message:", event.data);
    }
  }
}
export function WSdisconnect() {
  if (ws && ws.readyState === WebSocket.OPEN) {   
  ws.close(1000, "closing")
      console.warn("closed webSocket connection:");
  }
  }



//custom hook to practice
export function sendWs(msg:object)  //send types
//ws only takes strings
{
  if ( ws && ws.OPEN === ws.readyState && msg) ws.send(JSON.stringify(msg));
  else console.log("Websocket not connected");
}
