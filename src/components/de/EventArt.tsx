// Hausgemachte SVG-Illustrationen für Anlässe & besondere Tage. Bewusst als
// Inline-SVG (kein externes Bild): markenkonform (Navy/Grün), gestochen scharf
// auf jedem Display, theme-fest, ohne Ladezeit/CSP-Probleme und beliebig
// skalierbar — ein neuer Anlass braucht nur einen weiteren Motiv-Zweig.
//
// Jedes Motiv zeichnet in eine 800×280-Bühne. `uid` macht die Gradient-IDs
// eindeutig, falls mehrere Illustrationen auf einer Seite stehen.

import type { ReactNode } from "react";

export type EventMotif =
  | "karneval"
  | "asche"
  | "herz"
  | "frauentag"
  | "blumen"
  | "vatertag"
  | "feuer"
  | "kuerbis"
  | "erntedank"
  | "oktoberfest"
  | "laterne"
  | "kerze"
  | "advent1"
  | "advent2"
  | "advent3"
  | "advent4"
  | "nikolaus"
  | "tannenbaum"
  | "feuerwerk"
  | "kalender";

type Tone = readonly [string, string];

// Hintergrund-Verläufe nach Stimmung.
const TONE = {
  festive: ["#eaf4ff", "#dff6ec"] as Tone,
  warm: ["#fff6e0", "#ffe9cc"] as Tone,
  love: ["#ffe9ef", "#ffd9e2"] as Tone,
  solemn: ["#eef2f8", "#e2e8f2"] as Tone,
  winter: ["#eef5ff", "#e3ecfb"] as Tone,
  autumn: ["#fdeede", "#f7e0c4"] as Tone,
  night: ["#0b1f45", "#123063"] as Tone,
} as const;

const NAVY = "#08284f";
const BLUE = "#003890";
const GREEN = "#00b978";
const PERI = "#a4b6f8";
const GOLD = "#f5b800";
const RED = "#e5484d";
const PINK = "#ec5f8b";
const ORANGE = "#f59e0b";
const BROWN = "#a86b32";

/** Kleiner Adventskranz mit `lit` von 4 brennenden Kerzen. */
function adventskranz(lit: number): ReactNode {
  const xs = [325, 375, 425, 475];
  return (
    <g>
      <ellipse cx="400" cy="205" rx="150" ry="34" fill="#1f7a4d" />
      <ellipse cx="400" cy="200" rx="150" ry="34" fill={GREEN} />
      <ellipse cx="400" cy="200" rx="96" ry="18" fill="#eafaf2" />
      {[350, 300, 470, 500, 415, 385].map((cx, i) => (
        <circle key={i} cx={cx} cy={i % 2 ? 190 : 210} r="8" fill={RED} />
      ))}
      {xs.map((cx, i) => {
        const on = i < lit;
        return (
          <g key={cx}>
            <rect x={cx - 8} y={120} width="16" height="82" rx="4" fill={on ? "#f6d5a8" : "#e7ebf1"} />
            <rect x={cx - 8} y={120} width="6" height="82" rx="3" fill={on ? "#fbe7c9" : "#f1f4f8"} />
            <line x1={cx} y1={120} x2={cx} y2={112} stroke={NAVY} strokeWidth="2" />
            {on && (
              <g>
                <ellipse cx={cx} cy={100} rx="7" ry="13" fill={GOLD} />
                <ellipse cx={cx} cy={103} rx="3.5" ry="7" fill="#fff3cf" />
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
}

function confetti(): ReactNode {
  const bits: ReactNode[] = [];
  const cols = [GREEN, GOLD, RED, PERI, BLUE, PINK];
  let seed = 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 46; i++) {
    const x = 40 + rnd() * 720;
    const y = 20 + rnd() * 240;
    const c = cols[i % cols.length];
    const r = rnd();
    if (r < 0.5) bits.push(<rect key={i} x={x} y={y} width="12" height="7" rx="1.5" fill={c} transform={`rotate(${rnd() * 90} ${x} ${y})`} opacity="0.9" />);
    else bits.push(<circle key={i} cx={x} cy={y} r="4.5" fill={c} opacity="0.9" />);
  }
  return <g>{bits}</g>;
}

type Motif = { tone: Tone; art: ReactNode };

function motifFor(motif: EventMotif, uid: string): Motif {
  switch (motif) {
    case "karneval":
      return {
        tone: TONE.festive,
        art: (
          <g>
            {confetti()}
            {/* Maske */}
            <g transform="translate(400 150)">
              <path d="M-95 -30 Q0 -70 95 -30 Q100 20 55 40 Q0 60 -55 40 Q-100 20 -95 -30 Z" fill={BLUE} />
              <path d="M-95 -30 Q0 -70 95 -30 Q100 20 55 40 Q0 60 -55 40 Q-100 20 -95 -30 Z" fill={`url(#kv-shine-${uid})`} opacity="0.35" />
              <ellipse cx="-45" cy="-8" rx="26" ry="18" fill="#fff" />
              <ellipse cx="45" cy="-8" rx="26" ry="18" fill="#fff" />
              <circle cx="-45" cy="-8" r="8" fill={NAVY} />
              <circle cx="45" cy="-8" r="8" fill={NAVY} />
              <path d="M-95 -30 Q-120 -40 -128 -22" stroke={GOLD} strokeWidth="6" fill="none" strokeLinecap="round" />
              <path d="M95 -30 Q120 -40 128 -22" stroke={GOLD} strokeWidth="6" fill="none" strokeLinecap="round" />
              {[-70, -35, 0, 35, 70].map((x, i) => (
                <circle key={i} cx={x} cy={48 + (i % 2 ? 8 : 0)} r="7" fill={[GREEN, GOLD, RED, PERI, PINK][i]} />
              ))}
            </g>
            <linearGradient id={`kv-shine-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </g>
        ),
      };
    case "asche":
      return {
        tone: TONE.solemn,
        art: (
          <g transform="translate(400 145)">
            <circle r="82" fill="#dfe5ef" />
            <circle r="82" fill="none" stroke={NAVY} strokeWidth="2" opacity="0.25" />
            <g stroke={NAVY} strokeWidth="16" strokeLinecap="round" opacity="0.85">
              <line x1="0" y1="-42" x2="0" y2="42" />
              <line x1="-30" y1="-8" x2="30" y2="-8" />
            </g>
            <g fill="#9aa6b6">
              <circle cx="-70" cy="70" r="4" /><circle cx="70" cy="60" r="3" /><circle cx="0" cy="92" r="3.5" />
            </g>
          </g>
        ),
      };
    case "herz":
      return {
        tone: TONE.love,
        art: (
          <g>
            {[[300, 120, 0.6], [500, 110, 0.55], [250, 200, 0.4], [560, 190, 0.45]].map(([x, y, s], i) => (
              <path key={i} transform={`translate(${x} ${y}) scale(${s})`} d="M0 22 C-40 -18 -70 8 0 60 C70 8 40 -18 0 22 Z" fill={PINK} opacity="0.4" />
            ))}
            <path transform="translate(400 140) scale(1.4)" d="M0 22 C-40 -18 -70 8 0 60 C70 8 40 -18 0 22 Z" fill={RED} />
            <path transform="translate(400 140) scale(1.4)" d="M-14 6 q-8 -6 -16 2" stroke="#fff" strokeWidth="3" fill="none" opacity="0.7" strokeLinecap="round" />
          </g>
        ),
      };
    case "frauentag":
      return {
        tone: TONE.love,
        art: (
          <g transform="translate(400 130)">
            <circle r="52" fill="none" stroke={PINK} strokeWidth="12" />
            <line x1="0" y1="52" x2="0" y2="118" stroke={PINK} strokeWidth="12" strokeLinecap="round" />
            <line x1="-28" y1="90" x2="28" y2="90" stroke={PINK} strokeWidth="12" strokeLinecap="round" />
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <ellipse key={a} cx={0} cy={-22} rx="12" ry="26" fill={GOLD} transform={`rotate(${a}) translate(0 -30)`} opacity="0.9" />
            ))}
            <circle r="14" fill={ORANGE} />
          </g>
        ),
      };
    case "blumen":
      return {
        tone: TONE.festive,
        art: (
          <g transform="translate(400 150)">
            <path d="M-6 120 Q-40 40 -70 0" stroke={GREEN} strokeWidth="8" fill="none" strokeLinecap="round" />
            <path d="M0 120 L0 0" stroke={GREEN} strokeWidth="8" fill="none" strokeLinecap="round" />
            <path d="M6 120 Q40 40 70 0" stroke={GREEN} strokeWidth="8" fill="none" strokeLinecap="round" />
            {[[-70, -10, PINK], [0, -20, RED], [70, -10, GOLD]].map(([x, y, c], i) => (
              <g key={i} transform={`translate(${x} ${y})`}>
                {[0, 72, 144, 216, 288].map((a) => (
                  <ellipse key={a} cx="0" cy="-18" rx="11" ry="20" fill={c as string} transform={`rotate(${a})`} />
                ))}
                <circle r="10" fill={GOLD} />
              </g>
            ))}
            <path d="M-78 118 Q0 100 78 118 L64 138 Q0 124 -64 138 Z" fill={PERI} />
          </g>
        ),
      };
    case "vatertag":
      return {
        tone: TONE.warm,
        art: (
          <g transform="translate(400 150)">
            {/* Bierkrug */}
            <rect x="-70" y="-50" width="90" height="120" rx="12" fill="#fff2cf" stroke={BROWN} strokeWidth="4" />
            <rect x="-70" y="-50" width="90" height="30" rx="12" fill="#fff" />
            <ellipse cx="-45" cy="-52" rx="18" ry="12" fill="#fff" />
            <ellipse cx="-10" cy="-58" rx="20" ry="14" fill="#fff" />
            <ellipse cx="18" cy="-50" rx="14" ry="10" fill="#fff" />
            <rect x="-64" y="-14" width="78" height="78" rx="6" fill={GOLD} opacity="0.55" />
            <path d="M20 -30 q46 6 46 46 q0 40 -46 46" fill="none" stroke={BROWN} strokeWidth="10" />
            {/* Wanderweg-Anspielung: Bollerwagen-Rad */}
            <circle cx="70" cy="66" r="20" fill="none" stroke={NAVY} strokeWidth="6" />
            <circle cx="70" cy="66" r="3" fill={NAVY} />
            {[0, 45, 90, 135].map((a) => (
              <line key={a} x1="70" y1="66" x2={70 + 20 * Math.cos((a * Math.PI) / 180)} y2={66 + 20 * Math.sin((a * Math.PI) / 180)} stroke={NAVY} strokeWidth="3" />
            ))}
          </g>
        ),
      };
    case "feuer":
      return {
        tone: TONE.night,
        art: (
          <g>
            {[[120, 70], [680, 90], [230, 50], [560, 60], [400, 40]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="2.5" fill="#fff" opacity="0.8" />
            ))}
            <circle cx="640" cy="70" r="34" fill="#f4f6ff" opacity="0.9" />
            <g transform="translate(400 165)">
              <path d="M0 -95 C40 -50 34 -20 18 -6 C34 -18 28 -55 0 -95 Z" fill={ORANGE} />
              <path d="M0 -80 C30 -44 24 -14 8 0 C-24 -12 -34 -46 0 -80 Z" fill={GOLD} />
              <path d="M0 -50 C16 -28 12 -8 0 2 C-14 -8 -18 -30 0 -50 Z" fill="#fff3cf" />
              {[-60, -30, 0, 30, 60].map((x, i) => (
                <rect key={i} x={x - 6} y={4} width="80" height="14" rx="4" fill={BROWN} transform={`rotate(${x / 2} ${x} 12)`} />
              ))}
            </g>
          </g>
        ),
      };
    case "kuerbis":
      return {
        tone: TONE.autumn,
        art: (
          <g transform="translate(400 150)">
            <circle cx="150" cy="-60" r="30" fill="#fff6e0" opacity="0.9" />
            <g>
              <ellipse cx="0" cy="20" rx="98" ry="80" fill={ORANGE} />
              <ellipse cx="-40" cy="20" rx="34" ry="78" fill="#e8890e" opacity="0.55" />
              <ellipse cx="40" cy="20" rx="34" ry="78" fill="#e8890e" opacity="0.55" />
              <rect x="-10" y="-72" width="20" height="24" rx="6" fill={GREEN} />
              <path d="M-46 -6 l30 26 l-30 0 Z" fill={NAVY} />
              <path d="M46 -6 l-30 26 l30 0 Z" fill={NAVY} />
              <path d="M-52 44 q52 34 104 0 q-14 26 -52 26 q-38 0 -52 -26 Z" fill={NAVY} />
            </g>
          </g>
        ),
      };
    case "erntedank":
      return {
        tone: TONE.autumn,
        art: (
          <g transform="translate(400 150)">
            {[-1, 1].map((s) => (
              <g key={s} transform={`scale(${s} 1)`}>
                <path d="M20 90 Q40 0 30 -80" stroke={BROWN} strokeWidth="6" fill="none" />
                {[-60, -30, 0, 30, 60].map((y, i) => (
                  <ellipse key={i} cx={26 + (i - 2) * 2} cy={y} rx="9" ry="16" fill={GOLD} transform={`rotate(30 26 ${y})`} />
                ))}
              </g>
            ))}
            <ellipse cx="0" cy="96" rx="70" ry="16" fill={BROWN} />
            <circle cx="-30" cy="86" r="18" fill={RED} />
            <circle cx="6" cy="90" r="20" fill="#e0a021" />
            <circle cx="36" cy="84" r="16" fill={GREEN} />
          </g>
        ),
      };
    case "oktoberfest":
      return {
        tone: TONE.warm,
        art: (
          <g transform="translate(400 150)">
            {/* Brezel */}
            <g transform="translate(-120 0)" stroke={BROWN} strokeWidth="16" fill="none" strokeLinecap="round">
              <path d="M-46 -30 C-70 30 -20 60 0 20 C20 60 70 30 46 -30 C20 -6 -20 -6 -46 -30 Z" fill="#e8a94b" />
            </g>
            {/* Bierkrug */}
            <g transform="translate(80 0)">
              <rect x="-52" y="-46" width="86" height="112" rx="10" fill="#fdc743" stroke={BROWN} strokeWidth="4" />
              <rect x="-52" y="-46" width="86" height="26" rx="10" fill="#fff" />
              <ellipse cx="-28" cy="-50" rx="16" ry="12" fill="#fff" />
              <ellipse cx="6" cy="-56" rx="18" ry="13" fill="#fff" />
              <path d="M34 -26 q42 6 42 42 q0 38 -42 44" fill="none" stroke={BROWN} strokeWidth="9" />
            </g>
            {/* Wimpelkette */}
            <g>
              {[-260, -200, -140, -80, -20, 40, 100, 160, 220, 280].map((x, i) => (
                <path key={i} d={`M${x} -108 l24 0 l-12 22 Z`} fill={[BLUE, "#fff", BLUE, "#fff"][i % 4] === "#fff" ? "#e9eefc" : BLUE} />
              ))}
              <path d="M-260 -108 Q20 -96 300 -108" stroke={NAVY} strokeWidth="2" fill="none" />
            </g>
          </g>
        ),
      };
    case "laterne":
      return {
        tone: TONE.night,
        art: (
          <g>
            <path d="M620 60 a34 34 0 1 0 20 62 a42 42 0 1 1 -20 -62 Z" fill="#f4f6ff" opacity="0.9" />
            <g transform="translate(400 150)">
              <line x1="0" y1="-96" x2="-40" y2="-60" stroke={NAVY} strokeWidth="4" />
              <path d="M-40 -60 h80 l-10 120 h-60 Z" fill={GOLD} />
              <path d="M-40 -60 h80 l-10 120 h-60 Z" fill={`url(#lat-glow-${uid})`} opacity="0.5" />
              <rect x="-46" y="-66" width="92" height="10" rx="4" fill={RED} />
              <rect x="-40" y="52" width="80" height="12" rx="4" fill={RED} />
              <path d="M-16 -20 q16 -14 32 0 q-4 24 -16 40 q-12 -16 -16 -40 Z" fill={ORANGE} />
              <circle cx="0" cy="8" r="7" fill="#fff3cf" />
            </g>
            <radialGradient id={`lat-glow-${uid}`}><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
          </g>
        ),
      };
    case "kerze":
      return {
        tone: TONE.solemn,
        art: (
          <g transform="translate(400 150)">
            <ellipse cx="0" cy="110" rx="90" ry="16" fill="#d5dce6" />
            <rect x="-26" y="-40" width="52" height="150" rx="10" fill="#eef2f8" />
            <rect x="-26" y="-40" width="16" height="150" rx="8" fill="#fbfcfe" />
            <line x1="0" y1="-40" x2="0" y2="-56" stroke={NAVY} strokeWidth="2.5" />
            <ellipse cx="0" cy="-70" rx="9" ry="18" fill={GOLD} />
            <ellipse cx="0" cy="-66" rx="4" ry="9" fill="#fff3cf" />
            <circle cx="0" cy="-70" r="34" fill={GOLD} opacity="0.12" />
          </g>
        ),
      };
    case "advent1":
      return { tone: TONE.winter, art: adventskranz(1) };
    case "advent2":
      return { tone: TONE.winter, art: adventskranz(2) };
    case "advent3":
      return { tone: TONE.winter, art: adventskranz(3) };
    case "advent4":
      return { tone: TONE.winter, art: adventskranz(4) };
    case "nikolaus":
      return {
        tone: TONE.winter,
        art: (
          <g transform="translate(400 150)">
            {/* Stiefel */}
            <path d="M-40 -70 h46 v96 h44 q22 0 22 22 v18 h-112 Z" fill={RED} />
            <path d="M-40 -70 h46 v96 h44 q22 0 22 22 v18 h-112 Z" fill={`url(#nk-sh-${uid})`} opacity="0.25" />
            <rect x="-46" y="-84" width="66" height="22" rx="8" fill="#fff" />
            <rect x="-40" y="78" width="112" height="14" rx="6" fill={NAVY} />
            {/* Inhalt */}
            <circle cx="-18" cy="-96" r="14" fill={ORANGE} />
            <circle cx="8" cy="-102" r="12" fill={GOLD} />
            <rect x="-4" y="-118" width="14" height="22" rx="3" fill={GREEN} />
            <linearGradient id={`nk-sh-${uid}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
          </g>
        ),
      };
    case "tannenbaum":
      return {
        tone: TONE.winter,
        art: (
          <g transform="translate(400 148)">
            <path d="M0 -110 L34 -50 L14 -50 L48 6 L20 6 L60 66 L-60 66 L-20 6 L-48 6 L-14 -50 L-34 -50 Z" fill={GREEN} />
            <rect x="-12" y="66" width="24" height="26" rx="3" fill={BROWN} />
            <path d="M0 -128 l7 16 l16 2 l-12 12 l4 17 l-15 -9 l-15 9 l4 -17 l-12 -12 l16 -2 Z" fill={GOLD} />
            {[[-18, -30], [16, -8], [-8, 24], [24, 40], [-30, 44]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="5" fill={[RED, GOLD, PERI, RED, GOLD][i]} />
            ))}
          </g>
        ),
      };
    case "feuerwerk":
      return {
        tone: TONE.night,
        art: (
          <g>
            {[[260, 110, GOLD], [540, 90, GREEN], [400, 150, PERI], [640, 160, RED]].map(([cx, cy, c], i) => (
              <g key={i}>
                {Array.from({ length: 12 }).map((_, k) => {
                  const a = (k * 30 * Math.PI) / 180;
                  const r = i === 2 ? 58 : 40;
                  return <line key={k} x1={cx as number} y1={cy as number} x2={(cx as number) + r * Math.cos(a)} y2={(cy as number) + r * Math.sin(a)} stroke={c as string} strokeWidth="3" strokeLinecap="round" />;
                })}
                {Array.from({ length: 12 }).map((_, k) => {
                  const a = (k * 30 * Math.PI) / 180;
                  const r = i === 2 ? 58 : 40;
                  return <circle key={`d${k}`} cx={(cx as number) + r * Math.cos(a)} cy={(cy as number) + r * Math.sin(a)} r="3.5" fill={c as string} />;
                })}
                <circle cx={cx as number} cy={cy as number} r="5" fill="#fff" />
              </g>
            ))}
          </g>
        ),
      };
    case "kalender":
    default:
      return {
        tone: TONE.festive,
        art: (
          <g transform="translate(400 145)">
            <rect x="-90" y="-70" width="180" height="150" rx="16" fill="#fff" stroke={BLUE} strokeWidth="4" />
            <rect x="-90" y="-70" width="180" height="40" rx="16" fill={BLUE} />
            <rect x="-90" y="-46" width="180" height="16" fill={BLUE} />
            <circle cx="-50" cy="-70" r="10" fill={GREEN} />
            <circle cx="50" cy="-70" r="10" fill={GREEN} />
            {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => <rect key={`${r}-${c}`} x={-70 + c * 38} y={-14 + r * 30} width="24" height="20" rx="4" fill={(r === 1 && c === 2) ? GREEN : "#e8eefb"} />))}
          </g>
        ),
      };
  }
}

export default function EventArt({
  motif,
  uid,
  className = "",
  rounded = true,
}: {
  motif: EventMotif;
  uid?: string;
  className?: string;
  rounded?: boolean;
}) {
  const key = uid ?? motif;
  const { tone, art } = motifFor(motif, key);
  return (
    <svg
      viewBox="0 0 800 280"
      className={className}
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
      style={rounded ? { borderRadius: "1rem" } : undefined}
    >
      <defs>
        <linearGradient id={`bg-${key}`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={tone[0]} />
          <stop offset="1" stopColor={tone[1]} />
        </linearGradient>
      </defs>
      <rect width="800" height="280" fill={`url(#bg-${key})`} />
      {art}
    </svg>
  );
}
