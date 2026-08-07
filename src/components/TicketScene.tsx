"use client";

import { useState, useEffect } from "react";
import { Home as HomeIcon, ArrowRight, BouncingArrow } from "@pxlkit/ui";
import { Button, playButtonSound } from "@/components/ui/pixelact-ui/button";
import { PxlIcon, PxlKitIconData } from "@/components/PxlIcon";
import { playFootstepSound, stopFootstepSound, playTypewriterSound, playPopSound } from "@/lib/audioManager";

interface TicketSceneProps {
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
    text: "Fiuhh.. finally nyampe juga.. katanya viral tapi kok sepi ya??",
    typingExpression: "/char/aii/ngomong_senyum.png",
    expression: "/char/aii/senyum.png",
  },
  {
    speaker: "AII",
    text: "Oh iya! kalo gitu aku beli tiket dulu deh..",
    typingExpression: "/char/aii/ngomong_senyum.png",
    expression: "/char/aii/senyum.png",
  },
  {
    speaker: "AII",
    text: "Mas, tiketnya satu ya..",
    typingExpression: "/char/aii/ngomong_senyum.png",
    expression: "/char/aii/senyum.png",
  },
  {
    speaker: "PETUGAS LOKET",
    text: "Maaf kak, tempat ini udah dibooking full, jadi hari ini gallery ditutup buat umum",
    expression: "/char/petugas/petugas.png",
  },
  {
    speaker: "AII",
    text: "Yah.. masa aku jauh-jauh kesini gabisa masuk, aku uda effort loh mas..",
    expression: "/char/aii/sedih.png",
  },
  {
    speaker: "PETUGAS LOKET",
    text: "Maaf ya kak.. tapi tetep gabisa..",
    expression: "/char/petugas/petugas.png",
  },
  {
    speaker: "AII",
    text: "Gimana sih mas!! kalo gallery ditutup harusnya ada pemberitahuan dong.. kalo kek gini kan aku yang repot!! aku uda capek niat buat mandi, buat makeup, buat panas panasan ke sini!!",
    expression: "/char/aii/kesel.png",
  },
  {
    speaker: "PETUGAS LOKET",
    text: "Sekali lagi maaf ya kak..",
    expression: "/char/petugas/petugas.png",
  },
  {
    speaker: "AII",
    text: "Bodo amat, poko-",
    expression: "/char/aii/marah.png",
  },
  {
    speaker: "KIBO",
    text: "Eeeh ada apa ini rame amat, napas dulu.. jangan marah marah nanti cepet tua lho~",
    expression: "/char/kibo/ketawa.png",
  },
  {
    speaker: "AII",
    text: "Hah?! Kibo?! Kok kamu ada di sini?!",
    expression: "/char/aii/kaget.png",
  },
  {
    speaker: "KIBO",
    text: "Ya mau nonton pameran lah, emangnya cuma kamu doang yang boleh ke sini? pasti kamu ngikutin aku ya hahah..",
    typingExpression: "/char/kibo/ngomong_senyum.png",
    expression: "/char/kibo/senyum.png",
  },
  {
    speaker: "AII",
    text: "Gak usah sok pede deh, tempat ini udah dibooking full hari ini! Ditutup buat umum! Gara-gara itu aku dari tadi emosi!!",
    expression: "/char/aii/kesel.png",
  },
  {
    speaker: "KIBO",
    text: "Lah... seriusan ditutup? Yah, padahal aku udah niat banget ke sini...",
    expression: "/char/kibo/sedih.png",
  },
  {
    speaker: "AII",
    text: "Yakann.. emang nyebelin banget gallery-nya..",
    expression: "/char/aii/sedih.png",
  },
  {
    speaker: "KIBO",
    text: "Hmmm... tapi berhubung kita udah sama-sama sampe sini...",
    typingExpression: "/char/kibo/ngomong_senyum.png",
    expression: "/char/kibo/senyum.png",
  },
  {
    speaker: "AII",
    text: "Kenapa muka kamu kek gitu? Pasti kamu punya ide aneh-aneh ya...",
    expression: "/char/aii/bingung.png",
  },
  {
    speaker: "KIBO",
    text: "Gimana kalo kita diem-diem masuk lewat pintu belakang?",
    expression: "/char/kibo/ketawa.png",
  },
  {
    speaker: "AII",
    text: "HAH?! Tuhkan.. Kalo kepergok sama petugasnya gimana??",
    expression: "/char/aii/kaget.png",
  },
  {
    speaker: "KIBO",
    text: "Mumpung petugasnya lagi ke toilet tuh. Lagian rugi dong udah dandan cantik gitu masa langsung balik? Berani ga?",
    typingExpression: "/char/kibo/ngomong_senyum.png",
    expression: "/char/kibo/senyum.png",
  },
  {
    speaker: "AII",
    text: "Ngomong apasi! Tapi... mmm... oke deh, kalo ketauan aku bilang cuma ikut ikutan kamu!",
    expression: "/char/aii/salting.png",
  },
];

export function TicketScene({ onBackToMenu, onNextScene }: TicketSceneProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isWalkingIn, setIsWalkingIn] = useState(true);
  const [isKiboWalkingIn, setIsKiboWalkingIn] = useState(false);
  const [hasKiboEntered, setHasKiboEntered] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isEnteringScene, setIsEnteringScene] = useState(true);
  const [timerRef, setTimerRef] = useState<NodeJS.Timeout | null>(null);

  const [lastAiiExpr, setLastAiiExpr] = useState("/char/aii/senyum.png");
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

    if ((currentDialogue.text.includes("Bodo amat, pokonya aku ma-") || currentDialogue.text.includes("bodo amat, pokonya aku ma-") || currentDialogue.speaker === "KIBO") && !hasKiboEntered) {
      setHasKiboEntered(true);
      setIsKiboWalkingIn(true);
      playFootstepSound(3200);
      setTimeout(() => {
        setIsKiboWalkingIn(false);
      }, 3200);
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
  }, [currentLineIndex, hasKiboEntered]);

  const handleBoxClick = () => {
    playButtonSound();
    if (!isTypingComplete) {
      if (timerRef) clearInterval(timerRef);
      setDisplayedText(dialogueData[currentLineIndex].text);
      setIsTypingComplete(true);
    } else {
      if (currentLineIndex !== 1 && currentLineIndex < dialogueData.length - 1) {
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

  const handleBuyTicket = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentLineIndex(2);
  };

  const handleBackToMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    playButtonSound();
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onBackToMenu();
    }, 700);
  };

  const currentDialogue = dialogueData[currentLineIndex];
  const isFinalLine = currentLineIndex === dialogueData.length - 1;
  const isBuyTicketLine = currentLineIndex === 1;

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

  const currentExpression = currentDialogue.speaker === "PETUGAS LOKET"
    ? currentDialogue.expression
    : activeAiiExpr;

  const speakerBadgeColor = currentDialogue.speaker === "AII"
    ? "bg-[#ffb3ba]"
    : currentDialogue.speaker === "KIBO"
      ? "bg-[#bae1ff]"
      : "bg-[#ffffba]";

  const isAii = currentDialogue.speaker === "AII";
  const isKibo = currentDialogue.speaker === "KIBO";

  return (
    <div className="relative h-full w-full flex flex-col justify-between overflow-hidden select-none bg-[#faf7f2]">
      <div
        className={`pointer-events-none absolute inset-0 z-[70] bg-black transition-opacity duration-700 ${isEnteringScene || isExiting ? "opacity-100" : "opacity-0"
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
        {!hasKiboEntered ? (
          <div
            className={`relative w-48 sm:w-52 ${isWalkingIn ? "animate-step-in" : "animate-pixel-idle"
              }`}
          >
            <img
              src={currentExpression}
              alt="Character"
              className={`w-full h-auto object-contain drop-shadow-[0_6px_6px_rgba(0,0,0,0.3)] ${!isAii ? "scale-125 sm:scale-130 origin-bottom" : ""
                }`}
            />
          </div>
        ) : (
          <div className="relative flex items-end justify-center w-full max-w-sm">
            <div
              className={`relative w-40 sm:w-44 transition-all duration-300 ${isAii
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

            <div
              key={isKiboWalkingIn ? "kibo-walking" : "kibo-idle"}
              className={`relative w-42 sm:w-46 -ml-9 sm:-ml-11 transition-all duration-300 ${isKiboWalkingIn ? "animate-step-in" : "animate-pixel-idle"
                } ${isKibo
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
        )}
      </div>

      <div className="relative z-40 w-full px-3 pb-3">
        <div
          onClick={handleBoxClick}
          className="relative w-full border-4 border-[#2d2d2d] bg-[#faf7f2]/95 p-3.5 sm:p-4 shadow-[4px_4px_0px_0px_#2d2d2d] backdrop-blur-xs cursor-pointer min-h-[145px] sm:min-h-[160px] flex flex-col justify-between transition-all"
        >
          <div className={`absolute -top-4.5 left-3 border-2 border-[#2d2d2d] ${speakerBadgeColor} px-2.5 py-0.5 shadow-[2px_2px_0px_0px_#2d2d2d]`}>
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
