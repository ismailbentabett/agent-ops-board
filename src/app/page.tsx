import { getDb } from "@/lib/db";
import { listTasks } from "@/lib/tasks";
import { TaskBoard } from "@/components/TaskBoard";

export const dynamic = "force-dynamic";

export default function Page() {
  const tasks = listTasks(getDb());
  return (
    <main className="page">
      <header className="head">
        <h1>Agent Ops Board</h1>
        <p>Tasks handed to coding agents, from todo to done.</p>
      </header>
      <TaskBoard initialTasks={tasks} />
    </main>
  );
}
