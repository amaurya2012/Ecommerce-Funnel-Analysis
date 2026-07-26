import React from 'react';

const STROKE = { fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };

function Overcoat({ color }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <path
        d="M35 22 L42 30 L50 24 L58 30 L65 22 L72 32 L68 40 L64 34 L64 82 L36 82 L36 34 L32 40 L28 32 Z"
        stroke={color}
        strokeWidth="1.6"
        {...STROKE}
      />
      <path d="M50 24 L50 82" stroke={color} strokeWidth="1" opacity="0.5" {...STROKE} />
      <circle cx="46" cy="46" r="1.4" fill={color} />
      <circle cx="46" cy="56" r="1.4" fill={color} />
      <circle cx="46" cy="66" r="1.4" fill={color} />
    </svg>
  );
}

function Watch({ color }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <path d="M42 18 H58 V30 H42 Z" stroke={color} strokeWidth="1.6" {...STROKE} />
      <path d="M42 70 H58 V82 H42 Z" stroke={color} strokeWidth="1.6" {...STROKE} />
      <circle cx="50" cy="50" r="21" stroke={color} strokeWidth="1.8" {...STROKE} />
      <path d="M50 50 L50 37" stroke={color} strokeWidth="1.6" {...STROKE} />
      <path d="M50 50 L59 55" stroke={color} strokeWidth="1.6" {...STROKE} />
      <circle cx="50" cy="50" r="1.6" fill={color} />
    </svg>
  );
}

function Bag({ color }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <path d="M38 40 Q38 22 50 22 Q62 22 62 40" stroke={color} strokeWidth="1.8" {...STROKE} />
      <rect x="24" y="40" width="52" height="38" rx="6" stroke={color} strokeWidth="1.8" {...STROKE} />
      <path d="M24 54 H76" stroke={color} strokeWidth="1" opacity="0.5" {...STROKE} />
      <rect x="46" y="46" width="8" height="6" rx="1.5" stroke={color} strokeWidth="1.4" {...STROKE} />
    </svg>
  );
}

function Scarf({ color }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <path
        d="M18 34 Q50 20 82 34 Q60 44 82 54 Q50 70 18 54 Q40 44 18 34 Z"
        stroke={color}
        strokeWidth="1.6"
        {...STROKE}
      />
      <path d="M28 62 L24 74 M34 64 L31 76 M40 65 L38 78" stroke={color} strokeWidth="1.2" {...STROKE} />
    </svg>
  );
}

function Loafers({ color }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <path
        d="M20 66 Q20 54 34 52 Q46 50 54 44 Q62 39 72 42 Q82 45 82 58 L82 66 Q82 70 78 70 L24 70 Q20 70 20 66 Z"
        stroke={color}
        strokeWidth="1.8"
        {...STROKE}
      />
      <path d="M40 52 Q46 58 56 56" stroke={color} strokeWidth="1.2" opacity="0.6" {...STROKE} />
      <path d="M24 70 L24 74 H80 L80 70" stroke={color} strokeWidth="1.6" {...STROKE} />
    </svg>
  );
}

function Shirt({ color }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <path
        d="M38 24 L50 32 L62 24 L76 32 L70 44 L64 40 L64 80 L36 80 L36 40 L30 44 L24 32 Z"
        stroke={color}
        strokeWidth="1.6"
        {...STROKE}
      />
      <path d="M50 32 L46 40 L50 46 L54 40 Z" stroke={color} strokeWidth="1.3" {...STROKE} />
      <path d="M50 46 L50 78" stroke={color} strokeWidth="1" opacity="0.5" {...STROKE} />
    </svg>
  );
}

function Sunglasses({ color }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <circle cx="34" cy="50" r="14" stroke={color} strokeWidth="1.8" {...STROKE} />
      <circle cx="66" cy="50" r="14" stroke={color} strokeWidth="1.8" {...STROKE} />
      <path d="M48 48 Q50 44 52 48" stroke={color} strokeWidth="1.8" {...STROKE} />
      <path d="M20 47 L12 43" stroke={color} strokeWidth="1.6" {...STROKE} />
      <path d="M80 47 L88 43" stroke={color} strokeWidth="1.6" {...STROKE} />
    </svg>
  );
}

function Perfume({ color }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <rect x="38" y="16" width="12" height="10" rx="2" stroke={color} strokeWidth="1.6" {...STROKE} />
      <path d="M40 26 L40 34 L34 40 L34 78 Q34 82 38 82 H62 Q66 82 66 78 L66 40 L60 34 L60 26"
        stroke={color} strokeWidth="1.8" {...STROKE} />
      <path d="M34 54 H66" stroke={color} strokeWidth="1" opacity="0.5" {...STROKE} />
      <path d="M44 62 L56 62" stroke={color} strokeWidth="1.2" opacity="0.6" {...STROKE} />
    </svg>
  );
}

function Necklace({ color }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <path
        d="M24 26 Q24 60 50 62 Q76 60 76 26"
        stroke={color}
        strokeWidth="1.4"
        strokeDasharray="1 6"
        {...STROKE}
      />
      <path d="M50 62 L44 74 L50 84 L56 74 Z" stroke={color} strokeWidth="1.8" {...STROKE} />
    </svg>
  );
}

function Sneakers({ color }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <path
        d="M18 62 Q18 50 30 48 L52 42 Q64 38 74 44 Q84 48 84 60 L84 66 Q84 71 79 71 L22 71 Q18 71 18 66 Z"
        stroke={color}
        strokeWidth="1.8"
        {...STROKE}
      />
      <path d="M34 48 L40 56 M42 46 L48 55 M50 44 L56 53" stroke={color} strokeWidth="1.3" {...STROKE} />
      <path d="M22 71 L22 76 H80 L80 71" stroke={color} strokeWidth="1.8" {...STROKE} />
    </svg>
  );
}

function Wallet({ color }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <rect x="22" y="36" width="56" height="38" rx="4" stroke={color} strokeWidth="1.8" {...STROKE} />
      <path d="M50 36 L50 74" stroke={color} strokeWidth="1" opacity="0.5" {...STROKE} />
      <rect x="27" y="43" width="18" height="12" rx="1.5" stroke={color} strokeWidth="1.2" {...STROKE} />
      <path d="M56 46 H73 M56 52 H73 M56 58 H68" stroke={color} strokeWidth="1.1" opacity="0.7" {...STROKE} />
    </svg>
  );
}

function Kurta({ color }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <path
        d="M40 20 L50 28 L60 20 L72 30 L66 42 L62 38 L64 86 H36 L38 38 L34 42 L28 30 Z"
        stroke={color}
        strokeWidth="1.6"
        {...STROKE}
      />
      <circle cx="50" cy="34" r="1.3" fill={color} />
      <circle cx="50" cy="42" r="1.3" fill={color} />
      <circle cx="50" cy="50" r="1.3" fill={color} />
      <path d="M38 60 L34 70 M62 60 L66 70" stroke={color} strokeWidth="1.1" opacity="0.6" {...STROKE} />
    </svg>
  );
}

function Dress({ color }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <path
        d="M40 18 L36 26 L42 32 L34 40 L26 82 L74 82 L66 40 L58 32 L64 26 L60 18 Q50 24 40 18 Z"
        stroke={color}
        strokeWidth="1.6"
        {...STROKE}
      />
      <path d="M42 32 L50 38 L58 32" stroke={color} strokeWidth="1.2" opacity="0.6" {...STROKE} />
      <path d="M34 55 H66" stroke={color} strokeWidth="1" opacity="0.4" {...STROKE} />
    </svg>
  );
}

function Saree({ color }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <path
        d="M38 20 Q30 30 32 42 L28 84 Q50 90 72 84 L68 42 Q70 30 62 20"
        stroke={color}
        strokeWidth="1.6"
        {...STROKE}
      />
      <path d="M32 42 Q50 48 68 42" stroke={color} strokeWidth="1.1" opacity="0.5" {...STROKE} />
      <path d="M38 55 Q50 60 62 55" stroke={color} strokeWidth="1.1" opacity="0.5" {...STROKE} />
      <path d="M44 70 L50 84 L56 70" stroke={color} strokeWidth="1.2" opacity="0.6" {...STROKE} />
    </svg>
  );
}

const ART_MAP = {
  overcoat: Overcoat,
  watch: Watch,
  bag: Bag,
  scarf: Scarf,
  loafers: Loafers,
  shirt: Shirt,
  sunglasses: Sunglasses,
  perfume: Perfume,
  necklace: Necklace,
  sneakers: Sneakers,
  wallet: Wallet,
  kurta: Kurta,
  dress: Dress,
  saree: Saree,
};

export default function ProductArt({ art, accent, aspect = 'square', image = null }) {
  const [imgFailed, setImgFailed] = React.useState(false);
  const Illustration = ART_MAP[art] || Overcoat;
  const aspectClass = aspect === 'wide' ? 'aspect-[4/3]' : 'aspect-square';
  const showImage = Boolean(image) && !imgFailed;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl ${aspectClass}`}
      style={{
        background: `linear-gradient(160deg, ${accent}12, #FFFFFF 75%)`,
        border: '1px solid rgba(23, 34, 59, 0.08)',
      }}
    >
      {showImage ? (
        <img
          src={image}
          alt=""
          onError={() => setImgFailed(true)}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <Illustration color={accent} />
        </div>
      )}
    </div>
  );
}