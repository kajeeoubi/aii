"use client";

import { useState, useEffect } from "react";
import { Home as HomeIcon, ArrowRight, BouncingArrow } from "@pxlkit/ui";
import { playButtonSound, playTypewriterSound, playPopSound } from "@/lib/audioManager";
import { PxlIcon, PxlKitIconData } from "@/components/PxlIcon";
import { Button } from "@/components/ui/pixelact-ui/button";

interface StatueRoomSceneProps {
  onBackToMenu: () => void;
  onNextScene?: () => void;
}

interface DialogueLine {
  speaker: string;
  text: string;
  expression: string;
  typingExpression?: string;
  hideCharacters?: boolean;
  zoomBg?: boolean;
  zoomPos?: "center" | "left" | "right";
}

const initialDialogue: DialogueLine[] = [
  {
    speaker: "AII",
    text: "Wahh, Kibo liat deh! Ada ruangan pameran patung disini..",
    expression: "/char/aii/kaget.png",
  },
  {
    speaker: "KIBO",
    text: "Woahh besar kali ruangannya!! Tapi kok patungnya cuma 3 doang anjay_-",
    typingExpression: "/char/kibo/ngomong_senyum.png",
    expression: "/char/kibo/senyum.png",
  },
  {
    speaker: "AII",
    text: "Iya ya.. Eumm bentar deh.. Patung-patungnya kek punya simbol gitu ga sih?",
    expression: "/char/aii/bingung.png",
  },
  {
    speaker: "KIBO",
    text: "......",
    expression: "/char/kibo/bingung.png",
    hideCharacters: true,
    zoomBg: true,
    zoomPos: "center",
  },
  {
    speaker: "KIBO",
    text: "Hmmm.. keknya simbolnya saling berhubungan deh..",
    expression: "/char/kibo/bingung.png",
    hideCharacters: true,
    zoomBg: true,
    zoomPos: "center",
  },
  {
    speaker: "KIBO",
    text: "Huum.. Patung yang kiri yang bentuk batu berduri itu simbol konflik",
    expression: "/char/kibo/ngomong.png",
    hideCharacters: true,
    zoomBg: true,
    zoomPos: "left",
  },
  {
    speaker: "KIBO",
    text: "Yang kanan bentuk tangan itu simbol ikatan",
    expression: "/char/kibo/ngomong.png",
    hideCharacters: true,
    zoomBg: true,
    zoomPos: "right",
  },
  {
    speaker: "KIBO",
    text: "Dan yang tengah bentuk hati kristal itu...",
    expression: "/char/kibo/bingung.png",
    hideCharacters: true,
    zoomBg: true,
    zoomPos: "center",
  },
];

const option1Dialogue: DialogueLine[] = [
  {
    speaker: "KIBO",
    text: "Yapp tepat sekali!! Jadi True Love tumbuh kalo keduanya bareng-bareng menghadapi setiap konflik",
    typingExpression: "/char/kibo/ngomong_senyum.png",
    expression: "/char/kibo/senyum.png",
  },
  {
    speaker: "AII",
    text: "Oalah gituuu to..",
    typingExpression: "/char/aii/ngomong_senyum.png",
    expression: "/char/aii/senyum.png",
  },
  {
    speaker: "AII",
    text: "Bentar deh, aku ngerasa ada sesuatu deh.. garisnya saling terhubung gitu, keknya patung ini bisa digeser",
    expression: "/char/aii/bingung.png",
  },
];

const option2Dialogue: DialogueLine[] = [
  {
    speaker: "KIBO",
    text: "Kamu tu yang hopeless hahahaha, itu simbol true love woii! Ada aja kamu..",
    expression: "/char/kibo/ketawa.png",
  },
  {
    speaker: "KIBO",
    text: "True Love tumbuh disimbolkan ketika keduanya tetep bareng-bareng menghadapi setiap konflik",
    expression: "/char/kibo/senyum.png",
  },
  {
    speaker: "AII",
    text: "Oalah gituuu to..",
    typingExpression: "/char/aii/ngomong_senyum.png",
    expression: "/char/aii/senyum.png",
  },
  {
    speaker: "AII",
    text: "Bentar deh, kok ada yang aneh sama ketiga patung ini.. ada garis lintasannya, keknya patung ini bisa digeser",
    expression: "/char/aii/bingung.png",
  },
];

export function StatueRoomScene({
  onBackToMenu,
  onNextScene,
}: StatueRoomSceneProps) {
  const [dialogueData, setDialogueData] = useState<DialogueLine[]>(initialDialogue);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isEnteringScene, setIsEnteringScene] = useState(true);
  const [timerRef, setTimerRef] = useState<NodeJS.Timeout | null>(null);

  const [hasChosenOption, setHasChosenOption] = useState(false);
  const [lastAiiExpr, setLastAiiExpr] = useState("/char/aii/kaget.png");
  const [lastKiboExpr, setLastKiboExpr] = useState("/char/kibo/senyum.png");

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
  }, [currentLineIndex, dialogueData]);

  const handleBoxClick = () => {
    if (currentLineIndex === initialDialogue.length - 1 && !hasChosenOption && isTypingComplete) {
      return;
    }

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
        if (onNextScene) {
          handleNextScene();
        } else {
          handleBackToMenu();
        }
      }
    }
  };

  const handleSelectOption = (option: 1 | 2) => {
    playPopSound();
    setHasChosenOption(true);
    const chosenDialogue = option === 1 ? option1Dialogue : option2Dialogue;
    setDialogueData((prev) => [...prev, ...chosenDialogue]);
    setCurrentLineIndex(initialDialogue.length);
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
  const isQuizTime = currentLineIndex === initialDialogue.length - 1 && isTypingComplete && !hasChosenOption;

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

  const getBgZoomStyle = () => {
    if (!currentDialogue?.zoomBg) {
      return {
        transform: "scale(1)",
        transformOrigin: "center center",
      };
    }
    switch (currentDialogue.zoomPos) {
      case "left":
        return {
          transform: "scale(2.4)",
          transformOrigin: "8% 68%",
        };
      case "right":
        return {
          transform: "scale(2.4)",
          transformOrigin: "92% 68%",
        };
      case "center":
      default:
        return {
          transform: "scale(1.9)",
          transformOrigin: "50% 65%",
        };
    }
  };

  return (
    <div className="relative h-full w-full flex flex-col justify-between overflow-hidden select-none bg-[#faf7f2]">
      {/* Black transition overlay */}
      <div
        className={`pointer-events-none absolute inset-0 z-[70] bg-black transition-opacity duration-1000 ${isEnteringScene || isExiting ? "opacity-100" : "opacity-0"
          }`}
      />

      <div className="pointer-events-none absolute inset-0 bg-[#faf7f2]" />

      {/* Statue Room Background */}
      <img
        src="/asset/patung.png"
        alt="Statue Room Background"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-out"
        style={getBgZoomStyle()}
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

        <div className="border-2 border-[#2d2d2d] bg-[#e9d5ff] px-3 py-1 text-[8px] sm:text-[9px] font-bold text-[#2d2d2d] shadow-[2px_2px_0px_0px_#2d2d2d]">
          RUANG PATUNG
        </div>
      </div>

      {/* Characters Area */}
      <div
        className={`relative z-20 flex-1 flex items-end justify-center -mb-12 sm:-mb-14 px-4 pointer-events-none overflow-hidden transition-all duration-500 ease-out ${
          currentDialogue?.hideCharacters
            ? "opacity-0 translate-y-10 pointer-events-none"
            : "opacity-100 translate-y-0"
        }`}
      >
        <div className="relative flex items-end justify-center w-full max-w-sm h-76 sm:h-80">
          {/* AII Sprite */}
          <div
            className={`relative h-full transition-all duration-300 flex items-end animate-pixel-idle ${isAii
                ? "z-20 scale-105 brightness-100"
                : "z-10 scale-95 brightness-65"
              }`}
          >
            <img
              src={activeAiiExpr}
              alt="AII"
              className="h-full w-auto object-contain drop-shadow-[0_6px_6px_rgba(0,0,0,0.3)]"
            />
          </div>

          {/* KIBO Sprite */}
          <div
            className={`relative h-full -ml-10 sm:-ml-12 transition-all duration-300 flex items-end animate-pixel-idle ${isKibo
                ? "z-30 scale-105 brightness-100"
                : "z-0 scale-95 brightness-65"
              }`}
          >
            <img
              src={activeKiboExpr}
              alt="KIBO"
              className="h-full w-auto object-contain scale-105 origin-bottom drop-shadow-[0_6px_6px_rgba(0,0,0,0.3)]"
            />
          </div>
        </div>
      </div>

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

            {isQuizTime && (
              <div className="mt-3 flex flex-col gap-2 w-full pt-1" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="mint"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectOption(1);
                  }}
                  className="w-full group h-9 text-[8.5px] sm:text-[9px] flex items-center justify-center gap-2 border-2 border-[#2d2d2d] shadow-[2.5px_2.5px_0px_0px_#2d2d2d] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
                >
                  <span>True Love :D</span>
                  <PxlIcon
                    icon={ArrowRight as unknown as PxlKitIconData}
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                  />
                </Button>
                <Button
                  variant="sky"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectOption(2);
                  }}
                  className="w-full group h-9 text-[8.5px] sm:text-[9px] flex items-center justify-center gap-2 border-2 border-[#2d2d2d] shadow-[2.5px_2.5px_0px_0px_#2d2d2d] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
                >
                  <span>Hopeless Romantic :v</span>
                  <PxlIcon
                    icon={ArrowRight as unknown as PxlKitIconData}
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                  />
                </Button>
              </div>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between pt-1">
            <span className="text-[7.5px] sm:text-[8px] text-[#888888] font-press-start">
              {isQuizTime
                ? ""
                : isFinalLine && isTypingComplete
                  ? ""
                  : "[Klik buat lanjut]"}
            </span>

            {(!isFinalLine || !isTypingComplete) && !isQuizTime && (
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
