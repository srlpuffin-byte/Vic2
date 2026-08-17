import React, { useState, useEffect } from 'react';
import { 
  Gift, 
  X, 
  Sparkles, 
  Heart, 
  Check, 
  ArrowRight,
  RotateCw,
  QrCode,
  ShieldCheck,
  Crown,
  Share2,
  Copy,
  Calendar
} from 'lucide-react';
import { BUSINESS_DATA, formatPrice } from '../data/aestheticData';
import { SystemStorage } from '../utils/systemStorage';
import { GiftCardItem } from '../types';

interface GiftCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBookingWithGiftCard?: (code: string) => void;
}

export const GiftCardModal: React.FC<GiftCardModalProps> = ({ 
  isOpen, 
  onClose,
  onOpenBookingWithGiftCard 
}) => {
  const [cardType, setCardType] = useState<'amount' | 'treatment'>('amount');
  const [recipient, setRecipient] = useState('');
  const [sender, setSender] = useState('');
  const [amount, setAmount] = useState('35000');
  const [treatment, setTreatment] = useState('Limpieza Facial Profunda + Hidratación & Peeling');
  const [message, setMessage] = useState('¡Para que disfrutes de un momento único de relax y cuidado en VIC!');
  const [voucherId] = useState(() => `VIC-GC-${Math.floor(1000 + Math.random() * 9000)}`);
  const [isFlipped, setIsFlipped] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  // Confirmation / Generated voucher state
  const [generatedCard, setGeneratedCard] = useState<GiftCardItem | null>(null);
  const [copied, setCopied] = useState(false);

  // Handle ESC key and lock body scroll
  useEffect(() => {
    if (!isOpen) {
      setGeneratedCard(null);
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

  if (!isOpen) return null;

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

  const handleCreateAndSaveGiftCard = (sendWhatsapp = false) => {
    const numericAmount = cardType === 'amount' ? (parseFloat(amount) || 35000) : 40000;
    const recipientClean = recipient.trim() || 'Alguien Especial';
    const senderClean = sender.trim() || 'VIC Estética';

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

    // Save to System Database
    SystemStorage.saveGiftCard(newCard);
    setGeneratedCard(newCard);

    if (sendWhatsapp) {
      const text = 
        `🎁 *SOLICITUD DE GIFT CARD — VIC ESTÉTICA INTEGRAL*\n\n` +
        `🎫 *Código / ID:* ${newCard.code}\n` +
        `👤 *De:* ${senderClean}\n` +
        `💝 *Para:* ${recipientClean}\n` +
        `🎀 *Tipo de regalo:* ${cardType === 'amount' ? `Monto de ${formatPrice(numericAmount)}` : `Tratamiento: ${treatment}`}\n` +
        `💌 *Dedicatoria:* "${message}"\n\n` +
        `¡Hola! Ya generé el voucher ${newCard.code} en la web. ¿Me indican los datos para confirmar la transferencia? ¡Gracias!`;

      window.open(`https://wa.me/${BUSINESS_DATA.phone}?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#2c2725]/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#fcfaf7] w-full max-w-xl rounded-3xl shadow-2xl border border-[#ede8e3] overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header */}
        <div className="bg-[#f5f0eb] px-6 py-4 border-b border-[#ede8e3] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img 
              src="/logo.svg" 
              alt="VIC Logo" 
              className="w-9 h-9 rounded-full bg-white p-0.5 border border-[#e4ded8] object-contain shadow-xs" 
            />
            <div>
              <h3 className="font-serif-cormorant text-xl font-bold text-[#2c2725] leading-tight">
                {generatedCard ? '¡Gift Card Emitida y Registrada!' : 'Gift Card Digital Personalizada'}
              </h3>
              <p className="text-[11px] text-[#6b6462]">Regalá una experiencia exclusiva de bienestar en Río Segundo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white text-[#6b6462] hover:text-[#2c2725] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= IF GENERATED -> SHOW CERTIFICATE PASS ================= */}
        {generatedCard ? (
          <div className="p-6 overflow-y-auto space-y-5 text-center">
            
            <div className="w-14 h-14 rounded-full bg-[#fdf0f2] text-[#c98a92] flex items-center justify-center mx-auto shadow-xs border border-[#f0d4d8]">
              <Sparkles className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#c98a92] block">
                Tarjeta de Regalo Activa
              </span>
              <h4 className="font-serif-cormorant text-2xl font-bold text-[#2c2725] mt-0.5">
                ¡Voucher {generatedCard.code} Listo!
              </h4>
              <p className="text-xs text-[#6b6462] mt-1">
                La tarjeta ha sido registrada en el sistema de VIC y puede ser canjeada tanto online como en la clínica.
              </p>
            </div>

            {/* Voucher preview box */}
            <div className="bg-gradient-to-br from-[#d49aa2] via-[#c98a92] to-[#9e626a] text-white p-6 rounded-3xl shadow-xl text-left relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-white/80 font-bold block">
                    VIC Estética Integral · Mendoza 985
                  </span>
                  <h5 className="font-serif-cormorant text-2xl font-bold tracking-wide">
                    Gift Voucher Exclusivo
                  </h5>
                </div>
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-serif-cormorant font-bold border border-white/30 text-sm">
                  VIC
                </div>
              </div>

              <div className="my-4 bg-black/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/20 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-white/80">Agasajada / Para:</span>
                  <span className="font-bold">{generatedCard.recipientName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/80">De:</span>
                  <span>{generatedCard.senderName}</span>
                </div>
                <div className="pt-2 border-t border-white/20 flex justify-between items-baseline">
                  <span className="text-[10px] uppercase text-white/80">Beneficio:</span>
                  <span className="text-base font-bold">
                    {generatedCard.cardType === 'treatment' ? generatedCard.treatmentName : formatPrice(generatedCard.initialBalance)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-white/80 border-t border-white/20 pt-2">
                <span className="font-mono font-bold bg-white/20 px-2 py-0.5 rounded text-white">
                  {generatedCard.code}
                </span>
                <span>Vigencia: 90 días</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyCode(generatedCard.code)}
                  className="w-full py-3 bg-white border border-[#ede8e3] hover:border-[#c98a92] text-[#2c2725] rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#c98a92]" />}
                  <span>{copied ? '¡Código Copiado!' : 'Copiar Código de Canje'}</span>
                </button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `🎁 ¡Hola ${generatedCard.recipientName}! Tenés una Gift Card de VIC Estética Integral en Río Segundo.\n\n` +
                    `✨ De: ${generatedCard.senderName}\n` +
                    `💌 Mensaje: "${generatedCard.message}"\n` +
                    `🎫 Código de Voucher: ${generatedCard.code}\n` +
                    `💰 Monto / Tratamiento: ${generatedCard.cardType === 'treatment' ? generatedCard.treatmentName : formatPrice(generatedCard.initialBalance)}\n\n` +
                    `Podés reservarlo presentando este código en https://ais-dev-4zrxpq4xuauyp74zf445gc-545275207956.us-west2.run.app o en Mendoza 985, Río Segundo.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Enviar a la Agasajada</span>
                </a>
              </div>

              {onOpenBookingWithGiftCard && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenBookingWithGiftCard(generatedCard.code);
                  }}
                  className="w-full py-3 bg-[#2c2725] hover:bg-[#403835] text-white rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Calendar className="w-4 h-4 text-[#c98a92]" />
                  <span>Usar ahora para Reservar un Turno</span>
                </button>
              )}
            </div>

          </div>
        ) : (
          /* ================= MODAL BODY / CONFIGURATOR ================= */
          <div className="p-6 overflow-y-auto space-y-6">
            
            {/* Realistic Card Stage with Flip */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-2">
                <span className="text-[10px] uppercase tracking-widest text-[#8a807d] font-bold">
                  Vista previa en tiempo real
                </span>
                <button
                  type="button"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#c98a92] hover:text-[#b57a82] bg-white px-3 py-1 rounded-full border border-[#ede8e3] shadow-xs cursor-pointer transition-transform active:scale-95"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Girar tarjeta ({isFlipped ? 'Dorso' : 'Frente'})</span>
                </button>
              </div>

              <div 
                style={{ perspective: '1200px' }}
                className="w-full max-w-[420px] aspect-[1.65/1]"
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
                    style={{ backfaceVisibility: 'hidden' }}
                    className="absolute inset-0 w-full h-full rounded-3xl p-6 bg-gradient-to-br from-[#d49aa2] via-[#c98a92] to-[#9e626a] text-white overflow-hidden border border-white/40 shadow-inner flex flex-col justify-between"
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />
                    <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />

                    {/* Top Bar */}
                    <div className="flex justify-between items-start z-10">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Crown className="w-3.5 h-3.5 text-[#ffe8d6]" />
                          <span className="text-[10px] uppercase tracking-[0.25em] text-white/90 font-bold">
                            Experiencia Exclusiva
                          </span>
                        </div>
                        <h4 className="font-serif-cormorant text-2xl font-bold tracking-tight">
                          VIC Estética Integral
                        </h4>
                      </div>

                      <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-serif-cormorant font-bold text-lg border border-white/30">
                        VIC
                      </div>
                    </div>

                    {/* Center Details */}
                    <div className="my-auto z-10 bg-black/10 backdrop-blur-sm rounded-2xl p-3.5 border border-white/20">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/80">Para:</span>
                        <strong className="text-white font-semibold">{recipient || 'Nombre de la agasajada'}</strong>
                      </div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-white/80">De:</span>
                        <strong className="text-white font-semibold">{sender || 'Tu nombre'}</strong>
                      </div>
                      <div className="pt-2 border-t border-white/20 flex justify-between items-baseline">
                        <span className="text-[10px] uppercase tracking-wider text-white/80">Obsequio:</span>
                        <span className="text-sm font-bold text-white">
                          {cardType === 'amount' ? formatPrice(Number(amount) || 0) : treatment}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Dedication */}
                    <div className="z-10 flex items-center justify-between text-[10px] text-white/80 pt-1">
                      <span className="italic truncate max-w-[260px]">"{message}"</span>
                      <span className="uppercase font-semibold tracking-widest text-[9px]">Río Segundo</span>
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
                      <div className="text-[10px] uppercase tracking-widest text-[#c98a92] font-bold">
                        Condiciones & Canje
                      </div>
                      <div className="text-[10px] text-white/70 font-mono">
                        ID: {voucherId}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 items-center z-10 my-auto">
                      <div className="col-span-2 space-y-1.5 text-[11px] text-white/80">
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

            {/* Form Options */}
            <div className="space-y-4 text-sm bg-white p-5 rounded-2xl border border-[#ede8e3]">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCardType('amount')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    cardType === 'amount' ? 'bg-[#c98a92] text-white border-[#c98a92]' : 'bg-[#fcfaf7] text-[#6b6462] border-[#ede8e3]'
                  }`}
                >
                  Monto a elección ($)
                </button>
                <button
                  type="button"
                  onClick={() => setCardType('treatment')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    cardType === 'treatment' ? 'bg-[#c98a92] text-white border-[#c98a92]' : 'bg-[#fcfaf7] text-[#6b6462] border-[#ede8e3]'
                  }`}
                >
                  Tratamiento Específico
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#6b6462] uppercase mb-1">De parte de</label>
                  <input
                    type="text"
                    placeholder="Tu nombre y apellido"
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#fcfaf7] border border-[#ede8e3] rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#c98a92]/40 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6b6462] uppercase mb-1">Para quién es</label>
                  <input
                    type="text"
                    placeholder="Nombre de la agasajada"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#fcfaf7] border border-[#ede8e3] rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#c98a92]/40 outline-none"
                  />
                </div>
              </div>

              {cardType === 'amount' ? (
                <div>
                  <label className="block text-[11px] font-bold text-[#6b6462] uppercase mb-1">Seleccionar Monto ($ ARS)</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {['25000', '35000', '50000', '75000', '100000'].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAmount(val)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          amount === val
                            ? 'bg-[#2c2725] text-white border-[#2c2725]'
                            : 'bg-[#fcfaf7] text-[#4a423f] border-[#ede8e3] hover:border-[#c98a92]'
                        }`}
                      >
                        ${Number(val) / 1000}k
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-bold text-[#6b6462] uppercase mb-1">Tratamiento sugerido</label>
                  <select
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#fcfaf7] border border-[#ede8e3] rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#c98a92]/40 outline-none"
                  >
                    <option value="Limpieza Facial Profunda + Hidratación & Peeling">Limpieza Facial Profunda + Hidratación</option>
                    <option value="Armonización Facial & Ácido Hialurónico">Armonización Facial & Ácido Hialurónico</option>
                    <option value="Masaje Descontracturante & Kinesiología (Sesión Relax)">Masaje Descontracturante (Sesión Relax)</option>
                    <option value="Sesión Completa Depilación Láser Definitiva">Sesión Completa Depilación Láser</option>
                    <option value="Tratamiento Reductor Modelador + Drenaje">Tratamiento Reductor Modelador</option>
                    <option value="Bellelss Nails Esmaltado Semipermanente Completo">Bellelss Nails Semipermanente</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-[#6b6462] uppercase mb-1">Mensaje o Dedicatoria</label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#fcfaf7] border border-[#ede8e3] rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#c98a92]/40 outline-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleCreateAndSaveGiftCard(false)}
                className="w-full py-3.5 rounded-full bg-[#c98a92] hover:bg-[#b57a82] text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generar & Guardar Gift Card en el Sistema</span>
              </button>

              <button
                type="button"
                onClick={() => handleCreateAndSaveGiftCard(true)}
                className="w-full py-2.5 rounded-full bg-white border border-[#ede8e3] hover:border-[#c98a92] text-[#2c2725] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Generar y Coordinar Pago por WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#c98a92]" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
