import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Coffee, 
  Car, 
  Wifi, 
  Thermometer, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Eye,
  Heart
} from 'lucide-react';
import { BUSINESS_DATA } from '../data/aestheticData';
import { CustomPhotoStorage } from '../utils/customPhotoStorage';
import clinicCabinImg from '../assets/images/clinic_cabin_real_hq_1786925708727.jpg';
import eclerisMinivacImg from '../assets/images/ecleris_minivac_hq_1786925657706.jpg';
import velaslimPlusImg from '../assets/images/velaslim_plus_hq_1786925678666.jpg';
import trendsLaserImg from '../assets/images/trends_laser_hq_1786925645941.jpg';
import teslagenDuoImg from '../assets/images/teslagen_duo_hq_1786925695584.jpg';

interface SpaceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  features: string[];
  equipment: string;
}

const CLINIC_SPACES: SpaceItem[] = [
  {
    id: 'eq-consultorio-vic',
    name: 'Consultorio de Medicina Estética',
    category: 'Dra. María Pía Gelso',
    description: 'Espacio médico exclusivo y aséptico para procedimientos de armonización facial, toxina botulínica, ácido hialurónico y bioestimuladores de colágeno.',
    image: clinicCabinImg,
    features: [
      'Atención médica personalizada y diagnóstico facial anatómico',
      'Materiales inyectables estériles de primeras marcas internacionales',
      'Cadena de frío certificada para conservación de toxina y activos',
      'Seguimiento médico y control evolutivo de cada paciente'
    ],
    equipment: 'Camilla médica articulada, microcánulas de precisión, luz dermatológica focal y refrigeración de bioactivos.'
  },
  {
    id: 'eq-ecleris-minivac',
    name: 'Cabina Facial & Alquimia MiniVac',
    category: 'Hidrodermoabrasión & Cosmiatría',
    description: 'Espacio íntimo acondicionado con luz tenue, música relajante y aparatología médica de infusión activa transdérmica para revitalizar tu piel en profundidad.',
    image: eclerisMinivacImg,
    features: [
      'Sistema Alquimia (Ecleris MiniVac) de hidrodermoabrasión e infusión activa',
      'Radiofrecuencia fraccionada facial y Luz Pulsada Intensa (IPL)',
      'Electroporación dérmica (mesoterapia virtual sin agujas) y Suavel',
      'Higiene médica con espátula ultrasónica y alta frecuencia oxigenante'
    ],
    equipment: 'Ecleris MiniVac Alquimia con cánula quirúrgica de infusión, RF Fraccionada, IPL, Electroporador y cosmecéuticos de grado dermatológico.'
  },
  {
    id: 'eq-velaslim-plus',
    name: 'Sector de Modelación Corporal de Alta Potencia',
    category: 'VelaSlim, Alpha Synergy & Teslagen DUO',
    description: 'Gabinete de alta tecnología enfocado en reducción de panículo adiposo, tensado dérmico, eliminación de celulitis y tonificación muscular supramáxima.',
    image: velaslimPlusImg,
    features: [
      'VelaSlim Plus: Radiofrecuencia + Vacumterapia + Rodillos mecánicos + Infrarrojo',
      'Alpha Synergy (Starbene): Radiofrecuencia multipolar profunda con vacum',
      'Teslagen DUO & Mío Up / Body Up: Estimulación electromagnética neuromuscular',
      'Ultracavitación focalizada, Criolipólisis y Exilis 360'
    ],
    equipment: 'VelaSlim Plus, Starbene Alpha Synergy, Teslagen DUO, Mío Up, Body Up, Ultracavitador, Criolipólisis y Exilis 360.'
  },
  {
    id: 'eq-trends-laser',
    name: 'Sector Láser 4 Longitudes de Onda (Trends)',
    category: 'Depilación Definitiva & Fotorejuvenecimiento',
    description: 'Tecnología médica Trends de 4 ondas simultáneas (755nm, 808nm, 940nm, 1064nm) con cabezal ultra-enfriado bajo cero para una sesión 100% indolora y segura.',
    image: trendsLaserImg,
    features: [
      'Cabezal ergonómico con enfriamiento criogénico de contacto',
      'Eficacia probada en todo fototipo cutáneo y grosor de vello',
      'Modo fotorejuvenecimiento dérmico incorporado',
      'Gafas de bioseguridad ocular y protocolos certificados'
    ],
    equipment: 'Equipo Láser Trends 4 Longitudes de Onda (Alexandrita, Diodo, 940nm y Nd:YAG) con pantalla táctil de parametrización clínica.'
  },
  {
    id: 'eq-teslagen-duo',
    name: 'Consultorio de Fisioterapia, Kinesiología & Nutrición',
    category: 'Lic. Olga Aguirre & Nadia Tissera',
    description: 'Área dedicada a la rehabilitación funcional, alivio del dolor crónico, drenaje linfático manual y planes nutricionales para un bienestar integral.',
    image: teslagenDuoImg,
    features: [
      'Evaluación postural, articular y miofascial por profesional matriculada',
      'Drenaje linfático médico para retención de líquidos y post-operatorios',
      'Planes de nutrición y asesoramiento en hábitos saludables',
      'Atención personalizada con historia clínica'
    ],
    equipment: 'Camilla clínica ergonómica, aparatología de fisioterapia y kinesiología combinada, electroestimulación y terapia manual miofascial.'
  },
  {
    id: 'space-nails',
    name: 'Espacio Bellelss Nails & Spa de Manos',
    category: 'Manicuría Profesional',
    description: 'Sector especializado en el cuidado, diseño, fortalecimiento y esmaltado de uñas con técnicas rusas y productos hipoalergénicos.',
    image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=1200&auto=format&fit=crop',
    features: [
      'Esterilización de instrumental y máxima higiene',
      'Esmaltado semipermanente de alta duración y Kapping Gel',
      'Cuidado no invasivo de la cutícula y la lámina ungueal',
      'Pedicura spa con exfoliación e hidratación profunda'
    ],
    equipment: 'Torno profesional con fresas diamantadas, cabinas UV/LED de 48W y línea de esmaltes de alta durabilidad.'
  }
];

export const ClinicTourAndAmenities: React.FC = () => {
  const [activeSpaceId, setActiveSpaceId] = useState<string>('eq-ecleris-minivac');
  const [photosVersion, setPhotosVersion] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setPhotosVersion(v => v + 1);
    window.addEventListener('vic_custom_photos_updated', handleUpdate);
    return () => window.removeEventListener('vic_custom_photos_updated', handleUpdate);
  }, []);

  const rawSpace = CLINIC_SPACES.find(s => s.id === activeSpaceId) || CLINIC_SPACES[0];
  const currentSpace = {
    ...rawSpace,
    image: CustomPhotoStorage.getPhoto(rawSpace.id, rawSpace.image)
  };

  return (
    <section className="py-20 bg-white border-t border-[#ede8e3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 gsap-section-header">
          <span className="text-xs uppercase tracking-[0.25em] text-[#c98a92] font-semibold block mb-2">
            Instalaciones & Bioseguridad
          </span>
          <h2 className="font-serif-cormorant text-4xl sm:text-5xl font-semibold text-[#2c2725]">
            Un Espacio Pensado para Tu Confort
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6b6462] leading-relaxed">
            Conocé nuestras cabinas de atención privada en Mendoza 985, Río Segundo. Equipamiento de grado médico, máxima higiene y calidez en cada visita.
          </p>
        </div>

        {/* Space Selector Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2.5 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {CLINIC_SPACES.map((space) => {
            const isActive = activeSpaceId === space.id;
            return (
              <button
                key={space.id}
                onClick={() => setActiveSpaceId(space.id)}
                className={`px-5 py-3 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#2c2725] text-white border-[#2c2725] shadow-md scale-105'
                    : 'bg-[#fcfaf7] text-[#6b6462] border-[#ede8e3] hover:border-[#c98a92] hover:text-[#2c2725]'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#c98a92]' : 'bg-[#ded3cb]'}`} />
                <span>{space.name.split('&')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Space Interactive Showcase */}
        <div className="bg-[#fcfaf7] rounded-3xl border border-[#ede8e3] shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 mb-16">
          
          {/* Visual Showcase */}
          <div className="lg:col-span-6 relative min-h-[340px] lg:min-h-[460px] bg-[#2c2725]">
            <img
              src={currentSpace.image}
              alt={currentSpace.name}
              className="w-full h-full object-cover object-center opacity-90 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2c2725] via-transparent to-transparent p-6 sm:p-8 flex flex-col justify-end text-white">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#f0d4d8] mb-1">
                {currentSpace.category}
              </span>
              <h3 className="font-serif-cormorant text-2xl sm:text-3xl font-bold">
                {currentSpace.name}
              </h3>
              <p className="text-xs text-white/80 mt-1">
                VIC Estética Integral · Mendoza 985
              </p>
            </div>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#c98a92] block">
                  Descripción del Área
                </span>
                <p className="text-xs sm:text-sm text-[#4a423f] mt-1.5 leading-relaxed">
                  {currentSpace.description}
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2c2725] block">
                  Estándares de Calidad & Confort:
                </span>
                <ul className="space-y-2 text-xs text-[#6b6462]">
                  {currentSpace.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#c98a92] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Equipment */}
              <div className="p-3.5 bg-white rounded-2xl border border-[#ede8e3] text-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a807d] block">
                  Equipamiento e Insumos:
                </span>
                <p className="font-medium text-[#2c2725]">
                  {currentSpace.equipment}
                </p>
              </div>
            </div>

            {/* Bottom info */}
            <div className="pt-3 border-t border-[#ede8e3] flex items-center justify-between text-xs text-[#8a807d]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#c98a92]" />
                <span>Esterilización y protocolo hospitalario</span>
              </span>
              <a
                href={BUSINESS_DATA.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="text-[#c98a92] font-bold hover:underline"
              >
                Consultar por turno →
              </a>
            </div>

          </div>

        </div>

        {/* Amenities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#fcfaf7] p-6 rounded-3xl border border-[#ede8e3] space-y-2 shadow-xs">
            <div className="w-10 h-10 rounded-2xl bg-white text-[#c98a92] flex items-center justify-center font-bold shadow-xs">
              <Thermometer className="w-5 h-5" />
            </div>
            <h4 className="font-serif-cormorant text-xl font-bold text-[#2c2725]">
              Ambiente Climatizado
            </h4>
            <p className="text-xs text-[#6b6462] leading-relaxed">
              Temperatura óptima regulada en cada cabina durante todo el año para tu máximo descanso.
            </p>
          </div>

          <div className="bg-[#fcfaf7] p-6 rounded-3xl border border-[#ede8e3] space-y-2 shadow-xs">
            <div className="w-10 h-10 rounded-2xl bg-white text-[#c98a92] flex items-center justify-center font-bold shadow-xs">
              <Car className="w-5 h-5" />
            </div>
            <h4 className="font-serif-cormorant text-xl font-bold text-[#2c2725]">
              Fácil Estacionamiento
            </h4>
            <p className="text-xs text-[#6b6462] leading-relaxed">
              Zona residencial tranquila con disponibilidad de estacionamiento libre justo al frente del consultorio.
            </p>
          </div>

          <div className="bg-[#fcfaf7] p-6 rounded-3xl border border-[#ede8e3] space-y-2 shadow-xs">
            <div className="w-10 h-10 rounded-2xl bg-white text-[#c98a92] flex items-center justify-center font-bold shadow-xs">
              <Coffee className="w-5 h-5" />
            </div>
            <h4 className="font-serif-cormorant text-xl font-bold text-[#2c2725]">
              Bar de Infusiones Detox
            </h4>
            <p className="text-xs text-[#6b6462] leading-relaxed">
              Tés herbales, café de especialidad y agua fresca de cortesía para disfrutar antes o después de tu sesión.
            </p>
          </div>

          <div className="bg-[#fcfaf7] p-6 rounded-3xl border border-[#ede8e3] space-y-2 shadow-xs">
            <div className="w-10 h-10 rounded-2xl bg-white text-[#c98a92] flex items-center justify-center font-bold shadow-xs">
              <Wifi className="w-5 h-5" />
            </div>
            <h4 className="font-serif-cormorant text-xl font-bold text-[#2c2725]">
              Wifi & Sala de Espera
            </h4>
            <p className="text-xs text-[#6b6462] leading-relaxed">
              Conexión de alta velocidad y sillones confortables si venís con acompañante a tu turno.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
