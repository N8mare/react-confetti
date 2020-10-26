import React, { useEffect, useRef } from 'react';

const confetti = {
  colors: [
    'DodgerBlue',
    'OliveDrab',
    'Gold',
    'pink',
    'SlateBlue',
    'lightblue',
    'Violet',
    'PaleGreen',
    'SteelBlue',
    'SandyBrown',
    'Chocolate',
    'Crimson'
  ],
  speed: 8
};
const globalThis =  window;

const { requestAnimationFrame, cancelAnimationFrame } = globalThis;

const Confetti = props => {
  const canvasRef = useRef(null);
  let count = 200;
  const particles = [];
  let waveAngle = 0;
  let animationId;
  let height;
  let width;

  const updateAndDrawParticles = context => {
    waveAngle = waveAngle + 0.01;
    let x2, y2;
    for (let particle of particles) {
      //update particle
      particle.tiltAngle += particle.tiltAngleIncrement;
      particle.x = particle.x + Math.sin(particle.tiltAngle) * 2 - 1;
      particle.y = particle.y + (Math.cos(waveAngle) + particle.diameter + confetti.speed) * 0.2;
      particle.tilt = Math.sin(particle.tiltAngle);
      if (particle.x > width + 20 || particle.x < -20 || particle.y > height) {
        setParticle(particle);
        particle.y = -20;
      }
      //draw particle
      context.beginPath();
      context.lineWidth = particle.diameter;
      x2 = particle.x - particle.diameter / 3 + particle.tilt * particle.diameter;
      y2 = particle.y + particle.diameter + particle.tilt * particle.diameter;
      context.strokeStyle = particle.color;
      context.moveTo(particle.x, particle.y);
      context.lineTo(x2, y2);
      context.stroke();
      context.closePath();
    }
  };

  const runAnimation = ctx => {
    ctx.clearRect(0, 0, width, height);
    updateAndDrawParticles(ctx);
    animationId = requestAnimationFrame(() => runAnimation(ctx));
  };

  const setParticle = particle => {
    const randomFn = Math.random;
    const colors = confetti.colors;
    particle.color = colors[parseInt(randomFn() * colors.length, 10)];
    particle.x = randomFn() * width;
    particle.y = randomFn() * height - height;
    particle.diameter = randomFn() * 6 + 6;
    particle.tilt = randomFn() * 10 - 10;
    particle.tiltAngleIncrement = randomFn() * 0.07 + 0.05;
    particle.tiltAngle = randomFn() * Math.PI;
    return particle;
  };

  const startAnimation = ctx => {
    height = ctx.canvas.height;
    width = ctx.canvas.width;
    while (particles.length < count) {
      particles.push(setParticle({}, width, height));
    }
    runAnimation(ctx);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const { width, height } = canvas.getBoundingClientRect();
    if (canvas.width !== width || canvas.height !== height) {
      const { devicePixelRatio: ratio = 1 } = globalThis;
      const context = canvas.getContext('2d');
      /**
       * In case the device pixel ratio is more, the particles will be pixelated and will semm blur.
       * That's why we are resizing the canvas.
       * */
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      count = parseInt(canvas.width / 10, 10);
      context.scale(ratio, ratio);
    }
    if (props.animationTimeout) {
      setTimeout(() => {
        cancelAnimationFrame(animationId);
      }, props.animationTimeout);
    }
    startAnimation(context);
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        height: '100%',
        width: '100%',
        ...props.style
      }}
    />
  );
};

export default Confetti;
