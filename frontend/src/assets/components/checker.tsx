import { useState} from 'react';
import { useParams } from 'react-router-dom';
import { useRoomStore } from '../zustand';
import { TypeFight} from '../TypeFight/entry';
import { useSocketStore } from './socket';
import { set_toast } from './toast';

export default function Checker() {

  const { roomId } = useParams();
  const connect = useSocketStore(s => s.connect);
  const sendWs =(e:any)=> useSocketStore(s => s.send(e))
  const [localGamerId, setGamerId] = useState('');
  const [localPassword, setPassword] = useState('');

  const joined = useRoomStore(s => s.joined);
  const setStoreGamerId = useRoomStore(s => s.setgamerId);
  const setStorePassword = useRoomStore(s => s.setPassword);

     const validateCredentials = () => {
        if (!localGamerId || !localPassword) {
      set_toast('Both fields required' , 'error');
      return;
    }
        connect()
    setStoreGamerId(localGamerId);
    setStorePassword(localPassword);
    sendWs({
      type: "TOKEN_JOIN",
      roomId,
      roomPass: localPassword,
      gamerId: localGamerId,
    });
  };

  
  return joined?<TypeFight/>:(
    <div className="auth">
      <h2>Join Room {roomId}</h2>
      <input
        placeholder="Enter gamerID"
        value={localGamerId}
        onChange={(e) => setGamerId(e.target.value)}
      />
      <input
        placeholder="Enter Password"
        type="password"
        value={localPassword}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={validateCredentials}>Join</button>
    </div>
  );
}
