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
import { createProject, updateProject } from "@/lib/actions/project";
import { toast } from "sonner";

interface ProjectFormProps {
  project?: {
    id: string;
    name: string;
    description: string | null;
    status: string;
    clientId: string | null;
    dueDate: Date | null;
  };
  clients?: { id: string; name: string }[];
}

export function ProjectForm({ project, clients }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = project
      ? await updateProject(project.id, formData)
      : await createProject(formData);

    if (result.error) {
      toast.error("Erro ao salvar projeto");
      setLoading(false);
      return;
    }

    toast.success(project ? "Projeto atualizado!" : "Projeto criado!");
    if ("id" in result && result.id) {
      router.push(`/dashboard/projects/${result.id}`);
    } else {
      router.push("/dashboard/projects");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Projeto</Label>
        <Input
          id="name"
          name="name"
          defaultValue={project?.name}
          required
          placeholder="Ex: Site Clínica Dr. Silva"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={project?.description ?? ""}
          placeholder="Descreva o projeto..."
          rows={4}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            name="status"
            defaultValue={project?.status ?? "planning"}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planning">Planejamento</SelectItem>
              <SelectItem value="in_progress">Em Progresso</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="on_hold">Pausado</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Prazo</Label>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            defaultValue={
              project?.dueDate
                ? new Date(project.dueDate).toISOString().split("T")[0]
                : ""
            }
          />
        </div>
      </div>

      {clients && clients.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="clientId">Cliente</Label>
          <Select
            name="clientId"
            defaultValue={project?.clientId ?? ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecionar cliente (opcional)" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : project ? "Salvar" : "Criar Projeto"}
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
