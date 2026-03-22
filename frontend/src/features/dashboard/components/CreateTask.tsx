"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner";
import { taskSchema } from "../schemas/task.schema";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Tag as TagIcon } from "lucide-react";
import { useTags } from "../hooks/useTags";
import { useTasks } from "../hooks/useTask";
import { Tags } from "../types/dashboard.types";
import { usePathname } from "next/navigation";

const CreateTask = () => {
  const path = usePathname();
  type TaskFormInput = z.input<typeof taskSchema>;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [priority, setPriority] = useState<string>("low");
  const { data: availableTags = [], isLoading: isLoadingTags } = useTags();

  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { createTask } = useTasks();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormInput>({ resolver: zodResolver(taskSchema) });

  const onSubmit = async (data: TaskFormInput) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const payload = {
        title: data.title,
        description: data.Description,
        dueDate: data.DueDate as Date,
        estimatedTime: Number(data.Estimated_time),
        priority: priority,
        status: "todo",
        tagIds: selectedTagIds,
      };
      await createTask(payload);

      reset();
      setSelectedTagIds([]);
      setPriority("low");
      setIsOpen(false);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {path !== "/tasks" ? (
        <DialogTrigger
          className="w-full rounded-lg border border-border bg-card p-2"
          asChild
        >
          <div className="flex w-full justify-between items-center cursor-pointer">
            <h1 className="opacity-50 pl-5">Add a task for today...</h1>
            <Button
              type="button"
              className="flex items-center gap-4 rounded-lg bg-primary p-2 text-primary-foreground hover:bg-primary/80"
            >
              <Plus color="white" size={20} />
              <strong className="text-white">Add Task</strong>
            </Button>
          </div>
        </DialogTrigger>
      ) : (
        <Button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="flex items-center gap-4 rounded-lg bg-primary p-2 text-primary-foreground hover:bg-primary/80"
        >
          <Plus color="white" size={20} />
          <strong className="text-white">Add Task</strong>
        </Button>
      )}

      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Fill out the details below to create a new task.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Task Name */}
            <div>
              <label className="text-sm font-bold">Task Name</label>
              <Input
                {...register("title")}
                placeholder="e.g. Design Database"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-bold">Description</label>
              <Textarea
                {...register("Description")}
                placeholder="Detail about this task..."
                aria-describedby=""
              />
            </div>

            {/* Date & Time Row */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-bold">Due Date</label>
                <Input {...register("DueDate")} type="date" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-bold">Est. Time (min)</label>
                <Input {...register("Estimated_time")} type="number" />
              </div>
            </div>

            {/* Priority */}
            <div className="w-full rounded-md mt-4">
              <label className="text-sm font-bold">Priority Level</label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Priority Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {/* Tags */}
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2">
                <TagIcon size={14} /> Tags
              </label>

              <div className="flex gap-3 max-h-40 w-full overflow-y-auto ">
                {isLoadingTags ? (
                  <p className="text-xs opacity-50 animate-pulse">
                    Loading tags...
                  </p>
                ) : availableTags.length > 0 ? (
                  availableTags.map((tag: Tags) => (
                    <div
                      key={tag.id}
                      className="flex items-center space-x-2 rounded-full border border-border bg-card p-1 px-3 transition-colors hover:bg-accent"
                    >
                      <Checkbox
                        id={`tag-${tag.id}`}
                        checked={selectedTagIds.includes(tag.id)}
                        onCheckedChange={(checked) => {
                          setSelectedTagIds((prev) =>
                            checked
                              ? [...prev, tag.id]
                              : prev.filter((id) => id !== tag.id),
                          );
                        }}
                      />
                      <label
                        htmlFor={`tag-${tag.id}`}
                        className="text-xs font-medium cursor-pointer select-none"
                      >
                        {tag.name}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-xs opacity-50 italic">
                    No tags found. Check your DB or Token.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={isLoading}
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTask;
