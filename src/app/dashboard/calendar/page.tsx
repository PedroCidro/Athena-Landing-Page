import { requireAuth } from "@/lib/auth/helpers";
import { getEvents } from "@/lib/actions/calendar";
import { getProjects } from "@/lib/actions/project";
import { getUsers } from "@/lib/actions/task";
import { CalendarPageClient } from "@/components/dashboard/calendar-page-client";
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  addMonths,
} from "date-fns";

export default async function CalendarPage() {
  await requireAuth();

  // Fetch events for a 3-month window centered on current month
  const now = new Date();
  const start = startOfMonth(subMonths(now, 1));
  const end = endOfMonth(addMonths(now, 1));

  const [data, projects, users] = await Promise.all([
    getEvents(start, end),
    getProjects(),
    getUsers(),
  ]);

  return (
    <CalendarPageClient
      events={data.events}
      deadlineTasks={data.deadlineTasks}
      deadlineProjects={data.deadlineProjects}
      projects={projects.map((p) => ({ id: p.id, name: p.name }))}
      users={users}
    />
  );
}
