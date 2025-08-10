import { Html } from '@react-three/drei';
import { SpinnerRoundFilled } from 'spinners-react';
import { useRoomStore } from '../zustand';
import { set_toast } from './toast';
import { Navigate } from 'react-router-dom';
import { useSocketStore } from './socket';
import type { messageTypes } from '../../types';


export function TerminalUI() {

  const mode = useRoomStore((s) => s.mode);
  const setMode = useRoomStore((s) => s.setMode);
  const roomPass = useRoomStore((s) => s.password);
  const setPassword = useRoomStore((s) => s.setPassword);
  const token = useRoomStore((s) => s.token)
  const settoken = useRoomStore((s) => s.set_token)
  const roomId = useRoomStore((s) => s.roomId);
  const setRoomId = useRoomStore((s) => s.setRoomId)
  const gamerId = useRoomStore((s) => s.gamerId);
  const set_gamerId = useRoomStore((s) => s.setgamerId)
  const time = useRoomStore((s) => s.time);
  const set_time = useRoomStore((s) => s.settime)
  const joined = useRoomStore(S => S.joined)
  const sendWs = useSocketStore(s => s.send);


  const checkTime = (e: any) => {
    const val = e.target.value;
    const num = Number(val);
    if (val === '') {
      set_time(null)
    }
    else if (!/^\d+$/.test(val)) {  // regex ofc by gpt man
      set_toast("Time must be a number", "error");
    } else {
      set_time(num);
    }
  }
  const handleSubmit = () => {
    if (!roomId || !roomPass || !gamerId) {
      set_toast("Details not filled", "warn");
      return;
    }
    if (roomId.length < 4 || roomPass.length < 4) {
      set_toast("ID or password must be at least 4 characters long.", 'error')
      return;
    }
    try {
      console.log("Token:", token);
      setMode('load');
      if (token === "TOKEN_CREATE") {
        const payload: messageTypes = {
          type: "TOKEN_CREATE",
          roomId,
          roomPass,
          gamerId,
          time: time ?? 45 // default value or handle null
        };
        sendWs(payload);
      } else if (token === "TOKEN_JOIN") {
        const payload: messageTypes = {
          type: "TOKEN_JOIN",
          roomId,
          roomPass,
          gamerId
        };
        sendWs(payload);
      }
    } catch (error) {
      return console.log(error)
    }
  }



  return joined ? <Navigate to={`/room/${roomId}`} /> : (
    <Html position={[0.3, 2.1, -2.8]} transform zIndexRange={[100, 0]} center >
      <div id="term">
        {mode === 'select' && (
          <>            {/* // for the gpu to reload for this coloumn */}
            <SpinnerRoundFilled size={0.1} />
            <br />
            <p className='title'>
              Type-Fight.<br />
              <span className='quote'> You type and conquer! </span>
            </p>
            <button className='bt' id='btx' onClick={() => { setMode('create'); settoken('TOKEN_CREATE') }}>Create ⫸</button><br />
            <button className='bt' onClick={() => { setMode('join'); settoken('TOKEN_JOIN') }}>Join ⫸</button><br />
            <button style={{ marginBottom: '5px' }} className='bt' onClick={() => set_toast("Solo Mode Coming Soon", 'info')}>Solo ⫸</button>
          </>
        )}

        {(mode === 'create' || mode === 'join') && (
          <>
            <br />
            <p className='title'>{mode === 'create' ? 'Create Room' : 'Join Room'}</p>
            <input
              className='bt'
              type='text'
              placeholder='Room ID'
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            {/* // for the gpu to reload for this coloumn */}
            <SpinnerRoundFilled size={0.1} />
            <input
              className='bt'
              type='password'
              placeholder='Password'
              value={roomPass}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button className='bt' onClick={() => setMode('options')}>Next</button>
            <button className='bt' onClick={() => setMode('select')}>Back</button>
            <br />
          </>
        )}

        {mode === 'options' && (
          <>
            <SpinnerRoundFilled size={0.1} />
            <br />
            <p className='title'>Details.....</p>
            <br />
            <input
              className='bt'
              type='text'
              placeholder='@userName'
              value={gamerId}
              onChange={(e) => set_gamerId(e.target.value)}
            />
            {token === 'TOKEN_CREATE' && (
              <input
                className='bt'
                type='text'
                placeholder='@time'
                value={time ?? ''}
                onChange={checkTime}
              />
            )}

            <br />
            <button className='bt' onClick={handleSubmit}>Submit</button>
            <button className='bt' onClick={() => setMode('select')}>Back</button>
            <br />
          </>
        )}

        {mode === 'load' && (
          <>
            <br />
            <p className='title p-0.5'>Waiting for opponent..</p>
            {/* wait and set wait for the fucking ws connection !*/}
            <	SpinnerRoundFilled /><br />
            <button className='bt' onClick={() => setMode('select')}>Cancel</button>
            <br />
          </>
        )}
      </div>
    </Html>
  );
}
