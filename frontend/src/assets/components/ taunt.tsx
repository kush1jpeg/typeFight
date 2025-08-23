import { useRoomStore } from "../zustand";

export default function TauntDisplay() {
  const taunt = useRoomStore(s => s.taunt);
  if (!taunt) return null; // nothing to show

  return (
    <div className="text-5xl fixed right-[30vw] p-2.5 mr-10 animate-bounce z-[9999]">
      {taunt}
    </div>
  );
}
