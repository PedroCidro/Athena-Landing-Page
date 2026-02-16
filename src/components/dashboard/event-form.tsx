"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { createEvent } from "@/lib/actions/calendar";
import { toast } from "sonner";

interface EventFormProps {
  projects: { id: string; name: string }[];
  users: { id: string; name: string }[];
  defaultDate?: Date | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const colorOptions = [
  { value: "bg-blue-500", label: "Azul" },
  { value: "bg-red-500", label: "Vermelho" },
  { value: "bg-green-500", label: "Verde" },
  { value: "bg-yellow-500", label: "Amarelo" },
  { value: "bg-purple-500", label: "Roxo" },
  { value: "bg-pink-500", label: "Rosa" },
];

export function EventForm({
  projects,
  users,
  defaultDate,
  open,
  onOpenChange,
}: EventFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [allDay, setAllDay] = useState(false);

  const defaultStart = defaultDate
    ? format(defaultDate, "yyyy-MM-dd'T'HH:mm")
    : "";
  const defaultEnd = defaultDate
    ? format(new Date(defaultDate.getTime() + 3600000), "yyyy-MM-dd'T'HH:mm")
    : "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("allDay", String(allDay));

    const result = await createEvent(formData);

    if (result.error) {
      toast.error("Erro ao criar evento");
      setLoading(false);
      return;
    }

    toast.success("Evento criado!");
    if (onOpenChange) onOpenChange(false);
    router.refresh();
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo Evento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              name="title"
              required
              placeholder="Ex: Reunião com cliente"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Detalhes do evento..."
              rows={2}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="allDay"
              checked={allDay}
              onCheckedChange={(checked) => setAllDay(checked === true)}
            />
            <Label htmlFor="allDay" className="text-sm">
              Dia inteiro
            </Label>
          </div>

          <div className="grid gap-4 grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startTime">Início</Label>
              <Input
                id="startTime"
                name="startTime"
                type={allDay ? "date" : "datetime-local"}
                defaultValue={
                  allDay && defaultDate
                    ? format(defaultDate, "yyyy-MM-dd")
                    : defaultStart
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Fim</Label>
              <Input
                id="endTime"
                name="endTime"
                type={allDay ? "date" : "datetime-local"}
                defaultValue={
                  allDay && defaultDate
                    ? format(defaultDate, "yyyy-MM-dd")
                    : defaultEnd
                }
                required
              />
            </div>
          </div>

          <div className="grid gap-4 grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select name="type" defaultValue="meeting">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">Reunião</SelectItem>
                  <SelectItem value="deadline">Prazo</SelectItem>
                  <SelectItem value="reminder">Lembrete</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Cor</Label>
              <Select name="color" defaultValue="bg-blue-500">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-3 w-3 rounded ${c.value}`}
                        />
                        {c.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectId">Projeto (opcional)</Label>
            <Select name="projectId">
              <SelectTrigger>
                <SelectValue placeholder="Nenhum" />
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

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange?.(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar Evento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
