"use client";

import { format } from "date-fns";

export default function DayCell({
  day,
  isCurrentMonth,
  isToday,
  isWeekend,
  isStart,
  isEnd,
  isInRange,
  isInHoverRange,
  notePreview,
  onClick,
  onHover
}) {
  const isSelected = isStart || isEnd;
  const anyRange = isInRange || isInHoverRange || isSelected;

  const baseClasses = "group relative flex min-h-[5rem] flex-col p-2 text-left transition-all duration-300 ease-in-out";
  
  // Dynamic rounded corners for pill effect
  let roundedClasses = "rounded-xl";
  if (isSelected || isInRange || isInHoverRange) {
    if (isStart && isEnd) roundedClasses = "rounded-full";
    else if (isStart) roundedClasses = "rounded-l-full rounded-r-none";
    else if (isEnd) roundedClasses = "rounded-r-full rounded-l-none";
    else if (isInRange || isInHoverRange) roundedClasses = "rounded-none";
  }

  const stateClasses = !isCurrentMonth
    ? "bg-transparent text-zinc-300 pointer-events-none opacity-40"
    : anyRange
    ? isStart
      ? "bg-cyan-600 text-white shadow-lg shadow-cyan-200 z-10 scale-[1.02]"
      : isEnd
      ? "bg-cyan-800 text-white shadow-lg shadow-cyan-900/20 z-10 scale-[1.02]"
      : isInRange
      ? "bg-cyan-50 text-cyan-900"
      : "bg-cyan-50/50 text-cyan-700 dashed border-cyan-100"
    : "bg-white text-zinc-800 hover:bg-zinc-50 border border-transparent hover:border-zinc-200";

  const todayClasses = isToday && !isSelected ? "ring-2 ring-inset ring-cyan-500/50" : "";

  return (
    <button
      type="button"
      onClick={() => isCurrentMonth && onClick(day)}
      onMouseEnter={() => isCurrentMonth && onHover(day)}
      onFocus={() => isCurrentMonth && onHover(day)}
      className={`${baseClasses} ${roundedClasses} ${stateClasses} ${todayClasses} active:scale-95`}
      aria-label={format(day, "PPPP")}
    >
      <div className="flex items-center justify-between">
        <span className={`text-sm font-bold tracking-tight ${isSelected ? "text-white" : ""}`}>
          {format(day, "d")}
        </span>
        {isToday && (
          <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? "bg-white" : "bg-cyan-500"}`} />
        )}
      </div>

      <div className="mt-auto flex gap-1">
        {notePreview && (
          <div className="relative">
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-lg text-[10px] shadow-sm backdrop-blur-sm ${
                isSelected ? "bg-white/20 text-white" : "bg-cyan-100 text-cyan-700"
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" stroke="currentColor" strokeWidth="2.5">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </span>
            <div className="pointer-events-none absolute bottom-full left-0 mb-2 hidden w-48 -translate-x-4 transform animate-in fade-in slide-in-from-bottom-2 group-hover:block group-focus:block">
              <div className="rounded-xl border border-zinc-100 bg-white/95 p-3 text-xs leading-relaxed text-zinc-700 shadow-xl backdrop-blur">
                <p className="font-semibold text-zinc-900 mb-1">Note detail</p>
                {notePreview}
              </div>
            </div>
          </div>
        )}
      </div>
    </button>
  );
}
