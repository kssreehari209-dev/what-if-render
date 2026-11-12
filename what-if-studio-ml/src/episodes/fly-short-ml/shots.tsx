// fly-short-ml: the 9:16 Shorts teaser for fly-ml. Every shot is drawn in a 1080 x 1920 world (vcam centres it),
// with characters and text kept in the middle of the frame, clear of the Shorts UI at the bottom and right.
import React from 'react';
import {
  faceAt, clamp, easeOut, easeIn, backOut, LEG_LEN, Pose, Bedroom, BEDROOM, stand, SCH, ShotProps, FONT, Glow, Tag,
  DizzyStars, Sparkle, Stars,
} from '../../engine';
import { SchoolBus, StreetSet } from '../animals3-ml/shots';
import {
  Fig, flyPose, risePose, hoverPose, Sky, CloudRow, CloudSea, Palm, KHouse, Grass, PlaneFront, BlackCar, Gust,
  SpeedLines, Tunnel, Breath, Frost, BlueHands, headAt, handAt, Radar, Big, Real, Fade, FadeIn, kf, PIP, SUIT,
} from './kit';

const feet = (y: number, s: number) => y - LEG_LEN * s;
const shiver = (t: number, a = 3) => Math.sin(t * 2.7) * a;
/** The vertical camera: world point (cx, cy) at the frame centre, scaled by s. */
export const vcam = (cx: number, cy: number, s: number) => `translate(540 960) scale(${s}) translate(${-cx} ${-cy})`;
const vshake = (t: number, from: number, amp = 10) => (t > from ? Math.sin(t * 3.1) * amp * Math.min(1, (t - from) / 10) : 0);
/** Night stars over the whole tall frame. */
const TallStars: React.FC<{ t: number; n?: number }> = ({ t, n = 90 }) => <Stars seed={5} x0={-100} y0={-100} w={1280} h={1500} t={t} n={n} o={0.85} />;
/** Screen-space caption text with the house stroke. */
const Say: React.FC<{ y: number; text: string; size?: number; color?: string; t?: number }> = ({ y, text, size = 84, color = '#F6EFE3', t = 99 }) => {
  const k = backOut(clamp(t / 7));
  if (t < 0) return null;
  return (
    <text x={540} y={y} textAnchor="middle" transform={`translate(540 ${y}) scale(${k}) translate(-540 ${-y})`} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={color} stroke="#120E22" strokeWidth={size / 7} paintOrder="stroke">{text}</text>
  );
};

// ============================================================ A. HOOK: 10 km up, a plane out of the dark
export const A1: React.FC<ShotProps> = ({ t, len }) => {
  const p = hoverPose(540 + shiver(t, 2), 980, t, 0.6, { yaw: 0.2, look: 0.3, armL: { a: 30, b: -40 }, armR: { a: 30, b: -40 }, ...faceAt(t, [[0, 'worried']]) });
  return (
    <g>
      <g transform={vcam(540, kf(t, [[0, 1000], [len, 960]]), kf(t, [[0, 1], [len, 1.12]]))}>
        <Sky id="a1" mode="night" y0={0} y1={1920} />
        <TallStars t={t} />
        <Glow x={760} y={420} r={160} kind="cool" o={0.3} />
        <CloudSea t={t + 40} y={1380} tone="night" />
        <Fig look={PIP} pose={p} rimId="rimBlue" />
        <Frost x={540} y={940} s={0.6} o={0.5} />
        <Breath x={headAt(p).x - 24} y={headAt(p).y + 14} t={t} />
      </g>
      <Tag x={540} y={430} t={t - 4} text="10 കി.മീ. ഉയരം" w={640} />
    </g>
  );
};

export const A2: React.FC<ShotProps> = ({ t }) => {
  const p = hoverPose(540 + shiver(t, 4), 1120, t, 1, { yaw: 0.15, armL: { a: 28, b: -118 }, armR: { a: 28, b: -118 }, headTilt: -4, ...faceAt(t, [[0, 'worried'], [20, 'shock']]) });
  const h = headAt(p);
  return (
    <g transform={vcam(540, 940, 2.1)}>
      <Sky id="a2" mode="night" y0={400} y1={1500} />
      <Stars seed={9} x0={200} y0={500} w={700} h={800} t={t} n={40} o={0.7} />
      <Fig look={PIP} pose={p} rimId="rimBlue" />
      <Frost x={540} y={1060} s={1} o={0.6} />
      <Breath x={h.x - 30} y={h.y + 24} t={t} />
      <Breath x={h.x - 30} y={h.y + 24} t={t - 30} />
    </g>
  );
};

export const A3: React.FC<ShotProps> = ({ t, len }) => {
  const s = 0.03 * Math.pow(30, clamp(t / len));
  const p = hoverPose(540, 1440, t, 0.75, { yaw: 0.3, look: 0.2, headTilt: -16, armL: { a: 60, b: -30 }, armR: { a: 70, b: -20 }, ...faceAt(t, [[0, 'worried'], [24, 'shock']]) });
  return (
    <g transform={`translate(${vshake(t, len * 0.6, 12)} 0)`}>
      <Sky id="a3" mode="night" y0={0} y1={1920} />
      <TallStars t={t} n={60} />
      <Glow x={540} y={700} r={200 + s * 700} kind="warm" o={0.25 + s * 0.5} />
      <PlaneFront x={540} y={720 + s * 60} s={s} t={t} />
      <CloudSea t={t + 120} y={1560} tone="night" />
      <Fig look={PIP} pose={p} rimId="rimR" />
    </g>
  );
};

// ============================================================ B. THREE DAYS AGO: lift-off and the joys
const pos = stand(BEDROOM, 0.5, 0.4);
export const B1: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={vcam(pos.x, kf(t, [[0, 520], [len, 500]]), kf(t, [[0, 1.86], [len, 1.95]]))}>
      <Bedroom t={t} id="b1" lamp={1} />
      <Fig look={PIP} pose={{ ...pos, yaw: 0.1, armL: { a: 12, b: -8 }, armR: { a: 12, b: -8 }, ...faceAt(t, [[0, 'neutral'], [40, 'smug']]) }} shadow={0.5} />
    </g>
    <Tag x={540} y={430} t={t - 2} text="3 ദിവസം മുമ്പ്" w={600} />
  </g>
);

export const B1b: React.FC<ShotProps> = ({ t }) => {
  const p: Partial<Pose> = { ...pos, yaw: 0.05, armL: { a: 12, b: -8 }, armR: { a: 12, b: -8 }, expr: 'neutral', blink: t > 10 ? 1 : 0 };
  const h = headAt(p);
  return (
    <g transform={vcam(h.x, h.y + 40, kf(t, [[0, 3.6], [60, 4.1]]))}>
      <Bedroom t={t} id="b1b" lamp={1} />
      <Fig look={PIP} pose={p} />
    </g>
  );
};

export const B2: React.FC<ShotProps> = ({ t, len }) => {
  const up = 4;
  const lift = kf(t, [[up, 0], [len, -150]], easeIn);
  const p = risePose(pos.x, pos.y + lift, t, pos.scale, { ...faceAt(t - up, [[0, 'shock'], [18, 'happy']]), glint: 0.8 });
  const sole = pos.y + LEG_LEN * pos.scale;
  return (
    <g transform={vcam(pos.x, kf(t, [[0, sole - 120], [len, sole - 260]]), 2.6)}>
      <Bedroom t={t} id="b2" lamp={1} />
      <ellipse cx={pos.x} cy={sole + 4} rx={40 * (1 - clamp(-lift / 120) * 0.6)} ry={8} fill="#000" opacity={0.4 * (1 - clamp(-lift / 150))} />
      <Fig look={PIP} pose={p} rimId="rimBlue" />
      <Gust x={pos.x} y={sole} t={t - up} s={0.35} />
      <Sparkle x={pos.x + 50} y={sole - 60} t={t - 6} s={0.6} />
    </g>
  );
};

export const B3: React.FC<ShotProps> = ({ t, len }) => {
  const busX = kf(t, [[0, 820], [len, 1020]]);
  const px = kf(t, [[0, 640], [len, 1120]], easeOut);
  return (
    <g transform={vcam(960, 520, 1.8)}>
      <StreetSet t={t + 200} />
      <SchoolBus x={busX} y={760} s={0.55} t={t} />
      <Fig look={PIP} pose={flyPose(px, 380, t, 0.5, 1, { expr: 'happy' })} />
      <SpeedLines t={t} dir={1} o={0.3} n={10} />
    </g>
  );
};

export const B4: React.FC<ShotProps> = ({ t, len }) => {
  // the palm fills the tall frame: Pip shoots from the yard to the crown and grabs a tender coconut
  const top = 1650 - 620 * 1.85;
  const climb = kf(t, [[4, 1500], [26, top + 140]], easeOut);
  const grab = t > 30;
  const p = t < 26
    ? risePose(430, climb, t, 0.6, { ...faceAt(t, [[0, 'happy']]) })
    : hoverPose(410, top + 140, t, 0.6, { yaw: 0.5, look: 0.6, armR: { a: grab ? 120 : 90, b: 20 }, ...faceAt(t - 26, [[0, 'smug']]) });
  const h = handAt(p, 'R');
  return (
    <g transform={vcam(540, 960, 1)}>
      <Sky id="b4" mode="day" y0={0} y1={1920} />
      <CloudRow t={t + 60} y={360} n={4} tone="day" speed={-0.3} s={0.5} />
      <KHouse x={300} y={1650} s={0.4} />
      <Palm x={560} y={1650} s={1.85} t={t} lean={24} />
      <Grass y={1650} />
      <Fig look={PIP} pose={p} />
      {grab ? (
        <g>
          <circle cx={h.x} cy={h.y - 8} r={22} fill="#9AB43A" stroke="#1A1230" strokeWidth={4} />
          <Sparkle x={h.x + 30} y={h.y - 40} t={t - 30} s={0.7} />
        </g>
      ) : null}
      {t > 4 && t < 26 ? <SpeedLines t={t} vertical o={0.25} n={10} speed={-50} /> : null}
      <Gust x={430} y={1640} t={t - 4} s={0.5} />
    </g>
  );
};

// ============================================================ TITLE
export const T: React.FC<ShotProps> = ({ t, len }) => {
  const pulse = t >= 14 && t < 26 ? 1 + 0.12 * Math.sin(((t - 14) / 12) * Math.PI) : 1;
  const k1 = backOut(clamp(t / 9));
  const k2 = backOut(clamp((t - 6) / 9));
  return (
    <g>
      <Sky id="ttl" mode="dusk" y0={0} y1={1920} />
      <CloudRow t={t + 500} y={1340} n={6} tone="dusk" speed={-0.6} s={0.8} />
      <CloudRow t={t + 200} y={1520} n={6} tone="dusk" speed={-1} s={1.1} />
      <Fig look={PIP} pose={flyPose(kf(t, [[0, 120], [len, 980]]), 1130, t, 0.42, 1, { expr: 'happy' })} rimId="rimR" />
      <text x={540} y={430} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} letterSpacing={12} fill="#FFE27A" opacity={clamp(t / 6)}>WHAT IF...</text>
      <g transform={`translate(540 640) scale(${k1 * pulse})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={100} fill="#FFFFFF" stroke="#120E22" strokeWidth={14} paintOrder="stroke">
          നിനക്ക് <tspan fill="#FF8A3D">പറക്കാൻ</tspan>
        </text>
      </g>
      <g transform={`translate(540 800) scale(${k2})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#FFFFFF" stroke="#120E22" strokeWidth={15} paintOrder="stroke">പറ്റിയാലോ?</text>
      </g>
      <Fade t={t} len={len} n={8} />
    </g>
  );
};

// ============================================================ C. THE PROBLEM: the air thins
const SchBg: React.FC<{ id: string }> = ({ id }) => (
  <g>
    <defs>
      <pattern id={`${id}g`} width={40} height={40} patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke={SCH.grid} strokeWidth={1.5} />
      </pattern>
    </defs>
    <rect x={-200} y={-200} width={1480} height={2320} fill={SCH.ground} />
    <rect x={-200} y={-200} width={1480} height={2320} fill={`url(#${id}g)`} />
  </g>
);

export const C1: React.FC<ShotProps> = ({ t }) => {
  // an altitude gauge: the fill climbs to 8000 m and the number counts with it
  const k = kf(t, [[4, 0], [60, 0.8]], easeOut);
  const y0 = 1290;
  const y1 = 520; // 10,000 m
  const yk = y0 + (y1 - y0) * k;
  return (
    <g>
      <SchBg id="c1" />
      <text x={540} y={400} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={64} fill={SCH.dim}>ഉയരം</text>
      <rect x={340} y={y1} width={110} height={y0 - y1} rx={20} fill="none" stroke={SCH.line} strokeWidth={6} />
      <rect x={350} y={yk} width={90} height={y0 - yk} rx={14} fill={k > 0.75 ? SCH.live : '#5AB0FF'} />
      {[0, 2000, 4000, 6000, 8000, 10000].map((m) => {
        const yy = y0 + (y1 - y0) * (m / 10000);
        return (
          <g key={m}>
            <line x1={460} y1={yy} x2={500} y2={yy} stroke={SCH.dim} strokeWidth={4} />
            <text x={300} y={yy + 12} textAnchor="end" fontFamily={FONT.ui} fontSize={34} fill={m === 8000 ? SCH.live : SCH.dim}>{m}</text>
          </g>
        );
      })}
      <g transform={`translate(560 ${yk - 20})`}>
        <Fig look={PIP} pose={risePose(80, 0, t, 0.3, { expr: 'happy' })} />
      </g>
      <text x={540} y={1450} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={120} fill={k > 0.75 ? SCH.live : SCH.line} stroke="#120E22" strokeWidth={12} paintOrder="stroke">
        {Math.round(k * 10000 / 100) * 100} m
      </text>
    </g>
  );
};

/** A pair of lungs with oxygen dots inside. */
const Lungs: React.FC<{ x: number; y: number; t: number; dots: number; label: string; c: string }> = ({ x, y, t, dots, label, c }) => {
  const k = clamp(t / 10);
  const br = 1 + 0.04 * Math.sin(t / 8);
  return (
    <g transform={`translate(${x} ${y}) scale(${br})`} opacity={k}>
      <path d="M -20 -150 L -20 -60 M 20 -150 L 20 -60" stroke={c} strokeWidth={8} strokeLinecap="round" />
      <path d="M -30 -80 C -90 -110 -170 -60 -170 40 C -170 130 -110 160 -40 140 C -20 80 -20 0 -30 -80 Z" fill="none" stroke={c} strokeWidth={7} />
      <path d="M 30 -80 C 90 -110 170 -60 170 40 C 170 130 110 160 40 140 C 20 80 20 0 30 -80 Z" fill="none" stroke={c} strokeWidth={7} />
      {Array.from({ length: 9 }).map((_, i) => {
        const on = i < dots * 3;
        const dx = (i % 3) * 40 - 40;
        const dy = Math.floor(i / 3) * 50 - 20;
        return (
          <g key={i} opacity={on ? clamp((t - 6 - i * 2) / 5) : 0.15}>
            <circle cx={-100 + dx * 0.9 + 0} cy={dy + 20} r={14} fill={on ? '#7FD0FF' : SCH.dim} />
            <circle cx={100 + dx * 0.9} cy={dy + 20} r={14} fill={on ? '#7FD0FF' : SCH.dim} />
          </g>
        );
      })}
      <text x={260} y={30} fontFamily={FONT.title} fontWeight={800} fontSize={54} fill={c}>{label}</text>
    </g>
  );
};

export const C2: React.FC<ShotProps> = ({ t }) => (
  <g>
    <SchBg id="c2" />
    <text x={540} y={400} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={56} fill={SCH.dim}>ഓരോ ശ്വാസത്തിലും O₂</text>
    <g transform="translate(-90 0)">
      <Lungs x={540} y={660} t={t} dots={3} label="താഴെ" c={SCH.line} />
      <Lungs x={540} y={1060} t={t - 30} dots={1} label="8000 m" c={SCH.live} />
    </g>
    {t > 60 ? <Big x={540} y={1420} text="1/3" size={170} color={SCH.live} t={t - 60} /> : null}
  </g>
);

export const C2b: React.FC<ShotProps> = ({ t }) => (
  <g>
    <SchBg id="c2b" />
    <path d="M 60 1500 L 330 1000 L 430 1090 L 620 560 L 740 760 L 1020 1500 Z" fill="#1C2C44" stroke={SCH.line} strokeWidth={6} strokeLinejoin="round" />
    <rect x={0} y={560} width={1080} height={180} fill={SCH.live} opacity={0.2 * clamp(t / 8)} />
    <line x1={0} y1={740} x2={1080} y2={740} stroke={SCH.live} strokeWidth={4} strokeDasharray="14 10" opacity={clamp(t / 8)} />
    <text x={540} y={500} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} fill={SCH.live} opacity={clamp((t - 4) / 6)}>മരണ മേഖല · 8000 m+</text>
    <Real x={540} y={1250} t={t - 6} />
  </g>
);

export const C3: React.FC<ShotProps> = ({ t, len }) => {
  const p = risePose(540, 1080 + Math.sin(t / 9) * 20, t, 1, { headTilt: Math.sin(t / 14) * 10, ...faceAt(t, [[0, 'happy'], [70, 'dizzy']]), glint: 0 });
  const h = headAt(p);
  return (
    <g transform={vcam(540, kf(t, [[0, 1000], [len, 960]]), kf(t, [[0, 1.3], [len, 1.7]]))}>
      <Sky id="c3" mode="high" y0={0} y1={1920} />
      <Stars seed={9} x0={-100} y0={-100} w={1280} h={1200} t={t} n={50} o={0.6} />
      <CloudRow t={t} y={1700} n={5} tone="day" speed={-0.3} s={1} o={0.5} />
      <Fig look={PIP} pose={p} rimId="rimBlue" />
      <DizzyStars x={h.x} y={h.y - 60} t={t - 70} rx={70} ry={26} />
      <Tunnel id="c3" x={540} y={960} r={kf(t, [[0, 1300], [len, 700]])} o={0.7} />
    </g>
  );
};

export const C4: React.FC<ShotProps> = ({ t, len }) => {
  const p = risePose(540, 1080, t, 1, { armR: { a: 120, b: 40 }, ...faceAt(t, [[0, 'happy']]), glint: 0 });
  const hd = handAt(p, 'R');
  return (
    <g transform={vcam(kf(t, [[0, hd.x], [len, (hd.x + 540) / 2]]), kf(t, [[0, hd.y + 60], [len, hd.y + 140]]), kf(t, [[0, 2.8], [len, 2.2]]))}>
      <Sky id="c4" mode="high" y0={300} y1={1500} />
      <Fig look={PIP} pose={p} rimId="rimBlue" />
      <BlueHands pose={p} o={clamp((t - 6) / 30)} />
      <Tunnel id="c4" x={hd.x} y={hd.y + 100} r={kf(t, [[0, 600], [len, 400]])} o={0.6} />
    </g>
  );
};

// ============================================================ D. THE RADAR AND THE BLACK CAR
const BLIP = { x: 120, y: -150 };
export const D1: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect x={-200} y={-200} width={1480} height={2320} fill="#05100A" />
    <Glow x={540} y={940} r={600} kind="cool" o={0.2} />
    <text x={540} y={400} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={8} fill="#7CFFB0" opacity={0.8}>RADAR · KOCHI</text>
    <Radar x={540} y={940} r={400} t={t + 30} blips={t > 20 ? [BLIP] : []} id="d1" />
  </g>
);

export const D1b: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={vcam(540 + BLIP.x, 940 + BLIP.y, kf(t, [[0, 1.6], [len, 2.3]], easeOut))}>
      <rect x={-200} y={-200} width={1480} height={2320} fill="#05100A" />
      <Radar x={540} y={940} r={400} t={t + 120} blips={[BLIP]} id="d1b" />
    </g>
    <Say y={720} text="നീ" size={130} color="#FF8A3D" t={t - 2} />
  </g>
);

const Front: React.FC<{ t: number; id: string; door?: number }> = ({ t, id, door = 0 }) => (
  <g>
    <Sky id={id} mode="night" y0={0} y1={1300} />
    <TallStars t={t} n={60} />
    <Palm x={120} y={1300} s={1.1} t={t} dark lean={-40} />
    <Palm x={980} y={1300} s={1.2} t={t} dark lean={40} />
    <KHouse x={540} y={1300} s={0.62} night lit={1} door={door} />
    <Grass y={1300} night />
  </g>
);

export const D2: React.FC<ShotProps> = ({ t, len }) => {
  const carX = kf(t, [[0, 1500], [40, 620]], easeOut);
  return (
    <g transform={vcam(540, kf(t, [[0, 1060], [len, 1100]]), kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Front t={t} id="d2" />
      <BlackCar x={carX} y={1430} s={0.62} t={t < 40 ? t : 40} lights={1} />
    </g>
  );
};

export const D3: React.FC<ShotProps> = ({ t }) => {
  const sp: Partial<Pose> = { x: 560, y: feet(1300, 1.1), scale: 1.1, yaw: -0.2, look: -0.3, armR: { a: t > 24 ? 70 : 12, b: t > 24 ? -30 : -6 }, ...faceAt(t, [[0, 'neutral'], [40, 'smug']]) };
  const h = headAt(sp);
  return (
    <g>
      <g transform={vcam(540, h.y + 200, 1.5)}>
        <Front t={t + 100} id="d3" door={1} />
        <Fig look={SUIT} pose={sp} shadow={0.6} />
      </g>
      <g opacity={clamp((t - 30) / 6)}>
        <rect x={150} y={420} width={780} height={130} rx={65} fill="#120E22" opacity={0.75} />
        <text x={540} y={505} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={62} fill="#F6EFE3">"ഞങ്ങളുടെ കൂടെ വരൂ"</text>
      </g>
    </g>
  );
};

// ============================================================ END: the CTA to the full video
export const END: React.FC<ShotProps> = ({ t, len }) => {
  const full = 70; // മുഴുവൻ lands about 2.3 s in
  const bob = Math.sin(t / 5) * 18;
  const kA = backOut(clamp((t - full - 10) / 8));
  return (
    <g>
      <Sky id="end" mode="night" y0={0} y1={1920} />
      <TallStars t={t} />
      <CloudSea t={t} y={1500} tone="night" />
      {/* Pip, a tiny figure fleeing up into the dark */}
      <Fig look={PIP} pose={risePose(kf(t, [[0, 740], [len, 780]]), kf(t, [[0, 520], [len, 420]]), t, 0.3, { expr: 'worried' })} rimId="rimBlue" />
      <Say y={720} text="നീ" size={140} color="#F6EFE3" t={t - 2} />
      <Say y={870} text="രക്ഷപ്പെട്ടോ?" size={130} color="#FFE27A" t={t - 6} />
      {t > full ? (
        <g transform={`translate(540 1040) scale(${backOut(clamp((t - full) / 8))})`}>
          <rect x={-250} y={-62} width={500} height={124} rx={24} fill="#FF3B30" stroke="#120E22" strokeWidth={6} />
          <path d="M -200 -26 L -200 26 L -158 0 Z" fill="#FFFFFF" />
          <text x={26} y={22} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={64} fill="#FFFFFF">FULL VIDEO</text>
        </g>
      ) : null}
      {t > full + 10 ? (
        <g transform={`translate(540 ${1260 + bob}) scale(${kA})`}>
          <path d="M -34 -110 L 34 -110 L 34 20 L 90 20 L 0 120 L -90 20 L -34 20 Z" fill="#FFE27A" stroke="#120E22" strokeWidth={8} strokeLinejoin="round" />
        </g>
      ) : null}
      <FadeIn t={t} n={4} />
    </g>
  );
};

export const B2b: React.FC<ShotProps> = ({ t, len }) => {
  // low angle: he hangs under the ceiling, delighted, legs kicking
  const p = hoverPose(pos.x, pos.y - kf(t, [[0, 160], [len, 230]]), t, pos.scale, {
    legL: { a: 20 * Math.sin(t / 4), b: 30 }, legR: { a: -20 * Math.sin(t / 4), b: 30 }, armL: { a: 120, b: 20 }, armR: { a: 120, b: 20 },
    ...faceAt(t, [[0, 'happy']]), glint: 0.6,
  });
  return (
    <g transform={vcam(pos.x, kf(t, [[0, 360], [len, 330]]), 1.95)}>
      <Bedroom t={t} id="b2b" lamp={1} />
      <Fig look={PIP} pose={p} rimId="rimBlue" />
    </g>
  );
};
