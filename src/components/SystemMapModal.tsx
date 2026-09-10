import React, { useEffect } from 'react';
import { Language } from '../types';
import {
  X,
  User,
  Layout,
  BookOpen,
  CheckCircle2,
  Database,
  Sparkles,
  ArrowDown,
  ArrowRight,
  Compass,
  Award,
  Layers,
  Camera,
  MapPin,
  HelpCircle,
} from 'lucide-react';
import { SoundEngine } from '../utils/soundEffects';

interface SystemMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onToggleLang?: () => void;
}

export const SystemMapModal: React.FC<SystemMapModalProps> = ({
  isOpen,
  onClose,
  lang,
  onToggleLang,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl rounded-2xl border border-[#47BBC1]/50 bg-[#0B1014] text-[#E6E9D1] shadow-2xl my-auto overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#22333B] bg-[#0E161B] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl border border-[#47BBC1] bg-[#132B2A] flex items-center justify-center text-[#47BBC1] shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[#E6E9D1] flex items-center gap-2">
                <span>{lang === 'zh' ? '系统图解与原型架构' : 'About & System Map'}</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#47BBC1]/15 text-[#47BBC1] border border-[#47BBC1]/30 font-sans font-medium">
                  {lang === 'zh' ? '设计说明' : 'Prototype Blueprint'}
                </span>
              </h2>
              <p className="text-xs text-[#94A3B8]">
                {lang === 'zh'
                  ? 'MythTrial 华山神话研学路线的交互流程与系统架构'
                  : 'Interaction flow, data architecture, and conceptual extensions of MythTrial'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onToggleLang && (
              <button
                id="modal-lang-toggle"
                onClick={() => {
                  SoundEngine.playChime(2);
                  onToggleLang();
                }}
                className="min-h-[40px] px-3 py-1.5 rounded-lg border border-[#47BBC1]/40 bg-[#121A1E] text-xs font-medium text-[#E6E9D1] hover:border-[#47BBC1] transition-colors"
                title={lang === 'zh' ? 'Switch to English' : '切换为中文'}
              >
                <span className={lang === 'zh' ? 'text-[#47BBC1] font-bold' : 'text-[#94A3B8]'}>中</span>
                <span className="text-[#47BBC1]/40 mx-1">/</span>
                <span className={lang === 'en' ? 'text-[#47BBC1] font-bold' : 'text-[#94A3B8]'}>EN</span>
              </button>
            )}

            <button
              id="close-system-map-btn"
              onClick={() => {
                SoundEngine.playChime(1);
                onClose();
              }}
              aria-label="Close dialog"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-[#304147] text-[#94A3B8] hover:text-[#E6E9D1] hover:bg-[#162228] transition-colors"
            >
              <X className="w-5 h-5 text-[#EBC393]" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Brief Overview Card */}
          <div className="p-4 sm:p-5 rounded-xl border border-[#47BBC1]/30 bg-[#0E171D] leading-relaxed">
            <h3 className="text-sm font-bold text-[#EBC393] mb-1.5 flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#47BBC1]" />
              <span>{lang === 'zh' ? '原型定位与核心目标' : 'Prototype Mission & Concept'}</span>
            </h3>
            <p className="text-sm text-[#CBD5E1]">
              {lang === 'zh'
                ? 'MythTrial（华山神话研学路线）将西岳华山从游客中心（380米）至西峰巨莲（2,082米）的真实登山路径，与《宝莲灯》沉香劈山救母的六幕叙事无缝映射。通过双语交互地图、文化背景档案和传世宝印收集，为家庭访客与研学团队带来兼具地理考察与传统孝义文化的沉浸式研学体验。'
                : 'MythTrial seamlessly maps the physical ascent of Mount Hua—from the Visitor Center (380m) to West Peak (2,082m)—onto the six-act epic of The Lotus Lantern (Chenxiang saving his mother). Through bilingual narrative cards, an illustrated trail map, and digital sacred seal imprints, it guides family visitors and cultural learners through both physical geography and enduring filial heritage.'}
            </p>
          </div>

          {/* Primary Interaction Flow Banner */}
          <div className="p-3.5 sm:p-4 rounded-xl border border-[#304147] bg-[#121B21]">
            <div className="text-xs uppercase tracking-wider font-bold text-[#47BBC1] mb-2">
              {lang === 'zh' ? '主交互流向链路' : 'Primary Interaction Flow'}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-[#E6E9D1]">
              <span className="px-2.5 py-1 rounded bg-[#1A262C] border border-[#47BBC1]/40 text-[#47BBC1]">
                {lang === 'zh' ? '1. 访客探索者' : '1. User / Visitor'}
              </span>
              <span className="text-[#47BBC1]">→</span>
              <span className="px-2.5 py-1 rounded bg-[#1A262C] border border-[#47BBC1]/40 text-[#47BBC1]">
                {lang === 'zh' ? '2. 双语交互界面' : '2. Interface'}
              </span>
              <span className="text-[#47BBC1]">→</span>
              <span className="px-2.5 py-1 rounded bg-[#1A262C] border border-[#EBC393]/40 text-[#EBC393]">
                {lang === 'zh' ? '3. 关卡故事情节' : '3. Checkpoint Story'}
              </span>
              <span className="text-[#EBC393]">→</span>
              <span className="px-2.5 py-1 rounded bg-[#1A262C] border border-[#C04838]/60 text-[#EBC393]">
                {lang === 'zh' ? '4. 传世宝印收录' : '4. Sacred Seal'}
              </span>
              <span className="text-[#EBC393]">→</span>
              <span className="px-2.5 py-1 rounded bg-[#1A262C] border border-[#304147] text-[#94A3B8]">
                {lang === 'zh' ? '5. 进度本地保存' : '5. Progress Storage'}
              </span>
              <span className="text-[#94A3B8]">→</span>
              <span className="px-2.5 py-1 rounded bg-[#1A262C] border border-[#47BBC1]/40 text-[#47BBC1]">
                {lang === 'zh' ? '6. 解锁下一圣境' : '6. Next Checkpoint'}
              </span>
            </div>
          </div>

          {/* SYSTEM ARCHITECTURE DIAGRAM */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-serif font-bold text-[#E6E9D1] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#47BBC1]" />
                <span>{lang === 'zh' ? '系统六大核心组件与连接拓扑' : 'Six System Components & Architectural Topology'}</span>
              </h3>
              <span className="text-xs text-[#94A3B8] hidden sm:inline">
                {lang === 'zh' ? '包含已上线模块与规划中的未来 AR 层' : 'Live prototype modules & proposed future AR layer'}
              </span>
            </div>

            {/* DESKTOP & TABLET DIAGRAM (md:block hidden) */}
            <div className="hidden md:block p-6 rounded-2xl border border-[#304147] bg-[#0E151A] relative shadow-inner">
              <div className="grid grid-cols-3 gap-6 relative">
                {/* 1. User Component */}
                <div className="p-4 rounded-xl border-2 border-[#47BBC1] bg-[#122227] flex flex-col justify-between relative shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#47BBC1] uppercase tracking-wider">01 · USER</span>
                    <span className="px-2 py-0.5 rounded bg-[#47BBC1]/20 text-[#47BBC1] text-[10px] font-bold">
                      {lang === 'zh' ? '实体角色' : 'Entity'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 my-2">
                    <div className="w-10 h-10 rounded-full bg-[#1A3337] border border-[#47BBC1] flex items-center justify-center text-[#47BBC1]">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-serif font-bold text-[#E6E9D1]">
                        {lang === 'zh' ? '访客与研学家庭' : 'Visitor & Family'}
                      </h4>
                      <p className="text-xs text-[#94A3B8]">
                        {lang === 'zh' ? '华山游客 / 文化研学家庭成员' : 'Family member or Mount Hua visitor'}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-[#CBD5E1] mt-2 border-t border-[#1C3A3C] pt-2">
                    {lang === 'zh'
                      ? '在登山前或登山途中浏览神话情节，了解传统孝义与自然奇观。'
                      : 'Explores mythology and mountain heritage before or during the ascent.'}
                  </p>
                </div>

                {/* 2. Interface Component */}
                <div className="p-4 rounded-xl border-2 border-[#47BBC1] bg-[#102327] flex flex-col justify-between relative shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#47BBC1] uppercase tracking-wider">02 · INTERFACE</span>
                    <span className="px-2 py-0.5 rounded bg-[#47BBC1]/20 text-[#47BBC1] text-[10px] font-bold">
                      {lang === 'zh' ? '交互呈现' : 'Front-End UI'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 my-2">
                    <div className="w-10 h-10 rounded-full bg-[#18363B] border border-[#47BBC1] flex items-center justify-center text-[#47BBC1]">
                      <Layout className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-serif font-bold text-[#E6E9D1]">
                        {lang === 'zh' ? '双语交互界面' : 'Bilingual Interface'}
                      </h4>
                      <p className="text-xs text-[#94A3B8]">
                        {lang === 'zh' ? '图卷 / 故事卡 / 宝印谱' : 'Route map, story cards & seals'}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-[#CBD5E1] mt-2 border-t border-[#1C3A3C] pt-2">
                    {lang === 'zh'
                      ? '中文/英文一键即时切换，支持图卷模式、海拔轨迹与全屏宝印谱鉴赏。'
                      : 'Bilingual navigation, topographic scroll, narrative cards, and seal album.'}
                  </p>
                </div>

                {/* 3. Story System Component */}
                <div className="p-4 rounded-xl border-2 border-[#EBC393] bg-[#1C1F22] flex flex-col justify-between relative shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#EBC393] uppercase tracking-wider">03 · STORY SYSTEM</span>
                    <span className="px-2 py-0.5 rounded bg-[#EBC393]/20 text-[#EBC393] text-[10px] font-bold">
                      {lang === 'zh' ? '叙事图谱' : 'Narrative Matrix'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 my-2">
                    <div className="w-10 h-10 rounded-full bg-[#2A2925] border border-[#EBC393] flex items-center justify-center text-[#EBC393]">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-serif font-bold text-[#E6E9D1]">
                        {lang === 'zh' ? '华山六幕叙事系统' : 'Story Narrative System'}
                      </h4>
                      <p className="text-xs text-[#EBC393]">
                        {lang === 'zh' ? '6处地标 ↔ 6幕经典传说' : '6 Checkpoints ↔ 6 Acts'}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-[#CBD5E1] mt-2 border-t border-[#31302A] pt-2">
                    {lang === 'zh'
                      ? '从游客中心身世缘起、玉泉院大难降临，直至西峰绝壁劈山救母。'
                      : 'Maps real landmarks (380m to 2,082m) directly to The Lotus Lantern acts.'}
                  </p>
                </div>

                {/* 4. Interaction State Component */}
                <div className="p-4 rounded-xl border-2 border-[#47BBC1]/80 bg-[#121B20] flex flex-col justify-between relative shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#47BBC1] uppercase tracking-wider">04 · INTERACTION STATE</span>
                    <span className="px-2 py-0.5 rounded bg-[#47BBC1]/20 text-[#47BBC1] text-[10px] font-bold">
                      {lang === 'zh' ? '运行状态' : 'Runtime State'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 my-2">
                    <div className="w-10 h-10 rounded-full bg-[#182B31] border border-[#47BBC1] flex items-center justify-center text-[#47BBC1]">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-serif font-bold text-[#E6E9D1]">
                        {lang === 'zh' ? '探索状态管理器' : 'Interaction State'}
                      </h4>
                      <p className="text-xs text-[#94A3B8]">
                        {lang === 'zh' ? '关卡解锁 / 宝印收集 / 模式' : 'Unlocked acts & collected seals'}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-[#CBD5E1] mt-2 border-t border-[#23353D] pt-2">
                    {lang === 'zh'
                      ? '实时响应盖印操作，管理循序探索与自由模式，计算登临百分比。'
                      : 'Tracks completed stops, seal imprints, and triggers the completion certificate.'}
                  </p>
                </div>

                {/* 5. Local Storage Component */}
                <div className="p-4 rounded-xl border-2 border-[#304147] bg-[#11171C] flex flex-col justify-between relative shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#CBD5E1] uppercase tracking-wider">05 · LOCAL STORAGE</span>
                    <span className="px-2 py-0.5 rounded bg-[#304147] text-[#CBD5E1] text-[10px] font-bold">
                      {lang === 'zh' ? '本地持久化' : 'Persistence'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 my-2">
                    <div className="w-10 h-10 rounded-full bg-[#182126] border border-[#3A4E57] flex items-center justify-center text-[#CBD5E1]">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-serif font-bold text-[#E6E9D1]">
                        {lang === 'zh' ? '浏览器本地存储' : 'Local Storage'}
                      </h4>
                      <p className="text-xs text-[#94A3B8]">
                        {lang === 'zh' ? '记忆语言偏好与登山进度' : 'Language & progress preservation'}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-[#CBD5E1] mt-2 border-t border-[#222E35] pt-2">
                    {lang === 'zh'
                      ? '刷新页面或关闭标签后仍完整保留已收录宝印与已选语言，可随时重置。'
                      : 'Preserves chosen language and seal stamps persistently across page reloads.'}
                  </p>
                </div>

                {/* 6. Future AR Layer Component (PROPOSED FUTURE FEATURE) */}
                <div className="p-4 rounded-xl border-2 border-dashed border-[#EBC393] bg-[#1C1713] flex flex-col justify-between relative shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#EBC393] uppercase tracking-wider">06 · FUTURE AR LAYER</span>
                    <span className="px-2 py-0.5 rounded bg-[#EBC393]/20 text-[#EBC393] border border-[#EBC393]/40 text-[10px] font-bold">
                      {lang === 'zh' ? '概念规划 · 尚未实装' : 'Proposed Future Feature'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 my-2">
                    <div className="w-10 h-10 rounded-full bg-[#29221B] border border-[#EBC393] flex items-center justify-center text-[#EBC393]">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-serif font-bold text-[#EBC393]">
                        {lang === 'zh' ? '现场实景 AR 交互层' : 'Future AR Layer'}
                      </h4>
                      <p className="text-xs text-[#A69485]">
                        {lang === 'zh' ? '实体定位 / AR 角色 / 家庭留影' : 'Location AR, characters & photos'}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-[#D5C2B4] mt-2 border-t border-[#382B22] pt-2">
                    {lang === 'zh'
                      ? '【未来规划功能】在华山实地胜迹通过相机识景召唤神话人物，捕捉家庭合影并触发实地专属印章。'
                      : 'Proposed feature: Location-based AR characters, family photo checkpoints, and physical geotagged stamping.'}
                  </p>
                </div>
              </div>

              {/* Connecting Descriptive Arrows overlay on Desktop */}
              <div className="mt-6 pt-4 border-t border-[#23333A] flex items-center justify-between text-xs text-[#94A3B8]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#47BBC1]" />
                  <span>{lang === 'zh' ? '实线箭头：已运行的核心原型链路（访客 → 界面 → 故事 → 宝印 → 本地存储）' : 'Solid Arrow: Live interactive prototype pipeline (User → UI → Story → Stamp → Storage)'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border border-dashed border-[#EBC393] bg-[#EBC393]/30" />
                  <span>{lang === 'zh' ? '虚线通道：拟建 AR 层将华山物理胜地与数字化故事系统双向桥接' : 'Dashed Line: Proposed AR layer connecting physical landmarks to digital stories'}</span>
                </div>
              </div>
            </div>

            {/* MOBILE DIAGRAM (Vertical Flow, Block on md:hidden) */}
            <div className="block md:hidden space-y-4">
              {/* Step 1: User */}
              <div className="p-4 rounded-xl border-2 border-[#47BBC1] bg-[#122227] shadow-lg">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-[#47BBC1] uppercase">01 · USER</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#47BBC1]/20 text-[#47BBC1] font-bold">
                    {lang === 'zh' ? '探索者' : 'Explorer'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1A3337] border border-[#47BBC1] flex items-center justify-center text-[#47BBC1] shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-base font-serif font-bold text-[#E6E9D1]">
                      {lang === 'zh' ? '访客与研学家庭' : 'Visitor & Family Explorer'}
                    </h4>
                    <p className="text-xs text-[#94A3B8]">
                      {lang === 'zh' ? '家庭访客、学生研学团队、文化登山者' : 'Family member or Mount Hua visitor'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vertical Connector 1 */}
              <div className="flex flex-col items-center justify-center my-1 text-[#47BBC1]">
                <ArrowDown className="w-5 h-5 animate-bounce" />
                <span className="text-[11px] font-medium text-[#47BBC1]">
                  {lang === 'zh' ? '浏览双语界面' : 'Interacts with'}
                </span>
              </div>

              {/* Step 2: Interface */}
              <div className="p-4 rounded-xl border-2 border-[#47BBC1] bg-[#102327] shadow-lg">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-[#47BBC1] uppercase">02 · INTERFACE</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#47BBC1]/20 text-[#47BBC1] font-bold">
                    {lang === 'zh' ? '双语界面' : 'Bilingual UI'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#18363B] border border-[#47BBC1] flex items-center justify-center text-[#47BBC1] shrink-0">
                    <Layout className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-base font-serif font-bold text-[#E6E9D1]">
                      {lang === 'zh' ? '双语交互研学界面' : 'Bilingual Story Interface'}
                    </h4>
                    <p className="text-xs text-[#94A3B8]">
                      {lang === 'zh' ? '序章图卷、垂直登山时间线、海拔层级、故事卡' : 'Route timeline, story cards, elevation profile'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vertical Connector 2 */}
              <div className="flex flex-col items-center justify-center my-1 text-[#EBC393]">
                <ArrowDown className="w-5 h-5 animate-bounce" />
                <span className="text-[11px] font-medium text-[#EBC393]">
                  {lang === 'zh' ? '查阅故事情节与题刻' : 'Reads narrative acts'}
                </span>
              </div>

              {/* Step 3: Story System */}
              <div className="p-4 rounded-xl border-2 border-[#EBC393] bg-[#1A1E22] shadow-lg">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-[#EBC393] uppercase">03 · STORY SYSTEM</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#EBC393]/20 text-[#EBC393] font-bold">
                    {lang === 'zh' ? '神话图谱' : 'Narrative Matrix'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#2A2925] border border-[#EBC393] flex items-center justify-center text-[#EBC393] shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-base font-serif font-bold text-[#E6E9D1]">
                      {lang === 'zh' ? '华山六大圣境与《宝莲灯》六幕' : 'Six Checkpoints & Six Story Acts'}
                    </h4>
                    <p className="text-xs text-[#EBC393]">
                      {lang === 'zh' ? '游客中心 → 玉泉院 → 北峰 → 中峰 → 西峰 → 索道' : 'Visitor Center → Yuquan → North → Central → West Peak'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vertical Connector 3 */}
              <div className="flex flex-col items-center justify-center my-1 text-[#C04838]">
                <ArrowDown className="w-5 h-5 animate-bounce" />
                <span className="text-[11px] font-medium text-[#EBC393]">
                  {lang === 'zh' ? '盖印收录传世宝印' : 'Collects sacred seal'}
                </span>
              </div>

              {/* Step 4: Interaction State */}
              <div className="p-4 rounded-xl border-2 border-[#47BBC1]/80 bg-[#121B20] shadow-lg">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-[#47BBC1] uppercase">04 · INTERACTION STATE</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#47BBC1]/20 text-[#47BBC1] font-bold">
                    {lang === 'zh' ? '状态管理' : 'State Engine'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#182B31] border border-[#47BBC1] flex items-center justify-center text-[#47BBC1] shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-base font-serif font-bold text-[#E6E9D1]">
                      {lang === 'zh' ? '探索状态与宝印集' : 'Interaction & Seal State'}
                    </h4>
                    <p className="text-xs text-[#94A3B8]">
                      {lang === 'zh' ? '已探索关卡、已收录宝印、解锁下一幕' : 'Explored stops, active seals, completion honor'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vertical Connector 4 */}
              <div className="flex flex-col items-center justify-center my-1 text-[#94A3B8]">
                <ArrowDown className="w-5 h-5" />
                <span className="text-[11px] font-medium text-[#94A3B8]">
                  {lang === 'zh' ? '本地持久化存储' : 'Saves to local storage'}
                </span>
              </div>

              {/* Step 5: Local Storage */}
              <div className="p-4 rounded-xl border-2 border-[#304147] bg-[#11171C] shadow-lg">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-[#CBD5E1] uppercase">05 · LOCAL STORAGE</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#304147] text-[#CBD5E1] font-bold">
                    {lang === 'zh' ? '持久化' : 'Storage'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#182126] border border-[#3A4E57] flex items-center justify-center text-[#CBD5E1] shrink-0">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-base font-serif font-bold text-[#E6E9D1]">
                      {lang === 'zh' ? '持久保存语言与关卡记录' : 'Browser Local Storage'}
                    </h4>
                    <p className="text-xs text-[#94A3B8]">
                      {lang === 'zh' ? '页面刷新不丢失进度，支持随时手动重置' : 'Preserves language and route seals across reloads'}
                    </p>
                  </div>
                </div>
              </div>

              {/* PROPOSED FUTURE COMPONENT (Mobile) */}
              <div className="p-4 rounded-xl border-2 border-dashed border-[#EBC393] bg-[#1A1410] shadow-xl mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#EBC393] uppercase tracking-wider">
                    06 · PROPOSED FUTURE LAYER
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#EBC393]/20 text-[#EBC393] border border-[#EBC393]/40 font-bold">
                    {lang === 'zh' ? '概念规划 · 尚未实装' : 'Proposed Future Feature'}
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-[#292017] border border-[#EBC393] flex items-center justify-center text-[#EBC393] shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-base font-serif font-bold text-[#EBC393]">
                      {lang === 'zh' ? '华山实景 AR 交互层' : 'Future AR Experience Layer'}
                    </h4>
                    <p className="text-xs text-[#D5C2B4]">
                      {lang === 'zh' ? '地理识景、沉香与三圣母 AR 投影、家庭实景合影' : 'Location-based AR characters & family photos'}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-[#CBD5E1] leading-relaxed border-t border-[#382B22] pt-2">
                  {lang === 'zh'
                    ? '【未来实地拓展概念】访客置身西峰沉香劈山处或北峰云台时，AR 引擎可直接将神话人物投影于真实奇峰之上，生成带有实景水印的数字宝印与家庭留影。'
                    : 'A proposed future extension connecting physical Mount Hua locations (e.g. Chenxiang Axe Split Rock on West Peak) to the digital interface via camera AR character encounters, family commemorative photographs, and location-bound digital stamping.'}
                </p>
              </div>
            </div>
          </div>

          {/* VISUAL LEGEND EXPLAINING COLORS, ARROWS, AND SYMBOLS */}
          <div className="p-4 sm:p-5 rounded-2xl border border-[#2B3B42] bg-[#0E161B]">
            <h3 className="text-sm font-serif font-bold text-[#E6E9D1] mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#47BBC1]" />
              <span>{lang === 'zh' ? '图例说明：色彩、连接线与符号规范' : 'Diagram Legend: Colors, Connectors & Symbols'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {/* Legend Item 1 */}
              <div className="p-3 rounded-xl bg-[#121D22] border border-[#24343B]">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-3.5 h-3.5 rounded bg-[#47BBC1]" />
                  <strong className="text-[#47BBC1]">{lang === 'zh' ? '孔雀青（主交互）' : 'Turquoise System'}</strong>
                </div>
                <p className="text-[#94A3B8] leading-relaxed">
                  {lang === 'zh'
                    ? '代表已上线运行的核心功能：双语导航界面、登山进度管理与交互状态。'
                    : 'Live functioning core prototype: Navigation, UI views, state tracking, and controls.'}
                </p>
              </div>

              {/* Legend Item 2 */}
              <div className="p-3 rounded-xl bg-[#121D22] border border-[#24343B]">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-3.5 h-3.5 rounded bg-[#EBC393]" />
                  <strong className="text-[#EBC393]">{lang === 'zh' ? '暖铜金（文化叙事）' : 'Warm Copper'}</strong>
                </div>
                <p className="text-[#94A3B8] leading-relaxed">
                  {lang === 'zh'
                    ? '代表华山六大地理胜迹与《宝莲灯》六幕神话故事、经典诗赋与传世印铭。'
                    : 'Mount Hua geographic landmarks, Lotus Lantern mythological narrative, and classical poetry.'}
                </p>
              </div>

              {/* Legend Item 3 */}
              <div className="p-3 rounded-xl bg-[#121D22] border border-[#24343B]">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-3.5 h-3.5 rounded border border-dashed border-[#EBC393] bg-[#EBC393]/30" />
                  <strong className="text-[#EBC393]">{lang === 'zh' ? '虚线金框（未来 AR）' : 'Dashed Copper'}</strong>
                </div>
                <p className="text-[#94A3B8] leading-relaxed">
                  {lang === 'zh'
                    ? '明确标注为【未来规划功能】：实地地理识别、AR 人物召唤与家庭打卡相册。'
                    : 'Clearly marks proposed future features: On-site AR vision, characters, and family photo captures.'}
                </p>
              </div>

              {/* Legend Item 4 */}
              <div className="p-3 rounded-xl bg-[#121D22] border border-[#24343B]">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-3.5 h-3.5 rounded bg-[#132B2A] border border-[#304147]" />
                  <strong className="text-[#CBD5E1]">{lang === 'zh' ? '深玉石黑（底层引擎）' : 'Dark Jade & Slate'}</strong>
                </div>
                <p className="text-[#94A3B8] leading-relaxed">
                  {lang === 'zh'
                    ? '代表底层数据持久化引擎（LocalStorage）与五音音频合成系统。'
                    : 'Underlying data persistence engine (LocalStorage) and pentatonic audio synthesizer.'}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Conceptual Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl border border-[#304147] bg-[#111A1F]">
              <h4 className="font-serif font-bold text-[#EBC393] mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#47BBC1]" />
                <span>{lang === 'zh' ? '物理华山胜迹与数字故事的连接' : 'Physical Landmarks & Digital Narrative'}</span>
              </h4>
              <p className="text-[#CBD5E1] leading-relaxed">
                {lang === 'zh'
                  ? '六大关卡根据华山险道真实登临路径设计：从山脚谷地（游客中心 380m）起步，经道教圣地玉泉院（420m），攀登险道至北峰云台（1,614m），穿经金锁关至中峰玉女祠（2,037m），最终登临西峰劈山救母遗址（2,082m）并乘西峰索道俯瞰华岳千秋。每一个物理地标均承载着对应的心性成长与神话高潮。'
                  : 'The six checkpoints trace the real ascent of Mount Hua: starting at the valley base (Visitor Center, 380m), through Daoist Yuquan Temple (420m), ascending craggy ridges to North Peak (1,614m), Central Peak (2,037m), culminating at the West Peak Lotus Crags (2,082m) and descending via the West Peak Cableway. Each physical elevation milestone mirrors Chenxiang’s inner growth and moral heroism.'}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#304147] bg-[#111A1F]">
              <h4 className="font-serif font-bold text-[#47BBC1] mb-2 flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#EBC393]" />
                <span>{lang === 'zh' ? '未来 AR 层的实地拓展构想' : 'Future AR Layer Deployment Vision'}</span>
              </h4>
              <p className="text-[#CBD5E1] leading-relaxed">
                {lang === 'zh'
                  ? '在未来的实地部署中，AR 层将基于地理围栏（Geo-fencing）与计算机视觉识景：当家庭访客真正抵达华山西峰巨石时，手机镜头中将浮现手持宝莲灯的三圣母与沉香母子相见的动态立体投影；访客可与神话人物同框合影，并将生成的实地数字宝印即时盖印入册，获得专属结营认证。'
                  : 'In future on-site deployments, the proposed AR layer will utilize vision markers and spatial anchors: when a family reaches the actual West Peak summit, looking through their camera reveals 3D mythological avatars of Chenxiang and San Shengmu upon the crags. Visitors can take family commemorative photos with mythological figures, automatically receiving a physical-presence verified digital seal.'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#22333B] bg-[#0E161B] shrink-0 text-xs text-[#94A3B8]">
          <span>
            {lang === 'zh'
              ? '按 ESC 键或点击空白区域即可退出此面板'
              : 'Press ESC or click outside to dismiss panel'}
          </span>
          <button
            id="modal-dismiss-btn"
            onClick={() => {
              SoundEngine.playChime(1);
              onClose();
            }}
            className="min-h-[40px] px-5 py-2 rounded-xl bg-[#47BBC1] text-black font-bold hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>{lang === 'zh' ? '返回华山图卷' : 'Return to Journey'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
