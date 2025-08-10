import React, { useEffect, useState } from "react";

type RetroClockProps = {
  initialTime: number; // in seconds
  onComplete?: () => void;
};

const RetroClock: React.FC<RetroClockProps> = ({ initialTime, onComplete }) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    if (time <= 0) {
      onComplete && onComplete();
      return;
    }

    const timer = setInterval(() => setTime((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [time, onComplete]);

  const isFinalFive = time <= 5;

  return (
    <div
      className={`
        flex items-center justify-center
        bg-[#2a004f]  /* deep purple background to match your dark purple base */
        border-4 border-[#ff00ff]  /* neon magenta */
        rounded-xl
        px-6 py-3 font-mono text-4xl
        ${isFinalFive ? "animate-pulse-scale" : ""}
        relative z-50
        text-[#ff00ff]  /* neon magenta text */
        shadow-[0_0_15px_rgba(255,0,255,0.8)]
      `}
      style={{ minWidth: "120px" }}
    >
      {time}
    </div>
  );
};


export default RetroClock;

