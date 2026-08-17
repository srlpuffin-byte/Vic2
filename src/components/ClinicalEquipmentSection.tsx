import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Activity, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Maximize2, 
  MessageCircle, 
  Calendar,
  Sliders,
  Flame,
  Award,
  Eye,
  Camera
} from 'lucide-react';
import { EQUIPMENT_DATA, EquipmentItem, BUSINESS_DATA } from '../data/aestheticData';
import { ClinicalEquipmentModal } from './ClinicalEquipmentModal';
import { PhotoManagerModal } from './PhotoManagerModal';
import { CustomPhotoStorage } from '../utils/customPhotoStorage';

interface ClinicalEquipmentSectionProps {
  onOpenBooking: (serviceId?: string) => void;
}

export const ClinicalEquipmentSection: React.FC<ClinicalEquipmentSectionProps> = ({ onOpenBooking }) => {
  const [selectedEqId, setSelectedEqId] = useState<string>('eq-trends-laser');
  const [modalEquipment, setModalEquipment] = useState<EquipmentItem | null>(null);
  const [isPhotoManagerOpen, setIsPhotoManagerOpen] = useState(false);
  const [photosVersion, setPhotosVersion] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setPhotosVersion(v => v + 1);
    window.addEventListener('vic_custom_photos_updated', handleUpdate);
    return () => window.removeEventListener('vic_custom_photos_updated', handleUpdate);
  }, []);

  const rawEquipment = EQUIPMENT_DATA.find(eq => eq.id === selectedEqId) || EQUIPMENT_DATA[0];
  const currentEquipment = {
    ...rawEquipment,
    image: CustomPhotoStorage.getPhoto(rawEquipment.id, rawEquipment.image)
  };

  return (
    <section id="aparatologia" className="py-20 bg-gradient-to-b from-[#fdfbf7] via-white to-[#fdfbf7] border-t border-[#ede8e3] relative overflow-hidden">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[48rem] h-[48rem] bg-[#fbf0f2]/50 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 gsap-section-header">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
            <div className="inline-flex items-center gap-2 bg-[#fbf0f2] border border-[#f0d4d8] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#c98a92] shadow-2xs">
              <Zap className="w-3.5 h-3.5" />
              <span>Aparatología Médica & Tecnológica en Cabina</span>
            </div>

            <button
              onClick={() => setIsPhotoManagerOpen(true)}
              className="inline-flex items-center gap-1.5 bg-[#2c2725] hover:bg-black text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-2xs transition-all cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-[#c98a92]" />
              <span>Subir / Reemplazar Fotos Reales</span>
            </button>
          </div>

          <h2 className="font-serif-cormorant text-4xl sm:text-5xl font-semibold text-[#2c2725]">
            Tecnología Real y Certificada en Río Segundo
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6b6462] leading-relaxed">
            Conocé en detalle los equipos y aparatología médica original que utilizamos en nuestro consultorio de Mendoza 985 para garantizarte máxima seguridad y resultados visibles.
          </p>
        </div>

        {/* Equipment Selector Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {EQUIPMENT_DATA.map((eq) => {
            const isActive = eq.id === selectedEqId;
            return (
              <button
                key={eq.id}
                onClick={() => setSelectedEqId(eq.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 border ${
                  isActive
                    ? 'bg-[#c98a92] text-white border-[#c98a92] shadow-md scale-105'
                    : 'bg-white text-[#4a423f] border-[#ede8e3] hover:border-[#c98a92]/40 hover:bg-[#fbf0f2]'
                }`}
              >
                <Zap className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#c98a92]'}`} />
                <span>{eq.name.split('—')[0].trim()}</span>
              </button>
            );
          })}
        </div>

        {/* Main Equipment Showcase Card */}
        <div className="bg-white rounded-3xl border border-[#ede8e3] shadow-xl overflow-hidden gsap-reveal-card mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Col: High Resolution Device Photo & Overlay (5 Cols) */}
            <div className="lg:col-span-5 relative min-h-[380px] lg:min-h-[480px] overflow-hidden group">
              <img 
                src={currentEquipment.image} 
                alt={currentEquipment.name}
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60 pointer-events-none" />

              {/* Floating Top Brand Pill */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-xs">
                  <Award className="w-3.5 h-3.5 text-[#c98a92]" />
                  <span>{currentEquipment.brand}</span>
                </div>

                <span className="text-[11px] font-extrabold uppercase tracking-wider text-white bg-[#c98a92] px-3 py-1 rounded-full shadow-xs">
                  {currentEquipment.badge}
                </span>
              </div>

              {/* Bottom In-Image Information Overlay */}
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <div className="bg-black/70 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-white">
                  <div className="flex items-center justify-between text-[11px] text-white/80 font-mono mb-1.5 border-b border-white/10 pb-1.5">
                    <span className="flex items-center gap-1 text-[#f5ede5]">
                      <Sliders className="w-3 h-3 text-[#c98a92]" />
                      <span>DISPOSITIVO CLÍNICO</span>
                    </span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      EN CONSULTORIO
                    </span>
                  </div>

                  <h3 className="font-serif-cormorant text-xl sm:text-2xl font-bold text-white leading-tight">
                    {currentEquipment.name}
                  </h3>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                    <span className="text-xs text-white/80 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#c98a92]" />
                      {currentEquipment.sessionDuration}
                    </span>
                    <button
                      onClick={() => setModalEquipment(currentEquipment)}
                      className="text-xs font-bold text-[#c98a92] hover:text-white transition-colors flex items-center gap-1 cursor-pointer bg-white/10 px-2.5 py-1 rounded-lg hover:bg-[#c98a92]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Ver Ficha
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Col: Deep Specs & Clinical Protocol (7 Cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              
              {/* Detailed Description */}
              <div>
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#c98a92] block mb-1">
                  Descripción Clínica & Principio Físico
                </span>
                <h4 className="text-base sm:text-lg font-bold text-[#2c2725] mb-2 leading-snug">
                  {currentEquipment.tagline}
                </h4>
                <p className="text-sm sm:text-base text-[#4a423f] leading-relaxed">
                  {currentEquipment.description}
                </p>
              </div>

              {/* Technical Specifications Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentEquipment.keySpecs.slice(0, 4).map((spec, idx) => (
                  <div key={idx} className="p-3 bg-[#fdfbf7] rounded-2xl border border-[#ede8e3]">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#8a807d] block mb-0.5">
                      {spec.label}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-[#2c2725] leading-snug">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Clinical Actions */}
              <div>
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#6b6462] block mb-2.5">
                  Beneficios & Acciones en Piel y Músculo
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentEquipment.clinicalActions.map((action, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#4a423f]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#c98a92] shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action Row */}
              <div className="pt-4 border-t border-[#ede8e3] flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={() => setModalEquipment(currentEquipment)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-[#ede8e3] hover:border-[#c98a92] text-[#2c2725] text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer bg-white hover:bg-[#fbf0f2]"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[#c98a92]" />
                  <span>Ver Ficha Técnica Completa</span>
                </button>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <a
                    href={`https://wa.me/${BUSINESS_DATA.phone}?text=Hola!%20Quiero%20consultar%20sobre%20el%20tratamiento%20con%20${encodeURIComponent(currentEquipment.name)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-full bg-[#f7f4f0] hover:bg-[#ede8e3] text-[#2c2725] transition-colors border border-[#ede8e3]"
                    title="Consultar por WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  </a>

                  <button
                    onClick={() => onOpenBooking(currentEquipment.relatedServiceId)}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-[#c98a92] hover:bg-[#b57a82] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Reservar Sesión</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Visual Equipment Grid for Quick Browsing */}
        <div className="mt-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif-cormorant text-2xl sm:text-3xl font-bold text-[#2c2725]">
                Galería de Equipos & Cabina
              </h3>
              <p className="text-xs sm:text-sm text-[#6b6462]">
                Hacé clic en cualquier equipo para explorar su funcionamiento y tecnología
              </p>
            </div>
            <span className="text-xs font-bold text-[#c98a92] bg-[#fbf0f2] px-3 py-1 rounded-full border border-[#f0d4d8]">
              {EQUIPMENT_DATA.length} Tecnologías
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {EQUIPMENT_DATA.map((eq) => {
              const isSelected = eq.id === selectedEqId;
              const eqImage = CustomPhotoStorage.getPhoto(eq.id, eq.image);
              const customEq = { ...eq, image: eqImage };

              return (
                <div
                  key={eq.id}
                  onClick={() => {
                    setSelectedEqId(eq.id);
                    setModalEquipment(customEq);
                  }}
                  className={`group bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isSelected ? 'border-[#c98a92] ring-2 ring-[#c98a92]/30' : 'border-[#ede8e3]'
                  }`}
                >
                  <div className="relative h-48 overflow-hidden bg-black/5">
                    <img 
                      src={eqImage} 
                      alt={eq.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                      {eq.brand}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-[#c98a92] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                      {eq.badge}
                    </div>
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="font-serif-cormorant text-lg font-bold text-[#2c2725] group-hover:text-[#c98a92] transition-colors leading-snug">
                        {eq.name}
                      </h4>
                      <p className="text-xs text-[#6b6462] line-clamp-2 mt-1 leading-relaxed">
                        {eq.tagline}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#ede8e3] flex items-center justify-between text-xs">
                      <span className="text-[#8a807d] font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#c98a92]" />
                        {eq.sessionDuration}
                      </span>
                      <span className="font-bold text-[#c98a92] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Ver Detalles
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Deep-dive Technical Modal */}
      <ClinicalEquipmentModal
        isOpen={!!modalEquipment}
        onClose={() => setModalEquipment(null)}
        equipment={modalEquipment}
        onOpenBooking={onOpenBooking}
      />

      {/* Real Photos Uploader / Manager Modal */}
      <PhotoManagerModal
        isOpen={isPhotoManagerOpen}
        onClose={() => setIsPhotoManagerOpen(false)}
      />
    </section>
  );
};
