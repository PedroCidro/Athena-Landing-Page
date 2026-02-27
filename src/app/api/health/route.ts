import { NextResponse } from "next/server";
import postgres from "postgres";

export async function GET() {
  const checks: Record<string, unknown> = {};
  const dbUrl = process.env.DATABASE_URL || "";

  checks.hasDbUrl = !!dbUrl;
  checks.dbUrlPrefix = dbUrl.substring(0, 30) + "...";
  checks.dbUrlHost = dbUrl.match(/@([^:/]+)/)?.[1] || "unknown";
  checks.dbUrlPort = dbUrl.match(/:(\d+)\//)?.[1] || "default";

  // Test raw postgres connection
  try {
    const client = postgres(dbUrl, { prepare: false, connect_timeout: 10 });
    const result = await client`SELECT 1 as ok`;
    checks.dbConnected = true;
    checks.dbResult = result;
    await client.end();
  } catch (e: unknown) {
    checks.dbConnected = false;
    checks.dbError = e instanceof Error ? e.message : String(e);
    checks.dbErrorName = e instanceof Error ? e.name : undefined;
    checks.dbCause = e instanceof Error && e.cause ? String(e.cause) : undefined;
    checks.dbStack = e instanceof Error ? e.stack?.split("\n").slice(0, 8) : undefined;
  }

  return NextResponse.json(checks);
}
