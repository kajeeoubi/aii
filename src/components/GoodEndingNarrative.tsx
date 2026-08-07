"use client";

import { useState, useEffect } from "react";
import { playButtonSound, playTypewriterSound, playPopSound } from "@/lib/audioManager";

interface GoodEndingNarrativeProps {
  onBackToMenu: () => void;
  onNextScene?: () => void;
}

const narrativeText =
  "[Ending 1] \n\nYeayy selamat kamu berhasil menyelesaikan game ini!! ini adalah ending impian aku sih wkwkwk, lucuww bgtt gasi mereka hahahah \n\nWhen yah kek gini, pasti bakal jadi couple paling sweet and fun gasih?? \n\nOh iya, kalo kamu lagi bosen atau kangen maybe jangan ragu buat mampir lagi ya, kalo kamu butuh tempat cerita or wanna tell someting, kamu bisa tinggalin pesan di \"DIARY KITA\" \n\nBye.. Byee.. <3";

export function GoodEndingNarrative({ onBackToMenu, onNextScene }: GoodEndingNarrativeProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [timerRef, setTimerRef] = useState<NodeJS.Timeout | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(true);

  useEffect(() => {
    const enterTimer = setTimeout(() => {
      setIsEntering(false);
    }, 50);

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
    }, 45);
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
      className="absolute inset-0 z-50 flex flex-col items-center justify-between bg-[#faf7f2] p-6 pb-8 text-center cursor-pointer select-none overflow-y-auto"
    >
      <div
        className={`pointer-events-none absolute inset-0 z-[60] bg-black transition-opacity duration-400 ${
          isEntering || isExiting ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="my-auto w-full max-w-sm flex flex-col items-center justify-center gap-4 py-6">
        <p className="font-press-start text-[10px] sm:text-xs leading-relaxed text-[#2d2d2d] whitespace-pre-line text-center">
          {displayedText}
          {!isTypingComplete && (
            <span className="inline-block w-2 h-3.5 bg-[#2d2d2d] ml-1 animate-pulse align-middle">
              &nbsp;
            </span>
          )}
        </p>
      </div>

      <p className="mt-auto text-[9px] text-[#999999] font-press-start text-center animate-pulse">
        [Klik dimana aja buat lanjut]
      </p>
    </div>
  );
}
