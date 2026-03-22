"use client";
import CreateTask from "@/features/dashboard/components/CreateTask";
import { useTasks } from "@/features/dashboard/hooks/useTask";
import TaskCard from "@/features/tasks/components/TaskCard";

const page = () => {
  const { tasks, isLoadingTasks, updateTask, deleteTask } = useTasks();
  return (
    <div className="w-full space-y-10 p-10">
      <div className="flex justify-between items-center border">
        <h1 className="text-4xl">All Tasks</h1>
        <CreateTask />
      </div>
      <div className="flex border">fillter bar</div>
      <div className="flex flex-col border gap-5">
        <TaskCard tasks={tasks}/>
      </div>
    </div>
  );
};

export default page;
