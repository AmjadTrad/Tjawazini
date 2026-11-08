"use client";

import { useEffect, useRef } from "react";

const SONG = "/Rose%20Gate.mp3";
const VOLUME = 0.25;

export default function RomanticMusic() {
  const audio = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const a = audio.current!;
    let fade: ReturnType<typeof setInterval> | undefined;

    const start = () => {
      if (!a.paused) return;
      a.volume = 0;
      a.play()
        .then(() => {
          remove();
          fade = setInterval(() => {
            a.volume = Math.min(VOLUME, a.volume + VOLUME / 30);
            if (a.volume >= VOLUME) clearInterval(fade);
          }, 80);
        })
        .catch(() => {});
    };

    const events = ["pointerdown", "keydown", "touchstart"] as const;
    const remove = () => events.forEach((e) => window.removeEventListener(e, start));
    events.forEach((e) => window.addEventListener(e, start));
    start();

    return () => {
      remove();
      clearInterval(fade);
      a.pause();
    };
  }, []);

  return <audio ref={audio} src={SONG} loop preload="auto" />;
}
