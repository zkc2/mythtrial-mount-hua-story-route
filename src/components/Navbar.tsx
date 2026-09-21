import React, { useState } from 'react';
import { ActiveScreen, Language } from '../types';
import { Volume2, VolumeX, BookOpen, Compass, Award, Sparkles, RefreshCw, Menu, X, HelpCircle, GitBranch, Archive } from 'lucide-react';
import { SoundEngine } from '../utils/soundEffects';

interface NavbarProps {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  audioMuted: boolean;
  setAudioMuted: (muted: boolean) => void;
  completedCount: number;
  totalCount: number;
  freeExploreMode: boolean;
  setFreeExploreMode: (mode: boolean) => void;
  onResetProgress: () => void;
  onOpenSystemMap: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeScreen,
  setActiveScreen,
  lang,
  setLang,
  audioMuted,
  setAudioMuted,
  completedCount,
  totalCount,
  freeExploreMode,
  setFreeExploreMode,
  onResetProgress,
  onOpenSystemMap,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleAudio = () => {
    const nextState = !audioMuted;
    setAudioMuted(nextState);
    SoundEngine.setMuted(nextState);
    if (!nextState) {
      SoundEngine.playChime(3);
    }
  };

  const toggleLanguage = () => {
    SoundEngine.playChime(2);
    setLang(lang === 'zh' ? 'en' : 'zh');
  };

  const navItems: { id: ActiveScreen; labelZh: string; labelEn: string; desktopLabelEn: string; icon: React.ReactNode }[] = [
    { id: 'welcome', labelZh: '序章前瞻', labelEn: 'Prologue', desktopLabelEn: 'Prologue', icon: <Sparkles className="w-4 h-4 shrink-0" /> },
    { id: 'map', labelZh: '华山图卷', labelEn: 'Mount Hua Scroll', desktopLabelEn: 'Route', icon: <Compass className="w-4 h-4 shrink-0" /> },
    { id: 'story', labelZh: '传说纪事', labelEn: 'Legend Chronicle', desktopLabelEn: 'Legend', icon: <BookOpen className="w-4 h-4 shrink-0" /> },
    { id: 'stamps', labelZh: '宝印谱', labelEn: 'Sacred Seal Collection', desktopLabelEn: 'Seals', icon: <Award className="w-4 h-4 shrink-0" /> },
    { id: 'archive', labelZh: '家族山迹档案', labelEn: 'Family Trail Archive', desktopLabelEn: 'Archive', icon: <Archive className="w-4 h-4 shrink-0" /> },
    { id: 'case-study', labelZh: '制作案例', labelEn: 'Case Study', desktopLabelEn: 'Case Study', icon: <GitBranch className="w-4 h-4 shrink-0" /> },
  ];

  const handleNavClick = (screen: ActiveScreen) => {
    SoundEngine.playChime(1);
    setActiveScreen(screen);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#47BBC1]/20 bg-[#0B0E11]/95 backdrop-blur-md">
        <div className="max-w-[1540px] mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-3">
          {/* Logo / Exhibition Title */}
          <div
            onClick={() => handleNavClick('welcome')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none shrink-0 min-w-0"
          >
            {/* Traditional Jade Emblem */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#47BBC1] flex items-center justify-center p-1 bg-[#132B2A] relative shadow-md group-hover:border-[#EBC393] transition-colors shrink-0">
              <div className="w-full h-full rounded-full border border-dashed border-[#EBC393]/80 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#47BBC1] group-hover:text-[#EBC393]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3L14 9H20L15 13L17 19L12 15L7 19L9 13L4 9H10L12 3Z" />
                </svg>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-xl font-serif font-bold text-[#E6E9D1] tracking-wider group-hover:text-[#47BBC1] transition-colors">
                  MythTrial
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] bg-[#12272B] border border-[#47BBC1]/30 text-[#47BBC1] font-mono">
                  v2.0
                </span>
              </div>
              <p className="hidden min-[430px]:block text-[11px] text-[#94A3B8] font-serif leading-none mt-0.5 truncate max-w-[130px] sm:max-w-xs">
                {lang === 'zh'
                  ? '华山传说路线 · 宝莲灯文化之旅'
                  : 'Mount Hua Legend Route · The Lotus Lantern Journey'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1.5 lg:gap-2">
            {navItems.map((item) => {
              const isActive = activeScreen === item.id;
              const label = lang === 'zh' ? item.labelZh : item.desktopLabelEn;

              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`min-h-[44px] px-3.5 py-2 text-sm font-medium flex items-center gap-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-[#132B2A] text-[#47BBC1] border border-[#47BBC1] shadow-[0_0_12px_rgba(71,187,193,0.2)]'
                      : 'text-[#94A3B8] hover:text-[#E6E9D1] hover:bg-[#10171B]'
                  }`}
                >
                  <span className={isActive ? 'text-[#47BBC1]' : 'text-[#94A3B8]'}>
                    {item.icon}
                  </span>
                  <span className="whitespace-nowrap">{label}</span>

                  {item.id === 'stamps' && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded font-mono font-medium ${
                        completedCount === totalCount
                          ? 'bg-[#EBC393] text-black font-bold'
                          : 'bg-[#47BBC1]/15 text-[#47BBC1]'
                      }`}
                    >
                      {completedCount}/{totalCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Controls Area */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* "About & System Map" Information Button */}
            <button
              id="about-system-map-btn"
              onClick={() => {
                SoundEngine.playChime(3);
                onOpenSystemMap();
              }}
              title={lang === 'zh' ? '查看系统架构图解与设计说明' : 'View Prototype Architecture & System Map'}
              aria-label="About & System Map"
              className="min-h-[44px] min-w-[44px] px-2.5 sm:px-3 py-1.5 rounded-lg border border-[#47BBC1]/40 bg-[#121A1E] text-xs font-medium text-[#47BBC1] hover:border-[#47BBC1] hover:bg-[#16252C] flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <HelpCircle className="w-4 h-4 text-[#47BBC1] shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">
                {lang === 'zh' ? '系统图解' : 'System Map'}
              </span>
            </button>

            {/* Desktop-only: Guided Journey vs Free Exploration */}
            <button
              id="mode-toggle-btn"
              onClick={() => {
                SoundEngine.playChime(4);
                setFreeExploreMode(!freeExploreMode);
              }}
              title={
                freeExploreMode
                  ? lang === 'zh' ? '切换为循序探索' : 'Switch to Guided Journey'
                  : lang === 'zh' ? '切换为自由探索' : 'Switch to Free Exploration'
              }
              className={`hidden 2xl:flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                freeExploreMode
                  ? 'border-[#EBC393]/60 bg-[#EBC393]/10 text-[#EBC393]'
                  : 'border-[#47BBC1]/40 bg-[#47BBC1]/5 text-[#47BBC1]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span>
                {freeExploreMode
                  ? lang === 'zh' ? '自由探索' : 'Free Exploration'
                  : lang === 'zh' ? '循序探索' : 'Guided Journey'}
              </span>
            </button>

            {/* Language Switcher: ALWAYS VISIBLE on both mobile and desktop! */}
            <button
              id="lang-switcher-btn"
              onClick={toggleLanguage}
              title={lang === 'zh' ? 'Switch to English' : '切换为中文'}
              aria-label="Toggle language"
              className="min-h-[44px] px-2 sm:px-3 py-1.5 rounded-lg border border-[#47BBC1]/40 bg-[#121A1E] text-xs font-medium text-[#E6E9D1] flex items-center gap-1 hover:border-[#47BBC1] hover:bg-[#162228] active:scale-95 transition-all select-none shadow-sm"
            >
              <span className={`transition-colors ${lang === 'zh' ? 'text-[#47BBC1] font-bold' : 'text-[#94A3B8]'}`}>
                中文
              </span>
              <span className="text-[#47BBC1]/40">/</span>
              <span className={`transition-colors ${lang === 'en' ? 'text-[#47BBC1] font-bold' : 'text-[#94A3B8]'}`}>
                EN
              </span>
            </button>

            {/* Desktop Audio Ambient Toggle */}
            <button
              id="audio-toggle-btn"
              onClick={toggleAudio}
              className={`hidden 2xl:flex min-h-[44px] min-w-[44px] items-center justify-center p-2 rounded-lg border transition-colors ${
                !audioMuted
                  ? 'border-[#47BBC1] bg-[#47BBC1]/15 text-[#47BBC1]'
                  : 'border-[#333E46] text-[#94A3B8] hover:text-[#E6E9D1]'
              }`}
              title={audioMuted ? (lang === 'zh' ? '开启音效' : 'Unmute audio') : (lang === 'zh' ? '关闭音效' : 'Mute audio')}
              aria-label="Toggle audio"
            >
              {!audioMuted ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Desktop Reset Progress */}
            <button
              id="reset-progress-btn"
              onClick={onResetProgress}
              className="hidden 2xl:flex min-h-[44px] min-w-[44px] items-center justify-center p-2 rounded-lg border border-[#333E46] text-[#94A3B8] hover:text-[#EBC393] hover:border-[#EBC393]/40 transition-colors"
              title={lang === 'zh' ? '重置探索进度与宝印' : 'Reset journey progress and seals'}
              aria-label="Reset progress"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Compact navigation stays available through tablet and small laptop widths. */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              className="2xl:hidden min-h-[44px] min-w-[44px] p-2.5 rounded-lg border border-[#304147] text-[#E6E9D1] hover:text-[#47BBC1] hover:border-[#47BBC1] bg-[#121A1E] flex items-center justify-center transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#EBC393]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out compact navigation drawer for widths below the full desktop layout. */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 2xl:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer panel */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-[#0E161B] border-l border-[#47BBC1]/30 h-full p-6 flex flex-col justify-between z-10 overflow-y-auto shadow-2xl">
            <div>
              {/* Drawer Top Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-[#26353B] mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full border border-[#47BBC1] flex items-center justify-center bg-[#132B2A]">
                    <svg className="w-3.5 h-3.5 text-[#47BBC1]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3L14 9H20L15 13L17 19L12 15L7 19L9 13L4 9H10L12 3Z" />
                    </svg>
                  </div>
                  <span className="font-serif font-bold text-base text-[#E6E9D1]">MythTrial</span>
                </div>

                <button
                  id="mobile-drawer-close-btn"
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-[#94A3B8] hover:text-[#E6E9D1] hover:bg-[#162228] transition-colors"
                  aria-label="Close navigation drawer"
                >
                  <X className="w-6 h-6 text-[#EBC393]" />
                </button>
              </div>

              {/* "About & System Map" Feature Button inside Mobile Drawer */}
              <button
                id="mobile-drawer-system-map-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  SoundEngine.playChime(3);
                  onOpenSystemMap();
                }}
                className="w-full min-h-[48px] px-4 py-3 mb-4 rounded-xl text-sm flex items-center justify-between text-[#47BBC1] bg-[#132B2A] border border-[#47BBC1] hover:bg-[#183635] transition-all font-medium shadow-[0_0_12px_rgba(71,187,193,0.15)]"
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-5 h-5 text-[#47BBC1] shrink-0" />
                  <span>{lang === 'zh' ? '系统图解与运作架构' : 'About & System Map'}</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#47BBC1]/20 text-[#47BBC1] font-mono">
                  {lang === 'zh' ? '架构图' : 'Map'}
                </span>
              </button>

              {/* Navigation Items List */}
              <div className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-wider text-[#94A3B8] font-medium px-3 mb-1">
                  {lang === 'zh' ? '探索导航' : 'Navigation'}
                </p>

                {navItems.map((item) => {
                  const isActive = activeScreen === item.id;
                  const label = lang === 'zh' ? item.labelZh : item.labelEn;
                  return (
                    <button
                      key={item.id}
                      id={`mobile-nav-${item.id}`}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full min-h-[48px] px-4 py-3 rounded-xl text-base flex items-center justify-between transition-all ${
                        isActive
                          ? 'bg-[#132B2A] text-[#47BBC1] border border-[#47BBC1] font-medium shadow-[0_0_12px_rgba(71,187,193,0.2)]'
                          : 'text-[#E6E9D1] hover:bg-[#162025] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={isActive ? 'text-[#47BBC1]' : 'text-[#94A3B8]'}>
                          {item.icon}
                        </span>
                        <span>{label}</span>
                      </div>

                      {item.id === 'stamps' && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-mono font-medium ${
                            completedCount === totalCount
                              ? 'bg-[#EBC393] text-black font-bold'
                              : 'bg-[#47BBC1]/20 text-[#47BBC1]'
                          }`}
                        >
                          {completedCount}/{totalCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Progress Summary Card in Drawer */}
              <div className="mt-5 p-4 rounded-xl bg-[#131D22] border border-[#26353B]">
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-[#94A3B8]">{lang === 'zh' ? '宝印收集进度' : 'Seals Collected'}</span>
                  <span className="font-mono text-[#EBC393] font-bold">{completedCount} / {totalCount}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#1F2B31] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#47BBC1] to-[#EBC393] transition-all duration-500"
                    style={{ width: `${(completedCount / totalCount) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Controls in Drawer */}
            <div className="pt-4 border-t border-[#26353B] space-y-3">
              {/* Exploration Mode Toggle in Drawer */}
              <button
                id="mobile-drawer-mode-toggle"
                onClick={() => {
                  SoundEngine.playChime(4);
                  setFreeExploreMode(!freeExploreMode);
                }}
                className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl border text-sm flex items-center justify-between transition-colors ${
                  freeExploreMode
                    ? 'border-[#EBC393]/60 bg-[#EBC393]/10 text-[#EBC393]'
                    : 'border-[#47BBC1]/40 bg-[#47BBC1]/5 text-[#47BBC1]'
                }`}
              >
                <span>{lang === 'zh' ? '探索模式' : 'Journey Mode'}</span>
                <span className="font-medium">
                  {freeExploreMode
                    ? (lang === 'zh' ? '自由探索' : 'Free Exploration')
                    : (lang === 'zh' ? '循序探索' : 'Guided Journey')}
                </span>
              </button>

              {/* Audio Ambient Control */}
              <button
                id="mobile-drawer-sound-toggle"
                onClick={toggleAudio}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-[#304147] bg-[#121A1F] text-sm text-[#E6E9D1] flex items-center justify-between hover:border-[#47BBC1] transition-colors"
              >
                <span>{lang === 'zh' ? '五音音效' : 'Ambient Sound'}</span>
                <div className="flex items-center gap-1.5">
                  {!audioMuted ? (
                    <>
                      <Volume2 className="w-4 h-4 text-[#47BBC1]" />
                      <span className="text-xs text-[#47BBC1]">{lang === 'zh' ? '已开启' : 'On'}</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-4 h-4 text-[#94A3B8]" />
                      <span className="text-xs text-[#94A3B8]">{lang === 'zh' ? '已静音' : 'Muted'}</span>
                    </>
                  )}
                </div>
              </button>

              {/* Reset Progress Button */}
              <button
                id="mobile-drawer-reset-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onResetProgress();
                }}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-[#304147] bg-[#121A1F] text-sm text-[#94A3B8] hover:text-[#EBC393] hover:border-[#EBC393]/40 flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{lang === 'zh' ? '重置登山进度与宝印' : 'Reset Journey Progress'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
