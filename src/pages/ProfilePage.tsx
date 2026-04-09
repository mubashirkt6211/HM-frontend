/**
 * Profile Page – Centered header (original), right-side vertical tab rail, Attendance tab
 */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  EnvelopeSimple,
  MapPin,
  ShieldCheck,
  Phone,
  Briefcase,
  Buildings,
  ArrowLeft,
  Camera,
  FileText,
  Target,
  ChatCircleText,
  Check,
  User,
  Plus,
  Trash,
  Clock,
  Flag,
  Monitor,
  Layout,
  ChatDots,
  CalendarCheck,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import claraAvatar from "@/assets/clara_avatar.png";

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const INITIAL_OBJECTIVES = [
  { id: 1, title: "Review Website Design 2.0", description: "C-level review phase", category: "Website", priority: "High", completed: false, dueDate: "Tomorrow", comments: 5, progress: 20 },
  { id: 2, title: "Review React Components", description: "New react components code review", category: "Dashboard", priority: "Normal", completed: false, dueDate: "25 April", comments: 5, progress: 0 },
  { id: 3, title: "Mentor 3 junior designers", description: "Bi-weekly sync and portfolio review", category: "Team", priority: "Normal", completed: true, dueDate: "Completed", comments: 12, progress: 100 },
  { id: 4, title: "High-Resolution Analytics Dashboard", description: "Finalize SVG charting logic", category: "Clinical", priority: "High", completed: false, dueDate: "Monday", comments: 8, progress: 45 },
];

const LOGIN_TIMES = ["08:52", "09:01", "08:44", "09:31", "08:58", "08:47", "09:03", "08:55", "09:18", "08:40", "09:27", "08:51", "09:05", "08:33", "09:12", "08:49"];
const LOGOUT_TIMES = ["17:04", "17:32", "17:15", "16:55", "17:22", "18:01", "17:08", "17:45", "17:30", "18:10", "17:00", "17:50", "17:20", "18:05", "16:48", "17:38"];

const calcHours = (login: string, logout: string) => {
  const [lh, lm] = login.split(":").map(Number);
  const [oh, om] = logout.split(":").map(Number);
  const diff = (oh * 60 + om) - (lh * 60 + lm);
  return `${Math.floor(diff / 60)}h ${diff % 60}m`;
};

// Keyed attendance map: "YYYY-MM-DD" -> record (spans 3 months back + 3 forward from today)
const TODAY_REF = new Date(2026, 3, 9); // Apr 9 2026
const STATUSES_CYCLE = ["Present", "Present", "Present", "Late", "Absent", "Present", "Present"];

const buildAttendanceMap = () => {
  const map: Record<string, { status: string; login: string | null; logout: string | null; hours: string | null }> = {};
  const start = new Date(TODAY_REF); start.setMonth(start.getMonth() - 3); start.setDate(1);
  const end = new Date(TODAY_REF); end.setMonth(end.getMonth() + 3 + 1); end.setDate(0); // last day of 3rd future month
  let workIdx = 0;
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (d > TODAY_REF) {
      // future: no record yet (will show as future)
      map[key] = { status: "Future", login: null, logout: null, hours: null };
    } else {
      const status = STATUSES_CYCLE[workIdx % STATUSES_CYCLE.length];
      const li = workIdx % LOGIN_TIMES.length;
      const login = status === "Absent" ? null : LOGIN_TIMES[li];
      const logout = status === "Absent" ? null : LOGOUT_TIMES[li];
      map[key] = { status, login, logout, hours: login && logout ? calcHours(login, logout) : null };
      workIdx++;
    }
  }
  return map;
};
const ATTENDANCE_MAP = buildAttendanceMap();

// Holidays map: "YYYY-MM-DD" -> name
const HOLIDAYS: Record<string, string> = {
  "2026-01-14": "Makar Sankranti",
  "2026-01-26": "Republic Day",
  "2026-03-20": "Holi",
  "2026-04-02": "Good Friday",
  "2026-04-14": "Ambedkar Jayanti",
  "2026-05-01": "Labour Day",
  "2026-06-15": "Eid al-Adha",
  "2026-07-04": "HMS Foundation Day",
};

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE PAGE
// ─────────────────────────────────────────────────────────────────────────────
interface ProfilePageProps { onBack: () => void; }

export function ProfilePage({ onBack }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState("Objectives");
  const [objectives, setObjectives] = useState(INITIAL_OBJECTIVES);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const tabs = [
    { id: "Infos", icon: UserIcon, label: "Info" },
    { id: "Objectives", icon: Target, label: "Objectives" },
    { id: "Attendance", icon: CalendarCheck, label: "Attendance" },
    { id: "Documents", icon: FileText, label: "Documents" },
    { id: "Reviews", icon: ChatCircleText, label: "Reviews" },
  ];

  const toggleObjective = (id: number) =>
    setObjectives(prev => prev.map(obj =>
      obj.id === id ? { ...obj, completed: !obj.completed, progress: !obj.completed ? 100 : 0 } : obj
    ));

  const deleteObjective = (id: number) =>
    setObjectives(prev => prev.filter(obj => obj.id !== id));

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setObjectives(prev => [...prev, {
      id: Date.now(), title: newTitle, description: "Quickly added task",
      category: "Personal", priority: "Normal", completed: false,
      dueDate: "Today", comments: 0, progress: 0,
    }]);
    setNewTitle("");
    setIsAdding(false);
  };

  return (
    <div className="pb-24 max-w-5xl mx-auto px-4 md:px-0 min-h-screen">

      {/* 1. Back Navigation */}
      <div className="flex items-center justify-start py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[13px] font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors group"
        >
          <ArrowLeft weight="bold" size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>
      </div>

      {/* 2. Centered Profile Header (Original style) */}
      <div className="flex flex-col items-center justify-center space-y-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="relative group">
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white dark:border-zinc-900 shadow-xl ring-1 ring-zinc-200 dark:ring-zinc-800">
            <img src={claraAvatar} alt="Clara Lefèvre" className="w-full h-full object-cover" />
          </div>
          <button className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center shadow-lg hover:scale-110 transition-transform border-4 border-white dark:border-zinc-900">
            <Camera weight="fill" size={18} />
          </button>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">Clara Lefèvre</h1>
          <div className="flex items-center justify-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[11px] font-black uppercase tracking-wider border border-blue-100 dark:border-blue-800/50">R&D Product</span>
            <span className="text-[13px] font-bold text-zinc-400 dark:text-zinc-500">Product Manager</span>
          </div>
        </div>
      </div>

      {/* 3. Horizontal tab bar — single row */}
      <div className="flex items-center justify-center mb-10 animate-in fade-in duration-1000">
        <div className="flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1.5 rounded-2xl shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-xl text-[13px] font-bold transition-all",
                activeTab === tab.id
                  ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-md"
                  : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
              )}
            >
              <tab.icon weight={activeTab === tab.id ? "fill" : "bold"} size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="ml-6 hidden md:block">
          <button className="px-5 py-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-[13px] font-black flex items-center gap-2 hover:scale-105 transition-all shadow-md">
            Download PDF
          </button>
        </div>
      </div>

      {/* 4. Full-width tab content */}
      <AnimatePresence mode="wait">
        {activeTab === "Objectives" && (
          <ObjectivesView
            key="objectives"
            objectives={objectives}
            onToggle={toggleObjective}
            onDelete={deleteObjective}
            isAdding={isAdding}
            setIsAdding={setIsAdding}
            newTitle={newTitle}
            setNewTitle={setNewTitle}
            onAdd={handleAddTask}
          />
        )}
        {activeTab === "Infos" && <InfosView key="infos" />}
        {activeTab === "Attendance" && <AttendanceView key="attendance" />}
        {activeTab === "Documents" && <PlaceholderView key="documents" icon={FileText} label="Documents" />}
        {activeTab === "Reviews" && <PlaceholderView key="reviews" icon={ChatCircleText} label="Reviews" />}
      </AnimatePresence>

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ATTENDANCE VIEW – CalendarPage-style monthly grid
// ─────────────────────────────────────────────────────────────────────────────
function AttendanceView() {
  const todayRef = TODAY_REF;
  const [year, setYear] = useState(todayRef.getFullYear());
  const [month, setMonth] = useState(todayRef.getMonth());
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  // Clamp navigation: 3 months back / 3 months forward
  const minDate = new Date(todayRef); minDate.setMonth(minDate.getMonth() - 3); minDate.setDate(1);
  const maxDate = new Date(todayRef); maxDate.setMonth(maxDate.getMonth() + 3); maxDate.setDate(1);

  function prevMonth() {
    const d = new Date(year, month - 1, 1);
    if (d >= minDate) { setYear(d.getFullYear()); setMonth(d.getMonth()); setSelectedKey(null); }
  }
  function nextMonth() {
    const d = new Date(year, month + 1, 1);
    if (d <= maxDate) { setYear(d.getFullYear()); setMonth(d.getMonth()); setSelectedKey(null); }
  }
  function goToday() { setYear(todayRef.getFullYear()); setMonth(todayRef.getMonth()); setSelectedKey(null); }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // firstDayIdx: 0=Mon … 6=Sun  (CalendarPage style)
  const firstDayIdx = (new Date(year, month, 1).getDay() + 6) % 7;
  const totalCells = Math.ceil((firstDayIdx + daysInMonth) / 7) * 7;

  const dateKey = (y: number, m: number, d: number) =>
    `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  // Stats for the CURRENT month only
  const monthStats = useMemo(() => {
    let present = 0, late = 0, absent = 0, totalMin = 0, workedDays = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const rec = ATTENDANCE_MAP[dateKey(year, month, d)];
      if (!rec || rec.status === "Weekend" || rec.status === "Future") continue;
      if (rec.status === "Present") present++;
      if (rec.status === "Late") late++;
      if (rec.status === "Absent") absent++;
      if (rec.login && rec.logout) {
        const [lh, lm] = rec.login.split(":").map(Number);
        const [oh, om] = rec.logout.split(":").map(Number);
        totalMin += (oh * 60 + om) - (lh * 60 + lm);
        workedDays++;
      }
    }
    const working = present + late + absent;
    const rate = working > 0 ? Math.round(((present + late) / working) * 100) : 0;
    const avgMin = workedDays > 0 ? Math.round(totalMin / workedDays) : 0;
    return { present, late, absent, rate, avgH: Math.floor(avgMin / 60), avgM: avgMin % 60 };
  }, [year, month, daysInMonth]);

  const selectedRec = selectedKey ? ATTENDANCE_MAP[selectedKey] : null;

  // Only show login/logout text for the 3 most recent past days in this month
  const recentKeys = useMemo(() => {
    const keys: string[] = [];
    for (let d = daysInMonth; d >= 1 && keys.length < 3; d--) {
      const k = dateKey(year, month, d);
      const rec = ATTENDANCE_MAP[k];
      if (rec && rec.status !== "Future" && rec.login) keys.push(k);
    }
    return new Set(keys);
  }, [year, month, daysInMonth]);

  const STATUS_DOT: Record<string, string> = {
    Present: "bg-emerald-500",
    Late: "bg-orange-400",
    Absent: "bg-red-500",
  };
  const STATUS_CELL: Record<string, string> = {
    Present: "bg-emerald-50 dark:bg-emerald-950/60",
    Late: "bg-orange-50 dark:bg-orange-950/50",
    Absent: "bg-red-50 dark:bg-red-950/40",
    Future: "",
    Weekend: "",
  };
  const STATUS_BADGE: Record<string, string> = {
    Present: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700",
    Late: "bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-700",
    Absent: "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700",
    Future: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700",
    Weekend: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700",
  };

  const canPrev = new Date(year, month - 1, 1) >= minDate;
  const canNext = new Date(year, month + 1, 1) <= maxDate;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 pb-10">

      {/* ── Charts Row ── */}
      <div className="flex gap-4 items-start">

        {/* ── Attendance Chart ── */}
        {(() => {
          const total = monthStats.present + monthStats.late + monthStats.absent;
          const pct = (n: number) => total > 0 ? Math.round((n / total) * 100) : 0;
          const presentPct = pct(monthStats.present);
          const latePct = pct(monthStats.late);
          const absentPct = pct(monthStats.absent);

          // SVG donut: r=52, circumference ≈ 326.7
          const R = 52, C = Math.PI * 2 * R;
          const gap = 3;
          const segments = [
            { label: "Present", value: monthStats.present, pct: presentPct, color: "#10b981", dashColor: "stroke-emerald-500" },
            { label: "Late", value: monthStats.late, pct: latePct, color: "#f97316", dashColor: "stroke-orange-400" },
            { label: "Absent", value: monthStats.absent, pct: absentPct, color: "#ef4444", dashColor: "stroke-red-500" },
          ];
          let offset = 0;
          const arcs = segments.map(seg => {
            const dash = total > 0 ? (seg.value / total) * (C - gap * segments.length) : 0;
            const arc = { ...seg, dash, dashOffset: -offset };
            offset += dash + gap;
            return arc;
          });

          return (
            <div className="flex-1 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 flex flex-col md:flex-row gap-6 items-center">

              {/* Donut */}
              <div className="relative shrink-0 flex items-center justify-center w-40 h-40">
                <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
                  {/* Track */}
                  <circle cx="70" cy="70" r={R} fill="none" stroke="currentColor" strokeWidth="16"
                    className="text-zinc-100 dark:text-zinc-800" />
                  {/* Segments */}
                  {arcs.map((arc, i) => (
                    <circle key={i} cx="70" cy="70" r={R} fill="none"
                      stroke={arc.color} strokeWidth="16"
                      strokeDasharray={`${arc.dash} ${C}`}
                      strokeDashoffset={arc.dashOffset}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dasharray 0.5s ease" }}
                    />
                  ))}
                </svg>
                {/* Centre label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-zinc-900 dark:text-white leading-none">{monthStats.rate}%</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mt-0.5">Rate</span>
                </div>
              </div>

              {/* Right breakdown */}
              <div className="flex-1 w-full space-y-4">
                {segments.map(seg => (
                  <div key={seg.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: seg.color }} />
                        <span className="text-[12px] font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-widest">{seg.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-black text-zinc-900 dark:text-white">{seg.value} days</span>
                        <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500">({seg.pct}%)</span>
                      </div>
                    </div>
                    {/* Bar */}
                    <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${seg.pct}%`, background: seg.color }}
                      />
                    </div>
                  </div>
                ))}

                {/* Avg hours pill */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex-1 flex items-center justify-between bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-xl px-4 py-2.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 dark:text-blue-400">Avg Work Hours / Day</span>
                    <span className="text-[14px] font-black text-blue-700 dark:text-blue-300">{monthStats.avgH}h {monthStats.avgM}m</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── Daily Hours Bar Chart ── */}
        {(() => {
          // Build per-day minutes for current month
          const BAR_H = 80;
          const bars: { day: number; mins: number; status: string }[] = [];
          for (let d = 1; d <= (new Date(year, month + 1, 0).getDate()); d++) {
            const k = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const rec = ATTENDANCE_MAP[k];
            if (!rec || rec.status === "Future") continue;
            let mins = 0;
            if (rec.login && rec.logout) {
              const [lh, lm] = rec.login.split(":").map(Number);
              const [oh, om] = rec.logout.split(":").map(Number);
              mins = (oh * 60 + om) - (lh * 60 + lm);
            }
            bars.push({ day: d, mins, status: rec.status });
          }
          const maxMins = Math.max(...bars.map(b => b.mins), 1);
          const BAR_COLOR: Record<string, string> = { Present: "#10b981", Late: "#f97316", Absent: "#ef4444" };

          return (
            <div className="flex-1 min-w-0 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-[14px] font-black text-zinc-900 dark:text-white leading-none">Daily Hours</h3>
                  <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 mt-1 uppercase tracking-widest">{MONTH_NAMES[month]} {year}</p>
                </div>
                <div className="flex items-center gap-4 text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                  {[["Present", "#10b981"], ["Late", "#f97316"], ["Absent", "#ef4444"]].map(([lbl, col]) => (
                    <div key={lbl} className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: col as string }} />{lbl}
                    </div>
                  ))}
                </div>
              </div>

              {/* SVG bar chart */}
              <div className="overflow-x-auto">
                <svg width={Math.max(bars.length * 22, 400)} height={BAR_H + 28} className="overflow-visible">
                  {/* Gridlines */}
                  {[0, 25, 50, 75, 100].map(pct => {
                    const y = BAR_H - (pct / 100) * BAR_H;
                    return <line key={pct} x1={0} y1={y} x2={bars.length * 22} y2={y}
                      stroke="currentColor" strokeWidth="0.5" className="text-zinc-100 dark:text-zinc-800" />;
                  })}
                  {bars.map((b, i) => {
                    const barH = b.mins > 0 ? Math.max((b.mins / maxMins) * BAR_H, 4) : 0;
                    const x = i * 22 + 3;
                    const color = BAR_COLOR[b.status] ?? "#d1d5db";
                    const h_label = b.mins > 0 ? `${Math.floor(b.mins / 60)}h${b.mins % 60 > 0 ? ` ${b.mins % 60}m` : ""}` : "";
                    return (
                      <g key={b.day}>
                        {/* Bar */}
                        <rect x={x} y={BAR_H - barH} width={16} height={barH}
                          rx={3} fill={color} opacity={0.85}
                          style={{ transition: "height 0.5s ease, y 0.5s ease" }}
                        />
                        {/* Day label */}
                        <text x={x + 8} y={BAR_H + 14} textAnchor="middle"
                          className="fill-zinc-400 dark:fill-zinc-600" fontSize={8} fontWeight={700}>
                          {b.day}
                        </text>
                        {/* Hour tooltip on top */}
                        {b.mins > 0 && (
                          <text x={x + 8} y={BAR_H - barH - 3} textAnchor="middle"
                            className="fill-zinc-400 dark:fill-zinc-500" fontSize={7} fontWeight={700}>
                            {h_label}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          );
        })()}

        {/* ── Week-by-Week Attendance Heatmap ── */}
        {(() => {
          // Build weeks: arrays of 7 days
          const dInMonth = new Date(year, month + 1, 0).getDate();
          const firstDow = (new Date(year, month, 1).getDay() + 6) % 7; // 0=Mon
          const cells: (null | { status: string; day: number })[] = [];
          for (let i = 0; i < firstDow; i++) cells.push(null);
          for (let d = 1; d <= dInMonth; d++) {
            const k = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const rec = ATTENDANCE_MAP[k];
            cells.push(rec ? { status: rec.status, day: d } : { status: "Future", day: d });
          }
          // Pad to complete last week
          while (cells.length % 7 !== 0) cells.push(null);
          const weeks: (null | { status: string; day: number })[][] = [];
          for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

          const HEAT: Record<string, string> = {
            Present: "bg-emerald-400 dark:bg-emerald-500",
            Late: "bg-orange-400 dark:bg-orange-500",
            Absent: "bg-red-400 dark:bg-red-500",
            Future: "bg-zinc-100 dark:bg-zinc-800",
          };

          return (
            <div className="flex-1 min-w-0 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-[14px] font-black text-zinc-900 dark:text-white leading-none">Week-by-Week Heatmap</h3>
                  <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 mt-1 uppercase tracking-widest">Each square = 1 day</p>
                </div>
              </div>

              {/* Week-day header */}
              <div className="grid grid-cols-7 gap-1.5 mb-2">
                {WEEK_DAYS.map(d => (
                  <div key={d} className="text-center text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">{d}</div>
                ))}
              </div>

              {/* Weeks */}
              <div className="space-y-1.5">
                {weeks.map((week, wi) => (
                  <div key={wi} className="grid grid-cols-7 gap-1.5">
                    {week.map((cell, di) => (
                      <div key={di}
                        title={cell ? `${cell.day} — ${cell.status}` : ""}
                        className={cn(
                          "h-8 rounded-lg transition-all hover:scale-105 cursor-default flex items-center justify-center",
                          cell ? HEAT[cell.status] : "bg-transparent"
                        )}>
                        {cell && (
                          <span className="text-[9px] font-black text-white/80 select-none">{cell.day}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

      </div>{/* end charts row */}

      {/* ── Calendar Card ── */}

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">

        {/* Info banner */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-blue-50 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/40">
          <span className="text-blue-500 dark:text-blue-400 text-[13px]">ℹ</span>
          <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
            Showing <span className="font-black">3 months</span> of attendance — Jan to Jul 2026. All records are tracked and stored in the system.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          {/* Month + nav */}
          <div className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-1">
            <button onClick={prevMonth} disabled={!canPrev}
              className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <svg viewBox="0 0 256 256" className="w-4 h-4 fill-current"><path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" /></svg>
            </button>
            <span className="text-[14px] font-bold text-zinc-900 dark:text-zinc-100 px-3 min-w-[140px] text-center">
              {MONTH_NAMES[month]} {year}
            </span>
            <button onClick={nextMonth} disabled={!canNext}
              className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <svg viewBox="0 0 256 256" className="w-4 h-4 fill-current"><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" /></svg>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Legend */}
            <div className="hidden md:flex items-center gap-4 text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
              {["Present", "Late", "Absent"].map(s => (
                <div key={s} className="flex items-center gap-1.5">
                  <span className={cn("w-2 h-2 rounded-full", STATUS_DOT[s])} />{s}
                </div>
              ))}
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-violet-500" />Holiday
              </div>
            </div>
            {/* Today */}
            <button onClick={goToday}
              className="px-3 py-1.5 text-xs font-bold border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              Today
            </button>
          </div>
        </div>

        {/* Day-of-week header */}
        <div className="grid grid-cols-7 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900">
          {WEEK_DAYS.map(d => (
            <div key={d} className="py-3 text-center text-[11px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider border-r border-zinc-100 dark:border-zinc-800 last:border-r-0">
              {d}
            </div>
          ))}
        </div>

        {/* Month grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${year}-${month}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="grid grid-cols-7"
          >
            {Array.from({ length: totalCells }).map((_, idx) => {
              const dayNum = idx - firstDayIdx + 1;
              const inMonth = dayNum >= 1 && dayNum <= daysInMonth;
              const key = inMonth ? dateKey(year, month, dayNum) : null;
              const rec = key ? ATTENDANCE_MAP[key] : null;
              const holiday = key ? HOLIDAYS[key] : null;

              const isToday = inMonth && dayNum === todayRef.getDate() && month === todayRef.getMonth() && year === todayRef.getFullYear();
              const isFuture = inMonth && rec?.status === "Future";
              const isWeekend = inMonth && rec?.status === "Weekend";
              const isSelected = key !== null && key === selectedKey;

              // overflow day numbers (prev/next month)
              const overflowDay = dayNum <= 0
                ? new Date(year, month, 0).getDate() + dayNum
                : dayNum > daysInMonth ? dayNum - daysInMonth : dayNum;

              return (
                <div
                  key={idx}
                  onClick={() => inMonth && !isFuture && !isWeekend && setSelectedKey(isSelected ? null : key)}
                  className={cn(
                    "min-h-[80px] border-b border-r border-zinc-100 dark:border-zinc-800 last:border-r-0 p-2 transition-colors relative group",
                    !inMonth && "bg-zinc-50/60 dark:bg-zinc-900/30",
                    inMonth && !isWeekend && !isFuture && "cursor-pointer",
                    inMonth && rec && STATUS_CELL[rec.status],
                    isSelected && "ring-2 ring-inset ring-zinc-900 dark:ring-zinc-100",
                    holiday && inMonth && "bg-violet-50/60 dark:bg-violet-900/10",
                  )}
                >
                  {/* Day number */}
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn(
                      "w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold transition-colors",
                      !inMonth && "text-zinc-300 dark:text-zinc-700",
                      inMonth && !isToday && !isWeekend && !isFuture && "text-zinc-700 dark:text-zinc-300",
                      isToday && "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-black",
                      isWeekend && inMonth && "text-zinc-400 dark:text-zinc-600",
                      isFuture && "text-zinc-400 dark:text-zinc-600",
                    )}>
                      {overflowDay}
                    </span>
                    {/* Attendance dot */}
                    {inMonth && rec && STATUS_DOT[rec.status] && (
                      <span className={cn("w-2 h-2 rounded-full", STATUS_DOT[rec.status])} />
                    )}
                  </div>

                  {/* Holiday label */}
                  {holiday && inMonth && (
                    <div className="text-[9px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-wider leading-tight truncate">
                      🎉 {holiday}
                    </div>
                  )}

                  {/* Login / Logout times — only for 3 most recent days */}
                  {inMonth && rec?.login && recentKeys.has(key!) && (
                    <div className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 mt-0.5 leading-tight space-y-0.5">
                      <div>↑ {rec.login}</div>
                      {rec.logout && <div>↓ {rec.logout}</div>}
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* ── Selected Day Detail Panel ── */}
        <AnimatePresence>
          {selectedKey && selectedRec && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="border-t border-zinc-100 dark:border-zinc-800 px-6 py-4 flex items-center gap-8 flex-wrap bg-zinc-50/50 dark:bg-zinc-900/50"
            >
              {/* Date */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Date</p>
                <p className="text-[14px] font-black text-zinc-900 dark:text-white">
                  {new Date(selectedKey + "T00:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
              {/* Status badge */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Status</p>
                <span className={cn("px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-widest border", STATUS_BADGE[selectedRec.status])}>
                  {selectedRec.status}
                </span>
              </div>
              {/* Login */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Login</p>
                <p className="text-[15px] font-black text-zinc-900 dark:text-white">{selectedRec.login ?? "—"}</p>
              </div>
              {/* Logout */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Logout</p>
                <p className="text-[15px] font-black text-zinc-900 dark:text-white">{selectedRec.logout ?? "—"}</p>
              </div>
              {/* Hours */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Hours Worked</p>
                <p className="text-[15px] font-black text-zinc-900 dark:text-white">{selectedRec.hours ?? "—"}</p>
              </div>
              {/* Holiday */}
              {HOLIDAYS[selectedKey] && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Holiday</p>
                  <p className="text-[13px] font-black text-violet-600 dark:text-violet-400">🎉 {HOLIDAYS[selectedKey]}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// OBJECTIVES VIEW
// ─────────────────────────────────────────────────────────────────────────────
function ObjectivesView({ objectives, onToggle, onDelete, isAdding, setIsAdding, newTitle, setNewTitle, onAdd }: any) {
  const [filterTab, setFilterTab] = useState("Pending");

  const filteredObjectives = useMemo(() => {
    if (filterTab === "Pending") return objectives.filter((o: any) => !o.completed);
    if (filterTab === "Completed") return objectives.filter((o: any) => o.completed);
    return objectives;
  }, [objectives, filterTab]);

  const stats = useMemo(() => {
    const total = objectives.length;
    const completedCount = objectives.filter((o: any) => o.completed).length;
    const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;
    return { percentage, completedCount, total };
  }, [objectives]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <div className="space-y-1">
          <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight leading-none">To-do <span className="text-zinc-400 ml-1">{stats.total}</span></h3>
          <p className="text-[12px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Global Progress: {stats.percentage}%</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-all">
            <DotsThree size={24} weight="bold" />
          </button>
          <button onClick={() => setIsAdding(true)} className="w-9 h-9 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center hover:scale-105 transition-all shadow-lg active:scale-95">
            <Plus size={20} weight="bold" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl w-fit">
        {["All", "Pending", "Completed"].map(tab => (
          <button key={tab} onClick={() => setFilterTab(tab)} className={cn("px-5 py-1.5 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all", filterTab === tab ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm" : "text-zinc-400 hover:text-zinc-600")}>
            {tab}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="min-h-[400px] space-y-6">
        {isAdding && (
          <motion.form initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onSubmit={onAdd} className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] border-2 border-dashed border-indigo-200 dark:border-indigo-900/50 space-y-4">
            <input autoFocus className="w-full bg-transparent text-lg font-black text-zinc-950 dark:text-white outline-none placeholder:text-zinc-300" placeholder="What needs to be done?" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 rounded-xl text-zinc-400 text-[12px] font-bold">Cancel</button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-[12px] font-black shadow-lg">Create Task</button>
            </div>
          </motion.form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredObjectives.map((obj: any) => (
              <TaskCard key={obj.id} obj={obj} onToggle={onToggle} onDelete={onDelete} />
            ))}
          </AnimatePresence>
        </div>

        {filteredObjectives.length === 0 && !isAdding && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-300"><Target size={32} /></div>
            <p className="text-sm font-bold text-zinc-400">No tasks found in this category.</p>
          </div>
        )}
      </div>

      {!isAdding && (
        <button onClick={() => setIsAdding(true)} className="w-full py-6 flex items-center justify-center gap-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 font-black text-sm group transition-all">
          <Plus weight="bold" size={20} className="group-hover:rotate-90 transition-transform duration-500" /> Add Task
        </button>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TASK CARD
// ─────────────────────────────────────────────────────────────────────────────
function TaskCard({ obj, onToggle, onDelete }: any) {
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={cn("group bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all relative overflow-hidden", obj.completed && "opacity-60 bg-zinc-50/50 dark:bg-zinc-950/20")}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 text-[10px] font-black uppercase tracking-widest border border-zinc-100 dark:border-zinc-700">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" /> To do
          </div>
          <div className={cn("flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border", obj.priority === "High" ? "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800/50" : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/50")}>
            <Flag weight="fill" size={10} /> {obj.priority}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-50 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-widest border border-zinc-100 dark:border-zinc-800">
            {obj.category === "Website" ? <Monitor weight="fill" size={10} /> : <Layout weight="fill" size={10} />} {obj.category}
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onToggle(obj.id)} className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-all", obj.completed ? "bg-emerald-500 text-white" : "bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:text-emerald-500")}>
            <Check weight="bold" size={14} />
          </button>
          <button onClick={() => onDelete(obj.id)} className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-rose-500 transition-all">
            <Trash weight="bold" size={14} />
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-6 pointer-events-none">
        <h4 className={cn("text-[18px] font-black text-zinc-950 dark:text-white tracking-tight leading-tight", obj.completed && "line-through text-zinc-400 dark:text-zinc-600")}>{obj.title}</h4>
        <p className="text-[14px] font-bold text-zinc-400 dark:text-zinc-500 italic flex items-start gap-1.5">
          <span className="mt-1 leading-none text-zinc-300 dark:text-zinc-700">↳</span> {obj.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-5 border-t border-zinc-50 dark:border-zinc-800/50">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-200 dark:bg-zinc-800 overflow-hidden ring-1 ring-zinc-50 dark:ring-zinc-800">
                <img src={`https://i.pravatar.cc/100?u=${obj.id + i}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 text-zinc-400 dark:text-zinc-600">
            <div className="flex items-center gap-1.5 text-[11px] font-black tracking-widest"><ChatDots size={16} weight="bold" /> {obj.comments}</div>
            <div className={cn("flex items-center gap-1.5 text-[11px] font-black tracking-widest", obj.dueDate === "Tomorrow" ? "text-orange-500 dark:text-orange-400" : "text-zinc-400 dark:text-zinc-600")}>
              <Clock size={16} weight="bold" /> {obj.dueDate}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-5 h-5">
            <svg className="w-5 h-5 -rotate-90">
              <circle cx="10" cy="10" r="8" className="stroke-zinc-100 dark:stroke-zinc-800" strokeWidth="2.5" fill="none" />
              <motion.circle initial={{ pathLength: 0 }} animate={{ pathLength: obj.progress / 100 }} cx="10" cy="10" r="8" className={cn(obj.progress === 100 ? "stroke-emerald-500" : "stroke-zinc-300 dark:stroke-zinc-500")} strokeWidth="2.5" fill="none" strokeDasharray="50 50" />
            </svg>
          </div>
          <span className="text-[12px] font-black text-zinc-900 dark:text-white tracking-widest">{obj.progress}%</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INFOS VIEW
// ─────────────────────────────────────────────────────────────────────────────
function InfosView() {
  const details = [
    { label: "Email Address", value: "clara@coconut.health", icon: EnvelopeSimple },
    { label: "Phone", value: "+33 (0) 1 42 68 53 00", icon: Phone },
    { label: "Location", value: "Paris - HQ-04", icon: MapPin },
    { label: "Department", value: "Product R&D", icon: Buildings },
    { label: "Access Level", value: "Level 4 (Admin)", icon: ShieldCheck },
    { label: "Role", value: "Senior Product Manager", icon: Briefcase },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white dark:bg-zinc-900 rounded-[42px] border border-zinc-200 dark:border-zinc-800 shadow-sm p-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {details.map(d => (
          <div key={d.label} className="space-y-3">
            <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 text-[11px] font-black uppercase tracking-[0.2em]">
              <d.icon weight="fill" size={14} />{d.label}
            </div>
            <p className="text-[17px] font-black text-zinc-900 dark:text-white tracking-tight">{d.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-16 pt-16 border-t border-zinc-100 dark:border-zinc-800">
        <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-8 leading-none">Administrative Credentials</h3>
        <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-[15px] font-medium max-w-3xl">
          Clara Lefèvre is a Senior staff member within the HMS Product Architecture team.
          She oversees the end-to-end design lifecycle of multi-regional medical hubs with a focus on high-fidelity clinical analytics and seamless patient-provider workflows.
        </p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PLACEHOLDER VIEW
// ─────────────────────────────────────────────────────────────────────────────
function PlaceholderView({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center justify-center py-32 space-y-4 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
      <div className="w-16 h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-300 dark:text-zinc-600">
        <Icon size={32} weight="bold" />
      </div>
      <p className="text-sm font-bold text-zinc-400 dark:text-zinc-500">{label} coming soon.</p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────────────────────
function UserIcon(props: any) { return <User {...props} weight="bold" />; }

function DotsThree(props: any) {
  return (
    <svg viewBox="0 0 256 256" {...props}>
      <path d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM204,116a12,12,0,1,0,12,12A12,12,0,0,0,204,116ZM52,116a12,12,0,1,0,12,12A12,12,0,0,0,52,116Z" />
    </svg>
  );
}
