"use client";

import { useState, useEffect } from "react";
import { Home as HomeIcon, ArrowRight, BouncingArrow } from "@pxlkit/ui";
import { Button } from "@/components/ui/pixelact-ui/button";
import { playButtonSound, playTypewriterSound, playPopSound } from "@/lib/audioManager";
import { PxlIcon, PxlKitIconData } from "@/components/PxlIcon";

interface StatueEndingSceneProps {
  onBackToMenu: () => void;
  onNextScene?: () => void;
}

interface DialogueLine {
  speaker: string;
  badgeBg: string;
  text: string;
  expression: string;
  typingExpression?: string;
}

const dialogueData: DialogueLine[] = [
  {
    speaker: "KIBO",
    badgeBg: "bg-[#bae1ff]",
    text: "Aii, apa kamu lihat itu..",
    expression: "/char/kibo/kaget.PNG",
  },
  {
    speaker: "AII",
    badgeBg: "bg-[#ffb3ba]",
    text: "Iya, ku pikir kita telah membuka ruangan rahasia",
    expression: "/char/aii/kaget.PNG",
  },
  {
    speaker: "PETUGAS GALLERY",
    badgeBg: "bg-[#ffd166]",
    text: "Woii, siapa disana menyelinap masuk diam diam, itu ilegal!!",
    expression: "/char/petugas/petugas.png",
  },
  {
    speaker: "KIBO",
    badgeBg: "bg-[#bae1ff]",
    text: "Aii, kamu pergi saja, aku akan menyerahkan diri ke petugas, setelah itu kamu bisa keluar dengan aman tanpa ketahuan",
    expression: "/char/kibo/marah.PNG",
  },
  {
    speaker: "AII",
    badgeBg: "bg-[#ffb3ba]",
    text: "Tapi gimana dengan kamu.. kalo kamu diapa-apain gimana?? masa aku tega tinggalin kamu??!",
    expression: "/char/aii/kawatir.PNG",
  },
  {
    speaker: "KIBO",
    badgeBg: "bg-[#bae1ff]",
    text: "Buruan sebelum kita berdua ketangkep!!",
    expression: "/char/kibo/marah.PNG",
  },
];

export function StatueEndingScene({
  onBackToMenu,
  onNextScene,
}: StatueEndingSceneProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isEnteringScene, setIsEnteringScene] = useState(true);
  const [timerRef, setTimerRef] = useState<NodeJS.Timeout | null>(null);

  const [lastAiiExpr, setLastAiiExpr] = useState("/char/aii/kaget.PNG");
  const [lastKiboExpr, setLastKiboExpr] = useState("/char/kibo/kaget.PNG");

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

    if (currentDialogue.speaker === "AII" && currentDialogue.expression) {
      setLastAiiExpr(currentDialogue.expression);
    } else if (currentDialogue.speaker === "KIBO" && currentDialogue.expression) {
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
    const currentDialogue = dialogueData[currentLineIndex];
    if (!isTypingComplete) {
      if (timerRef) clearInterval(timerRef);
      setDisplayedText(currentDialogue.text);
      setIsTypingComplete(true);
    } else {
      if (currentLineIndex < dialogueData.length - 1) {
        setCurrentLineIndex((prev) => prev + 1);
      }
    }
  };

  const handleBackToMenu = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playButtonSound();
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onBackToMenu();
    }, 1000);
  };

  const handleNextScene = (e?: React.MouseEvent) => {
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

  const isAii = currentDialogue.speaker === "AII";
  const isKibo = currentDialogue.speaker === "KIBO";
  const isPetugas = currentDialogue.speaker === "PETUGAS GALLERY";

  return (
    <div className="relative h-full w-full flex flex-col justify-between overflow-hidden select-none bg-[#faf7f2]">
      {/* Black transition overlay */}
      <div
        className={`pointer-events-none absolute inset-0 z-[70] bg-black transition-opacity duration-1000 ${
          isEnteringScene || isExiting ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Statue Minigame Background */}
      <img
        src="/asset/patung_minigame.png"
        alt="Statue Minigame Background"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center scale-140 sm:scale-150 origin-center blur-xs"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

      {/* Header Bar */}
      <div className="relative z-30 flex items-center justify-between p-4">
        <button
          onClick={handleBackToMenu}
          className="flex items-center gap-1.5 border-2 border-[#2d2d2d] bg-[#ffffba] px-3 py-1.5 text-[9px] font-bold text-[#2d2d2d] shadow-[2px_2px_0px_0px_#2d2d2d] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
        >
          <PxlIcon icon={HomeIcon as unknown as PxlKitIconData} className="h-3.5 w-3.5" />
          <span>MENU</span>
        </button>

        <div className="border-2 border-[#2d2d2d] bg-[#e9d5ff] px-3 py-1 text-[8px] sm:text-[9px] font-bold text-[#2d2d2d] shadow-[2px_2px_0px_0px_#2d2d2d]">
          RUANGAN RAHASIA
        </div>
      </div>

      {/* Characters Area */}
      <div className="relative z-20 flex-1 flex items-end justify-center -mb-10 sm:-mb-12 px-4 pointer-events-none overflow-hidden">
        <div className="relative flex items-end justify-center w-full max-w-sm">
          {isPetugas ? (
            /* PETUGAS GALLERY Sprite */
            <div className="relative w-44 sm:w-48 transition-all duration-300 animate-pixel-idle z-30 scale-105 brightness-100">
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
              {!isTypingComplete || !isFinalLine ? "[Klik buat lanjut]" : ""}
            </span>

            {(!isTypingComplete || !isFinalLine) && (
              <PxlIcon
                icon={BouncingArrow as unknown as PxlKitIconData}
                className="h-4 w-4 shrink-0"
              />
            )}
          </div>

          {isFinalLine && isTypingComplete && (
            <div className="mt-2.5 flex flex-col gap-2 w-full pt-1" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="mint"
                onClick={onNextScene ? handleNextScene : handleBackToMenu}
                className="w-full group h-9 text-[8.5px] sm:text-[9px] flex items-center justify-center gap-2 border-2 border-[#2d2d2d] shadow-[2.5px_2.5px_0px_0px_#2d2d2d] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
              >
                <span>tetap bersama kibo</span>
                <PxlIcon
                  icon={ArrowRight as unknown as PxlKitIconData}
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                />
              </Button>

              <Button
                variant="purple"
                onClick={handleBackToMenu}
                className="w-full group h-9 text-[8.5px] sm:text-[9px] flex items-center justify-center gap-2 border-2 border-[#2d2d2d] shadow-[2.5px_2.5px_0px_0px_#2d2d2d] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
              >
                <span>tinggalkan kibo</span>
                <PxlIcon
                  icon={ArrowRight as unknown as PxlKitIconData}
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
