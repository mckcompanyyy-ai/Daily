
import React, { useState, useEffect, useRef } from 'react';

export type AppTheme = 'emerald' | 'midnight' | 'sunset' | 'lavender' | 'crimson';

interface ThemeSwitcherProps {
  currentTheme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
}

const themes: { id: AppTheme; label: string; color: string }[] = [
  { id: 'emerald', label: 'Zümrüt', color: 'bg-[#10b981]' },
  { id: 'midnight', label: 'Gece', color: 'bg-[#0ea5e9]' },
  { id: 'sunset', label: 'Günbatımı', color: 'bg-[#f59e0b]' },
  { id: 'lavender', label: 'Lavanta', color: 'bg-[#a855f7]' },
  { id: 'crimson', label: 'Kızıl', color: 'bg-[#f43f5e]' },
];

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, onThemeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[28px] shadow-xl border border-white dark:border-slate-800 text-brand-600 transition-all hover:scale-110 active:scale-95 shrink-0"
        title="Tema Değiştir"
      >
        <i className="fa-solid fa-palette text-xl"></i>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-100 dark:border-slate-800 p-3 z-[100] animate-in fade-in zoom-in duration-200">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-3 mt-2">Tema Seç</div>
          <div className="space-y-1">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  onThemeChange(theme.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${
                  currentTheme === theme.id 
                  ? 'bg-brand-50 dark:bg-brand-900/20 ring-1 ring-brand-200 dark:ring-brand-800' 
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg ${theme.color} shadow-sm ring-2 ring-white dark:ring-slate-700`}></div>
                <span className={`text-xs font-bold ${currentTheme === theme.id ? 'text-brand-600' : 'text-slate-700 dark:text-slate-300'}`}>
                  {theme.label}
                </span>
                {currentTheme === theme.id && (
                  <i className="fa-solid fa-check ml-auto text-[10px] text-brand-600"></i>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
