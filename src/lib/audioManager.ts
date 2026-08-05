let bgmAudio: HTMLAudioElement | null = null;

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

export function initBGM() {
  if (typeof window === "undefined") return;
  if (!bgmAudio) {
    bgmAudio = new Audio("/audio/bgm/stars.mp3");
    bgmAudio.loop = true;
    bgmAudio.volume = 0.5;
  }
}

export function playBGM() {
  if (typeof window === "undefined") return;
  initBGM();
  if (bgmAudio && isMusicEnabled()) {
    bgmAudio.volume = 0.5;
    bgmAudio.play().catch(() => {
      const handleUserGesture = () => {
        if (bgmAudio && isMusicEnabled()) {
          bgmAudio.play().catch(() => {});
        }
        window.removeEventListener("click", handleUserGesture);
        window.removeEventListener("keydown", handleUserGesture);
      };
      window.addEventListener("click", handleUserGesture);
      window.addEventListener("keydown", handleUserGesture);
    });
  }
}

export function pauseBGM() {
  if (typeof window === "undefined") return;
  if (bgmAudio) {
    bgmAudio.pause();
  }
}

export function toggleBGM(enabled: boolean) {
  setMusicEnabledStorage(enabled);
  if (enabled) {
    playBGM();
  } else {
    pauseBGM();
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

