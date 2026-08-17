import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight, 
  ShieldCheck, 
  Heart, 
  Clock, 
  MessageCircle,
  Stethoscope,
  Droplet,
  Sun,
  Flame
} from 'lucide-react';
import { SERVICES_DATA, formatPrice, BUSINESS_DATA } from '../data/aestheticData';
import { ServiceItem } from '../types';

interface SmartSkinDiagnosisProps {
  onSelectRecommendedService?: (service: ServiceItem) => void;
  onBookService?: (service: ServiceItem) => void;
}

export const SmartSkinDiagnosis: React.FC<SmartSkinDiagnosisProps> = ({ 
  onSelectRecommendedService,
  onBookService 
}) => {
  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState<{
    objective: string;
    skinType: string;
    intensity: string;
    priority: string;
  }>({
    objective: '',
    skinType: '',
    intensity: '',
    priority: ''
  });

  const handleBooking = (service: ServiceItem) => {
    if (onSelectRecommendedService) {
      onSelectRecommendedService(service);
    } else if (onBookService) {
      onBookService(service);
    }
  };

  const handleSelect = (key: 'objective' | 'skinType' | 'intensity' | 'priority', value: string) => {
    const updated = { ...answers, [key]: value };
    setAnswers(updated);
    if (step < 3) {
      setStep(step + 1);
    } else {
      setStep(4); // Show result
    }
  };

  const handleReset = () => {
    setAnswers({ objective: '', skinType: '', intensity: '', priority: '' });
    setStep(1);
  };

  // Determine recommendation based on answers
  const getRecommendation = (): { 
    service: ServiceItem; 
    reason: string; 
    activeIngredients: string[];
    suggestedSessions: string;
    tips: string[];
  } => {
    if (answers.objective === 'dolor') {
      const srv = SERVICES_DATA.find(s => s.id === 'srv-corp-1') || SERVICES_DATA[3];
      return {
        service: srv,
        reason: 'Tu cuadro manifiesta sobrecarga miofascial, tensión en cuello o espalda y necesidad de distensión inmediata.',
        activeIngredients: ['Aceites esenciales de árnica y romero', 'Bálsamo térmico descontracturante', 'Magnesio tópico'],
        suggestedSessions: '1 a 3 sesiones según nivel de contractura',
        tips: [
          'Evaluación kinesiológica previa personalizada sin cargo.',
          'Aplicación de maniobras manuales profundas + calor terapéutico.',
          'Alivio notable de la rigidez articular y dolor tensional.'
        ]
      };
    }

    if (answers.objective === 'corporal') {
      const srv = SERVICES_DATA.find(s => s.id === 'srv-mod-1') || SERVICES_DATA[2];
      return {
        service: srv,
        reason: 'Excelente protocolo para estimular el drenaje linfático, reducir adiposidad focalizada y devolver tonicidad a los tejidos.',
        activeIngredients: ['Centella asiática liposomal', 'Cafeína pura al 5%', 'Fosfatidilcolina & L-Carnitina'],
        suggestedSessions: 'Plan recomendado de 4 a 6 sesiones continuas',
        tips: [
          'Aparatología no invasiva de última generación (Ultracavitación + Radiofrecuencia).',
          'Estimulación circulatoria y mejora visible de la piel de naranja.',
          'Pautas de hidratación y cuidado corporal en domicilio.'
        ]
      };
    }

    if (answers.objective === 'laser') {
      const srv = SERVICES_DATA.find(s => s.id === 'srv-dep-2') || SERVICES_DATA[4];
      return {
        service: srv,
        reason: 'Tratamiento definitivo para erradicar el vello corporal, eliminar la foliculitis y mantener tu piel suave para siempre.',
        activeIngredients: ['Gel conductor neutro con aloe vera', 'Loción post-láser descongestiva con caléndula'],
        suggestedSessions: 'Sesiones periódicas cada 30 a 45 días',
        tips: [
          'Cabezal con refrigeración criogénica para una sesión 100% indolora.',
          'Apto para todo fototipo cutáneo y vello.',
          'Resultados visibles con debilitamiento del folículo desde la primera sesión.'
        ]
      };
    }

    if (answers.objective === 'botox' || answers.skinType === 'madura') {
      const srv = SERVICES_DATA.find(s => s.id === 'srv-med-1') || SERVICES_DATA[0];
      return {
        service: srv,
        reason: 'Protocolo médico estético de precisión para relajar la musculatura que causa arrugas y devolver frescura y armonía natural.',
        activeIngredients: ['Toxina Botulínica Tipo A purificada', 'Ácido Hialurónico reticulado estéril'],
        suggestedSessions: 'Mantenimiento semestral o anual',
        tips: [
          'Aplicado exclusivamente por médica especialista matriculada.',
          'Resultados visibles plenos a los 10-14 días.',
          'Conserva la expresividad natural sin efecto congelado.'
        ]
      };
    }

    if (answers.objective === 'glow') {
      const srv = SERVICES_DATA.find(s => s.id === 'srv-fac-2') || SERVICES_DATA[1];
      return {
        service: srv,
        reason: 'Renovación epidérmica instantánea para una piel de porcelana, suave al tacto y lista para absorber activos hidratantes.',
        activeIngredients: ['Ácido Hialurónico de bajo peso molecular', 'Niacinamida al 4%', 'Vitamina C antioxidante'],
        suggestedSessions: '1 sesión mensual o previa a eventos especiales',
        tips: [
          'Retiro suave de células muertas y vello facial con bisturí quirúrgico descartable.',
          'Hidratación profunda con mascarilla regeneradora.',
          'Textura luminosa y maquillaje impecable de inmediato.'
        ]
      };
    }

    // Default: Deep Facial Cleansing
    const srv = SERVICES_DATA.find(s => s.id === 'srv-fac-1') || SERVICES_DATA[0];
    return {
      service: srv,
      reason: 'El pilar fundamental para restaurar el equilibrio de tu piel, liberar poros obstruidos, regular la secreción sebácea y oxigenar el rostro.',
      activeIngredients: ['Ácido Mandélico / Salicílico suave', 'Máscara descongestiva de caléndula & té verde', 'Sérum de Ácido Hialurónico'],
      suggestedSessions: '1 sesión cada 3 a 4 semanas para mantenimiento óptimo',
      tips: [
        'Higiene profunda con espátula ultrasónica sin dolor.',
        'Extracciones asépticas y altafrecuencia antibacteriana.',
        'Piel visiblemente limpia, matificada y radiante.'
      ]
    };
  };

  const rec = getRecommendation();

  return (
    <section id="diagnostico" className="py-20 bg-[#fcfaf7] border-t border-[#ede8e3]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Title */}
        <div className="text-center mb-10 gsap-section-header">
          <div className="inline-flex items-center gap-2 bg-[#fbf0f2] border border-[#f0d4d8] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#c98a92] mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Diagnóstico Facial & Corporal Inteligente</span>
          </div>
          <h2 className="font-serif-cormorant text-4xl sm:text-5xl text-[#2c2725] font-semibold">
            Descubrí tu Protocolo Ideal en 30 Segundos
          </h2>
          <p className="mt-2 text-sm text-[#6b6462] max-w-xl mx-auto">
            Respondé 3 simples preguntas para obtener una prescripción estética orientativa con activos recomendados, sesiones sugeridas y turno directo.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md mx-auto mb-10">
          <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-[#8a807d] mb-2">
            <span className={step >= 1 ? 'text-[#c98a92]' : ''}>1. Objetivo</span>
            <span className={step >= 2 ? 'text-[#c98a92]' : ''}>2. Estado Dérmico</span>
            <span className={step >= 3 ? 'text-[#c98a92]' : ''}>3. Frecuencia</span>
            <span className={step === 4 ? 'text-[#c98a92]' : ''}>4. Resultado</span>
          </div>
          <div className="w-full h-2 bg-[#ede8e3] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#c98a92] transition-all duration-500 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Diagnostic Card Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#ede8e3] shadow-xl gsap-reveal-card">
          
          {/* STEP 1: Objective */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c98a92]">Paso 1 de 3</span>
                <h3 className="font-serif-cormorant text-2xl sm:text-3xl font-bold text-[#2c2725] mt-1">
                  ¿Cuál es tu principal objetivo estético o de salud?
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  { id: 'facial', label: 'Limpieza Profunda & Poros', desc: 'Eliminar puntos negros, descongestionar y regular grasitud' },
                  { id: 'glow', label: 'Dermaplaning & Efecto Glow', desc: 'Textura de seda, luminosidad y renovación de capas superficiales' },
                  { id: 'botox', label: 'Rejuvenecimiento & Botox Médico', desc: 'Atenuación de arrugas, líneas de expresión y volumen de labios' },
                  { id: 'corporal', label: 'Modelación Corporal & Celulitis', desc: 'Reducción localizada, drenaje linfático y tonificación' },
                  { id: 'dolor', label: 'Alivio de Dolores & Kinesiología', desc: 'Contracturas cervicales, lumbalgia, columna y relajación' },
                  { id: 'laser', label: 'Depilación Definitiva Triláser', desc: 'Eliminación del vello permanente, rápida y sin dolor' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect('objective', opt.id)}
                    className="p-4 sm:p-5 rounded-2xl border border-[#ede8e3] hover:border-[#c98a92] hover:bg-[#fcfaf7] text-left transition-all group cursor-pointer shadow-xs hover:shadow-sm"
                  >
                    <div className="font-bold text-[#2c2725] text-sm group-hover:text-[#c98a92] transition-colors flex items-center justify-between">
                      <span>{opt.label}</span>
                      <ArrowRight className="w-4 h-4 text-[#ded3cb] group-hover:text-[#c98a92] transition-colors" />
                    </div>
                    <div className="text-xs text-[#8a807d] mt-1 leading-relaxed">
                      {opt.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Skin Condition */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c98a92]">Paso 2 de 3</span>
                <h3 className="font-serif-cormorant text-2xl sm:text-3xl font-bold text-[#2c2725] mt-1">
                  ¿Cómo describirías el estado actual de tu piel o cuerpo?
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  { id: 'sensible', label: 'Normal a Sensible / Tendencia a Rosácea', desc: 'Reacciona fácilmente al sol, calor o cosméticos pesados' },
                  { id: 'grasa', label: 'Mixta a Grasa / Tendencia a Acné', desc: 'Brillos visibles en frente y nariz, comedones frecuentes' },
                  { id: 'madura', label: 'Piel Madura / Pérdida de Elasticidad', desc: 'Presencia de líneas de expresión, sequedad o falta de firmeza' },
                  { id: 'contracturada', label: 'Cuerpo con Tensión Postural / Estrés', desc: 'Rigidez en trapecio, hombros, cuello o pesadez en piernas' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect('skinType', opt.id)}
                    className="p-4 sm:p-5 rounded-2xl border border-[#ede8e3] hover:border-[#c98a92] hover:bg-[#fcfaf7] text-left transition-all group cursor-pointer shadow-xs"
                  >
                    <div className="font-bold text-[#2c2725] text-sm group-hover:text-[#c98a92] transition-colors flex items-center justify-between">
                      <span>{opt.label}</span>
                      <ArrowRight className="w-4 h-4 text-[#ded3cb] group-hover:text-[#c98a92] transition-colors" />
                    </div>
                    <div className="text-xs text-[#8a807d] mt-1 leading-relaxed">
                      {opt.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Intensity & Timing */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c98a92]">Paso 3 de 3</span>
                <h3 className="font-serif-cormorant text-2xl sm:text-3xl font-bold text-[#2c2725] mt-1">
                  ¿Qué tipo de experiencia estás buscando?
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {[
                  { id: 'express', label: 'Sesión Focalizada', desc: '45 a 60 min de protocolo intensivo para tu necesidad puntual' },
                  { id: 'completo', label: 'Experiencia Integral', desc: '60 a 90 min de cabina con máxima relajación y activos puros' },
                  { id: 'combo', label: 'Pack / Mantenimiento', desc: 'Plan progresivo de varias sesiones para cambios profundos' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect('intensity', opt.id)}
                    className="p-5 rounded-2xl border border-[#ede8e3] hover:border-[#c98a92] hover:bg-[#fcfaf7] text-left transition-all group cursor-pointer shadow-xs"
                  >
                    <div className="font-bold text-[#2c2725] text-sm group-hover:text-[#c98a92] transition-colors">
                      {opt.label}
                    </div>
                    <div className="text-xs text-[#8a807d] mt-1 leading-relaxed">
                      {opt.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Clinical Recommendation Dossier */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              <div className="text-center border-b border-[#ede8e3] pb-6">
                <span className="text-xs uppercase tracking-widest font-bold text-[#c98a92]">
                  Diagnóstico Personalizado Listo
                </span>
                <h3 className="font-serif-cormorant text-3xl sm:text-4xl font-bold text-[#2c2725] mt-1">
                  Protocolo Sugerido: {rec.service.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#6b6462] mt-2 max-w-xl mx-auto leading-relaxed">
                  {rec.reason}
                </p>
              </div>

              {/* Service Card Highlight */}
              <div className="bg-[#fcfaf7] rounded-3xl p-6 border border-[#ede8e3] space-y-4 shadow-sm">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-[#c98a92] uppercase tracking-wider">
                      {rec.service.category.replace('-', ' ')}
                    </span>
                    <h4 className="font-serif-cormorant text-2xl font-bold text-[#2c2725]">
                      {rec.service.name}
                    </h4>
                    <p className="text-xs text-[#6b6462] mt-1">
                      {rec.service.duration} de sesión en consultorio climatizado
                    </p>
                  </div>

                  <div className="text-left sm:text-right shrink-0 bg-white p-3 rounded-2xl border border-[#ede8e3]">
                    <span className="text-[10px] text-[#c98a92] uppercase font-bold block">Protocolo Sugerido</span>
                    <span className="text-sm font-bold text-[#2c2725]">
                      100% Personalizado
                    </span>
                    <span className="text-[10px] text-[#8a807d] block">
                      Tarifa informada al reservar
                    </span>
                  </div>
                </div>

                {/* Active ingredients */}
                <div className="bg-white p-4 rounded-2xl border border-[#ede8e3] space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a807d] block">
                    Activos y Principios Clínicos Aplicados:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {rec.activeIngredients.map((ing, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-[#f7eef0] text-[#c98a92] text-[11px] font-semibold">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  {rec.tips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#4a423f] bg-white p-2.5 rounded-xl border border-[#ede8e3]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#c98a92] shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 text-xs text-[#8a807d] hover:text-[#2c2725] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reiniciar diagnóstico</span>
                </button>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  <a
                    href={`https://wa.me/${BUSINESS_DATA.phone}?text=Hola!%20Realic%C3%A9%20el%20diagn%C3%B3stico%20en%20la%20web%20y%20me%20recomend%C3%B3%20*${encodeURIComponent(rec.service.name)}*.%20%C2%BFQuisiera%20consultarles%20disponibilidad?`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-5 py-3 rounded-full border border-[#c98a92] text-[#c98a92] hover:bg-[#c98a92]/10 text-xs font-semibold uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Consultar por WhatsApp</span>
                  </a>

                  <button
                    onClick={() => handleBooking(rec.service)}
                    className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#c98a92] hover:bg-[#b57a82] text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>Reservar este Turno</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};
