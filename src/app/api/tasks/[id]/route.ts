import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { deleteTask, updateTask } from "@/lib/tasks";
import { parseTaskPatch, ValidationError } from "@/lib/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PATCH(request: Request, context: Context) {
  const id = parseId((await context.params).id);
  if (id === null) return NextResponse.json({ error: "bad id" }, { status: 400 });
  try {
    const patch = parseTaskPatch(await request.json());
    const task = updateTask(getDb(), id, patch);
    if (!task) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json({ task });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: Context) {
  const id = parseId((await context.params).id);
  if (id === null) return NextResponse.json({ error: "bad id" }, { status: 400 });
  const removed = deleteTask(getDb(), id);
  if (!removed) return NextResponse.json({ error: "not found" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
