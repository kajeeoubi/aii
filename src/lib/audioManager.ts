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
    // ignore playback restrictions
  }
}
