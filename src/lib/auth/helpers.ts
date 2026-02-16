import { auth } from "./config";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect("/dashboard/login");
  return user;
}
