# letsTree web game plan

## Problem
Build a web game where players solve a small fixed set of daily quizzes about the evolutionary tree of life. Each quiz presents 3-5 species and asks the player to arrange them into the correct relative tree structure by dragging species into position. After submission, the game reveals the correct solution and explanation regardless of whether the answer was correct.

## Current state
- Repository is empty aside from `.git`.
- This should be planned as a greenfield project.
- Product requirements are mostly defined for v1; a few secondary product decisions still need confirmation.

## Proposed approach
Create a thin first version focused on a reliable daily puzzle loop before adding accounts, content scale, or competitive features.

Recommended initial shape:
1. Build a React + TypeScript client-rendered web app with a lightweight Node/API layer for daily quiz delivery, answer checking, and deterministic day-based puzzle selection.
2. Represent each puzzle as a small rooted tree plus species metadata and an explanation payload for the reveal screen.
3. Support three daily puzzles with a predictable difficulty ramp (easy, medium, hard) and day boundaries that reset at each player's local midnight.
4. Design the interaction for both desktop and mobile from the start, rather than treating mobile as a later adaptation.
5. Seed the system with a curated puzzle dataset covering at least 50 days of play before attempting procedural generation.
6. Make English and Simplified Chinese part of the core content model so species names, answers, and explanations ship bilingually in v1.

## Product assumptions for draft plan
- Daily set size: 3 quizzes.
- Each quiz contains 3-5 species.
- Difficulty progression: easy -> medium -> hard.
- Players receive an all-or-nothing correctness result based on exact topology match.
- Players can always reveal the answer after locking a guess; reveal is also shown immediately after submission.
- Relative correctness is determined by comparing the submitted topology against the expected tree for that quiz.
- Initial launch uses anonymous local-only persistence rather than user accounts.
- Daily reset happens at each player's local midnight rather than one shared UTC boundary.
- V1 supports both desktop and mobile as first-class targets.
- Initial content includes at least 50 daily sets (150 quizzes total) with species names and externally hosted photo URLs from permissively licensed or public-domain sources.
- V1 includes Simplified Chinese support for species names, answers, explanations, and core UI copy.

## Confirmed decisions
- **App stack:** React + TypeScript frontend with a lightweight Node/API layer.
- **Persistence:** anonymous local-only progress for v1.
- **Scoring and reveal:** exact-match scoring only; after resolution, always reveal the full correct tree and explanation.
- **Daily reset model:** each player's daily set rolls over at local midnight.
- **Device support:** desktop and mobile are equal priorities in v1.
- **Content scope:** prepare at least 50 days of quizzes, including species names and externally hosted permissive/public-domain images.
- **Localization:** ship English and Simplified Chinese in v1.

## Functional plan

### 1. Core gameplay definition
- Define the exact player interaction model:
  - whether users build a binary tree only, or can place species into broader grouped branches first
  - whether internal nodes are implicit or visually editable
  - whether users can submit partial trees
- Define the correctness rules:
  - exact topology match only, or partial credit for correct clades
  - branch order normalization so left/right sibling ordering does not matter
  - handling of ties or unresolved polytomies if ever needed
- Define reveal behavior:
  - show correct tree layout
  - explain the key relationship(s)
  - optionally compare user answer against the correct clades

### 2. Content and taxonomy model
- Create a canonical species model:
  - id
  - localized common names, including English and Simplified Chinese
  - scientific name
  - photo URL
  - optional attribution/license metadata
  - taxonomy metadata used for authoring
- Create a puzzle model:
  - puzzle id
  - difficulty
  - species list
  - expected tree structure
  - localized explanation text, including English and Simplified Chinese
  - tags/theme
- Decide the authoritative content source:
  - hand-authored/generated JSON/content files for v1
  - no admin/content pipeline required initially
- Define content quality rules:
  - no ambiguous sets
  - educational explanation required for every puzzle in both supported languages
  - difficulty rubric based on phylogenetic distance and familiarity
  - every puzzle should have species photos from permissively licensed or public-domain sources where available
- Initial content target:
  - at least 150 authored quizzes to cover 50 days at 3 quizzes per day
  - enough content diversity to avoid obvious short-cycle repetition
  - every species name and every answer/reveal explanation translated into Simplified Chinese

### 3. Daily puzzle delivery
- Define day key generation:
  - derive from each player's local date, likely `YYYY-MM-DD`
  - users in different time zones may roll over to a new set at different moments
- Create selection strategy:
  - choose exactly 3 puzzles per day
  - enforce difficulty distribution
  - avoid near-term repeats
  - make selection deterministic from local date + dataset version
- Plan versioning:
  - changing the dataset should not break past daily puzzles if results/history are stored

### 4. Frontend experience
- App shell/screens:
  - home / today’s challenge
  - quiz play screen
  - reveal/result screen
  - optional archive/history screen
- Interaction components:
  - draggable species cards
  - tree workspace with clear drop targets
  - submit / reset / reveal actions
  - progress indicator for quiz 1/3, 2/3, 3/3
- UX requirements:
  - clear affordances for valid drop targets
  - animations kept secondary to correctness and readability
  - accessible labels, keyboard fallback if feasible
  - responsive interaction patterns that work well on touch devices as well as pointer-driven desktop layouts
  - language switching or locale-aware rendering for English and Simplified Chinese

### 5. Answer evaluation
- Normalize user tree and expected tree into a comparable structure.
- Compare clades/topology independent of left/right presentation order.
- Return:
  - correct / incorrect
  - canonical solved tree for rendering
- Do not implement partial-credit scoring in v1.
- Keep evaluation logic shared or mirrored safely between client and server to avoid mismatch.

### 6. Backend/API plan
- Minimal backend responsibilities:
  - serve daily quiz set
  - optionally validate submissions
  - expose reveal payload
  - store results if accounts or anonymous local history are needed
- Candidate endpoints:
  - `GET /api/daily/:dayKey`
  - `POST /api/quizzes/:id/submit`
  - `GET /api/quizzes/:id/reveal` or include reveal with submit response
- If no backend is desired for v1, a static dataset plus deterministic client-side selection is possible, but content would be publicly inspectable.

### 7. Persistence and progression
- Use local storage for completed daily sets, reveal state, and lightweight play history in v1.
- Defer sign-in, cloud saves, streaks, and leaderboards to a later phase.

### 8. Technical delivery plan
- Suggested build path for a greenfield repo:
  1. choose app stack and scaffold project
  2. define shared types and content schema
  3. build static puzzle data seed
  4. implement tree-builder interaction
  5. implement evaluation engine
  6. implement daily puzzle selector
  7. wire reveal/explanation flow
  8. add persistence and polish
- Strong candidate stack if no preference:
  - React + TypeScript frontend
  - simple Node/TypeScript API or framework-integrated routes
  - JSON/content-file puzzle source for v1

## Suggested implementation phases

### Phase 1: foundation
- Scaffold the React + TypeScript app and the lightweight Node/API layer.
- Scaffold app, linting, formatting, and test setup from ecosystem defaults.
- Define domain types for species, tree nodes, puzzles, daily sets, and results.
- Define the localization model for UI copy and bilingual puzzle content.

### Phase 2: content system
- Build initial puzzle schema and validation.
- Author a starter dataset with at least 150 quizzes to support 50 days of daily rotation.
- Document the content authoring rules.
- Require Simplified Chinese translations for species names and reveal/explanation content as part of content validation.

### Phase 3: gameplay UI
- Implement drag-and-drop tree builder.
- Render current quiz species set and workspace.
- Add submit/reset flow and basic error states.

### Phase 4: evaluation and reveal
- Build topology normalization and comparison logic.
- Render solved tree and explanation panel.
- Ensure reveal is available after answer resolution regardless of correctness.

### Phase 5: daily challenge flow
- Implement date-based deterministic set selection.
- Add multi-quiz session flow for the 3 daily quizzes.
- Save completion state and resume behavior.

### Phase 6: polish and expansion
- Improve accessibility and mobile ergonomics.
- Add history/archive, streaks, and social features if desired.
- Add analytics and admin/content tooling if project scope grows.
- Expand beyond Simplified Chinese only if additional locales become a product goal later.

## Notes and risks
- The hardest technical component is not the API; it is designing an intuitive tree-building interaction that works well on small screens.
- Content ambiguity is a product risk. Puzzles must be curated so there is only one clearly correct topology under the game’s rules.
- If answers are checked client-side only, puzzle solutions are discoverable by inspecting shipped data.
- Time-zone behavior can create confusion; one global reset rule should be chosen explicitly.
- The number of authored puzzles needed depends on repeat tolerance and whether archives are visible.
- Bilingual content increases authoring workload, so translation completeness and terminology consistency should be validated as part of content QA.

## Resolved planning decisions
- Daily sets reset at each player's local midnight.
- Desktop and mobile are equal priorities for v1.
- V1 should include at least 50 days of curated content.
- Species photos should use externally hosted URLs from permissively licensed or public-domain sources.
- No admin authoring interface is required in the initial build plan.
- V1 should support English and Simplified Chinese, including species names and answer/reveal content.
