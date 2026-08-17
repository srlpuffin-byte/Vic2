import { AppointmentItem, GiftCardItem } from '../types';

const APPOINTMENTS_STORAGE_KEY = 'vic_appointments_db';
const GIFTCARDS_STORAGE_KEY = 'vic_giftcards_db';

// Pre-seeded sample appointments for Río Segundo clinic
const INITIAL_APPOINTMENTS: AppointmentItem[] = [
  {
    id: 'VIC-TK-1082',
    serviceId: 'srv-med-botox',
    serviceName: 'Toxina Botulínica (Botox) — Frente, Entrecejo & Patas de Gallo',
    serviceCategory: 'medicina-estetica',
    duration: '30 min',
    clientName: 'Florencia Benítez',
    clientPhone: '3572458921',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    dateDisplay: 'Mañana',
    timeSlot: '10:30',
    paymentMethod: 'cash',
    originalPrice: 141176,
    discountApplied: 21176,
    finalPrice: 120000,
    notes: 'Primera sesión médica con Dra. María Pía Gelso. Evaluación previa realizada.',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    professional: 'Dra. María Pía Gelso'
  },
  {
    id: 'VIC-TK-1083',
    serviceId: 'srv-fac-alquimia-lujo',
    serviceName: 'Alquimia MiniVac Facial — Sesión Signature',
    serviceCategory: 'faciales',
    duration: '60 min',
    clientName: 'Mariana Gomez',
    clientPhone: '3572621045',
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    dateDisplay: 'En 2 días',
    timeSlot: '16:15',
    paymentMethod: 'giftcard',
    originalPrice: 40000,
    discountApplied: 35000,
    finalPrice: 5000,
    giftCardCodeUsed: 'VIC-GC-3500',
    notes: 'Canje de Gift Card de cumpleaños recibida de su hermana.',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    professional: 'María Victoria (Mavi) Tissera'
  },
  {
    id: 'VIC-TK-1084',
    serviceId: 'srv-dep-cuerpo-entero',
    serviceName: 'Depilación Definitiva Láser Trío 4 Ondas — Cuerpo Completo',
    serviceCategory: 'depilacion',
    duration: '60 min',
    clientName: 'Camila Rossi',
    clientPhone: '3572554433',
    date: new Date().toISOString().split('T')[0],
    dateDisplay: 'Hoy',
    timeSlot: '18:00',
    paymentMethod: 'transfer',
    originalPrice: 55000,
    discountApplied: 0,
    finalPrice: 55000,
    notes: 'Sesión 3 de 6 del plan de depilación láser.',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    professional: 'María Victoria (Mavi) Tissera'
  }
];

// Pre-seeded sample gift cards
const INITIAL_GIFTCARDS: GiftCardItem[] = [
  {
    code: 'VIC-GC-3500',
    cardType: 'amount',
    recipientName: 'Mariana Gomez',
    senderName: 'Carla Gomez',
    initialBalance: 35000,
    remainingBalance: 0,
    message: '¡Feliz cumple Mari! Disfrutá de una sesión hermosa en VIC con Mavi.',
    status: 'used',
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    expiresAt: new Date(Date.now() + 7776000000).toISOString(),
    usageHistory: [
      {
        id: 'use-1',
        date: new Date(Date.now() - 43200000).toISOString(),
        amountDeducted: 35000,
        appointmentId: 'VIC-TK-1083',
        serviceName: 'Alquimia MiniVac Facial — Sesión Signature',
        notes: 'Canje total en reserva de Alquimia MiniVac'
      }
    ]
  },
  {
    code: 'VIC-GC-50K',
    cardType: 'amount',
    recipientName: 'Sofía Martinez',
    senderName: 'Lucas Navarro',
    initialBalance: 50000,
    remainingBalance: 50000,
    message: 'Para que te relajes y disfrutes de una tarde de spa y estética en VIC.',
    status: 'active',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    expiresAt: new Date(Date.now() + 7776000000).toISOString(),
    usageHistory: []
  },
  {
    code: 'VIC-VIP-RELAX',
    cardType: 'treatment',
    recipientName: 'Lucía Fernández',
    senderName: 'Familia Fernandez',
    initialBalance: 40000,
    remainingBalance: 40000,
    treatmentName: 'Alquimia MiniVac Facial Signature + Hidratación Profunda',
    message: '¡Un mimo especial para tu piel!',
    status: 'active',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    expiresAt: new Date(Date.now() + 7776000000).toISOString(),
    usageHistory: []
  }
];

export const SystemStorage = {
  // --- APPOINTMENTS ---
  getAppointments(): AppointmentItem[] {
    try {
      const data = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(INITIAL_APPOINTMENTS));
      return INITIAL_APPOINTMENTS;
    } catch (e) {
      console.error('Error loading appointments from localStorage', e);
      return INITIAL_APPOINTMENTS;
    }
  },

  saveAppointment(appointment: AppointmentItem): AppointmentItem[] {
    try {
      const current = this.getAppointments();
      const updated = [appointment, ...current.filter(a => a.id !== appointment.id)];
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('vic_data_updated'));
      return updated;
    } catch (e) {
      console.error('Error saving appointment', e);
      return [];
    }
  },

  updateAppointmentStatus(id: string, status: 'confirmed' | 'pending' | 'completed' | 'cancelled'): boolean {
    try {
      const current = this.getAppointments();
      const index = current.findIndex(a => a.id === id);
      if (index !== -1) {
        current[index].status = status;
        localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(current));
        window.dispatchEvent(new CustomEvent('vic_data_updated'));
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error updating appointment status', e);
      return false;
    }
  },

  rescheduleAppointment(id: string, newDate: string, newDateDisplay: string, newTime: string): boolean {
    try {
      const current = this.getAppointments();
      const index = current.findIndex(a => a.id === id);
      if (index !== -1) {
        current[index].date = newDate;
        current[index].dateDisplay = newDateDisplay;
        current[index].timeSlot = newTime;
        current[index].status = 'confirmed';
        localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(current));
        window.dispatchEvent(new CustomEvent('vic_data_updated'));
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error rescheduling appointment', e);
      return false;
    }
  },

  deleteAppointment(id: string): boolean {
    try {
      const current = this.getAppointments();
      const filtered = current.filter(a => a.id !== id);
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(filtered));
      window.dispatchEvent(new CustomEvent('vic_data_updated'));
      return true;
    } catch (e) {
      console.error('Error deleting appointment', e);
      return false;
    }
  },

  // --- GIFT CARDS ---
  getGiftCards(): GiftCardItem[] {
    try {
      const data = localStorage.getItem(GIFTCARDS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      localStorage.setItem(GIFTCARDS_STORAGE_KEY, JSON.stringify(INITIAL_GIFTCARDS));
      return INITIAL_GIFTCARDS;
    } catch (e) {
      console.error('Error loading gift cards', e);
      return INITIAL_GIFTCARDS;
    }
  },

  saveGiftCard(card: GiftCardItem): GiftCardItem[] {
    try {
      const current = this.getGiftCards();
      const updated = [card, ...current.filter(c => c.code.toUpperCase() !== card.code.toUpperCase())];
      localStorage.setItem(GIFTCARDS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('vic_data_updated'));
      return updated;
    } catch (e) {
      console.error('Error saving gift card', e);
      return [];
    }
  },

  getGiftCardByCode(code: string): GiftCardItem | null {
    if (!code) return null;
    const cleanCode = code.trim().toUpperCase();
    const cards = this.getGiftCards();
    return cards.find(c => c.code.toUpperCase() === cleanCode) || null;
  },

  redeemGiftCard(code: string, amount: number, appointmentId?: string, serviceName?: string, notes?: string): { success: boolean; message: string; remainingBalance?: number; card?: GiftCardItem } {
    const card = this.getGiftCardByCode(code);
    if (!card) {
      return { success: false, message: 'El código de Gift Card no existe o no fue encontrado.' };
    }

    if (card.status === 'pending_approval') {
      return { success: false, message: 'Esta Gift Card aún está pendiente de aprobación/pago por parte del staff.' };
    }

    if (card.status === 'used' || card.remainingBalance <= 0) {
      return { success: false, message: 'Esta Gift Card ya ha sido canjeada en su totalidad.' };
    }

    const isExpired = new Date(card.expiresAt).getTime() < Date.now();
    if (isExpired) {
      return { success: false, message: 'Esta Gift Card ha superado su fecha de vigencia.' };
    }

    const deductAmount = Math.min(amount, card.remainingBalance);
    const newRemaining = card.remainingBalance - deductAmount;
    const newStatus = newRemaining <= 0 ? 'used' : 'partially_used';

    const usageRecord = {
      id: `use-${Date.now()}`,
      date: new Date().toISOString(),
      amountDeducted: deductAmount,
      appointmentId,
      serviceName,
      notes: notes || `Canje en mostrador/reserva por $${deductAmount.toLocaleString('es-AR')}`
    };

    const updatedCard: GiftCardItem = {
      ...card,
      remainingBalance: newRemaining,
      status: newStatus,
      usageHistory: [usageRecord, ...card.usageHistory]
    };

    this.saveGiftCard(updatedCard);

    return {
      success: true,
      message: `¡Canje exitoso de $${deductAmount.toLocaleString('es-AR')}! Saldo restante: $${newRemaining.toLocaleString('es-AR')}`,
      remainingBalance: newRemaining,
      card: updatedCard
    };
  },

  approveGiftCard(code: string, approvedBy: string = 'Staff Recepción'): { success: boolean; message: string; card?: GiftCardItem } {
    const card = this.getGiftCardByCode(code);
    if (!card) {
      return { success: false, message: 'Gift Card no encontrada.' };
    }
    const updatedCard: GiftCardItem = {
      ...card,
      status: 'active',
      approvedAt: new Date().toISOString(),
      approvedBy
    };
    this.saveGiftCard(updatedCard);
    return {
      success: true,
      message: `¡Voucher ${card.code} confirmado y habilitado con éxito! La clienta ya puede enviarlo o utilizarlo.`,
      card: updatedCard
    };
  },

  deleteGiftCard(code: string): GiftCardItem[] {
    try {
      const current = this.getGiftCards();
      const updated = current.filter(c => c.code.toUpperCase() !== code.toUpperCase());
      localStorage.setItem(GIFTCARDS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('vic_data_updated'));
      return updated;
    } catch (e) {
      console.error('Error deleting gift card', e);
      return [];
    }
  },

  // Helper to generate Google Calendar Event URL
  generateGoogleCalendarUrl(appointment: AppointmentItem): string {
    const title = encodeURIComponent(`Turno VIC Estética Integral: ${appointment.serviceName}`);
    const details = encodeURIComponent(
      `Turno en VIC Estética Integral (Río Segundo)\n` +
      `Tratamiento: ${appointment.serviceName}\n` +
      `Paciente: ${appointment.clientName}\n` +
      `Código de Turno: ${appointment.id}\n` +
      `Monto: $${appointment.finalPrice.toLocaleString('es-AR')}\n` +
      `Ubicación: Mendoza 985, Río Segundo, Córdoba`
    );
    const location = encodeURIComponent('Mendoza 985, Río Segundo, Córdoba, Argentina');
    
    // Parse date and time
    const [year, month, day] = appointment.date.split('-');
    const [hour, minute] = (appointment.timeSlot || '10:00').split(':');
    
    const startDate = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration
    
    const formatCalDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const dates = `${formatCalDate(startDate)}/${formatCalDate(endDate)}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  }
};
