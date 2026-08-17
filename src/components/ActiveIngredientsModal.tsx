import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Droplet, 
  Sun, 
  ShieldCheck, 
  FlaskConical, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  Search,
  ExternalLink
} from 'lucide-react';
import { ServiceItem } from '../types';
import { SERVICES_DATA } from '../data/aestheticData';

interface ActiveIngredientsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookServiceWithIngredient?: (service: ServiceItem) => void;
}

interface IngredientData {
  id: string;
  name: string;
  chemicalFamily: string;
  origin: string;
  targetLayer: string; // Epidermis, Dermis, Estrato Córneo, Hipodermis
  dermatologicalAction: string;
  clinicalBenefits: string[];
  recommendedSkinTypes: string;
  relatedServiceIds: string[];
  iconColor: string;
}

const INGREDIENTS_DATABASE: IngredientData[] = [
  {
    id: 'ing-ha',
    name: 'Ácido Hialurónico Biocompatible',
    chemicalFamily: 'Glicosaminoglicano Hidrófilo (Bajo y Alto Peso Molecular)',
    origin: 'Biotecnología de fermentación bacteriana estéril',
    targetLayer: 'Epidermis y Dermis Papilar',
    dermatologicalAction: 'Retiene hasta 1000 veces su peso en agua, redensifica la matriz extracelular y alisa líneas finas por turgencia.',
    clinicalBenefits: [
      'Hidratación profunda tridimensional sin oclusión',
      'Restauración inmediata del volumen y elasticidad dérmica',
      'Aceleración de la cicatrización y regeneración tisular post-peeling'
    ],
    recommendedSkinTypes: 'Todo tipo de piel, especialmente deshidratadas, apagadas o con líneas finas.',
    relatedServiceIds: ['srv-fac-1', 'srv-fac-2', 'srv-fac-3', 'srv-med-1'],
    iconColor: 'bg-sky-50 text-sky-600 border-sky-200'
  },
  {
    id: 'ing-botox',
    name: 'Toxina Botulínica Tipo A Purificada',
    chemicalFamily: 'Neuromodulador Médico Certificado',
    origin: 'Complejo proteico biofarmacéutico estéril',
    targetLayer: 'Unión Neuromuscular Facial (Placa Motora)',
    dermatologicalAction: 'Inhibe temporalmente la liberación de acetilcolina, relajando la musculatura facial hiperactiva sin alterar la expresión natural.',
    clinicalBenefits: [
      'Suavizado radical de arrugas dinámicas (frente, entrecejo, perioculares)',
      'Prevención activa de la formación de surcos profundos permanentes',
      'Efecto lifting sutil y mirada descansada durante 4 a 6 meses'
    ],
    recommendedSkinTypes: 'Pieles con líneas de expresión marcadas o gesticulación facial acentuada.',
    relatedServiceIds: ['srv-med-1'],
    iconColor: 'bg-rose-50 text-rose-600 border-rose-200'
  },
  {
    id: 'ing-mandelic',
    name: 'Ácido Mandélico & Salicílico',
    chemicalFamily: 'Alfa y Beta Hidroxiácidos (AHA & BHA)',
    origin: 'Derivado de almendras amargas y corteza de sauce',
    targetLayer: 'Estrato Córneo y Complejo Pilosebáceo',
    dermatologicalAction: 'Exfoliación química suave de gran peso molecular, acción queratolítica, seborreguladora y antibacteriana.',
    clinicalBenefits: [
      'Desobstrucción profunda de poros y comedones sin irritación',
      'Control del sebo y atenuación de secuelas pigmentarias post-acné',
      'Apto para uso seguro incluso en pieles sensibles y en verano'
    ],
    recommendedSkinTypes: 'Pieles grasas, mixtas, propensas al acné o con manchas solares.',
    relatedServiceIds: ['srv-fac-1', 'srv-fac-3'],
    iconColor: 'bg-amber-50 text-amber-600 border-amber-200'
  },
  {
    id: 'ing-centella',
    name: 'Centella Asiática & Fosfatidilcolina Liposomal',
    chemicalFamily: 'Triterpenos & Fosfolípidos Bioactivos',
    origin: 'Extractos botánicos puros microencapsulados',
    targetLayer: 'Hipodermis y Red Microvascular Dérmica',
    dermatologicalAction: 'Estimula la síntesis de colágeno Tipo I, activa el drenaje de toxinas y fluidifica la membrana adipocitaria.',
    clinicalBenefits: [
      'Reducción visible del aspecto de piel de naranja (celulitis)',
      'Mejora notable del tono venoso y desinflamación de piernas pesadas',
      'Reafirmación tisular y prevención de flacidez corporal'
    ],
    recommendedSkinTypes: 'Tratamientos corporales de modelación, celulitis y post-operatorios.',
    relatedServiceIds: ['srv-corp-2', 'srv-corp-3', 'srv-mod-1', 'srv-mod-2'],
    iconColor: 'bg-emerald-50 text-emerald-600 border-emerald-200'
  },
  {
    id: 'ing-vitc',
    name: 'Vitamina C Estabilizada & Niacinamida al 4%',
    chemicalFamily: 'Complejo Antioxidante & Vitamina B3',
    origin: 'Ácido L-Ascórbico liposomado de alta biodisponibilidad',
    targetLayer: 'Epidermis y Melanocitos Basales',
    dermatologicalAction: 'Neutraliza radicales libres generados por la radiación UV, inhibe la transferencia de melanina y estimula fibroblastos.',
    clinicalBenefits: [
      'Glow y luminosidad uniforme instantánea en todo el rostro',
      'Reducción de manchas solares y rojeces difusas',
      'Fortalecimiento de la barrera cutánea frente a la polución ambiental'
    ],
    recommendedSkinTypes: 'Pieles apagadas, fotodañadas o expuestas al estrés urbano.',
    relatedServiceIds: ['srv-fac-1', 'srv-fac-2'],
    iconColor: 'bg-orange-50 text-orange-600 border-orange-200'
  },
  {
    id: 'ing-arnica',
    name: 'Árnica Montana & Magnesio Kinésico',
    chemicalFamily: 'Lactonas Sesquiterpénicas & Mineral Tópico',
    origin: 'Fitoterapia bioactiva de alta pureza',
    targetLayer: 'Fascia Muscular Profunda y Articulaciones',
    dermatologicalAction: 'Acción antiinflamatoria, analgésica y miorrelajante natural al penetrar en las fibras musculares contracturadas.',
    clinicalBenefits: [
      'Disolución rápida de nudos de tensión cervical y lumbar',
      'Alivio del dolor muscular por sobrecarga o mala postura',
      'Facilitación de la recuperación funcional musculoesquelética'
    ],
    recommendedSkinTypes: 'Personas con dolor cervical, contracturas, estrés postural o deportistas.',
    relatedServiceIds: ['srv-corp-1', 'srv-kin-1', 'srv-kin-2', 'srv-fis-1'],
    iconColor: 'bg-purple-50 text-purple-600 border-purple-200'
  }
];

export const ActiveIngredientsModal: React.FC<ActiveIngredientsModalProps> = ({
  isOpen,
  onClose,
  onBookServiceWithIngredient
}) => {
  const [selectedIngredientId, setSelectedIngredientId] = useState<string>('ing-ha');
  const [searchTerm, setSearchTerm] = useState<string>('');

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

  const currentIngredient = INGREDIENTS_DATABASE.find(i => i.id === selectedIngredientId) || INGREDIENTS_DATABASE[0];
  
  const filteredIngredients = INGREDIENTS_DATABASE.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.dermatologicalAction.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.targetLayer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const relatedServices = SERVICES_DATA.filter(s => currentIngredient.relatedServiceIds.includes(s.id));

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#241e1d]/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-[#fdfbf7] rounded-3xl border border-[#ede8e3] shadow-2xl overflow-hidden my-8"
      >
        
        {/* Header */}
        <div className="bg-[#2c2725] text-white p-6 sm:p-8 flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c98a92]/30 border border-[#c98a92]/50 text-[#f0d4d8] text-[11px] font-bold uppercase tracking-widest">
              <FlaskConical className="w-3.5 h-3.5 text-[#e5b3b9]" />
              <span>Dermatología & Cosmecéutica Avanzada</span>
            </div>
            <h3 className="font-serif-cormorant text-3xl sm:text-4xl font-semibold text-white">
              Guía de Principios Activos & Formulaciones
            </h3>
            <p className="text-xs sm:text-sm text-[#ded3cb] max-w-xl leading-relaxed">
              Conocé la base científica y la pureza molecular detrás de cada protocolo aplicado en cabina en VIC Estética Integral.
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

        {/* Content Layout */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Ingredient Selector List */}
          <div className="lg:col-span-4 space-y-3">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#8a807d] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar activo o molécula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#ede8e3] text-xs text-[#2c2725] focus:outline-none focus:border-[#c98a92]"
              />
            </div>

            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {filteredIngredients.map((item) => {
                const isSelected = selectedIngredientId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedIngredientId(item.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#2c2725] text-white border-[#2c2725] shadow-md scale-[1.02]'
                        : 'bg-white text-[#4a423f] border-[#ede8e3] hover:border-[#c98a92] hover:bg-[#faf7f2]'
                    }`}
                  >
                    <div>
                      <h4 className="font-serif-cormorant text-base font-bold leading-tight">
                        {item.name}
                      </h4>
                      <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-[#e5b3b9]' : 'text-[#8a807d]'}`}>
                        {item.targetLayer}
                      </span>
                    </div>

                    <div className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? 'bg-[#c98a92]' : 'bg-[#ded3cb]'}`} />
                  </button>
                );
              })}
            </div>

          </div>

          {/* Right Column: Selected Ingredient Scientific Dossier */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#ede8e3] space-y-6 shadow-sm">
            
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-3 py-1 rounded-full bg-[#fbf0f2] text-[#c98a92] border border-[#f0d4d8] text-[10px] font-bold uppercase tracking-wider">
                  {currentIngredient.chemicalFamily}
                </span>
                <span className="text-xs text-[#8a807d]">
                  Diana: <strong>{currentIngredient.targetLayer}</strong>
                </span>
              </div>

              <h4 className="font-serif-cormorant text-3xl font-bold text-[#2c2725] leading-tight">
                {currentIngredient.name}
              </h4>
              <p className="text-xs text-[#8a807d] mt-0.5">
                Origen & Biotecnología: {currentIngredient.origin}
              </p>
            </div>

            {/* Dermatological Mechanism */}
            <div className="p-4 bg-[#faf7f2] rounded-2xl border border-[#ede8e3] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#c98a92] block">
                Mecanismo de Acción Dermatológica:
              </span>
              <p className="text-xs sm:text-sm text-[#4a423f] leading-relaxed">
                {currentIngredient.dermatologicalAction}
              </p>
            </div>

            {/* Clinical Benefits */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2c2725] block">
                Beneficios Clínicos Demostrados:
              </span>
              <ul className="space-y-2 text-xs text-[#4a423f]">
                {currentIngredient.clinicalBenefits.map((ben, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#c98a92] shrink-0 mt-0.5" />
                    <span>{ben}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Indication */}
            <div className="text-xs text-[#6b6462] flex items-center gap-2 border-t border-[#ede8e3] pt-3">
              <ShieldCheck className="w-4 h-4 text-[#c98a92] shrink-0" />
              <span><strong>Indicación:</strong> {currentIngredient.recommendedSkinTypes}</span>
            </div>

            {/* Treatments using this active principle */}
            <div className="space-y-2 pt-2 border-t border-[#ede8e3]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2c2725] block">
                Tratamientos de VIC que aplican este activo:
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {relatedServices.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-3 rounded-2xl bg-[#faf7f2] border border-[#ede8e3] flex items-center justify-between gap-2"
                  >
                    <div>
                      <h5 className="font-serif-cormorant text-sm font-bold text-[#2c2725] leading-tight">
                        {srv.name}
                      </h5>
                      <span className="text-[10px] text-[#c98a92] font-semibold">
                        {srv.duration}
                      </span>
                    </div>

                    {onBookServiceWithIngredient && (
                      <button
                        onClick={() => {
                          onClose();
                          onBookServiceWithIngredient(srv);
                        }}
                        className="px-3 py-1.5 rounded-full bg-[#c98a92] hover:bg-[#b57a82] text-white text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0"
                      >
                        Reservar
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
