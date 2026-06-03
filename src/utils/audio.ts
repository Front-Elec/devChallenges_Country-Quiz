// utils/audio.ts

const sounds = {
  correct: new Audio('/sounds/correct.mp3'),
  incorrect: new Audio('/sounds/incorrect.mp3'),
};

/**
 * Play a feedback sound.
 * Resets currentTime so rapid repeated plays work correctly.
 * Silently ignores autoplay-policy rejections.
 */
export function playSound(type: 'correct' | 'incorrect'): void {
  sounds[type].currentTime = 0;
  sounds[type].play().catch(() => {
    // Browser autoplay policy — silently ignore if not yet interacted
  });
}
