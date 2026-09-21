import React from 'react';
import { CHECKPOINTS } from '../data/checkpointsData';
import { Language } from '../types';
import { Compass, Award, ArrowRight, Mountain, Lock, Archive } from 'lucide-react';
import { SoundEngine } from '../utils/soundEffects';
import { CHAPTER_ARTWORK } from '../data/artworkData';

interface WelcomeScreenProps {
  lang?: Language;
  onEnterMap: () => void;
  onSelectCheckpoint: (id: number) => void;
  onViewStamps: () => void;
  onOpenArchive: () => void;
  completedCount: number;
  unlockedCheckpoints: number[];
  freeExploreMode: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  lang = 'en',
  onEnterMap,
  onSelectCheckpoint,
  onViewStamps,
  onOpenArchive,
  completedCount,
  unlockedCheckpoints,
  freeExploreMode,
}) => {
  return (
    <div className="relative overflow-hidden w-full">
      {/* Hero Cinematic Section */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 py-8 sm:py-12">
        {/* Background Atmospheric Glow & Mountain Silhouettes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-[#47BBC1]/10 blur-[130px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] rounded-full bg-[#EBC393]/5 blur-[120px]" />

          {/* Stylized Traditional Mountain Peaks SVG Backdrop */}
          <svg
            className="absolute bottom-0 left-0 right-0 w-full h-80 opacity-20 text-[#47BBC1]"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            fill="currentColor"
          >
            <path d="M0,320 L0,220 L160,140 L280,240 L440,80 L620,260 L780,40 L960,200 L1120,60 L1260,220 L1440,110 L1440,320 Z" />
          </svg>
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center w-full">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#47BBC1]/40 bg-[#122226]/80 text-[#47BBC1] text-xs tracking-widest uppercase mb-4 sm:mb-6 backdrop-blur-sm shadow-sm font-medium">
            <Mountain className="w-3.5 h-3.5 text-[#EBC393]" />
            <span>
              {lang === 'zh'
                ? '华山传说路线 · 神话文化探索图卷'
                : 'Mount Hua Legend Route · Cultural Heritage Exploration'}
            </span>
          </div>

          {/* Brand Name */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-[#E6E9D1] tracking-tight mb-3 sm:mb-4">
            MythTrial
          </h1>

          {/* Subtitle */}
          <h2 className="text-base sm:text-2xl font-serif text-[#47BBC1] font-medium tracking-wide mb-6 max-w-2xl px-2">
            {lang === 'zh'
              ? '华山传说路线 · 宝莲灯神话文化之旅'
              : 'Mount Hua Legend Route · A Cultural Journey through the Myth of the Lotus Lantern'}
          </h2>

          {/* Classical Inscription Card (No italics, upright text, high contrast) */}
          <div className="my-4 sm:my-6 p-5 sm:p-7 rounded-2xl border border-[#EBC393]/40 bg-[#121A1F]/90 backdrop-blur-md max-w-2xl w-full relative shadow-xl text-center">
            <div className="inline-block px-3 py-0.5 rounded bg-[#1C272E] border border-[#EBC393]/50 text-xs text-[#EBC393] uppercase tracking-widest mb-3 font-medium">
              ※ {lang === 'zh' ? '题刻诗赋' : 'Classical Poetic Inscription'}
            </div>
            <p className="text-base sm:text-lg text-[#E6E9D1] leading-relaxed whitespace-pre-line not-italic font-normal">
              {lang === 'zh'
                ? `“华山高插五千仞，宝莲神光照凡尘。
六大奇峰连地脉，千年孝义铸冰魂。”`
                : `“Mount Hua’s sheer crags rise five thousand fathoms high,
As the Lotus Lantern sheds its sacred light upon the mortal realm.
Six wondrous summits bind the mountain veins,
While a thousand years of pure devotion forge this steadfast heart.”`}
            </p>
            <p className="text-sm text-[#94A3B8] mt-3 leading-relaxed">
              {lang === 'zh'
                ? '从游客中心至西峰绝壁，六处圣境对应沉香劈山救母的六幕史诗。'
                : 'From the Visitor Center to the summit of West Peak, six sacred sites map to the six-act epic of Chenxiang saving his mother.'}
            </p>
          </div>

          {/* Action CTAs (Full width on mobile, min 48px height) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-4 w-full sm:w-auto">
            <button
              id="begin-journey-btn"
              onClick={() => {
                SoundEngine.playChime(1);
                onEnterMap();
              }}
              className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#47BBC1] to-[#2E8C91] text-black font-bold text-base hover:brightness-110 active:scale-95 transition-all shadow-[0_0_25px_rgba(71,187,193,0.35)] flex items-center justify-center gap-2"
            >
              <Compass className="w-5 h-5 text-black" />
              <span>{lang === 'zh' ? '开启华山之旅' : 'Begin the Mount Hua Journey'}</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>

            <button
              id="view-stamps-btn"
              onClick={() => {
                SoundEngine.playChime(3);
                onViewStamps();
              }}
              className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 rounded-xl border border-[#EBC393]/60 bg-[#121A1F] text-[#EBC393] font-medium text-base hover:bg-[#EBC393]/10 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Award className="w-5 h-5 text-[#EBC393]" />
              <span>{lang === 'zh' ? '查阅宝印谱' : 'View Sacred Seals'}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#EBC393]/20 font-mono font-bold">
                {completedCount}/6
              </span>
            </button>

            <button
              id="open-family-archive-btn"
              onClick={onOpenArchive}
              className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 rounded-xl border border-[#47BBC1]/60 bg-[#132B2A] text-[#47BBC1] font-medium text-base hover:bg-[#47BBC1]/10 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Archive className="w-5 h-5" />
              <span>{lang === 'zh' ? '家族山迹档案' : 'Family Trail Archive'}</span>
            </button>
          </div>

        </div>
      </section>

      {/* 6-Checkpoint Narrative Route Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 border-t border-[#47BBC1]/20 w-full">
        <div className="text-center mb-8 sm:mb-10">
          <span className="text-xs text-[#EBC393] uppercase tracking-widest block mb-1.5 font-medium">
            {lang === 'zh' ? '神话登山历程' : 'The Mythological Trajectory'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#E6E9D1]">
            {lang === 'zh'
              ? '华山六大圣境与《宝莲灯》六幕叙事'
              : 'Six Sacred Sites of Mount Hua Mapped to the Six Acts of the Lotus Lantern'}
          </h2>
          <p className="text-sm text-[#94A3B8] mt-2">
            {lang === 'zh'
              ? '点击任意关卡即可进入故事情节'
              : 'Select any checkpoint to enter the story'}
          </p>
        </div>

        {/* 1 column on mobile, 2 on md, 3 on lg */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full">
          {CHECKPOINTS.map((cp) => {
            const isUnlocked = freeExploreMode || unlockedCheckpoints.includes(cp.id);
            const locationTitle = lang === 'zh' ? cp.location : cp.locationEn;
            const stageName = lang === 'zh' ? cp.stage : cp.stageEn;
            const chapterTitle = lang === 'zh' ? cp.chapterTitle : cp.chapterTitleEn;
            const summaryText = lang === 'zh' ? cp.summary : cp.summaryEn;
            const sealName = lang === 'zh' ? cp.stamp.name : cp.stamp.nameEn;

            return (
              <div
                key={cp.id}
                id={`checkpoint-card-preview-${cp.id}`}
                onClick={() => {
                  if (!isUnlocked) return;
                  SoundEngine.playChime(cp.id);
                  onSelectCheckpoint(cp.id);
                }}
                className={`group p-5 sm:p-6 rounded-2xl border bg-[#0E161B] transition-all duration-300 shadow-lg flex flex-col justify-between min-h-[220px] ${
                  isUnlocked
                    ? 'cursor-pointer border-[#304147] hover:border-[#47BBC1] hover:bg-[#121C22]'
                    : 'cursor-not-allowed border-[#263238] opacity-55'
                }`}
              >
                <div>
                  <div className="relative h-36 -mx-5 -mt-5 sm:-mx-6 sm:-mt-6 mb-5 overflow-hidden rounded-t-2xl border-b border-[#304147]">
                    <img
                      src={CHAPTER_ARTWORK[cp.id]}
                      alt=""
                      aria-hidden="true"
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E161B] via-transparent to-transparent" />
                  </div>
                  {/* Act badge and Elevation */}
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-[#18262C] border border-[#3A4E55] text-[#47BBC1] font-medium">
                      {lang === 'zh' ? `第${cp.id}幕 · ${stageName}` : `Act ${cp.id} · ${stageName}`}
                    </span>
                    <span className="text-[#EBC393] font-mono font-bold">
                      {cp.altitude}
                    </span>
                  </div>

                  {/* Location Title & Chapter */}
                  <h3 className="text-lg font-serif font-bold text-[#E6E9D1] group-hover:text-[#47BBC1] transition-colors">
                    {cp.id}. {locationTitle}
                  </h3>
                  <p className="text-xs text-[#EBC393] mt-0.5 font-medium">
                    {chapterTitle}
                  </p>

                  {/* Narrative Summary: 16px font size on larger screens, clear 14px+ on mobile */}
                  <p className="text-sm sm:text-base text-[#CBD5E1] mt-3 leading-relaxed line-clamp-3">
                    {summaryText}
                  </p>
                </div>

                {/* Seal Information footer */}
                <div className="mt-5 pt-3 border-t border-[#223036] flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-[#94A3B8] flex items-center gap-1.5 font-medium">
                    <Award className="w-4 h-4 text-[#C04838] shrink-0" />
                    <span className="truncate max-w-[140px] sm:max-w-[180px]">{sealName}</span>
                  </span>
                  <span className="text-[#47BBC1] group-hover:translate-x-1 transition-transform flex items-center gap-0.5 font-medium shrink-0">
                    {isUnlocked ? (
                      lang === 'zh' ? '进入故事 →' : 'Read Story →'
                    ) : (
                      <><Lock className="w-3.5 h-3.5 mr-1" />{lang === 'zh' ? '尚未解锁' : 'Locked'}</>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </section>
    </div>
  );
};
