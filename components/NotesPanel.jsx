"use client";

export default function NotesPanel({
  activeRangeLabel,
  noteValue,
  monthlyNoteValue,
  onChangeMonthlyNote,
  onChangeRangeNote,
  onClearRange
}) {
  return (
    <aside className="flex h-full flex-col gap-6 rounded-[2rem] border border-zinc-100 bg-zinc-50/30 p-8 shadow-inner ring-1 ring-inset ring-white/50 backdrop-blur-xl">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-lg shadow-cyan-200">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2.5">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-zinc-900">Notes</h3>
            <p className="text-sm font-medium text-zinc-400">Contextual workspace</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400" htmlFor="monthly-note">
          <span className="h-1 w-1 rounded-full bg-cyan-400" />
          Monthly Goals
        </label>
        <textarea
          id="monthly-note"
          rows={5}
          value={monthlyNoteValue}
          onChange={(e) => onChangeMonthlyNote(e.target.value)}
          placeholder="Capture big-picture goals for this month..."
          className="w-full resize-none rounded-2xl border border-zinc-200/60 bg-white p-4 text-sm text-zinc-800 shadow-sm outline-none transition-all focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50/50 hover:border-zinc-300"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400" htmlFor="range-note">
            <span className="h-1 w-1 rounded-full bg-cyan-600" />
            Selection Detail
          </label>
          <span className="text-[10px] font-bold text-cyan-600 underline underline-offset-4 decoration-2 decoration-cyan-100">{activeRangeLabel}</span>
        </div>
        <textarea
          id="range-note"
          rows={6}
          value={noteValue}
          onChange={(e) => onChangeRangeNote(e.target.value)}
          placeholder={activeRangeLabel === "No range selected" ? "Select a range to start writing..." : "Add notes for this period..."}
          disabled={activeRangeLabel === "No range selected"}
          className="w-full resize-none rounded-2xl border border-zinc-200/60 bg-white p-4 text-sm text-zinc-800 shadow-sm outline-none transition-all focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50/50 hover:border-zinc-300 disabled:cursor-not-allowed disabled:bg-zinc-50/50 disabled:opacity-50"
        />
      </div>

      <button
        type="button"
        onClick={onClearRange}
        className="group mt-auto flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-200 active:scale-[0.98]"
      >
        Clear Selection
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 transition-transform group-hover:rotate-90" stroke="currentColor" strokeWidth="3">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </aside>
  );
}
