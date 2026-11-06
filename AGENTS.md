# AGENTS.md

Instructions for AI coding agents working in **git-who**.

## What this project is

git-who is a React + Vite app that turns a public GitHub username into a readable developer profile. The user searches a username, then sees four tabs: **Profile, Repositories, Activity, Summary**. The Activity tab includes a contribution heatmap.

The owner is using this repo to **learn backend development** and to **improve the UI**.

- **Agents work on the UI** (frontend only).
- **The owner writes the backend herself.** Do not write, rewrite, or "fix" it.

Background docs in the repo root: `prd.md` (requirements and rules), `Plan.md` (original plan), `how-it-works.md` (product behavior). Read `prd.md` section 3 before changing anything; its "preserve existing work" rules still apply.

## Commands

```bash
npm install          # install dependencies
npm run dev          # Vite dev server (frontend)
npm run build        # production build
npm run lint         # ESLint (flat config, react-hooks + react-refresh rules)
node server/index.js # Express backend on :5000 (owner-run; agents do not edit it)
```

There is no test suite. Before reporting a task as done, run `npm run lint` and `npm run build` and fix any problems you introduced. To see the UI working end to end, the backend must be running, but ask the owner to start it rather than changing it.

## Tech stack

- React 19, function components and hooks only, JavaScript (`.jsx`), no TypeScript
- Vite 8, `@vitejs/plugin-react`
- Styling: **plain CSS**, mostly in `src/App.css` (`src/index.css` holds only global resets and the body background)
- Icons: `lucide-react` and `react-icons` (already installed; use these, don't add another icon set)
- No router, no state library, no UI or chart library. Keep it that way.

## Project layout

```
src/
  main.jsx                  entry point
  App.jsx                   search state + all fetches, renders Navbar, LandingPage, Analysis
  App.css / index.css       styles
  components/
    Navbar, LandingPage, Hero, DashboardPrev   landing / search area
    Analysis.jsx            tab container (tab state lives here)
    Profile, Repositories, Activity, ContributionHeatmap, Summary   the four tabs
  api/githubGraphQL.js      contribution calendar helper
  assets/                   images and SVGs
server/index.js             Express backend (OFF LIMITS, see below)
```

Data flow: `App.jsx` fetches from the backend and passes `user`, `repos`, `events`, `contributions` down through `Analysis` into each tab as props. Tabs only render data; keep it that way.

## Hard boundaries (do not touch)

- `server/` and anything in it: routes, ports, token handling, response shapes
- `.env`: never read, print, quote, or commit it. It holds a GitHub token.
- `src/api/githubGraphQL.js` and the fetch URLs/logic in `App.jsx`. If a UI change seems to need different data, **stop and tell the owner what data you need** instead of changing the fetch or the backend.
- The shape of the props each tab receives (`user`, `repos`, `events`, `contributions`)
- `package.json` dependencies: do not add packages without asking first

If a task can only be done by crossing one of these lines, say so and propose options. Do not work around it.

## What agents should do

UI enhancement work, for example:

- Layout, spacing, typography, and visual consistency across the four tabs
- Responsive behavior and mobile polish
- Loading, empty, and error states (currently minimal: plain `<p>` text in `App.jsx`)
- Accessibility: semantic elements, keyboard support, focus styles, contrast, alt text
- Replacing repeated inline styles with CSS classes
- Small, tasteful interaction polish (hover and focus states, tab transitions)

## Design system (current visual identity)

Dark, minimal, GitHub-style. Keep this identity unless the owner asks for a redesign.

| Role                      | Value                                                                          |
| ------------------------- | ------------------------------------------------------------------------------ |
| Page background           | `#0d1117` (body also has a radial gradient to `#313d50`)                       |
| Analysis panel background | `#151d29`                                                                      |
| Cards / surfaces          | `#161b22`                                                                      |
| Borders                   | `#30363d`                                                                      |
| Primary text              | `#f0f6fc` / `#f8fafc`                                                          |
| Secondary text            | `#8b949e`                                                                      |
| Active tab                | `#2a3038`                                                                      |
| Error text                | `#f87171`                                                                      |
| Accent                    | GitHub green (match the heatmap `.level-1` to `.level-4` classes in `App.css`) |

- Colors are currently hard-coded hex values; there are no CSS variables yet. Use the existing values. Introducing `:root` variables is welcome only if the owner asks for that refactor.
- Fonts: system stack on `body`. `index.html` also loads Playfair Display. Check where a font is used before changing it.
- Existing responsive breakpoints in `App.css`: `max-width: 750px`, `751-999px`, `1000-1299px`, `min-width: 1300px`. Reuse these instead of inventing new ones.

## UI conventions

- Put new styles in `App.css` using class names; follow the existing naming (`.activity-tab`, `.heatmap-card`, `.top-five-repo`: lowercase, hyphenated, prefixed by feature). Add a section comment header like the existing `/* ── Activity Tab ── */` blocks.
- Avoid adding new inline `style={{}}`. The codebase already has many (around 50); migrate them to classes only in components you are already editing, not as a sweeping refactor.
- Optional GitHub fields (bio, location, company, website, Twitter, repo description, language) may be missing. Render conditionally and never show `null`, `undefined`, empty labels, or broken links.
- Design for long usernames, long repo names, long descriptions, users with zero repos, and empty activity.
- Interactive elements must be real `<button>` or `<a>` elements (the tabs in `Analysis.jsx` are currently clickable `<div>`s; fix this if you're touching tabs, keeping the look identical).
- Keep components small and readable. Reuse existing components before creating new ones.
- Don't introduce animation libraries, gradients, or decorative elements that weren't asked for.

## Working style

1. **Preserve the owner's work.** Extend and polish; don't rewrite working components, rename things for style, or swap in library solutions.
2. **Keep changes small and scoped** to the request. No drive-by refactors.
3. **Keep it learnable.** The owner is learning React and JavaScript. Prefer simple, straightforward code and add a short comment where something non-obvious is happening.
4. **Ask before big moves:** redesigns, new dependencies, restructuring folders, changing how tabs or state work.
5. After finishing, summarize briefly: which files changed, what you did and why, and anything you noticed but intentionally left alone (including backend or data issues you spotted, flagged for the owner to handle).

## Known quirks (flag, don't silently fix)

- `App.jsx` hard-codes `http://localhost:5000` for every fetch.
- `Analysis.jsx` tracks the active tab by number (1 to 4) and has leftover commented-out code.
- Several early errors in `App.jsx` fall back to a generic "User not found." message.

These touch data flow or backend integration, so report them to the owner rather than changing them as part of a UI task.
