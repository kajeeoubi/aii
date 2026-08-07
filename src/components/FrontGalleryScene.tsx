"use client";

import { useState, useEffect } from "react";
import { Home as HomeIcon, BouncingArrow } from "@pxlkit/ui";
import { playButtonSound, playFootstepSound, stopFootstepSound, playTypewriterSound, playPopSound } from "@/lib/audioManager";
import { PxlIcon, PxlKitIconData } from "@/components/PxlIcon";

interface GallerySceneProps {
  onBackToMenu: () => void;
  onNextScene?: () => void;
}

interface DialogueLine {
  speaker: string;
  text: string;
  expression: string;
  typingExpression?: string;
}

const dialogueData: DialogueLine[] = [
  {
    speaker: "KIBO",
    text: "Pelan pelan Aii jangan berisik, ntar kita bisa ketauan ama petugasnya loh..",
    typingExpression: "/char/kibo/ngomong_senyum.png",
    expression: "/char/kibo/senyum.png",
  },
  {
    speaker: "AII",
    text: "Iyaa.. Pokoknya kalo nanti kita kepergok aku cuma bilang ikut ikutan doang!",
    expression: "/char/aii/kawatir.png",
  },
  {
    speaker: "KIBO",
    text: "Humm.. Cewe emang gamau disalahin (ucap pelan)",
    expression: "/char/kibo/bingung.png",
  },
  {
    speaker: "AII",
    text: "Apa, kamu ngomong apa tadi?!",
    expression: "/char/aii/kesel.png",
  },
  {
    speaker: "KIBO",
    text: "Hehehe.. Ngga kok, aku tadi ngomong \"You look so fine with your dress today\"",
    expression: "/char/kibo/ketawa.png",
  },
  {
    speaker: "AII",
    text: "Hihihihi.. Makasi Kibo",
    expression: "/char/aii/malu.png",
  },
  {
    speaker: "KIBO",
    text: "Yaudah ayo pertama tama kita masuk ke dalam gallery itu",
    typingExpression: "/char/kibo/ngomong_senyum.png",
    expression: "/char/kibo/senyum.png",
  },
];

export function GalleryScene({ onBackToMenu, onNextScene }: GallerySceneProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isWalkingIn, setIsWalkingIn] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [isEnteringScene, setIsEnteringScene] = useState(true);
  const [timerRef, setTimerRef] = useState<NodeJS.Timeout | null>(null);

  const [lastAiiExpr, setLastAiiExpr] = useState("/char/aii/kawatir.png");
  const [lastKiboExpr, setLastKiboExpr] = useState("/char/kibo/senyum.png");

  useEffect(() => {
    playFootstepSound(3200);
    const fadeTimer = setTimeout(() => {
      setIsEnteringScene(false);
    }, 50);

    const walkTimer = setTimeout(() => {
      setIsWalkingIn(false);
    }, 3200);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(walkTimer);
      stopFootstepSound();
    };
  }, []);

  useEffect(() => {
    const currentDialogue = dialogueData[currentLineIndex];
    if (!currentDialogue) return;

    if (currentDialogue.speaker === "AII") {
      setLastAiiExpr(currentDialogue.expression);
    } else if (currentDialogue.speaker === "KIBO") {
      setLastKiboExpr(currentDialogue.expression);
    }

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
    if (!isTypingComplete) {
      if (timerRef) clearInterval(timerRef);
      setDisplayedText(dialogueData[currentLineIndex].text);
      setIsTypingComplete(true);
    } else {
      if (currentLineIndex < dialogueData.length - 1) {
        setCurrentLineIndex((prev) => prev + 1);
      } else if (currentLineIndex === dialogueData.length - 1) {
        if (onNextScene) {
          onNextScene();
        } else {
          handleBackToMenu({ stopPropagation: () => { } } as React.MouseEvent);
        }
      }
    }
  };

  const handleBackToMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    playButtonSound();
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onBackToMenu();
    }, 1000);
  };

  const currentDialogue = dialogueData[currentLineIndex];
  const isFinalLine = currentLineIndex === dialogueData.length - 1;

  useEffect(() => {
    if (isTypingComplete && currentDialogue) {
      if (currentDialogue.speaker === "AII" && currentDialogue.expression) {
        setLastAiiExpr(currentDialogue.expression);
      } else if (currentDialogue.speaker === "KIBO" && currentDialogue.expression) {
        setLastKiboExpr(currentDialogue.expression);
      }
    }
  }, [isTypingComplete, currentDialogue]);

  const currentDialogueExpr =
    !isTypingComplete && currentDialogue.typingExpression
      ? currentDialogue.typingExpression
      : currentDialogue.expression;

  const activeAiiExpr =
    currentDialogue.speaker === "AII" && currentDialogueExpr
      ? currentDialogueExpr
      : lastAiiExpr;

  const activeKiboExpr =
    currentDialogue.speaker === "KIBO" && currentDialogueExpr
      ? currentDialogueExpr
      : lastKiboExpr;

  const speakerBadgeColor =
    currentDialogue.speaker === "AII"
      ? "bg-[#ffb3ba]"
      : currentDialogue.speaker === "KIBO"
        ? "bg-[#bae1ff]"
        : "bg-[#ffffba]";

  const isAii = currentDialogue.speaker === "AII";
  const isKibo = currentDialogue.speaker === "KIBO";

  return (
    <div className="relative h-full w-full flex flex-col justify-between overflow-hidden select-none bg-[#faf7f2]">
      <div
        className={`pointer-events-none absolute inset-0 z-[70] bg-black transition-opacity duration-1000 ${isEnteringScene || isExiting ? "opacity-100" : "opacity-0"
          }`}
      />

      <div className="pointer-events-none absolute inset-0 bg-[#faf7f2]" />

      <img
        src="/asset/lorong_gallery.png"
        alt="Lorong Gallery Background"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Header Bar */}
      <div className="relative z-30 flex items-center justify-between p-4">
        <button
          onClick={handleBackToMenu}
          className="flex items-center gap-1.5 border-2 border-[#2d2d2d] bg-[#ffffba] px-3 py-1.5 text-[9px] font-bold text-[#2d2d2d] shadow-[2px_2px_0px_0px_#2d2d2d] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
        >
          <PxlIcon icon={HomeIcon as unknown as PxlKitIconData} className="h-3.5 w-3.5" />
          <span>MENU</span>
        </button>

        <div className="border-2 border-[#2d2d2d] bg-[#baffc9] px-3 py-1 text-[8px] sm:text-[9px] font-bold text-[#2d2d2d] shadow-[2px_2px_0px_0px_#2d2d2d]">
          LORONG GALLERY
        </div>
      </div>

      {/* Characters Area with Step animation */}
      <div className="relative z-20 flex-1 flex items-end justify-center -mb-10 sm:-mb-12 px-4 pointer-events-none overflow-hidden">
        <div className="relative flex items-end justify-center w-full max-w-sm">
          {/* AII Sprite */}
          <div
            className={`relative w-40 sm:w-44 transition-all duration-300 ${isWalkingIn ? "animate-step-in" : "animate-pixel-idle"
              } ${isAii
                ? "z-20 scale-105 brightness-100"
                : "z-10 scale-95 brightness-65"
              }`}
          >
            <img
              src={activeAiiExpr}
              alt="AII"
              className="w-full h-auto object-contain drop-shadow-[0_6px_6px_rgba(0,0,0,0.3)]"
            />
          </div>

          {/* KIBO Sprite */}
          <div
            className={`relative w-42 sm:w-46 -ml-9 sm:-ml-11 transition-all duration-300 ${isWalkingIn ? "animate-step-in" : "animate-pixel-idle"
              } ${isKibo
                ? "z-30 scale-108 brightness-100"
                : "z-0 scale-95 brightness-65"
              }`}
            style={isWalkingIn ? { animationDelay: "0.2s" } : undefined}
          >
            <img
              src={activeKiboExpr}
              alt="KIBO"
              className="w-full h-auto object-contain scale-110 origin-bottom drop-shadow-[0_6px_6px_rgba(0,0,0,0.3)]"
            />
          </div>
        </div>
      </div>

      {/* Dialogue Box */}
      <div className="relative z-40 w-full px-3 pb-3">
        <div
          onClick={handleBoxClick}
          className="relative w-full border-4 border-[#2d2d2d] bg-[#faf7f2]/95 p-3.5 sm:p-4 shadow-[4px_4px_0px_0px_#2d2d2d] backdrop-blur-xs cursor-pointer min-h-[145px] sm:min-h-[160px] flex flex-col justify-between transition-all"
        >
          <div
            className={`absolute -top-4.5 left-3 border-2 border-[#2d2d2d] ${speakerBadgeColor} px-2.5 py-0.5 shadow-[2px_2px_0px_0px_#2d2d2d]`}
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
              {isFinalLine ? "[Selesai]" : "[Klik buat lanjut]"}
            </span>

            {!isFinalLine && (
              <PxlIcon
                icon={BouncingArrow as unknown as PxlKitIconData}
                className="h-4 w-4 shrink-0"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
