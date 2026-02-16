"use server";

import { db } from "@/lib/db";
import { plannerNotes } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/helpers";
import {
  createPlannerNoteSchema,
  updatePlannerNoteSchema,
} from "@/lib/validations/planner";
import { eq, and, gte, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getPlannerNotes(weekStart: string, weekEnd: string) {
  return db.query.plannerNotes.findMany({
    where: and(
      gte(plannerNotes.targetDate, weekStart),
      lte(plannerNotes.targetDate, weekEnd)
    ),
    with: {
      creator: { columns: { id: true, name: true } },
    },
  });
}

export async function createPlannerNote(data: {
  member: string;
  noteType: string;
  content: string;
  targetDate: string;
  targetHour?: number | null;
  targetHourEnd?: number | null;
}) {
  const user = await requireAuth();
  const parsed = createPlannerNoteSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const isHour = parsed.data.noteType === "hour";
  const targetHourEnd =
    isHour && parsed.data.targetHourEnd != null &&
    parsed.data.targetHourEnd !== parsed.data.targetHour
      ? parsed.data.targetHourEnd
      : null;

  const [note] = await db
    .insert(plannerNotes)
    .values({
      member: parsed.data.member,
      noteType: parsed.data.noteType,
      content: parsed.data.content,
      targetDate: parsed.data.targetDate,
      targetHour: isHour ? parsed.data.targetHour : null,
      targetHourEnd,
      createdBy: user.id,
    })
    .onConflictDoUpdate({
      target: [
        plannerNotes.member,
        plannerNotes.noteType,
        plannerNotes.targetDate,
        plannerNotes.targetHour,
      ],
      set: {
        content: parsed.data.content,
        targetHourEnd,
        updatedAt: new Date(),
      },
    })
    .returning();

  revalidatePath("/dashboard/planner");
  return { success: true, id: note.id };
}

export async function updatePlannerNote(id: string, data: { content: string }) {
  await requireAuth();
  const parsed = updatePlannerNoteSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  await db
    .update(plannerNotes)
    .set({ content: parsed.data.content, updatedAt: new Date() })
    .where(eq(plannerNotes.id, id));

  revalidatePath("/dashboard/planner");
  return { success: true };
}

export async function deletePlannerNote(id: string) {
  await requireAuth();
  await db.delete(plannerNotes).where(eq(plannerNotes.id, id));
  revalidatePath("/dashboard/planner");
  return { success: true };
}
