import React from "react"

const HOLD_DELAY = 1500 // 2 seconds of holding needed to trigger action

type Confirm_type = {
  onSubmit: () => void;
};

export const ConfirmButton = ({ onSubmit }: Confirm_type) => {
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
        stopCounter()
        onSubmit()
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
    <button className="nasa-btn mt-[50vh] ml-[40vw]"
      onMouseDown={startCounter} // When user clicks the button we start the counter
      onMouseUp={stopCounter} // When user lift the button we stop the counter
    >
      ░▒▓█ Hold to Initialize █▓▒░
    </button>
  )
}

