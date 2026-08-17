import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Crown, 
  CheckCircle2, 
  ShieldCheck, 
  Gift, 
  Calendar, 
  MessageCircle, 
  Clock,
  ArrowRight,
  Star,
  Zap,
  Heart
} from 'lucide-react';
import { BUSINESS_DATA, formatPrice } from '../data/aestheticData';

interface LuxuryConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MembershipTier {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  pricePerMonth: number;
  sessionsIncluded: string;
  perks: string[];
  isPopular?: boolean;
  idealFor: string;
}

const MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    id: 'tier-radiance',
    name: 'Glow & Skin Radiance',
    badge: 'Membresía Esencial',
    tagline: 'Cuidado facial y cosmiatría constante para mantener una piel oxigenada, luminosa e impecable todo el año.',
    pricePerMonth: 28000,
    sessionsIncluded: '1 Sesión Facial Premium mensual + 1 Peeling Químico o Dermaplaning de cortesía cada trimestre.',
    idealFor: 'Pieles jóvenes a intermedias que buscan prevención, luminosidad y control de poros.',
    perks: [
      '1 Sesión mensual a elección (Limpieza Profunda o Dermaplaning Glow)',
      '15% OFF adicional en cualquier servicio complementario',
      'Acceso prioritario a turnos en horarios centrales (tarde y sábados)',
      'Bar de infusiones detox y café de especialidad libre en cada visita',
      'Kit de muestras dermocosméticas personalizadas para el hogar'
    ]
  },
  {
    id: 'tier-couture',
    name: 'Haute Esthétique & Anti-Age',
    badge: 'Membresía Signature VIP',
    tagline: 'El programa más completo de medicina estética, estimulación de colágeno, kinesiología y cuidado integral.',
    pricePerMonth: 54000,
    sessionsIncluded: '2 Sesiones mensuales (1 Facial Avanzada + 1 Corporal Kinésica) + Control Médico Semestral.',
    isPopular: true,
    idealFor: 'Personas que buscan resultados antiedad de alto impacto, distensión corporal y atención personalizada.',
    perks: [
      '2 Sesiones mensuales combinadas (Faciales de alta gama + Kinesiología)',
      'Consulta de control y armonización facial con Médica Especialista incluida',
      '20% OFF en Toxina Botulínica y Ácido Hialurónico',
      'Canal exclusivo VIP de WhatsApp con atención directa de Mavi Tissera',
      'Turnos garantizados con reprogramación flexible sin penalidad',
      'Gift Card de $15.000 para obsequiar a un ser querido por año'
    ]
  },
  {
    id: 'tier-body-sculpt',
    name: 'Body Sculpt & Triláser Total',
    badge: 'Membresía Corporal Full',
    tagline: 'Programa intensivo de modelación corporal, drenaje linfático desinflamante y depilación definitiva sin dolor.',
    pricePerMonth: 46000,
    sessionsIncluded: '2 a 3 Sesiones mensuales de aparatología corporal + Triláser.',
    idealFor: 'Quienes desean remodelar su figura, combatir retención de líquidos y eliminar el vello de manera definitiva.',
    perks: [
      'Pase libre a sesiones programadas de Triláser en zonas elegidas',
      '2 Sesiones mensuales de Ultracavitación + Radiofrecuencia o Drenaje Kinésico',
      'Evaluación postural y medición de contorno con seguimiento fotográfico',
      '15% OFF en cosmética corporal domiciliaria',
      'Acceso a cabina de masajes descontracturantes con tarifa preferencial'
    ]
  }
];

export const LuxuryConciergeModal: React.FC<LuxuryConciergeModalProps> = ({ isOpen, onClose }) => {
  const [selectedTier, setSelectedTier] = useState<string>('tier-couture');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [preferredSchedule, setPreferredSchedule] = useState<string>('Tarde (15:00 a 20:00)');

  // Handle ESC key and lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentTier = MEMBERSHIP_TIERS.find(t => t.id === selectedTier) || MEMBERSHIP_TIERS[1];

  const handleSendConciergeRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    const message = `✨ *SOLICITUD CONCIERGE VIP — VIC ESTÉTICA INTEGRAL* ✨\n\n` +
      `👤 *Paciente:* ${clientName}\n` +
      `📞 *Contacto:* ${clientPhone || 'No especificado'}\n` +
      `👑 *Plan de Membresía Solicitado:* ${currentTier.name} (${currentTier.badge})\n` +
      `💳 *Inversión Mensual Estimada:* ${formatPrice(currentTier.pricePerMonth)}\n` +
      `🕒 *Preferencia Horaria:* ${preferredSchedule}\n\n` +
      `📍 *Sede:* Mendoza 985, Río Segundo\n` +
      `_Hola Mavi! Quisiera activar mi membresía personalizada y coordinar mi turno de diagnóstico inicial._`;

    const whatsappUrl = `https://wa.me/${BUSINESS_DATA.phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#241e1d]/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-[#fdfbf7] rounded-3xl border border-[#e8ded2] shadow-2xl overflow-hidden my-8"
      >
        
        {/* Luxury Gold Top Header */}
        <div className="bg-gradient-to-r from-[#2c2725] via-[#3a3330] to-[#2c2725] text-white p-6 sm:p-8 relative overflow-hidden">
          
          {/* Subtle Decorative Gold Flare */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#c98a92]/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 flex items-start justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c98a92]/30 border border-[#c98a92]/50 text-[#f0d4d8] text-[11px] font-bold uppercase tracking-widest">
                <Crown className="w-3.5 h-3.5 text-[#e5b3b9]" />
                <span>Haute Esthétique Concierge Privé</span>
              </div>
              <h3 className="font-serif-cormorant text-3xl sm:text-4xl font-semibold tracking-wide text-white">
                Membresías VIP & Protocolos a Medida
              </h3>
              <p className="text-xs sm:text-sm text-[#ded3cb] max-w-xl leading-relaxed">
                Diseñado para quienes buscan un estándar de excelencia médica, atención prioritaria y la tranquilidad de tener su rutina estética asegurada mes a mes.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0 ml-4"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Tier Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MEMBERSHIP_TIERS.map((tier) => {
              const isSelected = selectedTier === tier.id;
              return (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`relative rounded-3xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-[#c98a92] shadow-xl ring-2 ring-[#c98a92]/30 scale-[1.02]'
                      : 'bg-[#faf7f2] border-[#ede8e3] hover:border-[#c98a92]/60 hover:bg-white opacity-85 hover:opacity-100'
                  }`}
                >
                  {tier.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c98a92] text-white text-[10px] uppercase font-extrabold tracking-widest px-3 py-0.5 rounded-full shadow-md">
                      Recomendado VIP
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#c98a92]">
                        {tier.badge}
                      </span>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-[#c98a92] bg-[#c98a92]' : 'border-[#ded3cb]'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>

                    <h4 className="font-serif-cormorant text-xl font-bold text-[#2c2725] leading-tight">
                      {tier.name}
                    </h4>

                    <p className="text-[11px] text-[#6b6462] leading-relaxed">
                      {tier.tagline}
                    </p>

                    <div className="pt-2 border-t border-[#ede8e3]/80">
                      <span className="text-[10px] font-semibold text-[#c98a92] block uppercase tracking-wider">Abono Mensual VIP</span>
                      <span className="text-sm font-bold text-[#2c2725] block">
                        Beneficios Exclusivos
                      </span>
                      <span className="text-[10px] text-[#8a807d] block">Tarifa informada al coordinar</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#ede8e3]/80 text-[11px] font-medium text-[#4a423f] bg-[#fdfbf7] p-2.5 rounded-xl">
                    <span className="font-bold text-[#2c2725] block mb-0.5">Incluye:</span>
                    {tier.sessionsIncluded}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Selected Tier Dossier */}
          <div className="bg-[#faf7f2] rounded-3xl p-6 border border-[#ede8e3] space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#c98a92]" />
              <h4 className="font-serif-cormorant text-xl font-bold text-[#2c2725]">
                Beneficios Exclusivos de {currentTier.name}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#4a423f]">
              {currentTier.perks.map((perk, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-white p-3 rounded-2xl border border-[#ede8e3]">
                  <CheckCircle2 className="w-4 h-4 text-[#c98a92] shrink-0 mt-0.5" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Concierge Activation Form */}
          <form onSubmit={handleSendConciergeRequest} className="space-y-4 pt-2">
            <div className="text-center sm:text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#c98a92]">
                Paso Final · Activación Personalizada
              </span>
              <h4 className="font-serif-cormorant text-2xl font-bold text-[#2c2725]">
                Completá tus datos para coordinar con Mavi
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#6b6462] mb-1">
                  Tu Nombre y Apellido *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Sofía Benítez"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#ede8e3] bg-white text-xs text-[#2c2725] focus:outline-none focus:border-[#c98a92]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#6b6462] mb-1">
                  Teléfono / WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="Ej: 3572 123456"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#ede8e3] bg-white text-xs text-[#2c2725] focus:outline-none focus:border-[#c98a92]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#6b6462] mb-1">
                  Preferencia de Horario
                </label>
                <select
                  value={preferredSchedule}
                  onChange={(e) => setPreferredSchedule(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#ede8e3] bg-white text-xs text-[#2c2725] focus:outline-none focus:border-[#c98a92]"
                >
                  <option>Mañana (09:00 a 13:00)</option>
                  <option>Tarde (15:00 a 20:00)</option>
                  <option>Sábados (09:00 a 14:00)</option>
                  <option>Indistinto / Horario Flexible</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#ede8e3]">
              <div className="flex items-center gap-2 text-xs text-[#8a807d]">
                <ShieldCheck className="w-4 h-4 text-[#c98a92]" />
                <span>Sin contratos de permanencia obligatoria. Podés pausar cuando quieras.</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#2c2725] hover:bg-[#c98a92] text-white text-xs font-bold uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Solicitar Membresía vía WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

        </div>

      </div>

    </div>
  );
};
