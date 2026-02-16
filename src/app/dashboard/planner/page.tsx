import { requireAuth } from "@/lib/auth/helpers";
import { getPlannerNotes } from "@/lib/actions/planner";
import { PlannerPageClient } from "@/components/dashboard/planner-page-client";
import { startOfWeek, endOfWeek, format } from "date-fns";

interface Props {
  searchParams: Promise<{ week?: string }>;
}

export default async function PlannerPage({ searchParams }: Props) {
  await requireAuth();

  const params = await searchParams;
  const weekParam = params.week;

  const baseDate = weekParam ? new Date(weekParam + "T12:00:00") : new Date();
  const weekStart = startOfWeek(baseDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(baseDate, { weekStartsOn: 0 });

  const weekStartStr = format(weekStart, "yyyy-MM-dd");
  const weekEndStr = format(weekEnd, "yyyy-MM-dd");

  const notes = await getPlannerNotes(weekStartStr, weekEndStr);

  return (
    <PlannerPageClient
      notes={notes as any}
      initialWeekStart={weekStartStr}
    />
  );
}
