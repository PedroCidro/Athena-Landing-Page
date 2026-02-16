import { requireAuth } from "@/lib/auth/helpers";
import { ClientForm } from "@/components/dashboard/client-form";

export default async function NewClientPage() {
  await requireAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-3xl font-bold">Novo Cliente</h1>
        <p className="text-muted-foreground">
          Cadastre um novo cliente no sistema
        </p>
      </div>
      <ClientForm />
    </div>
  );
}
