'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

export default function CreativeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let mouse = { x: canvas.width / 2, y: canvas.height / 2, radius: 150 };
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      mouse.x = canvas.width / 2;
      mouse.y = canvas.height / 2;
    };

    class FlowField {
      cols: number;
      rows: number;
      field: number[][];
      resolution: number;

      constructor(resolution: number, width: number, height: number) {
        this.resolution = resolution;
        this.cols = Math.floor(width / resolution);
        this.rows = Math.floor(height / resolution);
        this.field = [];
        this.update();
      }

      update() {
        this.field = [];
        for (let y = 0; y < this.rows; y++) {
          this.field[y] = [];
          for (let x = 0; x < this.cols; x++) {
            const angle =
              Math.cos(x * 0.01 + time * 0.001) * Math.sin(y * 0.01 + time * 0.001) * Math.PI * 2;
            this.field[y][x] = angle;
          }
        }
      }

      lookup(x: number, y: number) {
        const col = Math.floor(x / this.resolution);
        const row = Math.floor(y / this.resolution);
        if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
          return this.field[row][col];
        }
        return 0;
      }
    }

    const flowField = new FlowField(20, canvas.width, canvas.height);

    const createParticle = (x?: number, y?: number): Particle => {
      return {
        x: x ?? Math.random() * canvas.width,
        y: y ?? Math.random() * canvas.height,
        vx: 0,
        vy: 0,
        life: 1,
        maxLife: Math.random() * 200 + 100,
        size: Math.random() * 2 + 0.5,
        hue: Math.random() * 60 + 180, // Blue to cyan range
      };
    };

    const initParticles = () => {
      particles = [];
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 300);
      for (let i = 0; i < count; i++) {
        particles.push(createParticle());
      }
    };

    const updateParticles = () => {
      // Fade effect for trails
      ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      flowField.update();

      particles.forEach((particle, index) => {
        // Flow field influence
        const angle = flowField.lookup(particle.x, particle.y);
        const flowForce = 0.3;
        particle.vx += Math.cos(angle) * flowForce;
        particle.vy += Math.sin(angle) * flowForce;

        // Mouse interaction - attraction and repulsion
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);

          // Repulsion
          particle.vx -= Math.cos(angle) * force * 2;
          particle.vy -= Math.sin(angle) * force * 2;
        }

        // Damping
        particle.vx *= 0.95;
        particle.vy *= 0.95;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Update life
        particle.life--;

        // Draw particle
        const alpha = Math.min(particle.life / 50, 1) * 0.8;
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 3
        );

        gradient.addColorStop(0, `hsla(${particle.hue}, 80%, 60%, ${alpha})`);
        gradient.addColorStop(0.5, `hsla(${particle.hue}, 70%, 50%, ${alpha * 0.5})`);
        gradient.addColorStop(1, `hsla(${particle.hue}, 60%, 40%, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections
        particles.slice(index + 1, index + 6).forEach((other) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            const alpha = ((100 - dist) / 100) * 0.15;
            ctx.strokeStyle = `hsla(${(particle.hue + other.hue) / 2}, 70%, 60%, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });

        // Respawn particle
        if (particle.life <= 0) {
          particles[index] = createParticle();
        }
      });

      time++;
      animationFrameId = requestAnimationFrame(updateParticles);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleClick = (e: MouseEvent) => {
      // Create burst of particles on click
      for (let i = 0; i < 20; i++) {
        particles.push(createParticle(e.clientX, e.clientY));
      }
    };

    const handleResize = () => {
      resizeCanvas();
      flowField.cols = Math.floor(canvas.width / flowField.resolution);
      flowField.rows = Math.floor(canvas.height / flowField.resolution);
      initParticles();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    resizeCanvas();
    initParticles();

    // Initial dark background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    updateParticles();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ background: '#0a0a0a' }}
    />
  );
}
