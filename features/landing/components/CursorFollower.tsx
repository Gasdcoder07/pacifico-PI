import { useEffect, useRef } from 'react';

const SIZE = 512;
const STIFFNESS = 120;
const DAMPING = 20;
const EPSILON = 0.15;

export default function CursorFollower() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { x: target.x, y: target.y };
    const vel = { x: 0, y: 0 };
    let last = performance.now();
    let raf = 0;
    let running = false;

    const render = (): void => {
      node.style.transform = `translate3d(${Math.round(pos.x - SIZE / 2)}px, ${Math.round(pos.y - SIZE / 2)}px, 0)`;
    };

    const tick = (now: number): void => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      vel.x += ((target.x - pos.x) * STIFFNESS - vel.x * DAMPING) * dt;
      vel.y += ((target.y - pos.y) * STIFFNESS - vel.y * DAMPING) * dt;

      pos.x += vel.x * dt;
      pos.y += vel.y * dt;

      render();

      const settled =
        Math.abs(target.x - pos.x) < EPSILON &&
        Math.abs(target.y - pos.y) < EPSILON &&
        Math.abs(vel.x) < EPSILON &&
        Math.abs(vel.y) < EPSILON;

      if (settled) {
        running = false;
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    const start = (): void => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const handleMouseMove = (event: MouseEvent): void => {
      target.x = event.clientX;
      target.y = event.clientY;
      start();
    };

    render();

    const section = node.parentElement;
    const observer = section
      ? new IntersectionObserver(
          ([entry]) => {
            node.style.opacity = entry.isIntersecting ? '1' : '0';
          },
          { rootMargin: '0px 0px -20% 0px' },
        )
      : null;

    observer?.observe(section!);

    const interactive =
      !window.matchMedia('(pointer: coarse)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    return () => {
      observer?.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(raf);
      running = false;
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 -z-10 h-[512px] w-[512px] transform-gpu rounded-full bg-blue-50/60 opacity-0 blur-3xl transition-opacity duration-700 will-change-transform"
    />
  );
}
