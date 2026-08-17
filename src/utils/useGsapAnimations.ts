import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Robust High-End GSAP Animations for VIC Estética Integral:
 * - Ultra-smooth cinematic hero reveal
 * - Guaranteed one-time scroll reveal for all section headers and titles
 * - clearProps on completion so elements never get stuck invisible
 * - Magnetic 3D tilt on luxury cards
 */
export function useGsapAnimations() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // ==========================================
      // 1. HERO CINEMATIC REVEAL
      // ==========================================
      const heroTl = gsap.timeline({
        defaults: { ease: 'power3.out' }
      });

      heroTl
        .fromTo(
          '.gsap-hero-badge',
          { opacity: 0, y: -15 },
          { opacity: 1, y: 0, duration: 0.8, clearProps: 'transform' }
        )
        .fromTo(
          '.gsap-hero-title',
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.9, clearProps: 'transform' },
          '-=0.5'
        )
        .fromTo(
          '.gsap-hero-desc',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, clearProps: 'transform' },
          '-=0.6'
        )
        .fromTo(
          '.gsap-hero-actions > *',
          { opacity: 0, y: 15, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.6, clearProps: 'all' },
          '-=0.5'
        )
        .fromTo(
          '.gsap-hero-stats > *',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, clearProps: 'all' },
          '-=0.4'
        )
        .fromTo(
          '.gsap-hero-card',
          { opacity: 0, y: 30, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power2.out', clearProps: 'opacity' },
          '-=0.7'
        );

      // ==========================================
      // 2. PARALLAX & AMBIENT BREATHING GLOWS
      // ==========================================
      gsap.to('.gsap-ambient-glow', {
        scale: 1.2,
        opacity: 0.9,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Subtle floating bob on Hero apparatus card
      gsap.to('.gsap-hero-card', {
        y: -6,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.2
      });

      // ==========================================
      // 3. STATS CLINICAL NUMERICAL REVEAL
      // ==========================================
      const statsRow = document.querySelector('.gsap-stats-row');
      if (statsRow) {
        gsap.fromTo(
          '.gsap-stat-item',
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            clearProps: 'all',
            scrollTrigger: {
              trigger: '.gsap-stats-row',
              start: 'top 95%',
              once: true
            }
          }
        );
      }

      // ==========================================
      // 4. SECTION HEADERS & TITLES REVEAL (Guaranteed once: true)
      // ==========================================
      const headers = document.querySelectorAll('.gsap-section-header');
      headers.forEach((header) => {
        gsap.fromTo(
          header,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'power2.out',
            clearProps: 'all',
            scrollTrigger: {
              trigger: header,
              start: 'top 92%',
              once: true
            }
          }
        );
      });

      // ==========================================
      // 5. SMART CARD REVEALS
      // ==========================================
      const cards = document.querySelectorAll('.gsap-reveal-card');
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            clearProps: 'all',
            scrollTrigger: {
              trigger: card,
              start: 'top 94%',
              once: true
            }
          }
        );
      });

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
            rotationY: x * 0.03,
            rotationX: -y * 0.03,
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
            duration: 0.5
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
        { opacity: 0, scale: 0.85, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          delay: 0.5,
          ease: 'power2.out',
          clearProps: 'all'
        }
      );
    });

    // Refresh ScrollTrigger after assets load
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    // Fallback safety to guarantee all elements are visible in any edge case
    const safetyTimer = setTimeout(() => {
      document.querySelectorAll<HTMLElement>('.gsap-section-header, .gsap-reveal-card, .gsap-hero-title, .gsap-hero-desc, .gsap-hero-badge, .gsap-stat-item').forEach((el) => {
        if (getComputedStyle(el).opacity === '0') {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }
      });
    }, 1200);

    return () => {
      clearTimeout(refreshTimer);
      clearTimeout(safetyTimer);
      ctx.revert();
    };
  }, []);
}

export { gsap, ScrollTrigger };

