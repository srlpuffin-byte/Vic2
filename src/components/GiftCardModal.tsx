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
  Heart,
  Palette,
  ExternalLink,
  MessageCircle,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BUSINESS_DATA, formatPrice } from '../data/aestheticData';
import { SystemStorage } from '../utils/systemStorage';
import { GiftCardItem } from '../types';
import { 
  GIFT_CARD_THEMES, 
  generateGiftCardCanvas, 
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
  const [amount, setAmount] = useState('35000');
  const [customAmount, setCustomAmount] = useState('');
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [treatment, setTreatment] = useState('Limpieza Facial Profunda + Hidratación & Peeling');
  const [message, setMessage] = useState(MESSAGE_PRESETS[0]);
  const [selectedThemeId, setSelectedThemeId] = useState('rose-gold');
  const [voucherId, setVoucherId] = useState(() => `VIC-GC-${Math.floor(1000 + Math.random() * 9000)}`);
  const [isFlipped, setIsFlipped] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  // Confirmation / Generated voucher state
  const [generatedCard, setGeneratedCard] = useState<GiftCardItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

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
      setPreviewImage(null);
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
    const rx = ((y - rect.height / 2) / (rect.height / 2)) * -8;
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 8;
    setTilt({ rx, ry });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c98a92', '#f5ede5', '#d4af37', '#ffffff', '#e8c99e']
      });
    } catch {
      // ignore
    }
  };

  const handleCreateAndSaveGiftCard = async (openWhatsApp = false) => {
    const chosenAmount = isCustomAmount 
      ? (parseFloat(customAmount) || 35000) 
      : (parseFloat(amount) || 35000);
    const numericAmount = cardType === 'amount' ? chosenAmount : 40000;
    const recipientClean = recipient.trim() || 'Alguien Especial';
    const senderClean = sender.trim() || 'Un Ser Querido';

    const newCard: GiftCardItem = {
      code: voucherId,
      cardType: cardType,
      recipientName: recipientClean,
      senderName: senderClean,
      initialBalance: numericAmount,
      remainingBalance: numericAmount,
      treatmentName: cardType === 'treatment' ? treatment : undefined,
      message: message.trim() || '¡Una experiencia única de bienestar y relax en VIC!',
      status: 'active',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      usageHistory: []
    };

    // Save to Local System Storage
    SystemStorage.saveGiftCard(newCard);
    setGeneratedCard(newCard);
    triggerCelebration();

    // Pre-generate image preview
    try {
      const imgData = await generateGiftCardCanvas(newCard, selectedThemeId);
      setPreviewImage(imgData);
    } catch (e) {
      console.error(e);
    }

    if (openWhatsApp) {
      handleSendWhatsAppGift(newCard);
    }
  };

  const handleSendWhatsAppGift = (card: GiftCardItem) => {
    const giftDetail = card.cardType === 'treatment' 
      ? `💆‍♀️ *Tratamiento Obsequiado:* ${card.treatmentName}` 
      : `💰 *Monto de Regalo:* ${formatPrice(card.initialBalance)}`;

    const text = 
      `🎁 *¡HOLA ${card.recipientName.toUpperCase()}! TENÉS UNA GIFT CARD DE REGALO EN VIC ESTÉTICA INTEGRAL* 🌸✨\n\n` +
      `👤 *De parte de:* ${card.senderName}\n` +
      `💌 *Dedicatoria especial:* "${card.message}"\n\n` +
      `🎀 *Detalle de tu regalo:*\n` +
      `${giftDetail}\n\n` +
      `🎫 *Código de Voucher Oficial:* \`${card.code}\`\n` +
      `⏳ *Vigencia:* 90 días corridos\n` +
      `📍 *Lugar:* Mendoza 985, Río Segundo, Córdoba\n\n` +
      `🌟 *¿Cómo canjearlo?*\n` +
      `Presentá este código o agendá tu turno online en nuestro sitio web o enviando un WhatsApp a la clínica. ¡Te esperamos para una experiencia inolvidable! 💖`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyGiftLink = (code: string) => {
    const url = `${window.location.origin}/#giftcard-${code}`;
    navigator.clipboard.writeText(url);
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
    const shareText = `🎁 ¡Hola ${generatedCard.recipientName}! ${generatedCard.senderName} te ha regalado una Gift Card exclusiva de VIC Estética Integral (Código: ${generatedCard.code}) en Mendoza 985, Río Segundo.`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Gift Card VIC — ${generatedCard.recipientName}`,
          text: shareText,
          url: `${window.location.origin}/#giftcard-${generatedCard.code}`
        });
      } catch {
        // user cancelled share
      }
    } else {
      handleSendWhatsAppGift(generatedCard);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#2c2725]/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-[#fcfaf7] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#ede8e3] overflow-hidden flex flex-col my-auto max-h-[94vh]">
        
        {/* Modal Top Navigation Bar */}
        <div className="bg-[#f5f0eb] px-6 py-4 border-b border-[#ede8e3] flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white p-1 border border-[#e4ded8] shadow-xs flex items-center justify-center">
              <Gift className="w-5 h-5 text-[#c98a92]" />
            </div>
            <div>
              <h3 className="font-serif-cormorant text-xl sm:text-2xl font-bold text-[#2c2725] leading-tight flex items-center gap-2">
                <span>{generatedCard ? '¡Tu Gift Card de Regalo está Lista!' : 'Crear Gift Card Personalizada'}</span>
                {generatedCard && <Sparkles className="w-4 h-4 text-[#c98a92]" />}
              </h3>
              <p className="text-xs text-[#6b6462]">
                {generatedCard 
                  ? 'Diseño generado en alta definición. Lista para enviar, descargar o regalar.' 
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
            
            {/* Header Success Badge */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs text-emerald-800 font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tarjeta registrada con éxito en el sistema oficial de VIC Estética.</span>
              </div>
              <span className="text-[11px] font-mono font-bold bg-emerald-600 text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                {generatedCard.code}
              </span>
            </div>

            {/* Generated Card Interactive Showcase */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-2 text-xs">
                <span className="font-bold text-[#6b6462] uppercase tracking-wider text-[10px]">
                  Diseño de Tarjeta Digital Generado
                </span>
                <button
                  type="button"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="flex items-center gap-1.5 font-semibold text-[#c98a92] hover:text-[#b57a82] bg-white px-3 py-1 rounded-full border border-[#ede8e3] shadow-2xs cursor-pointer transition-transform active:scale-95"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Ver {isFlipped ? 'Frente' : 'Dorso & Seguridad'}</span>
                </button>
              </div>

              {/* 3D Realistic Digital Card Container */}
              <div 
                style={{ perspective: '1200px' }}
                className="w-full max-w-[480px] aspect-[1.65/1]"
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
                  {/* CARD FRONT */}
                  <div 
                    style={{ 
                      backfaceVisibility: 'hidden',
                      background: `linear-gradient(135deg, ${activeTheme.gradientStart}, ${activeTheme.gradientMid}, ${activeTheme.gradientEnd})`,
                      color: activeTheme.textColor,
                      borderColor: activeTheme.cardBorder
                    }}
                    className="absolute inset-0 w-full h-full rounded-3xl p-6 overflow-hidden border shadow-inner flex flex-col justify-between"
                  >
                    {/* Metallic Glow Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
                    <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />

                    {/* Top Bar */}
                    <div className="flex justify-between items-start z-10">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Crown className="w-3.5 h-3.5" style={{ color: activeTheme.accentColor }} />
                          <span className="text-[10px] uppercase tracking-[0.25em] font-bold opacity-90">
                            Experiencia Exclusiva
                          </span>
                        </div>
                        <h4 className="font-serif-cormorant text-2xl font-bold tracking-tight">
                          VIC Estética Integral
                        </h4>
                      </div>

                      <div 
                        style={{ backgroundColor: activeTheme.badgeBg, borderColor: activeTheme.foilColor }}
                        className="px-3 py-1.5 rounded-2xl backdrop-blur-md flex items-center justify-center font-serif-cormorant font-bold text-xs border shadow-xs"
                      >
                        GIFT VOUCHER
                      </div>
                    </div>

                    {/* Center Details */}
                    <div className="my-auto z-10 bg-black/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="opacity-80 font-medium">Agasajada / Para:</span>
                        <strong className="font-bold text-sm">{generatedCard.recipientName}</strong>
                      </div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="opacity-80 font-medium">De:</span>
                        <strong className="font-semibold">{generatedCard.senderName}</strong>
                      </div>
                      <div className="pt-2 border-t border-white/20 flex justify-between items-baseline">
                        <span className="text-[10px] uppercase tracking-wider opacity-80">Obsequio:</span>
                        <span className="text-base sm:text-lg font-bold" style={{ color: activeTheme.foilColor }}>
                          {generatedCard.cardType === 'treatment' ? generatedCard.treatmentName : formatPrice(generatedCard.initialBalance)}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Dedication */}
                    <div className="z-10 flex items-center justify-between text-[11px] opacity-90 pt-1 border-t border-white/10">
                      <span className="italic truncate max-w-[280px]">"{generatedCard.message}"</span>
                      <span className="uppercase font-semibold tracking-widest text-[9px] opacity-80">Mendoza 985</span>
                    </div>
                  </div>

                  {/* CARD BACK */}
                  <div 
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                    className="absolute inset-0 w-full h-full rounded-3xl p-6 bg-gradient-to-br from-[#2c2725] via-[#3a3432] to-[#241f1e] text-white overflow-hidden border border-[#ede8e3]/20 shadow-inner flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-center z-10 border-b border-white/10 pb-2">
                      <div className="text-[10px] uppercase tracking-widest text-[#c98a92] font-bold flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Seguridad & Canje Oficial</span>
                      </div>
                      <div className="text-[11px] text-white/90 font-mono font-bold bg-white/10 px-2 py-0.5 rounded border border-white/10">
                        {generatedCard.code}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 items-center z-10 my-auto">
                      <div className="col-span-2 space-y-1 text-[11px] text-white/80">
                        <p className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-[#c98a92] shrink-0" />
                          <span>Válida por 90 días corridos.</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-[#c98a92] shrink-0" />
                          <span>Canjeable en Mendoza 985, Río Segundo.</span>
                        </p>
                        <p className="flex items-center gap-1.5 text-[#c98a92] font-semibold">
                          <Check className="w-3 h-3 text-[#c98a92] shrink-0" />
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

            {/* SEND AS GIFT ACTION BUTTONS */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-bold text-[#6b6462] uppercase tracking-wider block text-center">
                Opciones para enviar y regalar a la agasajada
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. Send via WhatsApp */}
                <button
                  type="button"
                  onClick={() => handleSendWhatsAppGift(generatedCard)}
                  className="py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all active:scale-98"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Enviar por WhatsApp a la Agasajada</span>
                </button>

                {/* 2. Download Image (PNG HD) */}
                <button
                  type="button"
                  onClick={handleDownloadImage}
                  disabled={isDownloading}
                  className="py-3.5 px-4 bg-white border border-[#ede8e3] hover:border-[#c98a92] hover:bg-[#fbf0f2] text-[#2c2725] rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all active:scale-98"
                >
                  <Download className="w-4 h-4 text-[#c98a92]" />
                  <span>{isDownloading ? 'Generando PNG...' : 'Descargar Tarjeta (Imagen HD)'}</span>
                </button>

                {/* 3. Native Share (Mobile) */}
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="py-3 px-4 bg-[#2c2725] hover:bg-black text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
                >
                  <Share2 className="w-4 h-4 text-[#c98a92]" />
                  <span>Compartir en Redes / Mensajes</span>
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

                {onOpenBookingWithGiftCard && (
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
                  <Sparkles className="w-3 h-3 text-[#c98a92]" />
                  <span>Vista previa en tiempo real</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#c98a92] hover:text-[#b57a82] bg-white px-3 py-1 rounded-full border border-[#ede8e3] shadow-2xs cursor-pointer transition-transform active:scale-95"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Girar ({isFlipped ? 'Dorso' : 'Frente'})</span>
                </button>
              </div>

              {/* 3D Realistic Digital Card Container */}
              <div 
                style={{ perspective: '1200px' }}
                className="w-full max-w-[440px] aspect-[1.65/1]"
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
                  {/* CARD FRONT */}
                  <div 
                    style={{ 
                      backfaceVisibility: 'hidden',
                      background: `linear-gradient(135deg, ${activeTheme.gradientStart}, ${activeTheme.gradientMid}, ${activeTheme.gradientEnd})`,
                      color: activeTheme.textColor,
                      borderColor: activeTheme.cardBorder
                    }}
                    className="absolute inset-0 w-full h-full rounded-3xl p-5 sm:p-6 overflow-hidden border shadow-inner flex flex-col justify-between"
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />
                    <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />

                    {/* Top Bar */}
                    <div className="flex justify-between items-start z-10">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Crown className="w-3.5 h-3.5" style={{ color: activeTheme.accentColor }} />
                          <span className="text-[9px] uppercase tracking-[0.25em] font-bold opacity-90">
                            Experiencia Exclusiva
                          </span>
                        </div>
                        <h4 className="font-serif-cormorant text-xl sm:text-2xl font-bold tracking-tight">
                          VIC Estética Integral
                        </h4>
                      </div>

                      <div 
                        style={{ backgroundColor: activeTheme.badgeBg, borderColor: activeTheme.foilColor }}
                        className="px-2.5 py-1 rounded-xl backdrop-blur-md flex items-center justify-center font-serif-cormorant font-bold text-[11px] border shadow-xs"
                      >
                        GIFT VOUCHER
                      </div>
                    </div>

                    {/* Center Details */}
                    <div className="my-auto z-10 bg-black/15 backdrop-blur-sm rounded-2xl p-3 sm:p-3.5 border border-white/20">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="opacity-80">Para:</span>
                        <strong className="font-semibold">{recipient || 'Nombre de la agasajada'}</strong>
                      </div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="opacity-80">De:</span>
                        <strong className="font-semibold">{sender || 'Tu nombre'}</strong>
                      </div>
                      <div className="pt-2 border-t border-white/20 flex justify-between items-baseline">
                        <span className="text-[10px] uppercase tracking-wider opacity-80">Obsequio:</span>
                        <span className="text-sm sm:text-base font-bold" style={{ color: activeTheme.foilColor }}>
                          {cardType === 'amount' 
                            ? formatPrice(isCustomAmount ? Number(customAmount) || 0 : Number(amount) || 0) 
                            : treatment}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Dedication */}
                    <div className="z-10 flex items-center justify-between text-[10px] opacity-80 pt-1">
                      <span className="italic truncate max-w-[240px]">"{message}"</span>
                      <span className="uppercase font-semibold tracking-widest text-[9px]">Río Segundo</span>
                    </div>
                  </div>

                  {/* CARD BACK */}
                  <div 
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                    className="absolute inset-0 w-full h-full rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#2c2725] via-[#3a3432] to-[#241f1e] text-white overflow-hidden border border-[#ede8e3]/20 shadow-inner flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-center z-10 border-b border-white/10 pb-2">
                      <div className="text-[10px] uppercase tracking-widest text-[#c98a92] font-bold">
                        Condiciones & Canje
                      </div>
                      <div className="text-[10px] text-white/70 font-mono">
                        ID: {voucherId}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 items-center z-10 my-auto">
                      <div className="col-span-2 space-y-1 text-[11px] text-white/80">
                        <p className="flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#c98a92] shrink-0" />
                          <span>Válida por 90 días corridos.</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#c98a92] shrink-0" />
                          <span>Canjeable en Mendoza 985, Río Segundo.</span>
                        </p>
                        <p className="flex items-center gap-1.5 text-[#c98a92] font-semibold">
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
                        ? 'border-[#c98a92] bg-white ring-2 ring-[#c98a92]/20 shadow-xs' 
                        : 'border-[#ede8e3] bg-[#fcfaf7] hover:bg-white'
                    }`}
                  >
                    <div 
                      style={{ background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})` }}
                      className="w-5 h-5 rounded-full shrink-0 border border-white/50 shadow-2xs" 
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
                onClick={() => handleCreateAndSaveGiftCard(false)}
                className="w-full py-4 rounded-2xl bg-[#c98a92] hover:bg-[#b57a82] text-white text-xs sm:text-sm font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Gift className="w-4 h-4" />
                <span>Generar Tarjeta de Regalo Oficial</span>
              </button>

              <button
                type="button"
                onClick={() => handleCreateAndSaveGiftCard(true)}
                className="w-full py-2.5 rounded-2xl bg-white border border-[#ede8e3] hover:border-[#25D366] text-[#2c2725] text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Generar y Enviar Directo por WhatsApp</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
