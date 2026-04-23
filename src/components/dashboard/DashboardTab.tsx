/**
 * Dashboard Tab - Notion-Style Hospital Workspace
 * Content-first, document-like layout with database views
 */
import { useState } from "react";
import { motion } from "motion/react";
import {
  CheckCircle,
  Circle,
  Clock,
  CalendarCheck,
  CalendarBlank,
  Users,
  Bed,
  Heart,
  CaretRight,
  Plus,
  FunnelSimple,
  ArrowsDownUp,
  MagnifyingGlass,
  DotsThree,
  Warning,
  WarningCircle,
  Bell,
  X,
  UserCircle,
  ListChecks,
  ListDashes,
  ClipboardText,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

// ── Data ──

const TASKS = [
  { id: 1, title: "Morning Rounds - Cardiology Ward", status: "Done", assignee: "Dr. Singh", priority: "High", due: "Today" },
  { id: 2, title: "Review Lab Results - P-2024003", status: "In Progress", assignee: "You", priority: "High", due: "Today" },
  { id: 3, title: "Staff Huddle - Shift Handover", status: "Not Started", assignee: "You", priority: "Medium", due: "Today" },
  { id: 4, title: "Consultation: Amanda Blake", status: "Not Started", assignee: "Dr. Patel", priority: "High", due: "Today" },
  { id: 5, title: "Discharge Planning Meeting", status: "Not Started", assignee: "You", priority: "Medium", due: "Tomorrow" },
  { id: 6, title: "Equipment Inventory Check", status: "Not Started", assignee: "Nurse Kim", priority: "Low", due: "This Week" },
];

const ATTENDANCE_LOG = [
  { date: "Apr 22", checkIn: "08:12 AM", checkOut: "—", hours: "—", status: "Active" },
  { date: "Apr 21", checkIn: "08:05 AM", checkOut: "06:30 PM", hours: "10h 25m", status: "Complete" },
  { date: "Apr 20", checkIn: "07:55 AM", checkOut: "05:45 PM", hours: "9h 50m", status: "Complete" },
  { date: "Apr 19", checkIn: "—", checkOut: "—", hours: "—", status: "Leave" },
  { date: "Apr 18", checkIn: "08:20 AM", checkOut: "07:00 PM", hours: "10h 40m", status: "Complete" },
];

const REMINDERS = [
  { id: 1, text: "Dr. Patel's license renewal due in 3 days", type: "warning" },
  { id: 2, text: "ICU ventilator maintenance scheduled tomorrow", type: "urgent" },
];

// ── Status Badge ──

function StatusPill({ status }: { status: string }) {
  const colors: Record<string, string> = {
    "Done": "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
    "In Progress": "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    "Not Started": "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400",
    "Active": "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
    "Complete": "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400",
    "Leave": "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  };
  return (
    <span className={cn("px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap", colors[status] || colors["Not Started"])}>
      {status}
    </span>
  );
}

// ── Helpers ──

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

// ── Component ──

export function DashboardTab() {
  const [tasks, setTasks] = useState(TASKS);
  const [dismissedReminders, setDismissedReminders] = useState<number[]>([]);
  const [activeSection, setActiveSection] = useState<"tasks" | "attendance">("tasks");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", assignee: "You", priority: "Medium", due: "Today" });
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"none" | "priority" | "due">("none");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const activeReminders = REMINDERS.filter(r => !dismissedReminders.includes(r.id));
  const doneCount = tasks.filter(t => t.status === "Done").length;

  const priorityOrder: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
  const dueOrder: Record<string, number> = { Today: 0, Tomorrow: 1, "This Week": 2 };

  const filteredTasks = tasks
    .filter(t => filterStatus === "All" || t.status === filterStatus)
    .filter(t => !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "priority") return (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9);
      if (sortBy === "due") return (dueOrder[a.due] ?? 9) - (dueOrder[b.due] ?? 9);
      return 0;
    });

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, status: t.status === "Done" ? "Not Started" : "Done" } : t
    ));
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;
    setTasks(prev => [...prev, {
      id: Date.now(),
      title: newTask.title.trim(),
      status: "Not Started",
      assignee: newTask.assignee,
      priority: newTask.priority,
      due: newTask.due,
    }]);
    setNewTask({ title: "", assignee: "You", priority: "Medium", due: "Today" });
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#191919]">
      <div className="max-w-[900px] mx-auto px-6 lg:px-12 py-12 lg:py-16">

        {/* ── Breadcrumb ── */}


        {/* ── Page Title ── */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="block">
            <h1 className="text-[40px] font-bold text-zinc-900 dark:text-white tracking-tight leading-tight">
              {getGreeting()}, Doctor 👋
            </h1>
            <p className="text-[15px] text-zinc-500 dark:text-zinc-400 mt-2">
              Here's what's happening at the hospital today.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-4">
            <span className="text-[14px] text-zinc-500 dark:text-zinc-400">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[12px] font-medium">
              {doneCount} of {tasks.length} tasks complete
            </span>
          </div>
        </motion.div>

        {/* ── Reminders ── */}
        {activeReminders.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-8 space-y-2"
          >
            {activeReminders.map((r) => (
              <div
                key={r.id}
                className={cn(
                  "flex items-center justify-between py-2.5 px-4 rounded-md border text-[13px]",
                  r.type === "urgent"
                    ? "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50"
                    : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50"
                )}
              >
                <div className="flex items-center gap-2.5">
                  {r.type === "urgent" ? (
                    <Warning className="w-4 h-4 text-rose-600 dark:text-rose-500 flex-shrink-0" weight="fill" />
                  ) : (
                    <Bell className="w-4 h-4 text-amber-600 dark:text-amber-500 flex-shrink-0" weight="fill" />
                  )}
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">{r.text}</span>
                </div>
                <button
                  onClick={() => setDismissedReminders(p => [...p, r.id])}
                  className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex-shrink-0 ml-3"
                  aria-label="Dismiss"
                >
                  <X className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                </button>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── Divider ── */}
        <div className="my-10 border-t border-zinc-100 dark:border-zinc-800" />

        {/* ── Section Tabs ── */}
        <div className="flex items-center gap-8 mb-8">
          {[
            { id: "tasks" as const, label: "Tasks", icon: ListChecks },
            { id: "attendance" as const, label: "Attendance", icon: ClipboardText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={cn(
                "flex items-center gap-2 pb-2 text-[14px] font-medium transition-colors relative",
                activeSection === tab.id
                  ? "text-zinc-900 dark:text-white"
                  : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
              )}
            >
              <tab.icon className="w-[18px] h-[18px]" weight="regular" />
              {tab.label}
              {activeSection === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-white"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* ── TASKS TABLE (Notion-style) ── */}
        {activeSection === "tasks" && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-[12px] text-red-500 dark:text-red-500 mb-4">Completed tasks will be automatically removed after 10 days for consistency.</p>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                {/* Filter */}
                <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                  <PopoverTrigger asChild>
                    <button className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors", filterStatus !== "All" ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50")}>
                      <FunnelSimple className="w-3.5 h-3.5" weight="bold" />
                      {filterStatus === "All" ? "Filter" : filterStatus}
                      {filterStatus !== "All" && (
                        <span
                          role="button"
                          onClick={(e) => { e.stopPropagation(); setFilterStatus("All"); }}
                          className="ml-0.5 p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </span>
                      )}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-44 p-1 bg-white dark:bg-[#232323] border-zinc-200 dark:border-zinc-700">
                    <p className="px-2 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Status</p>
                    {[
                      { id: "All", icon: ListChecks },
                      { id: "Done", icon: CheckCircle },
                      { id: "In Progress", icon: Clock },
                      { id: "Not Started", icon: Circle }
                    ].map(s => (
                      <button
                        key={s.id}
                        onClick={() => { setFilterStatus(s.id); setFilterOpen(false); }}
                        className={cn(
                          "w-full text-left px-2 py-1.5 rounded-sm text-[13px] transition-colors flex items-center gap-2",
                          filterStatus === s.id
                            ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium"
                            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                        )}
                      >
                        <s.icon className={cn("w-4 h-4", s.id === "Done" && "text-emerald-500", s.id === "In Progress" && "text-blue-500", s.id === "Not Started" && "text-zinc-400", s.id === "All" && "text-zinc-500")} weight={s.id === "Done" ? "fill" : "regular"} />
                        {s.id}
                      </button>
                    ))}
                  </PopoverContent>
                </Popover>

                {/* Sort */}
                <Popover open={sortOpen} onOpenChange={setSortOpen}>
                  <PopoverTrigger asChild>
                    <button className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors", sortBy !== "none" ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50")}>
                      <ArrowsDownUp className="w-3.5 h-3.5" weight="bold" />
                      {sortBy === "none" ? "Sort" : sortBy === "priority" ? "Priority ↑" : "Due Date ↑"}
                      {sortBy !== "none" && (
                        <span
                          role="button"
                          onClick={(e) => { e.stopPropagation(); setSortBy("none"); }}
                          className="ml-0.5 p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </span>
                      )}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-44 p-1 bg-white dark:bg-[#232323] border-zinc-200 dark:border-zinc-700">
                    <p className="px-2 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Sort by</p>
                    {[
                      { id: "none" as const, label: "Default", icon: ListDashes },
                      { id: "priority" as const, label: "Priority", icon: WarningCircle },
                      { id: "due" as const, label: "Due Date", icon: CalendarBlank },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => { setSortBy(opt.id); setSortOpen(false); }}
                        className={cn(
                          "w-full text-left px-2 py-1.5 rounded-sm text-[13px] transition-colors flex items-center gap-2",
                          sortBy === opt.id
                            ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium"
                            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                        )}
                      >
                        <opt.icon className="w-4 h-4" />
                        {opt.label}
                      </button>
                    ))}
                  </PopoverContent>
                </Popover>

                {/* Search */}
                {!showSearch ? (
                  <button
                    onClick={() => setShowSearch(true)}
                    className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors", searchQuery ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50")}
                  >
                    <MagnifyingGlass className="w-3.5 h-3.5" weight="bold" /> Search
                    {searchQuery && (
                      <span
                        role="button"
                        onClick={(e) => { e.stopPropagation(); setSearchQuery(""); }}
                        className="ml-0.5 p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                ) : (
                  <motion.div
                    initial={{ width: 80, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    className="relative overflow-hidden flex items-center"
                  >
                    <MagnifyingGlass className="absolute left-2.5 w-3.5 h-3.5 text-zinc-400" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search tasks..."
                      autoFocus
                      onBlur={() => { if (!searchQuery) setShowSearch(false); }}
                      onKeyDown={(e) => { if (e.key === "Escape") { setShowSearch(false); setSearchQuery(""); } }}
                      className="pl-8 pr-8 h-[30px] bg-zinc-100 dark:bg-zinc-800 border-transparent focus-visible:border-zinc-300 dark:focus-visible:border-zinc-600 text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400 text-[13px] rounded-md w-full shadow-none focus-visible:ring-0"
                    />
                    <button
                      onMouseDown={(e) => { e.preventDefault(); setSearchQuery(""); setShowSearch(false); }}
                      className="absolute right-1.5 p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                )}
              </div>
              <button className="p-1.5 rounded-md text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <DotsThree className="w-5 h-5" weight="bold" />
              </button>
            </div>

            {/* Table */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-[40px_1fr_120px_110px_90px_100px] items-center bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 px-4">
                <div />
                <div className="py-2 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Task Name</div>
                <div className="py-2 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</div>
                <div className="py-2 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Assignee</div>
                <div className="py-2 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Priority</div>
                <div className="py-2 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Due</div>
              </div>

              {/* Rows */}
              {filteredTasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02, duration: 0.2 }}
                  className="grid grid-cols-[40px_1fr_120px_110px_90px_100px] items-center border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors group px-4"
                >
                  <div className="py-3 flex items-center">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
                    >
                      {task.status === "Done" ? (
                        <CheckCircle className="w-[18px] h-[18px] text-emerald-600 dark:text-emerald-500" weight="fill" />
                      ) : (
                        <Circle className="w-[18px] h-[18px] text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-400 dark:group-hover:text-zinc-600" weight="regular" />
                      )}
                    </button>
                  </div>
                  <div className="py-3">
                    <span className={cn(
                      "text-[14px]",
                      task.status === "Done"
                        ? "text-zinc-400 dark:text-zinc-600 line-through"
                        : "text-zinc-900 dark:text-white font-medium"
                    )}>
                      {task.title}
                    </span>
                  </div>
                  <div className="py-3">
                    <StatusPill status={task.status} />
                  </div>
                  <div className="py-3">
                    <div className="flex items-center gap-1.5">
                      <UserCircle className="w-[15px] h-[15px] text-zinc-400" weight="fill" />
                      <span className="text-[13px] text-zinc-600 dark:text-zinc-400">{task.assignee}</span>
                    </div>
                  </div>
                  <div className="py-3">
                    <span className={cn(
                      "text-[12px] font-medium",
                      task.priority === "High" && "text-rose-600 dark:text-rose-500",
                      task.priority === "Medium" && "text-amber-600 dark:text-amber-500",
                      task.priority === "Low" && "text-zinc-400 dark:text-zinc-500"
                    )}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="py-3">
                    <span className="text-[12px] text-zinc-500 dark:text-zinc-400">{task.due}</span>
                  </div>
                </motion.div>
              ))}

              {/* Add Row */}
              <button
                onClick={() => setShowAddModal(true)}
                className="w-full flex items-center gap-2 px-4 py-3 text-[13px] text-zinc-400 dark:text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              >
                <Plus className="w-4 h-4" weight="bold" />
                New Task
              </button>
            </div>
          </motion.div>
        )}

        {/* ── ATTENDANCE TABLE ── */}
        {activeSection === "attendance" && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-[1fr_120px_120px_110px_110px] items-center bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 px-4">
                <div className="py-2 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Date</div>
                <div className="py-2 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Check In</div>
                <div className="py-2 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Check Out</div>
                <div className="py-2 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Hours</div>
                <div className="py-2 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</div>
              </div>

              {/* Rows */}
              {ATTENDANCE_LOG.map((row, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02, duration: 0.2 }}
                  className="grid grid-cols-[1fr_120px_120px_110px_110px] items-center border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors px-4"
                >
                  <div className="py-3 text-[14px] font-medium text-zinc-900 dark:text-white">{row.date}</div>
                  <div className="py-3 text-[13px] text-zinc-600 dark:text-zinc-400">{row.checkIn}</div>
                  <div className="py-3 text-[13px] text-zinc-600 dark:text-zinc-400">{row.checkOut}</div>
                  <div className="py-3 text-[13px] font-medium text-zinc-900 dark:text-white">{row.hours}</div>
                  <div className="py-3"><StatusPill status={row.status} /></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}


        {/* ── ADD TASK MODAL ── */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/40 dark:bg-black/60"
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-[480px] mx-4 bg-white dark:bg-[#1e1e1e] rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="text-[16px] font-semibold text-zinc-900 dark:text-white">New Task</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4 text-zinc-400" />
                </button>
              </div>

              {/* Form */}
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-[12px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Task Name</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask(p => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. Review patient chart"
                    autoFocus
                    className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent text-[14px] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:ring-offset-1 transition-shadow"
                    onKeyDown={(e) => e.key === "Enter" && addTask()}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[12px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Assignee</label>
                    <select
                      value={newTask.assignee}
                      onChange={(e) => setNewTask(p => ({ ...p, assignee: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#1e1e1e] text-[13px] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-shadow"
                    >
                      <option>You</option>
                      <option>Dr. Singh</option>
                      <option>Dr. Patel</option>
                      <option>Nurse Kim</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Priority</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask(p => ({ ...p, priority: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#1e1e1e] text-[13px] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-shadow"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Due</label>
                    <select
                      value={newTask.due}
                      onChange={(e) => setNewTask(p => ({ ...p, due: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#1e1e1e] text-[13px] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-shadow"
                    >
                      <option>Today</option>
                      <option>Tomorrow</option>
                      <option>This Week</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 p-5 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-[13px] font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addTask}
                  disabled={!newTask.title.trim()}
                  className={cn(
                    "px-4 py-2 rounded-lg text-[13px] font-medium transition-colors",
                    newTask.title.trim()
                      ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                  )}
                >
                  Add Task
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
}