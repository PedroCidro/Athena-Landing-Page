"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/helpers";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function changePassword(formData: FormData) {
  const user = await requireAuth();
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!currentPassword || !newPassword) {
    return { error: "Preencha todos os campos" };
  }

  if (newPassword.length < 6) {
    return { error: "A nova senha deve ter pelo menos 6 caracteres" };
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, user.id),
  });

  if (!dbUser) return { error: "Usuário não encontrado" };

  const match = await bcrypt.compare(currentPassword, dbUser.passwordHash);
  if (!match) return { error: "Senha atual incorreta" };

  const newHash = await bcrypt.hash(newPassword, 12);
  await db
    .update(users)
    .set({ passwordHash: newHash, updatedAt: new Date() })
    .where(eq(users.id, user.id));

  return { success: true };
}
