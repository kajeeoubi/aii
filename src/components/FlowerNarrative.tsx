"use client";

import { useState, useEffect } from "react";
import { playButtonSound, playTypewriterSound, playPopSound, setBGMVolume } from "@/lib/audioManager";

interface FlowerArrangingNarrativeProps {
  onBackToMenu: () => void;
  onNextScene?: () => void;
}

const narrativeText =
  "Mereka berdua pergi ke area tempat merangkai bunga dan menghabiskan waktu bersama..\n\nWhen yahh..";

export function FlowerArrangingNarrative({
  onBackToMenu,
  onNextScene,
}: FlowerArrangingNarrativeProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [timerRef, setTimerRef] = useState<NodeJS.Timeout | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(true);

  useEffect(() => {
    const enterTimer = setTimeout(() => {
      setIsEntering(false);
    }, 50);

    setBGMVolume(0.15, 500);

    setDisplayedText("");
    setIsTypingComplete(false);
    let index = 0;
    const timer = setInterval(() => {
      if (index < narrativeText.length) {
        const char = narrativeText[index];
        setDisplayedText(narrativeText.slice(0, index + 1));
        if (char && char !== " " && char !== "\n") {
          playTypewriterSound();
        }
        index++;
      } else {
        setIsTypingComplete(true);
        playPopSound();
        clearInterval(timer);
      }
    }, 50);
    setTimerRef(timer);

    return () => {
      clearTimeout(enterTimer);
      clearInterval(timer);
    };
  }, []);

  const handleScreenClick = () => {
    playButtonSound();
    if (isExiting) return;

    if (!isTypingComplete) {
      if (timerRef) {
        clearInterval(timerRef);
      }
      setDisplayedText(narrativeText);
      setIsTypingComplete(true);
    } else {
      setIsExiting(true);
      setTimeout(() => {
        if (onNextScene) {
          onNextScene();
        } else {
          onBackToMenu();
        }
      }, 400);
    }
  };

  return (
    <div
      onClick={handleScreenClick}
      className="absolute inset-0 z-50 flex flex-col items-center justify-between bg-white p-6 pb-8 text-center cursor-pointer select-none"
    >
      <div
        className={`pointer-events-none absolute inset-0 z-[60] bg-black transition-opacity duration-400 ${
          isEntering || isExiting ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="my-auto w-full max-w-xs flex flex-col items-center justify-center">

        <p className="font-press-start text-xs sm:text-sm leading-relaxed text-[#2d2d2d] whitespace-pre-line">
          {displayedText}
          {!isTypingComplete && (
            <span className="inline-block w-2 h-3.5 bg-[#2d2d2d] ml-1 animate-pulse align-middle">
              &nbsp;
            </span>
          )}
        </p>
      </div>

      <p className="absolute bottom-6 left-0 right-0 text-[9px] text-[#999999] font-press-start text-center animate-pulse">
        [Klik dimana aja buat lanjut]
      </p>
    </div>
  );
}
