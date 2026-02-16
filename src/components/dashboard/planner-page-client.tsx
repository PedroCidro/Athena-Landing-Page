"use client";

import { useState, useMemo } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  isThisWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { WeeklyGrid } from "@/components/dashboard/weekly-grid";
import { useRouter } from "next/navigation";

const MEMBERS = ["Pedro", "Luiz", "Kael"] as const;

interface PlannerNote {
  id: string;
  member: string;
  noteType: string;
  content: string;
  targetDate: string;
  targetHour: number | null;
  targetHourEnd?: number | null;
  creator: { id: string; name: string };
}

interface PlannerPageClientProps {
  notes: PlannerNote[];
  initialWeekStart: string;
}

export function PlannerPageClient({
  notes,
  initialWeekStart,
}: PlannerPageClientProps) {
  const router = useRouter();
  const [currentWeekStart, setCurrentWeekStart] = useState(
    () => new Date(initialWeekStart + "T12:00:00")
  );

  const weekEnd = useMemo(
    () => endOfWeek(currentWeekStart, { weekStartsOn: 0 }),
    [currentWeekStart]
  );

  const weekLabel = useMemo(() => {
    const start = format(currentWeekStart, "dd MMM", { locale: ptBR });
    const end = format(weekEnd, "dd MMM yyyy", { locale: ptBR });
    return `Semana de ${start} - ${end}`;
  }, [currentWeekStart, weekEnd]);

  function navigate(direction: "prev" | "next" | "today") {
    let newStart: Date;
    if (direction === "today") {
      newStart = startOfWeek(new Date(), { weekStartsOn: 0 });
    } else if (direction === "prev") {
      newStart = subWeeks(currentWeekStart, 1);
    } else {
      newStart = addWeeks(currentWeekStart, 1);
    }
    setCurrentWeekStart(newStart);
    const dateParam = format(newStart, "yyyy-MM-dd");
    router.push(`/dashboard/planner?week=${dateParam}`);
  }

  const isCurrentWeek = isThisWeek(currentWeekStart, { weekStartsOn: 0 });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Planejador Semanal
          </h1>
          <p className="text-sm text-muted-foreground capitalize">{weekLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("today")}
            disabled={isCurrentWeek}
          >
            Hoje
          </Button>
          <Button variant="outline" size="icon" onClick={() => navigate("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="Pedro">
        <TabsList>
          {MEMBERS.map((m) => (
            <TabsTrigger key={m} value={m}>
              {m}
            </TabsTrigger>
          ))}
        </TabsList>
        {MEMBERS.map((m) => (
          <TabsContent key={m} value={m}>
            <WeeklyGrid
              member={m}
              weekStart={currentWeekStart}
              notes={notes}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
