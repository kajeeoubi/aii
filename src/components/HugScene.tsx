"use client";

import { useState, useEffect } from "react";
import { BouncingArrow } from "@pxlkit/ui";
import { playButtonSound, playTypewriterSound, playPopSound } from "@/lib/audioManager";
import { PxlIcon, PxlKitIconData } from "@/components/PxlIcon";

interface HugSceneProps {
  onBackToMenu?: () => void;
  onNextScene: () => void;
}

interface DialogueLine {
  speaker: string;
  badgeBg: string;
  text: string;
}

const dialogueData: DialogueLine[] = [
  {
    speaker: "NARATOR",
    badgeBg: "bg-[#ffffba]",
    text: "Aii tiba tiba memeluk kibo dengan erat (aww sweet kali wok ;D)",
  },
  {
    speaker: "AII",
    badgeBg: "bg-[#ffb3ba]",
    text: "Makasii Kibo.. Hiks.. Makasii..",
  },
  {
    speaker: "KIBO",
    badgeBg: "bg-[#bae1ff]",
    text: "Sama sama Aii",
  },
  {
    speaker: "PETUGAS GALLERY",
    badgeBg: "bg-[#ffd166]",
    text: "Bang pliss, aku sama siapa pelukannya?? (awikwok banget wok hahah)",
  },
  {
    speaker: "KIBO",
    badgeBg: "bg-[#bae1ff]",
    text: "Shhhttt.. (Diem dulu banh lagi menang nih)",
  },
  {
    speaker: "PETUGAS GALLERY",
    badgeBg: "bg-[#ffd166]",
    text: "WHENN YAHH.. (Senyumku menjadi saldo dana awokaowk)",
  },
];

export function HugScene({ onBackToMenu, onNextScene }: HugSceneProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isEnteringScene, setIsEnteringScene] = useState(true);
  const [isShaking, setIsShaking] = useState(true);
  const [timerRef, setTimerRef] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const enterTimer = setTimeout(() => {
      setIsEnteringScene(false);
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
    }, 35);

    setTimerRef(timer);

    return () => {
      clearInterval(timer);
    };
  }, [currentLineIndex]);

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
        if (isExiting) return;
        setIsExiting(true);
        setTimeout(() => {
          onNextScene();
        }, 1000);
      }
    }
  };

  const handleBackToMenu = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playButtonSound();
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      if (onBackToMenu) {
        onBackToMenu();
      } else {
        onNextScene();
      }
    }, 1000);
  };

  const currentDialogue = dialogueData[currentLineIndex];
  const isFinalLine = currentLineIndex === dialogueData.length - 1;

  return (
    <div
      className={`relative h-full w-full flex flex-col justify-between overflow-hidden select-none bg-[#faf7f2] ${isShaking ? "animate-shake" : ""
        }`}
    >
      {/* Black transition overlay */}
      <div
        className={`pointer-events-none absolute inset-0 z-[70] bg-black transition-opacity duration-1000 ${isEnteringScene || isExiting ? "opacity-100" : "opacity-0"
          }`}
      />

      {/* Peluk Background Image */}
      <img
        src="/asset/peluk.png"
        alt="Hug Scene Background"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Empty flex container to push dialogue box to the bottom */}
      <div className="flex-1" />

      {/* Dialogue Box */}
      <div className="relative z-40 w-full px-3 pb-3">
        <div
          onClick={handleBoxClick}
          className="relative w-full border-4 border-[#2d2d2d] bg-[#faf7f2]/95 p-3.5 sm:p-4 shadow-[4px_4px_0px_0px_#2d2d2d] backdrop-blur-xs min-h-[145px] sm:min-h-[160px] flex flex-col justify-between transition-all cursor-pointer"
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
              {isFinalLine && isTypingComplete
                ? "[Klik buat lanjut]"
                : "[Klik buat lanjut]"}
            </span>

            <PxlIcon
              icon={BouncingArrow as unknown as PxlKitIconData}
              className="h-4 w-4 shrink-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
