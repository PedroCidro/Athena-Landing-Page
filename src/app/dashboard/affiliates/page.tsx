import { requireAuth } from "@/lib/auth/helpers";
import { getOutreachList, getOutreachStats } from "@/lib/actions/outreach";
import { AffiliatesPageClient } from "@/components/dashboard/affiliates-page-client";

export default async function AffiliatesPage() {
  await requireAuth();

  const [stats, outreachList] = await Promise.all([
    getOutreachStats(),
    getOutreachList(),
  ]);

  return <AffiliatesPageClient stats={stats} outreachList={outreachList} />;
}
