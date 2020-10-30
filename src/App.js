import React, { useState } from 'react';
import Confetti from './confetti';

function App() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [start, setStart] = useState(false);
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
          <button onClick={() => setStart(true)}>start</button>
          <button onClick={() => setStart(false)}>stop</button>
          <Confetti playAnimation={start} />
        </div>
      )}
    </div>
  );
}

export default App;
