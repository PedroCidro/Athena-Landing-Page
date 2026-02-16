"use client";

import { useState } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { createOutreach, updateOutreach } from "@/lib/actions/outreach";
import { toast } from "sonner";
import { Plus } from "lucide-react";

interface OutreachFormProps {
  outreach?: {
    id: string;
    influencerName: string;
    platform: string;
    handle: string | null;
    followersCount: number | null;
    contactedBy: string;
    status: string;
    notes: string | null;
    contactDate: Date;
  };
  onSuccess?: () => void;
}

export function OutreachForm({ outreach, onSuccess }: OutreachFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = outreach
      ? await updateOutreach(outreach.id, formData)
      : await createOutreach(formData);

    if (result.error) {
      toast.error("Erro ao salvar contato");
      setLoading(false);
      return;
    }

    toast.success(
      outreach ? "Contato atualizado!" : "Influenciador adicionado!"
    );
    setOpen(false);
    setLoading(false);
    onSuccess?.();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {outreach ? (
          <Button variant="ghost" size="sm">
            Editar
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Contato
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {outreach ? "Editar Contato" : "Novo Contato com Influenciador"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="influencerName">Nome</Label>
              <Input
                id="influencerName"
                name="influencerName"
                defaultValue={outreach?.influencerName}
                required
                placeholder="Nome do influenciador"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="handle">@ Handle</Label>
              <Input
                id="handle"
                name="handle"
                defaultValue={outreach?.handle ?? ""}
                placeholder="@usuario"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="platform">Plataforma</Label>
              <Select
                name="platform"
                defaultValue={outreach?.platform ?? "instagram"}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="twitter">Twitter/X</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="followersCount">Seguidores</Label>
              <Input
                id="followersCount"
                name="followersCount"
                type="number"
                defaultValue={outreach?.followersCount ?? ""}
                placeholder="10000"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactedBy">Responsavel</Label>
              <Select
                name="contactedBy"
                defaultValue={outreach?.contactedBy ?? "Pedro"}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pedro">Pedro</SelectItem>
                  <SelectItem value="Luiz">Luiz</SelectItem>
                  <SelectItem value="Kyles">Kyles</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                name="status"
                defaultValue={outreach?.status ?? "contacted"}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contacted">Contatado</SelectItem>
                  <SelectItem value="responded">Respondeu</SelectItem>
                  <SelectItem value="negotiating">Negociando</SelectItem>
                  <SelectItem value="converted">Convertido</SelectItem>
                  <SelectItem value="rejected">Rejeitado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observacoes</Label>
            <Textarea
              id="notes"
              name="notes"
              defaultValue={outreach?.notes ?? ""}
              placeholder="Detalhes do contato..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Salvando..."
                : outreach
                  ? "Salvar"
                  : "Adicionar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
