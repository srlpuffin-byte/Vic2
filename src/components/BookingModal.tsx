import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Check, 
  CreditCard, 
  Banknote, 
  User, 
  Phone, 
  MessageSquare, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Info,
  Gift,
  QrCode,
  ExternalLink,
  Search,
  AlertCircle
} from 'lucide-react';
import { ServiceItem, AppointmentItem, GiftCardItem } from '../types';
import { SERVICES_DATA, BUSINESS_DATA, formatPrice } from '../data/aestheticData';
import { SystemStorage } from '../utils/systemStorage';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedService?: ServiceItem | null;
  preSelectedPaymentMethod?: 'cash' | 'transfer' | 'giftcard';
  onOpenSystem?: (tab?: 'appointments' | 'giftcards' | 'issue-giftcard' | 'client-portal') => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ 
  isOpen, 
  onClose, 
  preSelectedService,
  preSelectedPaymentMethod = 'cash',
  onOpenSystem
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preSelectedService ? preSelectedService.id : SERVICES_DATA[0].id
  );
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer' | 'giftcard'>(preSelectedPaymentMethod);
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(0);
  const [timeSlot, setTimeSlot] = useState<string>('10:00');
  const [timeShift, setTimeShift] = useState<'morning' | 'afternoon'>('morning');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  // Gift Card validation within booking
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [appliedGiftCard, setAppliedGiftCard] = useState<GiftCardItem | null>(null);
  const [giftCardError, setGiftCardError] = useState<string | null>(null);

  // Success Confirmation Pass screen state
  const [confirmedAppointment, setConfirmedAppointment] = useState<AppointmentItem | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Sync selected service when preSelectedService or modal opens
  useEffect(() => {
    if (preSelectedService) {
      setSelectedServiceId(preSelectedService.id);
    }
  }, [preSelectedService, isOpen]);

  // Handle ESC key and prevent body scroll
  useEffect(() => {
    if (!isOpen) {
      setConfirmedAppointment(null);
      return;
    }

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

  // Generate next 14 business days
  const availableDates = useMemo(() => {
    const dates = [];
    const now = new Date();
    let current = new Date(now);

    while (dates.length < 10) {
      const dayOfWeek = current.getDay(); // 0 is Sunday
      if (dayOfWeek !== 0) { // Exclude Sundays
        const isToday = current.toDateString() === now.toDateString();
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        const isTomorrow = current.toDateString() === tomorrow.toDateString();

        const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

        let label = `${dayNames[dayOfWeek]} ${current.getDate()} ${monthNames[current.getMonth()]}`;
        if (isToday) label = `Hoy (${current.getDate()} ${monthNames[current.getMonth()]})`;
        if (isTomorrow) label = `Mañana (${current.getDate()} ${monthNames[current.getMonth()]})`;

        dates.push({
          dateObj: new Date(current),
          dateString: current.toISOString().split('T')[0],
          display: label,
          dayName: dayNames[dayOfWeek],
          dayNum: current.getDate(),
          monthName: monthNames[current.getMonth()]
        });
      }
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }, []);

  if (!isOpen) return null;

  const currentService = SERVICES_DATA.find(s => s.id === selectedServiceId) || SERVICES_DATA[0];
  
  // Base price according to method
  const basePrice = paymentMethod === 'cash' ? currentService.priceCash : currentService.priceTransfer;
  
  // Apply Gift Card deduction if applied
  const giftCardDeduction = appliedGiftCard ? Math.min(basePrice, appliedGiftCard.remainingBalance) : 0;
  const finalPrice = Math.max(0, basePrice - giftCardDeduction);
  const savings = currentService.priceTransfer - currentService.priceCash;

  const morningSlots = ['09:00', '09:45', '10:30', '11:15', '12:00', '12:45'];
  const afternoonSlots = ['14:00', '14:45', '15:30', '16:15', '17:00', '18:00', '19:00'];
  const currentSlots = timeShift === 'morning' ? morningSlots : afternoonSlots;

  const selectedDate = availableDates[selectedDateIndex] || availableDates[0];

  // Gift Card validation logic
  const handleApplyGiftCard = () => {
    setGiftCardError(null);
    if (!voucherCode.trim()) {
      setGiftCardError('Ingresá el código de tu tarjeta.');
      return;
    }
    const card = SystemStorage.getGiftCardByCode(voucherCode);
    if (!card) {
      setGiftCardError(`Código "${voucherCode.toUpperCase()}" no encontrado.`);
      setAppliedGiftCard(null);
      return;
    }
    if (card.status === 'used' || card.remainingBalance <= 0) {
      setGiftCardError('Esta Gift Card ya no posee saldo disponible.');
      setAppliedGiftCard(null);
      return;
    }
    setAppliedGiftCard(card);
    setPaymentMethod('giftcard');
  };

  const handleRemoveGiftCard = () => {
    setAppliedGiftCard(null);
    setVoucherCode('');
    setGiftCardError(null);
    setPaymentMethod('cash');
  };

  const generateWhatsAppMessage = (ticketId: string) => {
    return (
      `✨ *RESERVA DE TURNO REGISTRADA — VIC ESTÉTICA INTEGRAL*\n\n` +
      `🎫 *Ticket / Pase:* ${ticketId}\n` +
      `👤 *Paciente:* ${name}\n` +
      `📞 *Contacto:* ${phone}\n` +
      `💆‍♀️ *Tratamiento:* ${currentService.name} (${currentService.duration})\n` +
      (appliedGiftCard ? `🎁 *Gift Card Canjeada:* ${appliedGiftCard.code} (-${formatPrice(giftCardDeduction)})\n` : '') +
      `💳 *Forma de pago:* ${paymentMethod === 'cash' ? 'Efectivo con -15% bonificado' : paymentMethod === 'giftcard' ? 'Gift Card' : 'Transferencia bancaria'}\n` +
      `💰 *Monto a abonar:* ${formatPrice(finalPrice)}\n` +
      `📅 *Fecha solicitada:* ${selectedDate.display}\n` +
      `⏰ *Horario:* ${timeSlot} hs\n` +
      (notes.trim() ? `📝 *Observaciones:* ${notes}\n\n` : `\n`) +
      `📍 *Ubicación:* Mendoza 985, Río Segundo, Córdoba.\n` +
      `¡Hola Mavi! Ya registré mi turno en el sistema web. Te paso los datos para confirmar. ¡Gracias!`
    );
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim()) {
      alert("Por favor ingresá tu nombre y teléfono de contacto.");
      return;
    }

    const ticketId = `VIC-TK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAppointment: AppointmentItem = {
      id: ticketId,
      serviceId: currentService.id,
      serviceName: currentService.name,
      serviceCategory: currentService.category,
      duration: currentService.duration,
      clientName: name.trim(),
      clientPhone: phone.trim(),
      date: selectedDate.dateString,
      dateDisplay: selectedDate.display,
      timeSlot: timeSlot,
      paymentMethod: paymentMethod,
      originalPrice: basePrice,
      discountApplied: giftCardDeduction,
      finalPrice: finalPrice,
      giftCardCodeUsed: appliedGiftCard ? appliedGiftCard.code : undefined,
      notes: notes.trim() || undefined,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      professional: 'María Victoria (Mavi) Tissera'
    };

    // Save appointment into local system database
    SystemStorage.saveAppointment(newAppointment);

    // If gift card used, deduct amount automatically
    if (appliedGiftCard) {
      SystemStorage.redeemGiftCard(
        appliedGiftCard.code,
        giftCardDeduction,
        ticketId,
        currentService.name,
        `Canje en reserva online de ${currentService.name}`
      );
    }

    setConfirmedAppointment(newAppointment);
  };

  const handleCopyText = (msgText: string) => {
    navigator.clipboard.writeText(msgText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      id="booking-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#2c2725]/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="booking-modal-card"
        className="bg-[#fcfaf7] w-full max-w-xl rounded-3xl shadow-2xl border border-[#ede8e3] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="bg-[#f5f0eb] px-6 py-4 border-b border-[#ede8e3] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.svg" 
              alt="VIC Logo" 
              className="w-10 h-10 rounded-full bg-white p-0.5 border border-[#e4ded8] object-contain shadow-xs" 
            />
            <div>
              <h3 className="font-serif-cormorant text-xl font-bold text-[#2c2725] leading-tight">
                {confirmedAppointment ? '¡Turno Registrado con Éxito!' : 'Reservá tu Turno Online'}
              </h3>
              <p className="text-[11px] text-[#6b6462]">
                VIC Estética Integral · Mendoza 985, Río Segundo
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

        {/* ================= IF APPOINTMENT IS CONFIRMED -> SHOW CONFIRMATION PASS ================= */}
        {confirmedAppointment ? (
          <div className="p-6 overflow-y-auto space-y-5 text-center">
            
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#c98a92] uppercase tracking-widest block">
                Pase de Turno Activo
              </span>
              <h4 className="font-serif-cormorant text-2xl font-bold text-[#2c2725] mt-0.5">
                ¡Gracias {confirmedAppointment.clientName}!
              </h4>
              <p className="text-xs text-[#6b6462] mt-1">
                Tu turno para <strong>{confirmedAppointment.serviceName}</strong> fue guardado en el sistema.
              </p>
            </div>

            {/* Ticket Card with QR */}
            <div className="bg-gradient-to-b from-[#fbf4eb] to-[#f7eef0] border border-[#ede8e3] rounded-3xl p-5 text-left shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-center border-b border-[#ede8e3]/80 pb-3">
                <div className="flex items-center gap-2">
                  <img src="/logo.svg" alt="VIC" className="w-7 h-7 rounded-full" />
                  <div>
                    <span className="font-serif-cormorant font-bold text-sm text-[#2c2725] leading-none block">VIC Estética</span>
                    <span className="text-[9px] uppercase tracking-widest text-[#c98a92] font-semibold">Río Segundo</span>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-[#9a5b63] bg-white/90 px-2.5 py-1 rounded-lg border border-[#f0d4d8]">
                  {confirmedAppointment.id}
                </span>
              </div>

              <div className="my-4 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-8 space-y-1.5 text-xs">
                  <div>
                    <span className="text-[#8a807d] block text-[10px] uppercase">Tratamiento:</span>
                    <span className="font-bold text-[#2c2725] text-sm">{confirmedAppointment.serviceName}</span>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <span className="text-[#8a807d] block text-[10px] uppercase">Fecha:</span>
                      <span className="font-bold text-[#2c2725]">{confirmedAppointment.dateDisplay}</span>
                    </div>
                    <div>
                      <span className="text-[#8a807d] block text-[10px] uppercase">Horario:</span>
                      <span className="font-bold text-[#9a5b63]">{confirmedAppointment.timeSlot} hs</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[#8a807d] block text-[10px] uppercase">Monto Final:</span>
                    <span className="font-bold text-base text-[#2c2725]">{formatPrice(confirmedAppointment.finalPrice)}</span>
                  </div>
                </div>

                <div className="sm:col-span-4 flex flex-col items-center justify-center p-2 bg-white/90 rounded-2xl border border-[#ede8e3]">
                  <QrCode className="w-20 h-20 text-[#2c2725]" />
                  <span className="text-[9px] font-mono text-[#8a807d] mt-1">Check-in VIC</span>
                </div>
              </div>

              <div className="border-t border-[#ede8e3]/80 pt-2 text-[10px] text-[#6b6462] flex justify-between">
                <span>📍 Mendoza 985, Río Segundo</span>
                <span>Dirección Técnica: Mavi Tissera</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2.5">
              <a
                href={`https://wa.me/${BUSINESS_DATA.phone}?text=${encodeURIComponent(generateWhatsAppMessage(confirmedAppointment.id))}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition-transform active:scale-98"
              >
                <span>Enviar Confirmación por WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href={SystemStorage.generateGoogleCalendarUrl(confirmedAppointment)}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 bg-white border border-[#ede8e3] hover:border-[#c98a92] text-[#2c2725] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#c98a92]" />
                  <span>Google Calendar</span>
                </a>

                {onOpenSystem && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenSystem('client-portal');
                    }}
                    className="py-2.5 px-3 bg-[#f5ede5] hover:bg-[#ebdcd0] text-[#9a5b63] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Ver en Mis Turnos</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleCopyText(generateWhatsAppMessage(confirmedAppointment.id))}
                className="w-full py-2 bg-transparent text-[#6b6462] hover:text-[#2c2725] text-xs font-medium cursor-pointer"
              >
                {copied ? '✓ ¡Resumen copiado al portapapeles!' : 'Copiar texto de confirmación'}
              </button>
            </div>

          </div>
        ) : (
          /* ================= STEP-BY-STEP BOOKING FORM ================= */
          <form onSubmit={handleConfirmBooking} className="p-6 overflow-y-auto space-y-5 text-sm">
            
            {/* Step 1: Select Service */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2c2725] mb-1.5 flex items-center justify-between">
                <span>1. Elegí el Tratamiento</span>
                <span className="text-[11px] text-[#c98a92] font-semibold">{currentService.duration}</span>
              </label>
              <select
                value={selectedServiceId}
                onChange={(e) => {
                  setSelectedServiceId(e.target.value);
                  setAppliedGiftCard(null);
                }}
                className="w-full px-3.5 py-2.5 bg-white border border-[#ede8e3] rounded-xl text-sm text-[#2c2725] focus:ring-2 focus:ring-[#c98a92]/50 focus:outline-none"
              >
                {SERVICES_DATA.map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    {srv.name} — {srv.duration}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Summary Card */}
            <div className="bg-[#fbf0f2] border border-[#f0d4d8] rounded-2xl p-4 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-[#c98a92] uppercase tracking-wider">
                  {currentService.category.replace('-', ' ')}
                </span>
                <h4 className="font-serif-cormorant text-lg font-bold text-[#2c2725]">
                  {currentService.name}
                </h4>
                <p className="text-xs text-[#6b6462] mt-0.5">{currentService.duration} de sesión en cabina</p>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-[#8a807d] block">Total estimado:</span>
                <span className="text-xl font-bold text-[#2c2725]">
                  {formatPrice(finalPrice)}
                </span>
                {appliedGiftCard ? (
                  <span className="text-[10px] text-emerald-700 font-bold block">
                    🎁 Gift Card (-{formatPrice(giftCardDeduction)})
                  </span>
                ) : paymentMethod === 'cash' ? (
                  <span className="text-[10px] text-[#c98a92] font-semibold block">
                    -15% bonificado
                  </span>
                ) : null}
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2c2725] mb-1.5">
                2. Forma de Pago
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('cash');
                    setAppliedGiftCard(null);
                  }}
                  className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    paymentMethod === 'cash' && !appliedGiftCard
                      ? 'border-[#c98a92] bg-[#fbf0f2] text-[#2c2725] shadow-xs'
                      : 'border-[#ede8e3] bg-white text-[#6b6462] hover:border-[#c98a92]/50'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-[#c98a92] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold block">Efectivo (-15%)</span>
                    <span className="text-xs font-bold text-[#c98a92] block">
                      {formatPrice(currentService.priceCash)}
                    </span>
                    <span className="text-[10px] text-[#8a807d]">Ahorrás {formatPrice(savings)}</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('transfer');
                    setAppliedGiftCard(null);
                  }}
                  className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    paymentMethod === 'transfer' && !appliedGiftCard
                      ? 'border-[#c98a92] bg-[#fbf0f2] text-[#2c2725] shadow-xs'
                      : 'border-[#ede8e3] bg-white text-[#6b6462] hover:border-[#c98a92]/50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#c98a92] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold block">Transferencia / QR</span>
                    <span className="text-xs font-bold text-[#2c2725] block">
                      {formatPrice(currentService.priceTransfer)}
                    </span>
                    <span className="text-[10px] text-[#8a807d]">Precio de lista</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Gift Card Coupon Box */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#ede8e3] space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2c2725] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-[#c98a92]" />
                  <span>¿Tenés una Gift Card o Voucher?</span>
                </span>
                {appliedGiftCard && (
                  <button
                    type="button"
                    onClick={handleRemoveGiftCard}
                    className="text-[11px] text-rose-600 hover:underline cursor-pointer"
                  >
                    Quitar
                  </button>
                )}
              </label>

              {appliedGiftCard ? (
                <div className="bg-[#eef7f2] border border-[#d4eadd] p-3 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-[#2d734e]">{appliedGiftCard.code}</span>
                    <p className="text-[11px] text-[#2d734e]">
                      ¡Válida! Descuento de {formatPrice(giftCardDeduction)} aplicado al total.
                    </p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-[#2d734e]" />
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ej: VIC-GC-50K o VIC-VIP-RELAX"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2 bg-[#fcfaf7] border border-[#ede8e3] rounded-xl text-xs uppercase font-mono font-bold text-[#2c2725] focus:outline-none focus:ring-1 focus:ring-[#c98a92]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyGiftCard}
                    className="px-3.5 py-2 bg-[#f5ede5] hover:bg-[#ebdcd0] text-[#9a5b63] text-xs font-bold rounded-xl cursor-pointer transition-colors"
                  >
                    Aplicar
                  </button>
                </div>
              )}

              {giftCardError && (
                <div className="text-[11px] text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{giftCardError}</span>
                </div>
              )}
            </div>

            {/* Step 3: Interactive Date & Shift Selector */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2c2725]">
                  3. Fecha de Preferencia
                </label>
                <span className="text-[11px] text-[#c98a92] font-semibold">
                  Jueves fijos & Turnos coordinados
                </span>
              </div>
              
              {/* Scrollable Day Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {availableDates.map((d, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedDateIndex(idx)}
                    className={`px-3 py-2 rounded-xl text-center shrink-0 transition-all cursor-pointer border ${
                      selectedDateIndex === idx
                        ? 'bg-[#2c2725] text-white border-[#2c2725] shadow-xs'
                        : 'bg-white text-[#6b6462] border-[#ede8e3] hover:border-[#c98a92]'
                    }`}
                  >
                    <span className="text-[10px] block opacity-80 uppercase">{d.dayName}</span>
                    <span className="text-sm font-bold block">{d.dayNum} {d.monthName}</span>
                  </button>
                ))}
              </div>

              {/* Time Shift and Slots */}
              <div className="mt-3 bg-white p-3.5 rounded-2xl border border-[#ede8e3] space-y-3">
                <div className="flex items-center justify-between border-b border-[#ede8e3] pb-2">
                  <span className="text-xs font-bold text-[#2c2725]">Horarios disponibles:</span>
                  <div className="flex gap-1 bg-[#f5f0eb] p-0.5 rounded-lg text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setTimeShift('morning')}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        timeShift === 'morning' ? 'bg-[#c98a92] text-white' : 'text-[#6b6462]'
                      }`}
                    >
                      Mañana
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimeShift('afternoon')}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        timeShift === 'afternoon' ? 'bg-[#c98a92] text-white' : 'text-[#6b6462]'
                      }`}
                    >
                      Tarde
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {currentSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center ${
                        timeSlot === slot
                          ? 'bg-[#c98a92] text-white ring-2 ring-[#c98a92]/30'
                          : 'bg-[#faf7f4] text-[#4a423f] hover:bg-[#f0eae1]'
                      }`}
                    >
                      {slot} hs
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 4: Contact Info */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2c2725] mb-1.5">
                4. Tus Datos de Contacto
              </label>
              <div className="space-y-2.5">
                <div className="relative">
                  <User className="w-4 h-4 text-[#8a807d] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Nombre y Apellido *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#ede8e3] rounded-xl text-sm text-[#2c2725] placeholder:text-[#9e9490] focus:ring-2 focus:ring-[#c98a92]/50 focus:outline-none"
                  />
                </div>

                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8a807d] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="Teléfono / WhatsApp (ej: 3572 401234) *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#ede8e3] rounded-xl text-sm text-[#2c2725] placeholder:text-[#9e9490] focus:ring-2 focus:ring-[#c98a92]/50 focus:outline-none"
                  />
                </div>

                <textarea
                  placeholder="Observaciones, dudas o si tenés alguna condición previa (opcional)..."
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#ede8e3] rounded-xl text-xs text-[#2c2725] placeholder:text-[#9e9490] focus:ring-2 focus:ring-[#c98a92]/50 focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* Footer Submit */}
            <div className="pt-2 border-t border-[#ede8e3] flex flex-col gap-2.5">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-full bg-[#c98a92] hover:bg-[#b57a82] text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Confirmar & Generar Pase de Turno</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <span className="text-[10px] text-center text-[#8a807d] flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c98a92]" />
                <span>Tu turno queda registrado en el sistema con código único y notificación a recepción.</span>
              </span>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
