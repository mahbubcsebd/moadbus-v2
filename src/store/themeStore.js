import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Helper function to convert hex to RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 59, g: 130, b: 246 }; // fallback to blue
};

export const useThemeStore = create(
  persist(
    (set, get) => ({
      currentTheme: 'blue',
      customColor: null,

      themes: [
        {
          id: 'blue',
          name: 'Ocean Blue',
          description: 'Professional and trustworthy',
          primary: '#093CAD',
          secondary: '#1E5FD9',
          accent: '#4A8EF7',
        },
        {
          id: 'navy',
          name: 'Navy Blue',
          description: 'Corporate and secure',
          colors: {
            primary: '#1e40af',
            secondary: '#3b82f6',
            accent: '#60a5fa',
          },
        },
        {
          id: 'green',
          name: 'Forest Green',
          description: 'Growth and prosperity',
          colors: {
            primary: '#10b981',
            secondary: '#34d399',
            accent: '#6ee7b7',
          },
        },
        {
          id: 'emerald',
          name: 'Emerald',
          description: 'Fresh and modern',
          colors: {
            primary: '#059669',
            secondary: '#10b981',
            accent: '#34d399',
          },
        },
        {
          id: 'purple',
          name: 'Royal Purple',
          description: 'Premium and elegant',
          colors: {
            primary: '#8b5cf6',
            secondary: '#a78bfa',
            accent: '#c4b5fd',
          },
        },
        {
          id: 'indigo',
          name: 'Deep Indigo',
          description: 'Sophisticated and calm',
          colors: {
            primary: '#6366f1',
            secondary: '#818cf8',
            accent: '#a5b4fc',
          },
        },
        {
          id: 'teal',
          name: 'Ocean Teal',
          description: 'Balance and stability',
          colors: {
            primary: '#14b8a6',
            secondary: '#2dd4bf',
            accent: '#5eead4',
          },
        },
        {
          id: 'cyan',
          name: 'Sky Cyan',
          description: 'Clear and transparent',
          colors: {
            primary: '#06b6d4',
            secondary: '#22d3ee',
            accent: '#67e8f9',
          },
        },
        {
          id: 'slate',
          name: 'Slate Gray',
          description: 'Neutral and professional',
          colors: {
            primary: '#475569',
            secondary: '#64748b',
            accent: '#94a3b8',
          },
        },
        {
          id: 'rose',
          name: 'Rose Gold',
          description: 'Warm and inviting',
          colors: {
            primary: '#f43f5e',
            secondary: '#fb7185',
            accent: '#fda4af',
          },
        },
      ],

      setTheme: (themeId) => {
        set({ currentTheme: themeId, customColor: null });
        const theme = get().themes.find((t) => t.id === themeId);
        if (theme) {
          get().applyColors(theme.colors);
        }
      },

      setCustomColor: (color) => {
        set({ customColor: color, currentTheme: 'custom' });
        const colors = {
          primary: color,
          secondary: get().lightenColor(color, 20),
          accent: get().lightenColor(color, 40),
        };
        get().applyColors(colors);
      },

      // Apply colors to CSS variables in RGB format
      // Apply colors directly as hex values (Tailwind v4 compatible)
      applyColors: (colors) => {
        const root = document.documentElement;

        // Set CSS variables as HEX values (Tailwind v4 compatible)
        root.style.setProperty('--primary', colors.primary);
        root.style.setProperty('--secondary', colors.secondary);
        root.style.setProperty('--accent', colors.accent);

        // Set foreground colors
        const primaryRgb = hexToRgb(colors.primary);
        const isDark = primaryRgb.r * 0.299 + primaryRgb.g * 0.587 + primaryRgb.b * 0.114 < 128;

        root.style.setProperty('--primary-foreground', isDark ? '#ffffff' : '#000000');
        root.style.setProperty('--secondary-foreground', '#ffffff');
        root.style.setProperty('--accent-foreground', '#1e293b');

        console.log('✅ Theme applied:', colors);
      },

      lightenColor: (hex, percent) => {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
        const B = Math.min(255, (num & 0x0000ff) + amt);
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1).toUpperCase();
      },

      initializeTheme: () => {
        const state = get();
        console.log('🎨 Initializing theme:', state.currentTheme);
        if (state.customColor) {
          state.setCustomColor(state.customColor);
        } else {
          const theme = state.themes.find((t) => t.id === state.currentTheme);
          if (theme) {
            state.applyColors(theme.colors);
          }
        }
      },
    }),
    {
      name: 'banking-app-theme',
      storage: createJSONStorage(() => localStorage),
      partialState: (state) => ({
        currentTheme: state.currentTheme,
        customColor: state.customColor,
      }),
    },
  ),
);
