import React from 'react';
import { CHAPTER_ARTWORK } from '../data/artworkData';

interface ArtworkMuralProps {
  checkpointId: number;
  className?: string;
}

export const ArtworkMural: React.FC<ArtworkMuralProps> = ({ checkpointId, className = '' }) => {
  const src = CHAPTER_ARTWORK[checkpointId] ?? CHAPTER_ARTWORK[1];

  return (
    <div className="flex w-full justify-center">
      <div
        className={`relative w-full max-w-[420px] rounded-2xl overflow-hidden border border-[#47BBC1]/35 bg-[#0c1418] shadow-2xl ${className}`}
      >
        <img
          src={src}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="block h-auto w-full object-contain"
        />

        <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#EBC393]/80 pointer-events-none" />
        <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#EBC393]/80 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#47BBC1]/80 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#47BBC1]/80 pointer-events-none" />
      </div>
    </div>
  );
};
