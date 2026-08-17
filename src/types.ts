export interface ServiceItem {
  id: string;
  category: 'faciales' | 'corporales' | 'depilacion' | 'kinesiologia' | 'fisioterapia' | 'modeladores' | 'medicina-estetica' | 'nails' | 'nutricion' | string;
  name: string;
  duration: string;
  priceCash: number;
  priceTransfer: number;
  description: string;
  popular?: boolean;
}

export interface CategoryItem {
  id: string;
  label: string;
  iconName: string;
  tagline: string;
}

export interface Professional {
  name: string;
  role: string;
  initials: string;
  color: string;
  specialty: string;
}

export interface Testimonial {
  id: string;
  text: string;
  author: string;
  service: string;
  stars: number;
  date: string;
}

export interface BusinessInfo {
  name: string;
  brandName: string;
  tagline: string;
  description: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  phoneDisplay: string;
  whatsappLink: string;
  instagram: string;
  instagramHandle: string;
  mapQuery: string;
  depositNotice: string;
  openingHours: {
    day: string;
    hours: string;
  }[];
}

export interface BookingState {
  step: 1 | 2 | 3;
  selectedService: ServiceItem | null;
  paymentMethod: 'cash' | 'transfer' | 'giftcard';
  date: string;
  time: string;
  name: string;
  phone: string;
  notes: string;
}

export interface AppointmentItem {
  id: string; // e.g. "VIC-TK-7842"
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  duration: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  date: string; // "YYYY-MM-DD"
  dateDisplay: string;
  timeSlot: string; // "10:00"
  paymentMethod: 'cash' | 'transfer' | 'giftcard';
  originalPrice: number;
  discountApplied: number;
  finalPrice: number;
  giftCardCodeUsed?: string;
  notes?: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  professional?: string;
}

export interface GiftCardUsageRecord {
  id: string;
  date: string;
  amountDeducted: number;
  appointmentId?: string;
  serviceName?: string;
  notes: string;
}

export interface GiftCardItem {
  code: string; // e.g. "VIC-GC-4920"
  cardType: 'amount' | 'treatment';
  recipientName: string;
  senderName: string;
  initialBalance: number;
  remainingBalance: number;
  treatmentName?: string;
  message: string;
  status: 'active' | 'partially_used' | 'used' | 'expired';
  createdAt: string;
  expiresAt: string;
  usageHistory: GiftCardUsageRecord[];
}

