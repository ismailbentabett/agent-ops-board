# My dev environment

- Machine: Windows PC, working remotely from Algeria (UTC+1).
- Server: a VPS over SSH for Docker services and long jobs.
- Agent: Claude Code in the terminal, Claude chat for planning and review.
- Editor and terminal: whatever is open on screen in the recording.
- Per-project rules: `CLAUDE.md` and `.claude/skills/` in each repo, so the agent follows the same rules every session.
- Checks: Vitest and TypeScript strict on every change, Playwright for the browser, Maestro for mobile apps, GitLab CI/CD or GitHub Actions for deploys.
- Git: feature branches, small commits, one reason per commit.

## The loop
spec, plan, approve, small slice, tests, diff review, run, commit.
