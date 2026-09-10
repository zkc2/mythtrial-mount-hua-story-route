import React from 'react';
import { Language, StampData } from '../types';

interface SealStampProps {
  stamp: StampData;
  lang?: Language;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isCollected?: boolean;
  onClick?: () => void;
  showDetails?: boolean;
  interactive?: boolean;
}

export const SealStamp: React.FC<SealStampProps> = ({
  stamp,
  lang = 'en',
  size = 'md',
  isCollected = true,
  onClick,
  showDetails = false,
  interactive = false,
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16 text-xs',
    md: 'w-24 h-24 text-sm',
    lg: 'w-36 h-36 text-base',
    xl: 'w-48 h-48 text-xl',
  }[size];

  const shapeClasses = {
    square: 'rounded-md',
    circle: 'rounded-full',
    octagon: 'rounded-xl',
  }[stamp.sealShape];

  const lines = (lang === 'zh' ? stamp.sealCharactersZh || stamp.sealCharacters : stamp.sealCharacters).split('\n');
  const displayName = lang === 'zh' ? stamp.name || stamp.nameEn : stamp.nameEn;
  const displayMotif = lang === 'zh' ? stamp.motif || stamp.motifEn : stamp.motifEn || stamp.motif;

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center justify-center select-none ${
        interactive ? 'cursor-pointer group transform transition-all duration-300 hover:scale-105' : ''
      }`}
    >
      <div
        className={`${sizeClasses} ${shapeClasses} p-1.5 flex items-center justify-center transition-all duration-500 relative border-2 ${
          isCollected
            ? 'border-[#C04838] bg-[#C04838]/15 shadow-inner seal-imprint'
            : 'border-[#3A454D]/50 bg-[#161D22]/60 opacity-40'
        }`}
        style={{
          boxShadow: isCollected ? 'inset 0 0 15px rgba(192, 72, 56, 0.3), 0 4px 12px rgba(0,0,0,0.5)' : undefined,
        }}
      >
        {/* Ornate inner border */}
        <div
          className={`w-full h-full ${shapeClasses} border border-dashed flex flex-col items-center justify-center relative p-1 ${
            isCollected ? 'border-[#C04838]/80 text-[#C04838]' : 'border-[#3A454D] text-[#5A6570]'
          }`}
        >
          {/* Weathered seal texture overlay */}
          {isCollected && (
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:6px_6px] rounded-inherit" />
          )}

          {/* Central Seal Inscription */}
          <div className="flex flex-col items-center justify-center font-bold tracking-widest text-center leading-tight">
            {lines.map((line, idx) => (
              <span key={idx} className="font-serif text-[0.75em] tracking-wider uppercase">
                {line}
              </span>
            ))}
          </div>

          {/* Decorative Corner Ornaments */}
          <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-current opacity-60" />
          <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-current opacity-60" />
          <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-current opacity-60" />
          <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-current opacity-60" />
        </div>

        {/* Uncollected Lock State */}
        {!isCollected && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-inherit">
            <span className="text-xs text-[#94A3B8] tracking-wider uppercase font-medium">
              {lang === 'zh' ? '未解锁' : 'Locked'}
            </span>
          </div>
        )}
      </div>

      {showDetails && (
        <div className="mt-2 text-center">
          <p className="text-sm font-medium text-[#EBC393] tracking-wide">
            {displayName}
          </p>
          <p className="text-xs text-[#94A3B8] sans-font mt-0.5">
            {displayMotif}
          </p>
        </div>
      )}
    </div>
  );
};
