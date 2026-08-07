"use client";

import { LoadingSpinner } from "@pxlkit/ui";
import { PxlIcon, PxlKitIconData } from "@/components/PxlIcon";

interface ResourcePreloaderModalProps {
  loadedCount: number;
  totalCount: number;
  progressPercentage: number;
}

export function ResourcePreloaderModal({
  loadedCount,
  totalCount,
  progressPercentage,
}: ResourcePreloaderModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs font-press-start">
      <div className="relative w-full max-w-sm border-4 border-[#2d2d2d] bg-[#faf7f2] p-5 shadow-[8px_8px_0px_0px_#2d2d2d]">
        
        {/* Floating Header Tag */}
        <div className="flex justify-center -mt-9 mb-4">
          <span className="inline-flex items-center gap-2 border-3 border-[#2d2d2d] bg-[#ffb3ba] px-4 py-1.5 text-xs font-bold text-[#2d2d2d] shadow-[3px_3px_0px_0px_#2d2d2d]">
            <PxlIcon icon={LoadingSpinner as unknown as PxlKitIconData} className="h-4 w-4" />
            <span>MEMUAT RESOURCE...</span>
          </span>
        </div>

        <div className="flex flex-col items-center text-center space-y-4">
          <p className="text-[10px] leading-relaxed text-[#2d2d2d] font-bold">
            Bentar yaa, semua gambarnya lagi disiapin dulu!
          </p>

          {/* Progress Bar Container */}
          <div className="w-full space-y-2">
            <div className="relative h-6 w-full overflow-hidden border-3 border-[#2d2d2d] bg-[#e2d9cd] shadow-[2px_2px_0px_0px_#2d2d2d]">
              <div
                className="h-full bg-[#baffc9] transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#2d2d2d]">
                {progressPercentage}%
              </span>
            </div>

            <div className="flex justify-between items-center text-[8.5px] text-[#555] font-bold px-1">
              <span>PROCESSING...</span>
              <span>
                {loadedCount} / {totalCount} ASSET
              </span>
            </div>
          </div>

          {/* Loading Icon Centerpiece */}
          <div className="flex items-center justify-center pt-1">
            <PxlIcon icon={LoadingSpinner as unknown as PxlKitIconData} className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
}

