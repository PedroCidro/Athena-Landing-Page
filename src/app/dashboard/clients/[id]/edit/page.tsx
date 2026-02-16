import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth/helpers";
import { getClient } from "@/lib/actions/client";
import { ClientForm } from "@/components/dashboard/client-form";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;
  const client = await getClient(id);
  if (!client) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-3xl font-bold">Editar Cliente</h1>
        <p className="text-muted-foreground">{client.name}</p>
      </div>
      <ClientForm client={client} />
    </div>
  );
}
