import { z } from "zod";

export const createOutreachSchema = z.object({
  influencerName: z.string().min(1, "Nome é obrigatório"),
  platform: z.enum(["instagram", "tiktok", "youtube", "twitter", "other"]),
  handle: z.string().optional(),
  followersCount: z.coerce.number().int().min(0).optional(),
  contactedBy: z.enum(["Pedro", "Luiz", "Kyles"]),
  status: z
    .enum(["contacted", "responded", "negotiating", "converted", "rejected"])
    .default("contacted"),
  notes: z.string().optional(),
  contactDate: z.string().optional(),
});

export const updateOutreachSchema = createOutreachSchema.partial();
