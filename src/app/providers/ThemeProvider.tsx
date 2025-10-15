import * as React from "react";
import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import theme from "@app/styles/theme.ts";

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: string;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>;
};

export default ThemeProvider;
