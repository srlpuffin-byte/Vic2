import React, { useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  MessageCircle, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  Heart,
  Layers,
  Banknote,
  CreditCard
} from 'lucide-react';
import { ServiceItem } from '../types';
import { CLINICAL_PROTOCOLS, formatPrice, BUSINESS_DATA } from '../data/aestheticData';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onBook: (service: ServiceItem) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onBook,
}) => {
  // Handle ESC key and lock body scroll
  useEffect(() => {
    if (!service) return;

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
  }, [service, onClose]);

  if (!service) return null;

  const protocol = CLINICAL_PROTOCOLS[service.id];

  const defaultSteps = [
    { phase: "Fase 1: Evaluación Inicial", description: "Diagnóstico personalizado y ficha clínica del paciente." },
    { phase: "Fase 2: Preparación & Asepsia", description: "Higiene y acondicionamiento del área a tratar con productos hipoalergénicos." },
    { phase: "Fase 3: Protocolo Técnico Específico", description: "Aplicación de tecnología, maniobras manuales o activos de alta pureza." },
    { phase: "Fase 4: Finalización & Sellado", description: "Aplicación de emulsión regeneradora, hidratante o fotoprotección." }
  ];

  const defaultBenefits = [
    "Resultados visibles y progresivos acordes a tus metas",
    "Atención 100% personalizada por profesionales capacitadas",
    "Uso exclusivo de insumos y aparatología certificada",
    "Experiencia relajante en consultorio climatizado y privado"
  ];

  const defaultPreCare = [
    "Asistir con el área limpia y sin maquillaje ni cremas pesadas",
    "Informar al profesional sobre alergias o medicamentos en curso"
  ];

  const defaultPostCare = [
    "Mantener una adecuada hidratación diaria",
    "Seguir las pautas de cuidado domiciliario indicadas al finalizar la sesión",
    "Proteger la zona con protector solar según corresponda"
  ];

  const steps = protocol ? protocol.steps : defaultSteps;
  const benefits = protocol ? protocol.benefits : defaultBenefits;
  const preCare = protocol ? protocol.preCare : defaultPreCare;
  const postCare = protocol ? protocol.postCare : defaultPostCare;
  const recommendedSessions = protocol ? protocol.recommendedSessions : "Sujeto a evaluación profesional inicial.";

  return (
    <div 
      id="service-detail-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2c2725]/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="service-detail-modal-card"
        className="bg-[#fcfaf7] rounded-3xl border border-[#ede8e3] shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#f5f0eb] p-6 border-b border-[#ede8e3] flex items-start justify-between relative">
          <div className="space-y-1.5 pr-8">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#c98a92]">
                {service.category.replace('-', ' ')}
              </span>
              {service.popular && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#fbf0f2] text-[#b57a82] border border-[#f0d4d8] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Tratamiento Destacado</span>
                </span>
              )}
            </div>
            <h3 className="font-serif-cormorant text-2xl sm:text-3xl font-bold text-[#2c2725] leading-tight">
              {service.name}
            </h3>
            <div className="flex items-center gap-3 text-xs text-[#6b6462] pt-0.5">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#c98a92]" />
                <span>{service.duration} de sesión</span>
              </span>
              <span>·</span>
              <span className="text-[#8a807d]">Mendoza 985, Río Segundo</span>
            </div>
          </div>

          <button
            id="close-service-modal-btn"
            onClick={onClose}
            className="p-2 rounded-full text-[#6b6462] hover:text-[#2c2725] hover:bg-white transition-colors cursor-pointer"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-sm">
          
          {/* Main Description */}
          <div className="bg-white rounded-2xl p-5 border border-[#ede8e3] shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8a807d] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#c98a92]" />
              <span>Descripción del Tratamiento</span>
            </h4>
            <p className="text-sm text-[#4a423f] leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* Session Overview Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[#fbf0f2] border border-[#f0d4d8] rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#c98a92] flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#b57a82] uppercase tracking-wider block">
                  Atención Personalizada
                </span>
                <span className="text-sm font-bold text-[#2c2725]">
                  Sesión 1 a 1 en Cabina
                </span>
              </div>
            </div>

            <div className="bg-white border border-[#ede8e3] rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f5f0eb] text-[#6b6462] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-[#c98a92]" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-[#8a807d] uppercase tracking-wider block">
                  Duración Estimada
                </span>
                <span className="text-sm font-bold text-[#2c2725]">
                  {service.duration} de tratamiento
                </span>
              </div>
            </div>
          </div>

          {/* Clinical Steps Protocol */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2c2725] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#c98a92]" />
              <span>Protocolo Clínico de la Sesión</span>
            </h4>
            <div className="space-y-2.5">
              {steps.map((step, idx) => (
                <div 
                  key={idx}
                  className="bg-white rounded-xl p-3.5 border border-[#ede8e3] flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-[#f7eef0] text-[#c98a92] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#2c2725]">{step.phase}</h5>
                    <p className="text-xs text-[#6b6462] mt-0.5 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Benefits */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2c2725] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#c98a92]" />
              <span>Beneficios Principales</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {benefits.map((b, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-[#4a423f] bg-white p-2.5 rounded-xl border border-[#ede8e3]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c98a92] shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Frequency & Care Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-[#faf7f4] rounded-2xl p-4 border border-[#ede8e3] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a807d] block">
                Cuidados Previos
              </span>
              <ul className="space-y-1.5 text-xs text-[#6b6462]">
                {preCare.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#c98a92] font-bold">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#faf7f4] rounded-2xl p-4 border border-[#ede8e3] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a807d] block">
                Cuidados Posteriores
              </span>
              <ul className="space-y-1.5 text-xs text-[#6b6462]">
                {postCare.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#c98a92] font-bold">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Sessions Info */}
          <div className="p-3.5 rounded-2xl bg-[#f5f0eb] border border-[#ede8e3] flex items-center gap-2.5 text-xs text-[#4a423f]">
            <ShieldCheck className="w-4 h-4 text-[#c98a92] shrink-0" />
            <span><strong>Frecuencia sugerida:</strong> {recommendedSessions}</span>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#f5f0eb] border-t border-[#ede8e3] flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href={`https://wa.me/${BUSINESS_DATA.phone}?text=Hola!%20Quiero%20hacer%20una%20consulta%20m%C3%A9dico-est%C3%A9tica%20sobre%20*${encodeURIComponent(service.name)}*`}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-5 py-3 rounded-full border border-[#c98a92] text-[#c98a92] hover:bg-[#c98a92]/10 text-xs font-semibold text-center transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Consultar por WhatsApp</span>
          </a>

          <button
            id="modal-book-this-service-btn"
            onClick={() => {
              onClose();
              onBook(service);
            }}
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#c98a92] hover:bg-[#b57a82] text-white text-xs font-bold uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Calendar className="w-4 h-4" />
            <span>Reservar Turno Ahora</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
