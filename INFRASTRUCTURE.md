# Citinet Infrastructure Overview

This document describes the full infrastructure landscape for the Citinet project — how each component is hosted, how they connect, and what role this repo plays.

---

## Components

### 1. Info Site — this repo (`fergtech/citinet-info`)
- **Framework:** Astro 4 + React 19 + Tailwind CSS v4
- **Hosting:** Vercel (auto-deploys on `git push` to `master`)
- **Domains:** `citinet.cloud`, `www.citinet.cloud`
- **Purpose:** Public-facing landing/marketing site. No backend, no auth.

### 2. Web Portal (`fergtech/citinet`)
- **Framework:** React 18 + Vite SPA + PWA (vite-plugin-pwa)
- **Hosting:** Vercel (primary, auto-deploys on `git push`)
- **Domains:**
  - `start.citinet.cloud` — onboarding mode (join or create a hub)
  - `*.citinet.cloud` — hub mode (e.g. `riverdale.citinet.cloud` serves the hub interface)
- **Purpose:** Browser-based interface for all hub interactions. The primary way community members access their hub — no installation required.

### 3. Hub Registry (`fergtech/citinet-registry`)
- **Runtime:** Cloudflare Worker + Workers KV
- **Domain:** `registry.citinet.cloud`
- **Deploy:** `npx wrangler deploy` (manual, requires CF API token with Workers Scripts: Edit)
- **Purpose:** Central directory of all active hubs. Stores hub metadata (slug, name, tunnel URL, online status). Hubs auto-register their URL on every tunnel start.

### 4. Hub Management App (`fergtech/citinet-client`)
- **Framework:** Tauri 2 + React 19 desktop app
- **Platform:** Windows (.msi installer via WiX)
- **Distribution:** GitHub Releases — `https://github.com/fergtech/citinet-client/releases`
- **Purpose:** Runs on the hub operator's machine. Manages Docker containers (the hub stack), configures public access tunnels (Tailscale Funnel, Cloudflare, or custom), exposes a local API on port 9090, and registers the hub with the registry. This is a management/admin tool — community members access hubs through the web portal above.
- **Coming soon:** A simplified one-click launcher (Python/Tkinter) for non-technical hub operators.

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
Hub operator sets up their machine:
    → Docker Compose starts the hub stack (storage, API, messaging)
    → Hub API starts on port 9090
    → Operator configures public access via their chosen gateway:
        - Tailscale Funnel → stable https://name.tailXXXX.ts.net URL (recommended)
        - Cloudflare Tunnel → custom domain at {name}.citinet.cloud
        - Reverse proxy / local-only → operator's choice
    → Tunnel URL auto-registered with registry.citinet.cloud

Community member visits start.citinet.cloud
    → discovers hub in directory (fetches registry)
    → joins hub → navigates to riverdale.citinet.cloud
    → web portal fetches registry to get current tunnel URL
    → connects directly to hub API
```

---

## Known Limitations

- **Wildcard on CF Workers:** `*.citinet.cloud` must stay on Cloudflare Workers because Vercel Free does not support wildcard custom domains.
- **Registry is CF-only:** `registry.citinet.cloud` cannot move off Cloudflare without migrating the KV store.
- **Registrar transfer lock:** citinet.cloud is subject to a 60-day ICANN transfer lock from registration (~April 2026 to transfer if desired).
- **Local-only hubs:** Hubs without a public tunnel can still operate on a local network but won't appear in the registry or be accessible from outside.

---

## Deployment Summary

| Component | How to deploy |
|-----------|---------------|
| Info site (this repo) | `git push` → Vercel auto-deploys |
| Web portal | `git push` → Vercel + CF Workers auto-deploy |
| Registry | `npx wrangler deploy` (manual) |
| Hub management app | `npm run tauri build` with signing key env var set, upload artifacts to GitHub release |
