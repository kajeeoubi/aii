let bgmAudio: HTMLAudioElement | null = null;
let bgmSourceNode: MediaElementAudioSourceNode | null = null;
let bgmGainNode: GainNode | null = null;
let currentTrackSrc: string | null = null;
let fadeInterval: NodeJS.Timeout | null = null;
let gestureListenerActive = false;

export const BGM_VOLUME_NORMAL = 0.5;
export const BGM_VOLUME_LOW = 0.18;

let currentTargetVolume = BGM_VOLUME_NORMAL;

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

function getBGMElement(): HTMLAudioElement {
  if (!bgmAudio) {
    bgmAudio = new Audio();
    bgmAudio.loop = true;
    bgmAudio.volume = 1;
  }
  setupBGMWebAudio();
  return bgmAudio;
}

function setupBGMWebAudio(): GainNode | null {
  if (bgmGainNode) return bgmGainNode;
  const ctx = getAudioContext();
  if (!ctx || !bgmAudio) return null;

  try {
    if (!bgmSourceNode) {
      bgmSourceNode = ctx.createMediaElementSource(bgmAudio);
      bgmGainNode = ctx.createGain();
      bgmGainNode.gain.value = 0;
      bgmSourceNode.connect(bgmGainNode);
      bgmGainNode.connect(ctx.destination);
    }
  } catch {
  }
  return bgmGainNode;
}

function setBGMVolumeInternal(vol: number) {
  const clamped = Math.max(0, Math.min(1, vol));
  const gain = setupBGMWebAudio();
  if (gain) {
    gain.gain.value = clamped;
  }
  if (bgmAudio) {
    try {
      bgmAudio.volume = clamped;
    } catch {
    }
  }
}

function getBGMVolumeInternal(): number {
  if (bgmGainNode) {
    return bgmGainNode.gain.value;
  }
  return bgmAudio ? bgmAudio.volume : 0;
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
    window.removeEventListener("touchstart", handleUserGesture);
    window.removeEventListener("pointerdown", handleUserGesture);
    window.removeEventListener("keydown", handleUserGesture);

    const ctx = getAudioContext();
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    if (bgmAudio && currentTrackSrc && isMusicEnabled()) {
      startFadeIn(bgmAudio, currentTargetVolume);
    }
  };

  window.addEventListener("click", handleUserGesture);
  window.addEventListener("touchstart", handleUserGesture);
  window.addEventListener("pointerdown", handleUserGesture);
  window.addEventListener("keydown", handleUserGesture);
}

function startFadeIn(audio: HTMLAudioElement, targetVol: number = currentTargetVolume) {
  clearFade();
  setBGMVolumeInternal(0);

  if (!isMusicEnabled()) return;

  const ctx = getAudioContext();
  if (ctx && ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        let currentVol = 0;
        const steps = 50;
        const fadeInStep = targetVol / steps;

        fadeInterval = setInterval(() => {
          currentVol = Math.min(targetVol, currentVol + fadeInStep);
          setBGMVolumeInternal(currentVol);

          if (currentVol >= targetVol) {
            clearFade();
            setBGMVolumeInternal(targetVol);
          }
        }, 30);
      })
      .catch(() => {
        setupGestureListener();
      });
  }
}

export function playBGM(src: string = "/audio/bgm/stars.mp3", targetVol: number = BGM_VOLUME_NORMAL) {
  if (typeof window === "undefined") return;

  currentTargetVolume = targetVol;
  const audio = getBGMElement();

  // If already playing this track
  if (currentTrackSrc === src && !audio.paused && getBGMVolumeInternal() > 0) {
    setBGMVolume(targetVol, 1000);
    return;
  }

  // If music is disabled
  if (!isMusicEnabled()) {
    pauseBGM();
    return;
  }

  clearFade();

  if (currentTrackSrc && currentTrackSrc !== src && !audio.paused && getBGMVolumeInternal() > 0) {
    // Fade out current track over 50 steps, then switch src and fade in
    let currentVol = getBGMVolumeInternal();
    const fadeOutStep = currentVol / 50;

    fadeInterval = setInterval(() => {
      currentVol = Math.max(0, currentVol - fadeOutStep);
      setBGMVolumeInternal(currentVol);

      if (currentVol <= 0) {
        clearFade();
        audio.pause();
        audio.src = src;
        currentTrackSrc = src;
        startFadeIn(audio, targetVol);
      }
    }, 40);
  } else {
    // Starting fresh or resuming
    audio.src = src;
    currentTrackSrc = src;
    startFadeIn(audio, targetVol);
  }
}

export function pauseBGM() {
  if (typeof window === "undefined") return;
  if (!bgmAudio || bgmAudio.paused) return;

  clearFade();
  let currentVol = getBGMVolumeInternal();
  const fadeOutStep = currentVol / 50;

  fadeInterval = setInterval(() => {
    currentVol = Math.max(0, currentVol - fadeOutStep);
    setBGMVolumeInternal(currentVol);

    if (currentVol <= 0) {
      clearFade();
      if (bgmAudio) {
        bgmAudio.pause();
        setBGMVolumeInternal(0);
      }
    }
  }, 40);
}

export function setBGMVolume(targetVol: number = currentTargetVolume, durationMs: number = 1000) {
  if (typeof window === "undefined") return;
  currentTargetVolume = targetVol;
  if (!bgmAudio || bgmAudio.paused) return;

  clearFade();
  const startVol = getBGMVolumeInternal();
  if (Math.abs(startVol - targetVol) < 0.01) {
    setBGMVolumeInternal(targetVol);
    return;
  }

  const steps = Math.max(1, Math.floor(durationMs / 30));
  const stepAmount = (targetVol - startVol) / steps;
  let currentStep = 0;

  fadeInterval = setInterval(() => {
    currentStep++;
    const nextVol = startVol + stepAmount * currentStep;
    setBGMVolumeInternal(nextVol);

    if (currentStep >= steps) {
      clearFade();
      setBGMVolumeInternal(targetVol);
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

