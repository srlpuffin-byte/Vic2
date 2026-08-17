import React, { useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Activity, 
  Layers, 
  HelpCircle,
  MessageCircle,
  Flame,
  Maximize2
} from 'lucide-react';
import { EquipmentItem, BUSINESS_DATA } from '../data/aestheticData';

interface ClinicalEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: EquipmentItem | null;
  onOpenBooking: (serviceId?: string) => void;
}

export const ClinicalEquipmentModal: React.FC<ClinicalEquipmentModalProps> = ({
  isOpen,
  onClose,
  equipment,
  onOpenBooking
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !equipment) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-[#ede8e3] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#fbf0f2] border-b border-[#f0d4d8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#c98a92] text-white flex items-center justify-center shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#c98a92] bg-white px-2.5 py-0.5 rounded-full border border-[#f0d4d8]">
                  {equipment.brand}
                </span>
                <span className="text-[11px] text-[#6b6462] font-semibold">
                  {equipment.badge}
                </span>
              </div>
              <h2 className="font-serif-cormorant text-2xl sm:text-3xl font-bold text-[#2c2725] mt-0.5">
                {equipment.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white text-[#6b6462] hover:text-[#2c2725] hover:bg-[#ede8e3] flex items-center justify-center transition-colors cursor-pointer border border-[#ede8e3]"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* Photo & Main Presentation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-[#fdfbf7] p-4 sm:p-5 rounded-3xl border border-[#ede8e3]">
            <div className="md:col-span-5 h-56 sm:h-64 rounded-2xl overflow-hidden relative shadow-inner bg-black/5">
              <img 
                src={equipment.image} 
                alt={equipment.name}
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                {equipment.brand}
              </div>
            </div>

            <div className="md:col-span-7 space-y-2.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#c98a92] bg-[#fbf0f2] px-2.5 py-1 rounded-full border border-[#f0d4d8] inline-block">
                {equipment.badge}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-[#2c2725] tracking-wide leading-snug">
                {equipment.tagline}
              </h3>
              <p className="text-xs sm:text-sm text-[#4a423f] leading-relaxed">
                {equipment.description}
              </p>
            </div>
          </div>

          {/* Technical Specs Table */}
          <div className="bg-[#fdfbf7] rounded-2xl p-5 border border-[#ede8e3]">
            <div className="flex items-center gap-2 mb-4 text-[#2c2725] font-bold text-sm">
              <Activity className="w-4 h-4 text-[#c98a92]" />
              <span>Especificaciones Técnicas & Calibración de Cabina</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {equipment.keySpecs.map((spec, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-[#ede8e3]/80 shadow-2xs">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-[#8a807d] block mb-0.5">
                    {spec.label}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-[#2c2725]">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Actions & Benefits */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#c98a92] mb-3">
              Acciones Clínicas Comprobadas
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {equipment.clinicalActions.map((action, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#fbf0f2]/50 border border-[#f0d4d8]/60">
                  <CheckCircle2 className="w-4 h-4 text-[#c98a92] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-[#4a423f] leading-snug">
                    {action}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cabin Feel & Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#f7f4f0] border border-[#ede8e3]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b6462] block mb-1">
                Sensación en Cabina
              </span>
              <p className="text-xs sm:text-sm text-[#2c2725] leading-relaxed">
                {equipment.cabinExperience}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#f7f4f0] border border-[#ede8e3]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b6462] block mb-1">
                Frecuencia & Tiempos
              </span>
              <div className="text-xs sm:text-sm text-[#2c2725] space-y-1">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#c98a92]" />
                  <span><strong>Duración:</strong> {equipment.sessionDuration}</span>
                </div>
                <div className="text-xs text-[#6b6462]">
                  <strong>Protocolo recomendado:</strong> {equipment.frequency}
                </div>
              </div>
            </div>
          </div>

          {/* Target Application Areas */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b6462] block mb-2">
              Zonas de Aplicación Indicadas
            </span>
            <div className="flex flex-wrap gap-2">
              {equipment.idealFor.map((area, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1 bg-white border border-[#ede8e3] text-[#2c2725] text-xs rounded-full font-medium shadow-2xs"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#fdfbf7] border-t border-[#ede8e3] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#6b6462] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#c98a92]" />
            <span>Consultorio privado habilitado en Mendoza 985, Río Segundo</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={`https://wa.me/${BUSINESS_DATA.phone}?text=Hola!%20Quiero%20consultar%20por%20turnos%20para%20el%20equipo%20${encodeURIComponent(equipment.name)}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-full border border-[#ede8e3] text-[#2c2725] hover:bg-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={() => {
                onClose();
                onOpenBooking(equipment.relatedServiceId);
              }}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-[#c98a92] hover:bg-[#b57a82] text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Reservar Turno</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
