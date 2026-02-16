"use server";

import { db } from "@/lib/db";
import {
  calendarEvents,
  eventAttendees,
  tasks,
  projects,
} from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/helpers";
import { createEventSchema, updateEventSchema } from "@/lib/validations/calendar";
import { eq, and, gte, lte, desc, or, isNotNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getEvents(start: Date, end: Date) {
  const events = await db.query.calendarEvents.findMany({
    where: and(
      lte(calendarEvents.startTime, end),
      gte(calendarEvents.endTime, start)
    ),
    orderBy: [desc(calendarEvents.startTime)],
    with: {
      creator: { columns: { id: true, name: true } },
      project: { columns: { id: true, name: true } },
      attendees: {
        with: { user: { columns: { id: true, name: true } } },
      },
    },
  });

  // Also fetch task/project deadlines within the range
  const deadlineTasks = await db.query.tasks.findMany({
    where: and(
      isNotNull(tasks.dueDate),
      gte(tasks.dueDate, start),
      lte(tasks.dueDate, end)
    ),
    columns: { id: true, title: true, dueDate: true, status: true },
    with: {
      project: { columns: { id: true, name: true } },
    },
  });

  const deadlineProjects = await db.query.projects.findMany({
    where: and(
      isNotNull(projects.dueDate),
      gte(projects.dueDate, start),
      lte(projects.dueDate, end)
    ),
    columns: { id: true, name: true, dueDate: true },
  });

  return { events, deadlineTasks, deadlineProjects };
}

export async function getEvent(id: string) {
  return db.query.calendarEvents.findFirst({
    where: eq(calendarEvents.id, id),
    with: {
      creator: { columns: { id: true, name: true } },
      project: { columns: { id: true, name: true } },
      attendees: {
        with: { user: { columns: { id: true, name: true } } },
      },
    },
  });
}

export async function createEvent(formData: FormData) {
  const user = await requireAuth();
  const raw = Object.fromEntries(formData.entries());
  // Handle attendeeIds as comma-separated
  const attendeeIds = formData.get("attendeeIds")
    ? (formData.get("attendeeIds") as string).split(",").filter(Boolean)
    : [];

  const parsed = createEventSchema.safeParse({
    ...raw,
    allDay: raw.allDay === "true",
    attendeeIds,
  });
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const [event] = await db
    .insert(calendarEvents)
    .values({
      title: parsed.data.title,
      description: parsed.data.description || null,
      startTime: new Date(parsed.data.startTime),
      endTime: new Date(parsed.data.endTime),
      allDay: parsed.data.allDay,
      type: parsed.data.type,
      color: parsed.data.color || null,
      projectId: parsed.data.projectId || null,
      createdBy: user.id,
    })
    .returning();

  // Add attendees
  if (attendeeIds.length > 0) {
    await db.insert(eventAttendees).values(
      attendeeIds.map((userId) => ({
        eventId: event.id,
        userId,
      }))
    );
  }

  revalidatePath("/dashboard/calendar");
  return { success: true, id: event.id };
}

export async function updateEvent(id: string, formData: FormData) {
  await requireAuth();
  const raw = Object.fromEntries(formData.entries());
  const parsed = updateEventSchema.safeParse({
    ...raw,
    allDay: raw.allDay === "true",
  });
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const data: Record<string, unknown> = { updatedAt: new Date() };
  if (parsed.data.title !== undefined) data.title = parsed.data.title;
  if (parsed.data.description !== undefined)
    data.description = parsed.data.description || null;
  if (parsed.data.startTime)
    data.startTime = new Date(parsed.data.startTime);
  if (parsed.data.endTime)
    data.endTime = new Date(parsed.data.endTime);
  if (parsed.data.allDay !== undefined) data.allDay = parsed.data.allDay;
  if (parsed.data.type !== undefined) data.type = parsed.data.type;
  if (parsed.data.color !== undefined) data.color = parsed.data.color || null;
  if (parsed.data.projectId !== undefined)
    data.projectId = parsed.data.projectId || null;

  await db
    .update(calendarEvents)
    .set(data)
    .where(eq(calendarEvents.id, id));

  revalidatePath("/dashboard/calendar");
  return { success: true };
}

export async function deleteEvent(id: string) {
  await requireAuth();
  await db.delete(calendarEvents).where(eq(calendarEvents.id, id));
  revalidatePath("/dashboard/calendar");
  return { success: true };
}
