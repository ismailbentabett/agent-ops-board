import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

const file = process.env.DATABASE_FILE ?? path.join(process.cwd(), "data", "board.db");
fs.mkdirSync(path.dirname(file), { recursive: true });
const db = new DatabaseSync(file);
db.exec(`CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'todo',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);`);
db.exec("DELETE FROM tasks");
const now = Date.now();
const rows = [
  ["Write the spec for the export endpoint", "done", "docs/SPEC.md, section 4"],
  ["Add rate limiting to the public API", "review", "Agent opened a PR, check the diff"],
  ["Migrate the invoice table to Postgres", "running", "Plan approved, slice 2 of 4"],
  ["Fix the flaky checkout test", "running", "Playwright trace attached"],
  ["Add CSV export to the reports page", "todo", ""],
  ["Document the deploy steps", "todo", "Keep it to one page"],
];
rows.forEach(([title, status, notes], index) => {
  const stamp = new Date(now - (rows.length - index) * 3600_000).toISOString();
  db.prepare("INSERT INTO tasks (title, status, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?)").run(title, status, notes, stamp, stamp);
});
console.log(`seeded ${rows.length} tasks into ${file}`);
