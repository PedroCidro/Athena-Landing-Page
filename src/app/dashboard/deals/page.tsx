import { requireAuth } from "@/lib/auth/helpers";
import { getDeals } from "@/lib/actions/deal";
import { getClients } from "@/lib/actions/client";
import { DealsPageClient } from "@/components/dashboard/deals-page-client";

export default async function DealsPage() {
  await requireAuth();
  const [deals, clients] = await Promise.all([getDeals(), getClients()]);

  return (
    <DealsPageClient
      deals={deals}
      clients={clients.map((c) => ({ id: c.id, name: c.name }))}
    />
  );
}
