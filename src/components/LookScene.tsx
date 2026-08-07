"use client";

import { useState, useEffect } from "react";
import { BouncingArrow } from "@pxlkit/ui";
import { playButtonSound, playTypewriterSound, playPopSound } from "@/lib/audioManager";
import { PxlIcon, PxlKitIconData } from "@/components/PxlIcon";

interface LookSceneProps {
  onBackToMenu?: () => void;
  onNextScene?: () => void;
}

const dialogueText = "Maafin aku..";

export function LookScene({ onNextScene, onBackToMenu }: LookSceneProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const [isShaking, setIsShaking] = useState(true);
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [timerRef, setTimerRef] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const enterTimer = setTimeout(() => {
      setIsEntering(false);
      playPopSound();
    }, 50);

    const shakeTimer = setTimeout(() => {
      setIsShaking(false);
    }, 700);

    setDisplayedText("");
    setIsTypingComplete(false);
    let index = 0;

    const timer = setInterval(() => {
      if (index < dialogueText.length) {
        const char = dialogueText[index];
        setDisplayedText(dialogueText.slice(0, index + 1));
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
      clearTimeout(shakeTimer);
      clearInterval(timer);
    };
  }, []);

  const handleScreenClick = () => {
    playButtonSound();
    if (isExiting) return;

    if (!isTypingComplete) {
      if (timerRef) clearInterval(timerRef);
      setDisplayedText(dialogueText);
      setIsTypingComplete(true);
    } else {
      setIsExiting(true);
      setTimeout(() => {
        if (onNextScene) {
          onNextScene();
        } else if (onBackToMenu) {
          onBackToMenu();
        }
      }, 400);
    }
  };

  return (
    <div
      onClick={handleScreenClick}
      className={`absolute inset-0 z-50 flex flex-col items-center justify-between bg-white select-none overflow-hidden cursor-pointer ${
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

      <div className="pointer-events-none absolute inset-0 bg-black/20" />

      {/* Dialogue Box without character sprite (tanpa ekspresi) */}
      <div className="relative z-40 w-full px-3 pb-3 mt-auto">
        <div className="relative w-full border-4 border-[#2d2d2d] bg-[#faf7f2]/95 p-3.5 sm:p-4 shadow-[4px_4px_0px_0px_#2d2d2d] backdrop-blur-xs min-h-[145px] sm:min-h-[160px] flex flex-col justify-between transition-all">
          <div className="absolute -top-4.5 left-3 border-2 border-[#2d2d2d] bg-[#ffb3ba] px-2.5 py-0.5 shadow-[2px_2px_0px_0px_#2d2d2d]">
            <span className="font-press-start text-[9px] sm:text-[10px] font-bold text-[#2d2d2d]">
              AII
            </span>
          </div>

          <div className="pt-3 text-left">
            <p className="font-press-start text-[9px] sm:text-[10px] leading-relaxed text-[#2d2d2d]">
              {displayedText}
              {!isTypingComplete && (
                <span className="inline-block w-1.5 h-3 bg-[#2d2d2d] ml-1 animate-pulse align-middle">
                  &nbsp;
                </span>
              )}
            </p>
          </div>

          <div className="mt-2 flex items-center justify-between pt-1">
            <span className="text-[7.5px] sm:text-[8px] text-[#888888] font-press-start">
              [Klik buat lanjut]
            </span>

            <PxlIcon icon={BouncingArrow as unknown as PxlKitIconData} className="h-4 w-4 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
