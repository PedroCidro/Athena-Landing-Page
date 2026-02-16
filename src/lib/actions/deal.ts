"use server";

import { db } from "@/lib/db";
import { deals } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/helpers";
import { createDealSchema, updateDealSchema } from "@/lib/validations/client";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getDeals() {
  return db.query.deals.findMany({
    orderBy: [desc(deals.createdAt)],
    with: {
      client: { columns: { id: true, name: true, company: true } },
      creator: { columns: { id: true, name: true } },
    },
  });
}

export async function getDeal(id: string) {
  return db.query.deals.findFirst({
    where: eq(deals.id, id),
    with: {
      client: { columns: { id: true, name: true, company: true, email: true } },
      creator: { columns: { id: true, name: true } },
    },
  });
}

export async function createDeal(formData: FormData) {
  const user = await requireAuth();
  const raw = Object.fromEntries(formData.entries());
  const parsed = createDealSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const [deal] = await db
    .insert(deals)
    .values({
      title: parsed.data.title,
      value: parsed.data.value || null,
      status: parsed.data.status,
      clientId: parsed.data.clientId,
      createdBy: user.id,
      notes: parsed.data.notes || null,
    })
    .returning();

  revalidatePath("/dashboard/deals");
  return { success: true, id: deal.id };
}

export async function updateDeal(id: string, formData: FormData) {
  await requireAuth();
  const raw = Object.fromEntries(formData.entries());
  const parsed = updateDealSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const data: Record<string, unknown> = { updatedAt: new Date() };
  if (parsed.data.title !== undefined) data.title = parsed.data.title;
  if (parsed.data.value !== undefined) data.value = parsed.data.value || null;
  if (parsed.data.status !== undefined) data.status = parsed.data.status;
  if (parsed.data.clientId !== undefined) data.clientId = parsed.data.clientId;
  if (parsed.data.notes !== undefined) data.notes = parsed.data.notes || null;

  await db.update(deals).set(data).where(eq(deals.id, id));

  revalidatePath("/dashboard/deals");
  revalidatePath(`/dashboard/deals/${id}`);
  return { success: true };
}

export async function updateDealStatus(
  id: string,
  status: "negotiating" | "proposed" | "won" | "lost"
) {
  await requireAuth();
  await db
    .update(deals)
    .set({ status, updatedAt: new Date() })
    .where(eq(deals.id, id));
  revalidatePath("/dashboard/deals");
}

export async function deleteDeal(id: string) {
  await requireAuth();
  await db.delete(deals).where(eq(deals.id, id));
  revalidatePath("/dashboard/deals");
  return { success: true };
}
