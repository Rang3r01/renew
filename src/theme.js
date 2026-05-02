// Central design-token configuration.
// Change a value here and it updates everywhere in the app.

export const colors = {
  // ── Brand ──────────────────────────────────────────────
  primary:        '#2BB5C8',
  primaryDark:    '#1A8A9A',
  primaryDeep:    '#0F6A7A',

  // ── Navigation / dark surfaces ─────────────────────────
  navBg:          '#0d2b35',
  navBgDeep:      '#071820',
  navBgMid:       '#0f3d4a',

  // ── Text ───────────────────────────────────────────────
  textPrimary:    '#1a2b30',
  textSecondary:  '#4A6068',
  textTertiary:   '#9AABB0',
  textDisabled:   '#C8D4D8',
  textMuted:      '#B0BEC5',

  // ── Backgrounds ────────────────────────────────────────
  bgPage:         '#EEF2F5',
  bgCard:         '#fff',
  bgSubtle:       '#F8FBFC',
  bgInput:        '#fff',

  // ── Borders ────────────────────────────────────────────
  border:         '#E4EAF0',
  borderInput:    '#DDE4E8',
  borderSubtle:   '#E8EEF0',

  // ── Status: success ────────────────────────────────────
  success:        '#059669',
  successLight:   '#6EE7B7',
  successBg:      '#ECFDF5',
  successBg2:     '#F0FDF4',
  successBorder:  '#BBF7D0',

  // ── Status: error ──────────────────────────────────────
  error:          '#DC2626',
  errorBg:        '#FEF2F2',
  errorBorder:    '#FECACA',

  // ── Status: warning ────────────────────────────────────
  warning:        '#EA580C',
  warningBg:      '#FFF7ED',
  warningBorder:  '#FED7AA',

  // ── Payfast ────────────────────────────────────────────
  payfastGreen:   '#0E9F6E',

  // ── White helpers ──────────────────────────────────────
  white:          '#fff',
  white30:        'rgba(255,255,255,0.3)',
  white55:        'rgba(255,255,255,0.55)',
  white75:        'rgba(255,255,255,0.75)',
};

export const gradients = {
  primary:    `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
  primaryDeep:`linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 60%, ${colors.primaryDeep} 100%)`,
  hero:       `linear-gradient(160deg, ${colors.navBgDeep} 0%, ${colors.navBg} 40%, ${colors.navBgMid} 70%, ${colors.navBg} 100%)`,
  dark:       `linear-gradient(160deg, ${colors.navBgDeep}, ${colors.navBg})`,
  modal:      `linear-gradient(135deg, ${colors.navBg}, #1A5060)`,
};

export const typography = {
  fontFamily:       "'DM Sans', sans-serif",
  fontFamilySerif:  'Georgia, serif',

  weight: {
    regular:   400,
    semibold:  600,
    bold:      700,
    extrabold: 800,
  },

  size: {
    xs:   '9px',
    sm:   '11px',
    base: '13px',
    md:   '14px',
    lg:   '15px',
    xl:   '16px',
    '2xl':'17px',
    '3xl':'18px',
    '4xl':'20px',
    '5xl':'24px',
    '6xl':'28px',
    '7xl':'32px',
  },
};

export const radii = {
  sm:   '6px',
  md:   '8px',
  lg:   '10px',
  xl:   '12px',
  '2xl':'16px',
  full: '999px',
  round:'50%',
};

export const shadows = {
  card:   '0 1px 3px rgba(0,0,0,0.04)',
  cardMd: '0 4px 24px rgba(0,0,0,0.08)',
  nav:    '0 2px 16px rgba(0,0,0,0.2)',
  panel:  '0 12px 40px rgba(0,0,0,0.18)',
  modal:  '0 16px 48px rgba(0,0,0,0.2)',
  modalLg:'0 24px 64px rgba(0,0,0,0.25)',
};

export const transitions = {
  fast:   'all 0.15s',
  base:   'all 0.2s',
  slow:   'all 0.25s',
  border: 'border-color 0.15s, background 0.15s',
};

// Convenience shorthand so callers can do: import t from '../theme'
const theme = { colors, gradients, typography, radii, shadows, transitions };
export default theme;
