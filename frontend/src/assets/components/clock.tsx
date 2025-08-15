import React, { useEffect, useState } from "react";

type RetroClockProps = {
  Time: number; // in seconds
};

const RetroClock: React.FC<RetroClockProps> = ({ Time }) => {
  const [time, setTime] = useState(Time);

  useEffect(() => { setTime(Time) }, [Time])
  const isFinalFive = time < 5;
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
      style={{ minWidth: "130px" }}
    >
      {time}
    </div>
  );
};


export default RetroClock;

