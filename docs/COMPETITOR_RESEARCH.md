# Nigeria Life — Competitor Research: Lagos Life

**Reference:** https://lagoslife.app/ (also lagoslife.eliysites.com)  
**Research date:** 2026-10-09  
**Access level:** Public pages only (landing, legal docs, third-party guides, press coverage). No account created; no private endpoints accessed.

---

## 1. Verified Public Information

### 1.1 Product Overview
| Attribute | Detail |
|-----------|--------|
| **Name** | Lagos Life |
| **Type** | Free browser-based multiplayer life simulation |
| **Platform** | Web (Safari/Chrome), PWA-installable, no native app |
| **Launch** | 1 October 2026 (Nigeria Independence Day) |
| **Developer** | Shalom Rayhamen / Shalom Mathew (aka @Shalom_HeyEliy), UK-based Nigerian |
| **Operator entity** | Vatar (parent company), angel round $500K closed 9 days post-launch |
| **Target** | 18+ only (enforced in Terms) |
| **Concurrency** | Self-reported: 15K–20K concurrent at peak; 100K+ within 72h; 1M+ accounts in ~4 days |
| **Hosting** | DigitalOcean (per Privacy Policy) |
| **Payments** | Flutterwave (current), Bachs (pre-Oct-6) — real money → Game Naira top-ups |
| **Revenue** | In-world advertising: 38 billboards (₦5K–₦100K/week), lagoon plots, stats page slots |

### 1.2 Core Gameplay Systems (Observed from Public Docs & Guides)

#### Character & Onboarding
- **Account:** username (3–20 alphanum/underscore), password (8+ chars), optional email
- **Character creation:** Look → Personality (1 of 10 traits) → Lifetime Dream (5 options) → Birth Lottery → Home
- **Traits:** Each multiplies one skill growth rate, alters need decay, or improves certain activities
- **Lifetime Dreams (aspirations):** Oga at the Top, Lekki Landlord (₦1M net worth), Afrobeats Star (Music L10), Everybody's Padi (4 best friends), Yaba Unicorn (CcHub funding)
- **Birth Lottery (permanent per account):**
  - **Nepo Baby:** ₦500K pocket money, furnished Lekki flat (rent prepaid 1yr), car, Branch Manager job, higher Charisma
  - **LAPO Baby:** ₦60K loan (₦72K owed, ₦12K/week × 6 weeks), Mushin/Yaba/UNILAG Hall start, Hustle ≥2, skills learn 25% faster

#### Needs (6, real-time decay)
| Need | Notes |
|------|-------|
| Hunger | Fastest ordinary decay |
| Energy | Sleep recovers |
| Hygiene | Shower/bath |
| Bladder | Fastest meter overall |
| Fun | Punishes pure grinding |
| Social | Interaction required |
- Sickness mechanic: mild → chemist/agbo; severe → hospital injection

#### Time & Calendar
- Real-time: 1 real minute ≈ 1 game hour (24-min day)
- Weekday/weekend distinction
- **Rent due every Saturday** — core recurring cost
- Governor election weekly (Sunday 8 PM results)

#### Jobs & Careers
- **32 careers × 5 levels = 160 job levels** (per guide; Terms says "25 careers")
- Apply via in-game Phone → Jobs → "Apply — start tomorrow"
- Shift ≈ 1 real hour; must travel to workplace on time
- Work styles during shift: Steady, "Work Like Jaguda", Gist, Suck Up, Take Am Easy
- Win 4 tasks/shift → +15% pay
- Promotion: skill-gated, roughly doubles per-shift pay
- **Salary range:** ₦6,600 (entry) → ₦99,000 (top) per shift (guide); Banking strongest opener (₦4,200); Music highest ceiling (₦66K) but night shifts
- Content Creator: ₦2,400 (deliberate joke)

#### Side Gigs (between shifts)
| Gig | Base Reward | Duration | Requirement |
|-----|-------------|----------|-------------|
| Help at Buka | ₦1,750 | 90 min | Mama Put |
| Carry Load (Alabaru) | ₦2,250 | 120 min | Balogun Market |
| Freelance Gig | ₦1,500 + ₦1,400 × Coding level | 180 min | Coding 2 |
| Buy & Resell | Variable (Hustle + RNG) | 120 min | ₦800 cost, Balogun Market |
- Cooldown: 20 min (<₦25K) / 45 min (≥₦25K); special activities use next-day reset

#### Housing (5 tiers)
| Tier | Area | Weekly Rent | Notes |
|------|------|-------------|-------|
| Face-me-I-face-you | Mushin | ₦2,400 | LAPO start |
| Self-contain | Yaba | ₦6,000 | LAPO start |
| Hall of Residence | UNILAG | ₦1,200 | Student start (100L) |
| Mini-flat | Lekki Phase 1 | Prepaid (Nepo) | Furnished, car included |
| Mansion | Banana Island | Purchase (not rent) | Late-game goal |
- Arrears >2 weeks (except Mushin) → quit notice → forced back to Mushin
- Buy Mode: 61 furniture items; some need electricity (NEPA mechanic)

#### Transport
| Mode | Cost | Notes |
|------|------|-------|
| Trek | Free | Slow, tires Energy |
| Keke | ₦100 + ₦5/km | 3 passengers |
| Danfo | ₦100 + ₦5/km | Bus; need change |
| Okada | ₦150 + ₦8/km | Fast through traffic |
| Cab | ₦300 + ₦15/km | AC, comfort |
| Car | Fuel | Owned vehicle |

#### Locations (31+ in Lagos; Abuja & Port Harcourt referenced in code)
- **Venues with real hours:** Balogun Market, Amala Shitta, Elegushi Beach, Quilox, The Shrine, UNILAG, General Hospital, Police Division, Radio Station, Eko Casino, CcHub, etc.
- **UNILAG:** Lectures 8 AM–6 PM weekdays, semester exams, CGPA, graduation (First/2:1/2:2/Third); anyone can matriculate for ₦35K
- **Daily Gem Hunt:** Clue → location → cash prize
- **Governor Election:** ₦50K campaign fee; winner sets city-wide policy (transport subsidy, min wage, food subsidy, steadier power) + ₦25K/day salary

#### Skills (9)
- Each action trains specific skill; traits modify growth rates
- Skills gate promotions and side gigs (e.g., Coding 2 for Freelance)

#### Relationships & Social
- Chat (venue + DM), Padi → Paddy Mi (best friends), date, engage, marry, baby, break up
- Real players in shared world; visit other players' houses
- Weddings, families, squads implemented post-launch

#### Economy & Money
- **Game Naira (₦):** fictional, non-redeemable, non-withdrawable (explicit in Terms)
- Real-money top-ups via Flutterwave → Game Naira
- **Three income dials:** Job, side businesses, land
- **Businesses:** Compound without shift consumption; each has "bad-day chance" costing real money
- **Land:** Appreciates; omo-onile levy (up to 35% Ikorodu, 0% Banana Island waterfront)
- **Tax:** Kicks in after ₦1M earned/week
- **Vehicles:** Convenience (travel cost/time), not income source

#### Multiplayer / Shared World
- Single shard: all players in same Lagos
- Live map with other players moving
- Venue chat + DMs
- Governor election (server-wide)
- Daily gem hunt (server-wide)
- No official Discord/subreddit/wiki — community lives in-game

#### Advertising / Monetization (In-World)
- 38 billboards: ₦5K/week (early) → ₦100K/week (later)
- 24 lagoon plots: ₦18K/week
- Stats page: 6 slots at ₦50K/30d → ₦100K/7d
- Advertisers: Salary Index, Leadway, MyDecorTrade, ONErpm, indie artists
- No account needed to buy: upload logo, pay, ad goes live
- Tap-through rate reported: ~38% (3,686 taps / 9,826 opens)

#### Technical
- Next.js (React) frontend, PWA manifest, service worker
- Device fingerprinting for abuse prevention
- iOS 16.4+ required (PWA push notifications)
- Keyboard shortcuts (M=map, H=home, P=phone, S=skills, T=things, 1-9=venue spots, E=people)
- "Reconnecting to Lagos…" on connection loss

---

## 2. Source Index & Access Limitations

| Source | Type | Access | Verifiable Claims |
|--------|------|--------|-------------------|
| `lagoslife.app` (landing) | Primary | Public HTML | Title, meta description, PWA manifest, boot scripts |
| `lagoslife.app/privacy` | Legal | Public | Data practices, DigitalOcean, Flutterwave, device fingerprinting, 18+ |
| `lagoslife.app/terms` | Legal | Public | Game Naira definition, virtual economy, purchases, ads, social, prohibited conduct, soft deletion, IP |
| `lagoslife.app/disclaimer` | Legal | Public | Fictionalization, brands, govt institutions, locations, Naira, criminal scenarios, politics |
| `lagoslifeguide.com` | Unofficial wiki | Public | 32 careers, 31 locations, birth lottery details, needs decay, transport, housing, UNILAG, gem hunt, governor election, side gigs, keyboard shortcuts |
| `lagoslife.wiki` | Unofficial wiki | Public | 6 needs, NEPA mechanic, 21 venues, 14 careers × 5 levels, omo-onile levy, tax, multiplayer layer |
| `foundplay.io/games/lagos-life` | Aggregator | Public | 25 careers, 5 homes, 61 furniture, 6 transport, 23 locations, 7 radio stations, 10 traits, 5 aspirations, 22 wishes, 91 moodlets, 261 actions, 9 skills |
| `businesstech.ng` | Press | Public | 1M+ players in 4 days, $500K angel, viral growth, advertising model, imitators (Road to Number One, PH Lifestyle) |
| `techpoint.africa` | Press | Public | 1.2M players by Oct 5, 71K concurrent, 9.6M visits, in-world ads, unverified dashboards |
| `techmoran.com` | Press | Public | 2M+ players in <1 week, 101K+ concurrent, 10M visits/day, 25 careers, 5 homes, 61 furniture, 6 transport, 23 locations, 7 radio, 10 traits, 5 aspirations, 22 wishes, 91 moodlets, 261 actions, 9 skills, governor election, in-game ads |
| `@LagosLifeApp` (X/Twitter) | Official social | Public | Launch metrics, court lawsuit feature, suggestion box, governor election candidates, fake app warnings |

**Limitations:**
- No account created → cannot observe live gameplay, UI flows, balance of systems, or multiplayer dynamics firsthand
- All gameplay numbers (salaries, rents, decay rates, cooldowns) come from unofficial wikis/guides; may be outdated or inaccurate
- Player counts and revenue figures are self-reported by developer; not independently verified
- Abuja/Port Harcourt mentioned in code/press but not confirmed playable
- No access to source code, API, database schema, or backend architecture

---

## 3. Assumptions vs. Verified Facts

| Claim | Status | Evidence |
|-------|--------|----------|
| 32 careers × 5 levels | **Unverified** | Guide claims 32; Terms says "25 careers"; TechMoran says 25 |
| 31 Lagos locations | **Unverified** | Guide lists 31; other sources say 21–28 |
| 9 skills, 261 actions | **Unverified** | TechMoran only; not cross-referenced |
| 10 traits, 5 aspirations, 22 wishes, 91 moodlets | **Unverified** | TechMoran only |
| Real-time multiplayer (single shard) | **Verified** | Terms §4, Privacy §2, multiple guides, press |
| Rent every Saturday | **Verified** | Terms §7, multiple guides |
| Birth lottery (Nepo/LAPO) | **Verified** | Terms §4, multiple guides, press |
| Game Naira non-redeemable | **Verified** | Terms §5, Privacy §12 |
| In-world advertising (billboards) | **Verified** | Terms §11, press, advertising page screenshots on X |
| Flutterwave payments | **Verified** | Privacy §2, §8, Terms §6 |
| DigitalOcean hosting | **Verified** | Privacy §8 |
| Device fingerprinting for abuse | **Verified** | Privacy §2, Terms §18 |
| Governor election weekly | **Verified** | Multiple guides, X posts |
| Daily gem hunt | **Verified** | Multiple guides |
| UNILAG student mechanics | **Verified** | Multiple guides |
| NEPA/power outage mechanic | **Verified** | Wiki, guides |
| Buy Mode furniture (61 items) | **Unverified** | TechMoran only |
| Weddings, babies, families | **Verified** | Press, X replies |
| PWA install + iOS 16.4+ | **Verified** | Landing page boot script, guides |

---

## 4. Key Takeaways for Nigeria Life

### What Lagos Life Proves Works
1. **Browser-first, no-download** → massive low-friction acquisition in Nigeria
2. **Cultural specificity as hook** — "Birth lottery", "Baba Landlord", "NEPA", danfo/okada fares, real venue names → viral sharing
3. **Shared world + real players** → social layer drives retention (weddings, lawsuits, governor election)
4. **In-world advertising** → revenue from day one without paywalls
5. **PWA + keyboard shortcuts** → desktop & mobile parity
6. **Weekly rent cycle** → simple, unforgiving core loop that structures all decisions
7. **Permanent origin choice (birth lottery)** → identity, asymmetry, watercooler talk

### Gaps / Opportunities for Differentiation
| Area | Lagos Life Approach | Opportunity for Nigeria Life |
|------|---------------------|------------------------------|
| **Narrative depth** | Emergent only; no authored story arcs | **Authored life missions + legacy goals** with branching consequences |
| **Career progression** | Linear: skill gate → promotion → 2× pay | **Non-linear paths**: business ownership, apprenticeship, reputation-based unlocks |
| **Crime & consequence** | Referenced in Terms; not visibly systemic | **Fictionalized crime path** with investigation, evidence, reputation, prison — as deep system |
| **Relationships** | Chat, Padi, marriage, baby | **NPCs with memory, personality, schedules**; relationships unlock opportunities/conflicts |
| **World simulation** | Player-driven events (election, gem hunt) | **Systemic events**: traffic, power, task-force, POS issues, family requests — with preconditions & persistent outcomes |
| **Time/offline** | Real-time decay; no offline protection mentioned | **Configurable offline rules** (capped decay, no rewards) — fair to casual players |
| **Geographic scope** | Lagos (+ Abuja/PH in code) | **Multi-city from design**: Lagos, Abuja, Port Harcourt, Kano — distinct economies |
| **Art direction** | Low-poly, emoji pins, billboards | **Branded visual identity** (branching logo, Sora/Inter, warm ivory/dark navy palette) |
| **Monetization** | Ads + Game Naira top-ups | **Cosmetic/QoL only**; no pay-to-win; ethical F2P |
| **Accessibility** | Keyboard shortcuts; PWA | **WCAG AA**, reduced motion, screen reader, high contrast from M0 |

---

## 5. Strategic Implications

**Do not clone.** Lagos Life validates the *market* and *core loop* (rent → work → needs → social). Nigeria Life must deliver a **deeper, more systemic, more narratively rich** experience that feels *authored* rather than *emergent-only*.

**MVP Scope Discipline:** Lagos Life launched with 25–32 careers, 31 venues, multiplayer, elections, ads — built by one dev in months. Nigeria Life's MVP should be **smaller but deeper**: one city, 3–5 careers, 5–8 venues, single-player + async multiplayer hooks, zero ads. Ship a *vertical slice* that proves the "GOALS → CHOICES → CONSEQUENCES → PROGRESSION" loop works, then expand horizontally.

**Technical Debt Warning:** Lagos Life's rapid growth caused lag/outages. Nigeria Life must **design for scale from M0**: Supabase + Edge Functions, RLS, idempotent transactions, connection pooling, observability.

**Legal/Compliance:** Lagos Life's Terms/Privacy/Disclaimer are thorough. Nigeria Life needs equivalent before any public launch — especially on Game Naira non-redeemability, 18+ enforcement, device fingerprinting disclosure, and fictionalization of real brands/institutions.

---

*End of Competitor Research. All observations are from public sources. No private data accessed.*