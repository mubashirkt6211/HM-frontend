/**
 * Profile Page – Centered header, horizontal tabs, email-client Attendance tab
 */
import { useState, useMemo, useEffect } from "react";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  ChatDots,
  CalendarCheck,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Export,
  SquaresFour,
  CheckCircle,
  XCircle,
  CaretLeft,
  CaretRight,
  FirstAid,
  Sun,
  WarningCircle,
  Baby,
  PaperPlaneTilt,
  X,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import claraAvatar from "@/assets/clara_avatar.png";

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const TEAM_USERS = [
  { id: 1, name: "Clara Lefèvre", avatar: "https://i.pravatar.cc/100?u=clara" },
  { id: 2, name: "James Okafor", avatar: "https://i.pravatar.cc/100?u=james" },
  { id: 3, name: "Priya Nair", avatar: "https://i.pravatar.cc/100?u=priya" },
  { id: 4, name: "Lucas Meyer", avatar: "https://i.pravatar.cc/100?u=lucas" },
  { id: 5, name: "Amina Diallo", avatar: "https://i.pravatar.cc/100?u=amina" },
  { id: 6, name: "Ravi Shankar", avatar: "https://i.pravatar.cc/100?u=ravi" },
];

const INITIAL_OBJECTIVES = [
  {
    id: 1, title: "Review Website Design 2.0", description: "C-level review phase", category: "Website", priority: "High", completed: false, dueDate: "Tomorrow", progress: 20,
    assignees: [1, 2, 3],
    commentList: [
      { id: 1, userId: 2, text: "Designs look great, just need minor alignment fixes.", time: "2h ago" },
      { id: 2, userId: 3, text: "Will review the export flow by tomorrow.", time: "5h ago" },
    ]
  },
  {
    id: 2, title: "Review React Components", description: "New react components code review", category: "Dashboard", priority: "Normal", completed: false, dueDate: "25 April", progress: 0,
    assignees: [1, 4],
    commentList: [
      { id: 1, userId: 4, text: "Found a bug in the DatePicker component.", time: "1d ago" },
    ]
  },
  {
    id: 3, title: "Mentor 3 junior designers", description: "Bi-weekly sync and portfolio review", category: "Team", priority: "Normal", completed: true, dueDate: "Completed", progress: 100,
    assignees: [1, 5, 6],
    commentList: [
      { id: 1, userId: 5, text: "Session was super helpful, thanks Clara!", time: "3d ago" },
      { id: 2, userId: 6, text: "Portfolio review done ✅", time: "2d ago" },
    ]
  },
  {
    id: 4, title: "High-Resolution Analytics Dashboard", description: "Finalize SVG charting logic", category: "Clinical", priority: "High", completed: false, dueDate: "Monday", progress: 45,
    assignees: [1, 2],
    commentList: []
  },
];

const LOGIN_TIMES = ["08:52", "09:01", "08:44", "09:31", "08:58", "08:47", "09:03", "08:55", "09:18", "08:40", "09:27", "08:51", "09:05", "08:33", "09:12", "08:49"];
const LOGOUT_TIMES = ["17:04", "17:32", "17:15", "16:55", "17:22", "18:01", "17:08", "17:45", "17:30", "18:10", "17:00", "17:50", "17:20", "18:05", "16:48", "17:38"];

const calcHours = (login: string, logout: string) => {
  const [lh, lm] = login.split(":").map(Number);
  const [oh, om] = logout.split(":").map(Number);
  const diff = (oh * 60 + om) - (lh * 60 + lm);
  return `${Math.floor(diff / 60)}h ${diff % 60}m`;
};

const calcMinutes = (login: string, logout: string) => {
  const [lh, lm] = login.split(":").map(Number);
  const [oh, om] = logout.split(":").map(Number);
  return (oh * 60 + om) - (lh * 60 + lm);
};

const TODAY_REF = new Date();
const STATUSES_CYCLE = ["Present", "Present", "Present", "Late", "Absent", "Present", "Present"];

const buildAttendanceMap = () => {
  const map: Record<string, { status: string; login: string | null; logout: string | null; hours: string | null; minutes: number | null }> = {};
  const now = new Date();

  // Generate for the entire current year
  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear(), 11, 31);

  let workIdx = 0;
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    // Compare dates without time for accurate 'Future' marking
    const dCopy = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const todayCopy = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (dCopy > todayCopy) {
      map[key] = { status: "Future", login: null, logout: null, hours: null, minutes: null };
    } else {
      const dow = d.getDay();
      if (dow === 0) { // Sunday only
        map[key] = { status: "Weekend", login: null, logout: null, hours: null, minutes: null };
      } else {
        const status = STATUSES_CYCLE[workIdx % STATUSES_CYCLE.length];
        const li = workIdx % LOGIN_TIMES.length;
        const login = status === "Absent" ? null : LOGIN_TIMES[li];
        const logout = status === "Absent" ? null : LOGOUT_TIMES[li];
        map[key] = {
          status,
          login,
          logout,
          hours: login && logout ? calcHours(login, logout) : null,
          minutes: login && logout ? calcMinutes(login, logout) : null,
        };
        workIdx++;
      }
    }
  }
  return map;
};
const ATTENDANCE_MAP = buildAttendanceMap();

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
const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

  const handleAddTask = (e: React.FormEvent, assignees: number[], priority = "Normal") => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setObjectives(prev => [...prev, {
      id: Date.now(), title: newTitle, description: "Quickly added task",
      category: "Personal", priority, completed: false,
      dueDate: "Today", progress: 0, assignees, commentList: [],
    }]);
    setNewTitle("");
    setIsAdding(false);
  };

  return (
    <div className="pb-16 w-full px-4 md:px-10 min-h-screen">

      {/* Back */}
      <div className="flex items-center justify-start py-8">
        <button onClick={onBack}
          className="flex items-center gap-2 text-[13px] font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors group">
          <ArrowLeft weight="bold" size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col items-center justify-center space-y-6 mb-7 animate-in fade-in slide-in-from-top-4 duration-700">
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

      {/* Horizontal tab bar */}
      <div className="flex items-center justify-center mb-6 animate-in fade-in duration-1000">
        <div className="flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1.5 rounded-2xl shadow-sm">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-xl text-[13px] font-bold transition-all",
                activeTab === tab.id
                  ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-md"
                  : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
              )}>
              <tab.icon weight={activeTab === tab.id ? "fill" : "bold"} size={15} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === "Objectives" && (
          <ObjectivesView key="objectives" objectives={objectives} onToggle={toggleObjective} onDelete={deleteObjective}
            isAdding={isAdding} setIsAdding={setIsAdding} newTitle={newTitle} setNewTitle={setNewTitle} onAdd={handleAddTask} />
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
// ATTENDANCE VIEW  —  Email-client split-pane layout
// ─────────────────────────────────────────────────────────────────────────────
function AttendanceView() {
  const todayRef = TODAY_REF;
  const [currentTime, setCurrentTime] = useState(new Date());

  /* ── clock ── */
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  /* ── navigation ── */
  const minDate = new Date(todayRef); minDate.setMonth(minDate.getMonth() - 3); minDate.setDate(1);
  const maxDate = new Date(todayRef); maxDate.setMonth(maxDate.getMonth() + 3); maxDate.setDate(1);

  const [year, setYear] = useState(todayRef.getFullYear());
  const [month, setMonth] = useState(todayRef.getMonth());

  const canPrev = new Date(year, month - 1, 1) >= minDate;
  const canNext = new Date(year, month + 1, 1) <= maxDate;

  function prevMonth() {
    const d = new Date(year, month - 1, 1);
    if (d >= minDate) { setYear(d.getFullYear()); setMonth(d.getMonth()); setSelectedKey(null); }
  }
  function nextMonth() {
    const d = new Date(year, month + 1, 1);
    if (d <= maxDate) { setYear(d.getFullYear()); setMonth(d.getMonth()); setSelectedKey(null); }
  }

  /* ── selection + filter ── */
  const todayKey = `${todayRef.getFullYear()}-${String(todayRef.getMonth() + 1).padStart(2, "0")}-${String(todayRef.getDate()).padStart(2, "0")}`;
  const [selectedKey, setSelectedKey] = useState<string | null>(todayKey);
  const [filter, setFilter] = useState<"All" | "Present" | "Late" | "Absent" | "Holiday">("All");
  const reqWorkMin = 480; // 8 hours standard

  /* ── leave modal ── */
  const [showLeave, setShowLeave] = useState(false);
  const [leaveType, setLeaveType] = useState("Casual Leave");
  const [leaveRange, setLeaveRange] = useState<DateRange | undefined>(undefined);
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const [showDayDetails, setShowDayDetails] = useState(false);
  const [leaveApps, setLeaveApps] = useState([
    { id: 101, type: "Earned Leave", from: new Date(2026, 3, 5), to: new Date(2026, 3, 7), status: "Approved", response: "Approved by Admin", date: "2 Apr" },
    { id: 102, type: "Sick Leave", from: new Date(2026, 3, 10), to: new Date(2026, 3, 10), status: "Rejected", response: "Documentation required", date: "8 Apr" },
    { id: 103, type: "Casual Leave", from: new Date(2026, 3, 15), to: new Date(2026, 3, 16), status: "Pending", response: "Under review", date: "10 Apr" },
  ]);

  const LEAVE_TYPES = ["Sick Leave", "Casual Leave", "Emergency Leave", "Earned Leave", "Maternity/Paternity"];
  const LEAVE_BALANCES: Record<string, { total: number; used: number }> = {
    "Sick Leave": { total: 8, used: 1 },
    "Casual Leave": { total: 12, used: 3 },
    "Emergency Leave": { total: 3, used: 0 },
    "Earned Leave": { total: 5, used: 2 },
    "Maternity/Paternity": { total: 90, used: 0 },
  };

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveRange?.from || !leaveRange?.to) return;
    setLeaveSubmitted(true);

    const newApp = {
      id: Date.now(),
      type: leaveType,
      from: leaveRange.from,
      to: leaveRange.to,
      status: "Pending",
      response: "Awaiting review",
      date: format(new Date(), "d MMM")
    };

    setTimeout(() => {
      setLeaveApps(prev => [newApp, ...prev]);
      setShowLeave(false);
      setLeaveSubmitted(false);
      setLeaveRange(undefined);
      setLeaveReason("");
      setLeaveType("Casual Leave");
    }, 1800);
  };

  /* ── monthly stats ── */
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dateKey = (y: number, m: number, d: number) =>
    `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const monthStats = useMemo(() => {
    let present = 0, late = 0, absent = 0, totalMin = 0, workedDays = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const rec = ATTENDANCE_MAP[dateKey(year, month, d)];
      if (!rec || rec.status === "Future" || rec.status === "Weekend") continue;
      if (rec.status === "Present") present++;
      if (rec.status === "Late") late++;
      if (rec.status === "Absent") absent++;
      if (rec.minutes) { totalMin += rec.minutes; workedDays++; }
    }
    const working = present + late + absent;
    const rate = working > 0 ? Math.round(((present + late) / working) * 100) : 0;
    const avgMin = workedDays > 0 ? Math.round(totalMin / workedDays) : 0;
    return { present, late, absent, rate, avgH: Math.floor(avgMin / 60), avgM: avgMin % 60, working };
  }, [year, month, daysInMonth]);

  /* ── list of days for the left pane ── */
  const dayList = useMemo(() => {
    const rows: { key: string; day: number; dow: string; rec: typeof ATTENDANCE_MAP[string]; holiday: string | null }[] = [];
    const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let d = daysInMonth; d >= 1; d--) {
      const k = dateKey(year, month, d);
      const rec = ATTENDANCE_MAP[k];
      if (!rec) continue;
      // apply filter
      if (filter === "Holiday" && !HOLIDAYS[k]) continue;
      if (filter === "Present" && rec.status !== "Present") continue;
      if (filter === "Late" && rec.status !== "Late") continue;
      if (filter === "Absent" && rec.status !== "Absent") continue;
      if (filter === "All" && (rec.status === "Weekend" || rec.status === "Future")) continue;
      rows.push({ key: k, day: d, dow: DOW[new Date(year, month, d).getDay()], rec, holiday: HOLIDAYS[k] ?? null });
    }
    return rows;
  }, [year, month, daysInMonth, filter]);

  const selectedRec = selectedKey ? ATTENDANCE_MAP[selectedKey] : null;
  const selectedDay = selectedKey ? parseInt(selectedKey.split("-")[2]) : null;
  const selectedHoliday = selectedKey ? HOLIDAYS[selectedKey] ?? null : null;

  /* ── mini calendar for detail pane ── */
  /* ── Kokonut Calendar Grid Logic ── */
  const firstDayIdx = (new Date(year, month, 1).getDay() + 6) % 7; // Monday-indexed for CalendarPage style
  const totalCells = Math.ceil((firstDayIdx + daysInMonth) / 7) * 7;

  /* ── status helpers ── */
  const STATUS_COLOR: Record<string, string> = {
    Present: "bg-emerald-500",
    Late: "bg-amber-400",
    Absent: "bg-rose-500",
    Holiday: "bg-blue-400",
  };
  const STATUS_BADGE: Record<string, string> = {
    Present: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
    Late: "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
    Absent: "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800",
    Future: "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-zinc-200 dark:border-zinc-700",
    Weekend: "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-zinc-200 dark:border-zinc-700",
  };
  const STATUS_AVATAR_BG: Record<string, string> = {
    Present: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
    Late: "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400",
    Absent: "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400",
    Future: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500",
    Weekend: "bg-zinc-100 dark:bg-zinc-800 text-zinc-400",
    Holiday: "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      className="pb-5">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <h2 className="text-[22px] font-black text-zinc-950 dark:text-white tracking-tight leading-none">Attendance</h2>
            <p className="text-[12px] font-bold text-zinc-400 mt-1.5 uppercase tracking-widest">Digital Registry 2026</p>
          </div>

          <div className="h-10 w-px bg-zinc-100 dark:bg-zinc-800 hidden md:block" />

          <div className="items-center gap-4 hidden md:flex">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-zinc-300 dark:text-zinc-600 uppercase tracking-[0.2em]">Real-time Status</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[14px] font-black text-zinc-600 dark:text-zinc-300 tabular-nums">
                  {format(currentTime, "HH:mm:ss")}
                </span>
              </div>
            </div>
            <button
              onClick={() => { setYear(todayRef.getFullYear()); setMonth(todayRef.getMonth()); setSelectedKey(todayKey); }}
              className="px-4 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-black text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-all shadow-sm">
              Jump to Today
            </button>
          </div>
        </div>
      </div>

      {/* ── Attendance Layout Container ── */}
      <div className="max-w-[1400px] mx-auto w-full animate-in fade-in duration-1000">

        {/* ── Main Dashboard Shell ── */}
        <div className="flex flex-col bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden mb-12">

          {/* Shell Top: Filter sub-bar */}
          <div className="flex items-center gap-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0 h-16 px-8 bg-zinc-50/40 dark:bg-zinc-900">
            <div className="flex items-center gap-1.5 flex-1">
              <div className="flex items-center gap-1 p-1 bg-zinc-100/50 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50 rounded-2xl">
                {[
                  { id: "All", label: "All", icon: SquaresFour, color: "zinc" },
                  { id: "Present", label: "Present", icon: CheckCircle, color: "emerald" },
                  { id: "Late", label: "Late", icon: Clock, color: "amber" },
                  { id: "Absent", label: "Absent", icon: XCircle, color: "rose" },
                  { id: "Holiday", label: "Holiday", icon: Flag, color: "blue" },
                ].map(f => (
                  <button key={f.id} onClick={() => setFilter(f.id as any)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black transition-all",
                      filter === f.id ? (
                        f.color === "zinc" ? "bg-white dark:bg-zinc-700 text-zinc-950 dark:text-white shadow-sm" :
                          f.color === "emerald" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" :
                            f.color === "amber" ? "bg-amber-400 text-amber-950 shadow-lg shadow-amber-400/20" :
                              f.color === "rose" ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" :
                                "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                      ) : (
                        "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                      )
                    )}>
                    <f.icon size={14} weight={filter === f.id ? "fill" : "bold"} />
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Leave Application Log Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="relative w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all group">
                    <ChatDots weight="bold" size={16} />
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white dark:border-zinc-950 rounded-full" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl bg-white dark:bg-zinc-950 overflow-hidden" align="end">
                  <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <p className="text-[13px] font-black text-zinc-900 dark:text-white">Leave Application Log</p>
                    <p className="text-[11px] font-bold text-zinc-400 mt-0.5">Track your recent requests</p>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto p-2 space-y-1">
                    {leaveApps.map(app => (
                      <div key={app.id} className="p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800">
                        <div className="flex items-start justify-between mb-1.5">
                          <span className="text-[12px] font-black text-zinc-900 dark:text-white">{app.type}</span>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider",
                            app.status === "Approved" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" :
                            app.status === "Rejected" ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" :
                            "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                          )}>
                            {app.status}
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-zinc-400">
                          {format(app.from, "d MMM")} — {format(app.to, "d MMM yyyy")}
                        </p>
                        <div className="mt-2 p-2 rounded-lg bg-zinc-50/50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                           <p className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
                             "{app.response}"
                           </p>
                        </div>
                        <div className="flex items-center justify-between mt-2.5 px-0.5">
                           <span className="text-[10px] font-bold text-zinc-300 dark:text-zinc-600 uppercase tracking-widest">{app.date}</span>
                           {app.status === "Approved" && (
                             <button className="text-[10px] font-black text-blue-600 dark:text-blue-400 hover:underline">Download Form</button>
                           )}
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Month navigation (CalendarPage Style) */}
              <div className="flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-0.5">
                <button onClick={prevMonth} disabled={!canPrev} className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 transition-colors disabled:opacity-30">
                  <CaretLeft size={16} weight="bold" />
                </button>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 px-3 min-w-[110px] text-center">{MONTH_NAMES[month]} {year}</span>
                <button onClick={nextMonth} disabled={!canNext} className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 transition-colors disabled:opacity-30">
                  <CaretRight size={16} weight="bold" />
                </button>
              </div>

              <button onClick={() => setShowLeave(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-md text-xs font-semibold shadow-md shadow-zinc-200/50 dark:shadow-none transition-all hover:scale-[1.03] active:scale-[0.97]">
                <Plus size={14} weight="bold" />
                Request Leave
              </button>
            </div>
          </div>

          <div className="p-0">
            {/* ── Day Labels (CalendarPage Header Style) ── */}
            <div className="grid grid-cols-7 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                <div key={i} className="py-3 text-center text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest border-r border-zinc-100 dark:border-zinc-800 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            {/* ── Grid Grid (CalendarPage Cell Style) ── */}
            <div className="grid grid-cols-7">
              {Array.from({ length: totalCells }).map((_, idx) => {
                const dayNum = idx - firstDayIdx + 1;
                const inMonth = dayNum >= 1 && dayNum <= daysInMonth;
                const k = inMonth ? dateKey(year, month, dayNum) : null;
                const rec = k ? ATTENDANCE_MAP[k] : null;
                const isSel = k === selectedKey;
                const isToday = k === todayKey;
                const hol = k ? HOLIDAYS[k] : null;

                const matchesFilter = filter === "All" ||
                  (filter === "Present" && rec?.status === "Present") ||
                  (filter === "Late" && rec?.status === "Late") ||
                  (filter === "Absent" && rec?.status === "Absent") ||
                  (filter === "Holiday" && hol);

                const showStatus = rec && rec.status !== "Weekend" && rec.status !== "Future" && matchesFilter;

                return (
                  <div key={idx}
                    onClick={() => {
                      if (!inMonth || !k) return;
                      // Only allow opening past or current days
                      if (k > todayKey) return;
                      setSelectedKey(k);
                      setShowDayDetails(true);
                    }}
                    className={cn(
                      "min-h-[100px] border-b border-r border-zinc-100 dark:border-zinc-800 last:border-r-0 p-2 transition-all relative group cursor-pointer",
                      !inMonth && "bg-zinc-50/30 dark:bg-zinc-900/10 grayscale opacity-40",
                      inMonth && k && k > todayKey && "cursor-default opacity-60", // Visual hint for future
                      inMonth && k && k <= todayKey && "hover:bg-zinc-50/80 dark:hover:bg-zinc-900/30",
                      isToday && "bg-blue-50/40 dark:bg-blue-900/10"
                    )}>

                    {/* Day number (Top Right Circle) */}
                    <div className="flex justify-end mb-2">
                      <span className={cn(
                        "w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold transition-colors",
                        !inMonth && "text-zinc-300 dark:text-zinc-700",
                        inMonth && !isToday && "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100",
                        isToday && "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900",
                      )}>
                        {inMonth ? dayNum : (dayNum <= 0 ? (new Date(year, month, 0).getDate() + dayNum) : (dayNum - daysInMonth))}
                      </span>
                    </div>

                    {/* Cell Content (Event Pill Style) */}
                    {inMonth && (
                      <div className="flex flex-col gap-0.5">
                        {hol && (
                          <div className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50 truncate animate-in zoom-in-95">
                            <Flag size={10} weight="fill" className="shrink-0" />
                            <span className="truncate">{hol}</span>
                          </div>
                        )}
                        {showStatus && (
                          <div className={cn(
                            "flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium transition-all truncate border border-transparent shadow-sm",
                            rec.status === "Present" ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-l-2 border-l-emerald-400" :
                              rec.status === "Late" ? "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-l-2 border-l-amber-400" :
                                "bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-l-2 border-l-rose-400"
                          )}>
                            <span className={cn("w-1.5 h-1.5 rounded-full shrink-0",
                              rec.status === "Present" ? "bg-emerald-500" :
                                rec.status === "Late" ? "bg-amber-500" : "bg-rose-500"
                            )} />
                            <span className="truncate">{rec.status}</span>
                            {rec.login && <span className="shrink-0 opacity-50 ml-auto">{rec.login}</span>}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Day Details Modal ── */}
      <AnimatePresence>
        {showDayDetails && selectedKey && selectedRec && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) setShowDayDetails(false); }}>
            <motion.div initial={{ opacity: 0, scale: 0.93, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              className="bg-white rounded-[2rem] shadow-2xl border border-zinc-200 w-full max-w-sm overflow-hidden p-0">

              <div className="flex flex-col animate-in fade-in duration-500">
                {/* Header Card */}
                <div className="p-6 pb-2 relative overflow-hidden group">
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <h4 className="text-[20px] font-black text-zinc-950 tracking-tighter">
                        {selectedDay} {MONTH_NAMES[month]}
                      </h4>
                      <p className="text-[14px] font-bold text-zinc-400">
                        {format(new Date(selectedKey), "EEEE")} · {selectedKey === todayKey ? "Today" : "Archive"}
                      </p>
                    </div>
                    <button onClick={() => setShowDayDetails(false)}
                      className="w-10 h-10 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-400 hover:bg-zinc-50 transition-all">
                      <svg viewBox="0 0 256 256" className="w-4 h-4 fill-current">
                        <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="px-6 pb-6 flex flex-col gap-4">
                  {/* Biometric Status Area */}
                  {selectedRec.login ? (
                    <>
                      <div className="p-5 rounded-[1.5rem] bg-white border border-zinc-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <Clock weight="fill" size={16} className="text-zinc-400" />
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Activity Report</span>
                          </div>
                          <div className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-zinc-100",
                            selectedRec.status === "Present" ? "text-emerald-600" :
                              selectedRec.status === "Late" ? "text-amber-600" : "text-rose-600"
                          )}>
                            {selectedRec.status}
                          </div>
                        </div>
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-[32px] font-black text-zinc-900 leading-none tracking-tighter tabular-nums">{selectedRec.hours || "--:--"}</p>
                            <p className="text-[11px] font-bold text-zinc-400 mt-1.5">Net logged time today</p>
                          </div>
                        </div>
                      </div>

                      {/* Timeline List */}
                      <div className="flex flex-col gap-3">
                        {[
                          { label: "Check-in", time: selectedRec.login, icon: <ArrowDown size={14} />, color: "text-emerald-600 bg-emerald-50" },
                          { label: "Check-out", time: selectedRec.logout, icon: <ArrowUp size={14} />, color: "text-rose-600 bg-rose-50" },
                        ].map((item, i) => (
                          <div key={i} className="p-3 bg-white rounded-xl border border-zinc-100 flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", item.color)}>
                                {item.icon}
                              </div>
                              <div>
                                <p className="text-[14px] font-black text-zinc-900 dark:text-white leading-tight">{item.label}</p>
                                <p className="text-[11px] font-bold text-zinc-400">Biometric Scan</p>
                              </div>
                            </div>
                            <span className="text-[15px] font-black text-zinc-900 dark:text-white tabular-nums">{item.time}</span>
                          </div>
                        ))}
                      </div>

                      {/* Progress bar */}
                      <div className="p-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden h-2.5 mt-2">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((selectedRec.minutes! / reqWorkMin) * 100, 100)}%` }}
                          className={cn("h-full rounded-full",
                            selectedRec.minutes! >= reqWorkMin ? "bg-emerald-500" : "bg-rose-500"
                          )} />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-[2rem] border border-zinc-100 text-center">
                      <Clock size={32} weight="bold" className="text-zinc-200 mb-4" />
                      <h5 className="text-[15px] font-black text-zinc-950">Day Empty</h5>
                      <p className="text-[12px] font-bold text-zinc-400 mt-2 leading-relaxed">No biometric records found for this entry.</p>
                    </div>
                  )}

                  {selectedHoliday && (
                    <div className="p-5 rounded-[1.5rem] bg-white border border-zinc-100 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-sm">
                        <Flag weight="fill" size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Public Holiday</p>
                        <p className="text-[15px] font-black text-zinc-900 tracking-tight">{selectedHoliday}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Leave Request Modal ── */}
      <AnimatePresence>
        {showLeave && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) setShowLeave(false); }}>
            <motion.div initial={{ opacity: 0, scale: 0.93, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-lg overflow-hidden">

              {/* Modal top-bar */}
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-zinc-950 dark:bg-white flex items-center justify-center">
                    <CalendarCheck weight="fill" size={14} className="text-white dark:text-zinc-950" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-black text-zinc-900 dark:text-white leading-none">Request Leave</h3>
                    <p className="text-[11px] font-bold text-zinc-400 mt-0.5">{MONTH_NAMES[month]} {year}</p>
                  </div>
                </div>
                <button onClick={() => setShowLeave(false)}
                  className="w-7 h-7 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
                  <svg viewBox="0 0 256 256" className="w-3 h-3 fill-current"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" /></svg>
                </button>
              </div>

              <div className="p-6 max-h-[80vh] overflow-y-auto">
                <AnimatePresence mode="wait">
                  {leaveSubmitted ? (
                    <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-10 gap-4">
                      <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Check weight="bold" size={28} className="text-white" />
                      </div>
                      <div className="text-center">
                        <p className="text-[15px] font-black text-zinc-900 dark:text-white">Request submitted!</p>
                        <p className="text-[12px] font-bold text-zinc-400 mt-1">Your manager will be notified.</p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form key="form" onSubmit={handleLeaveSubmit} className="space-y-5">

                      {/* Leave type grid */}
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2.5">Leave type</p>
                        <div className="grid grid-cols-3 gap-2">
                          {LEAVE_TYPES.slice(0, 3).map(t => {
                            const bal = LEAVE_BALANCES[t];
                            return (
                              <button key={t} type="button" onClick={() => setLeaveType(t)}
                                className={cn(
                                  "flex flex-col items-center gap-1 p-3 rounded-2xl border text-center transition-all",
                                  leaveType === t
                                    ? "bg-zinc-950 dark:bg-white border-zinc-950 dark:border-white"
                                    : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"
                                )}>
                                <span className={cn("text-[12px] font-black", leaveType === t ? "text-white dark:text-zinc-950" : "text-zinc-700 dark:text-zinc-300")}>
                                  {t.replace(" Leave", "").replace("Emergency", "Emerg.")}
                                </span>
                                <span className={cn("text-[10px] font-bold", leaveType === t ? "text-zinc-400 dark:text-zinc-600" : "text-zinc-400")}>
                                  {bal.total - bal.used} left
                                </span>
                              </button>
                            );
                          })}
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {LEAVE_TYPES.slice(3).map(t => {
                            const bal = LEAVE_BALANCES[t];
                            return (
                              <button key={t} type="button" onClick={() => setLeaveType(t)}
                                className={cn(
                                  "flex flex-col items-center gap-1 p-3 rounded-2xl border text-center transition-all",
                                  leaveType === t
                                    ? "bg-zinc-950 dark:bg-white border-zinc-950 dark:border-white"
                                    : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"
                                )}>
                                <span className={cn("text-[12px] font-black", leaveType === t ? "text-white dark:text-zinc-950" : "text-zinc-700 dark:text-zinc-300")}>
                                  {t}
                                </span>
                                <span className={cn("text-[10px] font-bold", leaveType === t ? "text-zinc-400 dark:text-zinc-600" : "text-zinc-400")}>
                                  {bal.total - bal.used} left
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Date range picker */}
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2.5">Date range</p>
                        <Popover open={calOpen} onOpenChange={setCalOpen}>
                          <PopoverTrigger asChild>
                            <button type="button"
                              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-[13px] font-black text-left transition-all hover:border-zinc-400">
                              <span className={leaveRange?.from ? "text-zinc-900 dark:text-white" : "text-zinc-400"}>
                                {leaveRange?.from && leaveRange?.to
                                  ? `${format(leaveRange.from, "dd MMM")} → ${format(leaveRange.to, "dd MMM yyyy")}`
                                  : "Select date range"}
                              </span>
                              <CalendarCheck weight="bold" size={14} className="text-zinc-400" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 rounded-2xl overflow-hidden" align="start">
                            <Calendar mode="range" selected={leaveRange} onSelect={setLeaveRange} numberOfMonths={1}
                              className="rounded-2xl border-0" />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* Live summary */}
                      {leaveRange?.from && leaveRange?.to && (() => {
                        let workDays = 0;
                        const cur = new Date(leaveRange.from);
                        while (cur <= leaveRange.to) {
                          if (cur.getDay() !== 0 && cur.getDay() !== 6) workDays++;
                          cur.setDate(cur.getDate() + 1);
                        }
                        const bal = LEAVE_BALANCES[leaveType];
                        const remaining = bal.total - bal.used - workDays;
                        return (
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { label: "Days requested", value: workDays, color: "text-zinc-900 dark:text-white" },
                              { label: "Type balance", value: bal.total - bal.used, color: "text-zinc-900 dark:text-white" },
                              { label: "After approval", value: remaining, color: remaining >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400" },
                            ].map(s => (
                              <div key={s.label} className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-3 text-center">
                                <p className={cn("text-[18px] font-black leading-none", s.color)}>{s.value}</p>
                                <p className="text-[10px] font-bold text-zinc-400 mt-1 leading-tight">{s.label}</p>
                              </div>
                            ))}
                          </div>
                        );
                      })()}

                      {/* Reason */}
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                          Reason <span className="text-zinc-300 dark:text-zinc-600 normal-case font-bold tracking-normal">(optional)</span>
                        </p>
                        <textarea value={leaveReason} onChange={e => setLeaveReason(e.target.value)} rows={3}
                          placeholder="Briefly describe the reason for leave…"
                          className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-[13px] font-medium text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none resize-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors" />
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-1">
                        <button type="button" onClick={() => setShowLeave(false)}
                          className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 text-[13px] font-black hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">
                          Cancel
                        </button>
                        <button type="submit" disabled={!leaveRange?.from || !leaveRange?.to}
                          className="flex-1 py-2.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-[13px] font-black shadow hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none">
                          Submit Request
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
    return { percentage: total > 0 ? Math.round((completedCount / total) * 100) : 0, completedCount, total };
  }, [objectives]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10 pb-20">
      <div className="flex items-center justify-between px-2">
        <div className="space-y-1">
          <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight leading-none">
            To-do <span className="text-zinc-400 ml-1">{stats.total}</span>
          </h3>
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

      <div className="flex items-center gap-1.5 p-1 bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl w-fit">
        {["All", "Pending", "Completed"].map(tab => (
          <button key={tab} onClick={() => setFilterTab(tab)}
            className={cn("px-5 py-1.5 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all",
              filterTab === tab ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm" : "text-zinc-400 hover:text-zinc-600"
            )}>
            {tab}
          </button>
        ))}
      </div>

      <div className="min-h-[400px] space-y-6">
        {isAdding && (
          <AddTaskForm newTitle={newTitle} setNewTitle={setNewTitle} onAdd={onAdd} onCancel={() => setIsAdding(false)} />
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
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<{ id: number; userId: number; text: string; time: string }[]>(obj.commentList ?? []);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    const text = newComment.trim();
    if (!text) return;
    setComments(prev => [...prev, { id: Date.now(), userId: 1, text, time: "Just now" }]);
    setNewComment("");
  };

  const assignedUsers = (obj.assignees ?? []).map((id: number) => TEAM_USERS.find(u => u.id === id)).filter(Boolean);

  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={cn("group bg-white dark:bg-zinc-900 rounded-[28px] border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all relative overflow-hidden", obj.completed && "opacity-60")}>
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase tracking-widest border border-zinc-100 dark:border-zinc-700">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" /> To do
            </div>
            <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border", {
              "Normal": "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/50",
              "High": "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800/50",
              "Urgent": "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-800/50",
            }[obj.priority as string] ?? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/50")}>
              <Flag weight="fill" size={10} /> {obj.priority}
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onToggle(obj.id)}
              className={cn("w-7 h-7 rounded-lg flex items-center justify-center transition-all",
                obj.completed ? "bg-emerald-500 text-white" : "bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:text-emerald-500")}>
              <Check weight="bold" size={13} />
            </button>
            <button onClick={() => onDelete(obj.id)}
              className="w-7 h-7 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-rose-500 transition-all">
              <Trash weight="bold" size={13} />
            </button>
          </div>
        </div>

        <div className="space-y-1 mb-4">
          <h4 className={cn("text-[16px] font-black text-zinc-950 dark:text-white tracking-tight leading-tight", obj.completed && "line-through text-zinc-400 dark:text-zinc-600")}>
            {obj.title}
          </h4>
          <p className="text-[12px] font-bold text-zinc-400 flex items-start gap-1">
            <span className="text-zinc-300 dark:text-zinc-700">↳</span>{obj.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-zinc-50 dark:border-zinc-800/50">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-1.5">
              {assignedUsers.slice(0, 4).map((u: any) => (
                <div key={u.id} title={u.name} className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-900 overflow-hidden shrink-0">
                  <img src={u.avatar} className="w-full h-full object-cover" />
                </div>
              ))}
              {assignedUsers.length > 4 && (
                <div className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-[9px] font-black text-zinc-600 dark:text-zinc-300">
                  +{assignedUsers.length - 4}
                </div>
              )}
            </div>
            <button onClick={() => setShowComments(p => !p)}
              className={cn("flex items-center gap-1 text-[11px] font-black transition-colors",
                showComments ? "text-zinc-900 dark:text-white" : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300")}>
              <ChatDots size={14} weight="bold" /> {comments.length}
            </button>
            <div className={cn("flex items-center gap-1 text-[11px] font-black",
              obj.dueDate === "Tomorrow" ? "text-orange-500" : "text-zinc-400 dark:text-zinc-600")}>
              <Clock size={13} weight="bold" /> {obj.dueDate}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="relative w-5 h-5">
              <svg className="w-5 h-5 -rotate-90">
                <circle cx="10" cy="10" r="8" className="stroke-zinc-100 dark:stroke-zinc-800" strokeWidth="2.5" fill="none" />
                <motion.circle initial={{ pathLength: 0 }} animate={{ pathLength: obj.progress / 100 }}
                  cx="10" cy="10" r="8"
                  className={cn(obj.progress === 100 ? "stroke-emerald-500" : "stroke-zinc-300 dark:stroke-zinc-500")}
                  strokeWidth="2.5" fill="none" strokeDasharray="50 50" />
              </svg>
            </div>
            <span className="text-[11px] font-black text-zinc-900 dark:text-white">{obj.progress}%</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/40 px-4 pt-3 pb-3 space-y-3">
              {comments.length === 0 && (
                <p className="text-[11px] font-bold text-zinc-400 text-center py-2">No comments yet. Be the first!</p>
              )}
              {comments.map(c => {
                const user = TEAM_USERS.find(u => u.id === c.userId);
                return (
                  <div key={c.id} className="flex gap-2 items-start">
                    <img src={user?.avatar ?? "https://i.pravatar.cc/100"} className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5 border border-white dark:border-zinc-700" />
                    <div className="flex-1 bg-white dark:bg-zinc-900 rounded-2xl rounded-tl-sm px-3 py-2 border border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[11px] font-black text-zinc-900 dark:text-white">{user?.name ?? "Unknown"}</span>
                        <span className="text-[10px] font-bold text-zinc-400">{c.time}</span>
                      </div>
                      <p className="text-[12px] font-medium text-zinc-600 dark:text-zinc-300 leading-snug">{c.text}</p>
                    </div>
                  </div>
                );
              })}
              <div className="flex gap-2 items-center">
                <img src={TEAM_USERS[0].avatar} className="w-6 h-6 rounded-full object-cover shrink-0 border border-white dark:border-zinc-700" />
                <div className="flex-1 flex items-center gap-2 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 px-3 py-1.5">
                  <input value={newComment} onChange={e => setNewComment(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddComment(); } }}
                    placeholder="Add a comment…"
                    className="flex-1 bg-transparent text-[12px] font-medium text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none" />
                  <button type="button" onClick={handleAddComment}
                    className="w-6 h-6 rounded-full bg-zinc-950 dark:bg-white flex items-center justify-center shrink-0 hover:scale-110 active:scale-95 transition-all">
                    <svg viewBox="0 0 256 256" className="w-3 h-3 fill-white dark:fill-zinc-950"><path d="M228.1,26.6a21.1,21.1,0,0,0-21.1,0L31.6,133.8A21,21,0,0,0,33.3,172l57.6,18.9L114,240a21,21,0,0,0,39.6-2.4Z" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADD TASK FORM
// ─────────────────────────────────────────────────────────────────────────────
function AddTaskForm({ newTitle, setNewTitle, onAdd, onCancel }: any) {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([1]);
  const [priority, setPriority] = useState<"Normal" | "High" | "Urgent">("Normal");

  const toggleUser = (id: number) =>
    setSelectedUsers(prev => prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.97, y: -6 }} animate={{ opacity: 1, scale: 1, y: 0 }}
      className="bg-white dark:bg-zinc-900 rounded-3xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 overflow-hidden">
      <form onSubmit={e => onAdd(e, selectedUsers, priority)} className="p-5 space-y-4">
        <input autoFocus
          className="w-full bg-transparent text-[17px] font-black text-zinc-950 dark:text-white outline-none placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
          placeholder="What needs to be done?" value={newTitle} onChange={e => setNewTitle(e.target.value)} />

        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Priority</p>
          <div className="flex gap-2">
            {([
              { label: "Normal", dot: "bg-blue-400", active: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700" },
              { label: "High", dot: "bg-rose-400", active: "bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-700" },
              { label: "Urgent", dot: "bg-orange-400", active: "bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700" },
            ] as const).map(p => (
              <button key={p.label} type="button" onClick={() => setPriority(p.label)}
                className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black border transition-all",
                  priority === p.label ? p.active : "bg-zinc-50 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"
                )}>
                <span className={cn("w-1.5 h-1.5 rounded-full", p.dot)} />{p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Assign to</p>
          <div className="flex flex-wrap gap-2">
            {TEAM_USERS.map(u => {
              const sel = selectedUsers.includes(u.id);
              return (
                <button key={u.id} type="button" onClick={() => toggleUser(u.id)}
                  className={cn("flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full text-[11px] font-black border transition-all",
                    sel ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white"
                      : "bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"
                  )}>
                  <img src={u.avatar} className="w-4 h-4 rounded-full object-cover" />
                  {u.name.split(" ")[0]}
                  {sel && <Check weight="bold" size={9} className="ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <p className="text-[11px] font-bold text-zinc-400">
            {selectedUsers.length} assignee{selectedUsers.length !== 1 ? "s" : ""} · <span className="font-black text-zinc-600 dark:text-zinc-300">{priority}</span>
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={onCancel}
              className="px-4 py-2 rounded-xl text-zinc-500 text-[12px] font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">Cancel</button>
            <button type="submit"
              className="px-5 py-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-[12px] font-black shadow hover:scale-105 active:scale-95 transition-all">
              Create Task
            </button>
          </div>
        </div>
      </form>
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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      className="bg-white dark:bg-zinc-900 rounded-[42px] border border-zinc-200 dark:border-zinc-800 shadow-sm p-12">
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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      className="flex flex-col items-center justify-center py-32 space-y-4 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
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