"use client";

import { useState, useEffect } from "react";
import { Home as HomeIcon } from "@pxlkit/ui";
import { Button } from "@/components/ui/pixelact-ui/button";
import { PxlIcon, PxlKitIconData } from "@/components/PxlIcon";

const prologueStoryText =
  "Hari itu, Aii memutuskan mengunjungi sebuah art gallery yang sedang ramai dibicarakan. Dia hanya ingin melihat-lihat dan menghabiskan waktu. Di situlah cerita ini dimulai..";

interface PrologueProps {
  onBackToMenu: () => void;
}

export function Prologue({ onBackToMenu }: PrologueProps) {
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
        setDisplayedText(prologueStoryText.slice(0, index + 1));
        index++;
      } else {
        setIsTypingComplete(true);
        clearInterval(timer);
      }
    }, 60);
    setTimerRef(timer);

    return () => {
      clearTimeout(enterTimer);
      clearInterval(timer);
    };
  }, []);

  const handleSkipTyping = () => {
    if (timerRef) {
      clearInterval(timerRef);
    }
    setDisplayedText(prologueStoryText);
    setIsTypingComplete(true);
  };

  const handleBackToMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onBackToMenu();
    }, 400);
  };

  return (
    <div
      onClick={handleSkipTyping}
      className="absolute inset-0 z-50 flex flex-col items-center justify-between bg-white p-6 pb-8 text-center cursor-pointer select-none"
    >
      <div
        className={`pointer-events-none absolute inset-0 z-[60] bg-black transition-opacity duration-400 ${
          isEntering || isExiting ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className="my-auto w-full max-w-xs flex flex-col items-center justify-center">
        <p className="font-press-start text-xs sm:text-sm leading-relaxed text-[#2d2d2d]">
          {displayedText}
          {!isTypingComplete && (
            <span className="inline-block w-2 h-3.5 bg-[#2d2d2d] ml-1 animate-pulse align-middle">
              &nbsp;
            </span>
          )}
        </p>
      </div>

      {isTypingComplete ? (
        <div className="w-full max-w-xs sm:max-w-sm absolute bottom-6 left-1/2 -translate-x-1/2 px-4 sm:px-6">
          <Button
            variant="yellow"
            size="lg"
            onClick={handleBackToMenu}
            className="group w-full h-12 text-[9px] sm:text-[10px]"
          >
            <PxlIcon icon={HomeIcon as unknown as PxlKitIconData} className="h-4 w-4 shrink-0 transition-transform group-hover:scale-125" />
            <span>BALIK KE MENU</span>
          </Button>
        </div>
      ) : (
        <p className="absolute bottom-6 left-0 right-0 text-[9px] text-[#999999] font-press-start text-center">
          [Klik layar buat skip]
        </p>
      )}
    </div>
  );
}
