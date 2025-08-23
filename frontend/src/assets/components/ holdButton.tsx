// from - https://www.dzialowski.eu/hold-to-confirm-button/

import React from "react"

const HOLD_DELAY = 1500 // 1.5 seconds of holding needed to trigger action

type Confirm_type = {
  onClick: () => void;
};

export const ConfirmButton = ({ onClick }: Confirm_type) => {
  const startTime = React.useRef<null | number>(null)
  const holdIntervalRef = React.useRef<null | number>(null)

  const startCounter = () => {
    // Set startTime to current time
    startTime.current = Date.now()

    // We will check if the timer is finished in the interval
    holdIntervalRef.current = setInterval(() => {
      // Check if enough time has elapsed
      if (startTime.current && Date.now() - startTime.current > HOLD_DELAY) {
        // When 2 seconds elapsed clear interval and trigger callback
        stopCounter();
        onClick();
      }
    }, 10)
  }

  const stopCounter = () => {
    startTime.current = null
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current)
      holdIntervalRef.current = null
    }
  }

  return (
    <div className="flex items-center justify-center h-screen w-screen z-50">
      <button className="nasa-btn absolute "
        onMouseDown={startCounter} // When user clicks the button we start the counter
        onMouseUp={stopCounter} // When user lift the button we stop the counter
      >
        ░▒▓█ Hold to Initialize █▓▒░
      </button>
    </div>
  )
}

