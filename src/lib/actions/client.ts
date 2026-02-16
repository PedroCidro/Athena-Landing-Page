"use server";

import { db } from "@/lib/db";
import { clients, clientInteractions, deals } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/helpers";
import {
  createClientSchema,
  updateClientSchema,
  createInteractionSchema,
} from "@/lib/validations/client";
import { eq, desc, ilike, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getClients(search?: string) {
  if (search) {
    return db.query.clients.findMany({
      where: or(
        ilike(clients.name, `%${search}%`),
        ilike(clients.email, `%${search}%`),
        ilike(clients.company, `%${search}%`)
      ),
      orderBy: [desc(clients.createdAt)],
      with: {
        owner: { columns: { id: true, name: true } },
      },
    });
  }
  return db.query.clients.findMany({
    orderBy: [desc(clients.createdAt)],
    with: {
      owner: { columns: { id: true, name: true } },
    },
  });
}

export async function getClient(id: string) {
  return db.query.clients.findFirst({
    where: eq(clients.id, id),
    with: {
      owner: { columns: { id: true, name: true } },
      deals: {
        orderBy: [desc(deals.createdAt)],
        with: { creator: { columns: { id: true, name: true } } },
      },
      interactions: {
        orderBy: [desc(clientInteractions.occurredAt)],
        with: { user: { columns: { id: true, name: true } } },
      },
      projects: {
        columns: { id: true, name: true, status: true },
      },
    },
  });
}

export async function createClient(formData: FormData) {
  const user = await requireAuth();
  const raw = Object.fromEntries(formData.entries());
  const parsed = createClientSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const data = {
    name: parsed.data.name,
    email: parsed.data.email || null,
    phone: parsed.data.phone || null,
    company: parsed.data.company || null,
    status: parsed.data.status,
    source: parsed.data.source || null,
    notes: parsed.data.notes || null,
    ownerId: user.id,
  };

  const [client] = await db.insert(clients).values(data).returning();

  revalidatePath("/dashboard/clients");
  return { success: true, id: client.id };
}

export async function updateClient(id: string, formData: FormData) {
  await requireAuth();
  const raw = Object.fromEntries(formData.entries());
  const parsed = updateClientSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const data: Record<string, unknown> = { updatedAt: new Date() };
  if (parsed.data.name !== undefined) data.name = parsed.data.name;
  if (parsed.data.email !== undefined) data.email = parsed.data.email || null;
  if (parsed.data.phone !== undefined) data.phone = parsed.data.phone || null;
  if (parsed.data.company !== undefined) data.company = parsed.data.company || null;
  if (parsed.data.status !== undefined) data.status = parsed.data.status;
  if (parsed.data.source !== undefined) data.source = parsed.data.source || null;
  if (parsed.data.notes !== undefined) data.notes = parsed.data.notes || null;

  await db.update(clients).set(data).where(eq(clients.id, id));

  revalidatePath("/dashboard/clients");
  revalidatePath(`/dashboard/clients/${id}`);
  return { success: true };
}

export async function deleteClient(id: string) {
  await requireAuth();
  await db.delete(clients).where(eq(clients.id, id));
  revalidatePath("/dashboard/clients");
  return { success: true };
}

export async function addInteraction(formData: FormData) {
  const user = await requireAuth();
  const raw = Object.fromEntries(formData.entries());
  const parsed = createInteractionSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  await db.insert(clientInteractions).values({
    clientId: parsed.data.clientId,
    userId: user.id,
    type: parsed.data.type,
    summary: parsed.data.summary,
    occurredAt: parsed.data.occurredAt
      ? new Date(parsed.data.occurredAt)
      : new Date(),
  });

  revalidatePath(`/dashboard/clients/${parsed.data.clientId}`);
  return { success: true };
}
