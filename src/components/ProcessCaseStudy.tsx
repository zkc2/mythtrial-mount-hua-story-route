import React from 'react';
import {
  ArrowDown,
  ArrowRight,
  Bot,
  CheckCircle2,
  Code2,
  Compass,
  Database,
  ExternalLink,
  EyeOff,
  FileInput,
  GitBranch,
  Image as ImageIcon,
  MousePointerClick,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { Language } from '../types';
import { ARTWORK_DISCLOSURE, PROTOTYPE_MAP_ARTWORK } from '../data/artworkData';

interface ProcessCaseStudyProps {
  lang?: Language;
  onEnterMap: () => void;
}

const buildSteps = [
  {
    icon: FileInput,
    titleEn: 'Frame the experience',
    titleZh: '定义体验框架',
    bodyEn: 'I supplied the six-stop route, Lotus Lantern story structure, bilingual requirement, visual references, and interaction goals.',
    bodyZh: '我提供了六站路线、《宝莲灯》叙事结构、双语要求、视觉参考和交互目标。',
  },
  {
    icon: Bot,
    titleEn: 'Generate through dialogue',
    titleZh: '通过对话生成',
    bodyEn: 'Google AI Studio proposed interface structures, copy, and React code. Each response was a draft, not a final design decision.',
    bodyZh: 'Google AI Studio 提出界面结构、文案与 React 代码。每次回复都只是草稿，不是最终设计决定。',
  },
  {
    icon: RefreshCw,
    titleEn: 'Test and revise',
    titleZh: '测试与迭代',
    bodyEn: 'I tested language switching, progress, seal collection, mobile navigation, and content hierarchy, then prompted and edited again.',
    bodyZh: '我测试语言切换、进度、宝印收集、移动导航和信息层级，再继续提示并手动修改。',
  },
  {
    icon: GitBranch,
    titleEn: 'Ship a stable build',
    titleZh: '发布稳定版本',
    bodyEn: 'The reviewed code was versioned in GitHub and deployed to Vercel. Runtime behavior is fixed and repeatable.',
    bodyZh: '审核后的代码进入 GitHub 版本管理并部署到 Vercel。运行时行为固定且可重复。',
  },
];

const boundaries = [
  {
    icon: FileInput,
    titleEn: 'Where information enters',
    titleZh: '信息从哪里进入',
    bodyEn: 'Build time: my prompts, route research, story structure, and visual references. Runtime: visitor clicks, language choice, camera frames for local QR recognition, photo capture, and seal actions.',
    bodyZh: '构建阶段：我的提示、路线研究、故事结构和视觉参考。运行阶段：访客点击、语言选择、用于本地二维码识别的摄像头画面、合影操作和宝印操作。',
  },
  {
    icon: Bot,
    titleEn: 'What the model received',
    titleZh: '模型得到了什么',
    bodyEn: 'The project goal, six checkpoints, bilingual content request, visual palette, required screens, and feedback from each test round.',
    bodyZh: '项目目标、六个关卡、双语内容要求、视觉色板、所需页面，以及每轮测试后的反馈。',
  },
  {
    icon: EyeOff,
    titleEn: 'What the model did not receive',
    titleZh: '模型没有得到什么',
    bodyEn: 'The generative model received no live GPS, camera feed, private visitor profile, or official tourism database. Camera frames stay inside the browser and are read only by deterministic QR recognition code.',
    bodyZh: '生成式模型没有获得实时 GPS、摄像头画面、访客隐私资料或官方旅游数据库。摄像头画面只留在浏览器中，并仅由确定性的二维码识别程序读取。',
  },
  {
    icon: ShieldCheck,
    titleEn: 'Runtime boundary',
    titleZh: '运行时边界',
    bodyEn: 'Visitors do not talk to an AI model. The live West Peak WebAR uses local QR recognition, fixed 2D animation, camera compositing, and browser state. GPS anchoring and 3D spatial AR remain future concepts.',
    bodyZh: '访客不会与 AI 模型对话。已上线的西峰 WebAR 使用本地二维码识别、固定二维动画、摄像头合成与浏览器状态；GPS 定位和三维空间 AR 仍是未来概念。',
  },
];

export const ProcessCaseStudy: React.FC<ProcessCaseStudyProps> = ({ lang = 'en', onEnterMap }) => {
  const zh = lang === 'zh';

  return (
    <div className="bg-[#091014] text-[#E6E9D1]">
      <section className="relative overflow-hidden border-b border-[#47BBC1]/20">
        <img
          src={PROTOTYPE_MAP_ARTWORK}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071013] via-[#071013]/95 to-[#071013]/55" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#EBC393]/50 bg-[#171B1C]/85 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#EBC393]">
              <Sparkles className="h-3.5 w-3.5" />
              {zh ? '制作过程与系统边界' : 'Process, Iteration & System Boundary'}
            </span>
            <h1 className="mt-5 text-4xl sm:text-6xl font-serif font-bold leading-tight">
              {zh ? '从提示到旅程' : 'From Prompt to Journey'}
            </h1>
            <p className="mt-4 text-lg sm:text-2xl font-serif text-[#47BBC1]">
              {zh
                ? '通过与 AI Studio 对话，将华山神话转化为可交互的文化旅程'
                : 'Building MythTrial through conversational prototyping in AI Studio'}
            </p>
            <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-[#CBD5E1]">
              {zh
                ? '这个案例不是“让 AI 一次生成成品”，而是记录人如何提供材料、判断输出、发现问题，并把概率性的生成结果转化为确定、可测试的产品。'
                : 'This case study is not about asking AI for a finished product once. It shows how human inputs, evaluation, and revision turned probabilistic drafts into a deterministic, testable experience.'}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={onEnterMap}
                className="min-h-[48px] rounded-xl bg-[#47BBC1] px-6 py-3 font-bold text-[#061012] hover:brightness-110 flex items-center justify-center gap-2"
              >
                <Compass className="h-5 w-5" />
                {zh ? '体验最终原型' : 'Experience Final Prototype'}
              </button>
              <a
                href="https://mythtrial-mount-hua-story-route.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="min-h-[48px] rounded-xl border border-[#EBC393]/60 bg-[#10191D]/90 px-6 py-3 font-bold text-[#EBC393] hover:bg-[#EBC393]/10 flex items-center justify-center gap-2"
              >
                {zh ? '打开线上链接' : 'Open Live System'}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="max-w-3xl mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[#EBC393] font-bold">01 · {zh ? '过程' : 'Process'}</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-serif font-bold">
            {zh ? '对话生成只是循环的一部分' : 'Conversational generation was one part of the loop'}
          </h2>
          <p className="mt-3 text-[#94A3B8] leading-relaxed">
            {zh
              ? '我的角色是设定约束、选择方向、测试真实交互，并决定哪些生成结果值得保留。'
              : 'My role was to set constraints, choose directions, test real interactions, and decide which generated outputs deserved to survive.'}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {buildSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.titleEn} className="relative rounded-2xl border border-[#304147] bg-[#0E171B] p-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#47BBC1]">0{index + 1}</span>
                  <Icon className="h-5 w-5 text-[#EBC393]" />
                </div>
                <h3 className="mt-5 font-serif text-lg font-bold">{zh ? step.titleZh : step.titleEn}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#AAB6BE]">{zh ? step.bodyZh : step.bodyEn}</p>
                {index < buildSteps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute -right-3 top-1/2 z-10 h-5 w-5 rounded-full bg-[#091014] text-[#47BBC1]" />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-2xl border border-[#EBC393]/35 bg-[#151713] p-5 sm:p-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#EBC393]">
            <Code2 className="h-4 w-4" />
            {zh ? '工作提示摘录' : 'Working prompt excerpt'}
          </div>
          <p className="mt-3 font-mono text-sm leading-7 text-[#D8D2C6]">
            {zh
              ? '“制作一个中英双语的华山文化旅程网页。把六个真实地点对应到《宝莲灯》的六幕故事。核心流程：选择地点 → 阅读故事 → 收集宝印 → 解锁下一站。使用深玉色、孔雀青、暖铜色和象牙白。所有语言切换必须覆盖导航、内容与状态，移动端重新排列为纵向旅程。”'
              : '“Build a bilingual Mount Hua cultural-journey web app. Map six physical stops to six acts of the Lotus Lantern. Core flow: choose a stop → read the story → collect a seal → unlock the next stop. Use dark jade, turquoise, warm copper, and ivory. Language switching must cover navigation, content, and state. Reflow mobile as a vertical journey.”'}
          </p>
        </div>
      </section>

      <section className="border-y border-[#47BBC1]/20 bg-[#0C1519]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="max-w-3xl mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-[#EBC393] font-bold">02 · {zh ? '系统图' : 'System Diagram'}</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-serif font-bold">
              {zh ? '两个系统，两种确定性' : 'Two systems, two kinds of certainty'}
            </h2>
            <p className="mt-3 text-[#CBD5E1] leading-relaxed">
              {zh
                ? 'AI 只参与构建阶段。访客真正使用网页时，界面中没有模型调用。'
                : 'AI participates only at build time. When a visitor uses the deployed site, the interface makes no model call.'}
            </p>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-dashed border-[#EBC393]/60 bg-[#1B1713] p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <h3 className="font-serif text-xl font-bold text-[#EBC393]">{zh ? '构建阶段' : 'Build-time system'}</h3>
                <span className="rounded-full bg-[#EBC393]/15 border border-[#EBC393]/40 px-3 py-1 text-xs font-bold text-[#EBC393]">
                  {zh ? '概率性' : 'PROBABILISTIC'}
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-center">
                <SystemNode icon={UserRound} title={zh ? 'Kai 的提示与素材' : "Kai's prompts & references"} body={zh ? '目标、路线、故事、约束' : 'Goal, route, story, constraints'} />
                <FlowArrow />
                <SystemNode icon={Bot} title="Google AI Studio" body={zh ? '生成结构、文案与代码候选' : 'Generates structure, copy, code options'} accent="copper" />
                <FlowArrow />
                <SystemNode icon={Code2} title={zh ? '候选原型' : 'Candidate prototype'} body={zh ? '每次生成可能不同' : 'Outputs may vary each run'} accent="copper" />
                <FlowArrow />
                <SystemNode icon={CheckCircle2} title={zh ? '人工选择与修改' : 'Human review & edits'} body={zh ? '判断、测试、保留或重做' : 'Test, select, edit, reject'} />
              </div>
            </div>

            <div className="flex justify-center text-[#47BBC1]">
              <ArrowDown className="h-6 w-6" />
            </div>

            <div className="rounded-2xl border border-[#47BBC1]/60 bg-[#0C1C20] p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <h3 className="font-serif text-xl font-bold text-[#47BBC1]">{zh ? '运行阶段' : 'Runtime system'}</h3>
                <span className="rounded-full bg-[#47BBC1]/15 border border-[#47BBC1]/40 px-3 py-1 text-xs font-bold text-[#47BBC1]">
                  {zh ? '确定性' : 'DETERMINISTIC'}
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-center">
                <SystemNode icon={MousePointerClick} title={zh ? '访客输入' : 'Visitor input'} body={zh ? '点击、语言、模式、盖印' : 'Clicks, language, mode, seals'} />
                <FlowArrow />
                <SystemNode icon={Code2} title="React UI" body={zh ? '固定事件规则与页面状态' : 'Fixed event rules and view state'} />
                <FlowArrow />
                <SystemNode icon={Database} title={zh ? '固定故事数据' : 'Fixed story data'} body={zh ? '六站内容与解锁顺序' : 'Six stops and unlock order'} />
                <FlowArrow />
                <SystemNode icon={Database} title="LocalStorage" body={zh ? '保存语言与探索进度' : 'Persists language and progress'} />
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {boundaries.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.titleEn} className="rounded-2xl border border-[#273840] bg-[#0A1216] p-5 flex gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-xl border border-[#47BBC1]/40 bg-[#132B2A] flex items-center justify-center">
                    <Icon className="h-5 w-5 text-[#47BBC1]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#EBC393]">{zh ? item.titleZh : item.titleEn}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#AAB6BE]">{zh ? item.bodyZh : item.bodyEn}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#EBC393] font-bold">03 · {zh ? '系统卡摘录' : 'System Card Excerpt'}</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-serif font-bold">{zh ? '原型承诺与限制' : 'Prototype promises and limits'}</h2>
            <p className="mt-4 text-[#AAB6BE] leading-relaxed">
              {zh
                ? '系统卡让“看起来能做什么”和“实际上能做什么”保持一致。'
                : 'The system card keeps what the prototype appears to do aligned with what it actually does.'}
            </p>
          </div>
          <div className="rounded-3xl border border-[#EBC393]/45 bg-[#111A1F] overflow-hidden shadow-2xl">
            <div className="border-b border-[#304147] px-5 sm:px-7 py-4 flex items-center justify-between">
              <span className="font-serif font-bold text-[#EBC393]">MythTrial · System Card v2.0</span>
              <ShieldCheck className="h-5 w-5 text-[#47BBC1]" />
            </div>
            <dl className="grid gap-px bg-[#26343A] sm:grid-cols-2">
              {[
                [zh ? '目的' : 'Purpose', zh ? '把六处华山地标与六幕《宝莲灯》故事连接起来。' : 'Connect six Mount Hua landmarks to six acts of the Lotus Lantern myth.'],
                [zh ? '适用用户' : 'Intended users', zh ? '家庭访客、学生与文化旅行者。' : 'Families, students, and cultural travelers.'],
                [zh ? '输入' : 'Inputs', zh ? '点击、语言、摄像头二维码画面、合影和宝印操作。' : 'Clicks, language, camera QR frames, photo capture, and seal actions.'],
                [zh ? '输出' : 'Outputs', zh ? '双语故事、二维 AR 动画、合影、路线状态和宝印进度。' : 'Bilingual stories, 2D AR animation, photos, route state, and seal progress.'],
                [zh ? '数据' : 'Data', zh ? '固定故事内容与浏览器本地进度。' : 'Fixed story content and browser-local progress.'],
                [zh ? '限制' : 'Limits', zh ? '无实时 GPS、三维空间锚点、账户同步或运行时生成式 AI。' : 'No live GPS, 3D spatial anchors, account sync, or runtime generative AI.'],
              ].map(([term, description]) => (
                <div key={term} className="bg-[#0D161A] p-5">
                  <dt className="text-xs uppercase tracking-widest text-[#47BBC1] font-bold">{term}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">{description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="border-y border-[#47BBC1]/20 bg-[#0C1519]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="max-w-3xl mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-[#EBC393] font-bold">04 · {zh ? '迭代证据' : 'Iteration Evidence'}</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-serif font-bold">{zh ? '看见问题，然后修复真实行为' : 'Find the break, then fix the behavior'}</h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <figure className="rounded-2xl overflow-hidden border border-[#6B4B3A] bg-[#120F0D]">
              <img src="/assets/mythtrial/iteration-before.webp" alt={zh ? '第一版英文首页' : 'First English landing page'} className="w-full aspect-[16/9] object-cover object-top" />
              <figcaption className="p-5">
                <span className="text-xs font-bold text-[#EBC393] uppercase tracking-widest">{zh ? '修改前' : 'Before'}</span>
                <h3 className="mt-2 font-serif text-xl font-bold">{zh ? '切换控件出现了，但系统没有完整切换' : 'The switch appeared, but the system did not switch'}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#AAB6BE]">
                  {zh ? '第一版混合中英文。语言按钮可见，却没有连接所有页面和状态。' : 'The first version mixed Chinese and English. The language control was visible but not connected across every screen and state.'}
                </p>
              </figcaption>
            </figure>

            <figure className="rounded-2xl overflow-hidden border border-[#47BBC1]/50 bg-[#0B181C]">
              <img src="/assets/mythtrial/iteration-after.webp" alt={zh ? '修复后的中文首页' : 'Revised Chinese landing page'} className="w-full aspect-[16/9] object-cover object-top" />
              <figcaption className="p-5">
                <span className="text-xs font-bold text-[#47BBC1] uppercase tracking-widest">{zh ? '修改后' : 'After'}</span>
                <h3 className="mt-2 font-serif text-xl font-bold">{zh ? '一个共享语言状态更新完整体验' : 'One shared language state updates the full experience'}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#AAB6BE]">
                  {zh ? '首页、导航、路线、故事和按钮统一切换，宝印进度在切换语言后继续保留。' : 'Landing, navigation, route, story, and controls now switch together while seal progress remains intact.'}
                </p>
              </figcaption>
            </figure>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <IterationCard label={zh ? '出现问题' : 'What broke'} title={zh ? '移动端像被压缩的桌面页' : 'Mobile looked like a squeezed desktop'} body={zh ? '导航被截断，路线图难以阅读，主要操作缺少顺序。' : 'Navigation clipped, the route became hard to read, and the next action was unclear.'} />
            <IterationCard label={zh ? '采取措施' : 'What changed'} title={zh ? '重排，而不是缩小' : 'Reflow, not shrink'} body={zh ? '改为移动抽屉、单列卡片、纵向路线和至少 44 像素的触控目标。' : 'Added a mobile drawer, single-column cards, a vertical route, and 44px minimum touch targets.'} accent="teal" />
            <IterationCard label={zh ? '二次故障' : 'Second failure'} title={zh ? '刷新后进度被清空' : 'Refresh erased progress'} body={zh ? '读取与保存状态发生竞争，初始默认值会覆盖浏览器中已有进度。' : 'Load and save effects raced, so initial defaults overwrote saved browser progress.'} />
            <IterationCard label={zh ? '修复与验证' : 'Fix & evaluation'} title={zh ? '先读取，再允许写入' : 'Hydrate before saving'} body={zh ? '加入 hydration 保护后，再次验证六枚宝印、刷新保留、语言切换和重置。' : 'Added a hydration gate, then re-tested all six seals, reload persistence, language switching, and reset.'} accent="teal" />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-[#304147] bg-[#0E171B] p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-[#EBC393] font-bold">05 · {zh ? '反思' : 'Reflection'}</p>
            <blockquote className="mt-4 font-serif text-2xl sm:text-3xl leading-snug text-[#E6E9D1]">
              {zh
                ? 'AI 给了我速度，但测试、取舍和边界定义才把它变成设计。'
                : 'AI gave me speed. Testing, selection, and boundary-setting turned it into design.'}
            </blockquote>
            <p className="mt-5 text-[#AAB6BE] leading-relaxed">
              {zh
                ? '最大的学习是：界面看起来完成，不代表功能已经成立。下一步是把真实地点测试、家庭共同使用和文化内容审核纳入评估。'
                : 'The key lesson was that an interface can look complete before its behavior is complete. The next evaluation should include on-site use, shared family use, and cultural-content review.'}
            </p>
          </div>

          <aside className="rounded-3xl border border-[#EBC393]/40 bg-[#171511] p-6 sm:p-8">
            <ImageIcon className="h-6 w-6 text-[#EBC393]" />
            <h2 className="mt-4 font-serif text-xl font-bold">{zh ? '视觉与制作披露' : 'Visual & production disclosure'}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#CFC2B5]">
              {zh ? ARTWORK_DISCLOSURE.zh : ARTWORK_DISCLOSURE.en}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#CFC2B5]">
              {zh
                ? '应用结构与代码由我通过 Google AI Studio 对话生成，再由我测试、筛选、修改和部署。'
                : 'The app structure and code were generated through conversations with Google AI Studio, then tested, selected, revised, and deployed by me.'}
            </p>
            <div className="mt-6 space-y-2">
              <ResourceLink href="https://3105804824.wixsite.com/zhangkai/mythtrial" label={zh ? '原始 MythTrial 项目页面' : 'Original MythTrial project'} />
              <ResourceLink href="https://www.figma.com/design/75Asa0klX8xX6nGQveC1Xe/%E5%8D%8E%E5%B1%B1-%E5%AE%9D%E8%8E%B2%E7%81%AF?node-id=0-1" label={zh ? 'Figma 视觉源文件' : 'Figma visual source file'} />
              <ResourceLink href="https://github.com/zkc2/mythtrial-mount-hua-story-route" label={zh ? '代码仓库' : 'Source repository'} />
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

interface SystemNodeProps {
  icon: React.ElementType;
  title: string;
  body: string;
  accent?: 'teal' | 'copper';
}

const SystemNode: React.FC<SystemNodeProps> = ({ icon: Icon, title, body, accent = 'teal' }) => (
  <div className={`rounded-xl border p-4 ${accent === 'copper' ? 'border-[#EBC393]/45 bg-[#241D17]' : 'border-[#47BBC1]/40 bg-[#102126]'}`}>
    <Icon className={`h-5 w-5 ${accent === 'copper' ? 'text-[#EBC393]' : 'text-[#47BBC1]'}`} />
    <h4 className="mt-3 text-sm font-bold text-[#E6E9D1]">{title}</h4>
    <p className="mt-1 text-xs leading-relaxed text-[#AAB6BE]">{body}</p>
  </div>
);

const FlowArrow = () => (
  <div className="flex justify-center text-[#6D8D91]">
    <ArrowDown className="h-5 w-5 md:hidden" />
    <ArrowRight className="hidden h-5 w-5 md:block" />
  </div>
);

interface IterationCardProps {
  label: string;
  title: string;
  body: string;
  accent?: 'copper' | 'teal';
}

const IterationCard: React.FC<IterationCardProps> = ({ label, title, body, accent = 'copper' }) => (
  <div className="rounded-2xl border border-[#304147] bg-[#0A1216] p-5">
    <span className={`text-xs font-bold uppercase tracking-widest ${accent === 'teal' ? 'text-[#47BBC1]' : 'text-[#EBC393]'}`}>{label}</span>
    <h3 className="mt-2 font-serif text-lg font-bold">{title}</h3>
    <p className="mt-2 text-sm leading-relaxed text-[#AAB6BE]">{body}</p>
  </div>
);

const ResourceLink: React.FC<{ href: string; label: string }> = ({ href, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="min-h-[44px] rounded-xl border border-[#5A4433] bg-[#100F0D] px-4 py-2.5 text-sm text-[#EBC393] hover:border-[#EBC393] flex items-center justify-between gap-3"
  >
    <span>{label}</span>
    <ExternalLink className="h-4 w-4 shrink-0" />
  </a>
);
