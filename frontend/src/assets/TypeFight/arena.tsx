import { useCallback } from 'react';
import { useSocketStore } from '../components/socket';
import { useRoomStore } from '../zustand';

const sentence = useRoomStore.getState().sentence;

export function Fight_arena() {
  const sendWS = useSocketStore(s => s.send);
  const roomId = useRoomStore.getState().roomId;
  const player = useRoomStore.getState().gamerId;
  const handleKeyPress = useCallback((key: string) => {
    sendWS({
      type: "KEY_PRESS",
      roomId,
      char: key,
      playerId: player,
    });
  }, [sendWS]);

  return (
    <>
      hi from the game
    </>
  )
}
