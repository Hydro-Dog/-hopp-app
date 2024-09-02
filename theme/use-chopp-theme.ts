import { useTheme } from "@react-navigation/native";
import { ChopThemeType } from "./theme-type";
import { COLORS } from "@/constants/colors";

export const useChoppTheme = () => {
  const { dark } = useTheme() as ChopThemeType;

  return { dark, colors: dark ? COLORS.dark : COLORS.light };
};
