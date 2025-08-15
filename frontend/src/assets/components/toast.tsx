import { Bounce, toast } from 'react-toastify';

export function set_toast(msg: string, type: "info" | "success" | "warn" | "error") {
  //fuking abstractions just func inside funcs

  toast[type](msg, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Bounce,
  });
}
