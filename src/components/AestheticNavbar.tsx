import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Calendar, 
  Menu, 
  X, 
  Sparkles, 
  Gift, 
  MessageCircle, 
  Instagram, 
  Layers,
  Crown,
  FlaskConical,
  ShieldCheck,
  CalendarCheck
} from 'lucide-react';
import { BUSINESS_DATA } from '../data/aestheticData';
import { SystemStorage } from '../utils/systemStorage';
import { VicLogo } from './VicLogo';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenGiftCard: () => void;
  onOpenComboPlanner: () => void;
  onOpenConcierge?: () => void;
  onOpenIngredients?: () => void;
  onOpenSystem?: (tab?: 'appointments' | 'giftcards' | 'issue-giftcard' | 'client-portal') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenBooking, 
  onOpenGiftCard,
  onOpenComboPlanner,
  onOpenConcierge,
  onOpenIngredients,
  onOpenSystem
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [appointmentsCount, setAppointmentsCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const all = SystemStorage.getAppointments();
      setAppointmentsCount(all.filter(a => a.status !== 'cancelled').length);
    };
    updateCount();
    window.addEventListener('vic_data_updated', updateCount);
    return () => window.removeEventListener('vic_data_updated', updateCount);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#fdfbf7]/95 backdrop-blur-md border-b border-[#ede8e3] transition-all">
      {/* Top Notification Bar */}
      <div className="bg-[#f5ede5] border-b border-[#ede8e3] text-[#4a423f] text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 text-center md:text-left">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center md:justify-start">
            <span className="inline-flex items-center gap-1 font-medium whitespace-nowrap">
              <MapPin className="w-3.5 h-3.5 text-[#c98a92] shrink-0" />
              <span>{BUSINESS_DATA.address}, Río Segundo</span>
            </span>
            <span className="hidden lg:inline-flex items-center gap-1 font-medium whitespace-nowrap">
              <Clock className="w-3.5 h-3.5 text-[#c98a92] shrink-0" />
              <span>Jueves 09:00 - 20:00 · Atención personalizada</span>
            </span>
            {onOpenSystem && (
              <button
                onClick={() => onOpenSystem('client-portal')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#c98a92]/40 text-[#9a5b63] font-bold hover:bg-[#fbf0f2] transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
              >
                <CalendarCheck className="w-3.5 h-3.5 text-[#c98a92] shrink-0" />
                <span>Mis Turnos</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold shrink-0 justify-center">
            <a 
              href={`https://wa.me/${BUSINESS_DATA.phone}?text=Hola!%20Quiero%20consultar%20sobre%20VIC%20Est%C3%A9tica%20Integral`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[#2c2725] hover:text-[#c98a92] transition-colors whitespace-nowrap shrink-0"
              title="Llamadas y WhatsApp directo"
            >
              <Phone className="w-3.5 h-3.5 text-[#c98a92] shrink-0" />
              <span className="whitespace-nowrap font-semibold tracking-wide">{BUSINESS_DATA.phoneDisplay}</span>
            </a>
            <a
              href={BUSINESS_DATA.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[#2c2725] hover:text-[#c98a92] transition-colors whitespace-nowrap shrink-0"
              title="Instagram Oficial"
            >
              <Instagram className="w-3.5 h-3.5 text-[#c98a92] shrink-0" />
              <span className="whitespace-nowrap">{BUSINESS_DATA.instagramHandle}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Official VICTissera Logo matching screenshot */}
          <a href="#inicio" className="flex items-center group py-1" title="VIC Estética Integral">
            <VicLogo size="md" className="group-hover:opacity-90 transition-opacity" />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-4 text-sm font-medium text-[#4a423f]">
            <a href="#inicio" className="hover:text-[#c98a92] transition-colors uppercase tracking-wider text-xs font-semibold">
              Inicio
            </a>
            <a href="#aparatologia" className="hover:text-[#c98a92] transition-colors uppercase tracking-wider text-xs font-semibold text-[#c98a92] font-bold">
              Aparatología
            </a>
            <a href="#diagnostico" className="hover:text-[#c98a92] transition-colors uppercase tracking-wider text-xs font-semibold">
              Diagnóstico
            </a>
            <a href="#tratamientos" className="hover:text-[#c98a92] transition-colors uppercase tracking-wider text-xs font-semibold">
              Tratamientos
            </a>
            <a href="#antes-despues" className="hover:text-[#c98a92] transition-colors uppercase tracking-wider text-xs font-semibold">
              Antes & Después
            </a>
            <a href="#profesionales" className="hover:text-[#c98a92] transition-colors uppercase tracking-wider text-xs font-semibold">
              Equipo
            </a>
            <a href="#experiencias" className="hover:text-[#c98a92] transition-colors uppercase tracking-wider text-xs font-semibold">
              Reseñas
            </a>
            {onOpenIngredients && (
              <button
                onClick={onOpenIngredients}
                className="hover:text-[#c98a92] transition-colors uppercase tracking-wider text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <FlaskConical className="w-3.5 h-3.5 text-[#c98a92]" />
                <span>Activos</span>
              </button>
            )}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            
            {onOpenSystem && (
              <button
                onClick={() => onOpenSystem('client-portal')}
                className="px-3 py-2 rounded-full bg-[#f5ede5] hover:bg-[#ebdcd0] border border-[#ede8e3] text-[#9a5b63] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Consultar estado de turno agendado o saldo de Gift Card"
              >
                <CalendarCheck className="w-3.5 h-3.5 text-[#c98a92]" />
                <span>Mis Turnos</span>
              </button>
            )}

            <button
              onClick={onOpenComboPlanner}
              className="px-3 py-2 rounded-full border border-[#ede8e3] hover:border-[#c98a92] text-[#4a423f] hover:text-[#c98a92] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
              title="Armar un combo personalizado de tratamientos"
            >
              <Layers className="w-3.5 h-3.5 text-[#c98a92]" />
              <span>Combo</span>
            </button>

            <button
              onClick={onOpenGiftCard}
              className="px-3.5 py-2 rounded-full border border-[#ede8e3] hover:border-[#c98a92] text-[#c98a92] hover:bg-[#c98a92]/10 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Gift Card</span>
            </button>

            <button
              id="navbar-book-btn"
              onClick={onOpenBooking}
              className="px-4 py-2 rounded-full bg-[#c98a92] hover:bg-[#b57a82] text-white text-xs font-bold uppercase tracking-widest transition-all shadow-sm flex items-center gap-1.5 cursor-pointer hover:shadow-md active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Reservar</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center gap-2">
            {onOpenSystem && (
              <button
                onClick={() => onOpenSystem('client-portal')}
                className="p-2 rounded-full bg-[#f5ede5] text-[#9a5b63] border border-[#ede8e3]"
                title="Mis Turnos"
              >
                <CalendarCheck className="w-4 h-4 text-[#c98a92]" />
              </button>
            )}

            <button
              id="mobile-book-icon-btn"
              onClick={onOpenBooking}
              className="p-2 rounded-full bg-[#c98a92] text-white shadow-xs"
              title="Reservar Turno"
            >
              <Calendar className="w-4 h-4" />
            </button>
            
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#2c2725] hover:bg-[#f0eae1] transition-colors"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#fdfbf7] border-b border-[#ede8e3] px-6 py-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-[#2c2725]">
            
            {onOpenSystem && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSystem('client-portal');
                }}
                className="py-2.5 flex items-center justify-between text-[#9a5b63] font-bold uppercase tracking-wider text-xs border-b border-[#ede8e3]/80 bg-[#f5ede5] px-3 rounded-xl"
              >
                <span className="flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-[#c98a92]" />
                  <span>Mis Turnos & Saldo de Gift Card</span>
                </span>
                <span className="bg-[#c98a92] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  Consultar
                </span>
              </button>
            )}

            <a 
              href="#inicio" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#ede8e3]/60 uppercase tracking-wider text-xs"
            >
              Inicio
            </a>
            <a 
              href="#aparatologia" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#ede8e3]/60 uppercase tracking-wider text-xs font-bold text-[#c98a92]"
            >
              Aparatología Médica en Cabina
            </a>
            <a 
              href="#diagnostico" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#ede8e3]/60 uppercase tracking-wider text-xs"
            >
              Diagnóstico en 30 Segundos
            </a>
            <a 
              href="#tratamientos" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#ede8e3]/60 uppercase tracking-wider text-xs"
            >
              Tratamientos & Precios
            </a>
            <a 
              href="#antes-despues" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#ede8e3]/60 uppercase tracking-wider text-xs"
            >
              Resultados Clínicos Antes & Después
            </a>
            <a 
              href="#profesionales" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#ede8e3]/60 uppercase tracking-wider text-xs"
            >
              Equipo Profesional
            </a>
            <a 
              href="#experiencias" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#ede8e3]/60 uppercase tracking-wider text-xs"
            >
              Reseñas y Experiencias
            </a>
            
            {onOpenIngredients && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenIngredients();
                }}
                className="py-2 flex items-center gap-2 text-[#2c2725] uppercase tracking-wider text-xs font-semibold text-left border-b border-[#ede8e3]/60"
              >
                <FlaskConical className="w-4 h-4 text-[#c98a92]" />
                <span>Guía de Principios Activos</span>
              </button>
            )}

            {onOpenConcierge && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenConcierge();
                }}
                className="py-2 flex items-center gap-2 text-[#b57a82] uppercase tracking-wider text-xs font-bold text-left border-b border-[#ede8e3]/60"
              >
                <Crown className="w-4 h-4 text-[#c98a92]" />
                <span>Membresías VIP Haute Esthétique</span>
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenComboPlanner();
              }}
              className="py-2 flex items-center gap-2 text-[#2c2725] uppercase tracking-wider text-xs font-semibold text-left border-b border-[#ede8e3]/60"
            >
              <Layers className="w-4 h-4 text-[#c98a92]" />
              <span>Armar Combo Personalizado</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenGiftCard();
              }}
              className="py-2 flex items-center gap-2 text-[#c98a92] uppercase tracking-wider text-xs font-semibold text-left"
            >
              <Gift className="w-4 h-4" />
              <span>Comprar / Canjear Gift Card</span>
            </button>
          </nav>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3 rounded-full bg-[#c98a92] text-white text-xs font-bold uppercase tracking-widest text-center shadow-sm cursor-pointer"
            >
              Reservar Turno Online
            </button>
            <a
              href={`https://wa.me/${BUSINESS_DATA.phone}?text=Hola!%20Quiero%20hacer%20una%20consulta%20para%20VIC%20Est%C3%A9tica%20Integral`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 rounded-full border border-[#c98a92] text-[#c98a92] text-xs font-semibold uppercase tracking-wider text-center"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
