import React from 'react';
import { ExternalLink, QrCode, Smartphone } from 'lucide-react';
import { Language } from '../types';

interface MobileQrPageProps {
  lang: Language;
}

const PUBLIC_URL = 'https://mythtrial-mount-hua-story-route.vercel.app/';

export const MobileQrPage: React.FC<MobileQrPageProps> = ({ lang }) => {
  const zh = lang === 'zh';

  return (
    <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden px-4 py-10 sm:px-6 sm:py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[420px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#47BBC1]/10 blur-[120px]" />
        <svg className="absolute bottom-0 h-56 w-full text-[#47BBC1] opacity-10" viewBox="0 0 1440 260" preserveAspectRatio="none" fill="currentColor">
          <path d="M0 260V190L180 90l130 110L510 55l175 150L870 35l170 165 190-120 210 120v60H0Z" />
        </svg>
      </div>

      <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#47BBC1]/40 bg-[#122226]/80 px-4 py-2 text-xs font-bold uppercase tracking-[.2em] text-[#47BBC1]">
          <QrCode className="h-4 w-4" />
          <span>{zh ? '移动端入口' : 'Mobile Access'}</span>
        </div>

        <h1 className="mt-6 font-serif text-4xl font-bold text-[#E6E9D1] sm:text-6xl">
          {zh ? '扫码开启华山神话之旅' : 'Scan to Begin the Journey'}
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[#94A3B8] sm:text-lg">
          {zh
            ? '使用手机相机扫描二维码，即可直接打开 MythTrial。无需登录。'
            : 'Scan with your phone camera to open MythTrial directly. No sign-in required.'}
        </p>

        <div className="mt-9 w-full max-w-md rounded-[2rem] border border-[#47BBC1]/35 bg-[#0E161B]/95 p-6 shadow-[0_0_45px_rgba(71,187,193,0.12)] sm:p-9">
          <div className="mx-auto w-full max-w-[280px] rounded-3xl bg-white p-4 shadow-2xl">
            <img
              src="/mythtrial-mobile-qr.png"
              alt={zh ? '打开 MythTrial 的二维码' : 'QR code that opens MythTrial'}
              className="aspect-square w-full"
            />
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm font-bold text-[#47BBC1]">
            <Smartphone className="h-5 w-5" />
            <span>{zh ? '手机扫码 · 直接体验' : 'Scan on mobile · Open instantly'}</span>
          </div>

          <a
            href={PUBLIC_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-[#EBC393]/60 bg-[#EBC393]/10 px-5 py-3 font-bold text-[#EBC393] transition-colors hover:bg-[#EBC393]/20"
          >
            <span>{zh ? '直接打开公开链接' : 'Open the public link'}</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <p className="mt-6 max-w-lg text-xs leading-relaxed text-[#64748B]">
          {zh
            ? '二维码指向公开部署地址。只要网站地址保持不变，该二维码就可以继续使用。'
            : 'This QR code points to the public deployment. It remains usable while the website address stays the same.'}
        </p>
      </div>
    </section>
  );
};
