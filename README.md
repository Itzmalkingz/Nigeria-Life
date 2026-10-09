# Nigeria Life — OpenCode Starter Pack

## Setup
1. Extract this folder.
2. Copy its contents into your actual `Nigeria-Life` project folder, or rename this extracted folder to `Nigeria-Life`.
3. Put your logo image in `references/` and name it `nigeria-life-logo.png`.
4. Open the project folder in VS Code/OpenCode.
5. Ask OpenCode to read `AGENTS.md` and every file in `docs/`.
6. Start with the first-task prompt below. Do not ask it to build the whole game immediately.

## First prompt for OpenCode
Read `AGENTS.md`, then read every Markdown file in `docs/` and `references/logo-concept-notes.md`. Inspect the current repository, including package files, source structure, routes, tests, environment setup, and existing backend integration. If `references/nigeria-life-logo.png` exists, inspect it as a visual reference.

Do not modify code yet. Do not install dependencies. Do not choose or replace the stack without explaining trade-offs.

Return a repository audit and a practical implementation plan for Nigeria Life:
- what already exists;
- what is missing;
- recommended browser-game architecture;
- frontend, server and database responsibilities;
- player/time/needs/economy/skills/jobs/goals/events data model;
- authoritative transaction and multiplayer security design;
- backend options and free-tier limitations;
- small, testable MVP milestones;
- acceptance criteria for the first playable vertical slice.

Flag contradictions or decisions that need the user's approval. Distinguish confirmed facts from assumptions.

## Important
This pack is a planning baseline, not proof that the product is implemented. The logo image is not included; add your own reference image.
