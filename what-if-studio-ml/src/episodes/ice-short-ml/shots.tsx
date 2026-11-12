// ice-short-ml: "What if all the ice in the world melted?" A native 9:16 Short, teasing the sea-rise long video. The
// narration stays straight; the jokes are in the picture, and a penguin who has lost his home runs through it all.
import React from 'react';
import { faceAt, clamp, easeOut, backOut, ShotProps, FONT, Glow, Sun, Foreground, rnd } from '../../engine';
import { Sky, Palm, KHouse, TeaHills, Boat, Fig, Goggles, handAt, headAt, kf, PIP, MO, MOM } from '../fly-ml/kit';
import { ground, vcam, UNCLE, CROWD, TEAMAN, Mundu, Tache, Say, TeaGlass, Bus } from '../phone-ml/kit';
import {
  Sea, Ripple, Penguin, IceChunk, Suitcase, Fish, Duck, Houseboat, Chundan, StationBoard, Hat, Paddy, Handi, ChinaNet, Tower, LevelChip, Tip,
} from './kit';

const INK = '#1A1230';

// ============================================================ the flooded yard
const Clothesline: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <path d="M 40 900 Q 300 950 620 905" stroke="#2A2230" strokeWidth={5} fill="none" />
    {[[130, '#C8352E', 90], [250, '#E4DCC8', 120], [380, '#3E6E8C', 96]].map(([x, c, h], i) => (
      <path key={i} d={`M ${x as number} ${924 + i * 6} h 84 l ${6 + Math.sin(t / 11 + i) * 5} ${h as number} h -92 Z`} fill={c as string} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    ))}
  </g>
);

const Yard: React.FC<{ t: number; id: string; house?: number }> = ({ t, id, house = 1300 }) => (
  <g>
    <Sky id={id} mode="dusk" y0={0} y1={1240} />
    <Sun x={840} y={1010} r={78} t={t} />
    <Palm x={-30} y={1300} s={1.45} t={t} dark />
    <Palm x={1120} y={1300} s={1.2} t={t + 40} dark />
    <KHouse x={540} y={house} s={0.8} lit={0.8} />
    <Clothesline t={t} />
  </g>
);

const Junk: React.FC<{ t: number; y: number }> = ({ t, y }) => (
  <g>
    {/* one chappal, a bucket, a coconut: what floats out of a yard */}
    <g transform={`translate(${130 + t * 0.5} ${y + 40 + Math.sin(t / 8) * 4}) rotate(-8)`}>
      <ellipse rx={54} ry={17} fill="#3E7CA8" stroke={INK} strokeWidth={4} />
      <path d="M -6 -12 Q 18 -32 34 -8" stroke="#E4DCC8" strokeWidth={7} fill="none" />
    </g>
    <g transform={`translate(${930 - t * 0.3} ${y + 120 + Math.sin(t / 9) * 5}) rotate(10)`}>
      <path d="M -46 -48 L 46 -48 L 34 18 L -34 18 Z" fill="#C8352E" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d="M -46 -48 Q 0 -96 46 -48" stroke="#D8D4CC" strokeWidth={5} fill="none" />
    </g>
    <circle cx={480 + Math.sin(t / 19) * 12} cy={y + 60 + Math.sin(t / 7) * 4} r={30} fill="#5C3E28" stroke={INK} strokeWidth={4} />
  </g>
);

// ============================================================ A. THE PREMISE, ALREADY HAPPENING
export const A1: React.FC<ShotProps> = ({ t, len }) => {
  const s = 1.55;
  const sea = kf(t, [[0, 1215], [len, 1190]]);
  const wl = kf(t, [[0, 1610], [len, 1570]]); // the water round Pip, in the foreground
  const p = { x: 330, y: 1650, scale: s, yaw: 0.5, look: 0.7, armR: { a: 104, b: -44 }, armL: { a: 14, b: -6 }, ...faceAt(t, [[0, 'tired']]) };
  const hand = handAt(p, 'R');
  const ice = kf(t, [[0, 1010], [len, 720]]);
  return (
    <g>
      <Yard t={t} id="a1" />
      <Sea t={t} y={sea} />
      <Junk t={t} y={sea} />
      <IceChunk x={ice} y={1400} s={1.25} t={t} />
      <Penguin x={ice} y={1340 + Math.sin(t / 9) * 4} s={1.1} dir={-1} />
      {/* his red plastic chair, then Pip in it, then the water up to his chest */}
      <path d="M 196 1330 L 214 1640 M 462 1330 L 446 1640" stroke="#A82C26" strokeWidth={26} strokeLinecap="round" />
      <path d="M 186 1320 Q 330 1270 472 1320 L 464 1420 Q 330 1380 200 1420 Z" fill="#C8352E" stroke={INK} strokeWidth={6} />
      <Fig look={PIP} pose={p} rimId="rimR" />
      <TeaGlass x={hand.x + 8} y={hand.y + 44} s={1.5} fill={0.75} t={t} steam />
      <rect x={-300} y={wl} width={1700} height={900} fill="#2F5A72" />
      <Sea t={t} y={wl} />
      <Ripple x={330} y={wl + 6} r={210} t={t} />
      <text x={540} y={330} textAnchor="middle" fontFamily={FONT.ui} fontSize={42} letterSpacing={12} fill="#FFE27A">WHAT IF...</text>
      <Say y={490} text="മഞ്ഞെല്ലാം" size={150} color="#6FD0E0" />
      <Say y={650} text="ഉരുകിയാൽ?" size={150} color="#FFFFFF" />
    </g>
  );
};

export const A2: React.FC<ShotProps> = ({ t, len }) => {
  const bx = kf(t, [[0, 1500], [46, 740]], easeOut);
  const by = 1420;
  const m = { x: bx - 460, y: by - 190, scale: 1, yaw: 0.2, look: -0.3, armR: { a: 150 + Math.sin(t / 3) * 14, b: -16 }, armL: { a: 12, b: -6 }, ...faceAt(t, [[0, 'cool']]) };
  const p = { x: 170, y: 1790, scale: 1.3, yaw: 0.6, look: 0.8, headTilt: -6, armR: { a: 10, b: -6 }, ...faceAt(t, [[0, 'shock']]) };
  return (
    <g transform={vcam(540, 960, kf(t, [[0, 1.08], [len, 1]]))}>
      <Yard t={t + 90} id="a2" />
      <Sea t={t + 90} y={1190} />
      <Junk t={t + 90} y={1190} />
      <Fig look={MO} pose={m} rimId="rimR" />
      <Houseboat x={bx} y={by} s={0.98} t={t} dir={-1} />
      <path d={`M -300 ${by + 34} H 1400`} stroke="#D8F0EE" strokeWidth={5} opacity={0.55} />
      {/* Pip in the foreground, up to his chest, watching it park */}
      <Fig look={PIP} pose={p} rimId="rimR" />
      <Sea t={t + 90} y={1690} />
      <Ripple x={170} y={1694} r={170} t={t} />
    </g>
  );
};

export const A3: React.FC<ShotProps> = ({ t }) => {
  const s = 2.7;
  const p = { x: 500, y: 1780, scale: s, yaw: 0.35, look: 0.5, headTilt: -5, armR: { a: 12, b: -6 }, armL: { a: 12, b: -6 }, ...faceAt(t, [[0, 'neutral'], [22, 'oops']]) };
  const h = headAt(p);
  // the rope lands in the pause after the word (15 frames in)
  const r = t - 14;
  const land = clamp(r / 6);
  const ny = h.y + 104 * s * 0.62; // the neck
  return (
    <g>
      <Sky id="a3" mode="dusk" y0={0} y1={1500} />
      <Glow x={880} y={1040} r={620} kind="warm" o={0.75} />
      <Foreground blur={10}>
        <KHouse x={200} y={1380} s={0.9} lit={0.8} />
        <Palm x={980} y={1420} s={1.2} t={t} dark />
      </Foreground>
      <Sea t={t} y={1320} />
      <Fig look={PIP} pose={p} rimId="rimR" />
      {/* the rope, thrown from off frame right, loops round his neck and goes taut */}
      {r >= -2 ? (
        <g>
          <path d={`M 1180 ${kf(r, [[0, 240], [8, 420]])} Q 900 ${kf(r, [[0, 500], [8, 760], [12, 620]])} ${h.x + 120 + (1 - land) * 300} ${ny - (1 - land) * 420}`} stroke="#C9A45A" strokeWidth={18} fill="none" strokeLinecap="round" />
          <ellipse cx={h.x + (1 - land) * 300} cy={ny - (1 - land) * 420} rx={150} ry={40} fill="none" stroke={INK} strokeWidth={26} />
          <ellipse cx={h.x + (1 - land) * 300} cy={ny - (1 - land) * 420} rx={150} ry={40} fill="none" stroke="#C9A45A" strokeWidth={16} />
        </g>
      ) : null}
      <Penguin x={910} y={1500 + Math.sin(t / 9) * 4} s={1} dir={-1} mood={r > 6 ? 'shock' : 'calm'} />
      <IceChunk x={910} y={1530} s={1.05} t={t} />
      <Sea t={t} y={1640} />
    </g>
  );
};

// ============================================================ B. KUTTANAD
const Farmer = TEAMAN;

const Bund: React.FC<{ t: number; id: string; sea: number }> = ({ t, id, sea }) => (
  <g>
    <Sky id={id} mode="dusk" y0={100} y1={1000} />
    <Sun x={160} y={760} r={70} t={t} />
    <Sea t={t} y={sea} sunX={160} />
    <Boat x={150} y={sea + 8} s={0.5} t={t} />
    {/* earth, bund and field in one piece */}
    <path d="M -300 1460 L 300 1460 L 370 830 L 500 830 L 610 1270 L 1400 1270 L 1400 2300 L -300 2300 Z" fill="#4A3226" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <path d="M 370 830 L 500 830" stroke="#6E9E46" strokeWidth={12} strokeLinecap="round" />
    <rect x={610} y={1262} width={800} height={26} fill="#7FB8B8" opacity={0.75} />
    <Palm x={436} y={836} s={0.52} t={t} dark />
    <Paddy x0={620} x1={1120} y={1274} h={62} t={t} />
  </g>
);

export const B1: React.FC<ShotProps> = ({ t, len }) => {
  const sea = kf(t, [[0, 925], [len, 862]]);
  const s = 0.86;
  const bend = Math.sin(t / 9);
  const p = { x: 800, y: ground(1272, s), scale: s, yaw: 0.6, look: 0.6, tilt: 30 + bend * 5, armR: { a: 42 + bend * 12, b: -16 }, armL: { a: 30, b: -18 }, ...faceAt(t, [[0, 'neutral']]) };
  return (
    <g>
      <Bund t={t} id="b1" sea={sea} />
      <Fig look={Farmer} pose={p} rimId="rimL" />
      <Mundu pose={{ ...p, tilt: 0 }} />
      <Hat pose={p} />
      {/* where the sea stands, carried across the field: it runs above his head */}
      <line x1={500} y1={sea} x2={1100} y2={sea} stroke="#6FD0E0" strokeWidth={7} strokeDasharray="30 20" />
      <Say x={810} y={sea - 30} text="കടൽ" size={68} color="#6FD0E0" />
      <Say x={760} y={1500} text="കുട്ടനാട്" size={104} color="#FFE27A" />
      <LevelChip text="കടൽ +1 മീ" t={t - 10} y={330} />
    </g>
  );
};

export const B2: React.FC<ShotProps> = ({ t, len }) => {
  const s = 2.1;
  const p = { x: 720, y: ground(1800, s), scale: s, yaw: -0.45, look: -0.8, headTilt: -8, armL: { a: 40, b: -30 }, armR: { a: 30, b: -24 }, ...faceAt(t, [[0, 'worried']]) };
  const boat = kf(t, [[0, 90], [len, 420]]);
  return (
    <g transform={vcam(540, 960, kf(t, [[0, 1], [len, 1.05]]))}>
      <Sky id="b2" mode="dusk" y0={0} y1={760} />
      <Glow x={120} y={460} r={560} kind="warm" o={0.7} />
      {/* looking up the inside of the bund: the sea is on the far side, above him */}
      <Boat x={boat} y={560} s={1.25} t={t} look={1} />
      <path d="M -300 560 Q 540 530 1400 590 L 1400 2300 L -300 2300 Z" fill="#46301F" stroke={INK} strokeWidth={8} />
      <path d="M -300 560 Q 540 530 1400 590" stroke="#6E9E46" strokeWidth={16} fill="none" />
      <IceChunk x={830} y={560} s={0.72} t={t} />
      <Penguin x={830} y={530} s={0.72} dir={-1} />
      {[0, 1, 2, 3, 4].map((i) => {
        const ph = ((t * 1.2 + i * 17) % 60) / 60;
        return <ellipse key={i} cx={120 + i * 150} cy={590 + ph * 700} rx={7} ry={15} fill="#8FD3E8" opacity={0.75 * (1 - ph)} />;
      })}
      <path d="M 160 576 Q 150 800 180 1000 M 460 560 Q 472 760 448 900" stroke="#6FA8B8" strokeWidth={10} fill="none" opacity={0.5} strokeLinecap="round" />
      <rect x={-300} y={1380} width={1700} height={900} fill="#37503E" />
      <Paddy x0={-60} x1={1160} y={1420} h={120} t={t} />
      <Fig look={Farmer} pose={p} rimId="rimL" />
      <Mundu pose={p} />
      <Hat pose={p} />
      <Foreground blur={10}>
        <Paddy x0={-100} x1={1200} y={1980} h={320} t={t + 30} seed={8} />
      </Foreground>
    </g>
  );
};

export const B3: React.FC<ShotProps> = ({ t, len }) => {
  const s = 3.1;
  const p = { x: 540, y: 1650, scale: s, yaw: 0.25, look: 0.3, armR: { a: 12, b: -6 }, armL: { a: 12, b: -6 }, ...faceAt(t, [[0, 'tired']]) };
  const h = headAt(p);
  const sea = kf(t, [[0, h.y + 170], [len, h.y + 136]]);
  const duck = 1 - clamp((t - 4) / 6);
  return (
    <g>
      <Sky id="b3" mode="dusk" y0={0} y1={1300} />
      <Glow x={160} y={1100} r={700} kind="warm" o={0.75} />
      <Foreground blur={10}>
        <Palm x={90} y={1240} s={0.9} t={t} dark />
        <Palm x={1010} y={1240} s={1.1} t={t + 20} dark />
      </Foreground>
      <Fig look={Farmer} pose={p} rimId="rimL" />
      <Hat pose={p} />
      <Duck x={h.x - 10} y={h.y - 196 - duck * 340} s={1.5} dir={-1} />
      <Sea t={t} y={sea} sunX={160} />
      <Ripple x={h.x} y={sea + 4} r={260} t={t} />
      {/* he keeps planting: one hand and a seedling above the water */}
      <path d={`M 880 ${sea + 6} L 880 ${sea - 70}`} stroke="#E4DCC8" strokeWidth={54} />
      <circle cx={880} cy={sea - 100} r={38} fill="#B98562" stroke={INK} strokeWidth={6} />
      <path d={`M 880 ${sea - 110} q -8 -60 -44 -120 M 880 ${sea - 110} q 6 -80 8 -150 M 880 ${sea - 110} q 16 -60 54 -110`} stroke="#6E9E46" strokeWidth={13} fill="none" strokeLinecap="round" />
    </g>
  );
};

// ============================================================ C. THE COAST GOES
export const C1: React.FC<ShotProps> = ({ t, len }) => {
  const sea = kf(t, [[0, 1190], [len, 1090]]);
  return (
    <g>
      <Sky id="c1" mode="dusk" y0={0} y1={1120} />
      <Sun x={790} y={930} r={70} t={t} />
      {[-40, 120, 300, 900, 1090].map((x, i) => <Palm key={i} x={x} y={1120} s={0.8 + (i % 2) * 0.22} t={t + i * 20} dark />)}
      <StationBoard x={540} y={980} name="ആലപ്പുഴ" />
      <Sea t={t} y={sea} sunX={790} />
      <Chundan x={kf(t, [[0, 1000], [len, 400]])} y={1460} s={0.92} t={t} />
      <Sea t={t + 7} y={1500} sunX={790} />
    </g>
  );
};

export const C2: React.FC<ShotProps> = ({ t, len }) => {
  const by = kf(t, [[0, 1030], [len, 880]], easeOut);
  return (
    <g>
      <Sky id="c2" mode="dusk" y0={0} y1={1300} />
      <Glow x={900} y={1180} r={700} kind="warm" o={0.8} />
      <StationBoard x={540} y={490} name="കൊച്ചി" s={0.82} />
      <ChinaNet bx={590} by={by}>
        <g transform={`rotate(-5 590 ${by})`}>
          <Bus x={590} y={by + 280} s={0.56} t={t} />
        </g>
      </ChinaNet>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const ph = ((t * 1.4 + i * 9) % 30) / 30;
        return <ellipse key={i} cx={330 + i * 86} cy={by + 330 + ph * 170} rx={8} ry={18} fill="#8FD3E8" opacity={0.85 * (1 - ph)} />;
      })}
      <StationBoard x={540} y={490} name="കൊച്ചി" s={0.82} posts={false} />
      <Sea t={t} y={1370} sunX={900} />
    </g>
  );
};

export const C3: React.FC<ShotProps> = ({ t, len }) => {
  const s = 2;
  const p = { x: 540, y: 1720, scale: s, yaw: 0.1, look: 0.2, armL: { a: 168, b: 4 }, armR: { a: 168, b: 4 }, ...faceAt(t, [[0, 'worried']]) };
  const h = headAt(p);
  const sea = kf(t, [[0, h.y + 96], [len, h.y + 76]]);
  return (
    <g>
      <Sky id="c3" mode="dusk" y0={0} y1={1400} />
      <Glow x={230} y={1130} r={640} kind="warm" o={0.7} />
      <StationBoard x={430} y={540} name="കോഴിക്കോട്" s={0.9} rot={-7} />
      <Fig look={CROWD[1]} pose={p} rimId="rimR" />
      <Tache pose={p} />
      <Handi x={540} y={h.y - 330} s={1.5} t={t} />
      <Sea t={t} y={sea} sunX={230} />
      <Ripple x={540} y={sea + 6} r={230} t={t} />
    </g>
  );
};

// ============================================================ D. IT KEEPS COMING
export const D0: React.FC<ShotProps> = ({ t, len }) => {
  const sea = kf(t, [[0, 1500], [len, 1390]]);
  const roofY = 1160;
  const s = 1.15;
  const p = { x: 420, y: roofY + 26, scale: s, yaw: 0.6, look: 0.8, headTilt: 8, legL: { a: 38, b: -22 }, legR: { a: 50, b: -30 }, armR: { a: 22, b: -20 }, armL: { a: 16, b: -16 }, ...faceAt(t, [[0, 'worried']]) };
  return (
    <g transform={vcam(540, 1060, kf(t, [[0, 1], [len, 1.06]]))}>
      <Sky id="d0" mode="dusk" y0={0} y1={1400} />
      <Sun x={880} y={1050} r={84} t={t} />
      <Palm x={1130} y={1500} s={1.2} t={t} dark />
      <KHouse x={540} y={1820} s={1.15} lit={0.4} />
      <Sea t={t} y={sea} />
      <Fig look={PIP} pose={p} rimId="rimR" />
      <Penguin x={700} y={1200} s={0.86} dir={-1} mood="sad" />
    </g>
  );
};

export const D1: React.FC<ShotProps> = ({ t, len }) => {
  const sea = kf(t, [[0, 1760], [len, 660]]);
  return (
    <g>
      <Sky id="d1" mode="dusk" y0={0} y1={1300} />
      <Sun x={880} y={760} r={70} t={t} />
      <Tower x={190} top={980} floors={8} w={250} seed={4} />
      <Tower x={930} top={880} floors={10} w={230} seed={6} />
      <Tower x={540} top={520} floors={23} banner="സീ വ്യൂ ഫ്ലാറ്റ്" />
      <Sea t={t} y={sea} sunX={880} rough={0.4} />
      <Ripple x={540} y={sea + 4} r={300} t={t} />
      <Say y={270} text="70 മീറ്റർ" size={140} color="#6FD0E0" t={t - 4} />
      <Say y={385} text="23 നില" size={72} color="#FFFFFF" t={t - 10} />
    </g>
  );
};

export const D2: React.FC<ShotProps> = ({ t, len }) => {
  const s = 1.25;
  const p = { x: 640, y: 1000, scale: s, facing: -1 as const, yaw: -0.8, look: -0.6, legL: { a: 82, b: -82 }, legR: { a: 78, b: -82 }, armR: { a: 64, b: -24 }, armL: { a: 30, b: -40 }, ...faceAt(t, [[0, 'smug']]) };
  const hand = handAt(p, 'R');
  // the fish comes up in the pause after the line (67 frames in)
  const up = clamp((t - 68) / 12);
  const fish = { x: 150 + up * 40, y: kf(t, [[68, 1330], [80, 860]], easeOut) };
  const rodTip = { x: 230, y: 690 + up * 40 };
  return (
    <g>
      <Sky id="d2" mode="dusk" y0={0} y1={1300} />
      <Sun x={150} y={1150} r={80} t={t} />
      <Sea t={t} y={kf(t, [[0, 1290], [len, 1190]])} sunX={150} />
      {/* the top floor: his wall, a lit door, the slab, and the sea just under it */}
      <rect x={740} y={-200} width={700} height={1560} fill="#4C4556" stroke={INK} strokeWidth={7} />
      <rect x={800} y={600} width={210} height={520} fill="#FFC867" stroke={INK} strokeWidth={7} />
      <Glow x={900} y={860} r={460} kind="warm" o={0.6} />
      <rect x={150} y={1120} width={640} height={36} fill="#7A7484" stroke={INK} strokeWidth={6} />
      <path d="M 560 1120 L 590 960 M 700 1120 L 680 960 M 560 960 L 712 960" stroke="#C8352E" strokeWidth={15} strokeLinecap="round" />
      <path d="M 700 960 L 716 760" stroke="#C8352E" strokeWidth={15} strokeLinecap="round" />
      <Fig look={UNCLE} pose={p} rimId="rimL" />
      <Tache pose={p} specs sides="#A9A7AE" />
      <path d={`M ${hand.x} ${hand.y} Q 420 ${680 + up * 30} ${rodTip.x} ${rodTip.y}`} stroke="#D8B26A" strokeWidth={9} fill="none" strokeLinecap="round" />
      <path d={`M ${rodTip.x} ${rodTip.y} L ${fish.x + 30} ${fish.y - 26}`} stroke="#E8E0CC" strokeWidth={3} />
      {[210, 330, 450].map((x) => <rect key={x} x={x - 6} y={960} width={12} height={160} fill="#2C2A34" />)}
      <rect x={150} y={950} width={380} height={16} rx={6} fill="#3E3A48" stroke={INK} strokeWidth={4} />
      <Penguin x={400} y={950} s={0.72} dir={-1} flap={up} mood={up > 0.5 ? 'shock' : 'calm'} />
      {t > 68 ? <Fish x={fish.x} y={fish.y} s={1.4} rot={-70 + up * 40} dir={1} /> : null}
      <path d="M 150 1156 h 640 l -24 30 h -600 Z" fill="#332E3E" />
      <Say y={420} text="ഇരുപത്തിമൂന്നാം നില" size={78} color="#FFFFFF" />
    </g>
  );
};

// ============================================================ E. WHAT IS LEFT
const Church: React.FC = () => (
  <g>
    <path d="M -110 0 L -110 -180 L 0 -300 L 110 -180 L 110 0 Z" fill="#D8D0C0" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M 0 -300 V -410 M -36 -372 H 36" stroke="#2A2230" strokeWidth={14} strokeLinecap="round" />
    <path d="M -34 0 V -90 Q 0 -130 34 -90 V 0" fill="#2A2230" />
  </g>
);
const MobileTower: React.FC = () => (
  <g stroke="#2A2230" fill="none">
    <path d="M -46 0 L -12 -380 M 46 0 L 12 -380" strokeWidth={9} />
    {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${-44 + i * 7} ${-30 - i * 70} L ${38 - i * 7} ${-96 - i * 70} M ${44 - i * 7} ${-30 - i * 70} L ${-38 + i * 7} ${-96 - i * 70}`} strokeWidth={5} />)}
    <rect x={-22} y={-420} width={44} height={46} fill="#D8D0C0" strokeWidth={5} />
    <circle cx={0} cy={-436} r={10} fill="#E4544A" stroke="none" />
  </g>
);

export const E1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={vcam(540, 960, kf(t, [[0, 1.06], [len, 1]]))}>
    <Sky id="e1" mode="dusk" y0={0} y1={860} />
    <Sun x={780} y={830} r={92} t={t} />
    <Sea t={t} y={860} sunX={780} />
    <Tip id="e1a" x={190} y={960} s={0.34} t={t}><Palm x={0} y={420} s={1} t={t} dark /></Tip>
    <Tip id="e1b" x={330} y={930} s={0.4} t={t}><MobileTower /></Tip>
    <Tip id="e1c" x={960} y={1010} s={0.42} t={t}><Palm x={0} y={430} s={1} t={t + 20} dark /></Tip>
    <Tip id="e1d" x={850} y={1140} s={0.72} t={t}><Church /></Tip>
    <Tip id="e1e" x={130} y={1240} s={0.72} t={t}><Palm x={0} y={430} s={1.05} t={t + 40} dark /></Tip>
    <Tip id="e1f" x={460} y={1420} s={0.92} t={t}><Palm x={0} y={460} s={1.05} t={t + 60} dark /></Tip>
    <Tip id="e1g" x={980} y={1460} s={0.95} t={t}><Palm x={0} y={470} s={1.1} t={t + 80} dark /></Tip>
    <IceChunk x={kf(t, [[0, 620], [len, 700]])} y={1270} s={0.6} t={t} />
    <Penguin x={kf(t, [[0, 620], [len, 700]])} y={1240} s={0.5} dir={1} mood="sad" />
    <Say y={400} text="കേരളത്തിന്റെ" size={84} color="#FFFFFF" t={t - 4} />
    <Say y={550} text="പകുതിയോളം" size={136} color="#6FD0E0" t={t - 10} />
  </g>
);

export const E2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={vcam(kf(t, [[0, 500], [len, 580]]), 1000, 1.05)}>
    <Sky id="e2" mode="dusk" y0={0} y1={1160} />
    <Sun x={250} y={840} r={84} t={t} />
    <TeaHills t={t} y={1240} />
    {/* a hill town with its lights on: the only lit windows left */}
    {[[640, 1060], [700, 1044], [770, 1070]].map(([x, y], i) => (
      <g key={i}>
        <rect x={x} y={y} width={52} height={42} fill="#E6D3AE" stroke={INK} strokeWidth={4} />
        <path d={`M ${x - 8} ${y} L ${x + 26} ${y - 26} L ${x + 60} ${y} Z`} fill="#A2432C" stroke={INK} strokeWidth={4} />
        <rect x={x + 18} y={y + 14} width={16} height={18} fill="#FFC867" />
      </g>
    ))}
    <Glow x={720} y={1060} r={220} kind="warm" o={0.6} />
    <Sea t={t} y={1400} sunX={250} />
    <Say y={480} text="ബാക്കി: മലനാട്" size={104} color="#FFFFFF" t={t - 6} />
    <Foreground blur={10}>
      <Palm x={1010} y={1760} s={1.1} t={t} dark />
    </Foreground>
  </g>
);

const road = (x: number) => 1560 - x * 0.42;

export const E3: React.FC<ShotProps> = ({ t, len }) => {
  const step = (i: number) => Math.sin(t / 3 + i);
  const walker = (x: number, s: number, i: number, extra = {}) => ({
    x, y: ground(road(x), s), scale: s, yaw: 0.55, look: 0.3, tilt: 6, legL: { a: step(i) * 22, b: -14 }, legR: { a: -step(i) * 22, b: -14 }, armL: { a: 158, b: 8 }, armR: { a: 158, b: 8 }, ...extra,
  });
  const w0 = walker(120, 0.96, 0, { expr: 'tired', blink: 0 });
  const w1 = walker(370, 0.96, 1, { expr: 'worried', blink: 0 });
  const w2 = walker(620, 0.96, 2, { expr: 'oops', blink: 0 });
  const onHead = (p: ReturnType<typeof walker>) => headAt(p);
  const dx = t * 0.7;
  return (
    <g transform={`translate(${-dx} ${dx * 0.42})`}>
      <Sky id="e3" mode="dusk" y0={-200} y1={900} />
      <Sun x={210} y={640} r={70} t={t} />
      <TeaHills t={t} y={980} />
      <g transform="translate(880 700) rotate(-20) scale(0.8)">
        <Bus x={0} y={0} s={0.44} t={t} />
        {[-180, -100, -10, 90, 170].map((x, i) => <Suitcase key={x} x={x} y={-186 - (i % 2) * 12} s={0.62} c={['#B8452E', '#3E6E8C', '#C9A24A', '#7A5A8C', '#3E8C6E'][i]} />)}
      </g>
      <path d={`M -400 ${road(-400)} L 1500 ${road(1500)} L 1500 2300 L -400 2300 Z`} fill="#6A5240" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <path d={`M -400 ${road(-400) + 80} L 1500 ${road(1500) + 80} L 1500 2300 L -400 2300 Z`} fill="#3E6E4C" stroke={INK} strokeWidth={6} />
      <g transform={`translate(910 ${road(910) - 250})`}>
        <rect x={-10} y={0} width={20} height={250} fill="#2C2A34" />
        <path d="M -130 -80 L 110 -80 L 160 -20 L 110 40 L -130 40 Z" fill="#E8E0CC" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <text x={-4} y={2} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={58} fill="#16121E">മൂന്നാർ</text>
      </g>
      <Fig look={CROWD[0]} pose={w0} rimId="rimL" />
      <Suitcase x={onHead(w0).x} y={onHead(w0).y - 96} s={1} rot={-6} c="#3E6E8C" />
      <Fig look={MOM} pose={w1} rimId="rimL" />
      {/* amma's ammikkallu goes first */}
      <g transform={`translate(${onHead(w1).x} ${onHead(w1).y - 78}) rotate(-6)`}>
        <rect x={-74} y={-30} width={148} height={62} rx={18} fill="#6E6A74" stroke={INK} strokeWidth={6} />
        <rect x={-54} y={-64} width={108} height={36} rx={18} fill="#8A8690" stroke={INK} strokeWidth={6} />
      </g>
      <Fig look={MO} pose={w2} rimId="rimL" />
      <g transform={`translate(${onHead(w2).x} ${onHead(w2).y - 104}) rotate(-6)`}>
        <rect x={-96} y={-56} width={192} height={120} rx={8} fill="#1E1B2A" stroke={INK} strokeWidth={6} />
        <rect x={-82} y={-44} width={164} height={94} fill="#3E7CA8" />
      </g>
      <g>
        <Penguin x={860} y={road(860) + 4} s={0.74} dir={1} rot={-10} />
        <Suitcase x={950} y={road(950) - 38} s={0.54} c="#C9A24A" rot={-22} />
      </g>
      <Foreground blur={10}>
        {[-60, 180, 460, 740, 1020].map((x, i) => <circle key={i} cx={x} cy={1890 - (i % 2) * 40} r={190} fill="#1E3A2A" />)}
      </Foreground>
    </g>
  );
};

export const E4: React.FC<ShotProps> = ({ t }) => {
  // the sign slams in the pause after "Munnar" (26 frames in)
  const k = clamp((t - 26) / 5);
  const y = 690 - (1 - k) * 900;
  return (
    <g>
      <rect x={-100} y={-100} width={1280} height={2120} fill="#3E3A4C" />
      <Glow x={710} y={1040} r={560} kind="warm" o={0.75} />
      {/* the lodge front: a lit door jammed with the people who got here first, the board, a pot of ferns */}
      <rect x={560} y={860} width={300} height={680} fill="#FFC867" stroke={INK} strokeWidth={8} />
      {[[610, 1120, 54], [700, 1060, 58], [800, 1130, 52], [650, 1000, 46], [770, 990, 46]].map(([x, y2, r], i) => (
        <g key={i} fill="#3A2A30">
          <circle cx={x} cy={y2} r={r} />
          <rect x={x - r * 1.25} y={y2 + r * 0.7} width={r * 2.5} height={500} rx={r} />
        </g>
      ))}
      <rect x={560} y={860} width={300} height={680} fill="none" stroke={INK} strokeWidth={8} />
      <rect x={-100} y={1540} width={1280} height={500} fill="#2A2632" />
      <rect x={-100} y={1534} width={1280} height={14} fill="#4A4556" />
      <rect x={130} y={860} width={270} height={250} fill="#1E1B2A" stroke={INK} strokeWidth={7} />
      <path d="M 265 860 V 1110 M 130 985 H 400" stroke={INK} strokeWidth={6} />
      <path d="M 930 1540 L 950 1440 L 1050 1440 L 1070 1540 Z" fill="#8E5A30" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      {[-40, -14, 14, 40].map((d, i) => <path key={i} d={`M 1000 1440 Q ${1000 + d} 1370 ${1000 + d * 2.4} ${1320 + (i % 2) * 40}`} stroke="#5E8F45" strokeWidth={12} fill="none" strokeLinecap="round" />)}
      <rect x={120} y={340} width={840} height={170} rx={10} fill="#E8E0CC" stroke={INK} strokeWidth={8} />
      <text x={540} y={458} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={92} fill="#16121E">മൂന്നാർ ലോഡ്ജ്</text>
      <g transform={`translate(540 ${y}) rotate(${-5 + (1 - k) * 8}) scale(${backOut(k) * 0.3 + 0.7})`}>
        <rect x={-340} y={-90} width={680} height={190} rx={14} fill="#C8352E" stroke={INK} strokeWidth={9} />
        <text y={46} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={122} fill="#FFF2D8">മുറിയില്ല</text>
      </g>
      <Penguin x={340} y={1560} s={1.7} dir={1} mood={t > 30 ? 'shock' : 'calm'} flap={t > 30 ? 0.7 : 0} />
      <Suitcase x={120} y={1520} s={0.9} c="#C9A24A" rot={-3} />
    </g>
  );
};

// ============================================================ F. WHERE IS YOUR HOUSE?
const Deep: React.FC<{ id: string; y0?: number }> = ({ id, y0 = -100 }) => (
  <g>
    <defs>
      <linearGradient id={`deep_${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2E7E96" />
        <stop offset="0.5" stopColor="#14506E" />
        <stop offset="1" stopColor="#0A2438" />
      </linearGradient>
    </defs>
    <rect x={-200} y={y0} width={1500} height={2200 - y0} fill={`url(#deep_${id})`} />
  </g>
);

const Bubbles: React.FC<{ t: number; x0: number; w: number; y0: number; n?: number; seed?: number }> = ({ t, x0, w, y0, n = 16, seed = 5 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const ph = ((t * 0.9 + rnd(seed, i) * 200) % 200) / 200;
      return <circle key={i} cx={x0 + rnd(seed + 1, i) * w + Math.sin(t / 9 + i) * 10} cy={y0 - ph * 900} r={5 + rnd(seed + 2, i) * 12} fill="none" stroke="#BFEFFF" strokeWidth={3} opacity={0.55 * (1 - ph)} />;
    })}
  </g>
);

export const F1: React.FC<ShotProps> = ({ t, len }) => {
  const s = 1.1;
  const p = { x: 300, y: 1440, scale: s, yaw: 0.45, look: 0.3, legL: { a: 82, b: -82 }, legR: { a: 78, b: -82 }, armR: { a: 66, b: -66 }, armL: { a: 58, b: -60 }, ...faceAt(t, [[0, 'neutral']]) };
  const hand = handAt(p, 'R');
  return (
    <g transform={vcam(540, 1060, kf(t, [[0, 1.08], [len, 1]]))}>
      <Deep id="f1" />
      {[0, 1, 2].map((i) => <path key={i} d={`M ${180 + i * 320} -100 L ${300 + i * 320} -100 L ${160 + i * 340} 1500 L ${-40 + i * 340} 1500 Z`} fill="#BFEFFF" opacity={0.07} />)}
      <KHouse x={590} y={1570} s={0.92} lit={1} door={0.8} />
      <rect x={-200} y={700} width={1500} height={1400} fill="#14506E" opacity={0.4} />
      <Glow x={590} y={1420} r={480} kind="warm" o={0.65} />
      <rect x={-200} y={1570} width={1500} height={600} fill="#0E2A3A" />
      <path d="M 196 1400 L 214 1570 M 400 1400 L 386 1570 M 180 1400 H 420" stroke="#C8352E" strokeWidth={15} strokeLinecap="round" />
      <path d="M 196 1400 L 180 1250" stroke="#C8352E" strokeWidth={15} strokeLinecap="round" />
      <Fig look={MO} pose={p} rimId="rimR" />
      <Goggles pose={p} />
      <g transform={`translate(${hand.x + 26} ${hand.y - 16}) rotate(8)`}>
        <rect x={-74} y={-66} width={148} height={132} fill="#E4DCC8" stroke={INK} strokeWidth={5} />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={-58} y={-48 + i * 28} width={116 - (i % 2) * 34} height={9} fill="#6E6A74" />)}
      </g>
      <Fish x={kf(t, [[0, 900], [len, 610]])} y={1400} s={0.9} dir={-1} />
      <Fish x={kf(t, [[0, 1160], [len, 820]])} y={1140} s={1.25} dir={-1} c="#C8D0D8" />
      <Fish x={kf(t, [[0, 240], [len, 460]])} y={920} s={1} dir={1} c="#E06A4A" />
      <Bubbles t={t} x0={120} w={840} y0={1500} />
      <Foreground blur={10}>
        <path d="M -60 2000 Q -20 1500 40 1280 Q 90 1500 120 2000 Z M 980 2000 Q 1000 1560 1060 1380 Q 1120 1560 1150 2000 Z" fill="#06202E" />
      </Foreground>
    </g>
  );
};

export const F2: React.FC<ShotProps> = ({ t, len }) => {
  const wl = 1040;
  const s = 0.95;
  const p = { x: 390, y: wl - 150, scale: s, yaw: 0.35, look: 0.2, legL: { a: 76, b: -74 }, legR: { a: 84, b: -78 }, armR: { a: 66, b: -80 }, armL: { a: 20, b: -10 }, ...faceAt(t, [[0, 'worried']]) };
  const hand = handAt(p, 'R');
  return (
    <g>
      <Sky id="f2" mode="dusk" y0={0} y1={wl} />
      <Sun x={880} y={wl - 90} r={84} t={t} />
      <Deep id="f2" y0={wl} />
      <KHouse x={540} y={1760} s={0.72} lit={1} />
      <rect x={-200} y={wl} width={1500} height={1100} fill="#14506E" opacity={0.42} />
      <Glow x={540} y={1640} r={380} kind="warm" o={0.5} />
      <Fish x={kf(t, [[0, 960], [len, 690]])} y={1370} s={0.9} dir={-1} />
      <Bubbles t={t} x0={140} w={800} y0={1720} n={12} />
      <IceChunk x={500} y={wl} s={1.9} t={0} />
      <Fig look={PIP} pose={p} rimId="rimR" />
      <TeaGlass x={hand.x + 8} y={hand.y + 30} s={1} fill={0.2} />
      <Penguin x={640} y={wl - 86} s={1.05} front />
      <path d={`M -200 ${wl} Q 200 ${wl - 16 + Math.sin(t / 8) * 6} 540 ${wl} T 1300 ${wl}`} stroke="#E8FAFF" strokeWidth={8} fill="none" />
      <Say y={420} text="മുകളിലോ?" size={138} color="#FFE27A" t={t - 18} />
      <Say y={1280} text="താഴെയോ?" size={138} color="#6FD0E0" t={t - 39} />
    </g>
  );
};
