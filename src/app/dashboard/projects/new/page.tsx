import { requireAuth } from "@/lib/auth/helpers";
import { ProjectForm } from "@/components/dashboard/project-form";
import { db } from "@/lib/db";

export default async function NewProjectPage() {
  await requireAuth();
  const clients = await db.query.clients.findMany({
    columns: { id: true, name: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-3xl font-bold">Novo Projeto</h1>
        <p className="text-muted-foreground">
          Crie um novo projeto para sua equipe
        </p>
      </div>
      <ProjectForm clients={clients} />
    </div>
  );
}
