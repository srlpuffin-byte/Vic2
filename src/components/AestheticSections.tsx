import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  Phone, 
  Instagram, 
  ChevronRight, 
  ChevronDown, 
  Star, 
  Gift, 
  MessageCircle, 
  Heart, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  Layers, 
  ArrowRight, 
  Plus, 
  Search, 
  Copy, 
  Navigation,
  Crown,
  Award,
  Sparkle
} from 'lucide-react';
import { 
  BUSINESS_DATA, 
  PROFESSIONALS_DATA, 
  HIGHLIGHTS_DATA, 
  FAQ_DATA 
} from '../data/aestheticData';
import { Testimonial } from '../types';
import { VicLogo } from './VicLogo';

interface HeroSectionProps {
  onOpenBooking: () => void;
  onOpenGiftCard: () => void;
  onOpenComboPlanner: () => void;
  onOpenConcierge?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  onOpenBooking, 
  onOpenGiftCard, 
  onOpenComboPlanner,
  onOpenConcierge
}) => {
  const [activeTechIndex, setActiveTechIndex] = useState(0);

  const featuredTechs = [
    {
      name: 'Láser 4 Ondas (Trends)',
      tag: 'Depilación Médica Definitiva',
      desc: '755, 808, 940 y 1064nm simultáneos con cabezal ultra-enfriado bajo cero para sesiones 100% indoloras.',
      image: 'https://images.unsplash.com/photo-1512290900672-1f4a9b2fc4bb?q=80&w=1000&auto=format&fit=crop',
      badge: 'Jornadas los Jueves'
    },
    {
      name: 'Alquimia (Ecleris MiniVac)',
      tag: 'Cosmetología & Hidrodermoabrasión',
      desc: 'Higiene profunda, exfoliación diamantada, succión indolora e infusión de sérums concentrados.',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1000&auto=format&fit=crop',
      badge: 'Efecto Glow Inmediato'
    },
    {
      name: 'Medicina Estética (Dra. Gelso)',
      tag: 'Toxina Botulínica & Hialurónico',
      desc: 'Armonización facial, arrugas de expresión, perfilado labial y bioestimuladores de colágeno.',
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1000&auto=format&fit=crop',
      badge: 'Supervisión Médica'
    },
    {
      name: 'VelaSlim Plus & Alpha Synergy',
      tag: 'Contorno Corporal & Celulitis',
      desc: 'Radiofrecuencia multipolar, vacumterapia dinámica, rodillos y luz infrarroja para reducción y tensado.',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop',
      badge: 'Alta Potencia'
    }
  ];

  const currentTech = featuredTechs[activeTechIndex];

  return (
    <section id="inicio" className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden">
      
      {/* Background Soft Glow */}
      <div className="gsap-ambient-glow absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-[#f7eef0]/80 blur-3xl pointer-events-none" />
      <div className="gsap-ambient-glow absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-[#f5ede5]/80 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Narrative & Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Pill / Subtitle */}
            <div className="space-y-2">
              <span className="gsap-hero-badge text-xs sm:text-sm font-semibold tracking-[0.25em] text-[#c98a92] uppercase block">
                TU BIENESTAR, NUESTRA PRIORIDAD
              </span>
              
              {/* Brand Header & Headline */}
              <h1 className="gsap-hero-title font-serif-cormorant text-5xl sm:text-6xl lg:text-7xl font-normal text-[#2c2725] tracking-tight leading-[1.05]">
                VIC <span className="text-[#c98a92] font-light">|</span>
                <span className="block mt-1 font-normal">Estética Integral</span>
              </h1>
            </div>

            {/* Subtext */}
            <p className="gsap-hero-desc text-base sm:text-lg text-[#5a524e] leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              Medicina estética, estética corporal y facial, kinesiología, fisioterapia y depilación definitiva. Atención profesional personalizada para que te sientas bien, por dentro y por fuera.
            </p>

            {/* Main Action Buttons */}
            <div className="gsap-hero-actions pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <button
                id="hero-book-btn"
                onClick={onOpenBooking}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#c98a92] hover:bg-[#b57a82] text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 cursor-pointer active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>RESERVAR TURNO</span>
              </button>

              <button
                onClick={onOpenComboPlanner}
                className="w-full sm:w-auto px-6 py-4 rounded-full bg-white border border-[#ede8e3] hover:border-[#c98a92] text-[#2c2725] hover:text-[#c98a92] text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Layers className="w-4 h-4 text-[#c98a92]" />
                <span>Armar Combo</span>
              </button>

              {onOpenConcierge ? (
                <button
                  onClick={onOpenConcierge}
                  className="w-full sm:w-auto px-5 py-4 rounded-full bg-[#fbf0f2] hover:bg-[#f5e1e5] border border-[#f0d4d8] text-[#b57a82] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <Crown className="w-4 h-4 text-[#c98a92]" />
                  <span>Membresías</span>
                </button>
              ) : (
                <button
                  onClick={onOpenGiftCard}
                  className="w-full sm:w-auto px-5 py-4 rounded-full bg-transparent text-[#c98a92] hover:text-[#b57a82] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Gift className="w-4 h-4" />
                  <span>Gift Card</span>
                </button>
              )}
            </div>

            {/* Trust and Key Stats Banner */}
            <div className="gsap-hero-stats pt-6 border-t border-[#ede8e3]/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <div className="flex items-center gap-1 text-[#c98a92] text-xs font-bold">
                  <Star className="w-4 h-4 fill-[#c98a92]" />
                  <span className="text-sm font-extrabold text-[#2c2725]">4.9 / 5</span>
                </div>
                <span className="text-[11px] text-[#8a807d] block mt-0.5">Opiniones reales de pacientes</span>
              </div>

              <div>
                <div className="text-sm font-extrabold text-[#2c2725]">+1.200</div>
                <span className="text-[11px] text-[#8a807d] block mt-0.5">Sesiones realizadas</span>
              </div>

              <div>
                <div className="text-sm font-extrabold text-[#2c2725]">100%</div>
                <span className="text-[11px] text-[#8a807d] block mt-0.5">Profesionales matriculadas</span>
              </div>
            </div>

          </div>

          {/* Right Column: Clean & Real Clinical Equipment Showcase */}
          <div className="lg:col-span-5 relative gsap-hero-card">
            
            {/* Showcase Main Card */}
            <div className="relative rounded-3xl overflow-hidden bg-white border border-[#ede8e3] shadow-xl p-4 sm:p-5 space-y-4">
              
              {/* Top Selector Tabs for Equipment */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#f7f4f0] rounded-2xl">
                {featuredTechs.map((tech, idx) => (
                  <button
                    key={tech.name}
                    onClick={() => setActiveTechIndex(idx)}
                    className={`py-2 px-2.5 rounded-xl text-left text-xs font-medium transition-all cursor-pointer ${
                      activeTechIndex === idx 
                        ? 'bg-white text-[#2c2725] font-bold shadow-xs border border-[#ede8e3]' 
                        : 'text-[#6b6462] hover:text-[#2c2725]'
                    }`}
                  >
                    <span className="block truncate text-[11px]">{tech.name}</span>
                  </button>
                ))}
              </div>

              {/* Image Preview Container */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-inner border border-[#ede8e3]/60 group">
                <img 
                  src={currentTech.image} 
                  alt={currentTech.name} 
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b19]/90 via-[#1e1b19]/30 to-transparent flex flex-col justify-end p-4 text-white">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#c98a92] text-white text-[10px] font-bold uppercase tracking-wider">
                      {currentTech.badge}
                    </span>
                    <span className="text-[10px] text-white/75 font-medium tracking-wide">
                      Mendoza 985 · Río Segundo
                    </span>
                  </div>
                  <h3 className="font-serif-cormorant text-2xl font-bold text-white leading-tight">
                    {currentTech.name}
                  </h3>
                  <p className="text-xs text-white/85 line-clamp-2 mt-1 leading-relaxed">
                    {currentTech.desc}
                  </p>
                </div>
              </div>

              {/* Bottom Quick Feature Highlights */}
              <div className="pt-1 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-[#2c2725]">
                  <ShieldCheck className="w-4 h-4 text-[#c98a92] shrink-0" />
                  <span className="text-[11px] font-medium text-[#6b6462]">
                    Tecnología Médica & Cosmiátrica Certificada
                  </span>
                </div>
                <button
                  onClick={onOpenBooking}
                  className="text-[11px] font-bold text-[#c98a92] hover:text-[#b57a82] flex items-center gap-1 cursor-pointer underline underline-offset-2 shrink-0"
                >
                  Consultar Turno
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Floating Location Pill */}
            <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-[#8a807d]">
              <MapPin className="w-3.5 h-3.5 text-[#c98a92]" />
              <span>Consultorio habilitado en Mendoza 985, Río Segundo, Cba</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export const HighlightsSection: React.FC = () => {
  return (
    <>
      {/* Dark Stats Row with Cursive Accents */}
      <section className="bg-[#2c2725] text-white py-12 sm:py-16 border-y border-[#3d3734] gsap-stats-row">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            
            <div className="space-y-1 gsap-stat-item">
              <div className="font-serif-cormorant text-4xl sm:text-5xl font-light tracking-wide text-white">
                47<span className="text-[#c98a92] text-3xl font-normal">+</span>
              </div>
              <div className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-white/80">
                RESEÑAS ★ 5.0
              </div>
              <div className="font-script text-xl sm:text-2xl text-[#c98a92] transform -rotate-2">
                clientes felices
              </div>
            </div>

            <div className="space-y-1 gsap-stat-item">
              <div className="font-serif-cormorant text-4xl sm:text-5xl font-light tracking-wide text-white">
                5<span className="text-[#c98a92] text-3xl font-normal">+</span>
              </div>
              <div className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-white/80">
                AÑOS DE EXPERIENCIA
              </div>
              <div className="font-script text-xl sm:text-2xl text-[#c98a92] transform -rotate-2">
                de trayectoria
              </div>
            </div>

            <div className="space-y-1 gsap-stat-item">
              <div className="font-serif-cormorant text-4xl sm:text-5xl font-light tracking-wide text-white">
                8
              </div>
              <div className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-white/80">
                ESPECIALIDADES
              </div>
              <div className="font-script text-xl sm:text-2xl text-[#c98a92] transform -rotate-2">
                en un solo lugar
              </div>
            </div>

            <div className="space-y-1 gsap-stat-item">
              <div className="font-serif-cormorant text-4xl sm:text-5xl font-light tracking-wide text-white">
                1000<span className="text-[#c98a92] text-3xl font-normal">+</span>
              </div>
              <div className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-white/80">
                TRATAMIENTOS
              </div>
              <div className="font-script text-xl sm:text-2xl text-[#c98a92] transform -rotate-2">
                y creciendo
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Highlights Features */}
      <section className="py-16 bg-white border-b border-[#ede8e3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {HIGHLIGHTS_DATA.map((h) => (
              <div key={h.id} className="space-y-2.5 gsap-reveal-card">
                <div className="w-10 h-10 rounded-2xl bg-[#f7eef0] text-[#c98a92] flex items-center justify-center font-bold shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-serif-cormorant text-xl font-bold text-[#2c2725]">
                  {h.title}
                </h3>
                <p className="text-xs text-[#6b6462] leading-relaxed">
                  {h.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export const TeamSection: React.FC<TeamSectionProps> = ({ onConsultSpecialist }) => {
  return (
    <section id="profesionales" className="py-20 bg-[#fcfaf7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 gsap-section-header">
          <span className="text-xs uppercase tracking-[0.25em] text-[#c98a92] font-semibold block mb-2">
            Staff Especializado
          </span>
          <h2 className="font-serif-cormorant text-4xl sm:text-5xl font-semibold text-[#2c2725]">
            Nuestro Equipo Profesional
          </h2>
          <p className="mt-3 text-sm text-[#6b6462]">
            Especialistas dedicadas a tu cuidado con formación continua, equipamiento de avanzada y calidez humana.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROFESSIONALS_DATA.map((prof, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-3xl p-6 border border-[#ede8e3] soft-card-hover flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow gsap-reveal-card"
            >
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm font-serif-cormorant"
                style={{ backgroundColor: prof.color }}
              >
                {prof.initials}
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-[#c98a92] uppercase tracking-wider block">
                  {prof.role}
                </span>
                <h3 className="font-serif-cormorant text-2xl font-bold text-[#2c2725]">
                  {prof.name}
                </h3>
                <p className="text-xs text-[#6b6462] leading-relaxed pt-1">
                  {prof.specialty}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

interface TeamSectionProps {
  onConsultSpecialist?: () => void;
}

interface ReviewsSectionProps {
  onOpenReviewModal: () => void;
  reviews: Testimonial[];
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ onOpenReviewModal, reviews }) => {
  const [filterStars, setFilterStars] = useState<number | 'all'>('all');

  const filteredReviews = useMemo(() => {
    if (filterStars === 'all') return reviews;
    return reviews.filter(r => r.stars === filterStars);
  }, [reviews, filterStars]);

  return (
    <section id="experiencias" className="py-20 bg-white border-t border-[#ede8e3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 gsap-section-header">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#c98a92] font-semibold block mb-2">
              Opiniones Reales de Pacientes
            </span>
            <h2 className="font-serif-cormorant text-4xl sm:text-5xl font-semibold text-[#2c2725]">
              Experiencias en VIC Estética
            </h2>
            <p className="mt-2 text-sm text-[#6b6462]">
              Historias reales de quienes confiaron su salud dérmica, corporal y relajación con nosotras.
            </p>
          </div>

          <button
            onClick={onOpenReviewModal}
            className="px-6 py-3.5 rounded-full bg-[#c98a92] hover:bg-[#b57a82] text-white text-xs font-bold uppercase tracking-widest transition-all shadow-sm flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Dejar mi Reseña</span>
          </button>
        </div>

        {/* Rating Score Banner */}
        <div className="bg-[#fcfaf7] border border-[#ede8e3] rounded-3xl p-6 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-serif-cormorant font-bold text-[#2c2725]">
              4.9
            </div>
            <div>
              <div className="flex text-[#c98a92] gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-[#c98a92]" />
                ))}
              </div>
              <span className="text-xs text-[#6b6462] mt-0.5 block">
                Basado en {reviews.length} testimonios verificados en Río Segundo y región
              </span>
            </div>
          </div>

          {/* Star Filter Pills */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8a807d]">Filtrar:</span>
            <button
              onClick={() => setFilterStars('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filterStars === 'all' ? 'bg-[#2c2725] text-white' : 'bg-white text-[#6b6462] border border-[#ede8e3]'
              }`}
            >
              Todas ({reviews.length})
            </button>
            <button
              onClick={() => setFilterStars(5)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                filterStars === 5 ? 'bg-[#2c2725] text-white' : 'bg-white text-[#6b6462] border border-[#ede8e3]'
              }`}
            >
              <span>5</span>
              <Star className="w-3 h-3 fill-current" />
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((t) => (
            <div 
              key={t.id}
              className="bg-[#fcfaf7] rounded-3xl p-6 sm:p-7 border border-[#ede8e3] flex flex-col justify-between hover:border-[#c98a92]/60 transition-colors shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex text-[#c98a92] gap-1">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#c98a92]" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#4a423f] italic leading-relaxed">
                  "{t.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#ede8e3] mt-5 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#2c2725]">{t.author}</h4>
                  <span className="text-[10px] text-[#8a807d] block">{t.service}</span>
                </div>
                <span className="text-[10px] text-[#c98a92] font-semibold bg-[#fbf0f2] px-2 py-0.5 rounded-full border border-[#f0d4d8]">
                  {t.date}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export const LocationAndFAQSection: React.FC = () => {
  const [faqCategory, setFaqCategory] = useState<string>('todos');
  const [faqSearch, setFaqSearch] = useState<string>('');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((faq) => {
      const matchesCat = faqCategory === 'todos' || faq.category === faqCategory;
      const matchesSearch = 
        faq.q.toLowerCase().includes(faqSearch.toLowerCase()) || 
        faq.a.toLowerCase().includes(faqSearch.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [faqCategory, faqSearch]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText("Mendoza 985, CP 5960, Río Segundo, Córdoba, Argentina");
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <section id="ubicacion" className="py-20 bg-[#fcfaf7] border-t border-[#ede8e3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Location & Map (Col 6) */}
          <div className="lg:col-span-6 space-y-6 gsap-reveal-card">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#c98a92] font-semibold block mb-2">
                Consultorio & Ubicación
              </span>
              <h2 className="font-serif-cormorant text-4xl font-semibold text-[#2c2725]">
                Vení a Conocer VIC
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#6b6462]">
                Te esperamos en nuestro espacio en Río Segundo para brindarte una atención personalizada, privada y relajante.
              </p>
            </div>

            {/* Address & Hours Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#ede8e3] space-y-4 shadow-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#f7eef0] text-[#c98a92] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-sm font-bold text-[#2c2725]">Dirección</h3>
                  <p className="text-xs text-[#6b6462] mt-0.5">
                    Mendoza 985, CP 5960, Río Segundo, Córdoba, Argentina.
                  </p>
                  <button
                    onClick={handleCopyAddress}
                    className="inline-flex items-center gap-1 text-[11px] text-[#c98a92] font-bold mt-1 hover:underline cursor-pointer"
                  >
                    {copiedAddress ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">¡Dirección copiada!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copiar dirección completa</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-2 border-t border-[#ede8e3]">
                <div className="w-10 h-10 rounded-2xl bg-[#f7eef0] text-[#c98a92] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#2c2725]">Horarios de Atención</h3>
                  <p className="text-xs text-[#6b6462] mt-0.5">
                    Lunes a Viernes: 09:00 a 20:00 hs.<br />
                    Sábados: 09:00 a 14:00 hs. (con turno previo).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-2 border-t border-[#ede8e3]">
                <div className="w-10 h-10 rounded-2xl bg-[#f7eef0] text-[#c98a92] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#2c2725]">Consultas Directas</h3>
                  <a
                    href={`https://wa.me/${BUSINESS_DATA.phone}?text=Hola!%20Quisiera%20hacer%20una%20consulta%20para%20VIC%20Est%C3%A9tica`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-[#c98a92] hover:underline inline-flex items-center gap-1.5 flex-wrap"
                  >
                    <span className="whitespace-nowrap font-bold">{BUSINESS_DATA.phoneDisplay}</span>
                    <span className="text-[#6b6462] font-normal whitespace-nowrap">(WhatsApp / Llamadas)</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Embedded Interactive Map Card */}
            <div className="bg-white rounded-3xl overflow-hidden border border-[#ede8e3] shadow-sm">
              <div className="p-4 bg-[#fcfaf7] border-b border-[#ede8e3] flex items-center justify-between">
                <span className="text-xs font-bold text-[#2c2725] flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-[#c98a92]" />
                  <span>Cómo llegar a Mendoza 985</span>
                </span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BUSINESS_DATA.address + ", Río Segundo, Córdoba")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-bold text-[#c98a92] hover:underline flex items-center gap-1"
                >
                  <span>Abrir en Google Maps</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
              <div className="w-full h-64 bg-neutral-100">
                <iframe
                  title="Ubicación VIC Estética Integral en Google Maps"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3395.731441865225!2d-63.9135043!3d-31.6508933!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9432ce3855555555%3A0x0!2sMendoza%20985%2C%20R%C3%ADo%20Segundo%2C%20C%C3%B3rdoba!5e0!3m2!1ses!2sar!4v1700000000000!5m2!1ses!2sar"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

          </div>

          {/* FAQ Accordion (Col 6) */}
          <div className="lg:col-span-6 space-y-6 gsap-reveal-card">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#c98a92] font-semibold block mb-2">
                Resolvemos tus Dudas
              </span>
              <h2 className="font-serif-cormorant text-4xl font-semibold text-[#2c2725]">
                Preguntas Frecuentes
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#6b6462]">
                Conocé todo sobre formas de pago, preparación previa a los tratamientos y cuidados posteriores.
              </p>
            </div>

            {/* FAQ Search and Filter */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-[#8a807d] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar duda (ej: dolor, botox, efectivo, sol)..."
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#ede8e3] text-xs text-[#2c2725] focus:outline-none focus:border-[#c98a92]"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                {[
                  { id: 'todos', label: 'Todas' },
                  { id: 'turnos', label: 'Turnos & Pagos' },
                  { id: 'facial', label: 'Facial & Botox' },
                  { id: 'laser', label: 'Depilación Láser' },
                  { id: 'kinesiologia', label: 'Kinesiología' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFaqCategory(cat.id)}
                    className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                      faqCategory === cat.id
                        ? 'bg-[#2c2725] text-white'
                        : 'bg-white text-[#6b6462] border border-[#ede8e3] hover:border-[#c98a92]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Accordion List */}
            <div className="space-y-3">
              {filteredFaqs.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-3xl border border-[#ede8e3] text-xs text-[#8a807d]">
                  No encontramos preguntas que coincidan con tu búsqueda.
                </div>
              ) : (
                filteredFaqs.map((faq, index) => {
                  const isExpanded = expandedFaqIndex === index;
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-2xl border border-[#ede8e3] overflow-hidden transition-all shadow-xs"
                    >
                      <button
                        onClick={() => setExpandedFaqIndex(isExpanded ? null : index)}
                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#faf7f2] transition-colors"
                      >
                        <span className="text-xs sm:text-sm font-bold text-[#2c2725]">
                          {faq.q}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#c98a92] shrink-0 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-[#6b6462] leading-relaxed border-t border-[#ede8e3]/60 bg-[#fcfaf7]/40 animate-in fade-in duration-150">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Still have questions? */}
            <div className="bg-[#fbf0f2] border border-[#f0d4d8] rounded-3xl p-6 text-center space-y-3">
              <h3 className="font-serif-cormorant text-xl font-bold text-[#2c2725]">
                ¿Tenés una consulta particular?
              </h3>
              <p className="text-xs text-[#6b6462] max-w-md mx-auto">
                Escribinos por WhatsApp y te asesoramos de forma personalizada sobre el tratamiento indicado para vos.
              </p>
              <a
                href={BUSINESS_DATA.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#c98a92] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#b57a82] transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Hablar con Mavi por WhatsApp</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export interface FooterProps {
  onOpenStaffLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenStaffLogin }) => {
  return (
    <footer className="bg-[#140e10] text-white pt-16 pb-12 border-t border-[#381f24] relative overflow-hidden">
      
      {/* Background Soft Glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#521d27]/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#3d161d]/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#381f24]">
          
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-start">
              <VicLogo variant="light" size="lg" className="items-start text-left" />
            </div>
            <p className="text-xs text-white/75 leading-relaxed pt-1 max-w-sm">
              {BUSINESS_DATA.description}
            </p>
            <div className="pt-2 flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#e5a8b0] bg-[#291419] px-3 py-1 rounded-full border border-[#e5a8b0]/30">
                Mendoza 985 · Río Segundo
              </span>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border border-[#e5a8b0]/50 flex items-center justify-center text-[#e5a8b0] text-[10px] bg-[#291419]">
                <Sparkles className="w-3 h-3" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#e5a8b0]">
                TRATAMIENTOS
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-white/80">
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#e5a8b0]" /><a href="#tratamientos" className="hover:text-[#e5a8b0] transition-colors">Medicina Estética (Dra. Gelso)</a></li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#e5a8b0]" /><a href="#tratamientos" className="hover:text-[#e5a8b0] transition-colors">Láser 4 Ondas (Trends)</a></li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#e5a8b0]" /><a href="#tratamientos" className="hover:text-[#e5a8b0] transition-colors">Alquimia (Ecleris MiniVac)</a></li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#e5a8b0]" /><a href="#tratamientos" className="hover:text-[#e5a8b0] transition-colors">VelaSlim Plus & Alpha Synergy</a></li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#e5a8b0]" /><a href="#tratamientos" className="hover:text-[#e5a8b0] transition-colors">Fisioterapia & Kinesiología</a></li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#e5a8b0]" /><a href="#tratamientos" className="hover:text-[#e5a8b0] transition-colors">Nutrición & Manicuría</a></li>
            </ul>
          </div>

          {/* Contact (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border border-[#e5a8b0]/50 flex items-center justify-center text-[#e5a8b0] text-[10px] bg-[#291419]">
                <Phone className="w-3 h-3" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#e5a8b0]">
                CONTACTO & TURNOS
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-white/80">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#e5a8b0] shrink-0 mt-0.5" />
                <span>Mendoza 985, Río Segundo, Córdoba</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#e5a8b0] shrink-0" />
                <a
                  href={BUSINESS_DATA.whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#e5a8b0] transition-colors font-semibold"
                >
                  WhatsApp: {BUSINESS_DATA.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="w-3.5 h-3.5 text-[#e5a8b0] shrink-0" />
                <a 
                  href={BUSINESS_DATA.instagram} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-[#e5a8b0] transition-colors"
                >
                  Instagram: {BUSINESS_DATA.instagramHandle}
                </a>
              </li>
            </ul>
          </div>

          {/* Hours (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border border-[#e5a8b0]/50 flex items-center justify-center text-[#e5a8b0] text-[10px] bg-[#291419]">
                <Clock className="w-3 h-3" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#e5a8b0]">
                DÍAS & HORARIOS
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-white/80">
              <li><strong className="text-[#e5a8b0] font-bold block">Jueves:</strong> 09:00 - 20:00 (Jornadas fijas)</li>
              <li><strong className="text-[#e5a8b0] font-bold block">Lunes a Sábados:</strong> Con turno coordinado</li>
              <li><strong className="text-white/50 block">Domingos:</strong> Cerrado</li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4">
          <p>© {new Date().getFullYear()} VIC Estética Integral. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Río Segundo, Córdoba, Argentina</span>
            {onOpenStaffLogin && (
              <button
                onClick={onOpenStaffLogin}
                className="text-white/40 hover:text-[#e5a8b0] transition-colors cursor-pointer flex items-center gap-1"
                title="Acceso exclusivo para recepcionista y Mavi"
              >
                <span>🔒 Acceso Recepción</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
