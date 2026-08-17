import { GiftCardItem } from '../types';
import { formatPrice, BUSINESS_DATA } from '../data/aestheticData';

export interface GiftCardTheme {
  id: string;
  name: string;
  bgStart: string;
  bgMid: string;
  bgEnd: string;
  accentGold: string;
  goldGradient: [string, string, string, string, string];
  textColor: string;
  subTextColor: string;
  cardBorder: string;
  glassBg: string;
  glassBorder: string;
  badgeBg: string;
  previewBg: string;
}

export const GIFT_CARD_THEMES: GiftCardTheme[] = [
  {
    id: 'noir-gold',
    name: 'Noir Royal & Oro 24K',
    bgStart: '#1a1615',
    bgMid: '#241f1e',
    bgEnd: '#141110',
    accentGold: '#d4af37',
    goldGradient: ['#bf953f', '#fcf6ba', '#b38728', '#fbf5b7', '#aa771c'],
    textColor: '#ffffff',
    subTextColor: '#d8cfca',
    cardBorder: '#d4af37',
    glassBg: 'rgba(255, 255, 255, 0.05)',
    glassBorder: 'rgba(212, 175, 55, 0.4)',
    badgeBg: '#2c221e',
    previewBg: 'linear-gradient(135deg, #241f1e, #141110)'
  },
  {
    id: 'rose-gold',
    name: 'Rosa Nude & Oro Rosa',
    bgStart: '#9c5b64',
    bgMid: '#b8757f',
    bgEnd: '#7a3e47',
    accentGold: '#ffe3e8',
    goldGradient: ['#e4a8b0', '#fff0f3', '#c98a92', '#ffedf1', '#a05c66'],
    textColor: '#ffffff',
    subTextColor: '#fcebed',
    cardBorder: '#ffdae0',
    glassBg: 'rgba(255, 255, 255, 0.12)',
    glassBorder: 'rgba(255, 255, 255, 0.35)',
    badgeBg: '#6b323a',
    previewBg: 'linear-gradient(135deg, #b8757f, #7a3e47)'
  },
  {
    id: 'champagne-alabaster',
    name: 'Champagne & Alabastro',
    bgStart: '#f9f6f0',
    bgMid: '#ede6dc',
    bgEnd: '#dfd5c7',
    accentGold: '#9e7b45',
    goldGradient: ['#b88e4c', '#e9d6ab', '#997334', '#dfc79b', '#7c5a24'],
    textColor: '#2c2725',
    subTextColor: '#5e5652',
    cardBorder: '#c9a86a',
    glassBg: 'rgba(255, 255, 255, 0.75)',
    glassBorder: 'rgba(184, 142, 76, 0.45)',
    badgeBg: '#3a322d',
    previewBg: 'linear-gradient(135deg, #ede6dc, #dfd5c7)'
  },
  {
    id: 'emerald-velvet',
    name: 'Esmeralda & Oro Botánico',
    bgStart: '#142f27',
    bgMid: '#1e4439',
    bgEnd: '#0d1e19',
    accentGold: '#ecd599',
    goldGradient: ['#c5a059', '#fdf3d7', '#9b7936', '#ebd69c', '#7d5f22'],
    textColor: '#ffffff',
    subTextColor: '#d4e5df',
    cardBorder: '#e0c88b',
    glassBg: 'rgba(255, 255, 255, 0.06)',
    glassBorder: 'rgba(224, 200, 139, 0.4)',
    badgeBg: '#132822',
    previewBg: 'linear-gradient(135deg, #1e4439, #0d1e19)'
  }
];

/**
 * Creates a high-definition, editorial luxury certificate for VIC Estética Integral (1400 x 850 px).
 */
export async function generateGiftCardCanvas(
  card: GiftCardItem,
  themeId: string = 'noir-gold'
): Promise<string> {
  // Ensure custom luxury web fonts are completely loaded before rendering canvas
  if (typeof document !== 'undefined' && document.fonts) {
    try {
      await document.fonts.ready;
    } catch {
      // ignore font loading fallback
    }
  }

  return new Promise((resolve) => {
    const theme = GIFT_CARD_THEMES.find(t => t.id === themeId) || GIFT_CARD_THEMES[0];
    const canvas = document.createElement('canvas');
    const width = 1400;
    const height = 850;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      resolve('');
      return;
    }

    // Helper: Create Gold Gradient
    const createGoldGrad = (x1: number, y1: number, x2: number, y2: number) => {
      const g = ctx.createLinearGradient(x1, y1, x2, y2);
      g.addColorStop(0.0, theme.goldGradient[0]);
      g.addColorStop(0.25, theme.goldGradient[1]);
      g.addColorStop(0.5, theme.goldGradient[2]);
      g.addColorStop(0.75, theme.goldGradient[3]);
      g.addColorStop(1.0, theme.goldGradient[4]);
      return g;
    };

    // Helper: Rounded Rect Path
    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    // 1. Base Canvas Background with smooth radial & linear luxury gradient
    const bg = ctx.createRadialGradient(width / 2, height / 2, 80, width / 2, height / 2, 800);
    bg.addColorStop(0, theme.bgMid);
    bg.addColorStop(0.65, theme.bgStart);
    bg.addColorStop(1, theme.bgEnd);

    ctx.fillStyle = bg;
    roundRect(0, 0, width, height, 48);
    ctx.fill();

    // 2. High-fashion subtle luxury watermark rings
    ctx.save();
    ctx.globalAlpha = 0.04;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(width - 200, 200, 320, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(width - 200, 200, 240, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(150, height - 150, 280, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // 3. Double Metallic Gold Foil Frame
    ctx.save();
    const framePad1 = 36;
    const framePad2 = 46;

    // Outer Thin Gold Line
    ctx.strokeStyle = createGoldGrad(0, 0, width, height);
    ctx.lineWidth = 2.5;
    roundRect(framePad1, framePad1, width - framePad1 * 2, height - framePad1 * 2, 32);
    ctx.stroke();

    // Inner Ultra-fine Line
    ctx.strokeStyle = createGoldGrad(width, 0, 0, height);
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.75;
    roundRect(framePad2, framePad2, width - framePad2 * 2, height - framePad2 * 2, 26);
    ctx.stroke();
    ctx.restore();

    // 4. Ornate Corner Brackets (Luxury Haute-Joaillerie / Spa Aesthetic)
    ctx.save();
    const cornerSize = 40;
    const drawCorner = (x: number, y: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.strokeStyle = createGoldGrad(-20, -20, 20, 20);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, cornerSize);
      ctx.lineTo(0, 0);
      ctx.lineTo(cornerSize, 0);
      ctx.stroke();

      // Corner Diamond/Star
      ctx.fillStyle = theme.goldGradient[1];
      ctx.beginPath();
      ctx.arc(8, 8, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    drawCorner(framePad2 + 10, framePad2 + 10, 0);
    drawCorner(width - framePad2 - 10, framePad2 + 10, Math.PI / 2);
    drawCorner(width - framePad2 - 10, height - framePad2 - 10, Math.PI);
    drawCorner(framePad2 + 10, height - framePad2 - 10, -Math.PI / 2);
    ctx.restore();

    // 5. Header: Crest, Brand & Certificate Label
    ctx.save();
    ctx.textAlign = 'center';

    // Little Gold Crown / Star Emblem
    ctx.fillStyle = createGoldGrad(width / 2 - 50, 75, width / 2 + 50, 110);
    ctx.font = '20px serif';
    ctx.fillText('✦ ⚜ ✦', width / 2, 92);

    // Brand Name: VIC ESTÉTICA INTEGRAL
    ctx.fillStyle = theme.textColor;
    ctx.font = 'bold 42px "Cormorant Garamond", Georgia, serif';
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 10;
    ctx.fillText('VIC ESTÉTICA INTEGRAL', width / 2, 142);
    ctx.shadowBlur = 0;

    // Sub-title
    ctx.fillStyle = createGoldGrad(width / 2 - 200, 160, width / 2 + 200, 160);
    ctx.font = 'bold 13px sans-serif';
    ctx.letterSpacing = '7px';
    ctx.fillText('MEDICINA ESTÉTICA · DERMATOLOGÍA & SPA · RÍO SEGUNDO', width / 2, 172);
    ctx.restore();

    // 6. Central Luxury Invitation Parchment Box
    ctx.save();
    const boxX = 90;
    const boxY = 205;
    const boxW = width - 180;
    const boxH = 460;
    const boxR = 24;

    // Glass Background
    ctx.fillStyle = theme.glassBg;
    roundRect(boxX, boxY, boxW, boxH, boxR);
    ctx.fill();

    // Delicate Box Border
    ctx.strokeStyle = theme.glassBorder;
    ctx.lineWidth = 1.5;
    roundRect(boxX, boxY, boxW, boxH, boxR);
    ctx.stroke();

    // Header inside Box: "GIFT VOUCHER DE EXPERIENCIA EXCLUSIVA"
    ctx.textAlign = 'center';
    ctx.fillStyle = createGoldGrad(boxX + 100, boxY + 40, boxX + boxW - 100, boxY + 40);
    ctx.font = 'bold 12px sans-serif';
    ctx.letterSpacing = '6px';
    ctx.fillText('CERTIFICADO OFICIAL DE OBSEQUIO & CUIDADO', width / 2, boxY + 45);

    // Decorative divider line with diamond
    const divY = boxY + 62;
    ctx.strokeStyle = theme.glassBorder;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 140, divY);
    ctx.lineTo(width / 2 - 15, divY);
    ctx.moveTo(width / 2 + 15, divY);
    ctx.lineTo(width / 2 + 140, divY);
    ctx.stroke();

    ctx.fillStyle = theme.goldGradient[1];
    ctx.font = '10px serif';
    ctx.fillText('◆', width / 2, divY + 3.5);

    // "Para / Con especial dedicatoria a:"
    ctx.fillStyle = theme.subTextColor;
    ctx.font = '13px sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('ESPECIALMENTE PRESENTADO A:', width / 2, boxY + 100);

    // Recipient Name (Star of the Certificate)
    ctx.fillStyle = theme.textColor;
    ctx.font = 'bold 44px "Cormorant Garamond", Georgia, serif';
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 8;
    ctx.fillText(card.recipientName || 'Alguien Muy Especial', width / 2, boxY + 150);
    ctx.shadowBlur = 0;

    // Sender line
    ctx.fillStyle = theme.subTextColor;
    ctx.font = 'italic 16px "Cormorant Garamond", Georgia, serif';
    ctx.fillText(`Con el cariño de: ${card.senderName || 'Un Ser Querido'}`, width / 2, boxY + 185);

    // Benefit / Gift Amount / Treatment Banner Box
    const badgeW = boxW - 160;
    const badgeH = 90;
    const badgeX = boxX + 80;
    const badgeY = boxY + 215;

    ctx.fillStyle = theme.badgeBg;
    roundRect(badgeX, badgeY, badgeW, badgeH, 16);
    ctx.fill();

    ctx.strokeStyle = createGoldGrad(badgeX, badgeY, badgeX + badgeW, badgeY + badgeH);
    ctx.lineWidth = 1.5;
    roundRect(badgeX, badgeY, badgeW, badgeH, 16);
    ctx.stroke();

    // Benefit Label
    ctx.fillStyle = theme.goldGradient[1];
    ctx.font = 'bold 11px sans-serif';
    ctx.letterSpacing = '4px';
    const benefitLabel = card.cardType === 'treatment' ? 'TRATAMIENTO CLÍNICO OBSEQUIADO' : 'VALOR & CRÉDITO DE EXPERIENCIA';
    ctx.fillText(benefitLabel, width / 2, badgeY + 30);

    // Benefit Text
    const giftBenefitText = card.cardType === 'treatment' 
      ? (card.treatmentName || 'Tratamiento Facial o Corporal') 
      : formatPrice(card.initialBalance);

    ctx.fillStyle = theme.textColor;
    ctx.font = 'bold 32px "Cormorant Garamond", Georgia, serif';
    ctx.fillText(giftBenefitText, width / 2, badgeY + 68);

    // Personal Message / Dedication quote
    const rawMsg = card.message || '¡Para que disfrutes de un momento único de relax y cuidado en VIC!';
    const cleanMsg = `"${rawMsg.length > 85 ? rawMsg.substring(0, 82) + '...' : rawMsg}"`;
    ctx.fillStyle = theme.subTextColor;
    ctx.font = 'italic 18px "Cormorant Garamond", Georgia, serif';
    ctx.fillText(cleanMsg, width / 2, boxY + 345);

    // Seal of Authenticity (Official Gold Circular Stamp on Bottom Right of Box)
    const sealX = boxX + boxW - 90;
    const sealY = boxY + boxH - 75;
    const sealR = 48;

    // Seal outer ring
    ctx.save();
    ctx.strokeStyle = createGoldGrad(sealX - sealR, sealY - sealR, sealX + sealR, sealY + sealR);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sealX, sealY, sealR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 1;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.arc(sealX, sealY, sealR - 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = theme.goldGradient[1];
    ctx.font = 'bold 14px "Cormorant Garamond", serif';
    ctx.textAlign = 'center';
    ctx.fillText('VIC VIP', sealX, sealY - 4);
    ctx.font = 'bold 8px sans-serif';
    ctx.letterSpacing = '1.5px';
    ctx.fillText('ORIGINAL', sealX, sealY + 10);
    ctx.fillText('CERTIFIED', sealX, sealY + 20);
    ctx.restore();

    // Security Ribbon Code (Bottom Left of Box)
    ctx.save();
    const codeBoxX = boxX + 40;
    const codeBoxY = boxY + boxH - 60;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    roundRect(codeBoxX, codeBoxY, 260, 38, 10);
    ctx.fill();
    ctx.strokeStyle = createGoldGrad(codeBoxX, codeBoxY, codeBoxX + 260, codeBoxY + 38);
    ctx.lineWidth = 1;
    roundRect(codeBoxX, codeBoxY, 260, 38, 10);
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = theme.goldGradient[1];
    ctx.font = 'bold 10px sans-serif';
    ctx.letterSpacing = '1.5px';
    ctx.fillText('CÓDIGO:', codeBoxX + 16, codeBoxY + 24);

    ctx.fillStyle = theme.textColor;
    ctx.font = 'bold 15px monospace';
    ctx.letterSpacing = '2px';
    ctx.fillText(card.code, codeBoxX + 80, codeBoxY + 24);
    ctx.restore();

    ctx.restore(); // end center box

    // 7. Footer: Terms, Location & Contact Details
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = theme.subTextColor;
    ctx.font = '12px sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText('Vigencia: 90 días corridos · Canjeable presentando este certificado o al agendar online', width / 2, height - 105);

    ctx.fillStyle = createGoldGrad(width / 2 - 200, height - 80, width / 2 + 200, height - 80);
    ctx.font = 'bold 13px sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('MENDOZA 985, RÍO SEGUNDO, CÓRDOBA · WHATSAPP +54 9 3572 40-3949', width / 2, height - 80);
    ctx.restore();

    // Return high-quality PNG
    resolve(canvas.toDataURL('image/png', 1.0));
  });
}

/**
 * Generates a File object representing the Gift Card PNG for Web Share API (native image sharing on WhatsApp/Instagram).
 */
export async function generateGiftCardFile(
  card: GiftCardItem,
  themeId: string = 'noir-gold'
): Promise<File | null> {
  const dataUrl = await generateGiftCardCanvas(card, themeId);
  if (!dataUrl) return null;
  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const fileName = `GiftCard_VIC_${card.code}.png`;
    return new File([blob], fileName, { type: 'image/png' });
  } catch (err) {
    console.error('Error creating file from gift card canvas:', err);
    return null;
  }
}

/**
 * Triggers a download of the generated gift card image.
 */
export async function downloadGiftCardImage(card: GiftCardItem, themeId: string = 'noir-gold') {
  const dataUrl = await generateGiftCardCanvas(card, themeId);
  if (!dataUrl) return;
  const link = document.createElement('a');
  link.download = `VIC_GiftCard_${card.recipientName.replace(/\s+/g, '_')}_${card.code}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
