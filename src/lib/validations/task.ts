import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(500),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "in_review", "done"]).default("todo"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  projectId: z.string().uuid("Projeto é obrigatório"),
  assignedTo: z.string().uuid().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  position: z.number().int().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const updateTaskPositionSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["todo", "in_progress", "in_review", "done"]),
  position: z.number().int(),
});

export const createTaskCommentSchema = z.object({
  taskId: z.string().uuid(),
  content: z.string().min(1, "Comentário é obrigatório"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
