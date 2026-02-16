"use client";

import { useState, useMemo, useCallback, useEffect, useRef, Fragment } from "react";
import { format, addDays, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus } from "lucide-react";
import { NoteCard } from "@/components/dashboard/note-card";
import { NoteDialog } from "@/components/dashboard/note-dialog";
import { cn } from "@/lib/utils";

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

interface WeeklyGridProps {
  member: string;
  weekStart: Date;
  notes: PlannerNote[];
}

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7-20

function dayLabel(d: Date) {
  return format(d, "EEE", { locale: ptBR });
}

function dayNumber(d: Date) {
  return format(d, "dd/MM");
}

interface DragState {
  dateStr: string;
  startHour: number;
  currentHour: number;
}

export function WeeklyGrid({ member, weekStart, notes }: WeeklyGridProps) {
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    note: PlannerNote | null;
    noteType: "hour" | "day" | "week";
    targetDate: string;
    targetHour?: number | null;
    targetHourEnd?: number | null;
  }>({
    open: false,
    note: null,
    noteType: "hour",
    targetDate: "",
    targetHour: null,
    targetHourEnd: null,
  });

  const [drag, setDrag] = useState<DragState | null>(null);
  const dragRef = useRef<DragState | null>(null);

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const memberNotes = useMemo(
    () => notes.filter((n) => n.member === member),
    [notes, member]
  );

  const weekNote = useMemo(
    () => memberNotes.find((n) => n.noteType === "week"),
    [memberNotes]
  );

  function findNote(
    noteType: "hour" | "day",
    dateStr: string,
    hour?: number
  ): PlannerNote | undefined {
    return memberNotes.find(
      (n) =>
        n.noteType === noteType &&
        n.targetDate === dateStr &&
        (noteType === "day" || n.targetHour === hour)
    );
  }

  // Check if a given hour cell is covered by a multi-hour note (but is NOT the start cell)
  function isHourCoveredByNote(dateStr: string, hour: number): PlannerNote | null {
    for (const n of memberNotes) {
      if (
        n.noteType === "hour" &&
        n.targetDate === dateStr &&
        n.targetHour != null &&
        n.targetHourEnd != null &&
        hour > n.targetHour &&
        hour <= n.targetHourEnd
      ) {
        return n;
      }
    }
    return null;
  }

  function openDialog(
    noteType: "hour" | "day" | "week",
    targetDate: string,
    targetHour?: number | null,
    existing?: PlannerNote | null,
    targetHourEnd?: number | null
  ) {
    setDialogState({
      open: true,
      note: existing ?? null,
      noteType,
      targetDate,
      targetHour,
      targetHourEnd,
    });
  }

  // Drag handlers
  const handleMouseUp = useCallback(() => {
    const d = dragRef.current;
    if (!d) return;

    const minHour = Math.min(d.startHour, d.currentHour);
    const maxHour = Math.max(d.startHour, d.currentHour);

    setDrag(null);
    dragRef.current = null;

    if (minHour === maxHour) {
      // Single click — open single-hour dialog
      openDialog("hour", d.dateStr, minHour, null, null);
    } else {
      // Multi-hour drag
      openDialog("hour", d.dateStr, minHour, null, maxHour);
    }
  }, []);

  useEffect(() => {
    if (!drag) return;
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [drag, handleMouseUp]);

  function handleMouseDown(dateStr: string, hour: number) {
    const state: DragState = { dateStr, startHour: hour, currentHour: hour };
    dragRef.current = state;
    setDrag(state);
  }

  function handleMouseEnter(dateStr: string, hour: number) {
    if (!dragRef.current || dragRef.current.dateStr !== dateStr) return;
    const next: DragState = { ...dragRef.current, currentHour: hour };
    dragRef.current = next;
    setDrag(next);
  }

  function isInDragRange(dateStr: string, hour: number): boolean {
    if (!drag || drag.dateStr !== dateStr) return false;
    const min = Math.min(drag.startHour, drag.currentHour);
    const max = Math.max(drag.startHour, drag.currentHour);
    return hour >= min && hour <= max;
  }

  const weekStartStr = format(weekStart, "yyyy-MM-dd");

  return (
    <div className="space-y-4">
      {/* Week note */}
      <div
        onClick={() => openDialog("week", weekStartStr, null, weekNote)}
        className={cn(
          "rounded-lg border border-dashed p-3 cursor-pointer transition-colors",
          weekNote
            ? "border-primary/40 bg-primary/5 hover:bg-primary/10"
            : "border-muted-foreground/30 hover:border-primary/40 hover:bg-muted/50"
        )}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-muted-foreground">
            Nota da Semana
          </span>
          {!weekNote && <Plus className="h-4 w-4 text-muted-foreground" />}
        </div>
        {weekNote ? (
          <p className="text-sm whitespace-pre-wrap">{weekNote.content}</p>
        ) : (
          <p className="text-xs text-muted-foreground/60">
            Clique para adicionar...
          </p>
        )}
      </div>

      {/* Grid */}
      <div className="overflow-auto">
        <div className={cn("min-w-[900px]", drag && "select-none")}>
          <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-px bg-border rounded-lg overflow-hidden">
            {/* Header row */}
            <div className="bg-muted p-2 text-center text-xs font-medium text-muted-foreground">
              Hora
            </div>
            {days.map((d) => (
              <div
                key={d.toISOString()}
                className={cn(
                  "bg-muted p-2 text-center",
                  isSameDay(d, new Date()) && "bg-primary/10"
                )}
              >
                <div className="text-xs font-medium capitalize">
                  {dayLabel(d)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {dayNumber(d)}
                </div>
              </div>
            ))}

            {/* Day note row */}
            <div className="bg-card p-1 flex items-center justify-center">
              <span className="text-[10px] font-medium text-muted-foreground">
                Dia
              </span>
            </div>
            {days.map((d) => {
              const dateStr = format(d, "yyyy-MM-dd");
              const dayNote = findNote("day", dateStr);
              return (
                <div
                  key={`day-${dateStr}`}
                  onClick={() =>
                    !dayNote && openDialog("day", dateStr, null, null)
                  }
                  className={cn(
                    "bg-card p-1 min-h-[36px] cursor-pointer hover:bg-muted/50 transition-colors",
                    isSameDay(d, new Date()) && "bg-primary/5"
                  )}
                >
                  {dayNote ? (
                    <NoteCard
                      content={dayNote.content}
                      onClick={() => openDialog("day", dateStr, null, dayNote)}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center opacity-0 hover:opacity-40 transition-opacity">
                      <Plus className="h-3 w-3" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Hour rows */}
            {HOURS.map((hour) => (
              <Fragment key={hour}>
                <div
                  className="bg-card p-1 flex items-center justify-center border-t border-border/50"
                >
                  <span className="text-[10px] text-muted-foreground">
                    {hour}:00
                  </span>
                </div>
                {days.map((d) => {
                  const dateStr = format(d, "yyyy-MM-dd");
                  const hourNote = findNote("hour", dateStr, hour);
                  const coveredBy = !hourNote
                    ? isHourCoveredByNote(dateStr, hour)
                    : null;
                  const inDrag = isInDragRange(dateStr, hour);

                  // If this cell is covered by a multi-hour note, render empty
                  if (coveredBy) {
                    return (
                      <div
                        key={`${dateStr}-${hour}`}
                        className={cn(
                          "bg-card min-h-[36px] border-t border-border/50",
                          isSameDay(d, new Date()) && "bg-primary/5"
                        )}
                      />
                    );
                  }

                  const spanHours =
                    hourNote?.targetHourEnd != null
                      ? hourNote.targetHourEnd - hourNote.targetHour! + 1
                      : undefined;

                  return (
                    <div
                      key={`${dateStr}-${hour}`}
                      onMouseDown={(e) => {
                        if (hourNote || e.button !== 0) return;
                        e.preventDefault();
                        handleMouseDown(dateStr, hour);
                      }}
                      onMouseEnter={() => handleMouseEnter(dateStr, hour)}
                      className={cn(
                        "bg-card p-1 min-h-[36px] cursor-pointer hover:bg-muted/50 transition-colors border-t border-border/50",
                        isSameDay(d, new Date()) && "bg-primary/5",
                        inDrag && "bg-primary/20",
                        spanHours && spanHours > 1 && "relative overflow-visible"
                      )}
                    >
                      {hourNote ? (
                        <NoteCard
                          content={hourNote.content}
                          spanHours={spanHours}
                          onClick={() =>
                            openDialog(
                              "hour",
                              dateStr,
                              hourNote.targetHour,
                              hourNote,
                              hourNote.targetHourEnd
                            )
                          }
                        />
                      ) : (
                        !inDrag && (
                          <div className="h-full flex items-center justify-center opacity-0 hover:opacity-40 transition-opacity">
                            <Plus className="h-3 w-3" />
                          </div>
                        )
                      )}
                    </div>
                  );
                })}
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Dialog */}
      <NoteDialog
        open={dialogState.open}
        onOpenChange={(open) =>
          setDialogState((prev) => ({ ...prev, open }))
        }
        note={dialogState.note}
        member={member}
        noteType={dialogState.noteType}
        targetDate={dialogState.targetDate}
        targetHour={dialogState.targetHour}
        targetHourEnd={dialogState.targetHourEnd}
      />
    </div>
  );
}
