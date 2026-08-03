"use client";

import { useState, useEffect } from "react";
import { Home as HomeIcon, ArrowRight, BouncingArrow } from "@pxlkit/ui";
import { Button } from "@/components/ui/pixelact-ui/button";
import { PxlIcon, PxlKitIconData } from "@/components/PxlIcon";

interface TicketSceneProps {
  onBackToMenu: () => void;
  onNextScene?: () => void;
}

interface DialogueLine {
  speaker: string;
  text: string;
  expression: string;
}

const dialogueData: DialogueLine[] = [
  {
    speaker: "AII",
    text: "Fiuhh.. finally nyampe juga.. Katanya viral tapi kok sepi ya??",
    expression: "/char/aii/senyum.PNG",
  },
  {
    speaker: "AII",
    text: "Oh iya! kalo gitu aku beli tiket dulu deh..",
    expression: "/char/aii/ngomong.PNG",
  },
  {
    speaker: "AII",
    text: "Mas, tiketnya satu ya..",
    expression: "/char/aii/senyum.PNG",
  },
  {
    speaker: "PETUGAS LOKET",
    text: "Maaf kak, tempat ini udah dibooking full, jadi hari ini gallery ditutup buat umum",
    expression: "/char/aii/sedih.PNG",
  },
];

export function TicketScene({ onBackToMenu, onNextScene }: TicketSceneProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isWalkingIn, setIsWalkingIn] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [isEnteringScene, setIsEnteringScene] = useState(true);
  const [timerRef, setTimerRef] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsEnteringScene(false);
    }, 50);

    const walkTimer = setTimeout(() => {
      setIsWalkingIn(false);
    }, 3200);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(walkTimer);
    };
  }, []);

  useEffect(() => {
    const currentDialogue = dialogueData[currentLineIndex];
    if (!currentDialogue) return;

    setDisplayedText("");
    setIsTypingComplete(false);
    let index = 0;

    const timer = setInterval(() => {
      if (index < currentDialogue.text.length) {
        setDisplayedText(currentDialogue.text.slice(0, index + 1));
        index++;
      } else {
        setIsTypingComplete(true);
        clearInterval(timer);
      }
    }, 35);

    setTimerRef(timer);

    return () => {
      clearInterval(timer);
    };
  }, [currentLineIndex]);

  const handleBoxClick = () => {
    if (!isTypingComplete) {
      if (timerRef) clearInterval(timerRef);
      setDisplayedText(dialogueData[currentLineIndex].text);
      setIsTypingComplete(true);
    } else {
      if (currentLineIndex !== 1 && currentLineIndex < dialogueData.length - 1) {
        setCurrentLineIndex((prev) => prev + 1);
      }
    }
  };

  const handleBuyTicket = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentLineIndex(2);
  };

  const handleBackToMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onBackToMenu();
    }, 400);
  };

  const currentDialogue = dialogueData[currentLineIndex];
  const isFinalLine = currentLineIndex === dialogueData.length - 1;
  const isBuyTicketLine = currentLineIndex === 1;

  const currentExpression = !isTypingComplete && currentLineIndex === 0
    ? "/char/aii/ngomong.PNG"
    : currentDialogue.expression;

  return (
    <div className="relative h-full w-full flex flex-col justify-between overflow-hidden select-none">
      <div
        className={`pointer-events-none absolute inset-0 z-[70] bg-black transition-opacity duration-400 ${
          isEnteringScene || isExiting ? "opacity-100" : "opacity-0"
        }`}
      />

      <img
        src="/asset/lobby.png"
        alt="Lobby Background"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

      <div className="relative z-30 flex items-center justify-between p-4">
        <button
          onClick={handleBackToMenu}
          className="flex items-center gap-1.5 border-2 border-[#2d2d2d] bg-[#ffffba] px-3 py-1.5 text-[9px] font-bold text-[#2d2d2d] shadow-[2px_2px_0px_0px_#2d2d2d] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
        >
          <PxlIcon icon={HomeIcon as unknown as PxlKitIconData} className="h-3.5 w-3.5" />
          <span>MENU</span>
        </button>

        <div className="border-2 border-[#2d2d2d] bg-[#bae1ff] px-3 py-1 text-[8px] sm:text-[9px] font-bold text-[#2d2d2d] shadow-[2px_2px_0px_0px_#2d2d2d]">
          LOKET TIKET
        </div>
      </div>

      <div className="relative z-20 flex-1 flex items-end justify-center -mb-10 sm:-mb-12 px-4 pointer-events-none overflow-hidden">
        <div
          className={`relative w-48 sm:w-52 transition-all duration-300 ${
            isWalkingIn ? "animate-step-in" : "animate-pixel-idle"
          }`}
        >
          <img
            src={currentExpression}
            alt="Aii Character"
            className="w-full h-auto object-contain drop-shadow-[0_6px_6px_rgba(0,0,0,0.3)] transition-all duration-200"
          />
        </div>
      </div>

      <div className="relative z-40 w-full px-3 pb-3">
        <div
          onClick={handleBoxClick}
          className="relative w-full border-4 border-[#2d2d2d] bg-[#faf7f2]/95 p-3.5 sm:p-4 shadow-[4px_4px_0px_0px_#2d2d2d] backdrop-blur-xs cursor-pointer min-h-[145px] sm:min-h-[160px] flex flex-col justify-between transition-all"
        >
          <div className="absolute -top-4.5 left-3 border-2 border-[#2d2d2d] bg-[#ffb3ba] px-2.5 py-0.5 shadow-[2px_2px_0px_0px_#2d2d2d]">
            <span className="font-press-start text-[9px] sm:text-[10px] font-bold text-[#2d2d2d]">
              {currentDialogue.speaker}
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
              {isBuyTicketLine && isTypingComplete ? "" : isFinalLine ? "[Selesai]" : "[Klik buat lanjut]"}
            </span>

            {!isFinalLine && !isBuyTicketLine && (
              <PxlIcon icon={BouncingArrow as unknown as PxlKitIconData} className="h-4 w-4 shrink-0" />
            )}
          </div>

          {isBuyTicketLine && isTypingComplete && (
            <div className="mt-2 w-full pt-1">
              <Button
                variant="mint"
                size="default"
                onClick={handleBuyTicket}
                className="w-full group h-9 text-[8.5px] sm:text-[9px] flex items-center justify-center gap-2 border-2 border-[#2d2d2d] shadow-[3px_3px_0px_0px_#2d2d2d]"
              >
                <span>BELI TIKET</span>
                <PxlIcon icon={ArrowRight as unknown as PxlKitIconData} className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
