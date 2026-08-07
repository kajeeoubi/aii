"use client";

import { useEffect, useState } from "react";
import { Megaphone } from "@pxlkit/feedback";
import { PxlIcon, PxlKitIconData } from "@/components/PxlIcon";

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [isEntering, setIsEntering] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const enterTimer = setTimeout(() => {
      setIsEntering(false);
    }, 500);

    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onFinish();
      }, 1200);
    }, 4500);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
    };
  }, [onFinish]);

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center select-none overflow-hidden bg-[#faf7f2] font-press-start p-6 text-center">
      <div
        className={`pointer-events-none absolute inset-0 z-[70] bg-black transition-opacity duration-1000 ${
          isEntering || isExiting ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="relative z-20 flex flex-col items-center justify-center space-y-6 max-w-xs mx-auto animate-fadeIn">
        <div className="inline-flex items-center gap-2 border-3 border-[#2d2d2d] bg-[#ffb3ba] px-4 py-1.5 text-xs font-bold text-[#2d2d2d] shadow-[4px_4px_0px_0px_#2d2d2d]">
          <span>TIPS</span>
        </div>

        <div className="py-2">
          <PxlIcon
            icon={Megaphone as unknown as PxlKitIconData}
            className="h-10 w-10 text-[#2d2d2d]"
          />
        </div>

        <p className="text-[10px] sm:text-xs leading-relaxed text-[#2d2d2d] font-bold">
          Gunakan headset untuk pengalaman terbaik selama bermain.
        </p>
      </div>
    </div>
  );
}
