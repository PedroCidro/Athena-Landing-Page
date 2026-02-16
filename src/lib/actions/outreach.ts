"use server";

import { db } from "@/lib/db";
import { influencerOutreach } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/helpers";
import {
  createOutreachSchema,
  updateOutreachSchema,
} from "@/lib/validations/outreach";
import { eq, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getOutreachList() {
  await requireAuth();
  return db
    .select()
    .from(influencerOutreach)
    .orderBy(desc(influencerOutreach.createdAt));
}

export async function getOutreachStats() {
  await requireAuth();
  const stats = await db
    .select({
      contactedBy: influencerOutreach.contactedBy,
      total: sql<number>`count(*)::int`,
      converted: sql<number>`count(*) filter (where ${influencerOutreach.status} = 'converted')::int`,
      responded: sql<number>`count(*) filter (where ${influencerOutreach.status} in ('responded', 'negotiating', 'converted'))::int`,
      rejected: sql<number>`count(*) filter (where ${influencerOutreach.status} = 'rejected')::int`,
    })
    .from(influencerOutreach)
    .groupBy(influencerOutreach.contactedBy);

  return stats;
}

export async function createOutreach(formData: FormData) {
  await requireAuth();

  const raw = Object.fromEntries(formData.entries());
  const parsed = createOutreachSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  await db.insert(influencerOutreach).values({
    influencerName: data.influencerName,
    platform: data.platform,
    handle: data.handle || null,
    followersCount: data.followersCount || null,
    contactedBy: data.contactedBy,
    status: data.status,
    notes: data.notes || null,
    contactDate: data.contactDate ? new Date(data.contactDate) : new Date(),
  });

  revalidatePath("/dashboard/affiliates");
  return { success: true };
}

export async function updateOutreach(id: string, formData: FormData) {
  await requireAuth();

  const raw = Object.fromEntries(formData.entries());
  const parsed = updateOutreachSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  const updateData: Record<string, unknown> = { updatedAt: new Date() };

  if (data.influencerName !== undefined)
    updateData.influencerName = data.influencerName;
  if (data.platform !== undefined) updateData.platform = data.platform;
  if (data.handle !== undefined) updateData.handle = data.handle || null;
  if (data.followersCount !== undefined)
    updateData.followersCount = data.followersCount || null;
  if (data.contactedBy !== undefined)
    updateData.contactedBy = data.contactedBy;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.notes !== undefined) updateData.notes = data.notes || null;
  if (data.contactDate !== undefined)
    updateData.contactDate = new Date(data.contactDate);

  await db
    .update(influencerOutreach)
    .set(updateData)
    .where(eq(influencerOutreach.id, id));

  revalidatePath("/dashboard/affiliates");
  return { success: true };
}

export async function updateOutreachStatus(id: string, status: string) {
  await requireAuth();

  await db
    .update(influencerOutreach)
    .set({ status: status as any, updatedAt: new Date() })
    .where(eq(influencerOutreach.id, id));

  revalidatePath("/dashboard/affiliates");
}

export async function deleteOutreach(id: string) {
  await requireAuth();

  await db
    .delete(influencerOutreach)
    .where(eq(influencerOutreach.id, id));

  revalidatePath("/dashboard/affiliates");
}
