mport { Check } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';

export const ThemeSwitcherPopup = ({ show, onClose }) => {
  const { currentTheme, themes, setTheme, customColor } = useThemeStore();

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20"
        onClick={onClose}
      />

      {/* Popup - Bottom Right Corner */}
      <div className="fixed z-50 duration-200 bg-white border border-gray-200 shadow-2xl bottom-20 right-6 w-80 rounded-xl animate-in slide-in-from-bottom-4">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Choose Theme</h3>
        </div>

        {/* Theme List - Scrollable */}
        <div className="p-3 overflow-y-auto max-h-96">
          <div className="grid grid-cols-2 gap-2">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  setTheme(theme.id);
                  onClose();
                }}
                className={`relative p-3 rounded-lg border transition-all hover:scale-105 ${
                  currentTheme === theme.id && !customColor
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Check Icon */}
                {currentTheme === theme.id && !customColor && (
                  <div className="absolute top-1.5 right-1.5 bg-primary text-primary-foreground rounded-full p-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                )}

                {/* Color Dots */}
                <div className="flex justify-center mb-2 space-x-1">
                  <div
                    className="w-5 h-5 border border-white rounded-full shadow-sm"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <div
                    className="w-5 h-5 border border-white rounded-full shadow-sm"
                    style={{ backgroundColor: theme.colors.secondary }}
                  />
                  <div
                    className="w-5 h-5 border border-white rounded-full shadow-sm"
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                </div>

                {/* Theme Name */}
                <p className="text-xs font-medium text-center text-gray-700">
                  {theme.name}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};