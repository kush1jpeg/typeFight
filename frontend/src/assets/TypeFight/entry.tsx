import { useEffect, useState } from 'react';
import { useRoomStore } from '../zustand';
import ASCIIText from '../ASCIIText/ASCIIText';
import { useSocketStore } from '../components/socket';
import type { messageTypes } from '../../types';

export function TypeFight() {
  const [count , setCount] = useState(3);
  const roomId = useRoomStore(s=>s.roomId);
  const start = useRoomStore(s=>s.start);
const sendWs = (msg:messageTypes)=> useSocketStore(s=>s.send(msg))
  useEffect(() => {
      sendWs({
        type: "FEEDBACK",
        code:"READY",
        msg:roomId
      });
    }, []);

    useEffect(() => {
  if (!start || count <= 0) return;
const timer = setTimeout(() => {
setCount((count)=>count-1)   // to not get stale values
},1000);
   return () => clearTimeout(timer); // cleanup to avoid multiple timers
    }, [start,count])


  return start &&(
    <div className="">
      {count > 0 ? (
        <div className=''>
         <ASCIIText
  text={String(count)} 
  enableWaves={true}
  asciiFontSize={8}
/>
        </div>
      ) : (
    
<h1>hi</h1>

      )}
    </div>
  );
}