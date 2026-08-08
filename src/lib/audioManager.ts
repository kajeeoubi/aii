let bgmAudio: HTMLAudioElement | null = null;
let currentTrackSrc: string | null = null;
let currentTargetVolume: number = 0.5;
let currentActualVolume: number = 0;
let fadeAnimationId: number | null = null;
let gestureListenerActive = false;

export const BGM_VOLUME_NORMAL = 0.5;
export const BGM_VOLUME_LOW = 0.2;

const FADE_IN_DEFAULT_MS = 1200;
const FADE_OUT_DEFAULT_MS = 800;

let audioCtx: AudioContext | null = null;
let bgmSourceNode: MediaElementAudioSourceNode | null = null;
let bgmGainNode: GainNode | null = null;

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

function setupBGMGainNode(): GainNode | null {
  if (bgmGainNode) return bgmGainNode;
  if (!bgmAudio) return null;
  const ctx = getAudioContext();
  if (!ctx) return null;

  try {
    if (!bgmSourceNode) {
      bgmSourceNode = ctx.createMediaElementSource(bgmAudio);
    }
    bgmGainNode = ctx.createGain();
    bgmGainNode.gain.value = currentActualVolume;
    bgmSourceNode.connect(bgmGainNode);
    bgmGainNode.connect(ctx.destination);
    bgmAudio.volume = 1;
    return bgmGainNode;
  } catch (e) {
    console.warn("Web Audio API BGM gain node setup error:", e);
    return null;
  }
}

function applyVolume(vol: number) {
  const clampedVol = Math.max(0, Math.min(1, vol));
  currentActualVolume = clampedVol;

  const gainNode = setupBGMGainNode();
  if (gainNode) {
    gainNode.gain.value = clampedVol;
    if (bgmAudio) bgmAudio.volume = 1;
  } else if (bgmAudio) {
    try {
      bgmAudio.volume = clampedVol;
    } catch {}
  }
}

function getBGMElement(): HTMLAudioElement {
  if (!bgmAudio) {
    bgmAudio = new Audio();
    bgmAudio.loop = true;
    bgmAudio.volume = 1;
    setupBGMGainNode();
  }
  return bgmAudio;
}

function cancelFadeAnimation() {
  if (fadeAnimationId !== null) {
    cancelAnimationFrame(fadeAnimationId);
    fadeAnimationId = null;
  }
}

function setupGestureListener() {
  if (gestureListenerActive) return;
  gestureListenerActive = true;

  const handleUserGesture = () => {
    gestureListenerActive = false;
    window.removeEventListener("click", handleUserGesture);
    window.removeEventListener("touchstart", handleUserGesture);
    window.removeEventListener("pointerdown", handleUserGesture);
    window.removeEventListener("keydown", handleUserGesture);

    const ctx = getAudioContext();
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    setupBGMGainNode();

    if (bgmAudio && currentTrackSrc && isMusicEnabled()) {
      if (bgmAudio.paused) {
        bgmAudio.play().catch(() => {});
      }
      fadeVolumeTo(currentTargetVolume, FADE_IN_DEFAULT_MS);
    }
  };

  window.addEventListener("click", handleUserGesture);
  window.addEventListener("touchstart", handleUserGesture);
  window.addEventListener("pointerdown", handleUserGesture);
  window.addEventListener("keydown", handleUserGesture);
}

/**
 * Smoothly fades BGM volume from its current level to `targetVol` over `durationMs`.
 * Uses Cosine S-curve easing for ultra-smooth perceptual audio transitions.
 * Supports Web Audio API GainNode so volume adjustment works on mobile browsers (iOS/Android).
 */
function fadeVolumeTo(targetVol: number, durationMs: number = FADE_IN_DEFAULT_MS, onComplete?: () => void) {
  cancelFadeAnimation();

  if (!bgmAudio) {
    if (onComplete) onComplete();
    return;
  }

  const startVol = currentActualVolume;
  const endVol = Math.max(0, Math.min(1, targetVol));

  if (Math.abs(startVol - endVol) < 0.005 || durationMs <= 0) {
    applyVolume(endVol);
    if (onComplete) onComplete();
    return;
  }

  const startTime = performance.now();

  const step = (now: number) => {
    if (!bgmAudio) return;

    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / durationMs);

    // Cosine S-Curve Easing for natural logarithmic human volume perception
    const eased = 0.5 * (1 - Math.cos(Math.PI * progress));

    const currentVol = startVol + (endVol - startVol) * eased;
    applyVolume(currentVol);

    if (progress < 1) {
      fadeAnimationId = requestAnimationFrame(step);
    } else {
      applyVolume(endVol);
      fadeAnimationId = null;
      if (onComplete) onComplete();
    }
  };

  fadeAnimationId = requestAnimationFrame(step);
}

export function playBGM(src: string = "/audio/bgm/stars.mp3", targetVol: number = BGM_VOLUME_NORMAL) {
  if (typeof window === "undefined") return;

  currentTargetVolume = targetVol;

  if (!isMusicEnabled()) {
    pauseBGM();
    return;
  }

  const audio = getBGMElement();

  // Check if same track is already loaded
  const isSameTrack = currentTrackSrc === src && audio.src && audio.src.endsWith(src.replace(/^\//, ""));

  if (isSameTrack) {
    if (audio.paused) {
      audio.play().catch(() => setupGestureListener());
    }
    fadeVolumeTo(targetVol, FADE_IN_DEFAULT_MS);
    return;
  }

  // Atomically set requested track
  currentTrackSrc = src;

  // If paused or volume is practically 0, immediately swap src and play
  if (audio.paused || currentActualVolume <= 0.01) {
    cancelFadeAnimation();
    audio.pause();
    audio.src = src;
    audio.currentTime = 0;
    applyVolume(0);

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          fadeVolumeTo(targetVol, FADE_IN_DEFAULT_MS);
        })
        .catch(() => {
          setupGestureListener();
        });
    }
  } else {
    // Ultra-smooth Cross-fade: fade out current track over 800ms, then swap src and fade in over 1200ms
    fadeVolumeTo(0, FADE_OUT_DEFAULT_MS, () => {
      // Check if track request changed again during fade-out
      if (currentTrackSrc !== src) {
        return;
      }
      audio.pause();
      audio.src = src;
      audio.currentTime = 0;
      applyVolume(0);

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            fadeVolumeTo(currentTargetVolume, FADE_IN_DEFAULT_MS);
          })
          .catch(() => {
            setupGestureListener();
          });
      }
    });
  }
}

export function setBGMVolume(targetVol: number = currentTargetVolume, durationMs: number = FADE_IN_DEFAULT_MS) {
  if (typeof window === "undefined") return;
  currentTargetVolume = targetVol;

  if (!isMusicEnabled()) return;
  if (!bgmAudio || bgmAudio.paused) return;

  fadeVolumeTo(targetVol, durationMs);
}

export function resumeBGM(targetVol: number = currentTargetVolume) {
  if (typeof window === "undefined") return;
  if (!isMusicEnabled()) return;

  currentTargetVolume = targetVol;
  const audio = getBGMElement();

  if (currentTrackSrc) {
    if (audio.paused) {
      audio.play().catch(() => setupGestureListener());
    }
    fadeVolumeTo(targetVol, FADE_IN_DEFAULT_MS);
  } else {
    playBGM("/audio/bgm/stars.mp3", targetVol);
  }
}

export function pauseBGM() {
  if (typeof window === "undefined") return;
  if (!bgmAudio) return;

  fadeVolumeTo(0, FADE_OUT_DEFAULT_MS, () => {
    if (bgmAudio) {
      bgmAudio.pause();
    }
  });
}

export function toggleBGM(enabled: boolean) {
  setMusicEnabledStorage(enabled);
  if (enabled) {
    playBGM(currentTrackSrc || "/audio/bgm/stars.mp3", currentTargetVolume);
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
