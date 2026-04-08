"use client";

import { eachDayOfInterval, endOfMonth, endOfWeek, isSameDay, isSameMonth, isWeekend, startOfMonth, startOfWeek } from "date-fns";
import DayCell from "@/components/DayCell";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarGrid({
  currentMonth,
  today,
  noteMap,
  onDateClick,
  onDateHover,
  getRangeStatus
}) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((dayName) => (
          <div
            key={dayName}
            className="rounded-lg bg-zinc-100 py-2 text-center text-xs font-semibold uppercase tracking-wide text-zinc-600"
          >
            {dayName}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const iso = day.toISOString().slice(0, 10);
          const rangeStatus = getRangeStatus(day);
          return (
            <DayCell
              key={day.toISOString()}
              day={day}
              isCurrentMonth={isSameMonth(day, currentMonth)}
              isToday={isSameDay(day, today)}
              isWeekend={isWeekend(day)}
              {...rangeStatus}
              notePreview={noteMap[iso]}
              onClick={onDateClick}
              onHover={onDateHover}
            />
          );
        })}
      </div>
    </div>
  );
}
