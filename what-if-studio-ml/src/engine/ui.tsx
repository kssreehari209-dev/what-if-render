import React from 'react';
import { continueRender, delayRender } from 'remotion';
import { clamp, backOut, easeOut } from './anim';
import { C } from './rig';
import { FONT } from './fonts';

// What goes on top of a shot. The genre keeps text off the picture: one title card, small UI readouts in a mono
// face (a timer, a label, a chip), a few marks. No comic speech bubbles, no "HA HA", no captions of the voice.
// One look for every readout: a dark translucent pill, cream text, orange for the live value.

export const UI = {
  pill: '#0B0816',
  text: '#F6EFE3',
  live: '#FF8A3D',
  good: '#5BE08A',
  bad: '#FF5A4A',
};

/** A four-point sparkle that blooms and fades over 18 frames from t = 0 (a glint, a win). */
export const Sparkle: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => {
  if (t <= 0 || t > 18) return null;
  const k = Math.sin((t / 18) * Math.PI);
  return <path transform={`translate(${x} ${y}) scale(${k * s}) rotate(${t * 6})`} d="M 0 -40 Q 6 -6 40 0 Q 6 6 0 40 Q -6 6 -40 0 Q -6 -6 0 -40 Z" fill="#FFE27A" />;
};

/** A short answer or value as a small label (a sum's answer, a price, "x10"), with an optional mark drawn on after markT. */
export const Tag: React.FC<{ x: number; y: number; t: number; text: string; mark?: 'x' | 'check'; markT?: number; w?: number }> = ({ x, y, t, text, mark, markT = 8, w = 148 }) => {
  if (t < 0) return null;
  const s = backOut(clamp(t / 6));
  const m = clamp((t - markT) / 4);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-w / 2} y={-46} width={w} height={92} rx={46} fill={UI.pill} opacity={0.72} />
      <rect x={-w / 2} y={-46} width={w} height={92} rx={46} fill="none" stroke={UI.text} strokeWidth={3} opacity={0.85} />
      <text y={20} textAnchor="middle" fontFamily={FONT.ui} fontSize={58} fill={UI.text}>
        {text}
      </text>
      {mark && m > 0 ? (
        mark === 'x' ? (
          <path d={`M ${w / 2 + 18} -30 L ${w / 2 + 76} 28 M ${w / 2 + 76} -30 L ${w / 2 + 18} 28`} stroke={UI.bad} strokeWidth={13} strokeLinecap="round" strokeDasharray={170} strokeDashoffset={170 * (1 - m)} />
        ) : (
          <path d={`M ${w / 2 + 16} 0 L ${w / 2 + 38} 26 L ${w / 2 + 82} -32`} stroke={UI.good} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray={110} strokeDashoffset={110 * (1 - m)} />
        )
      ) : null}
    </g>
  );
};

/** A chip in the corner naming the power while it runs (REWIND, COPY, PAUSED...), with an icon that blinks. */
export const HudChip: React.FC<{ x?: number; y?: number; f: number; label: string; icon?: 'rewind' | 'pause' | 'copy' | 'paste' | 'dot' | 'skip' }> = ({ x = 96, y = 112, f, label, icon = 'dot' }) => {
  const blink = Math.floor(f / 5) % 2 ? 1 : 0.5;
  const w = 168 + label.length * 27;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-30} y={-46} width={w} height={92} rx={46} fill={UI.pill} opacity={0.55} />
      <g transform="translate(26 0)" opacity={blink}>
        {icon === 'rewind' ? <path d="M 0 -24 L -26 0 L 0 24 Z M 30 -24 L 4 0 L 30 24 Z" fill="#FFB15A" /> : null}
        {icon === 'pause' ? <path d="M -12 -22 L -2 -22 L -2 22 L -12 22 Z M 8 -22 L 18 -22 L 18 22 L 8 22 Z" fill="#FFB15A" /> : null}
        {icon === 'copy' || icon === 'paste' ? (
          <g fill="none" stroke="#FFB15A" strokeWidth={5} strokeLinejoin="round">
            <rect x={-14} y={-22} width={26} height={32} rx={4} />
            <rect x={-2} y={-10} width={26} height={32} rx={4} fill={icon === 'paste' ? '#FFB15A' : 'none'} />
          </g>
        ) : null}
        {icon === 'dot' ? <circle r={12} fill="#FF4A4A" /> : null}
        {icon === 'skip' ? <path d="M -24 -22 L -2 0 L -24 22 Z M -2 -22 L 20 0 L -2 22 Z M 22 -22 L 30 -22 L 30 22 L 22 22 Z" fill="#FFB15A" /> : null}
      </g>
      <text x={80} y={16} fontFamily={FONT.ui} fontSize={44} fill={UI.text} letterSpacing={6}>
        {label}
      </text>
    </g>
  );
};

/** A round dial with a readout: a stopwatch counting, a countdown, a battery. `p` is how full the ring is (0..1). */
export const Dial: React.FC<{ x?: number; y?: number; p: number; readout: string; r?: number; size?: number }> = ({ x = 1720, y = 140, p, readout, r = 84, size = 40 }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill={UI.pill} opacity={0.55} />
    <circle r={r} fill="none" stroke={UI.text} strokeWidth={5} opacity={0.85} />
    <circle r={r} fill="none" stroke={UI.live} strokeWidth={9} strokeDasharray={2 * Math.PI * r} strokeDashoffset={2 * Math.PI * r * (1 - clamp(p))} transform="rotate(-90)" />
    <rect x={-14} y={-r - 28} width={28} height={18} rx={4} fill={UI.text} opacity={0.85} />
    <text y={size * 0.35} textAnchor="middle" fontFamily={FONT.ui} fontSize={size} fill={UI.live}>
      {readout}
    </text>
  </g>
);

/** A horizontal gauge with a label: how much is left, how fast, how strong. `p` 0..1; it turns red past `danger`. */
export const Gauge: React.FC<{ x: number; y: number; w?: number; p: number; label: string; danger?: number }> = ({ x, y, w = 420, p, label, danger = 0.8 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-20} y={-58} width={w + 40} height={110} rx={22} fill={UI.pill} opacity={0.6} />
    <text x={0} y={-18} fontFamily={FONT.ui} fontSize={28} fill={UI.text} letterSpacing={4} opacity={0.85}>
      {label}
    </text>
    <rect x={0} y={0} width={w} height={26} rx={13} fill="#ffffff" opacity={0.12} />
    <rect x={0} y={0} width={w * clamp(p)} height={26} rx={13} fill={p > danger ? UI.bad : UI.live} />
  </g>
);

/** A label that pops up and drifts off ("x10", "+1", "56"), from t = 0 over 24 frames. */
export const FloatLabel: React.FC<{ x: number; y: number; t: number; text: string; color?: string; size?: number }> = ({ x, y, t, text, color = '#FFE27A', size = 72 }) => {
  if (t < 0 || t > 24) return null;
  const s = backOut(clamp(t / 6));
  return (
    <text x={x} y={y - easeOut(t / 24) * 60} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size * s} fill={color} opacity={clamp((24 - t) / 8)} stroke="#1A1230" strokeWidth={6} paintOrder="stroke">
      {text}
    </text>
  );
};

/** Concentric rings opening out from a point (focus, a realisation, a power switching on), from t = 0 over 18 frames. */
export const FocusRings: React.FC<{ x: number; y: number; t: number; r0?: number; color?: string }> = ({ x, y, t, r0 = 60, color = '#FFE7B3' }) =>
  t > 0 && t < 18 ? (
    <g>
      {[0, 1, 2].map((i) => {
        const r = r0 + (t - i * 4) * 26;
        return r > r0 ? <circle key={i} cx={x} cy={y} r={r} fill="none" stroke={color} strokeWidth={6} opacity={clamp(1 - (t - i * 4) / 14)} /> : null;
      })}
    </g>
  ) : null;

/** Stars circling a dazed head, from t = 0. */
export const DizzyStars: React.FC<{ x: number; y: number; t: number; rx?: number; ry?: number }> = ({ x, y, t, rx = 110, ry = 50 }) =>
  t < 0 ? null : (
    <g>
      {[0, 1, 2].map((i) => {
        const a = t / 4 + (i * Math.PI * 2) / 3;
        return (
          <path
            key={i}
            transform={`translate(${x + Math.cos(a) * rx} ${y + Math.sin(a) * ry}) scale(0.5)`}
            d="M 0 -40 L 10 -12 L 40 -12 L 16 6 L 25 36 L 0 18 L -25 36 L -16 6 L -40 -12 L -10 -12 Z"
            fill="#FFE27A"
            stroke={C.ink}
            strokeWidth={5}
          />
        );
      })}
    </g>
  );

/**
 * A selection box: dashed "marching ants" that draw round a target from t = 0, with corner handles, then hold.
 * For powers that pick a thing out of the world (copy, scan, target, freeze one object).
 */
export const Marquee: React.FC<{ x: number; y: number; w: number; h: number; t: number; color?: string; label?: string }> = ({ x, y, w, h, t, color = '#7FD4FF', label }) => {
  if (t < 0) return null;
  const draw = easeOut(clamp(t / 7));
  const per = 2 * (w + h);
  const ants = (t * 2) % 24;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={color} opacity={0.08 * draw} />
      <rect x={x} y={y} width={w} height={h} fill="none" stroke="#0B0816" strokeWidth={9} opacity={0.5 * draw} strokeDasharray={`${per * draw} ${per}`} />
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={color} strokeWidth={5} strokeDasharray={draw < 1 ? `${per * draw} ${per}` : '14 10'} strokeDashoffset={draw < 1 ? 0 : -ants} />
      {draw >= 1
        ? [
            [x, y],
            [x + w, y],
            [x, y + h],
            [x + w, y + h],
          ].map(([hx, hy], i) => <rect key={i} x={hx - 9} y={hy - 9} width={18} height={18} rx={3} fill="#F6EFE3" stroke={color} strokeWidth={4} />)
        : null}
      {label && draw >= 1 ? (
        <g transform={`translate(${x} ${y - 22})`}>
          <rect x={0} y={-34} width={label.length * 21 + 34} height={44} rx={10} fill={color} />
          <text x={17} y={-3} fontFamily={FONT.ui} fontSize={30} fill="#0B0816">
            {label}
          </text>
        </g>
      ) : null}
    </g>
  );
};

/**
 * Something appearing out of nowhere (a pasted copy, a summoned object): before t = 0 nothing, then it pops in about
 * (x, y) with an overshoot, glowing in the power's colour, and a ring opens out from it. Wrap the thing in it.
 */
export const PasteIn: React.FC<{ x: number; y: number; t: number; children: React.ReactNode; color?: string; ring?: number }> = ({ x, y, t, children, color = '#7FD4FF', ring = 90 }) => {
  if (t < 0) return null;
  const s = backOut(clamp(t / 7));
  const glow = 1 - clamp(t / 14);
  return (
    <g>
      {t < 16 ? <circle cx={x} cy={y} r={ring * (0.6 + easeOut(t / 16) * 1.6)} fill="none" stroke={color} strokeWidth={6} opacity={1 - t / 16} /> : null}
      <g transform={`translate(${x} ${y}) scale(${0.55 + 0.45 * s}) translate(${-x} ${-y})`} style={glow > 0 ? { filter: `drop-shadow(0 0 ${4 + 16 * glow}px ${color}) brightness(${1 + 0.5 * glow})` } : undefined}>
        {children}
      </g>
    </g>
  );
};

/** A small notice that pops in and out (COPIED, SAVED, +1), centred at x, y, from t = 0 for `hold` frames. */
export const Toast: React.FC<{ x: number; y: number; t: number; text: string; hold?: number; color?: string }> = ({ x, y, t, text, hold = 26, color = UI.live }) => {
  if (t < 0 || t > hold + 6) return null;
  const s = t < hold ? backOut(clamp(t / 6)) : 1 - clamp((t - hold) / 6);
  const w = text.length * 26 + 60;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-w / 2} y={-34} width={w} height={68} rx={34} fill={UI.pill} opacity={0.8} />
      <circle cx={-w / 2 + 34} cy={0} r={9} fill={color} />
      <text x={14} y={12} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={UI.text} letterSpacing={4}>
        {text}
      </text>
    </g>
  );
};

/** VHS-style tape lines and a moving bright band, for a power that bends time (rewind, fast-forward). Full frame. */
export const TapeLines: React.FC<{ f: number }> = ({ f }) => {
  const band = 1080 - ((f * 53) % 1400) + 160;
  return (
    <g>
      <defs>
        <pattern id="tapeScan" width="4" height="6" patternUnits="userSpaceOnUse" y={(f * 3) % 6}>
          <rect width="4" height="2" fill="#000" opacity="0.22" />
        </pattern>
      </defs>
      <rect width="1920" height="1080" fill="url(#tapeScan)" />
      <rect x={0} y={band} width={1920} height={26} fill="#FFFFFF" opacity={0.1} />
    </g>
  );
};

/**
 * The title card: a small first line and a big second line, as the genre does it ("WHAT IF YOU COULD" /
 * "COPY AND PASTE ANYTHING?"). Each line pops on (line 1 at t = 2, line 2 at t = 5). `accent` is one word in line 2
 * that pulses at accentT. Put it over a wide establishing shot, upper third.
 */
export const TitleCard: React.FC<{ t: number; lines: [string, string]; accent?: string; accentT?: number; y?: number; size?: number; gap?: number }> = ({ t, lines, accent, accentT = 34, y = 175, size = 128, gap = size - 3 }) => {
  const pop = (d: number) => backOut(clamp((t - d) / 9));
  const pulse = t >= accentT && t < accentT + 12 ? 1 + 0.14 * Math.sin(((t - accentT) / 12) * Math.PI) : 1;
  const words = lines[1].split(' ');
  return (
    <g>
      <g transform={`translate(960 ${y}) scale(${pop(2)})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={600} fontSize={size / 2} letterSpacing={4} fill="#F6EFE3" stroke="#1A1230" strokeWidth={8} paintOrder="stroke">
          {lines[0]}
        </text>
      </g>
      <g transform={`translate(960 ${y + gap}) scale(${pop(5)})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={size} fill={C.orange} stroke="#1A1230" strokeWidth={12} paintOrder="stroke" style={{ filter: 'drop-shadow(0 0 22px rgba(255,138,61,0.55))' }}>
          {words.map((w, i) => (
            <tspan key={i} style={w.replace(/[^\p{L}\p{M}\p{N}]/gu, '') === accent ? { fontSize: size * pulse } : undefined} fill={w.replace(/[^\p{L}\p{M}\p{N}]/gu, '') === accent ? '#FFE27A' : undefined}>
              {(i ? ' ' : '') + w}
            </tspan>
          ))}
        </text>
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- house text (9:16 and 16:9), auto-fitted
// Every on-screen line goes through fitSize, so no title, question or fact line can run off the frame:
// it measures the text in the real font and shrinks it to fit `maxW` (stroke included).
let measureCtx: CanvasRenderingContext2D | null = null;
/** Width of `text` at `size` px in `family`, measured on a canvas (an estimate where no document exists). */
export const textWidth = (text: string, size: number, family = FONT.title, weight = 800) => {
  if (typeof document === 'undefined') return text.length * size * 0.62;
  measureCtx = measureCtx ?? document.createElement('canvas').getContext('2d');
  if (!measureCtx) return text.length * size * 0.62;
  measureCtx.font = `${weight} ${size}px ${family}`;
  return measureCtx.measureText(text).width;
};
/** The largest size up to `size` at which `text` (with its stroke) fits in `maxW`. */
export const fitSize = (text: string, size: number, maxW: number, family = FONT.title, weight = 800, stroke = size / 7) => {
  const w = textWidth(text, size, family, weight) * 1.04 + stroke * 2;
  return w > maxW ? Math.floor((size * maxW) / w) : size;
};

/** Re-render once the web fonts are in, so fitSize measures the real glyphs (renders wait for it). */
export const useFontsReady = () => {
  const [, bump] = React.useState(0);
  const [handle] = React.useState(() => (typeof document !== 'undefined' && document.fonts?.status !== 'loaded' ? delayRender('fit text: fonts') : null));
  React.useEffect(() => {
    if (typeof document === 'undefined' || !document.fonts) return;
    let live = true;
    const done = () => { if (live) bump((n) => n + 1); };
    document.fonts.ready.then(() => { done(); if (handle !== null) continueRender(handle); });
    document.fonts.addEventListener?.('loadingdone', done);
    return () => { live = false; document.fonts.removeEventListener?.('loadingdone', done); };
  }, [handle]);
};

/** A big stroked line of on-screen text (title, mid question, comment question), popping in at t = 0,
 *  auto-shrunk to fit `maxW` (default: the 9:16 frame less a 70 px margin each side). */
export const FitSay: React.FC<{ y: number; text: string; size?: number; color?: string; t?: number; x?: number; maxW?: number }> = ({
  y, text, size = 84, color = '#F6EFE3', t = 99, x = 540, maxW = 940,
}) => {
  useFontsReady();
  if (t < 0) return null;
  const s = fitSize(text, size, maxW);
  const k = backOut(clamp(t / 7));
  return (
    <text x={x} y={y} textAnchor="middle" transform={`translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`} fontFamily={FONT.title} fontWeight={800}
      fontSize={s} fill={color} stroke="#120E22" strokeWidth={s / 7} paintOrder="stroke">{text}</text>
  );
};

/** The house fact card: every real number goes on this and nothing else looks like it. Dark rounded panel, the number
 *  big in orange, one Malayalam line, a small source. Upper third in a Short (y 430), lower third in 16:9 (cx 960, y 860).
 *  Draw it in screen space, outside the camera group. Pass t = 99 on the shots after the one where it lands. */
export const FactCard: React.FC<{ t: number; big: string; line: string; src: string; y?: number; cx?: number; w?: number }> = ({
  t, big, line, src, y = 430, cx = 540, w = 920,
}) => {
  useFontsReady();
  if (t < 0) return null;
  const k = backOut(clamp(t / 7));
  const inner = w - 80;
  return (
    <g transform={`translate(${cx} ${y}) scale(${k})`}>
      <rect x={-w / 2} y={-150} width={w} height={300} rx={36} fill="#120E22" opacity={0.88} />
      <rect x={-w / 2} y={-150} width={w} height={300} rx={36} fill="none" stroke="#FFB15A" strokeWidth={5} />
      <text y={-20} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={fitSize(big, 120, inner, FONT.title, 800, 0)} fill="#FFB15A">{big}</text>
      <text y={64} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={fitSize(line, 44, inner, FONT.title, 700, 0)} fill="#F6EFE3">{line}</text>
      <text y={122} textAnchor="middle" fontFamily={FONT.ui} fontSize={fitSize(src, 28, inner, FONT.ui, 400, 0)} fill="#A99FB8">{src}</text>
    </g>
  );
};

/** The clock-jump readout ("ദിവസം 10", "ഒരു മണിക്കൂർ"): a pill at the top of a Short (y 230) or top centre of 16:9. */
export const TimeTag: React.FC<{ t: number; label: string; value?: string; y?: number; cx?: number }> = ({ t, label, value = '', y = 230, cx = 540 }) => {
  useFontsReady();
  if (t < 0) return null;
  const k = backOut(clamp(t / 6));
  const full = value ? `${label} ${value}` : label;
  const s = fitSize(full, 60, 640, FONT.title, 800, 0);
  const w = Math.max(360, textWidth(full, s) + 200);
  return (
    <g transform={`translate(${cx} ${y}) scale(${k})`}>
      <rect x={-w / 2} y={-58} width={w} height={116} rx={58} fill="#120E22" opacity={0.86} />
      <rect x={-w / 2} y={-58} width={w} height={116} rx={58} fill="none" stroke="#6FD0E0" strokeWidth={4} />
      <circle cx={-w / 2 + 64} cy={0} r={22} fill="none" stroke="#6FD0E0" strokeWidth={6} />
      <path d={`M ${-w / 2 + 64} -12 L ${-w / 2 + 64} 0 L ${-w / 2 + 74} 8`} stroke="#6FD0E0" strokeWidth={5} fill="none" strokeLinecap="round" />
      <text x={30} y={20} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={s} fill="#F6EFE3">
        {label}{value ? <tspan fill="#FFB15A">{` ${value}`}</tspan> : null}
      </text>
    </g>
  );
};
