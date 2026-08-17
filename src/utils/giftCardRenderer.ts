import { GiftCardItem } from '../types';
import { formatPrice, BUSINESS_DATA } from '../data/aestheticData';

export interface GiftCardTheme {
  id: string;
  name: string;
  gradientStart: string;
  gradientMid: string;
  gradientEnd: string;
  accentColor: string;
  textColor: string;
  secondaryTextColor: string;
  cardBorder: string;
  badgeBg: string;
  foilColor: string;
}

export const GIFT_CARD_THEMES: GiftCardTheme[] = [
  {
    id: 'rose-gold',
    name: 'Rosa Nude & Oro Rosa',
    gradientStart: '#dca4ad',
    gradientMid: '#c98a92',
    gradientEnd: '#9e626a',
    accentColor: '#ffe5e8',
    textColor: '#ffffff',
    secondaryTextColor: '#fdf0f2',
    cardBorder: '#fcebed',
    badgeBg: '#7c434b',
    foilColor: '#f7d3d8'
  },
  {
    id: 'noir-gold',
    name: 'Noir Espresso & Oro VIP',
    gradientStart: '#2c2725',
    gradientMid: '#383230',
    gradientEnd: '#1e1a19',
    accentColor: '#e8c99e',
    textColor: '#ffffff',
    secondaryTextColor: '#e5ded9',
    cardBorder: '#d4af37',
    badgeBg: '#c98a92',
    foilColor: '#ffd700'
  },
  {
    id: 'pearl-marble',
    name: 'Perla & Champagne',
    gradientStart: '#f7f2ed',
    gradientMid: '#ece4db',
    gradientEnd: '#ded3c6',
    accentColor: '#c98a92',
    textColor: '#2c2725',
    secondaryTextColor: '#6b6462',
    cardBorder: '#c98a92',
    badgeBg: '#2c2725',
    foilColor: '#b57a82'
  },
  {
    id: 'emerald-spa',
    name: 'Esmeralda & Oro Botánico',
    gradientStart: '#264e43',
    gradientMid: '#1b3b33',
    gradientEnd: '#122722',
    accentColor: '#e2d4b7',
    textColor: '#ffffff',
    secondaryTextColor: '#e0ece8',
    cardBorder: '#d4af37',
    badgeBg: '#c98a92',
    foilColor: '#e9d7b4'
  }
];

/**
 * Generates an ultra-crisp 1200x720px Luxury PNG image of the Gift Card using HTML5 Canvas.
 */
export function generateGiftCardCanvas(
  card: GiftCardItem,
  themeId: string = 'rose-gold'
): Promise<string> {
  return new Promise((resolve) => {
    const theme = GIFT_CARD_THEMES.find(t => t.id === themeId) || GIFT_CARD_THEMES[0];
    const canvas = document.createElement('canvas');
    const width = 1200;
    const height = 720;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      resolve('');
      return;
    }

    // 1. Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, theme.gradientStart);
    bgGrad.addColorStop(0.5, theme.gradientMid);
    bgGrad.addColorStop(1, theme.gradientEnd);

    // Rounded rectangle clipping
    const radius = 40;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(width - radius, 0);
    ctx.quadraticCurveTo(width, 0, width, radius);
    ctx.lineTo(width, height - radius);
    ctx.quadraticCurveTo(width, height, width - radius, height);
    ctx.lineTo(radius, height);
    ctx.quadraticCurveTo(0, height, 0, height - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.fillStyle = bgGrad;
    ctx.fill();

    // 2. Luxury Inner Border / Metallic Trim
    ctx.save();
    ctx.lineWidth = 3;
    ctx.strokeStyle = theme.foilColor;
    ctx.globalAlpha = 0.65;
    ctx.strokeRect(30, 30, width - 60, height - 60);
    
    // Delicate corner ornaments
    const corners = [
      [30, 30],
      [width - 30, 30],
      [30, height - 30],
      [width - 30, height - 30]
    ];
    ctx.fillStyle = theme.foilColor;
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    // 3. Subtle background watermark / aura circles
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(width - 150, 150, 260, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(100, height - 100, 200, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 4. Header Section: Brand & Subtitle
    ctx.save();
    ctx.fillStyle = theme.accentColor;
    ctx.font = 'bold 16px sans-serif';
    ctx.letterSpacing = '5px';
    ctx.fillText('EXPERIENCIA EXCLUSIVA · SALUD & BIENESTAR', 70, 95);

    ctx.fillStyle = theme.textColor;
    ctx.font = 'bold 44px "Cormorant Garamond", Georgia, serif';
    ctx.fillText('VIC Estética Integral', 70, 145);

    // Luxury Seal / Emblem on top right
    ctx.fillStyle = theme.badgeBg;
    ctx.beginPath();
    ctx.arc(width - 120, 110, 45, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = theme.foilColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px "Cormorant Garamond", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('VIC', width - 120, 112);
    ctx.font = '9px sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('GIFT CARD', width - 120, 128);
    ctx.textAlign = 'left';
    ctx.restore();

    // 5. Center Glass Card Container
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;
    const boxX = 70;
    const boxY = 180;
    const boxW = width - 140;
    const boxH = 340;
    const boxR = 24;

    ctx.beginPath();
    ctx.moveTo(boxX + boxR, boxY);
    ctx.lineTo(boxX + boxW - boxR, boxY);
    ctx.quadraticCurveTo(boxX + boxW, boxY, boxX + boxW, boxY + boxR);
    ctx.lineTo(boxX + boxW, boxY + boxH - boxR);
    ctx.quadraticCurveTo(boxX + boxW, boxY + boxH, boxX + boxW - boxR, boxY + boxH);
    ctx.lineTo(boxX + boxR, boxY + boxH);
    ctx.quadraticCurveTo(boxX, boxY + boxH, boxX, boxY + boxH - boxR);
    ctx.lineTo(boxX, boxY + boxR);
    ctx.quadraticCurveTo(boxX, boxY, boxX + boxR, boxY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // 6. Recipient & Sender Information
    ctx.save();
    // "Para:"
    ctx.fillStyle = theme.secondaryTextColor;
    ctx.font = '14px sans-serif';
    ctx.fillText('AGASAJADA / PARA:', 105, 230);

    ctx.fillStyle = theme.textColor;
    ctx.font = 'bold 32px "Cormorant Garamond", Georgia, serif';
    ctx.fillText(card.recipientName || 'Alguien Especial', 105, 270);

    // "De:"
    ctx.fillStyle = theme.secondaryTextColor;
    ctx.font = '14px sans-serif';
    ctx.fillText('DE PARTE DE:', 650, 230);

    ctx.fillStyle = theme.textColor;
    ctx.font = 'bold 26px "Cormorant Garamond", Georgia, serif';
    ctx.fillText(card.senderName || 'VIC Estética', 650, 270);

    // Divider line inside glass box
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(105, 305);
    ctx.lineTo(width - 105, 305);
    ctx.stroke();

    // Benefit / Amount / Treatment
    ctx.fillStyle = theme.secondaryTextColor;
    ctx.font = 'bold 13px sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('VALOR / TRATAMIENTO OBSEQUIADO:', 105, 345);

    const giftBenefitText = card.cardType === 'treatment' 
      ? (card.treatmentName || 'Tratamiento Exclusivo') 
      : formatPrice(card.initialBalance);

    ctx.fillStyle = theme.foilColor || theme.accentColor;
    ctx.font = 'bold 34px "Cormorant Garamond", Georgia, serif';
    ctx.fillText(giftBenefitText, 105, 390);

    // Personal Message / Dedication quote
    const rawMsg = card.message || '¡Para que disfrutes de un momento único de relax y cuidado en VIC!';
    const cleanMsg = `"${rawMsg.length > 70 ? rawMsg.substring(0, 68) + '...' : rawMsg}"`;
    ctx.fillStyle = theme.textColor;
    ctx.font = 'italic 16px "Cormorant Garamond", Georgia, serif';
    ctx.fillText(cleanMsg, 105, 460);

    ctx.restore();

    // 7. Footer: Voucher ID, Expiration & Clinic Address
    ctx.save();
    // Voucher ID Pill
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(70, 560, 240, 50);
    ctx.strokeStyle = theme.foilColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(70, 560, 240, 50);

    ctx.fillStyle = theme.textColor;
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`ID: ${card.code}`, 90, 592);

    // Right Side: Validity & Clinic Info
    ctx.textAlign = 'right';
    ctx.fillStyle = theme.secondaryTextColor;
    ctx.font = '13px sans-serif';
    ctx.fillText(`Vigencia: 90 días corridos · Canjeable Online o en Consultorio`, width - 70, 580);
    ctx.fillText(`Mendoza 985, Río Segundo, Córdoba · WhatsApp: +54 9 3572 40-3949`, width - 70, 604);
    ctx.restore();

    // Resolve base64 image
    resolve(canvas.toDataURL('image/png', 1.0));
  });
}

/**
 * Triggers a download of the generated gift card image.
 */
export async function downloadGiftCardImage(card: GiftCardItem, themeId: string = 'rose-gold') {
  const dataUrl = await generateGiftCardCanvas(card, themeId);
  if (!dataUrl) return;

  const link = document.createElement('a');
  link.download = `GiftCard_VIC_${card.code}_${card.recipientName.replace(/\s+/g, '_')}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
