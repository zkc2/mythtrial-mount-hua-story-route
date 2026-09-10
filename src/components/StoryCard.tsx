import React, { useState } from 'react';
import { CHECKPOINTS } from '../data/checkpointsData';
import { Checkpoint, Language } from '../types';
import { SealStamp } from './SealStamp';
import { ArtworkMural } from './ArtworkMural';
import { SoundEngine } from '../utils/soundEffects';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Mountain,
  HelpCircle,
  Award,
  Sparkles,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StoryCardProps {
  checkpoint: Checkpoint;
  lang?: Language;
  isCollected: boolean;
  onCollectStamp: (checkpointId: number) => void;
  onSelectCheckpoint: (id: number) => void;
  onBackToMap: () => void;
  onViewStamps: () => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  checkpoint,
  lang = 'en',
  isCollected,
  onCollectStamp,
  onSelectCheckpoint,
  onBackToMap,
  onViewStamps,
}) => {
  const [activeTab, setActiveTab] = useState<'myth' | 'heritage' | 'reflection'>('myth');
  const [isStampingAnimation, setIsStampingAnimation] = useState(false);

  const prevId = checkpoint.id > 1 ? checkpoint.id - 1 : null;
  const nextId = checkpoint.id < CHECKPOINTS.length ? checkpoint.id + 1 : null;

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
  const reflectionText = lang === 'zh' ? checkpoint.reflectionQuestion : checkpoint.reflectionQuestionEn;
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
              onClick={() => {
                SoundEngine.playChime(nextId);
                onSelectCheckpoint(nextId);
              }}
              className="min-h-[44px] px-3 py-2 rounded-lg border border-[#304147] bg-[#121A1F] text-[#CBD5E1] hover:text-[#E6E9D1] hover:border-[#47BBC1] transition-all flex items-center gap-1 text-xs sm:text-sm font-medium"
            >
              <span>{lang === 'zh' ? '下一幕' : 'Next Act'}</span>
              <ChevronRight className="w-4 h-4" />
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
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-2 text-center">
            {lang === 'zh'
              ? `图${checkpoint.id}：华山神话意境壁画 — ${chapterTitle}`
              : `Figure ${checkpoint.id}: Mythological Mural Illustration — ${chapterTitle}`}
          </p>
        </div>

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
            id="tab-reflection-prompt"
            onClick={() => {
              SoundEngine.playChime(3);
              setActiveTab('reflection');
            }}
            className={`min-h-[44px] px-4 py-2.5 text-sm font-medium flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'reflection'
                ? 'border-[#47BBC1] text-[#47BBC1]'
                : 'border-transparent text-[#94A3B8] hover:text-[#E6E9D1]'
            }`}
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span>{lang === 'zh' ? '研学思考' : 'Classroom Reflection'}</span>
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

          {activeTab === 'reflection' && (
            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-xl bg-[#131D22] border border-[#EBC393]/40">
                <h3 className="text-base font-bold text-[#EBC393] mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#47BBC1]" />
                  <span>{lang === 'zh' ? '研学思辨研讨问题' : 'Discussion & Reflection Prompt'}</span>
                </h3>
                <p className="text-base text-[#E6E9D1] leading-relaxed not-italic font-normal">
                  “{reflectionText}”
                </p>
              </div>
            </div>
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

          {nextId && (
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
    </div>
  );
};
