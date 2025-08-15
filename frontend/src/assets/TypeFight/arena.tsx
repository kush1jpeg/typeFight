import { useCallback, useEffect, useRef, useState } from 'react';
import { useSocketStore } from '../components/socket';
import { useRoomStore } from '../zustand';
import WinnerDialog from '../components/restartBox';

type fight = {
  onRestart: () => void;
}
export function Fight_arena({ onRestart }: fight) {
  const sendWS = useSocketStore(s => s.send);
  const roomId = useRoomStore.getState().roomId;
  const sentence = useRoomStore(s => s.sentence);
  const player = useRoomStore.getState().gamerId;
  const [typed, setTyped] = useState(''); //frontend
  const [cursor, setCursor] = useState(0); // frontend
  const inputRef = useRef<HTMLInputElement>(null);
  const mistake = useRoomStore(s => s.mistake);
  const oppCursor = useRoomStore(s => s.Opp_cursor);
  const winner = useRoomStore(s => s.winner);
  const [opp_cursor, set_oppCursor] = useState(0);

  useEffect(() => {
    set_oppCursor(prev => prev + oppCursor);
  }, [oppCursor]);

  useEffect(() => {
    if (mistake) {
      const timer = setTimeout(() => {
        useRoomStore.setState({ mistake: false });
      }, 400); // match animation duration
      return () => clearTimeout(timer);
    }
  }, [mistake]);

  useEffect(() => {
    inputRef.current?.focus(); // always focus input
  }, []);

  const [currentWord, setCurrentWord] = useState("");


  const handleKeyPress = useCallback((key: string) => {
    if (key.length === 1 && key !== " ") {
      // regular letter/number/punctuation
      setCurrentWord(prev => prev + key);
      setTyped(prev => prev + key);
      setCursor(prev => prev + 1);
    }

    if (key === " ") {
      // commit word to server
      sendWS({
        type: "WORD_TYPED",
        roomId,
        playerId: player,
        code: "WORD_BOUNDARY",
        word: currentWord
      });
      setCurrentWord(""); // start next word fresh
      setTyped(prev => prev + " ");
      setCursor(prev => prev + 1);
    }

    if (key === "Backspace") {
      if (currentWord.length > 0) {
        // just delete locally
        setCurrentWord(prev => prev.slice(0, -1));
        setTyped(prev => prev.slice(0, -1));
        setCursor(prev => prev - 1);
      }
    }
  }, [currentWord, sendWS, roomId, player]);

  function onTimeout() {
    console.log("sending room delete from restart")
    sendWS(
      {
        type: "ROOM_DELETE",
        roomId,
      })
  }

  function Restart() {
    onRestart();
    sendWS(
      {
        type: "ROUND_RESTART",
        roomId,
      })
  }




  const charsPerLine = 200;
  return (
    <>
      {winner && (
        <div className='z-50'>
          <WinnerDialog winnerName={winner} onTimeout={onTimeout} onRestart={Restart} />
        </div>
      )}
      <div className="relative w-full max-w-7xl mx-auto mt-[20vh] font-mono text-4xl leading-[2.2rem] z-49">
        {/* Invisible focused input */}
        <input
          ref={inputRef}
          onKeyDown={(e) => {
            handleKeyPress(e.key);
          }}
          className="absolute opacity-0 pointer-events-none"
          autoFocus
        />

        {/* Typing box */}
        <div
          className="h-[25rem] overflow-hidden relative z-49"
          style={{
            lineHeight: "2.3rem", // explicit line height for vertical calc
          }}
        >
          <div
            className="flex flex-wrap gap-1 transition-transform duration-200 ease-out z-50"
            style={{
              transform: `translateY(-${Math.floor(cursor / charsPerLine) * 2.3}rem)`,
              // move vertically by line-height in rem units (line height = 2.2rem)
            }}
          >
            {sentence.split("").map((char: string, idx: number) => {
              let className = "text-gray-400"; // default
              if (idx < typed.length) {
                className = typed[idx] === char ? "text-green-400" : "text-red-500";
              }

              return (
                <span key={idx} className={className} style={{ position: 'relative' }}>
                  {char === " " ? "\u00A0" : char}
                  {idx === cursor && <span className="cursor mr-5 bg-winterGreen" />}
                  {idx === opp_cursor && (
                    <span
                      className={`cursor mr-5 bg-autumnRed ${mistake ?? "squiggle-once"}`} />
                  )}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </>)
}
