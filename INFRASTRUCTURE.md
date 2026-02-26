# Citinet Infrastructure Overview

This document describes the full infrastructure landscape for the Citinet project — how each component is hosted, how they connect, and what role this repo plays.

---

## Components

### 1. Info Site — this repo (`fergtech/citinet-info`)
- **Framework:** Astro 5 (static output) + React components + Tailwind CSS v4
- **Hosting:** Vercel (auto-deploys on `git push` to `master`)
- **Domains:** `citinet.cloud`, `www.citinet.cloud`
- **Purpose:** Public-facing landing/marketing site. No backend, no auth.

### 2. Web Portal (`fergtech/citinet`)
- **Framework:** React 18 + Vite SPA + PWA (vite-plugin-pwa)
- **Hosting:** Vercel (primary, auto-deploys on `git push`)
- **Domains:**
  - `start.citinet.cloud` — onboarding mode (join or create a hub)
  - `*.citinet.cloud` — hub mode (e.g. `riverdale.citinet.cloud` serves the hub interface)
- **Purpose:** Browser-based client for all hub interactions. Subdomain determines mode — `start` runs the onboarding flow, any other subdomain is a specific hub's interface.

### 3. Hub Registry (`fergtech/citinet-registry`)
- **Runtime:** Cloudflare Worker + Workers KV
- **Domain:** `registry.citinet.cloud`
- **Deploy:** `npx wrangler deploy` (manual, requires CF API token with Workers Scripts: Edit)
- **Purpose:** Central directory of all active hubs. Stores hub metadata (slug, name, tunnel URL, online status). Hub clients auto-register their tunnel URL on every start.

### 4. Desktop Hub Client (`fergtech/citinet-client`)
- **Framework:** Tauri 2 + React 19 desktop app
- **Platform:** Windows (.msi installer via WiX)
- **Distribution:** GitHub Releases — `https://github.com/fergtech/citinet-client/releases`
- **Auto-update endpoint:** `https://github.com/fergtech/citinet-client/releases/latest/download/update.json`
- **Purpose:** Runs on the hub operator's machine. Manages Docker containers, creates Cloudflare quick tunnels, exposes a local API on port 9090, and registers the hub with the registry.

---

## DNS Configuration (`citinet.cloud` — Cloudflare nameservers)

| Record | Type | Target | CF Proxy | Purpose |
|--------|------|--------|----------|---------|
| `citinet.cloud` | CNAME | `cname.vercel-dns.com` | OFF | Info site (this repo) |
| `www` | CNAME | `cname.vercel-dns.com` | OFF | Info site www |
| `start` | CNAME | `cname.vercel-dns.com` | OFF | Web portal onboarding |
| `*` | CNAME | `citinet-web.tdyfrvr.workers.dev` | ON | Hub subdomains (web portal via CF Worker) |
| `registry` | Worker route | `citinet-registry` Worker | ON | Hub registry API |

> `registry.citinet.cloud` and `*.citinet.cloud` must stay on Cloudflare — CF Workers require the orange cloud proxy.

---

## Hub Connectivity Flow

```
Hub operator installs desktop client
    → starts Cloudflare quick tunnel on port 9090 (trycloudflare.com)
    → tunnel URL auto-registered with registry.citinet.cloud

User visits start.citinet.cloud
    → discovers hub in directory (fetches registry)
    → joins hub → navigates to riverdale.citinet.cloud
    → web portal fetches registry to get current tunnel URL
    → connects directly to abc123.trycloudflare.com
```

---

## Known Limitations

- **IPv6-only tunnels:** `trycloudflare.com` quick tunnels have no IPv4 A records. Users on IPv4-only connections cannot reach hub APIs.
- **Wildcard on CF Workers:** `*.citinet.cloud` must stay on Cloudflare Workers because Vercel Free does not support wildcard custom domains.
- **Registry is CF-only:** `registry.citinet.cloud` cannot move off Cloudflare without migrating the KV store.
- **Registrar transfer lock:** citinet.cloud is subject to a 60-day ICANN transfer lock from registration (~April 2026 to transfer to Namecheap or similar).

---

## Deployment Summary

| Component | How to deploy |
|-----------|---------------|
| Info site (this repo) | `git push` → Vercel auto-deploys |
| Web portal | `git push` → Vercel + CF Workers auto-deploy |
| Registry | `npx wrangler deploy` (manual) |
| Desktop client | `npm run tauri build` with signing key env var set, upload artifacts to GitHub release |
