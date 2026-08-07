"use client";

import { useState, useEffect } from "react";
import { Home as HomeIcon, ArrowRight, BouncingArrow } from "@pxlkit/ui";
import { playButtonSound, playTypewriterSound, playPopSound } from "@/lib/audioManager";
import { PxlIcon, PxlKitIconData } from "@/components/PxlIcon";
import { Button } from "@/components/ui/pixelact-ui/button";

interface FlowerGardenSceneProps {
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
    speaker: "AII",
    text: "Woahhh!! Kibo lihat!! Indah banget bunganyaa!! Banyak macam bunga jugaa!! Aku jadi pengen rangkai bunga dehh..",
    expression: "/char/aii/semangat.png",
  },
  {
    speaker: "KIBO",
    text: "Woahh!! Iya banyak banget bunganya ya..",
    expression: "/char/kibo/ketawa.png",
  },
  {
    speaker: "KIBO",
    text: "Aku jadi ke inget dulu suka milihin bunga buat seseorang hahahah",
    expression: "/char/kibo/ketawa.png",
  },
  {
    speaker: "AII",
    text: "Oh ya?? Terus gimana reaksi dia pas kamu kasih bunganya? Pasti dia seneng kan..",
    expression: "/char/aii/bingung.png",
  },
  {
    speaker: "KIBO",
    text: "Ntahlah.. Ya aku ngasi dia ga seberapa sih.. but aku ngasi semua yang aku bisa",
    typingExpression: "/char/kibo/ngomong.png",
    expression: "/char/kibo/sedih.png",
  },
  {
    speaker: "KIBO",
    text: "Kadang aku malu sama diriku sendiri, aku hanya bisa ngasi barang dengan harga ga seberapa ke dia, disisi lain aku pengen banget ngasi dia sesuatu yang lebih..",
    expression: "/char/kibo/sedih.png",
  },
  {
    speaker: "KIBO",
    text: "Itu salah satu list yang pengen aku wujudkan sih.. karna kalo ngeliat dia seneng sama apa yang ku beri, itu uda cukup bagiku",
    typingExpression: "/char/kibo/ngomong_senyum.png",
    expression: "/char/kibo/senyum.png",
  },
  {
    speaker: "AII",
    text: "Aku yakin dia pasti paham kok, orang gakan memandang dari seberapa besar harga barangnya, tapi seberapa tulus kamu ngasih itu",
    typingExpression: "/char/aii/ngomong_senyum.png",
    expression: "/char/aii/senyum.png",
  },
  {
    speaker: "AII",
    text: "Ga nyangka walaupun kamu kadang aga ngeselin, tapi kamu juga punya hati yang baik ya Kibo",
    expression: "/char/aii/ketawa.png",
  },
  {
    speaker: "AII",
    text: "Terus gimana hubungan kalian sekarang?",
    expression: "/char/aii/bingung.png",
  },
  {
    speaker: "KIBO",
    text: "......",
    expression: "/char/kibo/ketawa.png",
  },
  {
    speaker: "KIBO",
    text: "Ya, sekarang kita kembali menjadi diri kita masing-masing lagi",
    typingExpression: "/char/kibo/ngomong_senyum.png",
    expression: "/char/kibo/senyum.png",
  },
  {
    speaker: "KIBO",
    text: "Dia bilang ke aku buat menyayangi diri dulu. Itu yang selalu aku ingat dan terapkan ke diriku yang sekarang, walaupun aku sendiri gatau gimana perasaan dia sekarang..",
    typingExpression: "/char/kibo/ngomong.png",
    expression: "/char/kibo/ketawa.png",
  },
  {
    speaker: "KIBO",
    text: "Aku percaya dia kalau emang jalan yang kita tuju itu sama, aku harap kita bisa bertemu lagi suatu saat nanti",
    typingExpression: "/char/kibo/ngomong_senyum.png",
    expression: "/char/kibo/senyum.png",
  },
  {
    speaker: "AII",
    text: "Semangatt mas..",
    expression: "/char/aii/semangat.png",
  },
  {
    speaker: "KIBO",
    text: "Hahaha iya makasi ya, aku kek pernah denger itu deh",
    expression: "/char/kibo/ketawa.png",
  },
  {
    speaker: "AII",
    text: "Eum gimana kalo kamu bantuin aku milih dan rangkai bunga",
    typingExpression: "/char/aii/ngomong_senyum.png",
    expression: "/char/aii/senyum.png",
  },
  {
    speaker: "KIBO",
    text: "Bolehh, yuk!!",
    typingExpression: "/char/kibo/ngomong_senyum.png",
    expression: "/char/kibo/senyum.png",
  },
];

export function FlowerGardenScene({
  onBackToMenu,
  onNextScene,
}: FlowerGardenSceneProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isEnteringScene, setIsEnteringScene] = useState(true);
  const [timerRef, setTimerRef] = useState<NodeJS.Timeout | null>(null);

  const [lastAiiExpr, setLastAiiExpr] = useState("/char/aii/semangat.png");
  const [lastKiboExpr, setLastKiboExpr] = useState("/char/kibo/ketawa.png");

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
      {/* Black transition overlay */}
      <div
        className={`pointer-events-none absolute inset-0 z-[70] bg-black transition-opacity duration-1000 ${isEnteringScene || isExiting ? "opacity-100" : "opacity-0"
          }`}
      />

      <div className="pointer-events-none absolute inset-0 bg-[#faf7f2]" />

      {/* Flower Garden Background */}
      <img
        src="/asset/flower_garden.png"
        alt="Flower Garden Background"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
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

        <div className="border-2 border-[#2d2d2d] bg-[#baffc9] px-3 py-1 text-[8px] sm:text-[9px] font-bold text-[#2d2d2d] shadow-[2px_2px_0px_0px_#2d2d2d]">
          TAMAN BUNGA
        </div>
      </div>

      {/* Characters Area */}
      <div className="relative z-20 flex-1 flex items-end justify-center -mb-10 sm:-mb-12 px-4 pointer-events-none overflow-hidden">
        <div className="relative flex items-end justify-center w-full max-w-sm">
          {/* AII Sprite */}
          <div
            className={`relative w-40 sm:w-44 transition-all duration-300 animate-pixel-idle ${isAii
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
            className={`relative w-42 sm:w-46 -ml-9 sm:-ml-11 transition-all duration-300 animate-pixel-idle ${isKibo
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
              {isFinalLine && isTypingComplete ? "" : "[Klik buat lanjut]"}
            </span>

            {(!isFinalLine || !isTypingComplete) && (
              <PxlIcon
                icon={BouncingArrow as unknown as PxlKitIconData}
                className="h-4 w-4 shrink-0"
              />
            )}
          </div>

          {isFinalLine && isTypingComplete && (
            <div className="mt-2 w-full pt-1">
              <Button
                variant="mint"
                size="default"
                onClick={onNextScene ? handleNextScene : handleBackToMenu}
                className="w-full group h-9 text-[8.5px] sm:text-[9px] flex items-center justify-center gap-2 border-2 border-[#2d2d2d] shadow-[3px_3px_0px_0px_#2d2d2d]"
              >
                <span>{onNextScene ? "LANJUT MERANGKAI BUNGA" : "KEMBALI KE MENU"}</span>
                <PxlIcon
                  icon={ArrowRight as unknown as PxlKitIconData}
                  className="h-3.5 w-3.5 transition-transform group-hover:scale-125 group-hover:translate-x-1"
                />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
