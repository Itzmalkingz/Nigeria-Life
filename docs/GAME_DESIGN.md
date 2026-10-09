# Nigeria Life — High-Level Game Design

## 1. Player state
Track the player's identity, age (adult characters for mature systems), location, money, bank balance, needs, skills, relationships, reputation, goals, inventory, housing, career, and event history.

## 2. Needs and time
Initial needs under consideration:
- Hunger
- Energy
- Hygiene
- Fun
- Social
- Bladder

Needs change with in-game time and actions. Rates should be configurable and tested; do not hardcode decay across unrelated UI components.

**Offline rule (researched from Lagos Life gap):** Offline time advances but with **capped decay** (max 8 hours equivalent) and **no rewards**. Player chooses "Sleep" to skip time + recover Energy; "Log off" pauses decay at cap. No progress, income, or events occur while offline. Documented in onboarding.

**Time scale:** Configurable (1 real min = 30/60/90 game min). Default 1:1 hour for MVP. Weekday/weekend distinction affects job shifts, venue hours, transport traffic.

## 3. Skills
Potential skill tracks include Coding, Music, Business, Communication, Fitness, Driving, Hustle, Cooking, and other skills added when they support real gameplay. Skills should unlock opportunities and actions, not just increase a number.

**Specializations (researched):** Each skill branches at level 5 (e.g., Coding → Frontend/Backend/Data/AI; Business → Retail/Import-Export/Finance/Operations). Specializations unlock unique actions, jobs, and NPC mentors.

## 4. Goals and missions
Use several layers:
- Daily goals
- Short-term goals
- Life goals
- Legacy goals
Players should be able to select or create goals where practical. Goals should connect to career, social, financial, housing, or personal progression.

## 5. Time and calendar
Provide an in-game clock, day/night cycle, weekday/weekend distinction, and a weekly rent cycle. Jobs and shifts must respect time and player availability. Calendar deadlines should be understandable and visible.

## 6. Locations
Initial concept locations include:
- Player home
- Balogun Market
- Career/Shifts Hub
- CcHub-inspired tech hub (use fictionalization or confirm naming/permission before public release)
- VIP nightlife venue inspired by Lagos nightlife (use a fictional brand)
- Bank/POS location
Locations should offer actions and have a reason to visit. Build a small playable set first.

## 7. Career and job progression
Possible paths include entry-level work, informal work such as a danfo conductor, office roles, tech careers, business ownership, and management. Job progression requires relevant skills, time, applications, performance, and realistic trade-offs. Rewards should be balanced against needs and expenses.

**Parallel tracks (researched):**
- **Employment** — linear ladder (5 levels), skill-gated promotions, shift-based
- **Freelance/Gig** — task-based, reputation-gated, flexible schedule
- **Business Ownership** — register CAC, rent shop/office, hire staff, manage inventory, pay taxes, compete — persistent entity outlives character
- **Apprenticeship/Mentorship** — NPC mentors teach skills faster, unlock hidden paths, require relationship investment

**Career switching:** Transferable skills + reputation carry over (e.g., Communication from banking → politics; Coding from tech → fintech startup).

## 8. Housing
Potential progression from shared/low-cost accommodation to better apartments and luxury housing. Housing can affect rent, comfort, location, access, status, and activities. Weekly rent should have clear warnings and consequences. Avoid making late rent automatically ruin a player's life without a recovery route.

**Property investment (researched):**
- **Buy-to-let:** Collect rent, manage tenants, omo-onile levies, maintenance, appreciation
- **Land banking:** Speculative land in developing corridors (Ibeju-Lekki, Kubwa, Igando) — risk/reward, community disputes, government acquisition risk
- **Lease terms & service charges:** Variable by area; disputes resolvable in court (time/money cost)

## 9. Economy
Track cash and bank balance separately. Income sources may include salary, gigs, businesses, and rewards. Expenses may include food, transport, data, rent, utilities, education, leisure, and business costs.
- Keep currency in integer kobo or another consistent smallest-unit representation where possible.
- Validate all balance-changing actions on the server.
- Record an auditable transaction ledger.
- Never allow the browser to directly set an authoritative balance.
- Add idempotency and atomicity for transfers to avoid duplicate charges or duplicated payouts.

**Investment products (researched):**
- **Formal:** Treasury bills, mutual funds, fictional crypto, agric schemes — each with risk curve, lockup, return profile
- **Informal:** Esusu/ajo rotating savings — trust-based, social enforcement, default consequences (reputation + legal); POS agent float management

**Taxation:** PAYE, VAT, withholding tax; tax evasion path exists (risk: audit, fines, prison, reputation).

## 10. Phone as an in-world hub
Potential modules:
- Chat and voice-note UI
- Contacts
- Bank
- Jobs
- Maps
- Social feed
- Notifications
- Music/entertainment
Phone transfers are initiated at an in-world bank or POS location, as defined by the game rule. Messaging and voice notes should be separate features with appropriate privacy and moderation considerations if multiplayer is introduced.

## 11. Relationships and social systems
NPCs may have personality, goals, mood, preferences, work, history, trust, and relationship state. Important interactions should be remembered. Relationships can unlock help, opportunities, conflict, or long-term story changes.

**NPC simulation depth (researched — Lagos Life gap):**
- **100+ NPCs** with: Big Five personality, weekly schedule, memory of key interactions, trust (-100 to +100), faction allegiance, secret
- **Relationship tiers:** Stranger → Acquaintance → Friend → Close → Confidant → Betrayed
- **Family obligations:** Extended family requests (funeral, school fees, medical, aso-ebi) — refuse → reputation hit; help → cash drain + trust gain
- **Mentorship:** NPC mentors unlock skill specializations, hidden career paths, alibi network
- **Romance/Marriage:** NPCs have preferences, dealbreakers, family approval requirements; married intimacy off-screen, non-explicit

## 12. Mature systems
- Dating, commitment, marriage, and relationship conflict.
- Non-explicit, off-screen intimacy only between married adult characters.
- Nightlife and optional adult social choices.
- Fictionalized illegal opportunities, including scam/fraud storylines.
- Investigation, witnesses/evidence, police attention, arrest, fines, court, prison, reputation loss, and career/social consequences.
- Illegal choices can sometimes avoid immediate consequences, but risk and consequences should remain meaningful.
- Do not include real-world instructions for scams, evasion, laundering, or other criminal acts.

**Crime as deep system (researched — Lagos Life gap):**
- **Path:** Approach → Plan (skill/gear/NPC checks) → Execute → Evidence trail generated → Investigation (time-gated, NPC detectives) → Arrest/Trial/Prison OR Escape → Life on run (new identity, limited access)
- **Lawyer NPCs:** Retainer fees, success rates, specializations (criminal, civil, corporate)
- **Bail & Appeal:** Cash/surety; appeal adds time, cost, new evidence chance
- **Prison gameplay:** Separate location, new needs (safety, respect), prison jobs, gangs, parole board, early release for good behavior/snitching

## 13. Dynamic events
Potential events include traffic hold-ups, task-force encounters, power outages, network problems, POS issues/cashback, unexpected bills, job offers, family requests, relationship situations, business opportunities, and crime-related events. Events should use preconditions, choices, costs/rewards, and persistent outcomes. Avoid arbitrary pop-ups that interrupt constantly.

**Event structure (researched):**
- **Preconditions:** Location, time, needs state, skills, reputation, relationships, inventory, world state (e.g., NEPA on, governor policy active)
- **Choices:** 2–4 options with visible costs (time, money, need deltas) and hidden consequences (reputation, evidence, relationship delta, world state change)
- **Outcomes:** Immediate (cash, XP, need changes) + Persistent (flags, reputation, unlocked/locked content, NPC memory, world state)
- **Cooldowns:** Per-event (24h–7d) + Global (no event spam; max 1 major/2 minor per in-game day)
- **Categories:** Daily grind, Opportunity, Emergency, Social, Crime, Governance

## 14. Reputation and history
Reputation may differ by context: professional, reliable, social, business-minded, influential, risky, or criminal. Keep reputation understandable and ensure actions have proportional consequences. Record significant life events so NPCs and systems can refer to them later.

**Reputation contexts (researched — explicit contexts):**
1. **Professional** — affects job promotions, freelance rates, business licensing speed
2. **Social** — affects venue access, party invites, dating pool, family standing
3. **Business** — affects supplier terms, loan rates, customer trust, omo-onile levy
4. **Criminal** — affects police attention, fence prices, gang recruitment, prison hierarchy
5. **Political** — affects voting weight, campaign donations, policy access, appointment eligibility

Each context: -100 to +100. Actions affect multiple contexts (e.g., bribe → Criminal +10, Professional -20, Business -10).

## 15. Multiplayer principles
Treat multiplayer as a later milestone unless repository inspection shows it already exists. Plan for server-authoritative state, authorization, anti-cheat, rate limits, privacy, blocking/reporting, and moderation. Do not expose private messages or player financial data to other players. Player-to-player transfers require atomic server-side validation and a transaction record.

**Phased approach (researched from Lagos Life scaling issues):**
- **Phase 1 (MVP):** Single-player + **async hooks** — leaderboards, ghost data (player businesses visible), letters/gifts (delayed delivery), player-run market prices
- **Phase 2:** **Async multiplayer** — contracts, escrow, reputation-backed loans, cooperatives/guilds (server-validated, no real-time sync)
- **Phase 3:** **Shared world** — live map, venue chat, DMs, governor election, weddings — only after load-tested, moderation staffed, anti-cheat mature

## 16. Accessibility and usability
- Mobile-first responsive layouts without pretending the product is a native app.
- Readable type and contrast.
- Keyboard-accessible controls.
- Clear confirmation for costly/irreversible actions.
- Reduced-motion support.
- Useful empty, loading, and error states.
- **WCAG AA compliance from M0** — contrast ratios, focus indicators, screen reader labels, high-contrast mode toggle, scalable text.

## 17. Legacy & Generational Progression (Unique Identity)
- **Retirement:** At configurable age/wealth/legacy threshold, player may retire current character
- **Inheritance:** Child/protege inherits: assets (reduced by tax), reputation (halo effect), debts, NPC relationships, unfinished missions
- **Family name:** Persists across generations; unlocks unique dialogue, dynasty goals, ancestral property
- **Generational skills:** "Bloodline" passive bonuses (e.g., "Merchant Lineage" → +10% Business XP)

## 18. Multi-City Design (Unique Identity)
- **Lagos** — Commercial hub: finance, tech, trade, entertainment, highest costs, fastest pace
- **Abuja** — Political/bureaucratic: govt jobs, NGOs, diplomatic, lower traffic, higher rent, power stable
- **Port Harcourt** — Oil/industrial: energy sector, logistics, militancy risk, nightlife distinct
- **Kano** — Trade/agric: commodities, manufacturing, conservative social, lower costs, distinct festivals
- **Inter-city travel:** Flight (fast, ₦, events), Bus (slow, ₦, events en route), Train (mid) — each with minigame/events
- **City-specific mechanics:** Governor → LGA Chairman → State Assembly → Governor → President (political track)
