import './App.css'
import ROOM from './assets/components/3dkeyBoard'
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLoadingStore } from './assets/atoms';
import { DotLoader} from 'react-spinners';
import type { CSSProperties } from 'react';

const override: CSSProperties = {
  display: "block",
    margin: "50vh auto",
  width:'30px',
};

function App() {
 const loaded = useLoadingStore((s) => s.isLoaded)
  return (
    <>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce} />

      {!loaded && <DotLoader    //to load till the 3d env boots up
      cssOverride={override} 
        color='#f1d946' 
         size={40} 
         />}

        < ROOM />
        
    </>
  )
}

export default App
