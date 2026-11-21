import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { createTask, listTasks } from "@/lib/tasks";
import { parseNewTask, ValidationError } from "@/lib/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ tasks: listTasks(getDb()) });
}

export async function POST(request: Request) {
  try {
    const input = parseNewTask(await request.json());
    return NextResponse.json({ task: createTask(getDb(), input) }, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }
}
