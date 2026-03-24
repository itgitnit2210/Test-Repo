"use client";

import { useRef, useEffect, useState } from "react";
import { PARTICLES, MOBILE_COUNT, TABLET_COUNT } from "@/lib/particleData";

export default function Particles({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const [count, setCount] = useState(PARTICLES.length);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setCount(w < 768 ? MOBILE_COUNT : w < 1024 ? TABLET_COUNT : PARTICLES.length);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const dots = PARTICLES.slice(0, count).map((p) => ({
      ...p,
      phase: Math.random() * Math.PI * 2,
      speed: 0.15 + Math.random() * 0.3,
      drift: 0.002 + Math.random() * 0.004,
    }));

    const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let t0 = performance.now();

    const render = (now: number) => {
      const r = canvas.getBoundingClientRect();
      const w = r.width, h = r.height;
      ctx.clearRect(0, 0, w, h);

      const elapsed = (now - t0) / 1000;
      // Fade in over 2.5 seconds
      const fadeIn = Math.min(elapsed / 2.5, 1);

      dots.forEach((d) => {
        const dx = prefersReduced ? 0 : Math.sin(elapsed * d.speed + d.phase) * d.drift * w;
        const dy = prefersReduced ? 0 : Math.cos(elapsed * d.speed * 0.7 + d.phase) * d.drift * h;
        const px = d.x * w + dx;
        const py = d.y * h + dy;
        const scale = w / 1920;
        const radius = Math.max(d.r * scale, 0.5);

        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(128,130,133,${0.5 * fadeIn})`;
        ctx.fill();
      });

      frameRef.current = requestAnimationFrame(render);
    };

    frameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return <canvas ref={canvasRef} className={className} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden="true" />;
}
