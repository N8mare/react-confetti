import React, { useState } from 'react';
import Confetti from './confetti';

function App() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [streamAnimation, toggleStreamAnimation] = useState(false);
  const [dummyState, setDummyState] = useState(false);
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
          <button onClick={() => toggleStreamAnimation(true)}>start</button>
          <button onClick={() => toggleStreamAnimation(false)}>stop</button>
          <button onClick={rerender}>rerender</button>
          <Confetti options={{ count: 50 }} streamAnimation={streamAnimation} />
        </div>
      )}
    </div>
  );
}

export default App;
