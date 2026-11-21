---
name: api-route-pattern
description: How API routes are written in this repo. Load when adding or changing a route under src/app/api.
---
- A route file only parses input, calls a function in `src/lib/tasks.ts`, and maps the result to a response.
- Parse with a function from `src/lib/validate.ts`. Catch `ValidationError` and return `{ error }` with 400.
- Params in Next 16 are a Promise: `const { id } = await context.params`.
- 404 when the row is missing. 204 with no body for delete.
- Add `export const runtime = "nodejs"` and `export const dynamic = "force-dynamic"` because the data layer uses `node:sqlite`.
