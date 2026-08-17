import React from 'react';
import { 
  Phone, 
  MapPin, 
  Instagram, 
  Calendar, 
  CalendarCheck, 
  Sparkles, 
  X as CloseIcon,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { BUSINESS_DATA } from '../data/aestheticData';
import { VicLogo } from './VicLogo';

interface VicExecutiveBannerProps {
  onOpenBooking: () => void;
  onOpenSystem?: (tab?: 'appointments' | 'giftcards' | 'issue-giftcard' | 'client-portal') => void;
  onOpenService?: (serviceName: string) => void;
  className?: string;
}

export const VicExecutiveBanner: React.FC<VicExecutiveBannerProps> = ({
  onOpenBooking,
  onOpenSystem,
  onOpenService,
  className = ''
}) => {
  const treatmentsList = [
    { title: 'Medicina Estética (Dra. Gelso)', id: 'srv-med-1' },
    { title: 'Láser 4 Ondas (Trends)', id: 'srv-dep-1' },
    { title: 'Alquimia (Ecleris MiniVac)', id: 'srv-fac-alquimia' },
    { title: 'VelaSlim Plus & Alpha Synergy', id: 'srv-corp-velaslim' },
    { title: 'Fisioterapia & Kinesiología', id: 'srv-kin-postural' },
    { title: 'Nutrición & Manicuria', id: 'srv-nut-plan' },
  ];

  return (
    <div className={`relative overflow-hidden rounded-[2.5rem] bg-[#160f11] text-white shadow-2xl border border-[#3e242a] select-none ${className}`}>
      
      {/* Background Ambient Glow & Subtle Wavy Curves matching reference */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft rose-burgundy ambient gradients */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#541e28]/40 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#4a1b24]/40 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2a1419]/50 via-transparent to-transparent pointer-events-none" />

        {/* Elegant glowing rose curves (SVG) */}
        <svg 
          className="absolute inset-0 w-full h-full opacity-25" 
          viewBox="0 0 1200 600" 
          fill="none" 
          preserveAspectRatio="none"
        >
          <path 
            d="M-100 200 C 300 450, 800 100, 1300 350" 
            stroke="#e5a8b0" 
            strokeWidth="1.5" 
            strokeOpacity="0.3"
          />
          <path 
            d="M-50 250 C 350 500, 850 150, 1350 400" 
            stroke="#c98a92" 
            strokeWidth="1" 
            strokeOpacity="0.2"
          />
          <path 
            d="M 900 -50 C 1050 200, 1100 400, 1250 650" 
            stroke="#e5a8b0" 
            strokeWidth="1.2" 
            strokeOpacity="0.25"
          />
        </svg>
      </div>

      <div className="relative z-10 p-6 sm:p-10 lg:p-12">
        
        {/* TOP SECTION: Logo + Narrative (Left) & Treatments Menu (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-8 border-b border-[#3e242a]">
          
          {/* Top Left: Vic Tissera Branding & Bio */}
          <div className="lg:col-span-6 flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-4">
            <div className="py-2">
              <VicLogo variant="light" size="xl" showSubtitle={true} />
            </div>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-md font-light">
              Espacio integral de aparatología de vanguardia, estética corporal y facial, depilación definitiva láser, fisioterapia, kinesiología, nutrición y manicuria en{' '}
              <span className="text-[#e5a8b0] font-medium">Río Segundo, Córdoba</span>.
            </p>
          </div>

          {/* Top Right: Treatments List with Lotus Icon */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* Header: Lotus Icon + TRATAMIENTOS + Rose line */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full border border-[#e5a8b0]/60 flex items-center justify-center text-[#e5a8b0] shrink-0 bg-[#2b161b]">
                {/* Lotus Flower SVG */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 4C10.5 7.5 8 10 4 11C8 12.5 10 15 12 20C14 15 16 12.5 20 11C16 10 13.5 7.5 12 4Z" />
                  <path d="M12 12C10.5 14 8.5 15.5 6 16C8.5 17 10 18.5 12 20C14 18.5 15.5 17 18 16C15.5 15.5 13.5 14 12 12Z" opacity="0.6" />
                </svg>
              </div>

              <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#e5a8b0] whitespace-nowrap">
                TRATAMIENTOS
              </span>

              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#e5a8b0]/60 via-[#e5a8b0]/20 to-transparent" />
            </div>

            {/* Treatment Bullets */}
            <ul className="space-y-2 text-xs sm:text-[13px] text-white/90">
              {treatmentsList.map((t, idx) => (
                <li 
                  key={idx} 
                  className="flex items-center gap-2.5 group cursor-pointer hover:text-[#e5a8b0] transition-colors"
                  onClick={() => onOpenBooking()}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e5a8b0] shrink-0 group-hover:scale-125 transition-transform" />
                  <span className="group-hover:translate-x-1 transition-transform">{t.title}</span>
                </li>
              ))}
            </ul>

          </div>

        </div>

        {/* BOTTOM SECTION: Contact & Turnos (Left) & Días & Horarios + Mis Turnos (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-8 items-center">
          
          {/* Bottom Left: Contacto & Turnos */}
          <div className="lg:col-span-6 space-y-3">
            
            {/* Header: Phone Outlined Icon + CONTACTO & TURNOS */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full border border-[#e5a8b0]/60 flex items-center justify-center text-[#e5a8b0] shrink-0 bg-[#2b161b]">
                <Phone className="w-4 h-4" />
              </div>

              <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#e5a8b0] whitespace-nowrap">
                CONTACTO & TURNOS
              </span>

              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#e5a8b0]/60 via-[#e5a8b0]/20 to-transparent" />
            </div>

            {/* Contact Items */}
            <div className="space-y-2 text-xs sm:text-[13px] text-white/90">
              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(BUSINESS_DATA.mapQuery)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 hover:text-[#e5a8b0] transition-colors group"
              >
                <MapPin className="w-4 h-4 text-[#e5a8b0] shrink-0 group-hover:scale-110 transition-transform" />
                <span>{BUSINESS_DATA.address}, Río Segundo, Córdoba</span>
              </a>

              <a 
                href={BUSINESS_DATA.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 hover:text-[#e5a8b0] transition-colors group"
              >
                <div className="w-4 h-4 flex items-center justify-center text-[#e5a8b0] shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <span>WhatsApp: <strong className="text-white font-bold">{BUSINESS_DATA.phoneDisplay}</strong></span>
              </a>

              <a 
                href={BUSINESS_DATA.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 hover:text-[#e5a8b0] transition-colors group"
              >
                <Instagram className="w-4 h-4 text-[#e5a8b0] shrink-0 group-hover:scale-110 transition-transform" />
                <span>Instagram: <strong className="text-white font-normal">{BUSINESS_DATA.instagramHandle}</strong></span>
              </a>
            </div>

          </div>

          {/* Bottom Right: Días & Horarios + "MIS TURNOS" Glowing Pill Button */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
            
            {/* Header: Zen/Meditation Person Icon + DÍAS & HORARIOS */}
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-full border border-[#e5a8b0]/60 flex items-center justify-center text-[#e5a8b0] shrink-0 bg-[#2b161b]">
                {/* Person / Zen Outlined SVG */}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="7" r="3" />
                  <path d="M5 21C5 17 8 14 12 14C16 14 19 17 19 21" />
                </svg>
              </div>

              <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#e5a8b0] whitespace-nowrap">
                DÍAS & HORARIOS
              </span>

              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#e5a8b0]/60 via-[#e5a8b0]/20 to-transparent" />
            </div>

            {/* Schedule Rows and MIS TURNOS CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              
              <div className="space-y-2 text-xs sm:text-[13px] text-white/90 flex-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#e5a8b0] shrink-0" />
                  <span><strong className="text-white font-bold">Jueves:</strong> 09:00 - 20:00 (Jornadas fijas)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#e5a8b0] shrink-0" />
                  <span><strong className="text-white font-bold">Lunes a Sábados:</strong> Personalizados con turno coordinado</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <CloseIcon className="w-3.5 h-3.5 text-[#e5a8b0]/60 shrink-0" />
                  <span><strong className="text-white font-bold">Domingos:</strong> Cerrado</span>
                </div>
              </div>

              {/* Exact Metallic Rose-Gold "MIS TURNOS" Button from reference */}
              {onOpenSystem && (
                <button
                  onClick={() => onOpenSystem('client-portal')}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-[#e5a8b0] to-[#f4c6ce] text-[#241316] text-xs sm:text-sm font-extrabold tracking-wider transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0 border border-white/30"
                >
                  <CalendarCheck className="w-4 h-4 text-[#241316]" />
                  <span>MIS TURNOS</span>
                </button>
              )}

            </div>

          </div>

        </div>

        {/* BOTTOM TAB: —— 📅 TURNOS ONLINE —— */}
        <div className="mt-8 pt-4 flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-center gap-3">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#e5a8b0]/40 to-[#e5a8b0]/60" />
            
            <button
              onClick={onOpenBooking}
              className="px-6 py-2 rounded-2xl border border-[#e5a8b0]/50 hover:border-[#e5a8b0] bg-[#221216] hover:bg-[#2e171d] text-[#e5a8b0] hover:text-white text-xs font-extrabold uppercase tracking-[0.25em] transition-all flex items-center gap-2 shadow-md cursor-pointer group"
            >
              <Calendar className="w-3.5 h-3.5 text-[#e5a8b0] group-hover:scale-110 transition-transform" />
              <span>TURNOS ONLINE</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#e5a8b0]/40 to-[#e5a8b0]/60" />
          </div>
        </div>

      </div>

    </div>
  );
};
