/**
 * Profile Page – Centered header (original), right-side vertical tab rail, Attendance tab
 */
import { useState, useMemo } from "react";
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
const TEAM_USERS = [
  { id: 1, name: "Clara Lefèvre",   avatar: "https://i.pravatar.cc/100?u=clara" },
  { id: 2, name: "James Okafor",    avatar: "https://i.pravatar.cc/100?u=james" },
  { id: 3, name: "Priya Nair",      avatar: "https://i.pravatar.cc/100?u=priya" },
  { id: 4, name: "Lucas Meyer",     avatar: "https://i.pravatar.cc/100?u=lucas" },
  { id: 5, name: "Amina Diallo",    avatar: "https://i.pravatar.cc/100?u=amina" },
  { id: 6, name: "Ravi Shankar",    avatar: "https://i.pravatar.cc/100?u=ravi"  },
];

const INITIAL_OBJECTIVES = [
  { id: 1, title: "Review Website Design 2.0", description: "C-level review phase", category: "Website", priority: "High", completed: false, dueDate: "Tomorrow", progress: 20,
    assignees: [1, 2, 3],
    commentList: [
      { id: 1, userId: 2, text: "Designs look great, just need minor alignment fixes.", time: "2h ago" },
      { id: 2, userId: 3, text: "Will review the export flow by tomorrow.", time: "5h ago" },
    ] },
  { id: 2, title: "Review React Components", description: "New react components code review", category: "Dashboard", priority: "Normal", completed: false, dueDate: "25 April", progress: 0,
    assignees: [1, 4],
    commentList: [
      { id: 1, userId: 4, text: "Found a bug in the DatePicker component.", time: "1d ago" },
    ] },
  { id: 3, title: "Mentor 3 junior designers", description: "Bi-weekly sync and portfolio review", category: "Team", priority: "Normal", completed: true, dueDate: "Completed", progress: 100,
    assignees: [1, 5, 6],
    commentList: [
      { id: 1, userId: 5, text: "Session was super helpful, thanks Clara!", time: "3d ago" },
      { id: 2, userId: 6, text: "Portfolio review done ✅", time: "2d ago" },
    ] },
  { id: 4, title: "High-Resolution Analytics Dashboard", description: "Finalize SVG charting logic", category: "Clinical", priority: "High", completed: false, dueDate: "Monday", progress: 45,
    assignees: [1, 2],
    commentList: [] },
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

  const handleAddTask = (e: React.FormEvent, assignees: number[], priority: string = "Normal") => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setObjectives(prev => [...prev, {
      id: Date.now(), title: newTitle, description: "Quickly added task",
      category: "Personal", priority, completed: false,
      dueDate: "Today", progress: 0,
      assignees,
      commentList: [],
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
// ATTENDANCE VIEW – Premium calendar with leave request
// ─────────────────────────────────────────────────────────────────────────────
function AttendanceView() {
  const todayRef = TODAY_REF;
  const [year, setYear] = useState(todayRef.getFullYear());
  const [month, setMonth] = useState(todayRef.getMonth());
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [leaveType, setLeaveType] = useState("Sick Leave");
  const [leaveRange, setLeaveRange] = useState<DateRange | undefined>(undefined);
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);
  const [calOpen, setCalOpen] = useState(false);

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
  const firstDayIdx = (new Date(year, month, 1).getDay() + 6) % 7;
  const totalCells = Math.ceil((firstDayIdx + daysInMonth) / 7) * 7;

  const dateKey = (y: number, m: number, d: number) =>
    `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  // Monthly stats
  const monthStats = useMemo(() => {
    let present = 0, late = 0, absent = 0, totalMin = 0, workedDays = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const rec = ATTENDANCE_MAP[dateKey(year, month, d)];
      if (!rec || rec.status === "Future") continue;
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
    return { present, late, absent, rate, avgH: Math.floor(avgMin / 60), avgM: avgMin % 60, working };
  }, [year, month, daysInMonth]);

  const selectedRec = selectedKey ? ATTENDANCE_MAP[selectedKey] : null;

  // Max work minutes for the progress bar (9h = 540 min)
  const MAX_WORK_MIN = 540;

  const STATUS_DOT: Record<string, string> = {
    Present: "bg-emerald-500",
    Late: "bg-amber-400",
    Absent: "bg-rose-500",
  };
  const STATUS_CELL: Record<string, string> = {
    Present: "bg-emerald-50/80 dark:bg-emerald-950/40",
    Late: "bg-amber-50/80 dark:bg-amber-950/30",
    Absent: "bg-rose-50/80 dark:bg-rose-950/30",
    Future: "",
    Weekend: "",
  };
  const STATUS_BADGE: Record<string, string> = {
    Present: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    Late: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    Absent: "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    Future: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700",
    Weekend: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700",
  };

  const canPrev = new Date(year, month - 1, 1) >= minDate;
  const canNext = new Date(year, month + 1, 1) <= maxDate;

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveRange?.from || !leaveRange?.to) return;
    setLeaveSubmitted(true);
    setTimeout(() => {
    setShowLeaveModal(false);
      setLeaveSubmitted(false);
      setLeaveRange(undefined); setLeaveReason(""); setLeaveType("Sick Leave");
    }, 1800);
  };

  const LEAVE_TYPES = ["Sick Leave", "Casual Leave", "Emergency Leave", "Earned Leave", "Maternity/Paternity"];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5 pb-10">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Attendance</h2>
          <p className="text-[12px] font-bold text-zinc-400 dark:text-zinc-500 mt-0.5">Jan – Jul 2026 · All records tracked</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowStatsModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[12px] font-black hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all border border-zinc-200 dark:border-zinc-700"
          >
            <svg viewBox="0 0 256 256" className="w-3.5 h-3.5 fill-current"><path d="M224,200h-8V136a16,16,0,0,0-16-16H152a16,16,0,0,0-16,16v8H112a16,16,0,0,0-16,16v8H56a16,16,0,0,0-16,16v16H24a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16ZM152,136h48v64H152Zm-56,24h40v40H96Zm-56,24h40v16H40Z"/></svg>
            View Stats & Leave
          </button>
          <button
            onClick={() => setShowLeaveModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-[12px] font-black shadow hover:scale-105 active:scale-95 transition-all"
          >
            <svg viewBox="0 0 256 256" className="w-3.5 h-3.5 fill-current"><path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM112,168a8,8,0,0,1-11.31,0l-28-28a8,8,0,1,1,11.31-11.31L106,151.37l58.32-58.32a8,8,0,0,1,11.32,11.31Z"/></svg>
            Request Leave
          </button>
        </div>
      </div>

      {/* ── Illustrated Banner ── */}
      <div className="relative bg-zinc-950 rounded-3xl overflow-hidden flex items-center gap-0 min-h-[140px]">

        {/* Background decorative rings */}
        <div className="absolute right-32 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-white/5" />
        <div className="absolute right-24 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-white/5" />
        <div className="absolute right-16 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-white/5" />

        {/* Floating dots */}
        <div className="absolute top-5 left-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
        <div className="absolute bottom-6 left-[45%] w-1 h-1 rounded-full bg-amber-400/60" />
        <div className="absolute top-8 left-[60%] w-1 h-1 rounded-full bg-rose-400/40" />
        <div className="absolute bottom-4 left-[70%] w-2 h-2 rounded-full bg-white/10" />

        {/* Left: Text content */}
        <div className="flex-1 px-7 py-6 z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">{MONTH_NAMES[month]} {year} · Overview</p>
          <h3 className="text-[32px] font-black text-white leading-none tracking-tight">
            {monthStats.rate}<span className="text-zinc-500 text-[22px]">%</span>
            <span className="text-zinc-500 text-[18px] font-bold ml-2">attendance</span>
          </h3>
          <p className="text-[11px] font-bold text-zinc-500 mt-1.5">
            <span className="text-emerald-400">{monthStats.present} present</span>
            {" · "}
            <span className="text-amber-400">{monthStats.late} late</span>
            {" · "}
            <span className="text-rose-400">{monthStats.absent} absent</span>
          </p>

          {/* Mini progress strip */}
          <div className="flex gap-0.5 mt-4 h-1.5 w-48 rounded-full overflow-hidden">
            <div className="bg-emerald-500 rounded-l-full transition-all duration-700"
              style={{ flex: monthStats.present || 0.01 }} />
            <div className="bg-amber-400 transition-all duration-700"
              style={{ flex: monthStats.late || 0.01 }} />
            <div className="bg-rose-500 rounded-r-full transition-all duration-700"
              style={{ flex: monthStats.absent || 0.01 }} />
          </div>
        </div>

        {/* Right: SVG Illustration */}
        <div className="shrink-0 pr-7 z-10">
          <svg width="180" height="120" viewBox="0 0 180 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Calendar body */}
            <rect x="10" y="18" width="110" height="88" rx="10" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5"/>
            {/* Calendar top bar */}
            <rect x="10" y="18" width="110" height="24" rx="10" fill="#27272a"/>
            <rect x="10" y="30" width="110" height="12" fill="#27272a"/>
            {/* Header dots */}
            <circle cx="32" cy="30" r="4" fill="#ef4444" opacity="0.8"/>
            <circle cx="44" cy="30" r="4" fill="#f59e0b" opacity="0.8"/>
            <circle cx="56" cy="30" r="4" fill="#22c55e" opacity="0.8"/>
            {/* Month label line */}
            <rect x="68" y="27" width="34" height="5" rx="2.5" fill="#52525b"/>

            {/* Day grid cells */}
            {/* Row 1 */}
            <rect x="18" y="50" width="12" height="10" rx="2" fill="#27272a"/>
            <rect x="33" y="50" width="12" height="10" rx="2" fill="#27272a"/>
            <rect x="48" y="50" width="12" height="10" rx="2" fill="#10b981" opacity="0.85"/>
            <rect x="63" y="50" width="12" height="10" rx="2" fill="#10b981" opacity="0.85"/>
            <rect x="78" y="50" width="12" height="10" rx="2" fill="#f59e0b" opacity="0.85"/>
            <rect x="93" y="50" width="12" height="10" rx="2" fill="#10b981" opacity="0.85"/>
            <rect x="108" y="50" width="5" height="10" rx="2" fill="#27272a"/>
            {/* Row 2 */}
            <rect x="18" y="64" width="12" height="10" rx="2" fill="#10b981" opacity="0.85"/>
            <rect x="33" y="64" width="12" height="10" rx="2" fill="#10b981" opacity="0.85"/>
            <rect x="48" y="64" width="12" height="10" rx="2" fill="#ef4444" opacity="0.75"/>
            <rect x="63" y="64" width="12" height="10" rx="2" fill="#10b981" opacity="0.85"/>
            <rect x="78" y="64" width="12" height="10" rx="2" fill="#10b981" opacity="0.85"/>
            <rect x="93" y="64" width="12" height="10" rx="2" fill="#10b981" opacity="0.85"/>
            <rect x="108" y="64" width="5" height="10" rx="2" fill="#27272a"/>
            {/* Row 3 */}
            <rect x="18" y="78" width="12" height="10" rx="2" fill="#10b981" opacity="0.85"/>
            <rect x="33" y="78" width="12" height="10" rx="2" fill="#f59e0b" opacity="0.85"/>
            <rect x="48" y="78" width="12" height="10" rx="2" fill="#10b981" opacity="0.85"/>
            <rect x="63" y="78" width="12" height="10" rx="2" fill="#10b981" opacity="0.85"/>
            <rect x="78" y="78" width="12" height="10" rx="2" fill="#10b981" opacity="0.85"/>
            <rect x="93" y="78" width="12" height="10" rx="2" fill="#27272a"/>
            <rect x="108" y="78" width="5" height="10" rx="2" fill="#27272a"/>
            {/* Row 4 partial */}
            <rect x="18" y="92" width="12" height="10" rx="2" fill="#10b981" opacity="0.85"/>
            <rect x="33" y="92" width="12" height="10" rx="2" fill="#10b981" opacity="0.85"/>
            <rect x="48" y="92" width="12" height="10" rx="2" fill="#3f3f46" opacity="0.6"/>
            <rect x="63" y="92" width="12" height="10" rx="2" fill="#3f3f46" opacity="0.4"/>
            <rect x="78" y="92" width="12" height="10" rx="2" fill="#3f3f46" opacity="0.2"/>

            {/* Floating clock badge */}
            <g transform="translate(108, 6)">
              <circle cx="24" cy="24" r="22" fill="#09090b" stroke="#3f3f46" strokeWidth="1.5"/>
              <circle cx="24" cy="24" r="18" fill="#18181b"/>
              {/* Clock hands */}
              <line x1="24" y1="24" x2="24" y2="12" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
              <line x1="24" y1="24" x2="32" y2="28" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="24" cy="24" r="2" fill="white"/>
              {/* Clock ticks */}
              <circle cx="24" cy="8" r="1" fill="#52525b"/>
              <circle cx="38" cy="24" r="1" fill="#52525b"/>
              <circle cx="24" cy="40" r="1" fill="#52525b"/>
              <circle cx="10" cy="24" r="1" fill="#52525b"/>
            </g>

            {/* Check badge */}
            <g transform="translate(2, 2)">
              <circle cx="12" cy="12" r="11" fill="#09090b" stroke="#3f3f46" strokeWidth="1.5"/>
              <circle cx="12" cy="12" r="8" fill="#10b981" opacity="0.15"/>
              <path d="M8 12 L11 15 L16 9" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
          </svg>
        </div>
      </div>

      {/* ── Calendar Card ── */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900">
          {/* Month nav */}
          <div className="flex items-center gap-1">
            <button onClick={prevMonth} disabled={!canPrev}
              className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 disabled:opacity-25 disabled:cursor-not-allowed transition-all">
              <svg viewBox="0 0 256 256" className="w-4 h-4 fill-current"><path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" /></svg>
            </button>
            <span className="text-[15px] font-black text-zinc-900 dark:text-white px-3 min-w-[148px] text-center">
              {MONTH_NAMES[month]} {year}
            </span>
            <button onClick={nextMonth} disabled={!canNext}
              className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 disabled:opacity-25 disabled:cursor-not-allowed transition-all">
              <svg viewBox="0 0 256 256" className="w-4 h-4 fill-current"><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" /></svg>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Legend */}
            <div className="hidden md:flex items-center gap-3 text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
              {[["Present", "bg-emerald-500"], ["Late", "bg-amber-400"], ["Absent", "bg-rose-500"], ["Holiday", "bg-zinc-900 dark:bg-zinc-300"]].map(([lbl, cls]) => (
                <div key={lbl} className="flex items-center gap-1.5">
                  <span className={cn("w-2 h-2 rounded-full", cls)} />{lbl}
                </div>
              ))}
            </div>
            <button onClick={goToday}
              className="px-3 py-1.5 text-[11px] font-black border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              Today
            </button>
          </div>
        </div>

        {/* Week-day header */}
        <div className="grid grid-cols-7 border-b border-zinc-100 dark:border-zinc-800">
          {WEEK_DAYS.map(d => (
            <div key={d} className="py-3 text-center text-[10px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest border-r border-zinc-100 dark:border-zinc-800 last:border-r-0">
              {d}
            </div>
          ))}
        </div>

        {/* Month grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${year}-${month}`}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
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

              const overflowDay = dayNum <= 0
                ? new Date(year, month, 0).getDate() + dayNum
                : dayNum > daysInMonth ? dayNum - daysInMonth : dayNum;

              // Compute work minutes for the progress bar
              const workMins = (() => {
                if (!rec?.login || !rec?.logout) return 0;
                const [lh, lm] = rec.login.split(":").map(Number);
                const [oh, om] = rec.logout.split(":").map(Number);
                return (oh * 60 + om) - (lh * 60 + lm);
              })();
              const barPct = Math.min((workMins / MAX_WORK_MIN) * 100, 100);
              const BAR_COLOR: Record<string, string> = { Present: "bg-emerald-500", Late: "bg-amber-400", Absent: "bg-rose-400" };
              const BADGE_STYLE: Record<string, string> = {
                Present: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300",
                Late: "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300",
                Absent: "bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300",
              };

              return (
                <div
                  key={idx}
                  onClick={() => inMonth && !isFuture && !isWeekend && setSelectedKey(isSelected ? null : key)}
                  className={cn(
                    "min-h-[108px] border-b border-r border-zinc-100 dark:border-zinc-800 last:border-r-0 p-2.5 pb-2 transition-all relative group flex flex-col",
                    !inMonth && "bg-zinc-50/40 dark:bg-zinc-950/20",
                    inMonth && !isWeekend && !isFuture && "cursor-pointer hover:brightness-[0.97] dark:hover:brightness-110",
                    inMonth && rec && STATUS_CELL[rec.status],
                    isSelected && "ring-2 ring-inset ring-zinc-900 dark:ring-zinc-100",
                    isFuture && inMonth && "opacity-40",
                    holiday && inMonth && "bg-zinc-100/80 dark:bg-zinc-800/40",
                  )}
                >
                  {/* Day number row */}
                  <div className="flex items-start justify-between mb-1">
                    <span className={cn(
                      "w-6 h-6 flex items-center justify-center rounded-full text-[11px] font-black transition-colors shrink-0",
                      !inMonth && "text-zinc-300 dark:text-zinc-700",
                      inMonth && !isToday && !isWeekend && !isFuture && "text-zinc-700 dark:text-zinc-300",
                      isToday && "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-md",
                      isWeekend && inMonth && "text-zinc-400 dark:text-zinc-600",
                      isFuture && "text-zinc-400 dark:text-zinc-600",
                    )}>
                      {overflowDay}
                    </span>

                    {/* Status badge */}
                    {inMonth && rec && BADGE_STYLE[rec.status] && (
                      <span className={cn(
                        "text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md leading-none",
                        BADGE_STYLE[rec.status]
                      )}>
                        {rec.status}
                      </span>
                    )}
                  </div>

                  {/* Holiday tag */}
                  {holiday && inMonth && (
                    <div className="text-[8px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-wider leading-tight truncate mb-1">
                      🎉 {holiday}
                    </div>
                  )}

                  {/* Login / Logout — all past days */}
                  {inMonth && rec?.login && !isFuture && (
                    <div className="mt-auto space-y-0.5">
                      <div className="flex items-center gap-1">
                        <span className="text-[8px] font-black text-zinc-400 dark:text-zinc-600 w-3">↑</span>
                        <span className="text-[9px] font-bold text-zinc-600 dark:text-zinc-300">{rec.login}</span>
                      </div>
                      {rec.logout && (
                        <div className="flex items-center gap-1">
                          <span className="text-[8px] font-black text-zinc-400 dark:text-zinc-600 w-3">↓</span>
                          <span className="text-[9px] font-bold text-zinc-600 dark:text-zinc-300">{rec.logout}</span>
                        </div>
                      )}
                      {rec.hours && (
                        <div className="flex items-center gap-1 pt-0.5">
                          <span className="text-[8px] font-black text-zinc-400 dark:text-zinc-600 w-3">⏱</span>
                          <span className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400">{rec.hours}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Absent indicator */}
                  {inMonth && rec?.status === "Absent" && (
                    <div className="mt-auto text-[9px] font-bold text-rose-400 dark:text-rose-400">
                      No record
                    </div>
                  )}

                  {/* Work-hours progress bar */}
                  {inMonth && !isFuture && !isWeekend && rec && rec.status !== "Absent" && (
                    <div className="mt-2 h-1 w-full rounded-full bg-zinc-200/70 dark:bg-zinc-700/50 overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-700", BAR_COLOR[rec.status] ?? "bg-zinc-400")}
                        style={{ width: `${barPct}%` }}
                      />
                    </div>
                  )}

                  {/* Hover ring */}
                  {inMonth && !isFuture && !isWeekend && !isSelected && (
                    <div className="absolute inset-0 ring-1 ring-transparent group-hover:ring-zinc-300 dark:group-hover:ring-zinc-700 transition-all pointer-events-none" />
                  )}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* ── Selected Day Detail ── */}
        <AnimatePresence>
          {selectedKey && selectedRec && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="border-t border-zinc-100 dark:border-zinc-800 p-5 bg-gradient-to-r from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-900/80">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-6 flex-wrap">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Date</span>
                      <span className="text-[13px] font-black text-zinc-900 dark:text-white">
                        {new Date(selectedKey + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Status</span>
                      <span className={cn("px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-widest border", STATUS_BADGE[selectedRec.status])}>
                        {selectedRec.status}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Login</span>
                      <span className="text-[15px] font-black text-zinc-900 dark:text-white">{selectedRec.login ?? "—"}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Logout</span>
                      <span className="text-[15px] font-black text-zinc-900 dark:text-white">{selectedRec.logout ?? "—"}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Hours</span>
                      <span className="text-[15px] font-black text-zinc-900 dark:text-white">{selectedRec.hours ?? "—"}</span>
                    </div>
                    {HOLIDAYS[selectedKey] && (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Holiday</span>
                        <span className="text-[12px] font-black text-zinc-700 dark:text-zinc-300">🎉 {HOLIDAYS[selectedKey]}</span>
                      </div>
                    )}
                  </div>
                  <button onClick={() => setSelectedKey(null)}
                    className="w-7 h-7 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all shrink-0">
                    <svg viewBox="0 0 256 256" className="w-3.5 h-3.5 fill-current"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" /></svg>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Leave Request Modal ── */}
      <AnimatePresence>
        {showLeaveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) setShowLeaveModal(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-md overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-zinc-950 dark:bg-white flex items-center justify-center shadow-md">
                    <svg viewBox="0 0 256 256" className="w-5 h-5 fill-white dark:fill-zinc-950"><path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM112,168a8,8,0,0,1-11.31,0l-28-28a8,8,0,1,1,11.31-11.31L106,151.37l58.32-58.32a8,8,0,0,1,11.32,11.31Z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-[15px] font-black text-zinc-900 dark:text-white leading-none">Request Leave</h3>
                    <p className="text-[11px] font-bold text-zinc-400 mt-0.5">Submit a leave application</p>
                  </div>
                </div>
                <button onClick={() => setShowLeaveModal(false)}
                  className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
                  <svg viewBox="0 0 256 256" className="w-3.5 h-3.5 fill-current"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" /></svg>
                </button>
              </div>

              {/* Modal Body */}
              <AnimatePresence mode="wait">
                {leaveSubmitted ? (
                  <motion.div key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-14 px-6 gap-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                      <svg viewBox="0 0 256 256" className="w-8 h-8 fill-emerald-600 dark:fill-emerald-400"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" /></svg>
                    </div>
                    <div className="text-center">
                      <p className="text-[16px] font-black text-zinc-900 dark:text-white">Request Submitted!</p>
                      <p className="text-[12px] font-bold text-zinc-400 mt-1">Your leave application is under review.</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleLeaveSubmit} className="p-6 space-y-4">
                    {/* Leave Type */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Leave Type</label>
                      <div className="flex flex-wrap gap-2">
                        {LEAVE_TYPES.map(t => (
                          <button key={t} type="button" onClick={() => setLeaveType(t)}
                            className={cn(
                              "px-3 py-1.5 rounded-xl text-[11px] font-black border transition-all",
                              leaveType === t
                                ? "bg-zinc-950 text-white border-zinc-950 shadow-md dark:bg-white dark:text-zinc-950 dark:border-white"
                                : "bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500"
                            )}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Date Range – Calendar Picker */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Date Range</label>
                      <Popover open={calOpen} onOpenChange={setCalOpen}>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className={cn(
                              "w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border text-left text-[13px] font-bold transition-colors",
                              leaveRange?.from
                                ? "text-zinc-900 dark:text-white border-zinc-900 dark:border-zinc-100"
                                : "text-zinc-400 border-zinc-200 dark:border-zinc-700"
                            )}
                          >
                            <svg viewBox="0 0 256 256" className="w-4 h-4 fill-current shrink-0 opacity-60"><path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V48H72v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24Z"/></svg>
                            <span className="flex-1">
                              {leaveRange?.from ? (
                                leaveRange.to ? (
                                  <>{format(leaveRange.from, "dd MMM yyyy")} → {format(leaveRange.to, "dd MMM yyyy")}</>
                                ) : (
                                  format(leaveRange.from, "dd MMM yyyy")
                                )
                              ) : "Select date range"}
                            </span>
                            {leaveRange?.from && (
                              <span className="text-[10px] font-black text-zinc-400 bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 rounded-md">
                                {leaveRange.to
                                  ? `${Math.ceil((leaveRange.to.getTime() - leaveRange.from.getTime()) / 86400000) + 1}d`
                                  : "1d"}
                              </span>
                            )}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-xl overflow-hidden"
                          align="start"
                          sideOffset={6}
                        >
                          <Calendar
                            mode="range"
                            selected={leaveRange}
                            onSelect={(range) => {
                              setLeaveRange(range);
                              if (range?.from && range?.to) setCalOpen(false);
                            }}
                            disabled={{ before: new Date() }}
                            numberOfMonths={2}
                            className="p-3"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Reason */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Reason</label>
                      <textarea
                        required rows={3} value={leaveReason}
                        onChange={e => setLeaveReason(e.target.value)}
                        placeholder="Briefly describe the reason for your leave..."
                        className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[13px] font-bold text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors resize-none"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-1">
                      <button type="button" onClick={() => setShowLeaveModal(false)}
                        className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-[13px] font-black text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                        Cancel
                      </button>
                      <button type="submit"
                        className="flex-1 py-2.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-[13px] font-black shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                        Submit Request
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Stats & Leave Balance Modal ── */}
      <AnimatePresence>
        {showStatsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) setShowStatsModal(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-lg overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-zinc-950 dark:bg-white flex items-center justify-center shadow-md">
                    <svg viewBox="0 0 256 256" className="w-5 h-5 fill-white dark:fill-zinc-950"><path d="M224,200h-8V136a16,16,0,0,0-16-16H152a16,16,0,0,0-16,16v8H112a16,16,0,0,0-16,16v8H56a16,16,0,0,0-16,16v16H24a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16ZM152,136h48v64H152Zm-56,24h40v40H96Zm-56,24h40v16H40Z"/></svg>
                  </div>
                  <div>
                    <h3 className="text-[15px] font-black text-zinc-900 dark:text-white leading-none">Attendance & Leave Summary</h3>
                    <p className="text-[11px] font-bold text-zinc-400 mt-0.5">{MONTH_NAMES[month]} {year}</p>
                  </div>
                </div>
                <button onClick={() => setShowStatsModal(false)}
                  className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
                  <svg viewBox="0 0 256 256" className="w-3.5 h-3.5 fill-current"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/></svg>
                </button>
              </div>

              <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
                {/* Rate ring + breakdown */}
                <div className="flex gap-5 items-center">
                  {(() => {
                    const R = 44, C = Math.PI * 2 * R, total = monthStats.working, gap = 3;
                    const segs = [
                      { v: monthStats.present, color: "#10b981" },
                      { v: monthStats.late,    color: "#f59e0b" },
                      { v: monthStats.absent,  color: "#f43f5e" },
                    ];
                    let off = 0;
                    const arcs = segs.map(s => { const d = total > 0 ? (s.v / total) * (C - gap * segs.length) : 0; const a = { ...s, d, off: -off }; off += d + gap; return a; });
                    return (
                      <div className="relative shrink-0 w-28 h-28 flex items-center justify-center">
                        <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-90">
                          <circle cx="56" cy="56" r={R} fill="none" stroke="currentColor" strokeWidth="14" className="text-zinc-100 dark:text-zinc-800"/>
                          {arcs.map((a, i) => <circle key={i} cx="56" cy="56" r={R} fill="none" stroke={a.color} strokeWidth="14" strokeDasharray={`${a.d} ${C}`} strokeDashoffset={a.off} strokeLinecap="round"/>)}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-[20px] font-black text-zinc-900 dark:text-white leading-none">{monthStats.rate}%</span>
                          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mt-0.5">Rate</span>
                        </div>
                      </div>
                    );
                  })()}
                  <div className="flex-1 space-y-3">
                    {[
                      { label: "Present", value: monthStats.present, color: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-400" },
                      { label: "Late",    value: monthStats.late,    color: "bg-amber-400",   text: "text-amber-700 dark:text-amber-400" },
                      { label: "Absent",  value: monthStats.absent,  color: "bg-rose-500",    text: "text-rose-700 dark:text-rose-400" },
                    ].map(s => {
                      const pct = monthStats.working > 0 ? (s.value / monthStats.working) * 100 : 0;
                      return (
                        <div key={s.label}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5">
                              <span className={cn("w-2 h-2 rounded-full", s.color)} />
                              <span className="text-[11px] font-black text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">{s.label}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className={cn("text-[13px] font-black", s.text)}>{s.value} days</span>
                              <span className="text-[10px] font-bold text-zinc-400">({Math.round(pct)}%)</span>
                            </div>
                          </div>
                          <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                            <div className={cn("h-full rounded-full transition-all duration-700", s.color)} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                    <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Avg Work Hours / Day</span>
                      <span className="text-[13px] font-black text-zinc-900 dark:text-white">{monthStats.avgH}h {monthStats.avgM}m</span>
                    </div>
                  </div>
                </div>

                {/* Leave Balance */}
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                  <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-700 flex items-center gap-2">
                    <svg viewBox="0 0 256 256" className="w-4 h-4 fill-zinc-500"><path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V48H72v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24Z"/></svg>
                    <span className="text-[11px] font-black uppercase tracking-widest text-zinc-700 dark:text-zinc-300">Leave Balance — {MONTH_NAMES[month]} {year}</span>
                  </div>
                  <div className="px-4 py-4 space-y-4">
                    {(() => {
                      const MONTHLY_PAID = 2;
                      const usedLeave = monthStats.absent;
                      const remaining = Math.max(MONTHLY_PAID - usedLeave, 0);
                      const overused = Math.max(usedLeave - MONTHLY_PAID, 0);
                      return (
                        <>
                          <div className="flex gap-3">
                            {[
                              { label: "Entitled", value: MONTHLY_PAID, bg: "bg-zinc-100 dark:bg-zinc-800",           text: "text-zinc-700 dark:text-zinc-300",           sub: "per month" },
                              { label: "Used",     value: usedLeave,    bg: "bg-rose-50 dark:bg-rose-950/40",          text: "text-rose-700 dark:text-rose-300",            sub: "days taken" },
                              { label: "Remaining",value: remaining,    bg: remaining > 0 ? "bg-emerald-50 dark:bg-emerald-950/40" : "bg-zinc-50 dark:bg-zinc-800", text: remaining > 0 ? "text-emerald-700 dark:text-emerald-300" : "text-zinc-400", sub: remaining > 0 ? "days left" : "exhausted" },
                            ].map(b => (
                              <div key={b.label} className={cn("flex-1 rounded-xl p-3 flex flex-col gap-0.5", b.bg)}>
                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{b.label}</span>
                                <span className={cn("text-2xl font-black leading-none", b.text)}>{b.value}</span>
                                <span className="text-[10px] font-bold text-zinc-400">{b.sub}</span>
                              </div>
                            ))}
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Leave Utilisation</span>
                              <span className="text-[10px] font-bold text-zinc-500">{usedLeave}/{MONTHLY_PAID} paid days</span>
                            </div>
                            <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                              <div className={cn("h-full rounded-full transition-all duration-700", overused > 0 ? "bg-rose-500" : "bg-emerald-500")}
                                style={{ width: `${Math.min((usedLeave / MONTHLY_PAID) * 100, 100)}%` }} />
                            </div>
                          </div>
                          {overused > 0 ? (
                            <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50">
                              <svg viewBox="0 0 256 256" className="w-4 h-4 fill-rose-500 shrink-0 mt-0.5"><path d="M236.8,188.09,149.35,36.22a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm8,88a12,12,0,1,1,12-12A12,12,0,0,1,128,192Z"/></svg>
                              <p className="text-[11px] font-bold text-rose-700 dark:text-rose-300">
                                <span className="font-black">{overused} day{overused > 1 ? "s" : ""} over limit.</span> Excess absences may be marked as unpaid. Contact HR for clarification.
                              </p>
                            </div>
                          ) : (
                            <div className="flex items-start gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                              <svg viewBox="0 0 256 256" className="w-4 h-4 fill-zinc-400 shrink-0 mt-0.5"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a16,16,0,1,1,16,16A16,16,0,0,1,112,84Z"/></svg>
                              <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                                You have <span className="font-black text-zinc-900 dark:text-white">{remaining} paid leave day{remaining > 1 ? "s" : ""}</span> remaining this month. Unused leaves do not carry forward.
                              </p>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
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
          <AddTaskForm
            newTitle={newTitle}
            setNewTitle={setNewTitle}
            onAdd={onAdd}
            onCancel={() => setIsAdding(false)}
          />
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
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={cn("group bg-white dark:bg-zinc-900 rounded-[28px] border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all relative overflow-hidden", obj.completed && "opacity-60")}
    >
      <div className="p-5">
        {/* Top: badges + actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 text-[10px] font-black uppercase tracking-widest border border-zinc-100 dark:border-zinc-700">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" /> To do
            </div>
            <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border", {
                "Normal": "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/50",
                "High":   "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800/50",
                "Urgent": "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-800/50",
              }[obj.priority as string] ?? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/50")}>
              <Flag weight="fill" size={10} /> {obj.priority}
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onToggle(obj.id)} className={cn("w-7 h-7 rounded-lg flex items-center justify-center transition-all", obj.completed ? "bg-emerald-500 text-white" : "bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:text-emerald-500")}>
              <Check weight="bold" size={13} />
            </button>
            <button onClick={() => onDelete(obj.id)} className="w-7 h-7 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-rose-500 transition-all">
              <Trash weight="bold" size={13} />
            </button>
          </div>
        </div>

        {/* Title + description */}
        <div className="space-y-1 mb-4">
          <h4 className={cn("text-[16px] font-black text-zinc-950 dark:text-white tracking-tight leading-tight", obj.completed && "line-through text-zinc-400 dark:text-zinc-600")}>{obj.title}</h4>
          <p className="text-[12px] font-bold text-zinc-400 dark:text-zinc-500 flex items-start gap-1">
            <span className="text-zinc-300 dark:text-zinc-700">↳</span>{obj.description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-50 dark:border-zinc-800/50">
          <div className="flex items-center gap-3">
            {/* Assignee avatars */}
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

            {/* Comments toggle */}
            <button
              onClick={() => setShowComments(p => !p)}
              className={cn("flex items-center gap-1 text-[11px] font-black transition-colors", showComments ? "text-zinc-900 dark:text-white" : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300")}
            >
              <ChatDots size={14} weight="bold" /> {comments.length}
            </button>

            {/* Due date */}
            <div className={cn("flex items-center gap-1 text-[11px] font-black", obj.dueDate === "Tomorrow" ? "text-orange-500" : "text-zinc-400 dark:text-zinc-600")}>
              <Clock size={13} weight="bold" /> {obj.dueDate}
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-1.5">
            <div className="relative w-5 h-5">
              <svg className="w-5 h-5 -rotate-90">
                <circle cx="10" cy="10" r="8" className="stroke-zinc-100 dark:stroke-zinc-800" strokeWidth="2.5" fill="none" />
                <motion.circle initial={{ pathLength: 0 }} animate={{ pathLength: obj.progress / 100 }} cx="10" cy="10" r="8"
                  className={cn(obj.progress === 100 ? "stroke-emerald-500" : "stroke-zinc-300 dark:stroke-zinc-500")}
                  strokeWidth="2.5" fill="none" strokeDasharray="50 50" />
              </svg>
            </div>
            <span className="text-[11px] font-black text-zinc-900 dark:text-white">{obj.progress}%</span>
          </div>
        </div>
      </div>

      {/* Comment Panel */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
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

              {/* Input */}
              <div className="flex gap-2 items-center">
                <img src={TEAM_USERS[0].avatar} className="w-6 h-6 rounded-full object-cover shrink-0 border border-white dark:border-zinc-700" />
                <div className="flex-1 flex items-center gap-2 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 px-3 py-1.5">
                  <input
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddComment(); } }}
                    placeholder="Add a comment…"
                    className="flex-1 bg-transparent text-[12px] font-medium text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none"
                  />
                  <button type="button" onClick={handleAddComment}
                    className="w-6 h-6 rounded-full bg-zinc-950 dark:bg-white flex items-center justify-center shrink-0 hover:scale-110 active:scale-95 transition-all">
                    <svg viewBox="0 0 256 256" className="w-3 h-3 fill-white dark:fill-zinc-950"><path d="M228.1,26.6a21.1,21.1,0,0,0-21.1,0L31.6,133.8A21,21,0,0,0,33.3,172l57.6,18.9L114,240a21,21,0,0,0,39.6-2.4Z"/></svg>
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
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="bg-white dark:bg-zinc-900 rounded-3xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 overflow-hidden"
    >
      <form onSubmit={e => onAdd(e, selectedUsers, priority)} className="p-5 space-y-4">
        {/* Title */}
        <input
          autoFocus
          className="w-full bg-transparent text-[17px] font-black text-zinc-950 dark:text-white outline-none placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
        />

        {/* Priority */}
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Priority</p>
          <div className="flex gap-2">
            {([
              { label: "Normal", dot: "bg-blue-400",  active: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700" },
              { label: "High",   dot: "bg-rose-400",  active: "bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-700" },
              { label: "Urgent", dot: "bg-orange-400",active: "bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700" },
            ] as const).map(p => (
              <button
                key={p.label}
                type="button"
                onClick={() => setPriority(p.label)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black border transition-all",
                  priority === p.label
                    ? p.active
                    : "bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"
                )}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full", p.dot)} />
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Assign users */}
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Assign to</p>
          <div className="flex flex-wrap gap-2">
            {TEAM_USERS.map(u => {
              const sel = selectedUsers.includes(u.id);
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => toggleUser(u.id)}
                  className={cn(
                    "flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full text-[11px] font-black border transition-all",
                    sel
                      ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white"
                      : "bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"
                  )}
                >
                  <img src={u.avatar} className="w-4 h-4 rounded-full object-cover" />
                  {u.name.split(" ")[0]}
                  {sel && <Check weight="bold" size={9} className="ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <p className="text-[11px] font-bold text-zinc-400">
            {selectedUsers.length} assignee{selectedUsers.length !== 1 ? "s" : ""} · <span className="font-black text-zinc-600 dark:text-zinc-300">{priority}</span>
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={onCancel}
              className="px-4 py-2 rounded-xl text-zinc-500 text-[12px] font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              Cancel
            </button>
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
