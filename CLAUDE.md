# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

```bash
pnpm run dev        # Start Next.js dev server
pnpm run build      # Production build (run before committing to verify)
pnpm run lint       # ESLint check
pnpm run format     # Biome formatter (if configured)
```

No test framework is currently set up.

## Tech Stack

- **Next.js 16** (App Router) with **React 19** and **TypeScript** (strict mode)
- **Tailwind CSS v4** via `@tailwindcss/postcss`
- **ESLint 9** (flat config) with `eslint-config-next`
- **pnpm** package manager
- Path alias: `@/*` → `./src/*`
- All UI is custom (no component library)
- UI language is **French**

## Architecture

### Game System

The app is a brain training platform with 11 mini-games, each in `src/games/[game-name]/`:
- `[GameName].tsx` — React component implementing `GameComponentProps`
- `config.ts` — Difficulty levels (1–4) and duration settings
- `logic.ts` — Pure game logic (problem generation, answer validation)

`src/games/registry.ts` — Central `GAME_REGISTRY` mapping game IDs to metadata (name, skills, icon, color, duration).
`src/games/types.ts` — Re-exports game types.

### State Management

Two React contexts in `src/components/providers/`:
- **PlayerProvider** — Player stats, skill scores, game history (persisted to localStorage with `bt_` prefix)
- **SettingsProvider** — Sound toggle, default difficulty

Custom hooks in `src/hooks/`:
- `useGame` — Full game lifecycle (idle → instructions → playing → finished), score tracking, answer submission
- `useTimer` — RAF-based countdown with pause/resume
- `useChainMode` — Sequential multi-game sessions
- `useLocalStorage` — Type-safe localStorage wrapper

### Game Flow

`GameShell` (`src/components/game/`) wraps every game — manages state lifecycle, HUD (timer/score/progress), completion, and result persistence. Supports both single-game and chain mode.

### Routing

- `/` — Dashboard (recent activity, skill radar chart)
- `/jeux` — Game selector
- `/jeux/[gameId]` — Individual game
- `/jeux/enchainement` — Chain mode (all games sequentially)
- `/resultats` — Stats and history

### Scoring (`src/lib/scoring.ts`)

Base 100 pts per correct answer, speed multiplier (up to 2x under 5s), streak bonus (+10/streak, max 10).

### Types (`src/types/`)

Key types: `CognitiveSkill` (7 skills: calcul, memoire, logique, vitesse, langage, attention, culture), `DifficultyLevel` (1–4), `GameStatus`, `GameConfig`, `GameState`, `PlayerStats`.

## Code Conventions

- Functional components with hooks only
- Game logic separated from UI (logic.ts vs component)
- Context API for global state — no prop drilling
- `as any` is forbidden
- Mobile-first responsive design (max-w-3xl container)
- CSS theme variables defined in `src/app/globals.css` with skill-specific colors

## Git Workflow

After every completed set of tasks, stage and commit all changes. Format: `[type]: [description]` with body containing user request, changes made, and co-author tag.
