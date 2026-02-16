"use client";

import { cn } from "@/lib/utils";

interface NoteCardProps {
  content: string;
  onClick: () => void;
  className?: string;
  spanHours?: number;
}

export function NoteCard({ content, onClick, className, spanHours }: NoteCardProps) {
  const isSpanning = spanHours && spanHours > 1;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      style={
        isSpanning
          ? { height: `calc(${spanHours} * (36px + 1px) - 1px)` }
          : undefined
      }
      className={cn(
        "w-full rounded-md bg-primary/10 px-2 py-1 text-left text-xs text-foreground hover:bg-primary/20 transition-colors",
        isSpanning
          ? "absolute inset-x-0 top-0 z-10 overflow-hidden line-clamp-3 whitespace-pre-wrap"
          : "truncate",
        className
      )}
    >
      {content}
    </button>
  );
}
