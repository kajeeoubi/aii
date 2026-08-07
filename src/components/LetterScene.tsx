"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Home as HomeIcon } from "@pxlkit/ui";
import { Button } from "@/components/ui/pixelact-ui/button";
import { playButtonSound, playPopSound, pauseBGM, resumeBGM } from "@/lib/audioManager";
import { PxlIcon, PxlKitIconData } from "@/components/PxlIcon";

interface LetterSceneProps {
  onBackToMenu: () => void;
  onNextScene?: () => void;
}

const letterPart1 = `I miss you so much, Ai.

Andai aja aku masih dikasih satu kesempatan itu, I swear I do everything differently. Aku bakal memperbaiki semuanya.

Aku minta maaf atas sikapku yang selama ini bikin kamu capek. Aku sadar banyak hal yang aku lakuin lahir dari rasa takut kehilangan kamu. I know that's not an excuse, and I know it was my mistake.

Sekarang aku bahkan udah nggak tahu harus ngelakuin apa lagi supaya kamu bisa percaya dan tetap tinggal. Yang aku harapin cuma satu, semoga kita bisa belajar dari semua kesalahan yang pernah terjadi, bukan malah berakhir karena itu.

Aku tahu ke depannya masalah yang bakal kita hadapi mungkin jauh lebih berat. Kalau aku nggak dapet kepercayaan dari mereka, then who else should believe in me if not you?

Semangat terbesar aku buat memperjuangin semuanya itu ya kamu.

Aku tahu ini mungkin terdengar egois, but I'm asking you just one more time... please, percaya sama aku sekali lagi.

Kalau kamu pikir aku baik-baik aja setelah semuanya selesai, sebenarnya enggak.

I'm really not okay.

Aku bener-bener down setelah semuanya berakhir secepat itu. Rasanya masih banyak harapan yang belum sempat kita wujudkan, masih banyak rasa sayang yang belum sempat aku tunjukin ke kamu.

Aku masih inget semua wishlist dan waiting list yang dulu aku simpan buat kita.
Tempat-tempat yang pengen aku datengin bareng kamu.
Makanan yang pengen aku coba sama kamu.
Foto-foto yang pengen aku ambil bareng kamu.
Film-film yang pengen aku tonton sama kamu.
Semuanya masih aku simpan rapi sampai sekarang. Tapi orang yang seharusnya ada di sampingku buat mewujudkan semuanya... udah nggak ada lagi.

Aku udah tau scene ini pasti bakal keluar, aku ga kebayang bisa kuat menahan rasa sakitnya pas kamu disana.. karena aku juga merasakan hal yang sama, makanya aku memilih untuk gajadi ngajak kamu.`;

const letterPart2 = `Sampai hari ini pun, aku masih sering keinget kamu lewat lagu-lagu.
Setiap denger lagu itu, aku selalu keinget betapa sempurnanya kamu di mataku. Betapa beruntungnya dulu aku pernah punya seseorang kayak kamu.
But at the same time, lagu-lagu itu juga selalu ngingetin kalau sekarang kamu udah pergi.

Sekarang aku lagi berusaha melakukan apa yang dulu kamu bilang.
Aku berusaha fokus sama diriku sendiri.
Aku belajar buat lebih sayang sama diri sendiri.
Belajar memperbaiki diri.
Belajar jadi versi yang lebih baik setiap harinya.
And I'm trying... really trying.

Tapi kadang-kadang aku masih ngerasa ada lubang besar yang belum bisa aku isi.
Lubang karena kehilangan seseorang yang dulu bikin aku bahagia, yang selalu jadi semangatku, dan yang tanpa sadar bikin aku ingin jadi pribadi yang lebih baik.

Maybe in another life...

Aku berharap kita dipertemukan lagi dalam versi terbaik kita masing-masing. Tanpa rasa takut, tanpa ego, tanpa kesalahan yang sama.

Dan kalau hari itu benar-benar ada...

Aku cuma pengen bilang satu hal.

I still love you, Ai.`;

export function LetterScene({ onBackToMenu, onNextScene }: LetterSceneProps) {
  const [isEntering, setIsEntering] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  // Animation states
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isLetterExtracted, setIsLetterExtracted] = useState(false);
  const [isLetterFocused, setIsLetterFocused] = useState(false);

  useEffect(() => {
    const enterTimer = setTimeout(() => {
      setIsEntering(false);
    }, 1500);

    return () => clearTimeout(enterTimer);
  }, []);

  const handleOpenEnvelope = () => {
    if (isEnvelopeOpen) return;
    playButtonSound();

    setIsEnvelopeOpen(true);

    setTimeout(() => {
      setIsLetterExtracted(true);
      playPopSound();
    }, 600);

    setTimeout(() => {
      setIsLetterFocused(true);
    }, 1400);
  };

  const handleFinish = (e?: React.MouseEvent) => {
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
    }, 2000);
  };

  return (
    <div className="relative h-full w-full flex flex-col justify-between overflow-hidden select-none bg-[#faf7f2] font-press-start">
      <div
        className={`pointer-events-none absolute inset-0 z-[70] bg-black transition-opacity duration-2000 ${
          isEntering || isExiting ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="relative z-20 flex-1 flex flex-col items-center justify-center p-4">
        {isLetterFocused ? (
          <div className="absolute inset-0 z-50 flex flex-col justify-between bg-white p-5 sm:p-6 text-left select-none overflow-y-auto animate-fadeIn">
            <div className="w-full max-w-md mx-auto pt-2 pb-16 space-y-4">
              <p className="font-press-start text-[9.5px] sm:text-[10.5px] leading-relaxed text-[#2d2d2d] whitespace-pre-line">
                {letterPart1}
              </p>

              <div className="my-4 w-full aspect-square border-4 border-[#2d2d2d] bg-black shadow-[4px_4px_0px_0px_#2d2d2d] rounded-sm overflow-hidden flex items-center justify-center">
                <video
                  src="/video/video.mp4"
                  controls
                  playsInline
                  onPlay={() => pauseBGM()}
                  onPause={() => resumeBGM()}
                  onEnded={() => resumeBGM()}
                  className="w-full h-full object-cover"
                >
                  <source src="/video/video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              <p className="font-press-start text-[9.5px] sm:text-[10.5px] leading-relaxed text-[#2d2d2d] whitespace-pre-line">
                {letterPart2}
              </p>
            </div>

            <div className="sticky bottom-0 left-0 right-0 z-[60] w-full pt-3 pb-2 bg-transparent flex justify-center shrink-0">
              <Button
                variant="yellow"
                onClick={handleFinish}
                className="w-full max-w-xs group h-9 sm:h-10 text-[9px] sm:text-[10px] flex items-center justify-center gap-2 border-2 border-[#2d2d2d] shadow-[3px_3px_0px_0px_#2d2d2d] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer"
              >
                <span>KEMBALI KE MENU</span>
                <PxlIcon
                  icon={ArrowRight as unknown as PxlKitIconData}
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                />
              </Button>
            </div>
          </div>
        ) : (
          <div
            onClick={handleOpenEnvelope}
            className={`relative flex flex-col items-center justify-center transition-all duration-700 ${
              !isEnvelopeOpen ? "cursor-pointer hover:scale-105" : ""
            }`}
          >
            <div className="relative w-[280px] sm:w-[320px] h-[170px] sm:h-[190px] shadow-[6px_6px_0px_0px_#2d2d2d] border-4 border-[#2d2d2d] bg-[#e3cdb9] rounded-sm overflow-visible">
              <div className="absolute inset-0 bg-[#d8beaa]" />

              <div
                className={`absolute left-1/2 -translate-x-1/2 transition-all duration-800 ease-out border-4 border-[#2d2d2d] bg-white p-4 shadow-[3px_3px_0px_0px_#2d2d2d] rounded-sm w-[220px] sm:w-[250px] ${
                  isLetterExtracted
                    ? "-translate-y-36 sm:-translate-y-40 opacity-100 scale-95 z-50"
                    : "top-4 opacity-0 scale-90 z-15"
                }`}
              >
                <div className="min-h-[130px] flex flex-col justify-between">
                  <p className="text-[8.5px] sm:text-[9px] leading-relaxed text-[#2d2d2d] whitespace-pre-line text-left">
                    {letterPart1}
                  </p>
                </div>
              </div>

              <svg
                viewBox="0 0 320 190"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full z-20 pointer-events-none"
              >
                <polygon points="0,0 145,95 0,190" fill="#d9c1ab" stroke="#2d2d2d" strokeWidth="4" strokeLinejoin="round" />
                <polygon points="320,0 175,95 320,190" fill="#d9c1ab" stroke="#2d2d2d" strokeWidth="4" strokeLinejoin="round" />
                <polygon points="0,190 160,85 320,190" fill="#eddcd0" stroke="#2d2d2d" strokeWidth="4" strokeLinejoin="round" />
              </svg>

              <div
                className={`absolute top-0 left-0 right-0 h-[105px] origin-top transition-transform duration-700 z-30 ${
                  isEnvelopeOpen ? "[transform:rotateX(180deg)]" : ""
                }`}
              >
                <svg
                  viewBox="0 0 320 105"
                  preserveAspectRatio="none"
                  className="w-full h-full"
                >
                  <polygon
                    points="0,0 160,105 320,0"
                    fill={isEnvelopeOpen ? "#cbb199" : "#e5d1be"}
                    stroke="#2d2d2d"
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
