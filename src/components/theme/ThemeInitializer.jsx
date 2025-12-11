import { useThemeStore } from '@/store/themeStore';
import { useEffect } from 'react';

export const ThemeInitializer = () => {
  const initializeTheme = useThemeStore((state) => state.initializeTheme);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return null;
};
