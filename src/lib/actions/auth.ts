"use server";

import { verifyPassword, setAuthCookie, clearAuthCookie } from "@/lib/auth/config";
import { redirect } from "next/navigation";

export async function login(password: string): Promise<{ error?: string }> {
  if (!verifyPassword(password)) {
    return { error: "Senha incorreta." };
  }

  await setAuthCookie();
  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  await clearAuthCookie();
  redirect("/dashboard/login");
}
