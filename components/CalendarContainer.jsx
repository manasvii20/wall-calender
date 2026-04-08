"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  addMonths,
  format,
  isAfter,
  isBefore,
  isSameDay,
  parseISO,
  startOfMonth
} from "date-fns";
import Header from "@/components/Header";
import CalendarGrid from "@/components/CalendarGrid";
import NotesPanel from "@/components/NotesPanel";

const MONTH_IMAGES = {
  0: "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&w=1400&q=80", // Jan - Deep Snow
  1: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=80", // Feb - Winter Mist
  2: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1400&q=80", // Mar - Spring Rain
  3: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1400&q=80", // Apr - Blossoms
  4: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1400&q=80", // May - Lush Greenery
  5: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80", // Jun - Tropical Beach
  6: "https://images.unsplash.com/photo-1594387817286-cacff623441d?auto=format&fit=crop&w=1400&q=80", // Jul - Summer Peaks
  7: "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&w=1400&q=80", // Aug - Summer Sunset
  8: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80", // Sep - Early Autumn Mountains
  9: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?auto=format&fit=crop&w=1400&q=80", // Oct - Peak Autumn Forest
  10: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80", // Nov - Late Autumn / Pre-Winter
  11: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=1400&q=80"  // Dec - Snowy Pine Forest
};

const STORAGE_KEY = "wall-calendar-state-v1";

function SpiralBinding() {
  return (
    <div className="absolute -top-4 left-0 right-0 z-30 flex justify-center gap-[clamp(0.5rem,2vw,1.5rem)] px-12">
      {[...Array(14)].map((_, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="h-6 w-1.5 rounded-full bg-gradient-to-b from-zinc-700 to-zinc-900 shadow-lg ring-1 ring-white/10" />
          <div className="h-2 w-2 rounded-full bg-zinc-400 -mt-1 shadow-inner" />
        </div>
      ))}
    </div>
  );
}

function toISODate(date) {
  return format(date, "yyyy-MM-dd");
}

function getRangeKey(start, end) {
  return `${toISODate(start)}__${toISODate(end)}`;
}

export default function CalendarContainer() {
  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(today));
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [monthlyNotes, setMonthlyNotes] = useState({});
  const [rangeNotes, setRangeNotes] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed.currentMonth) setCurrentMonth(startOfMonth(parseISO(parsed.currentMonth)));
      if (parsed.selectedStartDate) setSelectedStartDate(parseISO(parsed.selectedStartDate));
      if (parsed.selectedEndDate) setSelectedEndDate(parseISO(parsed.selectedEndDate));
      setMonthlyNotes(parsed.monthlyNotes ?? {});
      setRangeNotes(parsed.rangeNotes ?? {});
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const payload = {
      currentMonth: toISODate(currentMonth),
      selectedStartDate: selectedStartDate ? toISODate(selectedStartDate) : null,
      selectedEndDate: selectedEndDate ? toISODate(selectedEndDate) : null,
      monthlyNotes,
      rangeNotes
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [currentMonth, monthlyNotes, rangeNotes, selectedEndDate, selectedStartDate]);

  const monthKey = format(currentMonth, "yyyy-MM");
  const activeMonthlyNote = monthlyNotes[monthKey] ?? "";

  const activeRangeKey = useMemo(() => {
    if (!selectedStartDate || !selectedEndDate) return null;
    return getRangeKey(selectedStartDate, selectedEndDate);
  }, [selectedEndDate, selectedStartDate]);

  const activeRangeNote = activeRangeKey ? rangeNotes[activeRangeKey] ?? "" : "";

  const noteMap = useMemo(() => {
    const map = {};
    Object.entries(rangeNotes).forEach(([key, note]) => {
      if (!note?.trim()) return;
      const [startIso, endIso] = key.split("__");
      map[startIso] = note;
      map[endIso] = note;
    });
    return map;
  }, [rangeNotes]);

  const getRangeStatus = (day) => {
    const isStart = selectedStartDate && isSameDay(day, selectedStartDate);
    const isEnd = selectedEndDate && isSameDay(day, selectedEndDate);
    const isInRange =
      selectedStartDate &&
      selectedEndDate &&
      isAfter(day, selectedStartDate) &&
      isBefore(day, selectedEndDate);

    const isHoverStart = false; // logic handled in hover range
    const isHoverEnd = false;
    let isInHoverRange = false;

    if (selectedStartDate && !selectedEndDate && hoveredDate) {
      const [start, end] = isAfter(selectedStartDate, hoveredDate)
        ? [hoveredDate, selectedStartDate]
        : [selectedStartDate, hoveredDate];

      const isDaySameAsStart = isSameDay(day, start);
      const isDaySameAsEnd = isSameDay(day, end);
      const isDayBetween = isAfter(day, start) && isBefore(day, end);

      if (isDayBetween || isDaySameAsStart || isDaySameAsEnd) {
        isInHoverRange = true;
      }
    }

    return {
      isStart,
      isEnd,
      isInRange,
      isInHoverRange,
    };
  };

  const onDateClick = (day) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(day);
      setSelectedEndDate(null);
      return;
    }

    if (selectedStartDate && !selectedEndDate) {
      if (isSameDay(day, selectedStartDate)) {
        setSelectedStartDate(null);
        return;
      }
      if (isBefore(day, selectedStartDate)) {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(day);
      } else {
        setSelectedEndDate(day);
      }
    }
  };

  const animateAndSetMonth = (monthDate) => {
    setIsAnimating(true);
    setCurrentMonth(monthDate);
    window.setTimeout(() => setIsAnimating(false), 250);
  };

  const activeRangeLabel = selectedStartDate
    ? selectedEndDate
      ? `${format(selectedStartDate, "MMM d")} - ${format(selectedEndDate, "MMM d, yyyy")}`
      : `${format(selectedStartDate, "MMM d, yyyy")} (picking end date...)`
    : "No range selected";

  const currentHeroImage = MONTH_IMAGES[currentMonth.getMonth()];

  return (
    <div className="min-h-screen bg-zinc-200 p-4 lg:p-12">
      <section className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_1.6fr_1fr]">
        <div className="group relative flex flex-col rounded-[2.5rem] border-[12px] border-white bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] ring-1 ring-black/5">
          <div className="relative min-h-[20rem] flex-grow overflow-hidden rounded-[1.5rem] lg:min-h-[44rem]">
            <Image
              src={currentHeroImage}
              alt={format(currentMonth, "MMMM")}
              fill
              className="object-cover transition-all duration-1000 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="mb-4 h-1 w-12 rounded-full bg-cyan-400" />
              <p className="text-xs font-black uppercase tracking-[0.4em] text-cyan-300">Seasonal View</p>
              <h1 className="mt-3 text-5xl font-black tracking-tighter lg:text-6xl">
                {format(currentMonth, "MMMM")}
                <span className="mt-2 block font-normal text-zinc-400/80">{format(currentMonth, "yyyy")}</span>
              </h1>
            </div>
          </div>
        </div>

        <div className="relative flex flex-col gap-6 rounded-[2.5rem] border-[12px] border-white bg-white p-6 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] ring-1 ring-black/5">
          <SpiralBinding />

          <Header
            currentMonth={currentMonth}
            onPrevMonth={() => animateAndSetMonth(addMonths(currentMonth, -1))}
            onNextMonth={() => animateAndSetMonth(addMonths(currentMonth, 1))}
            isAnimating={isAnimating}
          />

          <div
            className={`flex-grow transition-all duration-500 ease-in-out ${isAnimating ? "translate-x-4 scale-[0.99] opacity-0 blur-sm" : "translate-x-0 scale-100 opacity-100 blur-0"
              }`}
          >
            <CalendarGrid
              currentMonth={currentMonth}
              today={today}
              hoveredDate={hoveredDate}
              noteMap={noteMap}
              onDateClick={onDateClick}
              onDateHover={setHoveredDate}
              getRangeStatus={getRangeStatus}
            />
          </div>
        </div>

        <NotesPanel
          activeRangeLabel={activeRangeLabel}
          noteValue={activeRangeNote}
          monthlyNoteValue={activeMonthlyNote}
          onChangeMonthlyNote={(value) => {
            setMonthlyNotes((prev) => ({ ...prev, [monthKey]: value }));
          }}
          onChangeRangeNote={(value) => {
            if (!activeRangeKey) return;
            setRangeNotes((prev) => ({ ...prev, [activeRangeKey]: value }));
          }}
          onClearRange={() => {
            setSelectedStartDate(null);
            setSelectedEndDate(null);
            setHoveredDate(null);
          }}
        />
      </section>
    </div>
  );
}
