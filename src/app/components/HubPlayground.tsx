import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import {
  Database, FileText, HardDrive, Laptop, Lock, Map as MapIcon, MessagesSquare,
  Monitor, Newspaper, Power, Server, Smartphone, Tablet,
} from 'lucide-react';

// A small hands-on model of how Citinet is put together. Everything it says is something a
// hub really does: members only need a browser, a hub holds a community's own data, an account
// can move to another hub as one encrypted package, a watchdog restarts what failed.
// Hubs are shown as independent on purpose: sharing content between hubs is not built yet.

type HubId = 'a' | 'b';
type Member = { id: string; name: string; device: string; Icon: React.ElementType; hub: HubId };
type Mode = 'community' | 'stack';

type HubGeo = { x: number; y: number; r: number; ring: number };
type Geo = { W: number; H: number; hubs: Record<HubId, HubGeo>; label: number; node: number };
const WIDE: Geo = {
  W: 560, H: 470, label: 10, node: 22,
  hubs: { a: { x: 235, y: 218, r: 46, ring: 138 }, b: { x: 452, y: 346, r: 34, ring: 78 } },
};
// Phones: the stage is ~330px wide, so the 560-wide layout would shrink every node to ~26px.
// This one is drawn near 1:1 -- 44px nodes, 11px names, the second hub underneath.
const COMPACT: Geo = {
  W: 360, H: 520, label: 11.5, node: 24,
  hubs: { a: { x: 180, y: 150, r: 46, ring: 104 }, b: { x: 180, y: 425, r: 32, ring: 62 } },
};
const START: Member[] = [
  { id: 'alice', name: 'Alice', device: 'phone', Icon: Smartphone, hub: 'a' },
  { id: 'ben', name: 'Ben', device: 'laptop', Icon: Laptop, hub: 'a' },
  { id: 'carla', name: 'Carla', device: 'tablet', Icon: Tablet, hub: 'a' },
  { id: 'dev', name: 'Dev', device: 'desktop', Icon: Monitor, hub: 'a' },
  { id: 'maya', name: 'Maya', device: 'phone', Icon: Smartphone, hub: 'b' },
];

const COMMUNITY_CHIPS = [
  { label: 'Posts', Icon: Newspaper },
  { label: 'Messages', Icon: MessagesSquare },
  { label: 'Files', Icon: FileText },
  { label: 'Atlas', Icon: MapIcon },
];
const STACK_CHIPS = [
  { label: 'HTTPS', Icon: Lock },
  { label: 'API', Icon: Server },
  { label: 'Database', Icon: Database },
  { label: 'Storage', Icon: HardDrive },
];

const NOTE_DEFAULT = 'Drag a member onto the other hub. Click your hub to open it.';

function slotFor(member: Member, all: Member[], hubs: Record<HubId, HubGeo>) {
  const mates = all.filter((m) => m.hub === member.hub);
  const i = mates.findIndex((m) => m.id === member.id);
  const n = Math.max(mates.length, 1);
  const hub = hubs[member.hub];
  const angle = ((-90 + (360 / n) * i + (member.hub === 'b' ? 28 : 0)) * Math.PI) / 180;
  return { x: hub.x + hub.ring * Math.cos(angle), y: hub.y + hub.ring * Math.sin(angle) };
}

export function HubPlayground() {
  const reduceMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const inView = useInView(wrapRef, { amount: 0.1 });
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  const geo = compact ? COMPACT : WIDE;
  const geoRef = useRef(geo);
  const lastGeo = useRef(geo);

  const [members, setMembers] = useState<Member[]>(START);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('community');
  const [offline, setOffline] = useState(false);
  const [note, setNote] = useState(NOTE_DEFAULT);
  const [hoverNote, setHoverNote] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropHub, setDropHub] = useState<HubId | null>(null);
  const [, setTick] = useState(0);

  const membersRef = useRef(members);
  membersRef.current = members;
  const pos = useRef<Record<string, { x: number; y: number; vx: number; vy: number }>>({});
  const drag = useRef<{ id: string; sx: number; sy: number; moved: boolean; x: number; y: number } | null>(null);
  const raf = useRef(0);
  const inViewRef = useRef(false);
  inViewRef.current = inView;
  const reduceRef = useRef(false);
  reduceRef.current = !!reduceMotion;
  const timers = useRef<number[]>([]);

  // First render (and whenever the layout switches): sit every node on its slot, no fly-in.
  geoRef.current = geo;
  if (lastGeo.current !== geo) {
    pos.current = {};
    lastGeo.current = geo;
  }
  for (const m of members) {
    if (!pos.current[m.id]) {
      const s = slotFor(m, members, geo.hubs);
      pos.current[m.id] = { x: s.x, y: s.y, vx: 0, vy: 0 };
    }
  }

  const step = useCallback((t: number) => {
    let moving = false;
    const all = membersRef.current;
    all.forEach((m, i) => {
      const p = pos.current[m.id];
      if (!p) return;
      let target: { x: number; y: number };
      if (drag.current && drag.current.id === m.id) {
        target = { x: drag.current.x, y: drag.current.y };
      } else {
        const s = slotFor(m, all, geoRef.current.hubs);
        const f = reduceRef.current ? 0 : 3;
        target = { x: s.x + Math.sin(t / 1400 + i * 1.7) * f, y: s.y + Math.cos(t / 1700 + i * 2.3) * f };
      }
      p.vx = (p.vx + (target.x - p.x) * 0.12) * 0.78;
      p.vy = (p.vy + (target.y - p.y) * 0.12) * 0.78;
      p.x += p.vx;
      p.y += p.vy;
      if (Math.abs(p.vx) + Math.abs(p.vy) > 0.04) moving = true;
    });
    setTick((n) => (n + 1) % 1_000_000);
    const keepFloating = !reduceRef.current && inViewRef.current;
    raf.current = moving || keepFloating ? requestAnimationFrame(step) : 0;
  }, []);

  const kick = useCallback(() => {
    if (!raf.current) raf.current = requestAnimationFrame(step);
  }, [step]);

  useEffect(() => {
    kick();
  }, [members, inView, reduceMotion, kick]);

  useEffect(() => () => {
    cancelAnimationFrame(raf.current);
    timers.current.forEach((id) => window.clearTimeout(id));
  }, []);

  const toStage = (e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const r = svg.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * geo.W, y: ((e.clientY - r.top) / r.height) * geo.H };
  };

  const nearestHub = (x: number, y: number): { hub: HubId; d: number } => {
    const da = Math.hypot(x - geo.hubs.a.x, y - geo.hubs.a.y);
    const db = Math.hypot(x - geo.hubs.b.x, y - geo.hubs.b.y);
    return da <= db ? { hub: 'a', d: da } : { hub: 'b', d: db };
  };

  const moveMember = (id: string, to: HubId) => {
    const m = membersRef.current.find((x) => x.id === id);
    if (!m || m.hub === to) return;
    setMembers((prev) => prev.map((x) => (x.id === id ? { ...x, hub: to } : x)));
    setHoverNote(null);
    setNote(
      to === 'b'
        ? `${m.name} took their account to the other hub. Data and keys can travel as one encrypted package.`
        : `${m.name} is back. Nobody is locked in to one hub.`,
    );
  };

  const onDown = (e: React.PointerEvent, m: Member) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    const p = toStage(e);
    drag.current = { id: m.id, sx: e.clientX, sy: e.clientY, moved: false, x: p.x, y: p.y };
    setDragId(m.id);
    setHoverNote(null);
    kick();
  };

  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const p = toStage(e);
    d.x = p.x;
    d.y = p.y;
    if (Math.hypot(e.clientX - d.sx, e.clientY - d.sy) > 4) d.moved = true;
    const near = nearestHub(p.x, p.y);
    const me = membersRef.current.find((x) => x.id === d.id);
    setDropHub(me && near.hub !== me.hub && near.d < geo.hubs[near.hub].ring * 1.1 ? near.hub : null);
    kick();
  };

  const onUp = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    setDragId(null);
    setDropHub(null);
    const p = toStage(e);
    const near = nearestHub(p.x, p.y);
    if (d.moved && near.d < geo.hubs[near.hub].ring * 1.1) moveMember(d.id, near.hub);
    kick();
  };

  const onKey = (e: React.KeyboardEvent, m: Member) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      moveMember(m.id, m.hub === 'a' ? 'b' : 'a');
    }
  };

  const describeMember = (m: Member) =>
    mode === 'stack'
      ? `${m.name}'s ${m.device}: just a browser talking to the hub over HTTPS. Nothing to install.`
      : `${m.name}, on a ${m.device}. Just a browser, nothing to install. Drag to another hub.`;

  const toggleOpen = () => {
    const next = !open;
    setOpen(next);
    setHoverNote(null);
    setNote(
      next
        ? mode === 'stack'
          ? 'Under the hood: a web server for HTTPS, an API, a database and file storage, all in Docker on one machine.'
          : 'A hub holds the community’s own feed, messages, files and map, on hardware you control.'
        : NOTE_DEFAULT,
    );
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setOpen(true);
    setNote(
      next === 'stack'
        ? 'Under the hood: a web server for HTTPS, an API, a database and file storage, all in Docker on one machine. A backup job copies it nightly.'
        : 'A hub holds the community’s own feed, messages, files and map, on hardware you control.',
    );
  };

  const pullPlug = () => {
    if (offline) return;
    setOffline(true);
    setNote('Power cut. The hub is down. Nightly backups cover the data, and the watchdog restarts what failed to come up.');
    timers.current.push(
      window.setTimeout(() => {
        setOffline(false);
        setNote('Back online. The watchdog brought the services back up on its own.');
      }, 3200),
    );
  };

  const chips = mode === 'stack' ? STACK_CHIPS : COMMUNITY_CHIPS;
  const shown = hoverNote ?? note;
  const A = geo.hubs.a;
  const B = geo.hubs.b;
  const flowing = !offline && !reduceMotion;

  const segment = (on: boolean) =>
    `rounded-full px-3 py-1 font-mono text-[11px] transition-colors ${
      on ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
    }`;

  const hubMembers = useMemo(() => ({ a: members.filter((m) => m.hub === 'a').length, b: members.filter((m) => m.hub === 'b').length }), [members]);

  return (
    <div ref={wrapRef} className="mx-auto w-full max-w-[560px]">
      <style>{`
        @keyframes cn-flow { to { stroke-dashoffset: -20; } }
        .cn-flow { animation: cn-flow 1.6s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .cn-flow { animation: none; } }
      `}</style>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${geo.W} ${geo.H}`}
        className="h-auto w-full select-none"
        style={{ touchAction: 'pan-y' }}
        role="group"
        aria-label="Interactive diagram of a community hub and its members"
      >
        {/* links */}
        {members.map((m) => {
          const p = pos.current[m.id];
          const hub = geo.hubs[m.hub];
          if (!p) return null;
          return (
            <line
              key={`l-${m.id}`}
              x1={hub.x}
              y1={hub.y}
              x2={p.x}
              y2={p.y}
              stroke={dragId === m.id ? 'var(--foreground)' : 'var(--border)'}
              strokeWidth={1.5}
              strokeDasharray={offline && m.hub === 'a' ? '2 6' : '6 4'}
              opacity={offline && m.hub === 'a' ? 0.5 : 1}
              className={flowing && m.hub === 'a' ? 'cn-flow' : undefined}
            />
          );
        })}

        {/* other hub */}
        <g
          onPointerEnter={() => !drag.current && setHoverNote('Another community’s hub. Its own people, its own data, its own rules. Hubs are independent.')}
          onPointerLeave={() => setHoverNote(null)}
        >
          <circle cx={B.x} cy={B.y} r={B.r + 12} fill="none" stroke={dropHub === 'b' ? '#2563eb' : 'var(--border)'} strokeWidth={dropHub === 'b' ? 2 : 1} strokeDasharray="2 4" />
          <circle cx={B.x} cy={B.y} r={B.r} fill="var(--muted)" stroke={dropHub === 'b' ? '#2563eb' : 'var(--border)'} strokeWidth={1.5} />
          <text x={B.x} y={B.y - 3} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize={8} letterSpacing={1.6}>ANOTHER</text>
          <text x={B.x} y={B.y + 12} textAnchor="middle" className="fill-foreground" fontSize={14} fontWeight={600}>Hub</text>
        </g>

        {/* your hub */}
        <g
          role="button"
          tabIndex={0}
          aria-pressed={open}
          aria-label="Your hub. Press to show what it holds."
          className="cursor-pointer outline-none"
          onClick={toggleOpen}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleOpen(); } }}
          onPointerEnter={() => !drag.current && setHoverNote(open ? 'Click to close.' : 'Your hub. Click to see what it holds.')}
          onPointerLeave={() => setHoverNote(null)}
        >
          <circle cx={A.x} cy={A.y} r={A.r + 14} fill="none" stroke={dropHub === 'a' ? '#2563eb' : 'var(--border)'} strokeWidth={dropHub === 'a' ? 2 : 1} strokeDasharray="2 4" />
          <circle cx={A.x} cy={A.y} r={A.r} fill="var(--muted)" stroke={offline ? 'var(--border)' : 'var(--foreground)'} strokeWidth={1.75} opacity={offline ? 0.6 : 1} />
          {offline ? (
            <>
              <Power x={A.x - 11} y={A.y - 20} width={22} height={22} className="text-muted-foreground" stroke="currentColor" />
              <text x={A.x} y={A.y + 20} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize={9}>offline</text>
            </>
          ) : (
            <>
              <text x={A.x} y={A.y - 6} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize={9} letterSpacing={2.4}>YOUR</text>
              <text x={A.x} y={A.y + 16} textAnchor="middle" className="fill-foreground" fontSize={22} fontWeight={600}>Hub</text>
            </>
          )}
        </g>

        {/* what the hub holds, or the stack it runs on */}
        {open &&
          chips.map((c, i) => {
            const a = ((45 + 90 * i) * Math.PI) / 180;
            const cx = A.x + (compact ? 78 : 84) * Math.cos(a);
            const cy = A.y + (compact ? 78 : 84) * Math.sin(a);
            const Ic = c.Icon;
            return (
              <g key={`${mode}-${c.label}`} transform={`translate(${cx} ${cy})`} className="pointer-events-none">
                <rect x={-35} y={-13} width={70} height={26} rx={13} fill="var(--background)" stroke="var(--border)" />
                <Ic x={-28} y={-6} width={12} height={12} className="text-muted-foreground" stroke="currentColor" />
                <text x={-12} y={4} fontSize={10.5} className="fill-foreground">{c.label}</text>
              </g>
            );
          })}

        {/* members */}
        {members.map((m) => {
          const p = pos.current[m.id];
          if (!p) return null;
          const dragging = dragId === m.id;
          const Ic = m.Icon;
          // name sits on the far side of the node from its hub, so it never lands on the hub
          const hubOf = geo.hubs[m.hub];
          const ux = p.x - hubOf.x;
          const uy = p.y - hubOf.y;
          const ul = Math.hypot(ux, uy) || 1;
          const lx = (ux / ul) * (geo.node + 8);
          const ly = (uy / ul) * (geo.node + 12) + 4;
          return (
            <g
              key={m.id}
              transform={`translate(${p.x} ${p.y})`}
              role="button"
              tabIndex={0}
              aria-label={`${m.name}'s ${m.device}. Press Enter to move to the other hub.`}
              className={`outline-none ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              style={{ touchAction: 'none' }}
              onPointerDown={(e) => onDown(e, m)}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
              onKeyDown={(e) => onKey(e, m)}
              onPointerEnter={() => !drag.current && setHoverNote(describeMember(m))}
              onPointerLeave={() => setHoverNote(null)}
              onFocus={() => setHoverNote(describeMember(m))}
              onBlur={() => setHoverNote(null)}
            >
              <circle r={geo.node + 4} fill="transparent" />
              <circle r={geo.node} fill="var(--background)" stroke={dragging ? 'var(--foreground)' : 'var(--border)'} strokeWidth={dragging ? 2 : 1.5} />
              <Ic x={-geo.node * 0.46} y={-geo.node * 0.46} width={geo.node * 0.92} height={geo.node * 0.92} className="text-muted-foreground" stroke="currentColor" />
              <text x={lx} y={ly} textAnchor="middle" fontSize={geo.label} className="fill-muted-foreground font-mono pointer-events-none">
                {m.name}
              </text>
            </g>
          );
        })}
      </svg>

      <p aria-live="polite" className="mt-1 min-h-[2.75rem] text-sm leading-snug text-muted-foreground">
        {shown}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-full border border-border p-0.5" role="group" aria-label="View">
          <button type="button" onClick={() => switchMode('community')} className={segment(mode === 'community')} aria-pressed={mode === 'community'}>
            Community view
          </button>
          <button type="button" onClick={() => switchMode('stack')} className={segment(mode === 'stack')} aria-pressed={mode === 'stack'}>
            Under the hood
          </button>
        </div>
        <button
          type="button"
          onClick={pullPlug}
          disabled={offline}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60"
        >
          <Power className="h-3 w-3" />
          {offline ? 'Restarting…' : 'Pull the plug'}
        </button>
        <span className="ml-auto font-mono text-[11px] text-muted-foreground/70">
          {hubMembers.a} here · {hubMembers.b} there
        </span>
      </div>
    </div>
  );
}
