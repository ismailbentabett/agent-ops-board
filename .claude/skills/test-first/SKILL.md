---
name: test-first
description: Test-first rule for every slice. Load before writing any code in this repo.
---
1. Write the failing test that describes the behaviour. Run `npm test` and see it fail for the right reason.
2. Write the smallest code that makes it pass.
3. Run `npm test` and `npm run typecheck`.
4. Show the diff before committing. One reason per commit.
Validation and data-layer tests use `openDb(":memory:")`, never the real database file.
