import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Loader2, MapPin } from 'lucide-react';

// "What might this look like where I live?" A visitor picks a town, neighbourhood or ZIP and a possible
// Citinet network draws itself from real places near it: neighbourhoods, towns, libraries, community
// centres and town halls. The hubs are illustrative -- none of them exist -- and the page says so.
//
// Place suggestions come from Photon (an OpenStreetMap geocoder built for type-ahead); ZIP codes go through
// Nominatim; nearby places come from Overpass. All of it runs from the visitor's browser and nothing is
// stored by Citinet. Picking from the list (rather than free text) is what keeps "Baltimore" and
// "Baltimore, MD" from meaning different places.

const W = 640;
const H = 420;
const CX = W / 2;
const CY = H / 2;

type Kind = 'center' | 'place' | 'anchor';
interface NodeT { id: string; name: string; x: number; y: number; w: number; kind: Kind }
interface Found { name: string; kind: 'place' | 'anchor'; lat?: number; lon?: number }
interface Suggestion { label: string; short: string; lat: number; lon: number }
type Phase = 'idle' | 'locating' | 'finding' | 'drawing' | 'done' | 'error';

const PHOTON = 'https://photon.komoot.io/api/';
const NOMINATIM = 'https://nominatim.openstreetmap.org';

const EXAMPLES = ['Joppa, Maryland', 'Baltimore, Maryland', 'Seattle, Washington', 'Chicago, Illinois'];

// housing-development names ("Oaklyn Manor", "Kenwood Farm Estates") make poor hubs
const SUBDIVISION = /\b(estates?|manor|apartments?|homes|acres|cottages?|condos?|townhomes?|villas?|terrace|gardens|crossing|landing|place|courts?|meadows|hills|heights|green|pointe|enclave)\s*$/i;
const PLACE_RANK: Record<string, number> = { city: 0, town: 0, suburb: 1, city_district: 1, village: 1, quarter: 2, neighbourhood: 2, hamlet: 3 };
// only names a visitor can read: Latin script (with accents)
const READABLE = /^[ -ɏ‐-’]+$/;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function getJson(url: string, init: RequestInit = {}, ms = 10000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { ...init, signal: ctrl.signal });
    if (!res.ok) throw new Error(String(res.status));
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

const hubName = (n: string) => {
  const t = /\bhub\b/i.test(n) ? n : `${n} Hub`;
  return t.length > 26 ? t.slice(0, 24).trimEnd() + '… Hub' : t;
};

async function photon(q: string, limit = 6): Promise<Suggestion[]> {
  const url = `${PHOTON}?q=${encodeURIComponent(q)}&limit=${limit}&lang=en&layer=city&layer=district&layer=locality`;
  const data = await getJson(url, {}, 8000);
  const seen = new Set<string>();
  const out: Suggestion[] = [];
  for (const f of data.features ?? []) {
    const p = f.properties ?? {};
    const c = f.geometry?.coordinates;
    if (!p.name || !c || !READABLE.test(p.name)) continue;
    const label = [p.name, p.county && p.county !== p.name ? p.county : null, p.state, p.country].filter(Boolean).join(', ');
    if (seen.has(label)) continue;
    seen.add(label);
    out.push({ label, short: p.name, lat: c[1], lon: c[0] });
  }
  return out;
}

async function zipLookup(zip: string): Promise<Suggestion | null> {
  const r = await getJson(`${NOMINATIM}/search?format=jsonv2&limit=1&addressdetails=1&accept-language=en&postalcode=${encodeURIComponent(zip)}&countrycodes=us`);
  const hit = Array.isArray(r) ? r[0] : null;
  if (!hit) return null;
  const lat = parseFloat(hit.lat);
  const lon = parseFloat(hit.lon);
  let short = hit.address?.county ?? zip;
  try {
    const rev = await getJson(`${NOMINATIM}/reverse?format=jsonv2&zoom=14&accept-language=en&lat=${lat}&lon=${lon}`, {}, 6000);
    const a = rev.address ?? {};
    short = a.city ?? a.town ?? a.village ?? a.suburb ?? a.hamlet ?? short;
  } catch { /* the county name is a fine label */ }
  return { label: hit.display_name ?? zip, short, lat, lon };
}

const key0 = (n: string) => n.toLowerCase().replace(/[^a-z0-9]/g, '');

// Nearby places come from our own /api/nearby route, which asks the public Overpass servers (browsers can't
// reach them reliably). Places are required; community buildings are best-effort.
async function findPlaces(lat: number, lon: number, exclude: string): Promise<Found[]> {
  let places: any[] = [];
  let anchorEls: any[] = [];
  for (const r of [6000, 16000]) {
    const url = `/api/nearby?lat=${lat}&lon=${lon}&r=${r}`;
    const data = await getJson(url, {}, 22000).catch(() => getJson(url, {}, 22000));
    places = data.places ?? [];
    anchorEls = data.anchors ?? [];
    if (places.length >= 3) break;
  }

  const seen = new Set<string>([exclude.toLowerCase()]);
  const keep = (el: any, isPlace: boolean) => {
    const name: string | undefined = el.tags?.['name:en'] ?? el.tags?.name;
    const la = el.lat ?? el.center?.lat;
    const lo = el.lon ?? el.center?.lon;
    if (!name || la == null || lo == null || name.length > 21 || !READABLE.test(name) || SUBDIVISION.test(name)) return null;
    // "Downtown" and "Downtown Baltimore" both next to a Baltimore hub is just noise
    if (key0(name).includes(key0(exclude)) || /^downtown$/i.test(name)) return null;
    const key = name.toLowerCase();
    if (seen.has(key)) return null;
    seen.add(key);
    const d = Math.hypot((lo - lon) * Math.cos((lat * Math.PI) / 180), la - lat);
    const rank = isPlace ? PLACE_RANK[el.tags?.place as string] ?? 3 : 0;
    return { name, kind: isPlace ? 'place' : 'anchor', lat: la, lon: lo, d: d + rank * 0.004 } as Found & { d: number };
  };
  const ps = places.map((e) => keep(e, true)).filter(Boolean) as Array<Found & { d: number }>;
  const as = anchorEls.map((e) => keep(e, false)).filter(Boolean) as Array<Found & { d: number }>;
  ps.sort((x, y) => x.d - y.d);
  as.sort((x, y) => x.d - y.d);
  const picked: Found[] = [...ps.slice(0, as.length ? 4 : 5), ...as.slice(0, 2)];
  return picked.length >= 3 ? picked : [];
}

function layout(found: Found[], lat0: number, lon0: number, label: string): NodeT[] {
  const pts = found.map((f) =>
    f.lat != null && f.lon != null
      ? { dx: (f.lon - lon0) * Math.cos((lat0 * Math.PI) / 180) * 111320, dy: -(f.lat - lat0) * 110540 }
      : null,
  );
  const real = pts.some(Boolean);
  const maxDx = Math.max(1, ...pts.map((p) => (p ? Math.abs(p.dx) : 0)));
  const maxDy = Math.max(1, ...pts.map((p) => (p ? Math.abs(p.dy) : 0)));
  const sx = real ? 235 / maxDx : 1;
  const sy = real ? 160 / maxDy : 1;
  const width = (name: string) => Math.max(44, name.length * 7);

  const cName = label.length > 24 ? label.slice(0, 22).trimEnd() + '…' : label;
  const nodes: NodeT[] = [{ id: 'c', name: cName, x: CX, y: CY, w: width(cName), kind: 'center' }];
  found.forEach((f, i) => {
    const p = pts[i];
    let x: number;
    let y: number;
    if (p) {
      x = CX + p.dx * sx;
      y = CY + p.dy * sy;
    } else {
      const a = (-90 + (360 / found.length) * i) * (Math.PI / 180);
      x = CX + 220 * Math.cos(a);
      y = CY + 150 * Math.sin(a);
    }
    const name = hubName(f.name);
    nodes.push({ id: `n${i}`, name, x, y, w: width(name), kind: f.kind });
  });

  // relax: nobody's circle or label may sit on top of another's (boxes, pushed apart on the easier axis)
  const boxH = 76;
  for (let iter = 0; iter < 60; iter++) {
    let moved = false;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const ox = (a.w + b.w) / 2 + 12 - Math.abs(b.x - a.x);
        const oy = boxH - Math.abs(b.y - a.y);
        if (ox <= 0 || oy <= 0) continue;
        moved = true;
        const alongX = ox < oy;
        const sign = alongX ? (b.x >= a.x ? 1 : -1) : (b.y >= a.y ? 1 : -1);
        const push = (alongX ? ox : oy) / 2 + 0.5;
        const aFixed = a.kind === 'center';
        const bFixed = b.kind === 'center';
        if (alongX) {
          if (!aFixed) a.x -= sign * (bFixed ? push * 2 : push);
          if (!bFixed) b.x += sign * (aFixed ? push * 2 : push);
        } else {
          if (!aFixed) a.y -= sign * (bFixed ? push * 2 : push);
          if (!bFixed) b.y += sign * (aFixed ? push * 2 : push);
        }
      }
    }
    for (const n of nodes) {
      n.x = Math.min(W - n.w / 2 - 8, Math.max(n.w / 2 + 8, n.x));
      n.y = Math.min(H - 76, Math.max(28, n.y));
    }
    if (!moved) break;
  }
  // centre the whole cluster (searched place included) in the canvas, keeping the real relative positions
  const minX = Math.min(...nodes.map((n) => n.x - n.w / 2));
  const maxX = Math.max(...nodes.map((n) => n.x + n.w / 2));
  const minY = Math.min(...nodes.map((n) => n.y));
  const maxY = Math.max(...nodes.map((n) => n.y));
  const shiftX = CX - (minX + maxX) / 2;
  const shiftY = CY - 12 - (minY + maxY) / 2;
  for (const n of nodes) {
    n.x += shiftX;
    n.y += shiftY;
  }
  return nodes;
}

// Every hub is a peer: link each to its nearest neighbours (a connected mesh), never to a single centre.
function links(nodes: NodeT[]): Array<[NodeT, NodeT]> {
  const hubs = nodes.slice(1);
  const out: Array<[NodeT, NodeT]> = [];
  const has = (a: NodeT, b: NodeT) => out.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
  const dist = (a: NodeT, b: NodeT) => Math.hypot(a.x - b.x, a.y - b.y);
  // connect everything: grow a tree from the first hub, always adding the closest unconnected hub
  const inTree = [hubs[0]];
  const rest = hubs.slice(1);
  while (rest.length) {
    let best: [NodeT, NodeT] | null = null;
    for (const r of rest) for (const t of inTree) if (!best || dist(r, t) < dist(best[0], best[1])) best = [r, t];
    if (!best) break;
    out.push([best[1], best[0]]);
    inTree.push(best[0]);
    rest.splice(rest.indexOf(best[0]), 1);
  }
  // then a second nearby link per hub so it reads as a mesh rather than a tree
  for (const h of hubs) {
    const near = hubs.filter((m) => m !== h && !has(h, m)).sort((x, y) => dist(h, x) - dist(h, y))[0];
    if (near && dist(h, near) < 300) out.push([h, near]);
  }
  return out;
}

const STATUS: Record<Phase, string> = {
  idle: 'Start typing a town or neighborhood, or enter a ZIP code.',
  locating: 'Finding your area…',
  finding: 'Looking for nearby neighborhoods and community places…',
  drawing: 'Drawing a possible network…',
  done: '',
  error: '',
};

const DEFAULT_NODES: NodeT[] = [
  { id: 'c', name: 'Your neighborhood', x: CX, y: CY, w: 120, kind: 'center' },
  { id: 'g1', name: 'Library Hub', x: CX - 215, y: CY - 105, w: 80, kind: 'anchor' },
  { id: 'g2', name: 'Community Center Hub', x: CX + 200, y: CY - 110, w: 150, kind: 'anchor' },
  { id: 'g3', name: 'Town Hall Hub', x: CX + 220, y: CY + 100, w: 100, kind: 'anchor' },
  { id: 'g4', name: 'Makerspace Hub', x: CX - 200, y: CY + 110, w: 110, kind: 'anchor' },
];

export function ImagineYourArea() {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState<Suggestion | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [phase, setPhase] = useState<Phase>('idle');
  const [nodes, setNodes] = useState<NodeT[]>(DEFAULT_NODES);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const run = useRef(0);
  const sugRun = useRef(0);
  const quiet = useRef(false); // set when the app (not the visitor) changed the text
  const box = useRef<HTMLDivElement>(null);

  // type-ahead: suggestions from a real geocoder, a little after the visitor stops typing
  useEffect(() => {
    const q = query.trim();
    if (quiet.current) {
      quiet.current = false;
      setSuggestions([]);
      return;
    }
    if (picked || q.length < 3 || /^\d+$/.test(q)) {
      setSuggestions([]);
      return;
    }
    const id = ++sugRun.current;
    const t = setTimeout(async () => {
      try {
        const s = await photon(q);
        if (id !== sugRun.current) return;
        setSuggestions(s);
        setActive(-1);
        setOpen(s.length > 0);
      } catch {
        if (id === sugRun.current) setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query, picked]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const generate = async (place: Suggestion) => {
    const id = ++run.current;
    const stale = () => id !== run.current;
    setError('');
    setOpen(false);
    setPhase('finding');
    if (!reduce) await sleep(250);
    let found: Found[] = [];
    try {
      found = await findPlaces(place.lat, place.lon, place.short);
    } catch {
      found = [];
    }
    if (stale()) return;
    if (found.length < 2) {
      setPhase('error');
      setError('I could not find named neighborhoods around that place. Try a nearby larger town.');
      return;
    }
    setPhase('drawing');
    if (!reduce) await sleep(400);
    if (stale()) return;
    setNodes(layout(found, place.lat, place.lon, place.short));
    setTitle(place.short);
    setPhase('done');
  };

  const submit = async (value: string, choice: Suggestion | null = picked) => {
    const q = value.trim();
    if (!q && !choice) return;
    const id = ++run.current;
    setError('');
    setOpen(false);
    setPhase('locating');
    try {
      let place = choice;
      if (!place) {
        if (/^\d{5}$/.test(q)) {
          place = await zipLookup(q);
          if (!place) throw new Error('zip');
        } else {
          place = (await photon(q, 1))[0] ?? null;
          if (!place) throw new Error('none');
        }
        if (id !== run.current) return;
        setQuery(place.label);
        setPicked(place);
      }
      await generate(place);
    } catch (e) {
      if (id !== run.current) return;
      setPhase('error');
      const m = (e as Error).message;
      setError(
        m === 'zip' || m === 'none'
          ? "I couldn't find that place. Try a town, neighborhood, or a 5-digit US ZIP code."
          : 'The place lookup is not responding right now. Try again in a moment.',
      );
    }
  };

  const choose = (s: Suggestion) => {
    setQuery(s.label);
    setPicked(s);
    setSuggestions([]);
    setOpen(false);
    void submit(s.label, s);
  };

  const busy = phase === 'locating' || phase === 'finding' || phase === 'drawing';
  const edges = links(nodes);

  return (
    <div className="rounded-2xl border border-border bg-card/40 p-5">
      <p className="font-mono text-[0.72rem] uppercase tracking-[0.1em] text-muted-foreground">Imagine it near you</p>
      <h3 className="font-display mt-3 text-[clamp(1.15rem,1.6vw,1.4rem)] leading-tight tracking-[-0.01em] text-foreground">
        What might this look like where you live?
      </h3>

      <form
        className="mt-5 flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          if (open && active >= 0 && suggestions[active]) choose(suggestions[active]);
          else void submit(query);
        }}
      >
        <div ref={box} className="relative min-w-0 flex-1">
          <input
            value={query}
            onChange={(e) => {
              quiet.current = false;
              setQuery(e.target.value);
              setPicked(null);
            }}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            onKeyDown={(e) => {
              if (!open || suggestions.length === 0) return;
              if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (a + 1) % suggestions.length); }
              else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a <= 0 ? suggestions.length - 1 : a - 1)); }
              else if (e.key === 'Escape') setOpen(false);
            }}
            role="combobox"
            aria-expanded={open}
            aria-controls="imagine-suggestions"
            aria-autocomplete="list"
            aria-label="Town, neighborhood, or ZIP code"
            placeholder="Town, neighborhood, or ZIP code"
            autoComplete="off"
            className="h-11 w-full rounded-full border border-border bg-background px-5 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-foreground/40"
          />
          {open && suggestions.length > 0 && (
            <ul
              id="imagine-suggestions"
              role="listbox"
              className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-2xl border border-border bg-background py-1.5 shadow-lg"
            >
              {suggestions.map((s, i) => (
                <li key={s.label} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => choose(s)}
                    onMouseEnter={() => setActive(i)}
                    className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-foreground ${i === active ? 'bg-muted' : ''}`}
                  >
                    <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{s.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="submit"
          disabled={busy || !query.trim()}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {busy ? 'Working…' : 'Show me'}
          {!busy && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Try:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            disabled={busy}
            onClick={() => {
              quiet.current = true;
              setQuery(ex);
              setPicked(null);
              void submit(ex, null);
            }}
            className="rounded-full border border-border px-3 py-1 text-sm text-foreground transition-colors hover:bg-muted disabled:opacity-50"
          >
            {ex}
          </button>
        ))}
      </div>

      <div className="relative mt-5 overflow-hidden rounded-xl border border-border bg-background">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 text-muted-foreground"
          style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1.3px)',
            backgroundSize: '20px 20px',
            opacity: 0.22,
            maskImage: 'radial-gradient(ellipse closest-side at 50% 50%, #000 35%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse closest-side at 50% 50%, #000 35%, transparent 100%)',
          }}
        />
        <svg viewBox={`0 0 ${W} ${H}`} className="relative block h-auto w-full" role="img" aria-label={title ? `A possible Citinet network around ${title}` : 'An example Citinet network'}>
          <AnimatePresence>
            {edges.map(([a, b]) => (
              <motion.line
                key={`${a.id}-${b.id}-${a.name}-${b.name}`}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke="var(--muted-foreground)" strokeWidth={1.5} strokeDasharray="6 5" strokeOpacity={0.55}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: reduce ? 0 : 0.25 }}
              />
            ))}
          </AnimatePresence>
          <AnimatePresence>
            {nodes.map((n, i) => {
                            const center = n.kind === 'center';
              return (
                <motion.g
                  key={`${n.id}-${n.name}`}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: reduce ? 0 : 0.08 * i }}
                >
                  {center ? (
                    // the place that was searched: a map pin-style marker, deliberately not a hub
                    <>
                      <circle cx={n.x} cy={n.y} r={9} fill="none" stroke="var(--muted-foreground)" strokeWidth={1.2} />
                      <line x1={n.x - 15} y1={n.y} x2={n.x - 5} y2={n.y} stroke="var(--muted-foreground)" strokeWidth={1.2} />
                      <line x1={n.x + 5} y1={n.y} x2={n.x + 15} y2={n.y} stroke="var(--muted-foreground)" strokeWidth={1.2} />
                      <line x1={n.x} y1={n.y - 15} x2={n.x} y2={n.y - 5} stroke="var(--muted-foreground)" strokeWidth={1.2} />
                      <line x1={n.x} y1={n.y + 5} x2={n.x} y2={n.y + 15} stroke="var(--muted-foreground)" strokeWidth={1.2} />
                      <circle cx={n.x} cy={n.y} r={2.5} fill="var(--muted-foreground)" />
                    </>
                  ) : (
                    <circle cx={n.x} cy={n.y} r={13} fill="var(--background)" stroke="var(--foreground)" strokeWidth={1.5} strokeOpacity={0.85} />
                  )}
                  <text
                    x={n.x} y={n.y + (center ? 30 : 32)}
                    textAnchor="middle" fontSize={center ? 12 : 12.5} fontWeight={center ? 400 : 500} fontStyle={center ? 'italic' : 'normal'}
                    fill={center ? 'var(--muted-foreground)' : 'var(--foreground)'}
                  >
                    {n.name}
                  </text>
                </motion.g>
              );
            })}
          </AnimatePresence>
        </svg>

        <div className="pointer-events-none absolute bottom-3 left-4 right-4 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-full border border-foreground/80" /> possible hub, all equal</span>
          <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 text-[10px] leading-3">⌖</span> you searched</span>
          <span className="inline-flex items-center gap-1.5"><span className="inline-block w-5 border-t border-dashed border-muted-foreground" /> sharing (still being built)</span>
        </div>
        {(busy || phase === 'idle') && (
          <p className="absolute left-4 top-3 flex items-center gap-2 font-mono text-xs text-muted-foreground" aria-live="polite">
            {busy && <Loader2 className="h-3 w-3 animate-spin" />}
            {STATUS[phase]}
          </p>
        )}
        {phase === 'error' && (
          <p className="absolute left-4 top-3 max-w-[80%] text-sm text-foreground" role="alert">{error}</p>
        )}
      </div>

      <div className="mt-4 space-y-1 text-[12.5px] leading-relaxed text-muted-foreground">
        <p>
          <strong className="font-semibold text-foreground">Illustrative only.</strong>{' '}
          {phase === 'done' && title ? `A possible network around ${title}: ` : ''}
          these hubs do not exist yet, and none is a centre. Names and positions come from OpenStreetMap.
        </p>
        <p>Your search goes to OpenStreetMap-based lookup services (Photon, Nominatim, Overpass). Citinet does not store it.</p>
      </div>
    </div>
  );
}
