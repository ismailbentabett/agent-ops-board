import type { DatabaseSync } from "node:sqlite";
import type { NewTask, Status, Task, TaskPatch } from "./types";

type Row = {
  id: number;
  title: string;
  status: Status;
  notes: string;
  created_at: string;
  updated_at: string;
};

function toTask(row: Row): Task {
  return {
    id: row.id,
    title: row.title,
    status: row.status,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function listTasks(db: DatabaseSync): Task[] {
  const rows = db.prepare("SELECT * FROM tasks ORDER BY id DESC").all() as Row[];
  return rows.map(toTask);
}

export function getTask(db: DatabaseSync, id: number): Task | null {
  const row = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id) as Row | undefined;
  return row ? toTask(row) : null;
}

export function createTask(db: DatabaseSync, input: NewTask): Task {
  const now = new Date().toISOString();
  const result = db
    .prepare("INSERT INTO tasks (title, status, notes, created_at, updated_at) VALUES (?, 'todo', ?, ?, ?)")
    .run(input.title, input.notes ?? "", now, now);
  return getTask(db, Number(result.lastInsertRowid))!;
}

export function updateTask(db: DatabaseSync, id: number, patch: TaskPatch): Task | null {
  const current = getTask(db, id);
  if (!current) return null;
  const next = { ...current, ...patch };
  db.prepare("UPDATE tasks SET title = ?, status = ?, notes = ?, updated_at = ? WHERE id = ?").run(
    next.title,
    next.status,
    next.notes,
    new Date().toISOString(),
    id,
  );
  return getTask(db, id);
}

export function deleteTask(db: DatabaseSync, id: number): boolean {
  const result = db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}
