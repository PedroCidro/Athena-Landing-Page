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
import { createDeal, updateDeal } from "@/lib/actions/deal";
import { toast } from "sonner";

interface DealFormProps {
  deal?: {
    id: string;
    title: string;
    value: string | null;
    status: string;
    clientId: string;
    notes: string | null;
  };
  clients: { id: string; name: string }[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DealForm({
  deal,
  clients,
  open,
  onOpenChange,
}: DealFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = deal
      ? await updateDeal(deal.id, formData)
      : await createDeal(formData);

    if (result.error) {
      toast.error("Erro ao salvar negócio");
      setLoading(false);
      return;
    }

    toast.success(deal ? "Negócio atualizado!" : "Negócio criado!");
    if (onOpenChange) onOpenChange(false);
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
          defaultValue={deal?.title}
          required
          placeholder="Ex: Site institucional"
        />
      </div>

      <div className="grid gap-4 grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="clientId">Cliente</Label>
          <Select name="clientId" defaultValue={deal?.clientId ?? ""}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar cliente" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="value">Valor (R$)</Label>
          <Input
            id="value"
            name="value"
            type="number"
            step="0.01"
            defaultValue={deal?.value ?? ""}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select name="status" defaultValue={deal?.status ?? "negotiating"}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="negotiating">Negociando</SelectItem>
            <SelectItem value="proposed">Proposta</SelectItem>
            <SelectItem value="won">Ganho</SelectItem>
            <SelectItem value="lost">Perdido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notas</Label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={deal?.notes ?? ""}
          placeholder="Notas sobre o negócio..."
          rows={3}
        />
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
          {loading ? "Salvando..." : deal ? "Salvar" : "Criar Negócio"}
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
              {deal ? "Editar Negócio" : "Novo Negócio"}
            </DialogTitle>
          </DialogHeader>
          {form}
        </DialogContent>
      </Dialog>
    );
  }

  return form;
}
