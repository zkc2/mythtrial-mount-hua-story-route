import React from 'react';
import { CHECKPOINTS } from '../data/checkpointsData';
import { Language } from '../types';
import { CheckCircle2, Lock } from 'lucide-react';
import { SoundEngine } from '../utils/soundEffects';

interface ProgressIndicatorProps {
  lang?: Language;
  completedCheckpoints: number[];
  unlockedCheckpoints: number[];
  currentCheckpointId: number;
  freeExploreMode: boolean;
  onSelectCheckpoint: (id: number) => void;
  onEnterMap: () => void;
  onViewStamps: () => void;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  lang = 'en',
  completedCheckpoints,
  unlockedCheckpoints,
  currentCheckpointId,
  freeExploreMode,
  onSelectCheckpoint,
}) => {
  const completedCount = completedCheckpoints.length;
  const total = CHECKPOINTS.length;
  const percent = Math.round((completedCount / total) * 100);

  const isUnlocked = (id: number) => {
    if (freeExploreMode) return true;
    return unlockedCheckpoints.includes(id) || completedCheckpoints.includes(id);
  };

  const nextUncompleted = CHECKPOINTS.find((c) => !completedCheckpoints.includes(c.id));
  const nextCpTitle = nextUncompleted
    ? (lang === 'zh' ? nextUncompleted.location : nextUncompleted.locationEn)
    : (lang === 'zh' ? '西峰' : 'West Peak');

  return (
    <div className="w-full bg-[#0E161B] border-y border-[#47BBC1]/20 py-2.5 sm:py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
        {/* Progress summary label */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#47BBC1] flex items-center justify-center bg-[#132B2A] text-xs font-bold text-[#EBC393] font-mono shrink-0">
            {percent}%
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-[#47BBC1] flex items-center gap-1.5">
              <span>{lang === 'zh' ? '路线攀登进度' : 'Route Progress'}</span>
              <span className="text-[#EBC393] font-mono font-normal">
                ({completedCount}/{total} {lang === 'zh' ? '圣境已探索' : 'Sites Explored'})
              </span>
            </div>
            <p className="text-xs text-[#94A3B8]">
              {percent === 100
                ? (lang === 'zh' ? '六大胜境已探索 · 宝印圆满收录' : 'All six acts explored · Sacred seals complete')
                : (lang === 'zh' ? `下一节点：${nextCpTitle}` : `Next checkpoint: ${nextCpTitle}`)}
            </p>
          </div>
        </div>

        {/* 6 Step Progress Track */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full py-1 pr-3 scrollbar-none snap-x" aria-label={lang === 'zh' ? '可横向滑动的六站路线进度' : 'Swipeable six-stop route progress'}>
          {CHECKPOINTS.map((cp, idx) => {
            const completed = completedCheckpoints.includes(cp.id);
            const unlocked = isUnlocked(cp.id);
            const isCurrent = currentCheckpointId === cp.id;
            const locationTitle = lang === 'zh' ? cp.location : cp.locationEn;

            return (
              <React.Fragment key={cp.id}>
                <button
                  id={`progress-node-${cp.id}`}
                  onClick={() => {
                    if (unlocked) {
                      SoundEngine.playChime(cp.id);
                      onSelectCheckpoint(cp.id);
                    }
                  }}
                  disabled={!unlocked}
                  title={`${cp.id}. ${locationTitle} (${cp.altitude}) - ${
                    completed ? (lang === 'zh' ? '已完成' : 'Completed') : unlocked ? (lang === 'zh' ? '可探索' : 'Available') : (lang === 'zh' ? '未解锁' : 'Locked')
                  }`}
                  className={`min-h-[44px] group relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs transition-all duration-200 whitespace-nowrap shrink-0 snap-start ${
                    completed
                      ? 'bg-[#122728] border-[#47BBC1] text-[#47BBC1]'
                      : isCurrent
                      ? 'bg-[#1C282F] border-[#EBC393] text-[#EBC393] shadow-[0_0_8px_rgba(235,195,147,0.3)]'
                      : unlocked
                      ? 'bg-[#121A1F] border-[#304147] text-[#CBD5E1] hover:border-[#47BBC1]'
                      : 'bg-[#0B0E11] border-[#222C31] text-[#94A3B8] opacity-60 cursor-not-allowed'
                  }`}
                >
                  {completed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#47BBC1]" />
                  ) : unlocked ? (
                    <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px] font-mono font-bold">
                      {cp.id}
                    </span>
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-[#94A3B8]" />
                  )}

                  <span className="hidden lg:inline font-medium">{locationTitle}</span>
                  <span className="lg:hidden font-mono font-bold">{cp.id}</span>
                </button>

                {idx < CHECKPOINTS.length - 1 && (
                  <div
                    className={`w-2 sm:w-4 h-0.5 rounded shrink-0 ${
                      completedCheckpoints.includes(cp.id + 1) || completed
                        ? 'bg-[#47BBC1]'
                        : 'bg-[#253238]'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
