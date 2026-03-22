"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tags } from "@/features/dashboard/types/dashboard.types";

interface TaskFilterBarProps {
  search: string;
  status: string;
  priority: string;
  tagId: string;
  tags: Tags[];
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onClear: () => void;
}

const TaskFilterBar = ({
  search,
  status,
  priority,
  tagId,
  tags,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onTagChange,
  onClear,
}: TaskFilterBarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4">
      <Input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search title or description..."
        className="h-10 min-w-55 flex-1 bg-background"
      />

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
      >
        <option value="all">All Status</option>
        <option value="todo">Todo</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <select
        value={priority}
        onChange={(e) => onPriorityChange(e.target.value)}
        className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
      >
        <option value="all">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <select
        value={tagId}
        onChange={(e) => onTagChange(e.target.value)}
        className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
      >
        <option value="all">All Tags</option>
        {tags.map((tag) => (
          <option key={tag.id} value={String(tag.id)}>
            {tag.name}
          </option>
        ))}
      </select>

      <Button variant="outline" onClick={onClear}>
        Clear
      </Button>
    </div>
  );
};

export default TaskFilterBar;
