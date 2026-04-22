# letsTree

letsTree is a daily phylogeny puzzle game. Each day, players solve 3 quizzes by dragging species into the correct evolutionary tree structure, then reveal the full solution and explanation.

## Features

- 3 daily quizzes with easy / medium / hard progression
- Drag-or-tap tree building
- Exact-match answer checking
- Full solution reveal after submission
- Anonymous local progress
- English and Simplified Chinese support
- 50+ days of curated quiz content

## Tech stack

- React
- TypeScript
- Vite
- Vitest

## Getting started

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev      # start the dev server
npm run build    # create a production build
npm run preview  # preview the production build
npm test         # run the test suite
npm run update-species-images  # refresh species thumbnails from Wikipedia/Wikimedia
```

## Content notes

- Daily sets reset at each player’s local midnight.
- Species names, explanations, and UI copy are bilingual in English and Simplified Chinese.
- Species photos are pre-resolved from Wikipedia's API and point at properly sized Wikimedia-hosted thumbnails.
