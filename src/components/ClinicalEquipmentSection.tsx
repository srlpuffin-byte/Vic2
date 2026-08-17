import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Clock, 
  ChevronRight, 
  Camera
} from 'lucide-react';
import { EQUIPMENT_DATA, EquipmentItem } from '../data/aestheticData';
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
  const [, setPhotosVersion] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setPhotosVersion(v => v + 1);
    window.addEventListener('vic_custom_photos_updated', handleUpdate);
    return () => window.removeEventListener('vic_custom_photos_updated', handleUpdate);
  }, []);

  return (
    <section id="aparatologia" className="py-20 bg-gradient-to-b from-[#fdfbf7] via-white to-[#fdfbf7] border-t border-[#ede8e3] relative overflow-hidden">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[48rem] h-[48rem] bg-[#fbf0f2]/50 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 gsap-section-header">
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
            Aparatología & Tecnología en Cabina
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6b6462] leading-relaxed">
            Conocé en detalle los equipos y aparatología médica original que utilizamos en nuestro consultorio de Mendoza 985 para garantizarte máxima seguridad y resultados visibles.
          </p>
        </div>

        {/* Visual Equipment Grid for Quick Browsing */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs sm:text-sm text-[#6b6462]">
                Hacé clic en cualquier equipo para explorar su funcionamiento, protocolo clínico y ficha técnica
              </p>
            </div>
            <span className="text-xs font-bold text-[#c98a92] bg-[#fbf0f2] px-3 py-1 rounded-full border border-[#f0d4d8]">
              {EQUIPMENT_DATA.length} Tecnologías Médicas
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 gsap-reveal-card">
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
                  <div className="relative h-56 overflow-hidden bg-black/5">
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

                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="font-serif-cormorant text-xl font-bold text-[#2c2725] group-hover:text-[#c98a92] transition-colors leading-snug">
                        {eq.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#6b6462] line-clamp-2 mt-1.5 leading-relaxed">
                        {eq.tagline}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-[#ede8e3] flex items-center justify-between text-xs">
                      <span className="text-[#8a807d] font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#c98a92]" />
                        {eq.sessionDuration}
                      </span>
                      <span className="font-bold text-[#c98a92] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Ver Ficha Técnica
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
