"use client";

import { useState, useEffect, useRef } from "react";
import { Home as HomeIcon } from "@pxlkit/ui";
import { ChatBubble } from "@pxlkit/social";
import { Button } from "@/components/ui/pixelact-ui/button";
import { PxlIcon, PxlKitIconData } from "@/components/PxlIcon";
import { playButtonSound, playPopSound } from "@/lib/audioManager";

interface DiaryBookProps {
  onBackToMenu: () => void;
}

interface PageData {
  title: string;
  text: string;
  date: string;
}

const TOTAL_PAGES = 2;

const DEFAULT_INITIAL_PAGES: PageData[] = Array(TOTAL_PAGES)
  .fill(null)
  .map(() => ({
    title: "",
    date: "",
    text: "",
  }));

export function DiaryBook({ onBackToMenu }: DiaryBookProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState<PageData[]>(DEFAULT_INITIAL_PAGES);
  const [slideAnim, setSlideAnim] = useState<"slide-left" | "slide-right" | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  // Swipe gesture tracking
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    async function loadDiary() {
      try {
        const res = await fetch("/api/diary");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const loadedPages: PageData[] = [...DEFAULT_INITIAL_PAGES];
          json.data.forEach((item: { pageIndex: number; title: string; text: string; date: string }) => {
            if (item.pageIndex < TOTAL_PAGES) {
              loadedPages[item.pageIndex] = {
                title: item.title || "",
                text: item.text || "",
                date: item.date || "",
              };
            }
          });
          setPages(loadedPages);
          return;
        }
      } catch (err) {
        console.error("Failed to fetch diary from database:", err);
      }

      // Local storage fallback
      try {
        const saved = localStorage.getItem("aii_kibo_diary_pages_data");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPages(parsed);
          }
        }
      } catch (_) {}
    }

    loadDiary();
  }, []);

  const savePagesToStorage = async (updatedPages: PageData[]) => {
    setPages(updatedPages);
    try {
      localStorage.setItem("aii_kibo_diary_pages_data", JSON.stringify(updatedPages));
    } catch (_) {}

    try {
      await fetch("/api/diary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pages: updatedPages }),
      });
    } catch (err) {
      console.error("Failed to save diary to database:", err);
    }
  };

  const handleNextPage = () => {
    if (currentPage < TOTAL_PAGES - 1 && !slideAnim) {
      playPopSound();
      setSlideAnim("slide-left");
      setTimeout(() => {
        setCurrentPage((prev) => prev + 1);
        setSlideAnim(null);
      }, 250);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0 && !slideAnim) {
      playPopSound();
      setSlideAnim("slide-right");
      setTimeout(() => {
        setCurrentPage((prev) => prev - 1);
        setSlideAnim(null);
      }, 250);
    }
  };

  // Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;

    if (diff > 45) {
      handleNextPage();
    } else if (diff < -45) {
      handlePrevPage();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    touchStartX.current = e.clientX;
    touchEndX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    touchEndX.current = e.clientX;
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;

    if (diff > 45) {
      handleNextPage();
    } else if (diff < -45) {
      handlePrevPage();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleTextChange = (newText: string) => {
    const updated = [...pages];
    const currentDate = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    updated[currentPage] = {
      ...updated[currentPage],
      text: newText,
      date: updated[currentPage].date || currentDate,
    };
    setPages(updated);
  };

  const handleTitleChange = (newTitle: string) => {
    const updated = [...pages];
    updated[currentPage] = {
      ...updated[currentPage],
      title: newTitle,
    };
    setPages(updated);
  };

  const handleSaveMessage = async () => {
    setIsSaving(true);
    await savePagesToStorage(pages);
    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 1500);
  };

  const handleBack = () => {
    playButtonSound();
    setIsExiting(true);
    setTimeout(() => {
      onBackToMenu();
    }, 300);
  };

  const activePage = pages[currentPage] || { title: "", text: "", date: "" };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="relative h-full w-full flex flex-col overflow-hidden select-none bg-[#fffdf7] font-press-start cursor-grab active:cursor-grabbing"
    >
      {/* Black transition overlay */}
      <div
        className={`pointer-events-none absolute inset-0 z-[70] bg-black transition-opacity duration-300 ${
          isExiting ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Pure Paper Sheet Element */}
      <div
        className={`relative flex-1 w-full h-full bg-[#fffdfa] flex flex-col pt-3 pb-4 px-3 sm:px-4 overflow-hidden transition-all duration-250 ${
          slideAnim === "slide-left"
            ? "animate-slide-left-out"
            : slideAnim === "slide-right"
            ? "animate-slide-right-out"
            : ""
        }`}
      >
        {/* Left Binder Holes */}
        <div className="absolute top-0 bottom-0 left-1 w-4 flex flex-col justify-around py-4 items-center z-20 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-2.5 h-2.5 bg-[#2d2d2d] rounded-full border border-[#2d2d2d]" />
          ))}
        </div>

        {/* Red Notebook Margin Line */}
        <div className="absolute top-0 bottom-0 left-7 border-r-2 border-[#ffb3ba]/80 z-10 pointer-events-none" />

        {/* Top Header Line */}
        <div className="relative z-30 pl-8 pr-1 flex items-center justify-between pb-2 mb-1 border-b border-[#e2e8f0]">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 border border-[#2d2d2d] bg-[#ffffba] px-2 py-0.5 text-[8px] font-bold text-[#2d2d2d] shadow-[1px_1px_0px_0px_#2d2d2d] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer shrink-0"
          >
            <PxlIcon icon={HomeIcon as unknown as PxlKitIconData} className="h-3 w-3" />
            <span>MENU</span>
          </button>

          <input
            type="text"
            value={activePage.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder=""
            className="bg-transparent text-[10px] sm:text-xs font-bold text-[#ff5964] focus:outline-none px-2 font-press-start truncate flex-1 text-center"
          />

          <span className="text-[7.5px] text-[#888888] font-press-start shrink-0">
            {currentPage + 1}/{TOTAL_PAGES}
          </span>
        </div>

        {/* Writing Container with Perfect Line Alignment */}
        <div className="relative z-10 pl-8 pr-1 flex-1 flex flex-col overflow-hidden">
          {/* Lined Paper Background Lines */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to bottom, transparent 31px, #e2e8f0 32px)`,
              backgroundSize: "100% 32px",
            }}
          />

          <textarea
            value={activePage.text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder=""
            className="w-full flex-1 bg-transparent text-[9.5px] sm:text-[11px] text-[#2d2d2d] font-press-start focus:outline-none resize-none p-0 tracking-normal"
            style={{
              lineHeight: "32px",
            }}
          />
        </div>

        {/* Bottom Fill Save Message Button */}
        <div className="relative z-30 pl-8 pr-1 pt-2">
          <Button
            onClick={handleSaveMessage}
            disabled={isSaving}
            variant="mint"
            size="sm"
            className="w-full text-[9px] sm:text-[10px]"
          >
            <PxlIcon icon={ChatBubble as unknown as PxlKitIconData} className="h-4 w-4" />
            <span>{isSaving ? "MENYIMPAN..." : isSaved ? "PESAN TERSIMPAN!" : "SIMPAN PESAN"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
