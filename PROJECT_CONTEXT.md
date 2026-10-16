# Life in Africa — Project Context

**Last Updated:** 2026-10-12
**Status:** Product Identity & Landing Page Redesigned for Life in Africa

---

## 1. Current Project Identity

**Product Name:** Life in Africa
**Product Type:** Browser-based life simulation game (responsive web, not a native mobile app)
**Core Promise:** An original, immersive life simulation where players build a life across African countries and communities through meaningful choices, persistent progress, and interconnected systems.
**Target Audience:** Adults (18+)
**Monetisation:** Free-to-play; no pay-to-win, no mandatory subscriptions, no forced ads. Future revenue from clearly labelled sponsorships, in-world billboards, and partnerships only.

---

## 2. Approved Brand Identity (Preserve Exactly)

| Token | Value | Usage |
|-------|-------|-------|
| Deep Navy | `#202331` | Main logo/text, strong surfaces |
| Life Red | `#F0443E` | Origin point, important moments, danger/action |
| Choice Blue | `#2764D8` | Active path, selection, links, interaction |
| Warm Ivory | `#F5F1E8` | Light brand background |
| Dark Background | `#11131C` | Dark game interface background |
| Muted Text | `#626776` | Secondary text on light surfaces |
| Earth Accent | `#8A6048` | Environmental/housing details (optional) |

**Typography:** Sora (display/headings), Inter (body/UI)
**Logo Concept:** Branching tree/network mark — red origin point = life beginning; branches = choices/futures; blue point = player's current path.
**Landing Page:** Approved design — do not redesign.

---

## 3. Verified Technology Stack

| Layer | Technology | Version | Status |
|-------|------------|---------|--------|
| Build | Vite | 5.4.7 | ✅ Working |
| Framework | React | 18.3.1 | ✅ Working |
| Language | TypeScript | 5.6.2 (strict) | ✅ Working |
| Styling | Tailwind CSS | 3.4.11 | ✅ Working |
| State | Zustand | 4.5.5 | 🟡 Installed, not yet used in game logic |
| Routing | React Router DOM | 6.26.2 | ✅ Working |
| Auth/Backend | Supabase JS | 2.45.4 | 🟡 Configured, placeholder credentials |
| Testing | Vitest | 2.1.1 | ✅ 8/8 passing |
| Linting | ESLint | 9.10.0 + typescript-eslint | ✅ Passing |
| Formatting | Prettier | 3.3.3 | ✅ Configured |

---

## 4. Implementation Status (Verified Against Code)

### ✅ Complete & Working
- Landing page (fully branded, animated, accessible, responsive)
- Authentication UI (Login/Signup with validation, OAuth button placeholders)
- Protected routing (`/game`, `/map`, `/phone`, `/stats`, `/locations`, `/skills`, `/goals`, `/relationships`, `/achievements`, `/history`)
- Layout shell (Header, NavBar, Footer, Logo)
- Game time hook (`useGameTime`) — client-side interval, pause/resume, localStorage persistence
- Format utilities (currency, time, date, ID generation) — all tests passing
- Design system (Button, Card, Input, CSS custom properties, animations)
- TypeScript types (User, Session, AuthState, GameConfig, NeedsState, PlayerProfile, Location, JobDefinition, SkillDefinition)

### 🟡 Placeholder / Partial
- GamePage dashboard — renders but shows **static mock data** (cash, bank, rent, needs, location, goals, quick actions)
- Phone, Map, Stats, Locations, Skills, Goals, Relationships, Achievements, History routes — all render `PlaceholderPage`
- Supabase client — configured but **no real project connected** (placeholder URL/key)
- Database schema — defined in `database.types.ts` (profiles, player_needs, transaction_ledger) but **no migrations exist**
- Auth context — works with Supabase but falls back to placeholder when env vars missing

### ❌ Not Implemented
- Server-authoritative game state (money, needs, time, progression all client-side only)
- Needs simulation (decay, action effects, sickness)
- Economy & transaction ledger (no server RPCs, no idempotency, no audit trail)
- Careers/jobs (types only, no data, no application/shift flow)
- Housing (mock only, no rent processing, no eviction flow)
- Locations/venues (types only, no travel, no actions)
- Events engine (no dynamic events, no authored missions)
- NPC relationships (types only)
- Phone app ecosystem (launcher, apps, notifications)
- Camera & gallery (no capture, no storage, no metadata)
- Mini-game framework & games
- Multiplayer hooks (async or real-time)
- Generational progression

---

## 5. Architecture & Security Principles (Confirmed)

1. **Server-authoritative simulation** — Browser never decides authoritative money, needs, time, or progression outcomes.
2. **Supabase as backend** — Auth, Database (PostgreSQL), Realtime, Storage, Edge Functions.
3. **Row Level Security (RLS)** — All player-owned data protected by policies; no client-side security boundaries.
4. **Idempotent transactions** — All money/state changes use idempotency keys; duplicate requests safe.
5. **Typed RPCs / Edge Functions** — Game rules live in server-side TypeScript; database for storage + integrity.
6. **Offline reconciliation** — Client advances time locally; server reconciles on reconnect using `last_tick_at`.
7. **No secrets in frontend** — Service-role key never exposed; anon key only for client.

---

## 6. Immediate Development Priority (P1)

**Goal:** One playable single-player vertical slice establishing the core loop:

1. Create character → persist profile + initial state
2. Advance in-game time through validated actions
3. Update needs per game rules (server-validated)
4. Sleep → recover energy + time skip
5. Work shift → earn money (server-validated wage)
6. Pay rent/expense (server-validated deduction)
7. Reload → recover identical persisted state
8. Failed/repeated requests handled safely (idempotency)
9. Player cannot access/modify another player's private state (RLS)

**Scope:** Lagos only, 3 careers × 4 levels, 5 dense venues, 3 housing tiers, 1 authored mission + 5 dynamic events, phone MVP (Bank, Jobs, Messages, Map, Settings).

---

## 7. Document Classification

| Document | Classification | Notes |
|----------|----------------|-------|
| `AGENTS.md` | **Current (updated)** | Instructions for AI agents; references `PROJECT_CONTEXT.md` |
| `README.md` | **Current** | Setup instructions; references `AGENTS.md` |
| `docs/GAME_VISION.md` | **Current** | Product vision for Life in Africa |
| `docs/GAME_DESIGN.md` | **Current** | High-level game design (needs, time, skills, careers, etc.) |
| `docs/BRAND_IDENTITY.md` | **Current** | Approved brand palette, typography, logo direction |
| `docs/MVP_ROADMAP.md` | **Current** | Phased roadmap (P0–P5) |
| `docs/COMPETITOR_RESEARCH.md` | **Useful Historical** | Lagos Life analysis; informs differentiation but not requirements |
| `docs/DIFFERENTIATION_STRATEGY.md` | **Current** | Documents how Life in Africa differs from Lagos Life |
| `references/logo-concept-notes.md` | **Current** | Logo review criteria |
| `references/nigeria-life-logo.png.png` | **Current** | Visual reference for approved logo |

> **Note:** Documents referencing "Nigeria Life" as the product name are historical but still relevant — the brand identity, design direction, and differentiation strategy remain valid for Life in Africa. The product was renamed but the core vision and approved assets are unchanged.

---

## 8. Supabase / Backend Readiness

| Item | Status | Blocker |
|------|--------|---------|
| Supabase project created | ❌ No | Project owner must create project at supabase.com |
| Environment variables (`.env`) | ❌ Missing | Copy `.env.example` → `.env` with real `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` |
| Database migrations | ❌ None | Need SQL migrations for `profiles`, `player_needs`, `transaction_ledger` + RLS policies |
| Auth (email/password) | 🟡 Configured | Works once real project connected |
| Auth (OAuth: GitHub, Google) | 🟡 Buttons only | Need provider config in Supabase dashboard |
| Storage bucket (gallery images) | ❌ Not created | Needed for P2 camera/gallery |
| Edge Functions (rent, salary, reconciliation) | ❌ Not created | Needed for P1 server-authoritative loop |
| Realtime (multiplayer) | ❌ Not configured | Phase 3+ only |

**Manual Setup Required:**
1. Create Supabase project
2. Copy `.env.example` to `.env` and fill in real credentials
3. Run database migrations (to be created in P1)
4. Configure Auth providers (optional for P1)
5. Create Storage bucket `gallery` (for P2)

---

## 9. Known Risks & Blockers

| Risk | Severity | Mitigation |
|------|----------|------------|
| No real Supabase project | Critical | Project owner must provision before P1 can begin |
| Free-tier limits (500MB DB, 1GB storage, 2M auth/mo) | High | Evaluate paid tier ($25/mo Pro) or alternative before P1 |
| Client-only game time drifts | High | Design server reconciliation from P1 start |
| Image storage for gallery | Medium | Client-side resize/compress (WebP, max 800px); auto-cleanup |
| Real venue name licensing | Medium | Fictionalise by default (e.g., "Oja Market" not "Balogun Market") |
| App name trademark clearance | Low | Legal review before public beta; use generic descriptors in code |

---

## 10. Next Step for Project Owner

**Provision a Supabase project and provide credentials** — this is the single blocker preventing P1 implementation. Once `.env` is populated with real values, the auth system will connect and database migrations can be applied.

---

## 11. Confirmation of Scope

- ✅ Approved landing page **preserved** (no visual changes made)
- ✅ Brand identity **preserved** (colours, typography, logo direction unchanged)
- ✅ P0 hardening **complete** (TypeScript, tests, lint, build all pass)
- ✅ No gameplay implementation started (P1 vertical slice not begun)
- ✅ No secrets exposed (no real credentials in repo)
- ✅ No destructive changes made