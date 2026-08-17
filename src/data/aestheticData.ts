import { BusinessInfo, CategoryItem, ServiceItem, Professional, Testimonial } from '../types';

export interface ClinicalProtocol {
  serviceId: string;
  steps: {
    phase: string;
    description: string;
  }[];
  benefits: string[];
  indications: string[];
  recommendedSessions: string;
  preCare: string[];
  postCare: string[];
  contraindications: string[];
}

export interface EquipmentItem {
  id: string;
  name: string;
  brand: string;
  badge: string;
  category: 'depilacion' | 'facial' | 'corporal' | 'muscular' | 'instalaciones';
  tagline: string;
  description: string;
  keySpecs: { label: string; value: string }[];
  clinicalActions: string[];
  cabinExperience: string;
  idealFor: string[];
  sessionDuration: string;
  frequency: string;
  relatedServiceId: string;
  image: string;
}

export const EQUIPMENT_DATA: EquipmentItem[] = [
  {
    id: "eq-trends-laser",
    name: "Trends Láser Tridiodo & Fotorejuvenecimiento",
    brand: "Trends Medical Systems",
    badge: "Jornadas Fijas los Jueves",
    category: "depilacion",
    tagline: "4 Longitudes de Onda simultáneas (755nm, 808nm, 940nm, 1064nm) + Cabezal Criogénico Bajo Cero",
    description: "Equipo médico láser de alta potencia con pantalla táctil de parametrización dual (Depilación Definitiva & Fotorejuvenecimiento). Su cabezal ergonómico ultra-enfriado posee display digital OLED integrado que monitorea disparos y temperatura en tiempo real, garantizando una sesión 100% indolora, rápida y segura en todo fototipo cutáneo.",
    keySpecs: [
      { label: "Longitudes de Onda", value: "755nm (Alejandrita) + 808nm (Diodo) + 940nm + 1064nm (Nd:YAG)" },
      { label: "Cabezal de Contacto", value: "Punta de zafiro criogénico con enfriamiento continuo sub-cero" },
      { label: "Display en Manípulo", value: "Pantalla digital integrada con contador de disparos en vivo" },
      { label: "Modos de Tratamiento", value: "Depilación Definitiva Dinámica & Fotorejuvenecimiento Facial" },
      { label: "Bioseguridad", value: "Llave de encendido de seguridad y pulsador de parada de emergencia" }
    ],
    clinicalActions: [
      "Fototermólisis selectiva permanente del folículo piloso",
      "Eficaz en vello fino, grueso, claro u oscuro",
      "Estimulación de nuevo colágeno en modo Fotorejuvenecimiento dérmico",
      "Eliminación de foliculitis (vellos encarnados) y manchas post-inflamatorias"
    ],
    cabinExperience: "Sensación fresca y placentera gracias al zafiro congelado. Sin dolor, sin quemaduras y sin período de recuperación.",
    idealFor: ["Piernas completas", "Cavado completo / Bikini", "Axilas", "Rostro / Bozo / Mentón", "Espalda y Brazos", "Fotorejuvenecimiento facial"],
    sessionDuration: "15 a 60 min según zona",
    frequency: "1 sesión cada 30 a 45 días (6 a 8 sesiones totales recomendadas)",
    relatedServiceId: "srv-dep-1",
    image: "/images/trends_laser.jpg"
  },
  {
    id: "eq-ecleris-minivac",
    name: "Ecleris MiniVAC — Sistema Alquimia",
    brand: "Ecleris Medical",
    badge: "Efecto Glow Inmediato",
    category: "facial",
    tagline: "Hidrodermoabrasión con Cánula de Acero Quirúrgico, Vacío Digital e Infusión de Activos",
    description: "Tecnología médica para protocolos de hidrodermoabrasión Alquimia. Cuenta con consola digital de control de vacío y flujo de succión ('Vacuum Flow'), reservorio iluminado LED azul y gradilla de viales con soluciones dermatológicas concentradas (Ácido Hialurónico, Vitamina C, Ácido Mandélico y Salicílico). Su manípulo metálico de precisión exfolia suavemente mientras extrae comedones e infunde bioactivos.",
    keySpecs: [
      { label: "Manípulo Clínico", value: "Cánula ergonómica de acero quirúrgico esterilizable" },
      { label: "Sistema de Vacío", value: "Control digital de flujo de succión (Vacuum & Flow regulables)" },
      { label: "Iluminación de Cabina", value: "Cámara retroiluminada LED azul para visibilidad higiénica" },
      { label: "Gradilla de Infusión", value: "4 Viales de soluciones activas dermatológicas concentradas" },
      { label: "Técnica", value: "Doble acción simultánea: Hidro-peeling mecánico + Infusión dérmica" }
    ],
    clinicalActions: [
      "Extracción profunda e indolora de impurezas y puntos negros",
      "Exfoliación no invasiva de células muertas del estrato córneo",
      "Infusión transdérmica directa de sueros de hidratación y nutrición",
      "Cierre de poros dilatados y luminosidad radiante instantánea"
    ],
    cabinExperience: "Tratamiento sumamente relajante con sensación de frescura y succión suave. Sin dolor ni descamación agresiva.",
    idealFor: ["Piel opaca o asfixiada", "Poros dilatados y comedones", "Líneas finas de deshidratación", "Preparación de piel para eventos especiales"],
    sessionDuration: "45 a 60 min",
    frequency: "1 sesión cada 21 a 30 días para mantenimiento celular",
    relatedServiceId: "srv-fac-alquimia",
    image: "/images/ecleris_minivac.jpg"
  },
  {
    id: "eq-velaslim-plus",
    name: "VelaSlim Plus — Sistema Cuádruple Corporal",
    brand: "VelaSlim Technology",
    badge: "Reducción & Anticelulitis",
    category: "corporal",
    tagline: "Radiofrecuencia Bipolar + Vacumterapia Continua + Rodillos Motorizados + Infrarrojos",
    description: "Plataforma integral de remodelación corporal y tratamiento no invasivo de la celulitis rebelde. Combina en un solo cabezal 4 tecnologías sinérgicas: calor profundo por radiofrecuencia bipolar, succión por vacío para movilizar la grasa, rodillos mecánicos para drenaje linfático y luz infrarroja para activar el metabolismo tisular.",
    keySpecs: [
      { label: "Tecnologías 4 en 1", value: "RF Bipolar + Vacumterapia + Rodillos mecánicos + Infrarrojo" },
      { label: "Cabezal de Alta Eficacia", value: "Manípulo ergonómico con rodillos de masaje multidireccional" },
      { label: "Control de Potencia", value: "Pantalla táctil para calibración precisa según grado de celulitis" },
      { label: "Profundidad Térmica", value: "Calentamiento controlado del tejido graso de 5mm a 15mm" }
    ],
    clinicalActions: [
      "Alisado y compactación de la celulitis (piel de naranja) en muslos y glúteos",
      "Reducción visible de contornos en abdomen, flancos y piernas",
      "Estimulación profunda de neocolagénesis y elastina para tensar la piel",
      "Drenaje linfático y desintoxicación del espacio intersticial"
    ],
    cabinExperience: "Masaje profundo y reconfortante con sensación de calor agradable y envolvente en la zona tratada.",
    idealFor: ["Celulitis edematosa, compacta o flácida", "Adiposidad localizada rebelde", "Flacidez corporal post-parto o descenso de peso"],
    sessionDuration: "45 min por sesión",
    frequency: "1 a 2 sesiones semanales (plan inicial recomendado: 6 a 8 sesiones)",
    relatedServiceId: "srv-corp-velaslim",
    image: "/images/velaslim_plus.jpg"
  },
  {
    id: "eq-starbene-alpha",
    name: "Starbene Alpha Synergy — Radiofrecuencia Multipolar",
    brand: "Starbene Medical",
    badge: "Tensado & Remodelación",
    category: "corporal",
    tagline: "Radiofrecuencia Multipolar de Alta Frecuencia + Electrodos Esféricos + Vacum Dinámico",
    description: "Equipo médico-estético diseñado por Starbene para el tensado cutáneo facial y corporal de máxima profundidad. Sus manípulos cuentan con electrodos esféricos metálicos de alta conductividad que distribuyen el calor de manera homogénea en las capas dérmicas, promoviendo la contracción inmediata del colágeno y la regeneración celular a largo plazo.",
    keySpecs: [
      { label: "Emisión Electromagnética", value: "Radiofrecuencia multipolar resistiva y capacitiva" },
      { label: "Cabezales Esféricos", value: "Electrodos de acero quirúrgico pulido con cromoterapia" },
      { label: "Consola Digital", value: "Interfaz táctil interactiva a color con presets clínicos" },
      { label: "Sinergia", value: "Tensado dérmico + Drenaje vacumterápico + Estimulación circulatoria" }
    ],
    clinicalActions: [
      "Reafirmación profunda de tejidos flácidos en abdomen, brazos, glúteos y rostro",
      "Compactación del tejido conectivo y síntesis de colágeno tipo I y III",
      "Mejora de la elasticidad y textura de la piel",
      "Modelado de contornos y drenaje de toxinas"
    ],
    cabinExperience: "Agradable calor térmico superficial y profundo con masaje suave que relaja la musculatura y estimula la circulación.",
    idealFor: ["Flacidez dérmica en abdomen y brazos", "Reafirmación de glúteos", "Tratamiento de papada y óvalo facial"],
    sessionDuration: "45 min",
    frequency: "1 sesión semanal o quincenal",
    relatedServiceId: "srv-corp-alpha",
    image: "/images/starbene_alpha.jpg"
  },
  {
    id: "eq-teslagen-duo",
    name: "Teslagen DUO — Campo Electromagnético Focalizado",
    brand: "Terbel Medical",
    badge: "Tonificación Supramáxima",
    category: "muscular",
    tagline: "Tecnología de Ondas Electromagnéticas de Alta Intensidad (HIFEM) para Hipertrofia & Reducción",
    description: "Aparato de vanguardia desarrollado por Terbel que emite ondas electromagnéticas focalizadas de alta potencia. Induce más de 20.000 contracciones musculares supramáximas en una sola sesión de 30 minutos (inlogrables con ejercicio voluntario), provocando simultáneamente el crecimiento de masa muscular y la quema metabólica de grasa localizada.",
    keySpecs: [
      { label: "Tipo de Energía", value: "Campo electromagnético de alta intensidad focalizado (HIFEM)" },
      { label: "Intensidad Muscular", value: "Hasta 20.000 contracciones supramáximas por sesión de 30 min" },
      { label: "Doble Cabezal DUO", value: "Aplicadores dobles para tratamiento simultáneo de glúteos, abdomen o piernas" },
      { label: "Consola Clínica", value: "Regulación precisa de frecuencia de pulso y profundidad neuromuscular" }
    ],
    clinicalActions: [
      "Levantamiento y aumento de volumen y firmeza en glúteos",
      "Definición y fortalecimiento de la pared abdominal (rectos y oblicuos)",
      "Tonificación profunda de brazos (bíceps/tríceps) y muslos (cuádriceps/isquiotibiales)",
      "Quema de grasa metabólica por consumo acelerado de energía"
    ],
    cabinExperience: "Sensación de contracción muscular intensa y rítmica sin dolor en articulaciones. Terminás la sesión lista para seguir tu día.",
    idealFor: ["Levantamiento de glúteos sin cirugía", "Marcación abdominal", "Recuperación de tono muscular post-embarazo o sedentarismo"],
    sessionDuration: "30 a 35 min",
    frequency: "2 sesiones semanales durante 4 a 6 semanas",
    relatedServiceId: "srv-corp-teslagen",
    image: "/images/teslagen_duo.jpg"
  },
  {
    id: "eq-consultorio-vic",
    name: "Cabina Clínica & Bioseguridad en Mendoza 985",
    brand: "VIC Estética Integral",
    badge: "Río Segundo, Córdoba",
    category: "instalaciones",
    tagline: "Consultorio Privado, Camillas Articuladas, Asepsia Médica & Ambiente Climatizado",
    description: "Ubicado en Mendoza 985, Río Segundo. Espacio especialmente diseñado y equipado bajo estrictos protocolos sanitarios: camillas clínicas acolchadas, biombos divisorios para máxima privacidad, esterilización de instrumental con autoclave y calor seco, climatización y asesoramiento personalizado por profesionales matriculadas.",
    keySpecs: [
      { label: "Ubicación", value: "Mendoza 985, Río Segundo, Córdoba" },
      { label: "Privacidad", value: "Cabinas individuales con biombos sanitarios y aislamiento acústico suave" },
      { label: "Confort del Paciente", value: "Camillas clínicas acolchadas, climatización frío/calor y música relajante" },
      { label: "Bioseguridad", value: "Desinfección de grado médico entre pacientes y material descartable" }
    ],
    clinicalActions: [
      "Atención individualizada 1 a 1 sin esperas innecesarias",
      "Historia clínica digital y seguimiento fotográfico confidencial de evolución",
      "Evaluación cosmiátrica y kinésica personalizada antes de cada protocolo",
      "Asesoramiento integral en rutinas domiciliarias y hábitos saludables"
    ],
    cabinExperience: "Un oasis de tranquilidad, calma y privacidad para dedicarte tiempo y transformar tu bienestar.",
    idealFor: ["Pacientes que buscan atención seria, profesional y en un entorno cálido e higiénico"],
    sessionDuration: "Según tratamiento",
    frequency: "Atención con turno coordinado",
    relatedServiceId: "srv-fac-higiene",
    image: "/images/clinic_cabin_real.jpg"
  }
];

export const BUSINESS_DATA: BusinessInfo = {
  name: "VIC | Estética Integral",
  brandName: "VICTissera",
  tagline: "Tu bienestar, nuestra prioridad",
  description: "Espacio integral de aparatología de vanguardia, estética corporal y facial, depilación definitiva láser, fisioterapia, kinesiología, nutrición y manicuría en Río Segundo, Córdoba.",
  address: "Mendoza 985",
  city: "Río Segundo, Córdoba, Argentina",
  postalCode: "5960",
  phone: "5493572501956",
  phoneDisplay: "3572 50-1956",
  whatsappLink: "https://wa.me/5493572501956?text=Hola!%20Quiero%20consultar%20o%20reservar%20un%20turno%20en%20VIC%20Est%C3%A9tica%20Integral",
  instagram: "https://www.instagram.com/mavitissera.vic/",
  instagramHandle: "@mavitissera.vic",
  mapQuery: "Mendoza 985, Rio Segundo, Cordoba, Argentina",
  depositNotice: "Días y horarios personalizados. Jornadas fijas de atención y aparatología los días Jueves. Consultá promociones por sesiones combinadas.",
  openingHours: [
    { day: "Jueves (Jornadas fijas)", hours: "09:00 - 20:00 hs" },
    { day: "Lunes a Sábados", hours: "Días y horarios personalizados con turno coordinado" },
    { day: "Domingos", hours: "Cerrado" },
  ]
};

export const CATEGORIES_DATA: CategoryItem[] = [
  { id: "all", label: "Todos los Tratamientos", iconName: "Sparkles", tagline: "Catálogo completo de aparatología y clínica" },
  { id: "medicina-estetica", label: "Medicina Estética", iconName: "ShieldPlus", tagline: "Toxina botulínica, hialurónico & bioestimuladores (Dra. María Pía Gelso)" },
  { id: "depilacion", label: "Depilación Definitiva", iconName: "Zap", tagline: "Láser 4 longitudes de onda (Trends)" },
  { id: "corporales", label: "Tratamientos Corporales", iconName: "Flame", tagline: "VelaSlim, Alpha, Mío Up, Crio, Ultracavitación" },
  { id: "faciales", label: "Tratamientos Faciales", iconName: "Smile", tagline: "Alquimia MiniVac, RF Fraccionada, IPL, Electroporación" },
  { id: "kinesiologia", label: "Fisioterapia & Kinesiología", iconName: "Activity", tagline: "Rehabilitación y terapia manual (Lic. Olga Aguirre)" },
  { id: "nutricion", label: "Nutrición & Estética", iconName: "HeartPulse", tagline: "Plan integral y bienestar (Nadia Tissera)" },
  { id: "nails", label: "Manicuría & Bellelss Nails", iconName: "Hand", tagline: "Semipermanente, Kapping y Spa de Manos" },
];

export const PROFESSIONALS_DATA: Professional[] = [
  {
    name: "María Victoria (Mavi) Tissera",
    role: "Cosmetóloga, Dermatocosmiatra & Esteticista",
    initials: "MVT",
    color: "#c98a92",
    specialty: "Dirección clínica, cosmetología avanzada, Alquimia hidrodermoabrasión y aparatología facial y corporal de alta potencia.",
  },
  {
    name: "Dra. María Pía Gelso",
    role: "Médica Estética",
    initials: "MPG",
    color: "#9b6b7a",
    specialty: "Medicina estética facial y corporal, armonización facial, aplicación de toxina botulínica (Botox), rellenos con ácido hialurónico y bioestimuladores de colágeno.",
  },
  {
    name: "Lic. Olga Aguirre",
    role: "Lic. en Fisioterapia, Kinesiología & Esteticista",
    initials: "OA",
    color: "#6b8294",
    specialty: "Fisioterapia y kinesiología integral, rehabilitación miofascial, drenaje linfático médico y estética corporal biomecánica.",
  },
  {
    name: "Nadia Tissera",
    role: "Esteticista & Nutricionista (en formación avanzada)",
    initials: "NT",
    color: "#8a9bab",
    specialty: "Estética integral, protocolos de modelación corporal, acompañamiento en hábitos saludables y nutrición personalizada.",
  },
  {
    name: "Bellelss Nails",
    role: "Manicurista Profesional & Spa de Uñas",
    initials: "BN",
    color: "#b57a82",
    specialty: "Esmaltado semipermanente, capping gel, manicura rusa y cuidado profundo de la lámina ungueal.",
  },
];

export const SERVICES_DATA: ServiceItem[] = [
  // --- 0. MEDICINA ESTÉTICA (DRA. MARÍA PÍA GELSO) ---
  {
    id: "srv-med-botox",
    category: "medicina-estetica",
    name: "Toxina Botulínica (Botox) — Frente, Entrecejo & Patas de Gallo",
    duration: "30 min",
    priceCash: 120000,
    priceTransfer: 141176,
    description: "Aplicación médica de toxina botulínica de primera línea a cargo de la Dra. María Pía Gelso para relajar arrugas de expresión y rejuvenecer la mirada con naturalidad.",
    popular: true,
  },
  {
    id: "srv-med-hialuronico",
    category: "medicina-estetica",
    name: "Ácido Hialurónico — Relleno & Perfilado de Labios / Surcos",
    duration: "45 min",
    priceCash: 140000,
    priceTransfer: 164706,
    description: "Hidratación profunda, volumen y definición labial o relleno de surcos nasogenianos con ácido hialurónico reticulado de alta biocompatibilidad por la Dra. María Pía Gelso.",
    popular: true,
  },
  {
    id: "srv-med-bioestimulador",
    category: "medicina-estetica",
    name: "Bioestimuladores de Colágeno (Radiesse / Sculptra)",
    duration: "45 min",
    priceCash: 180000,
    priceTransfer: 211765,
    description: "Inducción biológica de colágeno autólogo para tensado facial, tratamiento de flacidez y reposicionamiento de vectores con resultados progresivos y duraderos.",
    popular: true,
  },
  {
    id: "srv-med-meso",
    category: "medicina-estetica",
    name: "Mesoterapia Médica Facial & Cuello (NCTF / Vitaminas)",
    duration: "40 min",
    priceCash: 55000,
    priceTransfer: 64706,
    description: "Microinyecciones dérmicas superficiales de complejos polirevitalizantes, ácido hialurónico no reticulado y antioxidantes para máxima luminosidad.",
  },
  {
    id: "srv-med-evaluacion",
    category: "medicina-estetica",
    name: "Consulta & Evaluación Médica Estética Integral",
    duration: "30 min",
    priceCash: 25000,
    priceTransfer: 29412,
    description: "Diagnóstico médico facial y corporal personalizado con la Dra. María Pía Gelso para diseñar un plan de tratamiento adaptado a tus expectativas.",
  },

  // --- 1. DEPILACIÓN DEFINITIVA (LÁSER 4 LONGITUDES DE ONDA) ---
  {
    id: "srv-dep-1",
    category: "depilacion",
    name: "Depilación Láser 4 Ondas — Zona Chica (Bozo / Axilas / Mentón)",
    duration: "20 min",
    priceCash: 15000,
    priceTransfer: 17647,
    description: "Tecnología láser de 4 longitudes de onda (755nm, 808nm, 940nm, 1064nm) con cabezal ultra-enfriado bajo cero para una sesión indolora, rápida y efectiva.",
    popular: true,
  },
  {
    id: "srv-dep-2",
    category: "depilacion",
    name: "Depilación Láser 4 Ondas — Zona Mediana (Medias Piernas / Cavado Completo)",
    duration: "40 min",
    priceCash: 25000,
    priceTransfer: 29412,
    description: "Tratamiento en zonas medias con cabezal ergonómico y frío continuo. Elimina el vello desde la raíz sin irritar la piel.",
    popular: true,
  },
  {
    id: "srv-dep-3",
    category: "depilacion",
    name: "Depilación Láser 4 Ondas — Zona Grande (Piernas Completas / Espalda)",
    duration: "1h",
    priceCash: 38000,
    priceTransfer: 44706,
    description: "Máxima cobertura y rapidez con tecnología Trends 4 longitudes de onda, apto para todo tipo de piel y vello en cualquier época del año.",
    popular: true,
  },
  {
    id: "srv-dep-4",
    category: "depilacion",
    name: "Fotorejuvenecimiento Láser con Cabezal Trends",
    duration: "30 min",
    priceCash: 28000,
    priceTransfer: 32941,
    description: "Emisión lumínica focalizada para estimular colágeno, unificar el tono dérmico y devolver luminosidad al rostro, cuello o escote.",
  },

  // --- 2. TRATAMIENTOS CORPORALES & APARATOLOGÍA DE ALTA GAMA ---
  {
    id: "srv-corp-velaslim",
    category: "corporales",
    name: "VelaSlim Plus — Modelación & Anticelulitis",
    duration: "45 min",
    priceCash: 36000,
    priceTransfer: 42352,
    description: "Potente tecnología 4 en 1: Radiofrecuencia bipolar + Vacumterapia + Rodillos mecánicos + Luz Infrarroja. Reduce circunferencia corporal y alisa la piel de naranja.",
    popular: true,
  },
  {
    id: "srv-corp-alpha",
    category: "corporales",
    name: "Alpha Synergy (Starbene) — Tensado & Remodelación",
    duration: "45 min",
    priceCash: 34000,
    priceTransfer: 40000,
    description: "Equipo médico-estético de Starbene con radiofrecuencia multipolar profunda y vacum dinámico para reafirmar tejidos, drenar y combatir la flacidez.",
    popular: true,
  },
  {
    id: "srv-corp-mioup",
    category: "corporales",
    name: "Mío Up & Body Up — Estimulación Miofascial y Tonificación",
    duration: "40 min",
    priceCash: 32000,
    priceTransfer: 37647,
    description: "Reclutamiento neuromuscular profundo para levantar glúteos, marcar abdomen y tonificar brazos y piernas sin sobrecargar articulaciones.",
    popular: true,
  },
  {
    id: "srv-corp-teslagen",
    category: "corporales",
    name: "Teslagen DUO — Campo Electromagnético Focalizado",
    duration: "35 min",
    priceCash: 38000,
    priceTransfer: 44706,
    description: "Tecnología de pulsos electromagnéticos de alta intensidad (HIFEM) que genera miles de contracciones supramáximas en glúteos o abdomen por sesión.",
  },
  {
    id: "srv-corp-ultracav",
    category: "corporales",
    name: "Ultracavitación — Reducción de Adiposidad Localizada",
    duration: "40 min",
    priceCash: 30000,
    priceTransfer: 35294,
    description: "Ondas ultrasónicas que provocan implosión de las células grasas rebeldes en abdomen, flancos y pantalón de montar.",
  },
  {
    id: "srv-corp-crio",
    category: "corporales",
    name: "Criolipólisis — Reducción por Frío Controlado",
    duration: "1h",
    priceCash: 45000,
    priceTransfer: 52941,
    description: "Enfriamiento controlado del tejido graso que induce la apoptosis (eliminación natural y definitiva) de adipocitos sin incisiones ni tiempo de recuperación.",
  },
  {
    id: "srv-corp-exilis",
    category: "corporales",
    name: "Exilis 360 — Radiofrecuencia Monopolar + Ultrasonido",
    duration: "45 min",
    priceCash: 42000,
    priceTransfer: 49411,
    description: "Sinergia de radiofrecuencia volumétrica y ultrasonido continuo para tensado dérmico extremo y disolución de grasa localizada.",
  },
  {
    id: "srv-corp-drenaje",
    category: "corporales",
    name: "Drenaje Linfático Manual & Masaje Terapéutico",
    duration: "50 min",
    priceCash: 28000,
    priceTransfer: 32941,
    description: "Maniobras suaves y rítmicas a cargo de profesionales para desinflamar, reducir retención de líquidos y favorecer la circulación venosa y linfática.",
  },

  // --- 3. TRATAMIENTOS FACIALES & DERMATOCOMIATRÍA ---
  {
    id: "srv-fac-alquimia",
    category: "faciales",
    name: "Alquimia (Ecleris MiniVac) — Hidrodermoabrasión & Infusión Activa",
    duration: "1h",
    priceCash: 38000,
    priceTransfer: 44706,
    description: "Tecnología médica de hidrodermoabrasión con viales de infusión transdérmica de ácido hialurónico, vitaminas y exfoliantes suaves. Limpia, exfolia e hidrata al instante.",
    popular: true,
  },
  {
    id: "srv-fac-rffracc",
    category: "faciales",
    name: "Radiofrecuencia Fraccionada Facial & Cuello",
    duration: "45 min",
    priceCash: 40000,
    priceTransfer: 47058,
    description: "Micro-columnas térmicas que estimulan la síntesis masiva de colágeno y elastina, atenuando líneas de expresión, poros dilatados y marcas dérmicas.",
    popular: true,
  },
  {
    id: "srv-fac-ipl",
    category: "faciales",
    name: "Luz Pulsada Intensa (IPL) — Manchas, Rosácea & Rejuvenecimiento",
    duration: "40 min",
    priceCash: 35000,
    priceTransfer: 41176,
    description: "Tratamiento lumínico selectivo para eliminar manchas solares, venitas, rojeces de rosácea y emparejar la tonalidad del rostro.",
    popular: true,
  },
  {
    id: "srv-fac-electroporacion",
    category: "faciales",
    name: "Electroporación Facial (Mesoterapia Virtual sin Agujas)",
    duration: "45 min",
    priceCash: 30000,
    priceTransfer: 35294,
    description: "Apertura de microporos celulares transitorios mediante impulsos electromagnéticos para introducir activos concentrados en capas profundas de la dermis.",
  },
  {
    id: "srv-fac-suavel",
    category: "faciales",
    name: "Tratamiento Suavel — Regeneración Dérmica & Confort",
    duration: "45 min",
    priceCash: 28000,
    priceTransfer: 32941,
    description: "Protocolo calmante y bioestimulante para pieles sensibles, reactivas o en proceso de recuperación post-tratamiento.",
  },
  {
    id: "srv-fac-limpieza",
    category: "faciales",
    name: "Limpieza Facial Profunda Dermatocosmiátrica",
    duration: "1h",
    priceCash: 32000,
    priceTransfer: 37647,
    description: "Higiene profunda con espátula ultrasónica, vapor, extracciones asépticas, alta frecuencia oxigenante y máscara descongestiva por Mavi Tissera.",
    popular: true,
  },
  {
    id: "srv-fac-peeling",
    category: "faciales",
    name: "Peeling Químico Cosmecéutico (Mandélico / Salicílico)",
    duration: "45 min",
    priceCash: 35000,
    priceTransfer: 41176,
    description: "Exfoliación química controlada para renovar la textura de la piel, tratar secuelas de acné, regular sebo y atenuar fotoenvejecimiento.",
  },

  // --- 4. FISIOTERAPIA & KINESIOLOGÍA ---
  {
    id: "srv-kin-sesion",
    category: "kinesiologia",
    name: "Sesión de Fisioterapia & Kinesiología Integral",
    duration: "45 min",
    priceCash: 28000,
    priceTransfer: 32941,
    description: "Evaluación y tratamiento kinésico personalizado a cargo de la Lic. Olga Aguirre para rehabilitación muscular, dolor crónico y movilidad articular.",
    popular: true,
  },
  {
    id: "srv-kin-postural",
    category: "kinesiologia",
    name: "Rehabilitación Postural & Dolor Miofascial",
    duration: "1h",
    priceCash: 32000,
    priceTransfer: 37647,
    description: "Terapia manual miofascial y ejercicios posturales guiados para cervicalgias, lumbalgias y contracturas por estrés.",
  },

  // --- 5. NUTRICIÓN & ESTÉTICA INTEGRAL ---
  {
    id: "srv-nutri-consulta",
    category: "nutricion",
    name: "Consulta de Nutrición & Asesoría Estética Integral",
    duration: "45 min",
    priceCash: 25000,
    priceTransfer: 29412,
    description: "Plan de alimentación saludable adaptado a tus objetivos corporales, complementado con el plan de aparatología estética por Nadia Tissera.",
    popular: true,
  },

  // --- 6. MANICURÍA (BELLELSS NAILS) ---
  {
    id: "srv-nail-semi",
    category: "nails",
    name: "Manicura Rusa & Esmaltado Semipermanente",
    duration: "1h",
    priceCash: 18000,
    priceTransfer: 21176,
    description: "Limpieza anatómica de cutículas, esmaltado semipermanente de alta duración y acabado impecable por Bellelss Nails.",
    popular: true,
  },
  {
    id: "srv-nail-kapping",
    category: "nails",
    name: "Kapping Gel & Fortalecimiento Ungueal",
    duration: "1h 15min",
    priceCash: 22000,
    priceTransfer: 25882,
    description: "Capa protectora de gel o acrigel sobre la uña natural para evitar quiebres y permitir un crecimiento sano y resistente.",
  },
  {
    id: "srv-nail-pedicura",
    category: "nails",
    name: "Pedicura Spa & Esmaltado",
    duration: "1h",
    priceCash: 22000,
    priceTransfer: 25882,
    description: "Belleza y salud de pies con exfoliación profunda, hidratación intensiva, tratamiento de durezas y esmaltado profesional.",
  },
];

export const CLINICAL_PROTOCOLS: Record<string, ClinicalProtocol> = {
  "srv-med-botox": {
    serviceId: "srv-med-botox",
    steps: [
      { phase: "Fase 1: Evaluación Médica & Mapeo Facial", description: "Análisis dinámico de la mímica facial, líneas de expresión y marcación de puntos estratégicos por la Dra. María Pía Gelso." },
      { phase: "Fase 2: Asepsia & Anestesia Tópica", description: "Desinfección rigurosa de la zona y aplicación de crema anestésica para máximo confort." },
      { phase: "Fase 3: Microinyecciones de Toxina Botulínica", description: "Aplicación precisa con microagujas ultra finas en dosis adaptadas para un resultado natural y armónico." },
      { phase: "Fase 4: Indicaciones Post-Tratamiento", description: "Recomendaciones posturales para las 4 horas posteriores y seguimiento de evolución." }
    ],
    benefits: [
      "Suaviza y previene arrugas en frente, entrecejo y patas de gallo",
      "Apertura y rejuvenecimiento de la mirada sin perder expresividad",
      "Efecto lifting sutil y relajación muscular",
      "Resultados visibles a partir de las 48-72h con pico a los 15 días"
    ],
    indications: ["Arrugas dinámicas de expresión", "Líneas de ceño fruncido", "Patas de gallo", "Prevención de arrugas estáticas"],
    recommendedSessions: "1 aplicación cada 4 a 6 meses según necesidad individual.",
    preCare: ["Evitar consumo de aspirinas o anticoagulantes 48h previas", "No consumir alcohol 24h antes"],
    postCare: ["No acostarse ni masajear la zona tratada por 4 horas", "Evitar actividad física intensa y sauna por 24h", "Usar protector solar"],
    contraindications: ["Embarazo y lactancia", "Enfermedades neuromusculares (ej. Miastenia gravis)", "Infección en el sitio de inyección"]
  },
  "srv-fac-alquimia": {
    serviceId: "srv-fac-alquimia",
    steps: [
      { phase: "Fase 1: Diagnóstico Dérmico", description: "Evaluación del estrato córneo, nivel de oleosidad y sensibilidad." },
      { phase: "Fase 2: Hidrodermoabrasión con MiniVac", description: "Succión suave combinada con líquido exfoliante que ablanda y remueve impurezas y células muertas." },
      { phase: "Fase 3: Infusión de Sueros Bioactivos", description: "Penetración de principios activos hidratantes y antioxidantes con la punta metálica de precisión Alquimia." },
      { phase: "Fase 4: Máscara Oclusiva & Sellado", description: "Sellado con emulsión hidratante y protector solar FPS 50+." }
    ],
    benefits: [
      "Limpieza profunda e indolora sin enrojecimiento severo",
      "Piel hidratada, tersa y con brillo natural inmediato",
      "Reducción visual de poros y descongestión de comedones",
      "Apto para eventos previos o mantenimiento mensual"
    ],
    indications: ["Rostro opaco", "Poros dilatados", "Puntos negros", "Piel deshidratada"],
    recommendedSessions: "1 sesión cada 21 a 30 días.",
    preCare: ["Evitar sol intenso 24h previas", "No usar exfoliantes mecánicos agresivos"],
    postCare: ["Aplicar fotoprotector FPS 50+", "Mantener hidratación dérmica diaria"],
    contraindications: ["Infecciones dérmicas activas", "Dermatitis aguda"]
  },
  "srv-corp-velaslim": {
    serviceId: "srv-corp-velaslim",
    steps: [
      { phase: "Fase 1: Medición & Marcación", description: "Delimitación de la zona a tratar y registro de medidas corporales." },
      { phase: "Fase 2: Aplicación de Emulsión Conductora", description: "Crema especial termoactiva para deslizamiento óptimo de los rodillos." },
      { phase: "Fase 3: Masaje Mecánico + Vacum + RF", description: "Pasadas profundas con cabezal VelaSlim generando calor controlado y drenaje simultáneo." },
      { phase: "Fase 4: Retiro & Gel Criogénico Reafirmante", description: "Finalización con producto reafirmante y consejos de hidratación." }
    ],
    benefits: [
      "Alisado visible de la celulitis y piel de naranja",
      "Reducción de centímetros en contorno corporal",
      "Mejora sustancial en la microcirculación local",
      "Estimulación de nuevo colágeno en tejido subcutáneo"
    ],
    indications: ["Celulitis compacta y flácida", "Adiposidad localizada en muslos, abdomen y glúteos", "Retención de líquidos"],
    recommendedSessions: "Plan de 6 a 8 sesiones con frecuencia semanal o quincenal.",
    preCare: ["Beber 1 a 2 litros de agua antes de la sesión", "Asistir con ropa cómoda"],
    postCare: ["Mantener hidratación abundante", "Realizar caminatas o actividad física para potenciar el drenaje"],
    contraindications: ["Embarazo", "Marcapasos", "Trombosis venosa"]
  },
  "srv-dep-1": {
    serviceId: "srv-dep-1",
    steps: [
      { phase: "Fase 1: Asepsia & Marcado", description: "Limpieza antiséptica de la zona a tratar." },
      { phase: "Fase 2: Gel Conductor & Gafas de Seguridad", description: "Colocación de gel refrigerante y protección ocular homologada." },
      { phase: "Fase 3: Disparos Láser 4 Longitudes de Onda", description: "Barrido continuo con enfriamiento criogénico de contacto bajo cero para máxima eficacia e indoloro." },
      { phase: "Fase 4: Gel Calmante con Aloe & Caléndula", description: "Retiro de gel y aplicación de descongestivo." }
    ],
    benefits: [
      "Eliminación progresiva y permanente del folículo piloso",
      "Cura la foliculitis (vellos encarnados) y manchas asociadas",
      "Tecnología 4 ondas apta para todo tipo de vello y piel",
      "Tratamiento seguro, rápido y confortable"
    ],
    indications: ["Vellos rebeldes o encarnados", "Irritación por cera o maquinita", "Deseo de depilación definitiva"],
    recommendedSessions: "6 a 8 sesiones con intervalos de 30 a 45 días.",
    preCare: ["Rasurar la zona con máquina de afeitar 12-24h antes", "No usar pinzas ni cera 15 días previos", "No tomar sol directo 48h antes"],
    postCare: ["Evitar agua hirviendo las primeras 12h", "Usar protector solar en zonas expuestas", "Hidratar la piel"],
    contraindications: ["Tatuajes sobre la zona exacta de disparo", "Embarazo", "Medicamentos fotosensibilizantes"]
  }
};

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: "test-1",
    text: "La atención de Mavi y su equipo es de primer nivel. El tratamiento Alquimia me dejó la piel con un brillo y una suavidad increíbles desde la primera sesión.",
    author: "María Victoria G.",
    service: "Alquimia (Hidrodermoabrasión) & Facial",
    stars: 5,
    date: "Río Segundo",
  },
  {
    id: "test-2",
    text: "Excelente el láser de 4 ondas. No duele absolutamente nada por el cabezal frío y los resultados en las piernas se notaron rapidísimo.",
    author: "Lucía P.",
    service: "Depilación Láser 4 Ondas (Trends)",
    stars: 5,
    date: "Río Segundo",
  },
  {
    id: "test-3",
    text: "La Lic. Olga Aguirre es una profesional excepcional. Me ayudó a recuperarme de una contractura cervical tremenda con kinesiología y masajes.",
    author: "Carolina M.",
    service: "Fisioterapia & Kinesiología Integral",
    stars: 5,
    date: "Córdoba",
  },
  {
    id: "test-4",
    text: "VelaSlim y Alpha Synergy son un antes y un después para las piernas y glúteos. La combinación de aparatología que tienen en el consultorio es impresionante.",
    author: "Sofía R.",
    service: "VelaSlim Plus & Alpha Synergy",
    stars: 5,
    date: "Río Segundo",
  },
  {
    id: "test-5",
    text: "Me encanta la calidez del lugar. Te atienden de manera súper personalizada y los turnos los coordinás fácilmente por WhatsApp.",
    author: "Valeria B.",
    service: "Radiofrecuencia Fraccionada & IPL",
    stars: 5,
    date: "Pilar, Cba",
  },
  {
    id: "test-6",
    text: "Las uñas con Bellelss Nails quedan prolijas y duran semanas intactas. El ambiente de VIC es hermoso y relajante.",
    author: "Agustina D.",
    service: "Manicura Rusa & Semipermanente",
    stars: 5,
    date: "Río Segundo",
  }
];

export const HIGHLIGHTS_DATA = [
  {
    id: "hl-1",
    title: "Aparatología de Alta Potencia",
    text: "Trends Láser 4 Ondas, VelaSlim Plus, Alpha Synergy, Ecleris Alquimia MiniVac, Teslagen DUO, Mío Up, Exilis 360 y Criolipólisis.",
  },
  {
    id: "hl-2",
    title: "Equipo Multidisciplinario",
    text: "Medicina Estética (Dra. María Pía Gelso), Cosmetología y Dermatocosmiatría (Mavi Tissera), Fisioterapia y Kinesiología (Lic. Olga Aguirre), Nutrición (Nadia Tissera) y Manicuría.",
  },
  {
    id: "hl-3",
    title: "Atención & Horarios Personalizados",
    text: "Días y horarios adaptados a tu disponibilidad, con jornadas fijas los días Jueves y coordinación directa por WhatsApp (3572 50-1956).",
  },
  {
    id: "hl-4",
    title: "Espacio Íntimo & Bioseguridad",
    text: "Consultorios privados y climatizados en Mendoza 985, Río Segundo, pensados para tu confort, desconexión y relajación.",
  },
];

export const FAQ_DATA = [
  {
    category: "turnos",
    q: "¿Cuáles son los días y horarios de atención en VIC Estética?",
    a: "Nuestros días y horarios son personalizados y flexibles según la comodidad de la paciente, con jornadas fijas destacadas los días Jueves. Coordinamos los turnos de manera directa y personalizada por WhatsApp al 3572 50-1956."
  },
  {
    category: "medicina",
    q: "¿Qué procedimientos de Medicina Estética realiza la Dra. María Pía Gelso?",
    a: "La Dra. María Pía Gelso realiza aplicaciones de toxina botulínica (Botox) para líneas de expresión, rellenos y armonización labial y facial con ácido hialurónico, bioestimuladores de colágeno (Radiesse/Sculptra) y mesoterapia facial polirevitalizante."
  },
  {
    category: "general",
    q: "¿Dónde está ubicado el consultorio?",
    a: "Estamos ubicados en Mendoza 985, Río Segundo, Córdoba (CP 5960), en un espacio climatizado y privado con fácil estacionamiento al frente."
  },
  {
    category: "equipamiento",
    q: "¿Qué aparatología y tecnologías médicas tienen disponibles?",
    a: "Contamos con equipamiento de última generación: Láser 4 longitudes de onda (Trends), VelaSlim Plus, Alpha Synergy (Starbene), Ecleris Alquimia MiniVac (hidrodermoabrasión), Teslagen DUO, Mío Up, Body Up, Ultracavitación, Criolipólisis, Radiofrecuencia Fraccionada, Exilis 360, Luz Pulsada IPL y Electroporación."
  },
  {
    category: "depilacion",
    q: "¿Cómo funciona la depilación definitiva con láser 4 longitudes de onda?",
    a: "El equipo emite simultáneamente 4 longitudes de onda (755nm, 808nm, 940nm y 1064nm), permitiendo destruir el folículo en diferentes profundidades dérmicas. Además cuenta con cabezal ultra-enfriado bajo cero, haciendo que la sesión sea totalmente indolora y segura para cualquier época del año."
  },
  {
    category: "faciales",
    q: "¿Qué es el tratamiento Alquimia (Ecleris MiniVac)?",
    a: "Es un tratamiento no invasivo de hidrodermoabrasión con succión controlada y puntas de acero quirúrgico que extrae impurezas mientras infunde en profundidad sueros bioactivos (ácido hialurónico, vitaminas y antioxidantes). Deja la piel luminosa, limpia y profundamente hidratada de inmediato."
  },
  {
    category: "kinesiologia",
    q: "¿Qué atención brinda la Lic. Olga Aguirre en Kinesiología y Fisioterapia?",
    a: "La Lic. Olga Aguirre realiza tratamientos de rehabilitación postural, alivio de dolores articulares y musculares, kinesiología integral, masajes descontracturantes y drenaje linfático médico para post-operatorios o retención de líquidos."
  },
  {
    category: "pagos",
    q: "¿Qué formas de pago aceptan y cómo se informa la tarifa?",
    a: "Aceptamos pago en efectivo con un 15% de descuento bonificado en todas las sesiones, además de transferencias bancarias y billeteras virtuales. El valor exacto y las promociones vigentes se confirman de forma personalizada al solicitar o consultar tu turno."
  }
];

export function formatPrice(amount: number): string {
  return "$ " + Math.round(amount).toLocaleString("es-AR");
}
