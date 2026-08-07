"use client";

import { useState, useEffect } from "react";
import { ALL_IMAGE_ASSETS, ALL_AUDIO_ASSETS } from "./assetList";

export interface AssetPreloaderState {
  loadedCount: number;
  totalCount: number;
  progressPercentage: number;
  isComplete: boolean;
  errorCount: number;
}

export function useAssetPreloader() {
  const totalCount = ALL_IMAGE_ASSETS.length;
  const [loadedCount, setLoadedCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let currentLoaded = 0;
    let currentError = 0;

    const checkProgress = () => {
      const finishedCount = currentLoaded + currentError;
      if (isMounted) {
        setLoadedCount(currentLoaded);
        setErrorCount(currentError);
        if (finishedCount >= totalCount) {
          setIsComplete(true);
        }
      }
    };

    // Preload Images
    ALL_IMAGE_ASSETS.forEach((src) => {
      const img = new Image();
      img.src = src;

      const handleSuccess = () => {
        currentLoaded++;
        checkProgress();
      };

      const handleError = () => {
        currentError++;
        checkProgress();
      };

      if (img.complete) {
        handleSuccess();
      } else {
        img.onload = handleSuccess;
        img.onerror = handleError;
      }
    });

    // Optionally fetch audio files into browser cache in the background
    ALL_AUDIO_ASSETS.forEach((src) => {
      const audio = new Audio();
      audio.preload = "auto";
      audio.src = src;
    });

    return () => {
      isMounted = false;
    };
  }, [totalCount]);

  const progressPercentage = totalCount > 0 
    ? Math.min(100, Math.round(((loadedCount + errorCount) / totalCount) * 100))
    : 100;

  return {
    loadedCount,
    totalCount,
    errorCount,
    progressPercentage,
    isComplete,
  };
}
