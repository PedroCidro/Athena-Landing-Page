import { NextResponse } from "next/server";
import postgres from "postgres";

export async function GET() {
  const checks: Record<string, unknown> = {};
  const dbUrl = process.env.DATABASE_URL || "";

  checks.hasDbUrl = !!dbUrl;
  checks.dbUrlHost = dbUrl.match(/@([^:/]+)/)?.[1] || "unknown";
  checks.dbUrlPort = dbUrl.match(/:(\d+)\//)?.[1] || "default";

  // Test direct connection
  try {
    const client = postgres(dbUrl, { prepare: false, connect_timeout: 10 });
    const result = await client`SELECT 1 as ok`;
    checks.directConnected = true;
    await client.end();
  } catch (e: unknown) {
    checks.directConnected = false;
    checks.directError = e instanceof Error ? e.message : String(e);
  }

  // Test pooler (transaction mode - port 6543)
  try {
    const url = new URL(dbUrl);
    const password = decodeURIComponent(url.password);
    const ref = url.hostname.match(/db\.([^.]+)\.supabase/)?.[1] || "";
    checks.projectRef = ref;

    const poolerClient = postgres({
      host: "aws-0-sa-east-1.pooler.supabase.com",
      port: 6543,
      database: "postgres",
      username: `postgres.${ref}`,
      password: password,
      prepare: false,
      connect_timeout: 10,
    });
    const result = await poolerClient`SELECT 1 as ok`;
    checks.poolerConnected = true;
    await poolerClient.end();
  } catch (e: unknown) {
    checks.poolerConnected = false;
    checks.poolerError = e instanceof Error ? e.message : String(e);
  }

  // Test pooler (session mode - port 5432)
  try {
    const url = new URL(dbUrl);
    const password = decodeURIComponent(url.password);
    const ref = url.hostname.match(/db\.([^.]+)\.supabase/)?.[1] || "";

    const sessionClient = postgres({
      host: "aws-0-sa-east-1.pooler.supabase.com",
      port: 5432,
      database: "postgres",
      username: `postgres.${ref}`,
      password: password,
      prepare: false,
      connect_timeout: 10,
    });
    const result = await sessionClient`SELECT 1 as ok`;
    checks.sessionPoolerConnected = true;
    await sessionClient.end();
  } catch (e: unknown) {
    checks.sessionPoolerConnected = false;
    checks.sessionPoolerError = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(checks);
}
