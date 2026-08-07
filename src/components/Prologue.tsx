"use client";

import { useState, useEffect } from "react";
import { playButtonSound, playTypewriterSound, playPopSound } from "@/lib/audioManager";

interface PrologueProps {
  onBackToMenu: () => void;
  onNextToTicket?: () => void;
}

const prologueStoryText =
  "Alkisah, seorang anak manusia yang sangat menyebalkan bernama Aii pergi jalan-jalan ke sebuah gallery, dia niatnya sih cuma liat liat aja terus balik.\n\nNamun, sesuatu yang ga disangka terjadi tempat itu dan disitulah cerita ini berawal..";

export function Prologue({ onBackToMenu, onNextToTicket }: PrologueProps) {
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
      if (index < prologueStoryText.length) {
        const char = prologueStoryText[index];
        setDisplayedText(prologueStoryText.slice(0, index + 1));
        if (char && char !== " " && char !== "\n") {
          playTypewriterSound();
        }
        index++;
      } else {
        setIsTypingComplete(true);
        playPopSound();
        clearInterval(timer);
      }
    }, 60);
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
      setDisplayedText(prologueStoryText);
      setIsTypingComplete(true);
    } else {
      setIsExiting(true);
      setTimeout(() => {
        if (onNextToTicket) {
          onNextToTicket();
        } else {
          onBackToMenu();
        }
      }, 400);
    }
  };


  return (
    <div
      onClick={handleScreenClick}
      className="absolute inset-0 z-50 flex flex-col items-center justify-between bg-[#faf7f2] p-6 pb-8 text-center cursor-pointer select-none"
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
