# Nigeria Life — MVP Roadmap and AI Workflow

## Purpose
Keep the long-term vision ambitious while delivering one genuinely playable vertical slice at a time.

## Phase 0: design foundation
- Vision and design documents
- Brand direction
- MVP boundaries
- Technical architecture proposal
- Data/security model
- Acceptance criteria

## Phase 1: repository and technical audit
Before coding:
1. Inspect repository and existing code.
2. Identify framework, package manager, current routes, tests, data layer, authentication, and deployment configuration.
3. Report what exists and what is missing.
4. Recommend a technical architecture with trade-offs.
5. Do not replace working code or install large dependencies without approval.

## Phase 2: playable single-player foundation
Suggested order, subject to architecture review:
1. Responsive shell and navigation.
2. Character/profile and new-game flow.
3. In-game clock/calendar.
4. Player state and needs.
5. Home/location actions.
6. Basic economy and transaction ledger.
7. One or two jobs with skill requirements.
8. A small set of dynamic events.
9. Save/load and validation.
10. Testing and balance pass.

## Later milestones
- More careers, skills, housing and locations.
- Phone modules: messages, contacts, jobs, maps and banking.
- NPC relationships and persistent history.
- Mature systems and consequence loops.
- Businesses and advanced economy.
- Multiplayer and player-to-player interactions.
- More districts/cities and live operations.

## Backend decision rule
Do not decide that a free backend tier is the permanent solution without evaluating its quotas, persistence, auth, security rules, server-side execution, backups, costs, and migration path. Do not ask the AI to invent a backend inside frontend code. Compare realistic options and recommend a phased approach.

## Definition of done for each feature
- Requirements are stated.
- UI is responsive.
- Rules are enforced in the correct layer.
- Loading, empty, error, and success states exist.
- Relevant tests/checks run.
- No secrets are exposed.
- Documentation is updated.
- The AI reports files changed, checks run, failures, limitations, and next step.

## First OpenCode task
Do not build the game yet. Read all project documents and inspect the repository. Return:
1. Summary of current repository state.
2. Recommended architecture for a browser-based simulation.
3. Frontend/backend/database responsibilities.
4. Data model proposal for player state, time, money, skills, goals, jobs, events, and transaction ledger.
5. Security risks and mitigations, especially money and multiplayer.
6. Proposed MVP milestones and acceptance criteria.
7. Cost/limits comparison for suitable backend options, including the implications of free tiers.
8. Questions that genuinely block progress.

Do not change code in this first task.
