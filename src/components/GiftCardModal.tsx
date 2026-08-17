import React, { useState, useEffect, useRef } from 'react';
import { 
  Gift, 
  X, 
  Sparkles, 
  Check, 
  RotateCw, 
  QrCode, 
  ShieldCheck, 
  Crown, 
  Share2, 
  Copy, 
  Calendar,
  Download,
  Printer,
  Palette,
  MessageCircle,
  Clock,
  Send,
  AlertCircle,
  Phone,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BUSINESS_DATA, formatPrice } from '../data/aestheticData';
import { SystemStorage } from '../utils/systemStorage';
import { GiftCardItem } from '../types';
import { 
  GIFT_CARD_THEMES, 
  generateGiftCardCanvas, 
  generateGiftCardFile,
  downloadGiftCardImage 
} from '../utils/giftCardRenderer';

interface GiftCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBookingWithGiftCard?: (code: string) => void;
  initialCode?: string;
}

const MESSAGE_PRESETS = [
  '¡Para que disfrutes de un momento único de relax y cuidado en VIC!',
  '¡Feliz Cumpleaños! Que este año brilles como nunca te merecés.',
  '¡Un mimo súper especial para vos! Disfrutá de este momento de spa.',
  '¡Gracias por todo tu amor y dedicación! Te merecés este día de cuidado.',
  '¡Un regalo para tu bienestar y armonía en las mejores manos!'
];

export const GiftCardModal: React.FC<GiftCardModalProps> = ({ 
  isOpen, 
  onClose,
  onOpenBookingWithGiftCard,
  initialCode
}) => {
  const [cardType, setCardType] = useState<'amount' | 'treatment'>('amount');
  const [recipient, setRecipient] = useState('');
  const [sender, setSender] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [amount, setAmount] = useState('35000');
  const [customAmount, setCustomAmount] = useState('');
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [treatment, setTreatment] = useState('Limpieza Facial Profunda + Hidratación & Peeling');
  const [message, setMessage] = useState(MESSAGE_PRESETS[0]);
  const [selectedThemeId, setSelectedThemeId] = useState('noir-gold');
  const [voucherId, setVoucherId] = useState(() => `VIC-GC-${Math.floor(1000 + Math.random() * 9000)}`);
  const [isFlipped, setIsFlipped] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  // Confirmation / Generated voucher state
  const [generatedCard, setGeneratedCard] = useState<GiftCardItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Sync with localStorage updates (e.g. when staff approves in another tab/modal)
  useEffect(() => {
    const handleDataUpdate = () => {
      if (generatedCard) {
        const fresh = SystemStorage.getGiftCardByCode(generatedCard.code);
        if (fresh) {
          setGeneratedCard(fresh);
        }
      }
    };
    window.addEventListener('vic_data_updated', handleDataUpdate);
    return () => window.removeEventListener('vic_data_updated', handleDataUpdate);
  }, [generatedCard]);

  // Load existing card if provided via initialCode
  useEffect(() => {
    if (initialCode && isOpen) {
      const existing = SystemStorage.getGiftCardByCode(initialCode);
      if (existing) {
        setGeneratedCard(existing);
      }
    }
  }, [initialCode, isOpen]);

  // Handle ESC key and lock body scroll
  useEffect(() => {
    if (!isOpen) {
      setGeneratedCard(null);
      setIsFlipped(false);
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

  const activeTheme = GIFT_CARD_THEMES.find(t => t.id === selectedThemeId) || GIFT_CARD_THEMES[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y - rect.height / 2) / (rect.height / 2)) * -6;
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 6;
    setTilt({ rx, ry });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#c98a92', '#f5ede5', '#d4af37', '#ffffff', '#e8c99e']
      });
    } catch {
      // ignore
    }
  };

  const handleCreateAndRequestGiftCard = async () => {
    const chosenAmount = isCustomAmount 
      ? (parseFloat(customAmount) || 35000) 
      : (parseFloat(amount) || 35000);
    const numericAmount = cardType === 'amount' ? chosenAmount : 40000;
    const recipientClean = recipient.trim() || 'Alguien Especial';
    const senderClean = sender.trim() || 'Un Ser Querido';

    // When created by client, starts in 'pending_approval' until Staff verifies in panel
    const newCard: GiftCardItem = {
      code: voucherId,
      cardType: cardType,
      recipientName: recipientClean,
      senderName: senderClean,
      senderPhone: senderPhone.trim() || undefined,
      recipientPhone: recipientPhone.trim() || undefined,
      initialBalance: numericAmount,
      remainingBalance: numericAmount,
      treatmentName: cardType === 'treatment' ? treatment : undefined,
      message: message.trim() || '¡Una experiencia única de bienestar y relax en VIC!',
      status: 'pending_approval',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      usageHistory: []
    };

    // Save to System Storage
    SystemStorage.saveGiftCard(newCard);
    setGeneratedCard(newCard);
    triggerCelebration();

    // Notify staff via WhatsApp so they can review and approve immediately
    const staffNotice = 
      `👋 *¡HOLA STAFF VIC! NUEVA SOLICITUD DE GIFT CARD*\n\n` +
      `🎫 *Código:* \`${newCard.code}\`\n` +
      `👤 *Comprador/a:* ${newCard.senderName} ${newCard.senderPhone ? `(${newCard.senderPhone})` : ''}\n` +
      `🌸 *Para:* ${newCard.recipientName}\n` +
      `💰 *Obsequio:* ${newCard.cardType === 'treatment' ? newCard.treatmentName : formatPrice(newCard.initialBalance)}\n` +
      `💌 *Mensaje:* "${newCard.message}"\n\n` +
      `Por favor confirmar el pago/recepción en el panel de gestión para habilitar el envío oficial a la clienta. ✨`;

    window.open(`https://wa.me/${BUSINESS_DATA.phone}?text=${encodeURIComponent(staffNotice)}`, '_blank');
  };

  const handleSendWhatsAppGift = async (card: GiftCardItem) => {
    if (card.status === 'pending_approval') {
      alert('Esta Gift Card está pendiente de confirmación por parte del equipo de VIC. Una vez confirmada podrás enviarla.');
      return;
    }

    // Auto trigger HD image download so client has the photo ready in gallery/downloads
    try {
      await downloadGiftCardImage(card, selectedThemeId);
    } catch {
      // ignore
    }

    const giftDetail = card.cardType === 'treatment' 
      ? `💆‍♀️ *Tratamiento Obsequiado:* ${card.treatmentName}` 
      : `💰 *Monto de Regalo:* ${formatPrice(card.initialBalance)}`;

    const text = 
      `🎁 *¡HOLA ${card.recipientName.toUpperCase()}! TE REGALARON UNA GIFT CARD DE VIC ESTÉTICA INTEGRAL* 🌸✨\n\n` +
      `*(Adjuntamos la foto oficial de tu tarjeta de regalo en alta resolución 👆)*\n\n` +
      `👤 *De parte de:* ${card.senderName}\n` +
      `💌 *Dedicatoria especial:* "${card.message}"\n\n` +
      `🎀 *Detalle de tu regalo:*\n` +
      `${giftDetail}\n\n` +
      `🎫 *Código de Voucher Oficial:* \`${card.code}\`\n` +
      `⏳ *Vigencia:* 90 días corridos\n` +
      `📍 *Lugar:* Mendoza 985, Río Segundo, Córdoba\n\n` +
      `🌟 *¿Cómo canjearlo?*\n` +
      `Presentá la foto o código al asistir, o ingresalo al agendar tu turno online en nuestro sitio web: ${window.location.origin}/#giftcard-${card.code}\n\n` +
      `¡Te esperamos para consentirte! 💖`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadImage = async () => {
    if (!generatedCard) return;
    setIsDownloading(true);
    try {
      await downloadGiftCardImage(generatedCard, selectedThemeId);
    } catch (err) {
      console.error('Error downloading card image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleNativeShare = async () => {
    if (!generatedCard) return;
    if (generatedCard.status === 'pending_approval') {
      alert('Esta tarjeta está pendiente de confirmación del staff de VIC.');
      return;
    }

    setIsDownloading(true);

    try {
      // 1. Generate the actual PNG image File
      const file = await generateGiftCardFile(generatedCard, selectedThemeId);

      const shareText = 
        `🎁 ¡Hola ${generatedCard.recipientName}! ${generatedCard.senderName} te ha regalado una Gift Card exclusiva de VIC Estética Integral (Código: ${generatedCard.code}) en Mendoza 985, Río Segundo.`;

      // 2. If navigator.canShare supports files (Mobile WhatsApp, Instagram, Telegram, AirDrop)
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Gift Card VIC — ${generatedCard.recipientName}`,
          text: shareText,
          files: [file]
        });
      } else if (navigator.share) {
        await navigator.share({
          title: `Gift Card VIC — ${generatedCard.recipientName}`,
          text: shareText,
          url: `${window.location.origin}/#giftcard-${generatedCard.code}`
        });
      } else {
        await handleSendWhatsAppGift(generatedCard);
      }
    } catch (err) {
      console.warn('Share cancelled or not supported:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  const isApproved = generatedCard?.status === 'active' || generatedCard?.status === 'partially_used';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#141110]/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-[#fcfaf7] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#ede8e3] overflow-hidden flex flex-col my-auto max-h-[94vh]">
        
        {/* Modal Top Navigation Bar */}
        <div className="bg-[#f5f0eb] px-6 py-4 border-b border-[#ede8e3] flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white p-1 border border-[#e4ded8] shadow-xs flex items-center justify-center">
              <Gift className="w-5 h-5 text-[#c98a92]" />
            </div>
            <div>
              <h3 className="font-serif-cormorant text-xl sm:text-2xl font-bold text-[#2c2725] leading-tight flex items-center gap-2">
                <span>
                  {generatedCard 
                    ? (isApproved ? '¡Gift Card Confirmada & Lista para Enviar!' : 'Solicitud de Gift Card Generada') 
                    : 'Crear Gift Card Personalizada'}
                </span>
                {generatedCard && <Sparkles className="w-4 h-4 text-[#c98a92]" />}
              </h3>
              <p className="text-xs text-[#6b6462]">
                {generatedCard 
                  ? (isApproved 
                      ? 'Tu tarjeta fue aprobada por el staff. Ya podés enviarla a la agasajada por WhatsApp o descargarla.' 
                      : 'Diseño listo. El staff de VIC confirmará el voucher para habilitar su envío y canje.') 
                  : 'Elegí el diseño, dedicatoria y tratamiento para obsequiar a esa persona especial.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white text-[#6b6462] hover:text-[#2c2725] transition-colors cursor-pointer"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= IF GENERATED -> SHOW HIGH-END GIFT CARD DISPLAY & SEND OPTIONS ================= */}
        {generatedCard ? (
          <div className="p-6 overflow-y-auto space-y-6">
            
            {/* Status Banner */}
            {isApproved ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5 text-xs text-emerald-900 font-medium">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <strong className="block text-emerald-950 font-bold">¡Voucher Confirmado & Habilitado!</strong>
                    <span>La tarjeta ya se encuentra activa para ser enviada o canjeada presencialmente / online.</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold bg-emerald-600 text-white px-3 py-1 rounded-full shadow-2xs shrink-0">
                  {generatedCard.code}
                </span>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-start gap-2.5 text-xs text-amber-900 font-medium">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-amber-950 font-bold">Pendiente de Confirmación Staff</strong>
                    <span>El diseño está listo. Recepción validará el pago para activar el botón de envío a la agasajada.</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-mono font-bold bg-amber-600 text-white px-2.5 py-1 rounded-full">
                    {generatedCard.code}
                  </span>
                  <a
                    href={`https://wa.me/${BUSINESS_DATA.phone}?text=Hola!%20Acabo%20de%20generar%20la%20Gift%20Card%20${generatedCard.code}%20para%20${encodeURIComponent(generatedCard.recipientName)}.%20Aguardamos%20su%20confirmaci%C3%B3n.`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-white border border-amber-300 rounded-xl text-[11px] font-bold text-amber-900 hover:bg-amber-100 flex items-center gap-1"
                    title="Notificar por WhatsApp a Recepción"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>Avisar</span>
                  </a>
                </div>
              </div>
            )}

            {/* Generated Card Showcase */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-2 text-xs">
                <span className="font-bold text-[#6b6462] uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#d4af37]" />
                  <span>Certificado Oficial de Regalo</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="flex items-center gap-1.5 font-semibold text-[#8a6b36] hover:text-[#5e4823] bg-amber-50/80 px-3 py-1 rounded-full border border-amber-200/80 shadow-2xs cursor-pointer transition-transform active:scale-95 text-xs"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Girar ({isFlipped ? 'Frente' : 'Seguridad & QR'})</span>
                </button>
              </div>

              {/* 3D Realistic Digital Certificate Card Container */}
              <div 
                style={{ perspective: '1200px' }}
                className="w-full max-w-[500px] aspect-[1.65/1]"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                ref={cardRef}
              >
                <div 
                  style={{
                    transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry + (isFlipped ? 180 : 0)}deg)`,
                    transformStyle: 'preserve-3d',
                    transition: tilt.rx === 0 && tilt.ry === 0 ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                  }}
                  className="relative w-full h-full rounded-3xl shadow-2xl transition-all select-none"
                >
                  {/* CARD FRONT - HAUTE COUTURE LUXURY CERTIFICATE */}
                  <div 
                    style={{ 
                      backfaceVisibility: 'hidden',
                      background: `radial-gradient(circle at center, ${activeTheme.bgMid} 0%, ${activeTheme.bgStart} 60%, ${activeTheme.bgEnd} 100%)`,
                      color: activeTheme.textColor,
                    }}
                    className="absolute inset-0 w-full h-full rounded-3xl p-4 sm:p-5 overflow-hidden border border-[#d4af37]/50 shadow-2xl flex flex-col justify-between"
                  >
                    {/* Double Gold Foil Decorative Frame */}
                    <div className="absolute inset-2.5 border border-[#d4af37]/60 rounded-2xl pointer-events-none" />
                    <div className="absolute inset-3.5 border border-[#d4af37]/30 rounded-xl pointer-events-none" />

                    {/* Corner Ornaments */}
                    <span className="absolute top-4 left-4 text-[10px] text-[#d4af37]/80 leading-none">✦</span>
                    <span className="absolute top-4 right-4 text-[10px] text-[#d4af37]/80 leading-none">✦</span>
                    <span className="absolute bottom-4 left-4 text-[10px] text-[#d4af37]/80 leading-none">✦</span>
                    <span className="absolute bottom-4 right-4 text-[10px] text-[#d4af37]/80 leading-none">✦</span>

                    {/* Header: Crest & Brand */}
                    <div className="text-center z-10 pt-1">
                      <div className="text-[10px] text-[#d4af37] tracking-[0.3em] font-serif font-bold uppercase">
                        ✦ ⚜ ✦
                      </div>
                      <h4 className="font-serif-cormorant text-xl sm:text-2xl font-bold tracking-wider leading-tight">
                        VIC ESTÉTICA INTEGRAL
                      </h4>
                      <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
                        Medicina Estética & Spa · Río Segundo
                      </p>
                    </div>

                    {/* Center Luxury Framed Box */}
                    <div 
                      style={{ 
                        backgroundColor: activeTheme.glassBg,
                        borderColor: activeTheme.glassBorder 
                      }}
                      className="my-auto z-10 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border shadow-inner text-center space-y-1"
                    >
                      <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-semibold opacity-75 block text-[#d4af37]">
                        Especialmente presentado a:
                      </span>
                      <h3 className="font-serif-cormorant text-lg sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                        {generatedCard.recipientName}
                      </h3>
                      <p className="text-[10px] sm:text-[11px] italic opacity-85 text-white/90">
                        Con el cariño de: <strong>{generatedCard.senderName}</strong>
                      </p>

                      {/* Benefit Tag */}
                      <div 
                        style={{ backgroundColor: activeTheme.badgeBg }}
                        className="py-1 px-3 rounded-xl border border-[#d4af37]/60 inline-block max-w-full mt-1 shadow-xs"
                      >
                        <span className="text-xs sm:text-sm font-bold font-serif-cormorant text-[#fbf5b7] tracking-wide block truncate">
                          ✦ {generatedCard.cardType === 'treatment' ? generatedCard.treatmentName : formatPrice(generatedCard.initialBalance)} ✦
                        </span>
                      </div>

                      {/* Message quote */}
                      <p className="text-[10px] italic opacity-85 truncate max-w-[340px] mx-auto text-white/80 pt-0.5">
                        "{generatedCard.message}"
                      </p>
                    </div>

                    {/* Bottom Security & Seal Strip */}
                    <div className="z-10 flex items-center justify-between text-[9px] sm:text-[10px] px-2 pt-0.5 border-t border-white/10">
                      <div className="font-mono bg-black/40 px-2 py-0.5 rounded border border-[#d4af37]/50 text-[#fbf5b7] font-bold">
                        ID: {generatedCard.code}
                      </div>
                      <div className="text-[8px] sm:text-[9px] uppercase tracking-wider text-[#d4af37] font-semibold">
                        Sello Oficial · Válida 90 días
                      </div>
                    </div>
                  </div>

                  {/* CARD BACK */}
                  <div 
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                    className="absolute inset-0 w-full h-full rounded-3xl p-6 bg-gradient-to-br from-[#1c1817] via-[#262120] to-[#141110] text-white overflow-hidden border border-[#d4af37]/40 shadow-inner flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-center z-10 border-b border-white/10 pb-2">
                      <div className="text-[10px] uppercase tracking-widest text-[#d4af37] font-bold flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{isApproved ? 'Seguridad & Canje Habilitado' : 'Validación en Proceso'}</span>
                      </div>
                      <div className="text-[11px] text-[#fbf5b7] font-mono font-bold bg-white/10 px-2 py-0.5 rounded border border-[#d4af37]/40">
                        {generatedCard.code}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 items-center z-10 my-auto">
                      <div className="col-span-2 space-y-1 text-[11px] text-white/80">
                        <p className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-[#d4af37] shrink-0" />
                          <span>Válida por 90 días corridos.</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-[#d4af37] shrink-0" />
                          <span>Canjeable en Mendoza 985, Río Segundo.</span>
                        </p>
                        <p className="flex items-center gap-1.5 text-[#d4af37] font-semibold">
                          <Check className="w-3 h-3 text-[#d4af37] shrink-0" />
                          <span>Turnos online o por WhatsApp.</span>
                        </p>
                      </div>

                      <div className="col-span-1 bg-white p-2 rounded-xl flex items-center justify-center shadow-md">
                        <QrCode className="w-16 h-16 text-[#2c2725]" />
                      </div>
                    </div>

                    <div className="z-10 text-[9px] text-white/60 text-center border-t border-white/10 pt-2">
                      VIC Estética Integral · Medicina Estética · Kinesiología & Spa
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* SEND AS GIFT ACTION BUTTONS (Gated by Staff Confirmation) */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-bold text-[#6b6462] uppercase tracking-wider block text-center">
                {isApproved 
                  ? 'Opciones para enviar y regalar a la agasajada' 
                  : 'Acciones disponibles tras la confirmación de recepción'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. Share Photo Directly (Web Share API with PNG Image File) */}
                <button
                  type="button"
                  onClick={handleNativeShare}
                  disabled={!isApproved || isDownloading}
                  className={`py-3.5 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    isApproved
                      ? 'bg-[#2c2725] hover:bg-black text-white cursor-pointer shadow-md hover:shadow-lg active:scale-98'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                  }`}
                >
                  <Share2 className="w-4 h-4 text-[#d4af37]" />
                  <span>{isDownloading ? 'Generando Foto HD...' : 'Compartir Foto de la Gift Card'}</span>
                </button>

                {/* 2. Send via WhatsApp */}
                <button
                  type="button"
                  onClick={() => handleSendWhatsAppGift(generatedCard)}
                  disabled={!isApproved}
                  className={`py-3.5 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    isApproved
                      ? 'bg-[#25D366] hover:bg-[#20ba59] text-white cursor-pointer shadow-md hover:shadow-lg active:scale-98'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>{isApproved ? 'Enviar por WhatsApp' : 'Enviar por WhatsApp (Requiere Confirmación)'}</span>
                </button>

                {/* 3. Download Image (PNG HD) */}
                <button
                  type="button"
                  onClick={handleDownloadImage}
                  disabled={isDownloading}
                  className="py-3 px-4 bg-white border border-[#ede8e3] hover:border-[#c98a92] hover:bg-[#fbf0f2] text-[#2c2725] rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all active:scale-98"
                >
                  <Download className="w-4 h-4 text-[#c98a92]" />
                  <span>{isDownloading ? 'Descargando...' : 'Descargar Foto HD (PNG)'}</span>
                </button>

                {/* 4. Copy Code */}
                <button
                  type="button"
                  onClick={() => handleCopyCode(generatedCard.code)}
                  className="py-3 px-4 bg-white border border-[#ede8e3] hover:border-[#c98a92] text-[#4a423f] rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#c98a92]" />}
                  <span>{copied ? '¡Código Copiado!' : 'Copiar Código de Voucher'}</span>
                </button>
              </div>

              {/* Additional Options: Print & Book */}
              <div className="pt-2 border-t border-[#ede8e3] flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="text-xs text-[#6b6462] hover:text-[#2c2725] flex items-center gap-1.5 cursor-pointer py-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir para sobre de regalo</span>
                </button>

                {isApproved && onOpenBookingWithGiftCard && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenBookingWithGiftCard(generatedCard.code);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#c98a92] hover:bg-[#b57a82] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Usar ahora para Reservar Turno</span>
                  </button>
                )}
              </div>

            </div>

          </div>
        ) : (
          /* ================= MODAL BODY / GIFT CARD CONFIGURATOR ================= */
          <div className="p-6 overflow-y-auto space-y-6">
            
            {/* Realistic Card Preview with Live Flip */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-2">
                <span className="text-[10px] uppercase tracking-widest text-[#8a807d] font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#d4af37]" />
                  <span>Certificado Oficial en Tiempo Real</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#8a6b36] hover:text-[#5e4823] bg-amber-50/80 px-3 py-1 rounded-full border border-amber-200/80 shadow-2xs cursor-pointer transition-transform active:scale-95"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Girar ({isFlipped ? 'Dorso' : 'Frente'})</span>
                </button>
              </div>

              {/* 3D Realistic Digital Card Container */}
              <div 
                style={{ perspective: '1200px' }}
                className="w-full max-w-[460px] aspect-[1.65/1]"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <div 
                  style={{
                    transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry + (isFlipped ? 180 : 0)}deg)`,
                    transformStyle: 'preserve-3d',
                    transition: tilt.rx === 0 && tilt.ry === 0 ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                  }}
                  className="relative w-full h-full rounded-3xl shadow-2xl transition-all cursor-pointer select-none"
                >
                  {/* CARD FRONT - HAUTE COUTURE LUXURY CERTIFICATE */}
                  <div 
                    style={{ 
                      backfaceVisibility: 'hidden',
                      background: `radial-gradient(circle at center, ${activeTheme.bgMid} 0%, ${activeTheme.bgStart} 60%, ${activeTheme.bgEnd} 100%)`,
                      color: activeTheme.textColor,
                    }}
                    className="absolute inset-0 w-full h-full rounded-3xl p-4 sm:p-5 overflow-hidden border border-[#d4af37]/50 shadow-2xl flex flex-col justify-between"
                  >
                    {/* Double Gold Foil Frame */}
                    <div className="absolute inset-2.5 border border-[#d4af37]/60 rounded-2xl pointer-events-none" />
                    <div className="absolute inset-3.5 border border-[#d4af37]/30 rounded-xl pointer-events-none" />

                    {/* Corner Ornaments */}
                    <span className="absolute top-4 left-4 text-[10px] text-[#d4af37]/80 leading-none">✦</span>
                    <span className="absolute top-4 right-4 text-[10px] text-[#d4af37]/80 leading-none">✦</span>
                    <span className="absolute bottom-4 left-4 text-[10px] text-[#d4af37]/80 leading-none">✦</span>
                    <span className="absolute bottom-4 right-4 text-[10px] text-[#d4af37]/80 leading-none">✦</span>

                    {/* Header: Crest & Brand */}
                    <div className="text-center z-10 pt-1">
                      <div className="text-[10px] text-[#d4af37] tracking-[0.3em] font-serif font-bold uppercase">
                        ✦ ⚜ ✦
                      </div>
                      <h4 className="font-serif-cormorant text-lg sm:text-2xl font-bold tracking-wider leading-tight">
                        VIC ESTÉTICA INTEGRAL
                      </h4>
                      <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
                        Medicina Estética & Spa · Río Segundo
                      </p>
                    </div>

                    {/* Center Luxury Framed Box */}
                    <div 
                      style={{ 
                        backgroundColor: activeTheme.glassBg,
                        borderColor: activeTheme.glassBorder 
                      }}
                      className="my-auto z-10 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border shadow-inner text-center space-y-1"
                    >
                      <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-semibold opacity-75 block text-[#d4af37]">
                        Especialmente presentado a:
                      </span>
                      <h3 className="font-serif-cormorant text-base sm:text-xl font-bold tracking-tight text-white drop-shadow-sm truncate">
                        {recipient || 'Nombre de la agasajada'}
                      </h3>
                      <p className="text-[9px] sm:text-[10px] italic opacity-85 text-white/90">
                        Con el cariño de: <strong>{sender || 'Tu nombre'}</strong>
                      </p>

                      {/* Benefit Tag */}
                      <div 
                        style={{ backgroundColor: activeTheme.badgeBg }}
                        className="py-1 px-3 rounded-xl border border-[#d4af37]/60 inline-block max-w-full mt-1 shadow-xs"
                      >
                        <span className="text-xs sm:text-sm font-bold font-serif-cormorant text-[#fbf5b7] tracking-wide block truncate">
                          ✦ {cardType === 'amount' 
                            ? formatPrice(isCustomAmount ? Number(customAmount) || 0 : Number(amount) || 0) 
                            : treatment} ✦
                        </span>
                      </div>

                      {/* Message quote */}
                      <p className="text-[9px] italic opacity-80 truncate max-w-[300px] mx-auto text-white/80 pt-0.5">
                        "{message}"
                      </p>
                    </div>

                    {/* Bottom Security & Seal Strip */}
                    <div className="z-10 flex items-center justify-between text-[8px] sm:text-[9px] px-2 pt-0.5 border-t border-white/10">
                      <div className="font-mono bg-black/40 px-2 py-0.5 rounded border border-[#d4af37]/50 text-[#fbf5b7] font-bold">
                        ID: {voucherId}
                      </div>
                      <div className="uppercase tracking-wider text-[#d4af37] font-semibold">
                        Sello Oficial · Válida 90 días
                      </div>
                    </div>
                  </div>

                  {/* CARD BACK */}
                  <div 
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                    className="absolute inset-0 w-full h-full rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#1c1817] via-[#262120] to-[#141110] text-white overflow-hidden border border-[#d4af37]/40 shadow-inner flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-center z-10 border-b border-white/10 pb-2">
                      <div className="text-[10px] uppercase tracking-widest text-[#d4af37] font-bold">
                        Condiciones & Canje
                      </div>
                      <div className="text-[10px] text-white/70 font-mono">
                        ID: {voucherId}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 items-center z-10 my-auto">
                      <div className="col-span-2 space-y-1 text-[11px] text-white/80">
                        <p className="flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                          <span>Válida por 90 días corridos.</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                          <span>Canjeable en Mendoza 985, Río Segundo.</span>
                        </p>
                        <p className="flex items-center gap-1.5 text-[#d4af37] font-semibold">
                          <span>Turnos online o por WhatsApp.</span>
                        </p>
                      </div>

                      <div className="col-span-1 bg-white p-2 rounded-xl flex items-center justify-center">
                        <QrCode className="w-14 h-14 text-[#2c2725]" />
                      </div>
                    </div>

                    <div className="z-10 text-[9px] text-white/60 text-center border-t border-white/10 pt-2">
                      VIC Estética Integral · Medicina Estética · Kinesiología & Spa
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Design Theme Selector */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-[#6b6462] uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#c98a92]" />
                <span>Elegir Estilo & Color de la Tarjeta</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {GIFT_CARD_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setSelectedThemeId(theme.id)}
                    className={`p-2.5 rounded-2xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                      selectedThemeId === theme.id 
                        ? 'border-[#d4af37] bg-amber-50/40 ring-2 ring-[#d4af37]/30 shadow-xs' 
                        : 'border-[#ede8e3] bg-[#fcfaf7] hover:bg-white'
                    }`}
                  >
                    <div 
                      style={{ background: theme.previewBg }}
                      className="w-5 h-5 rounded-full shrink-0 border border-[#d4af37] shadow-2xs" 
                    />
                    <span className="text-[11px] font-semibold text-[#2c2725] truncate">
                      {theme.name.split('&')[0].trim()}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form Options */}
            <div className="space-y-4 text-sm bg-white p-5 rounded-2xl border border-[#ede8e3]">
              
              {/* Type Toggle: Monto vs Tratamiento */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCardType('amount')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    cardType === 'amount' ? 'bg-[#c98a92] text-white border-[#c98a92] shadow-xs' : 'bg-[#fcfaf7] text-[#6b6462] border-[#ede8e3]'
                  }`}
                >
                  Monto a Elección ($)
                </button>
                <button
                  type="button"
                  onClick={() => setCardType('treatment')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    cardType === 'treatment' ? 'bg-[#c98a92] text-white border-[#c98a92] shadow-xs' : 'bg-[#fcfaf7] text-[#6b6462] border-[#ede8e3]'
                  }`}
                >
                  Tratamiento Específico
                </button>
              </div>

              {/* Sender & Recipient Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#6b6462] uppercase mb-1">De parte de (Tu Nombre)</label>
                  <input
                    type="text"
                    placeholder="Ej: Mamá, María, Juan..."
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#fcfaf7] border border-[#ede8e3] rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#c98a92]/40 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6b6462] uppercase mb-1">Para quién es (Agasajada)</label>
                  <input
                    type="text"
                    placeholder="Ej: Sofía Pérez..."
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#fcfaf7] border border-[#ede8e3] rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#c98a92]/40 outline-none"
                  />
                </div>
              </div>

              {/* Optional Phone Contact Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#6b6462] uppercase mb-1">Tu Teléfono / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="Ej: 3572 403949"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#fcfaf7] border border-[#ede8e3] rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#c98a92]/40 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6b6462] uppercase mb-1">Teléfono Agasajada (Opcional)</label>
                  <input
                    type="tel"
                    placeholder="Ej: 3572 123456"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#fcfaf7] border border-[#ede8e3] rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#c98a92]/40 outline-none"
                  />
                </div>
              </div>

              {/* Amount Selection */}
              {cardType === 'amount' ? (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-bold text-[#6b6462] uppercase">Seleccionar Monto ($ ARS)</label>
                    <button
                      type="button"
                      onClick={() => setIsCustomAmount(!isCustomAmount)}
                      className="text-[11px] text-[#c98a92] font-semibold hover:underline cursor-pointer"
                    >
                      {isCustomAmount ? 'Ver montos sugeridos' : 'Ingresar otro monto'}
                    </button>
                  </div>

                  {!isCustomAmount ? (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {['25000', '35000', '50000', '75000', '100000'].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setAmount(val)}
                          className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                            amount === val
                              ? 'bg-[#2c2725] text-white border-[#2c2725] shadow-xs'
                              : 'bg-[#fcfaf7] text-[#4a423f] border-[#ede8e3] hover:border-[#c98a92]'
                          }`}
                        >
                          ${Number(val) / 1000}k
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="number"
                      placeholder="Monto personalizado (ej: 45000)"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#fcfaf7] border border-[#ede8e3] rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#c98a92]/40 outline-none"
                    />
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-bold text-[#6b6462] uppercase mb-1">Tratamiento sugerido</label>
                  <select
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#fcfaf7] border border-[#ede8e3] rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#c98a92]/40 outline-none"
                  >
                    <option value="Limpieza Facial Profunda + Hidratación & Peeling">Limpieza Facial Profunda + Hidratación & Peeling</option>
                    <option value="Armonización Facial & Ácido Hialurónico">Armonización Facial & Ácido Hialurónico</option>
                    <option value="Masaje Descontracturante & Kinesiología (Sesión Relax)">Masaje Descontracturante & Kinesiología (Sesión Relax)</option>
                    <option value="Sesión Completa Depilación Láser Definitiva">Sesión Completa Depilación Láser Definitiva</option>
                    <option value="Tratamiento Reductor Modelador + Drenaje Linfático">Tratamiento Reductor Modelador + Drenaje Linfático</option>
                    <option value="Bellelss Nails Esmaltado Semipermanente Completo">Bellelss Nails Esmaltado Semipermanente Completo</option>
                  </select>
                </div>
              )}

              {/* Dedication Presets & Custom Message */}
              <div>
                <label className="block text-[11px] font-bold text-[#6b6462] uppercase mb-1">Dedicatoria o Mensaje Personalizado</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {MESSAGE_PRESETS.slice(0, 3).map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setMessage(preset)}
                      className="text-[10px] bg-[#fcfaf7] hover:bg-[#fbf0f2] border border-[#ede8e3] hover:border-[#c98a92] text-[#4a423f] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      {idx === 0 ? '✨ Relax' : idx === 1 ? '🎂 Cumpleaños' : '💖 Mimo Especial'}
                    </button>
                  ))}
                </div>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#fcfaf7] border border-[#ede8e3] rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#c98a92]/40 outline-none"
                />
              </div>
            </div>

            {/* Bottom Generation CTA */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleCreateAndRequestGiftCard}
                className="w-full py-4 rounded-2xl bg-[#c98a92] hover:bg-[#b57a82] text-white text-xs sm:text-sm font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Gift className="w-4 h-4" />
                <span>Generar Certificado Oficial & Notificar al Staff</span>
              </button>
              <p className="text-[11px] text-[#8a807d] text-center">
                Al generar el certificado, el staff de VIC confirmará el voucher en recepción para que puedas enviarlo a la agasajada.
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
