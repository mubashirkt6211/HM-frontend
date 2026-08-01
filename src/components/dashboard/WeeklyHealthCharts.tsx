import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CaretRight,
  Target,
  ChartLineUp,
  Clock,
  Trophy,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/* ================================================================
   Weekly CRM Analytics Dashboard Cards (8 Weeks)
   1. Inbound Leads for the last 8 weeks (Cyan thin-bar density chart + avg line)
   2. Active deal pipeline Last 8 weeks (Red rounded-column chart + avg line)
   3. Sales Response Time Last 8 weeks (Purple rounded-column chart + avg line)
   4. Deal Win Rate for the last 8 weeks (Amber line chart with markers + week 8 highlight)
   ================================================================ */

interface WeekData {
  week: number;
  value: number;
}

export function WeeklyHealthCharts() {
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);

  // 1. Inbound Leads Data (Thin-bar mini columns per week)
  const leadsWeeks = [
    { week: 1, bars: [35, 42, 50, 48, 55, 60], avg: 8100 },
    { week: 2, bars: [40, 52, 45, 62, 58, 50], avg: 8600 },
    { week: 3, bars: [50, 48, 55, 70, 65, 58], avg: 9200 },
    { week: 4, bars: [65, 80, 92, 78, 85, 70], avg: 11400 },
    { week: 5, bars: [45, 55, 60, 50, 68, 62], avg: 9000 },
    { week: 6, bars: [52, 60, 58, 65, 70, 64], avg: 9500 },
    { week: 7, bars: [60, 65, 72, 68, 75, 80], avg: 10100 },
    { week: 8, bars: [75, 88, 95, 85, 100, 92], avg: 10276 },
  ];

  // 2. Deal Pipeline Data (8 rounded bar columns)
  const pipelineWeeks: WeekData[] = [
    { week: 1, value: 850 },
    { week: 2, value: 420 },
    { week: 3, value: 1420 },
    { week: 4, value: 780 },
    { week: 5, value: 650 },
    { week: 6, value: 1100 },
    { week: 7, value: 1540 },
    { week: 8, value: 1245 },
  ];

  // 3. Response Time Data (8 rounded bar columns)
  const responseWeeks: WeekData[] = [
    { week: 1, value: 6.2 },
    { week: 2, value: 4.8 },
    { week: 3, value: 7.5 },
    { week: 4, value: 8.2 },
    { week: 5, value: 5.9 },
    { week: 6, value: 6.8 },
    { week: 7, value: 8.9 },
    { week: 8, value: 7.56 }, // 7h 34min
  ];

  // 4. Deal Win Rate Data (Line chart: 8 points with Y ticks 70 & 80)
  const winRateWeeks: WeekData[] = [
    { week: 1, value: 72 },
    { week: 2, value: 68 },
    { week: 3, value: 71 },
    { week: 4, value: 76 },
    { week: 5, value: 82 },
    { week: 6, value: 79 },
    { week: 7, value: 84 },
    { week: 8, value: 80 },
  ];

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 my-6">
      
      {/* ── CARD 1: Inbound Leads ── */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 flex items-center justify-center text-cyan-500">
              <Target className="size-4" weight="bold" />
            </div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 tracking-tight">
              Inbound Leads for the last 8 weeks
            </h3>
          </div>
          <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition">
            <CaretRight className="size-4" weight="bold" />
          </button>
        </div>

        {/* Metric */}
        <div className="mb-6">
          <p className="text-xs text-zinc-400 font-medium">Avg this week</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              10,276
            </span>
            <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
              leads
            </span>
          </div>
        </div>

        {/* Chart Area */}
        <div className="relative pt-6">
          {/* Average Line */}
          <div className="absolute top-2 left-0 right-0 flex items-center gap-2 pointer-events-none z-10">
            <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 tracking-wide uppercase">
              9,459 AVG
            </span>
            <div className="h-px flex-1 bg-zinc-300 dark:bg-zinc-700/80 border-t border-dashed border-zinc-300 dark:border-zinc-700" />
          </div>

          {/* Mini Density Column Bars across 8 weeks */}
          <div className="h-28 flex items-end justify-between gap-1 pt-6 px-1">
            {leadsWeeks.map((w) => {
              const isWeek8 = w.week === 8;
              const isHovered = hoveredWeek === w.week;
              return (
                <div
                  key={w.week}
                  onMouseEnter={() => setHoveredWeek(w.week)}
                  onMouseLeave={() => setHoveredWeek(null)}
                  className="flex-1 flex items-end justify-center gap-0.5 h-full group cursor-pointer relative"
                >
                  {/* Tooltip on hover */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: -4 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute -top-7 z-20 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap pointer-events-none"
                      >
                        Week {w.week}: {w.avg.toLocaleString()} leads
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* 6 thin vertical bars per week column */}
                  {w.bars.map((barVal, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "w-1 rounded-full transition-all duration-300",
                        isWeek8
                          ? isHovered
                            ? "bg-cyan-600"
                            : "bg-cyan-500"
                          : isHovered
                          ? "bg-cyan-300 dark:bg-cyan-700"
                          : "bg-cyan-100 dark:bg-cyan-950/70"
                      )}
                      style={{ height: `${Math.max(15, barVal)}%` }}
                    />
                  ))}
                </div>
              );
            })}
          </div>

          {/* X Axis Labels */}
          <div className="flex items-center justify-between mt-3 px-1">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <span
                key={num}
                className={cn(
                  "text-xs font-semibold flex-1 text-center transition-colors",
                  hoveredWeek === num
                    ? "text-zinc-900 dark:text-white font-bold"
                    : "text-zinc-400"
                )}
              >
                {num}
              </span>
            ))}
            <div className="flex-1 flex justify-center">
              <span className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                8
              </span>
            </div>
          </div>
        </div>
      </div>


      {/* ── CARD 2: Active Deal Pipeline ── */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-500">
              <ChartLineUp className="size-4" weight="bold" />
            </div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 tracking-tight">
              Active deal pipeline{" "}
              <span className="font-normal text-zinc-400 text-sm ml-0.5">
                Last 8 weeks
              </span>
            </h3>
          </div>
          <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition">
            <CaretRight className="size-4" weight="bold" />
          </button>
        </div>

        {/* Metric */}
        <div className="mb-6">
          <p className="text-xs text-zinc-400 font-medium">Avg this week</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              1,245
            </span>
            <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
              deals
            </span>
          </div>
        </div>

        {/* Chart Area */}
        <div className="relative pt-6">
          {/* Average Line */}
          <div className="absolute top-2 left-0 right-0 flex items-center gap-2 pointer-events-none z-10">
            <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 tracking-wide uppercase">
              1,389 DEALS
            </span>
            <div className="h-px flex-1 bg-zinc-300 dark:bg-zinc-700/80 border-t border-dashed border-zinc-300 dark:border-zinc-700" />
          </div>

          {/* Rounded Bar Columns across 8 weeks */}
          <div className="h-28 flex items-end justify-between gap-2.5 pt-6 px-1">
            {pipelineWeeks.map((item) => {
              const maxVal = 1600;
              const heightPct = Math.max(15, (item.value / maxVal) * 100);
              const isWeek8 = item.week === 8;
              const isHovered = hoveredWeek === item.week;

              return (
                <div
                  key={item.week}
                  onMouseEnter={() => setHoveredWeek(item.week)}
                  onMouseLeave={() => setHoveredWeek(null)}
                  className="flex-1 flex items-end justify-center h-full cursor-pointer relative group"
                >
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: -4 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute -top-7 z-20 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap pointer-events-none"
                      >
                        W{item.week}: {item.value} deals
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div
                    className={cn(
                      "w-full rounded-2xl transition-all duration-300",
                      isWeek8
                        ? isHovered
                          ? "bg-rose-600 shadow-lg shadow-rose-600/30"
                          : "bg-rose-500 shadow-md shadow-rose-500/20"
                        : isHovered
                        ? "bg-rose-200 dark:bg-rose-900/60"
                        : "bg-rose-100/90 dark:bg-rose-950/40"
                    )}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* X Axis Labels */}
          <div className="flex items-center justify-between mt-3 px-1">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <span
                key={num}
                className={cn(
                  "text-xs font-semibold flex-1 text-center transition-colors",
                  hoveredWeek === num
                    ? "text-zinc-900 dark:text-white font-bold"
                    : "text-zinc-400"
                )}
              >
                {num}
              </span>
            ))}
            <div className="flex-1 flex justify-center">
              <span className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                8
              </span>
            </div>
          </div>
        </div>
      </div>


      {/* ── CARD 3: Sales Response Time ── */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-500">
              <Clock className="size-4" weight="bold" />
            </div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 tracking-tight">
              Sales Response Time{" "}
              <span className="font-normal text-zinc-400 text-sm ml-0.5">
                Last 8 weeks
              </span>
            </h3>
          </div>
          <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition">
            <CaretRight className="size-4" weight="bold" />
          </button>
        </div>

        {/* Metric */}
        <div className="mb-6">
          <p className="text-xs text-zinc-400 font-medium">Avg this week</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              7
            </span>
            <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400 mr-1">
              h
            </span>
            <span className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              34
            </span>
            <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
              min
            </span>
          </div>
        </div>

        {/* Chart Area */}
        <div className="relative pt-6">
          {/* Average Reference Line */}
          <div className="absolute top-2 left-0 right-0 flex items-center gap-2 pointer-events-none z-10">
            <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 tracking-wide uppercase">
              9,23 HRS
            </span>
            <div className="h-px flex-1 bg-zinc-300 dark:bg-zinc-700/80 border-t border-dashed border-zinc-300 dark:border-zinc-700" />
          </div>

          {/* Rounded Bar Columns across 8 weeks */}
          <div className="h-28 flex items-end justify-between gap-2.5 pt-6 px-1">
            {responseWeeks.map((item) => {
              const maxVal = 10;
              const heightPct = Math.max(15, (item.value / maxVal) * 100);
              const isWeek8 = item.week === 8;
              const isHovered = hoveredWeek === item.week;

              return (
                <div
                  key={item.week}
                  onMouseEnter={() => setHoveredWeek(item.week)}
                  onMouseLeave={() => setHoveredWeek(null)}
                  className="flex-1 flex items-end justify-center h-full cursor-pointer relative group"
                >
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: -4 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute -top-7 z-20 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap pointer-events-none"
                      >
                        W{item.week}: {item.value === 7.56 ? "7h 34m" : `${item.value}h`}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div
                    className={cn(
                      "w-full rounded-2xl transition-all duration-300",
                      isWeek8
                        ? isHovered
                          ? "bg-indigo-700 shadow-lg shadow-indigo-700/30"
                          : "bg-indigo-600 shadow-md shadow-indigo-600/20"
                        : isHovered
                        ? "bg-indigo-200 dark:bg-indigo-900/60"
                        : "bg-indigo-100/90 dark:bg-indigo-950/40"
                    )}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* X Axis Labels */}
          <div className="flex items-center justify-between mt-3 px-1">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <span
                key={num}
                className={cn(
                  "text-xs font-semibold flex-1 text-center transition-colors",
                  hoveredWeek === num
                    ? "text-zinc-900 dark:text-white font-bold"
                    : "text-zinc-400"
                )}
              >
                {num}
              </span>
            ))}
            <div className="flex-1 flex justify-center">
              <span className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                8
              </span>
            </div>
          </div>
        </div>
      </div>


      {/* ── CARD 4: Deal Win Rate ── */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-500">
              <Trophy className="size-4" weight="bold" />
            </div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 tracking-tight">
              Deal Win Rate for the last 8 weeks
            </h3>
          </div>
          <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition">
            <CaretRight className="size-4" weight="bold" />
          </button>
        </div>

        {/* Metric */}
        <div className="mb-6">
          <p className="text-xs text-zinc-400 font-medium">Avg this week</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              80
            </span>
            <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
              %
            </span>
          </div>
        </div>

        {/* Chart Area */}
        <div className="relative pt-2">
          <div className="relative h-32 w-full">
            {/* Y Axis Reference Ticks */}
            <div className="absolute left-0 top-2 text-[10px] font-bold text-zinc-400">
              80
            </div>
            <div className="absolute left-0 bottom-4 text-[10px] font-bold text-zinc-400">
              70
            </div>

            {/* Horizontal Grid lines */}
            <div className="absolute left-6 right-0 top-3 border-b border-zinc-100 dark:border-zinc-800" />
            <div className="absolute left-6 right-0 bottom-5 border-b border-zinc-100 dark:border-zinc-800" />

            {/* SVG Line Chart + Week 8 highlight column */}
            <svg
              viewBox="0 0 350 110"
              className="w-full h-full overflow-visible pl-6"
              preserveAspectRatio="none"
            >
              {/* Highlight Column for Week 8 */}
              <rect
                x="300"
                y="0"
                width="38"
                height="105"
                rx="14"
                className="fill-zinc-100/90 dark:fill-zinc-800/60"
              />

              {/* Data points mapping for SVG */}
              {(() => {
                const points = winRateWeeks.map((item, idx) => {
                  const x = 18 + idx * 42.5;
                  const y = 92 - ((item.value - 65) / 25) * 80;
                  return { x, y, ...item };
                });

                const pathString = points
                  .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
                  .join(" ");

                return (
                  <>
                    {/* Line */}
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      d={pathString}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Dot Markers */}
                    {points.map((p) => {
                      const isWeek8 = p.week === 8;
                      const isHovered = hoveredWeek === p.week;

                      return (
                        <g
                          key={p.week}
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredWeek(p.week)}
                          onMouseLeave={() => setHoveredWeek(null)}
                        >
                          {isWeek8 && (
                            <circle
                              cx={p.x}
                              cy={p.y}
                              r="8"
                              fill="#f59e0b"
                              fillOpacity="0.25"
                            />
                          )}
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r={isWeek8 ? "5" : isHovered ? "4.5" : "3.5"}
                            fill="#f59e0b"
                            stroke="#ffffff"
                            strokeWidth={isWeek8 ? "2" : "1.5"}
                            className="transition-all"
                          />
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </svg>
          </div>

          {/* X Axis Labels */}
          <div className="flex items-center justify-between mt-3 px-1 pl-6">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <span
                key={num}
                className={cn(
                  "text-xs font-semibold flex-1 text-center transition-colors",
                  hoveredWeek === num
                    ? "text-zinc-900 dark:text-white font-bold"
                    : "text-zinc-400"
                )}
              >
                {num}
              </span>
            ))}
            <div className="flex-1 flex justify-center">
              <span className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                8
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
