# Live task for the screen recording: add task priority

Goal: show the whole agent loop on a real change in about two minutes.

## The change
Add a `priority` to every task: `low` | `normal` | `high`, default `normal`.
1. Data: new column, existing rows become `normal`.
2. API: `POST` accepts `priority`, `PATCH` can change it, invalid values return 400.
3. UI: a priority select on the add form, a priority badge on each card, and a filter above the columns (All, High, Normal, Low).
4. Tests: validation, create with priority, patch priority, default value.

## The loop to show, in order
1. Say the task and open `docs/SPEC.md`. Add one line to section 3 first (the spec leads).
2. Ask Claude Code for a plan only. Read it out loud. Approve it.
3. Slice 1: validation and data layer with tests first. Show the diff. Run `npm test`.
4. Slice 2: API. Run `npm test` and `npm run typecheck`.
5. Slice 3: UI badge and filter. Open the app, add a high task, filter on High.
6. Run `node scripts/e2e.mjs`. Commit with a one-line message.

## Prompt to start (paste into Claude Code)
> Read CLAUDE.md and docs/SPEC.md. I want to add a task priority (low, normal, high, default normal) with a priority filter in the UI. Do not write code yet. Give me a plan in three slices: data and validation, API, UI. Each slice must list the tests it adds.

## If time runs short
Stop after slice 2, show the green tests, say what slice 3 is, and move on. A clean stop beats a rushed finish.

A reference solution is in `docs/reference/priority.patch` (apply with `git apply`) so you can check your result. Do not show it on camera.
