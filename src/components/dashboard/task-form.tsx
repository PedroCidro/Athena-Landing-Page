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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createTask, updateTask } from "@/lib/actions/task";
import { toast } from "sonner";

interface TaskFormProps {
  task?: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    projectId: string;
    assignedTo: string | null;
    dueDate: Date | null;
  };
  projects: { id: string; name: string }[];
  users: { id: string; name: string }[];
  defaultProjectId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TaskForm({
  task,
  projects,
  users,
  defaultProjectId,
  open,
  onOpenChange,
}: TaskFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = task
      ? await updateTask(task.id, formData)
      : await createTask(formData);

    if (result.error) {
      toast.error("Erro ao salvar tarefa");
      setLoading(false);
      return;
    }

    toast.success(task ? "Tarefa atualizada!" : "Tarefa criada!");
    if (onOpenChange) {
      onOpenChange(false);
    }
    router.refresh();
    setLoading(false);
  }

  const form = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          name="title"
          defaultValue={task?.title}
          required
          placeholder="Ex: Criar wireframe da homepage"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={task?.description ?? ""}
          placeholder="Descreva a tarefa..."
          rows={3}
        />
      </div>

      <div className="grid gap-4 grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="projectId">Projeto</Label>
          <Select
            name="projectId"
            defaultValue={task?.projectId ?? defaultProjectId ?? ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecionar projeto" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="assignedTo">Responsável</Label>
          <Select
            name="assignedTo"
            defaultValue={task?.assignedTo ?? ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Ninguém" />
            </SelectTrigger>
            <SelectContent>
              {users.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={task?.status ?? "todo"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">A Fazer</SelectItem>
              <SelectItem value="in_progress">Em Progresso</SelectItem>
              <SelectItem value="in_review">Em Revisão</SelectItem>
              <SelectItem value="done">Concluído</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Prioridade</Label>
          <Select
            name="priority"
            defaultValue={task?.priority ?? "medium"}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="urgent">Urgente</SelectItem>
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
              task?.dueDate
                ? new Date(task.dueDate).toISOString().split("T")[0]
                : ""
            }
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onOpenChange && (
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : task ? "Salvar" : "Criar Tarefa"}
        </Button>
      </div>
    </form>
  );

  if (onOpenChange !== undefined) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {task ? "Editar Tarefa" : "Nova Tarefa"}
            </DialogTitle>
          </DialogHeader>
          {form}
        </DialogContent>
      </Dialog>
    );
  }

  return form;
}
