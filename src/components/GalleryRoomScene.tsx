"use client";

import { useState, useEffect } from "react";
import { Home as HomeIcon, BouncingArrow } from "@pxlkit/ui";
import { playButtonSound, playTypewriterSound, playPopSound } from "@/lib/audioManager";
import { PxlIcon, PxlKitIconData } from "@/components/PxlIcon";

interface GalleryRoomSceneProps {
  onBackToMenu: () => void;
  onNextScene?: () => void;
  onTriggerCubit?: () => void;
  startLineIndex?: number;
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
    text: "Wahh.. lukisannya banyak banget ya.. Tapi kok semuanya ditutup kain?? Kenapa ya..",
    expression: "/char/aii/bingung.png",
  },
  {
    speaker: "KIBO",
    text: "Ya gatau, kamu kira aku dukun??",
    expression: "/char/kibo/bingung.png",
  },
  {
    speaker: "AII",
    text: "Aishh.. Kibo nyebelin!!",
    expression: "/char/aii/kesel.png",
  },
  {
    speaker: "KIBO",
    text: "Emang wlee :P",
    expression: "/char/kibo/bercanda.png",
  },
  {
    speaker: "AII",
    text: "SHIBALL (Sambil pukul kecil manja)",
    expression: "/char/aii/kesel.png",
  },
  {
    speaker: "KIBO",
    text: "Serius deh, kalo kamu lagi ngambek tambah lucuww tau",
    expression: "/char/kibo/ketawa.png",
  },
  {
    speaker: "AII",
    text: "APALAHH.. APA IYAA? (Salting)",
    expression: "/char/aii/salting.png",
  },
  {
    speaker: "KIBO",
    text: "Huummm!! Sampe aku pen mainin pipi kamu kek gini.. (Tiba tiba kibo cubit perlahan pipinya)",
    expression: "/char/kibo/ketawa.png",
  },
  {
    speaker: "AII",
    text: "Aduhh.. Kibo sakitt.. Humppp",
    expression: "/char/aii/kesel.png",
  },
  {
    speaker: "KIBO",
    text: "Heheheh maaf Aii",
    expression: "/char/kibo/malu.png",
  },
  {
    speaker: "KIBO",
    text: "Abisnya kamu lucuwwnya kebangetan aku jadi kebablasan deh mwhehehe :3",
    expression: "/char/kibo/ketawa.png",
  },
  {
    speaker: "AII",
    text: "Hihihi, makacii Kebo <3",
    expression: "/char/aii/malu.png",
  },
  {
    speaker: "AII",
    text: "Emang aku lucuww :P",
    expression: "/char/aii/salting.png",
  },
  {
    speaker: "KIBO",
    text: "Apaan Kebo, kamu tu yang sering bangun siang kek keboo huu..",
    expression: "/char/kibo/ketawa.png",
  },
  {
    speaker: "AII",
    text: "Hmm.. ya deh terserah kamu",
    typingExpression: "/char/aii/ngomong_senyum.png",
    expression: "/char/aii/senyum.png",
  },
  {
    speaker: "AII",
    text: "Btw, kamu ga penasaran sama lukisannya??",
    expression: "/char/aii/bingung.png",
  },
  {
    speaker: "KIBO",
    text: "Yaudah buka aja daripada penasaran",
    typingExpression: "/char/kibo/ngomong_senyum.png",
    expression: "/char/kibo/senyum.png",
  },
  {
    speaker: "AII",
    text: "Gamauu, ntar kalo ketangkep ama petugas gimana?",
    expression: "/char/aii/kawatir.png",
  },
  {
    speaker: "KIBO",
    text: "Ntar yang ngaku kalo yang buka lukisannya aku, tenang aja",
    typingExpression: "/char/kibo/ngomong_senyum.png",
    expression: "/char/kibo/senyum.png",
  },
  {
    speaker: "AII",
    text: "Beneran ya.. Janji dulu :P",
    expression: "/char/aii/semangat.png",
  },
  {
    speaker: "KIBO",
    text: "Iya iya.. Aku janjii.. Buruan buka..",
    typingExpression: "/char/kibo/ngomong_senyum.png",
    expression: "/char/kibo/senyum.png",
  },
];

export function GalleryRoomScene({
  onBackToMenu,
  onNextScene,
  onTriggerCubit,
  startLineIndex = 0,
}: GalleryRoomSceneProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(startLineIndex);
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isEnteringScene, setIsEnteringScene] = useState(true);
  const [timerRef, setTimerRef] = useState<NodeJS.Timeout | null>(null);

  const [lastAiiExpr, setLastAiiExpr] = useState("/char/aii/bingung.png");
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
  }, [currentLineIndex]);

  const handleBoxClick = () => {
    playButtonSound();
    if (!isTypingComplete) {
      if (timerRef) clearInterval(timerRef);
      setDisplayedText(dialogueData[currentLineIndex].text);
      setIsTypingComplete(true);
    } else {
      if (currentLineIndex === 7 && onTriggerCubit) {
        onTriggerCubit();
      } else if (currentLineIndex < dialogueData.length - 1) {
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

      <img
        src="/asset/gallery.png"
        alt="Gallery Room Background"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

      {/* Header Bar */}
      <div className="relative z-30 flex items-center justify-between p-4">
        <button
          onClick={handleBackToMenu}
          className="flex items-center gap-1.5 border-2 border-[#2d2d2d] bg-[#ffffba] px-3 py-1.5 text-[9px] font-bold text-[#2d2d2d] shadow-[2px_2px_0px_0px_#2d2d2d] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
        >
          <PxlIcon icon={HomeIcon as unknown as PxlKitIconData} className="h-3.5 w-3.5" />
          <span>MENU</span>
        </button>

        <div className="border-2 border-[#2d2d2d] bg-[#ffd166] px-3 py-1 text-[8px] sm:text-[9px] font-bold text-[#2d2d2d] shadow-[2px_2px_0px_0px_#2d2d2d]">
          RUANG GALERI
        </div>
      </div>

      {/* Painting Frame Area */}
      <div className="pointer-events-none absolute top-40 sm:top-20 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center justify-center">
        <div className="relative border-4 border-[#1a0f0a] bg-[#3d2314] p-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)]">
          <div className="border-2 border-[#8c5a35] bg-[#faf7f2] p-1.5">
            <div className="relative w-36 h-48 sm:w-40 sm:h-52 overflow-hidden border-2 border-[#2d2d2d] bg-[#991b1b]">
              <img
                src="/lukisan/lukisan_1.jpeg"
                alt="Lukisan Keajaiban Dunia"
                className="w-full h-full object-cover object-center"
              />

              <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#b91c1c] via-[#991b1b] to-[#7f1d1d] flex flex-col items-center justify-center p-2 shadow-inner">
                <div className="absolute top-0 left-0 right-0 h-3 bg-[#7f1d1d] border-b-2 border-[#450a0a]" />
                <div className="absolute inset-y-0 left-1/3 w-0.5 bg-[#7f1d1d]/50" />
                <div className="absolute inset-y-0 right-1/3 w-0.5 bg-[#7f1d1d]/50" />

                <p className="relative z-20 font-press-start text-[7.5px] sm:text-[8.5px] font-bold text-[#fef2f2] drop-shadow-[1px_1px_0px_#2d2d2d] text-center px-1">
                  [Tertutup Kain]
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-1 max-w-[140px] px-1.5 border-2 border-[#1a0f0a] bg-[#ffd166] py-0.5 text-center text-[7px] font-bold text-[#1a0f0a] shadow-[1px_1px_0px_0px_#1a0f0a] leading-tight">
            My Bini
          </div>
        </div>
      </div>

      {/* Single Speaker Character Area */}
      <div className="relative z-20 flex-1 flex items-end justify-center -mb-12 sm:-mb-14 px-4 pointer-events-none overflow-hidden">
        <div className="relative h-76 sm:h-80 animate-pixel-idle flex items-end justify-center">
          <img
            key={currentDialogue.speaker}
            src={isAii ? activeAiiExpr : activeKiboExpr}
            alt={currentDialogue.speaker}
            className={`h-full w-auto object-contain drop-shadow-[0_6px_6px_rgba(0,0,0,0.3)] ${isKibo ? "scale-105 origin-bottom" : ""
              }`}
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
