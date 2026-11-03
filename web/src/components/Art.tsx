// Hand-drawn style illustrations for the website, drawn in code so there are no stock photos.
// Learners are simple flat figures; doodles are the playful extras floating around sections.

type Look = {skin: string; hair: string; top: string; hairStyle?: 'puff' | 'bun' | 'short' | 'long' | 'braids'; glasses?: boolean; prop?: 'laptop' | 'books' | 'tablet' | 'cert' | 'none'};

const ink = '#1E2530';

/** A learner from the waist up, facing forward. Fills its box; pair with a coloured blob behind it. */
export function Learner({skin, hair, top, hairStyle = 'short', glasses, prop = 'none'}: Look) {
  return <svg viewBox="0 0 200 220" width="100%" height="100%" role="img" aria-hidden>
    {/* hair behind the head */}
    {hairStyle === 'long' && <path d="M58 70 C52 120 56 160 66 178 L134 178 C144 160 148 120 142 70 Z" fill={hair} />}
    {hairStyle === 'braids' && <><rect x="56" y="80" width="14" height="92" rx="7" fill={hair} /><rect x="130" y="80" width="14" height="92" rx="7" fill={hair} /></>}
    {/* body */}
    <path d="M38 220 C38 168 62 146 100 146 C138 146 162 168 162 220 Z" fill={top} />
    <path d="M86 146 L100 166 L114 146 Z" fill="#FFFFFF" opacity="0.9" />
    {/* neck and head */}
    <rect x="88" y="120" width="24" height="30" rx="10" fill={skin} />
    <ellipse cx="100" cy="88" rx="40" ry="44" fill={skin} />
    <ellipse cx="60" cy="92" rx="7" ry="10" fill={skin} />
    <ellipse cx="140" cy="92" rx="7" ry="10" fill={skin} />
    {/* hair on top */}
    {hairStyle === 'puff' && <path d="M52 78 C40 36 78 18 100 26 C126 14 166 36 148 80 C140 60 120 52 100 54 C80 52 60 60 52 78 Z" fill={hair} />}
    {hairStyle === 'puff' && <circle cx="100" cy="30" r="26" fill={hair} />}
    {hairStyle === 'bun' && <><circle cx="100" cy="30" r="18" fill={hair} /><path d="M58 82 C56 50 78 40 100 40 C122 40 144 50 142 82 C132 64 116 58 100 58 C84 58 68 64 58 82 Z" fill={hair} /></>}
    {(hairStyle === 'short' || hairStyle === 'braids') && <path d="M58 84 C52 44 84 34 104 36 C132 38 150 56 142 86 C134 66 118 58 100 60 C82 60 66 68 58 84 Z" fill={hair} />}
    {hairStyle === 'long' && <path d="M58 90 C52 46 84 36 104 38 C134 40 150 60 142 92 C128 70 112 62 92 64 C76 66 64 76 58 90 Z" fill={hair} />}
    {/* face */}
    <circle cx="86" cy="92" r="4" fill={ink} />
    <circle cx="114" cy="92" r="4" fill={ink} />
    {glasses && <g fill="none" stroke={ink} strokeWidth="3"><circle cx="86" cy="92" r="11" /><circle cx="114" cy="92" r="11" /><path d="M97 92 h6" /></g>}
    <path d="M90 110 Q100 119 110 110" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
    <circle cx="76" cy="106" r="5" fill="#E8836B" opacity="0.35" />
    <circle cx="124" cy="106" r="5" fill="#E8836B" opacity="0.35" />
    {/* what they're holding */}
    {prop === 'laptop' && <g><rect x="60" y="176" width="80" height="44" rx="6" fill="#DCE3EC" /><rect x="66" y="181" width="68" height="34" rx="3" fill="#2F6DB5" /><circle cx="100" cy="198" r="5" fill="#FDF8F1" /></g>}
    {prop === 'books' && <g><rect x="62" y="182" width="76" height="14" rx="3" fill="#F0B74A" /><rect x="58" y="196" width="84" height="14" rx="3" fill="#2E8B67" /><rect x="64" y="208" width="72" height="12" rx="3" fill="#B53A3A" /></g>}
    {prop === 'tablet' && <g><rect x="70" y="172" width="60" height="48" rx="8" fill={ink} /><rect x="75" y="177" width="50" height="38" rx="4" fill="#74A7E3" /><path d="M86 202 l8 -10 l7 7 l9 -12 l8 15 Z" fill="#FDF8F1" /></g>}
    {prop === 'cert' && <g><rect x="64" y="176" width="72" height="44" rx="4" fill="#FDF8F1" stroke="#F0B74A" strokeWidth="3" /><path d="M76 190 h48 M80 200 h40" stroke="#C9C1B4" strokeWidth="3" strokeLinecap="round" /><circle cx="120" cy="212" r="7" fill="#F0B74A" /></g>}
  </svg>;
}

export const Plane = ({color = '#2F6DB5'}: {color?: string}) => <svg viewBox="0 0 64 48" width="100%" height="100%" aria-hidden><path d="M2 22 L62 2 L40 46 L30 30 Z" fill={color} /><path d="M30 30 L62 2 L24 26 Z" fill="#FFFFFF" opacity="0.35" /><path d="M30 30 L28 42 L36 36" fill={color} opacity="0.8" /></svg>;

export const Balloon = () => <svg viewBox="0 0 48 72" width="100%" height="100%" aria-hidden><path d="M24 2 C10 2 2 14 2 26 C2 40 16 50 24 54 C32 50 46 40 46 26 C46 14 38 2 24 2 Z" fill="#E86A4A" /><path d="M24 2 C18 10 16 20 16 30 C16 40 20 48 24 54 C28 48 32 40 32 30 C32 20 30 10 24 2 Z" fill="#FDF8F1" opacity="0.55" /><path d="M18 56 h12 l-2 10 h-8 Z" fill="#8A5A3C" /><path d="M24 54 v2" stroke="#8A5A3C" /></svg>;

export const Ball = () => <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden><circle cx="24" cy="24" r="21" fill="#C9D84A" /><path d="M6 14 C18 20 18 32 8 36 M40 12 C30 18 30 30 42 36" fill="none" stroke="#FDF8F1" strokeWidth="3" /><path d="M36 2 l4 -2 M42 6 l4 -1 M44 12 l3 1" stroke="#F0B74A" strokeWidth="2" strokeLinecap="round" /></svg>;

export const Target = () => <svg viewBox="0 0 72 56" width="100%" height="100%" aria-hidden><circle cx="44" cy="28" r="26" fill="#FDF8F1" stroke="#74A7E3" strokeWidth="5" /><circle cx="44" cy="28" r="16" fill="none" stroke="#74A7E3" strokeWidth="5" /><circle cx="44" cy="28" r="6" fill="#74A7E3" /><path d="M2 40 L44 28" stroke="#B53A3A" strokeWidth="3" /><path d="M2 40 l8 -8 M2 40 l10 2" stroke="#B53A3A" strokeWidth="3" strokeLinecap="round" /></svg>;

/** The scribbled laptop under the hero, with lines and leaves flowing out of the screen. */
export const Scribble = () => <svg viewBox="0 0 220 180" width="100%" height="100%" aria-hidden fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
  <path d="M46 92 L150 66 L170 128 L66 154 Z" fill="#FDF8F1" />
  <path d="M60 100 L140 80 L154 124 L74 144 Z" fill="#74A7E3" stroke="none" />
  <path d="M66 154 L56 170 L176 140 L170 128" />
  <circle cx="104" cy="112" r="12" fill="#FDF8F1" /><circle cx="104" cy="112" r="4" fill={ink} />
  <path d="M150 66 C170 40 196 34 210 20" stroke="#2E8B67" />
  <path d="M186 34 c6 -10 18 -10 22 -4 c-6 8 -16 10 -22 4 Z" fill="#2E8B67" stroke="none" />
  <path d="M160 52 c-2 -12 6 -20 14 -18 c0 10 -6 16 -14 18 Z" fill="#F0B74A" stroke="none" />
  <path d="M120 70 C122 40 140 24 160 18" stroke="#B53A3A" />
  <circle cx="34" cy="70" r="7" fill="#F0B74A" stroke="none" /><path d="M20 120 c8 -6 14 0 8 8 c-6 8 2 14 10 8" stroke="#2F6DB5" />
</svg>;

export const Sun = () => <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden><circle cx="24" cy="24" r="10" fill="#F0B74A" />{Array.from({length: 8}, (_, i) => <path key={i} d="M24 4 v6" stroke="#F0B74A" strokeWidth="3" strokeLinecap="round" transform={`rotate(${i * 45} 24 24)`} />)}</svg>;

export const Squiggle = ({color = '#FDF8F1'}: {color?: string}) => <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.55"><path d="M10 60 c20 -40 40 40 60 0 s30 -40 40 -10 M20 100 c10 -20 30 10 40 -10 M60 20 c10 10 20 -10 30 0" /></svg>;

export const Pinwheel = () => <svg viewBox="0 0 64 80" width="100%" height="100%" aria-hidden><path d="M32 32 L32 4 L50 18 Z" fill="#B53A3A" /><path d="M32 32 L60 32 L46 50 Z" fill="#2F6DB5" /><path d="M32 32 L32 60 L14 46 Z" fill="#F0B74A" /><path d="M32 32 L4 32 L18 14 Z" fill="#2E8B67" /><path d="M32 32 V78" stroke="#8A5A3C" strokeWidth="3" /><circle cx="32" cy="32" r="3" fill="#FDF8F1" /></svg>;
