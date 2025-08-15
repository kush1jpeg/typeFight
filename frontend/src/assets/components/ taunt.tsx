import { useRoomStore } from "../zustand";

export default function TauntDisplay() {
  const taunt = useRoomStore(s => s.taunt);
  if (!taunt) return null; // nothing to show

  return (
    <div className="absolute top-4 right-4 text-4xl animate-bounce">
      {taunt}
    </div>
  );
}
