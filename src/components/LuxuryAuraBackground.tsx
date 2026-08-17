import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Luxury Floating Silk Aura Particles
 * Creates an elegant, organic, slow-drifting botanical and golden ambient mist
 * perfectly tailored for high-end aesthetic medicine & dermatology clinics.
 */
export const LuxuryAuraBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const particles = containerRef.current.querySelectorAll('.luxury-particle');

    particles.forEach((particle, i) => {
      // Unique random movement paths for each ambient particle
      const randomX = (Math.random() - 0.5) * 80;
      const randomY = (Math.random() - 0.5) * 100;
      const randomDuration = 8 + Math.random() * 8;
      const randomScale = 0.8 + Math.random() * 0.5;

      gsap.to(particle, {
        x: `+=${randomX}`,
        y: `+=${randomY}`,
        scale: randomScale,
        opacity: 0.35 + Math.random() * 0.45,
        duration: randomDuration,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.6
      });
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Rose Gold Silk Orb 1 */}
      <div
        className="luxury-particle absolute top-[10%] left-[5%] w-96 h-96 rounded-full bg-gradient-to-br from-[#f7eef0] to-[#f4d8dd]/40 blur-3xl opacity-40"
      />
      {/* Warm Champagne Silk Orb 2 */}
      <div
        className="luxury-particle absolute top-[40%] right-[3%] w-[32rem] h-[32rem] rounded-full bg-gradient-to-tl from-[#fdf6ec] to-[#faeee3]/50 blur-3xl opacity-35"
      />
      {/* Soft Velvet Orb 3 */}
      <div
        className="luxury-particle absolute top-[75%] left-[15%] w-80 h-80 rounded-full bg-gradient-to-tr from-[#fbf0f2] to-[#ebd2d7]/30 blur-3xl opacity-30"
      />
      {/* Rose Powder Accent Orb 4 */}
      <div
        className="luxury-particle absolute top-[90%] right-[10%] w-96 h-96 rounded-full bg-gradient-to-l from-[#f5ede5] to-[#f8e7ea]/40 blur-3xl opacity-35"
      />
    </div>
  );
};
