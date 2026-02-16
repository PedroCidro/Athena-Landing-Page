import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { requireAuth } from "@/lib/auth/helpers";
import { getClients } from "@/lib/actions/client";
import { ClientSearch } from "@/components/dashboard/client-search";

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

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  await requireAuth();
  const { search } = await searchParams;
  const clientList = await getClients(search);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sans text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie seus clientes e relacionamentos
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/clients/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Link>
        </Button>
      </div>

      <ClientSearch defaultValue={search} />

      {clientList.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              {search
                ? "Nenhum cliente encontrado para essa busca"
                : "Nenhum cliente cadastrado"}
            </p>
            {!search && (
              <Button asChild>
                <Link href="/dashboard/clients/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Cadastrar Primeiro Cliente
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Responsável</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientList.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <Link
                      href={`/dashboard/clients/${client.id}`}
                      className="font-medium hover:underline"
                    >
                      {client.name}
                    </Link>
                  </TableCell>
                  <TableCell>{client.company ?? "-"}</TableCell>
                  <TableCell>{client.email ?? "-"}</TableCell>
                  <TableCell>{client.phone ?? "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={statusColors[client.status]}
                    >
                      {statusLabels[client.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>{client.owner?.name ?? "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
