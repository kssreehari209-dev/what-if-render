// vasco-ml's own pieces: a Kerala dining room, the plate and the curry, a caravel and a dhow, the captain's hat and
// the pilot's turban, a cashew apple, a pepper vine, the map. All pure functions of the shot clock.
import React from 'react';
import {
  makeRoom, Box, RoomShell, BackWindow, Pendant, pendantLight, FloorShadow, WallFrame, WallClock, stand,
  LightVeil, Glow, Dust, Sun, rnd, clamp, kf, joints, toWorld, FONT, LOOKS, Look, Pose,
} from '../../engine';
import { Sky, Palm, full } from '../fly-ml/kit';

export const CAPT: Look = { ...LOOKS.suit, jacket: '#6A2C34', jacketShade: '#54222A', limb: '#3A2A30', accent: '#E9C46A', extra: undefined };
export const PILOT: Look = { ...LOOKS.appu, skin: '#8A5A3C', skinShade: '#74492F', hand: '#8A5A3C', jacket: '#D9CDB4', jacketShade: '#B9AD94', limb: '#D9CDB4', accent: '#B8543A', shoe: '#5A3A2A', extra: undefined };
export const SAILOR: Look = { ...LOOKS.suit, jacket: '#4A4A5A', jacketShade: '#3A3A48', limb: '#3A3446', accent: '#8A8A9A', extra: undefined };

const onHead = (pose: Partial<Pose>) => {
  const p = full(pose);
  const hw = toWorld(p, joints(p).head);
  return { hw, s: p.scale, rot: p.spin + p.tilt + (p.headTilt ?? 0), yawX: p.yaw * 12 };
};
/** A wide-brimmed captain's hat with a plume. `droop` tips it forward. */
export const CapHat: React.FC<{ pose: Partial<Pose>; droop?: number }> = ({ pose, droop = 0 }) => {
  const { hw, s, rot, yawX } = onHead(pose);
  return (
    <g transform={`translate(${hw.x} ${hw.y}) rotate(${rot + droop * 14}) scale(${s})`}>
      <ellipse cx={yawX} cy={-50 + droop * 22} rx={104} ry={19} fill="#1E1A26" stroke="#0E0C14" strokeWidth={5} />
      <path d={`M ${yawX - 58} ${-54 + droop * 22} Q ${yawX - 54} ${-118 + droop * 22} ${yawX} ${-118 + droop * 22} Q ${yawX + 54} ${-118 + droop * 22} ${yawX + 58} ${-54 + droop * 22} Z`} fill="#2A2432" stroke="#0E0C14" strokeWidth={5} />
      <rect x={yawX - 58} y={-72 + droop * 22} width={116} height={14} fill="#E9C46A" />
      <path d={`M ${yawX + 40} ${-82 + droop * 22} Q ${yawX + 110} ${-120 + droop * 40} ${yawX + 120} ${-64 + droop * 60}`} stroke="#D9534F" strokeWidth={14} fill="none" strokeLinecap="round" />
    </g>
  );
};
/** The pilot's white turban. */
export const Turban: React.FC<{ pose: Partial<Pose> }> = ({ pose }) => {
  const { hw, s, rot, yawX } = onHead(pose);
  return (
    <g transform={`translate(${hw.x} ${hw.y}) rotate(${rot}) scale(${s})`}>
      <ellipse cx={yawX * 0.5} cy={-58} rx={76} ry={44} fill="#EFE6D2" stroke="#3A3026" strokeWidth={5} />
      <path d={`M ${yawX * 0.5 - 70} -48 Q ${yawX * 0.5} -86 ${yawX * 0.5 + 72} -66`} stroke="#C9BCA2" strokeWidth={7} fill="none" />
      <path d={`M ${yawX * 0.5 - 62} -72 Q ${yawX * 0.5 + 6} -102 ${yawX * 0.5 + 56} -86`} stroke="#C9BCA2" strokeWidth={6} fill="none" />
    </g>
  );
};

// ---------------------------------------------------------------- the room
export const HOME = makeRoom({ x: 960, y: 500 }, { x0: 470, x1: 1450, y0: 320, y1: 745 }, 3.4);
export const FLOORY = HOME.P(0.5, 1, 0.42).y;
const H = { wall: '#6A5040', side: '#54402F', floor: '#5E2A26', wood: '#6B4430', woodD: '#4A2E20', woodL: '#8A5C40' };

export const Home: React.FC<{ t: number; id: string; veil?: number; win?: number; cup?: number; dim?: number }> = ({ t, id, veil = 0.38, win = 1, cup = 1, dim = 0 }) => {
  const R = HOME;
  const { P } = R;
  const bars = [0, 1, 2, 3, 4, 5, 6];
  return (
    <g>
      <RoomShell r={R} id={id} floor="tiles" wall={H.wall} side={H.side} floorC={H.floor} lines="#451E1C" />
      {/* a lower wall of old wood panel, in every Kerala tharavad corridor */}
      <rect x={470} y={610} width={980} height={135} fill="#54392A" />
      <path d="M 470 610 L 1450 610" stroke="#8A5C40" strokeWidth={5} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <path key={i} d={`M ${520 + i * 124} 618 L ${520 + i * 124} 745`} stroke="#3E2A1E" strokeWidth={4} />)}
      {win ? (
        <g>
          <BackWindow r={R} id={`${id}w`} t={t} x0={700} x1={1080} y0={372} y1={590} sun={{ x: 960, y: 560 }} cols={2} curtains={false} />
          {bars.map((i) => <rect key={i} x={722 + i * 54} y={376} width={8} height={212} fill="#2A1A14" />)}
        </g>
      ) : (
        <g>
          <rect x={686} y={360} width={408} height={244} fill={H.wall} />
          <path d="M 700 372 L 1080 372 L 1080 590 L 700 590 Z" fill="none" stroke="#5A4234" strokeWidth={4} strokeDasharray="14 12" />
        </g>
      )}
      <WallFrame x={520} y={372} w={120} h={150} art={1} />
      <WallClock x={1180} y={410} r={32} t={t} />
      {/* a calendar from the provision store */}
      <rect x={1130} y={470} width={104} height={126} fill="#E6DCC8" />
      <rect x={1130} y={470} width={104} height={32} fill="#B8433A" />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M 1140 ${518 + i * 18} L 1224 ${518 + i * 18}`} stroke="#9A8E7A" strokeWidth={4} />)}
      {/* the doorway on the left wall, open to the veranda's evening */}
      <polygon points={R.Q([[0, 0.2, 0.2], [0, 0.2, 0.46], [0, 1, 0.46], [0, 1, 0.2]])} fill="#E9925A" opacity={0.85} />
      <polygon points={R.Q([[0, 0.17, 0.17], [0, 0.17, 0.49], [0, 0.2, 0.49], [0, 0.2, 0.17]])} fill={H.woodD} />
      {cup ? (
        <g>
          <FloorShadow r={R} u={[0.74, 0.98]} w={[0.02, 0.2]} />
          <Box r={R} u={[0.76, 0.98]} v={[0.12, 1]} w={[0.02, 0.2]} front={H.wood} side={H.woodD} top={H.woodL} />
          {(() => {
            const a = R.P(0.77, 0.15, 0.2);
            const b = R.P(0.865, 0.96, 0.2);
            const c = R.P(0.875, 0.15, 0.2);
            const d = R.P(0.97, 0.96, 0.2);
            return (
              <g>
                <rect x={a.x} y={a.y} width={b.x - a.x} height={b.y - a.y} fill="none" stroke={H.woodD} strokeWidth={5} />
                <rect x={c.x} y={c.y} width={d.x - c.x} height={d.y - c.y} fill="none" stroke={H.woodD} strokeWidth={5} />
                <circle cx={b.x - 16} cy={(a.y + b.y) / 2} r={7} fill="#E9C46A" />
                <circle cx={c.x + 16} cy={(a.y + b.y) / 2} r={7} fill="#E9C46A" />
              </g>
            );
          })()}
        </g>
      ) : null}
      <Pendant r={R} u={0.5} w={0.42} v={0.2} t={t} />
      <LightVeil id={`${id}v`} lights={[[890, 520, 360], pendantLight(R, 0.5, 0.42, 0.2), [240, 620, 300]]} o={veil} />
      <Glow x={pendantLight(R, 0.5, 0.42, 0.2)[0]} y={pendantLight(R, 0.5, 0.42, 0.2)[1] - 30} r={260} o={0.34} />
      <Dust t={t} seed={41} x0={700} y0={420} w={420} h={320} n={26} />
      {dim > 0 ? <rect x={-1500} y={-1500} width={5000} height={4500} fill="#0A0814" opacity={0.72 * dim} /> : null}
    </g>
  );
};

export const stood = (u: number, w: number) => stand(HOME, u, w);

/** The dining table, side on: top at y, legs down to floor. */
export const KTable: React.FC<{ x: number; y: number; w?: number; floor: number; o?: number }> = ({ x, y, w = 460, floor, o = 1 }) => (
  <g opacity={o}>
    <ellipse cx={x} cy={floor + 4} rx={w * 0.56} ry={22} fill="#000" opacity={0.4} />
    {[-1, 1].map((k) => <rect key={k} x={x + k * (w / 2 - 34) - 13} y={y + 12} width={26} height={floor - y - 12} fill={H.woodD} />)}
    <rect x={x - w / 2} y={y} width={w} height={26} rx={5} fill={H.woodL} stroke="#2A1A14" strokeWidth={4} />
    <path d={`M ${x - w / 2 + 6} ${y + 4} L ${x + w / 2 - 6} ${y + 4}`} stroke="#FFC98A" strokeWidth={3} opacity={0.7} />
  </g>
);
export const KChair: React.FC<{ x: number; floor: number; seat: number; o?: number }> = ({ x, floor, seat, o = 1 }) => (
  <g opacity={o}>
    <rect x={x - 76} y={seat - 170} width={16} height={floor - seat + 170} fill={H.woodD} />
    <rect x={x + 60} y={seat} width={16} height={floor - seat} fill={H.woodD} />
    <rect x={x - 82} y={seat - 8} width={166} height={18} rx={4} fill={H.wood} stroke="#2A1A14" strokeWidth={3} />
  </g>
);
/** A steel plate, side on, with kappa on it, and a small curry bowl. */
export const PlateSide: React.FC<{ x: number; y: number; s?: number; kappa?: number }> = ({ x, y, s = 1, kappa = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {kappa ? <path d="M -56 -8 Q -40 -44 0 -40 Q 44 -44 58 -8 Z" fill="#EFE3B8" stroke="#9A8A5A" strokeWidth={3} /> : null}
    <ellipse cx={0} cy={-4} rx={90} ry={11} fill="#C4CAD0" stroke="#5E666E" strokeWidth={3} />
    <path d="M 118 -2 Q 118 -34 146 -34 Q 174 -34 174 -2 Z" fill="#AEB6BC" stroke="#5E666E" strokeWidth={3} />
    <ellipse cx={146} cy={-33} rx={28} ry={6} fill="#C2452E" />
  </g>
);

// ---------------------------------------------------------------- inserts
const kappaBits = [[-70, -40, 74, 40, -14], [30, -66, 70, 38, 22], [76, 18, 66, 36, -30], [-30, 34, 80, 42, 10], [-104, 40, 56, 32, 34], [16, 6, 62, 34, -8]];
export const KappaPlate: React.FC<{ x: number; y: number; r?: number; gone?: number }> = ({ x, y, r = 330, gone = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={10} cy={18} rx={r + 22} ry={r + 16} fill="#000" opacity={0.4} />
    <circle r={r} fill="#C8CED4" stroke="#5E666E" strokeWidth={8} />
    <circle r={r * 0.82} fill="#AAB2B9" />
    <path d={`M ${-r * 0.7} ${-r * 0.3} Q ${-r * 0.4} ${-r * 0.8} ${r * 0.1} ${-r * 0.75}`} stroke="#FFF" strokeWidth={10} fill="none" opacity={0.45} strokeLinecap="round" />
    {gone < 1
      ? kappaBits.map(([bx, by, w, h, rot], i) => (
          <g key={i} transform={`translate(${bx * 1.7} ${by * 1.7}) rotate(${rot}) scale(${1.7 * (1 - gone)})`}>
            <ellipse rx={w} ry={h} fill="#EFE3B8" stroke="#A8966A" strokeWidth={4} />
            <path d={`M ${-w * 0.5} ${-h * 0.3} Q 0 ${-h * 0.7} ${w * 0.5} ${-h * 0.2}`} stroke="#FFF8DC" strokeWidth={6} fill="none" />
          </g>
        ))
      : null}
  </g>
);
export const Chilli: React.FC<{ x: number; y: number; s?: number; t: number; hat?: boolean; walk?: boolean }> = ({ x, y, s = 1, t, hat = true, walk = true }) => {
  const st = walk ? Math.sin(t / 2.2) : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {walk ? <path d={`M -8 0 L ${-14 + st * 12} 34 M 10 0 L ${16 - st * 12} 34`} stroke="#3A1A14" strokeWidth={7} strokeLinecap="round" /> : null}
      <path d="M 0 -110 Q 44 -70 26 -20 Q 14 12 -14 8 Q 0 -30 -18 -74 Q -18 -100 0 -110 Z" fill="#D8302A" stroke="#6A1410" strokeWidth={5} />
      <path d="M 2 -112 Q 4 -130 -8 -140" stroke="#4A7A3A" strokeWidth={10} fill="none" strokeLinecap="round" />
      <circle cx={10} cy={-72} r={5} fill="#1A1014" /><circle cx={24} cy={-68} r={4} fill="#1A1014" />
      {hat ? (
        <g transform="translate(6 -126) rotate(-8)">
          <ellipse rx={46} ry={9} fill="#1E1A26" />
          <path d="M -26 -2 Q -24 -36 0 -36 Q 24 -36 26 -2 Z" fill="#2A2432" />
          <path d="M 18 -22 Q 50 -38 54 -12" stroke="#E9C46A" strokeWidth={7} fill="none" strokeLinecap="round" />
        </g>
      ) : null}
      {walk ? (
        <g transform={`translate(-44 ${-16 + st * 3})`}>
          <path d="M -14 -22 L -14 -32 L 14 -32 L 14 -22" stroke="#2A1A14" strokeWidth={5} fill="none" />
          <rect x={-34} y={-22} width={68} height={46} rx={5} fill="#8A5C40" stroke="#2A1A14" strokeWidth={4} />
          <path d="M -34 0 L 34 0" stroke="#E9C46A" strokeWidth={4} />
        </g>
      ) : null}
    </g>
  );
};
export const CashewApple: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M 0 -60 L 0 -86" stroke="#4A3A24" strokeWidth={6} />
    <path d="M -38 -46 Q -46 -66 0 -66 Q 46 -66 38 -46 Q 34 16 0 34 Q -34 16 -38 -46 Z" fill="#F2B23A" stroke="#7A4A14" strokeWidth={4} />
    <path d="M 22 -50 Q 34 -8 8 26 Q 30 12 34 -44 Z" fill="#D8532E" opacity={0.85} />
    <path d="M -6 30 Q -24 44 -12 62 Q 6 72 18 56 Q 22 40 8 30 Z" fill="#6A5A48" stroke="#2A1F18" strokeWidth={4} />
  </g>
);
export const Peppers: React.FC<{ x: number; y: number; n: number; seed: number; s?: number }> = ({ x, y, n, seed, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={`M 0 0 Q ${(rnd(seed, 1) - 0.5) * 24} ${n * 14} 0 ${n * 30}`} stroke="#5A7A3A" strokeWidth={5} fill="none" />
    {Array.from({ length: n }).map((_, i) => {
      const k = i % 2 ? 1 : -1;
      const c = rnd(seed, i) > 0.65 ? '#C8402A' : rnd(seed, i + 9) > 0.5 ? '#3E7A36' : '#5A9A42';
      return (
        <g key={i}>
          <circle cx={k * 15} cy={i * 30 + 10} r={16} fill={c} stroke="#14241A" strokeWidth={3} />
          <circle cx={k * 15 - 5} cy={i * 30 + 5} r={4} fill="#FFF" opacity={0.5} />
        </g>
      );
    })}
  </g>
);

// ---------------------------------------------------------------- ships
/** A caravel side on, bow to the right, at the waterline (x, y). `flip` turns it to the left. */
export const Caravel: React.FC<{ x: number; y: number; s?: number; t: number; flip?: boolean; dark?: boolean; tatter?: number; crew?: number; o?: number; flag?: 'cross' | 'dutch' | 'english' }> = ({
  x, y, s = 1, t, flip = false, dark = false, tatter = 0, crew = 0, o = 1, flag = 'cross',
}) => {
  const hull = dark ? '#100A14' : '#5A3626';
  const hullD = dark ? '#0A060C' : '#3E2418';
  const sail = dark ? '#1E1420' : '#EADFC6';
  const sailS = dark ? '#160E18' : '#C9BCA0';
  const line = '#1A1014';
  const rock = Math.sin(t / 14) * 2;
  const bob = Math.sin(t / 11) * 6;
  const cross = '#B32C2C';
  const sailPath = (cx: number, top: number, w: number, h: number) => {
    const bottom = top + h;
    if (!tatter) return `M ${cx - w / 2} ${top} Q ${cx + 14} ${top + 10} ${cx + w / 2} ${top} Q ${cx + w / 2 + 30} ${top + h / 2} ${cx + w / 2} ${bottom} Q ${cx + 14} ${bottom + 22} ${cx - w / 2} ${bottom} Q ${cx - w / 2 + 34} ${top + h / 2} ${cx - w / 2} ${top} Z`;
    let d = `M ${cx - w / 2} ${top} L ${cx + w / 2} ${top} L ${cx + w / 2 + 12} ${top + h * 0.6}`;
    for (let i = 0; i < 7; i++) d += ` L ${cx + w / 2 - (i + 0.5) * (w / 7)} ${top + h * (i % 2 ? 0.8 : 0.48)}`;
    return `${d} L ${cx - w / 2} ${top + h * 0.5} Z`;
  };
  const crossAt = (cx: number, cy: number, r: number) => (
    <path d={`M ${cx - r} ${cy} L ${cx + r} ${cy} M ${cx} ${cy - r} L ${cx} ${cy + r}`} stroke={cross} strokeWidth={r * 0.42} strokeLinecap="round" />
  );
  const heads = Array.from({ length: crew }).map((_, i) => {
    const hx = -210 + (i / Math.max(1, crew - 1)) * 410 + (rnd(5, i) - 0.5) * 8;
    const hy = -96 - rnd(7, i) * 16;
    return (
      <g key={i}>
        <line x1={hx} y1={hy} x2={hx} y2={-60} stroke={dark ? '#0E0A12' : '#2A2230'} strokeWidth={7} />
        <circle cx={hx} cy={hy} r={11} fill={dark ? '#120C14' : ['#D9B48E', '#C49A76', '#E2C2A0'][i % 3]} stroke={line} strokeWidth={2.5} />
      </g>
    );
  });
  return (
    <g opacity={o} transform={`translate(${x} ${y + bob}) rotate(${rock * (flip ? -1 : 1)}) scale(${flip ? -s : s} ${s})`}>
      {[-150, 40, 200].map((mx, i) => <line key={i} x1={mx} y1={-40} x2={mx} y2={i === 1 ? -500 : -400} stroke={line} strokeWidth={13} strokeLinecap="round" />)}
      <path d={sailPath(40, -460, 260, 240)} fill={sail} stroke={line} strokeWidth={5} />
      <path d={sailPath(200, -360, 150, 170)} fill={sailS} stroke={line} strokeWidth={5} />
      <path d={sailPath(-150, -360, 180, 180)} fill={sailS} stroke={line} strokeWidth={5} />
      {!tatter && !dark && flag === 'cross' ? crossAt(40, -345, 70) : null}
      {!tatter && !dark && flag === 'cross' ? crossAt(-150, -270, 42) : null}
      {flag === 'dutch' ? (
        <g><rect x={40} y={-540} width={100} height={22} fill="#D8582A" /><rect x={40} y={-518} width={100} height={22} fill="#EFE6D2" /><rect x={40} y={-496} width={100} height={22} fill="#2A4A8A" /></g>
      ) : flag === 'english' ? (
        <g><rect x={40} y={-540} width={100} height={66} fill="#EFE6D2" /><path d="M 90 -540 L 90 -474 M 40 -507 L 140 -507" stroke="#B32C2C" strokeWidth={15} /></g>
      ) : null}
      {heads}
      <path d="M -300 -120 L -300 -196 L -180 -196 L -160 -92 L 170 -92 L 246 -136 L 340 -150 L 280 -40 Q 230 18 150 22 L -210 22 Q -280 10 -300 -120 Z" fill={hull} stroke={line} strokeWidth={6} strokeLinejoin="round" />
      <path d="M -270 -60 L 268 -60" stroke={hullD} strokeWidth={9} />
      <path d="M -254 -18 L 240 -18" stroke={hullD} strokeWidth={7} />
      {!dark ? <path d="M -296 -194 L -182 -194" stroke="#FFC98A" strokeWidth={3} opacity={0.7} /> : null}
    </g>
  );
};
/** A dhow: lateen sail, low hull. */
export const Dhow: React.FC<{ x: number; y: number; s?: number; t: number; dark?: boolean; crew?: number; flip?: boolean }> = ({ x, y, s = 1, t, dark = false, crew = 0, flip = false }) => (
  <g transform={`translate(${x} ${y + Math.sin(t / 10) * 5}) rotate(${Math.sin(t / 13) * 2}) scale(${flip ? -s : s} ${s})`}>
    <line x1={0} y1={-20} x2={10} y2={-330} stroke="#1A1014" strokeWidth={10} />
    <path d="M -170 -60 L 110 -350 Q 120 -190 60 -60 Z" fill={dark ? '#CFC7B8' : '#EFE6D2'} stroke="#1A1014" strokeWidth={5} />
    {Array.from({ length: crew }).map((_, i) => {
      const hx = -160 + (i / Math.max(1, crew - 1)) * 300;
      return <circle key={i} cx={hx} cy={-66 - rnd(3, i) * 10} r={10} fill={dark ? '#14101A' : '#8A5A3C'} stroke="#1A1014" strokeWidth={2} />;
    })}
    <path d="M -210 -48 L 240 -66 Q 210 16 110 20 L -130 20 Q -190 8 -210 -48 Z" fill={dark ? '#2A1E22' : '#6A4A34'} stroke="#1A1014" strokeWidth={5} strokeLinejoin="round" />
  </g>
);

// ---------------------------------------------------------------- places
export type SeaMode = 'dusk' | 'red' | 'night';
const SEAC: Record<SeaMode, [string, string, string, string]> = {
  dusk: ['#F09A62', '#8A4470', '#2E1E4A', '#FFD9A8'],
  red: ['#A82A2E', '#4A1426', '#1E0A18', '#E8604A'],
  night: ['#1E3050', '#0E1A30', '#070C18', '#4A6A96'],
};
/** The water from y down, with moving wave lines and the sun's broken path on it (glitter at sunX, if given). */
export const SeaBody: React.FC<{ t: number; id: string; y: number; mode?: SeaMode; sunX?: number; glint?: string }> = ({ t, id, y, mode = 'dusk', sunX, glint }) => {
  const c = SEAC[mode];
  const wave = (yy: number, ph: number, amp: number) => {
    let d = `M -2000 ${yy}`;
    for (let x = -2000; x <= 4000; x += 80) d += ` Q ${x + 40} ${yy - amp * Math.sin(t / 8 + x / 140 + ph)} ${x + 80} ${yy}`;
    return d;
  };
  return (
    <g>
      <defs>
        <linearGradient id={`sb_${id}`} gradientUnits="userSpaceOnUse" x1={0} y1={y} x2={0} y2={y + 460}>
          <stop offset="0" stopColor={c[0]} /><stop offset="0.45" stopColor={c[1]} /><stop offset="1" stopColor={c[2]} />
        </linearGradient>
      </defs>
      <rect x={-3000} y={y} width={8000} height={3000} fill={`url(#sb_${id})`} />
      {[0, 1, 2, 3, 4, 5].map((k) => <path key={k} d={wave(y + 26 + k * k * 15 + k * 22, k * 1.7, 4 + k * 2)} stroke={c[3]} strokeWidth={2 + k * 0.7} fill="none" opacity={0.36 - k * 0.03} />)}
      {sunX !== undefined
        ? Array.from({ length: 13 }).map((_, i) => {
            const yy = y + 10 + i * i * 2.4 + i * 9;
            const w = 210 - i * 11 + Math.sin(t / 5 + i * 1.9) * 34;
            return <rect key={i} x={sunX - w / 2 + Math.sin(t / 7 + i) * 14} y={yy} width={w} height={5 + i * 0.7} rx={3} fill={glint ?? c[3]} opacity={0.62 - i * 0.035} />;
          })
        : null}
    </g>
  );
};
export const Sea: React.FC<{ t: number; id: string; mode?: SeaMode; horizon?: number; sunX?: number }> = ({ t, id, mode = 'dusk', horizon = 640, sunX = 1400 }) => (
  <g>
    <Sky id={id} mode={mode === 'night' ? 'night' : mode === 'red' ? 'dark' : 'dusk'} y0={-100} y1={horizon + 20} stars={mode === 'night' ? 70 : 0} t={t} />
    {mode !== 'night' ? <Sun x={sunX} y={horizon - 40} r={120} t={t} red={mode === 'red' ? 1 : 0} /> : null}
    <SeaBody t={t} id={id} y={horizon} mode={mode} sunX={mode === 'night' ? undefined : sunX} />
  </g>
);
/** The Kerala shore: sea at dusk, sand in the front, black palms at the edges. */
export const Shore: React.FC<{ t: number; id: string; mode?: SeaMode; sunX?: number }> = ({ t, id, mode = 'dusk', sunX = 1300 }) => (
  <g>
    <Sea t={t} id={id} mode={mode} horizon={600} sunX={sunX} />
    <path d="M -600 900 Q 400 820 900 870 T 2600 830 L 2600 1500 L -600 1500 Z" fill={mode === 'dusk' ? '#5E3A3A' : '#1E1626'} />
    <path d="M -600 900 Q 400 820 900 870 T 2600 830" stroke={mode === 'dusk' ? '#F2B27A' : '#3A3050'} strokeWidth={6} fill="none" opacity={0.7} />
    <Palm x={130} y={960} s={1.2} t={t} lean={80} dark />
    <Palm x={330} y={930} s={0.9} t={t + 40} lean={-30} dark />
    <Palm x={1800} y={960} s={1.25} t={t + 80} lean={-90} dark />
  </g>
);

// ---------------------------------------------------------------- labels
/** A big word with the Portuguese it came from under it, bottom left of the frame. */
export const WordCard: React.FC<{ t: number; ml: string; pt: string; x?: number; y?: number }> = ({ t, ml, pt, x = 150, y = 880 }) => {
  const k = clamp(t / 5);
  return (
    <g opacity={k} transform={`translate(${x} ${y + (1 - k) * 18})`}>
      <rect x={-30} y={-120} width={Math.max(ml.length * 56, 300) + 40} height={200} rx={16} fill="#0E0A16" opacity={0.74} />
      <text y={-20} fontFamily={FONT.title} fontWeight={800} fontSize={100} fill="#F6EFE3">{ml}</text>
      <text y={50} fontFamily={FONT.ui} fontSize={46} fill="#FF8A3D">{pt}</text>
    </g>
  );
};
export const Year: React.FC<{ t: number; text: string; x?: number; y?: number; color?: string }> = ({ t, text, x = 960, y = 190, color = '#FFE7B3' }) => {
  const k = clamp(t / 6);
  return (
    <text x={x} y={y} textAnchor="middle" opacity={k} fontFamily={FONT.ui} fontSize={110} fill={color} stroke="#120C18" strokeWidth={10} paintOrder="stroke" letterSpacing={6}>{text}</text>
  );
};
export { kf };
