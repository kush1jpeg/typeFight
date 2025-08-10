import './App.css'
import ROOM from './assets/components/3dkeyBoard'
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Checker from './assets/components/checker';
import { useEffect } from 'react';
import { useSocketStore } from './assets/components/socket';
import NavigationSetter from './assets/navigate';


function App() {

  const connect = useSocketStore(s => s.connect);
  const disconnect = useSocketStore(s => s.disconnect);

  useEffect(() => {
    connect() // i wanted on terminal mount but then i cant switch to another route as it gets reset 
    return () => {
      disconnect();
    };
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />

      {
        <BrowserRouter>
          <NavigationSetter />
          <Routes>
            <Route path="/" element={<ROOM />} />
            <Route path="/room/:roomId" element={<Checker />} />
          </Routes>
        </BrowserRouter>
      }
    </>
  );
}
export default App
