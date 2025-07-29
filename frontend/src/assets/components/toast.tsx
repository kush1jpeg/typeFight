import { Bounce, toast } from 'react-toastify';

export function set_toast(msg: string , type:"info" | "success" | "warn" | "error" ) {
  //fuking abstractions just func inside funcs
  
  toast[type](msg, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Bounce,
  });
}
