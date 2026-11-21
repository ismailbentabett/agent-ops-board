import { beforeEach, describe, expect, it } from "vitest";
import type { DatabaseSync } from "node:sqlite";
import { openDb } from "@/lib/db";
import { createTask, deleteTask, getTask, listTasks, updateTask } from "@/lib/tasks";
import { parseNewTask, parseTaskPatch, ValidationError } from "@/lib/validate";

let db: DatabaseSync;

beforeEach(() => {
  db = openDb(":memory:");
});

describe("tasks", () => {
  it("creates a task in todo and lists newest first", () => {
    const first = createTask(db, { title: "Write the spec" });
    const second = createTask(db, { title: "Build the API", notes: "see docs/SPEC.md" });
    expect(first.status).toBe("todo");
    expect(second.notes).toBe("see docs/SPEC.md");
    expect(listTasks(db).map((task) => task.title)).toEqual(["Build the API", "Write the spec"]);
  });

  it("updates status and keeps the other fields", () => {
    const task = createTask(db, { title: "Review diff", notes: "small slice" });
    const updated = updateTask(db, task.id, { status: "review" });
    expect(updated?.status).toBe("review");
    expect(updated?.title).toBe("Review diff");
    expect(updated?.notes).toBe("small slice");
  });

  it("returns null when updating a missing task", () => {
    expect(updateTask(db, 999, { status: "done" })).toBeNull();
  });

  it("deletes a task once", () => {
    const task = createTask(db, { title: "Throw away" });
    expect(deleteTask(db, task.id)).toBe(true);
    expect(deleteTask(db, task.id)).toBe(false);
    expect(getTask(db, task.id)).toBeNull();
  });
});

describe("validation", () => {
  it("trims the title and rejects an empty one", () => {
    expect(parseNewTask({ title: "  Ship it  " }).title).toBe("Ship it");
    expect(() => parseNewTask({ title: "   " })).toThrow(ValidationError);
  });

  it("rejects a title that is too long", () => {
    expect(() => parseNewTask({ title: "x".repeat(121) })).toThrow(ValidationError);
  });

  it("rejects an unknown status and an empty patch", () => {
    expect(() => parseTaskPatch({ status: "blocked" })).toThrow(ValidationError);
    expect(() => parseTaskPatch({})).toThrow(ValidationError);
  });

  it("accepts a valid patch", () => {
    expect(parseTaskPatch({ status: "running" })).toEqual({ status: "running" });
  });
});
