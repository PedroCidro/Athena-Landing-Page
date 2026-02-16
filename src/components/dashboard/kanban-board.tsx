"use client";

import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { updateTaskPositions } from "@/lib/actions/task";
import { User, Calendar } from "lucide-react";

interface KanbanTask {
  id: string;
  title: string;
  status: string;
  priority: string;
  position: number;
  assignee?: { id: string; name: string } | null;
  project?: { id: string; name: string } | null;
  dueDate?: Date | null;
}

const columns = [
  { id: "todo", label: "A Fazer" },
  { id: "in_progress", label: "Em Progresso" },
  { id: "in_review", label: "Em Revisão" },
  { id: "done", label: "Concluído" },
] as const;

const columnColors: Record<string, string> = {
  todo: "border-t-gray-400",
  in_progress: "border-t-blue-400",
  in_review: "border-t-yellow-400",
  done: "border-t-green-400",
};

const priorityColors: Record<string, string> = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

const priorityLabels: Record<string, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  urgent: "Urgente",
};

export function KanbanBoard({ tasks: initialTasks }: { tasks: KanbanTask[] }) {
  const [tasks, setTasks] = useState(initialTasks);

  function getColumnTasks(status: string) {
    return tasks
      .filter((t) => t.status === status)
      .sort((a, b) => a.position - b.position);
  }

  async function handleDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const updated = tasks.map((t) => ({ ...t }));
    const task = updated.find((t) => t.id === draggableId);
    if (!task) return;

    // Remove from source column
    const sourceTasks = updated
      .filter((t) => t.status === source.droppableId && t.id !== draggableId)
      .sort((a, b) => a.position - b.position);

    // Update status
    task.status = destination.droppableId;

    // Get destination column tasks (without the moved task)
    const destTasks =
      source.droppableId === destination.droppableId
        ? sourceTasks
        : updated
            .filter(
              (t) =>
                t.status === destination.droppableId && t.id !== draggableId
            )
            .sort((a, b) => a.position - b.position);

    // Insert at new position
    destTasks.splice(destination.index, 0, task);

    // Update positions
    const positionUpdates: { id: string; status: string; position: number }[] =
      [];

    // Update source column positions
    if (source.droppableId !== destination.droppableId) {
      sourceTasks.forEach((t, i) => {
        t.position = i;
        positionUpdates.push({
          id: t.id,
          status: t.status,
          position: i,
        });
      });
    }

    // Update destination column positions
    destTasks.forEach((t, i) => {
      t.position = i;
      positionUpdates.push({
        id: t.id,
        status: t.status,
        position: i,
      });
    });

    setTasks(updated);

    if (positionUpdates.length > 0) {
      await updateTaskPositions(positionUpdates);
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((col) => {
          const colTasks = getColumnTasks(col.id);
          return (
            <div key={col.id} className="flex flex-col">
              <div
                className={`mb-3 flex items-center justify-between rounded-t-lg border-t-4 bg-muted/50 px-3 py-2 ${columnColors[col.id]}`}
              >
                <h3 className="text-sm font-semibold">{col.label}</h3>
                <Badge variant="secondary" className="text-xs">
                  {colTasks.length}
                </Badge>
              </div>

              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 space-y-2 rounded-b-lg p-2 transition-colors min-h-[100px] ${
                      snapshot.isDraggingOver ? "bg-accent/50" : "bg-muted/20"
                    }`}
                  >
                    {colTasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Link href={`/dashboard/tasks/${task.id}`}>
                              <Card
                                className={`cursor-pointer transition-shadow hover:shadow-md ${
                                  snapshot.isDragging ? "shadow-lg rotate-2" : ""
                                }`}
                              >
                                <CardContent className="p-3 space-y-2">
                                  <p className="text-sm font-medium leading-tight">
                                    {task.title}
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    <Badge
                                      variant="secondary"
                                      className={`text-xs ${priorityColors[task.priority]}`}
                                    >
                                      {priorityLabels[task.priority]}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    {task.assignee && (
                                      <span className="flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        {task.assignee.name}
                                      </span>
                                    )}
                                    {task.dueDate && (
                                      <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(
                                          task.dueDate
                                        ).toLocaleDateString("pt-BR", {
                                          day: "2-digit",
                                          month: "short",
                                        })}
                                      </span>
                                    )}
                                  </div>
                                  {task.project && (
                                    <p className="text-xs text-muted-foreground truncate">
                                      {task.project.name}
                                    </p>
                                  )}
                                </CardContent>
                              </Card>
                            </Link>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
