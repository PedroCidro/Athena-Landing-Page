"use client";

import { useState } from "react";
import { Plus, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KanbanBoard } from "@/components/dashboard/kanban-board";
import { TaskList } from "@/components/dashboard/task-list";
import { TaskForm } from "@/components/dashboard/task-form";

const priorityLabels: Record<string, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  urgent: "Urgente",
};

const taskStatusLabels: Record<string, string> = {
  todo: "A Fazer",
  in_progress: "Em Progresso",
  in_review: "Em Revisão",
  done: "Concluído",
};

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  position: number;
  projectId: string;
  assignee?: { id: string; name: string } | null;
  project?: { id: string; name: string } | null;
  dueDate?: Date | null;
}

export function TasksPageClient({
  tasks,
  projects,
  users,
}: {
  tasks: Task[];
  projects: { id: string; name: string }[];
  users: { id: string; name: string }[];
}) {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sans text-3xl font-bold">Tarefas</h1>
          <p className="text-muted-foreground">
            Gerencie todas as tarefas dos seus projetos
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border">
            <Button
              variant={view === "kanban" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("kanban")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      {view === "kanban" ? (
        <KanbanBoard tasks={tasks} />
      ) : (
        <TaskList
          tasks={tasks.map((t) => ({
            ...t,
            priorityLabel: priorityLabels[t.priority],
            statusLabel: taskStatusLabels[t.status],
          }))}
        />
      )}

      <TaskForm
        projects={projects}
        users={users}
        open={showForm}
        onOpenChange={setShowForm}
      />
    </div>
  );
}
