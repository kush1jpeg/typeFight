import './App.css'
import ROOM from './assets/components/3dkeyBoard'
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Checker from './assets/components/checker';


function App() {

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