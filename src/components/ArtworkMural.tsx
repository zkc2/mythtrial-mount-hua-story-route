import React from 'react';

interface ArtworkMuralProps {
  checkpointId: number;
  className?: string;
}

export const ArtworkMural: React.FC<ArtworkMuralProps> = ({ checkpointId, className = '' }) => {
  return (
    <div className={`relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden border border-[#47BBC1]/30 bg-[#0c1418] shadow-2xl ${className}`}>
      {/* Subtle Paper Texture & Ink Wash Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(71,187,193,0.12)_0%,rgba(11,14,17,0.85)_85%)] pointer-events-none z-10" />
      <div className="absolute inset-0 opacity-15 pointer-events-none z-10 bg-[radial-gradient(#E6E9D1_1px,transparent_1px)] bg-[size:16px_16px]" />

      {/* SVG Narrative Mural Illustrations */}
      <svg
        viewBox="0 0 800 450"
        className="w-full h-full object-cover select-none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={`muralSky-${checkpointId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#081014" />
            <stop offset="60%" stopColor="#102528" />
            <stop offset="100%" stopColor="#193836" />
          </linearGradient>

          <linearGradient id={`goldGlow-${checkpointId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF1D0" />
            <stop offset="50%" stopColor="#EBC393" />
            <stop offset="100%" stopColor="#B37E46" />
          </linearGradient>

          <linearGradient id={`turquoiseMural-${checkpointId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6EE7ED" />
            <stop offset="60%" stopColor="#47BBC1" />
            <stop offset="100%" stopColor="#1C6C71" />
          </linearGradient>

          <radialGradient id={`celestialGlow-${checkpointId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#47BBC1" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#EBC393" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0B0E11" stopOpacity="0" />
          </radialGradient>

          <filter id={`softInk-${checkpointId}`}>
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Backdrop Sky */}
        <rect width="800" height="450" fill={`url(#muralSky-${checkpointId})`} />

        {/* Traditional Cloud Scrolls / Background Clouds */}
        <g opacity="0.25" fill="#47BBC1">
          <path d="M50 80 C80 60, 140 60, 160 85 C180 80, 220 90, 210 115 C190 135, 120 135, 90 120 C60 125, 30 110, 50 80 Z" />
          <path d="M600 60 C640 40, 710 40, 730 70 C755 70, 780 85, 770 110 C745 130, 680 125, 650 110 C620 115, 590 95, 600 60 Z" />
        </g>

        {/* Checkpoint Specific Illustrated Scenes */}
        {checkpointId === 1 && (
          /* Checkpoint 1: Visitor Center - Prologue: Origins of Fate */
          <g>
            {/* Misty Distant Peaks */}
            <path d="M100 450 L220 210 L340 450 Z" fill="#0d1f22" opacity="0.6" />
            <path d="M280 450 L460 170 L620 450 Z" fill="#132a2b" opacity="0.8" />
            <path d="M520 450 L680 230 L800 450 Z" fill="#0e2326" opacity="0.6" />

            {/* Glowing Lotus Lantern Central Focus */}
            <circle cx="400" cy="210" r="140" fill={`url(#celestialGlow-${checkpointId})`} />
            
            {/* San Shengmu Temple & Pavilion Silhouette */}
            <g transform="translate(180, 240)">
              {/* Roof eaves */}
              <path d="M10 90 Q 60 70 110 90 L 100 70 Q 60 50 20 70 Z" fill="#EBC393" opacity="0.7" />
              <path d="M-10 120 Q 60 90 130 120 L 120 100 Q 60 75 0 100 Z" fill="#47BBC1" opacity="0.5" />
              <rect x="25" y="120" width="70" height="90" fill="#101c1e" />
              <rect x="45" y="145" width="30" height="65" fill="#EBC393" opacity="0.4" />
            </g>

            {/* Sacred Lotus Blossom Motif */}
            <g transform="translate(400, 210) scale(1.3)">
              {/* Petals */}
              <path d="M0 -60 C-25 -25, -35 15, 0 45 C35 15, 25 -25, 0 -60 Z" fill={`url(#goldGlow-${checkpointId})`} opacity="0.95" />
              <path d="M-30 -40 C-50 -10, -50 25, 0 45 C-15 15, -25 -20, -30 -40 Z" fill={`url(#turquoiseMural-${checkpointId})`} opacity="0.8" />
              <path d="M30 -40 C50 -10, 50 25, 0 45 C15 15, 25 -20, 30 -40 Z" fill={`url(#turquoiseMural-${checkpointId})`} opacity="0.8" />
              <path d="M-55 -15 C-75 10, -60 38, -5 45 C-30 35, -45 10, -55 -15 Z" fill="#EBC393" opacity="0.7" />
              <path d="M55 -15 C75 10, 60 38, 5 45 C30 35, 45 10, 55 -15 Z" fill="#EBC393" opacity="0.7" />
              {/* Divine Flame Core */}
              <circle cx="0" cy="-10" r="14" fill="#FFF8E7" filter={`url(#softInk-${checkpointId})`} />
              <path d="M0 -32 Q 10 -15 0 0 Q -10 -15 0 -32 Z" fill="#FFEFBE" />
            </g>

            {/* Scholar Liu and Goddess encounter silhouetted on foreground misty terrace */}
            <path d="M0 400 Q 250 350 450 390 Q 650 360 800 420 L800 450 L0 450 Z" fill="#081014" />
            {/* Classical Chinese Pine branch */}
            <g transform="translate(80, 290)">
              <path d="M-40 120 Q 30 70 70 20 Q 110 5 150 0" stroke="#EBC393" strokeWidth="4" fill="none" opacity="0.7" />
              <ellipse cx="140" cy="5" rx="35" ry="12" fill="#1b3f3b" />
              <ellipse cx="100" cy="25" rx="30" ry="10" fill="#1b3f3b" />
              <ellipse cx="60" cy="50" rx="25" ry="8" fill="#1b3f3b" />
            </g>
          </g>
        )}

        {checkpointId === 2 && (
          /* Checkpoint 2: Yuquan Temple - Beginning: The Descent of Calamity */
          <g>
            {/* Storm Clouds & Lightning */}
            <path d="M0 450 L180 250 L350 450 Z" fill="#0b171a" />
            <path d="M300 450 L520 180 L750 450 Z" fill="#0e1d21" />
            
            {/* Raging Storm Vortex in sky */}
            <g opacity="0.4" stroke="#47BBC1" strokeWidth="2" fill="none">
              <path d="M400 60 Q 480 30 550 80 Q 600 130 540 180 Q 450 210 380 170 Q 340 120 400 60" />
              <path d="M420 80 Q 470 60 520 100 Q 550 130 510 160 Q 450 180 400 150 Z" />
            </g>

            {/* Mountain Boulders descending over San Shengmu */}
            <path d="M320 140 L480 90 L560 170 L480 260 L360 230 Z" fill="#193333" stroke="#47BBC1" strokeWidth="2" />
            <path d="M220 200 L340 160 L380 240 L310 290 Z" fill="#14282a" stroke="#EBC393" strokeWidth="1.5" />

            {/* Yuquan Cascading Spring and Pine Courtyard */}
            <path d="M0 380 Q 200 340 400 370 Q 600 350 800 400 L800 450 L0 450 Z" fill="#081014" />
            {/* Water currents (Yuquan Springs) */}
            <g stroke="#47BBC1" strokeWidth="2.5" fill="none" opacity="0.7">
              <path d="M220 380 Q 320 370 420 410 Q 520 440 620 430" />
              <path d="M250 400 Q 350 390 450 425 Q 550 450 660 445" />
            </g>

            {/* Erlang Shen Celestial Hound Eyes / Sky Glare */}
            <circle cx="580" cy="110" r="4" fill="#FFF" />
            <circle cx="600" cy="110" r="4" fill="#FFF" />
            <path d="M570 100 L 610 100" stroke="#EBC393" strokeWidth="2" />
          </g>
        )}

        {checkpointId === 3 && (
          /* Checkpoint 3: North Peak - Development: Cultivation in the Mortal Realm */
          <g>
            {/* Shear Precipitous Cloud Terrace Peak */}
            <path d="M240 450 L380 110 L440 110 L520 220 L580 450 Z" fill="#142e30" stroke="#47BBC1" strokeWidth="1.5" />
            {/* Granite Rock Facet lines */}
            <path d="M380 110 L360 250 L330 450" stroke="#1c4749" strokeWidth="2" fill="none" />
            <path d="M410 110 L440 280 L470 450" stroke="#1c4749" strokeWidth="2" fill="none" />

            {/* Perilous Cliff Chains */}
            <path d="M330 380 Q 360 300 385 180" stroke="#EBC393" strokeWidth="2" strokeDasharray="4 3" fill="none" opacity="0.8" />
            <path d="M340 385 Q 370 305 395 185" stroke="#47BBC1" strokeWidth="2" strokeDasharray="4 3" fill="none" opacity="0.8" />

            {/* Young Chenxiang Silhouette practicing with sword on summit */}
            <g transform="translate(395, 88)">
              {/* Figure */}
              <circle cx="15" cy="5" r="4" fill="#EBC393" />
              <path d="M15 9 L15 22 L10 32 M15 22 L20 32" stroke="#EBC393" strokeWidth="2.5" />
              {/* Drawn sword pointing skyward */}
              <path d="M15 15 L28 10 L38 0" stroke="#47BBC1" strokeWidth="2" />
              {/* Sword Aura */}
              <circle cx="38" cy="0" r="6" fill="#47BBC1" opacity="0.6" />
            </g>

            {/* Billowing Seas of Cloud around peak */}
            <g fill="#0e1f23" opacity="0.85">
              <path d="M0 450 C80 340, 200 330, 290 380 C320 360, 390 380, 410 410 C500 370, 650 360, 800 450 Z" />
            </g>
            <g fill="none" stroke="#47BBC1" strokeWidth="1.5" opacity="0.5">
              <path d="M50 360 Q 150 330 250 370" />
              <path d="M480 370 Q 600 340 750 380" />
            </g>
          </g>
        )}

        {checkpointId === 4 && (
          /* Checkpoint 4: Central Peak - Turn: Clouds Surge Over Mount Hua */
          <g>
            {/* Jade Maiden Peak Gnarled Ancient Pines & Storm Dragons */}
            <path d="M120 450 L300 160 L480 450 Z" fill="#0e2325" />
            <path d="M380 450 L560 140 L720 450 Z" fill="#132f31" />

            {/* Ancient Gnarled Pine across summit (Jade Maiden Pine) */}
            <g transform="translate(260, 160)">
              <path d="M0 120 Q 50 60 70 20 Q 90 -20 150 -10 Q 200 0 240 -25" stroke="#EBC393" strokeWidth="6" fill="none" />
              {/* Pine Needle Bundles */}
              <ellipse cx="90" cy="15" rx="30" ry="12" fill="#1e4744" stroke="#47BBC1" strokeWidth="1" />
              <ellipse cx="150" cy="-10" rx="35" ry="14" fill="#1e4744" stroke="#47BBC1" strokeWidth="1" />
              <ellipse cx="230" cy="-25" rx="32" ry="12" fill="#1e4744" stroke="#47BBC1" strokeWidth="1" />
            </g>

            {/* Divine Mountain-Cleaving Axe glowing in ancient pedestal */}
            <g transform="translate(480, 180)">
              <circle cx="0" cy="0" r="60" fill={`url(#celestialGlow-${checkpointId})`} />
              {/* Axe blade & handle */}
              <path d="M-8 45 L-8 -40 L4 -40 L4 45 Z" fill="#EBC393" />
              {/* Curved heavy bronze blade */}
              <path d="M-8 -35 C-35 -40, -50 -10, -55 10 C-35 5, -15 0, -8 5 Z" fill={`url(#turquoiseMural-${checkpointId})`} stroke="#EBC393" strokeWidth="2" />
              <path d="M4 -35 C25 -30, 30 -5, 20 15 C10 8, 4 5, 4 5 Z" fill="#EBC393" />
              {/* Glowing Rune Core */}
              <circle cx="-25" cy="-10" r="5" fill="#FFF" />
            </g>

            {/* Thunder & Cloud surge waves */}
            <g stroke="#EBC393" strokeWidth="2" fill="none" opacity="0.7">
              <path d="M100 120 L 150 160 L 130 180 L 180 230" />
              <path d="M650 100 L 620 140 L 640 160 L 600 210" />
            </g>
          </g>
        )}

        {checkpointId === 5 && (
          /* Checkpoint 5: West Peak - Climax: Splitting the Mountain to Save His Mother */
          <g>
            {/* Gigantic Lotus Peak cleaved cleanly in two (Axe-Cleaving Rock) */}
            {/* Left Cleft Wall */}
            <path d="M100 450 L280 130 L380 130 L375 450 Z" fill="#142c2e" stroke="#47BBC1" strokeWidth="2" />
            {/* Right Cleft Wall (Separated by clean void) */}
            <path d="M425 450 L420 130 L520 130 L700 450 Z" fill="#142c2e" stroke="#47BBC1" strokeWidth="2" />

            {/* Blinding Golden Cleaving Light Burst from the fissure */}
            <g transform="translate(400, 220)">
              <path d="M-50 -180 L 50 -180 L 15 230 L -15 230 Z" fill={`url(#goldGlow-${checkpointId})`} opacity="0.85" filter={`url(#softInk-${checkpointId})`} />
              {/* Radial Light Rays */}
              <circle cx="0" cy="-60" r="80" fill={`url(#celestialGlow-${checkpointId})`} />
              <line x1="-150" y1="-60" x2="150" y2="-60" stroke="#FFF7E0" strokeWidth="3" opacity="0.8" />
              <line x1="-100" y1="-140" x2="100" y2="20" stroke="#FFF7E0" strokeWidth="2" opacity="0.6" />
              <line x1="-100" y1="20" x2="100" y2="-140" stroke="#FFF7E0" strokeWidth="2" opacity="0.6" />
            </g>

            {/* Mother and Son Reunion Silhouette inside radiant clearing */}
            <g transform="translate(390, 240)">
              {/* San Shengmu (left) embracing Chenxiang (right) */}
              <path d="M-8 20 C-15 0, -25 5, -20 -15 C-15 -30, -5 -25, -2 -15 Z" fill="#E6E9D1" />
              <path d="M12 20 C18 5, 25 8, 20 -10 C15 -25, 8 -22, 5 -12 Z" fill="#E6E9D1" />
              {/* Embracing Arms */}
              <path d="M-10 -5 Q 5 -10 12 -5" stroke="#E6E9D1" strokeWidth="3" fill="none" />
              {/* Halo above both */}
              <ellipse cx="2" cy="-35" rx="35" ry="12" fill="none" stroke="#EBC393" strokeWidth="2" strokeDasharray="3 3" />
            </g>

            {/* Shattered Rock Shards around */}
            <polygon points="340,110 355,100 360,118 345,125" fill="#EBC393" />
            <polygon points="440,105 455,95 465,115 450,120" fill="#47BBC1" />
          </g>
        )}

        {checkpointId === 6 && (
          /* Checkpoint 6: West Peak Cableway - Epilogue: The Lantern Illuminates a Thousand Ages */
          <g>
            {/* Sublime Sea of Clouds below peaks */}
            <path d="M0 380 Q 200 320 400 350 Q 600 310 800 370 L800 450 L0 450 Z" fill="#0d1e20" />
            <path d="M80 450 L200 240 L320 450 Z" fill="#091518" opacity="0.7" />
            <path d="M480 450 L640 210 L780 450 Z" fill="#091518" opacity="0.7" />

            {/* Cableway Cables spanning horizontally across the void */}
            <path d="M0 160 Q 400 230 800 130" stroke="#EBC393" strokeWidth="2.5" fill="none" opacity="0.85" />
            <path d="M0 175 Q 400 245 800 145" stroke="#47BBC1" strokeWidth="1.5" fill="none" opacity="0.6" />

            {/* Floating Cable Car (West Peak Cableway Cabin) */}
            <g transform="translate(390, 195)">
              <line x1="20" y1="-2" x2="20" y2="18" stroke="#EBC393" strokeWidth="2.5" />
              {/* Cabin Body */}
              <rect x="0" y="18" width="40" height="30" rx="6" fill="#132b2a" stroke="#47BBC1" strokeWidth="2" />
              {/* Glass panoramic window with warm lamp glow inside */}
              <rect x="5" y="23" width="30" height="15" rx="3" fill="#FFF5D9" opacity="0.9" />
              <line x1="20" y1="23" x2="20" y2="38" stroke="#132b2a" strokeWidth="1.5" />
            </g>

            {/* The Resplendent Baolian Deng (Lotus Lantern) shining in the upper heavens */}
            <g transform="translate(400, 80) scale(1.1)">
              {/* Vast Heavenly Halo */}
              <circle cx="0" cy="0" r="70" fill={`url(#celestialGlow-${checkpointId})`} />
              {/* Twin Lotus Petal Crown */}
              <path d="M0 -30 C-20 -10, -25 15, 0 35 C25 15, 20 -10, 0 -30 Z" fill={`url(#goldGlow-${checkpointId})`} />
              <path d="M-25 -15 C-40 0, -35 25, 0 35 C-10 15, -20 -5, -25 -15 Z" fill={`url(#turquoiseMural-${checkpointId})`} />
              <path d="M25 -15 C40 0, 35 25, 0 35 C10 15, 20 -5, 25 -15 Z" fill={`url(#turquoiseMural-${checkpointId})`} />
              <circle cx="0" cy="2" r="10" fill="#FFFCE8" />
              {/* Radiating Light Particles across universe */}
              <circle cx="-50" cy="-20" r="2.5" fill="#EBC393" />
              <circle cx="60" cy="-15" r="2.5" fill="#47BBC1" />
              <circle cx="-35" cy="40" r="2" fill="#FFF" />
              <circle cx="45" cy="35" r="2.5" fill="#EBC393" />
            </g>
          </g>
        )}

        {/* Traditional Chinese Circular Bi Ornament / Seal Border */}
        <circle cx="400" cy="225" r="215" fill="none" stroke="#47BBC1" strokeWidth="1" opacity="0.25" strokeDasharray="6 4" />
        <circle cx="400" cy="225" r="222" fill="none" stroke="#EBC393" strokeWidth="0.8" opacity="0.15" />
      </svg>

      {/* Decorative Traditional Corner Insets */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#47BBC1]/60" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#47BBC1]/60" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#47BBC1]/60" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#47BBC1]/60" />
    </div>
  );
};
