import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sparkles, Music } from 'lucide-react';

export const LuxurySensoryAudio: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<number | null>(null);

  const stopAudio = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (gainNodeRef.current && audioCtxRef.current) {
      try {
        gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.5);
      } catch (e) {
        console.error(e);
      }
    }
    setIsPlaying(false);
  };

  const playSpaChime = (ctx: AudioContext, masterGain: GainNode, freq: number) => {
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    noteGain.gain.setValueAtTime(0, ctx.currentTime);
    noteGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1.2);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 6.0);

    osc.connect(noteGain);
    noteGain.connect(masterGain);

    osc.start();
    osc.stop(ctx.currentTime + 6.5);
  };

  const startAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.3, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Pentatonic warm spa chord frequencies (around 432Hz base)
      const frequencies = [216, 288, 324, 432, 576, 648];

      // Initial chord
      playSpaChime(ctx, masterGain, 216);
      playSpaChime(ctx, masterGain, 432);

      // Loop slow ambient harmonic chimes
      let step = 0;
      intervalRef.current = window.setInterval(() => {
        const f1 = frequencies[step % frequencies.length];
        const f2 = frequencies[(step + 2) % frequencies.length];
        playSpaChime(ctx, masterGain, f1);
        setTimeout(() => playSpaChime(ctx, masterGain, f2), 800);
        step++;
      }, 5000);

      setIsPlaying(true);
    } catch (err) {
      console.warn('AudioContext not allowed or supported', err);
    }
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <button
      onClick={toggleSound}
      className={`fixed bottom-6 left-6 z-40 px-3.5 py-2.5 rounded-full border backdrop-blur-md shadow-lg transition-all flex items-center gap-2 text-xs font-semibold cursor-pointer active:scale-95 ${
        isPlaying
          ? 'bg-[#2c2725] text-white border-[#c98a92] ring-2 ring-[#c98a92]/40'
          : 'bg-[#fcfaf7]/90 text-[#4a423f] border-[#ede8e3] hover:border-[#c98a92] hover:text-[#2c2725]'
      }`}
      title={isPlaying ? 'Pausar Atmósfera Sensorial' : 'Activar Atmósfera Spa 432Hz'}
      aria-label="Atmósfera Sensorial Sonora"
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-4 h-4 text-[#c98a92] animate-pulse" />
          <span className="hidden sm:inline">Spa 432Hz Activo</span>
          <span className="flex gap-0.5 items-center">
            <span className="w-1 h-3 bg-[#c98a92] rounded-full animate-bounce" />
            <span className="w-1 h-2 bg-[#c98a92] rounded-full animate-bounce delay-100" />
            <span className="w-1 h-3.5 bg-[#c98a92] rounded-full animate-bounce delay-200" />
          </span>
        </>
      ) : (
        <>
          <VolumeX className="w-4 h-4 text-[#8a807d]" />
          <span className="hidden sm:inline">Atmósfera Spa 432Hz</span>
        </>
      )}
    </button>
  );
};
