import React, { Component, createRef } from 'react';

const globalThis = window;
const { requestAnimationFrame, cancelAnimationFrame } = globalThis;

const confettiDefaultOptions = {
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
  count: 200,
  waveAngle: 0,
  timeout: null,
  gravity: 10,
  windSpeed: 1
};
class BridalConfetti {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.options = {
      ...confettiDefaultOptions,
      ...options
    };
    this.height = 0;
    this.particles = [];
    this.width = 0;
    this.stopStremingConfetti = false;
    this.animationId = null;
  }

  updateAndDrawParticles(context) {
    this.options.waveAngle = this.options.waveAngle + 0.01;
    let x2, y2;
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      //update particle
      particle.tiltAngle += particle.tiltAngleIncrement;
      particle.x =
        particle.x + Math.sin(particle.tiltAngle) * 2 - this.options.windSpeed;
      particle.y =
        particle.y +
        (Math.cos(this.options.waveAngle) +
          particle.diameter +
          this.options.gravity) *
          0.2;
      particle.tilt = Math.sin(particle.tiltAngle);
      if (
        particle.x > this.width + 20 ||
        particle.x < -20 ||
        particle.y > this.height
      ) {
        if (this.stopStremingConfetti) {
          this.particles.splice(i, 1);
        } else {
          this.setParticle(particle);
        }
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
  }

  runAnimation(ctx, height, width) {
    ctx.clearRect(0, 0, width, height);
    this.updateAndDrawParticles(ctx);
    this.animationId = requestAnimationFrame(() =>
      this.runAnimation(ctx, height, width)
    );
  }

  setParticle(particle) {
    const randomFn = Math.random;
    const colors = this.options.colors;
    particle.color = colors[parseInt(randomFn() * colors.length, 10)];
    particle.x = randomFn() * this.width;
    particle.y = randomFn() * this.height - this.height;
    particle.diameter = randomFn() * 6 + 6;
    particle.tilt = randomFn() * 10 - 10;
    particle.tiltAngleIncrement = randomFn() * 0.07 + 0.05;
    particle.tiltAngle = randomFn() * Math.PI;
    return particle;
  }

  startAnimation() {
    cancelAnimationFrame(this.animationId);
    this.stopStremingConfetti = false;
    const context = this.canvas.getContext('2d');
    const { width, height } = this.canvas.getBoundingClientRect();
    if (this.canvas.width !== width || this.canvas.height !== height) {
      const { devicePixelRatio: ratio = 1 } = globalThis;
      /**
       * In case the device pixel ratio is more, the particles will be pixelated and will semm blur.
       * That's why we are resizing the canvas.
       * */

      this.canvas.width = width * ratio;
      this.canvas.height = height * ratio;
      context.scale(ratio, ratio);
    }
    this.height = height;
    this.width = width;
    while (this.particles.length < this.options.count) {
      this.particles.push(this.setParticle({}));
    }
    this.runAnimation(context, height, width);
    const { timeout } = this.options;
    if (timeout && Number.isInteger(timeout)) {
      setTimeout(this.stopAnimation.bind(this), timeout);
    }
  }

  stopAnimation() {
    this.stopStremingConfetti = true;
  }

  ummountCanvas() {
    this.particles = [];
    cancelAnimationFrame(this.animationId);
  }
}

class Confetti extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = createRef();
    this.state = {
      canvas: null
    };
  }

  componentDidMount() {
    const canvas = new BridalConfetti(
      this.canvasRef.current,
      this.props.options
    );
    if (this.props.streamAnimation === true) {
      canvas.startAnimation();
    }
    this.setState({ canvas });
  }

  componentDidUpdate() {
    const { streamAnimation } = this.props;
    if (streamAnimation) {
      this.state.canvas.startAnimation();
    } else {
      this.state.canvas.stopAnimation();
    }
  }

  componentWillUnmount() {
    this.state.canvas.ummountCanvas();
  }

  render() {
    const { styles } = this.props;
    return (
      <canvas
        ref={this.canvasRef}
        style={{
          height: '100%',
          width: '100%',
          ...styles
        }}
      />
    );
  }
}

export default Confetti;
