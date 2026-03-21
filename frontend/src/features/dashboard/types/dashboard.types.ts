export interface TasksProps {
  title: string;
  description: string;
  dueDate: Date | string;
  estimatedTime: number;
  priority: string;
  status: string;
  tagIds: number[];
}

export interface Task {
  id: number;
  userId: number;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done" | string;
  priority: "low" | "medium" | "high" | string;
  dueDate: string;
  estimatedTime: number;
  tags?: Tags[];
}

export interface UpdateTaskPayload {
  status?: string;
  priority?: string;
  title?: string;
  description?: string;
  dueDate?: string;
  estimatedTime?: number;
}

export interface Tags {
  id: number;
  name: string;
}
