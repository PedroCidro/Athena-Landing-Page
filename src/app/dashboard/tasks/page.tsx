import { Plus } from "lucide-react";
import { requireAuth } from "@/lib/auth/helpers";
import { getTasks, getUsers } from "@/lib/actions/task";
import { getProjects } from "@/lib/actions/project";
import { TasksPageClient } from "@/components/dashboard/tasks-page-client";

export default async function TasksPage() {
  await requireAuth();
  const [tasks, projects, users] = await Promise.all([
    getTasks(),
    getProjects(),
    getUsers(),
  ]);

  const projectOptions = projects.map((p) => ({ id: p.id, name: p.name }));
  const userOptions = users.map((u) => ({ id: u.id, name: u.name }));

  return (
    <TasksPageClient
      tasks={tasks}
      projects={projectOptions}
      users={userOptions}
    />
  );
}
