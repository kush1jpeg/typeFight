// insane piece of code told by gpt!

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

let _navigate: (path: string) => void;

export const setNavigator = (navFn: typeof _navigate) => {
  _navigate = navFn;
};

export const navigateTo = (path: string) => {
  if (!_navigate) {
    console.warn("Navigator is not set yet!");
    return;
  }
  _navigate(path);
};

export default function NavigationSetter() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  return null;
}
