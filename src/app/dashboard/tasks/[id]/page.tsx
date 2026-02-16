import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { requireAuth } from "@/lib/auth/helpers";
import { getTask, getUsers } from "@/lib/actions/task";
import { getProjects } from "@/lib/actions/project";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TaskForm } from "@/components/dashboard/task-form";
import { TaskComments } from "@/components/dashboard/task-comments";
import { DeleteTaskButton } from "@/components/dashboard/delete-task-button";

const statusLabels: Record<string, string> = {
  todo: "A Fazer",
  in_progress: "Em Progresso",
  in_review: "Em Revisão",
  done: "Concluído",
};

const statusColors: Record<string, string> = {
  todo: "bg-gray-100 text-gray-800",
  in_progress: "bg-blue-100 text-blue-800",
  in_review: "bg-yellow-100 text-yellow-800",
  done: "bg-green-100 text-green-800",
};

const priorityLabels: Record<string, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  urgent: "Urgente",
};

const priorityColors: Record<string, string> = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAuth();
  const { id } = await params;
  const task = await getTask(id);
  if (!task) notFound();

  const [projects, users] = await Promise.all([getProjects(), getUsers()]);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/tasks">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-sans text-2xl font-bold">{task.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge
              variant="secondary"
              className={statusColors[task.status]}
            >
              {statusLabels[task.status]}
            </Badge>
            <Badge
              variant="secondary"
              className={priorityColors[task.priority]}
            >
              {priorityLabels[task.priority]}
            </Badge>
            <Link
              href={`/dashboard/projects/${task.project.id}`}
              className="text-sm text-muted-foreground hover:underline"
            >
              {task.project.name}
            </Link>
          </div>
        </div>
        <DeleteTaskButton id={id} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {task.description && (
            <Card>
              <CardHeader>
                <CardTitle className="font-sans text-lg">Descrição</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{task.description}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="font-sans text-lg">
                Comentários ({task.comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TaskComments taskId={id} comments={task.comments} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-sans text-sm">Detalhes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">Responsável:</span>{" "}
                {task.assignee?.name ?? "Ninguém"}
              </div>
              <div>
                <span className="text-muted-foreground">Criado por:</span>{" "}
                {task.creator.name}
              </div>
              {task.dueDate && (
                <div>
                  <span className="text-muted-foreground">Prazo:</span>{" "}
                  {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                </div>
              )}
              <div>
                <span className="text-muted-foreground">Criado em:</span>{" "}
                {new Date(task.createdAt).toLocaleDateString("pt-BR")}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-sans text-sm">
                Editar Tarefa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TaskForm
                task={task}
                projects={projects.map((p) => ({
                  id: p.id,
                  name: p.name,
                }))}
                users={users}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
