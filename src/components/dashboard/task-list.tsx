"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  todo: "bg-gray-100 text-gray-800",
  in_progress: "bg-blue-100 text-blue-800",
  in_review: "bg-yellow-100 text-yellow-800",
  done: "bg-green-100 text-green-800",
};

const priorityColors: Record<string, string> = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  statusLabel: string;
  priorityLabel: string;
  assignee?: { id: string; name: string } | null;
  dueDate?: Date | null;
}

export function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        Nenhuma tarefa encontrada
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <Link
          key={task.id}
          href={`/dashboard/tasks/${task.id}`}
          className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
        >
          <div className="flex items-center gap-3">
            <div>
              <p className="font-medium">{task.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="secondary"
                  className={`text-xs ${statusColors[task.status]}`}
                >
                  {task.statusLabel}
                </Badge>
                <Badge
                  variant="secondary"
                  className={`text-xs ${priorityColors[task.priority]}`}
                >
                  {task.priorityLabel}
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            {task.assignee && <p>{task.assignee.name}</p>}
            {task.dueDate && (
              <p>{new Date(task.dueDate).toLocaleDateString("pt-BR")}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
