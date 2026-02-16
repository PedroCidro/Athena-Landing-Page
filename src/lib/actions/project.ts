"use server";

import { db } from "@/lib/db";
import {
  projects,
  projectMembers,
  tasks,
} from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/helpers";
import { createProjectSchema, updateProjectSchema } from "@/lib/validations/project";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getProjects() {
  return db.query.projects.findMany({
    orderBy: [desc(projects.createdAt)],
    with: {
      creator: { columns: { id: true, name: true } },
      client: { columns: { id: true, name: true } },
      members: {
        with: { user: { columns: { id: true, name: true } } },
      },
      tasks: { columns: { id: true, status: true } },
    },
  });
}

export async function getProject(id: string) {
  return db.query.projects.findFirst({
    where: eq(projects.id, id),
    with: {
      creator: { columns: { id: true, name: true } },
      client: { columns: { id: true, name: true, company: true } },
      members: {
        with: { user: { columns: { id: true, name: true, email: true } } },
      },
      tasks: {
        orderBy: [desc(tasks.createdAt)],
        with: {
          assignee: { columns: { id: true, name: true } },
        },
      },
    },
  });
}

export async function createProject(formData: FormData) {
  const user = await requireAuth();
  const raw = Object.fromEntries(formData.entries());
  const parsed = createProjectSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const [project] = await db
    .insert(projects)
    .values({
      ...parsed.data,
      clientId: parsed.data.clientId || null,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      createdBy: user.id,
    })
    .returning();

  // Add creator as manager
  await db.insert(projectMembers).values({
    projectId: project.id,
    userId: user.id,
    role: "manager",
  });

  revalidatePath("/dashboard/projects");
  return { success: true, id: project.id };
}

export async function updateProject(id: string, formData: FormData) {
  await requireAuth();
  const raw = Object.fromEntries(formData.entries());
  const parsed = updateProjectSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  await db
    .update(projects)
    .set({
      ...parsed.data,
      clientId: parsed.data.clientId || null,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id));

  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${id}`);
  return { success: true };
}

export async function deleteProject(id: string) {
  await requireAuth();
  await db.delete(projects).where(eq(projects.id, id));
  revalidatePath("/dashboard/projects");
  return { success: true };
}

export async function addProjectMember(
  projectId: string,
  userId: string,
  role: "manager" | "member" = "member"
) {
  await requireAuth();
  await db
    .insert(projectMembers)
    .values({ projectId, userId, role })
    .onConflictDoNothing();
  revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function removeProjectMember(projectId: string, userId: string) {
  await requireAuth();
  const { and } = await import("drizzle-orm");
  await db
    .delete(projectMembers)
    .where(
      and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, userId)
      )
    );
  revalidatePath(`/dashboard/projects/${projectId}`);
}
