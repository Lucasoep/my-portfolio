import { motion } from "framer-motion";

/** En simpel planet tegnet i SVG med blød glød */
function Planet({
  size = 180,
  top = "10%",
  left = "5%",
  tint = "#60a5fa",
  withRing = false,
  blur = 12,
  hideOnSmall = false, // NYT: nemt at skjule på små skærme
}: {
  size?: number;
  top?: string;
  left?: string;
  tint?: string;
  withRing?: boolean;
  blur?: number;
  hideOnSmall?: boolean;
}) {
  const id = Math.random().toString(36).slice(2);

  return (
    <motion.div
      className={`absolute pointer-events-none overflow="visible" ${hideOnSmall ? "hidden md:block" : ""}`}
      style={{ top, left, width: size, height: size, filter: `drop-shadow(0 0 ${blur}px ${tint}55)` }}
      animate={{ y: [0, -6, 0, 5, 0] }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} 
    >
      <svg width={size} height={size} viewBox="0 0 100 100" overflow="visible">
  <defs>
    <radialGradient id={`g-${id}`} cx="50%" cy="40%" r="60%">
      <stop offset="0%" stopColor={tint} stopOpacity="0.9" />
      <stop offset="100%" stopColor={tint} stopOpacity="0.2" />
    </radialGradient>
    <linearGradient id={`lg-${id}`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
      <stop offset="100%" stopColor={tint} stopOpacity="0.1" />
    </linearGradient>

    {/* Halvdel-klips i ringens lokale koordinater (før rotation) */}
    {/* Back = øverste halvdel (y:-20..0), Front = nederste halvdel (y:0..20) */}
    <clipPath id={`ring-back-${id}`} clipPathUnits="userSpaceOnUse">
      <rect x="-60" y="-20" width="120" height="20" />
    </clipPath>
    <clipPath id={`ring-front-${id}`} clipPathUnits="userSpaceOnUse">
      <rect x="-60" y="0" width="120" height="20" />
    </clipPath>

       {/* soft glow filter used for the ring's color without a muddy fill */}
    <filter id={`ring-blur-${id}`} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" />
    </filter>

  </defs>



 

  {/* 1) RING (BAGHALVDEL) – tegnes FØRST, og ligger bag planeten */}
  {withRing && (
    <g transform="translate(50,52) rotate(-18)" clipPath={`url(#ring-back-${id})`}>
<ellipse
        rx="50"
        ry="14"
        fill="none"
        stroke={tint}
        strokeOpacity={0.8}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* bright colored glow using blur + screen blend */}
      <ellipse
        rx="50"
        ry="14"
        fill="none"
        stroke={tint}
        strokeOpacity={0.3}
        strokeWidth="3"
        filter={`url(#ring-blur-${id})`}
        style={{ mixBlendMode: "screen" }}
      />
    </g>
  )}

  {/* 2) PLANET – opak base + lys/gradient (skjuler den bageste ring hvor de overlapper) */}
  <circle cx="50" cy="50" r="36" fill="#0b1020" />
  <circle cx="50" cy="50" r="36" fill={`url(#g-${id})`} stroke={`url(#lg-${id})`} strokeWidth="0.6" />
  <ellipse cx="44" cy="48" rx="36" ry="36" fill="rgba(0,0,0,0.18)" />
  <circle cx="38" cy="38" r="15" fill="#fff" opacity="0.01" />

  {/* 3) FRONT HALF OF RING — vivid, *in front of* the planet */}
  {withRing && (
    <g transform="translate(50,52) rotate(-18)" clipPath={`url(#ring-front-${id})`}>
      {/* main colored stroke (no fill) */}
      <ellipse
        rx="50"
        ry="14"
        fill="none"
        stroke={tint}
        strokeOpacity={0.8}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* bright colored glow using blur + screen blend */}
      <ellipse
        rx="50"
        ry="14"
        fill="none"
        stroke={tint}
        strokeOpacity={0.3}
        strokeWidth="3"
        filter={`url(#ring-blur-${id})`}
        style={{ mixBlendMode: "screen" }}
      />
    </g>
  )}
</svg>

    </motion.div>
  );
}


/** En lille satellit med langsom “bane” i et mikro-mønster */
function Satellite({
  centerTop = "8%",
  centerRight = "6%",
  radius = 52, // px bane-radius
}: {
  centerTop?: string;
  centerRight?: string;
  radius?: number;
}) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{ top: centerTop, right: centerRight, width: 1, height: 1 }}
    >
      <motion.div
        // anisotrop bane: lidt oval via x/y nøgleframes
        animate={{
          x: [0, radius, 0, -radius, 0],
          y: [-radius * 0.6, 0, radius * 0.6, 0, -radius * 0.6],
          rotate: [0, 360],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {/* selve satellitten */}
        <svg width="38" height="24" viewBox="0 0 28 18">
          {/* solpaneler */}
          <rect x="0" y="4" width="8" height="10" rx="1.5" fill="#60a5fa" opacity="0.85" />
          <rect x="20" y="4" width="8" height="10" rx="1.5" fill="#60a5fa" opacity="0.85" />
          {/* krop */}
          <rect x="9" y="6" width="10" height="6" rx="1.5" fill="#e5e7eb" />
          {/* antenne */}
          <rect x="13.5" y="1" width="1" height="4" fill="#e5e7eb" />
          <circle cx="14" cy="1" r="1.2" fill="#a78bfa" />
        </svg>
      </motion.div>
    </div>
  );
}

/** Samlet lag: placer planeter/satellit som “dekorations-objekter” */
export default function SpaceObjects() {
  return (
    <div className="absolute inset-0 z-[5] pointer-events-none">
      <Planet size={220} top="14%" left="6%" tint="#60a5fa" withRing/>
      <Planet size={140} top="72%" left="78%" tint="#a78bfa" />
      <Satellite centerTop="10%" centerRight="8%" radius={30} />
    </div>
  );
}

