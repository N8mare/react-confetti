import React, { useState, useRef } from 'react';
import Confetti from './confetti';

function App() {
  const startBtn = useRef(null);
  const stopBtn = useRef(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [dummyState, setDummyState] = useState(false);

  const startAnimation = () => {
    startBtn.current.click();
  };
  const stopAnimation = () => {
    stopBtn.current.click();
  };
  const rerender = () => {
    setDummyState(!dummyState);
  };

  return (
    <div className="App">
      <button
        onClick={() => setShowConfetti(!showConfetti)}
        style={{
          paddin: '30px',
          background: 'blue',
          color: 'white',
          margin: '25px'
        }}
      >
        Click Me to mount/unmount confetti component
      </button>
      {showConfetti && (
        <div style={{ width: '100vh', height: '100vh', background: 'pink' }}>
          <button onClick={startAnimation}>start</button>
          <button onClick={stopAnimation}>stop</button>
          <button onClick={rerender}>rerender</button>
          <Confetti startRef={startBtn} stopRef={stopBtn} />
        </div>
      )}
    </div>
  );
}

export default App;
