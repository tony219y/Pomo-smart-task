"use client"
import CreateTask from "@/features/dashboard/components/CreateTask"
import { useTasks } from "@/features/dashboard/hooks/use-task"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { Task } from "@/features/dashboard/types/dashboard.types"
import TaskDetailDialog from "@/features/dashboard/components/TaskDetailDialog"

const DashboardPage = () => {
  const { tasks, isLoadingTasks, updateTask, deleteTask } = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  const handleToggleStatus = async (taskId: number, status: string) => {
    const nextStatus = status === "done" ? "todo" : "done";
    await updateTask({ taskId, data: { status: nextStatus } });
  };

  const handleSaveTaskDetail = async (
    taskId: number,
    payload: {
      title: string;
      description: string;
      priority: string;
      dueDate: string;
      estimatedTime: number;
    },
  ) => {
    await updateTask({
      taskId,
      data: {
        title: payload.title,
        description: payload.description,
        priority: payload.priority,
        dueDate: payload.dueDate,
        estimatedTime: payload.estimatedTime,
      },
    });
  };

  return (
    <div className="space-y-10">
      <header className="flex w-full h-25 border">

      </header>
      <main>
        {/* mid */}
        <div className="max-w-2xl h-full space-y-4">
          {/* add a tasks */}
          <CreateTask />
          {/* tasks list */}
          <div className="space-y-3">
            {isLoadingTasks ? (
              <p className="text-sm text-muted-foreground">Loading tasks...</p>
            ) : tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tasks yet. Create one to get started.</p>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="rounded-lg border bg-white p-4 flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{task.title}</h3>
                      <Badge variant={task.status === "done" ? "default" : "secondary"}>
                        {task.status}
                      </Badge>
                      <Badge variant="outline">{task.priority}</Badge>
                    </div>
                    {task.description ? (
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    ) : null}
                    <p className="text-xs text-muted-foreground">
                      Est. {task.estimatedTime} min
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      onClick={() => {
                        setSelectedTask(task);
                        setOpenDetail(true);
                      }}
                    >
                      Details
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleToggleStatus(task.id, task.status)}
                    >
                      {task.status === "done" ? "Mark Todo" : "Mark Done"}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* right */}
        <div>

        </div>
      </main>
      <TaskDetailDialog
        open={openDetail}
        task={selectedTask}
        onOpenChange={setOpenDetail}
        onSave={handleSaveTaskDetail}
      />
    </div>
  )
}

export default DashboardPage
