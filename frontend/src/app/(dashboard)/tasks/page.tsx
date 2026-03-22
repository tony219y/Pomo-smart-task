"use client";
import { useMemo, useState } from "react";
import CreateTask from "@/features/dashboard/components/CreateTask";
import { useTasks } from "@/features/dashboard/hooks/useTask";
import { useTags } from "@/features/dashboard/hooks/useTags";
import TaskCard from "@/features/tasks/components/TaskCard";
import TaskFilterBar from "@/features/tasks/components/TaskFilterBar";

const page = () => {
  const { tasks } = useTasks();
  const { data: tags = [] } = useTags();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [tagId, setTagId] = useState("all");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        search.trim() === "" ||
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        (task.description ?? "").toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === "all" || task.status === status;
      const matchesPriority = priority === "all" || task.priority === priority;
      const matchesTag =
        tagId === "all" || task.tags?.some((tag) => String(tag.id) === tagId);

      return matchesSearch && matchesStatus && matchesPriority && matchesTag;
    });
  }, [tasks, search, status, priority, tagId]);

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setPriority("all");
    setTagId("all");
  };

  return (
    <div className="w-full space-y-10 p-10">
      <div className="flex items-center justify-between border border-border rounded-xl bg-card p-4">
        <h1 className="text-4xl">All Tasks</h1>
        <CreateTask />
      </div>
      <TaskFilterBar
        search={search}
        status={status}
        priority={priority}
        tagId={tagId}
        tags={tags}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onPriorityChange={setPriority}
        onTagChange={setTagId}
        onClear={clearFilters}
      />
      <div className="flex flex-col gap-5">
        <TaskCard tasks={filteredTasks} />
      </div>
    </div>
  );
};

export default page;
