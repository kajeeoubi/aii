"use client";

import { useEffect, useState } from "react";
import { Play, Gear, List } from "@pxlkit/ui";
import { Button } from "@/components/ui/pixelact-ui/button";
import { PxlIcon, PxlKitIconData } from "@/components/PxlIcon";
import { Prologue } from "@/components/Prologue";
import { TicketScene } from "@/components/TicketScene";
import { Settings } from "@/components/Settings";
import { SneakNarrative } from "@/components/TicketNarrative";
import { GalleryScene } from "@/components/FrontGalleryScene";
import { GalleryRoomScene } from "@/components/GalleryRoomScene";
import { GalleryMinigameScene } from "@/components/GalleryMinigameScene";
import { FlowerGardenScene } from "@/components/FlowerGardenScene";
import { FlowerNarrative } from "@/components/FlowerNarrative";
import { FlowerMinigameScene } from "@/components/FlowerMinigameScene";
import { FlowerGardenPart2Scene } from "@/components/FlowerGardenPart2Scene";
import { StatueRoomScene } from "@/components/StatueRoomScene";
import { StatueMinigameScene } from "@/components/StatueMinigameScene";
import { StatueEndingScene } from "@/components/StatueEndingScene";
import { CubitScene } from "@/components/CubitScene";
import { StayScene } from "@/components/StayScene";
import { SurpriseScene } from "@/components/SurpriseScene";
import { StayNarrative } from "@/components/StayNarrative";
import { GiveFlowerScene } from "@/components/GiveFlowerScene";
import { HugScene } from "@/components/HugScene";
import { ChapterSelect } from "@/components/ChapterSelect";
import {
  isSoundEnabled,
  setSoundEnabledStorage,
  isMusicEnabled,
  playBGM,
  pauseBGM,
  toggleBGM,
  BGM_VOLUME_NORMAL,
  BGM_VOLUME_LOW,
} from "@/lib/audioManager";
import { useAssetPreloader } from "@/lib/useAssetPreloader";
import { ResourcePreloaderModal } from "@/components/ResourcePreloaderModal";

type ViewType = "menu" | "prologue" | "ticket" | "sneakNarrative" | "gallery" | "galleryRoom" | "cubit" | "galleryRoomPart2" | "galleryMinigame" | "flowerGarden" | "flowerNarrative" | "flowerMinigame" | "flowerGardenPart2" | "statueRoom" | "statueMinigame" | "statueEnding" | "stay" | "surprise" | "stayNarrative" | "giveFlower" | "hug" | "chapterSelect" | "settings";

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>("menu");
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [musicEnabled, setMusicEnabledState] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingTargetView, setPendingTargetView] = useState<ViewType | null>(null);
  const [showPreloaderModal, setShowPreloaderModal] = useState(false);

  const preloader = useAssetPreloader();

  useEffect(() => {
    setSoundEnabledState(isSoundEnabled());
    setMusicEnabledState(isMusicEnabled());
  }, []);

  useEffect(() => {
    if (!musicEnabled) {
      pauseBGM();
      return;
    }

    const starsNormalViews = ["menu", "chapterSelect", "settings"];
    const starsLowViews = ["prologue", "ticket"];

    const ollgLowViews = [
      "sneakNarrative",
      "gallery",
      "galleryRoom",
      "galleryRoomPart2",
      "flowerGarden",
      "flowerGardenPart2",
      "statueRoom",
      "statueEnding",
    ];

    const ollgNormalViews = [
      "cubit",
      "galleryMinigame",
      "flowerNarrative",
      "flowerMinigame",
      "statueMinigame",
      "stay",
      "stayNarrative",
      "giveFlower",
      "hug",
    ];

    if (starsNormalViews.includes(currentView)) {
      playBGM("/audio/bgm/stars.mp3", BGM_VOLUME_NORMAL);
    } else if (starsLowViews.includes(currentView)) {
      playBGM("/audio/bgm/stars.mp3", BGM_VOLUME_LOW);
    } else if (ollgLowViews.includes(currentView)) {
      playBGM("/audio/bgm/ollg.mp3", BGM_VOLUME_LOW);
    } else if (ollgNormalViews.includes(currentView)) {
      playBGM("/audio/bgm/ollg.mp3", BGM_VOLUME_NORMAL);
    } else if (currentView === "surprise") {
      playBGM("/audio/bgm/ollg.mp3", BGM_VOLUME_LOW);
    } else {
      playBGM("/audio/bgm/stars.mp3", BGM_VOLUME_NORMAL);
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

  useEffect(() => {
    if (preloader.isComplete && pendingTargetView) {
      setShowPreloaderModal(false);
      const target = pendingTargetView;
      setPendingTargetView(null);
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentView(target);
        setIsTransitioning(false);
      }, 1000);
    }
  }, [preloader.isComplete, pendingTargetView]);

  const transitionToView = (targetView: ViewType) => {
    if (!preloader.isComplete) {
      setPendingTargetView(targetView);
      setShowPreloaderModal(true);
      return;
    }
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(targetView);
      setIsTransitioning(false);
    }, 1000);
  };

  const handleStartTour = () => {
    transitionToView("prologue");
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
          className={`pointer-events-none absolute inset-0 z-[60] bg-black transition-opacity duration-1000 ${isTransitioning ? "opacity-100" : "opacity-0"
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
            onNextScene={() => setCurrentView("galleryRoom")}
          />
        ) : currentView === "galleryRoom" ? (
          <GalleryRoomScene
            startLineIndex={0}
            onBackToMenu={() => setCurrentView("menu")}
            onTriggerCubit={() => setCurrentView("cubit")}
          />
        ) : currentView === "cubit" ? (
          <CubitScene
            onNextScene={() => setCurrentView("galleryRoomPart2")}
          />
        ) : currentView === "galleryRoomPart2" ? (
          <GalleryRoomScene
            startLineIndex={8}
            onBackToMenu={() => setCurrentView("menu")}
            onNextScene={() => setCurrentView("galleryMinigame")}
          />
        ) : currentView === "galleryMinigame" ? (
          <GalleryMinigameScene
            onBackToMenu={() => setCurrentView("menu")}
            onNextScene={() => setCurrentView("flowerGarden")}
          />
        ) : currentView === "flowerGarden" ? (
          <FlowerGardenScene
            onBackToMenu={() => setCurrentView("menu")}
            onNextScene={() => setCurrentView("flowerNarrative")}
          />
        ) : currentView === "flowerNarrative" ? (
          <FlowerNarrative
            onBackToMenu={() => setCurrentView("menu")}
            onNextScene={() => setCurrentView("flowerMinigame")}
          />
        ) : currentView === "flowerMinigame" ? (
          <FlowerMinigameScene
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
            onNextScene={() => setCurrentView("statueEnding")}
          />
        ) : currentView === "statueEnding" ? (
          <StatueEndingScene
            onBackToMenu={() => setCurrentView("menu")}
            onNextScene={() => setCurrentView("stay")}
          />
        ) : currentView === "stay" ? (
          <StayScene
            onBackToMenu={() => setCurrentView("menu")}
            onNextScene={() => setCurrentView("surprise")}
          />
        ) : currentView === "surprise" ? (
          <SurpriseScene
            onBackToMenu={() => setCurrentView("menu")}
            onNextScene={() => setCurrentView("stayNarrative")}
          />
        ) : currentView === "stayNarrative" ? (
          <StayNarrative
            onBackToMenu={() => setCurrentView("menu")}
            onNextScene={() => setCurrentView("giveFlower")}
          />
        ) : currentView === "giveFlower" ? (
          <GiveFlowerScene
            onBackToMenu={() => setCurrentView("menu")}
            onNextScene={() => setCurrentView("hug")}
          />
        ) : currentView === "hug" ? (
          <HugScene
            onBackToMenu={() => setCurrentView("menu")}
            onNextScene={() => setCurrentView("menu")}
          />
        ) : (
          <>
            <img
              src="/asset/gedung.png"
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
                  onSelectChapter={(ch) => transitionToView(ch)}
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

      {showPreloaderModal && (
        <ResourcePreloaderModal
          loadedCount={preloader.loadedCount}
          totalCount={preloader.totalCount}
          progressPercentage={preloader.progressPercentage}
        />
      )}
    </div>
  );
}
