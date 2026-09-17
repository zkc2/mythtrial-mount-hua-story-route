import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Languages } from 'lucide-react';
import { Language } from '../types';
import { ProcessCaseStudy } from './ProcessCaseStudy';

const STORAGE_KEY_LANG = 'mythtrial_app_lang';

export const StandaloneCaseStudy: React.FC = () => {
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LANG);
      return saved === 'zh' || saved === 'en' ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    document.title = lang === 'zh' ? 'MythTrial 制作案例' : 'MythTrial Case Study';
    try {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    } catch {
      // Keep the page usable when storage is unavailable.
    }
  }, [lang]);

  const openPrototype = () => window.location.assign('/');

  return (
    <div className="min-h-screen bg-[#091014] text-[#E6E9D1] font-sans selection:bg-[#47BBC1]/30">
      <header className="sticky top-0 z-50 border-b border-[#47BBC1]/20 bg-[#091014]/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto min-h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-3 group">
            <span className="h-9 w-9 rounded-full border border-[#47BBC1] bg-[#132B2A] flex items-center justify-center text-[#EBC393] font-serif font-bold">M</span>
            <span>
              <span className="block font-serif font-bold text-[#E6E9D1] group-hover:text-[#47BBC1]">MythTrial</span>
              <span className="block text-xs text-[#84989F]">{lang === 'zh' ? '独立制作案例' : 'Standalone Case Study'}</span>
            </span>
          </a>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              className="min-h-[44px] px-3 rounded-lg border border-[#35505A] text-sm text-[#CBD5E1] hover:border-[#47BBC1] flex items-center gap-2"
              aria-label="Toggle case study language"
            >
              <Languages className="h-4 w-4 text-[#47BBC1]" />
              <span>{lang === 'zh' ? 'EN' : '中文'}</span>
            </button>
            <button
              type="button"
              onClick={openPrototype}
              className="min-h-[44px] px-3 sm:px-4 rounded-lg bg-[#47BBC1] text-[#061012] text-sm font-bold hover:brightness-110 flex items-center gap-2"
            >
              <span className="hidden sm:inline">{lang === 'zh' ? '打开原型' : 'Open Prototype'}</span>
              <span className="sm:hidden">{lang === 'zh' ? '原型' : 'Prototype'}</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <ProcessCaseStudy lang={lang} onEnterMap={openPrototype} />
    </div>
  );
};
