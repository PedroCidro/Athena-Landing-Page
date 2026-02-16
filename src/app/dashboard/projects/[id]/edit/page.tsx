import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth/helpers";
import { getProject } from "@/lib/actions/project";
import { db } from "@/lib/db";
import { ProjectForm } from "@/components/dashboard/project-form";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const clients = await db.query.clients.findMany({
    columns: { id: true, name: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-3xl font-bold">Editar Projeto</h1>
        <p className="text-muted-foreground">{project.name}</p>
      </div>
      <ProjectForm project={project} clients={clients} />
    </div>
  );
}
