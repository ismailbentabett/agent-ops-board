import { STATUSES, type NewTask, type Status, type TaskPatch } from "./types";

export class ValidationError extends Error {}

function isStatus(value: unknown): value is Status {
  return typeof value === "string" && (STATUSES as readonly string[]).includes(value);
}

function cleanText(value: unknown, field: string, max: number): string {
  if (typeof value !== "string") throw new ValidationError(`${field} must be a string`);
  const trimmed = value.trim();
  if (trimmed.length > max) throw new ValidationError(`${field} is longer than ${max} characters`);
  return trimmed;
}

export function parseNewTask(body: unknown): NewTask {
  if (typeof body !== "object" || body === null) throw new ValidationError("body must be an object");
  const input = body as Record<string, unknown>;
  const title = cleanText(input.title, "title", 120);
  if (title.length === 0) throw new ValidationError("title is required");
  const notes = input.notes === undefined ? "" : cleanText(input.notes, "notes", 2000);
  return { title, notes };
}

export function parseTaskPatch(body: unknown): TaskPatch {
  if (typeof body !== "object" || body === null) throw new ValidationError("body must be an object");
  const input = body as Record<string, unknown>;
  const patch: TaskPatch = {};
  if (input.title !== undefined) {
    const title = cleanText(input.title, "title", 120);
    if (title.length === 0) throw new ValidationError("title cannot be empty");
    patch.title = title;
  }
  if (input.notes !== undefined) patch.notes = cleanText(input.notes, "notes", 2000);
  if (input.status !== undefined) {
    if (!isStatus(input.status)) throw new ValidationError(`status must be one of ${STATUSES.join(", ")}`);
    patch.status = input.status;
  }
  if (Object.keys(patch).length === 0) throw new ValidationError("nothing to update");
  return patch;
}
