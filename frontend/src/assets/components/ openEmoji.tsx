import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import emoji from "../stock/happy.png";
import { useSocketStore } from './socket';
import { useRoomStore } from '../zustand';

const actions = [
  { icon: '😂', name: 'laugh' },
  { icon: '😭', name: 'cry' },
  { icon: '🖕', name: 'bird' },
  { icon: '🤡', name: 'clown' },
  { icon: '💔', name: 'broken' },
];

export default function Emoji_Dial() {
  const sendWs = useSocketStore(s => s.send)
  const roomId = useRoomStore.getState().roomId

  function handleEmojiClick(prop: string) {
    sendWs({
      type: "MESSAGE",
      roomId,
      msg: prop,
    })
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: '32rem',
        right: '13.5rem',
        zIndex: 9999,
        scale: 0.9,
      }}
    >
      <SpeedDial
        ariaLabel="Emoji Dial"
        icon={<img src={emoji} alt="emoji" className="w-10 h-10 object-contain scale-125" />}
        direction="up"
        FabProps={{
          sx: {
            bgcolor: '#7fb4ca',
            '&:hover': {
              bgcolor: 'gray.200',
            },
          },
        }}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            onClick={() => handleEmojiClick(action.icon)}
            icon={<span className="text-5xl">{action.icon}</span>}
            slotProps={{
              fab: {
                sx: {
                  bgcolor: 'white',
                  scale: '85%',
                  color: 'black',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  '&:hover': {
                    bgcolor: '#f0f0f0',
                    scale: 1.1
                  },
                  opacity: 1,
                },
              },
              tooltip: {
                sx: {
                  bgcolor: 'rgba(255,255,255,0.95)',
                  color: 'black',
                  fontWeight: 'normal',
                },
              },
            }}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}

