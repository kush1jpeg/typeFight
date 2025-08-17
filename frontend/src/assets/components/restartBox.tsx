import React, { useEffect, useState } from "react";

interface WinnerDialogProps {
  winnerName: string | null;
  onRestart: () => void;
  onTimeout: () => void; // delete room trigger
}


const WinnerDialog: React.FC<WinnerDialogProps> = ({ winnerName, onRestart, onTimeout }) => {
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          //onTimeout();
          console.log("time over");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeout]);

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
      {/* Dialog container */}
      <div className="relative bg-gradient-to-br from-purple-900 to-purple-700 border-4 border-pink-500 rounded-2xl shadow-lg shadow-purple-900 p-6 w-[400px] text-center font-mono z-49">

        {/* Trophy placeholder */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-24 h-24 bg-yellow-400 border-4 border-yellow-600 rounded-full shadow-lg shadow-yellow-600 flex items-center justify-center text-4xl">
          🏆
        </div>

        {/* Winner name */}
        <h1
          className="mt-12 mb-4 text-3xl font-bold"
          style={{
            fontFamily: "'Comic Sans MS', cursive, sans-serif",
            color: "#ffdd00",
            textShadow: "2px 2px 4px #000",
          }}
        >
          {winnerName} Wins!
        </h1>

        {/* Countdown bar */}
        <div className="w-full h-4 bg-purple-950 rounded-full overflow-hidden mb-4 border border-purple-300">
          <div
            className="h-full bg-pink-500 transition-all duration-1000 ease-linear"
            style={{
              width: `${(timeLeft / 10) * 100}%`,
            }}
          ></div>
        </div>

        {/* Restart button */}
        <button
          onClick={onRestart}
          className="mt-2 px-4 py-2 bg-pink-500 hover:bg-pink-400 border-2 border-pink-300 rounded-lg text-white font-bold shadow-md shadow-pink-900"
        >
          Restart
        </button>

        {/* Countdown text */}
        <p className="mt-2 text-purple-200 text-sm">{timeLeft}s until room closes</p>
      </div>
    </div>
  );
};

export default WinnerDialog;
