import React, { useCallback, useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import {
  ArrowLeft,
  Camera,
  Check,
  Download,
  Maximize2,
  Play,
  QrCode,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  X,
} from 'lucide-react';
import { Language } from '../types';
import { ARTWORK_DISCLOSURE } from '../data/artworkData';
import { SoundEngine } from '../utils/soundEffects';

const MARKER_PAYLOAD = 'MYTHTRIAL|WEST_PEAK|AXE_CLEAVING_ROCK|V1';
const WEST_PEAK_ART = '/assets/mythtrial/chapter-5.webp';

type ExperienceStage = 'intro' | 'scanning' | 'revealed' | 'cinematic' | 'complete' | 'photo';

interface WestPeakARProps {
  lang: Language;
  isCollected: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const copy = {
  zh: {
    eyebrow: '第五站 · 西峰 AR CHECKPOINT',
    title: '劈山救母',
    intro: '扫描西峰故事标记，让沉香、神斧与斧劈石在眼前苏醒。',
    enter: 'Enter AR · 开启摄像头',
    demo: 'Classroom Demo Mode',
    marker: '显示 / 打印识别标记',
    privacy: '摄像头画面只在本机浏览器中分析，不会上传或保存。',
    scanning: '寻找西峰故事标记',
    scanningHint: '将完整二维码放入取景框，保持光线充足。',
    cancel: '退出扫描',
    demoScanning: '课堂演示模式',
    demoHint: '此模式用预设场景代替摄像头，保证课堂设备也能完整演示。',
    recognize: '识别演示标记',
    markerTitle: '西峰 · 劈山救母识别标记',
    markerHint: '可在另一台设备上显示，或打印后用 Enter AR 扫描。',
    print: '打印标记',
    markerClose: '返回体验',
    found: '标记识别成功',
    tap: '点击神斧，唤醒西峰传说',
    story1: '沉香登上莲花峰顶，终于来到母亲受困的巨岩之前。',
    story2: '他将所有思念与勇气凝聚于萱花神斧。',
    story3: '金光贯穿云海，斧劈石轰然中开。',
    story4: '至情冲破天规，母子终于在西峰重聚。',
    seal: '劈山断石印已收入你的传世宝印谱',
    photo: '进入合影模式',
    finish: '完成并返回西峰',
    retake: '重新体验',
    capture: '拍下这一刻',
    download: '保存照片',
    photoHint: '站在画面左侧，让沉香与神斧出现在你的身旁。',
    cameraError: '无法开启摄像头',
    cameraErrorHint: '可能是权限被拒绝、设备没有摄像头，或浏览器不支持。你仍可继续完整体验。',
    fallback: '使用普通动画继续',
    loading: '正在启动摄像头…',
    captured: '照片已生成',
    disclosure: ARTWORK_DISCLOSURE.zh,
  },
  en: {
    eyebrow: 'CHECKPOINT 05 · WEST PEAK AR',
    title: 'Splitting the Mountain',
    intro: 'Scan the West Peak story marker and awaken Chenxiang, the divine axe, and Axe-Cleaving Rock.',
    enter: 'Enter AR · Start Camera',
    demo: 'Classroom Demo Mode',
    marker: 'Show / Print Recognition Marker',
    privacy: 'Camera frames are analyzed only in your browser. Nothing is uploaded or stored.',
    scanning: 'Find the West Peak story marker',
    scanningHint: 'Fit the full QR marker inside the frame and keep it well lit.',
    cancel: 'Exit scanner',
    demoScanning: 'Classroom Demo Mode',
    demoHint: 'A staged background replaces the camera so the full experience works on classroom devices.',
    recognize: 'Recognize demo marker',
    markerTitle: 'West Peak · Axe-Cleaving Story Marker',
    markerHint: 'Display this on a second device, or print it and scan it with Enter AR.',
    print: 'Print marker',
    markerClose: 'Back to experience',
    found: 'Story marker recognized',
    tap: 'Tap the divine axe to awaken the legend',
    story1: 'Atop Lotus Peak, Chenxiang finally reached the granite prison holding his mother.',
    story2: 'He gathered every memory and every ounce of courage into the divine axe.',
    story3: 'Golden light tore through the clouds. Axe-Cleaving Rock split open.',
    story4: 'Devotion overcame celestial law, and mother and son were reunited.',
    seal: 'The Sacred Seal of Mountain-Cleaving Valour has joined your collection',
    photo: 'Enter Photo Mode',
    finish: 'Finish & Return to West Peak',
    retake: 'Replay Experience',
    capture: 'Capture This Moment',
    download: 'Save Photo',
    photoHint: 'Stand on the left so Chenxiang and the divine axe appear beside you.',
    cameraError: 'Camera could not be started',
    cameraErrorHint: 'Permission may be denied, the device may lack a camera, or the browser may not support it. You can still complete the experience.',
    fallback: 'Continue with standard animation',
    loading: 'Starting camera…',
    captured: 'Your photo is ready',
    disclosure: ARTWORK_DISCLOSURE.en,
  },
};

const MythSceneOverlay: React.FC<{ active: boolean; cinematic: boolean }> = ({ active, cinematic }) => (
  <svg
    id="west-peak-ar-overlay"
    className={`absolute inset-0 h-full w-full pointer-events-none ${active ? 'ar-scene-visible' : 'opacity-0'} ${cinematic ? 'ar-scene-cinematic' : ''}`}
    viewBox="0 0 900 1200"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="arGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#fff8bd" stopOpacity=".95" />
        <stop offset=".35" stopColor="#EBC393" stopOpacity=".7" />
        <stop offset="1" stopColor="#EBC393" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="arRock" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#173c3c" stopOpacity=".94" />
        <stop offset="1" stopColor="#071819" stopOpacity=".98" />
      </linearGradient>
      <linearGradient id="arGold" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#fffbd0" />
        <stop offset=".35" stopColor="#EBC393" />
        <stop offset="1" stopColor="#C06A38" />
      </linearGradient>
      <filter id="arBlur"><feGaussianBlur stdDeviation="16" /></filter>
      <filter id="arShadow"><feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#000" floodOpacity=".65" /></filter>
    </defs>

    <circle className="ar-mother-glow" cx="460" cy="355" r="230" fill="url(#arGlow)" filter="url(#arBlur)" />

    <g className="ar-rock-left" filter="url(#arShadow)">
      <path d="M0 240 L300 150 L415 250 L365 415 L438 535 L360 690 L410 820 L300 1020 L0 1200 Z" fill="url(#arRock)" stroke="#47BBC1" strokeOpacity=".48" strokeWidth="5" />
      <path d="M330 275 L385 335 L345 420 L400 505 L350 585" fill="none" stroke="#EBC393" strokeOpacity=".48" strokeWidth="7" />
    </g>
    <g className="ar-rock-right" filter="url(#arShadow)">
      <path d="M900 180 L600 145 L485 255 L530 405 L462 535 L545 700 L490 845 L610 1040 L900 1200 Z" fill="url(#arRock)" stroke="#47BBC1" strokeOpacity=".48" strokeWidth="5" />
      <path d="M565 280 L515 345 L552 425 L505 510 L555 610" fill="none" stroke="#EBC393" strokeOpacity=".48" strokeWidth="7" />
    </g>

    <g className="ar-chenxiang" filter="url(#arShadow)">
      <path d="M557 399 C520 376 505 324 530 287 C552 254 600 259 619 290 C642 328 621 376 588 400 Z" fill="#0B1817" stroke="#EBC393" strokeWidth="7" />
      <path d="M538 397 C485 430 470 510 488 595 L437 805 L585 805 L566 612 C602 535 610 454 580 402 Z" fill="#102b29" stroke="#47BBC1" strokeWidth="8" />
      <path d="M492 456 L391 558" stroke="#EBC393" strokeWidth="26" strokeLinecap="round" />
      <path d="M576 453 L676 515" stroke="#EBC393" strokeWidth="26" strokeLinecap="round" />
      <path d="M500 803 L456 1038" stroke="#0B1817" strokeWidth="38" strokeLinecap="round" />
      <path d="M558 803 L612 1038" stroke="#0B1817" strokeWidth="38" strokeLinecap="round" />
      <path d="M534 274 L515 214 L554 245 L584 188 L595 257" fill="#0B1817" stroke="#EBC393" strokeWidth="6" />
    </g>

    <g className="ar-axe" transform="translate(356 522) rotate(-34)" filter="url(#arShadow)">
      <rect x="-15" y="-250" width="30" height="530" rx="14" fill="#7A3D28" stroke="#EBC393" strokeWidth="6" />
      <path d="M0 -254 C-92 -300 -155 -262 -188 -205 C-139 -186 -103 -148 -84 -94 C-43 -128 -19 -158 0 -194 C19 -158 43 -128 84 -94 C103 -148 139 -186 188 -205 C155 -262 92 -300 0 -254 Z" fill="url(#arGold)" stroke="#fff3c4" strokeWidth="7" />
      <circle cx="0" cy="-218" r="38" fill="#47BBC1" stroke="#fff3c4" strokeWidth="7" />
    </g>

    <g className="ar-lightning" fill="none" stroke="url(#arGold)" strokeLinecap="round">
      <path d="M450 0 L415 190 L473 175 L420 355 L497 321 L449 570" strokeWidth="17" />
      <path d="M362 95 L385 250 L344 280 L410 410" strokeWidth="7" />
      <path d="M535 90 L505 245 L548 292 L488 416" strokeWidth="7" />
    </g>
    <g className="ar-sparks" fill="#fff4bd">
      {Array.from({ length: 18 }).map((_, index) => {
        const angle = (index / 18) * Math.PI * 2;
        const radius = 125 + (index % 3) * 52;
        return <circle key={index} cx={450 + Math.cos(angle) * radius} cy={475 + Math.sin(angle) * radius} r={index % 2 ? 7 : 11} />;
      })}
    </g>
  </svg>
);

export const WestPeakAR: React.FC<WestPeakARProps> = ({ lang, isCollected, onClose, onComplete }) => {
  const t = copy[lang];
  const [stage, setStage] = useState<ExperienceStage>('intro');
  const [demoMode, setDemoMode] = useState(false);
  const [markerOpen, setMarkerOpen] = useState(false);
  const [markerUrl, setMarkerUrl] = useState('');
  const [cameraError, setCameraError] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [storyBeat, setStoryBeat] = useState(0);
  const [photoUrl, setPhotoUrl] = useState('');
  const [stampAwarded, setStampAwarded] = useState(isCollected);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scanCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanFrameRef = useRef<number | null>(null);
  const lastScanRef = useRef(0);

  useEffect(() => {
    QRCode.toDataURL(MARKER_PAYLOAD, {
      width: 720,
      margin: 3,
      color: { dark: '#102B2A', light: '#F2EBD9' },
      errorCorrectionLevel: 'H',
    }).then(setMarkerUrl).catch(() => setMarkerUrl(''));
  }, []);

  const stopCamera = useCallback(() => {
    if (scanFrameRef.current) cancelAnimationFrame(scanFrameRef.current);
    scanFrameRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const stopScanning = useCallback(() => {
    if (scanFrameRef.current) cancelAnimationFrame(scanFrameRef.current);
    scanFrameRef.current = null;
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  const recognizeMarker = useCallback(() => {
    stopScanning();
    setCameraLoading(false);
    setStage('revealed');
    SoundEngine.playChime(5);
  }, [stopScanning]);

  const scanVideoFrame = useCallback((timestamp: number) => {
    const video = videoRef.current;
    const canvas = scanCanvasRef.current;
    if (!video || !canvas || video.readyState < 2) {
      scanFrameRef.current = requestAnimationFrame(scanVideoFrame);
      return;
    }

    if (timestamp - lastScanRef.current > 150) {
      lastScanRef.current = timestamp;
      const maxWidth = 640;
      const scale = Math.min(1, maxWidth / video.videoWidth);
      canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
      canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const image = context.getImageData(0, 0, canvas.width, canvas.height);
        const result = jsQR(image.data, image.width, image.height, { inversionAttempts: 'attemptBoth' });
        if (result?.data.trim() === MARKER_PAYLOAD) {
          recognizeMarker();
          return;
        }
      }
    }
    scanFrameRef.current = requestAnimationFrame(scanVideoFrame);
  }, [recognizeMarker]);

  const startCamera = async () => {
    setCameraError(false);
    setCameraLoading(true);
    setDemoMode(false);
    setStage('scanning');
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera API unavailable');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 1920 } },
        audio: false,
      });
      streamRef.current = stream;
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraLoading(false);
      scanFrameRef.current = requestAnimationFrame(scanVideoFrame);
    } catch {
      stopCamera();
      setCameraLoading(false);
      setCameraError(true);
    }
  };

  const startDemo = () => {
    stopCamera();
    setDemoMode(true);
    setCameraError(false);
    setStage('scanning');
  };

  const triggerCinematic = () => {
    if (stage !== 'revealed') return;
    setStage('cinematic');
    setStoryBeat(1);
    SoundEngine.playStampSound();
    window.setTimeout(() => setStoryBeat(2), 1200);
    window.setTimeout(() => setStoryBeat(3), 2450);
    window.setTimeout(() => setStoryBeat(4), 3600);
    window.setTimeout(() => {
      setStage('complete');
      setStampAwarded(true);
      if (!isCollected) onComplete();
    }, 4900);
  };

  const drawCoverImage = (context: CanvasRenderingContext2D, source: CanvasImageSource, sw: number, sh: number, width: number, height: number) => {
    const scale = Math.max(width / sw, height / sh);
    const dw = sw * scale;
    const dh = sh * scale;
    context.drawImage(source, (width - dw) / 2, (height - dh) / 2, dw, dh);
  };

  const capturePhoto = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1440;
    const context = canvas.getContext('2d');
    if (!context) return;

    context.fillStyle = '#0B0E11';
    context.fillRect(0, 0, canvas.width, canvas.height);
    const video = videoRef.current;
    if (!demoMode && video && video.readyState >= 2 && video.videoWidth) {
      drawCoverImage(context, video, video.videoWidth, video.videoHeight, canvas.width, canvas.height);
    } else {
      const backdrop = new Image();
      backdrop.src = WEST_PEAK_ART;
      await backdrop.decode();
      drawCoverImage(context, backdrop, backdrop.naturalWidth, backdrop.naturalHeight, canvas.width, canvas.height);
    }

    context.fillStyle = 'rgba(5, 15, 16, .22)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    const svg = document.getElementById('west-peak-ar-overlay');
    if (svg) {
      const clone = svg.cloneNode(true) as SVGElement;
      clone.setAttribute('width', String(canvas.width));
      clone.setAttribute('height', String(canvas.height));
      clone.setAttribute('class', '');
      const blob = new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml;charset=utf-8' });
      const overlay = new Image();
      overlay.src = URL.createObjectURL(blob);
      await overlay.decode();
      context.drawImage(overlay, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(overlay.src);
    }

    const gradient = context.createLinearGradient(0, 1100, 0, 1440);
    gradient.addColorStop(0, 'rgba(5,15,16,0)');
    gradient.addColorStop(1, 'rgba(5,15,16,.92)');
    context.fillStyle = gradient;
    context.fillRect(0, 1040, 1080, 400);
    context.fillStyle = '#EBC393';
    context.font = '700 34px serif';
    context.fillText(lang === 'zh' ? 'MYTHTRIAL · 西峰' : 'MYTHTRIAL · WEST PEAK', 64, 1320);
    context.fillStyle = '#F5F1DF';
    context.font = '700 58px serif';
    context.fillText(lang === 'zh' ? '劈山救母' : 'SPLITTING THE MOUNTAIN', 64, 1390);
    setPhotoUrl(canvas.toDataURL('image/jpeg', 0.92));
  };

  const downloadPhoto = () => {
    if (!photoUrl) return;
    const link = document.createElement('a');
    link.href = photoUrl;
    link.download = 'mythtrial-west-peak-ar.jpg';
    link.click();
  };

  const closeExperience = () => {
    stopCamera();
    onClose();
  };

  const openPhotoMode = async () => {
    setStage('photo');
    setPhotoUrl('');
    if (!demoMode && !streamRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'user' } }, audio: false });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch {
        setDemoMode(true);
      }
    }
  };

  const storyLines = [t.story1, t.story2, t.story3, t.story4];
  const hasScene = ['revealed', 'cinematic', 'complete', 'photo'].includes(stage);

  return (
    <div className="fixed inset-0 z-[100] bg-[#050B0D] text-[#F4F0DE] overflow-hidden" role="dialog" aria-modal="true" aria-label={t.title}>
      <div className="absolute inset-0">
        {demoMode || stage === 'intro' || cameraError ? (
          <img src={WEST_PEAK_ART} alt="" className="h-full w-full object-cover opacity-60 scale-105" />
        ) : (
          <video ref={videoRef} className="h-full w-full object-cover" playsInline muted />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(3,10,11,.78)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
        <MythSceneOverlay active={hasScene} cinematic={stage === 'cinematic'} />
      </div>
      <canvas ref={scanCanvasRef} className="hidden" />

      <header className="absolute top-0 inset-x-0 z-30 flex items-center justify-between p-4 sm:p-6 safe-top">
        <button onClick={closeExperience} className="min-h-11 px-3 rounded-full border border-white/25 bg-black/45 backdrop-blur-xl flex items-center gap-2 text-sm hover:border-[#EBC393]">
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{lang === 'zh' ? '返回西峰' : 'Back to West Peak'}</span>
        </button>
        <div className="rounded-full border border-[#47BBC1]/50 bg-[#071819]/75 backdrop-blur-xl px-3 py-2 flex items-center gap-2 text-[11px] uppercase tracking-[.18em] text-[#9EE5E0]">
          <span className="w-2 h-2 rounded-full bg-[#47BBC1] animate-pulse" />
          {demoMode ? 'Demo AR' : 'WebAR'}
        </div>
      </header>

      {stage === 'intro' && (
        <div className="relative z-20 h-full flex items-end sm:items-center justify-center p-4 sm:p-8 overflow-y-auto">
          <section className="w-full max-w-xl rounded-[28px] border border-[#47BBC1]/35 bg-[#081316]/88 backdrop-blur-2xl p-5 sm:p-8 shadow-2xl mb-3 sm:mb-0">
            <p className="text-xs tracking-[.22em] text-[#47BBC1] font-bold mb-3">{t.eyebrow}</p>
            <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#F5E7C5] mb-3">{t.title}</h1>
            <p className="text-base sm:text-lg text-[#D5DDD6] leading-relaxed">{t.intro}</p>
            <div className="mt-6 grid gap-3">
              <button id="enter-west-peak-ar" onClick={startCamera} className="min-h-14 rounded-2xl bg-[#EBC393] text-[#12211F] font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-[.99]">
                <Camera className="w-5 h-5" /> {t.enter}
              </button>
              <button id="classroom-demo-mode" onClick={startDemo} className="min-h-13 rounded-2xl border border-[#47BBC1]/60 bg-[#0F2929]/80 text-[#9EE5E0] font-bold flex items-center justify-center gap-2 hover:bg-[#153635]">
                <Play className="w-5 h-5" /> {t.demo}
              </button>
              <button onClick={() => setMarkerOpen(true)} className="min-h-12 rounded-2xl border border-white/20 bg-white/5 text-[#E4E8DF] flex items-center justify-center gap-2 hover:border-[#EBC393]/60">
                <QrCode className="w-5 h-5" /> {t.marker}
              </button>
            </div>
            <div className="mt-5 flex items-start gap-2 text-xs text-[#9BA9A6] leading-relaxed">
              <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-[#47BBC1]" />
              <span>{t.privacy}</span>
            </div>
            <p className="mt-3 text-[10px] text-[#83908D] leading-relaxed">{t.disclosure}</p>
          </section>
        </div>
      )}

      {stage === 'scanning' && !cameraError && (
        <div className="relative z-20 h-full flex flex-col items-center justify-center px-6 text-center">
          <div className="w-[min(76vw,380px)] aspect-square relative mb-7">
            <div className="absolute inset-0 rounded-[32px] border border-white/20 bg-black/5" />
            <span className="scan-corner top-0 left-0 border-t-4 border-l-4" />
            <span className="scan-corner top-0 right-0 border-t-4 border-r-4" />
            <span className="scan-corner bottom-0 left-0 border-b-4 border-l-4" />
            <span className="scan-corner bottom-0 right-0 border-b-4 border-r-4" />
            <span className="ar-scan-line" />
            {demoMode && markerUrl && <img src={markerUrl} alt="Demo marker" className="absolute inset-[12%] w-[76%] h-[76%] rounded-2xl opacity-85" />}
          </div>
          <p className="text-xs tracking-[.2em] text-[#47BBC1] uppercase font-bold">{demoMode ? t.demoScanning : t.scanning}</p>
          <h2 className="mt-2 text-xl sm:text-3xl font-serif font-bold max-w-xl">{demoMode ? t.demoHint : t.scanningHint}</h2>
          {cameraLoading && <p className="mt-4 text-sm text-[#EBC393] animate-pulse">{t.loading}</p>}
          {demoMode && (
            <button onClick={recognizeMarker} className="mt-6 min-h-13 px-7 rounded-full bg-[#EBC393] text-[#10211F] font-bold flex items-center gap-2">
              <QrCode className="w-5 h-5" /> {t.recognize}
            </button>
          )}
          <button onClick={() => { stopCamera(); setStage('intro'); }} className="mt-4 min-h-11 px-5 rounded-full border border-white/25 bg-black/30 text-sm">{t.cancel}</button>
        </div>
      )}

      {cameraError && (
        <div className="relative z-20 h-full flex items-center justify-center p-5">
          <div className="max-w-md rounded-3xl border border-[#EBC393]/45 bg-[#0B1719]/92 backdrop-blur-2xl p-7 text-center">
            <Smartphone className="w-11 h-11 mx-auto text-[#EBC393]" />
            <h2 className="mt-4 text-2xl font-serif font-bold">{t.cameraError}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#BBC6C2]">{t.cameraErrorHint}</p>
            <button onClick={startDemo} className="mt-6 w-full min-h-13 rounded-2xl bg-[#EBC393] text-[#10211F] font-bold">{t.fallback}</button>
            <button onClick={() => { setCameraError(false); setStage('intro'); }} className="mt-3 min-h-11 text-sm text-[#9EE5E0]">{t.markerClose}</button>
          </div>
        </div>
      )}

      {stage === 'revealed' && (
        <button onClick={triggerCinematic} className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-20 sm:pb-16 text-center px-6 group" aria-label={t.tap}>
          <div className="mb-auto mt-24 rounded-full px-4 py-2 border border-[#47BBC1]/40 bg-[#071819]/70 backdrop-blur-lg text-sm text-[#9EE5E0] flex items-center gap-2">
            <Check className="w-4 h-4" /> {t.found}
          </div>
          <div className="ar-tap-prompt rounded-3xl border border-[#EBC393]/55 bg-[#101B1B]/82 backdrop-blur-xl px-6 py-4 shadow-2xl">
            <Sparkles className="w-7 h-7 text-[#EBC393] mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-serif font-bold text-lg sm:text-2xl">{t.tap}</span>
          </div>
        </button>
      )}

      {stage === 'cinematic' && (
        <div className="absolute inset-x-0 bottom-0 z-20 p-4 sm:p-8 pb-8 sm:pb-10 bg-gradient-to-t from-black via-black/70 to-transparent">
          <div className="max-w-2xl mx-auto text-center">
            <p key={storyBeat} className="ar-story-line text-xl sm:text-3xl font-serif font-bold leading-relaxed text-[#FFF4D5]">
              {storyLines[Math.max(0, storyBeat - 1)]}
            </p>
            <div className="mt-5 flex justify-center gap-2">
              {storyLines.map((_, index) => <span key={index} className={`h-1 rounded-full transition-all duration-500 ${index < storyBeat ? 'w-9 bg-[#EBC393]' : 'w-4 bg-white/25'}`} />)}
            </div>
          </div>
        </div>
      )}

      {stage === 'complete' && (
        <div className="relative z-20 h-full flex items-end justify-center p-4 sm:p-8 overflow-y-auto">
          <section className="w-full max-w-xl rounded-[28px] border border-[#EBC393]/50 bg-[#071416]/88 backdrop-blur-2xl p-5 sm:p-7 text-center mb-3">
            <div className="mx-auto w-20 h-20 rounded-2xl border-2 border-[#C04838] text-[#C04838] bg-[#F0DFC8]/95 rotate-[-4deg] flex items-center justify-center font-serif font-black text-xl leading-tight shadow-[0_0_28px_rgba(235,195,147,.35)]">
              {lang === 'zh' ? <>劈山<br />救母</> : <>CLEFT<br />ROCK</>}
            </div>
            <p className="mt-4 text-xs tracking-[.18em] uppercase text-[#EBC393]">
              {stampAwarded ? 'Checkpoint Complete · Seal Recorded' : 'Checkpoint Complete'}
            </p>
            <h2 className="mt-2 text-xl sm:text-3xl font-serif font-bold">{t.seal}</h2>
            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              <button onClick={openPhotoMode} className="min-h-13 rounded-2xl bg-[#EBC393] text-[#10211F] font-bold flex items-center justify-center gap-2">
                <Camera className="w-5 h-5" /> {t.photo}
              </button>
              <button onClick={closeExperience} className="min-h-13 rounded-2xl border border-[#47BBC1]/60 bg-[#0E2929]/80 text-[#A9E9E4] font-bold">{t.finish}</button>
            </div>
            <button onClick={() => { setStage('revealed'); setStoryBeat(0); }} className="mt-3 min-h-11 text-sm text-[#AAB5B1] inline-flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> {t.retake}
            </button>
          </section>
        </div>
      )}

      {stage === 'photo' && (
        <div className="relative z-20 h-full flex flex-col justify-between p-4 sm:p-6 pt-20">
          <div className="text-center">
            <p className="inline-flex px-4 py-2 rounded-full bg-black/55 border border-white/20 backdrop-blur-xl text-sm">{photoUrl ? t.captured : t.photoHint}</p>
          </div>
          {photoUrl && (
            <div className="absolute inset-0 z-30 bg-[#050B0D]/95 p-5 sm:p-10 flex items-center justify-center">
              <button onClick={() => setPhotoUrl('')} className="absolute top-5 right-5 min-w-11 min-h-11 rounded-full bg-white/10 flex items-center justify-center" aria-label="Close photo preview"><X /></button>
              <div className="max-w-sm w-full">
                <img src={photoUrl} alt={t.captured} className="w-full max-h-[72vh] object-contain rounded-2xl border border-[#EBC393]/40 shadow-2xl" />
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button onClick={downloadPhoto} className="min-h-12 rounded-xl bg-[#EBC393] text-[#10211F] font-bold flex items-center justify-center gap-2"><Download className="w-4 h-4" />{t.download}</button>
                  <button onClick={() => setPhotoUrl('')} className="min-h-12 rounded-xl border border-white/25 font-bold">{lang === 'zh' ? '重新拍摄' : 'Retake'}</button>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-center gap-3 pb-4">
            <button onClick={() => setStage('complete')} className="min-w-12 min-h-12 rounded-full border border-white/30 bg-black/50 flex items-center justify-center" aria-label="Back"><ArrowLeft className="w-5 h-5" /></button>
            <button onClick={capturePhoto} className="min-h-16 px-7 rounded-full border-4 border-white bg-[#C04838] text-white font-bold flex items-center justify-center gap-2 shadow-2xl"><Camera className="w-6 h-6" />{t.capture}</button>
          </div>
        </div>
      )}

      {markerOpen && (
        <div className="absolute inset-0 z-50 bg-[#061012]/96 backdrop-blur-2xl overflow-y-auto p-5 flex items-center justify-center">
          <section className="w-full max-w-md rounded-3xl border border-[#47BBC1]/40 bg-[#102024] p-5 sm:p-7 text-center">
            <QrCode className="w-8 h-8 mx-auto text-[#47BBC1]" />
            <h2 className="mt-3 text-xl sm:text-2xl font-serif font-bold">{t.markerTitle}</h2>
            <p className="mt-2 text-sm text-[#AEBBB7] leading-relaxed">{t.markerHint}</p>
            {markerUrl ? <img src={markerUrl} alt={t.markerTitle} className="mt-5 w-full max-w-[300px] mx-auto rounded-2xl bg-[#F2EBD9]" /> : <div className="mt-5 aspect-square bg-white/5 rounded-2xl animate-pulse" />}
            <p className="mt-3 text-[11px] font-mono text-[#EBC393]">MYTHTRIAL · WEST PEAK · 05</p>
            <div className="mt-5 grid grid-cols-2 gap-3 print:hidden">
              <button onClick={() => window.print()} className="min-h-12 rounded-xl bg-[#EBC393] text-[#10211F] font-bold flex items-center justify-center gap-2"><Download className="w-4 h-4" />{t.print}</button>
              <button onClick={() => setMarkerOpen(false)} className="min-h-12 rounded-xl border border-white/25 font-bold">{t.markerClose}</button>
            </div>
          </section>
        </div>
      )}

      <div className="absolute bottom-3 right-3 z-10 hidden sm:flex items-center gap-1.5 text-[10px] text-white/45"><Maximize2 className="w-3 h-3" /> Mobile-first WebAR · local processing</div>
    </div>
  );
};
