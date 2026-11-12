import React from 'react';
import {
  Hero, basePose, Pose, poseAt, faceAt, kf, clamp, easeOut, easeIn, backOut, camT, LOOKS, LEG_LEN,
  Bedroom, BEDROOM, WINDOW, bedSit, BedDuvet, stand, Schematic, SCH, Arrow, DrawOn, Cat, TitleCard, ShotProps, FONT, Expr,
} from '../../engine';
import { Dog, Crow, Bubble, FaceIcon } from '../animals-ml/shots';

// Episode cast looks
const PIP = LOOKS.ramu;
const MO = LOOKS.appu;
const SIS = LOOKS.sis;

const face = (t: number, keys: [number, Expr][]) => faceAt(t, keys);
const Fig: React.FC<Omit<React.ComponentProps<typeof Hero>, 'pose'> & { pose: Partial<Pose> }> = ({ pose, ...rest }) => (
  <Hero {...rest} pose={{ ...basePose, ...pose }} />
);

/** Running limbs animation */
const runLimbs = (t: number, k = 1): Partial<Pose> => {
  const s = Math.sin(t / 2.4);
  return {
    legL: { a: 30 * s * k, b: -20 },
    legR: { a: -30 * s * k, b: -20 },
    armL: { a: -40 * s * k, b: -40 },
    armR: { a: 40 * s * k, b: -40 },
    tilt: 8 * k,
  };
};

/** Speech bubble with customizable tail targeting */
const Say: React.FC<{
  x: number; y: number; s: number; t: number; text: string; size?: number; tx?: number; ty?: number;
}> = ({ x, y, s, t, text, size = 66, tx = 0, ty = 240 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Bubble x={0} y={0} t={t} text={text} size={size} tailX={tx} tailY={ty} />
  </g>
);

/** Schematic text helpers */
const Head: React.FC<{ text: string }> = ({ text }) => (
  <text x={180} y={170} fontFamily={FONT.title} fontWeight={700} fontSize={52} fill={SCH.dim}>{text}</text>
);

const Big: React.FC<{ x: number; y: number; text: string; size?: number; color?: string; t?: number; anchor?: 'start' | 'middle' | 'end' }> = ({
  x, y, text, size = 110, color = SCH.line, t = 99, anchor = 'middle'
}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={color} opacity={clamp(t / 6)}>
    {text}
  </text>
);

const Fade: React.FC<{ t: number; len: number; n?: number }> = ({ t, len, n = 14 }) =>
  t > len - n ? <rect x={-3000} y={-3000} width={8000} height={8000} fill="#000" opacity={clamp((t - (len - n)) / (n - 2))} /> : null;

// =========================================================== PROPS & CHARACTERS
/** Stick-figure style Rat character */
export const RatChar: React.FC<{ x: number; y: number; s?: number; f: number; talk?: boolean; flip?: boolean }> = ({
  x, y, s = 1, f, talk = false, flip = false
}) => {
  const twitch = Math.sin(f * 2.5) * 4;
  const mouth = talk && Math.floor(f / 4) % 2 === 0 ? 6 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx={0} cy={6} rx={50} ry={8} fill="#000" opacity={0.25} />
      <path d={`M -45 -16 Q -90 ${-20 + Math.sin(f / 4) * 8} -120 10`} stroke="#D4A373" strokeWidth={5} fill="none" strokeLinecap="round" />
      <ellipse cx={0} cy={-22} rx={44} ry={22} fill="#6C757D" />
      <ellipse cx={-18} cy={-28} rx={22} ry={16} fill="#5A6268" />
      <circle cx={-32} cy={-6} r={7} fill="#5A6268" />
      <circle cx={20} cy={-6} r={7} fill="#5A6268" />
      <g transform={`translate(36 -28)`}>
        <path d={`M 0 -12 L 34 0 L 0 12 Z`} fill="#6C757D" />
        <circle cx={34} cy={0} r={4} fill="#E5989B" />
        <circle cx={14} cy={-6} r={4.5} fill="#111" />
        <circle cx={15} cy={-7} r={1.5} fill="#FFF" />
        <ellipse cx={-4} cy={-16} rx={9} ry={12} fill="#E5989B" stroke="#5A6268" strokeWidth={2} />
        <line x1={26} y1={-2} x2={46} y2={-12 + twitch} stroke="#DDD" strokeWidth={1.5} />
        <line x1={26} y1={2} x2={46} y2={12 - twitch} stroke="#DDD" strokeWidth={1.5} />
        <line x1={22} y1={0} x2={48} y2={0} stroke="#DDD" strokeWidth={1.5} />
        {talk && mouth > 0 ? <path d="M 24 4 Q 30 10 32 4" stroke="#111" strokeWidth={2} fill="#E5989B" /> : null}
      </g>
    </g>
  );
};

/** Running swarm of rats */
export const RatSwarm: React.FC<{ x: number; y: number; s?: number; t: number; count?: number; w?: number }> = ({
  x, y, s = 1, t, count = 28, w = 1400
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {Array.from({ length: count }).map((_, i) => {
      const rx = ((i * 137 + t * 28) % w) - w / 2;
      const ry = ((i * 47) % 180) - 90;
      const rscale = 0.38 + ((i % 5) * 0.06);
      return <RatChar key={i} x={rx} y={ry} s={rscale} f={t + i * 7} />;
    })}
  </g>
);

/** Yellow School Bus */
export const SchoolBus: React.FC<{ x: number; y: number; s?: number; t: number; brake?: boolean; stop?: boolean }> = ({
  x, y, s = 1, t, brake = false, stop = false
}) => {
  const shake = brake && !stop ? Math.sin(t * 6) * 6 : 0;
  return (
    <g transform={`translate(${x} ${y + shake}) scale(${s})`}>
      <ellipse cx={0} cy={14} rx={340} ry={24} fill="#000" opacity={0.3} />
      <rect x={-320} y={-180} width={640} height={180} rx={24} fill="#F7B731" stroke="#1A1230" strokeWidth={8} />
      <rect x={-316} y={-60} width={632} height={14} fill="#1A1230" />
      <path d="M 220 -100 L 310 -100 Q 330 -100 330 -70 L 330 0 L 220 0 Z" fill="#F7B731" stroke="#1A1230" strokeWidth={8} />
      <rect x={210} y={-160} width={90} height={60} rx={8} fill="#B8E2F2" stroke="#1A1230" strokeWidth={6} />
      <circle cx={250} cy={-130} r={14} fill="#2C3A47" />
      {[-280, -180, -80, 20, 120].map((wx, i) => (
        <g key={i}>
          <rect x={wx} y={-160} width={70} height={70} rx={8} fill="#B8E2F2" stroke="#1A1230" strokeWidth={5} />
          <circle cx={wx + 25} cy={-125} r={12} fill="#3B3B98" />
          <circle cx={wx + 48} cy={-122} r={11} fill="#E15F41" />
        </g>
      ))}
      {[-190, 180].map((wx, i) => (
        <g key={i} transform={`translate(${wx} 6)`}>
          <circle cx={0} cy={0} r={46} fill="#2F3542" stroke="#1A1230" strokeWidth={8} />
          <circle cx={0} cy={0} r={20} fill="#747D8C" />
        </g>
      ))}
      {brake && (
        <g opacity={0.75}>
          <circle cx={-240} cy={10} r={20 + (t % 15) * 2} fill="#FFF" opacity={0.6} />
          <circle cx={130} cy={10} r={22 + (t % 15) * 2} fill="#FFF" opacity={0.6} />
        </g>
      )}
    </g>
  );
};

/** Mo's Bicycle */
export const Bicycle: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke="#1A1230" strokeWidth={5} fill="none">
    <circle cx={-70} cy={0} r={45} stroke="#2D3436" strokeWidth={6} />
    <circle cx={70} cy={0} r={45} stroke="#2D3436" strokeWidth={6} />
    <line x1={-70} y1={-45} x2={-70} y2={45} stroke="#636E72" strokeWidth={2} />
    <line x1={-115} y1={0} x2={-25} y2={0} stroke="#636E72" strokeWidth={2} />
    <line x1={70} y1={-45} x2={70} y2={45} stroke="#636E72" strokeWidth={2} />
    <line x1={25} y1={0} x2={115} y2={0} stroke="#636E72" strokeWidth={2} />
    <path d="M -70 0 L -10 0 L 40 -50 L -30 -50 Z" stroke="#E74C3C" strokeWidth={6} strokeLinejoin="round" />
    <line x1="-10" y1="0" x2="-25" y2="-65" stroke="#E74C3C" strokeWidth={6} />
    <path d="M -40 -65 L -10 -65" stroke="#2D3436" strokeWidth={8} strokeLinecap="round" />
    <line x1="70" y1="0" x2="40" y2="-50" stroke="#E74C3C" strokeWidth={6} />
    <line x1="40" y1="-50" x2="35" y2="-75" stroke="#636E72" strokeWidth={6} />
    <path d="M 20 -75 L 50 -75" stroke="#2D3436" strokeWidth={8} strokeLinecap="round" />
  </g>
);

/** Sinkhole with Water Geyser */
export const Sinkhole: React.FC<{ x: number; y: number; s?: number; t: number; geyser?: boolean }> = ({
  x, y, s = 1, t, geyser = true
}) => {
  const gH = clamp(t * 22, 0, 480);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={0} rx={280} ry={80} fill="#120E16" stroke="#2D3436" strokeWidth={6} />
      <path d="M -260 0 L -210 -30 L -140 -20 L -60 -50 L 20 -40 L 110 -60 L 190 -30 L 260 0 L 210 30 L 130 45 L 30 55 L -70 45 L -170 35 Z" fill="#0A080E" />
      <rect x={-80} y={-10} width={40} height={20} fill="#4B6584" />
      <rect x={40} y={-5} width={40} height={20} fill="#4B6584" />
      {geyser ? (
        <g>
          <ellipse cx={0} cy={0} rx={70} ry={25} fill="#45AAF2" opacity={0.7} />
          <path d={`M -50 0 Q -20 ${-gH * 0.7} 0 ${-gH} Q 20 ${-gH * 0.7} 50 0 Z`} fill="#2D98DA" opacity={0.8} />
          <path d={`M -30 0 Q -10 ${-gH * 0.85} 0 ${-gH * 1.1} Q 10 ${-gH * 0.85} 30 0 Z`} fill="#DFF9FB" opacity={0.9} />
          {[-40, -20, 0, 20, 40].map((dx, i) => (
            <circle key={i} cx={dx * 2 + Math.sin(t + i) * 20} cy={-gH * 0.9 - Math.abs(Math.sin(t * 2 + i)) * 60} r={6} fill="#45AAF2" />
          ))}
        </g>
      ) : null}
    </g>
  );
};

/** Street Environment */
export const StreetSet: React.FC<{ t: number; sunX?: number; sunY?: number; morning?: boolean }> = ({
  t, sunX = 960, sunY = 540, morning = true
}) => (
  <g>
    <rect x={-1000} y={-500} width={4000} height={1200} fill={morning ? '#F8C291' : '#3C40C6'} />
    <circle cx={sunX} cy={sunY} r={160} fill="#FAD390" opacity={0.6} />
    <rect x={100} y={280} width={220} height={320} fill="#3D3E51" />
    <rect x={380} y={340} width={180} height={260} fill="#2C2D3D" />
    <rect x={1200} y={300} width={260} height={300} fill="#3D3E51" />
    <rect x={1520} y={350} width={200} height={250} fill="#2C2D3D" />
    <rect x={-200} y={480} width={2400} height={140} fill="#574B60" />
    <line x1={-200} y1={520} x2={2200} y2={520} stroke="#463C4E" strokeWidth={3} />
    <rect x={-200} y={620} width={2400} height={700} fill="#2F3640" />
    <rect x={-200} y={600} width={2400} height={40} fill="#718093" />
    {[-100, 250, 600, 950, 1300, 1650, 2000].map((lx, i) => (
      <rect key={i} x={lx} y={820} width={140} height={16} rx={4} fill="#F5F6FA" opacity={0.7} />
    ))}
  </g>
);

// =========================================================== SCENE A: COLD OPEN (2 AM)
export const A1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <Bedroom t={t} id="bed_a1" lamp={0} duvet={false} />
    <rect x={760} y={620} width={120} height={50} rx={6} fill="#111" stroke="#333" strokeWidth={3} />
    <text x={820} y={655} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} fontWeight={700} fill="#E74C3C">02:00</text>
    {/* Pip sleeping grounded in bed */}
    <Fig look={PIP} pose={{ ...bedSit(0.24), tilt: 15, armL: { a: -30, b: -20 }, armR: { a: 30, b: -20 }, ...face(t, [[0, 'tired']]) }} />
    <BedDuvet knees={0} />
  </g>
);

export const A2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.1], [len, 1.25]]))}>
    <rect x={0} y={0} width={1920} height={1080} fill="#1E1926" />
    <rect x={0} y={720} width={1920} height={80} fill="#3D314A" stroke="#111" strokeWidth={4} />
    <rect x={0} y={800} width={1920} height={280} fill="#1A1424" />
    <ellipse cx={960} cy={760} rx={60} ry={45} fill="#09070D" />
    <circle cx={940} cy={755} r={8} fill="#F5CD79" />
    <circle cx={980} cy={755} r={8} fill="#F5CD79" />
    <line x1={925} y1={765} x2={890} y2={760 + Math.sin(t * 3) * 6} stroke="#DDD" strokeWidth={2} />
    <line x1={995} y1={765} x2={1030} y2={760 - Math.sin(t * 3) * 6} stroke="#DDD" strokeWidth={2} />
  </g>
);

export const A3: React.FC<ShotProps> = ({ t, len }) => {
  const pip = {
    ...bedSit(0.24),
    headTilt: kf(t, [[0, 0], [16, -12]]),
    tilt: 0,
    armL: { a: -40, b: -40 },
    armR: { a: 40, b: -40 },
    ...face(t, [[0, 'tired'], [18, 'shock']])
  };
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Bedroom t={t} id="bed_a3" lamp={0} duvet={false} />
      <Fig look={PIP} pose={pip} rimId="rimL" />
      <BedDuvet knees={1} />
      {/* Speech bubble timed exactly to spoken audio at frame 115 */}
      {t >= 115 && (
        <Say x={640} y={480} s={0.52} t={t - 115} text="അവൻ ഉണർന്നു!" tx={-80} ty={180} />
      )}
    </g>
  );
};

export const A4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.2], [len, 1.3]]))}>
    <rect x={0} y={0} width={1920} height={1080} fill="#171220" />
    <RatChar x={960} y={640} s={1.8} f={t} talk={t > 6} />
    {/* Multi-beat speech bubbles matching dialogue progression */}
    {t < 140 ? (
      <Say x={960} y={380} s={0.55} t={t - 10} text="ഉറപ്പാണോ?" tx={0} ty={230} />
    ) : (
      <Say x={960} y={360} s={0.65} t={t - 140} text="നാളെ ഈ നഗരം ഇടിയും!" size={68} tx={0} ty={250} />
    )}
  </g>
);

// =========================================================== TITLE CARD (SMOOTH MIDNIGHT SKYLINE)
export const T: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect x={0} y={0} width={1920} height={1080} fill="#140F1E" />
    <rect x={200} y={480} width={240} height={400} fill="#1C162A" />
    <rect x={500} y={420} width={280} height={460} fill="#241D35" />
    <rect x={1140} y={390} width={300} height={490} fill="#241D35" />
    <rect x={1480} y={460} width={260} height={420} fill="#1C162A" />
    {[300, 340, 560, 600, 640, 1200, 1260, 1320, 1540, 1600].map((wx, i) => (
      <rect key={i} x={wx} y={520 + (i % 3) * 60} width={18} height={24} rx={2} fill="#F9CA24" opacity={0.7} />
    ))}
    <circle cx={960} cy={300} r={90} fill="#F5CD79" opacity={0.9} />
    <circle cx={960} cy={300} r={140} fill="#F5CD79" opacity={0.15} />
    <TitleCard t={t} lines={['മൃഗങ്ങളോട് സംസാരിക്കാൻ പറ്റിയാലോ?', 'ഭാഗം 3: എലികളുടെ നഗരം']} accent="എലികളുടെ നഗരം" accentT={30} size={82} />
    <Fade t={t} len={len} n={8} />
  </g>
);

// =========================================================== SCENE B: BEDROOM LAMP & RAT ENCOUNTER
export const B1: React.FC<ShotProps> = ({ t, len }) => {
  const B_PIP = stand(BEDROOM, 0.42, 0.45);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Bedroom t={t} id="bed_b1" lamp={1} />
      <ellipse cx={B_PIP.x} cy={B_PIP.y} rx={60} ry={14} fill="#000" opacity={0.3} />
      <Fig look={PIP} pose={{ x: B_PIP.x, y: B_PIP.y, scale: B_PIP.scale, yaw: 0.5, ...face(t, [[0, 'worried']]) }} />
      <RatChar x={B_PIP.x + 360} y={B_PIP.y} s={0.9} f={t} flip={true} talk={t > 15} />
    </g>
  );
};

export const B2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(880, 520, kf(t, [[0, 1.3], [len, 1.45]]))}>
    <Bedroom t={t} id="bed_b2" lamp={1} />
    <Fig look={PIP} pose={{ x: 880, y: 640, scale: 1.3, yaw: 0.4, tilt: 20, ...face(t, [[0, 'shock']]) }} />
    <Say x={880} y={320} s={0.55} t={t - 38} text="എന്ത് ഇടിയും?" tx={0} ty={260} />
  </g>
);

export const B3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, 1.2)}>
    <rect x={0} y={0} width={1920} height={1080} fill="#241B2F" />
    <RatChar x={960} y={650} s={1.6} f={t} talk={true} />
    <Say x={960} y={360} s={0.55} t={t - 30} text="ശുദ്ധജല പൈപ്പ് പൊട്ടി!" tx={0} ty={260} />
  </g>
);

export const B4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.15]]))}>
    <rect x={0} y={0} width={1920} height={380} fill="#485460" />
    <rect x={0} y={380} width={1920} height={120} fill="#1E272C" />
    <rect x={0} y={500} width={1920} height={580} fill="#1E1926" />
    <ellipse cx={960} cy={720} rx={600} ry={180} fill="#0C0A10" />
    <rect x={200} y={680} width={400} height={60} fill="#576574" stroke="#222" strokeWidth={4} />
    <rect x={1320} y={680} width={400} height={60} fill="#576574" stroke="#222" strokeWidth={4} />
    <path d="M 600 700 Q 960 760 1320 700" stroke="#00D2D3" strokeWidth={18} fill="none" opacity={0.8} />
  </g>
);

// =========================================================== SCENE D1-D4: SCIENCE (WHISKERS & RAT DENSITY)
export const D1: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="sch_d1" />
    <Head text="ശാസ്ത്രം: എലികളുടെ മീശ" />
    <ellipse cx={820} cy={560} rx={220} ry={140} fill="none" stroke={SCH.line} strokeWidth={6} />
    <circle cx={920} cy={520} r={14} fill={SCH.line} />
    {[-50, -20, 10, 40].map((dy, i) => (
      <g key={i}>
        <line x1={980} y1={560 + dy} x2={1280} y2={540 + dy * 2.5 + Math.sin(t * 2 + i) * 14} stroke={SCH.live} strokeWidth={4} />
        <circle cx={1300} cy={540 + dy * 2.5 + Math.sin(t * 2 + i) * 14} r={6} fill={SCH.live} />
      </g>
    ))}
    <Big x={1360} y={380} text="ഭൂകമ്പ വിറയലുകൾ" size={56} color={SCH.live} t={t} />
    <Big x={1360} y={450} text="മൈക്രോ സെക്കൻഡിൽ" size={42} color={SCH.dim} t={t} />
  </g>
);

export const D2: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="sch_d2" />
    <Head text="2,000 NERVE FIBERS PER WHISKER" />
    <rect x={500} y={380} width={340} height={360} rx={16} fill="none" stroke={SCH.line} strokeWidth={6} />
    <line x1={670} y1={380} x2={670} y2={740} stroke={SCH.live} strokeWidth={8} />
    {Array.from({ length: 8 }).map((_, i) => (
      <line key={i} x1={540} y1={420 + i * 40} x2={800} y2={420 + i * 40} stroke={SCH.dim} strokeWidth={3} strokeDasharray="8 6" />
    ))}
    <Big x={1260} y={520} text="വായുമർദ്ദം & വിറയൽ" size={62} color={SCH.live} t={t} />
    <Big x={1260} y={600} text="നേർത്ത വ്യത്യാസവും അറിയാം" size={46} color={SCH.dim} t={t} />
  </g>
);

export const D3: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="sch_d3" />
    <Head text="നഗരങ്ങളിലെ ജനസംഖ്യ: 1:1" />
    <g transform="translate(680 560)">
      <circle cx={0} cy={-120} r={40} fill="none" stroke={SCH.line} strokeWidth={6} />
      <path d="M 0 -80 L 0 60 M 0 60 L -40 160 M 0 60 L 40 160 M 0 -40 L -60 20 M 0 -40 L 60 20" stroke={SCH.line} strokeWidth={6} />
      <Big x={0} y={230} text="മനുഷ്യർ" size={48} color={SCH.dim} t={t} />
    </g>
    <Big x={960} y={560} text="=" size={96} color={SCH.live} t={t} />
    <g transform="translate(1240 560)">
      <ellipse cx={0} cy={20} rx={120} ry={70} fill="none" stroke={SCH.live} strokeWidth={6} />
      <path d="M 80 0 L 160 20 L 80 40 Z" fill={SCH.live} />
      <circle cx={120} cy={10} r={8} fill={SCH.ground} />
      <path d="M -120 20 Q -180 0 -220 50" stroke={SCH.live} strokeWidth={6} fill="none" />
      <Big x={0} y={230} text="എലികൾ" size={48} color={SCH.live} t={t} />
    </g>
  </g>
);

export const D4: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="sch_d4" />
    <Head text="ന്യൂയോർക്ക് & ലണ്ടൻ തുരങ്കങ്ങൾ" />
    {Array.from({ length: 5 }).map((_, i) => (
      <line key={i} x1={320} y1={360 + i * 80} x2={1600} y2={360 + i * 80} stroke={SCH.dim} strokeWidth={4} />
    ))}
    {Array.from({ length: 6 }).map((_, i) => (
      <line key={i} x1={440 + i * 220} y1={300} x2={440 + i * 220} y2={740} stroke={SCH.dim} strokeWidth={4} />
    ))}
    <circle cx={880} cy={520} r={18} fill="#E74C3C" />
    <circle cx={1100} cy={440} r={18} fill="#E74C3C" />
    <circle cx={660} cy={600} r={18} fill="#E74C3C" />
    <Big x={960} y={840} text="ലക്ഷക്കണക്കിന് രഹസ്യ തുരങ്കങ്ങൾ" size={54} color={SCH.line} t={t} />
  </g>
);

// =========================================================== SCENE B5-B6: PIP & RAT EMPATHY
export const B5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1.4], [len, 1.5]]))}>
    <Bedroom t={t} id="bed_b5" lamp={1} />
    <Fig look={PIP} pose={{ x: 880, y: 640, scale: 1.4, yaw: 0.5, ...face(t, [[0, 'worried']]) }} />
    <Say x={880} y={320} s={0.52} t={t - 30} text="എന്തിനാണ് എന്നോട് പറയുന്നത്?" tx={0} ty={260} />
  </g>
);

export const B6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, 1.3)}>
    <rect x={0} y={0} width={1920} height={1080} fill="#241B2F" />
    <RatChar x={960} y={640} s={1.6} f={t} talk={true} />
    <Say x={960} y={360} s={0.55} t={t - 20} text="ഞങ്ങളുടെ കുഞ്ഞുങ്ങളുണ്ട്!" tx={0} ty={260} />
  </g>
);

// =========================================================== SCENE D5-D6: 2011 CHICAGO EXPERIMENT
export const D5: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="sch_d5" />
    <Head text="2011: ചിക്കാഗോ സർവകലാശാല പരീക്ഷണം" />
    <rect x={760} y={420} width={400} height={240} fill="none" stroke={SCH.line} strokeWidth={8} rx={12} />
    {[-140, -70, 0, 70, 140].map((dx, i) => (
      <line key={i} x1={960 + dx} y1={420} x2={960 + dx} y2={660} stroke={SCH.line} strokeWidth={6} />
    ))}
    {/* Grounded rat on cage floor */}
    <RatChar x={960} y={640} s={1.0} f={t} />
    <Big x={960} y={750} text="കുടുങ്ങിയ കൂട്ടുകാരനെ രക്ഷിക്കുന്നു" size={52} color={SCH.live} t={t} />
  </g>
);

export const D6: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="sch_d6" />
    <Head text="ചോക്ലേറ്റ് പങ്കുവെക്കുന്ന എലികൾ" />
    <RatChar x={720} y={540} s={1.2} f={t} />
    <RatChar x={1200} y={540} s={1.2} f={t} flip={true} />
    <rect x={920} y={500} width={80} height={50} rx={8} fill="#6D4C41" stroke={SCH.live} strokeWidth={4} />
    <Big x={960} y={740} text="യഥാർത്ഥ സ്നേഹവും സഹാനുഭൂതിയും" size={56} color={SCH.live} t={t} />
  </g>
);

// =========================================================== SCENE C: MORNING WARNING TO MO
export const C1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.15]]))}>
    <StreetSet t={t} morning={true} sunX={960} sunY={440} />
    <ellipse cx={620} cy={745} rx={50} ry={12} fill="#000" opacity={0.3} />
    <Fig look={PIP} pose={{ x: 620, y: 720, scale: 0.8, yaw: 0.8, ...face(t, [[0, 'worried']]) }} />
  </g>
);

export const C2: React.FC<ShotProps> = ({ t, len }) => {
  const pip = {
    x: kf(t, [[0, 200], [len, 960]], easeOut),
    y: 720,
    scale: 1.0,
    yaw: 0.8,
    ...runLimbs(t, 1),
    ...face(t, [[0, 'shock']])
  };
  return (
    <g transform={camT(960, 540, 1.1)}>
      <StreetSet t={t} morning={true} />
      <ellipse cx={pip.x} cy={745} rx={50} ry={12} fill="#000" opacity={0.3} />
      <Fig look={PIP} pose={pip} />
    </g>
  );
};

export const C3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, 1.15)}>
    <StreetSet t={t} morning={true} />
    {/* Mo's bicycle parked */}
    <Bicycle x={1320} y={720} s={1.0} />
    <ellipse cx={740} cy={725} rx={50} ry={12} fill="#000" opacity={0.3} />
    <ellipse cx={1180} cy={725} rx={50} ry={12} fill="#000" opacity={0.3} />
    <Fig look={PIP} pose={{ x: 740, y: 700, scale: 0.95, yaw: 0.6, ...face(t, [[0, 'shock']]) }} />
    <Fig look={MO} pose={{ x: 1180, y: 700, scale: 0.95, yaw: -0.6, ...face(t, [[0, 'worried']]) }} />
    <Say x={740} y={400} s={0.5} t={t - 4} text="ആ റോഡിൽ ചവിട്ടരുത്!" tx={0} ty={260} />
  </g>
);

export const C4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1180, 520, 1.4)}>
    <StreetSet t={t} morning={true} />
    <ellipse cx={1180} cy={665} rx={60} ry={14} fill="#000" opacity={0.3} />
    <Fig look={MO} pose={{ x: 1180, y: 640, scale: 1.3, yaw: -0.5, ...face(t, [[0, 'happy']]) }} />
    <Say x={1180} y={320} s={0.55} t={t - 4} text="നിനക്ക് വട്ടായോ?" tx={0} ty={280} />
  </g>
);

export const C5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, 1.25)}>
    <rect x={0} y={0} width={1920} height={600} fill="#F8C291" />
    <rect x={0} y={600} width={1920} height={480} fill="#574B60" stroke="#333" strokeWidth={6} />
    <ellipse cx={960} cy={595} rx={70} ry={14} fill="#000" opacity={0.3} />
    <g transform="translate(960 590) scale(1.4) translate(-960 -590)">
      <Cat x={960} y={590} mood="alert" f={t} />
    </g>
    <Say x={960} y={320} s={0.55} t={t - 6} text="അവൻ പറയുന്നത് സത്യമാണ്!" tx={-20} ty={250} />
  </g>
);

export const C6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, 1.2)}>
    <StreetSet t={t} morning={true} />
    <ellipse cx={960} cy={745} rx={90} ry={16} fill="#000" opacity={0.3} />
    <Dog x={960} y={720} s={1.6} f={t} tell={1} />
    <Say x={960} y={380} s={0.55} t={t - 6} text="റോഡിനടിയിൽ ഗ്യാസിന്റെ മണം!" tx={-80} ty={300} />
  </g>
);

// =========================================================== SCENE D7-D10: ANIMAL RELAY NETWORK
export const D7: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="sch_d7" />
    <Head text="നഗരത്തിലെ മൃഗങ്ങളുടെ വാർത്താ ശൃംഖല" />
    <circle cx={580} cy={540} r={40} fill={SCH.line} />
    <circle cx={960} cy={420} r={40} fill={SCH.live} />
    <circle cx={1340} cy={540} r={40} fill={SCH.line} />
    <circle cx={960} cy={660} r={40} fill={SCH.live} />
    <line x1={580} y1={540} x2={960} y2={420} stroke={SCH.line} strokeWidth={4} />
    <line x1={960} y1={420} x2={1340} y2={540} stroke={SCH.line} strokeWidth={4} />
    <line x1={1340} y1={540} x2={960} y2={660} stroke={SCH.line} strokeWidth={4} />
    <line x1={960} y1={660} x2={580} y2={540} stroke={SCH.line} strokeWidth={4} />
    <Big x={960} y={780} text="സമ്പൂർണ്ണ രഹസ്യ ശൃംഖല" size={54} color={SCH.live} t={t} />
  </g>
);

export const D8: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="sch_d8" />
    <Head text="പ്രാവുകൾ: ഭൂമിയുടെ കാന്തികവലയം" />
    <ellipse cx={960} cy={520} rx={480} ry={200} fill="none" stroke={SCH.dim} strokeWidth={4} strokeDasharray="12 8" />
    <ellipse cx={960} cy={520} rx={320} ry={130} fill="none" stroke={SCH.live} strokeWidth={5} />
    <Crow x={960} y={500} s={1.4} f={t} flip={false} />
    <Big x={960} y={780} text="കാന്തികക്ഷേത്രം വഴി ദിശ അറിയുന്നു" size={52} color={SCH.live} t={t} />
  </g>
);

export const D9: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="sch_d9" />
    <Head text="ഉറുമ്പുകൾ: ഫെറമോൺ സൂപ്പർ തലച്ചോറ്" />
    {Array.from({ length: 12 }).map((_, i) => (
      <g key={i} transform={`translate(${460 + i * 90} ${520 + Math.sin(t / 2 + i) * 20})`}>
        <circle cx={0} cy={0} r={10} fill={SCH.live} />
        <line x1={-15} y1={0} x2={15} y2={0} stroke={SCH.line} strokeWidth={3} />
      </g>
    ))}
    <Big x={960} y={720} text="ലക്ഷക്കണക്കിന് രാസസന്ദേശങ്ങൾ" size={52} color={SCH.live} t={t} />
  </g>
);

export const D10: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="sch_d10" />
    <Head text="ആകാശം • തെരുവ് • ഭൂമിക്കടി" />
    <rect x={420} y={340} width={1080} height={90} rx={12} fill="#3D5A80" opacity={0.3} />
    <Big x={960} y={400} text="മുകളിൽ: പ്രാവുകൾ & കാക്കകൾ" size={44} color={SCH.line} t={t} />
    <rect x={420} y={470} width={1080} height={90} rx={12} fill="#EE6C4D" opacity={0.3} />
    <Big x={960} y={530} text="തെരുവിൽ: പട്ടിയും പൂച്ചയും" size={44} color={SCH.live} t={t} />
    <rect x={420} y={600} width={1080} height={90} rx={12} fill="#293241" opacity={0.6} />
    <Big x={960} y={660} text="ഭൂമിക്കടിയിൽ: എലികൾ" size={44} color={SCH.line} t={t} />
  </g>
);

// =========================================================== SCENE E: SCHOOL BUS APPROACHES
export const E1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <StreetSet t={t} morning={true} />
    <SchoolBus x={kf(t, [[0, 1800], [len, 1200]])} y={680} s={0.7} t={t} />
  </g>
);

export const E2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, 1.2)}>
    <rect x={0} y={0} width={1920} height={1080} fill="#B8E2F2" />
    <Fig look={SIS} pose={{ x: 960, y: 680, scale: 1.6, yaw: 0, armR: { a: 40 + Math.sin(t * 3) * 20, b: -20 }, ...face(t, [[0, 'happy']]) }} />
  </g>
);

export const E3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, 1.4)}>
    <rect x={0} y={0} width={1920} height={1080} fill="#2F3640" />
    <path d="M 400 540 Q 960 480 1520 540" stroke="#000" strokeWidth={kf(t, [[0, 4], [len, 18]])} fill="none" />
  </g>
);

export const E4: React.FC<ShotProps> = ({ t, len }) => {
  const wave = Math.sin(t / 2.5) * 35;
  return (
    <g transform={camT(960, 540, 1.2)}>
      <StreetSet t={t} morning={true} />
      <ellipse cx={800} cy={725} rx={60} ry={14} fill="#000" opacity={0.3} />
      <Fig
        look={PIP}
        pose={{
          x: 800,
          y: 700,
          scale: 1.1,
          yaw: 0.8,
          armL: { a: -140 + wave, b: -20 },
          armR: { a: 140 - wave, b: -20 },
          ...face(t, [[0, 'shock']])
        }}
      />
      <Say x={800} y={320} s={0.6} t={t - 4} text="വണ്ടി നിർത്തൂ!" tx={0} ty={280} />
    </g>
  );
};

export const E5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, 1.3)}>
    <rect x={600} y={320} width={720} height={480} rx={16} fill="#B8E2F2" stroke="#1A1230" strokeWidth={8} />
    <circle cx={960} cy={520} r={60} fill="#2C3A47" />
    <path d="M 1020 520 L 1080 440" stroke="#2C3A47" strokeWidth={20} strokeLinecap="round" />
  </g>
);

export const E6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, 1.3)}>
    <StreetSet t={t} morning={true} />
    <ellipse cx={960} cy={705} rx={60} ry={14} fill="#000" opacity={0.3} />
    <Fig look={PIP} pose={{ x: 960, y: 680, scale: 1.3, yaw: 0, armL: { a: -70, b: -30 }, armR: { a: 70, b: -30 }, ...face(t, [[0, 'worried']]) }} />
    {t >= 110 && (
      <Say x={960} y={240} s={0.65} t={t - 110} text="സഹായം വേണം!" size={72} tx={0} ty={320} />
    )}
  </g>
);

// =========================================================== SCENE F: RAT SWARM & DRIVER SLAMS BRAKES
export const F1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, 1.05)}>
    <StreetSet t={t} morning={true} />
    <RatSwarm x={960} y={760} s={1.1} t={t} count={35} />
  </g>
);

export const F2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, 1.2)}>
    <StreetSet t={t} morning={true} />
    <RatSwarm x={960} y={780} s={1.4} t={t} count={40} />
  </g>
);

export const F3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, 1.1)}>
    <StreetSet t={t} morning={true} />
    <RatSwarm x={960} y={780} s={1.2} t={t} count={45} />
    <Crow x={kf(t, [[0, 1600], [len, 300]])} y={480} s={1.0} f={t} />
    <Crow x={kf(t, [[0, 1800], [len, 500]])} y={540} s={0.9} f={t + 4} />
  </g>
);

export const F4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.15]]))}>
    {/* Cinematic Driver Windshield Interior */}
    <rect x={0} y={0} width={1920} height={1080} fill="#1E272C" />
    <rect x={240} y={120} width={1440} height={640} rx={20} fill="#F8C291" stroke="#3742FA" strokeWidth={12} />
    <rect x={240} y={480} width={1440} height={280} fill="#2F3640" />
    <RatSwarm x={960} y={620} s={0.7} t={t} count={20} />
    <rect x={860} y={140} width={200} height={50} rx={8} fill="#2F3542" stroke="#111" strokeWidth={4} />
    <ellipse cx={960} cy={820} rx={260} ry={130} fill="none" stroke="#2F3542" strokeWidth={32} />
    <circle cx={960} cy={520} r={110} fill="#D7A17B" stroke="#1A1230" strokeWidth={7} />
    <path d="M 840 470 Q 960 410 1080 470 L 1120 490 L 800 490 Z" fill="#2C3A47" />
    <path d="M 800 490 Q 960 460 1120 490" stroke="#1A1230" strokeWidth={5} />
    <circle cx={910} cy={520} r={28} fill="#FFF" stroke="#1A1230" strokeWidth={4} />
    <circle cx={1010} cy={520} r={28} fill="#FFF" stroke="#1A1230" strokeWidth={4} />
    <circle cx={910} cy={520} r={10} fill="#111" />
    <circle cx={1010} cy={520} r={10} fill="#111" />
    <ellipse cx={960} cy={585} rx={34} ry={26} fill="#741B26" stroke="#1A1230" strokeWidth={4} />
    <circle cx={720} cy={800} r={32} fill="#D7A17B" stroke="#1A1230" strokeWidth={6} />
    <circle cx={1200} cy={800} r={32} fill="#D7A17B" stroke="#1A1230" strokeWidth={6} />
  </g>
);

export const F5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, 1.1)}>
    <StreetSet t={t} morning={true} />
    <SchoolBus x={kf(t, [[0, 600], [len, 850]], easeOut)} y={680} s={1.0} t={t} brake={true} />
  </g>
);

export const F6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, 1.15)}>
    <StreetSet t={t} morning={true} />
    <SchoolBus x={750} y={680} s={1.0} t={t} stop={true} />
    <Sinkhole x={1350} y={750} s={0.8} t={t} geyser={false} />
  </g>
);

// =========================================================== SCENE G: SINKHOLE COLLAPSE & TWIST
export const G1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.15]]))}>
    <StreetSet t={t} morning={true} />
    <Sinkhole x={1100} y={720} s={1.5} t={t} geyser={true} />
    <SchoolBus x={420} y={680} s={0.9} t={t} stop={true} />
  </g>
);

export const G2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, 1.25)}>
    <rect x={0} y={0} width={1920} height={1080} fill="#B8E2F2" />
    <Fig look={SIS} pose={{ x: 960, y: 680, scale: 1.6, yaw: 0, ...face(t, [[0, 'shock']]) }} />
  </g>
);

export const G3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, 1.1)}>
    <StreetSet t={t} morning={true} />
    <ellipse cx={580} cy={725} rx={50} ry={12} fill="#000" opacity={0.3} />
    <ellipse cx={740} cy={725} rx={50} ry={12} fill="#000" opacity={0.3} />
    <Fig look={PIP} pose={{ x: 580, y: 700, scale: 0.85, yaw: 0.5 }} />
    <Fig look={MO} pose={{ x: 740, y: 700, scale: 0.85, yaw: -0.5 }} />
    <Sinkhole x={1260} y={740} s={1.0} t={t} geyser={true} />
  </g>
);

export const G4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, 1.2)}>
    <StreetSet t={t} morning={true} />
    <ellipse cx={860} cy={705} rx={50} ry={12} fill="#000" opacity={0.3} />
    <ellipse cx={980} cy={745} rx={40} ry={10} fill="#000" opacity={0.3} />
    <ellipse cx={620} cy={705} rx={50} ry={12} fill="#000" opacity={0.3} />
    <Fig look={PIP} pose={{ x: 860, y: 680, scale: 1.1, yaw: -0.3, ...face(t, [[0, 'happy']]) }} />
    <Fig look={SIS} pose={{ x: 980, y: 720, scale: 0.9, yaw: -0.8, armL: { a: -60, b: -20 }, ...face(t, [[0, 'happy']]) }} />
    <Fig look={MO} pose={{ x: 620, y: 680, scale: 1.1, yaw: 0.6, ...face(t, [[0, 'happy']]) }} />
  </g>
);

export const G5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, 1.3)}>
    <StreetSet t={t} morning={true} />
    {/* Pip standing on left */}
    <ellipse cx={800} cy={725} rx={50} ry={12} fill="#000" opacity={0.3} />
    <Fig look={PIP} pose={{ x: 800, y: 700, scale: 1.1, yaw: 0.7, tilt: 15, ...face(t, [[0, 'worried']]) }} />
    {/* Rat near Pip's feet */}
    <ellipse cx={1040} cy={725} rx={35} ry={10} fill="#000" opacity={0.3} />
    <RatChar x={1040} y={720} s={1.1} f={t} flip={true} talk={true} />
    {/* Correct line matching dialogue, tail reaching rat */}
    <Say x={1040} y={440} s={0.55} t={t - 6} text="റോഡ് രക്ഷപ്പെട്ടു. പക്ഷേ പ്രശ്നമുണ്ട്." tx={0} ty={260} />
  </g>
);

export const G6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.25]]))}>
    {/* Deep subterranean cavern */}
    <rect x={0} y={0} width={1920} height={1080} fill="#0A060E" />
    <path d="M 0 0 L 420 0 L 360 280 L 460 180 L 340 540 L 440 480 L 280 840 L 400 1080 L 0 1080 Z" fill="#181122" />
    <path d="M 1920 0 L 1500 0 L 1560 260 L 1460 190 L 1580 520 L 1480 460 L 1640 820 L 1520 1080 L 1920 1080 Z" fill="#181122" />
    <path d="M 400 0 L 520 220 L 600 0 L 720 310 L 820 0 L 1100 0 L 1200 280 L 1280 0 L 1400 240 L 1500 0 Z" fill="#1F152C" />
    {/* Water cascading down into abyss */}
    <rect x={860} y={0} width={200} height={1080} fill="#0984E3" opacity={0.6} />
    <rect x={900} y={0} width={120} height={1080} fill="#74B9FF" opacity={0.7} />
    {Array.from({ length: 16 }).map((_, i) => (
      <rect key={i} x={880 + (i % 4) * 36} y={((i * 80 + t * 45) % 1100) - 40} width={40} height={14} rx={7} fill="#DFE6E9" opacity={0.8} />
    ))}
    {/* Glowing mysterious ancient eye */}
    <g transform="translate(960 760)">
      <ellipse cx={0} cy={0} rx={180} ry={90} fill="#000" />
      <circle cx={0} cy={0} r={65} fill="#D63031" opacity={clamp((t - 15) / 25)} />
      <circle cx={0} cy={0} r={45} fill="#FF7675" opacity={clamp((t - 15) / 25)} />
      <ellipse cx={0} cy={0} rx={16} ry={55} fill="#111" />
      <circle cx={-18} cy={-18} r={10} fill="#FFF" opacity={0.9} />
    </g>
  </g>
);

// =========================================================== END CARD
export const END: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect x={0} y={0} width={1920} height={1080} fill="#0B0910" />
    <TitleCard
      t={t}
      lines={['അടുത്ത ഭാഗം:', 'ഭൂമിക്കടിയിലെ രഹസ്യം']}
      accent="ഭൂമിക്കടിയിലെ രഹസ്യം"
      accentT={20}
      size={80}
    />
    <Fade t={t} len={len} n={10} />
  </g>
);
