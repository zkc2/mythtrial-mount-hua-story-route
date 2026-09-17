import React, { lazy, Suspense, useState } from 'react';
import { CHECKPOINTS } from '../data/checkpointsData';
import { Checkpoint, Language } from '../types';
import { SealStamp } from './SealStamp';
import { ArtworkMural } from './ArtworkMural';
import { JourneyJournal } from './JourneyJournal';
import { SoundEngine } from '../utils/soundEffects';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Mountain,
  NotebookPen,
  Award,
  Sparkles,
  CheckCircle2,
  Compass,
  Lock,
  Camera,
  ScanLine,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const WestPeakAR = lazy(() =>
  import('./WestPeakAR').then((module) => ({ default: module.WestPeakAR })),
);

interface StoryCardProps {
  checkpoint: Checkpoint;
  lang?: Language;
  isCollected: boolean;
  onCollectStamp: (checkpointId: number) => void;
  onSelectCheckpoint: (id: number) => void;
  onBackToMap: () => void;
  onViewStamps: () => void;
  unlockedCheckpoints: number[];
  freeExploreMode: boolean;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  checkpoint,
  lang = 'en',
  isCollected,
  onCollectStamp,
  onSelectCheckpoint,
  onBackToMap,
  onViewStamps,
  unlockedCheckpoints,
  freeExploreMode,
}) => {
  const [activeTab, setActiveTab] = useState<'myth' | 'heritage' | 'journal'>('myth');
  const [isStampingAnimation, setIsStampingAnimation] = useState(false);
  const [showWestPeakAR, setShowWestPeakAR] = useState(false);

  const prevId = checkpoint.id > 1 ? checkpoint.id - 1 : null;
  const nextId = checkpoint.id < CHECKPOINTS.length ? checkpoint.id + 1 : null;
  const nextIsUnlocked = nextId ? freeExploreMode || unlockedCheckpoints.includes(nextId) : false;

  const handleStampClick = () => {
    if (!isCollected) {
      setIsStampingAnimation(true);
      SoundEngine.playStampSound();

      // Burst gold and cinnabar red particles
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#C04838', '#EBC393', '#47BBC1'],
      });

      setTimeout(() => {
        onCollectStamp(checkpoint.id);
        setIsStampingAnimation(false);
      }, 500);
    }
  };

  const locationTitle = lang === 'zh' ? checkpoint.location : checkpoint.locationEn;
  const stageName = lang === 'zh' ? checkpoint.stage : checkpoint.stageEn;
  const chapterTitle = lang === 'zh' ? checkpoint.chapterTitle : checkpoint.chapterTitleEn;
  const verseText = lang === 'zh' ? checkpoint.classicalVerse : checkpoint.classicalVerseEn;
  const storyText = lang === 'zh' ? checkpoint.storyNarrative : checkpoint.storyNarrativeEn;
  const heritageText = lang === 'zh' ? checkpoint.heritageFact : checkpoint.heritageFactEn;
  const sealName = lang === 'zh' ? checkpoint.stamp.name : checkpoint.stamp.nameEn;
  const sealDesc = lang === 'zh' ? checkpoint.stamp.description : checkpoint.stamp.descriptionEn;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col gap-6 w-full overflow-x-hidden">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-[#304147] pb-3 text-sm">
        <button
          id="back-to-map-btn"
          onClick={() => {
            SoundEngine.playChime(1);
            onBackToMap();
          }}
          className="min-h-[44px] flex items-center gap-2 text-[#47BBC1] hover:text-[#E6E9D1] transition-colors font-medium self-start"
        >
          <Compass className="w-4 h-4 shrink-0" />
          <span>{lang === 'zh' ? '← 返回华山图卷' : '← Return to Mount Hua Scroll'}</span>
        </button>

        {/* Previous / Next Checkpoint Buttons */}
        <div className="flex items-center justify-between sm:justify-end gap-2">
          {prevId ? (
            <button
              id="prev-checkpoint-btn"
              onClick={() => {
                SoundEngine.playChime(prevId);
                onSelectCheckpoint(prevId);
              }}
              className="min-h-[44px] px-3 py-2 rounded-lg border border-[#304147] bg-[#121A1F] text-[#CBD5E1] hover:text-[#E6E9D1] hover:border-[#47BBC1] transition-all flex items-center gap-1 text-xs sm:text-sm font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{lang === 'zh' ? '上一幕' : 'Previous Act'}</span>
            </button>
          ) : <div />}

          <span className="text-[#94A3B8] px-2 font-mono text-sm font-medium">
            {checkpoint.id} / {CHECKPOINTS.length}
          </span>

          {nextId ? (
            <button
              id="next-checkpoint-btn"
              disabled={!nextIsUnlocked}
              onClick={() => {
                if (!nextIsUnlocked) return;
                SoundEngine.playChime(nextId);
                onSelectCheckpoint(nextId);
              }}
              className={`min-h-[44px] px-3 py-2 rounded-lg border transition-all flex items-center gap-1 text-xs sm:text-sm font-medium ${
                nextIsUnlocked
                  ? 'border-[#304147] bg-[#121A1F] text-[#CBD5E1] hover:text-[#E6E9D1] hover:border-[#47BBC1]'
                  : 'border-[#263238] bg-[#0C1114] text-[#5E6A70] cursor-not-allowed'
              }`}
            >
              <span>{nextIsUnlocked ? (lang === 'zh' ? '下一幕' : 'Next Act') : (lang === 'zh' ? '盖印后解锁' : 'Collect to unlock')}</span>
              {nextIsUnlocked ? <ChevronRight className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </button>
          ) : <div />}
        </div>
      </div>

      {/* Main Narrative Card Container: Full-width single column */}
      <div className="p-4 sm:p-8 rounded-2xl border border-[#47BBC1]/40 bg-[#0E161B] shadow-2xl relative w-full">
        {/* Story Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#2A3B42]">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full bg-[#14262C] border border-[#47BBC1]/40 text-[#47BBC1] text-xs font-medium">
                {lang === 'zh'
                  ? `第${checkpoint.id}幕 · ${stageName} · ${chapterTitle}`
                  : `Act ${checkpoint.id} · ${stageName} · ${chapterTitle}`}
              </span>
              <span className="text-xs text-[#EBC393] font-mono font-bold">
                {lang === 'zh' ? `海拔 ${checkpoint.altitude}` : `Elevation ${checkpoint.altitude}`}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#E6E9D1]">
              {locationTitle} · {chapterTitle}
            </h1>
          </div>

          {/* Stamp Status Emblem */}
          <div className="flex items-center gap-3 shrink-0">
            {isCollected ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#C04838]/15 border border-[#C04838] text-[#C04838] text-xs sm:text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#C04838]" />
                <span>{lang === 'zh' ? '宝印已收录' : 'Sacred Seal Collected'}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#182329] border border-[#EBC393]/40 text-[#EBC393] text-xs sm:text-sm font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#EBC393]" />
                <span>{lang === 'zh' ? '待盖印入册' : 'Awaiting Sacred Seal'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Illustrated Narrative Mural Art */}
        <div className="mb-6">
          <ArtworkMural checkpointId={checkpoint.id} />
          <div className="mt-2 text-xs text-[#94A3B8]">
            <p>
              {lang === 'zh'
                ? `图${checkpoint.id}：华山神话意境壁画 — ${chapterTitle}`
                : `Figure ${checkpoint.id}: Mythological Mural Illustration — ${chapterTitle}`}
            </p>
          </div>
        </div>

        {checkpoint.id === 5 && (
          <section className="mb-7 rounded-2xl border border-[#EBC393]/45 bg-gradient-to-br from-[#173332] via-[#111D20] to-[#261B17] p-4 sm:p-6 overflow-hidden relative">
            <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-[#EBC393]/10 blur-3xl" />
            <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[.18em] text-[#47BBC1] font-bold">
                  <ScanLine className="w-4 h-4" />
                  <span>{lang === 'zh' ? '西峰沉浸式体验 · WebAR' : 'West Peak Immersive Experience · WebAR'}</span>
                </div>
                <h2 className="mt-2 text-2xl sm:text-3xl font-serif font-bold text-[#F5E7C5]">
                  {lang === 'zh' ? '扫描故事标记，亲历劈山一刻' : 'Scan the marker. Witness the mountain split.'}
                </h2>
                <p className="mt-2 text-sm sm:text-base text-[#BFCBC7] leading-relaxed">
                  {lang === 'zh'
                    ? '通过图像识别唤醒沉香、萱花神斧与斧劈石动画；完成体验后自动获得西峰宝印，并可与神话场景合影。'
                    : 'Use image recognition to awaken Chenxiang, the divine axe, and Axe-Cleaving Rock. Complete the scene to earn the West Peak seal and take an AR photo.'}
                </p>
              </div>
              <button
                id="open-west-peak-ar"
                onClick={() => setShowWestPeakAR(true)}
                className="min-h-[56px] shrink-0 px-6 py-3.5 rounded-2xl bg-[#EBC393] text-[#10211F] font-bold text-base flex items-center justify-center gap-2 hover:brightness-110 active:scale-[.98] shadow-[0_0_26px_rgba(235,195,147,.2)]"
              >
                <Camera className="w-5 h-5" />
                <span>{lang === 'zh' ? 'Enter AR' : 'Enter AR'}</span>
              </button>
            </div>
          </section>
        )}

        {/* Classical Verse Inscription Card (Normal upright text, no italic) */}
        <div className="my-6 p-4 sm:p-6 rounded-xl border border-[#EBC393]/40 bg-[#121A1F] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-12 h-12 pointer-events-none opacity-20 text-[#EBC393]">
            <svg viewBox="0 0 50 50" fill="currentColor">
              <path d="M0,0 L50,0 L50,50 Z" />
            </svg>
          </div>
          <p className="text-xs text-[#EBC393] uppercase font-medium tracking-widest mb-2">
            ※ {lang === 'zh' ? '经典题刻诗赋' : 'Classical Poetic Inscription'}
          </p>
          <p className="text-base sm:text-lg text-[#E6E9D1] whitespace-pre-line leading-relaxed font-normal not-italic">
            "{verseText}"
          </p>
        </div>

        {/* Narrative Tabs: Touch targets at least 44px high */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#304147] mb-6">
          <button
            id="tab-story-narrative"
            onClick={() => {
              SoundEngine.playChime(1);
              setActiveTab('myth');
            }}
            className={`min-h-[44px] px-4 py-2.5 text-sm font-medium flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'myth'
                ? 'border-[#47BBC1] text-[#47BBC1]'
                : 'border-transparent text-[#94A3B8] hover:text-[#E6E9D1]'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>{lang === 'zh' ? '神话纪事' : 'Legend Chronicle'}</span>
          </button>

          <button
            id="tab-heritage-fact"
            onClick={() => {
              SoundEngine.playChime(2);
              setActiveTab('heritage');
            }}
            className={`min-h-[44px] px-4 py-2.5 text-sm font-medium flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'heritage'
                ? 'border-[#47BBC1] text-[#47BBC1]'
                : 'border-transparent text-[#94A3B8] hover:text-[#E6E9D1]'
            }`}
          >
            <Mountain className="w-4 h-4 shrink-0" />
            <span>{lang === 'zh' ? '华山胜迹' : 'Mount Hua Heritage'}</span>
          </button>

          <button
            id="tab-journey-journal"
            onClick={() => {
              SoundEngine.playChime(3);
              setActiveTab('journal');
            }}
            className={`min-h-[44px] px-4 py-2.5 text-sm font-medium flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'journal'
                ? 'border-[#47BBC1] text-[#47BBC1]'
                : 'border-transparent text-[#94A3B8] hover:text-[#E6E9D1]'
            }`}
          >
            <NotebookPen className="w-4 h-4 shrink-0" />
            <span>{lang === 'zh' ? '旅途记录' : 'Journey Journal'}</span>
          </button>
        </div>

        {/* Tab Content Panels (16px minimum body text, comfortable leading-relaxed line spacing) */}
        <div className="text-base leading-relaxed text-[#CBD5E1] min-h-[160px]">
          {activeTab === 'myth' && (
            <div className="space-y-4">
              <p className="text-justify leading-relaxed">
                {storyText}
              </p>
            </div>
          )}

          {activeTab === 'heritage' && (
            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-xl bg-[#111A1F] border border-[#47BBC1]/30">
                <h3 className="text-base font-bold text-[#47BBC1] mb-2 flex items-center gap-2">
                  <Mountain className="w-4 h-4 text-[#EBC393]" />
                  <span>{locationTitle} · {lang === 'zh' ? '地理与人文胜迹档案' : 'Geographic & Cultural Heritage Archive'}</span>
                </h3>
                <p className="text-base text-[#CBD5E1] leading-relaxed">
                  {heritageText}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'journal' && (
            <JourneyJournal checkpointId={checkpoint.id} locationTitle={locationTitle} lang={lang} />
          )}
        </div>

        {/* Digital Stamp Impression Area: Full-width column on mobile */}
        <div className="mt-8 pt-6 border-t border-[#304147] flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#111A1F] p-4 sm:p-6 rounded-2xl border border-[#47BBC1]/30 w-full">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left w-full sm:w-auto">
            {/* Interactive Seal Stamp */}
            <div
              className={`transform transition-transform duration-300 shrink-0 ${
                isStampingAnimation ? 'scale-125 rotate-6' : ''
              }`}
            >
              <SealStamp
                stamp={checkpoint.stamp}
                lang={lang}
                size="md"
                isCollected={isCollected}
                onClick={handleStampClick}
                interactive={!isCollected}
              />
            </div>

            <div>
              <p className="text-xs text-[#EBC393] uppercase tracking-wider font-medium">
                {lang === 'zh' ? '华岳传世宝印' : 'Cultural Sacred Seal'}
              </p>
              <h3 className="text-lg font-serif font-bold text-[#E6E9D1]">
                {sealName}
              </h3>
              <p className="text-sm text-[#94A3B8] mt-1 max-w-md leading-relaxed">
                {sealDesc}
              </p>
            </div>
          </div>

          {/* Stamp Action Button: Full-width on mobile (w-full sm:w-auto, min 48px height) */}
          <div className="w-full sm:w-auto shrink-0">
            {!isCollected ? (
              <button
                id={`collect-stamp-btn-${checkpoint.id}`}
                onClick={handleStampClick}
                disabled={isStampingAnimation}
                className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#C04838] to-[#993427] text-white font-bold text-base tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(192,72,56,0.4)] flex items-center justify-center gap-2 border border-[#E6E9D1]/30"
              >
                <Award className="w-5 h-5 text-white" />
                <span>{lang === 'zh' ? '盖印收录此印' : 'Collect Sacred Seal'}</span>
              </button>
            ) : (
              <button
                id="view-in-passport-btn"
                onClick={() => {
                  SoundEngine.playChime(2);
                  onViewStamps();
                }}
                className="w-full sm:w-auto min-h-[48px] px-5 py-3 rounded-xl border border-[#EBC393]/60 bg-[#EBC393]/10 text-[#EBC393] text-sm font-bold hover:bg-[#EBC393]/20 transition-colors flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4 text-[#EBC393]" />
                <span>{lang === 'zh' ? '已收录 · 查阅宝印谱' : 'Seal Collected · View Sacred Seals'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Route Navigation Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#26373D] text-sm">
          <button
            onClick={() => {
              SoundEngine.playChime(1);
              onBackToMap();
            }}
            className="text-[#47BBC1] hover:underline flex items-center gap-1 font-medium"
          >
            {lang === 'zh' ? '← 返回华山图卷' : '← Return to Mount Hua Scroll'}
          </button>

          {nextId && nextIsUnlocked && (
            <button
              onClick={() => {
                SoundEngine.playChime(nextId);
                onSelectCheckpoint(nextId);
              }}
              className="text-[#EBC393] hover:underline flex items-center gap-1 font-bold"
            >
              {lang === 'zh'
                ? `前往第${nextId}幕：${CHECKPOINTS[nextId - 1].location} →`
                : `Proceed to Act ${nextId}: ${CHECKPOINTS[nextId - 1].locationEn} →`}
            </button>
          )}
        </div>
      </div>
      {showWestPeakAR && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-[100] bg-[#050B0D] flex items-center justify-center text-[#EBC393]">
              <span className="animate-pulse font-serif text-lg">
                {lang === 'zh' ? '正在唤醒西峰传说…' : 'Awakening the West Peak legend…'}
              </span>
            </div>
          }
        >
          <WestPeakAR
            lang={lang}
            isCollected={isCollected}
            onClose={() => setShowWestPeakAR(false)}
            onComplete={() => onCollectStamp(checkpoint.id)}
          />
        </Suspense>
      )}
    </div>
  );
};
