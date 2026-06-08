// utils/audio.ts

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  
  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }
  return audioCtx;
}

/**
 * Play a sutil feedback sound using native Web Audio API.
 * Synthesizes nice harmony tones for 'correct' and soft descending pitch for 'incorrect'.
 * Safe for headless test environments (Vitest/JSDOM) where AudioContext is undefined.
 */
export function playSound(type: 'correct' | 'incorrect'): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    if (type === 'correct') {
      // Sonido de éxito: dos notas sutiles y armónicas ascendentes (Do5 y Mi5)
      // Primera nota
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      
      gain1.gain.setValueAtTime(0.06, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      
      osc1.start(now);
      osc1.stop(now + 0.12);

      // Segunda nota un poco desfasada para dar sensación de arpegio
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now + 0.06); // E5
      
      gain2.gain.setValueAtTime(0.0, now);
      gain2.gain.setValueAtTime(0.06, now + 0.06);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      
      osc2.start(now + 0.06);
      osc2.stop(now + 0.22);

    } else {
      // Sonido de error: tono grave sutil descendente (onda triangular para suavidad)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.22); // Baja una octava
      
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (error) {
    console.warn('No se pudo reproducir el sonido por limitaciones del navegador:', error);
  }
}
