# Agent Ops Board: rules for Claude Code

Small Next.js (App Router) + TypeScript app that tracks tasks handed to coding agents. SQLite through `node:sqlite`, tests with Vitest.

## Commands
- `npm run dev` start the app on http://localhost:3000
- `npm run seed` load demo tasks
- `npm test` unit tests (must pass before every commit)
- `npm run typecheck` TypeScript strict check (must pass before every commit)
- `node scripts/e2e.mjs` browser check against a running server (needs `npm i -D playwright`)

## How we work
1. Read `docs/SPEC.md` before changing behaviour. If the spec is silent, add a line to it first.
2. Ask for a plan, wait for approval, then write code.
3. One small slice at a time. Each slice: tests first, then code, then run `npm test` and `npm run typecheck`.
4. Keep API routes thin. Validation lives in `src/lib/validate.ts`, data access in `src/lib/tasks.ts`.
5. Never edit `data/*.db` by hand. Use `npm run seed`.
6. Commit messages: one line, imperative, one reason per commit.

## Code rules
- TypeScript strict. No `any`.
- Every input from a request goes through a parser in `src/lib/validate.ts`.
- Errors return `{ error: string }` with 400, 404 or 500, never a stack trace.
- UI states: every list has an empty state, every form shows its error.
- No new dependency without a reason written in the commit message.

## Do not
- Do not touch `.github/workflows` without asking.
- Do not change the database schema without updating `src/lib/db.ts`, `scripts/seed.mjs` and the tests together.
