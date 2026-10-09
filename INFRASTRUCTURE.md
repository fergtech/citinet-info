# Citinet Infrastructure Overview

This document describes the full infrastructure landscape for the Citinet project — how each component is hosted, how they connect, and what role this repo plays.

---

## Components

### 1. Info Site — this repo (`fergtech/citinet-info`)
- **Framework:** Astro 5 + React 18 + Tailwind CSS v4
- **Hosting:** Vercel (auto-deploys on `git push`)
- **Domain:** `info.citinet.cloud`
- **Purpose:** Public-facing landing/marketing site and blog. No auth. The blog reads posts published by a hub from the registry repo's `blog-posts.json`.

### 2. Web Portal and Hub Stack (`fergtech/citinet`)
- **Web portal:** React 18 + Vite SPA + PWA, hosted on Vercel. It is the primary way members use a hub; no installation required.
- **Hub stack:** Docker Compose project the operator runs on their own machine: `citinet-api` (Node/Express), PostgreSQL, MinIO, Caddy (automatic HTTPS), `citinet-backup`, and the internal `citinet-admin` sidecar (watchdog, backup verification, alerts). Optional: Ollama (local AI assistant) and LiveKit (calls and broadcasts).
- **Domains:**
  - `citinet.cloud` (redirects to `www.citinet.cloud`) — onboarding (`/create` and `/join`)
  - `<slug>.citinet.cloud` — hub mode for the web portal
  - `<slug>.hub.citinet.cloud` — each hub's own browser-trusted HTTPS address, issued automatically by a central cert broker
- **Purpose:** Browser-based interface for all hub interactions, and the generator for the hub's OS-specific setup script.

### 3. Hub Registry (`fergtech/citinet-registry`)
- **Runtime:** GitHub-backed JSON (`registry.json`, `blog-posts.json`), updated through a Vercel serverless function in the web portal repo.
- **Purpose:** Public directory of active hubs (slug, name, URL, online status) and the feed of hub-published blog posts. Hubs self-register when they go public.

### 4. Hub Setup and Management
- **Setup:** the hub creation wizard in the web portal generates a setup script for Windows, macOS, or Linux. The script installs Docker, writes the hub's `.env`, and starts the stack.
- **Day-to-day:** Hub Management in the web portal (including the **System** tab for service status/restarts, alerts, and off-site backup), plus the `citinet` helper on the hub machine.

---

## DNS Configuration (`citinet.cloud` — Cloudflare nameservers)

| Record | Type | Target | CF Proxy | Purpose |
|--------|------|--------|----------|---------|
| `citinet.cloud` | CNAME | `cname.vercel-dns.com` | OFF | Web portal onboarding (redirects to `www`) |
| `www` | CNAME | `cname.vercel-dns.com` | OFF | Web portal onboarding |
| `info` | CNAME | `cname.vercel-dns.com` | OFF | Info site (this repo) |
| `*` | CNAME | `citinet-web.tdyfrvr.workers.dev` | ON | Hub subdomains (web portal via CF Worker) |

> `*.citinet.cloud` must stay on Cloudflare: CF Workers require the orange cloud proxy.

---

## Hub Connectivity Flow

```
Hub operator sets up their machine:
    → Wizard generates a setup script; running it installs Docker and starts the hub stack
    → Caddy serves the hub over HTTPS at https://<slug>.hub.citinet.cloud
      (certificate issued automatically; works for anyone on the same LAN)
    → Access beyond the LAN, operator's choice:
        - Tailscale (Funnel or tailnet) → https://<machine>.<tailnet>.ts.net
        - Cloudflare Tunnel, reverse proxy, or local-only
    → Hub registers its URL in the public registry

Community member visits citinet.cloud
    → discovers hub in the directory (or enters its address)
    → requests an account; the hub admin approves it
    → web portal connects directly to the hub API
```

---

## Known Limitations

- **Wildcard on CF Workers:** `*.citinet.cloud` must stay on Cloudflare Workers because Vercel Free does not support wildcard custom domains.
- **Registrar transfer lock:** citinet.cloud is subject to a 60-day ICANN transfer lock from registration (~April 2026 to transfer if desired).
- **Local-only hubs:** Hubs without a public tunnel can still operate on a local network but won't appear in the registry or be accessible from outside.

---

## Deployment Summary

| Component | How to deploy |
|-----------|---------------|
| Info site (this repo) | `git push` → Vercel auto-deploys |
| Web portal | `git push` → Vercel + CF Workers auto-deploy |
