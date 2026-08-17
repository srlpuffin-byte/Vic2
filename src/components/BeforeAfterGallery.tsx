import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Calendar,
  Layers,
  RotateCcw,
  Eye,
  Sliders,
  ZoomIn,
  ShieldCheck
} from 'lucide-react';
import { ServiceItem } from '../types';
import { SERVICES_DATA, formatPrice } from '../data/aestheticData';

interface BeforeAfterGalleryProps {
  onBookRelatedService: (service: ServiceItem) => void;
}

interface CaseStudy {
  id: string;
  title: string;
  category: string;
  area: string;
  description: string;
  serviceId: string;
  sessions: string;
  beforeImg: string;
  afterImg: string;
  keyImprovements: string[];
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'case-1',
    title: 'Alquimia MiniVac — Hidrodermoabrasión & Glow Facial',
    category: 'Cosmetología & Aparatología',
    area: 'Rostro Completo, Cuello & Escote',
    description: 'Protocolo de 4 fases con punta diamantada, vacumterapia, extracción indolora e infusión dérmica de ácido hialurónico y vitaminas.',
    serviceId: 'srv-fac-alquimia',
    sessions: '1 sesión inicial (efecto glow inmediato) + mantenimiento',
    beforeImg: 'https://images.unsplash.com/photo-1512290900672-1f4a9b2fc4bb?q=80&w=1000&auto=format&fit=crop',
    afterImg: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop',
    keyImprovements: ['Poros limpios y afinados', 'Hidratación profunda sin irritación', 'Luminosidad y textura de seda']
  },
  {
    id: 'case-2',
    title: 'Toxina Botulínica (Botox) & Armonización Facial',
    category: 'Medicina Estética (Dra. Gelso)',
    area: 'Frente, Entrecejo & Patas de Gallo',
    description: 'Aplicación médica de microdosis de toxina botulínica de alta pureza para relajar arrugas de expresión preservando la naturalidad.',
    serviceId: 'srv-med-botox',
    sessions: 'Efecto visible a las 48-72h y pleno a los 14 días',
    beforeImg: 'https://images.unsplash.com/photo-1588516903720-8ceb67f9ef84?q=80&w=1000&auto=format&fit=crop',
    afterImg: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop',
    keyImprovements: ['Atenuación visible de arrugas y líneas de expresión', 'Mirada descansada y rejuvenecida', 'Resultado armónico sin rigidez']
  },
  {
    id: 'case-3',
    title: 'VelaSlim Plus & Alpha Synergy — Modelación Corporal',
    category: 'Corporal de Alta Potencia',
    area: 'Abdomen, Flancos, Glúteos o Piernas',
    description: 'Combinación sinérgica de Radiofrecuencia bipolar/multipolar, vacum dinámico, rodillos mecánicos e infrarrojo para reducción y tensado.',
    serviceId: 'srv-corp-velaslim',
    sessions: 'Protocolo de 6 a 8 sesiones continuas',
    beforeImg: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=1000&auto=format&fit=crop',
    afterImg: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop',
    keyImprovements: ['Reducción de centímetros y alisado de celulitis', 'Tono y firmeza dérmica recuperados', 'Mejora de la circulación y drenaje']
  },
  {
    id: 'case-4',
    title: 'Depilación Láser 4 Longitudes de Onda (Trends)',
    category: 'Depilación Médica Definitiva',
    area: 'Piernas Completas, Axilas & Cavado',
    description: 'Tecnología de 4 ondas simultáneas (Alexandrita, Diodo, 940nm, Nd:YAG) con cabezal ultra-refrigerado bajo cero para una sesión indolora.',
    serviceId: 'srv-dep-2',
    sessions: '6 a 8 sesiones espaciadas cada 30 a 45 días',
    beforeImg: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=1000&auto=format&fit=crop',
    afterImg: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=1000&auto=format&fit=crop',
    keyImprovements: ['Eliminación progresiva del 90%+ del vello', 'Tratamiento 100% indoloro y seguro', 'Piel suave sin vellos encarnados']
  },
  {
    id: 'case-5',
    title: 'Fisioterapia & Drenaje Linfático Manual',
    category: 'Fisioterapia (Lic. Olga Aguirre)',
    area: 'Zona Cervicodorsal, Lumbar & Extremidades',
    description: 'Terapia manual kinésica combinada con electroestimulación y drenaje linfático para desinflamación y alivio del dolor.',
    serviceId: 'srv-fisio-drenaje',
    sessions: 'Sesiones semanales según prescripción kinésica',
    beforeImg: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop',
    afterImg: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=1000&auto=format&fit=crop',
    keyImprovements: ['Alivio de contracturas y dolores musculares', 'Descongestión profunda y desinflamación', 'Mayor rango de movilidad y bienestar']
  },
  {
    id: 'case-6',
    title: 'Bellelss Nails — Capping en Gel & Esmaltado Semipermanente',
    category: 'Manicuría Profesional',
    area: 'Uñas Naturales & Cutículas',
    description: 'Protección con capa de gel sobre uña natural para impedir quiebres, con esmaltado semipermanente de alto brillo duradero.',
    serviceId: 'srv-nail-capping',
    sessions: 'Service cada 21 a 28 días',
    beforeImg: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1000&auto=format&fit=crop',
    afterImg: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=1000&auto=format&fit=crop',
    keyImprovements: ['Uñas largas y fortalecidas sin roturas', 'Brillo espejo impecable durante semanas', 'Cuidado respetuoso de la cutícula']
  }
];

export const BeforeAfterGallery: React.FC<BeforeAfterGalleryProps> = ({ onBookRelatedService }) => {
  const [activeCaseIndex, setActiveCaseIndex] = useState<number>(0);
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // HD Clinical Loupe State
  const [isLoupeActive, setIsLoupeActive] = useState<boolean>(false);
  const [loupePos, setLoupePos] = useState<{ x: number; y: number; normX: number; normY: number }>({ x: 0, y: 0, normX: 0.5, normY: 0.5 });
  const [isMouseOverStage, setIsMouseOverStage] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const currentCase = CASE_STUDIES[activeCaseIndex];
  const relatedService = SERVICES_DATA.find(s => s.id === currentCase.serviceId) || SERVICES_DATA[0];

  // Navigate cases
  const handleNextCase = useCallback(() => {
    setActiveCaseIndex((prev) => (prev + 1) % CASE_STUDIES.length);
    setSliderPosition(50);
  }, []);

  const handlePrevCase = useCallback(() => {
    setActiveCaseIndex((prev) => (prev - 1 + CASE_STUDIES.length) % CASE_STUDIES.length);
    setSliderPosition(50);
  }, []);

  // Update slider position based on clientX
  const updatePosition = useCallback((clientX: number, clientY?: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = (clientY !== undefined) ? clientY - rect.top : rect.height / 2;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);

    const normX = Math.max(0, Math.min(1, x / rect.width));
    const normY = Math.max(0, Math.min(1, y / rect.height));
    setLoupePos({ x, y, normX, normY });
  }, []);

  // Mouse move handler for stage & loupe
  const handleStageMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const normX = Math.max(0, Math.min(1, x / rect.width));
    const normY = Math.max(0, Math.min(1, y / rect.height));
    setLoupePos({ x, y, normX, normY });
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isLoupeActive) return;
    setIsDragging(true);
    updatePosition(e.clientX, e.clientY);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updatePosition(e.clientX, e.clientY);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, updatePosition]);

  // Touch drag handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setTouchStartX(e.touches[0].clientX);
      updatePosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      updatePosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsDragging(false);
    if (touchStartX !== null && e.changedTouches.length === 1) {
      const touchEndX = e.changedTouches[0].clientX;
      const diffX = touchEndX - touchStartX;
      if (Math.abs(diffX) > 150) {
        if (diffX > 0) handlePrevCase();
        else handleNextCase();
      }
    }
    setTouchStartX(null);
  };

  // Determine which image the loupe is hovering over based on slider position
  const isLoupeOnBefore = (loupePos.normX * 100) < sliderPosition;
  const loupeImg = isLoupeOnBefore ? currentCase.beforeImg : currentCase.afterImg;

  return (
    <section id="antes-despues" className="py-20 bg-white border-t border-[#ede8e3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 gsap-section-header">
          <span className="text-xs uppercase tracking-[0.25em] text-[#c98a92] font-semibold block mb-2">
            Galería Clínica & Evidencia Real
          </span>
          <h2 className="font-serif-cormorant text-4xl sm:text-5xl font-semibold text-[#2c2725]">
            Resultados Antes & Después
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6b6462] leading-relaxed">
            Compará con precisión milimétrica la evolución clínica de nuestros pacientes. Arrastrá la barra divisoria o activá la <strong>Lupa Dermatológica HD</strong> para examinar textura dérmica y poros.
          </p>
        </div>

        {/* Case Selector Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {CASE_STUDIES.map((c, idx) => {
            const isActive = activeCaseIndex === idx;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setActiveCaseIndex(idx);
                  setSliderPosition(50);
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#2c2725] text-white border-[#2c2725] shadow-sm scale-105'
                    : 'bg-[#fcfaf7] text-[#6b6462] border-[#ede8e3] hover:border-[#c98a92] hover:text-[#2c2725]'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#c98a92]' : 'bg-[#ded3cb]'}`} />
                <span>{c.category}</span>
              </button>
            );
          })}
        </div>

        {/* Main Stage */}
        <div className="bg-[#fcfaf7] rounded-3xl border border-[#ede8e3] p-6 sm:p-8 lg:p-10 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Interactive Dual Image Comparison Splitter */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Image Container with ClipPath Split & HD Loupe */}
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleStageMouseMove}
              onMouseEnter={() => setIsMouseOverStage(true)}
              onMouseLeave={() => setIsMouseOverStage(false)}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`relative w-full aspect-[4/3] rounded-3xl overflow-hidden select-none border-2 border-white shadow-xl bg-neutral-900 touch-none group ${
                isLoupeActive ? 'cursor-none' : 'cursor-ew-resize'
              }`}
            >
              {/* After Image (Background) */}
              <img
                src={currentCase.afterImg}
                alt={`${currentCase.title} - Después`}
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                draggable={false}
              />
              <div className="absolute top-4 right-4 bg-[#2c2725]/85 text-white text-[11px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md shadow-md flex items-center gap-1.5 pointer-events-none z-10">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Después</span>
              </div>

              {/* Before Image (Revealed via ClipPath polygon) */}
              <div
                className="absolute inset-0 pointer-events-none transition-none"
                style={{
                  clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                  WebkitClipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                }}
              >
                <img
                  src={currentCase.beforeImg}
                  alt={`${currentCase.title} - Antes`}
                  className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                  draggable={false}
                />
                <div className="absolute top-4 left-4 bg-[#c98a92]/90 text-white text-[11px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md shadow-md flex items-center gap-1.5 pointer-events-none z-10">
                  <span className="w-2 h-2 rounded-full bg-amber-300" />
                  <span>Antes</span>
                </div>
              </div>

              {/* Slider Divider Line */}
              {!isLoupeActive && (
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl pointer-events-none z-20"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-[#2c2725] shadow-2xl flex items-center justify-center text-xs font-bold border-2 border-[#c98a92] group-hover:scale-110 transition-transform">
                    <Sliders className="w-4 h-4 text-[#c98a92]" />
                  </div>
                </div>
              )}

              {/* HD Clinical Loupe Overlay (2.5x Zoom) */}
              {isLoupeActive && isMouseOverStage && (
                <div
                  className="absolute w-40 h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden pointer-events-none z-30 ring-2 ring-[#c98a92]"
                  style={{
                    left: `${loupePos.x - 80}px`,
                    top: `${loupePos.y - 80}px`,
                  }}
                >
                  <div
                    className="w-full h-full bg-no-repeat"
                    style={{
                      backgroundImage: `url(${loupeImg})`,
                      backgroundSize: '300%',
                      backgroundPosition: `${loupePos.normX * 100}% ${loupePos.normY * 100}%`,
                    }}
                  />
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-[#2c2725]/85 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full backdrop-blur-xs">
                    {isLoupeOnBefore ? 'Antes 3X' : 'Después 3X'}
                  </div>
                </div>
              )}

              {/* Floating Case Counter badge */}
              <div className="absolute bottom-4 left-4 z-10 bg-black/60 backdrop-blur-md text-white text-[10px] uppercase font-semibold px-2.5 py-1 rounded-lg">
                Caso {activeCaseIndex + 1} de {CASE_STUDIES.length}
              </div>
            </div>

            {/* Quick Slider Adjustment Controls & Loupe Toggle */}
            <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoupeActive(false);
                    setSliderPosition(0);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer border ${
                    sliderPosition === 0 && !isLoupeActive ? 'bg-[#2c2725] text-white border-[#2c2725]' : 'bg-white text-[#6b6462] border-[#ede8e3] hover:border-[#c98a92]'
                  }`}
                >
                  Ver Después (100%)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLoupeActive(false);
                    setSliderPosition(50);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer border ${
                    sliderPosition === 50 && !isLoupeActive ? 'bg-[#c98a92] text-white border-[#c98a92]' : 'bg-white text-[#6b6462] border-[#ede8e3] hover:border-[#c98a92]'
                  }`}
                >
                  50 / 50
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLoupeActive(false);
                    setSliderPosition(100);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer border ${
                    sliderPosition === 100 && !isLoupeActive ? 'bg-[#2c2725] text-white border-[#2c2725]' : 'bg-white text-[#6b6462] border-[#ede8e3] hover:border-[#c98a92]'
                  }`}
                >
                  Ver Antes (100%)
                </button>
                
                {/* Loupe Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsLoupeActive(!isLoupeActive)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer border flex items-center gap-1.5 ${
                    isLoupeActive 
                      ? 'bg-[#c98a92] text-white border-[#c98a92] shadow-xs' 
                      : 'bg-white text-[#4a423f] border-[#ede8e3] hover:border-[#c98a92]'
                  }`}
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>{isLoupeActive ? 'Lupa HD Activa' : 'Lupa Dérmica'}</span>
                </button>
              </div>

              {/* Range Input for exact touch control */}
              {!isLoupeActive && (
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(Number(e.target.value))}
                    className="w-24 sm:w-32 accent-[#c98a92] cursor-pointer"
                    aria-label="Deslizador antes y después"
                  />
                  <span className="text-[11px] font-bold text-[#8a807d] w-8 text-right">
                    {Math.round(sliderPosition)}%
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Clinical Case Breakdown & Next/Prev Controls */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#c98a92]">
                  {currentCase.category} · {currentCase.area}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrevCase}
                    className="p-2 rounded-full bg-white border border-[#ede8e3] hover:border-[#c98a92] text-[#6b6462] hover:text-[#2c2725] transition-colors cursor-pointer"
                    title="Caso anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextCase}
                    className="p-2 rounded-full bg-white border border-[#ede8e3] hover:border-[#c98a92] text-[#6b6462] hover:text-[#2c2725] transition-colors cursor-pointer"
                    title="Siguiente caso"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-serif-cormorant text-2xl sm:text-3xl font-bold text-[#2c2725] leading-tight mt-1">
                {currentCase.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#6b6462] mt-2 leading-relaxed">
                {currentCase.description}
              </p>
            </div>

            {/* Protocol Box */}
            <div className="p-4 bg-white rounded-2xl border border-[#ede8e3] space-y-1 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a807d] block">
                Protocolo & Frecuencia:
              </span>
              <p className="text-xs font-semibold text-[#2c2725]">
                {currentCase.sessions}
              </p>
            </div>

            {/* Improvements Checklist */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2c2725] block">
                Resultados Clínicos Obtenidos:
              </span>
              <ul className="space-y-2 text-xs text-[#4a423f]">
                {currentCase.keyImprovements.map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#c98a92] shrink-0 mt-0.5" />
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Treatment & Booking Card */}
            <div className="p-4 bg-[#fbf0f2] border border-[#f0d4d8] rounded-2xl flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#b57a82] block">
                  Tratamiento Aplicado
                </span>
                <span className="text-xs font-bold text-[#2c2725] block">
                  {relatedService.name}
                </span>
                <span className="text-xs text-[#c98a92] font-semibold">
                  {relatedService.duration} · Atención personalizada
                </span>
              </div>

              <button
                id="book-from-before-after-btn"
                onClick={() => onBookRelatedService(relatedService)}
                className="px-5 py-2.5 rounded-full bg-[#c98a92] hover:bg-[#b57a82] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Reservar</span>
              </button>
            </div>

            {/* Filmstrip Carousel of all 6 Case Studies */}
            <div className="pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a807d] block mb-2">
                Deslizar a otro caso clínico:
              </span>
              <div className="grid grid-cols-6 gap-2">
                {CASE_STUDIES.map((c, idx) => {
                  const isCurrent = activeCaseIndex === idx;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setActiveCaseIndex(idx);
                        setSliderPosition(50);
                      }}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        isCurrent
                          ? 'border-[#c98a92] scale-105 shadow-md ring-2 ring-[#c98a92]/40'
                          : 'border-[#ede8e3] opacity-60 hover:opacity-100'
                      }`}
                      title={c.title}
                    >
                      <img
                        src={c.afterImg}
                        alt={c.title}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
