import React, { useState } from 'react';
import Confetti from './confetti';

function App() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [streamAnimation, toggleStreamAnimation] = useState(false);
  const [streamAnimation2, toggleStreamAnimation2] = useState(false);

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
        Click Me to toggle animation
      </button>
      {showConfetti && (
        <div style={{ display: 'flex', 'justify-content': 'space-between' }}>
          <div style={{ width: '100vh', height: '100vh', background: 'pink' }}>
            <button onClick={() => toggleStreamAnimation(true)}>start</button>
            <button onClick={() => toggleStreamAnimation(false)}>stop</button>
            <Confetti
              options={{ count: 50, timeout: 30000 }}
              streamAnimation={streamAnimation}
            />
          </div>
          <div style={{ width: '100vh', height: '100vh', background: 'pink' }}>
            <button onClick={() => toggleStreamAnimation2(true)}>start</button>
            <button onClick={() => toggleStreamAnimation2(false)}>stop</button>
            <Confetti
              options={{ count: 150, gravity: 15, windSpeed: 5 }}
              streamAnimation={streamAnimation2}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
