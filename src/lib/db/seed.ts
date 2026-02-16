import { db } from "./index";
import { users } from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  const passwordHash = await bcrypt.hash("admin123", 12);

  await db
    .insert(users)
    .values({
      name: "Admin",
      email: "admin@athenastudios.com.br",
      passwordHash,
      role: "admin",
    })
    .onConflictDoNothing({ target: users.email });

  console.log("Seed complete. Admin user created: admin@athenastudios.com.br");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
