"use client";

import { Home as HomeIcon } from "@pxlkit/ui";
import { Button } from "@/components/ui/pixelact-ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/pixelact-ui/card";
import { PxlIcon, PxlKitIconData } from "@/components/PxlIcon";

interface SettingsProps {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  musicEnabled: boolean;
  setMusicEnabled: (enabled: boolean) => void;
  onBackToMenu: () => void;
}

export function Settings({
  soundEnabled,
  setSoundEnabled,
  musicEnabled,
  setMusicEnabled,
  onBackToMenu,
}: SettingsProps) {
  return (
    <Card font="pixel" className="border-3 border-pxl-dark bg-white/95 text-pxl-dark p-2.5 shadow-[6px_6px_0px_0px_#2d2d2d] backdrop-blur-sm">
      <CardHeader className="text-center p-2">
        <CardTitle className="font-press-start text-sm text-pxl-dark pt-1">
          PENGATURAN
        </CardTitle>
      </CardHeader>

      <CardContent className="mt-2 space-y-2.5 px-1 pb-2">
        <div className="flex items-center justify-between border-2 border-pxl-dark bg-[#fdfbf7] p-2">
          <p className="font-press-start text-[10px] text-pxl-dark">EFEK SUARA</p>
          <Button
            size="sm"
            variant={soundEnabled ? "mint" : "destructive"}
            className="h-7 px-2.5"
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? "ON" : "OFF"}
          </Button>
        </div>

        <div className="flex items-center justify-between border-2 border-pxl-dark bg-[#fdfbf7] p-2">
          <p className="font-press-start text-[10px] text-pxl-dark">MUSIK LATAR</p>
          <Button
            size="sm"
            variant={musicEnabled ? "mint" : "destructive"}
            className="h-7 px-2.5"
            onClick={() => setMusicEnabled(!musicEnabled)}
          >
            {musicEnabled ? "ON" : "OFF"}
          </Button>
        </div>

        <div className="pt-2">
          <Button
            variant="yellow"
            className="group w-full h-9 text-[10px]"
            onClick={onBackToMenu}
          >
            <PxlIcon icon={HomeIcon as unknown as PxlKitIconData} className="h-3.5 w-3.5 transition-transform group-hover:scale-125" />
            <span>BALIK KE MENU</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
