import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { requireAuth } from "@/lib/auth/helpers";
import { getDeal } from "@/lib/actions/deal";
import { getClients } from "@/lib/actions/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DealForm } from "@/components/dashboard/deal-form";
import { DeleteDealButton } from "@/components/dashboard/delete-deal-button";

const dealStatusLabels: Record<string, string> = {
  negotiating: "Negociando",
  proposed: "Proposta",
  won: "Ganho",
  lost: "Perdido",
};

const dealStatusColors: Record<string, string> = {
  negotiating: "bg-blue-100 text-blue-800",
  proposed: "bg-yellow-100 text-yellow-800",
  won: "bg-green-100 text-green-800",
  lost: "bg-red-100 text-red-800",
};

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;
  const deal = await getDeal(id);
  if (!deal) notFound();

  const clients = await getClients();

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/deals">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-sans text-2xl font-bold">{deal.title}</h1>
            <Badge
              variant="secondary"
              className={dealStatusColors[deal.status]}
            >
              {dealStatusLabels[deal.status]}
            </Badge>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <Link
              href={`/dashboard/clients/${deal.client.id}`}
              className="hover:underline"
            >
              {deal.client.name}
            </Link>
            {deal.value && (
              <span className="font-semibold text-green-700">
                R${" "}
                {Number(deal.value).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            )}
          </div>
        </div>
        <DeleteDealButton id={id} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {deal.notes && (
          <Card>
            <CardHeader>
              <CardTitle className="font-sans text-lg">Notas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm">{deal.notes}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="font-sans text-lg">Editar</CardTitle>
          </CardHeader>
          <CardContent>
            <DealForm
              deal={deal}
              clients={clients.map((c) => ({ id: c.id, name: c.name }))}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
