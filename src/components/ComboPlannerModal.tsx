import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  Plus, 
  Trash2, 
  Clock, 
  Banknote, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  MessageCircle 
} from 'lucide-react';
import { SERVICES_DATA, formatPrice, BUSINESS_DATA } from '../data/aestheticData';
import { ServiceItem } from '../types';

interface ComboPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookCombo: (services: ServiceItem[], paymentMethod: 'cash' | 'transfer') => void;
}

export const ComboPlannerModal: React.FC<ComboPlannerModalProps> = ({
  isOpen,
  onClose,
  onBookCombo,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'srv-fac-1', // Limpieza facial
    'srv-corp-1' // Masaje descontracturante
  ]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer'>('cash');
  const [patientName, setPatientName] = useState<string>('');

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

  const toggleService = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length === 1) return; // keep at least 1
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedServices = SERVICES_DATA.filter(s => selectedIds.includes(s.id));

  const totalCash = selectedServices.reduce((acc, curr) => acc + curr.priceCash, 0);
  const totalTransfer = selectedServices.reduce((acc, curr) => acc + curr.priceTransfer, 0);
  const totalSavings = totalTransfer - totalCash;

  const handleSendWhatsApp = () => {
    const listNames = selectedServices.map(s => `• ${s.name} (${s.duration})`).join('\n');
    const msg = 
      `✨ *SOLICITUD DE COMBO PERSONALIZADO — VIC ESTÉTICA INTEGRAL*\n\n` +
      (patientName.trim() ? `👤 *Nombre:* ${patientName}\n` : '') +
      `💆‍♀️ *Tratamientos seleccionados (${selectedServices.length}):*\n${listNames}\n\n` +
      `💳 *Preferencia de pago:* ${paymentMethod === 'cash' ? 'Efectivo con -15% bonificado' : 'Transferencia bancaria'}\n` +
      `📍 *Espacio:* Mendoza 985, Río Segundo, Córdoba.\n\n` +
      `¡Hola Mavi! Me gustaría consultar el presupuesto y coordinar un turno para realizarme este combo de tratamientos. ¿Qué días tienen disponibles?`;

    window.open(`https://wa.me/${BUSINESS_DATA.phone}?text=${encodeURIComponent(msg)}`, '_blank');
    onClose();
  };

  return (
    <div 
      id="combo-planner-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2c2725]/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="combo-planner-modal-card"
        className="bg-[#fcfaf7] rounded-3xl border border-[#ede8e3] shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#f5f0eb] p-6 border-b border-[#ede8e3] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#c98a92] text-white flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-cormorant text-2xl sm:text-3xl font-bold text-[#2c2725]">
                Armá tu Plan / Combo Personalizado
              </h3>
              <p className="text-xs text-[#6b6462]">
                Seleccioná los tratamientos que querés combinar para tu día de spa o rutina integral.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#6b6462] hover:text-[#2c2725] hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-sm">
          
          {/* Quick instructions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#fbf0f2] border border-[#f0d4d8] p-4 rounded-2xl text-xs text-[#4a423f]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#c98a92] shrink-0" />
              <span>
                Combiná 2 o más servicios en una misma visita para optimizar tu tiempo y obtener asesoramiento conjunto.
              </span>
            </div>
            <span className="font-bold text-[#c98a92] whitespace-nowrap">
              {selectedServices.length} {selectedServices.length === 1 ? 'servicio' : 'servicios'} en tu plan
            </span>
          </div>

          {/* Treatment selection grid */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#2c2725] mb-3">
              1. Seleccioná o desmarcá los tratamientos a combinar:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {SERVICES_DATA.map((srv) => {
                const isSelected = selectedIds.includes(srv.id);
                return (
                  <div
                    key={srv.id}
                    onClick={() => toggleService(srv.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-[#c98a92] bg-white shadow-sm ring-1 ring-[#c98a92]'
                        : 'border-[#ede8e3] bg-white/60 hover:bg-white hover:border-[#c98a92]/40 opacity-75'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-[#c98a92] uppercase tracking-wider">
                        {srv.category.replace('-', ' ')}
                      </span>
                      <h4 className="font-serif-cormorant text-base font-bold text-[#2c2725] leading-tight">
                        {srv.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-[#8a807d]">
                        <span>{srv.duration}</span>
                        <span>·</span>
                        <span className="font-semibold text-[#c98a92]">Atención personalizada</span>
                      </div>
                    </div>

                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'bg-[#c98a92] text-white' : 'bg-[#ede8e3] text-transparent'
                    }`}>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary Calculation Card */}
          <div className="bg-white rounded-3xl p-5 border border-[#ede8e3] shadow-md space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2c2725] flex items-center justify-between">
              <span>2. Resumen del Combo Personalizado</span>
              <span className="text-[#c98a92]">{selectedServices.length} Tratamientos</span>
            </h4>

            {/* Selected items list */}
            <div className="space-y-2 border-b border-[#ede8e3] pb-3">
              {selectedServices.map((s) => (
                <div key={s.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c98a92]" />
                    <span className="font-medium text-[#2c2725]">{s.name}</span>
                    <span className="text-[11px] text-[#8a807d]">({s.duration})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#c98a92] font-semibold">Incluido</span>
                    {selectedServices.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleService(s.id);
                        }}
                        className="text-[#9e9490] hover:text-red-500 p-0.5"
                        title="Quitar del combo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Method Preference */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                  paymentMethod === 'cash'
                    ? 'border-[#c98a92] bg-[#fbf0f2] text-[#2c2725]'
                    : 'border-[#ede8e3] bg-white text-[#6b6462]'
                }`}
              >
                <Banknote className="w-5 h-5 text-[#c98a92] shrink-0" />
                <div>
                  <span className="text-xs font-bold block">Efectivo (-15%)</span>
                  <span className="text-xs text-[#2c2725] font-semibold block mt-0.5">
                    Descuento bonificado
                  </span>
                  <span className="text-[10px] text-[#8a807d]">
                    Se abona en consultorio
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('transfer')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                  paymentMethod === 'transfer'
                    ? 'border-[#c98a92] bg-[#fbf0f2] text-[#2c2725]'
                    : 'border-[#ede8e3] bg-white text-[#6b6462]'
                }`}
              >
                <Calendar className="w-5 h-5 text-[#c98a92] shrink-0" />
                <div>
                  <span className="text-xs font-bold block">Transferencia / QR</span>
                  <span className="text-xs text-[#2c2725] font-semibold block mt-0.5">
                    Bancarizado / Digital
                  </span>
                  <span className="text-[10px] text-[#8a807d]">
                    Tarifa de lista
                  </span>
                </div>
              </button>
            </div>

            {/* Optional Name */}
            <div>
              <input
                type="text"
                placeholder="Tu nombre (opcional para el mensaje)..."
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#faf7f4] border border-[#ede8e3] rounded-xl text-xs text-[#2c2725] placeholder:text-[#9e9490] focus:ring-2 focus:ring-[#c98a92]/50 focus:outline-none"
              />
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#f5f0eb] border-t border-[#ede8e3] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onBookCombo(selectedServices, paymentMethod);
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-full border border-[#c98a92] text-[#c98a92] hover:bg-[#c98a92]/10 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Configurar en Formulario de Turnos
          </button>

          <button
            id="send-combo-whatsapp-btn"
            onClick={handleSendWhatsApp}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#c98a92] hover:bg-[#b57a82] text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Consultar Combo por WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
