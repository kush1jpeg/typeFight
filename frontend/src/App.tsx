import './App.css'
import ROOM from './assets/components/3denv.tsx'
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Checker from './assets/components/checker';
import { useEffect, useRef } from 'react';
import { useSocketStore } from './assets/components/socket';
import NavigationSetter from './assets/navigate';
import { set_toast } from './assets/components/toast';
import { useRoomStore } from './assets/zustand.ts';


function App() {
  const sendWs = useSocketStore(s => s.send)
  const connect = useSocketStore(s => s.connect);
  const disconnect = useSocketStore(s => s.disconnect);

  const waitForOpen = (ws: WebSocket) => {
    return new Promise<void>((resolve) => {
      if (ws.readyState === WebSocket.OPEN) return resolve();
      ws.addEventListener("open", () => resolve(), { once: true });
    });
  };

  const hasConnected = useRef(false); // to act as a guard as react deliberately mounts components twice;
  useEffect(() => {
    const setup = async () => {
      if (hasConnected.current) return;
      hasConnected.current = true;
      const ws = await connect(); // make sure connection is established
      await waitForOpen(ws);
      set_toast("connected", "info");

      const existingUUID = localStorage.getItem("playerUUID");
      if (existingUUID) {
        sendWs({ type: "RECONNECT", uuid: existingUUID });
        console.log("sending a reconnect request")
      } else {
        console.log("sending a new uuid request")
        sendWs({ type: "NEW" });
      }
    };

    setup();

    return () => {
      disconnect();
      useRoomStore.getState().setStatus('idle');
      set_toast("disconnected", "info");
    };
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />

      {
        <BrowserRouter>
          <NavigationSetter />
          <Routes>
            <Route path="/" element={<ROOM />} />
            <Route path="/room/:roomId" element={<Checker />} />
          </Routes>
        </BrowserRouter>
      }
    </>
  );
}
export default App
