import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles, 
  Info, 
  Camera, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { EQUIPMENT_DATA, EquipmentItem } from '../data/aestheticData';
import { CustomPhotoStorage, CustomPhotosMap } from '../utils/customPhotoStorage';

interface PhotoManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhotoManagerModal: React.FC<PhotoManagerModalProps> = ({ isOpen, onClose }) => {
  const [customPhotos, setCustomPhotos] = useState<CustomPhotosMap>({});
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadPhotos = () => {
    setCustomPhotos(CustomPhotoStorage.getPhotos());
  };

  useEffect(() => {
    if (isOpen) {
      loadPhotos();
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTriggerUpload = (equipmentId: string) => {
    setActiveUploadId(equipmentId);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadId) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor seleccioná un archivo de imagen válido (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      CustomPhotoStorage.savePhoto(activeUploadId, result);
      loadPhotos();
      setSuccessMessage('¡Foto actualizada con éxito en la web!');
      setTimeout(() => setSuccessMessage(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCustomPhoto = (equipmentId: string) => {
    CustomPhotoStorage.removePhoto(equipmentId);
    loadPhotos();
    setSuccessMessage('Foto restablecida a la imagen predeterminada');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleResetAll = () => {
    if (window.confirm('¿Querés restablecer todas las fotos a los valores predeterminados?')) {
      CustomPhotoStorage.resetAll();
      loadPhotos();
      setSuccessMessage('Todas las fotos han sido restablecidas');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-[#ede8e3] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#fbf0f2] border-b border-[#f0d4d8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#c98a92] text-white flex items-center justify-center shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-cormorant text-2xl sm:text-3xl font-bold text-[#2c2725]">
                Cargar Fotos Reales de Consultorio
              </h2>
              <p className="text-xs text-[#6b6462]">
                Subí las fotos originales de WhatsApp o tu celular para cada equipo y espacio de Mendoza 985
              </p>
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

        {/* Feedback Banner */}
        {successMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs text-emerald-800 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Informative Guidance */}
        <div className="p-6 bg-[#fdfbf7] border-b border-[#ede8e3] flex items-start gap-3 text-xs text-[#4a423f]">
          <Info className="w-4 h-4 text-[#c98a92] shrink-0 mt-0.5" />
          <div>
            <strong>¿Por qué subir tus fotos aquí?</strong> Las fotos enviadas por el chat se utilizan para diseñar la estructura, pero podés cargar directamente desde tu dispositivo tus archivos originales de WhatsApp (fotos de la máquina <em>Trends Láser</em>, <em>Ecleris MiniVac</em>, <em>Alpha Synergy</em>, <em>VelaSlim</em>, <em>Teslagen</em> o la <em>Cabina</em>). Quedarán guardadas y visibles al instante.
          </div>
        </div>

        {/* Scrollable List of Equipment & Cabin Slots */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EQUIPMENT_DATA.map((eq) => {
              const hasCustom = !!customPhotos[eq.id];
              const displayImage = customPhotos[eq.id] || eq.image;

              return (
                <div 
                  key={eq.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    hasCustom ? 'bg-emerald-50/40 border-emerald-300' : 'bg-white border-[#ede8e3]'
                  }`}
                >
                  <div className="flex gap-4 items-start">
                    {/* Thumbnail preview */}
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-black/5 shrink-0 relative border border-[#ede8e3]">
                      <img 
                        src={displayImage} 
                        alt={eq.name} 
                        className="w-full h-full object-cover"
                      />
                      {hasCustom && (
                        <div className="absolute top-1 right-1 bg-emerald-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                          Personalizada
                        </div>
                      )}
                    </div>

                    {/* Info and Actions */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#c98a92] bg-[#fbf0f2] px-2 py-0.5 rounded-full">
                          {eq.brand}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#2c2725] truncate">
                        {eq.name}
                      </h4>
                      <p className="text-[11px] text-[#6b6462] line-clamp-1 mt-0.5">
                        {eq.badge}
                      </p>

                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => handleTriggerUpload(eq.id)}
                          className="px-3 py-1.5 rounded-xl bg-[#c98a92] hover:bg-[#b57a82] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{hasCustom ? 'Cambiar Foto' : 'Subir Mi Foto'}</span>
                        </button>

                        {hasCustom && (
                          <button
                            onClick={() => handleRemoveCustomPhoto(eq.id)}
                            className="p-1.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors border border-red-200 cursor-pointer"
                            title="Quitar foto personalizada y usar la predeterminada"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#fdfbf7] border-t border-[#ede8e3] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleResetAll}
            className="text-xs text-[#8a807d] hover:text-red-600 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restablecer todas las fotos</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#2c2725] text-white text-xs font-bold hover:bg-black transition-all cursor-pointer text-center"
          >
            Listo, Volver a la Web
          </button>
        </div>

      </div>
    </div>
  );
};
