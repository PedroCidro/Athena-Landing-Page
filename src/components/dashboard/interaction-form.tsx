"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addInteraction } from "@/lib/actions/client";
import { toast } from "sonner";

export function InteractionForm({ clientId }: { clientId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("note");
  const [summary, setSummary] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!summary.trim()) return;
    setLoading(true);

    const formData = new FormData();
    formData.set("clientId", clientId);
    formData.set("type", type);
    formData.set("summary", summary);

    const result = await addInteraction(formData);
    if (result.error) {
      toast.error("Erro ao registrar interação");
    } else {
      toast.success("Interação registrada!");
      setSummary("");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-3">
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="call">Ligação</SelectItem>
            <SelectItem value="meeting">Reunião</SelectItem>
            <SelectItem value="note">Nota</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex-1">
          <Textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Descreva a interação..."
            rows={2}
          />
        </div>
      </div>
      <Button type="submit" size="sm" disabled={loading || !summary.trim()}>
        {loading ? "Registrando..." : "Registrar Interação"}
      </Button>
    </form>
  );
}
