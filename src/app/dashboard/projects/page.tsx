import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireAuth } from "@/lib/auth/helpers";
import { getProjects } from "@/lib/actions/project";

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

export default async function ProjectsPage() {
  await requireAuth();
  const projects = await getProjects();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sans text-3xl font-bold">Projetos</h1>
          <p className="text-muted-foreground">
            Gerencie seus projetos e acompanhe o progresso
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Projeto
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              Nenhum projeto encontrado
            </p>
            <Button asChild>
              <Link href="/dashboard/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Projeto
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const totalTasks = project.tasks.length;
            const doneTasks = project.tasks.filter(
              (t) => t.status === "done"
            ).length;

            return (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
              >
                <Card className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="font-sans text-lg">
                        {project.name}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className={statusColors[project.status]}
                      >
                        {statusLabels[project.status]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {project.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>
                        {totalTasks > 0
                          ? `${doneTasks}/${totalTasks} tarefas`
                          : "Sem tarefas"}
                      </span>
                      {project.client && (
                        <span>{project.client.name}</span>
                      )}
                    </div>
                    {totalTasks > 0 && (
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary transition-all"
                          style={{
                            width: `${(doneTasks / totalTasks) * 100}%`,
                          }}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
