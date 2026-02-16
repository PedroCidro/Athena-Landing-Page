"use server";

import { db } from "@/lib/db";
import { tasks, taskComments } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/helpers";
import {
  createTaskSchema,
  updateTaskSchema,
  createTaskCommentSchema,
} from "@/lib/validations/task";
import { eq, desc, and, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getTasks(projectId?: string) {
  if (projectId) {
    return db.query.tasks.findMany({
      where: eq(tasks.projectId, projectId),
      orderBy: [asc(tasks.position), desc(tasks.createdAt)],
      with: {
        assignee: { columns: { id: true, name: true } },
        project: { columns: { id: true, name: true } },
        creator: { columns: { id: true, name: true } },
      },
    });
  }
  return db.query.tasks.findMany({
    orderBy: [asc(tasks.position), desc(tasks.createdAt)],
    with: {
      assignee: { columns: { id: true, name: true } },
      project: { columns: { id: true, name: true } },
      creator: { columns: { id: true, name: true } },
    },
  });
}

export async function getTask(id: string) {
  return db.query.tasks.findFirst({
    where: eq(tasks.id, id),
    with: {
      assignee: { columns: { id: true, name: true } },
      project: { columns: { id: true, name: true } },
      creator: { columns: { id: true, name: true } },
      comments: {
        orderBy: [desc(taskComments.createdAt)],
        with: {
          user: { columns: { id: true, name: true } },
        },
      },
    },
  });
}

export async function createTask(formData: FormData) {
  const user = await requireAuth();
  const raw = Object.fromEntries(formData.entries());
  const parsed = createTaskSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const [task] = await db
    .insert(tasks)
    .values({
      ...parsed.data,
      assignedTo: parsed.data.assignedTo || null,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      createdBy: user.id,
    })
    .returning();

  revalidatePath("/dashboard/tasks");
  revalidatePath(`/dashboard/projects/${parsed.data.projectId}`);
  return { success: true, id: task.id };
}

export async function updateTask(id: string, formData: FormData) {
  await requireAuth();
  const raw = Object.fromEntries(formData.entries());
  const parsed = updateTaskSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  await db
    .update(tasks)
    .set({
      ...parsed.data,
      assignedTo: parsed.data.assignedTo || null,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, id));

  revalidatePath("/dashboard/tasks");
  return { success: true };
}

export async function updateTaskStatus(
  id: string,
  status: "todo" | "in_progress" | "in_review" | "done",
  position: number
) {
  await requireAuth();
  await db
    .update(tasks)
    .set({ status, position, updatedAt: new Date() })
    .where(eq(tasks.id, id));

  revalidatePath("/dashboard/tasks");
}

export async function updateTaskPositions(
  updates: { id: string; status: string; position: number }[]
) {
  await requireAuth();
  for (const u of updates) {
    await db
      .update(tasks)
      .set({
        status: u.status as "todo" | "in_progress" | "in_review" | "done",
        position: u.position,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, u.id));
  }
  revalidatePath("/dashboard/tasks");
}

export async function deleteTask(id: string) {
  await requireAuth();
  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, id),
    columns: { projectId: true },
  });
  await db.delete(tasks).where(eq(tasks.id, id));
  revalidatePath("/dashboard/tasks");
  if (task) revalidatePath(`/dashboard/projects/${task.projectId}`);
  return { success: true };
}

export async function addTaskComment(formData: FormData) {
  const user = await requireAuth();
  const raw = Object.fromEntries(formData.entries());
  const parsed = createTaskCommentSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  await db.insert(taskComments).values({
    taskId: parsed.data.taskId,
    userId: user.id,
    content: parsed.data.content,
  });

  revalidatePath(`/dashboard/tasks/${parsed.data.taskId}`);
  return { success: true };
}

export async function getUsers() {
  const { users } = await import("@/lib/db/schema");
  return db.query.users.findMany({
    columns: { id: true, name: true, email: true },
  });
}
