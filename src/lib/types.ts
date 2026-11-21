export const STATUSES = ["todo", "running", "review", "done"] as const;
export type Status = (typeof STATUSES)[number];

export type Task = {
  id: number;
  title: string;
  status: Status;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type NewTask = {
  title: string;
  notes?: string;
};

export type TaskPatch = {
  title?: string;
  status?: Status;
  notes?: string;
};
