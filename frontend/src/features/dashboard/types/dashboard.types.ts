export interface TasksProps {
  title: string;
  description: string;
  dueDate: Date;
  estimatedTime: number;
  priority: string;
  status: string;
  tagIds: number[];
}

export interface Tags {
  id: number;
  name: string;
}
