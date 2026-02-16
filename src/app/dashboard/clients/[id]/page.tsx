import { notFound } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { requireAuth } from "@/lib/auth/helpers";
import { getClient } from "@/lib/actions/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InteractionForm } from "@/components/dashboard/interaction-form";
import { DeleteClientButton } from "@/components/dashboard/delete-client-button";

const statusLabels: Record<string, string> = {
  lead: "Lead",
  prospect: "Prospect",
  active: "Ativo",
  inactive: "Inativo",
};

const statusColors: Record<string, string> = {
  lead: "bg-blue-100 text-blue-800",
  prospect: "bg-purple-100 text-purple-800",
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
};

const interactionTypeLabels: Record<string, string> = {
  whatsapp: "WhatsApp",
  email: "Email",
  call: "Ligação",
  meeting: "Reunião",
  note: "Nota",
};

const interactionTypeIcons: Record<string, string> = {
  whatsapp: "💬",
  email: "📧",
  call: "📞",
  meeting: "🤝",
  note: "📝",
};

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

export default async function ClientDetailPage({
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
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-sans text-3xl font-bold">{client.name}</h1>
            <Badge
              variant="secondary"
              className={statusColors[client.status]}
            >
              {statusLabels[client.status]}
            </Badge>
          </div>
          {client.company && (
            <p className="mt-1 text-muted-foreground">{client.company}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/clients/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
          <DeleteClientButton id={id} />
        </div>
      </div>

      {/* Contact info */}
      <div className="flex gap-6 text-sm">
        {client.email && (
          <div>
            <span className="text-muted-foreground">Email: </span>
            <a
              href={`mailto:${client.email}`}
              className="hover:underline"
            >
              {client.email}
            </a>
          </div>
        )}
        {client.phone && (
          <div>
            <span className="text-muted-foreground">Tel: </span>
            {client.phone}
          </div>
        )}
        {client.source && (
          <div>
            <span className="text-muted-foreground">Origem: </span>
            {client.source}
          </div>
        )}
      </div>

      <Tabs defaultValue="interactions">
        <TabsList>
          <TabsTrigger value="interactions">
            Interações ({client.interactions.length})
          </TabsTrigger>
          <TabsTrigger value="deals">
            Negócios ({client.deals.length})
          </TabsTrigger>
          <TabsTrigger value="projects">
            Projetos ({client.projects.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="interactions" className="mt-4 space-y-4">
          <InteractionForm clientId={id} />

          {client.interactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma interação registrada
            </p>
          ) : (
            <div className="space-y-3">
              {client.interactions.map((interaction) => (
                <Card key={interaction.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-lg">
                        {interactionTypeIcons[interaction.type]}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {interactionTypeLabels[interaction.type]}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(
                              interaction.occurredAt
                            ).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            por {interaction.user.name}
                          </span>
                        </div>
                        <p className="mt-1 text-sm">{interaction.summary}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="deals" className="mt-4">
          {client.deals.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhum negócio registrado
            </p>
          ) : (
            <div className="space-y-3">
              {client.deals.map((deal) => (
                <Link
                  key={deal.id}
                  href={`/dashboard/deals/${deal.id}`}
                >
                  <Card className="transition-shadow hover:shadow-md">
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">{deal.title}</p>
                        {deal.value && (
                          <p className="text-sm text-muted-foreground">
                            R${" "}
                            {Number(deal.value).toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant="secondary"
                        className={dealStatusColors[deal.status]}
                      >
                        {dealStatusLabels[deal.status]}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="projects" className="mt-4">
          {client.projects.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhum projeto vinculado
            </p>
          ) : (
            <div className="space-y-3">
              {client.projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                >
                  <Card className="transition-shadow hover:shadow-md">
                    <CardContent className="flex items-center justify-between p-4">
                      <p className="font-medium">{project.name}</p>
                      <Badge variant="outline">{project.status}</Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {client.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="font-sans text-lg">Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm">{client.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
