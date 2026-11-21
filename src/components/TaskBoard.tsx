"use client";

import { useState } from "react";
import { STATUSES, type Status, type Task } from "@/lib/types";

const LABELS: Record<Status, string> = {
  todo: "Todo",
  running: "Agent running",
  review: "In review",
  done: "Done",
};

export function TaskBoard({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function addTask(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title, notes }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "could not add the task");
      return;
    }
    setTasks((current) => [data.task, ...current]);
    setTitle("");
    setNotes("");
  }

  async function move(task: Task, status: Status) {
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) return;
    const data = await response.json();
    setTasks((current) => current.map((item) => (item.id === task.id ? data.task : item)));
  }

  async function remove(task: Task) {
    const response = await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
    if (response.ok) setTasks((current) => current.filter((item) => item.id !== task.id));
  }

  return (
    <>
      <form className="add" onSubmit={addTask}>
        <input
          aria-label="Task title"
          placeholder="What should the agent do?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <input
          aria-label="Notes"
          placeholder="Notes or the spec link (optional)"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
        <button type="submit">Add task</button>
      </form>
      {error ? <p role="alert" className="error">{error}</p> : null}
      <section className="columns">
        {STATUSES.map((status) => {
          const column = tasks.filter((task) => task.status === status);
          return (
            <div className="column" key={status}>
              <h2>
                {LABELS[status]} <span>{column.length}</span>
              </h2>
              {column.length === 0 ? <p className="empty">Nothing here yet.</p> : null}
              {column.map((task) => (
                <article className="card" key={task.id}>
                  <h3>{task.title}</h3>
                  {task.notes ? <p>{task.notes}</p> : null}
                  <div className="actions">
                    <select
                      aria-label={`Move ${task.title}`}
                      value={task.status}
                      onChange={(event) => move(task, event.target.value as Status)}
                    >
                      {STATUSES.map((value) => (
                        <option key={value} value={value}>
                          {LABELS[value]}
                        </option>
                      ))}
                    </select>
                    <button type="button" onClick={() => remove(task)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          );
        })}
      </section>
    </>
  );
}
