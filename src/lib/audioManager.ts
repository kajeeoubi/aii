let bgmAudio: HTMLAudioElement | null = null;
let currentTrackSrc: string | null = null;
let fadeInterval: NodeJS.Timeout | null = null;
let gestureListenerActive = false;

const TARGET_VOLUME = 0.5;

function getBGMElement(): HTMLAudioElement {
  if (!bgmAudio) {
    bgmAudio = new Audio();
    bgmAudio.loop = true;
    bgmAudio.volume = 0;
  }
  return bgmAudio;
}

function clearFade() {
  if (fadeInterval) {
    clearInterval(fadeInterval);
    fadeInterval = null;
  }
}

function setupGestureListener() {
  if (gestureListenerActive) return;
  gestureListenerActive = true;

  const handleUserGesture = () => {
    gestureListenerActive = false;
    window.removeEventListener("click", handleUserGesture);
    window.removeEventListener("keydown", handleUserGesture);

    if (bgmAudio && currentTrackSrc && isMusicEnabled()) {
      startFadeIn(bgmAudio);
    }
  };

  window.addEventListener("click", handleUserGesture);
  window.addEventListener("keydown", handleUserGesture);
}

function startFadeIn(audio: HTMLAudioElement) {
  clearFade();
  audio.volume = 0;

  if (!isMusicEnabled()) return;

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        let currentVol = 0;
        const fadeInStep = TARGET_VOLUME / 50;

        fadeInterval = setInterval(() => {
          currentVol = Math.min(TARGET_VOLUME, currentVol + fadeInStep);
          audio.volume = currentVol;

          if (currentVol >= TARGET_VOLUME) {
            clearFade();
            audio.volume = TARGET_VOLUME;
          }
        }, 40);
      })
      .catch(() => {
        setupGestureListener();
      });
  }
}

export function playBGM(src: string = "/audio/bgm/stars.mp3") {
  if (typeof window === "undefined") return;

  const audio = getBGMElement();

  // If already playing this track
  if (currentTrackSrc === src && !audio.paused && audio.volume > 0) {
    return;
  }

  // If music is disabled
  if (!isMusicEnabled()) {
    pauseBGM();
    return;
  }

  clearFade();

  if (currentTrackSrc && currentTrackSrc !== src && !audio.paused && audio.volume > 0) {
    // Fade out current track over 50 steps, then switch src and fade in
    let currentVol = audio.volume;
    const fadeOutStep = currentVol / 50;

    fadeInterval = setInterval(() => {
      currentVol = Math.max(0, currentVol - fadeOutStep);
      audio.volume = currentVol;

      if (currentVol <= 0) {
        clearFade();
        audio.pause();
        audio.src = src;
        currentTrackSrc = src;
        startFadeIn(audio);
      }
    }, 40);
  } else {
    // Starting fresh or resuming
    audio.src = src;
    currentTrackSrc = src;
    startFadeIn(audio);
  }
}

export function pauseBGM() {
  if (typeof window === "undefined") return;
  if (!bgmAudio || bgmAudio.paused) return;

  clearFade();
  let currentVol = bgmAudio.volume;
  const fadeOutStep = currentVol / 50;

  fadeInterval = setInterval(() => {
    currentVol = Math.max(0, currentVol - fadeOutStep);
    if (bgmAudio) bgmAudio.volume = currentVol;

    if (currentVol <= 0) {
      clearFade();
      if (bgmAudio) {
        bgmAudio.pause();
        bgmAudio.volume = 0;
      }
    }
  }, 40);
}

export function setBGMVolume(targetVol: number = TARGET_VOLUME, durationMs: number = 1500) {
  if (typeof window === "undefined") return;
  if (!bgmAudio || bgmAudio.paused) return;

  clearFade();
  const startVol = bgmAudio.volume;
  if (Math.abs(startVol - targetVol) < 0.01) {
    bgmAudio.volume = targetVol;
    return;
  }

  const steps = Math.max(1, Math.floor(durationMs / 30));
  const stepAmount = (targetVol - startVol) / steps;
  let currentStep = 0;

  fadeInterval = setInterval(() => {
    currentStep++;
    const nextVol = startVol + stepAmount * currentStep;
    if (bgmAudio) {
      bgmAudio.volume = Math.max(0, Math.min(1, nextVol));
    }

    if (currentStep >= steps) {
      clearFade();
      if (bgmAudio) bgmAudio.volume = targetVol;
    }
  }, 30);
}

export function toggleBGM(enabled: boolean) {
  setMusicEnabledStorage(enabled);
  if (enabled) {
    playBGM(currentTrackSrc || "/audio/bgm/stars.mp3");
  } else {
    pauseBGM();
  }
}

export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return true;
  const saved = localStorage.getItem("soundEnabled");
  return saved !== null ? saved === "true" : true;
}

export function setSoundEnabledStorage(enabled: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem("soundEnabled", String(enabled));
  window.dispatchEvent(new Event("soundSettingsChanged"));
}

export function isMusicEnabled(): boolean {
  if (typeof window === "undefined") return true;
  const saved = localStorage.getItem("musicEnabled");
  return saved !== null ? saved === "true" : true;
}

export function setMusicEnabledStorage(enabled: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem("musicEnabled", String(enabled));
  window.dispatchEvent(new Event("musicSettingsChanged"));
}

export function playButtonSound() {
  if (typeof window === "undefined") return;
  if (!isSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // ignore
  }
}


let footstepAudio: HTMLAudioElement | null = null;
let footstepTimeout: NodeJS.Timeout | null = null;

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playTypewriterSound() {
  // Disabled typewriter sound
}

export function playPopSound() {
  if (typeof window === "undefined") return;
  if (!isSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch {
    // ignore
  }
}

export function playFootstepSound(durationMs = 3200) {
  if (typeof window === "undefined") return;
  if (!isSoundEnabled()) return;

  try {
    if (!footstepAudio) {
      footstepAudio = new Audio("/audio/foot_steps.mp3");
    }
    footstepAudio.volume = 1;
    footstepAudio.currentTime = 0;
    footstepAudio.loop = true;
    footstepAudio.play().catch(() => {});

    if (footstepTimeout) clearTimeout(footstepTimeout);
    footstepTimeout = setTimeout(() => {
      stopFootstepSound();
    }, durationMs);
  } catch {
    // ignore
  }
}

export function stopFootstepSound() {
  if (footstepTimeout) {
    clearTimeout(footstepTimeout);
    footstepTimeout = null;
  }
  if (footstepAudio) {
    footstepAudio.pause();
    footstepAudio.currentTime = 0;
  }
}

