/**
 * Web Audio API based ambient synthesizer for traditional Chinese exhibition aesthetic.
 * Pentatonic scale (Gong, Shang, Jiao, Zhi, Yu) with calming overtones.
 */

let audioCtx: AudioContext | null = null;
let isMuted = true; // default muted until user toggles or enables
let ambientInterval: ReturnType<typeof setInterval> | null = null;

// Pentatonic scale frequencies in Hz (Gong: C4, Shang: D4, Jiao: E4, Zhi: G4, Yu: A4, C5, D5, E5)
const PENTATONIC_FREQUENCIES = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33];

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const SoundEngine = {
  isMuted: () => isMuted,

  setMuted: (muted: boolean) => {
    isMuted = muted;
    if (muted) {
      if (ambientInterval) {
        clearInterval(ambientInterval);
        ambientInterval = null;
      }
    } else {
      getAudioContext();
      SoundEngine.startAmbient();
    }
  },

  // Play gentle bell / chime for interactive navigation
  playChime: (noteIndex = 2) => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const freq = PENTATONIC_FREQUENCIES[noteIndex % PENTATONIC_FREQUENCIES.length];

      // Primary tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Subtle harmonic overtone for bronze bell/chime character
      const harmonic = ctx.createOscillator();
      const harmGain = ctx.createGain();
      harmonic.type = 'triangle';
      harmonic.frequency.setValueAtTime(freq * 2.76, now); // Chinese chime acoustic ratio

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      harmGain.gain.setValueAtTime(0.001, now);
      harmGain.gain.exponentialRampToValueAtTime(0.04, now + 0.03);
      harmGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

      osc.connect(gain);
      harmonic.connect(harmGain);
      gain.connect(ctx.destination);
      harmGain.connect(ctx.destination);

      osc.start(now);
      harmonic.start(now);
      osc.stop(now + 2.0);
      harmonic.stop(now + 2.0);
    } catch {
      // Audio fallback without crash
    }
  },

  // Stamp imprint sound: crisp stone pressure followed by resonant sacred reverberation
  playStampSound: () => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Click/tap impulse
      const oscThud = ctx.createOscillator();
      const gainThud = ctx.createGain();
      oscThud.type = 'triangle';
      oscThud.frequency.setValueAtTime(140, now);
      oscThud.frequency.exponentialRampToValueAtTime(45, now + 0.12);

      gainThud.gain.setValueAtTime(0.3, now);
      gainThud.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      oscThud.connect(gainThud);
      gainThud.connect(ctx.destination);
      oscThud.start(now);
      oscThud.stop(now + 0.15);

      // Resonant harmonic chime (copper seal resonance)
      const oscChime = ctx.createOscillator();
      const gainChime = ctx.createGain();
      oscChime.type = 'sine';
      oscChime.frequency.setValueAtTime(587.33, now + 0.05); // D5

      gainChime.gain.setValueAtTime(0.001, now + 0.05);
      gainChime.gain.exponentialRampToValueAtTime(0.18, now + 0.08);
      gainChime.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      oscChime.connect(gainChime);
      gainChime.connect(ctx.destination);
      oscChime.start(now + 0.05);
      oscChime.stop(now + 2.3);
    } catch {
      // safe fallback
    }
  },

  // Gentle meditative ambient pulses
  startAmbient: () => {
    if (isMuted || ambientInterval) return;
    ambientInterval = setInterval(() => {
      if (isMuted) return;
      if (Math.random() > 0.45) {
        const randomIndex = Math.floor(Math.random() * PENTATONIC_FREQUENCIES.length);
        SoundEngine.playChime(randomIndex);
      }
    }, 4500);
  },
};
