# Free-form evolution tree interaction redesign plan

## Problem
Redesign the quiz interaction so players can **form an evolution tree freely** instead of only filling predetermined slots in a fixed layout. The new interaction should better match the biological model of a single rooted phylogenetic tree and make the player responsible for constructing relationships rather than only assigning species to placeholders.

## Current codebase state
- The app is a React + TypeScript Vite project with daily quiz selection, local progress, bilingual English/Simplified Chinese content, and a measured SVG tree renderer.
- Current gameplay is still **template-first**:
  - quizzes store a fixed `layout`
  - players drag species into predefined `slot`s
  - correctness is checked against fixed `correctPlacements`
- 5-species quizzes currently use a **topology-choice step** before placement.
- Internal tree nodes are not player-created or editable; they are authored in content.
- The renderer displays one connected tree, but the interaction is still fundamentally “fill the blanks,” not “build the tree.”

## Redesign goal
Move from **fixed-slot placement** to **player-constructed tree building** while keeping the game understandable on desktop and mobile.

The redesign should preserve:
- one connected rooted tree per quiz
- bilingual content
- reveal/explanation flow
- deterministic daily quizzes

The redesign should replace:
- fixed authored slot layouts as the main gameplay surface
- topology choice as a separate pre-step for larger puzzles
- content that encodes exact UI layout rather than only the intended phylogenetic structure

## Proposed interaction direction

### Core interaction model
Use a **free-form grouping builder**:
1. Start with all species as separate cards/nodes in a workspace.
2. The player creates relationships by **combining species or existing groups into a new parent clade**.
3. Repeating that operation builds one rooted tree until all species are connected.
4. The final rooted structure is what gets scored.

This is preferable to raw canvas drawing because it:
- keeps the tree biologically valid
- works better on touch devices
- avoids the need for pixel-precise line editing
- gives the user real structural control without requiring full diagram software behavior

### Recommended v1 interaction mechanics
- **Drag one species/group onto another species/group** to create a new sibling pair under a generated parent node.
- Allow selecting two items and tapping **“Group”** as a non-drag mobile/accessible fallback.
- Represent created clades as cards/containers that can themselves be moved or regrouped.
- Allow **Ungroup** on the most recently created parent, and ideally on any selected clade if it is safe.
- Keep one explicit **root area** so the player understands the goal is a single connected tree.

### What “free” should mean in this redesign
- The player decides the grouping order and final topology.
- The system auto-creates internal nodes rather than asking users to manually draw branch lines.
- Left/right branch order should not matter.
- The tree remains constrained to valid binary combinations unless future content explicitly supports non-binary nodes.

## Product and UX plan

### 1. Replace fixed layouts with tree-state editing
Current authored `layout` trees should stop being the primary interaction scaffold.

Instead, runtime state should include:
- leaf nodes for species
- generated internal nodes created by the player
- parent/child relationships
- root node id
- selection state
- edit history for undo/redo

### 2. New player workflow
For every quiz:
1. Show species cards in an ungrouped workspace
2. Let the player combine species/groups into clades
3. Let the player revise structure via ungroup/move/reset/undo
4. Submit once a single rooted tree is formed
5. Reveal the solved tree and explanation

This removes the need for a separate topology-choice screen, because topology emerges directly from user actions.

### 3. Mobile and desktop interaction rules
- **Desktop**
  - drag node/group onto node/group to create a parent clade
  - click to select
  - keyboard shortcuts for undo/reset if added
- **Mobile**
  - tap one node/group, tap another, then choose **Group**
  - avoid relying on HTML5 drag-and-drop as the only interaction
  - keep targets large and avoid fine-motor branch editing

### 4. Visual representation
- Show the current tree as a structured diagram, but separate **editing logic** from **rendering layout**.
- Internal nodes should be visible as clade joints or compact containers.
- Species not yet connected should remain visible in an “ungrouped” or “available taxa” area.
- When the tree is incomplete, show progress such as:
  - species remaining outside the connected tree
  - clades formed
  - whether the quiz is ready to submit

### 5. Editing affordances
Recommended controls:
- Group selected items
- Undo
- Reset quiz
- Remove species from clade
- Expand/collapse clades only if the UI becomes crowded

Avoid for the first redesign:
- arbitrary branch rotation tools
- freehand edge drawing
- rerooting
- direct manipulation of branch lengths

## Data model redesign

### Current limitation
`QuizTemplate` currently mixes:
- content truth (`correctPlacements`, `correctTopologyId`)
- authored UI structure (`layout`, topology choice layouts)

That structure is too presentation-specific for free-form building.

### Proposed content model
Refactor quiz content to store a **canonical solved tree**, not a UI scaffold.

Suggested conceptual shape:
- `speciesIds`
- `solutionTree`
- `difficulty`
- `prompt`
- `explanation`
- optional metadata/tags

`solutionTree` should be a normalized tree structure where:
- leaves are species ids
- internal nodes are anonymous or stable ids
- child order is semantically irrelevant

### Proposed runtime state
Track a player-built tree separately from authored content:
- node map
- node type (`species` or `internal`)
- parent map
- child arrays
- root id or forest roots while incomplete
- selected node ids
- action history

This will support:
- regrouping
- undo/redo
- structure validation
- rendering independent of authored layout

## Evaluation redesign

### Current limitation
Evaluation is based on exact slot-to-species assignment.

### Proposed evaluation model
Evaluate based on **tree topology**, not UI placement.

Key rules:
- left/right order does not matter
- score only when a single connected rooted tree exists
- compare the player tree against the canonical solved tree after normalization

Recommended implementation approach:
1. Convert both solution tree and player tree into a canonical representation
2. Normalize child ordering
3. Compare clade sets or canonical serialized trees

This also opens the door to future partial-credit scoring, though v1 can remain all-or-nothing.

## Rendering redesign

### Current limitation
The renderer expects an authored `LayoutNode` tree with slot placeholders.

### Proposed rendering direction
Refactor the renderer to consume generic runtime trees:
- leaves render species cards
- internal nodes render joints/containers
- incomplete state can render multiple disconnected components until the user connects them

Recommended architecture:
- **tree editor state**: authoritative interaction model
- **layout engine**: computes positions for current tree/forest
- **renderer**: pure visual output with measured connectors

This separation is important because “free-form” interaction should not depend on authored slot ids.

## Implementation phases

### Phase 1: define interaction and state model
- Replace `layout`-driven interaction assumptions in types and content design
- Define canonical solution-tree schema
- Define editable runtime node graph and action model
- Decide whether incomplete user state can temporarily be a forest before final submission

### Phase 2: build a free-form editor engine
- Implement grouping/ungrouping logic
- Implement root/forest tracking
- Implement undo/reset behavior
- Add submit gating only when one valid rooted tree exists

### Phase 3: refactor rendering
- Replace slot-focused renderer with generic tree/forest rendering
- Render both complete and incomplete states
- Keep connectors visually correct across responsive layouts

### Phase 4: migrate quiz content
- Convert quiz templates from fixed layouts to canonical solution trees
- Remove topology-choice content from 5-species quizzes
- Keep bilingual prompts/explanations

### Phase 5: update evaluation and reveal
- Compare player-built topology against canonical solution tree
- Render a canonical solved tree on reveal
- Optionally highlight incorrect clades later

### Phase 6: polish accessibility and mobile UX
- Add tap-first grouping flow
- Improve hit targets and selection states
- Add non-drag fallback for all critical actions

## Risks and tradeoffs
- Free-form editing is more powerful, but easier to make confusing without strong affordances.
- Raw drag-and-draw interactions would be flexible but are likely too fragile for mobile; grouping-based editing is safer.
- Migrating content from layout-driven quizzes to canonical trees will touch content, types, evaluation, and rendering together.
- Undo/ungroup behavior must be carefully designed or users will feel trapped by mistaken grouping actions.
- A temporary incomplete forest during editing is acceptable as a build state, but final submission must require one connected tree.

## Recommended design decisions
- Use **grouping-based construction**, not freehand branch drawing
- Keep trees **binary** in v1
- Allow temporary disconnected components during editing
- Require a **single rooted connected tree** before submission
- Remove the separate topology-choice step once free-form construction is in place
- Treat rendering as a projection of editor state, not as the source of truth

## Open questions
1. Should players be allowed to temporarily keep several disconnected clades in the workspace and connect them later, or should every action always update one growing main tree?
2. Should v1 include **undo only**, or full **undo + redo + arbitrary ungrouping**?
3. For mobile, do you want the primary interaction to be **tap-to-select and Group**, with drag as secondary, or should drag remain primary everywhere?
