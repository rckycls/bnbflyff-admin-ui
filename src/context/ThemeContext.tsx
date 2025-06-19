import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export type ThemeType = "light" | "dark" | "classic";

type ThemeContextType = {
  theme: ThemeType;
  setTheme: React.Dispatch<React.SetStateAction<ThemeType>>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const localTheme = localStorage.getItem("theme");
  const [theme, setTheme] = useState<ThemeType>(() => {
    return localTheme === "light" ||
      localTheme === "dark" ||
      localTheme === "classic"
      ? localTheme
      : "light";
  });

  const applyTheme = (newTheme: ThemeType) => {
    const root = document.documentElement;

    switch (newTheme) {
      case "dark":
        root.style.setProperty("--color-brand", "#03346E");
        root.style.setProperty("--color-secondary", "#E2E2B6");
        root.style.setProperty("--color-accent-blue", "#03346E66");
        root.style.setProperty("--color-accent-gold", "#E2E2B666");
        root.style.setProperty("--color-surface", "#021526");
        root.style.setProperty("--color-text", "#6EACDA");
        break;

      case "classic":
        root.style.setProperty("--color-brand", "#D4A693");
        root.style.setProperty("--color-secondary", "#574396");
        root.style.setProperty("--color-accent-blue", "#D4A69366");
        root.style.setProperty("--color-accent-gold", "#57439666");
        root.style.setProperty("--color-surface", "#E5E4DC");
        root.style.setProperty("--color-text", "#DF7C65");
        break;

      default:
        root.style.setProperty("--color-brand", "#0076c1");
        root.style.setProperty("--color-secondary", "#f6b400");
        root.style.setProperty("--color-accent-blue", "#e5f4fb");
        root.style.setProperty("--color-accent-gold", "#fff3d0");
        root.style.setProperty("--color-surface", "#f5f7fa");
        root.style.setProperty("--color-text", "#2c3e50");
    }
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    applyTheme(theme);
  }, [theme, localTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within an ThemeProvider");
  }
  return context;
};
