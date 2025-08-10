import React from "react";

type PlayerInfoProps = {
  name: string;
  ping: number;
  type: string;
};

const PlayerBox: React.FC<PlayerInfoProps> = ({ name, ping, type }) => {
  return (
    <>
      <div
        className={`
        bg-black border-[5px] rounded-3xl
        ${type === "opp" ? "border-autumnRed" : "border-winterGreen"}
        text-neonGreen px-5 py-3 w-[260px] font-mono
        relative z-50 overflow-hidden
      `}>
        {/* Retro scanline effect */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(0,255,0,0.2)_1px,transparent_1px)] bg-[length:100%_2px]" />

        {/* Name */}
        <div className="text-lg uppercase tracking-widest">{name}</div>

        {/* Ping */}
        <div className="text-sm opacity-80">
          Ping:{" "}
          <span className={ping > 100 ? "text-red-400" : "text-neonGreen"}>
            {ping} ms
          </span>
        </div>
      </div>
    </>
  );
};

export default PlayerBox;

