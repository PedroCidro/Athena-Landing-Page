import { z } from "zod";

export const createClientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().max(50).optional().or(z.literal("")),
  company: z.string().max(255).optional().or(z.literal("")),
  status: z.enum(["lead", "prospect", "active", "inactive"]).default("lead"),
  source: z.string().max(255).optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

export const updateClientSchema = createClientSchema.partial();

export const createDealSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(500),
  value: z.string().optional(),
  status: z.enum(["negotiating", "proposed", "won", "lost"]).default("negotiating"),
  clientId: z.string().uuid("Cliente é obrigatório"),
  notes: z.string().optional(),
});

export const updateDealSchema = createDealSchema.partial();

export const createInteractionSchema = z.object({
  clientId: z.string().uuid(),
  type: z.enum(["whatsapp", "email", "call", "meeting", "note"]),
  summary: z.string().min(1, "Resumo é obrigatório"),
  occurredAt: z.string().optional(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type CreateDealInput = z.infer<typeof createDealSchema>;
export type CreateInteractionInput = z.infer<typeof createInteractionSchema>;
