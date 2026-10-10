import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeftRight, ArrowRight, CalendarDays, ChevronRight, MessageSquare, Newspaper, Package, Phone, Smartphone, Vote, Video } from 'lucide-react';

// The whole features/roadmap section as one scroll-driven story. A pinned stage shows a single
// world that grows as you scroll: one computer, then a community, then neighbouring hubs, then a
// network with no ISP in the middle. Each feature gets its own beat with a visual consequence.
// Only what is real is drawn as real: Phase 2/3 links are dashed and labelled "in development".

type Scene =
  | 'start' | 'engage' | 'chat' | 'notes' | 'files' | 'tasks' | 'market' | 'pins' | 'profiles' | 'spaces' | 'ai'
  | 'p2' | 'discovery' | 'identity' | 'federation' | 'apps' | 'mobile'
  | 'p3' | 'noisp' | 'antennas' | 'access' | 'degrade';

type Step = {
  id: string;
  phase: 1 | 2 | 3;
  intro?: boolean;
  /** Key into the parent's FEATURE_DETAILS, so "Details" opens the same screenshot panel. */
  feature?: string;
  /** A second FEATURE_DETAILS key this beat also covers (merged beats). */
  also?: string;
  title: string;
  text: string;
  scene: Scene;
  vh: number;
};

const PHASES = [
  { n: 1, name: 'The Hub', status: 'Live now', tone: 'text-emerald-500' },
  { n: 2, name: 'The Network', status: 'In development', tone: 'text-amber-500' },
  { n: 3, name: 'The Infrastructure', status: 'The vision', tone: 'text-violet-500' },
] as const;

const STEPS: Step[] = [
  { id: 'p1', phase: 1, intro: true, scene: 'start', vh: 55, title: 'A neighborhood gets a digital home.',
    text: 'It starts with one computer. One organizer runs the hub; everyone else just opens a browser. Everything is stored on your group\'s hardware, not in a data center.' },
  { id: 'feed', phase: 1, feature: 'Community Engagement', scene: 'engage', vh: 50, title: 'Community engagement',
    text: 'Everything a community does together: a feed for announcements and requests, events with RSVPs, polls with a public record of who decided what, and a shared directory of open-source tools. Unread posts come first, then newest.' },
  { id: 'msg', phase: 1, feature: 'Communications', scene: 'chat', vh: 50, title: 'Communications',
    text: 'Messages, calls and live broadcasts in one place. Messages are end-to-end encrypted and searchable. Calls and broadcasts run on LiveKit, an open-source media server on your own hardware, and are opt-in when a hub is created. One-to-one calls only for now.' },
  { id: 'files', phase: 1, feature: 'File Storage', scene: 'files', vh: 50, title: 'File Storage',
    text: 'Upload to your hub and mark each file public or private. Private contents are encrypted before they leave your device.' },
  { id: 'proj', phase: 1, feature: 'Projects', scene: 'tasks', vh: 50, title: 'Projects',
    text: 'Shared work with tasks, assignees, due dates and progress updates members can comment on.' },
  { id: 'mkt', phase: 1, feature: 'Local Marketplace', scene: 'market', vh: 50, title: 'Local Marketplace',
    text: 'List goods and services, trade or sell (or give away). No platform fees, no promotion algorithm.' },
  { id: 'atlas', phase: 1, feature: 'Community Atlas', scene: 'pins', vh: 50, title: 'Community Atlas',
    text: 'A shared map on OpenStreetMap for meetup spots, safety alerts and points of interest. No Google required.' },
  { id: 'people', phase: 1, feature: 'Member Profiles', also: 'Export & Portability', scene: 'profiles', vh: 55, title: 'Profiles & portability',
    text: 'See who is on your hub and find your neighbors, with no feed deciding who you see. And the account is yours: download your data, or move to another hub as one encrypted package with your data and keys.' },
  { id: 'notes', phase: 1, feature: 'Notes', scene: 'notes', vh: 50, title: 'Notes',
    text: 'A rich-text notebook. Keep notes private and end-to-end encrypted, share them with your hub, or publish one to the web and the community blog.' },
  { id: 'spaces', phase: 1, feature: 'Spaces', scene: 'spaces', vh: 50, title: 'Spaces',
    text: 'Sub-communities inside one hub: a block, a garden club, a committee. Each has its own feed and members.' },
  { id: 'ai', phase: 1, feature: 'AI Assistant', scene: 'ai', vh: 50, title: 'AI Assistant',
    text: 'Built into your hub, not a third-party cloud. Unlike messages and notes it isn\'t end-to-end encrypted, because it has to read what you ask.' },

  { id: 'p2', phase: 2, intro: true, scene: 'p2', vh: 55, title: 'Neighborhoods find each other.',
    text: 'Parts of this have shipped: a hub directory, nearby discovery, an open app contract, and moving your account between hubs. Sharing content between hubs is what is still being built.' },
  { id: 'disc', phase: 2, feature: 'Hub Discovery', scene: 'discovery', vh: 50, title: 'Hub Discovery',
    text: 'Partially live. Hubs register in a public directory, and phones can detect hubs on the same network. A richer discovery experience is in development.' },
  { id: 'ident', phase: 2, feature: 'Portable Identity', scene: 'identity', vh: 50, title: 'Portable Identity',
    text: 'Partially live. You can already move your account between hubs as an encrypted package. Still to come: an identity that follows you with no export and import step.' },
  { id: 'fed', phase: 2, feature: 'Hub-to-Hub Federation', scene: 'federation', vh: 50, title: 'Hub-to-Hub Federation',
    text: 'In development. Hubs will share selected content with each other when their communities choose to connect. Dashed lines mean not built yet.' },
  { id: 'apps', phase: 2, feature: 'Open App Ecosystem', scene: 'apps', vh: 50, title: 'Open App Ecosystem',
    text: 'Third-party apps plug into a hub through an open contract. No platform permission, no revenue share. The ecosystem is young.' },
  { id: 'mobile', phase: 2, feature: 'Mobile App', scene: 'mobile', vh: 50, title: 'Mobile App',
    text: 'A native iOS and Android companion covering the feed, messages, calls, Atlas, files, marketplace and Projects.' },

  { id: 'p3', phase: 3, intro: true, scene: 'p3', vh: 55, title: 'Neighborhoods build their own "internet".',
    text: 'Initially a neighborhood-wide intranet. Connect directly to a hub over its own network, then go further: rooftop antennas, community access points, a Web that belongs to your community.' },
  { id: 'noisp', phase: 3, feature: 'No ISP Needed', scene: 'noisp', vh: 50, title: 'No ISP Needed',
    text: 'The goal, with a first step built: anyone on a hub\'s local network can reach it over trusted HTTPS, and a dedicated access point can serve guests with no internet of their own.' },
  { id: 'ant', phase: 3, feature: 'Rooftop Antennas', scene: 'antennas', vh: 50, title: 'Rooftop/Window Antennas',
    text: 'The goal. Community wireless co-ops use point-to-point antennas for neighborhood-scale backhaul. Hubs are designed to run on top of it.' },
  { id: 'ap', phase: 3, feature: 'Community Access Points', scene: 'access', vh: 50, title: 'Community Access Points',
    text: 'The goal. Sector antennas serve nearby homes like public Wi-Fi, but community-run and community-funded.' },
  { id: 'deg', phase: 3, feature: 'Graceful Degradation', scene: 'degrade', vh: 50, title: 'Graceful Degradation',
    text: 'Designed in from the start. As connectivity improves Citinet scales up; in a storm or outage it steps down through whatever is left. The community keeps functioning.' },
];

// "See it" opens a screenshot panel, so it only appears where there is something real to look at:
// every Phase 1 beat, plus Hub Discovery and Mobile App (Phase 2) and No ISP Needed (Phase 3).
const SEE_IT_LATER = new Set(['disc', 'mobile', 'noisp']);

// Background for the pinned visuals: 'grid' (ties to the hero) or 'dots' (quieter behind line art).
const CANVAS_STYLE: 'grid' | 'dots' = 'grid';
// closest-side makes the fade reach zero exactly at the box edge, so there is no hard boundary.
const CANVAS_MASK = 'radial-gradient(ellipse closest-side at 50% 50%, #000 35%, transparent 100%)';

const TOTAL_VH = STEPS.reduce((n, s) => n + s.vh, 0);
const STARTS = STEPS.reduce<number[]>((acc, s, i) => { acc.push(i === 0 ? 0 : acc[i - 1] + STEPS[i - 1].vh); return acc; }, []);

// ── world ────────────────────────────────────────────────────────────────────────────────────
const VW = 640;
const VH = 560;
const A = { x: 320, y: 285 };
const OTHERS = [
  { id: 'b', x: 705, y: 120, label: 'Riverside' },
  { id: 'c', x: -70, y: 470, label: 'Oak Park' },
  { id: 'd', x: 765, y: 535, label: 'Eastside' },
];
// A visitor's own device, shown in Phase 2 so the hubs have somebody looking for them.
const DEVICE = { x: 235, y: 40 };
const NAMES = ['Alice', 'Ben', 'Carla', 'Dev', 'Eli', 'Fay'];
const MEMBERS = NAMES.map((name, i) => {
  const a = ((-90 + i * 60) * Math.PI) / 180;
  return { name, x: A.x + 112 * Math.cos(a), y: A.y + 112 * Math.sin(a) };
});
// Phase 3 is one town, shown through every beat: each hub is a neighbourhood of houses, and a couple of
// phones wander around, because people are not fixed in place.
const HUB_LIST = [A, ...OTHERS];
const HOUSES = HUB_LIST.map((h, hi) => {
  const n = hi === 0 ? 7 : 5;
  const R = hi === 0 ? 138 : 114;
  return Array.from({ length: n }, (_, i) => {
    const a = (((360 / n) * i - 90 + 180 / n) * Math.PI) / 180;
    return { x: h.x + R * Math.cos(a), y: h.y + R * Math.sin(a) };
  });
});
const HUB_R3 = [70, 58, 58, 58];

const CAMERA: Record<1 | 2 | 3, { s: number; fx: number; fy: number }> = {
  1: { s: 1.12, fx: A.x, fy: A.y },
  2: { s: 0.7, fx: 345, fy: 330 },
  3: { s: 0.5, fx: 330, fy: 300 },
};

const BLUE = '#2563eb';

// Reduced motion keeps the whole story (it is driven by the visitor's own scrolling) but draws every
// effect at rest: no looping packets or pulses, and the camera cuts instead of easing.
const StillCtx = createContext(false);
// Camera zoom, so labels can be drawn larger when the world is far away and stay readable on screen.
const ZoomCtx = createContext(1);
// Phones draw the world at roughly 0.6 of its desktop size, so small labels are drawn larger there.
const CompactCtx = createContext(false);

// A dot that travels from one point to another, forever.
function Packet({ from, to, delay = 0, duration = 1.7, r = 5, fill = BLUE, shape = 'dot' }: {
  from: { x: number; y: number }; to: { x: number; y: number }; delay?: number; duration?: number; r?: number; fill?: string; shape?: 'dot' | 'file' | 'bubble';
}) {
  const still = useContext(StillCtx);
  if (still) {
    const mx = (from.x + to.x) / 2;
    const my = (from.y + to.y) / 2;
    return shape === 'dot'
      ? <circle cx={mx} cy={my} r={r} fill={fill} opacity={0.9} />
      : <rect x={mx - r} y={my - r} width={r * 2} height={r * 1.6} rx={2} fill={fill} opacity={0.9} />;
  }
  const t = { duration, delay, repeat: Infinity, repeatDelay: 0.5, ease: 'easeInOut' as const };
  const o = { opacity: [0, 1, 1, 0] };
  if (shape === 'dot') {
    return <motion.circle r={r} fill={fill} initial={{ cx: from.x, cy: from.y, opacity: 0 }} animate={{ cx: [from.x, to.x], cy: [from.y, to.y], ...o }} transition={t} />;
  }
  const w = shape === 'file' ? r * 1.6 : r * 2.4;
  const h = shape === 'file' ? r * 2 : r * 1.6;
  return (
    <motion.rect width={w} height={h} rx={shape === 'file' ? 2 : h / 2} fill={fill}
      initial={{ x: from.x - w / 2, y: from.y - h / 2, opacity: 0 }}
      animate={{ x: [from.x - w / 2, to.x - w / 2], y: [from.y - h / 2, to.y - h / 2], ...o }} transition={t} />
  );
}

function Tag({ x, y, text, delay = 0, tone = 'blue' }: { x: number; y: number; text: string; delay?: number; tone?: 'blue' | 'muted' }) {
  const zoom = useContext(ZoomCtx);
  const k = Math.max(1, (useContext(CompactCtx) ? 1.5 : 0.8) / zoom);
  const w = (text.length * 6.4 + 20) * k;
  return (
    <motion.g initial={{ opacity: 0, y: 6 * k }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay }}>
      <rect x={x - w / 2} y={y - 12 * k} width={w} height={24 * k} rx={12 * k} fill={tone === 'blue' ? BLUE : 'var(--muted)'} stroke={tone === 'blue' ? 'none' : 'var(--border)'} strokeWidth={k} />
      <text x={x} y={y + 4 * k} textAnchor="middle" fontSize={11 * k} className="font-mono" fill={tone === 'blue' ? '#fff' : 'var(--muted-foreground)'}>{text}</text>
    </motion.g>
  );
}

function Pulse({ x, y, r, delay = 0, color = BLUE }: { x: number; y: number; r: number; delay?: number; color?: string }) {
  const still = useContext(StillCtx);
  if (still) return <circle cx={x} cy={y} r={r} fill="none" stroke={color} strokeOpacity={0.35} strokeWidth={1.5} />;
  return (
    <motion.circle cx={x} cy={y} fill="none" stroke={color} strokeWidth={1.5}
      initial={{ r: r * 0.6, opacity: 0 }} animate={{ r: [r * 0.6, r * 1.5], opacity: [0.55, 0] }}
      transition={{ duration: 1.8, delay, repeat: Infinity, ease: 'easeOut' }} />
  );
}

function Node({ x, y, r = 22, label, on, show = true, dash }: { x: number; y: number; r?: number; label?: string; on?: boolean; show?: boolean; dash?: boolean }) {
  const compact = useContext(CompactCtx);
  return (
    <motion.g initial={false} animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.6 }} transition={{ duration: 0.45 }} style={{ originX: x / VW, originY: y / VH, transformBox: 'view-box' }}>
      <circle cx={x} cy={y} r={r} fill="var(--background)" stroke={on ? BLUE : 'var(--muted-foreground)'} strokeOpacity={on ? 1 : 0.6} strokeWidth={on ? 2.25 : 1.75} strokeDasharray={dash ? '4 4' : undefined} />
      {label && <text x={x} y={y + r + 15} textAnchor="middle" fontSize={compact ? 14 : 11} className="font-mono" fill="var(--muted-foreground)">{label}</text>}
    </motion.g>
  );
}

function HubDot({ x, y, r = 44, label = 'Hub', show = true, sub }: { x: number; y: number; r?: number; label?: string; show?: boolean; sub?: string }) {
  const still = useContext(StillCtx);
  return (
    <motion.g initial={false} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: 0.5 }}>
      {!still && (
        <motion.circle cx={x} cy={y} fill="none" stroke="var(--foreground)" strokeOpacity={0.25} initial={{ r }} animate={{ r: [r, r * 1.5], opacity: [0.5, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }} />
      )}
      <circle cx={x} cy={y} r={r} fill="var(--muted)" stroke="var(--foreground)" strokeWidth={r > 40 ? 1.75 : 1.4} />
      <text x={x} y={y + (sub ? 2 : 6)} textAnchor="middle" fontSize={r * 0.42} fontWeight={600} fill="var(--foreground)">{label}</text>
      {sub && <text x={x} y={y + r * 0.5} textAnchor="middle" fontSize={r * 0.28} className="font-mono" fill="var(--muted-foreground)">{sub}</text>}
    </motion.g>
  );
}

// Round badges on the hub's edge: one per capability of the beat. The first two sit upper-left and
// upper-right, the next two lower-left and lower-right, a single odd one sits at the bottom.
function HubBadges({ items }: { items: Array<{ Icon: React.ElementType }> }) {
  const spots = items.length === 3
    ? [[-37, -34], [37, -34], [0, 58]]
    : [[-38, -34], [38, -34], [-38, 34], [38, 34]];
  return (
    <>
      {items.map(({ Icon }, i) => {
        const bx = A.x + spots[i][0];
        const by = A.y + spots[i][1];
        return (
          <motion.g
            key={i}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.15, type: 'spring', stiffness: 220, damping: 16 }}
            style={{ originX: bx / VW, originY: by / VH, transformBox: 'view-box' }}
          >
            <circle cx={bx} cy={by} r={17} fill="var(--background)" stroke={BLUE} strokeWidth={2} />
            <Icon x={bx - 9} y={by - 9} width={18} height={18} stroke={BLUE} strokeWidth={2} />
          </motion.g>
        );
      })}
    </>
  );
}

function House({ x, y, lit = false, delay = 0 }: { x: number; y: number; lit?: boolean; delay?: number }) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      style={{ originX: x / VW, originY: y / VH, transformBox: 'view-box' }}
    >
      <path
        d={`M ${x - 16} ${y + 14} V ${y - 3} L ${x} ${y - 17} L ${x + 16} ${y - 3} V ${y + 14} Z`}
        fill={lit ? BLUE : 'var(--background)'} fillOpacity={lit ? 0.2 : 1}
        stroke={lit ? BLUE : 'var(--muted-foreground)'} strokeOpacity={lit ? 1 : 0.9} strokeWidth={3} strokeLinejoin="round"
      />
      <rect x={x - 4} y={y + 3} width={8} height={11} fill="none" stroke={lit ? BLUE : 'var(--muted-foreground)'} strokeOpacity={lit ? 1 : 0.9} strokeWidth={2.5} />
    </motion.g>
  );
}

function Roamer({ center, radius, start, lit, delay = 0 }: { center: { x: number; y: number }; radius: number; start: number; lit: boolean; delay?: number }) {
  const still = useContext(StillCtx);
  const pts = [0, 90, 180, 270, 360].map((d) => {
    const a = ((d + start) * Math.PI) / 180;
    return { x: center.x + radius * Math.cos(a), y: center.y + radius * Math.sin(a) };
  });
  const col = lit ? BLUE : 'var(--foreground)';
  const body = (
    <>
      <rect x={-9} y={-15} width={18} height={30} rx={5} fill="var(--background)" stroke={col} strokeWidth={3} />
      <line x1={-3.5} y1={9} x2={3.5} y2={9} stroke={col} strokeWidth={2.5} strokeLinecap="round" />
    </>
  );
  if (still) return <g transform={`translate(${pts[0].x} ${pts[0].y})`}>{body}</g>;
  return (
    <motion.g
      initial={{ x: pts[0].x, y: pts[0].y }}
      animate={{ x: pts.map((q) => q.x), y: pts.map((q) => q.y) }}
      transition={{ duration: 16, repeat: Infinity, ease: 'linear', delay }}
    >
      {body}
    </motion.g>
  );
}

function Antenna({ x, y, r, on }: { x: number; y: number; r: number; on: boolean }) {
  // A mast rising from the hub with a dot at the top and radio waves either side: the universal "broadcasting" mark.
  const top = y - r - 58;
  return (
    <motion.g initial={false} animate={{ opacity: on ? 1 : 0, y: on ? 0 : 18 }} transition={{ duration: 0.5 }}>
      <line x1={x} y1={y - r + 2} x2={x} y2={top} stroke="var(--foreground)" strokeWidth={5} strokeLinecap="round" />
      <circle cx={x} cy={top} r={8} fill={BLUE} />
      {[1, 2].map((k) => (
        <g key={k}>
          <path
            d={`M ${x + 12 + k * 12} ${top - 10 - k * 6} a ${14 + k * 10} ${14 + k * 10} 0 0 1 0 ${20 + k * 12}`}
            fill="none" stroke={BLUE} strokeWidth={4} strokeLinecap="round"
          />
          <path
            d={`M ${x - 12 - k * 12} ${top - 10 - k * 6} a ${14 + k * 10} ${14 + k * 10} 0 0 0 0 ${20 + k * 12}`}
            fill="none" stroke={BLUE} strokeWidth={4} strokeLinecap="round"
          />
        </g>
      ))}
    </motion.g>
  );
}

// ── the stage ────────────────────────────────────────────────────────────────────────────────
function Stage({ step, phase, beat }: { step: Step; phase: 1 | 2 | 3; beat: 0 | 1 | 2 }) {
  const still = useContext(StillCtx);
  const scene = step.scene;
  const compactView = useContext(CompactCtx);
  // Phase 1 is one hub and its members, so on a phone the camera can come in closer and use the pinned space.
  const base = CAMERA[phase];
  const cam = compactView && phase === 1 ? { ...base, s: base.s * 1.3 } : base;
  // The group scales about the viewBox centre, so putting the focus point under the centre is a pure translate.
  const camX = -cam.s * (cam.fx - VW / 2);
  const camY = -cam.s * (cam.fy - VH / 2);
  const membersOn = scene !== 'start' && phase < 3;
  const otherHubs = phase >= 2;
  const big = phase === 3; // sizes are drawn larger in world units once the camera is far out

  const feds = OTHERS.map((o) => ({ from: A, to: o }));
  const hubXY = { a: A, b: OTHERS[0], c: OTHERS[1], d: OTHERS[2] };
  const ispStruck = beat >= 1; // the red line is drawn across the ISP
  const ispGone = beat >= 2; // then it fades away and the local network takes over
  const connected = scene === 'noisp' ? beat >= 2 : scene !== 'p3';

  return (
    <ZoomCtx.Provider value={cam.s}>
    <svg viewBox={`0 0 ${VW} ${VH}`} className="h-full w-full" role="img" aria-label={`Illustration: ${step.title}`}>
      <motion.g initial={false} animate={{ x: camX, y: camY, scale: cam.s }} transition={still ? { duration: 0 } : { type: 'spring', stiffness: 55, damping: 18 }} style={{ originX: 0.5, originY: 0.5, transformBox: 'view-box' }}>
        {/* Phase 1 backdrop for the map feature */}
        {scene === 'pins' && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <circle cx={A.x} cy={A.y} r={150} fill="none" stroke="var(--border)" strokeDasharray="3 6" />
            {[-120, -60, 0, 60, 120].map((d) => (
              <g key={d}>
                <line x1={A.x - 150} y1={A.y + d} x2={A.x + 150} y2={A.y + d} stroke="var(--border)" strokeOpacity={0.5} />
                <line x1={A.x + d} y1={A.y - 150} x2={A.x + d} y2={A.y + 150} stroke="var(--border)" strokeOpacity={0.5} />
              </g>
            ))}
          </motion.g>
        )}

        {/* links from the hub to its members */}
        {membersOn && MEMBERS.map((m, i) => (
          <motion.line key={`l${i}`} x1={A.x} y1={A.y} x2={m.x} y2={m.y} stroke="var(--muted-foreground)" strokeOpacity={0.6} strokeWidth={big ? 4 : 1.75} strokeDasharray={big ? '14 10' : '6 4'}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 + i * 0.07 }} />
        ))}

        {/* federation links between hubs (phase 2: not built yet, so dashed) */}
        {otherHubs && phase === 2 && feds.map((l, i) => (
          <motion.line key={`f${i}`} x1={l.from.x} y1={l.from.y} x2={l.to.x} y2={l.to.y}
            stroke={BLUE} strokeWidth={2} strokeDasharray="8 6"
            initial={{ opacity: 0 }} animate={{ opacity: scene === 'federation' ? 0.85 : 0 }} transition={{ duration: 0.6 }} />
        ))}
        {otherHubs && phase === 2 && scene === 'federation' && (
          <motion.line x1={OTHERS[0].x} y1={OTHERS[0].y} x2={OTHERS[2].x} y2={OTHERS[2].y} stroke={BLUE} strokeWidth={2} strokeDasharray="8 6"
            initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.5 }} />
        )}

        {/* Phase 3: the town. Links first (so hubs and houses sit on top). */}
        {phase === 3 && HOUSES.map((hs, hi) => hs.map((h, k) => (
          <motion.line key={`hl${hi}-${k}`} x1={HUB_LIST[hi].x} y1={HUB_LIST[hi].y} x2={h.x} y2={h.y}
            stroke="var(--foreground)" strokeWidth={3}
            initial={false} animate={{ opacity: connected && scene !== 'p3' ? 0.5 : 0 }} transition={{ duration: 0.6, delay: k * 0.05 }} />
        )))}
        {phase === 3 && scene === 'noisp' && HUB_LIST.map((h, i) => (
          <motion.line key={`isp${i}`} x1={h.x} y1={h.y} x2={A.x} y2={A.y - 215}
            stroke="var(--muted-foreground)" strokeWidth={3} strokeDasharray="12 10"
            initial={false} animate={{ opacity: ispGone ? 0 : 0.6 }} transition={{ duration: 0.8 }} />
        ))}
        {phase === 3 && scene === 'antennas' && (
          <>
            {[0, 1].map((i) => (
              <motion.line key={i} x1={A.x} y1={A.y} x2={OTHERS[i === 0 ? 0 : 1].x} y2={OTHERS[i === 0 ? 0 : 1].y}
                stroke={beat >= 2 ? BLUE : '#ef4444'} strokeWidth={beat >= 2 ? 6 : 4} strokeDasharray={beat >= 2 ? undefined : '14 12'}
                initial={false} animate={{ opacity: 0.9 }} transition={{ duration: 0.6 }} />
            ))}
          </>
        )}
        {phase === 3 && scene === 'degrade' && (
          <>
            {([['a', 'b'], ['a', 'c'], ['a', 'd'], ['b', 'd'], ['c', 'd']] as const).map(([u, v]) => {
              const failed = u === 'a' && v === 'b' && beat >= 1;
              const detour = beat >= 2 && ((u === 'a' && v === 'd') || (u === 'b' && v === 'd'));
              return (
                <motion.line key={u + v} x1={hubXY[u].x} y1={hubXY[u].y} x2={hubXY[v].x} y2={hubXY[v].y}
                  stroke={failed ? '#ef4444' : detour ? BLUE : 'var(--foreground)'}
                  strokeWidth={detour ? 6 : failed ? 4 : 4} strokeDasharray={failed ? '14 12' : undefined}
                  initial={false} animate={{ opacity: failed ? 0.9 : detour ? 1 : 0.45 }} transition={{ duration: 0.5 }} />
              );
            })}
          </>
        )}
        {phase === 3 && scene === 'access' && (
          <>
            {[0, 1, 2].map((k) => (
              <motion.circle key={k} cx={A.x} cy={A.y} fill={BLUE} fillOpacity={0.05} stroke={BLUE} strokeWidth={3} strokeDasharray="10 10"
                initial={false}
                animate={{ r: 100 + k * 55, opacity: beat >= k ? 0.55 - k * 0.12 : 0 }}
                transition={{ duration: 0.7 }} />
            ))}
          </>
        )}

        {/* the hubs */}
        <HubDot x={A.x} y={A.y} r={big ? HUB_R3[0] : 44} />
        {OTHERS.map((o, i) => (
          <motion.g key={o.id} initial={false} animate={{ opacity: otherHubs ? 1 : 0, scale: otherHubs ? 1 : 0.4 }} transition={{ duration: 0.6, delay: otherHubs ? 0.15 * i : 0 }}
            style={{ originX: o.x / VW, originY: o.y / VH, transformBox: 'view-box' }}>
            <HubDot x={o.x} y={o.y} r={big ? 58 : 36} label="Hub" sub={o.label} />
          </motion.g>
        ))}

        {phase === 3 && HOUSES.map((hs, hi) => hs.map((h, k) => {
          const lit = scene === 'access'
            ? hi === 0 && (beat >= 2 || (beat >= 1 && k < 3))
            : (scene === 'noisp' && beat >= 2) || scene === 'antennas' || scene === 'degrade';
          return <House key={`h${hi}-${k}`} x={h.x} y={h.y} lit={lit && (scene !== 'antennas' || beat >= 2 || k < 0)} delay={0.1 + k * 0.06} />;
        }))}
        {phase === 3 && (
          <>
            <Roamer center={A} radius={200} start={20} lit={connected && !(scene === 'access' && beat < 1)} />
            <Roamer center={OTHERS[0]} radius={168} start={200} lit={connected} delay={2} />
          </>
        )}

        {/* members */}
        {MEMBERS.map((m, i) => (
          <Node key={m.name} x={m.x} y={m.y} r={big ? 32 : 22} show={membersOn}
            label={scene === 'profiles' ? m.name : undefined}
            on={(scene === 'engage' && i < 5) || (scene === 'market' && (i === 1 || i === 2))} />
        ))}

        {/* ── Phase 1 scenes ── */}
        {scene === 'start' && <Tag x={A.x} y={A.y + 82} text="one computer" tone="muted" />}
        {scene === 'engage' && (
          <>
            <Pulse x={A.x} y={A.y} r={70} />
            <HubBadges items={[{ Icon: Newspaper }, { Icon: CalendarDays }, { Icon: Vote }, { Icon: Package }]} />
            <Tag x={A.x} y={A.y + 104} text="feed · events · decisions · resources" />
          </>
        )}
        {scene === 'chat' && (
          <>
            <Pulse x={A.x} y={A.y} r={70} />
            <HubBadges items={[{ Icon: MessageSquare }, { Icon: Video }, { Icon: Phone }]} />
            <Tag x={A.x} y={A.y + 104} text="messages · calls · live broadcasts" />
          </>
        )}
        {scene === 'files' && (
          <>
            {[1, 3, 5].map((i, k) => <Packet key={i} from={MEMBERS[i]} to={A} delay={k * 0.5} shape="file" r={6} />)}
            <Tag x={A.x} y={A.y + 90} text="stored on your hardware" />
          </>
        )}
        {scene === 'tasks' && (
          <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <rect x={A.x + 62} y={A.y + 40} width={150} height={92} rx={12} fill="var(--background)" stroke="var(--border)" />
            {['Draft the notice', 'Book the hall', 'Send reminders'].map((t, i) => (
              <g key={t}>
                <rect x={A.x + 76} y={A.y + 56 + i * 24} width={12} height={12} rx={3} fill="none" stroke="var(--border)" />
                <motion.path d={`M ${A.x + 78} ${A.y + 62 + i * 24} l 3 3 l 6 -7`} fill="none" stroke={BLUE} strokeWidth={2} strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: still ? 1 : [0, 1, 1, 0] }} transition={still ? { duration: 0 } : { duration: 3.2, delay: i * 0.7, repeat: Infinity, times: [0, 0.2, 0.85, 1] }} />
                <text x={A.x + 96} y={A.y + 66 + i * 24} fontSize={11} fill="var(--muted-foreground)">{t}</text>
              </g>
            ))}
          </motion.g>
        )}
        {scene === 'market' && (
          <>
            {/* two neighbours trade directly: a line between them, a swap badge on it, nothing through the hub */}
            <motion.line
              x1={MEMBERS[1].x} y1={MEMBERS[1].y} x2={MEMBERS[2].x} y2={MEMBERS[2].y}
              stroke={BLUE} strokeWidth={2}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }}
            />
            <Pulse x={(MEMBERS[1].x + MEMBERS[2].x) / 2} y={(MEMBERS[1].y + MEMBERS[2].y) / 2} r={24} />
            <motion.g
              initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45, type: 'spring', stiffness: 220, damping: 16 }}
              style={{ originX: (MEMBERS[1].x + MEMBERS[2].x) / 2 / VW, originY: (MEMBERS[1].y + MEMBERS[2].y) / 2 / VH, transformBox: 'view-box' }}
            >
              <circle cx={(MEMBERS[1].x + MEMBERS[2].x) / 2} cy={(MEMBERS[1].y + MEMBERS[2].y) / 2} r={17} fill="var(--background)" stroke={BLUE} strokeWidth={2} />
              <ArrowLeftRight x={(MEMBERS[1].x + MEMBERS[2].x) / 2 - 9} y={(MEMBERS[1].y + MEMBERS[2].y) / 2 - 9} width={18} height={18} stroke={BLUE} strokeWidth={2} />
            </motion.g>
            <Tag x={A.x} y={A.y + 104} text="neighbor to neighbor · no platform fees" />
          </>
        )}
        {scene === 'pins' && (
          <>
            {[[-70, -60], [90, -20], [-110, 40], [60, 90], [-20, 120]].map(([dx, dy], i) => (
              <motion.g key={i} initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.25, type: 'spring' }}>
                <circle cx={A.x + dx} cy={A.y + dy} r={7} fill={BLUE} />
                <circle cx={A.x + dx} cy={A.y + dy} r={2.5} fill="#fff" />
              </motion.g>
            ))}
            <Tag x={A.x} y={A.y + 168} text="pins your neighbors dropped" />
          </>
        )}
        {scene === 'profiles' && (
          <>
            <motion.circle cx={500} cy={140} r={30} fill="none" stroke="var(--border)" strokeDasharray="4 4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />
            <text x={500} y={144} textAnchor="middle" fontSize={11} className="font-mono" fill="var(--muted-foreground)">new hub</text>
            <Packet from={MEMBERS[2]} to={{ x: 462, y: 142 }} duration={2.4} delay={0.6} shape="file" r={8} />
            <Tag x={A.x} y={A.y + 92} text="an account you can take with you" />
          </>
        )}
        {scene === 'spaces' && (
          <>
            <motion.circle cx={(MEMBERS[0].x + MEMBERS[1].x + MEMBERS[2].x) / 3} cy={(MEMBERS[0].y + MEMBERS[1].y + MEMBERS[2].y) / 3} r={74}
              fill={BLUE} fillOpacity={0.06} stroke={BLUE} strokeDasharray="5 5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
            <motion.circle cx={(MEMBERS[3].x + MEMBERS[4].x + MEMBERS[5].x) / 3} cy={(MEMBERS[3].y + MEMBERS[4].y + MEMBERS[5].y) / 3} r={74}
              fill="var(--foreground)" fillOpacity={0.04} stroke="var(--foreground)" strokeOpacity={0.5} strokeDasharray="5 5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} />
            <Tag x={A.x + 150} y={A.y - 130} text="Garden club" delay={0.3} />
            <Tag x={A.x - 150} y={A.y + 150} text="Tenants" delay={0.5} tone="muted" />
          </>
        )}
        {scene === 'ai' && (
          <>
            {Array.from({ length: 8 }, (_, i) => {
              const a = (i * Math.PI) / 4;
              return (
                <motion.line key={i} x1={A.x + 56 * Math.cos(a)} y1={A.y + 56 * Math.sin(a)} x2={A.x + 78 * Math.cos(a)} y2={A.y + 78 * Math.sin(a)}
                  stroke={BLUE} strokeWidth={2.5} strokeLinecap="round" initial={{ opacity: 0 }}
                  animate={{ opacity: still ? 1 : [0, 1, 0] }} transition={still ? { duration: 0 } : { duration: 1.6, delay: i * 0.12, repeat: Infinity }} />
              );
            })}
            <Tag x={A.x} y={A.y + 100} text="runs on your hub" />
          </>
        )}
        {/* ── Phase 2 scenes ── */}
        {scene === 'discovery' && (
          <>
            {/* your device looks outward: a line to each hub, nearest first */}
            {[A, ...OTHERS].map((h, i) => (
              <motion.line
                key={i}
                x1={DEVICE.x} y1={DEVICE.y} x2={h.x} y2={h.y}
                stroke={BLUE} strokeWidth={2} strokeDasharray="8 6"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: i === 0 ? 0.95 : 0.55 }}
                transition={{ duration: 0.7, delay: 0.35 + i * 0.25 }}
              />
            ))}
            {OTHERS.map((o, i) => <Pulse key={o.id} x={o.x} y={o.y} r={50} delay={0.9 + i * 0.35} />)}
            <Pulse x={A.x} y={A.y} r={90} delay={0.5} />
            <Pulse x={DEVICE.x} y={DEVICE.y} r={60} />
            <motion.g
              initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 16 }}
              style={{ originX: DEVICE.x / VW, originY: DEVICE.y / VH, transformBox: 'view-box' }}
            >
              <circle cx={DEVICE.x} cy={DEVICE.y} r={30} fill="var(--background)" stroke={BLUE} strokeWidth={2.5} />
              <Smartphone x={DEVICE.x - 14} y={DEVICE.y - 14} width={28} height={28} stroke={BLUE} strokeWidth={2} />
              <text x={DEVICE.x} y={DEVICE.y + 52} textAnchor="middle" fontSize={16} fontWeight={600} fill="var(--foreground)">You</text>
            </motion.g>
            <Tag x={A.x} y={A.y + 125} text="your device finds hubs: nearby, or in the directory" />
          </>
        )}
        {scene === 'identity' && (
          <>
            <motion.line x1={A.x} y1={A.y} x2={OTHERS[0].x} y2={OTHERS[0].y} stroke={BLUE} strokeWidth={2} strokeDasharray="8 6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
            <Packet from={MEMBERS[1]} to={OTHERS[0]} duration={2.6} shape="file" r={9} />
            <Tag x={A.x + 40} y={A.y - 140} text="your account moves with you" />
          </>
        )}
        {scene === 'federation' && (
          <>
            {feds.map((l, i) => (
              <g key={i}>
                <Packet from={l.from} to={l.to} delay={i * 0.5} r={6} />
                <Packet from={l.to} to={l.from} delay={0.25 + i * 0.5} r={6} fill="var(--foreground)" />
              </g>
            ))}
            <Tag x={A.x + 40} y={A.y + 175} text="in development" />
          </>
        )}
        {scene === 'apps' && (
          <>
            {[[-120, -110], [130, -90], [0, 150]].map(([dx, dy], i) => (
              <motion.g key={i} initial={{ opacity: 0, x: dx * 1.8, y: dy * 1.8 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.2 + i * 0.35, type: 'spring', stiffness: 70, damping: 14 }}>
                <rect x={A.x + dx - 18} y={A.y + dy - 18} width={36} height={36} rx={9} fill="var(--background)" stroke={BLUE} strokeWidth={2} />
                <path d={`M ${A.x + dx - 6} ${A.y + dy} h 12 M ${A.x + dx} ${A.y + dy - 6} v 12`} stroke={BLUE} strokeWidth={2} strokeLinecap="round" />
              </motion.g>
            ))}
            <Tag x={A.x} y={A.y + 200} text="plug in through an open contract" />
          </>
        )}
        {scene === 'mobile' && (
          <>
            {MEMBERS.map((m, i) => <Pulse key={i} x={m.x} y={m.y} r={28} delay={i * 0.25} />)}
            <motion.g initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
              <rect x={A.x - 18} y={A.y - 130} width={36} height={64} rx={8} fill="var(--background)" stroke="var(--foreground)" strokeWidth={2} />
              <rect x={A.x - 8} y={A.y - 122} width={16} height={3} rx={1.5} fill="var(--border)" />
            </motion.g>
            <Tag x={A.x} y={A.y + 100} text="iOS and Android" />
          </>
        )}

        {/* ── Phase 3 scenes ── */}
        {scene === 'p3' && <Tag x={A.x} y={A.y + 262} text="four neighborhoods, each with its own hub" />}
        {scene === 'noisp' && (
          <>
            <motion.g initial={false} animate={{ opacity: ispGone ? 0 : 1 }} transition={{ duration: 0.8 }}>
              <rect x={A.x - 70} y={A.y - 250} width={140} height={70} rx={20} fill="var(--muted)" stroke="var(--foreground)" strokeWidth={4} />
              <text x={A.x} y={A.y - 205} textAnchor="middle" fontSize={34} fontWeight={600} fill="var(--foreground)">ISP</text>
              <line x1={A.x - 90} y1={A.y - 235} x2={A.x + 90} y2={A.y - 195} stroke="#ef4444" strokeWidth={6} strokeLinecap="round" opacity={ispStruck ? 1 : 0} />
              <text x={A.x} y={A.y - 275} textAnchor="middle" fontSize={30} className="font-mono" fill="var(--muted-foreground)">the internet</text>
            </motion.g>
            <Tag x={A.x} y={A.y + 262} text={ispGone ? 'no ISP in the middle: the town still works' : ispStruck ? 'take the ISP out of the middle' : 'today: every home goes through an ISP'} />
          </>
        )}
        {scene === 'antennas' && (
          <>
            {[A, OTHERS[0], OTHERS[1]].map((h, i) => <Antenna key={i} x={h.x} y={h.y} r={i === 0 ? 70 : 58} on={beat >= 1} />)}
            {beat >= 2 && (
              <>
                <Packet from={A} to={OTHERS[0]} r={11} />
                <Packet from={OTHERS[0]} to={A} delay={0.8} r={11} fill="var(--foreground)" />
                <Packet from={A} to={OTHERS[1]} delay={0.4} r={11} />
              </>
            )}
            <Tag x={A.x} y={A.y + 262} text={beat === 0 ? 'neighborhoods that cannot reach each other' : beat === 1 ? 'rooftop antennas go up' : 'linked point to point, across town'} />
          </>
        )}
        {scene === 'access' && (
          <Tag x={A.x} y={A.y + 262} text={beat === 0 ? 'one community access point' : beat === 1 ? 'nearby homes come online' : 'a whole block, from one antenna'} />
        )}
        {scene === 'degrade' && (
          <>
            {beat >= 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <circle cx={(A.x + OTHERS[0].x) / 2} cy={(A.y + OTHERS[0].y) / 2} r={26} fill="var(--background)" stroke="#ef4444" strokeWidth={4} />
                <path d={`M ${(A.x + OTHERS[0].x) / 2 - 10} ${(A.y + OTHERS[0].y) / 2 - 10} l 20 20 m 0 -20 l -20 20`} stroke="#ef4444" strokeWidth={5} strokeLinecap="round" />
              </motion.g>
            )}
            {beat === 0 && <Packet from={A} to={OTHERS[0]} r={11} />}
            {beat >= 2 && (
              <>
                <Packet from={A} to={OTHERS[2]} r={11} />
                <Packet from={OTHERS[2]} to={OTHERS[0]} delay={1.1} r={11} />
              </>
            )}
            <Tag x={A.x} y={A.y + 262} text={beat === 0 ? 'everything connected' : beat === 1 ? 'a storm takes out one link' : 'traffic reroutes: it bent, it did not break'} />
          </>
        )}
      </motion.g>
    </svg>
    </ZoomCtx.Provider>
  );
}

// ── the section ──────────────────────────────────────────────────────────────────────────────
export function FeaturesJourney({ onOpenFeature }: { onOpenFeature: (key: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [p, setP] = useState(0);
  const [beat, setBeat] = useState<0 | 1 | 2>(0);
  const reduce = useReducedMotion();

  // Phones and tablets get their own layout: the visual is pinned on top and one caption per scroll step sits
  // beneath it, instead of the desktop's two columns.
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023.98px)');
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Parallax: the pinned stage never moves, so the grid drifts upward at a fraction of the scroll speed and the
  // page seems to pass beneath it. Spring-smoothed so wheel notches don't stutter; gentler for reduced motion.
  const gridRaw = useTransform(scrollYProgress, (v) => {
    const vh = typeof window === 'undefined' ? 800 : window.innerHeight;
    return -(Math.min(Math.max(v, 0), 1) * (TOTAL_VH / 100) * vh) * (reduce ? 0.18 : 0.3);
  });
  const gridSmooth = useSpring(gridRaw, { stiffness: 110, damping: 26, mass: 0.5 });
  const gridPosY = useTransform(gridSmooth, (y) => `${y}px`);

  useMotionValueEvent(scrollYProgress, 'change', (v) => setP(Math.round(Math.min(Math.max(v, 0), 1) * 500) / 500));

  const dist = p * TOTAL_VH;
  const index = useMemo(() => {
    let i = 0;
    for (let k = 0; k < STEPS.length; k++) if (dist >= STARTS[k]) i = k;
    return i;
  }, [dist]);
  const step = STEPS[index];
  const phase = step.phase;

  // Every beat plays as a short before -> after when you arrive at it. It is a one-shot (fades and draw-ins), so it
  // plays for reduced-motion visitors too; what reduced motion removes is the looping and the camera easing.
  useEffect(() => {
    setBeat(0);
    const t1 = window.setTimeout(() => setBeat(1), 1300);
    const t2 = window.setTimeout(() => setBeat(2), 2900);
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); };
  }, [step.id]);

  const phaseSteps = STEPS.filter((s) => s.phase === phase);
  const phaseStart = STARTS[STEPS.indexOf(phaseSteps[0])];
  const phaseEnd = phaseStart + phaseSteps.reduce((n, s) => n + s.vh, 0);
  const within = Math.min(Math.max((dist - phaseStart) / (phaseEnd - phaseStart), 0), 1);

  const jumpTo = useCallback((i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + ((STARTS[i] + 4) / 100) * window.innerHeight, behavior: 'smooth' });
  }, []);

  const meta = PHASES[phase - 1];

  return (
    <StillCtx.Provider value={!!reduce}>
    <CompactCtx.Provider value={compact}>
    <div ref={ref} style={{ height: `${TOTAL_VH + 100}vh` }} className="relative">
      <div className="sticky top-0 flex h-screen items-center" style={compact ? { height: '100svh' } : undefined}>
        {compact && (
          <div className="flex h-full w-full flex-col pt-[4.25rem]">
            {/* the world: pinned, never shrunk to a thumbnail */}
            <div className="relative min-h-0 flex-1">
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 text-border"
                style={{
                  backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                  backgroundPositionY: gridPosY,
                  opacity: 0.4,
                  maskImage: CANVAS_MASK,
                  WebkitMaskImage: CANVAS_MASK,
                }}
              />
              <div className="relative h-full w-full px-3">
                <Stage step={step} phase={phase} beat={beat} />
              </div>
            </div>

            {/* the story: where we are, then one idea at a time */}
            <div className="flex min-h-[19rem] shrink-0 flex-col px-5 pb-6 pt-3">
              <div className="mb-3 flex items-center gap-3" aria-label="Roadmap progress">
                <div className="flex flex-1 gap-1.5">
                  {PHASES.map((ph) => {
                    const fill = ph.n < phase ? 1 : ph.n === phase ? within : 0;
                    return (
                      <div key={ph.n} className="h-1 flex-1 overflow-hidden rounded-full bg-border">
                        <div className="h-full rounded-full bg-foreground transition-[width] duration-200" style={{ width: `${fill * 100}%` }} />
                      </div>
                    );
                  })}
                </div>
                <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                  {String(index + 1).padStart(2, '0')} / {STEPS.length}
                </span>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                  className="min-h-0 flex-1"
                >
                  <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    Phase 0{phase} · {meta.name} · <span className={meta.tone}>{meta.status}</span>
                  </p>
                  <h3 className="text-[1.65rem] font-light leading-[1.06] tracking-[-0.03em] text-foreground">{step.title}</h3>
                  <p className="mt-3 text-[15px] leading-[1.5] text-muted-foreground">{step.text}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2.5">
                    {step.feature && (step.phase === 1 || SEE_IT_LATER.has(step.id)) && (
                      <button
                        onClick={() => onOpenFeature(step.feature!)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-4 text-sm text-foreground"
                      >
                        See it <ChevronRight className="h-4 w-4" />
                      </button>
                    )}
                    {step.also && (
                      <button
                        onClick={() => onOpenFeature(step.also!)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-4 text-sm text-foreground"
                      >
                        Portability <ChevronRight className="h-4 w-4" />
                      </button>
                    )}
                    {step.id === 'p1' && (
                      <a
                        href="https://citinet.cloud/create"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground"
                      >
                        Start a Hub <ArrowRight className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
        {!compact && (
        <div className="mx-auto grid w-full max-w-[1248px] grid-cols-[minmax(0,440px)_minmax(0,1fr)] items-center gap-12 px-6 pt-20">
          {/* left: where we are, and what this beat says */}
          <div>
            <div className="mb-8 flex gap-2" aria-label="Roadmap progress">
              {PHASES.map((ph) => {
                const fill = ph.n < phase ? 1 : ph.n === phase ? within : 0;
                return (
                  <div key={ph.n} className="flex-1">
                    <div className="h-1 overflow-hidden rounded-full bg-border">
                      <div className="h-full rounded-full bg-foreground transition-[width] duration-200" style={{ width: `${fill * 100}%` }} />
                    </div>
                    <p className={`mt-2 font-mono text-[11px] ${ph.n === phase ? 'text-foreground' : 'text-muted-foreground/60'}`}>
                      0{ph.n} · {ph.name}
                    </p>
                  </div>
                );
              })}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="min-h-[18rem]"
              >
                <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Phase 0{phase} · <span className={meta.tone}>{meta.status}</span>
                </p>
                <h3 className={`font-light tracking-[-0.035em] leading-[1.04] text-foreground ${step.intro ? 'text-[length:clamp(2rem,3vw,3.1rem)]' : 'text-[length:clamp(2.25rem,3.4vw,3.5rem)]'}`}>
                  {step.title}
                </h3>
                <p className="mt-5 max-w-md text-[17px] leading-[1.45] tracking-[-0.012em] text-muted-foreground">{step.text}</p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {step.feature && (step.phase === 1 || SEE_IT_LATER.has(step.id)) && (
                    <button
                      onClick={() => onOpenFeature(step.feature!)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-4 text-sm text-foreground transition-colors hover:bg-muted"
                    >
                      See it <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                  {step.also && (
                    <button
                      onClick={() => onOpenFeature(step.also!)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-4 text-sm text-foreground transition-colors hover:bg-muted"
                    >
                      Portability <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                  {step.id === 'p1' && (
                    <a
                      href="https://citinet.cloud/create"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Start a Hub <ArrowRight className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* index of this phase's beats: click to jump */}
            <div className="mt-6 flex flex-wrap gap-1.5">
              {phaseSteps.filter((s) => !s.intro).map((s) => {
                const i = STEPS.indexOf(s);
                return (
                  <button
                    key={s.id}
                    onClick={() => jumpTo(i)}
                    aria-current={i === index}
                    className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                      i === index ? 'border-foreground text-foreground' : 'border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {s.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* right: the world */}
          <div className="relative h-[min(68vh,620px)]">
            {/* canvas behind the visuals, faded to nothing at its edges. Flip CANVAS_STYLE to compare. */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -inset-x-20 -inset-y-14 text-border"
              style={
                CANVAS_STYLE === 'grid'
                  ? {
                      backgroundImage:
                        'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                      backgroundPositionY: gridPosY,
                      opacity: 0.4,
                      maskImage: CANVAS_MASK,
                      WebkitMaskImage: CANVAS_MASK,
                    }
                  : {
                      backgroundImage: 'radial-gradient(circle, var(--muted-foreground) 1px, transparent 1.3px)',
                      backgroundSize: '20px 20px',
                      backgroundPositionY: gridPosY,
                      opacity: 0.4,
                      maskImage: CANVAS_MASK,
                      WebkitMaskImage: CANVAS_MASK,
                    }
              }
            />
            <div className="relative h-full w-full">
              <Stage step={step} phase={phase} beat={beat} />
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
    </CompactCtx.Provider>
    </StillCtx.Provider>
  );
}
