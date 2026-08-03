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
    const audio = new Audio("/audio/button_audio.mp3");
    audio.volume = 0.6;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch {
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
