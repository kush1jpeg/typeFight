import { useParams, Navigate } from "react-router-dom";
import { useRoomStore } from "../zustand";
import { TypeFight } from "../TypeFight/entry";
import { useEffect } from "react";

export default function Checker() {
  const { roomId } = useParams();
  const storeRoomId = useRoomStore((s) => s.roomId);
  const status = useRoomStore((s) => s.status);
  const joined = useRoomStore((s) => s.joined);

  useEffect(() => {
    console.log("Checker saw status change:", status, "joined:", joined, "storeRoomId:", storeRoomId);
  }, [status, joined, storeRoomId]);

  if (status === "idle" || status === "connecting" || !joined || !storeRoomId) {
    return <div className="text-white">Reconnecting...</div>;
  }

  if (status === "connected" && roomId !== storeRoomId) {
    console.log("Exiting due to tampering or invalid room");
    return <Navigate to="/" replace />;
  }


  return (
    <div className="bg-oniViolet">
      {status !== "connected" || !joined ? (
        <div className="absolute inset-0 flex items-center justify-center text-white bg-black/70">
          Reconnecting...
        </div>
      ) : null}
      <TypeFight />
    </div>
  );
}

