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
import { playButtonSound } from "@/lib/audioManager";

interface ChapterSelectProps {
  onSelectChapter: (chapter: "ticket" | "gallery" | "paintingRoom") => void;
  onBackToMenu: () => void;
}

export function ChapterSelect({
  onSelectChapter,
  onBackToMenu,
}: ChapterSelectProps) {
  const chapters = [
    {
      id: "ticket" as const,
      number: "CHAPTER 1",
      title: "LOKET TIKET",
      subtitle: "Pertemuan di depan loket tiket",
      bgClass: "bg-[#bae1ff]",
      borderClass: "border-[#2d2d2d]",
    },
    {
      id: "gallery" as const,
      number: "CHAPTER 2",
      title: "LORONG GALLERY",
      subtitle: "Menyusup masuk lewat lorong",
      bgClass: "bg-[#baffc9]",
      borderClass: "border-[#2d2d2d]",
    },
    {
      id: "paintingRoom" as const,
      number: "CHAPTER 3",
      title: "RUANG GALLERY",
      subtitle: "Melihat lukisan yang tertutup kain",
      bgClass: "bg-[#ffd166]",
      borderClass: "border-[#2d2d2d]",
    },
  ];

  return (
    <Card font="pixel" className="w-full border-3 border-[#2d2d2d] bg-white/95 text-[#2d2d2d] p-2.5 shadow-[6px_6px_0px_0px_#2d2d2d] backdrop-blur-sm">
      <CardHeader className="text-center p-2 pb-1">
        <CardTitle className="font-press-start text-xs sm:text-sm text-[#2d2d2d] pt-1">
          PILIH CHAPTER
        </CardTitle>
      </CardHeader>

      <CardContent className="mt-2 space-y-2.5 px-1 pb-2">
        {chapters.map((ch) => (
          <div
            key={ch.id}
            onClick={() => {
              playButtonSound();
              onSelectChapter(ch.id);
            }}
            className={`group cursor-pointer border-3 ${ch.borderClass} ${ch.bgClass} p-2.5 shadow-[3px_3px_0px_0px_#2d2d2d] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#2d2d2d] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#2d2d2d] transition-all`}
          >
            <div className="flex items-center justify-between">
              <span className="font-press-start text-[8px] font-bold text-[#2d2d2d]/70">
                {ch.number}
              </span>
            </div>
            <h4 className="font-press-start text-[10px] sm:text-[11px] font-bold text-[#2d2d2d] mt-1 group-hover:text-black">
              {ch.title}
            </h4>
            <p className="font-press-start text-[7.5px] sm:text-[8px] text-[#2d2d2d]/80 mt-0.5">
              {ch.subtitle}
            </p>
          </div>
        ))}

        <div className="pt-2">
          <Button
            variant="purple"
            className="group w-full h-9 text-[9px] sm:text-[10px] border-2 border-[#2d2d2d] shadow-[3px_3px_0px_0px_#2d2d2d]"
            onClick={() => {
              playButtonSound();
              onBackToMenu();
            }}
          >
            <PxlIcon icon={HomeIcon as unknown as PxlKitIconData} className="h-3.5 w-3.5 transition-transform group-hover:scale-125" />
            <span>KEMBALI KE MENU</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
