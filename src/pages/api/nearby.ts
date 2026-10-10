// Same-origin helper for the "Imagine it near you" demo on /statement.
//
// Browsers can't reliably talk to the volunteer-run public Overpass servers (most don't send CORS headers
// and they are often busy), so this asks them from the server instead, trying several at once and taking
// the first good answer. It also keeps the visitor's IP address away from those servers. Nothing is logged
// or stored here; the answer is cached briefly by the CDN.

export const prerender = false;

const MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

async function ask(query: string, ms: number): Promise<unknown[]> {
  return Promise.any(
    MIRRORS.map(async (url) => {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), ms);
      try {
        const res = await fetch(url, {
          method: 'POST',
          body: 'data=' + encodeURIComponent(query),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'citinet-info-demo (info.citinet.cloud)' },
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        if (!Array.isArray(data.elements)) throw new Error('bad response');
        return data.elements as unknown[];
      } finally {
        clearTimeout(t);
      }
    }),
  );
}

export async function GET({ url }: { url: URL }) {
  const lat = Number(url.searchParams.get('lat'));
  const lon = Number(url.searchParams.get('lon'));
  const radius = Math.min(20000, Math.max(1000, Number(url.searchParams.get('r')) || 6000));
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return new Response(JSON.stringify({ error: 'bad coordinates' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const placesQuery =
    `[out:json][timeout:12];node(around:${radius},${lat},${lon})[place~"^(suburb|neighbourhood|quarter|village|town|hamlet|city_district)$"][name];out 120;`;
  // the public servers drop requests when busy; one more try is usually enough
  const places = ask(placesQuery, 9000).catch(() => ask(placesQuery, 9000));
  const anchors = ask(
    `[out:json][timeout:10];nwr(around:${radius},${lat},${lon})[amenity~"^(library|community_centre|townhall)$"][name];out center 40;`,
    11000,
  ).catch(() => [] as unknown[]);

  try {
    const p = await places;
    // community buildings are a heavier query; don't hold the answer up for them
    const a = await Promise.race([anchors, new Promise<unknown[]>((r) => setTimeout(() => r([]), 3500))]);
    const body = { places: p, anchors: a };
    return new Response(JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
        // a thin answer (no community buildings) is cached only briefly so it can fill in next time
        'Cache-Control': a.length ? 'public, s-maxage=86400, stale-while-revalidate=604800' : 'public, s-maxage=300',
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'upstream unavailable' }), { status: 502, headers: { 'Content-Type': 'application/json' } });
  }
}
