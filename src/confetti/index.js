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
const globalThis = window;

const { requestAnimationFrame, cancelAnimationFrame } = globalThis;

const Confetti = ({ playAnimation = false, styles = {} }) => {
  const canvasRef = useRef(null);
  let count = 200;
  const particles = [];
  let waveAngle = 0;
  let height;
  let width;

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const { width, height } = canvas.getBoundingClientRect();
    context.clearRect(0, 0, width, height);
  };

  const updateAndDrawParticles = (context) => {
    waveAngle = waveAngle + 0.01;
    let x2, y2;
    for (let particle of particles) {
      //update particle
      particle.tiltAngle += particle.tiltAngleIncrement;
      particle.x = particle.x + Math.sin(particle.tiltAngle) * 2 - 1;
      particle.y =
        particle.y +
        (Math.cos(waveAngle) + particle.diameter + confetti.speed) * 0.2;
      particle.tilt = Math.sin(particle.tiltAngle);
      if (particle.x > width + 20 || particle.x < -20 || particle.y > height) {
        setParticle(particle);
        particle.y = -20;
      }
      //draw particle
      context.beginPath();
      context.lineWidth = particle.diameter;
      x2 =
        particle.x - particle.diameter / 3 + particle.tilt * particle.diameter;
      y2 = particle.y + particle.diameter + particle.tilt * particle.diameter;
      context.strokeStyle = particle.color;
      context.moveTo(particle.x, particle.y);
      context.lineTo(x2, y2);
      context.stroke();
      context.closePath();
    }
  };

  const setParticle = (particle) => {
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

  useEffect(() => {
    let animationId;
    const runAnimation = (ctx, height, width) => {
      ctx.clearRect(0, 0, width, height);
      updateAndDrawParticles(ctx);
      animationId = requestAnimationFrame(() =>
        runAnimation(ctx, height, width)
      );
    };

    if (playAnimation === true) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      ({ width, height } = canvas.getBoundingClientRect());
      if (canvas.width !== width || canvas.height !== height) {
        const { devicePixelRatio: ratio = 1 } = globalThis;
        /**
         * In case the device pixel ratio is more, the particles will be pixelated and will semm blur.
         * That's why we are resizing the canvas.
         * */
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        count = parseInt(canvas.width / 10, 10);
        context.scale(ratio, ratio);
      }

      while (particles.length < count) {
        particles.push(setParticle({}, width, height));
      }
      runAnimation(context, height, width);
    }
    return () => {
      cancelAnimationFrame(animationId);
      clearCanvas();
    };
  }, [playAnimation]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        height: '100%',
        width: '100%',
        ...styles
      }}
    />
  );
};

export default Confetti;
