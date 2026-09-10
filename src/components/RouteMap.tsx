import React, { useState } from 'react';
import { CHECKPOINTS } from '../data/checkpointsData';
import { Language } from '../types';
import { SealStamp } from './SealStamp';
import { SoundEngine } from '../utils/soundEffects';
import { CheckCircle2, Lock, Award, ArrowUpRight, Compass, Layers, Info } from 'lucide-react';

interface RouteMapProps {
  lang?: Language;
  completedCheckpoints: number[];
  unlockedCheckpoints: number[];
  currentCheckpointId: number;
  freeExploreMode: boolean;
  onSelectCheckpoint: (id: number) => void;
  onViewStamps: () => void;
}

export const RouteMap: React.FC<RouteMapProps> = ({
  lang = 'en',
  completedCheckpoints,
  unlockedCheckpoints,
  currentCheckpointId,
  freeExploreMode,
  onSelectCheckpoint,
  onViewStamps,
}) => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedPreviewId, setSelectedPreviewId] = useState<number>(currentCheckpointId || 1);
  const [viewLayer, setViewLayer] = useState<'map' | 'elevation'>('map');

  const isUnlocked = (id: number) => {
    if (freeExploreMode) return true;
    return unlockedCheckpoints.includes(id) || completedCheckpoints.includes(id);
  };

  const activeCheckpoint = CHECKPOINTS.find((c) => c.id === selectedPreviewId) || CHECKPOINTS[0];
  const completedCount = completedCheckpoints.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col gap-6 w-full overflow-x-hidden">
      {/* Top Narrative Header Banner */}
      <div className="p-4 sm:p-6 rounded-2xl border border-[#47BBC1]/30 bg-[#0E161B] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#EBC393] mb-1.5 font-medium">
            <Compass className="w-4 h-4 text-[#47BBC1]" />
            <span>
              {lang === 'zh'
                ? '华山传说路线 · 宝莲灯神话研学图卷'
                : 'Mount Hua Legend Route · Illustrated Topographic Map'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#E6E9D1]">
            {lang === 'zh' ? '华岳圣境与宝莲灯巡礼' : 'The Lotus Lantern Pilgrimage'}
          </h1>
          <p className="text-sm sm:text-base text-[#94A3B8] mt-1">
            {lang === 'zh'
              ? '从华山游客中心（380米）攀升至西峰巨莲之巅（2,082米）'
              : 'Ascending from the Visitor Center (380m) to the West Peak Lotus Crags (2,082m)'}
          </p>
        </div>

        {/* Route Progress Widget */}
        <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-3 sm:gap-4 bg-[#131D22] p-3 sm:p-3.5 rounded-xl border border-[#304147]">
          <div className="text-left md:text-right">
            <div className="text-xs sm:text-sm text-[#E6E9D1]">
              {lang === 'zh' ? '已完成关卡：' : 'Completed: '}
              <strong className="text-[#EBC393] font-mono text-base font-bold">{completedCount}</strong> / 6
            </div>
            <div className="text-xs text-[#94A3B8]">
              {completedCount === 6
                ? (lang === 'zh' ? '※ 六大宝印已全部圆满收录' : '※ All sacred seals collected')
                : (lang === 'zh' ? '※ 循序攀登以解锁神话印记' : '※ Ascend in order to collect seals')}
            </div>
          </div>

          <button
            id="map-view-stamps-btn"
            onClick={() => {
              SoundEngine.playChime(3);
              onViewStamps();
            }}
            className="min-h-[44px] px-3.5 py-2 rounded-lg bg-[#47BBC1]/15 border border-[#47BBC1] text-[#47BBC1] text-xs sm:text-sm font-bold hover:bg-[#47BBC1]/25 transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(71,187,193,0.2)] shrink-0"
          >
            <Award className="w-4 h-4" />
            <span>{lang === 'zh' ? '查阅宝印谱' : 'View Sacred Seals'}</span>
          </button>
        </div>
      </div>

      {/* Layer Toggle Tabs (Both fit within mobile viewport with touch targets >= 44px) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-[#2A3940] pb-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            id="view-tab-map"
            onClick={() => {
              SoundEngine.playChime(1);
              setViewLayer('map');
            }}
            className={`flex-1 sm:flex-initial min-h-[44px] px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-2 rounded-xl transition-all ${
              viewLayer === 'map'
                ? 'bg-[#132B2A] text-[#47BBC1] border border-[#47BBC1] shadow-[0_0_12px_rgba(71,187,193,0.2)]'
                : 'text-[#94A3B8] hover:text-[#E6E9D1] bg-[#10171B] border border-transparent'
            }`}
          >
            <Compass className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">{lang === 'zh' ? '华山图卷' : 'Topographical Map'}</span>
          </button>

          <button
            id="view-tab-elevation"
            onClick={() => {
              SoundEngine.playChime(2);
              setViewLayer('elevation');
            }}
            className={`flex-1 sm:flex-initial min-h-[44px] px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-2 rounded-xl transition-all ${
              viewLayer === 'elevation'
                ? 'bg-[#132B2A] text-[#47BBC1] border border-[#47BBC1] shadow-[0_0_12px_rgba(71,187,193,0.2)]'
                : 'text-[#94A3B8] hover:text-[#E6E9D1] bg-[#10171B] border border-transparent'
            }`}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">{lang === 'zh' ? '海拔轨迹' : 'Elevation Profile'}</span>
          </button>
        </div>

        <div className="text-xs text-[#94A3B8] hidden sm:block">
          {freeExploreMode
            ? (lang === 'zh' ? '※ 自由探索模式生效中：可探访任意节点' : '※ Free Exploration Active: Access any checkpoint')
            : (lang === 'zh' ? '※ 循序探索模式生效中：按叙事顺序攀登' : '※ Guided Journey: Ascend in narrative order')}
        </div>
      </div>

      {/* Main Map View */}
      {viewLayer === 'map' ? (
        <>
          {/* MOBILE VIEW (Screens <= 768px, md:hidden): Clear Vertical Journey Timeline */}
          <div className="block md:hidden w-full bg-[#0E161B] rounded-2xl border border-[#47BBC1]/30 p-4 sm:p-6 shadow-2xl">
            <div className="mb-4 pb-3 border-b border-[#26353B] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#47BBC1]" />
                <h3 className="text-base font-serif font-bold text-[#E6E9D1]">
                  {lang === 'zh' ? '华山六大圣境 · 垂直登临路线' : 'Mount Hua Vertical Journey Timeline'}
                </h3>
              </div>
              <span className="text-xs text-[#EBC393] font-mono font-medium">380m → 2082m</span>
            </div>

            {/* Vertical Timeline List */}
            <div className="relative pl-6 sm:pl-8 space-y-6">
              {/* Continuous Visible Vertical Route Line */}
              <div className="absolute left-[15px] sm:left-[19px] top-4 bottom-4 w-1 bg-gradient-to-b from-[#47BBC1] via-[#357476] to-[#EBC393] rounded-full" />

              {CHECKPOINTS.map((cp, index) => {
                const completed = completedCheckpoints.includes(cp.id);
                const unlocked = isUnlocked(cp.id);
                const isSelected = selectedPreviewId === cp.id;

                const locationTitle = lang === 'zh' ? cp.location : cp.locationEn;
                const stageName = lang === 'zh' ? cp.stage : cp.stageEn;
                const chapterTitle = lang === 'zh' ? cp.chapterTitle : cp.chapterTitleEn;
                const summaryText = lang === 'zh' ? cp.summary : cp.summaryEn;
                const sealName = lang === 'zh' ? cp.stamp.name : cp.stamp.nameEn;

                return (
                  <div
                    key={cp.id}
                    id={`mobile-timeline-item-${cp.id}`}
                    className="relative group"
                  >
                    {/* Node Marker Pin on Vertical Line */}
                    <div
                      onClick={() => {
                        if (unlocked) {
                          SoundEngine.playChime(cp.id);
                          setSelectedPreviewId(cp.id);
                        }
                      }}
                      className={`absolute -left-[27px] sm:-left-[31px] top-3.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer z-10 ${
                        completed
                          ? 'border-[#47BBC1] bg-[#132B2A] text-[#47BBC1] shadow-[0_0_10px_rgba(71,187,193,0.5)]'
                          : unlocked
                          ? isSelected
                            ? 'border-[#EBC393] bg-[#1E2C33] text-[#EBC393] ring-4 ring-[#EBC393]/20 shadow-md'
                            : 'border-[#47BBC1]/70 bg-[#0E161B] text-[#E6E9D1] hover:border-[#47BBC1]'
                          : 'border-[#475569] bg-[#162026] text-[#94A3B8]'
                      }`}
                    >
                      {completed ? (
                        <CheckCircle2 className="w-4 h-4 text-[#47BBC1]" />
                      ) : unlocked ? (
                        <span className="font-bold text-xs sm:text-sm font-mono">{cp.id}</span>
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-[#94A3B8]" />
                      )}
                    </div>

                    {/* Checkpoint Card in 1 Full-Width Column */}
                    <div
                      onClick={() => {
                        if (unlocked) {
                          SoundEngine.playChime(cp.id);
                          setSelectedPreviewId(cp.id);
                        }
                      }}
                      className={`w-full p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'border-[#EBC393] bg-[#162228] shadow-lg'
                          : completed
                          ? 'border-[#47BBC1]/40 bg-[#0F191E] hover:border-[#47BBC1]'
                          : unlocked
                          ? 'border-[#304147] bg-[#0C1317] hover:border-[#47BBC1]/60'
                          : 'border-[#263238] bg-[#0A0F12] opacity-80'
                      }`}
                    >
                      {/* Top Meta Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 rounded bg-[#132B2A] text-[#47BBC1] font-medium border border-[#47BBC1]/30">
                            {lang === 'zh' ? `第${cp.id}幕 · ${stageName}` : `Act ${cp.id} · ${stageName}`}
                          </span>
                          <span className="text-xs font-mono font-bold text-[#EBC393]">
                            {cp.altitude}
                          </span>
                        </div>

                        <div>
                          {completed ? (
                            <span className="text-xs text-[#47BBC1] flex items-center gap-1 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {lang === 'zh' ? '已收录' : 'Completed'}
                            </span>
                          ) : unlocked ? (
                            <span className="text-xs text-[#EBC393] font-medium">
                              {lang === 'zh' ? '可探索' : 'Available'}
                            </span>
                          ) : (
                            <span className="text-xs text-[#94A3B8] flex items-center gap-1 font-medium">
                              <Lock className="w-3 h-3" />
                              {lang === 'zh' ? '未解锁' : 'Locked'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Location & Chapter Title */}
                      <h4
                        className={`text-lg font-serif font-bold mb-1 ${
                          unlocked ? 'text-[#E6E9D1]' : 'text-[#CBD5E1]'
                        }`}
                      >
                        {cp.id}. {locationTitle} · {chapterTitle}
                      </h4>

                      {/* 16px minimum body text for comfort and clarity */}
                      <p className="text-base text-[#CBD5E1] leading-relaxed mb-3">
                        {summaryText}
                      </p>

                      {/* Sacred Seal Indicator */}
                      <div className="text-xs text-[#94A3B8] flex items-center gap-1.5 mb-3">
                        <span className="text-[#EBC393]">🏛️</span>
                        <span>{lang === 'zh' ? '对应宝印：' : 'Sacred Seal: '}</span>
                        <strong className="text-[#EBC393] font-medium">{sealName}</strong>
                      </div>

                      {/* Full-width Touch Button (min 44px height) */}
                      {unlocked && (
                        <button
                          id={`mobile-open-act-btn-${cp.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            SoundEngine.playChime(cp.id);
                            onSelectCheckpoint(cp.id);
                          }}
                          className={`w-full min-h-[44px] py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                            completed
                              ? 'border border-[#47BBC1] bg-[#47BBC1]/15 text-[#47BBC1] hover:bg-[#47BBC1]/25'
                              : 'bg-gradient-to-r from-[#47BBC1] to-[#2E8C91] text-black font-bold shadow-[0_0_12px_rgba(71,187,193,0.3)]'
                          }`}
                        >
                          <span>
                            {completed
                              ? (lang === 'zh' ? '重温故事与宝印' : 'Review Story & Seal')
                              : (lang === 'zh' ? '进入故事情节 · 寻获宝印' : 'Enter Story & Collect Seal')}
                          </span>
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      )}

                      {!unlocked && (
                        <div className="text-xs text-[#94A3B8] italic pt-1">
                          {lang === 'zh'
                            ? '※ 请先完成前置节点以循序解锁此境'
                            : '※ Complete prior acts in Guided Journey to unlock'}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DESKTOP VIEW (Screens > 768px, hidden md:block): Illustrated Topographic Canvas Map */}
          <div className="hidden md:block relative w-full aspect-[16/9] bg-[#0A1014] rounded-2xl overflow-hidden border border-[#47BBC1]/30 shadow-2xl select-none">
            {/* Paper and Ink Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(71,187,193,0.12)_0%,rgba(10,16,20,0.92)_90%)] pointer-events-none z-10" />
            <div className="absolute inset-0 opacity-10 pointer-events-none z-10 bg-[radial-gradient(#E6E9D1_1px,transparent_1px)] bg-[size:20px_20px]" />

            {/* SVG Map Illustration Canvas */}
            <svg
              viewBox="0 0 1000 600"
              className="w-full h-full object-cover"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="ridgeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#122A2D" />
                  <stop offset="50%" stopColor="#224C4E" />
                  <stop offset="100%" stopColor="#357476" />
                </linearGradient>

                <linearGradient id="peakGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EBC393" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#47BBC1" stopOpacity="0" />
                </linearGradient>

                <filter id="glowEffect">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Mount Hua Topographical Massifs Background */}
              <g className="peaks-silhouette" opacity="0.65">
                <polygon points="50,600 200,320 380,600" fill="#0c1a1e" />
                <polygon points="300,600 480,240 680,600" fill="#10252a" />
                <polygon points="620,600 780,120 950,600" fill="#143136" />
                <polygon points="720,600 850,220 990,600" fill="#0d1e22" />
              </g>

              {/* Contour Elevation Lines */}
              <g opacity="0.22" stroke="#47BBC1" strokeWidth="1" fill="none" strokeDasharray="3,3">
                <path d="M 100 520 Q 300 490 500 510 T 900 480" />
                <path d="M 120 440 Q 350 410 580 430 T 920 390" />
                <path d="M 200 360 Q 420 310 650 330 T 880 280" />
                <path d="M 320 280 Q 550 200 750 220 T 950 180" />
                <path d="M 500 190 Q 680 120 800 130" />
              </g>

              {/* Major Geological Granite Formations */}
              <g className="granite-ridges">
                {/* West Peak Lotus Petal Crags */}
                <path
                  d="M 680 340 L 780 130 L 860 360 Z"
                  fill="url(#ridgeGradient)"
                  stroke="#47BBC1"
                  strokeWidth="1.5"
                  opacity="0.85"
                />
                <path d="M 780 130 L 780 360" stroke="#EBC393" strokeWidth="1" opacity="0.4" />
                <text x="780" y="110" textAnchor="middle" fill="#EBC393" fontSize="13" fontWeight="bold">
                  {lang === 'zh' ? '西峰莲花峰 (2082m)' : 'West Peak (2082m)'}
                </text>

                {/* Central Peak Jade Maiden */}
                <path
                  d="M 550 420 L 620 230 L 720 440 Z"
                  fill="url(#ridgeGradient)"
                  stroke="#47BBC1"
                  strokeWidth="1.5"
                  opacity="0.75"
                />
                <text x="620" y="215" textAnchor="middle" fill="#E6E9D1" fontSize="12">
                  {lang === 'zh' ? '中峰玉女峰 (2037m)' : 'Central Peak (2037m)'}
                </text>

                {/* North Peak Cloud Terrace */}
                <path
                  d="M 380 500 L 450 310 L 540 510 Z"
                  fill="url(#ridgeGradient)"
                  stroke="#47BBC1"
                  strokeWidth="1.5"
                  opacity="0.75"
                />
                <text x="450" y="295" textAnchor="middle" fill="#E6E9D1" fontSize="12">
                  {lang === 'zh' ? '北峰云台峰 (1614m)' : 'North Peak (1614m)'}
                </text>
              </g>

              {/* Classical Route Trajectory Connecting Trail */}
              <path
                d="M 160 492 Q 210 440 280 414 T 450 312 T 620 228 T 780 132 Q 830 180 880 276"
                fill="none"
                stroke="#EBC393"
                strokeWidth="4"
                strokeDasharray="6,4"
                opacity="0.6"
              />

              {/* Checkpoint Nodes & Markers on Desktop Map */}
              {CHECKPOINTS.map((cp) => {
                const cx = (cp.coordinates.mapX / 100) * 1000;
                const cy = (cp.coordinates.mapY / 100) * 600;
                const completed = completedCheckpoints.includes(cp.id);
                const unlocked = isUnlocked(cp.id);
                const isSelected = selectedPreviewId === cp.id;
                const isHovered = hoveredId === cp.id;

                const locationTitle = lang === 'zh' ? cp.location : cp.locationEn;

                return (
                  <g
                    key={cp.id}
                    id={`map-node-${cp.id}`}
                    className="cursor-pointer transition-all duration-300"
                    onMouseEnter={() => setHoveredId(cp.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => {
                      if (unlocked) {
                        SoundEngine.playChime(cp.id);
                        setSelectedPreviewId(cp.id);
                      }
                    }}
                  >
                    {/* Outer Glow Halo */}
                    {(isSelected || isHovered) && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r="32"
                        fill="none"
                        stroke={isSelected ? '#EBC393' : '#47BBC1'}
                        strokeWidth="2"
                        opacity="0.8"
                        className="animate-pulse"
                      />
                    )}

                    {/* Base Circle */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? '20' : '16'}
                      fill={
                        completed
                          ? '#10282C'
                          : isSelected
                          ? '#233842'
                          : unlocked
                          ? '#121F24'
                          : '#11171A'
                      }
                      stroke={
                        completed
                          ? '#47BBC1'
                          : isSelected
                          ? '#EBC393'
                          : unlocked
                          ? '#47BBC1'
                          : '#475569'
                      }
                      strokeWidth={isSelected ? '3' : '2'}
                    />

                    {/* Center Icon */}
                    {completed ? (
                      <g transform={`translate(${cx - 7}, ${cy - 7})`}>
                        <path
                          d="M3 8 L6 11 L12 4"
                          stroke="#47BBC1"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </g>
                    ) : unlocked ? (
                      <text
                        x={cx}
                        y={cy + 5}
                        textAnchor="middle"
                        fill={isSelected ? '#EBC393' : '#E6E9D1'}
                        fontSize={isSelected ? '14' : '12'}
                        fontWeight="bold"
                      >
                        {cp.id}
                      </text>
                    ) : (
                      <g transform={`translate(${cx - 6}, ${cy - 7})`} opacity="0.8">
                        <rect x="1" y="5" width="10" height="8" rx="2" fill="#94A3B8" />
                        <path d="M3 5 V3 A3 3 0 0 1 9 3 V5" stroke="#94A3B8" strokeWidth="1.5" fill="none" />
                      </g>
                    )}

                    {/* High-Contrast Node Flag Label */}
                    <g transform={`translate(${cx}, ${cy - (isSelected ? 34 : 26)})`}>
                      <rect
                        x="-70"
                        y="-16"
                        width="140"
                        height="24"
                        rx="6"
                        fill={isSelected ? '#182C33' : '#0F171C'}
                        stroke={isSelected ? '#EBC393' : unlocked ? '#304147' : '#475569'}
                        strokeWidth="1.5"
                        opacity="0.95"
                      />
                      <text
                        x="0"
                        y="0"
                        textAnchor="middle"
                        fill={isSelected ? '#EBC393' : unlocked ? '#F1F5F9' : '#CBD5E1'}
                        fontSize="11"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                      >
                        {cp.id}. {locationTitle}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>

            {/* Interactive Route Guide Callout Card on Desktop */}
            <div className="absolute top-4 left-4 z-20 flex items-start gap-3 p-3.5 rounded-xl border border-[#47BBC1]/30 bg-[#0E161B]/95 backdrop-blur-md max-w-xs shadow-xl">
              <Info className="w-5 h-5 text-[#47BBC1] shrink-0 mt-0.5" />
              <div className="text-xs text-[#CBD5E1] leading-relaxed">
                <strong className="text-[#EBC393] block mb-0.5">
                  {lang === 'zh' ? '交互图卷指引' : 'Interactive Route Guide'}
                </strong>
                {lang === 'zh'
                  ? '点击任意关卡节点打开剧情档案，考察古迹历史，并寻获专属宝印。'
                  : 'Click any checkpoint marker to open its narrative story card, examine the physical heritage, and collect its sacred seal.'}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Elevation Profile Trajectory View */
        <div className="w-full bg-[#0E161B] rounded-2xl border border-[#47BBC1]/30 p-4 sm:p-8 shadow-2xl">
          <div className="mb-6">
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#E6E9D1]">
              {lang === 'zh' ? '华山险道海拔与叙事层级' : 'Mount Hua Elevation & Narrative Trajectory'}
            </h3>
            <p className="text-sm text-[#94A3B8] mt-1">
              {lang === 'zh'
                ? '直观展示从山麓谷地（380米）至西峰绝壁（2,082米）的物理与心性攀升历程'
                : 'Visualizing the physical ascent from the valley gateway (380m) to West Peak Lotus Summit (2,082m)'}
            </p>
          </div>

          {/* 1 column on mobile, 6 columns on md screens */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {CHECKPOINTS.map((cp) => {
              const completed = completedCheckpoints.includes(cp.id);
              const unlocked = isUnlocked(cp.id);
              const isSelected = selectedPreviewId === cp.id;

              const locationTitle = lang === 'zh' ? cp.location : cp.locationEn;
              const chapterTitle = lang === 'zh' ? cp.chapterTitle : cp.chapterTitleEn;

              return (
                <div
                  key={cp.id}
                  id={`elevation-card-${cp.id}`}
                  onClick={() => {
                    if (unlocked) {
                      SoundEngine.playChime(cp.id);
                      setSelectedPreviewId(cp.id);
                    }
                  }}
                  className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between cursor-pointer min-h-[140px] ${
                    isSelected
                      ? 'border-[#EBC393] bg-[#1A252C] shadow-lg'
                      : completed
                      ? 'border-[#47BBC1]/60 bg-[#101D21] hover:border-[#47BBC1]'
                      : unlocked
                      ? 'border-[#304147] bg-[#0D1418] hover:border-[#47BBC1]'
                      : 'border-[#263238] bg-[#0A0E11] opacity-80 cursor-not-allowed'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-[#47BBC1] font-medium">
                        {lang === 'zh' ? `第${cp.id}幕` : `Act ${cp.id}`}
                      </span>
                      <span className="font-mono text-[#EBC393] text-xs font-bold">
                        {cp.altitude}
                      </span>
                    </div>

                    <h4 className="text-base font-serif font-bold text-[#E6E9D1] mb-1">
                      {locationTitle}
                    </h4>
                    <p className="text-sm text-[#94A3B8] line-clamp-2">
                      {chapterTitle}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#26353B] flex items-center justify-between text-xs">
                    {completed ? (
                      <span className="text-[#47BBC1] flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {lang === 'zh' ? '宝印已收录' : 'Seal Collected'}
                      </span>
                    ) : unlocked ? (
                      <span className="text-[#EBC393] font-medium">
                        {lang === 'zh' ? '进入关卡 →' : 'Explore Act →'}
                      </span>
                    ) : (
                      <span className="text-[#94A3B8] flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        {lang === 'zh' ? '未解锁' : 'Locked'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Docked Detail Card for Selected Checkpoint (Full width column, 16px min padding, 16px min body text) */}
      <div className="p-4 sm:p-6 rounded-2xl border border-[#47BBC1]/40 bg-[#0F171C] shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
          <div className="shrink-0 self-center sm:self-auto">
            <SealStamp
              stamp={activeCheckpoint.stamp}
              lang={lang}
              size="md"
              isCollected={completedCheckpoints.includes(activeCheckpoint.id)}
            />
          </div>

          <div className="w-full">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded bg-[#16242B] border border-[#304147] text-[#47BBC1] text-xs font-medium">
                {lang === 'zh'
                  ? `第${activeCheckpoint.id}幕 · ${activeCheckpoint.stage} · ${activeCheckpoint.chapterTitle}`
                  : `Act ${activeCheckpoint.id} · ${activeCheckpoint.stageEn} · ${activeCheckpoint.chapterTitleEn}`}
              </span>
              <span className="text-xs text-[#EBC393] font-mono font-bold">
                {activeCheckpoint.altitude}
              </span>
              {completedCheckpoints.includes(activeCheckpoint.id) && (
                <span className="text-xs text-[#47BBC1] flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {lang === 'zh' ? '宝印已收录' : 'Sacred Seal Collected'}
                </span>
              )}
            </div>

            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#E6E9D1]">
              {lang === 'zh' ? activeCheckpoint.location : activeCheckpoint.locationEn}
            </h3>

            {/* 16px minimum body text */}
            <p className="text-base text-[#CBD5E1] mt-1 max-w-3xl leading-relaxed">
              {lang === 'zh' ? activeCheckpoint.summary : activeCheckpoint.summaryEn}
            </p>

            <div className="mt-2 text-xs sm:text-sm text-[#EBC393] flex items-center gap-2">
              <span>
                🏛️ {lang === 'zh' ? '宝印：' : 'Sacred Seal: '}
                <strong>{lang === 'zh' ? activeCheckpoint.stamp.name : activeCheckpoint.stamp.nameEn}</strong>
                {' '}({lang === 'zh' ? activeCheckpoint.stamp.motif : activeCheckpoint.stamp.motifEn})
              </span>
            </div>
          </div>
        </div>

        {/* Action Button: Full-width on mobile (w-full lg:w-auto, min 48px height) */}
        <div className="w-full lg:w-auto shrink-0">
          <button
            id={`open-story-btn-${activeCheckpoint.id}`}
            onClick={() => {
              SoundEngine.playChime(activeCheckpoint.id);
              onSelectCheckpoint(activeCheckpoint.id);
            }}
            className="w-full lg:w-auto min-h-[48px] px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#47BBC1] to-[#2E8C91] text-black font-bold text-base tracking-wide hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(71,187,193,0.3)] flex items-center justify-center gap-2"
          >
            <span>
              {completedCheckpoints.includes(activeCheckpoint.id)
                ? (lang === 'zh' ? '重温故事与宝印' : 'Review Story & Seal')
                : (lang === 'zh' ? '进入故事情节 · 寻获宝印' : 'Read Story & Collect Seal')}
            </span>
            <ArrowUpRight className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
};
