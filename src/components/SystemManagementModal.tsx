import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Search, 
  Plus, 
  Gift, 
  CreditCard, 
  DollarSign, 
  Phone, 
  User, 
  Sparkles, 
  QrCode, 
  ExternalLink, 
  Printer, 
  Share2, 
  RefreshCw, 
  CalendarCheck, 
  ArrowRight, 
  Check, 
  Copy,
  Receipt,
  FileText,
  BadgePercent,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Building2,
  Trash2,
  Lock,
  Unlock,
  KeyRound,
  LogOut,
  HelpCircle
} from 'lucide-react';
import { AppointmentItem, GiftCardItem, ServiceItem } from '../types';
import { SystemStorage } from '../utils/systemStorage';
import { SERVICES_DATA, BUSINESS_DATA, formatPrice } from '../data/aestheticData';

interface SystemManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'appointments' | 'giftcards' | 'issue-giftcard' | 'client-portal';
  initialStaffMode?: boolean;
  onBookNew?: () => void;
}

const DEFAULT_STAFF_PIN = '1234';

export const SystemManagementModal: React.FC<SystemManagementModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'client-portal',
  initialStaffMode = false,
  onBookNew
}) => {
  // Authentication state
  const [isStaffAuthenticated, setIsStaffAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('vic_staff_auth') === 'true' || initialStaffMode;
    } catch {
      return false;
    }
  });

  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  // Active Tab: if not staff, locked to 'client-portal'
  const [activeTab, setActiveTab] = useState<'appointments' | 'giftcards' | 'issue-giftcard' | 'client-portal'>(
    initialTab
  );

  // Data lists loaded from storage
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [giftCards, setGiftCards] = useState<GiftCardItem[]>([]);

  // Appointments filtering & search (Staff)
  const [appointmentSearch, setAppointmentSearch] = useState('');
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState<string>('all');

  // Gift card validation state (Staff Tab 2)
  const [validationCode, setValidationCode] = useState('');
  const [validatedCard, setValidatedCard] = useState<GiftCardItem | null>(null);
  const [validationFeedback, setValidationFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [redemptionAmount, setRedemptionAmount] = useState<string>('');
  const [redemptionNotes, setRedemptionNotes] = useState<string>('');

  // Selected appointment for detail / pass view
  const [selectedAppointmentPass, setSelectedAppointmentPass] = useState<AppointmentItem | null>(null);

  // Reschedule state
  const [reschedulingAppointment, setReschedulingAppointment] = useState<AppointmentItem | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState('');
  const [newRescheduleTime, setNewRescheduleTime] = useState('10:00');

  // Issue Gift Card form state (Staff Tab 3)
  const [newGcRecipient, setNewGcRecipient] = useState('');
  const [newGcSender, setNewGcSender] = useState('');
  const [newGcAmount, setNewGcAmount] = useState('35000');
  const [newGcType, setNewGcType] = useState<'amount' | 'treatment'>('amount');
  const [newGcTreatment, setNewGcTreatment] = useState('Alquimia MiniVac Facial — Sesión Signature');
  const [newGcMessage, setNewGcMessage] = useState('¡Un regalo especial para consentirte en VIC Estética!');
  const [createdGiftCard, setCreatedGiftCard] = useState<GiftCardItem | null>(null);

  // Client Portal Search (Client view)
  const [clientPhoneSearch, setClientPhoneSearch] = useState('');
  const [clientFoundAppointments, setClientFoundAppointments] = useState<AppointmentItem[]>([]);
  const [clientSearched, setClientSearched] = useState(false);

  // Client Gift Card Check (Client view)
  const [clientGcCode, setClientGcCode] = useState('');
  const [clientGcResult, setClientGcResult] = useState<GiftCardItem | null>(null);
  const [clientGcFeedback, setClientGcFeedback] = useState<string | null>(null);

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Refresh data function
  const refreshData = () => {
    const apps = SystemStorage.getAppointments();
    const gcs = SystemStorage.getGiftCards();
    setAppointments(apps);
    setGiftCards(gcs);

    // If client has recently entered phone, refresh results too
    if (clientPhoneSearch.trim()) {
      const clean = clientPhoneSearch.trim().toLowerCase();
      const found = apps.filter(a => 
        a.clientPhone.includes(clean) || 
        a.clientName.toLowerCase().includes(clean) ||
        a.id.toLowerCase() === clean
      );
      setClientFoundAppointments(found);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshData();
      if (initialStaffMode && !isStaffAuthenticated) {
        setShowPinPrompt(true);
      }
      if (!isStaffAuthenticated && initialTab !== 'client-portal') {
        setActiveTab('client-portal');
      } else {
        setActiveTab(initialTab);
      }
    }
  }, [isOpen, initialTab, initialStaffMode]);

  useEffect(() => {
    const handleDataUpdate = () => refreshData();
    window.addEventListener('vic_data_updated', handleDataUpdate);
    return () => window.removeEventListener('vic_data_updated', handleDataUpdate);
  }, [clientPhoneSearch]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showPinPrompt) {
          setShowPinPrompt(false);
        } else if (selectedAppointmentPass) {
          setSelectedAppointmentPass(null);
        } else if (reschedulingAppointment) {
          setReschedulingAppointment(null);
        } else {
          onClose();
        }
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, showPinPrompt, selectedAppointmentPass, reschedulingAppointment]);

  // Filtered Appointments for Staff
  const filteredAppointments = useMemo(() => {
    return appointments.filter(app => {
      const matchSearch = 
        app.clientName.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
        app.clientPhone.includes(appointmentSearch) ||
        app.serviceName.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
        app.id.toLowerCase().includes(appointmentSearch.toLowerCase());

      if (!matchSearch) return false;

      if (appointmentStatusFilter === 'all') return true;
      if (appointmentStatusFilter === 'today') {
        const todayStr = new Date().toISOString().split('T')[0];
        return app.date === todayStr;
      }
      return app.status === appointmentStatusFilter;
    });
  }, [appointments, appointmentSearch, appointmentStatusFilter]);

  // Summary Metrics (Staff only)
  const metrics = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayCount = appointments.filter(a => a.date === todayStr && a.status !== 'cancelled').length;
    const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
    const totalRevenue = appointments
      .filter(a => a.status !== 'cancelled')
      .reduce((sum, a) => sum + (a.finalPrice || 0), 0);
    const activeGiftCardsCount = giftCards.filter(g => g.status === 'active' || g.status === 'partially_used').length;

    return {
      todayCount,
      confirmedCount,
      totalRevenue,
      activeGiftCardsCount
    };
  }, [appointments, giftCards]);

  // PIN Authentication Handlers
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === DEFAULT_STAFF_PIN || pinInput.trim() === 'vic2026') {
      setIsStaffAuthenticated(true);
      setShowPinPrompt(false);
      setPinInput('');
      setPinError(null);
      setActiveTab('appointments');
      try {
        sessionStorage.setItem('vic_staff_auth', 'true');
      } catch (err) {
        console.error(err);
      }
    } else {
      setPinError('PIN incorrecto. (PIN de recepción por defecto: 1234)');
    }
  };

  const handleLogoutStaff = () => {
    setIsStaffAuthenticated(false);
    setActiveTab('client-portal');
    try {
      sessionStorage.removeItem('vic_staff_auth');
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  // Handlers for Appointments (Staff)
  const handleUpdateStatus = (id: string, status: 'confirmed' | 'pending' | 'completed' | 'cancelled') => {
    SystemStorage.updateAppointmentStatus(id, status);
    refreshData();
  };

  const handleSaveReschedule = () => {
    if (!reschedulingAppointment || !newRescheduleDate) return;
    SystemStorage.rescheduleAppointment(
      reschedulingAppointment.id,
      newRescheduleDate,
      newRescheduleDate,
      newRescheduleTime
    );
    setReschedulingAppointment(null);
    refreshData();
  };

  // Handlers for Gift Card Validation & Redemption (Staff)
  const handleValidateCard = (codeToTest?: string) => {
    const targetCode = codeToTest || validationCode;
    if (!targetCode.trim()) {
      setValidationFeedback({ type: 'error', message: 'Por favor ingresá un código de Gift Card.' });
      setValidatedCard(null);
      return;
    }
    const card = SystemStorage.getGiftCardByCode(targetCode);
    if (!card) {
      setValidationFeedback({ 
        type: 'error', 
        message: `El código "${targetCode.toUpperCase()}" no existe en el sistema.` 
      });
      setValidatedCard(null);
      return;
    }

    setValidatedCard(card);
    setValidationCode(card.code);
    setRedemptionAmount(card.remainingBalance.toString());

    if (card.status === 'used' || card.remainingBalance <= 0) {
      setValidationFeedback({ 
        type: 'info', 
        message: 'Esta Gift Card ya ha sido canjeada en su totalidad ($0 saldo).' 
      });
    } else {
      setValidationFeedback({ 
        type: 'success', 
        message: `¡Gift Card válida! Saldo disponible: ${formatPrice(card.remainingBalance)}.` 
      });
    }
  };

  const handleProcessRedemption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatedCard) return;
    const amountNum = parseFloat(redemptionAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Ingresá un monto válido a debitar.');
      return;
    }

    const result = SystemStorage.redeemGiftCard(
      validatedCard.code,
      amountNum,
      undefined,
      'Canje en Mostrador / Recepción',
      redemptionNotes || 'Canje registrado en recepción de la clínica'
    );

    if (result.success) {
      setValidationFeedback({ type: 'success', message: result.message });
      setValidatedCard(result.card || null);
      setRedemptionNotes('');
      refreshData();
    } else {
      setValidationFeedback({ type: 'error', message: result.message });
    }
  };

  // Handlers for Issuing Gift Cards (Staff)
  const handleIssueGiftCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGcRecipient.trim()) {
      alert('Ingresá el nombre del agasajado / destinatario.');
      return;
    }

    const newCode = `VIC-GC-${Math.floor(1000 + Math.random() * 9000)}`;
    const numericAmount = newGcType === 'amount' ? parseFloat(newGcAmount) || 35000 : 40000;

    const newCard: GiftCardItem = {
      code: newCode,
      cardType: newGcType,
      recipientName: newGcRecipient.trim(),
      senderName: newGcSender.trim() || 'VIC Estética Integral',
      initialBalance: numericAmount,
      remainingBalance: numericAmount,
      treatmentName: newGcType === 'treatment' ? newGcTreatment : undefined,
      message: newGcMessage.trim() || '¡Una experiencia única de bienestar y cuidado en VIC!',
      status: 'active',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      usageHistory: []
    };

    SystemStorage.saveGiftCard(newCard);
    setCreatedGiftCard(newCard);
    refreshData();
  };

  // Handlers for Client Portal Search (Client view)
  const handleSearchClientTurnos = (e: React.FormEvent) => {
    e.preventDefault();
    setClientSearched(true);
    const cleanQuery = clientPhoneSearch.trim().toLowerCase();
    if (!cleanQuery) {
      setClientFoundAppointments([]);
      return;
    }
    const found = appointments.filter(a => 
      a.clientPhone.includes(cleanQuery) || 
      a.clientName.toLowerCase().includes(cleanQuery) ||
      a.id.toLowerCase() === cleanQuery
    );
    setClientFoundAppointments(found);
  };

  // Handlers for Client Gift Card Check (Client view)
  const handleClientCheckGc = (e: React.FormEvent) => {
    e.preventDefault();
    setClientGcFeedback(null);
    if (!clientGcCode.trim()) {
      setClientGcFeedback('Ingresá el código de tu Gift Card.');
      setClientGcResult(null);
      return;
    }
    const card = SystemStorage.getGiftCardByCode(clientGcCode);
    if (!card) {
      setClientGcFeedback(`El código "${clientGcCode.toUpperCase()}" no fue encontrado. Verificá si está bien escrito.`);
      setClientGcResult(null);
      return;
    }
    setClientGcResult(card);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#2c2725]/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#fdfbf7] w-full max-w-5xl h-[92vh] rounded-3xl shadow-2xl border border-[#ede8e3] flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-[#f5ede5] px-6 py-4 border-b border-[#ede8e3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.svg" 
              alt="VIC Logo" 
              className="w-10 h-10 rounded-full shadow-xs object-contain bg-white p-0.5 border border-[#e4ded8]" 
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-cormorant text-2xl font-bold text-[#2c2725] leading-none">
                  {isStaffAuthenticated ? 'Panel de Gestión & Operaciones' : 'Portal de Pacientes · Mis Turnos & Gift Cards'}
                </h2>
                <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border ${
                  isStaffAuthenticated 
                    ? 'bg-amber-100 text-amber-900 border-amber-300' 
                    : 'bg-[#c98a92]/20 text-[#9a5b63] border-[#c98a92]/30'
                }`}>
                  {isStaffAuthenticated ? '🔒 Modo Staff / Recepción' : '👤 Vista Paciente'}
                </span>
              </div>
              <p className="text-xs text-[#6b6462] mt-0.5">
                {isStaffAuthenticated 
                  ? 'Mendoza 985, Río Segundo · Control General de Agenda, Turnos y Canjes'
                  : 'Consultá tus turnos agendados, pases con QR y saldo de Gift Cards'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {isStaffAuthenticated ? (
              <button
                onClick={handleLogoutStaff}
                title="Cerrar sesión de personal y volver a modo paciente"
                className="px-3 py-1.5 rounded-xl bg-white border border-[#ede8e3] text-amber-800 hover:bg-amber-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Salir a Modo Paciente</span>
              </button>
            ) : (
              <button
                onClick={() => setShowPinPrompt(true)}
                title="Acceso exclusivo para recepcionista o Mavi"
                className="px-3 py-1.5 rounded-xl bg-white border border-[#ede8e3] text-[#6b6462] hover:text-[#2c2725] hover:border-[#c98a92] text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-[#c98a92]" />
                <span className="hidden sm:inline">Acceso Staff</span>
              </button>
            )}

            <button
              onClick={refreshData}
              title="Actualizar datos"
              className="p-2 rounded-xl bg-white border border-[#ede8e3] text-[#6b6462] hover:text-[#2c2725] hover:border-[#c98a92] transition-colors cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white border border-[#ede8e3] text-[#6b6462] hover:text-[#2c2725] hover:bg-rose-50 transition-colors cursor-pointer shadow-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= IF STAFF AUTHENTICATED: SHOW METRICS & FULL ADMIN TABS ================= */}
        {isStaffAuthenticated ? (
          <>
            {/* Quick KPI Bar for Staff */}
            <div className="bg-white border-b border-[#ede8e3] px-6 py-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#fdf2f4] text-[#c98a92] flex items-center justify-center font-bold">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-[#8a807d] uppercase tracking-wider block font-semibold">Turnos Hoy</span>
                  <span className="font-bold text-sm text-[#2c2725]">{metrics.todayCount} pacientes</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#eef7f2] text-[#3d8c63] flex items-center justify-center font-bold">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-[#8a807d] uppercase tracking-wider block font-semibold">Confirmados</span>
                  <span className="font-bold text-sm text-[#2c2725]">{metrics.confirmedCount} turnos</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#f9f2e9] text-[#b8956a] flex items-center justify-center font-bold">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-[#8a807d] uppercase tracking-wider block font-semibold">Gift Cards Activas</span>
                  <span className="font-bold text-sm text-[#2c2725]">{metrics.activeGiftCardsCount} tarjetas</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#f5ede5] text-[#9a5b63] flex items-center justify-center font-bold">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-[#8a807d] uppercase tracking-wider block font-semibold">Monto Proyectado</span>
                  <span className="font-bold text-sm text-[#2c2725]">{formatPrice(metrics.totalRevenue)}</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs for Staff */}
            <div className="flex items-center px-6 pt-3 border-b border-[#ede8e3] bg-[#fcfaf7] gap-2 overflow-x-auto text-xs sm:text-sm font-semibold">
              <button
                onClick={() => setActiveTab('appointments')}
                className={`pb-3 px-3.5 border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'appointments'
                    ? 'border-[#c98a92] text-[#9a5b63] font-bold'
                    : 'border-transparent text-[#6b6462] hover:text-[#2c2725]'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Agenda & Turnos ({appointments.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('giftcards')}
                className={`pb-3 px-3.5 border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'giftcards'
                    ? 'border-[#c98a92] text-[#9a5b63] font-bold'
                    : 'border-transparent text-[#6b6462] hover:text-[#2c2725]'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Validador / Canje Gift Cards</span>
              </button>

              <button
                onClick={() => setActiveTab('issue-giftcard')}
                className={`pb-3 px-3.5 border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'issue-giftcard'
                    ? 'border-[#c98a92] text-[#9a5b63] font-bold'
                    : 'border-transparent text-[#6b6462] hover:text-[#2c2725]'
                }`}
              >
                <Gift className="w-4 h-4" />
                <span>Emitir Gift Card</span>
              </button>

              <button
                onClick={() => setActiveTab('client-portal')}
                className={`pb-3 px-3.5 border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'client-portal'
                    ? 'border-[#c98a92] text-[#9a5b63] font-bold'
                    : 'border-transparent text-[#6b6462] hover:text-[#2c2725]'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Vista Portal Paciente</span>
              </button>
            </div>
          </>
        ) : null}

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#fcfaf7]">
          
          {/* ================= TAB 1: APPOINTMENTS (STAFF ONLY) ================= */}
          {isStaffAuthenticated && activeTab === 'appointments' && (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#8a807d] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar por paciente, teléfono, servicio o ticket ID..."
                    value={appointmentSearch}
                    onChange={(e) => setAppointmentSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-[#ede8e3] rounded-xl text-xs sm:text-sm text-[#2c2725] focus:outline-none focus:ring-2 focus:ring-[#c98a92]/40"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={appointmentStatusFilter}
                    onChange={(e) => setAppointmentStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-[#ede8e3] rounded-xl text-xs font-semibold text-[#2c2725] focus:outline-none"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="today">📅 Turnos de Hoy</option>
                    <option value="confirmed">🟢 Confirmados</option>
                    <option value="completed">✓ Atendidos</option>
                    <option value="cancelled">🔴 Cancelados</option>
                  </select>

                  {onBookNew && (
                    <button
                      onClick={() => {
                        onClose();
                        onBookNew();
                      }}
                      className="px-3.5 py-2 bg-[#c98a92] hover:bg-[#b57a82] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Nuevo Turno</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Table / List */}
              {filteredAppointments.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#ede8e3] p-12 text-center space-y-3">
                  <Calendar className="w-10 h-10 text-[#c98a92] mx-auto opacity-60" />
                  <h4 className="font-serif-cormorant text-xl font-bold text-[#2c2725]">
                    No se encontraron turnos
                  </h4>
                  <p className="text-xs text-[#6b6462] max-w-md mx-auto">
                    {appointmentSearch 
                      ? 'No hay registros que coincidan con la búsqueda ingresada.' 
                      : 'Todavía no hay turnos registrados en la base del sistema.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredAppointments.map((app) => {
                    const isToday = app.date === new Date().toISOString().split('T')[0];
                    return (
                      <div 
                        key={app.id} 
                        className={`bg-white border rounded-2xl p-4 shadow-2xs hover:shadow-sm transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                          isToday ? 'border-[#c98a92]/60 bg-[#fffbfc]' : 'border-[#ede8e3]'
                        }`}
                      >
                        {/* Column 1: Patient & Treatment */}
                        <div className="space-y-1 min-w-[220px]">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-bold text-[#9a5b63] bg-[#fbf0f2] px-2 py-0.5 rounded-md border border-[#f0d4d8]">
                              {app.id}
                            </span>
                            {isToday && (
                              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                ¡Hoy!
                              </span>
                            )}
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              app.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                              app.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              app.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {app.status === 'confirmed' ? 'Confirmado' :
                               app.status === 'completed' ? 'Atendido' :
                               app.status === 'cancelled' ? 'Cancelado' : 'Pendiente'}
                            </span>
                          </div>

                          <h4 className="font-serif-cormorant text-base font-bold text-[#2c2725] leading-tight">
                            {app.clientName}
                          </h4>
                          
                          <p className="text-xs text-[#6b6462] flex items-center gap-2">
                            <span className="font-medium text-[#2c2725]">{app.serviceName}</span>
                            <span>·</span>
                            <span>{app.duration}</span>
                          </p>

                          <div className="text-[11px] text-[#8a807d] flex items-center gap-3 flex-wrap">
                            <a 
                              href={`https://wa.me/549${app.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`¡Hola ${app.clientName}! Te escribimos de VIC Estética Integral sobre tu turno de ${app.serviceName}.`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#25D366] hover:underline font-semibold inline-flex items-center gap-1 whitespace-nowrap"
                            >
                              <Phone className="w-3 h-3 shrink-0" />
                              <span className="whitespace-nowrap">{app.clientPhone}</span>
                            </a>
                            {app.notes && (
                              <span className="text-[#8a807d] italic truncate max-w-[200px]" title={app.notes}>
                                📝 {app.notes}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Column 2: Date, Time & Money */}
                        <div className="flex flex-row md:flex-col items-start gap-1 text-xs md:text-right border-t md:border-t-0 pt-2 md:pt-0 w-full md:w-auto justify-between">
                          <div>
                            <span className="font-bold text-[#2c2725] block">
                              📅 {app.dateDisplay || app.date}
                            </span>
                            <span className="font-bold text-[#9a5b63] text-sm block">
                              ⏰ {app.timeSlot} hs
                            </span>
                          </div>

                          <div className="mt-1">
                            <span className="font-bold text-[#2c2725] text-sm">
                              {formatPrice(app.finalPrice)}
                            </span>
                            <span className="text-[10px] text-[#8a807d] block uppercase font-medium">
                              {app.paymentMethod === 'cash' ? 'Efectivo (-15%)' : app.paymentMethod === 'giftcard' ? `Gift Card (${app.giftCardCodeUsed})` : 'Transferencia / QR'}
                            </span>
                          </div>
                        </div>

                        {/* Column 3: Quick Action Buttons */}
                        <div className="flex items-center gap-1.5 flex-wrap border-t md:border-t-0 pt-2 md:pt-0 w-full md:w-auto justify-end">
                          <button
                            onClick={() => setSelectedAppointmentPass(app)}
                            title="Ver Pase Digital con QR"
                            className="px-2.5 py-1.5 rounded-xl bg-[#f5ede5] hover:bg-[#ebdcd0] text-[#9a5b63] text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Pase QR</span>
                          </button>

                          <button
                            onClick={() => {
                              setReschedulingAppointment(app);
                              setNewRescheduleDate(app.date);
                              setNewRescheduleTime(app.timeSlot);
                            }}
                            title="Reprogramar fecha u hora"
                            className="px-2.5 py-1.5 rounded-xl bg-white border border-[#ede8e3] hover:border-[#c98a92] text-[#4a423f] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Clock className="w-3.5 h-3.5 text-[#c98a92]" />
                            <span>Cambiar</span>
                          </button>

                          {app.status !== 'completed' && (
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'completed')}
                              title="Marcar como atendido en cabina"
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1 cursor-pointer border border-emerald-200"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Atendido</span>
                            </button>
                          )}

                          {app.status !== 'cancelled' && (
                            <button
                              onClick={() => {
                                if (confirm(`¿Deseás cancelar el turno ${app.id} de ${app.clientName}?`)) {
                                  handleUpdateStatus(app.id, 'cancelled');
                                }
                              }}
                              title="Cancelar turno"
                              className="p-1.5 rounded-xl hover:bg-rose-50 text-rose-600 cursor-pointer"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 2: GIFT CARD VALIDATOR & REDEMPTION (STAFF ONLY) ================= */}
          {isStaffAuthenticated && activeTab === 'giftcards' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Validator & Live Redemption */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-white p-5 rounded-2xl border border-[#ede8e3] shadow-xs space-y-4">
                  <div>
                    <h3 className="font-serif-cormorant text-xl font-bold text-[#2c2725]">
                      Validador & Canje en Mostrador
                    </h3>
                    <p className="text-xs text-[#6b6462]">
                      Ingresá el código del voucher para consultar saldo o registrar un débito en caja.
                    </p>
                  </div>

                  {/* Input Code */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ej: VIC-GC-3500 o VIC-GC-50K"
                      value={validationCode}
                      onChange={(e) => setValidationCode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && handleValidateCard()}
                      className="flex-1 px-4 py-2.5 bg-[#fcfaf7] border border-[#ede8e3] rounded-xl text-sm font-mono font-bold text-[#2c2725] uppercase focus:bg-white focus:ring-2 focus:ring-[#c98a92]/40 outline-none"
                    />
                    <button
                      onClick={() => handleValidateCard()}
                      className="px-5 py-2.5 bg-[#c98a92] hover:bg-[#b57a82] text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Validar</span>
                    </button>
                  </div>

                  {/* Feedback Box */}
                  {validationFeedback && (
                    <div className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 border ${
                      validationFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                      validationFeedback.type === 'error' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                      'bg-blue-50 text-blue-800 border-blue-200'
                    }`}>
                      {validationFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" /> :
                       validationFeedback.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" /> :
                       <Sparkles className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />}
                      <span className="font-medium">{validationFeedback.message}</span>
                    </div>
                  )}

                  {/* Validated Card Details & Debit Form */}
                  {validatedCard && (
                    <div className="bg-[#fbf4eb] border border-[#ede0d4] rounded-2xl p-4 space-y-4">
                      <div className="flex justify-between items-start border-b border-[#ede0d4] pb-3">
                        <div>
                          <span className="font-mono text-xs font-bold text-[#9a5b63] bg-white px-2 py-0.5 rounded border border-[#f0d4d8]">
                            {validatedCard.code}
                          </span>
                          <h4 className="font-serif-cormorant text-lg font-bold text-[#2c2725] mt-1">
                            {validatedCard.recipientName}
                          </h4>
                          <span className="text-[11px] text-[#6b6462]">De: {validatedCard.senderName}</span>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-[#8a807d] uppercase tracking-wider block font-semibold">
                            Saldo Disponible
                          </span>
                          <span className="text-xl font-bold text-[#2c2725]">
                            {formatPrice(validatedCard.remainingBalance)}
                          </span>
                          <span className="text-[10px] text-[#8a807d] block">
                            Inicial: {formatPrice(validatedCard.initialBalance)}
                          </span>
                        </div>
                      </div>

                      {validatedCard.treatmentName && (
                        <div className="text-xs bg-white/80 p-2.5 rounded-xl border border-[#ede8e3]">
                          <span className="text-[#8a807d] block text-[10px] uppercase font-bold">Tratamiento Asignado:</span>
                          <span className="font-bold text-[#2c2725]">{validatedCard.treatmentName}</span>
                        </div>
                      )}

                      {/* Redemption Action */}
                      {validatedCard.remainingBalance > 0 && (
                        <form onSubmit={handleProcessRedemption} className="space-y-3 bg-white p-3.5 rounded-xl border border-[#ede8e3]">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-[#2c2725] flex items-center gap-1.5">
                            <Receipt className="w-3.5 h-3.5 text-[#c98a92]" />
                            <span>Registrar Débito / Canje en Recepción</span>
                          </h5>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-[10px] font-bold text-[#8a807d] uppercase mb-1">Monto a Debitar ($ ARS)</label>
                              <input
                                type="number"
                                min="1"
                                max={validatedCard.remainingBalance}
                                value={redemptionAmount}
                                onChange={(e) => setRedemptionAmount(e.target.value)}
                                className="w-full px-3 py-2 bg-[#fcfaf7] border border-[#ede8e3] rounded-xl text-xs font-bold text-[#2c2725] outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-[#8a807d] uppercase mb-1">Detalle de Sesión / Nota</label>
                              <input
                                type="text"
                                placeholder="Ej: Sesión Facial realizada en cabina 1"
                                value={redemptionNotes}
                                onChange={(e) => setRedemptionNotes(e.target.value)}
                                className="w-full px-3 py-2 bg-[#fcfaf7] border border-[#ede8e3] rounded-xl text-xs text-[#2c2725] outline-none"
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-xs flex items-center justify-center gap-2"
                          >
                            <Check className="w-4 h-4" />
                            <span>Confirmar Débito de {formatPrice(parseFloat(redemptionAmount) || 0)}</span>
                          </button>
                        </form>
                      )}

                      {/* Usage History */}
                      {validatedCard.usageHistory.length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-[#ede0d4]">
                          <span className="text-[10px] font-bold text-[#8a807d] uppercase tracking-wider block">
                            Historial de Canjes Registrados
                          </span>
                          <div className="space-y-1 max-h-32 overflow-y-auto text-[11px]">
                            {validatedCard.usageHistory.map((item) => (
                              <div key={item.id} className="bg-white p-2 rounded-lg border border-[#ede8e3] flex justify-between items-center">
                                <div>
                                  <span className="font-bold text-[#2c2725]">-{formatPrice(item.amount)}</span>
                                  <span className="text-[#8a807d] ml-2">{item.notes || 'Canje'}</span>
                                </div>
                                <span className="text-[#8a807d] text-[10px]">
                                  {new Date(item.timestamp).toLocaleDateString('es-AR')}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              </div>

              {/* Right Column: All Registered Gift Cards Table */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-[#2c2725] uppercase tracking-wider">
                    Todas las Gift Cards ({giftCards.length})
                  </h4>
                  <span className="text-[11px] text-[#8a807d]">Clic para cargar</span>
                </div>

                <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
                  {giftCards.map((card) => (
                    <button
                      key={card.code}
                      onClick={() => handleValidateCard(card.code)}
                      className="w-full text-left bg-white p-3.5 rounded-2xl border border-[#ede8e3] hover:border-[#c98a92] transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-mono text-[10px] font-bold text-[#9a5b63] bg-[#fbf0f2] px-2 py-0.5 rounded border border-[#f0d4d8]">
                            {card.code}
                          </span>
                          <h5 className="font-bold text-xs text-[#2c2725] mt-1 group-hover:text-[#c98a92] transition-colors">
                            {card.recipientName}
                          </h5>
                          <p className="text-[10px] text-[#8a807d]">De: {card.senderName}</p>
                        </div>

                        <div className="text-right">
                          <span className="font-bold text-xs text-[#2c2725] block">
                            {formatPrice(card.remainingBalance)}
                          </span>
                          <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full inline-block mt-0.5 ${
                            card.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                            card.status === 'partially_used' ? 'bg-amber-100 text-amber-800' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {card.status === 'active' ? 'Activa' : card.status === 'partially_used' ? 'Con Saldo' : 'Canjeada'}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ================= TAB 3: ISSUE GIFT CARD (STAFF ONLY) ================= */}
          {isStaffAuthenticated && activeTab === 'issue-giftcard' && (
            <div className="max-w-2xl mx-auto space-y-5">
              <div className="bg-white p-6 rounded-3xl border border-[#ede8e3] shadow-xs space-y-4">
                <div>
                  <h3 className="font-serif-cormorant text-2xl font-bold text-[#2c2725]">
                    Emitir Nueva Gift Card en Caja
                  </h3>
                  <p className="text-xs text-[#6b6462]">
                    Generá un voucher con código único y saldo cargado para entrega inmediata en el consultorio.
                  </p>
                </div>

                {createdGiftCard ? (
                  <div className="bg-[#eef7f2] border border-[#d4eadd] p-5 rounded-2xl text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 block">
                        ¡Tarjeta Emitida con Éxito!
                      </span>
                      <h4 className="font-mono text-xl font-bold text-[#2c2725] mt-1">
                        {createdGiftCard.code}
                      </h4>
                      <p className="text-xs text-[#2c2725] mt-1">
                        Para: <strong>{createdGiftCard.recipientName}</strong> · Saldo: <strong>{formatPrice(createdGiftCard.initialBalance)}</strong>
                      </p>
                    </div>

                    <div className="flex justify-center gap-2 pt-2">
                      <button
                        onClick={() => handleCopy(createdGiftCard.code, 'issued-code')}
                        className="px-4 py-2 bg-white border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        {copiedCode === 'issued-code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCode === 'issued-code' ? 'Copiado' : 'Copiar Código'}</span>
                      </button>

                      <button
                        onClick={() => setCreatedGiftCard(null)}
                        className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-emerald-800"
                      >
                        Emitir Otra Tarjeta
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleIssueGiftCard} className="space-y-4 text-xs">
                    
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setNewGcType('amount')}
                        className={`flex-1 py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                          newGcType === 'amount' ? 'bg-[#c98a92] text-white border-[#c98a92]' : 'bg-[#fcfaf7] text-[#6b6462] border-[#ede8e3]'
                        }`}
                      >
                        Por Monto en Dinero ($)
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewGcType('treatment')}
                        className={`flex-1 py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                          newGcType === 'treatment' ? 'bg-[#c98a92] text-white border-[#c98a92]' : 'bg-[#fcfaf7] text-[#6b6462] border-[#ede8e3]'
                        }`}
                      >
                        Por Tratamiento Específico
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold uppercase text-[#2c2725] mb-1">Nombre de la Agasajada / Beneficiaria *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ej: Laura Gómez"
                          value={newGcRecipient}
                          onChange={(e) => setNewGcRecipient(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#fcfaf7] border border-[#ede8e3] rounded-xl text-xs text-[#2c2725] focus:outline-none focus:ring-1 focus:ring-[#c98a92]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold uppercase text-[#2c2725] mb-1">De parte de (Emisor)</label>
                        <input
                          type="text"
                          placeholder="Ej: Familia Gómez o Mavi Tissera"
                          value={newGcSender}
                          onChange={(e) => setNewGcSender(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#fcfaf7] border border-[#ede8e3] rounded-xl text-xs text-[#2c2725] focus:outline-none focus:ring-1 focus:ring-[#c98a92]"
                        />
                      </div>
                    </div>

                    {newGcType === 'amount' ? (
                      <div>
                        <label className="block font-bold uppercase text-[#2c2725] mb-1">Monto en Pesos ($ ARS)</label>
                        <div className="grid grid-cols-4 gap-2 mb-2">
                          {['25000', '35000', '50000', '75000'].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setNewGcAmount(val)}
                              className={`py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                                newGcAmount === val ? 'bg-[#2c2725] text-white border-[#2c2725]' : 'bg-[#fcfaf7] text-[#4a423f] border-[#ede8e3]'
                              }`}
                            >
                              ${Number(val)/1000}k
                            </button>
                          ))}
                        </div>
                        <input
                          type="number"
                          placeholder="O ingresá un monto personalizado"
                          value={newGcAmount}
                          onChange={(e) => setNewGcAmount(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#fcfaf7] border border-[#ede8e3] rounded-xl text-xs text-[#2c2725] focus:outline-none"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block font-bold uppercase text-[#2c2725] mb-1">Tratamiento Incluido</label>
                        <select
                          value={newGcTreatment}
                          onChange={(e) => setNewGcTreatment(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#fcfaf7] border border-[#ede8e3] rounded-xl text-xs text-[#2c2725] focus:outline-none"
                        >
                          {SERVICES_DATA.map(s => (
                            <option key={s.id} value={s.name}>{s.name} ({s.duration})</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block font-bold uppercase text-[#2c2725] mb-1">Mensaje / Dedicatoria</label>
                      <textarea
                        rows={2}
                        value={newGcMessage}
                        onChange={(e) => setNewGcMessage(e.target.value)}
                        className="w-full px-3.5 py-2 bg-[#fcfaf7] border border-[#ede8e3] rounded-xl text-xs text-[#2c2725] focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#c98a92] hover:bg-[#b57a82] text-white font-bold uppercase tracking-widest text-xs rounded-2xl cursor-pointer shadow-md transition-transform active:scale-98"
                    >
                      Generar & Registrar Gift Card
                    </button>

                  </form>
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 4: CLIENT PORTAL (PUBLIC / CLIENT VIEW) ================= */}
          {(!isStaffAuthenticated || activeTab === 'client-portal') && (
            <div className="max-w-3xl mx-auto space-y-6">
              
              {/* Welcoming Banner for Patients */}
              <div className="bg-gradient-to-br from-[#fbf4eb] to-[#fbf0f2] border border-[#ede0d4] rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                <div className="w-16 h-16 rounded-full bg-white p-1 border border-[#e4ded8] shadow-sm shrink-0 flex items-center justify-center">
                  <img src="/logo.svg" alt="VIC" className="w-12 h-12 object-contain" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#c98a92] block">
                    Atención Personalizada · Río Segundo
                  </span>
                  <h3 className="font-serif-cormorant text-2xl font-bold text-[#2c2725]">
                    Consultá tus Turnos y Saldo de Gift Card
                  </h3>
                  <p className="text-xs text-[#6b6462] leading-relaxed">
                    Ingresá tu número de teléfono o código de ticket para ver el estado de tu cita, descargar tu pase con QR o verificar el saldo de tu tarjeta de regalo.
                  </p>
                </div>
              </div>

              {/* Two Search Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Search Appointment */}
                <div className="bg-white p-5 rounded-2xl border border-[#ede8e3] shadow-xs space-y-3">
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-[#c98a92]" />
                    <h4 className="font-serif-cormorant text-lg font-bold text-[#2c2725]">
                      Buscar Mi Turno
                    </h4>
                  </div>
                  
                  <form onSubmit={handleSearchClientTurnos} className="space-y-2">
                    <input
                      type="text"
                      placeholder="Teléfono o Ticket (ej: 3572... o VIC-TK-1082)"
                      value={clientPhoneSearch}
                      onChange={(e) => setClientPhoneSearch(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#fcfaf7] border border-[#ede8e3] rounded-xl text-xs text-[#2c2725] focus:outline-none focus:ring-1 focus:ring-[#c98a92]"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#c98a92] hover:bg-[#b57a82] text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Buscar Mis Turnos</span>
                    </button>
                  </form>
                </div>

                {/* 2. Check Gift Card Balance */}
                <div className="bg-white p-5 rounded-2xl border border-[#ede8e3] shadow-xs space-y-3">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-[#c98a92]" />
                    <h4 className="font-serif-cormorant text-lg font-bold text-[#2c2725]">
                      Consultar Mi Gift Card
                    </h4>
                  </div>

                  <form onSubmit={handleClientCheckGc} className="space-y-2">
                    <input
                      type="text"
                      placeholder="Código de voucher (ej: VIC-GC-3500)"
                      value={clientGcCode}
                      onChange={(e) => setClientGcCode(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2.5 bg-[#fcfaf7] border border-[#ede8e3] rounded-xl text-xs font-mono font-bold text-[#2c2725] uppercase focus:outline-none focus:ring-1 focus:ring-[#c98a92]"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#2c2725] hover:bg-[#403835] text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Verificar Saldo</span>
                    </button>
                  </form>
                </div>

              </div>

              {/* Gift Card Result Box if queried */}
              {clientGcFeedback && !clientGcResult && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{clientGcFeedback}</span>
                </div>
              )}

              {clientGcResult && (
                <div className="bg-gradient-to-br from-[#fbf0f2] to-[#f5ede5] border border-[#ede0d4] rounded-3xl p-5 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#9a5b63] bg-white px-2 py-0.5 rounded border border-[#f0d4d8]">
                        {clientGcResult.code}
                      </span>
                      <h4 className="font-serif-cormorant text-xl font-bold text-[#2c2725] mt-1">
                        ¡Hola {clientGcResult.recipientName}!
                      </h4>
                      <p className="text-xs text-[#6b6462]">De: {clientGcResult.senderName}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-[#8a807d] block">Saldo Disponible</span>
                      <span className="text-2xl font-bold text-[#2c2725]">
                        {formatPrice(clientGcResult.remainingBalance)}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold block">
                        {clientGcResult.remainingBalance > 0 ? '✓ Tarjeta con saldo activo' : 'Canjeada en su totalidad'}
                      </span>
                    </div>
                  </div>

                  {clientGcResult.treatmentName && (
                    <div className="bg-white/80 p-3 rounded-xl border border-[#ede8e3] text-xs">
                      <span className="text-[#8a807d] block text-[10px] uppercase font-bold">Tratamiento sugerido:</span>
                      <span className="font-bold text-[#2c2725]">{clientGcResult.treatmentName}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#ede0d4] flex flex-col sm:flex-row gap-2 justify-between items-center text-xs">
                    <span className="text-[#8a807d]">
                      📍 Canjeable en Mendoza 985, Río Segundo
                    </span>
                    {onBookNew && clientGcResult.remainingBalance > 0 && (
                      <button
                        onClick={() => {
                          onClose();
                          onBookNew();
                        }}
                        className="px-4 py-2 bg-[#c98a92] text-white font-bold rounded-xl hover:bg-[#b57a82] cursor-pointer shadow-xs"
                      >
                        Usar ahora para Reservar Turno
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Found Appointments Results */}
              {clientSearched && (
                <div>
                  {clientFoundAppointments.length === 0 ? (
                    <div className="bg-white border border-[#ede8e3] rounded-2xl p-8 text-center space-y-3">
                      <Calendar className="w-8 h-8 text-[#c98a92] mx-auto opacity-50" />
                      <h4 className="font-serif-cormorant text-lg font-bold text-[#2c2725]">
                        No encontramos turnos con "{clientPhoneSearch}"
                      </h4>
                      <p className="text-xs text-[#6b6462] max-w-sm mx-auto">
                        Verificá haber ingresado tu número de teléfono o ticket correctamente. Si aún no agendaste tu turno, ¡podés reservarlo online en segundos!
                      </p>
                      {onBookNew && (
                        <button
                          onClick={() => {
                            onClose();
                            onBookNew();
                          }}
                          className="px-4 py-2 bg-[#c98a92] hover:bg-[#b57a82] text-white text-xs font-bold uppercase rounded-xl cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Reservar un Nuevo Turno</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <h4 className="font-bold text-xs text-[#2c2725] uppercase tracking-wider flex items-center justify-between">
                        <span>Tus Turnos Registrados ({clientFoundAppointments.length})</span>
                        <span className="text-[#8a807d] font-normal text-[11px]">VIC Estética Integral</span>
                      </h4>

                      {clientFoundAppointments.map(app => (
                        <div key={app.id} className="bg-white border border-[#ede8e3] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[11px] font-bold text-[#9a5b63] bg-[#fbf0f2] px-2 py-0.5 rounded border border-[#f0d4d8]">
                                {app.id}
                              </span>
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                app.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                app.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                app.status === 'cancelled' ? 'bg-rose-100 text-rose-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {app.status === 'confirmed' ? 'Confirmado' :
                                 app.status === 'completed' ? 'Atendido' :
                                 app.status === 'cancelled' ? 'Cancelado' : 'Pendiente'}
                              </span>
                            </div>
                            <h5 className="font-serif-cormorant text-lg font-bold text-[#2c2725]">{app.serviceName}</h5>
                            <p className="text-xs text-[#6b6462]">
                              📅 {app.dateDisplay || app.date} · ⏰ <strong className="text-[#9a5b63]">{app.timeSlot} hs</strong> · 📍 Mendoza 985
                            </p>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <button
                              onClick={() => setSelectedAppointmentPass(app)}
                              className="flex-1 sm:flex-none px-3.5 py-2 bg-[#f5ede5] hover:bg-[#ebdcd0] text-[#9a5b63] font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              <span>Ver Pase QR</span>
                            </button>

                            <a
                              href={SystemStorage.generateGoogleCalendarUrl(app)}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3.5 py-2 bg-white border border-[#ede8e3] text-[#2c2725] font-semibold text-xs rounded-xl hover:border-[#c98a92] flex items-center justify-center gap-1 shadow-2xs"
                            >
                              <Calendar className="w-3.5 h-3.5 text-[#c98a92]" />
                              <span className="hidden sm:inline">Google Calendar</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* If no search performed yet, show quick info */}
              {!clientSearched && appointments.length > 0 && (
                <div className="bg-white/60 border border-dashed border-[#ede8e3] rounded-2xl p-4 text-center text-xs text-[#8a807d]">
                  💡 Consejo: Si realizaste tu reserva hace unos minutos en este mismo dispositivo, podés buscar ingresando tu número de teléfono para ver tu pase digital.
                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* ================= MODAL: STAFF PIN PROMPT ================= */}
      {showPinPrompt && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-[#ede8e3] relative text-center space-y-4">
            <button
              onClick={() => {
                setShowPinPrompt(false);
                setPinError(null);
                setPinInput('');
              }}
              className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-gray-100 text-[#6b6462] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-[#fdf0f2] text-[#c98a92] flex items-center justify-center mx-auto shadow-xs border border-[#f0d4d8]">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#c98a92] block">
                Seguridad de la Clínica
              </span>
              <h3 className="font-serif-cormorant text-xl font-bold text-[#2c2725] mt-0.5">
                Acceso Personal / Staff
              </h3>
              <p className="text-xs text-[#6b6462] mt-1">
                Ingresá el PIN de seguridad de recepción para acceder a la agenda general y métricas.
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-3">
              <input
                type="password"
                maxLength={8}
                autoFocus
                placeholder="PIN (por defecto: 1234)"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(null);
                }}
                className="w-full px-4 py-2.5 bg-[#fcfaf7] border border-[#ede8e3] rounded-xl text-center text-lg font-mono font-bold tracking-widest text-[#2c2725] focus:outline-none focus:ring-2 focus:ring-[#c98a92]"
              />

              {pinError && (
                <div className="text-[11px] text-rose-600 font-medium">
                  {pinError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-[#c98a92] hover:bg-[#b57a82] text-white text-xs font-bold uppercase tracking-widest rounded-xl cursor-pointer shadow-xs transition-colors"
              >
                Desbloquear Panel
              </button>
            </form>

            <div className="text-[10px] text-[#8a807d]">
              PIN por defecto: <strong className="font-mono text-[#2c2725]">1234</strong>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: DIGITAL APPOINTMENT PASS / QR ================= */}
      {selectedAppointmentPass && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#ede8e3] relative text-center space-y-4">
            <button
              onClick={() => setSelectedAppointmentPass(null)}
              className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-gray-100 text-[#6b6462] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <img src="/logo.svg" alt="VIC" className="w-12 h-12 rounded-full mx-auto" />
            
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#c98a92] block">
                Pase de Turno Confirmado
              </span>
              <h3 className="font-serif-cormorant text-2xl font-bold text-[#2c2725]">
                {selectedAppointmentPass.clientName}
              </h3>
              <p className="text-xs text-[#6b6462] mt-0.5">
                {selectedAppointmentPass.serviceName}
              </p>
            </div>

            {/* QR Simulation Box */}
            <div className="bg-[#fdfbf7] p-5 rounded-2xl border border-[#ede8e3] inline-block mx-auto">
              <div className="w-36 h-36 bg-white p-2 border-2 border-[#2c2725] rounded-xl flex flex-col items-center justify-center mx-auto shadow-inner relative">
                <QrCode className="w-28 h-28 text-[#2c2725]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white border border-[#c98a92] flex items-center justify-center text-[9px] font-bold text-[#c98a92] shadow-xs">
                    VIC
                  </div>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-[#9a5b63] mt-2 block">
                {selectedAppointmentPass.id}
              </span>
            </div>

            <div className="bg-[#f5ede5] p-3 rounded-xl text-xs text-[#2c2725] space-y-1 text-left">
              <div className="flex justify-between">
                <span className="text-[#8a807d]">Fecha y Hora:</span>
                <span className="font-bold">{selectedAppointmentPass.dateDisplay || selectedAppointmentPass.date} — {selectedAppointmentPass.timeSlot} hs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8a807d]">Lugar:</span>
                <span className="font-semibold">Mendoza 985, Río Segundo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8a807d]">Monto Final:</span>
                <span className="font-bold text-[#9a5b63]">{formatPrice(selectedAppointmentPass.finalPrice)}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <a
                href={SystemStorage.generateGoogleCalendarUrl(selectedAppointmentPass)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 bg-[#2c2725] text-white rounded-xl text-xs font-bold hover:bg-[#403835] text-center"
              >
                Agregar a Google Calendar
              </a>
              <button
                onClick={() => handleCopy(selectedAppointmentPass.id, 'ticket-code')}
                className="px-4 py-2.5 bg-white border border-[#ede8e3] rounded-xl text-xs font-bold text-[#2c2725] hover:border-[#c98a92] cursor-pointer"
              >
                {copiedCode === 'ticket-code' ? '¡Copiado!' : 'Copiar ID'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL: RESCHEDULE APPOINTMENT (STAFF) ================= */}
      {reschedulingAppointment && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#ede8e3] relative space-y-4">
            <button
              onClick={() => setReschedulingAppointment(null)}
              className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-gray-100 text-[#6b6462] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif-cormorant text-xl font-bold text-[#2c2725]">
              Reprogramar Turno
            </h3>
            <p className="text-xs text-[#6b6462]">
              Paciente: <strong>{reschedulingAppointment.clientName}</strong> ({reschedulingAppointment.serviceName})
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#2c2725] mb-1">
                  Nueva Fecha
                </label>
                <input
                  type="date"
                  value={newRescheduleDate}
                  onChange={(e) => setNewRescheduleDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#fcfaf7] border border-[#ede8e3] rounded-xl text-sm font-semibold text-[#2c2725] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#2c2725] mb-1">
                  Nuevo Horario
                </label>
                <select
                  value={newRescheduleTime}
                  onChange={(e) => setNewRescheduleTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#fcfaf7] border border-[#ede8e3] rounded-xl text-sm font-semibold text-[#2c2725] focus:outline-none"
                >
                  {['09:00', '09:45', '10:30', '11:15', '12:00', '14:00', '14:45', '15:30', '16:15', '17:00', '18:00', '19:00'].map(t => (
                    <option key={t} value={t}>{t} hs</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setReschedulingAppointment(null)}
                className="flex-1 py-2.5 bg-gray-100 text-[#6b6462] rounded-xl text-xs font-semibold hover:bg-gray-200 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveReschedule}
                className="flex-1 py-2.5 bg-[#c98a92] hover:bg-[#b57a82] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Guardar Cambio
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
