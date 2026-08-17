import React, { useState, useEffect } from 'react';
import { X, Star, Sparkles, CheckCircle2, Heart } from 'lucide-react';
import { SERVICES_DATA } from '../data/aestheticData';
import { Testimonial } from '../types';

interface ReviewSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReview: (review: Testimonial) => void;
}

export const ReviewSubmissionModal: React.FC<ReviewSubmissionModalProps> = ({
  isOpen,
  onClose,
  onAddReview,
}) => {
  const [author, setAuthor] = useState('');
  const [service, setService] = useState(SERVICES_DATA[0].name);
  const [stars, setStars] = useState(5);
  const [hoverStars, setHoverStars] = useState(0);
  const [text, setText] = useState('');
  const [city, setCity] = useState('Río Segundo');
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) {
      alert('Por favor completá tu nombre y comentario.');
      return;
    }

    const newReview: Testimonial = {
      id: 'test-custom-' + Date.now(),
      author: author.trim(),
      service: service,
      stars: stars,
      text: text.trim(),
      date: city.trim() || 'Río Segundo',
    };

    onAddReview(newReview);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1600);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2c2725]/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-[#fcfaf7] rounded-3xl border border-[#ede8e3] shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#f5f0eb] p-6 border-b border-[#ede8e3] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#c98a92] text-white flex items-center justify-center text-xs font-bold font-serif-cormorant">
              VIC
            </div>
            <div>
              <h3 className="font-serif-cormorant text-2xl font-bold text-[#2c2725]">
                Dejar una Reseña
              </h3>
              <p className="text-xs text-[#6b6462]">
                Contanos cómo fue tu experiencia en VIC Estética Integral
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white text-[#6b6462] hover:text-[#2c2725] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#f7eef0] text-[#c98a92] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-serif-cormorant text-2xl font-bold text-[#2c2725]">
              ¡Muchas gracias por tu reseña!
            </h4>
            <p className="text-xs text-[#6b6462]">
              Tu testimonio nos ayuda a seguir mejorando y cuidando cada detalle de tu experiencia.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
            {/* Stars Rating */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2c2725] mb-2 text-center">
                Calificación General
              </label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onMouseEnter={() => setHoverStars(s)}
                    onMouseLeave={() => setHoverStars(0)}
                    onClick={() => setStars(s)}
                    className="p-1.5 transition-transform hover:scale-125 cursor-pointer"
                  >
                    <Star 
                      className={`w-7 h-7 ${
                        (hoverStars || stars) >= s 
                          ? 'fill-[#c98a92] text-[#c98a92]' 
                          : 'text-[#ded3cb]'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Author */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2c2725] mb-1.5">
                Tu Nombre y Apellido
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Luciana Gómez"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#ede8e3] rounded-xl text-sm text-[#2c2725] placeholder:text-[#9e9490] focus:ring-2 focus:ring-[#c98a92]/50 focus:outline-none"
              />
            </div>

            {/* Service & City in 2 Cols */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2c2725] mb-1.5">
                  Tratamiento Realizado
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#ede8e3] rounded-xl text-xs text-[#2c2725] focus:ring-2 focus:ring-[#c98a92]/50 focus:outline-none"
                >
                  {SERVICES_DATA.map((srv) => (
                    <option key={srv.id} value={srv.name}>
                      {srv.name}
                    </option>
                  ))}
                  <option value="Atención General / Varios">Atención General / Varios</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2c2725] mb-1.5">
                  Ciudad / Localidad
                </label>
                <input
                  type="text"
                  placeholder="Ej: Río Segundo, Pilar..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#ede8e3] rounded-xl text-xs text-[#2c2725] placeholder:text-[#9e9490] focus:ring-2 focus:ring-[#c98a92]/50 focus:outline-none"
                />
              </div>
            </div>

            {/* Feedback text */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2c2725] mb-1.5">
                Tu Opinión / Experiencia
              </label>
              <textarea
                required
                rows={3}
                placeholder="Contanos qué te pareció la atención, el espacio, los resultados..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#ede8e3] rounded-xl text-xs text-[#2c2725] placeholder:text-[#9e9490] focus:ring-2 focus:ring-[#c98a92]/50 focus:outline-none leading-relaxed"
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-full bg-[#c98a92] hover:bg-[#b57a82] text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md cursor-pointer active:scale-98"
              >
                Publicar mi Reseña
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
