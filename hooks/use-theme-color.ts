/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { COLORS } from "@/constants/Colors";
import { useChoppTheme } from "@/shared/context/chopp-theme-context";
import { LIGHT_THEME } from "@/theme";

//TODO: отрефакторить, выяснить нужен ли вообще этот компонент
export function useThemeColor(props: { light?: string; dark?: string }, colorName: keyof typeof LIGHT_THEME.colors) {
  const theme = useChoppTheme().isDarkTheme ? "dark" : "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return COLORS[theme][colorName];
  }
}
