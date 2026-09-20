/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveScreen, Language } from './types';
import { CHECKPOINTS } from './data/checkpointsData';
import { Navbar } from './components/Navbar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { RouteMap } from './components/RouteMap';
import { StoryCard } from './components/StoryCard';
import { StampCollection } from './components/StampCollection';
import { ProgressIndicator } from './components/ProgressIndicator';
import { SystemMapModal } from './components/SystemMapModal';
import { ProcessCaseStudy } from './components/ProcessCaseStudy';
import { SoundEngine } from './utils/soundEffects';

const STORAGE_KEY_COMPLETED = 'mythtrial_completed_cps';
const STORAGE_KEY_STAMPS = 'mythtrial_collected_stamps';
const STORAGE_KEY_MODE = 'mythtrial_free_mode';
const STORAGE_KEY_LANG = 'mythtrial_app_lang';

const getInitialScreen = (): ActiveScreen => {
  if (typeof window === 'undefined') return 'welcome';
  const view = new URLSearchParams(window.location.search).get('view');
  if (view === 'west-peak') return 'story';
  if (view === 'case-study' || view === 'process') return 'case-study';
  return 'welcome';
};

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>(getInitialScreen);
  const [lang, setLang] = useState<Language>('en');
  const [selectedCheckpointId, setSelectedCheckpointId] = useState<number>(() => {
    if (typeof window === 'undefined') return 1;
    return new URLSearchParams(window.location.search).get('view') === 'west-peak' ? 5 : 1;
  });
  const [completedCheckpoints, setCompletedCheckpoints] = useState<number[]>([]);
  const [collectedStamps, setCollectedStamps] = useState<string[]>([]);
  const [unlockedCheckpoints, setUnlockedCheckpoints] = useState<number[]>([1]);
  const [freeExploreMode, setFreeExploreMode] = useState<boolean>(false);
  const [audioMuted, setAudioMuted] = useState<boolean>(true);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [showSystemMapModal, setShowSystemMapModal] = useState<boolean>(false);
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  // Load persistence from local storage
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY_LANG);
      if (savedLang === 'zh' || savedLang === 'en') {
        setLang(savedLang);
      }

      const savedCompleted = localStorage.getItem(STORAGE_KEY_COMPLETED);
      if (savedCompleted) {
        const parsed = JSON.parse(savedCompleted);
        if (Array.isArray(parsed)) {
          setCompletedCheckpoints(parsed);
          const maxCompleted = Math.max(0, ...parsed);
          const unlocked = [1];
          for (let i = 2; i <= Math.min(CHECKPOINTS.length, maxCompleted + 1); i++) {
            unlocked.push(i);
          }
          setUnlockedCheckpoints(unlocked);
        }
      }

      const savedStamps = localStorage.getItem(STORAGE_KEY_STAMPS);
      if (savedStamps) {
        const parsed = JSON.parse(savedStamps);
        if (Array.isArray(parsed)) {
          setCollectedStamps(parsed);
        }
      }

      const savedMode = localStorage.getItem(STORAGE_KEY_MODE);
      if (savedMode !== null) {
        setFreeExploreMode(savedMode === 'true');
      }
    } catch {
      // LocalStorage fallback
    } finally {
      setHasHydrated(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!hasHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    } catch {
      // safe fallback
    }
  }, [hasHydrated, lang]);

  useEffect(() => {
    if (!hasHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(completedCheckpoints));
    } catch {
      // safe fallback
    }
  }, [completedCheckpoints, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY_STAMPS, JSON.stringify(collectedStamps));
    } catch {
      // safe fallback
    }
  }, [collectedStamps, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY_MODE, String(freeExploreMode));
    } catch {
      // safe fallback
    }
  }, [freeExploreMode, hasHydrated]);

  // Keep the integrated case-study view linkable without maintaining a second page shell.
  useEffect(() => {
    const url = new URL(window.location.href);
    const currentView = url.searchParams.get('view');

    if (activeScreen === 'case-study') {
      if (currentView !== 'case-study') {
        url.searchParams.set('view', 'case-study');
        window.history.replaceState({}, '', url);
      }
      document.title = lang === 'zh' ? 'MythTrial 制作案例' : 'MythTrial Case Study';
      return;
    }

    if (currentView === 'case-study' || currentView === 'process') {
      url.searchParams.delete('view');
      window.history.replaceState({}, '', url);
    }
    document.title = 'MythTrial · Mount Hua Legend Route';
  }, [activeScreen, lang]);

  // Handle collecting stamp for a checkpoint
  const handleCollectStamp = (checkpointId: number) => {
    const cp = CHECKPOINTS.find((c) => c.id === checkpointId);
    if (!cp) return;

    if (!completedCheckpoints.includes(checkpointId)) {
      setCompletedCheckpoints((prev) => [...prev, checkpointId]);
    }

    if (!collectedStamps.includes(cp.stamp.id)) {
      setCollectedStamps((prev) => [...prev, cp.stamp.id]);
    }

    // Unlock next checkpoint
    const nextCpId = checkpointId + 1;
    if (nextCpId <= CHECKPOINTS.length && !unlockedCheckpoints.includes(nextCpId)) {
      setUnlockedCheckpoints((prev) => [...prev, nextCpId]);
    }
  };

  const handleSelectCheckpoint = (id: number) => {
    setSelectedCheckpointId(id);
    setActiveScreen('story');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetProgress = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    setCompletedCheckpoints([]);
    setCollectedStamps([]);
    setUnlockedCheckpoints([1]);
    setSelectedCheckpointId(1);
    try {
      localStorage.removeItem(STORAGE_KEY_COMPLETED);
      localStorage.removeItem(STORAGE_KEY_STAMPS);
    } catch {
      // safe fallback
    }
    setShowResetConfirm(false);
    SoundEngine.playChime(1);
  };

  const currentCheckpoint =
    CHECKPOINTS.find((c) => c.id === selectedCheckpointId) || CHECKPOINTS[0];

  return (
    <div className="min-h-screen bg-[#0B0E11] text-[#E6E9D1] flex flex-col font-sans selection:bg-[#47BBC1]/30 selection:text-[#E6E9D1] overflow-x-hidden">
      {/* Primary Sticky Navigation Bar */}
      <Navbar
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        lang={lang}
        setLang={setLang}
        audioMuted={audioMuted}
        setAudioMuted={setAudioMuted}
        completedCount={collectedStamps.length}
        totalCount={CHECKPOINTS.length}
        freeExploreMode={freeExploreMode}
        setFreeExploreMode={setFreeExploreMode}
        onResetProgress={handleResetProgress}
        onOpenSystemMap={() => setShowSystemMapModal(true)}
      />

      {/* Progress Indicator Bar */}
      {activeScreen !== 'welcome' && activeScreen !== 'case-study' && (
        <ProgressIndicator
          lang={lang}
          completedCheckpoints={completedCheckpoints}
          unlockedCheckpoints={unlockedCheckpoints}
          currentCheckpointId={selectedCheckpointId}
          freeExploreMode={freeExploreMode}
          onSelectCheckpoint={handleSelectCheckpoint}
          onEnterMap={() => setActiveScreen('map')}
          onViewStamps={() => setActiveScreen('stamps')}
        />
      )}

      {/* Main Screen Views */}
      <main className="flex-1 w-full overflow-x-hidden">
        {activeScreen === 'welcome' && (
          <WelcomeScreen
            lang={lang}
            onEnterMap={() => {
              setActiveScreen('map');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewStamps={() => {
              setActiveScreen('stamps');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectCheckpoint={handleSelectCheckpoint}
            completedCount={collectedStamps.length}
            unlockedCheckpoints={unlockedCheckpoints}
            freeExploreMode={freeExploreMode}
          />
        )}

        {activeScreen === 'map' && (
          <RouteMap
            lang={lang}
            completedCheckpoints={completedCheckpoints}
            unlockedCheckpoints={unlockedCheckpoints}
            currentCheckpointId={selectedCheckpointId}
            freeExploreMode={freeExploreMode}
            onSelectCheckpoint={handleSelectCheckpoint}
            onViewStamps={() => setActiveScreen('stamps')}
          />
        )}

        {activeScreen === 'story' && (
          <StoryCard
            checkpoint={currentCheckpoint}
            lang={lang}
            isCollected={collectedStamps.includes(currentCheckpoint.stamp.id)}
            onCollectStamp={handleCollectStamp}
            onBackToMap={() => {
              setActiveScreen('map');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectCheckpoint={handleSelectCheckpoint}
            onViewStamps={() => setActiveScreen('stamps')}
            unlockedCheckpoints={unlockedCheckpoints}
            freeExploreMode={freeExploreMode}
          />
        )}

        {activeScreen === 'stamps' && (
          <StampCollection
            lang={lang}
            collectedStamps={collectedStamps}
            onSelectCheckpoint={handleSelectCheckpoint}
            onEnterMap={() => {
              setActiveScreen('map');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeScreen === 'case-study' && (
          <ProcessCaseStudy
            lang={lang}
            onEnterMap={() => {
              setActiveScreen('map');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

      </main>

      {/* About & System Map Modal */}
      <SystemMapModal
        isOpen={showSystemMapModal}
        onClose={() => setShowSystemMapModal(false)}
        lang={lang}
        onToggleLang={() => setLang(lang === 'zh' ? 'en' : 'zh')}
      />

      {/* Global Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl border border-[#C04838]/60 bg-[#121A1F] shadow-2xl text-center">
            <h3 className="text-lg font-serif font-bold text-[#EBC393] mb-2">
              {lang === 'zh'
                ? '重置探索进度与传世宝印？'
                : 'Reset Journey Progress & Sacred Seals?'}
            </h3>
            <p className="text-sm text-[#CBD5E1] leading-relaxed mb-6">
              {lang === 'zh'
                ? '此操作将清空所有已访问的关卡与收集的宝印，让您可以从头开启华山神话文化旅程。'
                : 'This action will reset your visited checkpoints and collected sacred seals across Mount Hua’s six sacred sites, allowing you to begin the journey anew.'}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-[#304147] text-sm text-[#94A3B8] hover:text-[#E6E9D1]"
              >
                {lang === 'zh' ? '取消' : 'Cancel'}
              </button>
              <button
                onClick={confirmReset}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-[#C04838] text-white text-sm font-bold hover:brightness-110"
              >
                {lang === 'zh' ? '确认重置' : 'Confirm Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
