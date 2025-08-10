import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useRoomStore } from '../zustand';
import { TypeFight } from '../TypeFight/entry';
import { set_toast } from './toast';

export default function Checker() {
  const { roomId } = useParams();
  const storeRoomId = useRoomStore.getState().roomId;
  const joined = useRoomStore.getState().joined;

  const valid = joined && roomId === storeRoomId; // to track the conditional states

  useEffect(() => {
    if (!valid) {
      set_toast("Connection Lost: kindly restart the game", 'error');

    }
  }, [valid]);

  return valid ? <>
    <div className='bg-oniViolet'><TypeFight /> </div>
  </>
    : <Navigate to="/" replace />;
}

