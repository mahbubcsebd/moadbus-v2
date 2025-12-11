import { Palette } from 'lucide-react';

export const FloatingThemeButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed z-50 p-3 transition-all duration-200 rounded-full shadow-lg bottom-6 right-6 bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-110"
      aria-label="Change Theme"
    >
      <Palette className="w-5 h-5" />
    </button>
  );
};
