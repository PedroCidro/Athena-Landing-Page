import { z } from "zod";

const members = ["Pedro", "Luiz", "Kael"] as const;
const noteTypes = ["hour", "day", "week"] as const;

export const createPlannerNoteSchema = z
  .object({
    member: z.enum(members),
    noteType: z.enum(noteTypes),
    content: z.string().min(1, "Conteúdo é obrigatório"),
    targetDate: z.string().min(1, "Data é obrigatória"),
    targetHour: z.coerce.number().int().min(0).max(23).optional().nullable(),
    targetHourEnd: z.coerce.number().int().min(0).max(23).optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.noteType === "hour") return data.targetHour != null;
      return true;
    },
    { message: "Hora é obrigatória para notas por hora", path: ["targetHour"] }
  )
  .refine(
    (data) => {
      if (data.targetHourEnd != null && data.targetHour != null)
        return data.targetHourEnd >= data.targetHour;
      return true;
    },
    { message: "Hora final deve ser >= hora inicial", path: ["targetHourEnd"] }
  );

export const updatePlannerNoteSchema = z.object({
  content: z.string().min(1, "Conteúdo é obrigatório"),
});

export type CreatePlannerNoteInput = z.infer<typeof createPlannerNoteSchema>;
export type UpdatePlannerNoteInput = z.infer<typeof updatePlannerNoteSchema>;
