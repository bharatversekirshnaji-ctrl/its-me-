/**
 * ============================================================================
 * BUNGALOW NO 6 — PROCEDURAL LUXURY UI SOUND DESIGN SYSTEM
 * ============================================================================
 * Zero external audio files or copyright dependencies.
 * Synthesized purely via Web Audio API oscillators, exponential envelopes,
 * soft low-pass biquad filters, and pink noise generators.
 * 
 * Volume Hierarchy & Design Guidelines:
 * - Tap / Click: ~12-15% (subtle tactile micro-click)
 * - Whoosh (Flying / Transition): ~16-20% (soft airy filtered sweep)
 * - Tick / Gold Arrival: ~22-25% (refined gold metallic resonance)
 * - Reservation / Order Chime: ~22-26% (warm 2-note hospitality chord)
 * - Service Bell: ~28-32% (crystal glass gentle bell)
 * - Removal / Delete: ~15% (soft descending swoosh)
 * ============================================================================
 */

class SoundService {
  constructor() {
    this.ctx = null;
    this.isMuted = typeof window !== 'undefined' ? localStorage.getItem('bn6_sound_muted') === 'true' : false;
    this.hasUserInteracted = false;

    // Listen for first user interaction to lazily init AudioContext
    if (typeof window !== 'undefined') {
      const unlock = () => {
        this.hasUserInteracted = true;
        this.initContext();
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('keydown', unlock);
      };
      window.addEventListener('pointerdown', unlock, { once: true });
      window.addEventListener('keydown', unlock, { once: true });
    }
  }

  initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('bn6_sound_muted', this.isMuted ? 'true' : 'false');
    }
    if (!this.isMuted) {
      this.initContext();
      this.playClick();
    }
    return this.isMuted;
  }

  getMuted() {
    return this.isMuted;
  }

  canPlay() {
    if (this.isMuted) return false;
    this.initContext();
    return !!this.ctx && this.ctx.state === 'running';
  }

  // --------------------------------------------------------------------------
  // 1. TACTILE BUTTON CLICK (Tiny physical wood/felt micro-click)
  // --------------------------------------------------------------------------
  playClick(pitch = 1800) {
    if (!this.canPlay()) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, now);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.025);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.028);
  }

  // --------------------------------------------------------------------------
  // 2. SOFT WHOOSH (Airy filtered wind for flying items & modal reveals)
  // --------------------------------------------------------------------------
  playWhoosh(duration = 0.35) {
    if (!this.canPlay()) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Filtered pink noise burst with soft frequency sweep
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 1.8;
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + duration * 0.5);
    filter.frequency.exponentialRampToValueAtTime(600, now + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.15, now + duration * 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
  }

  // --------------------------------------------------------------------------
  // 3. GOLD CART ARRIVAL TICK (Refined metallic resonance when food hits cart)
  // --------------------------------------------------------------------------
  playCartArrival() {
    if (!this.canPlay()) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Dual chime harmonics for rich metallic sparkle
    [1760, 3520].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.98, now + 0.18);

      const peak = idx === 0 ? 0.22 : 0.08;
      gain.gain.setValueAtTime(peak, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    });
  }

  // --------------------------------------------------------------------------
  // 4. RESERVATION / ORDER CONFIRMATION CHIME (Luxury 2-note hospitality chord)
  // --------------------------------------------------------------------------
  playConfirmation() {
    if (!this.canPlay()) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Note 1: E5 (659.25Hz) -> Note 2: B5 (987.77Hz)
    const notes = [
      { freq: 659.25, time: 0, dur: 0.45 },
      { freq: 987.77, time: 0.12, dur: 0.65 },
    ];

    notes.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + time);

      gain.gain.setValueAtTime(0.001, now + time);
      gain.gain.linearRampToValueAtTime(0.24, now + time + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + dur + 0.05);
    });
  }

  // --------------------------------------------------------------------------
  // 5. CALL SERVICE / KITCHEN BELL (Crystal clear gentle brass chime)
  // --------------------------------------------------------------------------
  playServiceBell() {
    if (!this.canPlay()) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1318.5, now); // E6

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.9);
  }

  // --------------------------------------------------------------------------
  // 6. REMOVE ITEM / TRASH (Soft descending whoosh)
  // --------------------------------------------------------------------------
  playRemoveItem() {
    if (!this.canPlay()) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, now);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(550, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.18);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // --------------------------------------------------------------------------
  // 7. QUANTITY STEPPER CLICK (Tiny soft tick)
  // --------------------------------------------------------------------------
  playQtyStep(isIncrement = true) {
    if (!this.canPlay()) return;
    this.playClick(isIncrement ? 2200 : 1600);
  }

  // --------------------------------------------------------------------------
  // 8. ERROR / REJECT TONE (Gentle muted low tone)
  // --------------------------------------------------------------------------
  playError() {
    if (!this.canPlay()) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.setValueAtTime(180, now + 0.08);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  }
}

export const soundService = new SoundService();
