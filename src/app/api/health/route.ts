import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function GET() {
  const checks: Record<string, unknown> = {};

  // Check env vars
  checks.hasDbUrl = !!process.env.DATABASE_URL;
  checks.dbUrlPrefix = process.env.DATABASE_URL?.substring(0, 30) + "...";
  checks.hasSecret = !!process.env.NEXTAUTH_SECRET;
  checks.hasPassword = !!process.env.DASHBOARD_PASSWORD;

  // Check DB connection
  try {
    const result = await db.execute(sql`SELECT 1 as ok`);
    checks.dbConnected = true;
    checks.dbResult = result;
  } catch (e: unknown) {
    checks.dbConnected = false;
    checks.dbError = e instanceof Error ? e.message : String(e);
    checks.dbStack = e instanceof Error ? e.stack?.split("\n").slice(0, 5) : undefined;
  }

  return NextResponse.json(checks);
}
