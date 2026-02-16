import { notFound } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2, Plus } from "lucide-react";
import { requireAuth } from "@/lib/auth/helpers";
import { getProject } from "@/lib/actions/project";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeleteProjectButton } from "@/components/dashboard/delete-project-button";
import { TaskList } from "@/components/dashboard/task-list";

const statusLabels: Record<string, string> = {
  planning: "Planejamento",
  in_progress: "Em Progresso",
  completed: "Concluído",
  on_hold: "Pausado",
  cancelled: "Cancelado",
};

const statusColors: Record<string, string> = {
  planning: "bg-blue-100 text-blue-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  on_hold: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

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

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const totalTasks = project.tasks.length;
  const doneTasks = project.tasks.filter((t) => t.status === "done").length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-sans text-3xl font-bold">{project.name}</h1>
            <Badge
              variant="secondary"
              className={statusColors[project.status]}
            >
              {statusLabels[project.status]}
            </Badge>
          </div>
          {project.description && (
            <p className="mt-2 text-muted-foreground">
              {project.description}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/projects/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
          <DeleteProjectButton id={id} />
        </div>
      </div>

      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">
            Tarefas ({totalTasks})
          </TabsTrigger>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="members">
            Membros ({project.members.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button asChild size="sm">
              <Link href={`/dashboard/tasks?projectId=${id}&new=true`}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Tarefa
              </Link>
            </Button>
          </div>
          <TaskList
            tasks={project.tasks.map((t) => ({
              ...t,
              priorityLabel: priorityLabels[t.priority],
              statusLabel: taskStatusLabels[t.status],
            }))}
          />
        </TabsContent>

        <TabsContent value="details" className="mt-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Criado por
                  </p>
                  <p>{project.creator.name}</p>
                </div>
                {project.client && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Cliente
                    </p>
                    <p>{project.client.name}</p>
                  </div>
                )}
                {project.dueDate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Prazo
                    </p>
                    <p>
                      {new Date(project.dueDate).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Progresso
                  </p>
                  <p>
                    {totalTasks > 0
                      ? `${doneTasks}/${totalTasks} tarefas concluídas (${Math.round((doneTasks / totalTasks) * 100)}%)`
                      : "Sem tarefas"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-sans text-lg">
                Membros do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project.members.length === 0 ? (
                <p className="text-muted-foreground">Nenhum membro</p>
              ) : (
                <div className="space-y-3">
                  {project.members.map((m) => (
                    <div
                      key={m.userId}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{m.user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {m.user.email}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {m.role === "manager" ? "Gerente" : "Membro"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
