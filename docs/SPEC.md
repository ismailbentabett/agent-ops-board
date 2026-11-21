# Spec: Agent Ops Board

## 1. Goal
One place to see every task handed to a coding agent and where it is: todo, agent running, in review, done.

## 2. Users
One developer or a small team. No login in v1.

## 3. Data
Task: `id`, `title` (1 to 120 characters), `status` (`todo` | `running` | `review` | `done`), `notes` (0 to 2000 characters), `createdAt`, `updatedAt`.

## 4. API
- `GET /api/tasks` returns `{ tasks }`, newest first.
- `POST /api/tasks` body `{ title, notes? }` returns 201 `{ task }`, status starts as `todo`.
- `PATCH /api/tasks/:id` body any of `{ title, status, notes }` returns `{ task }`. 404 if missing, 400 if the patch is empty or invalid.
- `DELETE /api/tasks/:id` returns 204, 404 if missing.
- Errors are `{ error: string }`.

## 5. UI
- Four columns, one per status, each with a count and an empty state.
- Add form with title and notes. A failed add shows the server error under the form.
- Each card has a status select and a delete button.

## 6. Non-goals (v1)
Login, drag and drop, realtime sync, comments.

## 7. Done means
`npm test`, `npm run typecheck` and `node scripts/e2e.mjs` all pass.
