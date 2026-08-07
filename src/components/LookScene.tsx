"use client";

import { useState, useEffect } from "react";
import { playButtonSound, playPopSound } from "@/lib/audioManager";

interface LookSceneProps {
  onBackToMenu?: () => void;
  onNextScene?: () => void;
}

export function LookScene({ onNextScene, onBackToMenu }: LookSceneProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const [isShaking, setIsShaking] = useState(true);

  useEffect(() => {
    const enterTimer = setTimeout(() => {
      setIsEntering(false);
      playPopSound();
    }, 50);

    const shakeTimer = setTimeout(() => {
      setIsShaking(false);
    }, 700);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(shakeTimer);
    };
  }, []);

  const handleScreenClick = () => {
    playButtonSound();
    if (isExiting) return;

    setIsExiting(true);
    setTimeout(() => {
      if (onNextScene) {
        onNextScene();
      } else if (onBackToMenu) {
        onBackToMenu();
      }
    }, 400);
  };

  return (
    <div
      onClick={handleScreenClick}
      className={`absolute inset-0 z-50 flex flex-col items-center justify-between bg-white p-6 pb-8 text-center cursor-pointer select-none overflow-hidden ${
        isShaking ? "animate-shake" : ""
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-0 z-[60] bg-black transition-opacity duration-400 ${
          isEntering || isExiting ? "opacity-100" : "opacity-0"
        }`}
      />

      <img
        src="/asset/lihat.png"
        alt="Look Scene"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="pointer-events-none absolute inset-0 bg-black/10" />

      <p className="relative z-10 mt-auto text-[9px] sm:text-[10px] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-press-start animate-pulse">
        [Klik dimana aja buat lanjut]
      </p>
    </div>
  );
}
