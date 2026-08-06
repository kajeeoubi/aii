"use client";

import { useEffect, useState } from "react";
import { Play, Gear, List } from "@pxlkit/ui";
import { Button } from "@/components/ui/pixelact-ui/button";
import { PxlIcon, PxlKitIconData } from "@/components/PxlIcon";
import { Prologue } from "@/components/Prologue";
import { TicketScene } from "@/components/TicketScene";
import { Settings } from "@/components/Settings";
import { SneakNarrative } from "@/components/TicketNarrative";
import { GalleryScene } from "@/components/GalleryScene";
import { PaintingRoomScene } from "@/components/PaintingRoomScene";
import { PaintingMinigameScene } from "@/components/PaintingMinigameScene";
import { FlowerGardenScene } from "@/components/FlowerGardenScene";
import { FlowerArrangingNarrative } from "@/components/FlowerNarrative";
import { FlowerArrangingScene } from "@/components/FlowerMinigameScene";
import { FlowerGardenPart2Scene } from "@/components/FlowerGardenPart2Scene";
import { StatueRoomScene } from "@/components/StatueRoomScene";
import { StatueMinigameScene } from "@/components/StatueMinigameScene";
import { StatueMinigameEndingScene } from "@/components/StatueMinigameEndingScene";
import { CubitScene } from "@/components/CubitScene";
import { ChapterSelect } from "@/components/ChapterSelect";
import {
  isSoundEnabled,
  setSoundEnabledStorage,
  isMusicEnabled,
  playBGM,
  pauseBGM,
  toggleBGM,
} from "@/lib/audioManager";

export default function Home() {
  const [currentView, setCurrentView] = useState<"menu" | "prologue" | "ticket" | "sneakNarrative" | "gallery" | "paintingRoom" | "cubit" | "paintingRoomPart2" | "paintingMinigame" | "flowerGarden" | "flowerArrangingNarrative" | "flowerArranging" | "flowerGardenPart2" | "statueRoom" | "statueMinigame" | "statueMinigameEnding" | "chapterSelect" | "settings">("menu");
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [musicEnabled, setMusicEnabledState] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setSoundEnabledState(isSoundEnabled());
    setMusicEnabledState(isMusicEnabled());
  }, []);

  useEffect(() => {
    if (!musicEnabled) {
      pauseBGM();
      return;
    }

    const chapter3to6Views = [
      "paintingRoom",
      "cubit",
      "paintingRoomPart2",
      "paintingMinigame",
      "flowerGarden",
      "flowerArrangingNarrative",
      "flowerArranging",
      "flowerGardenPart2",
    ];

    const chapter7to9Views = [
      "statueRoom",
      "statueMinigame",
      "statueMinigameEnding",
    ];

    if (chapter3to6Views.includes(currentView)) {
      playBGM("/audio/bgm/ollg.mp3");
    } else if (chapter7to9Views.includes(currentView)) {
      playBGM("/audio/bgm/ilmlou.mp3");
    } else {
      playBGM("/audio/bgm/stars.mp3");
    }
  }, [currentView, musicEnabled]);

  const handleSetSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    setSoundEnabledStorage(enabled);
  };

  const handleSetMusicEnabled = (enabled: boolean) => {
    setMusicEnabledState(enabled);
    toggleBGM(enabled);
  };

  const handleStartTour = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView("prologue");
      setIsTransitioning(false);
    }, 350);
  };

  return (
    <div className="relative flex h-screen h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-[#faf7f2] font-press-start select-none">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: `radial-gradient(#bae1ff 1.5px, transparent 1.5px), radial-gradient(#ffb3ba 1.5px, #faf7f2 1.5px)`,
          backgroundSize: `36px 36px`,
          backgroundPosition: `0 0, 18px 18px`
        }}
      />

      <div className={`relative z-10 flex h-full max-h-screen max-h-[100dvh] w-full max-w-md flex-col items-center justify-between overflow-hidden border-x-4 border-[#2d2d2d] ${currentView === "menu" || currentView === "chapterSelect" || currentView === "settings" ? "bg-[#8cd0f5] pb-6" : "bg-[#faf7f2]"} shadow-[0_0_20px_rgba(0,0,0,0.08)]`}>
        <div
          className={`pointer-events-none absolute inset-0 z-[60] bg-black transition-opacity duration-350 ${isTransitioning ? "opacity-100" : "opacity-0"
            }`}
        />

        {currentView === "prologue" ? (
          <Prologue
            onBackToMenu={() => setCurrentView("menu")}
            onNextToTicket={() => setCurrentView("ticket")}
          />
        ) : currentView === "ticket" ? (
          <TicketScene
            onBackToMenu={() => setCurrentView("menu")}
            onNextScene={() => setCurrentView("sneakNarrative")}
          />
        ) : currentView === "sneakNarrative" ? (
          <SneakNarrative
            onBackToMenu={() => setCurrentView("menu")}
            onNextScene={() => setCurrentView("gallery")}
          />
        ) : currentView === "gallery" ? (
          <GalleryScene
            onBackToMenu={() => setCurrentView("menu")}
            onNextScene={() => setCurrentView("paintingRoom")}
          />
        ) : currentView === "paintingRoom" ? (
          <PaintingRoomScene
            startLineIndex={0}
            onBackToMenu={() => setCurrentView("menu")}
            onTriggerCubit={() => setCurrentView("cubit")}
          />
        ) : currentView === "cubit" ? (
          <CubitScene
            onNextScene={() => setCurrentView("paintingRoomPart2")}
          />
        ) : currentView === "paintingRoomPart2" ? (
          <PaintingRoomScene
            startLineIndex={8}
            onBackToMenu={() => setCurrentView("menu")}
            onNextScene={() => setCurrentView("paintingMinigame")}
          />
        ) : currentView === "paintingMinigame" ? (
          <PaintingMinigameScene
            onBackToMenu={() => setCurrentView("menu")}
            onNextScene={() => setCurrentView("flowerGarden")}
          />
        ) : currentView === "flowerGarden" ? (
          <FlowerGardenScene
            onBackToMenu={() => setCurrentView("menu")}
            onNextScene={() => setCurrentView("flowerArrangingNarrative")}
          />
        ) : currentView === "flowerArrangingNarrative" ? (
          <FlowerArrangingNarrative
            onBackToMenu={() => setCurrentView("menu")}
            onNextScene={() => setCurrentView("flowerArranging")}
          />
        ) : currentView === "flowerArranging" ? (
          <FlowerArrangingScene
            onBackToMenu={() => setCurrentView("menu")}
            onNextScene={() => setCurrentView("flowerGardenPart2")}
          />
        ) : currentView === "flowerGardenPart2" ? (
          <FlowerGardenPart2Scene
            onBackToMenu={() => setCurrentView("menu")}
            onNextScene={() => setCurrentView("statueRoom")}
          />
        ) : currentView === "statueRoom" ? (
          <StatueRoomScene
            onBackToMenu={() => setCurrentView("menu")}
            onNextScene={() => setCurrentView("statueMinigame")}
          />
        ) : currentView === "statueMinigame" ? (
          <StatueMinigameScene
            onBackToMenu={() => setCurrentView("menu")}
            onNextScene={() => setCurrentView("statueMinigameEnding")}
          />
        ) : currentView === "statueMinigameEnding" ? (
          <StatueMinigameEndingScene
            onBackToMenu={() => setCurrentView("menu")}
            onNextScene={() => setCurrentView("menu")}
          />
        ) : (
          <>
            <img
              src="/asset/gedung.PNG"
              alt="Building Background"
              className="pointer-events-none absolute bottom-0 left-0 w-full object-cover object-bottom"
            />

            <div className="relative z-10 mt-14 sm:mt-6 flex flex-col items-center w-full px-4">
              <div className="w-full max-w-[260px] flex justify-start pl-2">
                <span
                  className="animate-float inline-block border-3 border-[#2d2d2d] bg-[#ffb3ba] px-4 py-1.5 font-press-start text-lg sm:text-xl font-bold text-[#2d2d2d] shadow-[4px_4px_0px_0px_#2d2d2d] -rotate-4 hover:rotate-0 transition-transform"
                  style={{ animationDelay: "0s", animationDuration: "3s" }}
                >
                  Tour
                </span>
              </div>

              <div className="relative z-20 w-full max-w-[260px] flex justify-end pr-2 -mt-10">
                <span
                  className="animate-float inline-block border-3 border-[#2d2d2d] bg-[#ffffba] px-4 py-1.5 font-press-start text-lg sm:text-xl font-bold text-[#2d2d2d] shadow-[4px_4px_0px_0px_#2d2d2d] rotate-4 hover:rotate-0 transition-transform"
                  style={{ animationDelay: "0.6s", animationDuration: "3.4s" }}
                >
                  with
                </span>
              </div>

              <div className="relative z-10 w-full max-w-[260px] flex justify-center pl-1 mt-1">
                <span
                  className="animate-float inline-block border-3 border-[#2d2d2d] bg-[#bae1ff] px-5 py-2 font-press-start text-xl sm:text-2xl font-bold text-[#2d2d2d] shadow-[4px_4px_0px_0px_#2d2d2d] -rotate-2 hover:rotate-0 transition-transform"
                  style={{ animationDelay: "1.2s", animationDuration: "2.8s" }}
                >
                  Kibo
                </span>
              </div>

              <p className="mt-8 sm:mt-6 w-full max-w-[300px] sm:max-w-[320px] text-center font-press-start text-[8.5px] sm:text-[9.5px] leading-relaxed text-[#2d2d2d]">
                Maaf aku telat ngasihnya.. but i made this special for u! hopefully u like it :D
              </p>
            </div>

            <div className="relative z-20 w-full max-w-[290px] px-2 mt-auto pb-4">
              {currentView === "menu" && (
                <div className="flex flex-col gap-2.5">
                  <Button
                    variant="mint"
                    size="lg"
                    onClick={handleStartTour}
                    className="group relative flex h-11 w-full items-center justify-center gap-2.5 text-xs"
                  >
                    <PxlIcon icon={Play as unknown as PxlKitIconData} className="h-4 w-4 transition-transform duration-200 group-hover:scale-125 group-hover:rotate-12" />
                    <span>MULAI TOUR!</span>
                  </Button>

                  <Button
                    variant="sky"
                    size="lg"
                    onClick={() => setCurrentView("chapterSelect")}
                    className="group relative flex h-11 w-full items-center justify-center gap-2.5 text-xs"
                  >
                    <PxlIcon icon={List as unknown as PxlKitIconData} className="h-4 w-4 transition-transform duration-200 group-hover:scale-125" />
                    <span>PILIH CHAPTER</span>
                  </Button>

                  <Button
                    variant="purple"
                    size="lg"
                    onClick={() => setCurrentView("settings")}
                    className="group relative flex h-11 w-full items-center justify-center gap-2.5 text-xs"
                  >
                    <PxlIcon icon={Gear as unknown as PxlKitIconData} className="h-4 w-4 transition-transform duration-500 group-hover:rotate-180" />
                    <span>PENGATURAN</span>
                  </Button>
                </div>
              )}

              {currentView === "chapterSelect" && (
                <ChapterSelect
                  onSelectChapter={(ch) => setCurrentView(ch)}
                  onBackToMenu={() => setCurrentView("menu")}
                />
              )}

              {currentView === "settings" && (
                <Settings
                  soundEnabled={soundEnabled}
                  setSoundEnabled={handleSetSoundEnabled}
                  musicEnabled={musicEnabled}
                  setMusicEnabled={handleSetMusicEnabled}
                  onBackToMenu={() => setCurrentView("menu")}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
