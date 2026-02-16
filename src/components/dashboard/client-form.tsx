"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient, updateClient } from "@/lib/actions/client";
import { toast } from "sonner";

interface ClientFormProps {
  client?: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    company: string | null;
    status: string;
    source: string | null;
    notes: string | null;
  };
}

export function ClientForm({ client }: ClientFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = client
      ? await updateClient(client.id, formData)
      : await createClient(formData);

    if (result.error) {
      toast.error("Erro ao salvar cliente");
      setLoading(false);
      return;
    }

    toast.success(client ? "Cliente atualizado!" : "Cliente cadastrado!");
    if ("id" in result && result.id) {
      router.push(`/dashboard/clients/${result.id}`);
    } else {
      router.push("/dashboard/clients");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            name="name"
            defaultValue={client?.name}
            required
            placeholder="Nome do cliente"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Empresa</Label>
          <Input
            id="company"
            name="company"
            defaultValue={client?.company ?? ""}
            placeholder="Nome da empresa"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={client?.email ?? ""}
            placeholder="email@exemplo.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            name="phone"
            defaultValue={client?.phone ?? ""}
            placeholder="(16) 99999-9999"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={client?.status ?? "lead"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="prospect">Prospect</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="inactive">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="source">Origem</Label>
          <Input
            id="source"
            name="source"
            defaultValue={client?.source ?? ""}
            placeholder="Ex: Google, Indicação, Instagram"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={client?.notes ?? ""}
          placeholder="Notas sobre o cliente..."
          rows={4}
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : client ? "Salvar" : "Cadastrar Cliente"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
