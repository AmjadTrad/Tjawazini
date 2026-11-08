"use client";

import { useState, useRef } from "react";
import Fireworks from "./Fireworks";

const noLabels = [
  "No",
  "mt2kde?",
  "aanjad??",
  "fkri mra tenye!",
  "esa mara?",
  "e5r frsa ha!",
  "m7a 5liki tru7i mni hl mra!",
  "la nshuf min a3nad",
  "I'll ask forever 💍",
];

const hearts = Array.from({ length: 22 }, (_, i) => ({
  left: (i * 37) % 100,
  size: 14 + ((i * 7) % 5) * 9,
  duration: 9 + (i % 6) * 2,
  delay: (i * 1.3) % 12,
  opacity: 0.25 + (i % 4) * 0.12,
  blur: i % 5 === 0 ? 2 : 0,
}));

function Heart({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden>
      <defs>
        <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff4d6d" />
          <stop offset="55%" stopColor="#e5001f" />
          <stop offset="100%" stopColor="#8a0012" />
        </linearGradient>
      </defs>
      <path
        fill="url(#hg)"
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
    </svg>
  );
}

function FloatingHearts() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {hearts.map((h, i) => (
        <span
          key={i}
          className="floating-heart absolute"
          style={
            {
              left: `${h.left}%`,
              animationDuration: `${h.duration}s`,
              animationDelay: `${h.delay}s`,
              filter: h.blur ? `blur(${h.blur}px)` : undefined,
              "--o": h.opacity,
            } as React.CSSProperties
          }
        >
          <svg viewBox="0 0 24 24" width={h.size} height={h.size} fill={i % 3 === 0 ? "#ffb3c1" : "#ff2e4d"}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </span>
      ))}
    </div>
  );
}

function Footer() {
  return (
    <footer className="absolute bottom-0 inset-x-0 z-10 pb-6 text-center">
      <p className="font-script text-3xl text-rose-100/90 drop-shadow-[0_0_12px_rgba(255,40,70,0.8)]">
        Made with love for you <span className="not-italic">❤️</span>
      </p>
    </footer>
  );
}

export default function MarryMe() {
  const [said, setSaid] = useState(false);
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const [noCount, setNoCount] = useState(0);
  const noRef = useRef<HTMLButtonElement>(null);

  const dodge = () => {
    const btn = noRef.current;
    if (!btn) return;
    const { width, height, left, top } = btn.getBoundingClientRect();
    const pad = 20;
    const maxX = window.innerWidth - width - pad;
    const maxY = window.innerHeight - height - pad;

    let x = left;
    let y = top;
    for (let i = 0; i < 30; i++) {
      x = pad + Math.random() * Math.max(0, maxX - pad);
      y = pad + Math.random() * Math.max(0, maxY - pad);
      if (Math.hypot(x - left, y - top) > 150) break;
    }
    setNoPos({ x, y });
    setNoCount((c) => c + 1);
  };

  // Rendered outside the card once moving: the card's backdrop-blur/transform would trap position:fixed.
  const noButton = (
    <button
      ref={noRef}
      onClick={dodge}
      className="cursor-pointer whitespace-nowrap rounded-full border border-white/30 bg-white/5 px-8 py-4 text-lg font-medium text-rose-100/80 backdrop-blur-md transition-[left,top,background-color] duration-300 hover:bg-white/10"
      style={noPos ? { position: "fixed", left: noPos.x, top: noPos.y, zIndex: 50 } : undefined}
    >
      {noLabels[Math.min(noCount, noLabels.length - 1)]}
    </button>
  );

  if (said) {
    return (
      <main className="love-bg relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 text-center">
        <FloatingHearts />
        <Fireworks />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="fade-up text-8xl heartbeat">💍</div>
          <p className="fade-up font-script text-4xl text-rose-200" style={{ animationDelay: "0.2s" }}>
            forever starts now
          </p>
          <div className="fade-up" style={{ animationDelay: "0.4s" }}>
            <h1 className="shimmer-text font-serif text-6xl md:text-8xl font-bold">She said YES!</h1>
          </div>
          <p
            className="fade-up max-w-md text-lg md:text-xl text-rose-100/80 leading-relaxed"
            style={{ animationDelay: "0.6s" }}
          >
            You just made me the happiest person alive. I love you, today, tomorrow, and in every shade of red. ❤️
          </p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="love-bg relative min-h-screen flex flex-col items-center justify-center overflow-x-hidden px-4 pt-8 pb-24">
      <FloatingHearts />

      <div className="relative z-10 w-full max-w-xl rounded-[2.5rem] border border-white/15 bg-white/[0.06] px-6 py-8 md:px-14 md:py-14 text-center shadow-[0_30px_100px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <Heart className="heartbeat fade-up mx-auto h-20 w-20 md:h-32 md:w-32" />

        <p className="fade-up mt-5 font-script text-3xl md:text-4xl text-rose-200" style={{ animationDelay: "0.15s" }}>
          for the girl who I love
        </p>

        <p
          className="fade-up my-4 font-script text-6xl md:text-7xl leading-none text-[#ff4d6d] drop-shadow-[0_0_18px_rgba(255,30,60,0.9)]"
          style={{ animationDelay: "0.22s" }}
        >
          Farah
        </p>

        <div className="fade-up" style={{ animationDelay: "0.3s" }}>
          <h1 className="shimmer-text font-serif text-4xl md:text-6xl font-bold leading-tight">
            Will You Marry Me?
          </h1>
        </div>

        <div className="fade-up mx-auto my-6 flex items-center justify-center gap-3" style={{ animationDelay: "0.45s" }}>
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-rose-300/70" />
          <span className="text-rose-300 text-sm">❤</span>
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-rose-300/70" />
        </div>

        <p
          className="fade-up font-serif italic text-lg md:text-xl text-rose-100/85 leading-relaxed"
          style={{ animationDelay: "0.6s" }}
        >
          I painted everything here in red, because red is your favorite color, and you are my favorite person.
        </p>

        <div
          className="fade-up mt-8 md:mt-10 flex flex-wrap items-center justify-center gap-5"
          style={{ animationDelay: "0.8s" }}
        >
          <button
            onClick={() => {
              setSaid(true);
              fetch("/api/yes", { method: "POST", keepalive: true }).catch(() => {});
            }}
            className="glow-btn cursor-pointer rounded-full bg-gradient-to-b from-[#ff2e4d] to-[#c1121f] px-12 py-4 font-semibold tracking-wide text-white transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ fontSize: `${1.25 + noCount * 0.15}rem` }}
          >
            Yes, forever 💍
          </button>

          {!noPos && noButton}
        </div>
      </div>

      {noPos && noButton}
      <Footer />
    </main>
  );
}
