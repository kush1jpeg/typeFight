import { useEffect, useState, useRef } from 'react';
import { useRoomStore } from '../zustand';
import ASCIIText from '../ASCIIText/ASCIIText';
import { useSocketStore } from '../components/socket';
import { Fight_arena } from './arena';
import { ConfirmButton } from '../components/ holdButton';
import { set_toast } from '../components/toast';
import { HashLoader } from 'react-spinners';
import myImage from '../stock/25373881.png';
import Emoji_Dial from '../components/ openEmoji';
import PlayerBox from '../components/playerBox.tsx';
import RetroClock from '../components/clock.tsx';
import TauntDisplay from '../components/ taunt.tsx';


export function TypeFight() {
  const [count, setCount] = useState(5);  //timer
  const roomId = useRoomStore.getState().roomId;   //.get state does not trigger a render.
  const start = useRoomStore(s => s.start);        //. use this for triggering a render
  const [but, setBut] = useState(true);
  const toastTimeout = useRef<number | null>(null);
  const wsTimeout = useRef<number | null>(null);
  const time = useRoomStore.getState().time;
  const player = useRoomStore.getState().gamerId
  const opponent = useRoomStore.getState().opponent
  const sendWs = useSocketStore.getState().send;

  const player_Ping = useRoomStore(s => s.player_ping);
  const opp_Ping = useRoomStore(s => s.opp_ping);


  const restart = () => {
    setCount(5);
    setBut(true);
    useRoomStore.getState().reset();
  }

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

    }, 13000);

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
      {/* Computer frame wrapper */}
      <div className="fixed inset-0 z-20 pointer-events-none flex items-center justify-center bg-[#110a1b]">
        {/* Frame image */}
        <img
          src={myImage}
          alt="retro themed computer frame"
          className="
      w-[1920px] h-[1420px] max-w-full
      invert grayscale
      transition-transform duration-300
      scale-75
      sm:scale-90
      md:scale-100
      lg:scale-[1.1]
      xl:scale-[1.2]
      origin-top
      translate-y-[45px]
      pointer-events-none
          z-50
    "
        />

        {/* Scaled UI layer */}
        <div
          className="
      absolute top-0 left-1/2
      w-[1920px] h-[1080px]
      max-w-full
      pointer-events-none
      transition-transform duration-300
      scale-75
      sm:scale-90
      md:scale-100
      lg:scale-[1.1]
      xl:scale-[1.3]
      origin-top
      -translate-x-1/2
      translate-y-[45px]
    "
        >
          {/* UI positioned relative to frame */}
          <div>
            {/* Emoji Dial */}
            {start && (<>
              <Emoji_Dial />
              <TauntDisplay />
            </>)}
          </div>
        </div>
      </div>

      {/* Confirm button wrapper */}
      {but && (
        <div className="pointer-events-auto fixed bottom-5 right-5 z-50">
          <ConfirmButton onSubmit={Onsubmit} />
        </div>)}

      {/* Waiting screen */}
      {!start && !but && (
        <div className="flex items-center justify-center h-screen w-screen px-4">
          <div className="flex flex-col items-center space-y-5 sm:space-y-7 z-50">
            <HashLoader color="#66a30f" size={50} />
            <p className="text-green-300 font-mono text-lg sm:text-xl md:text-2xl uppercase tracking-widest text-center">
              waiting for opponent....
            </p>
          </div>
        </div>
      )}

      {/* Game countdown */}
      {start && (
        <div className="count">
          {count > 0 ? (<>
            <div className="flex items-center justify-center h-screen w-screen z-30">
              <ASCIIText
                text={String(count)}
                enableWaves={true}
                asciiFontSize={6} // slightly smaller for mobile
              />
            </div>
          </>) : (
            <>
              <div className='flex w-full mt-15 z-40'>
                <div className='flex-[2] flex justify-center'>
                  <PlayerBox name={player} ping={player_Ping} type='player' />
                </div>
                <div className='flex-[1] flex justify-center'>
                  <RetroClock Time={time} />
                </div>
                <div className='flex-[2] flex justify-center'>
                  <PlayerBox name={opponent} ping={opp_Ping} type='opp' />
                </div>
              </div>
              <Fight_arena onRestart={restart} />
            </>
          )}
        </div>
      )}
    </>
  )
}
