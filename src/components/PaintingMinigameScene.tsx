"use client";

import { useState, useEffect } from "react";
import { Home as HomeIcon, ArrowRight, BouncingArrow } from "@pxlkit/ui";
import { Button } from "@/components/ui/pixelact-ui/button";
import { playButtonSound, playTypewriterSound, playPopSound } from "@/lib/audioManager";
import { PxlIcon, PxlKitIconData } from "@/components/PxlIcon";
import confetti from "canvas-confetti";

interface PaintingMinigameSceneProps {
  onBackToMenu: () => void;
  onNextScene?: () => void;
}

interface PaintingDialogue {
  speaker: string;
  badgeBg: string;
  text: string;
}

interface PaintingItem {
  id: number;
  title: string;
  image: string;
  dialogues: PaintingDialogue[];
}

const paintingsData: PaintingItem[] = [
  {
    id: 1,
    title: "My Bini",
    image: "/lukisan/lukisan_1.jpeg",
    dialogues: [
      {
        speaker: "KIBO",
        badgeBg: "bg-[#bae1ff]",
        text: "Huumm.. ya lumayan juga sih lukisannya.. (Sial arghhh!! Ini bisa merusak kesehatanku!!) *Dalam hati Kibo",
      },
      {
        speaker: "AII",
        badgeBg: "bg-[#ffb3ba]",
        text: "Beliau pasti sayang banget sama bininya",
      },
    ],
  },
  {
    id: 2,
    title: "The Sweetie Panda",
    image: "/lukisan/lukisan_2.jpeg",
    dialogues: [
      {
        speaker: "AII",
        badgeBg: "bg-[#ffb3ba]",
        text: "Hahahahah!! Siapa cewek manis ini?! Lihatlah matanya Kibo, pantas saja lukisan ini diberi nama\n'The Sweetie Panda'!",
      },
    ],
  },
  {
    id: 3,
    title: "Happiness",
    image: "/lukisan/lukisan_3.jpeg",
    dialogues: [
      {
        speaker: "KIBO",
        badgeBg: "bg-[#bae1ff]",
        text: "SIALL ARGHH!! Ingin ku mengucap my bini, my istri, my kisah, my mbg, my sweetness, my world, my soulmate. tapi masi ada Aii disini, aku harus bersikap nonchalant didepannya (Ucap Kibo dalam hati)",
      },
      {
        speaker: "AII",
        badgeBg: "bg-[#ffb3ba]",
        text: "Wanita itu pasti sangat menyayangi gelang itu",
      },
      {
        speaker: "KIBO",
        badgeBg: "bg-[#bae1ff]",
        text: "Iya, pelukis ini pasti merasa menjadi cowok paling bahagia bisa memilikinya",
      },
      {
        speaker: "AII",
        badgeBg: "bg-[#ffb3ba]",
        text: "Kenapa pipimu memerah seperti kucing kepanasan..",
      },
      {
        speaker: "KIBO",
        badgeBg: "bg-[#bae1ff]",
        text: "Gapapa kok hehehe, lebih baik kita pergi aja ke ruangan lain",
      },
    ],
  },
];

export function PaintingMinigameScene({
  onBackToMenu,
}: PaintingMinigameSceneProps) {
  const [currentPaintingIndex, setCurrentPaintingIndex] = useState(0);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const [isClothRemoved, setIsClothRemoved] = useState(false);
  const [isSlidingOut, setIsSlidingOut] = useState(false);
  const [isSlidingIn, setIsSlidingIn] = useState(false);
  const [isEnteringScene, setIsEnteringScene] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [timerRef, setTimerRef] = useState<NodeJS.Timeout | null>(null);

  const currentPainting = paintingsData[currentPaintingIndex];
  const currentDialogue = currentPainting.dialogues[currentDialogueIndex] || currentPainting.dialogues[0];
  const isFinalDialogueOfPainting = currentDialogueIndex === currentPainting.dialogues.length - 1;

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsEnteringScene(false);
    }, 50);

    return () => {
      clearTimeout(fadeTimer);
    };
  }, []);

  useEffect(() => {
    if (!isClothRemoved) {
      setDisplayedText("");
      setIsTypingComplete(false);
      return;
    }

    const currentText = currentDialogue?.text || "";
    setDisplayedText("");
    setIsTypingComplete(false);
    let index = 0;

    const timer = setInterval(() => {
      if (index < currentText.length) {
        const char = currentText[index];
        setDisplayedText(currentText.slice(0, index + 1));
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
  }, [isClothRemoved, currentPaintingIndex, currentDialogueIndex]);

  const handleBoxClick = (e: React.MouseEvent) => {
    if (!isClothRemoved) return;
    if (!isTypingComplete) {
      playButtonSound();
      if (timerRef) clearInterval(timerRef);
      setDisplayedText(currentDialogue?.text || "");
      setIsTypingComplete(true);
    } else {
      if (currentDialogueIndex < currentPainting.dialogues.length - 1) {
        playButtonSound();
        setCurrentDialogueIndex((prev) => prev + 1);
      } else {
        handleNextPainting(e);
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
    }, 400);
  };

  const handleNextPainting = (e: React.MouseEvent) => {
    e.stopPropagation();
    playButtonSound();

    if (currentPaintingIndex < paintingsData.length - 1) {
      setIsSlidingOut(true);
      setTimeout(() => {
        setCurrentPaintingIndex((prev) => prev + 1);
        setCurrentDialogueIndex(0);
        setIsClothRemoved(false);
        setDragY(0);
        setIsSlidingOut(false);
        setIsSlidingIn(true);
        setTimeout(() => {
          setIsSlidingIn(false);
        }, 400);
      }, 400);
    } else {
      handleBackToMenu(e);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isClothRemoved) return;
    setIsDragging(true);
    setDragStartY(e.touches[0].clientY - dragY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isClothRemoved) return;
    const currentY = e.touches[0].clientY;
    const newY = Math.max(0, currentY - dragStartY);
    setDragY(newY);
    if (newY > 100) {
      triggerClothRemoved();
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragY > 70) {
      triggerClothRemoved();
    } else {
      setDragY(0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isClothRemoved) return;
    setIsDragging(true);
    setDragStartY(e.clientY - dragY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isClothRemoved) return;
    const newY = Math.max(0, e.clientY - dragStartY);
    setDragY(newY);
    if (newY > 100) {
      triggerClothRemoved();
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragY > 70) {
      triggerClothRemoved();
    } else {
      setDragY(0);
    }
  };

  const triggerClothRemoved = () => {
    if (isClothRemoved) return;
    setIsClothRemoved(true);
    setIsDragging(false);
    playPopSound();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.55 },
        colors: ["#ffb3ba", "#bae1ff", "#ffffba", "#baffc9", "#ffd166"],
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative h-full w-full flex flex-col justify-between overflow-hidden select-none bg-white">
      <div
        className={`pointer-events-none absolute inset-0 z-[70] bg-black transition-opacity duration-400 ${
          isEnteringScene || isExiting ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="pointer-events-none absolute inset-0 bg-white" />

      <img
        src="/asset/gallery.png"
        alt="Gallery Room Background"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center scale-140 sm:scale-150 origin-center blur-xs"
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
          LUKISAN {currentPaintingIndex + 1}/{paintingsData.length}
        </div>
      </div>

      {/* MINIGAME ZOOMED IN VIEW WITH SLIDE ANIMATION */}
      <div className="relative z-30 flex-1 flex flex-col items-center justify-center p-4 -mt-6 sm:-mt-4 overflow-hidden w-full">
        <div
          className={`relative border-4 sm:border-6 border-[#1a0f0a] bg-[#3d2314] p-2 sm:p-2.5 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] w-64 sm:w-72 transition-all duration-400 ${
            isSlidingOut
              ? "-translate-x-full opacity-0"
              : isSlidingIn
              ? "translate-x-full opacity-0"
              : "translate-x-0 opacity-100"
          }`}
        >
          <div className="border-3 border-[#8c5a35] bg-[#faf7f2] p-2">
            <div className="relative w-full h-64 sm:h-72 overflow-hidden border-2 border-[#2d2d2d] bg-[#1a1a1a] shadow-inner select-none">
              {/* Revealed Painting */}
              <img
                src={currentPainting.image}
                alt={currentPainting.title}
                className="w-full h-full object-cover object-center pointer-events-none"
              />

              {/* Glowing effect when cloth is removed */}
              {isClothRemoved && (
                <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/20 via-transparent to-amber-200/20 animate-pulse" />
              )}

              {/* Draggable Cloth Overlay */}
              <div
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                  transform: `translateY(${isClothRemoved ? 320 : dragY}px)`,
                  opacity: isClothRemoved ? 0 : 1 - Math.min(1, dragY / 150),
                }}
                className={`absolute inset-0 z-20 bg-gradient-to-b from-[#b91c1c] via-[#991b1b] to-[#7f1d1d] flex flex-col items-center justify-center p-4 shadow-2xl transition-all ${
                  isClothRemoved
                    ? "pointer-events-none duration-700"
                    : isDragging
                    ? "cursor-grabbing duration-0"
                    : "cursor-grab duration-300"
                }`}
              >
                <div className="absolute top-0 left-0 right-0 h-4 bg-[#7f1d1d] border-b-2 border-[#450a0a]" />
                <div className="absolute inset-y-0 left-1/3 w-0.5 bg-[#7f1d1d]/50" />
                <div className="absolute inset-y-0 right-1/3 w-0.5 bg-[#7f1d1d]/50" />
              </div>
            </div>
          </div>

          <div className="mx-auto mt-2 max-w-[180px] px-2 border-2 border-[#1a0f0a] bg-[#ffd166] py-1 text-center font-press-start text-[8.5px] sm:text-[9.5px] font-bold text-[#1a0f0a] shadow-[2px_2px_0px_0px_#1a0f0a] leading-tight">
            {currentPainting.title}
          </div>
        </div>
      </div>

      {/* Dialogue / Action Box */}
      <div className="relative z-40 w-full px-3 pb-3">
        <div
          onClick={handleBoxClick}
          className="relative w-full border-4 border-[#2d2d2d] bg-[#faf7f2]/95 p-3.5 sm:p-4 shadow-[4px_4px_0px_0px_#2d2d2d] backdrop-blur-xs min-h-[145px] sm:min-h-[160px] flex flex-col justify-between transition-all cursor-pointer"
        >
          {!isClothRemoved ? (
            <>
              <div className="absolute -top-4.5 left-3 border-2 border-[#2d2d2d] bg-[#ffffba] px-2.5 py-0.5 shadow-[2px_2px_0px_0px_#2d2d2d]">
                <span className="font-press-start text-[9px] sm:text-[10px] font-bold text-[#2d2d2d]">
                  PETUNJUK
                </span>
              </div>

              <div className="pt-3 text-left">
                <p className="font-press-start text-[9px] sm:text-[10px] leading-relaxed text-[#2d2d2d]">
                  Tarik kain pada lukisan ke bawah untuk membuka lukisannya!
                </p>
              </div>

              <div className="mt-2 flex items-center justify-between pt-1">
                <span className="text-[7.5px] sm:text-[8px] text-[#888888] font-press-start">
                  [Tarik Kain]
                </span>
                <PxlIcon
                  icon={BouncingArrow as unknown as PxlKitIconData}
                  className="h-4 w-4 shrink-0"
                />
              </div>
            </>
          ) : (
            <>
              <div
                className={`absolute -top-4.5 left-3 border-2 border-[#2d2d2d] ${currentDialogue.badgeBg} px-2.5 py-0.5 shadow-[2px_2px_0px_0px_#2d2d2d]`}
              >
                <span className="font-press-start text-[9px] sm:text-[10px] font-bold text-[#2d2d2d]">
                  {currentDialogue.speaker}
                </span>
              </div>

              <div className="pt-3 text-left">
                <p className="font-press-start text-[9px] sm:text-[10px] leading-relaxed text-[#2d2d2d] whitespace-pre-line">
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
                  {!isTypingComplete || !isFinalDialogueOfPainting ? "[Klik buat lanjut]" : ""}
                </span>

                {(!isTypingComplete || !isFinalDialogueOfPainting) && (
                  <PxlIcon
                    icon={BouncingArrow as unknown as PxlKitIconData}
                    className="h-4 w-4 shrink-0"
                  />
                )}
              </div>

              {isTypingComplete && isFinalDialogueOfPainting && (
                <div className="mt-2 w-full pt-1">
                  <Button
                    variant="mint"
                    size="default"
                    onClick={handleNextPainting}
                    className="w-full group h-9 text-[8.5px] sm:text-[9px] flex items-center justify-center gap-2 border-2 border-[#2d2d2d] shadow-[3px_3px_0px_0px_#2d2d2d]"
                  >
                    <span>
                      {currentPaintingIndex < paintingsData.length - 1
                        ? "LANJUT LUKISAN BERIKUTNYA"
                        : "KEMBALI KE MENU"}
                    </span>
                    <PxlIcon
                      icon={ArrowRight as unknown as PxlKitIconData}
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                    />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
