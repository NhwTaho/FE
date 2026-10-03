import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemePreset = 'viety-red' | 'coffee' | 'teal' | 'indigo' | 'emerald' | 'rose';
export type SidebarStyle = 'dark' | 'light';
export type Mode = 'light' | 'dark';

export interface ThemeConfig {
  preset: ThemePreset;
  sidebarStyle: SidebarStyle;
  mode: Mode;
}

export interface ThemePresetOption {
  id: ThemePreset;
  name: string;
  primaryColor: string;
  brandBgClass: string;
  activeBorderClass: string;
  accentBadge: string;
}

export const THEME_PRESETS: ThemePresetOption[] = [
  {
    id: 'viety-red',
    name: 'Đỏ VIETY (Logo chính)',
    primaryColor: '#e11d2a',
    brandBgClass: 'bg-red-600',
    activeBorderClass: 'border-red-600',
    accentBadge: 'bg-red-100 text-red-800',
  },
  {
    id: 'coffee',
    name: 'Cà phê Cổ điển',
    primaryColor: '#c2410c',
    brandBgClass: 'bg-orange-600',
    activeBorderClass: 'border-orange-600',
    accentBadge: 'bg-orange-100 text-orange-800',
  },
  {
    id: 'teal',
    name: 'Biển xanh Teal',
    primaryColor: '#0d9488',
    brandBgClass: 'bg-teal-600',
    activeBorderClass: 'border-teal-600',
    accentBadge: 'bg-teal-100 text-teal-800',
  },
  {
    id: 'indigo',
    name: 'Xanh Hoàng Gia (Indigo)',
    primaryColor: '#4f46e5',
    brandBgClass: 'bg-indigo-600',
    activeBorderClass: 'border-indigo-600',
    accentBadge: 'bg-indigo-100 text-indigo-800',
  },
  {
    id: 'emerald',
    name: 'Xanh Ngọc (Emerald)',
    primaryColor: '#059669',
    brandBgClass: 'bg-emerald-600',
    activeBorderClass: 'border-emerald-600',
    accentBadge: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'rose',
    name: 'Đỏ Đô Sang Trọng (Rose)',
    primaryColor: '#e11d48',
    brandBgClass: 'bg-rose-600',
    activeBorderClass: 'border-rose-600',
    accentBadge: 'bg-rose-100 text-rose-800',
  },
];

interface ThemeContextType {
  preset: ThemePreset;
  sidebarStyle: SidebarStyle;
  mode: Mode;
  setPreset: (preset: ThemePreset) => void;
  setSidebarStyle: (style: SidebarStyle) => void;
  setMode: (mode: Mode) => void;
  currentPresetOption: ThemePresetOption;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preset, setPresetState] = useState<ThemePreset>(() => {
    return (localStorage.getItem('theme_preset') as ThemePreset) || 'viety-red';
  });

  const [sidebarStyle, setSidebarStyleState] = useState<SidebarStyle>(() => {
    return (localStorage.getItem('theme_sidebar_style') as SidebarStyle) || 'dark';
  });

  const [mode, setModeState] = useState<Mode>(() => {
    return (localStorage.getItem('theme_mode') as Mode) || 'light';
  });

  const setPreset = (newPreset: ThemePreset) => {
    setPresetState(newPreset);
    localStorage.setItem('theme_preset', newPreset);
  };

  const setSidebarStyle = (newStyle: SidebarStyle) => {
    setSidebarStyleState(newStyle);
    localStorage.setItem('theme_sidebar_style', newStyle);
  };

  const setMode = (newMode: Mode) => {
    setModeState(newMode);
    localStorage.setItem('theme_mode', newMode);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme-preset', preset);
    root.setAttribute('data-sidebar-style', sidebarStyle);
    
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [preset, sidebarStyle, mode]);

  const currentPresetOption = THEME_PRESETS.find((p) => p.id === preset) || THEME_PRESETS[0];

  return (
    <ThemeContext.Provider
      value={{
        preset,
        sidebarStyle,
        mode,
        setPreset,
        setSidebarStyle,
        setMode,
        currentPresetOption,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
