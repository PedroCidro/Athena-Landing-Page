import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255),
  description: z.string().optional(),
  status: z.enum(["planning", "in_progress", "completed", "on_hold", "cancelled"]).default("planning"),
  clientId: z.string().uuid().optional().nullable(),
  dueDate: z.string().optional().nullable(),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
