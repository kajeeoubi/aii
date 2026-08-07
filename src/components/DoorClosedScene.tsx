"use client";

import { useState, useEffect } from "react";
import { Home as HomeIcon, BouncingArrow } from "@pxlkit/ui";
import { playButtonSound, playTypewriterSound, playPopSound } from "@/lib/audioManager";
import { PxlIcon, PxlKitIconData } from "@/components/PxlIcon";

interface DoorClosedSceneProps {
  onBackToMenu: () => void;
  onNextScene?: () => void;
}

interface DialogueLine {
  speaker: string;
  badgeBg: string;
  text: string;
  expression: string;
  screenImage?: string;
}

const dialogueData: DialogueLine[] = [
  {
    speaker: "NARATOR",
    badgeBg: "bg-[#ffffba]",
    text: "KKKKRrk!! Pintu ruangan rahasia tiba-tiba tertutup lagi..",
    expression: "/char/aii/nangis.png",
  },
  {
    speaker: "AII",
    badgeBg: "bg-[#ffb3ba]",
    text: "Hiks..",
    expression: "/char/aii/nangis.png",
  },
  {
    speaker: "AII",
    badgeBg: "bg-[#ffb3ba]",
    text: ".........",
    expression: "/char/aii/nangis.png",
  },
  {
    speaker: "AII",
    badgeBg: "bg-[#ffb3ba]",
    text: "Kibo?! Apa itu kamu?!! Apa kamu denger aku?! Kiboo!!",
    expression: "/char/aii/nangis.png",
    screenImage: "/asset/layar.png",
  },
  {
    speaker: "KIBO",
    badgeBg: "bg-[#bae1ff]",
    text: "Makasi ya Aii buat semuanya.. sampai jumpa lagi..",
    expression: "/char/aii/nangis.png",
    screenImage: "/asset/layar_2.png",
  },
  {
    speaker: "AII",
    badgeBg: "bg-[#ffb3ba]",
    text: "NGGAKK!! Pliss jangan pergi!!",
    expression: "/char/aii/nangis.png",
  },
  {
    speaker: "AII",
    badgeBg: "bg-[#ffb3ba]",
    text: ".......",
    expression: "/char/aii/nangis.png",
  },
  {
    speaker: "NARATOR",
    badgeBg: "bg-[#ffffba]",
    text: "DUARRRrr!! Suara gemuruh terdengar dari luar ruangan itu, semuanya runtuh tak tersisa..",
    expression: "/char/aii/nangis.png",
  },
];

export function DoorClosedScene({
  onBackToMenu,
  onNextScene,
}: DoorClosedSceneProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isEnteringScene, setIsEnteringScene] = useState(true);
  const [timerRef, setTimerRef] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsEnteringScene(false);
    }, 50);

    return () => {
      clearTimeout(fadeTimer);
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
        const char = currentDialogue.text[index];
        setDisplayedText(currentDialogue.text.slice(0, index + 1));
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
      clearInterval(timer);
    };
  }, [currentLineIndex]);

  useEffect(() => {
    if (currentLineIndex === dialogueData.length - 1 && isTypingComplete && !isExiting) {
      const autoExitTimer = setTimeout(() => {
        if (!isExiting) {
          setIsExiting(true);
          setTimeout(() => {
            if (onNextScene) {
              onNextScene();
            } else {
              onBackToMenu();
            }
          }, 1000);
        }
      }, 2500);

      return () => clearTimeout(autoExitTimer);
    }
  }, [currentLineIndex, isTypingComplete, isExiting, onNextScene, onBackToMenu]);

  const handleBoxClick = () => {
    playButtonSound();
    const currentDialogue = dialogueData[currentLineIndex];
    if (!isTypingComplete) {
      if (timerRef) clearInterval(timerRef);
      setDisplayedText(currentDialogue.text);
      setIsTypingComplete(true);
    } else {
      if (currentLineIndex < dialogueData.length - 1) {
        setCurrentLineIndex((prev) => prev + 1);
      } else {
        handleBackToMenu();
      }
    }
  };

  const handleBackToMenu = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playButtonSound();
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      if (onNextScene) {
        onNextScene();
      } else {
        onBackToMenu();
      }
    }, 1000);
  };

  const currentDialogue = dialogueData[currentLineIndex];
  const isFinalLine = currentLineIndex === dialogueData.length - 1;

  return (
    <div className="relative h-full w-full flex flex-col justify-between overflow-hidden select-none bg-white">
      {/* Black transition overlay */}
      <div
        className={`pointer-events-none absolute inset-0 z-[70] bg-black transition-opacity duration-1000 ${
          isEnteringScene || isExiting ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Header Bar */}
      <div className="relative z-30 flex items-center justify-between p-4">
        <button
          onClick={handleBackToMenu}
          className="flex items-center gap-1.5 border-2 border-[#2d2d2d] bg-[#ffffba] px-3 py-1.5 text-[9px] font-bold text-[#2d2d2d] shadow-[2px_2px_0px_0px_#2d2d2d] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
        >
          <PxlIcon icon={HomeIcon as unknown as PxlKitIconData} className="h-3.5 w-3.5" />
          <span>MENU</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-end px-4 pointer-events-none overflow-hidden pb-2">
        {/* 16:9 Aspect Ratio Screen Frame (Layar) */}
        {currentDialogue.screenImage && (
          <div className="w-full max-w-[300px] sm:max-w-[320px] mb-3 transition-all duration-500 animate-fadeIn">
            <div className="relative w-full aspect-video border-4 border-[#2d2d2d] bg-black shadow-[4px_4px_0px_0px_#2d2d2d] rounded-sm overflow-hidden">
              <img
                src={currentDialogue.screenImage}
                alt="Layar Monitor"
                className="w-full h-full object-cover transition-opacity duration-700"
              />
            </div>
          </div>
        )}

        {/* Character Sprite Area - AII standing on white background */}
        <div className={`relative flex items-end justify-center w-full max-w-sm transition-all duration-300 ${currentDialogue.screenImage ? "h-48 sm:h-56 -mb-6" : "h-72 sm:h-76 -mb-8"} animate-pixel-idle`}>
          <img
            src={currentDialogue.expression || "/char/aii/nangis.png"}
            alt="AII"
            className="h-full w-auto object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]"
          />
        </div>
      </div>

      {/* Dialogue Box */}
      <div className="relative z-40 w-full px-3 pb-3">
        <div
          onClick={handleBoxClick}
          className="relative w-full border-4 border-[#2d2d2d] bg-[#faf7f2]/95 p-3.5 sm:p-4 shadow-[4px_4px_0px_0px_#2d2d2d] backdrop-blur-xs cursor-pointer min-h-[145px] sm:min-h-[160px] flex flex-col justify-between transition-all"
        >
          <div
            className={`absolute -top-4.5 left-3 border-2 border-[#2d2d2d] ${currentDialogue.badgeBg} px-2.5 py-0.5 shadow-[2px_2px_0px_0px_#2d2d2d]`}
          >
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
              [Klik buat lanjut]
            </span>

            <PxlIcon icon={BouncingArrow as unknown as PxlKitIconData} className="h-4 w-4 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
