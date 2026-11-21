import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

let instance: DatabaseSync | null = null;

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'todo',
    notes TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`;

export function openDb(file: string): DatabaseSync {
  if (file !== ":memory:") fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec(SCHEMA);
  return db;
}

export function getDb(): DatabaseSync {
  if (!instance) {
    const file = process.env.DATABASE_FILE ?? path.join(process.cwd(), "data", "board.db");
    instance = openDb(file);
  }
  return instance;
}
