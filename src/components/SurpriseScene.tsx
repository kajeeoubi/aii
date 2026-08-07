"use client";

import { useState, useEffect } from "react";
import { Home as HomeIcon, BouncingArrow } from "@pxlkit/ui";
import { playButtonSound, playTypewriterSound, playPopSound } from "@/lib/audioManager";
import { PxlIcon, PxlKitIconData } from "@/components/PxlIcon";

interface SurpriseSceneProps {
  onBackToMenu?: () => void;
  onNextScene: () => void;
}

interface DialogueLine {
  speaker: string;
  badgeBg: string;
  text: string;
  expression: string;
  typingExpression?: string;
  animateStep?: boolean;
}

const dialogueData: DialogueLine[] = [
  {
    speaker: "PETUGAS GALLERY",
    badgeBg: "bg-[#ffd166]",
    text: "Woii!! kalian berdua.. >:( (Marah besar jirr takutnyoo)",
    expression: "/char/petugas/petugas.png",
    animateStep: true,
  },
    {
    speaker: "PETUGAS GALLERY",
    badgeBg: "bg-[#ffd166]",
    text: "Kalian benar benar ya.. (Tatapan sinis)",
    expression: "/char/petugas/petugas.png",
  },
  {
    speaker: "KIBO",
    badgeBg: "bg-[#bae1ff]",
    text: "Oo shii.. sepertinya kita dalam masalah besar..",
    expression: "/char/kibo/takut.PNG",
  },
  {
    speaker: "PETUGAS GALLERY",
    badgeBg: "bg-[#ffd166]",
    text: ".......",
    expression: "/char/petugas/petugas.png",
  },
  {
    speaker: "PETUGAS GALLERY",
    badgeBg: "bg-[#ffd166]",
    text: "Anda melupakan buket anda nona hehehehe :D",
    expression: "/char/petugas/petugas.png",
  },
    {
    speaker: "AII",
    badgeBg: "bg-[#ffb3ba]",
    text: "HAA??",
    expression: "/char/aii/kaget.PNG",
  },
  {
    speaker: "KIBO",
    badgeBg: "bg-[#bae1ff]",
    text: "SURPRISEEee!!",
    expression: "/char/kibo/ketawa.PNG",
  },
  {
    speaker: "KIBO",
    badgeBg: "bg-[#bae1ff]",
    text: "AHAHAHAHH! Aii wajah kamu lucu bgt pas lagi panikk, ini bikin aku gabisa berenti ketawa bwahaha!!",
    expression: "/char/kibo/ketawa.PNG",
  },
  {
    speaker: "AII",
    badgeBg: "bg-[#ffb3ba]",
    text: "Ihhh, Kiboo!! Semua ini rencana kamu ya?!!",
    expression: "/char/aii/kesel.PNG",
  },
  {
    speaker: "AII",
    badgeBg: "bg-[#ffb3ba]",
    text: "IHHH!! Kibo nyebelinnn!!",
    expression: "/char/aii/nangis.PNG",
  },
  {
    speaker: "KIBO",
    badgeBg: "bg-[#bae1ff]",
    text: "hihihi.. maaf maaf.. iya aku siapin semua ini buat kamu Aii, termasuk yang booking gallery ini juga wkwkw",
    expression: "/char/kibo/ketawa.PNG",
  },
  {
    speaker: "AII",
    badgeBg: "bg-[#ffb3ba]",
    text: "humpp.. emng aga nyebelin but... makasi ya Kibo.. kamu sampe repot bikin ini semua <3",
    typingExpression: "/char/aii/terharu.PNG",
    expression: "/char/aii/terharu_bahagia.PNG",
  },
];

export function SurpriseScene({ onBackToMenu, onNextScene }: SurpriseSceneProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isEnteringScene, setIsEnteringScene] = useState(true);
  const [isShaking, setIsShaking] = useState(true);
  const [timerRef, setTimerRef] = useState<NodeJS.Timeout | null>(null);

  const [lastAiiExpr, setLastAiiExpr] = useState("/char/aii/kawatir.PNG");
  const [lastKiboExpr, setLastKiboExpr] = useState("/char/kibo/senyum.PNG");

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

    const initialExpr = currentDialogue.typingExpression || currentDialogue.expression;
    if (currentDialogue.speaker === "AII" && initialExpr) {
      setLastAiiExpr(initialExpr);
    } else if (currentDialogue.speaker === "KIBO" && initialExpr) {
      setLastKiboExpr(initialExpr);
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

  const handleBoxClick = () => {
    playButtonSound();
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

  const isAii = currentDialogue.speaker === "AII";
  const isKibo = currentDialogue.speaker === "KIBO";
  const isPetugas = currentDialogue.speaker === "PETUGAS GALLERY";

  return (
    <div
      className={`relative h-full w-full flex flex-col justify-between overflow-hidden select-none bg-[#faf7f2] ${
        isShaking ? "animate-shake" : ""
      }`}
    >
      {/* Black transition overlay */}
      <div
        className={`pointer-events-none absolute inset-0 z-[70] bg-black transition-opacity duration-1000 ${
          isEnteringScene || isExiting ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Background Image: patung_minigame.png */}
      <img
        src="/asset/patung_minigame.png"
        alt="Surprise Scene Background"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

      {/* Header Bar */}
      <div className="relative z-30 flex items-center justify-between p-4">
        <button
          onClick={handleBackToMenu}
          className="flex items-center gap-1.5 border-2 border-[#2d2d2d] bg-[#ffffba] px-3 py-1.5 text-[9px] font-bold text-[#2d2d2d] shadow-[2px_2px_0px_0px_#2d2d2d] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
        >
          <PxlIcon icon={HomeIcon as unknown as PxlKitIconData} className="h-3.5 w-3.5" />
          <span>MENU</span>
        </button>

        <div className="border-2 border-[#2d2d2d] bg-[#bae1ff] px-3 py-1 text-[8px] sm:text-[9px] font-bold text-[#2d2d2d] shadow-[2px_2px_0px_0px_#2d2d2d]">
          SURPRISE!
        </div>
      </div>

      {/* Characters Area */}
      <div className="relative z-20 flex-1 flex items-end justify-center -mb-10 sm:-mb-12 px-4 pointer-events-none overflow-hidden">
        <div className="relative flex items-end justify-center w-full max-w-sm">
          {isPetugas ? (
            /* PETUGAS GALLERY Sprite */
            <div
              key={`petugas-${currentLineIndex}`}
              className={`relative w-44 sm:w-48 transition-all duration-300 z-30 scale-105 brightness-100 ${
                currentDialogue.animateStep
                  ? "animate-step-in"
                  : "animate-pixel-idle"
              }`}
            >
              <img
                src={currentDialogue.expression || "/char/petugas/petugas.png"}
                alt="PETUGAS GALLERY"
                className="w-full h-auto object-contain drop-shadow-[0_6px_6px_rgba(0,0,0,0.3)]"
              />
            </div>
          ) : (
            <>
              {/* AII Sprite */}
              <div
                className={`relative w-40 sm:w-44 transition-all duration-300 animate-pixel-idle ${
                  isAii
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
                className={`relative w-42 sm:w-46 -ml-9 sm:-ml-11 transition-all duration-300 animate-pixel-idle ${
                  isKibo
                    ? "z-30 scale-108 brightness-100"
                    : "z-0 scale-95 brightness-65"
                }`}
              >
                <img
                  src={activeKiboExpr}
                  alt="KIBO"
                  className="w-full h-auto object-contain scale-110 origin-bottom drop-shadow-[0_6px_6px_rgba(0,0,0,0.3)]"
                />
              </div>
            </>
          )}
        </div>
      </div>

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
