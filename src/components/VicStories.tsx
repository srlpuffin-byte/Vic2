import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sparkles, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play, 
  Volume2, 
  VolumeX, 
  Heart, 
  Share2, 
  MessageCircle, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Flame, 
  Zap, 
  Crown,
  Smile,
  ExternalLink,
  Award
} from 'lucide-react';
import { BUSINESS_DATA, SERVICES_DATA, formatPrice } from '../data/aestheticData';
import { ServiceItem } from '../types';
import trendsLaserImg from '../assets/images/trends_laser_hq_1786925645941.jpg';
import eclerisMinivacImg from '../assets/images/ecleris_minivac_hq_1786925657706.jpg';
import starbeneAlphaImg from '../assets/images/starbene_alpha_hq_1786925668298.jpg';
import velaslimPlusImg from '../assets/images/velaslim_plus_hq_1786925678666.jpg';
import teslagenDuoImg from '../assets/images/teslagen_duo_hq_1786925695584.jpg';
import clinicCabinImg from '../assets/images/clinic_cabin_real_hq_1786925708727.jpg';

export interface StorySlide {
  id: string;
  image: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  bulletPoints?: string[];
  serviceId?: string;
  poll?: {
    question: string;
    optionA: string;
    optionB: string;
    votesA: number;
    votesB: number;
  };
  highlightTag?: string;
}

export interface VicStoryGroup {
  id: string;
  title: string;
  category: string;
  avatar: string;
  liveBadge?: string;
  isNew?: boolean;
  slides: StorySlide[];
}

export const STORIES_DATA: VicStoryGroup[] = [
  {
    id: 'story-laser',
    title: 'Láser Tridiodo',
    category: 'Depilación & Glow',
    avatar: trendsLaserImg,
    liveBadge: 'JUEVES FIJOS',
    isNew: true,
    slides: [
      {
        id: 'laser-1',
        image: trendsLaserImg,
        badge: 'Jornadas Especiales en VIC',
        title: 'Trends Láser Tridiodo Criogénico',
        subtitle: '4 Longitudes de Onda en una sola pasada',
        description: 'La tecnología más avanzada para depilación definitiva médica. Su cabezal bajo cero (-4°C) hace que la sesión sea 100% confortable e indolora.',
        bulletPoints: [
          'Eficaz en vello fino, grueso, claro u oscuro',
          'Modo Fotorejuvenecimiento facial incluido',
          'Elimina la foliculitis y vellitos encarnados'
        ],
        serviceId: 'srv-dep-1',
        highlightTag: '❄️ Cabezal Frío Bajo Cero',
        poll: {
          question: '¿Probaste la depilación sin dolor en VIC?',
          optionA: '¡Sí, me fascina! 😍',
          optionB: 'Aún no, ¡quiero probar! 🙋‍♀️',
          votesA: 89,
          votesB: 11
        }
      },
      {
        id: 'laser-2',
        image: trendsLaserImg,
        badge: 'Tratamiento Médico Seguro',
        title: '¿Por qué elegir Trends Tridiodo?',
        subtitle: 'Velocidad, confort y resultados duraderos',
        description: 'Alcanza todas las profundidades del folículo piloso simultáneamente (755nm, 808nm, 940nm y 1064nm), logrando reducir hasta un 90% del vello en pocas sesiones.',
        bulletPoints: [
          'Sesiones súper rápidas (axilas en 5 minutos)',
          'Apto para todo tipo y tono de piel',
          'Atención por profesionales capacitadas'
        ],
        serviceId: 'srv-dep-1',
        highlightTag: '📍 Mendoza 985, Río Segundo'
      }
    ]
  },
  {
    id: 'story-facial',
    title: 'Alquimia MiniVac',
    category: 'Glow Facial',
    avatar: eclerisMinivacImg,
    liveBadge: 'EFECTO GLOW',
    slides: [
      {
        id: 'facial-1',
        image: eclerisMinivacImg,
        badge: 'Protocolo Estrella Facial',
        title: 'Alquimia Hidrofacial & Infusión',
        subtitle: 'Limpieza profunda + Ácido Hialurónico',
        description: 'Exfoliación no invasiva y extracción indolora de impurezas combinada con infusión dérmica de vitaminas y sueros bioactivos.',
        bulletPoints: [
          'Cierre inmediato de poros dilatados',
          'Luminosidad y tersura de seda instantánea',
          'Sin descamación agresiva ni enrojecimiento'
        ],
        serviceId: 'srv-fac-alquimia',
        highlightTag: '✨ Piel de Porcelana',
        poll: {
          question: '¿Tenés un evento pronto y querés lucir la piel radiante?',
          optionA: '¡Siii, necesito turno! 💖',
          optionB: 'Para mi rutina mensual 🧖‍♀️',
          votesA: 94,
          votesB: 6
        }
      },
      {
        id: 'facial-2',
        image: clinicCabinImg,
        badge: 'Experiencia en Cabina',
        title: 'Paso a Paso en Consultorio',
        subtitle: '45 minutos de desconexión y cuidado',
        description: 'Un ritual sensorial que incluye diagnóstico previo, hidrodermoabrasión con punta médica, mascarilla descongestiva y fotoprotección final.',
        bulletPoints: [
          'Higiene médica certificada',
          'Productos cosmecéuticos de primera línea',
          'Asesoramiento para rutina en casa'
        ],
        serviceId: 'srv-fac-alquimia',
        highlightTag: '💆‍♀️ Experiencia Relax'
      }
    ]
  },
  {
    id: 'story-body',
    title: 'VelaSlim & Crio',
    category: 'Modelación Corporal',
    avatar: velaslimPlusImg,
    liveBadge: 'REDUCCIÓN',
    slides: [
      {
        id: 'body-1',
        image: velaslimPlusImg,
        badge: 'Reducción & Anticelulitis',
        title: 'VelaSlim Plus 4 en 1',
        subtitle: 'Radiofrecuencia + Vacum + Rodillos + Infrarrojo',
        description: 'Modela el contorno corporal, reduce adiposidad localizada y mejora visiblemente la celulitis alisando y compactando el tejido.',
        bulletPoints: [
          'Calor profundo que tensa la piel flácida',
          'Drenaje linfático y desintoxicación celular',
          'Resultados progresivos desde las primeras semanas'
        ],
        serviceId: 'srv-corp-velaslim',
        highlightTag: '🔥 Modelación Corporal',
        poll: {
          question: '¿Qué zona te gustaría tratar primero?',
          optionA: 'Glúteos & Piernas 🦵',
          optionB: 'Abdomen & Flancos 👙',
          votesA: 65,
          votesB: 35
        }
      },
      {
        id: 'body-2',
        image: starbeneAlphaImg,
        badge: 'Criolipólisis Plana Starbene',
        title: 'Eliminación de Grasa por Frío',
        subtitle: 'Sin succión molesta ni hematomas',
        description: 'Placas térmicas inteligentes que inducen la apoptosis selectiva de las células adiposas sin dañar los tejidos circundantes.',
        bulletPoints: [
          'Atenúa rollitos rebeldes de forma definitiva',
          'Hasta 6 zonas tratadas simultáneamente',
          'Sin período de recuperación'
        ],
        serviceId: 'srv-corp-crio',
        highlightTag: '❄️ Criolipólisis Plana'
      }
    ]
  },
  {
    id: 'story-medical',
    title: 'Medicina Estética',
    category: 'Dra. Gelso',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
    liveBadge: 'MÉDICA',
    slides: [
      {
        id: 'med-1',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
        badge: 'A cargo de la Dra. Gelso',
        title: 'Armonización & Naturalidad',
        subtitle: 'Ácido Hialurónico & Toxina Botulínica (Botox)',
        description: 'Procedimientos médicos mínimamente invasivos orientados a realzar tus facciones de forma sutil, elegante y natural.',
        bulletPoints: [
          'Perfilado e hidratación labial armónica',
          'Atenuación de arrugas en frente, entrecejo y patas de gallo',
          'Insumos importados de máxima pureza'
        ],
        serviceId: 'srv-med-botox',
        highlightTag: '👩‍⚕️ Dra. Gelso (MP 34120)',
        poll: {
          question: '¿Buscás un resultado natural que preserve tus gestos?',
          optionA: '¡Totalmente natural! 🌿',
          optionB: 'Quiero asesoramiento médico 📋',
          votesA: 92,
          votesB: 8
        }
      }
    ]
  },
  {
    id: 'story-clinic',
    title: 'Consultorio VIC',
    category: 'Río Segundo',
    avatar: clinicCabinImg,
    liveBadge: 'TOUR',
    slides: [
      {
        id: 'clinic-1',
        image: clinicCabinImg,
        badge: 'Tu Espacio de Bienestar',
        title: 'Bienvenidos a VIC Estética Integral',
        subtitle: 'Mendoza 985, Río Segundo, Córdoba',
        description: 'Instalaciones diseñadas para brindarte confort absoluto, máxima higiene médica y la aparatología más avanzada de la región.',
        bulletPoints: [
          'Ambiente climatizado, aromaterapia y relax',
          'Atención personalizada con turno programado',
          'Fácil acceso y estacionamiento en la zona'
        ],
        highlightTag: '📍 Mendoza 985, Río Segundo'
      },
      {
        id: 'clinic-2',
        image: teslagenDuoImg,
        badge: 'Tecnología de Punta',
        title: 'Equipamiento Clínico Original',
        subtitle: 'Inversión continua en tu seguridad y resultados',
        description: 'Trabajamos únicamente con equipos homologados por ANMAT y protocolos validados internacionalmente.',
        bulletPoints: [
          'Trends Láser · Ecleris MiniVAC · Starbene',
          'VelaSlim Plus · Teslagen Duo Ondas Magnéticas',
          'Profesionales con matrícula y capacitación continua'
        ],
        highlightTag: '🛡️ Seguridad Médica ANMAT'
      }
    ]
  },
  {
    id: 'story-tips',
    title: 'Tips Skincare',
    category: 'Consejos Mavi',
    avatar: 'https://images.unsplash.com/photo-1556760544-74068565f05c?q=80&w=800&auto=format&fit=crop',
    liveBadge: 'CONSEJOS',
    slides: [
      {
        id: 'tips-1',
        image: 'https://images.unsplash.com/photo-1556760544-74068565f05c?q=80&w=800&auto=format&fit=crop',
        badge: 'Consejos de Gabinete',
        title: '3 Claves para una Piel Sana en Casa',
        subtitle: 'Por Mavi Tissera (Cosmetóloga & Esteticista)',
        description: 'El 70% del éxito de cualquier tratamiento en consultorio depende de cómo cuidás tu barrera cutánea todos los días.',
        bulletPoints: [
          '1. Doble limpieza suave por la noche',
          '2. Hidratación adecuada según tu tipo de piel',
          '3. Protector solar los 365 días del año'
        ],
        highlightTag: '💡 Tip Profesional',
        poll: {
          question: '¿Usás protector solar todos los días del año?',
          optionA: '¡Todos los días sin falta! ☀️',
          optionB: 'A veces me olvido... 🙈',
          votesA: 58,
          votesB: 42
        }
      }
    ]
  }
];

interface VicStoriesProps {
  onOpenBooking: (service?: ServiceItem | null) => void;
  onOpenDiagnosis?: () => void;
}

export const VicStories: React.FC<VicStoriesProps> = ({ onOpenBooking, onOpenDiagnosis }) => {
  // Viewed stories stored in localStorage
  const [viewedStoryIds, setViewedStoryIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vic_viewed_stories');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Active Story Modal state
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<{ [key: string]: boolean }>({});
  const [userPollVotes, setUserPollVotes] = useState<{ [key: string]: 'A' | 'B' }>({});
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; emoji: string; x: number }[]>([]);

  const SLIDE_DURATION_MS = 5500;
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Mark story as viewed
  const markAsViewed = useCallback((storyId: string) => {
    setViewedStoryIds(prev => {
      if (!prev.includes(storyId)) {
        const next = [...prev, storyId];
        try {
          localStorage.setItem('vic_viewed_stories', JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      }
      return prev;
    });
  }, []);

  const openStory = (index: number) => {
    setActiveStoryIndex(index);
    setActiveSlideIndex(0);
    setProgress(0);
    setIsPaused(false);
    markAsViewed(STORIES_DATA[index].id);
    document.body.style.overflow = 'hidden';
  };

  const closeStory = () => {
    setActiveStoryIndex(null);
    setActiveSlideIndex(0);
    setProgress(0);
    setIsPaused(false);
    document.body.style.overflow = '';
  };

  const currentStory = activeStoryIndex !== null ? STORIES_DATA[activeStoryIndex] : null;
  const currentSlide = currentStory ? currentStory.slides[activeSlideIndex] : null;

  // Next Slide / Next Story Handler
  const goToNextSlide = useCallback(() => {
    if (activeStoryIndex === null || !currentStory) return;

    if (activeSlideIndex < currentStory.slides.length - 1) {
      setActiveSlideIndex(prev => prev + 1);
      setProgress(0);
    } else if (activeStoryIndex < STORIES_DATA.length - 1) {
      const nextStoryIdx = activeStoryIndex + 1;
      setActiveStoryIndex(nextStoryIdx);
      setActiveSlideIndex(0);
      setProgress(0);
      markAsViewed(STORIES_DATA[nextStoryIdx].id);
    } else {
      closeStory();
    }
  }, [activeStoryIndex, activeSlideIndex, currentStory, markAsViewed]);

  // Previous Slide / Previous Story Handler
  const goToPrevSlide = useCallback(() => {
    if (activeStoryIndex === null || !currentStory) return;

    if (activeSlideIndex > 0) {
      setActiveSlideIndex(prev => prev - 1);
      setProgress(0);
    } else if (activeStoryIndex > 0) {
      const prevStoryIdx = activeStoryIndex - 1;
      setActiveStoryIndex(prevStoryIdx);
      const prevStory = STORIES_DATA[prevStoryIdx];
      setActiveSlideIndex(prevStory.slides.length - 1);
      setProgress(0);
      markAsViewed(prevStory.id);
    } else {
      setProgress(0);
    }
  }, [activeStoryIndex, activeSlideIndex, currentStory, markAsViewed]);

  // Timer loop for auto-advancing slides
  useEffect(() => {
    if (activeStoryIndex === null || isPaused || !currentSlide) return;

    const intervalMs = 50;
    const increment = (intervalMs / SLIDE_DURATION_MS) * 100;

    progressTimerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          goToNextSlide();
          return 0;
        }
        return prev + increment;
      });
    }, intervalMs);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [activeStoryIndex, activeSlideIndex, isPaused, currentSlide, goToNextSlide]);

  // Keyboard navigation support
  useEffect(() => {
    if (activeStoryIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeStory();
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        goToNextSlide();
      } else if (e.key === 'ArrowLeft') {
        goToPrevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStoryIndex, goToNextSlide, goToPrevSlide]);

  // Reaction Emojis
  const handleTriggerEmoji = (emoji: string) => {
    const newEmoji = {
      id: Date.now() + Math.random(),
      emoji,
      x: 30 + Math.random() * 40 // between 30% and 70% width
    };
    setFloatingEmojis(prev => [...prev, newEmoji]);
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== newEmoji.id));
    }, 2000);
  };

  const handleVotePoll = (slideId: string, option: 'A' | 'B') => {
    setUserPollVotes(prev => ({ ...prev, [slideId]: option }));
    handleTriggerEmoji('💖');
  };

  const handleBookFromStory = () => {
    if (!currentSlide) return;
    const serviceId = currentSlide.serviceId;
    const service = serviceId ? SERVICES_DATA.find(s => s.id === serviceId) : null;
    closeStory();
    onOpenBooking(service);
  };

  const handleWhatsAppFromStory = () => {
    if (!currentSlide || !currentStory) return;
    const text = `👋 *¡Hola equipo de VIC!* 🌸\n\nEstaba viendo la historia de *"${currentStory.title} — ${currentSlide.title}"* en el sitio web y me gustaría consultar disponibilidad de turnos o sacarme unas dudas. ✨`;
    window.open(`https://wa.me/${BUSINESS_DATA.phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section className="relative z-20 py-4 bg-gradient-to-b from-[#fbf8f5] to-[#f7f2ed] border-b border-[#ede5dd]/80 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Instagram/VIP feel */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c98a92] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#c98a92]"></span>
            </span>
            <h3 className="font-serif-cormorant text-base sm:text-lg font-bold text-[#2c2725] tracking-wide flex items-center gap-1.5">
              <span>VIC Stories</span>
              <span className="text-[11px] font-sans font-medium text-[#c98a92] bg-[#f5ede5] px-2 py-0.5 rounded-full border border-[#e8ded5]">
                Casos Reales & Cabina
              </span>
            </h3>
          </div>
          <span className="text-[11px] text-[#8a807d] hidden sm:inline">
            Tocá un círculo para ver videos y aparatología en acción 👆
          </span>
        </div>

        {/* Stories Horizontal Carousel */}
        <div className="flex items-center gap-3.5 sm:gap-5 overflow-x-auto pb-2 pt-1 scrollbar-none no-scrollbar snap-x snap-mandatory">
          {STORIES_DATA.map((story, idx) => {
            const isViewed = viewedStoryIds.includes(story.id);
            return (
              <button
                key={story.id}
                type="button"
                onClick={() => openStory(idx)}
                className="group flex flex-col items-center shrink-0 cursor-pointer snap-start focus:outline-none transition-transform active:scale-95"
                title={`Ver historia de ${story.title}`}
              >
                {/* Glowing Avatar Ring */}
                <div className="relative">
                  <div 
                    className={`w-[66px] h-[66px] sm:w-[74px] sm:h-[74px] rounded-full p-[2.5px] transition-all duration-300 ${
                      isViewed 
                        ? 'bg-[#d1c7be] group-hover:bg-[#b0a59b]' 
                        : 'bg-gradient-to-tr from-[#c98a92] via-[#e8c49a] to-[#d4af37] shadow-md group-hover:shadow-lg group-hover:scale-105 animate-pulse'
                    }`}
                  >
                    <div className="w-full h-full rounded-full p-[2px] bg-white">
                      <img
                        src={story.avatar}
                        alt={story.title}
                        className="w-full h-full object-cover rounded-full bg-[#f2ece6] group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Top / Bottom Badge Pill */}
                  {story.liveBadge && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className={`text-[8px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-full shadow-xs border ${
                        story.isNew
                          ? 'bg-[#c98a92] text-white border-white'
                          : 'bg-[#2c2725] text-[#fbf5b7] border-[#d4af37]'
                      }`}>
                        {story.liveBadge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Story Title & Subtitle */}
                <div className="text-center mt-2 w-[72px] sm:w-[82px]">
                  <span className="text-[11px] font-bold text-[#2c2725] block truncate leading-tight group-hover:text-[#c98a92] transition-colors">
                    {story.title}
                  </span>
                  <span className="text-[9px] text-[#8a807d] block truncate">
                    {story.category}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

      </div>

      {/* ================= FULL-SCREEN INSTAGRAM-STYLE STORY VIEWER MODAL ================= */}
      {currentStory && currentSlide && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={closeStory}
        >
          {/* Desktop Navigation Arrows (Outside card) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevSlide();
            }}
            className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center backdrop-blur-md border border-white/20 transition-all active:scale-95 cursor-pointer z-50"
            title="Historia Anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToNextSlide();
            }}
            className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center backdrop-blur-md border border-white/20 transition-all active:scale-95 cursor-pointer z-50"
            title="Siguiente Historia"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Main Story Container (Phone Aspect Ratio: 9:16) */}
          <div 
            className="relative w-full max-w-[420px] h-[92vh] max-h-[820px] bg-[#1a1615] rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col justify-between select-none"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            
            {/* Background Image with Gradient Overlays */}
            <div className="absolute inset-0 z-0">
              <img
                src={currentSlide.image}
                alt={currentSlide.title}
                className="w-full h-full object-cover scale-105 transition-transform duration-700 ease-out"
              />
              {/* Top and Bottom Dark Luxury Gradients for readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/95" />
            </div>

            {/* Floating Emojis Layer */}
            <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
              {floatingEmojis.map((e) => (
                <div
                  key={e.id}
                  style={{ left: `${e.x}%` }}
                  className="absolute bottom-20 text-3xl animate-float-up pointer-events-none"
                >
                  {e.emoji}
                </div>
              ))}
            </div>

            {/* TAP ZONES (Left 30% for Prev, Right 70% for Next) */}
            <div 
              className="absolute inset-y-16 left-0 w-1/3 z-20 cursor-pointer"
              onClick={goToPrevSlide}
              title="Anterior"
            />
            <div 
              className="absolute inset-y-16 right-0 w-2/3 z-20 cursor-pointer"
              onClick={goToNextSlide}
              title="Siguiente"
            />

            {/* --- TOP STORY HEADER (Progress bars + Avatar + Controls) --- */}
            <div className="relative z-30 p-4 pt-3 space-y-2.5">
              
              {/* Segmented Progress Bars */}
              <div className="flex items-center gap-1.5 w-full">
                {currentStory.slides.map((slide, idx) => {
                  let fillWidth = '0%';
                  if (idx < activeSlideIndex) fillWidth = '100%';
                  else if (idx === activeSlideIndex) fillWidth = `${progress}%`;

                  return (
                    <div 
                      key={slide.id}
                      className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden backdrop-blur-xs"
                    >
                      <div 
                        style={{ width: fillWidth }}
                        className="h-full bg-white transition-all duration-75 ease-linear rounded-full shadow-xs"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Story Author & Meta Row */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full p-[1.5px] bg-gradient-to-tr from-[#c98a92] to-[#d4af37]">
                    <img 
                      src={currentStory.avatar} 
                      alt={currentStory.title} 
                      className="w-full h-full object-cover rounded-full bg-white"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold font-serif-cormorant tracking-wide">
                        VIC Estética Integral
                      </span>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                    </div>
                    <span className="text-[10px] text-white/70 block">
                      {currentStory.title} · Hace unas horas
                    </span>
                  </div>
                </div>

                {/* Top Actions: Pause & Close */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPaused(!isPaused);
                    }}
                    className="p-2 rounded-full hover:bg-white/20 text-white/90 transition-colors cursor-pointer"
                    title={isPaused ? 'Reanudar' : 'Pausar'}
                  >
                    {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeStory();
                    }}
                    className="p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title="Cerrar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

            </div>

            {/* --- CENTER STORY CONTENT & INTERACTIVE STICKERS --- */}
            <div className="relative z-30 px-5 my-auto space-y-4 pointer-events-auto">
              
              {/* Badge & Location Tag */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#c98a92]/90 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-md shadow-xs border border-white/20">
                  {currentSlide.badge}
                </span>
                {currentSlide.highlightTag && (
                  <span className="bg-black/60 text-[#fbf5b7] text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-md border border-[#d4af37]/40 shadow-xs">
                    {currentSlide.highlightTag}
                  </span>
                )}
              </div>

              {/* Title & Description Box */}
              <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/15 shadow-xl space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold font-serif-cormorant text-white leading-tight">
                  {currentSlide.title}
                </h2>
                <p className="text-xs font-semibold text-[#f5ede5]">
                  {currentSlide.subtitle}
                </p>
                <p className="text-xs text-white/90 leading-relaxed">
                  {currentSlide.description}
                </p>

                {/* Bullet points */}
                {currentSlide.bulletPoints && currentSlide.bulletPoints.length > 0 && (
                  <ul className="space-y-1 pt-1.5 border-t border-white/10">
                    {currentSlide.bulletPoints.map((pt, pidx) => (
                      <li key={pidx} className="text-[11px] text-white/90 flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Interactive Poll Sticker (if available) */}
              {currentSlide.poll && (
                <div className="bg-white/10 backdrop-blur-xl p-3.5 rounded-2xl border border-white/25 shadow-lg space-y-2.5 animate-in zoom-in-95 duration-200">
                  <div className="text-center">
                    <span className="text-[9px] uppercase tracking-wider text-[#d4af37] font-bold block mb-0.5">
                      📊 ENCUESTA INTERACTIVA
                    </span>
                    <h4 className="text-xs font-bold text-white">
                      {currentSlide.poll.question}
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Option A */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVotePoll(currentSlide.id, 'A');
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex flex-col items-center justify-center relative overflow-hidden ${
                        userPollVotes[currentSlide.id] === 'A'
                          ? 'bg-[#c98a92] text-white border-white ring-2 ring-[#c98a92]'
                          : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                      }`}
                    >
                      <span className="relative z-10">{currentSlide.poll.optionA}</span>
                      {userPollVotes[currentSlide.id] && (
                        <span className="text-[10px] text-white/80 font-mono mt-0.5 z-10">
                          {currentSlide.poll.votesA}%
                        </span>
                      )}
                    </button>

                    {/* Option B */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVotePoll(currentSlide.id, 'B');
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex flex-col items-center justify-center relative overflow-hidden ${
                        userPollVotes[currentSlide.id] === 'B'
                          ? 'bg-[#d4af37] text-black border-white ring-2 ring-[#d4af37]'
                          : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                      }`}
                    >
                      <span className="relative z-10">{currentSlide.poll.optionB}</span>
                      {userPollVotes[currentSlide.id] && (
                        <span className="text-[10px] font-mono mt-0.5 z-10 opacity-90">
                          {currentSlide.poll.votesB}%
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* --- BOTTOM CONVERSION BAR & REACTIONS --- */}
            <div className="relative z-30 p-4 bg-gradient-to-t from-black via-black/80 to-transparent space-y-2.5">
              
              {/* Primary Call to Action Button */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookFromStory();
                  }}
                  className="py-3 px-3 bg-gradient-to-r from-[#c98a92] to-[#b87881] hover:from-[#b87881] hover:to-[#a76871] text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Reservar Turno</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWhatsAppFromStory();
                  }}
                  className="py-3 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>Consultar por WhatsApp</span>
                </button>
              </div>

              {/* Quick Reactions Bar (Fire, Love, Heart, Clap) */}
              <div className="flex items-center justify-between pt-1 border-t border-white/10 px-1">
                <div className="flex items-center gap-2">
                  {['🔥', '💖', '😍', '👏'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTriggerEmoji(emoji);
                      }}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-base flex items-center justify-center transition-transform hover:scale-125 active:scale-95 cursor-pointer"
                      title={`Reaccionar con ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setHasLiked(prev => ({ ...prev, [currentSlide.id]: !prev[currentSlide.id] }));
                    handleTriggerEmoji('❤️');
                  }}
                  className={`p-2 rounded-full transition-all active:scale-125 cursor-pointer ${
                    hasLiked[currentSlide.id] 
                      ? 'text-rose-500 bg-white/20' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  title="Me gusta"
                >
                  <Heart className={`w-5 h-5 ${hasLiked[currentSlide.id] ? 'fill-current' : ''}`} />
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

    </section>
  );
};
