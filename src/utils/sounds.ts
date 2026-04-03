// Sound utility for the app
const SOUNDS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  tick: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  win: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  remove: 'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3',
};

export const playSound = (type: keyof typeof SOUNDS) => {
  const audio = new Audio(SOUNDS[type]);
  audio.volume = 0.5;
  audio.play().catch(() => {
    // Ignore errors if user hasn't interacted yet
  });
};

// For the wheel tick, we might want to control playback more precisely
export class Ticker {
  private audio: HTMLAudioElement;
  constructor() {
    this.audio = new Audio(SOUNDS.tick);
    this.audio.volume = 0.3;
  }
  play() {
    this.audio.currentTime = 0;
    this.audio.play().catch(() => {});
  }
}
