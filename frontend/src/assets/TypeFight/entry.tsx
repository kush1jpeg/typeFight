import { useEffect, useState, useRef } from 'react';
import { useRoomStore } from '../zustand';
import ASCIIText from '../ASCIIText/ASCIIText';
import { useSocketStore } from '../components/socket';
import { Fight_arena } from './arena';
import { ConfirmButton } from '../components/ holdButton';
import { set_toast } from '../components/toast';

export function TypeFight() {
  const [count, setCount] = useState(5);  //timer
  const roomId = useRoomStore.getState().roomId;   //.get state does not trigger a render.
  const start = useRoomStore(s => s.start);        //. use this for triggering a render
  const [but, setBut] = useState(true);
  const toastTimeout = useRef<number | null>(null);
  const wsTimeout = useRef<number | null>(null);

  const sendWs = useSocketStore.getState().send;
  const Onsubmit = () => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    if (wsTimeout.current) clearTimeout(wsTimeout.current);
    console.log("socket state:",);
    console.log("sending the ready msg", roomId)
    setBut(false)
    sendWs({
      type: "FEEDBACK",
      code: "READY",
      msg: roomId,
    });
  }

  useEffect(() => {
    toastTimeout.current = window.setTimeout(() => {
      set_toast("Detected inactivity", "warn");
    }, 8000);
    wsTimeout.current = window.setTimeout(() => {
      sendWs({
        type: 'FEEDBACK',
        code: 'NO_RESPONSE',
        msg: roomId
      })
    }, 5000);

    return () => {
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
      if (wsTimeout.current) clearTimeout(wsTimeout.current);
    };

  }, []);


  useEffect(() => {
    if (!start || count <= 0) return;
    const timer = setTimeout(() => {
      setCount((count) => count - 1)   // to not get stale values
    }, 1000);
    return () => clearTimeout(timer); // cleanup to avoid multiple timers
  }, [start, count])


  return (
    <>
      {but && (<ConfirmButton onSubmit={Onsubmit} />)}

      {start && (
        <div className="count">
          {count > 0 ? (
            <div className=''>
              <ASCIIText
                text={String(count)}
                enableWaves={true}
                asciiFontSize={8}
              />
            </div>
          ) : (
            <Fight_arena />

          )}
        </div>
      )}
    </>
  )
}
