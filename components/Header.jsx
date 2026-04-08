"use client";

import { format } from "date-fns";

export default function Header({ currentMonth, onPrevMonth, onNextMonth, isAnimating }) {
  return (
    <div className="flex items-center justify-between px-2 py-1">
      <div className="flex flex-col">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">
          {format(currentMonth, "MMMM")}
        </h2>
        <p className="text-sm font-medium text-zinc-400">{format(currentMonth, "yyyy")}</p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onPrevMonth}
          disabled={isAnimating}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-100 bg-white text-zinc-600 shadow-sm transition-all hover:border-cyan-200 hover:text-cyan-600 hover:shadow-md disabled:opacity-30"
          aria-label="Previous month"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onNextMonth}
          disabled={isAnimating}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-100 bg-white text-zinc-600 shadow-sm transition-all hover:border-cyan-200 hover:text-cyan-600 hover:shadow-md disabled:opacity-30"
          aria-label="Next month"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
