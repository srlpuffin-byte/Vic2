import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Advanced High-End GSAP Animations for VIC Estética Integral:
 * - Ultra-smooth cinematic hero reveal with 3D perspective tilt
 * - Interactive Magnetic 3D tilt on luxury cards
 * - ScrollTrigger parallax elements & staggered luxury reveals
 * - Soft number count-ups for clinical milestones
 * - Floating badges with physics-inspired breathing motion
 */
export function useGsapAnimations() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // ==========================================
      // 1. HERO CINEMATIC REVEAL (Layered Timeline)
      // ==========================================
      const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      heroTl
        .fromTo(
          '.gsap-hero-badge',
          { opacity: 0, y: -25, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 1, delay: 0.15 }
        )
        .fromTo(
          '.gsap-hero-title',
          { opacity: 0, y: 40, skewY: 1.5 },
          { opacity: 1, y: 0, skewY: 0, duration: 1.2 },
          '-=0.7'
        )
        .fromTo(
          '.gsap-hero-desc',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1 },
          '-=0.8'
        )
        .fromTo(
          '.gsap-hero-actions > *',
          { opacity: 0, y: 25, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.8, ease: 'back.out(1.5)' },
          '-=0.6'
        )
        .fromTo(
          '.gsap-hero-stats > *',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.8 },
          '-=0.5'
        )
        .fromTo(
          '.gsap-hero-card',
          { opacity: 0, x: 50, scale: 0.94, rotateY: 8 },
          { opacity: 1, x: 0, scale: 1, rotateY: 0, duration: 1.4, ease: 'power3.out' },
          '-=1'
        );

      // ==========================================
      // 2. PARALLAX & AMBIENT BREATHING GLOWS
      // ==========================================
      gsap.to('.gsap-ambient-glow', {
        scale: 1.25,
        opacity: 0.9,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Subtle floating bob on Hero apparatus card
      gsap.to('.gsap-hero-card', {
        y: -8,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.5
      });

      // ==========================================
      // 3. STATS CLINICAL NUMERICAL REVEAL
      // ==========================================
      gsap.fromTo(
        '.gsap-stat-item',
        { opacity: 0, y: 40, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.gsap-stats-row',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // ==========================================
      // 4. SECTION HEADERS LUXURY REVEAL
      // ==========================================
      const headers = document.querySelectorAll('.gsap-section-header');
      headers.forEach((header) => {
        gsap.fromTo(
          header,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: header,
              start: 'top 88%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // ==========================================
      // 5. SMART BATCH CARD REVEALS WITH 3D POP
      // ==========================================
      const cards = document.querySelectorAll('.gsap-reveal-card');
      if (cards.length > 0) {
        ScrollTrigger.batch('.gsap-reveal-card', {
          start: 'top 90%',
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              { opacity: 0, y: 40, scale: 0.96 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                stagger: 0.1,
                duration: 0.85,
                ease: 'power2.out',
                overwrite: 'auto'
              }
            );
          }
        });
      }

      // ==========================================
      // 6. MAGNETIC 3D TILT EFFECT ON CARDS
      // ==========================================
      const tiltCards = document.querySelectorAll<HTMLElement>('.gsap-tilt-card');
      tiltCards.forEach((card) => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          gsap.to(card, {
            rotationY: x * 0.04,
            rotationX: -y * 0.04,
            transformPerspective: 900,
            ease: 'power1.out',
            duration: 0.4
          });
        };

        const handleMouseLeave = () => {
          gsap.to(card, {
            rotationY: 0,
            rotationX: 0,
            ease: 'power2.out',
            duration: 0.6
          });
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);
      });

      // ==========================================
      // 7. FLOATING ACTION PILLS POP
      // ==========================================
      gsap.fromTo(
        '.gsap-floating-actions',
        { opacity: 0, scale: 0.8, y: 25 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          delay: 0.8,
          ease: 'elastic.out(1, 0.7)'
        }
      );
    });

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);
}

export { gsap, ScrollTrigger };
