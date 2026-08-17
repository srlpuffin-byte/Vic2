import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  Smile, 
  HeartPulse, 
  Zap, 
  Activity, 
  Stethoscope, 
  Flame, 
  ShieldPlus, 
  Hand,
  Clock, 
  ChevronRight,
  Info,
  Filter,
  Layers,
  ArrowUpDown,
  BookOpen,
  CalendarCheck,
  Calendar
} from 'lucide-react';
import { CATEGORIES_DATA, SERVICES_DATA, BUSINESS_DATA } from '../data/aestheticData';
import { ServiceItem } from '../types';

interface ServiceCatalogProps {
  onSelectServiceForBooking: (service: ServiceItem) => void;
  onOpenServiceDetail: (service: ServiceItem) => void;
  onOpenComboPlanner: () => void;
}

export const ServiceCatalog: React.FC<ServiceCatalogProps> = ({ 
  onSelectServiceForBooking,
  onOpenServiceDetail,
  onOpenComboPlanner
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'name'>('popular');

  // Category Icon Resolver
  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'faciales': return <Smile className="w-4 h-4" />;
      case 'corporales': return <Flame className="w-4 h-4" />;
      case 'depilacion': return <Zap className="w-4 h-4" />;
      case 'kinesiologia': return <Activity className="w-4 h-4" />;
      case 'fisioterapia': return <Stethoscope className="w-4 h-4" />;
      case 'modeladores': return <Flame className="w-4 h-4" />;
      case 'medicina-estetica': return <ShieldPlus className="w-4 h-4" />;
      case 'nutricion': return <HeartPulse className="w-4 h-4" />;
      case 'nails': return <Hand className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  // Filtered and Sorted Services
  const filteredServices = useMemo(() => {
    let result = SERVICES_DATA.filter(service => {
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      const matchesSearch = 
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Popular first
      result.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  // Counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: SERVICES_DATA.length };
    SERVICES_DATA.forEach(s => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <section id="tratamientos" className="py-20 bg-[#fcfaf7] border-t border-[#ede8e3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 gsap-section-header">
          <span className="text-xs uppercase tracking-[0.25em] text-[#c98a92] font-semibold block mb-2">
            Catálogo Profesional
          </span>
          <h2 className="font-serif-cormorant text-4xl sm:text-5xl text-[#2c2725] font-semibold tracking-tight">
            Nuestros Tratamientos & Servicios
          </h2>
          <p className="mt-3 text-base text-[#6b6462] leading-relaxed">
            Tecnología médica, experiencia profesional y protocolos personalizados para el cuidado facial, corporal y bienestar integral.
          </p>
        </div>

        {/* Combo Customizer Banner */}
        <div className="bg-gradient-to-r from-[#fbf0f2] via-[#f7eef0] to-[#fbf0f2] rounded-3xl p-6 sm:p-8 border border-[#f0d4d8] shadow-sm mb-12 flex flex-col md:flex-row items-center justify-between gap-6 gsap-reveal-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#c98a92] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#b57a82] block">
                Pack / Día de Spa Personalizado
              </span>
              <h3 className="font-serif-cormorant text-2xl sm:text-3xl font-bold text-[#2c2725]">
                ¿Querés combinar varios tratamientos?
              </h3>
              <p className="text-xs sm:text-sm text-[#6b6462] mt-1 max-w-xl">
                Armá tu propio combo (Faciales + Masajes + Uñas + Láser), calculá el ahorro con el 15% de bonificación en efectivo y reservá tu visita integral.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenComboPlanner}
            className="px-6 py-3 rounded-full bg-[#2c2725] hover:bg-[#c98a92] text-white text-xs font-bold uppercase tracking-widest transition-all shadow-sm flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Armar Combo Personalizado</span>
          </button>
        </div>

        {/* Search & Price & Sort Toolbar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#ede8e3] soft-card-shadow mb-8 flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-[#8a807d] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="service-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar facial, láser, botox, masaje..."
              className="w-full pl-10 pr-8 py-2 text-sm bg-[#faf7f4] border border-[#ede8e3] rounded-xl text-[#2c2725] placeholder:text-[#9e9490] focus:outline-none focus:ring-2 focus:ring-[#c98a92]/40 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9e9490] hover:text-[#2c2725]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            <div className="flex items-center gap-1.5 bg-[#faf7f4] border border-[#ede8e3] px-3.5 py-2 rounded-xl text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#8a807d]" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent text-xs text-[#2c2725] font-medium focus:outline-none cursor-pointer"
              >
                <option value="popular">Más solicitados</option>
                <option value="name">Alfabético (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {CATEGORIES_DATA.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                id={`cat-btn-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#2c2725] text-white border-[#2c2725] shadow-sm scale-105'
                    : 'bg-white text-[#4a423f] border-[#ede8e3] hover:border-[#c98a92] hover:text-[#c98a92]'
                }`}
              >
                <span className={isSelected ? 'text-[#c98a92]' : 'text-[#8a807d]'}>
                  {getCategoryIcon(cat.id)}
                </span>
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#f5f0eb] text-[#6b6462]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#ede8e3]">
            <p className="text-base text-[#6b6462]">No se encontraron tratamientos con tu búsqueda actual.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-6 py-2 rounded-full bg-[#c98a92] text-white text-xs font-semibold uppercase tracking-wider"
            >
              Ver todos los tratamientos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-[#ede8e3] soft-card-hover flex flex-col justify-between relative group h-full shadow-sm hover:shadow-md transition-shadow gsap-reveal-card gsap-tilt-card"
              >
                {/* Popular Pill */}
                {service.popular && (
                  <div className="absolute top-4 right-4 bg-[#fbf0f2] text-[#b57a82] border border-[#f0d4d8] text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Destacado</span>
                  </div>
                )}

                <div>
                  {/* Category mini badge */}
                  <span className="text-[11px] font-semibold text-[#c98a92] uppercase tracking-wider block mb-2">
                    {service.category.replace('-', ' ')}
                  </span>

                  {/* Title */}
                  <h3 
                    onClick={() => onOpenServiceDetail(service)}
                    className="font-serif-cormorant text-2xl font-bold text-[#2c2725] group-hover:text-[#c98a92] transition-colors leading-tight mb-2 cursor-pointer"
                  >
                    {service.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[#6b6462] leading-relaxed mb-4 line-clamp-3">
                    {service.description}
                  </p>

                  {/* Protocol Quick Link */}
                  <button
                    type="button"
                    onClick={() => onOpenServiceDetail(service)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#c98a92] hover:text-[#b57a82] uppercase tracking-wider mb-6 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Ver ficha y protocolo clínico</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-[#ede8e3]/80">
                  {/* Duration & Value notice */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5 text-xs text-[#6b6462] font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#c98a92]" />
                      <span>{service.duration}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-semibold text-[#c98a92] tracking-wide block">
                        Atención Personalizada
                      </span>
                      <span className="text-[10px] text-[#8a807d] block">
                        Tarifa informada al reservar
                      </span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenServiceDetail(service)}
                      className="py-2.5 px-3 rounded-full border border-[#ede8e3] text-[#4a423f] hover:border-[#c98a92] hover:text-[#c98a92] text-xs font-semibold text-center transition-colors cursor-pointer"
                    >
                      Detalles
                    </button>

                    <button
                      id={`book-service-${service.id}`}
                      onClick={() => onSelectServiceForBooking(service)}
                      className="py-2.5 px-3 rounded-full bg-[#c98a92] hover:bg-[#b57a82] text-white text-xs font-semibold text-center uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Reservar</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
