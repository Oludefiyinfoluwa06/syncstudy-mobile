/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  // Always use light theme colors. Honor explicit `light` prop when provided.
  const colorFromProps = props.light;
  if (colorFromProps) return colorFromProps;
  return Colors.light[colorName];
}
