"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#ff2e4d", "#ff4d6d", "#ffb3c1", "#ffd166", "#ffffff", "#e5001f"];

type Rocket = { x: number; y: number; vy: number; targetY: number; color: string };
type Spark = { x: number; y: number; vx: number; vy: number; life: number; decay: number; color: string; size: number };

function createSound() {
  const ac = new AudioContext();
  ac.resume();
  const master = ac.createGain();
  master.gain.value = 0.5;
  master.connect(ac.destination);

  const noise = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  const noiseSource = () => {
    const src = ac.createBufferSource();
    src.buffer = noise;
    return src;
  };

  const whistle = () => {
    const t = ac.currentTime;
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(400 + Math.random() * 200, t);
    osc.frequency.exponentialRampToValueAtTime(1400 + Math.random() * 600, t + 0.9);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.04, t + 0.1);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
    osc.connect(g).connect(master);
    osc.start(t);
    osc.stop(t + 1);
  };

  const boom = () => {
    const t = ac.currentTime;
    const src = noiseSource();
    const filter = ac.createBiquadFilter();
    const g = ac.createGain();
    const pan = ac.createStereoPanner();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1800, t);
    filter.frequency.exponentialRampToValueAtTime(120, t + 1.2);
    g.gain.setValueAtTime(0.9, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.4);
    pan.pan.value = Math.random() * 1.2 - 0.6;
    src.connect(filter).connect(g).connect(pan).connect(master);
    src.start(t, Math.random());
    src.stop(t + 1.5);

    for (let i = 0; i < 14; i++) {
      const ct = t + 0.25 + Math.random() * 0.9;
      const c = noiseSource();
      const hp = ac.createBiquadFilter();
      const cg = ac.createGain();
      hp.type = "highpass";
      hp.frequency.value = 3000;
      cg.gain.setValueAtTime(0.12 * Math.random() + 0.04, ct);
      cg.gain.exponentialRampToValueAtTime(0.001, ct + 0.04);
      c.connect(hp).connect(cg).connect(pan);
      c.start(ct, Math.random());
      c.stop(ct + 0.05);
    }
  };

  return { whistle, boom, close: () => ac.close() };
}

export default function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const rockets: Rocket[] = [];
    const sparks: Spark[] = [];
    const pick = () => COLORS[Math.floor(Math.random() * COLORS.length)];
    const sound = createSound();

    const launch = () => {
      sound.whistle();
      rockets.push({
        x: w * (0.15 + Math.random() * 0.7),
        y: h,
        vy: -(h * 0.012 + Math.random() * 4),
        targetY: h * (0.12 + Math.random() * 0.35),
        color: pick(),
      });
    };

    const explode = (x: number, y: number, color: string) => {
      sound.boom();
      const heartShape = Math.random() < 0.35;
      const count = heartShape ? 90 : 70 + Math.floor(Math.random() * 40);
      for (let i = 0; i < count; i++) {
        let vx: number, vy: number;
        if (heartShape) {
          const t = (i / count) * Math.PI * 2;
          vx = (16 * Math.sin(t) ** 3) * 0.28;
          vy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 0.28;
        } else {
          const a = Math.random() * Math.PI * 2;
          const s = 1.5 + Math.random() * 5;
          vx = Math.cos(a) * s;
          vy = Math.sin(a) * s;
        }
        sparks.push({
          x,
          y,
          vx,
          vy,
          life: 1,
          decay: 0.008 + Math.random() * 0.012,
          color: Math.random() < 0.8 ? color : pick(),
          size: 1.5 + Math.random() * 1.8,
        });
      }
    };

    let frame = 0;
    let raf = 0;
    const tick = () => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      if (frame % 28 === 0) launch();
      if (frame % 75 === 0) launch();
      frame++;

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy;
        r.vy *= 0.985;
        ctx.fillStyle = r.color;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        if (r.y <= r.targetY || r.vy > -1.5) {
          explode(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.975;
        s.vy = s.vy * 0.975 + 0.045;
        s.life -= s.decay;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = s.life;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      sound.close();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 h-full w-full" aria-hidden />;
}
