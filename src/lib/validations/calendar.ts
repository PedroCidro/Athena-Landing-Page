import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(500),
  description: z.string().optional(),
  startTime: z.string().min(1, "Data de início é obrigatória"),
  endTime: z.string().min(1, "Data de fim é obrigatória"),
  allDay: z.boolean().default(false),
  type: z.enum(["meeting", "deadline", "reminder"]).default("meeting"),
  color: z.string().max(20).optional(),
  projectId: z.string().uuid().optional().nullable(),
  attendeeIds: z.array(z.string().uuid()).optional(),
});

export const updateEventSchema = createEventSchema.partial();

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
