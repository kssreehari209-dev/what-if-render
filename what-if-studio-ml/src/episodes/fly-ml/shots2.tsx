// fly-ml, part 2: Mo and the backwaters, the turn (speed, cold, oxygen, the plane), the news, the suit, the flood,
// the rescue and the radar.
import React from 'react';
import {
  faceAt, kf, clamp, easeOut, easeIn, backOut, camT, rnd, LEG_LEN, Pose,
  Bedroom, WINDOW, Kitchen, KITCHEN, KitchenIsland, islandTop, stand, Rooftop, Study,
  Schematic, SCH, DrawOn, SchLabel, CountUp, TitleCard, ShotProps, FONT, Glow, Tag, Dial, DizzyStars, Sparkle,
  FloatLabel, Plate, Stars,
} from '../../engine';
import {
  Fig, flyPose, risePose, hoverPose, Sky, Cloud, CloudRow, Palm, KHouse, Grass, Water, Boat,
  TeaHills, FlatBuilding, PlaneFront, BlackCar, Gust, SpeedLines, Rain, Bolt, Whiteout, Tunnel, Drops, Breath, Frost,
  Goggles, BlueHands, headAt, handAt, Radar, TV, NewsBar, Elephant, Goose, Hummingbird, Heart, SchHead, Big, Real,
  Fade, PIP, MO, SIS, MOM, SUIT,
} from './kit';

const feet = (y: number, s: number) => y - LEG_LEN * s;
const shiver = (t: number, a = 3) => Math.sin(t * 2.7) * a;
const s30 = (sec: number) => Math.round(sec * 30);

// ============================================================ D. MO, THE BACKWATERS, THE CLOUD
export const D1: React.FC<ShotProps> = ({ t, len }) => {
  const lift = kf(t, [[10, 0], [50, -70]], easeOut);
  const ask = s30(90.25 - 87.5);
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 980]]), 560, kf(t, [[0, 1.25], [len, 1.4]]))}>
      <Rooftop t={t} sunX={1300} sunY={660} />
      <Fig look={PIP} pose={hoverPose(780, feet(820, 0.9) + lift, t, 0.9, { yaw: 0.5, look: 0.7, ...faceAt(t, [[0, 'smug']]) })} />
      <Gust x={780} y={820} t={t - 10} s={0.6} />
      <Fig look={MO} pose={{ x: 1150, y: feet(820, 0.9), scale: 0.9, yaw: -0.5, look: -0.6, armR: { a: t > ask ? 120 : 14, b: t > ask ? 60 : -8 }, handR: 'point', ...faceAt(t, [[0, 'shock'], [ask, 'happy']]) }} shadow={0.6} />
    </g>
  );
};

export const D2: React.FC<ShotProps> = ({ t, len }) => {
  const up = s30(95.75 - 93.5);
  const lift = kf(t, [[up, 0], [len, -520]], easeIn);
  const moFace = faceAt(t, [[0, 'happy'], [up + 4, 'shock'], [s30(98.81 - 93.5), 'happy'], [s30(100.42 - 93.5), 'shock']]);
  return (
    <g transform={camT(980, kf(t, [[0, 600], [up, 600], [len, 300]]), 1.5)}>
      <Rooftop t={t + 200} sunX={1300} sunY={660} />
      <Fig look={PIP} pose={risePose(880, feet(820, 0.9) - 40 + lift, t, 0.9, { armL: { a: 150, b: 10 }, armR: { a: 70, b: -10 }, yaw: 0.3, ...faceAt(t, [[0, 'smug'], [up, 'happy']]) })} />
      <Fig look={MO} pose={{ x: 1080, y: feet(820, 0.9) + lift * 0.96 + shiver(t, t > up ? 4 : 0), scale: 0.9, yaw: -0.3, armL: { a: 60, b: -10 }, armR: { a: 150, b: 20 }, legL: { a: t > up ? 30 : 5, b: 20 }, legR: { a: t > up ? -30 : -5, b: 30 }, ...moFace }} shadow={t > up ? 0 : 0.6} />
      <Gust x={980} y={820} t={t - up} s={0.8} />
    </g>
  );
};

const Flyers: React.FC<{ t: number; x: number; y: number; s?: number; mo?: boolean }> = ({ t, x, y, s = 0.6, mo = true }) => (
  <g>
    {mo ? <Fig look={MO} pose={flyPose(x - 200 * s, y + 90 * s, t + 9, s, 1, { ...faceAt(t, [[0, 'happy']]) })} /> : null}
    <Fig look={PIP} pose={flyPose(x, y, t, s, 1, { ...faceAt(t, [[0, 'happy']]) })} />
  </g>
);

export const D3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.06]]))}>
    <Sky id="d3" mode="dusk" y1={640} />
    <CloudRow t={t} y={200} n={5} tone="dusk" speed={-0.4} s={0.7} />
    {Array.from({ length: 12 }).map((_, i) => <Palm key={i} x={-100 + i * 190} y={640} s={0.32 + rnd(1, i) * 0.12} t={t} lean={(rnd(2, i) - 0.5) * 120} dark />)}
    <Water t={t} y={630} />
    <Glow x={1300} y={640} r={420} kind="warm" o={0.35} />
    <Boat x={kf(t, [[0, 1180], [len, 1120]])} y={860} s={0.8} t={t} look={clamp((t - 30) / 20)} />
    <Flyers t={t} x={kf(t, [[0, 100], [len, 1500]])} y={330} />
  </g>
);

export const D4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, 1)}>
    <Sky id="d4" mode="day" y1={800} />
    <CloudRow t={t} y={160} n={5} tone="day" speed={-0.6} s={0.6} />
    <TeaHills t={t} y={880} />
    <Flyers t={t} x={kf(t, [[0, 300], [len, 1500]])} y={380} s={0.55} />
    <Tag x={620} y={140} t={t - s30(110.28 - 108.1)} text="ട്രാഫിക്" mark="x" w={300} />
    <Tag x={1240} y={140} t={t - s30(111.33 - 108.1)} text="ടിക്കറ്റ്" mark="x" w={300} />
  </g>
);

export const D5: React.FC<ShotProps> = ({ t, len }) => {
  const wet = s30(117.34 - 112.2);
  const fog = clamp((t - 40) / 30);
  const p = t < 60
    ? flyPose(kf(t, [[0, 500], [60, 960]]), 560, t, 0.9, 1, { ...faceAt(t, [[0, 'happy']]) })
    : hoverPose(960, 560, t, 0.9, { yaw: 0.1, armL: { a: 30, b: -10 }, armR: { a: 30, b: -10 }, headTilt: t > wet ? 8 : 0, ...faceAt(t, [[0, 'happy'], [wet, 'oops']]) });
  return (
    <g transform={camT(960, 470, kf(t, [[0, 1.2], [len, 1.6]]))}>
      <Sky id="d5" mode="day" />
      <Cloud x={1400 - fog * 400} y={520} s={2.4 + fog * 2} {...{ lit: '#FFFFFF', body: '#E6EEF6', shade: '#AFC0D6' }} />
      <rect x={-3000} y={-3000} width={8000} height={8000} fill="#D8DEE6" opacity={fog * 0.75} />
      <Fig look={PIP} pose={p} rimId="rimBlueL" />
      {t > wet ? <Drops x={960} y={560} t={t} n={14} w={140} color="#6FA8E0" /> : null}
      {t > wet ? <Drops x={960} y={380} t={t + 20} n={6} w={80} color="#6FA8E0" seed={9} /> : null}
      <rect x={-3000} y={-3000} width={8000} height={8000} fill="#E8EEF4" opacity={fog * 0.2 * (1 + Math.sin(t / 12))} />
    </g>
  );
};

const cloudPath = 'M 640 700 Q 560 700 560 630 Q 560 560 650 560 Q 680 470 790 480 Q 850 400 960 430 Q 1060 380 1120 470 Q 1220 460 1250 550 Q 1340 560 1340 630 Q 1340 700 1260 700 Z';

export const D6: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="d6" />
    <SchHead text="ഒരു വെള്ള മേഘം" t={t} />
    <DrawOn d={cloudPath} t={t} dur={20} width={6} />
    <CountUp x={950} y={880} t={t - s30(122.5 - 120.1)} to={500} dur={20} size={130} color={SCH.live} suffix=" ടൺ" />
  </g>
);

export const D7: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="d7" />
    <SchHead text="≈ 100 ആനകൾ" t={t} />
    {Array.from({ length: 100 }).map((_, i) => {
      const k = clamp((t - i * 0.45) / 4);
      return k > 0 ? <g key={i} opacity={k}><Elephant x={300 + (i % 20) * 68} y={340 + Math.floor(i / 20) * 125} s={0.95} c={i % 7 === 0 ? SCH.live : SCH.line} /></g> : null;
    })}
  </g>
);

export const D8: React.FC<ShotProps> = ({ t }) => {
  const spread = clamp(t / 140);
  return (
    <g>
      <Schematic t={t} id="d8" />
      <SchHead text="കോടിക്കണക്കിന് കുഞ്ഞു തുള്ളികൾ" t={t} />
      <path d={cloudPath} fill="none" stroke={SCH.dim} strokeWidth={4} strokeDasharray="10 10" opacity={1 - spread * 0.7} />
      {Array.from({ length: 260 }).map((_, i) => {
        const a = rnd(5, i) * Math.PI * 2;
        const r = rnd(6, i) * 230;
        const x = 950 + Math.cos(a) * r * (1 + spread * 2.6);
        const y = 590 + Math.sin(a) * r * 0.5 * (1 + spread * 1.4);
        return <circle key={i} cx={x} cy={y} r={3} fill={SCH.line} opacity={0.8} />;
      })}
      <Big x={960} y={960} text="വായുവിൽ പരന്നു കിടക്കുന്നു" size={56} color={SCH.dim} t={t - 60} />
      <Real x={1520} y={300} t={t - s30(134.16 - 127.2)} />
    </g>
  );
};

export const D9: React.FC<ShotProps> = ({ t, len }) => {
  const later = s30(141.43 - 135.7);
  const sp = stand(KITCHEN, 0.36, 0.4);
  const pp = stand(KITCHEN, 0.64, 0.4);
  const ss = sp.scale * 0.7;
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.3], [len, 1.45]]))}>
      <Kitchen t={t} id="d9" />
      <Fig look={SIS} pose={{ x: sp.x, y: sp.y + LEG_LEN * (sp.scale - ss), scale: ss, yaw: 0.5, look: 0.7, headTilt: 8, armL: { a: 40, b: 60 }, armR: { a: 40, b: 60 }, ...faceAt(t, [[0, 'happy'], [s30(143.0 - 135.7), 'worried']]) }} />
      <Fig look={PIP} pose={{ ...pp, yaw: -0.4, look: -0.6, armL: { a: t > later ? 50 : 10, b: t > later ? -70 : -8 }, armR: { a: t > later ? 50 : 10, b: t > later ? -70 : -8 }, headTilt: t > later ? -6 : 0, ...faceAt(t, [[0, 'neutral'], [later, 'smug']]) }} />
      <KitchenIsland />
    </g>
  );
};

export const D10: React.FC<ShotProps> = ({ t }) => {
  const sp = stand(KITCHEN, 0.36, 0.4);
  const ss = sp.scale * 0.7;
  const p = { x: sp.x, y: sp.y + LEG_LEN * (sp.scale - ss), scale: ss, yaw: t > 60 ? -0.4 : 0.2, look: t > 60 ? -0.8 : 0.3, headTilt: t > 60 ? -8 : 6, ...faceAt(t, [[0, 'worried'], [60, 'smug']]) };
  const h = headAt(p);
  return (
    <g transform={camT(sp.x, h.y + 60, 3.0)}>
      <Kitchen t={t + 100} id="d10" />
      <Fig look={SIS} pose={p} />
      <KitchenIsland />
      {t > 66 ? <FloatLabel x={h.x + 70} y={h.y + 10} t={t - 66} text="ശ്ശ്..." size={44} color="#F6EFE3" /> : null}
    </g>
  );
};

// ============================================================ E. THE TURN
export const E1: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / len);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.12]]))}>
      <Sky id="e1a" mode="dusk" />
      <g opacity={k}><Sky id="e1b" mode="storm" /></g>
      <CloudRow t={t * 3} y={300} n={6} tone="storm" speed={-2} s={1.4} o={0.4 + k * 0.6} />
      <Fig look={PIP} pose={hoverPose(960, 600, t, 0.5, { ...faceAt(t, [[0, 'neutral'], [40, 'worried']]) })} rimId="rimRed" />
      <Glow x={960} y={540} r={700} kind="red" o={0.25 * k} />
    </g>
  );
};

const Tears: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <g>
    {Array.from({ length: 6 }).map((_, i) => {
      const k = ((t * 1.5 + i * 10) % 60) / 60;
      return <ellipse key={i} cx={x - k * 260} cy={y + k * 40 + Math.sin(i) * 10} rx={9} ry={6} fill="#8FD0FF" opacity={0.9 * (1 - k)} />;
    })}
  </g>
);

export const E2: React.FC<ShotProps> = ({ t, len }) => {
  const p = flyPose(kf(t, [[0, 880], [len, 1020]]), 540, t, 1, 1, { headTilt: -6, ...faceAt(t, [[0, 'happy'], [s30(153.5 - 149.9), 'worried'], [s30(155.7 - 149.9), 'oops']]) });
  const h = headAt(p);
  return (
    <g transform={camT(960, 520, 1.5)}>
      <Sky id="e2" mode="day" />
      <CloudRow t={t} y={300} n={6} tone="day" speed={-28} s={0.8} />
      <CloudRow t={t + 30} y={850} n={6} tone="day" speed={-40} s={1.2} />
      <SpeedLines t={t} o={0.6} speed={90} />
      <Fig look={PIP} pose={p} />
      {t > s30(155.7 - 149.9) ? <Tears x={h.x + 10} y={h.y} t={t} /> : null}
      <g transform="translate(960 150) scale(0.67)">
        <CountUp x={0} y={0} t={t - 6} to={100} dur={30} size={110} color="#FFE27A" suffix=" km/h" />
      </g>
    </g>
  );
};

export const E3: React.FC<ShotProps> = ({ t, len }) => {
  const hit = 14;
  const jolt = t > hit ? Math.exp(-(t - hit) / 6) * 14 : 0;
  const p = flyPose(960, 560, t, 1, 1, { headTilt: -jolt, ...faceAt(t, [[0, 'oops'], [hit, 'dizzy']]) });
  const h = headAt(p);
  const bx = kf(t, [[0, h.x + 700], [hit, h.x + 40]], easeIn);
  const by = kf(t, [[0, h.y - 120], [hit, h.y - 30]]);
  return (
    <g transform={camT(h.x, h.y + 40, 2.6)}>
      <Sky id="e3" mode="day" />
      <CloudRow t={t} y={500} n={6} tone="day" speed={-30} s={0.8} />
      <SpeedLines t={t} o={0.5} speed={90} />
      <Fig look={PIP} pose={p} />
      {/* the beetle: in, smack, then tumbling away */}
      <g transform={`translate(${t < hit ? bx : h.x + 40 - (t - hit) * 30} ${t < hit ? by : h.y - 30 + (t - hit) * 12}) rotate(${t < hit ? 0 : (t - hit) * 40})`}>
        <ellipse rx={16} ry={11} fill="#2A3A20" stroke="#0A0A0A" strokeWidth={3} />
        <path d="M -6 -10 L -12 -20 M 6 -10 L 12 -20 M -10 8 L -18 16 M 10 8 L 18 16" stroke="#0A0A0A" strokeWidth={3} />
      </g>
      {t > hit ? <g transform={`translate(${h.x} ${h.y - 60}) scale(0.5) translate(${-h.x} ${-h.y + 60})`}><DizzyStars x={h.x} y={h.y - 60} t={t - hit} /></g> : null}
      {t > hit && t < hit + 10 ? <FloatLabel x={h.x + 40} y={h.y - 60} t={t - hit} text="ടക്!" size={46} /> : null}
    </g>
  );
};

export const E4: React.FC<ShotProps> = ({ t }) => {
  const m = 0.5 - 0.5 * Math.cos(Math.max(0, t - 40) / 14); // the third lid sweeping across and back
  return (
    <g>
      <Schematic t={t} id="e4" />
      <SchHead text="പക്ഷിയുടെ കണ്ണ്" t={t} />
      <DrawOn d="M 560 560 Q 960 260 1360 560 Q 960 860 560 560 Z" t={t} dur={14} width={6} />
      <circle cx={960} cy={560} r={150} fill="none" stroke={SCH.line} strokeWidth={6} opacity={clamp((t - 10) / 6)} />
      <circle cx={960} cy={560} r={70} fill={SCH.line} opacity={clamp((t - 14) / 6)} />
      <circle cx={930} cy={530} r={20} fill={SCH.ground} opacity={clamp((t - 14) / 6)} />
      {t > 40 ? <path d={`M 560 560 Q 760 ${300} ${560 + m * 800} 560 Q 760 ${820} 560 560 Z`} fill="#7FD4FF" opacity={0.35} stroke="#7FD4FF" strokeWidth={4} /> : null}
      <SchLabel x={960} y={900} t={t - 46} text="മൂന്നാം കൺപോള: സുതാര്യം" size={56} color={SCH.live} />
      <Real x={1560} y={260} t={t - s30(169.79 - 161.7)} />
    </g>
  );
};

export const E5: React.FC<ShotProps> = ({ t }) => {
  const p = flyPose(960, 560, t, 1, 1, { ...faceAt(t, [[0, 'neutral'], [30, 'smug']]) });
  const h = headAt(p);
  return (
    <g transform={camT(h.x - 40, h.y + 50, 2.4)}>
      <Sky id="e5" mode="day" />
      <CloudRow t={t} y={500} n={6} tone="day" speed={-24} s={0.8} />
      <SpeedLines t={t} o={0.45} speed={80} />
      <Fig look={PIP} pose={p} />
      <Goggles pose={p} o={clamp(t / 6)} />
      <Sparkle x={h.x + 30} y={h.y - 40} t={t - 20} />
    </g>
  );
};

export const E6: React.FC<ShotProps> = ({ t, len }) => {
  const alt = Math.round(kf(t, [[0, 1000], [len, 3000]]) / 100) * 100;
  return (
    <g>
      <g transform={`translate(0 ${t * 6})`}>
        <Sky id="e6" mode="dusk" y0={-900} y1={1080} />
        <CloudRow t={t} y={-200} n={5} tone="dusk" speed={-0.4} s={0.9} />
        <CloudRow t={t + 50} y={700} n={5} tone="dusk" speed={-0.3} s={1.3} />
      </g>
      <Fig look={PIP} pose={risePose(960, 560, t, 0.8, { ...faceAt(t, [[0, 'happy'], [s30(178.0 - 174.9), 'neutral']]) })} />
      <SpeedLines t={t} vertical o={0.25} n={12} speed={-40} />
      <Tag x={1600} y={120} t={2} text={`${alt} m`} w={300} />
    </g>
  );
};

export const E7: React.FC<ShotProps> = ({ t }) => {
  const rows = [
    { y: 860, h: '0 m', c: '30°C', at: s30(185.06 - 179.3) },
    { y: 560, h: '3000 m', c: '10°C', at: s30(187.15 - 179.3) },
    { y: 360, h: '5000 m', c: '< 0°C', at: s30(189.35 - 179.3) },
  ];
  const temp = kf(t, [[rows[0].at, 30], [rows[1].at, 10], [rows[2].at, -3]]);
  return (
    <g>
      <Schematic t={t} id="e7" />
      <SchHead text="ഓരോ 1000 മീ. മുകളിലും: ≈ −6.5°C" t={t} />
      <DrawOn d="M 520 900 L 520 260" t={t - 10} dur={16} width={6} />
      {rows.map((r, i) => (
        <g key={i} opacity={clamp((t - r.at) / 6)}>
          <line x1={500} y1={r.y} x2={1180} y2={r.y} stroke={SCH.dim} strokeWidth={3} strokeDasharray="12 10" />
          <text x={480} y={r.y + 16} textAnchor="end" fontFamily={FONT.ui} fontSize={44} fill={SCH.dim}>{r.h}</text>
          <text x={1000} y={r.y - 20} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={76} fill={i === 2 ? '#7FD4FF' : SCH.live}>{r.c}</text>
        </g>
      ))}
      {/* thermometer */}
      <g transform="translate(1450 300)">
        <rect x={-30} y={0} width={60} height={520} rx={30} fill="none" stroke={SCH.line} strokeWidth={6} />
        <circle cx={0} cy={560} r={56} fill={temp > 5 ? SCH.live : '#7FD4FF'} stroke={SCH.line} strokeWidth={6} />
        <rect x={-16} y={500 - (temp + 5) * 14} width={32} height={(temp + 5) * 14 + 40} fill={temp > 5 ? SCH.live : '#7FD4FF'} />
      </g>
      <g transform={`translate(0 ${kf(t, [[rows[0].at, 0], [rows[2].at, -500]])})`}>
        <Fig look={PIP} pose={risePose(700, 820, t, 0.3, { expr: 'neutral' })} />
      </g>
    </g>
  );
};

export const E8: React.FC<ShotProps> = ({ t }) => {
  const p = hoverPose(960 + shiver(t, 4), 560, t, 1, { armL: { a: 28, b: -118 }, armR: { a: 28, b: -118 }, ...faceAt(t, [[0, 'worried']]) });
  const h = headAt(p);
  return (
    <g transform={camT(960, 440, 2.2)}>
      <Sky id="e8" mode="high" />
      <CloudRow t={t} y={900} n={6} tone="day" speed={-0.4} s={1.2} o={0.6} />
      <Fig look={PIP} pose={p} rimId="rimBlue" />
      <Frost x={960} y={530} s={1.1} o={clamp(t / 20)} />
      <Breath x={h.x - 30} y={h.y + 26} t={t} />
    </g>
  );
};

const Lungs: React.FC<{ x: number; t: number; dots: number; label: string; c: string }> = ({ x, t, dots, label, c }) => (
  <g opacity={clamp(t / 8)}>
    <circle cx={x} cy={540} r={190} fill="none" stroke={SCH.line} strokeWidth={6} />
    {Array.from({ length: dots }).map((_, i) => (
      <g key={i}>
        <circle cx={x - 90 + i * 90} cy={540 + Math.sin(t / 8 + i) * 10} r={38} fill={c} opacity={0.85} />
        <text x={x - 90 + i * 90} y={554 + Math.sin(t / 8 + i) * 10} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill={SCH.ground}>O₂</text>
      </g>
    ))}
    <text x={x} y={820} textAnchor="middle" fontFamily={FONT.ui} fontSize={46} fill={SCH.dim}>{label}</text>
  </g>
);

export const E9: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="e9" />
    <SchHead text="ഓരോ ശ്വാസത്തിലും ഓക്സിജൻ" t={t} />
    <Lungs x={620} t={t} dots={3} label="താഴെ" c={SCH.line} />
    <Lungs x={1300} t={t - s30(197.13 - 194.6)} dots={1} label="8000 m" c={SCH.live} />
    {t > s30(201.585 - 194.6) ? <Big x={1300} y={300} text="1/3" size={140} color={SCH.live} t={t - s30(201.585 - 194.6)} /> : null}
  </g>
);

export const E10: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="e10" />
    <SchHead text="എവറസ്റ്റ്" t={t} />
    <DrawOn d="M 260 920 L 640 560 L 760 640 L 980 260 L 1120 420 L 1240 360 L 1660 920" t={t} dur={18} width={6} />
    <rect x={200} y={250} width={1520} height={130} fill={SCH.live} opacity={0.18 * clamp((t - 20) / 8)} />
    <line x1={200} y1={380} x2={1720} y2={380} stroke={SCH.live} strokeWidth={4} strokeDasharray="14 10" opacity={clamp((t - 20) / 8)} />
    <SchLabel x={1480} y={340} t={t - 26} text="മരണ മേഖല" size={60} color={SCH.live} />
    <SchLabel x={1480} y={430} t={t - 30} text="8000 m+" size={40} color={SCH.dim} />
    <Real x={560} y={560} t={t - s30(207.04 - 203.3)} />
  </g>
);

export const E11: React.FC<ShotProps> = ({ t, len }) => {
  const blue = s30(217.84 - 208.6);
  const p = risePose(960, 560 + Math.sin(t / 9) * 20, t, 0.9, { headTilt: Math.sin(t / 14) * 10, ...faceAt(t, [[0, 'neutral'], [s30(212.33 - 208.6), 'happy'], [blue, 'dizzy']]), glint: 0 });
  return (
    <g transform={camT(960, 470, kf(t, [[0, 1.4], [len, 2.0]]))}>
      <Sky id="e11" mode="high" />
      <Stars seed={9} x0={-200} y0={-200} w={2400} h={800} t={t} n={40} o={0.5} />
      <CloudRow t={t} y={1000} n={6} tone="day" speed={-0.3} s={1.4} o={0.5} />
      <Fig look={PIP} pose={p} rimId="rimBlue" />
      <BlueHands pose={p} o={clamp((t - blue + 10) / 20)} />
      <Tunnel id="e11" x={960} y={470} r={kf(t, [[0, 1400], [len, 650]])} o={0.7} />
    </g>
  );
};

export const E12: React.FC<ShotProps> = ({ t }) => {
  const k = clamp((t - s30(221.5 - 219.7)) / 90);
  return (
    <g>
      <Schematic t={t} id="e12" />
      <SchHead text="10.5 കി.മീ. ഉയരത്തിൽ, ഓക്സിജൻ ഇല്ലെങ്കിൽ" t={t} />
      <g transform="translate(960 560) scale(2.4) translate(-960 -560)">
        <Dial x={960} y={560} p={1 - k * 0.5} readout={k < 0.99 ? `0:${String(Math.round(60 - k * 30)).padStart(2, '0')}` : '0:30'} r={100} size={44} />
      </g>
      <Big x={960} y={960} text="അര മിനിറ്റ് – ഒരു മിനിറ്റ്" size={66} color={SCH.live} t={t - s30(223.4 - 219.7)} />
    </g>
  );
};

export const E13: React.FC<ShotProps> = ({ t, len }) => {
  const fall = kf(t, [[s30(228.5 - 226.2), 0], [len, 700]], easeIn);
  const p = { ...hoverPose(960, 480 + fall, t, 0.9), spin: kf(t, [[s30(228.5 - 226.2), 0], [len, 140]], easeIn), armL: { a: 120, b: 30 }, armR: { a: 130, b: 20 }, ...faceAt(t, [[0, 'dizzy']]), blink: t > 50 ? 1 : 0 };
  return (
    <g transform={camT(960, 420 + fall, 1.5)}>
      <Sky id="e13" mode="night" stars={60} t={t} y0={-200} />
      <CloudRow t={t} y={1300} n={6} tone="night" speed={-0.3} s={1.4} />
      <Fig look={PIP} pose={p} rimId="rimBlue" />
      <Tunnel id="e13" x={960} y={400 + fall} r={kf(t, [[0, 700], [len, 120]])} />
    </g>
  );
};

export const E14: React.FC<ShotProps> = ({ t, len }) => {
  const dodge = s30(234.28 - 230.4);
  const s = 0.05 * Math.pow(22, clamp(t / (dodge + 30)));
  const px = kf(t, [[dodge - 6, 900], [dodge + 12, 1500]], easeOut);
  const py = kf(t, [[0, 640], [dodge - 6, 600], [dodge + 12, 240]], easeOut);
  const p = { ...hoverPose(px, py, t, 0.8), spin: kf(t, [[dodge - 6, 0], [dodge + 12, -40]]), armL: { a: 120, b: 20 }, armR: { a: 150, b: 10 }, ...faceAt(t, [[0, 'dizzy'], [s30(231.5 - 230.4), 'shock']]) };
  return (
    <g>
      <Sky id="e14" mode="night" stars={50} t={t} />
      <CloudRow t={t} y={980} n={6} tone="night" speed={-1} s={1.3} />
      <Glow x={900} y={520} r={300 + s * 500} kind="warm" o={0.2 + s * 0.3} />
      <PlaneFront x={kf(t, [[0, 900], [len, 760]])} y={540} s={Math.min(s, 1.6)} t={t} bank={kf(t, [[0, 0], [len, -8]])} />
      <Fig look={PIP} pose={p} rimId="rimR" />
    </g>
  );
};

export const E15: React.FC<ShotProps> = ({ t, len }) => {
  const py = kf(t, [[0, 300], [len, 640]]);
  const px = kf(t, [[0, 1500], [len, 500]]);
  const p = { ...hoverPose(px, py, t, 0.8), spin: t * 24, armL: { a: 150, b: 30 }, armR: { a: 90, b: -40 }, legL: { a: 40, b: 30 }, legR: { a: -30, b: 40 }, ...faceAt(t, [[0, 'dizzy']]) };
  return (
    <g>
      <Sky id="e15" mode="night" stars={50} t={t} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={px} cy={py - 80} r={120 + i * 70 + (t % 20) * 4} fill="none" stroke="#BFEFFF" strokeWidth={4} strokeDasharray="40 60" opacity={0.35} transform={`rotate(${t * 18 + i * 40} ${px} ${py - 80})`} />
      ))}
      <g opacity={1 - clamp(t / len)}>
        <circle cx={kf(t, [[0, 400], [len, 100]])} cy={200} r={6} fill="#FF4040" />
        <circle cx={kf(t, [[0, 480], [len, 160]])} cy={200} r={6} fill="#40FF80" />
      </g>
      <Fig look={PIP} pose={p} rimId="rimBlue" />
    </g>
  );
};

// ============================================================ F. BIRD STRIKE, HOME, HUNGER
const planeSide = 'M 380 600 L 1360 600 Q 1460 600 1500 560 Q 1460 520 1360 520 L 520 520 L 420 400 L 370 400 L 400 520 Q 360 540 380 600 Z';

export const F1: React.FC<ShotProps> = ({ t }) => {
  const stop = s30(247.61 - 240.7);
  return (
    <g>
      <Schematic t={t} id="f1" />
      <SchHead text="2009 · ന്യൂയോർക്ക്" t={t} />
      <DrawOn d={planeSide} t={t} dur={20} width={6} />
      <DrawOn d="M 840 560 L 760 760 L 900 760 L 980 560" t={t - 10} dur={12} width={5} />
      {[700, 1100].map((ex, i) => (
        <g key={i} opacity={clamp((t - 20) / 6)}>
          <ellipse cx={ex} cy={660} rx={70} ry={34} fill="none" stroke={t > stop ? '#FF6A5A' : SCH.line} strokeWidth={6} />
          {t > stop ? <path d={`M ${ex - 30} 630 L ${ex + 30} 690 M ${ex + 30} 630 L ${ex - 30} 690`} stroke="#FF6A5A" strokeWidth={9} strokeLinecap="round" /> : null}
        </g>
      ))}
      {Array.from({ length: 7 }).map((_, i) => {
        const go = 60 + i * 8;
        const k = clamp((t - go) / 40);
        if (t < go || k >= 1) return null;
        return <Goose key={i} x={1800 - k * (1100 - (i % 2) * 400)} y={440 + (i % 4) * 70 + k * 160} s={0.9} flip />;
      })}
      <Big x={960} y={940} text="രണ്ട് എഞ്ചിനും നിന്നു" size={64} color="#FF6A5A" t={t - stop} />
    </g>
  );
};

export const F2: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="f2" />
    <SchHead text="ഹഡ്സൺ നദി" t={t} />
    <g transform={`translate(0 ${kf(t, [[0, -200], [50, 80]], easeOut)}) rotate(${kf(t, [[0, 8], [50, 0]])} 960 560)`}>
      <path d={planeSide} fill="none" stroke={SCH.line} strokeWidth={6} />
    </g>
    <DrawOn d="M 160 700 Q 360 680 560 700 T 960 700 T 1360 700 T 1760 700" t={t - 30} dur={16} color="#7FD4FF" width={6} />
    <CountUp x={960} y={920} t={t - s30(252.85 - 249.5)} to={155} dur={24} size={120} color={SCH.live} suffix=" പേരും രക്ഷപ്പെട്ടു" />
    <Real x={1550} y={280} t={t - s30(255.58 - 249.5)} />
  </g>
);

export const F3: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="f3" />
    <SchHead text="ഭാരം" t={t} />
    <g opacity={clamp(t / 6)}>
      <Goose x={560} y={600} s={2.2} />
      <SchLabel x={560} y={820} t={t} text="4–5 കി.ഗ്രാം" size={60} />
    </g>
    <g opacity={clamp((t - s30(259.62 - 257.2)) / 6)}>
      <Fig look={PIP} pose={{ x: 1340, y: 640, scale: 1.15, ...faceAt(t, [[0, 'oops']]) }} />
      <SchLabel x={1340} y={900} t={t - s30(259.62 - 257.2)} text="40 കി.ഗ്രാം" size={70} color={SCH.live} />
    </g>
  </g>
);

export const F4: React.FC<ShotProps> = ({ t, len }) => {
  const p = flyPose(kf(t, [[0, 400], [len, 1500]]), 470 + shiver(t, 5), t, 0.7, 1, { ...faceAt(t, [[0, 'tired']]) });
  const h = headAt(p);
  return (
    <g>
      <Sky id="f4" mode="dusk" y1={760} />
      {Array.from({ length: 12 }).map((_, i) => <Palm key={i} x={((i * 220 - t * 4) % 2600) - 200} y={1000} s={0.55} t={t} lean={(rnd(4, i) - 0.5) * 140} dark />)}
      <Grass y={1000} night />
      <Fig look={PIP} pose={p} rimId="rimR" />
      <Breath x={h.x + 40} y={h.y + 20} t={t} dir={-1} />
    </g>
  );
};

const DosaStack: React.FC<{ x: number; y: number; n: number }> = ({ x, y, n }) => (
  <g>
    <Plate x={x} y={y} s={1.1} />
    {Array.from({ length: n }).map((_, i) => (
      <path key={i} d={`M ${x - 90} ${y - 8 - i * 9} Q ${x} ${y - 30 - i * 9} ${x + 90} ${y - 8 - i * 9} Q ${x} ${y + 2 - i * 9} ${x - 90} ${y - 8 - i * 9} Z`} fill={i % 2 ? '#D9A24A' : '#E6B45A'} stroke="#7A4E22" strokeWidth={3} />
    ))}
  </g>
);

export const F5: React.FC<ShotProps> = ({ t, len }) => {
  const ask = s30(271.19 - 266.8);
  const pp = stand(KITCHEN, 0.45, 0.4);
  const mp = stand(KITCHEN, 0.74, 0.4);
  const eaten = Math.min(12, Math.floor(t / 14));
  const top = islandTop(0.45, 0.2);
  const chew = Math.sin(t / 2) > 0;
  return (
    <g transform={camT(1000, 560, kf(t, [[0, 1.35], [len, 1.5]]))}>
      <Kitchen t={t + 300} id="f5" />
      <Fig look={PIP} pose={{ ...pp, yaw: 0.2, headTilt: chew ? 4 : -2, armR: { a: 60, b: -80 }, armL: { a: 30, b: -40 }, ...faceAt(t, [[0, 'happy'], [ask, 'oops']]) }} />
      <Fig look={MOM} pose={{ ...mp, yaw: -0.5, look: -0.8, armL: { a: 30, b: -100 }, armR: { a: 30, b: -100 }, ...faceAt(t, [[0, 'shock'], [ask, 'worried']]) }} />
      <KitchenIsland />
      <DosaStack x={top.x + 140} y={top.y} n={Math.max(1, 12 - eaten)} />
      <FloatLabel x={pp.x} y={pp.y - 260} t={(t % 14)} text={`${eaten}`} size={60} />
    </g>
  );
};

export const F6: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="f6" />
    <SchHead text="ഹമ്മിങ് ബേർഡ്" t={t} />
    <g opacity={clamp(t / 8)}><Hummingbird x={620} y={560} s={1.6} t={t} /></g>
    <Heart x={1300} y={500} s={2.2} t={t * 4} rate={2} />
    <CountUp x={1300} y={800} t={t - s30(278.27 - 274.4)} to={1200} dur={30} size={100} color={SCH.live} />
    <SchLabel x={1300} y={880} t={t - s30(279.0 - 274.4)} text="മിനിറ്റിൽ ഹൃദയമിടിപ്പ്" size={44} color={SCH.dim} />
  </g>
);

export const F7: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="f7" />
    <SchHead text="ദിവസവും" t={t} />
    <g opacity={clamp(t / 6)}><Hummingbird x={620} y={520} s={1.2} t={t} /></g>
    <SchLabel x={620} y={820} t={t} text="ശരീരഭാരം" size={50} />
    {Array.from({ length: 10 }).map((_, i) => {
      const k = clamp((t - 20 - i * 4) / 5);
      const r = i < 4 ? 0 : i < 7 ? 1 : i < 9 ? 2 : 3;
      const c = i < 4 ? i : i < 7 ? i - 4 : i < 9 ? i - 7 : 0;
      return k > 0 ? <rect key={i} x={1180 + c * 90 + r * 45} y={700 - r * 90 - (1 - k) * 60} width={80} height={80} rx={8} fill="#F6EFE3" stroke={SCH.dim} strokeWidth={4} opacity={k} /> : null;
    })}
    <SchLabel x={1340} y={820} t={t - 50} text="≈ പകുതി പഞ്ചസാര" size={50} color={SCH.live} />
  </g>
);

// ============================================================ G. THE NEWS, THE SUIT
const radarMini = (t: number) => (
  <g>
    <rect x={0} y={0} width={760} height={340} fill="#06140C" />
    <Radar x={380} y={170} r={140} t={t} blips={[{ x: 50, y: -40, c: '#FFB15A' }]} id="tvr" />
    <text x={20} y={40} fontFamily={FONT.ui} fontSize={26} fill="#7CFFB0">COK RADAR</text>
  </g>
);

export const G1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.5]]))}>
    <Study t={t} id="g1" veil={0.5} />
    <TV x={580} y={300} s={1} id="g1">
      {radarMini(t)}
      <NewsBar t={t} text="കൊച്ചി വിമാനത്താവളം: റഡാറിൽ അജ്ഞാത വസ്തു · ഒരു വിമാനം വഴി മാറ്റി" />
    </TV>
    <Glow x={960} y={520} r={600} kind="cool" o={0.25} />
  </g>
);

export const G2: React.FC<ShotProps> = ({ t, len }) => {
  const z = kf(t, [[0, 1], [len, 2.4]]);
  return (
    <g>
      <g transform={`translate(1180 420) scale(${z}) translate(-1180 -420)`}>
        <Sky id="g2" mode="day" />
        <CloudRow t={t * 6} y={500} n={6} tone="day" speed={-3} s={1.2} />
        <CloudRow t={t * 4 + 100} y={850} n={6} tone="day" speed={-2} s={1.6} />
        <g transform="translate(1180 420)">
          <Fig look={PIP} pose={flyPose(0, 0, t, 0.18, 1, { expr: 'neutral' })} />
          <Goggles pose={flyPose(0, 0, t, 0.18, 1)} />
        </g>
      </g>
      {/* phone video frame + airplane window */}
      <path d="M -10 -10 L 1930 -10 L 1930 1090 L -10 1090 Z M 300 140 Q 300 60 400 60 L 1520 60 Q 1620 60 1620 140 L 1620 940 Q 1620 1020 1520 1020 L 400 1020 Q 300 1020 300 940 Z" fill="#1A1C22" fillRule="evenodd" />
      <circle cx={380} cy={130} r={14} fill="#FF3B3B" opacity={Math.floor(t / 15) % 2 ? 1 : 0.3} />
      <text x={410} y={142} fontFamily={FONT.ui} fontSize={34} fill="#FFFFFF">REC</text>
      <text x={1560} y={1000} textAnchor="end" fontFamily={FONT.ui} fontSize={30} fill="#FFFFFF" opacity={0.7}>യാത്രക്കാരന്റെ വീഡിയോ</text>
    </g>
  );
};

export const G3: React.FC<ShotProps> = ({ t, len }) => {
  const say = s30(299.98 - 298.5);
  return (
    <g transform={camT(1000, 560, kf(t, [[0, 1.5], [len, 1.65]]))}>
      <Study t={t + 200} id="g3" veil={0.5} />
      <Glow x={700} y={560} r={500} kind="cool" o={0.35} />
      <Fig look={PIP} pose={{ x: 900, y: 712, scale: 1, yaw: -0.4, look: -0.5, ...faceAt(t, [[0, 'neutral'], [say + 10, 'oops']]) }} rimId="rimBlueL" />
      <Fig look={MO} pose={{ x: 1180, y: 712, scale: 1, yaw: t > 20 ? -0.6 : -0.9, look: -0.9, armR: { a: t > say ? 100 : 10, b: t > say ? 0 : -8 }, handR: 'point', ...faceAt(t, [[0, 'neutral'], [16, 'smug']]) }} rimId="rimBlueL" />
    </g>
  );
};

const Front: React.FC<{ t: number; id: string; night?: boolean; door?: number }> = ({ t, id, night = false, door = 0 }) => (
  <g>
    <Sky id={id} mode={night ? 'storm' : 'noon'} />
    {night ? null : <CloudRow t={t} y={140} n={4} tone="day" speed={-0.2} s={0.5} />}
    <Palm x={140} y={800} s={0.9} t={t} lean={-60} dark={night} />
    <Palm x={1820} y={800} s={0.8} t={t} lean={50} dark={night} />
    <KHouse x={760} y={800} s={0.8} night={night} lit={night ? 1 : 0} door={door} />
    <Grass y={800} night={night} />
    <rect x={-3000} y={860} width={8000} height={260} fill={night ? '#1E1E26' : '#6A6A70'} />
  </g>
);

export const G4: React.FC<ShotProps> = ({ t, len }) => {
  const carX = kf(t, [[0, 2400], [50, 1450]], easeOut);
  return (
    <g transform={camT(1000, 560, kf(t, [[0, 0.95], [len, 1.02]]))}>
      <Front t={t} id="g4" door={0} />
      <BlackCar x={carX} y={960} s={0.9} t={t} />
      {t > 54 ? <Fig look={SUIT} pose={{ x: kf(t, [[54, 1250], [len, 1000]]), y: feet(860, 0.85), scale: 0.85, yaw: -0.8, facing: -1, legL: { a: 20 * Math.sin(t / 3), b: -10 }, legR: { a: -20 * Math.sin(t / 3), b: -10 }, expr: 'neutral' }} shadow={0.6} /> : null}
    </g>
  );
};

export const G5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 940]]), 520, 1.9)}>
    <Front t={t + 100} id="g5" door={1} />
    <Fig look={PIP} pose={{ x: 760, y: feet(800, 0.8), scale: 0.8, yaw: 0.5, look: 0.6, ...faceAt(t, [[0, 'worried']]) }} />
    <Fig look={SUIT} pose={{ x: 1040, y: feet(860, 0.9), scale: 0.9, yaw: -0.5, look: -0.7, armR: { a: t > 120 ? 70 : 12, b: t > 120 ? -30 : -6 }, ...faceAt(t, [[0, 'smug'], [s30(310.98 - 305.4), 'happy']]) }} shadow={0.6} />
  </g>
);

export const G6: React.FC<ShotProps> = ({ t, len }) => {
  const glance = s30(315.79 - 312.9);
  return (
    <g transform={camT(kf(t, [[0, 860], [len, 830]]), 520, 1.9)}>
      <Front t={t + 300} id="g6" door={1} />
      <Fig look={SIS} pose={{ x: 640, y: feet(800, 0.56), scale: 0.56, yaw: 0.4, look: 0.6, ...faceAt(t, [[0, 'worried']]) }} />
      <Fig look={PIP} pose={{ x: 760, y: feet(800, 0.8), scale: 0.8, yaw: 0.5, look: 0.6, armL: { a: 40, b: -20 }, ...faceAt(t, [[0, 'worried'], [s30(314.09 - 312.9), 'shock']]) }} />
      <Fig look={SUIT} pose={{ x: 1040, y: feet(860, 0.9), scale: 0.9, yaw: -0.5, look: t > glance ? -1 : -0.6, headTilt: t > glance ? 6 : 0, ...faceAt(t, [[0, 'neutral'], [glance, 'smug']]) }} shadow={0.6} />
    </g>
  );
};

export const G7: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1040, kf(t, [[0, 600], [len, 590]]), kf(t, [[0, 3.0], [len, 3.4]]))}>
    <Front t={t + 500} id="g7" door={1} />
    <Fig look={SUIT} pose={{ x: 1040, y: feet(860, 0.9), scale: 0.9, yaw: -0.3, look: -0.4, ...faceAt(t, [[0, 'smug'], [40, 'cool']]) }} rimId="rimRed" />
    <Glow x={1040} y={600} r={300} kind="red" o={0.18} />
  </g>
);

// ============================================================ H. THE FLOOD
const Storm: React.FC<{ t: number; id: string; level: number; bolt?: number; rough?: number }> = ({ t, id, level, bolt, rough = 0.6 }) => (
  <g>
    <Sky id={id} mode="storm" />
    <CloudRow t={t} y={120} n={7} tone="storm" speed={-1.6} s={1.3} />
    {bolt !== undefined ? <Bolt x={1300} y={-50} t={t} t0={bolt} h={720} /> : null}
    {Array.from({ length: 7 }).map((_, i) => <Palm key={i} x={-100 + i * 340} y={level + 40} s={0.5 + rnd(3, i) * 0.2} t={t * 3} lean={(rnd(5, i) - 0.3) * 160} dark />)}
    <Water t={t} y={level} night muddy rough={rough} />
  </g>
);

export const H1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.08]]))}>
    <Storm t={t} id="h1" level={kf(t, [[0, 760], [len, 700]])} bolt={30} />
    <Rain t={t} o={0.6} />
    <Whiteout t={t} t0={30} len={8} o={0.4} />
  </g>
);

const Torch: React.FC<{ x: number; y: number; t: number; a?: number }> = ({ x, y, t, a = -30 }) => (
  <g transform={`translate(${x} ${y}) rotate(${a + Math.sin(t / 7) * 10})`}>
    <path d="M 0 0 L 700 -110 L 700 110 Z" fill="#FFF2B0" opacity={0.18} />
    <circle r={10} fill="#FFF8D8" />
    <Glow x={0} y={0} r={80} kind="warm" o={0.8} />
  </g>
);

const Roof: React.FC<{ t: number; id: string; level: number; sis?: Partial<Pose>; torch?: boolean; bolt?: number }> = ({ t, id, level, sis, torch = true, bolt }) => {
  const roofY = 900 - 436 * 0.8;
  const sp = { x: 960, y: feet(roofY, 0.56), scale: 0.56, ...sis };
  const hand = handAt(sp, 'R');
  return (
    <g>
      <Storm t={t} id={id} level={level} bolt={bolt} />
      <FlatBuilding x={960} y={900} s={0.8} />
      <Water t={t + 7} y={level + 6} night muddy rough={0.8} />
      <Fig look={SIS} pose={sp} rimId="rimBlue" />
      {torch ? <Torch x={hand.x} y={hand.y} t={t} /> : null}
    </g>
  );
};

export const H2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.3], [len, 1.5]]))}>
    <Roof t={t} id="h2" level={kf(t, [[0, 820], [len, 700]])} sis={{ yaw: 0.2, armR: { a: 70, b: -20 }, ...faceAt(t, [[0, 'worried']]) }} />
    <Rain t={t} o={0.6} />
  </g>
);

export const H3: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 600, 1.3)}>
    <Storm t={t + 50} id="h3" level={760} rough={1} />
    <Boat x={960} y={800} s={1.1} t={t * 1.6} tossing={1} />
    <Rain t={t} o={0.65} slant={0.4} />
    <Tag x={960} y={240} t={t - 8} text="ബോട്ട്" mark="x" w={220} />
  </g>
);

export const H4: React.FC<ShotProps> = ({ t, len }) => {
  const p = { x: 1120, y: 700, scale: 1, yaw: 0.5, look: 0.9, ...faceAt(t, [[0, 'worried'], [s30(340.72 - 336.2), 'tired']]) };
  return (
    <g transform={camT(kf(t, [[0, 1150], [len, 1130]]), 470, kf(t, [[0, 2.0], [len, 2.3]]))}>
      <Bedroom t={t} id="h4" lamp={0.6} />
      <g>
        <rect x={WINDOW.x0} y={WINDOW.y0} width={WINDOW.x1 - WINDOW.x0} height={WINDOW.y1 - WINDOW.y0} fill="#06070E" opacity={0.6} />
        {Array.from({ length: 30 }).map((_, i) => {
          const x = WINDOW.x0 + rnd(4, i) * (WINDOW.x1 - WINDOW.x0);
          const y = WINDOW.y0 + ((rnd(5, i) * 220 + t * (3 + rnd(6, i) * 3)) % 226);
          return <line key={i} x1={x} y1={y} x2={x - 2} y2={y + 16} stroke="#9FB6D8" strokeWidth={2} opacity={0.7} />;
        })}
        <Whiteout t={t % 90} t0={60} len={6} o={0.25} />
      </g>
      <Fig look={PIP} pose={p} rimId="rimBlue" />
    </g>
  );
};

export const H5: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="h5" />
    <SchHead text="മിന്നൽ vs സൂര്യന്റെ പുറംഭാഗം" t={t} />
    <circle cx={620} cy={560} r={170} fill="none" stroke={SCH.glow} strokeWidth={6} opacity={clamp(t / 8)} />
    <SchLabel x={620} y={830} t={t} text="സൂര്യൻ" size={52} />
    <DrawOn d="M 1320 280 L 1240 500 L 1340 500 L 1260 760 L 1420 460 L 1320 460 L 1400 280 Z" t={t - 20} dur={14} color="#BFE4FF" width={7} />
    <SchLabel x={1320} y={830} t={t - 26} text="മിന്നൽ" size={52} color="#BFE4FF" />
    <Big x={960} y={600} text="5×" size={170} color={SCH.live} t={t - 50} />
    <Real x={960} y={970} t={t - s30(348.54 - 343.7)} />
  </g>
);

export const H6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <Sky id="h6" mode="storm" />
    <CloudRow t={t} y={760} n={7} tone="storm" speed={-1.2} s={1.6} />
    <Bolt x={780} y={240} t={t} t0={20} h={800} seed={4} />
    <Bolt x={1250} y={240} t={t} t0={78} h={800} seed={7} />
    <Fig look={PIP} pose={hoverPose(960, 220, t, 0.3, { expr: 'worried' })} rimId="rimBlue" />
    <Tag x={960} y={420} t={t - 30} text="നീ" w={160} />
    <Rain t={t} o={0.5} />
  </g>
);

export const H7: React.FC<ShotProps> = ({ t, len }) => {
  const take = s30(359.6 - 354.3);
  const up = s30(360.75 - 354.3);
  const mp = stand(KITCHEN, 0.34, 0.4);
  const pp = stand(KITCHEN, 0.62, 0.4);
  const lift = kf(t, [[up, 0], [len, -600]], easeIn);
  const pip: Partial<Pose> = t < up
    ? { ...pp, yaw: -0.4, look: -0.7, armR: { a: t > take ? 150 : 14, b: t > take ? 20 : -8 }, ...faceAt(t, [[0, 'worried'], [take, 'cool']]) }
    : risePose(pp.x, pp.y + lift, t, pp.scale, { ...faceAt(t - up, [[0, 'cool']]) });
  return (
    <g transform={camT(980, kf(t, [[0, 560], [up, 540], [len, 420]]), 1.4)}>
      <Kitchen t={t} id="h7" veil={0.62} />
      <rect x={-3000} y={-3000} width={8000} height={8000} fill="#0A1030" opacity={0.35} />
      <Fig look={MOM} pose={{ ...mp, yaw: 0.5, look: 0.8, ...faceAt(t, [[0, 'worried'], [up + 10, 'tired']]) }} rimId="rimBlue" />
      <Fig look={PIP} pose={pip} rimId="rimBlue" />
      {t > take + 6 ? <Goggles pose={pip} o={clamp((t - take - 6) / 6)} /> : null}
      {t < up ? <KitchenIsland /> : <g opacity={1}><KitchenIsland /></g>}
      <Gust x={pp.x} y={pp.y + LEG_LEN * pp.scale} t={t - up} s={0.7} />
      <Whiteout t={t % 120} t0={100} len={6} o={0.2} />
    </g>
  );
};

export const H8: React.FC<ShotProps> = ({ t }) => {
  const p = flyPose(900, 420, t, 0.8, 1, { ...faceAt(t, [[0, 'cool'], [s30(365.09 - 362.0), 'worried']]) });
  return (
    <g>
      <Sky id="h8" mode="storm" />
      <CloudRow t={t} y={100} n={7} tone="storm" speed={-3} s={1.3} />
      <Water t={t} y={860} night muddy rough={0.7} />
      {Array.from({ length: 9 }).map((_, i) => <Palm key={i} x={((i * 300 - t * 22) % 2700 + 2700) % 2700 - 300} y={1150} s={0.9} t={t * 3} lean={(rnd(7, i) - 0.5) * 140} dark />)}
      <Fig look={PIP} pose={p} rimId="rimBlue" />
      <Goggles pose={p} />
      <Rain t={t} o={0.75} slant={-0.6} n={180} />
      <SpeedLines t={t} o={0.25} speed={70} n={14} />
    </g>
  );
};

export const H9: React.FC<ShotProps> = ({ t }) => {
  const torch = t > s30(371.0 - 367.7);
  return (
    <g>
      <Sky id="h9" mode="storm" />
      <CloudRow t={t} y={160} n={7} tone="storm" speed={-1.2} s={1.3} />
      <Water t={t} y={760} night muddy rough={0.7} />
      {torch ? (
        <g>
          <circle cx={1500} cy={700} r={8} fill="#FFF8D8" opacity={0.6 + 0.4 * Math.sin(t / 3)} />
          <Glow x={1500} y={700} r={160} kind="warm" o={0.7} />
        </g>
      ) : null}
      <Fig look={PIP} pose={hoverPose(700, 480, t, 0.7, { yaw: 0.6, look: 0.9, ...faceAt(t, [[0, 'shock'], [s30(370.5 - 367.7), 'worried']]) })} rimId="rimBlue" />
      <Rain t={t} o={0.6} />
      <Bolt x={1100} y={-40} t={t} t0={2} h={800} />
      <Whiteout t={t} t0={2} len={36} o={1} />
    </g>
  );
};

export const H10: React.FC<ShotProps> = ({ t, len }) => {
  const roofY = 900 - 436 * 0.8;
  const see = s30(377.75 - 373.4);
  const px = kf(t, [[0, 1700], [len, 1150]], easeOut);
  const py = kf(t, [[0, 200], [len, roofY - 200]], easeOut);
  return (
    <g transform={camT(1050, 480, 1.25)}>
      <Roof t={t} id="h10" level={roofY + 10} sis={{ yaw: 0.4, look: 0.8, headTilt: -10, armR: { a: 60, b: -20 }, ...faceAt(t, [[0, 'worried'], [see, 'happy']]) }} />
      <Fig look={PIP} pose={hoverPose(px, py, t, 0.8, { yaw: -0.4, look: -0.7, armL: { a: 70, b: 0 }, ...faceAt(t, [[0, 'worried']]) })} rimId="rimBlue" />
      <Goggles pose={hoverPose(px, py, t, 0.8, { yaw: -0.4 })} />
      <Rain t={t} o={0.6} />
    </g>
  );
};

export const H11: React.FC<ShotProps> = ({ t }) => {
  const roofY = 900 - 436 * 0.8;
  const sp = { x: 960, y: feet(roofY, 0.56), scale: 0.56, yaw: 0.3, look: 0.6, headTilt: Math.sin(t / 10) * 4, ...faceAt(t, [[0, 'happy']]) };
  const h = headAt(sp);
  return (
    <g transform={camT(h.x + 20, h.y + 30, 3.4)}>
      <Roof t={t + 100} id="h11" level={roofY + 10} sis={sp} torch={false} />
      <Drops x={h.x - 14} y={h.y + 4} t={t} n={3} w={6} color="#9CD4FF" />
      <Drops x={h.x + 14} y={h.y + 4} t={t + 30} n={3} w={6} color="#9CD4FF" seed={6} />
      <Rain t={t} o={0.45} />
    </g>
  );
};

export const H12: React.FC<ShotProps> = ({ t, len }) => {
  const roofY = 900 - 436 * 0.8;
  const lift = kf(t, [[30, 0], [len, -420]], easeIn);
  const p = hoverPose(960 + shiver(t, t > 40 ? 3 : 0), feet(roofY, 0.8) - 10 + lift, t, 0.8, { yaw: 0.2, armL: { a: 40, b: -60 }, armR: { a: 40, b: -60 }, ...faceAt(t, [[0, 'worried'], [s30(389.8 - 385.7), 'tired']]) });
  const h = handAt(p, 'R');
  return (
    <g transform={camT(960, kf(t, [[0, 520], [len, 360]]), 1.5)}>
      <Storm t={t + 200} id="h12" level={kf(t, [[0, roofY + 10], [s30(391.9 - 385.7), roofY + 10], [len, roofY - 120]])} />
      <g transform={`translate(0 ${kf(t, [[s30(391.9 - 385.7), 0], [len, 120]])})`}>
        <FlatBuilding x={960} y={900} s={0.8} />
      </g>
      <Water t={t + 9} y={kf(t, [[0, roofY + 16], [s30(391.9 - 385.7), roofY + 16], [len, roofY - 110]])} night muddy rough={0.8} />
      <Fig look={PIP} pose={p} rimId="rimBlue" />
      <Fig look={SIS} pose={{ x: h.x + 40, y: h.y - 30, scale: 0.5, yaw: -0.3, armL: { a: 120, b: 40 }, armR: { a: 130, b: 30 }, legL: { a: 30, b: 40 }, legR: { a: -20, b: 50 }, ...faceAt(t, [[0, 'worried']]) }} rimId="rimBlue" />
      <Goggles pose={p} />
      <Rain t={t} o={0.6} />
    </g>
  );
};

// ============================================================ J. HOME, CAUGHT ON CAMERA
export const J1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(800, 560, kf(t, [[0, 1.5], [len, 1.7]]))}>
    <Front t={t} id="j1" night door={1} />
    <Fig look={PIP} pose={{ x: 700, y: feet(860, 0.8), scale: 0.8, yaw: 0.3, ...faceAt(t, [[0, 'tired']]) }} rimId="rimBlue" />
    <Fig look={SIS} pose={{ x: 800, y: feet(860, 0.56), scale: 0.56, yaw: 0, ...faceAt(t, [[0, 'happy']]) }} rimId="rimBlue" />
    <Fig look={MOM} pose={{ x: kf(t, [[0, 1100], [24, 900]], easeOut), y: feet(860, 0.85), scale: 0.85, yaw: -0.4, armL: { a: 80, b: 30 }, armR: { a: 80, b: 30 }, ...faceAt(t, [[0, 'worried'], [26, 'happy']]) }} rimId="rimBlue" />
    <Rain t={t} o={0.5} />
  </g>
);

export const J2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(900, 600, kf(t, [[0, 1.05], [len, 1.2]]))}>
    <Front t={t + 100} id="j2" night door={1} />
    <Fig look={PIP} pose={{ x: 820, y: feet(860, 0.8), scale: 0.8, yaw: 0, look: (Math.floor(t / 40) % 2 ? 1 : -1) * 0.7, ...faceAt(t, [[0, 'tired'], [30, 'shock']]) }} rimId="rimBlue" />
    <Fig look={SIS} pose={{ x: 920, y: feet(860, 0.56), scale: 0.56, ...faceAt(t, [[0, 'worried']]) }} rimId="rimBlue" />
    <Fig look={MOM} pose={{ x: 1000, y: feet(860, 0.85), scale: 0.85, yaw: -0.3, ...faceAt(t, [[0, 'worried']]) }} rimId="rimBlue" />
    {/* the crowd, dark, phones up */}
    {Array.from({ length: 16 }).map((_, i) => {
      const x = -100 + i * 140 + rnd(1, i) * 40;
      const y = 1020 + rnd(2, i) * 50;
      const on = t > 30 + i * 4;
      const flash = on && (Math.floor((t + i * 13) / 9) % 7 === 0);
      return (
        <g key={i}>
          <circle cx={x} cy={y - 150} r={44} fill="#07070C" />
          <rect x={x - 50} y={y - 110} width={100} height={200} rx={30} fill="#07070C" />
          <line x1={x + 30} y1={y - 90} x2={x + 40} y2={y - 200} stroke="#07070C" strokeWidth={22} strokeLinecap="round" />
          {on ? <rect x={x + 22} y={y - 260} width={36} height={60} rx={6} fill="#CFE6FF" opacity={0.85} /> : null}
          {flash ? <Glow x={x + 40} y={y - 230} r={260} kind="cool" o={0.9} /> : null}
        </g>
      );
    })}
    <Rain t={t} o={0.45} />
  </g>
);

export const J3: React.FC<ShotProps> = ({ t, len }) => {
  const clap = Math.sin(t / 3.5);
  return (
    <g transform={camT(kf(t, [[0, 1320], [len, 1280]]), 700, kf(t, [[0, 1.6], [len, 1.9]]))}>
      <Front t={t + 300} id="j3" night />
      <BlackCar x={1500} y={960} s={0.9} lights={1} />
      <Fig look={SUIT} pose={{ x: 1180, y: feet(960, 0.9), scale: 0.9, yaw: -0.4, look: -0.6, armL: { a: 70 + clap * 14, b: -50 }, armR: { a: 70 + clap * 14, b: -50 }, ...faceAt(t, [[0, 'smug'], [s30(413.62 - 407.0), 'cool']]) }} rimId="rimRed" shadow={0.6} />
      <Rain t={t} o={0.45} />
    </g>
  );
};

// ============================================================ K. THE RADAR, THE SECOND BLIP
const Room: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={-3000} y={-3000} width={8000} height={8000} fill="#05070A" />
    <rect x={-3000} y={820} width={8000} height={600} fill="#0A0E12" />
    {[220, 1700].map((x, i) => <rect key={i} x={x - 90} y={300} width={180} height={140} rx={8} fill="#0C1A14" stroke="#1A2A22" strokeWidth={4} opacity={0.8 + 0.2 * Math.sin(t / 5 + i)} />)}
  </g>
);

export const K1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.15]]))}>
    <Room t={t} />
    <Radar x={960} y={520} r={360} t={t} blips={[{ x: 60, y: 40 }]} id="k1" />
    <Tag x={1150} y={500} t={t - s30(420.3 - 416.2)} text="നീ" w={150} />
    <Glow x={960} y={520} r={600} kind="cool" o={0.15} />
  </g>
);

export const K2: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp((t - 20) / (len - 20));
  const bx = -330 + k * 300;
  const by = -150 + k * 160;
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 860]]), 520, kf(t, [[0, 1.0], [len, 1.3]]))}>
      <Room t={t + 100} />
      <Radar x={960} y={520} r={360} t={t + 40} blips={[{ x: 60, y: 40 }, ...(t > 20 ? [{ x: bx, y: by, c: '#FF6A4A' }] : [])]} id="k2" />
      {t > 20 ? <path d={`M ${960 + bx - 90} ${520 + by - 50} L ${960 + bx - 20} ${520 + by - 10}`} stroke="#FF6A4A" strokeWidth={4} strokeDasharray="8 8" opacity={0.7} /> : null}
      <Tag x={960 + bx} y={520 + by - 90} t={t - 30} text="?" w={110} />
    </g>
  );
};

export const K3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 480], [len, 460]]), kf(t, [[0, 2.2], [len, 2.6]]))}>
    <Room t={t + 200} />
    <Fig look={SUIT} pose={{ x: 960, y: 700, scale: 1, yaw: 0.1, look: 0.2, ...faceAt(t, [[0, 'neutral'], [s30(431.44 - 429.5), 'smug']]) }} rimId="rimBlue" />
    <Glow x={960} y={760} r={420} kind="cool" o={0.4 + 0.15 * Math.sin(t / 4)} />
    <rect x={-3000} y={-3000} width={8000} height={8000} fill="#2FCB6A" opacity={0.08} />
  </g>
);

export const END: React.FC<ShotProps> = ({ t, len }) => {
  const next = s30(439.38 - 434.0);
  return (
    <g>
      <Sky id="end" mode="night" stars={90} t={t} />
      <CloudRow t={t} y={980} n={7} tone="night" speed={-0.6} s={1.3} />
      {/* the second flyer: a streak across the sky */}
      {t > 20 && t < 80 ? (
        <g opacity={1 - Math.abs(t - 50) / 30}>
          <line x1={kf(t, [[20, -200], [80, 2100]]) - 400} y1={kf(t, [[20, 620], [80, 380]]) + 40} x2={kf(t, [[20, -200], [80, 2100]])} y2={kf(t, [[20, 620], [80, 380]])} stroke="#FF8A5A" strokeWidth={8} strokeLinecap="round" />
          <circle cx={kf(t, [[20, -200], [80, 2100]])} cy={kf(t, [[20, 620], [80, 380]])} r={12} fill="#FFE2C8" />
          <Glow x={kf(t, [[20, -200], [80, 2100]])} y={kf(t, [[20, 620], [80, 380]])} r={120} kind="warm" o={0.8} />
        </g>
      ) : null}
      {t < next ? (
        <g opacity={clamp(t / 6) * (1 - clamp((t - next + 8) / 8))}>
          <text x={960} y={420} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={80} fill="#F6EFE3" stroke="#1A1230" strokeWidth={10} paintOrder="stroke">നിനക്ക് പറക്കാൻ പറ്റിയാൽ,</text>
          <text x={960} y={540} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={92} fill="#FFE27A" stroke="#1A1230" strokeWidth={12} paintOrder="stroke">ആദ്യം എവിടേക്ക് പോകും?</text>
          <Tag x={960} y={700} t={t - s30(437.7 - 434.0)} text="കമന്റിൽ പറയൂ" w={480} />
        </g>
      ) : (
        <TitleCard t={t - next} lines={['അടുത്ത ഭാഗം', 'ആകാശത്തിലെ രണ്ടാമൻ']} accent="രണ്ടാമൻ" accentT={24} size={104} y={400} />
      )}
      <Fade t={t} len={len} n={20} />
    </g>
  );
};
