"use client";

import { useState, useEffect } from "react";
import { Home as HomeIcon, ArrowRight, BouncingArrow } from "@pxlkit/ui";
import { playButtonSound, playTypewriterSound, playPopSound, setBGMVolume } from "@/lib/audioManager";
import { PxlIcon, PxlKitIconData } from "@/components/PxlIcon";

interface StatueMinigameSceneProps {
  onBackToMenu: () => void;
  onNextScene?: () => void;
}

export function StatueMinigameScene({
  onBackToMenu,
  onNextScene,
}: StatueMinigameSceneProps) {
  const [posHati, setPosHati] = useState(90);
  const [posTangan, setPosTangan] = useState(0);
  const [posBatu, setPosBatu] = useState(270);

  const [isCompleted, setIsCompleted] = useState(false);
  const [hasPlayedSuccess, setHasPlayedSuccess] = useState(false);
  const [isEnteringScene, setIsEnteringScene] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const successDialogues = [
    {
      speaker: "NARATOR",
      badgeBg: "bg-[#ffffba]",
      text: "KRRKKKkk!! Gedung bergetar.. tiba tiba sebuah pintu ruangan misterius terbuka..",
      expression: "",
    },
  ];

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsEnteringScene(false);
    }, 50);

    setBGMVolume(0.5, 500);

    return () => clearTimeout(fadeTimer);
  }, []);

  useEffect(() => {
    const normHati = ((posHati % 360) + 360) % 360;
    const normTangan = ((posTangan % 360) + 360) % 360;
    const normBatu = ((posBatu % 360) + 360) % 360;

    if (normHati === 180 && normTangan === 180 && normBatu === 180) {
      if (!hasPlayedSuccess) {
        setIsCompleted(true);
        setHasPlayedSuccess(true);
        setIsShaking(true);
        playPopSound();
        setTimeout(() => {
          setIsShaking(false);
        }, 650);
      }
    }
  }, [posHati, posTangan, posBatu, hasPlayedSuccess]);

  useEffect(() => {
    if (!isCompleted) return;
    const currentDialogue = successDialogues[dialogueIndex];
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

    return () => clearInterval(timer);
  }, [isCompleted, dialogueIndex]);

  useEffect(() => {
    if (isCompleted && isTypingComplete) {
      const autoNextTimer = setTimeout(() => {
        handleNextScene();
      }, 1400);
      return () => clearTimeout(autoNextTimer);
    }
  }, [isCompleted, isTypingComplete]);

  const slideHatiStep = () => {
    if (isCompleted) return;
    playPopSound();
    setPosHati((prev) => prev + 90);
  };

  const slideTanganStep = () => {
    if (isCompleted) return;
    playPopSound();
    setPosTangan((prev) => prev + 90);
  };

  const slideBatuStep = () => {
    if (isCompleted) return;
    playPopSound();
    setPosBatu((prev) => prev + 90);
  };

  const handleDialogueClick = () => {
    playButtonSound();
    if (!isTypingComplete) {
      setDisplayedText(successDialogues[dialogueIndex].text);
      setIsTypingComplete(true);
    } else {
      if (dialogueIndex < successDialogues.length - 1) {
        setDialogueIndex((prev) => prev + 1);
      } else {
        handleNextScene();
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
    }, 400);
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
    }, 400);
  };

  const currentDialogue = successDialogues[dialogueIndex];
  const isFinalDialogue = dialogueIndex === successDialogues.length - 1;

  return (
    <div className={`relative h-full w-full flex flex-col justify-between overflow-hidden select-none bg-[#faf7f2] ${isShaking ? "animate-shake" : ""}`}>
      <div
        className={`pointer-events-none absolute inset-0 z-[70] bg-black transition-opacity duration-400 ${isEnteringScene || isExiting ? "opacity-100" : "opacity-0"
          }`}
      />

      <img
        src="/asset/patung_minigame.png"
        alt="Statue Minigame Background"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center scale-140 sm:scale-150 origin-center blur-xs"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

      <div className="relative z-30 flex items-center justify-between p-4">
        <button
          onClick={handleBackToMenu}
          className="flex items-center gap-1.5 border-2 border-[#2d2d2d] bg-[#ffffba] px-3 py-1.5 text-[9px] font-bold text-[#2d2d2d] shadow-[2px_2px_0px_0px_#2d2d2d] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
        >
          <PxlIcon icon={HomeIcon as unknown as PxlKitIconData} className="h-3.5 w-3.5" />
          <span>MENU</span>
        </button>

        <div className="border-2 border-[#2d2d2d] bg-[#e9d5ff] px-3 py-1 text-[8px] sm:text-[9px] font-bold text-[#2d2d2d] shadow-[2px_2px_0px_0px_#2d2d2d]">
          GESER PATUNG
        </div>
      </div>

      <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-4">
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
          <div className={`absolute w-[260px] h-[260px] rounded-full border-2 transition-all duration-500 pointer-events-none ${isCompleted ? "border-[#baffc9] border-solid animate-pulse shadow-[0_0_14px_rgba(186,255,201,0.9)]" : "border-dashed border-white/50"}`} />

          <div className={`absolute w-[180px] h-[180px] rounded-full border-2 transition-all duration-500 pointer-events-none ${isCompleted ? "border-[#baffc9] border-solid animate-pulse shadow-[0_0_12px_rgba(186,255,201,0.8)]" : "border-dashed border-white/40"}`} />

          <div className={`absolute w-[100px] h-[100px] rounded-full border-2 transition-all duration-500 pointer-events-none ${isCompleted ? "border-[#baffc9] border-solid animate-pulse shadow-[0_0_10px_rgba(186,255,201,0.7)]" : "border-dashed border-white/30"}`} />

          <div
            style={{
              transform: `rotate(${posBatu}deg)`,
              transition: "transform 0.45s cubic-bezier(0.34, 1.3, 0.64, 1)",
            }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          >
            <div
              onClick={slideBatuStep}
              style={{
                transform: `translateY(-130px) rotate(-${posBatu}deg)`,
                transition: "transform 0.45s cubic-bezier(0.34, 1.3, 0.64, 1)",
              }}
              className="pointer-events-auto w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
              title="Klik untuk menggeser Patung Batu (Track Luar)"
            >
              <img
                src="/patung/patung_batu.PNG"
                alt="Patung Batu"
                className="w-full h-full object-contain pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
              />
            </div>
          </div>

          <div
            style={{
              transform: `rotate(${posTangan}deg)`,
              transition: "transform 0.45s cubic-bezier(0.34, 1.3, 0.64, 1)",
            }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            <div
              onClick={slideTanganStep}
              style={{
                transform: `translateY(-90px) rotate(-${posTangan}deg)`,
                transition: "transform 0.45s cubic-bezier(0.34, 1.3, 0.64, 1)",
              }}
              className="pointer-events-auto w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
              title="Klik untuk menggeser Patung Tangan (Track Tengah)"
            >
              <img
                src="/patung/patung_tangan.PNG"
                alt="Patung Tangan"
                className="w-full h-full object-contain pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
              />
            </div>
          </div>

          <div
            style={{
              transform: `rotate(${posHati}deg)`,
              transition: "transform 0.45s cubic-bezier(0.34, 1.3, 0.64, 1)",
            }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
          >
            <div
              onClick={slideHatiStep}
              style={{
                transform: `translateY(-50px) rotate(-${posHati}deg)`,
                transition: "transform 0.45s cubic-bezier(0.34, 1.3, 0.64, 1)",
              }}
              className="pointer-events-auto w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
              title="Klik untuk menggeser Patung Hati (Track Dalam)"
            >
              <img
                src="/patung/patung_hati.PNG"
                alt="Patung Hati"
                className="w-full h-full object-contain pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-40 w-full px-3 pb-3">
        <div
          onClick={isCompleted ? handleDialogueClick : undefined}
          className="relative w-full border-4 border-[#2d2d2d] bg-[#faf7f2]/95 p-3.5 sm:p-4 shadow-[4px_4px_0px_0px_#2d2d2d] backdrop-blur-xs min-h-[145px] sm:min-h-[160px] flex flex-col justify-between transition-all cursor-pointer"
        >
          {!isCompleted ? (
            <>
              <div className="absolute -top-4.5 left-3 border-2 border-[#2d2d2d] bg-[#ffffba] px-2.5 py-0.5 shadow-[2px_2px_0px_0px_#2d2d2d]">
                <span className="font-press-start text-[9px] sm:text-[10px] font-bold text-[#2d2d2d]">
                  PETUNJUK
                </span>
              </div>

              <div className="pt-3 text-left">
                <p className="font-press-start text-[9px] sm:text-[10px] leading-relaxed text-[#2d2d2d]">
                  Klik patung untuk menggesernya ke posisi yang tepat!
                </p>
              </div>

              <div className="mt-2 flex items-center justify-between pt-1">
                <span className="text-[7.5px] sm:text-[8px] text-[#888888] font-press-start">
                  [Klik Patung]
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

                <PxlIcon
                  icon={BouncingArrow as unknown as PxlKitIconData}
                  className="h-4 w-4 shrink-0"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
