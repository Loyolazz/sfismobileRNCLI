import { scale, moderateScale } from './utils/responsive';

const colors = {
  /** tons principais usados na tela de fiscalização */
  primary: "#0B3556",
  primaryDark: "#153D5D",
  surface: "#FFFFFF",
  background: "#F2F4F7",
  text: "#0B1F33",
  muted: "#64748B",
  error: "#D62828",
};

const spacing = {
  xs: scale(4),
  sm: scale(8),
  md: scale(16),
  lg: scale(24),
  xl: scale(32),
};

const radius = {
  sm: scale(8),
  md: scale(12),
  lg: scale(18),
};

 const typography = {
   heading: { fontSize: moderateScale(20), fontWeight: "600", color: colors.text },
   body: { fontSize: moderateScale(14), color: colors.text },
   button: { fontSize: moderateScale(16), fontWeight: "600", color: colors.surface },
 } as const;

export default { colors, spacing, radius, typography };
