"use client";

import { useState, useEffect } from "react";
import { Home as HomeIcon, Trash } from "@pxlkit/ui";
import { playButtonSound, playPopSound } from "@/lib/audioManager";
import { PxlIcon, PxlKitIconData } from "@/components/PxlIcon";

interface FlowerArrangingSceneProps {
  onBackToMenu: () => void;
}

interface FlowerItem {
  id: string;
  name: string;
  boxImage: string;
  flowerImage: string;
}

const row1Flowers: FlowerItem[] = [
  { id: "mawar_merah", name: "Mawar Merah", boxImage: "/flower/kotak_mawar_merah.PNG", flowerImage: "/flower/mawar_merah.PNG" },
  { id: "mawar_pink", name: "Mawar Pink", boxImage: "/flower/kotak_mawar_pink.PNG", flowerImage: "/flower/mawar_pink.PNG" },
  { id: "mawar_putih", name: "Mawar Putih", boxImage: "/flower/kotak_mawar_putih.PNG", flowerImage: "/flower/mawar_putih.PNG" },
  { id: "sunflower", name: "Bunga Matahari", boxImage: "/flower/kotak_sunflower.PNG", flowerImage: "/flower/sunflower.PNG" },
];

const row2Flowers: FlowerItem[] = [
  { id: "tulip_kuning", name: "Tulip Kuning", boxImage: "/flower/kotak_tulip_kuning.PNG", flowerImage: "/flower/tulip_kuning.PNG" },
  { id: "tulip_pink", name: "Tulip Pink", boxImage: "/flower/kotak_tulip_pink.PNG", flowerImage: "/flower/tulip_pink.PNG" },
  { id: "tulip_putih", name: "Tulip Putih", boxImage: "/flower/kotak_tulip_putih.PNG", flowerImage: "/flower/tulip_putih.PNG" },
  { id: "tulip_ungu", name: "Tulip Ungu", boxImage: "/flower/kotak_tulip_ungu.PNG", flowerImage: "/flower/tulip_ungu.PNG" },
];

const row3Flowers: FlowerItem[] = [
  { id: "dahlia_pink", name: "Dahlia Pink", boxImage: "/flower/kotak_dahlia_pink.PNG", flowerImage: "/flower/dahlia_pink.PNG" },
  { id: "dahlia_putih", name: "Dahlia Putih", boxImage: "/flower/kotak_dahlia_putih.PNG", flowerImage: "/flower/dahlia_putih.PNG" },
  { id: "dahlia_ungu", name: "Dahlia Ungu", boxImage: "/flower/kotak_dahlia_ungu.PNG", flowerImage: "/flower/dahlia_ungu.PNG" },
];

const row4Lavender: FlowerItem = {
  id: "lavender", name: "Lavender", boxImage: "/flower/kotak_lavender.PNG", flowerImage: "/flower/lavender.PNG"
};

export function FlowerArrangingScene({
  onBackToMenu,
}: FlowerArrangingSceneProps) {
  const [isEntering, setIsEntering] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [slots, setSlots] = useState<(FlowerItem | null)[]>([null, null, null]);
  const [draggedFlower, setDraggedFlower] = useState<FlowerItem | null>(null);
  const [touchDrag, setTouchDrag] = useState<{
    flower: FlowerItem;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEntering(false);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const handleBackToMenu = () => {
    playButtonSound();
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onBackToMenu();
    }, 400);
  };

  const handleSelectFlower = (flower: FlowerItem) => {
    playPopSound();
    setSlots((prevSlots) => {
      const emptyIndex = prevSlots.findIndex((s) => s === null);
      if (emptyIndex !== -1) {
        const next = [...prevSlots];
        next[emptyIndex] = flower;
        return next;
      }
      const next = [...prevSlots];
      next[2] = flower;
      return next;
    });
  };

  const handleRemoveSlot = (index: number) => {
    playButtonSound();
    setSlots((prevSlots) => {
      const next = [...prevSlots];
      next[index] = null;
      return next;
    });
  };

  const allFlowers = [...row1Flowers, ...row2Flowers, ...row3Flowers, row4Lavender];

  const handleDragStart = (e: React.DragEvent, flower: FlowerItem) => {
    setDraggedFlower(flower);
    e.dataTransfer.setData("text/plain", JSON.stringify(flower));
    e.dataTransfer.effectAllowed = "copy";

    const ghostEl = document.getElementById(`drag-ghost-${flower.id}`) as HTMLImageElement;
    if (ghostEl) {
      e.dataTransfer.setDragImage(ghostEl, 28, 28);
    }
  };

  const handleDropOnSlot = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    let flowerToPlace = draggedFlower;
    if (data) {
      try {
        flowerToPlace = JSON.parse(data);
      } catch (_) {}
    }
    if (flowerToPlace) {
      playPopSound();
      setSlots((prevSlots) => {
        const next = [...prevSlots];
        next[index] = flowerToPlace;
        return next;
      });
    }
    setDraggedFlower(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleTouchStart = (flower: FlowerItem, e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    setTouchDrag({
      flower,
      x: touch.clientX,
      y: touch.clientY,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchDrag) return;
    const touch = e.touches[0];
    if (!touch) return;
    setTouchDrag({
      ...touchDrag,
      x: touch.clientX,
      y: touch.clientY,
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchDrag) return;
    const touch = e.changedTouches[0];
    if (touch) {
      const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
      if (targetElement) {
        const slotElement = targetElement.closest("[data-slot-index]");
        if (slotElement) {
          const slotIdxAttr = slotElement.getAttribute("data-slot-index");
          if (slotIdxAttr !== null) {
            const slotIdx = parseInt(slotIdxAttr, 10);
            playPopSound();
            setSlots((prevSlots) => {
              const next = [...prevSlots];
              next[slotIdx] = touchDrag.flower;
              return next;
            });
          }
        }
      }
    }
    setTouchDrag(null);
  };

  return (
    <div
      className="relative h-full w-full flex flex-col justify-between overflow-hidden select-none bg-[#2d2d2d]"
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {touchDrag && (
        <div
          className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center"
          style={{ left: `${touchDrag.x}px`, top: `${touchDrag.y}px` }}
        >
          <img
            src={touchDrag.flower.flowerImage}
            alt={touchDrag.flower.name}
            className="w-full h-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
            style={{ imageRendering: "pixelated" }}
          />
        </div>
      )}

      <div className="hidden pointer-events-none absolute -top-[999px] -left-[999px]" aria-hidden="true">
        {allFlowers.map((f) => (
          <img
            key={`ghost-${f.id}`}
            id={`drag-ghost-${f.id}`}
            src={f.flowerImage}
            alt={f.name}
            className="w-14 h-14"
            style={{ imageRendering: "pixelated" }}
          />
        ))}
      </div>

      <div
        className={`pointer-events-none absolute inset-0 z-[70] bg-black transition-opacity duration-400 ${
          isEntering || isExiting ? "opacity-100" : "opacity-0"
        }`}
      />

      <img
        src="/asset/garden.png"
        alt="Garden Background"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="pointer-events-none absolute inset-0 bg-black/25" />

      <div className="relative z-30 flex items-center justify-between p-3 sm:p-4">
        <button
          onClick={handleBackToMenu}
          className="flex items-center gap-1.5 border-2 border-[#2d2d2d] bg-[#ffffba] px-3 py-1.5 text-[9px] font-bold text-[#2d2d2d] shadow-[2px_2px_0px_0px_#2d2d2d] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
        >
          <PxlIcon icon={HomeIcon as unknown as PxlKitIconData} className="h-3.5 w-3.5" />
          <span>MENU</span>
        </button>

        <div className="border-2 border-[#2d2d2d] bg-[#ffb3ba] px-3 py-1 text-[8px] sm:text-[9px] font-bold text-[#2d2d2d] shadow-[2px_2px_0px_0px_#2d2d2d]">
          TAMAN BUNGA
        </div>
      </div>

      <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-2 py-1 overflow-visible">
        <div className="relative w-full max-w-sm flex flex-col my-auto translate-y-24 sm:translate-y-28">
          
          <div className="absolute -top-46 sm:-top-36 left-0 right-0 z-10 flex items-end justify-center pointer-events-none">
            <div className="relative w-20 sm:w-16">
              <img
                src="/char/aii/aii.PNG"
                alt="AII"
                className="w-full h-auto object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)]"
                style={{ imageRendering: "pixelated" }}
              />
            </div>

            <div className="relative w-21 sm:w-17 -ml-5 sm:-ml-4">
              <img
                src="/char/kibo/kibo.PNG"
                alt="KIBO"
                className="w-full h-auto object-contain scale-105 origin-bottom drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)]"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
          </div>

          <div className="relative z-20 flex flex-col gap-1.5 sm:gap-2">
            <div className="grid grid-cols-4 gap-1 sm:gap-1.5 px-1">
              {row1Flowers.map((flower) => (
                <div
                  key={flower.id}
                  onClick={() => handleSelectFlower(flower)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, flower)}
                  onTouchStart={(e) => handleTouchStart(flower, e)}
                  className="relative flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-105 transition-transform touch-none"
                >
                  <img
                    src={flower.boxImage}
                    alt={flower.name}
                    className="w-full h-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-1 sm:gap-1.5 px-1">
              {row2Flowers.map((flower) => (
                <div
                  key={flower.id}
                  onClick={() => handleSelectFlower(flower)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, flower)}
                  onTouchStart={(e) => handleTouchStart(flower, e)}
                  className="relative flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-105 transition-transform touch-none"
                >
                  <img
                    src={flower.boxImage}
                    alt={flower.name}
                    className="w-full h-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 px-5 sm:px-6">
              {row3Flowers.map((flower) => (
                <div
                  key={flower.id}
                  onClick={() => handleSelectFlower(flower)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, flower)}
                  onTouchStart={(e) => handleTouchStart(flower, e)}
                  className="relative flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-105 transition-transform touch-none"
                >
                  <img
                    src={flower.boxImage}
                    alt={flower.name}
                    className="w-full h-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-center px-4 sm:px-6">
              <div
                onClick={() => handleSelectFlower(row4Lavender)}
                draggable
                onDragStart={(e) => handleDragStart(e, row4Lavender)}
                onTouchStart={(e) => handleTouchStart(row4Lavender, e)}
                className="relative w-full max-w-[260px] sm:max-w-[280px] flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-102 transition-transform touch-none"
              >
                <img
                  src={row4Lavender.boxImage}
                  alt={row4Lavender.name}
                  className="w-full h-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="relative z-40 w-full px-3 pb-3 flex flex-col items-center">
        <div className="flex items-center justify-center gap-3.5 sm:gap-4 w-full py-1">
          {slots.map((slotItem, idx) => (
            <div
              key={`slot-${idx}`}
              data-slot-index={idx}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropOnSlot(e, idx)}
              className={`relative w-15 h-15 sm:w-18 sm:h-18 border-3 border-[#2d2d2d] bg-[#faf7f2]/95 shadow-[3px_3px_0px_0px_#2d2d2d] backdrop-blur-xs flex items-center justify-center transition-all ${
                slotItem ? "ring-2 ring-[#ffb3ba]" : ""
              }`}
            >
              {slotItem ? (
                <div className="relative w-full h-full p-1.5 flex items-center justify-center pointer-events-none">
                  <img
                    src={slotItem.flowerImage}
                    alt={slotItem.name}
                    className="max-h-full max-w-full object-contain drop-shadow-[0_2px_3px_rgba(0,0,0,0.2)]"
                    style={{ imageRendering: "pixelated" }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSlot(idx);
                    }}
                    className="pointer-events-auto absolute -top-2 -right-2 w-4.5 h-4.5 bg-[#ff4d4d] border-2 border-[#2d2d2d] text-white flex items-center justify-center rounded-none shadow-[1px_1px_0px_0px_#2d2d2d] hover:scale-110"
                  >
                    <PxlIcon icon={Trash as unknown as PxlKitIconData} className="h-2.5 w-2.5 text-white" />
                  </button>
                </div>
              ) : (
                <span className="font-press-start text-[11px] font-bold text-[#2d2d2d]/30 pointer-events-none">
                  {idx + 1}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
