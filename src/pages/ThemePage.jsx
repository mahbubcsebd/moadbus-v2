import { Check, Palette } from 'lucide-react';
import { useState } from 'react';

// Helper functions
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 59, g: 130, b: 246 };
};

const lightenColor = (hex, percent) => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
  const B = Math.min(255, (num & 0x0000ff) + amt);
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
};

const applyColors = (colors) => {
  const root = document.documentElement;
  root.style.setProperty('--primary', colors.primary);
  root.style.setProperty('--secondary', colors.secondary);
  root.style.setProperty('--accent', colors.accent);

  const primaryRgb = hexToRgb(colors.primary);
  const isDark = primaryRgb.r * 0.299 + primaryRgb.g * 0.587 + primaryRgb.b * 0.114 < 128;
  root.style.setProperty('--primary-foreground', isDark ? '#ffffff' : '#000000');
  root.style.setProperty('--secondary-foreground', '#ffffff');
  root.style.setProperty('--accent-foreground', '#1e293b');
};

const ThemePage = () => {
  const [currentTheme, setCurrentTheme] = useState('blue');
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [previewColors, setPreviewColors] = useState({
    primary: '#3b82f6',
    secondary: '#60a5fa',
    accent: '#93c5fd',
  });

  // 20 Banking-focused themes
  const themes = [
    {
      id: 'blue',
      name: 'Classic Blue',
      colors: { primary: '#3b82f6', secondary: '#60a5fa', accent: '#93c5fd' },
    },
    {
      id: 'navy',
      name: 'Navy Blue',
      colors: { primary: '#1e40af', secondary: '#3b82f6', accent: '#60a5fa' },
    },
    {
      id: 'darkblue',
      name: 'Dark Blue',
      colors: { primary: '#1e3a8a', secondary: '#2563eb', accent: '#3b82f6' },
    },
    {
      id: 'green',
      name: 'Money Green',
      colors: { primary: '#10b981', secondary: '#34d399', accent: '#6ee7b7' },
    },
    {
      id: 'emerald',
      name: 'Emerald',
      colors: { primary: '#059669', secondary: '#10b981', accent: '#34d399' },
    },
    {
      id: 'teal',
      name: 'Teal',
      colors: { primary: '#14b8a6', secondary: '#2dd4bf', accent: '#5eead4' },
    },
    {
      id: 'cyan',
      name: 'Cyan',
      colors: { primary: '#0891b2', secondary: '#06b6d4', accent: '#22d3ee' },
    },
    {
      id: 'slate',
      name: 'Slate Gray',
      colors: { primary: '#475569', secondary: '#64748b', accent: '#94a3b8' },
    },
    {
      id: 'zinc',
      name: 'Modern Zinc',
      colors: { primary: '#52525b', secondary: '#71717a', accent: '#a1a1aa' },
    },
    {
      id: 'indigo',
      name: 'Indigo',
      colors: { primary: '#4f46e5', secondary: '#6366f1', accent: '#818cf8' },
    },
    {
      id: 'purple',
      name: 'Purple',
      colors: { primary: '#7c3aed', secondary: '#8b5cf6', accent: '#a78bfa' },
    },
    {
      id: 'violet',
      name: 'Violet',
      colors: { primary: '#6d28d9', secondary: '#7c3aed', accent: '#8b5cf6' },
    },
    {
      id: 'fuchsia',
      name: 'Fuchsia',
      colors: { primary: '#c026d3', secondary: '#d946ef', accent: '#e879f9' },
    },
    {
      id: 'pink',
      name: 'Pink',
      colors: { primary: '#db2777', secondary: '#ec4899', accent: '#f472b6' },
    },
    {
      id: 'rose',
      name: 'Rose',
      colors: { primary: '#e11d48', secondary: '#f43f5e', accent: '#fb7185' },
    },
    {
      id: 'orange',
      name: 'Orange',
      colors: { primary: '#ea580c', secondary: '#f97316', accent: '#fb923c' },
    },
    {
      id: 'amber',
      name: 'Amber',
      colors: { primary: '#d97706', secondary: '#f59e0b', accent: '#fbbf24' },
    },
    {
      id: 'lime',
      name: 'Lime',
      colors: { primary: '#65a30d', secondary: '#84cc16', accent: '#a3e635' },
    },
    {
      id: 'sky',
      name: 'Sky Blue',
      colors: { primary: '#0284c7', secondary: '#0ea5e9', accent: '#38bdf8' },
    },
    {
      id: 'red',
      name: 'Red',
      colors: { primary: '#dc2626', secondary: '#ef4444', accent: '#f87171' },
    },
  ];

  const handleColorChange = (color) => {
    setSelectedColor(color);
    const colors = {
      primary: color,
      secondary: lightenColor(color, 20),
      accent: lightenColor(color, 40),
    };
    setPreviewColors(colors);
  };

  const handleThemeSelect = (theme) => {
    setCurrentTheme(theme.id);
    applyColors(theme.colors);
    setPreviewColors(theme.colors);
  };

  const handleCustomApply = () => {
    setCurrentTheme('custom');
    applyColors(previewColors);
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      {/* Header - Mobile optimized */}
      <div className="sticky top-0 z-10 px-4 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 mt-1 rounded-md bg-linear-to-br from-blue-500 to-blue-600">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Theme</h1>
            <p className="text-xs text-gray-500">Customize your app</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Live Preview - Compact */}
        <div className="overflow-hidden bg-white shadow-sm rounded-2xl">
          <div className="p-4">
            <p className="mb-3 text-xs font-medium text-gray-500">LIVE PREVIEW</p>

            {/* Balance Card */}
            <div
              className="p-5 mb-3 text-white rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${previewColors.primary} 0%, ${previewColors.secondary} 100%)`,
              }}
            >
              <p className="mb-1 text-xs opacity-80">Total Balance</p>
              <p className="text-2xl font-bold">$24,580.00</p>
            </div>

            {/* Color Swatches */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <div
                  className="w-full h-12 mb-1 rounded-lg"
                  style={{ backgroundColor: previewColors.primary }}
                />
                <p className="text-[10px] font-medium text-gray-600 text-center">Primary</p>
              </div>
              <div>
                <div
                  className="w-full h-12 mb-1 rounded-lg"
                  style={{ backgroundColor: previewColors.secondary }}
                />
                <p className="text-[10px] font-medium text-gray-600 text-center">Secondary</p>
              </div>
              <div>
                <div
                  className="w-full h-12 mb-1 rounded-lg"
                  style={{ backgroundColor: previewColors.accent }}
                />
                <p className="text-[10px] font-medium text-gray-600 text-center">Accent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Grid - Mobile optimized */}
        <div className="overflow-hidden bg-white shadow-sm rounded-2xl">
          <div className="p-4">
            <p className="mb-3 text-xs font-medium text-gray-500">PRESET THEMES</p>

            <div className="grid grid-cols-3 gap-2">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme)}
                  className={`relative p-3 rounded-xl border-2 transition-all active:scale-95 ${
                    currentTheme === theme.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  {currentTheme === theme.id && (
                    <div className="absolute p-0.5 bg-blue-500 rounded-full top-1.5 right-1.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}

                  {/* Color Preview - Stacked */}
                  <div className="flex flex-col mb-2 space-y-1">
                    <div
                      className="w-full h-6 rounded-md"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div className="grid grid-cols-2 gap-1">
                      <div
                        className="h-3 rounded-sm"
                        style={{ backgroundColor: theme.colors.secondary }}
                      />
                      <div
                        className="h-3 rounded-sm"
                        style={{ backgroundColor: theme.colors.accent }}
                      />
                    </div>
                  </div>

                  <p className="text-[11px] font-semibold text-gray-800 truncate">{theme.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Custom Color Creator - Redesigned */}
        <div className="overflow-hidden bg-white shadow-sm rounded-2xl">
          <div className="p-4">
            <p className="mb-3 text-xs font-medium text-gray-500">CUSTOM COLOR</p>

            <div className="space-y-3">
              {/* Color Picker Row */}
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-16 h-16 border-2 border-gray-200 cursor-pointer rounded-xl"
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={selectedColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm font-mono border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="#3b82f6"
                  />
                </div>
              </div>

              {/* Generated Preview */}
              <div className="flex gap-2 p-3 md:gap-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 border border-gray-200 rounded-lg"
                    style={{ backgroundColor: previewColors.primary }}
                  />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-700">Primary</p>
                    <p className="font-mono text-[10px] text-gray-500">{previewColors.primary}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 border border-gray-200 rounded-lg"
                    style={{ backgroundColor: previewColors.secondary }}
                  />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-700">Secondary</p>
                    <p className="font-mono text-[10px] text-gray-500">{previewColors.secondary}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 border border-gray-200 rounded-lg"
                    style={{ backgroundColor: previewColors.accent }}
                  />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-700">Accent</p>
                    <p className="font-mono text-[10px] text-gray-500">{previewColors.accent}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCustomApply}
                className="w-full py-3 text-sm font-semibold text-white transition-all rounded-md bg-linear-to-r from-blue-500 to-blue-600"
              >
                Apply Custom Theme
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemePage;
