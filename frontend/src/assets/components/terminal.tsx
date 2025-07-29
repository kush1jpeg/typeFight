import { Html } from '@react-three/drei';
import {useState } from 'react';
import { SpinnerRoundFilled } from 'spinners-react';
import { useRoomStore } from '../atoms';
import { set_toast } from './toast';



export function TerminalUI() {
  const password = useRoomStore((s) => s.password);
  const setPassword = useRoomStore((s) => s.setPassword);
  const [mode, setMode] = useState<'select' | 'create' | 'join' | 'load'>('select');
 const roomId = useRoomStore((s) => s.roomId);
  const setRoomId=useRoomStore((s) => s.setRoomId)

  const handleSubmit = () => {
    if (!roomId) {
      set_toast("RoomId is required.", "warn");
      return;
    }

    console.log("Form Submitted");
    console.log("Room:", roomId);
    console.log("Password:", password);
    setMode('load'); // or whatever comes next
  };

  return (
    <Html position={[0.3, 2.1, -2.8]} transform zIndexRange={[100, 0]} center >
      <div id="term">
        {mode === 'select' && (
          <>
            <p className='title'>
              Type-Fight.<br />
              <span className='quote'> You type and conquer! </span>
            </p>
            <button className='bt' id='btx' onClick={() => setMode('create')}>Create ⫸</button><br />
            <button className='bt' onClick={() => setMode('join')}>Join ⫸</button><br />
            <button className='bt' onClick={() => set_toast("Solo Mode Coming Soon" , 'info')}>Solo ⫸</button>
          </>
        )}

        {(mode === 'create' || mode === 'join') && (
          <>
            <p className='title'>{mode === 'create' ? 'Create Room' : 'Join Room'}</p>
            <input
              className='bt'
              type='text'
              placeholder='Room ID'
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            {/* // for the gpu to reload for this coloumn */}
            <SpinnerRoundFilled size={0.1}/>                 
            <input
              className='bt'
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            /><br />
            <button className='bt' onClick={handleSubmit}>Submit</button><br />
            <button className='bt' onClick={() => setMode('select')}>Back</button>
          </>
        )}

        {mode === 'load' && (
          <>
            <p className='title'>Waiting for others...</p>       
            {/* wait and set wait for the fucking ws connection !*/}
          <	SpinnerRoundFilled />
            <button className='bt' onClick={() => setMode('select')}>Cancel</button>
            <br />
          </>
        )}
      </div>
    </Html>
  );
}
