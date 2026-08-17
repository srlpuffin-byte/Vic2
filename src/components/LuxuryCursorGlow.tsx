import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * Luxury Interactive Sparkle/Glow Cursor & Silk Particle trail
 * Designed specifically for high-end medical/aesthetic clinics.
 * Subtle, ultra-smooth 60fps luxury aesthetic with soft rose-gold aura.
 */
export const LuxuryCursorGlow: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only activate on devices with fine pointer (desktop / trackpad)
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    setIsVisible(true);

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    // Smooth movement using GSAP quickTo
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.5, ease: 'power3.out' });
    const dotXTo = gsap.quickTo(dot, 'x', { duration: 0.15, ease: 'power2.out' });
    const dotYTo = gsap.quickTo(dot, 'y', { duration: 0.15, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      dotXTo(e.clientX);
      dotYTo(e.clientY);

      // Check if hovering over interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = !!target.closest('button, a, input, select, textarea, [role="button"], .soft-card-hover, .cursor-pointer');
        setIsPointer(isClickable);
      }
    };

    const handleMouseLeave = () => {
      gsap.to([cursor, dot], { opacity: 0, duration: 0.3 });
    };

    const handleMouseEnter = () => {
      gsap.to([cursor, dot], { opacity: 1, duration: 0.3 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer ambient luxury halo */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-50 transition-all duration-300 ${
          isPointer
            ? 'w-16 h-16 bg-[#c98a92]/20 border border-[#c98a92]/40 backdrop-blur-[1px] scale-110'
            : 'w-10 h-10 bg-[#c98a92]/10 border border-[#c98a92]/25 scale-100'
        }`}
        style={{ willChange: 'transform' }}
      />
      {/* Center pinpoint sparkle */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-50 transition-all duration-200 ${
          isPointer ? 'w-2.5 h-2.5 bg-[#b57a82] shadow-sm shadow-[#c98a92]' : 'w-1.5 h-1.5 bg-[#c98a92]'
        }`}
        style={{ willChange: 'transform' }}
      />
    </>
  );
};
