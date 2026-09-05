import { useRef, useEffect } from 'react';

/**
 * Procedural Web Audio Ambient Café Soundscape
 * Synthesizes warm vinyl warmth, soft acoustic chords, and café relaxation.
 * Mastered at a clear, audible, comfortable listening volume (default 60-70%).
 * 
 * @param {boolean} isPlaying - Toggle sound playback
 * @param {number} volume - Volume level from 0.0 to 1.0 (default: 0.65)
 */
export default function useAmbientAudio(isPlaying, volume = 0.65) {
  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const intervalRef = useRef(null);
  const whiteNoiseRef = useRef(null);

  // Update volume dynamically in real-time
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      const targetGain = Math.max(0, Math.min(1, volume)) * 0.45;
      masterGainRef.current.gain.setTargetAtTime(targetGain, audioCtxRef.current.currentTime, 0.1);
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContext();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        // Master gain with comfortable 65% default volume
        const masterGain = ctx.createGain();
        const initialGain = Math.max(0, Math.min(1, volume)) * 0.45;
        masterGain.gain.setValueAtTime(initialGain, ctx.currentTime);
        masterGain.connect(ctx.destination);
        masterGainRef.current = masterGain;

        // Gentle vinyl texture & warm café room tone generator
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.04;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        whiteNoiseRef.current = whiteNoise;

        // Warm Lowpass filter for cozy ambient room tone
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(500, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start();

        // Lush acoustic jazz chord progression (Fmaj9 -> Cmaj7 -> Dm9 -> Am9)
        const chordProgressions = [
          [174.61, 220.00, 261.63, 329.63, 392.00], // Fmaj9
          [130.81, 164.81, 196.00, 246.94, 293.66], // Cmaj9
          [146.83, 174.61, 220.00, 261.63, 329.63], // Dm9
          [110.00, 130.81, 164.81, 196.00, 246.94], // Am9
        ];
        let chordIdx = 0;

        const playChord = () => {
          if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
          const chord = chordProgressions[chordIdx];
          chordIdx = (chordIdx + 1) % chordProgressions.length;

          const now = ctx.currentTime;

          chord.forEach((freq, idx) => {
            // Fundamental tone
            const osc1 = ctx.createOscillator();
            const noteGain = ctx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(freq, now);

            // Warm second harmonic for acoustic richness
            const osc2 = ctx.createOscillator();
            const harmonicGain = ctx.createGain();
            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(freq * 2, now);
            harmonicGain.gain.setValueAtTime(0.08, now);

            // Dynamic envelope: Smooth attack and gentle acoustic decay
            const peakGain = 0.12 - idx * 0.015;
            noteGain.gain.setValueAtTime(0.0001, now);
            noteGain.gain.exponentialRampToValueAtTime(peakGain, now + 0.8 + idx * 0.15);
            noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 5.2);

            osc2.connect(harmonicGain);
            harmonicGain.connect(noteGain);
            osc1.connect(noteGain);
            noteGain.connect(masterGain);

            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + 5.5);
            osc2.stop(now + 5.5);
          });
        };

        playChord();
        intervalRef.current = setInterval(playChord, 4800);

        return () => {
          if (whiteNoiseRef.current) {
            try { whiteNoiseRef.current.stop(); } catch (e) {}
          }
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        };
      } catch (err) {
        console.error('Web Audio initialization:', err);
      }
    } else {
      if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
        audioCtxRef.current.suspend();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [isPlaying]);
}
