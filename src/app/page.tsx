"use client";

import { useEffect, useState } from "react";
import { Play, Gear } from "@pxlkit/ui";
import { Button } from "@/components/ui/pixelact-ui/button";
import { PxlIcon, PxlKitIconData } from "@/components/PxlIcon";
import { Prologue } from "@/components/Prologue";
import { TicketScene } from "@/components/TicketScene";
import { Settings } from "@/components/Settings";
import {
  isSoundEnabled,
  setSoundEnabledStorage,
  isMusicEnabled,
  setMusicEnabledStorage,
} from "@/lib/audioManager";

export default function Home() {
  const [currentView, setCurrentView] = useState<"menu" | "prologue" | "ticket" | "settings">("menu");
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [musicEnabled, setMusicEnabledState] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setSoundEnabledState(isSoundEnabled());
    setMusicEnabledState(isMusicEnabled());
  }, []);

  const handleSetSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    setSoundEnabledStorage(enabled);
  };

  const handleSetMusicEnabled = (enabled: boolean) => {
    setMusicEnabledState(enabled);
    setMusicEnabledStorage(enabled);
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

      <div className={`relative z-10 flex h-full max-h-screen max-h-[100dvh] w-full max-w-md flex-col items-center justify-between overflow-hidden border-x-4 border-[#2d2d2d] bg-[#8cd0f5] shadow-[0_0_20px_rgba(0,0,0,0.08)] ${currentView === "menu" ? "pb-6" : ""}`}>
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
          />
        ) : (
          <>
            <img
              src="/asset/gedung.PNG"
              alt="Building Background"
              className="pointer-events-none absolute bottom-0 left-0 w-full object-cover object-bottom"
            />

            <div className="relative z-10 mt-20 sm:mt-8 flex flex-col items-center w-full px-4">
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

              <p className="mt-14 sm:mt-10 w-full max-w-[300px] sm:max-w-[320px] text-center font-press-start text-[9px] sm:text-[10px] leading-relaxed text-[#2d2d2d]">
                Maaf aku telat ngasihnya.. but i made this special for u! hopefully u like it :D
              </p>
            </div>

            <div className="relative z-20 w-full max-w-[280px] px-2 mt-auto">
              {currentView === "menu" && (
                <div className="flex flex-col gap-3.5">
                  <Button
                    variant="mint"
                    size="lg"
                    onClick={handleStartTour}
                    className="group relative flex h-12 w-full items-center justify-center gap-3"
                  >
                    <PxlIcon icon={Play as unknown as PxlKitIconData} className="h-5 w-5 transition-transform duration-200 group-hover:scale-125 group-hover:rotate-12" />
                    <span>MULAI TOUR!</span>
                  </Button>

                  <Button
                    variant="purple"
                    size="lg"
                    onClick={() => setCurrentView("settings")}
                    className="group relative flex h-12 w-full items-center justify-center gap-3"
                  >
                    <PxlIcon icon={Gear as unknown as PxlKitIconData} className="h-5 w-5 transition-transform duration-500 group-hover:rotate-180" />
                    <span>PENGATURAN</span>
                  </Button>
                </div>
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
