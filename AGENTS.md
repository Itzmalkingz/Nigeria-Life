# Life in Africa — Project Instructions for AI Coding Agents

## Before doing any work
1. **Read `PROJECT_CONTEXT.md` first** — it establishes the current project identity, verified implementation status, approved brand, tech stack, and immediate priorities.
2. Read `docs/GAME_VISION.md`, `docs/GAME_DESIGN.md`, `docs/BRAND_IDENTITY.md`, and `docs/MVP_ROADMAP.md` for detailed design direction.
3. Inspect the existing repository before proposing or changing architecture.
4. If documents conflict with the existing code, explain the conflict and propose a safe plan before changing anything.
5. For substantial work, first provide: goal, files likely to change, implementation plan, risks, and test plan.
6. Do not implement the entire game in one task. Work in small, reviewable milestones.

## Product identity
- Product name: **Life in Africa**.
- Product type: a browser-based life simulation website/game inspired by real life across African countries and communities, responsive on desktop and mobile. It is not a native mobile app.
- Core idea: "One beginning. Many choices. One life."
- Experience: a living, systemic world where player choices create personal stories.
- Intended audience: adults (18+). Do not market it as a children's game.
- The game must feel recognisably African through believable daily life, culture, places, transport, social dynamics, language, and economic pressures—not just flags or stereotypes.

## Core gameplay principle
Build systems that interact:
GOALS → CHOICES → CONSEQUENCES → PROGRESSION → NEW GOALS.
The player should have meaningful daily, short-term, life, and legacy goals. Avoid shallow features that do not connect to the wider simulation.

## Mature themes and boundaries
- Adult themes may include dating, marriage, non-explicit intimacy between married adult characters, nightlife, financial pressure, fictional crime, scams/fraud as abstract gameplay, investigations, arrest, fines, court, and prison consequences.
- Intimacy must remain off-screen and non-explicit. The design requirement is that the intimate interaction is available only to married adult characters.
- Crime mechanics must be fictionalized and consequence-driven. Do not provide real-world operational instructions for committing fraud, evading police, laundering money, or harming people.
- Players may choose lawful or unlawful paths. Avoid presenting crime as guaranteed easy money; model uncertainty, evidence, victims, investigation, reputation, and long-term consequences.
- Do not add graphic sexual content or gratuitous violence.

## Technical working rules
- Do not select or replace the technology stack without first inspecting the repository and explaining trade-offs.
- Do not assume a free-tier backend is sufficient for a large persistent multiplayer game. Evaluate limits, security, data model, server-side validation, and future migration costs.
- Treat client code as untrusted. All authoritative money transfers, inventory changes, crime outcomes, and multiplayer state changes must be validated server-side.
- Never trust a balance or reward calculated only in the browser.
- Use transactions or equivalent atomic server-side operations for player-to-player transfers and other balance changes.
- Keep game rules separate from UI components where practical.
- Use typed data models and validation at system boundaries.
- Do not store secrets in frontend code or commit environment files containing credentials.
- Add migrations and document required environment variables. Provide `.env.example` with placeholders only.
- Respect accessibility, keyboard navigation, readable contrast, responsive layouts, and reduced-motion preferences.
- Preserve the chosen brand direction unless the user explicitly changes it.
- Do not invent completed features. Clearly distinguish implemented, planned, and placeholder functionality.

## Design direction
- Logo concept: a branching path/tree-like mark. Red point = life beginning; branches = choices and possible futures; blue point = the player's current choice/path.
- Brand phrase: "One beginning. Many choices. One life."
- Approved palette (do not change without explicit approval):
  - Deep Navy: `#202331`
  - Life Red: `#F0443E`
  - Choice Blue: `#2764D8`
  - Warm Ivory: `#F5F1E8`
  - Dark Background: `#11131C`
  - Muted Text: `#626776`
  - Earth Accent (optional): `#8A6048`
- Approved typography: Sora for display/headings and Inter for body/UI. Verify font loading and licensing before shipping.
- Background graphics can use subtle branching paths and low-opacity logo motifs. Avoid generic gradients/blobs and avoid stereotypical visual clichés.

## How to respond to tasks
- Start by checking relevant docs and the current code.
- Ask a question only when a missing decision blocks safe progress. Otherwise state reasonable assumptions.
- Do not do broad refactors while implementing a small feature.
- After changes, run available checks/tests and report exactly what passed, failed, or could not be run.
- Summarize changed files, behavior, known limitations, and next step.
