import { isAuthenticated } from "./config";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

const DEFAULT_USER = {
  id: "00000000-0000-0000-0000-000000000000",
  name: "Admin",
  email: "admin@athenastudios.com.br",
  role: "admin" as const,
};

export async function requireAuth() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/dashboard/login");

  const firstUser = await db.query.users.findFirst({
    columns: { id: true, name: true, email: true, role: true },
  });

  return firstUser ?? DEFAULT_USER;
}
