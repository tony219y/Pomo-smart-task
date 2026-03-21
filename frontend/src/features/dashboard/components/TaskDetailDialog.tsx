"use client";

import { useEffect, useState } from "react";
import { Task } from "../types/dashboard.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TaskDetailDialogProps = {
  open: boolean;
  task: Task | null;
  onOpenChange: (open: boolean) => void;
  onSave: (taskId: number, payload: {
    title: string;
    description: string;
    priority: string;
    dueDate: string;
    estimatedTime: number;
  }) => Promise<void>;
};

const toInputDate = (dateValue: string) => {
  if (!dateValue) return "";
  return new Date(dateValue).toISOString().slice(0, 10);
};

export default function TaskDetailDialog({
  open,
  task,
  onOpenChange,
  onSave,
}: TaskDetailDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState("");
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!task) return;
    setTitle(task.title ?? "");
    setDescription(task.description ?? "");
    setPriority(task.priority ?? "low");
    setDueDate(toInputDate(task.dueDate));
    setEstimatedTime(task.estimatedTime ?? 0);
  }, [task]);

  const handleSave = async () => {
    if (!task || isSaving) return;
    setIsSaving(true);
    try {
      await onSave(task.id, {
        title,
        description,
        priority,
        dueDate,
        estimatedTime: Number(estimatedTime),
      });
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
          <DialogDescription>Edit task information and save changes.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Priority</label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Estimated (min)</label>
              <Input
                type="number"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(Number(e.target.value))}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Due date</label>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
