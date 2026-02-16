import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FolderKanban, CheckSquare, Users, Handshake } from "lucide-react";
import { requireAuth } from "@/lib/auth/helpers";
import { db } from "@/lib/db";
import { projects, tasks, clients, deals } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";

async function getStats() {
  try {
    const [projectCount] = await db.select({ value: count() }).from(projects);
    const [taskCount] = await db.select({ value: count() }).from(tasks);
    const [pendingTasks] = await db
      .select({ value: count() })
      .from(tasks)
      .where(eq(tasks.status, "todo"));
    const [clientCount] = await db.select({ value: count() }).from(clients);
    const [dealCount] = await db.select({ value: count() }).from(deals);

    return {
      projects: projectCount.value,
      tasks: taskCount.value,
      pendingTasks: pendingTasks.value,
      clients: clientCount.value,
      deals: dealCount.value,
    };
  } catch {
    // DB not yet set up – show zeros
    return { projects: 0, tasks: 0, pendingTasks: 0, clients: 0, deals: 0 };
  }
}

export default async function DashboardPage() {
  await requireAuth();
  const stats = await getStats();

  const cards = [
    {
      title: "Projetos",
      value: stats.projects,
      icon: FolderKanban,
      href: "/dashboard/projects",
    },
    {
      title: "Tarefas Pendentes",
      value: stats.pendingTasks,
      icon: CheckSquare,
      href: "/dashboard/tasks",
    },
    {
      title: "Clientes",
      value: stats.clients,
      icon: Users,
      href: "/dashboard/clients",
    },
    {
      title: "Negócios",
      value: stats.deals,
      icon: Handshake,
      href: "/dashboard/deals",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-3xl font-bold">Painel</h1>
        <p className="text-muted-foreground">
          Visão geral da sua organização
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-sans text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
