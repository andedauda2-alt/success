import React from 'react';
import { SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES } from '../utils/constants';
import { ShieldCheck, Camera, Globe } from 'lucide-react';

interface NavbarProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onNewScan: () => void;
  onOpenSamples: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLanguage,
  onLanguageChange,
  onNewScan,
  onOpenSamples,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
            ExplainAm
          </span>
          <span className="hidden sm:inline-block text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            Naija AI
          </span>
        </div>

        {/* Zone 2: Language switcher & samples link */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSamples}
            type="button"
            className="text-xs font-medium text-slate-600 hover:text-emerald-700 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap"
          >
            Sample Docs
          </button>

          {/* Language selector */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
              className="pl-8 pr-7 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200/80 text-slate-800 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer appearance-none"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
            <div className="absolute right-2 pointer-events-none text-[10px] text-slate-400">
              ▼
            </div>
          </div>
        </div>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center shrink-0">
          <button
            onClick={onNewScan}
            type="button"
            className="min-h-[38px] px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-lg transition shadow-sm flex items-center gap-1.5 whitespace-nowrap"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Scan Document</span>
          </button>
        </div>
      </div>
    </header>
  );
};
