// Brand Colors
export const COLORS = {
  PRIMARY: '#F5A65B',         // Đỏ hồng (màu chủ đạo)
  SECONDARY: '#1EA7FD',       // Cyan/Xanh ngọc
  DARK: '#0D4D8B',            // Xám đen đậm
  LIGHT: '#EAF4FF',           // Xám nhạt
} as const;

// Tailwind CSS Classes
export const GRADIENT_PRIMARY = 'bg-gradient-to-r from-[#0D4D8B] to-[#F5A65B]';
export const GRADIENT_PRIMARY_HOVER = 'hover:from-[#0D4D8B] hover:to-[#E58B3D]';
export const GRADIENT_ACCENT = 'bg-gradient-to-r from-[#1EA7FD] to-[#F5A65B]';
export const GRADIENT_DARK = 'bg-gradient-to-r from-[#0D4D8B] to-[#1EA7FD]';

export const TEXT_PRIMARY = 'text-[#F5A65B]';
export const TEXT_SECONDARY = 'text-[#1EA7FD]';
export const TEXT_DARK = 'text-[#0D4D8B]';
export const TEXT_LIGHT = 'text-[#EAF4FF]';
export const TEXT_MUTED = 'text-gray-500';

export const BG_PRIMARY = 'bg-[#F5A65B]';
export const BG_SECONDARY = 'bg-[#1EA7FD]';
export const BG_DARK = 'bg-[#0D4D8B]';
export const BG_LIGHT = 'bg-[#EAF4FF]';
export const BG_WHITE = 'bg-white';

export const BORDER_PRIMARY = 'border-[#F5A65B]';
export const BORDER_SECONDARY = 'border-[#1EA7FD]';
export const BORDER_LIGHT = 'border-[#EAF4FF]';

export const HOVER_TEXT_PRIMARY = 'hover:text-[#F5A65B]';
export const HOVER_TEXT_SECONDARY = 'hover:text-[#1EA7FD]';
export const HOVER_BG_PRIMARY = 'hover:bg-[#F5A65B]';
export const HOVER_BG_LIGHT = 'hover:bg-[#f5f5f5]';

// Button Classes
export const BTN_PRIMARY = `${GRADIENT_PRIMARY} text-white py-3 rounded-lg font-semibold transition ${GRADIENT_PRIMARY_HOVER}`;
export const BTN_SECONDARY = `${BG_SECONDARY} ${TEXT_DARK} py-3 rounded-lg font-semibold transition hover:bg-[#158DD8]`;
export const BTN_OUTLINE = `border-2 ${BORDER_PRIMARY} ${TEXT_PRIMARY} py-3 rounded-lg font-semibold transition ${HOVER_BG_LIGHT}`;
