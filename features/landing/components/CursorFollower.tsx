import { useEffect, useRef } from 'react';

const SIZE = 512;       
const STIFFNESS = 120;  
const DAMPING = 20;     

export default function CursorFollower() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = { x: 50, y: 50 };
    const pos = { x: 50, y: 50 };
    const vel = { x: 0, y: 0 };
    let last = performance.now();
    let raf = 0;

    const handleMouseMove = (event: MouseEvent): void => {
      target.x = event.clientX;
      target.y = event.clientY;
    };

    const tick = (now: number): void => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      vel.x += ((target.x - pos.x) * STIFFNESS - vel.x * DAMPING) * dt;
      vel.y += ((target.y - pos.y) * STIFFNESS - vel.y * DAMPING) * dt;

      pos.x += vel.x * dt;
      pos.y += vel.y * dt;

      if (ref.current) {
        ref.current.style.transform = `translate3d(${pos.x - SIZE / 2}px, ${pos.y - SIZE / 2}px, 0)`;
      }

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', handleMouseMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed left-0 top-0 -z-50 min-h-126 w-126 rounded-full bg-blue-50 blur-3xl will-change-transform"
    />
  );
}