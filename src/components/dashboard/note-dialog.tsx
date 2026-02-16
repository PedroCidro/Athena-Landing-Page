"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  createPlannerNote,
  updatePlannerNote,
  deletePlannerNote,
} from "@/lib/actions/planner";
import { Trash2 } from "lucide-react";

interface PlannerNote {
  id: string;
  member: string;
  noteType: string;
  content: string;
  targetDate: string;
  targetHour: number | null;
  targetHourEnd?: number | null;
}

interface NoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: PlannerNote | null;
  member: string;
  noteType: "hour" | "day" | "week";
  targetDate: string;
  targetHour?: number | null;
  targetHourEnd?: number | null;
}

function formatLabel(
  noteType: string,
  targetDate: string,
  targetHour?: number | null,
  targetHourEnd?: number | null
) {
  const d = new Date(targetDate + "T12:00:00");
  const dayStr = d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
  if (noteType === "week") return "Nota da Semana";
  if (noteType === "day") return `Nota do dia — ${dayStr}`;
  if (targetHourEnd != null && targetHourEnd !== targetHour) {
    return `${targetHour}:00 – ${targetHourEnd}:00 — ${dayStr}`;
  }
  return `${targetHour}:00 — ${dayStr}`;
}

export function NoteDialog({
  open,
  onOpenChange,
  note,
  member,
  noteType,
  targetDate,
  targetHour,
  targetHourEnd,
}: NoteDialogProps) {
  const [content, setContent] = useState(note?.content ?? "");
  const [isPending, startTransition] = useTransition();

  const isEditing = !!note;
  const effectiveHourEnd = targetHourEnd ?? note?.targetHourEnd;
  const label = formatLabel(noteType, targetDate, targetHour, effectiveHourEnd);

  function handleSave() {
    if (!content.trim()) return;
    startTransition(async () => {
      if (isEditing) {
        await updatePlannerNote(note.id, { content: content.trim() });
      } else {
        await createPlannerNote({
          member,
          noteType,
          content: content.trim(),
          targetDate,
          targetHour: noteType === "hour" ? targetHour : null,
          targetHourEnd: noteType === "hour" ? effectiveHourEnd : null,
        });
      }
      onOpenChange(false);
    });
  }

  function handleDelete() {
    if (!note) return;
    startTransition(async () => {
      await deletePlannerNote(note.id);
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Nota" : "Nova Nota"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{label}</p>
          <div className="space-y-2">
            <Label htmlFor="note-content">Conteúdo</Label>
            <Textarea
              id="note-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva sua nota..."
              rows={4}
              autoFocus
            />
          </div>
        </div>
        <DialogFooter className="flex-row justify-between sm:justify-between">
          {isEditing && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isPending}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Excluir
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isPending || !content.trim()}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
