import React from 'react';
import { CHAPTER_ARTWORK } from '../data/artworkData';

interface ArtworkMuralProps {
  checkpointId: number;
  className?: string;
}

export const ArtworkMural: React.FC<ArtworkMuralProps> = ({ checkpointId, className = '' }) => {
  const src = CHAPTER_ARTWORK[checkpointId] ?? CHAPTER_ARTWORK[1];

  return (
    <div
      className={`group relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden border border-[#47BBC1]/35 bg-[#0c1418] shadow-2xl ${className}`}
    >
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.025]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#071013]/75 via-transparent to-[#071013]/15 pointer-events-none" />
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#E6E9D1_0.7px,transparent_0.7px)] bg-[size:14px_14px] mix-blend-soft-light" />

      <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#EBC393]/80" />
      <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#EBC393]/80" />
      <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#47BBC1]/80" />
      <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#47BBC1]/80" />
    </div>
  );
};
