"use client";

import { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  isSameMonth,
  isSameDay,
  isToday,
  startOfDay,
  setHours,
  getHours,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventForm } from "@/components/dashboard/event-form";

interface CalendarEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  allDay: boolean;
  type: string;
  color: string | null;
  creator: { id: string; name: string };
  project?: { id: string; name: string } | null;
}

interface DeadlineTask {
  id: string;
  title: string;
  dueDate: Date | null;
  status: string;
  project: { id: string; name: string } | null;
}

interface DeadlineProject {
  id: string;
  name: string;
  dueDate: Date | null;
}

interface CalendarPageClientProps {
  events: CalendarEvent[];
  deadlineTasks: DeadlineTask[];
  deadlineProjects: DeadlineProject[];
  projects: { id: string; name: string }[];
  users: { id: string; name: string }[];
}

const typeColors: Record<string, string> = {
  meeting: "bg-blue-500",
  deadline: "bg-red-500",
  reminder: "bg-yellow-500",
};

const typeLabels: Record<string, string> = {
  meeting: "Reunião",
  deadline: "Prazo",
  reminder: "Lembrete",
};

export function CalendarPageClient({
  events,
  deadlineTasks,
  deadlineProjects,
  projects,
  users,
}: CalendarPageClientProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week">("month");
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Combine events with deadline markers
  const allItems = useMemo(() => {
    const items: {
      id: string;
      title: string;
      date: Date;
      endDate?: Date;
      type: "event" | "task-deadline" | "project-deadline";
      color: string;
      eventType?: string;
    }[] = [];

    events.forEach((e) => {
      items.push({
        id: e.id,
        title: e.title,
        date: new Date(e.startTime),
        endDate: new Date(e.endTime),
        type: "event",
        color: e.color || typeColors[e.type] || "bg-blue-500",
        eventType: e.type,
      });
    });

    deadlineTasks.forEach((t) => {
      if (t.dueDate) {
        items.push({
          id: `task-${t.id}`,
          title: `📋 ${t.title}`,
          date: new Date(t.dueDate),
          type: "task-deadline",
          color: t.status === "done" ? "bg-green-500" : "bg-orange-500",
        });
      }
    });

    deadlineProjects.forEach((p) => {
      if (p.dueDate) {
        items.push({
          id: `project-${p.id}`,
          title: `📁 ${p.name}`,
          date: new Date(p.dueDate),
          type: "project-deadline",
          color: "bg-purple-500",
        });
      }
    });

    return items;
  }, [events, deadlineTasks, deadlineProjects]);

  function getItemsForDay(day: Date) {
    return allItems.filter((item) => isSameDay(item.date, day));
  }

  function handlePrev() {
    if (view === "month") setCurrentDate(subMonths(currentDate, 1));
    else setCurrentDate(subWeeks(currentDate, 1));
  }

  function handleNext() {
    if (view === "month") setCurrentDate(addMonths(currentDate, 1));
    else setCurrentDate(addWeeks(currentDate, 1));
  }

  function handleToday() {
    setCurrentDate(new Date());
  }

  function handleDayClick(day: Date) {
    setSelectedDate(day);
    setShowForm(true);
  }

  // Month view
  function renderMonthView() {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calStart = startOfWeek(monthStart, { locale: ptBR });
    const calEnd = endOfWeek(monthEnd, { locale: ptBR });

    const weeks: Date[][] = [];
    let day = calStart;
    while (day <= calEnd) {
      const week: Date[] = [];
      for (let i = 0; i < 7; i++) {
        week.push(day);
        day = addDays(day, 1);
      }
      weeks.push(week);
    }

    const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 bg-muted">
          {weekDays.map((d) => (
            <div
              key={d}
              className="px-2 py-2 text-center text-xs font-medium text-muted-foreground"
            >
              {d}
            </div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((day) => {
              const dayItems = getItemsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[100px] border-t border-r p-1 cursor-pointer transition-colors hover:bg-accent/30 ${
                    !isCurrentMonth ? "bg-muted/30 text-muted-foreground" : ""
                  }`}
                  onClick={() => handleDayClick(day)}
                >
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                      isToday(day)
                        ? "bg-primary text-primary-foreground font-bold"
                        : ""
                    }`}
                  >
                    {format(day, "d")}
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {dayItems.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className={`truncate rounded px-1 py-0.5 text-[10px] font-medium text-white ${item.color}`}
                      >
                        {item.title}
                      </div>
                    ))}
                    {dayItems.length > 3 && (
                      <div className="text-[10px] text-muted-foreground px-1">
                        +{dayItems.length - 3} mais
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  // Week view
  function renderWeekView() {
    const weekStart = startOfWeek(currentDate, { locale: ptBR });
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(weekStart, i));
    }

    const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM to 8 PM

    return (
      <div className="border rounded-lg overflow-auto">
        <div className="grid grid-cols-[60px_repeat(7,1fr)] min-w-[700px]">
          {/* Header */}
          <div className="border-b bg-muted p-2" />
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className={`border-b border-l bg-muted p-2 text-center ${
                isToday(day) ? "bg-primary/10" : ""
              }`}
            >
              <div className="text-xs text-muted-foreground">
                {format(day, "EEE", { locale: ptBR })}
              </div>
              <div
                className={`text-sm font-medium ${
                  isToday(day)
                    ? "flex h-7 w-7 mx-auto items-center justify-center rounded-full bg-primary text-primary-foreground"
                    : ""
                }`}
              >
                {format(day, "d")}
              </div>
            </div>
          ))}

          {/* Time slots */}
          {hours.map((hour) => (
            <div key={hour} className="contents">
              <div className="border-t p-1 text-right text-xs text-muted-foreground pr-2">
                {`${hour}:00`}
              </div>
              {days.map((day) => {
                const dayItems = getItemsForDay(day).filter((item) => {
                  if (!item.endDate) return false;
                  const startHour = getHours(item.date);
                  return startHour === hour;
                });

                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className="border-t border-l min-h-[48px] p-0.5 cursor-pointer hover:bg-accent/30"
                    onClick={() => {
                      setSelectedDate(setHours(startOfDay(day), hour));
                      setShowForm(true);
                    }}
                  >
                    {dayItems.map((item) => (
                      <div
                        key={item.id}
                        className={`truncate rounded px-1 py-0.5 text-[10px] font-medium text-white mb-0.5 ${item.color}`}
                      >
                        {item.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sans text-3xl font-bold">Calendário</h1>
          <p className="text-muted-foreground">
            Gerencie eventos e prazos da equipe
          </p>
        </div>
        <Button onClick={() => { setSelectedDate(new Date()); setShowForm(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Evento
        </Button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleToday}>
            Hoje
          </Button>
          <Button variant="outline" size="sm" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold ml-2">
            {view === "month"
              ? format(currentDate, "MMMM yyyy", { locale: ptBR })
              : `Semana de ${format(
                  startOfWeek(currentDate, { locale: ptBR }),
                  "d MMM",
                  { locale: ptBR }
                )} - ${format(
                  endOfWeek(currentDate, { locale: ptBR }),
                  "d MMM yyyy",
                  { locale: ptBR }
                )}`}
          </h2>
        </div>
        <div className="flex rounded-lg border">
          <Button
            variant={view === "month" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setView("month")}
          >
            Mês
          </Button>
          <Button
            variant={view === "week" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setView("week")}
          >
            Semana
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-blue-500" />
          <span>Reunião</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-red-500" />
          <span>Prazo</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-yellow-500" />
          <span>Lembrete</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-orange-500" />
          <span>Tarefa</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-purple-500" />
          <span>Projeto</span>
        </div>
      </div>

      {view === "month" ? renderMonthView() : renderWeekView()}

      <EventForm
        projects={projects}
        users={users}
        defaultDate={selectedDate}
        open={showForm}
        onOpenChange={setShowForm}
      />
    </div>
  );
}
