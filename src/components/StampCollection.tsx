import React, { useState } from 'react';
import { CHECKPOINTS } from '../data/checkpointsData';
import { Language, StampData } from '../types';
import { SealStamp } from './SealStamp';
import { SoundEngine } from '../utils/soundEffects';
import { Award, Sparkles, CheckCircle2, ArrowRight, Printer, Compass, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StampCollectionProps {
  lang?: Language;
  collectedStamps: string[];
  onSelectCheckpoint: (id: number) => void;
  onEnterMap: () => void;
}

export const StampCollection: React.FC<StampCollectionProps> = ({
  lang = 'en',
  collectedStamps,
  onSelectCheckpoint,
  onEnterMap,
}) => {
  const [selectedStamp, setSelectedStamp] = useState<{ stamp: StampData; checkpointId: number } | null>(null);
  const [studentName, setStudentName] = useState(lang === 'zh' ? '研学探索者' : 'Student Explorer');
  const [showCertificate, setShowCertificate] = useState(false);

  const completedCount = collectedStamps.length;
  const isAllCollected = completedCount === CHECKPOINTS.length;

  const handleOpenCertificate = () => {
    SoundEngine.playChime(5);
    confetti({
      particleCount: 70,
      spread: 80,
      colors: ['#47BBC1', '#EBC393', '#C04838', '#E6E9D1'],
    });
    setShowCertificate(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col gap-6 w-full overflow-x-hidden">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 rounded-2xl border border-[#47BBC1]/30 bg-[#0E161B] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden w-full">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#EBC393] mb-1.5 font-medium">
            <Award className="w-4 h-4 text-[#47BBC1]" />
            <span>
              {lang === 'zh'
                ? '华山文化遗产 · 宝印谱'
                : 'Mount Hua Cultural Heritage · Sacred Seal Collection'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#47BBC1]">
            {lang === 'zh' ? '宝印谱' : 'Sacred Seal Collection'}
          </h1>
          <p className="text-sm sm:text-base text-[#94A3B8] mt-1">
            {lang === 'zh'
              ? '沿华山传说路线探访六大圣境，收集并鉴赏传世宝印'
              : 'Sacred seal impressions collected along the Mount Hua Legend Route'}
          </p>
        </div>

        {/* Progress summary & Certificate button */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-[#131D22] p-3.5 sm:p-4 rounded-xl border border-[#304147]">
          <div>
            <div className="text-xs sm:text-sm text-[#E6E9D1]">
              {lang === 'zh' ? '已收录宝印：' : 'Seals Collected: '}
              <strong className="text-[#EBC393] text-base font-mono font-bold">{completedCount}</strong> / 6
            </div>
            <div className="text-xs text-[#94A3B8]">
              {isAllCollected
                ? (lang === 'zh' ? '※ 六大宝印已全部圆满收录' : '※ All sacred seals collected')
                : (lang === 'zh' ? '※ 登临各境以集齐宝印' : '※ Ascend all checkpoints to collect seals')}
            </div>
          </div>

          {isAllCollected ? (
            <button
              id="open-certificate-btn"
              onClick={handleOpenCertificate}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-gradient-to-r from-[#EBC393] to-[#D4A66B] text-black font-bold text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-[0_0_12px_rgba(235,195,147,0.4)] flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>{lang === 'zh' ? '查看研学荣誉证书' : 'View Journey Certificate'}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                SoundEngine.playChime(1);
                onEnterMap();
              }}
              className="min-h-[44px] px-3.5 py-2 rounded-xl border border-[#47BBC1]/40 bg-[#47BBC1]/10 text-[#47BBC1] text-xs sm:text-sm font-medium hover:bg-[#47BBC1]/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Compass className="w-4 h-4" />
              <span>{lang === 'zh' ? '前往华山图卷' : 'Return to Route Map'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of the 6 Seals (Album Book Layout, 1 column on mobile, 2 sm, 3 lg) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
        {CHECKPOINTS.map((cp) => {
          const isCollected = collectedStamps.includes(cp.stamp.id);
          const locationTitle = lang === 'zh' ? cp.location : cp.locationEn;
          const sealName = lang === 'zh' ? cp.stamp.name : cp.stamp.nameEn;
          const sealDesc = lang === 'zh' ? cp.stamp.description : cp.stamp.descriptionEn;

          return (
            <div
              key={cp.id}
              id={`stamp-card-${cp.id}`}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative flex flex-col justify-between ${
                isCollected
                  ? 'border-[#47BBC1]/50 bg-[#0F181D] hover:border-[#47BBC1] shadow-lg'
                  : 'border-[#29353B] bg-[#0A1014] opacity-70'
              }`}
            >
              {/* Corner Traditional Decorative Accent */}
              <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#EBC393]/40" />

              <div>
                {/* Stage tag and Location */}
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="px-2.5 py-1 rounded bg-[#162228] border border-[#304147] text-[#47BBC1] font-medium">
                    {lang === 'zh' ? `第${cp.id}幕 · ${locationTitle}` : `Act ${cp.id} · ${locationTitle}`}
                  </span>
                  <span className="text-xs text-[#EBC393] font-mono font-bold">{cp.altitude}</span>
                </div>

                {/* Central Seal Display */}
                <div className="py-4 flex items-center justify-center">
                  <SealStamp
                    stamp={cp.stamp}
                    lang={lang}
                    size="lg"
                    isCollected={isCollected}
                    onClick={() => {
                      SoundEngine.playChime(cp.id);
                      setSelectedStamp({ stamp: cp.stamp, checkpointId: cp.id });
                    }}
                    interactive={true}
                  />
                </div>

                <div className="text-center mt-2">
                  <h3 className="text-base sm:text-lg font-serif font-bold text-[#E6E9D1]">
                    {sealName}
                  </h3>
                  <p className="text-xs text-[#EBC393] mt-0.5 font-medium">
                    {lang === 'zh' ? `印铭：【${sealName}】` : `Inscription: [${sealName}]`}
                  </p>
                  <p className="text-sm text-[#CBD5E1] mt-2 line-clamp-2 leading-relaxed">
                    {sealDesc}
                  </p>
                </div>
              </div>

              {/* Action Button: Touch friendly >= 44px */}
              <div className="mt-4 pt-3 border-t border-[#253338] flex items-center justify-between text-xs sm:text-sm">
                {isCollected ? (
                  <span className="text-[#47BBC1] flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#47BBC1]" />
                    {lang === 'zh' ? '宝印已收录' : 'Seal Collected'}
                  </span>
                ) : (
                  <span className="text-[#94A3B8] font-medium">
                    {lang === 'zh' ? '宝印未解锁' : 'Seal Locked'}
                  </span>
                )}

                <button
                  id={`goto-story-from-stamp-${cp.id}`}
                  onClick={() => {
                    SoundEngine.playChime(cp.id);
                    onSelectCheckpoint(cp.id);
                  }}
                  className="min-h-[44px] px-2 text-[#EBC393] hover:text-white flex items-center gap-1 font-medium"
                >
                  <span>{isCollected ? (lang === 'zh' ? '重温故事' : 'Review Story') : (lang === 'zh' ? '前往探索' : 'Explore Act')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Seal Detail Inspection Modal */}
      {selectedStamp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl border border-[#47BBC1]/60 bg-[#0F171C] p-6 shadow-2xl my-auto">
            <button
              onClick={() => setSelectedStamp(null)}
              className="min-h-[44px] min-w-[44px] absolute top-3 right-3 flex items-center justify-center rounded-lg border border-[#304147] text-[#94A3B8] hover:text-[#E6E9D1]"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-[#EBC393]" />
            </button>

            <div className="text-center mb-4 pr-8">
              <span className="text-xs text-[#EBC393] font-medium">
                {lang === 'zh' ? '宝印鉴赏与文化内涵' : 'Seal Connoisseurship & Cultural Context'}
              </span>
              <h2 className="text-xl font-serif font-bold text-[#47BBC1] mt-1">
                {lang === 'zh' ? selectedStamp.stamp.name : selectedStamp.stamp.nameEn}
              </h2>
            </div>

            <div className="flex justify-center my-6">
              <SealStamp
                stamp={selectedStamp.stamp}
                lang={lang}
                size="xl"
                isCollected={collectedStamps.includes(selectedStamp.stamp.id)}
              />
            </div>

            <div className="space-y-3 text-sm text-[#CBD5E1] bg-[#141F25] p-4 rounded-xl border border-[#304147] leading-relaxed">
              <div>
                <strong className="text-[#EBC393]">{lang === 'zh' ? '纹饰与图腾：' : 'Motif & Symbol: '}</strong>
                <span>{lang === 'zh' ? selectedStamp.stamp.motif : selectedStamp.stamp.motifEn}</span>
              </div>
              <div>
                <strong className="text-[#47BBC1]">{lang === 'zh' ? '文化意蕴：' : 'Cultural Meaning: '}</strong>
                <span>{lang === 'zh' ? selectedStamp.stamp.description : selectedStamp.stamp.descriptionEn}</span>
              </div>
              <div>
                <strong className="text-[#E6E9D1]">{lang === 'zh' ? '对应关卡：' : 'Corresponding Act: '}</strong>
                <span>
                  {lang === 'zh'
                    ? `${CHECKPOINTS[selectedStamp.checkpointId - 1].chapterTitle}（${CHECKPOINTS[selectedStamp.checkpointId - 1].location}）`
                    : `${CHECKPOINTS[selectedStamp.checkpointId - 1].chapterTitleEn} (${CHECKPOINTS[selectedStamp.checkpointId - 1].locationEn})`}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedStamp(null);
                  onSelectCheckpoint(selectedStamp.checkpointId);
                }}
                className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#47BBC1] text-black font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center"
              >
                <span>{lang === 'zh' ? '进入故事情节 →' : 'Read Story Act →'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completion Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border-2 border-[#EBC393] bg-[#0E151A] p-4 sm:p-8 shadow-2xl my-6">
            <button
              onClick={() => setShowCertificate(false)}
              className="min-h-[44px] min-w-[44px] absolute top-3 right-3 flex items-center justify-center rounded-lg border border-[#304147] text-[#94A3B8] hover:text-[#E6E9D1]"
              aria-label="Close certificate"
            >
              <X className="w-5 h-5 text-[#EBC393]" />
            </button>

            {/* Traditional Certificate Border */}
            <div className="border border-dashed border-[#EBC393]/70 p-4 sm:p-6 rounded-xl relative text-center">
              <div className="text-xs text-[#47BBC1] tracking-widest uppercase mb-1 font-medium">
                ※ {lang === 'zh' ? '华山传说路线 · 结营研学荣誉证书' : 'Mount Hua Legend Route · Completion Certificate'} ※
              </div>
              <h2 className="text-xl sm:text-3xl font-serif font-bold text-[#EBC393] tracking-wider mb-2">
                {lang === 'zh' ? '宝莲灯 · 华山研学荣誉证书' : 'The Lotus Lantern · Mount Hua Journey Honor Certificate'}
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] mb-6">
                {lang === 'zh' ? '神话研学文化探索结业认证' : 'Certificate of Mythological Route Completion'}
              </p>

              {/* Student Name Input */}
              <div className="my-4 max-w-sm mx-auto">
                <label className="block text-xs text-[#94A3B8] mb-1">
                  {lang === 'zh' ? '探索者姓名：' : 'Participant Name:'}
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full text-center px-3 py-2 rounded-lg bg-[#141E24] border border-[#47BBC1]/60 text-[#E6E9D1] font-bold text-base focus:outline-none focus:border-[#EBC393]"
                />
              </div>

              {/* Commendation text */}
              <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed max-w-lg mx-auto my-4 text-justify sm:text-center">
                {lang === 'zh'
                  ? '兹证明探索者已圆满完成西岳华山《宝莲灯》神话主题文化研学历程。历经游客中心、玉泉院、北峰、中峰、西峰及西峰索道六大圣境，集齐六枚传世宝印，体悟坚毅、仁爱与至孝之精神品格，特颁此证，以资鼓励。'
                  : 'This is to certify that the explorer has completed the cultural journey across the six sacred sites of Mount Hua in the myth of the Lotus Lantern. Ascending through the Visitor Center, Yuquan Temple, North Peak, Central Peak, West Peak, and the West Peak Cableway, all six sacred seals have been successfully collected in honor of filial love, courage, and perseverance.'}
              </p>

              {/* The 6 Imprinted Seals in a Responsive Grid (3 columns on mobile, 6 on sm) */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 my-6 pt-4 border-t border-[#304147]">
                {CHECKPOINTS.map((cp) => (
                  <div key={cp.id} className="flex flex-col items-center">
                    <SealStamp stamp={cp.stamp} lang={lang} size="sm" isCollected={true} />
                    <span className="text-xs text-[#EBC393] mt-1 text-center truncate w-full">
                      {lang === 'zh' ? cp.location : cp.locationEn}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer Stamp & Date */}
              <div className="flex items-center justify-between pt-4 border-t border-[#304147] text-xs text-[#94A3B8]">
                <div>{lang === 'zh' ? '评级：特优卓越' : 'Evaluation: Highest Distinction'}</div>
                <div>{lang === 'zh' ? '研学认证时间：2026年秋' : 'Date of Conferment: Autumn 2026'}</div>
              </div>
            </div>

            {/* Action buttons (Full width on mobile) */}
            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-[#EBC393]/60 bg-[#162026] text-[#EBC393] text-sm flex items-center justify-center gap-1.5 hover:bg-[#EBC393]/10"
              >
                <Printer className="w-4 h-4" />
                <span>{lang === 'zh' ? '打印 / 保存证书' : 'Print / Save Certificate'}</span>
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-[#47BBC1] text-black font-bold text-sm hover:brightness-110 flex items-center justify-center"
              >
                {lang === 'zh' ? '珍藏收录' : 'Close & Keep'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
