/**
 * Dashboard Tab - Notion-Style Hospital Workspace
 * Content-first, document-like layout with database views
 */
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  SquaresFour,
  Link,
  Globe,
  Lock,
  Envelope,
  Notebook,
  Lightning,
  Info,
  ArrowRight,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import doctorAvatar from "@/assets/doctor-avatar.png";

import pdfIcon from "@/assets/pdf-icon.png";

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
  const [modalTab, setModalTab] = useState("Tasks");
  const [modalSearch, setModalSearch] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [peopleWithAccess, setPeopleWithAccess] = useState([
    { name: "Dr. Amanda Blake", email: "amanda@hms.hospital", role: "owner", avatar: doctorAvatar },
  ]);

  const SUGGESTIONS = [
    { name: "Dr. Sarah Johnson", email: "sarah@hms.hospital", avatar: null },
    { name: "Dr. Michael Chen", email: "michael@hms.hospital", avatar: null },
    { name: "Nurse Emma Wilson", email: "emma@hms.hospital", avatar: null },
    { name: "Dr. David Miller", email: "david@hms.hospital", avatar: null },
    { name: "Nurse James Taylor", email: "james@hms.hospital", avatar: null },
  ];

  const [filteredSuggestions, setFilteredSuggestions] = useState<{ name: string, email: string, avatar: any }[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<{ name: string, email: string, avatar: any }[]>([]);

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

  const updateTaskStatus = (id: number, status: string) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, status } : t
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
    <div className="w-full">
      <div className="max-w-[900px] mx-auto px-6 lg:px-12 py-12 lg:py-16">

        {/* ── Breadcrumb ── */}


        {/* ── Page Title ── */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="block">
              <h1 className="text-[40px] font-bold text-zinc-900 dark:text-white tracking-tight leading-tight">
                {getGreeting()}, Doctor 👋
              </h1>
              <p className="text-[15px] text-zinc-500 dark:text-zinc-400 mt-2">
                Here's what's happening at the hospital today.
              </p>
            </div>

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
                  <PopoverContent align="start" className="w-44 p-1 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
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
                  <PopoverContent align="start" className="w-44 p-1 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
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
              <button
                onClick={() => setShowAddModal(true)}
                className="p-1.5 rounded-md text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <DotsThree className="w-5 h-5" weight="bold" />
              </button>
            </div>

            {/* Table */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-[1fr_120px_110px_90px_100px] items-center bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 px-4">
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
                  className="grid grid-cols-[1fr_120px_110px_90px_100px] items-center border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors group px-4"
                >
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="hover:opacity-80 transition-opacity">
                          <StatusPill status={task.status} />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-40 p-1 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                        {[
                          { id: "Not Started", icon: Circle },
                          { id: "In Progress", icon: Clock },
                          { id: "Done", icon: CheckCircle }
                        ].map(s => (
                          <button
                            key={s.id}
                            onClick={() => updateTaskStatus(task.id, s.id)}
                            className={cn(
                              "w-full text-left px-2 py-1.5 rounded-sm text-[12px] transition-colors flex items-center gap-2",
                              task.status === s.id
                                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium"
                                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                            )}
                          >
                            <s.icon className={cn("w-3.5 h-3.5", s.id === "Done" && "text-emerald-500", s.id === "In Progress" && "text-blue-500", s.id === "Not Started" && "text-zinc-400")} weight={s.id === "Done" ? "fill" : "regular"} />
                            {s.id}
                          </button>
                        ))}
                      </PopoverContent>
                    </Popover>
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
                onClick={() => setShowFormModal(true)}
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


        {/* ── ADD TASK MODAL (Command Palette Style) ── */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddModal(false)}
                className="absolute inset-0 bg-zinc-950/20 dark:bg-black/60 backdrop-blur-[2px]"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                className="relative w-full max-w-[680px] bg-white dark:bg-[#1c1c1c] rounded-[20px] border border-zinc-200 dark:border-zinc-800 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col"
              >
                {/* 1. Search Header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-100 dark:border-zinc-800/50">
                  <MagnifyingGlass className="w-5 h-5 text-zinc-400" weight="bold" />
                  <input
                    type="text"
                    value={modalSearch}
                    onChange={(e) => setModalSearch(e.target.value)}
                    placeholder="Search anything or enter a command"
                    autoFocus
                    className="flex-1 bg-transparent border-none text-[15px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-0"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (modalSearch) {
                          setTasks(prev => [...prev, {
                            id: Date.now(),
                            title: modalSearch.trim(),
                            status: "Not Started",
                            assignee: "You",
                            priority: "Medium",
                            due: "Today",
                          }]);
                          setModalSearch("");
                          setShowAddModal(false);
                        }
                      }
                    }}
                  />
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-[10px] font-bold text-zinc-400 uppercase tracking-tight">
                    Return
                  </div>
                </div>

                {/* 2. Category Tabs */}
                <div className="flex items-center gap-1 px-3 py-2 border-b border-zinc-100 dark:border-zinc-800/50 overflow-x-auto no-scrollbar">
                  {[
                    { id: "Tasks", icon: ListChecks },
                    { id: "Documents", icon: ClipboardText },
                    { id: "Inbox", icon: Bell },
                    { id: "People", icon: UserCircle },
                    { id: "Reports", icon: ClipboardText },
                    { id: "Projects", icon: SquaresFour },
                    { id: "Templates", icon: ListDashes },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setModalTab(tab.id)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap",
                        modalTab === tab.id
                          ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                          : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                      )}
                    >
                      <tab.icon className="w-4 h-4" weight={modalTab === tab.id ? "fill" : "regular"} />
                      {tab.id}
                    </button>
                  ))}
                </div>

                {/* 3. Results Section */}
                <div className="flex-1 overflow-y-auto max-h-[400px] p-2 custom-scrollbar min-h-[300px]">
                  <div className="px-3 py-2 mb-1">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                      {modalSearch ? "Search results" : "Recent results"}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    {/* Real-ish results based on data */}
                    {(() => {
                      const allResults = [
                        ...tasks.map(t => ({ id: `task-${t.id}`, title: t.title, type: "Tasks", time: t.due, icon: ListChecks, color: "text-indigo-500", raw: t })),
                        { id: "doc-1", title: "Patient_Report_2024.pdf", type: "Documents", time: "Mar 10, 2026", icon: ClipboardText, color: "text-blue-500" },
                        { id: "doc-2", title: "MRI_Scan_Results.pdf", type: "Documents", time: "Mar 8, 2026", icon: ClipboardText, color: "text-blue-500" },
                        { id: "person-1", title: "Dr. Amanda Blake", type: "People", time: "Active now", icon: UserCircle, color: "text-emerald-500" },
                        { id: "person-2", title: "Dr. Singh", type: "People", time: "Away", icon: UserCircle, color: "text-emerald-500" },
                        { id: "proj-1", title: "New Wing Construction", type: "Projects", time: "In Progress", icon: SquaresFour, color: "text-amber-500" },
                      ];

                      const filtered = allResults.filter(r => {
                        const matchesTab = modalTab === "All" || r.type === modalTab;
                        const matchesSearch = !modalSearch || r.title.toLowerCase().includes(modalSearch.toLowerCase()) || r.type.toLowerCase().includes(modalSearch.toLowerCase());
                        return matchesTab && matchesSearch;
                      });

                      if (filtered.length === 0) {
                        return (
                          <div className="py-12 flex flex-col items-center justify-center text-center">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center mb-4">
                              <MagnifyingGlass className="w-6 h-6 text-zinc-300 dark:text-zinc-600" />
                            </div>
                            <p className="text-[14px] font-medium text-zinc-500 dark:text-zinc-400">No results found for "{modalSearch}"</p>
                            <p className="text-[12px] text-zinc-400 dark:text-zinc-500 mt-1">Try searching for something else or change the category.</p>
                          </div>
                        );
                      }

                      return filtered.map((result, idx) => {
                        const isPerson = result.type === "People";
                        const isDoc = result.type === "Documents" && result.title.endsWith(".pdf");

                        return (
                          <button
                            key={result.id}
                            onClick={() => {
                              if (result.type === "Tasks" && "raw" in result) {
                                // Example action: toggle task if it exists
                                toggleTask((result as any).raw.id);
                              }
                              // Close modal or show details
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group text-left relative"
                          >
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center transition-colors overflow-hidden",
                              isPerson || isDoc ? "bg-white dark:bg-zinc-800" : "bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 group-hover:bg-white dark:group-hover:bg-zinc-700"
                            )}>
                              {isPerson ? (
                                <img src={doctorAvatar} alt="Doctor" className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                              ) : isDoc ? (
                                <img src={pdfIcon} alt="PDF" className="w-8 h-8 object-contain mix-blend-multiply dark:mix-blend-normal" />
                              ) : (
                                <result.icon className="w-5 h-5" weight="duotone" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-[14px] font-semibold text-zinc-900 dark:text-zinc-100 truncate">{result.title}</h4>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[12px] text-zinc-400 font-medium">{result.type}</span>
                                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                                <span className="text-[12px] text-zinc-400">{result.time}</span>
                              </div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                              <button className="px-2 py-1 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[11px] font-bold">Select</button>
                              <span className="text-[11px] font-bold text-zinc-400">{idx + 1}</span>
                            </div>
                          </button>
                        );
                      });
                    })()}

                    {/* Quick Action: Create New Task if searching and in Tasks tab */}
                    {modalSearch && (modalTab === "Tasks" || modalTab === "All") && (
                      <button
                        onClick={() => {
                          setTasks(prev => [...prev, {
                            id: Date.now(),
                            title: modalSearch.trim(),
                            status: "Not Started",
                            assignee: "You",
                            priority: "Medium",
                            due: "Today",
                          }]);
                          setModalSearch("");
                          setShowAddModal(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-500/5 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors group text-left mt-2 border border-dashed border-indigo-200 dark:border-indigo-500/20"
                      >
                        <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white">
                          <Plus className="w-5 h-5" weight="bold" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[14px] font-semibold text-indigo-600 dark:text-indigo-400 truncate">Create new task: "{modalSearch}"</h4>
                          <p className="text-[12px] text-indigo-400/80">Press Enter to create this task immediately</p>
                        </div>
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-500/30 bg-white dark:bg-zinc-900 text-[9px] font-bold text-indigo-500 uppercase">
                          Return
                        </div>
                      </button>
                    )}
                  </div>
                </div>

                {/* 4. Keyboard Footer */}
                <div className="px-5 py-3 border-t border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5">
                        <span className="px-1 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[9px] text-zinc-400 font-bold">↑</span>
                        <span className="px-1 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[9px] text-zinc-400 font-bold">↓</span>
                      </div>
                      <span className="text-[11px] font-medium text-zinc-400">Navigate</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[9px] text-zinc-400 font-bold">RETURN</span>
                      <span className="text-[11px] font-medium text-zinc-400">Open</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[9px] text-zinc-400 font-bold">TAB</span>
                      <span className="text-[11px] font-medium text-zinc-400">Actions</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[9px] text-zinc-400 font-bold">ESC</span>
                      <span className="text-[11px] font-medium text-zinc-400">Close</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── ADD TASK FORM MODAL (Detailed) ── */}
        <AnimatePresence>
          {showFormModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFormModal(false)}
                className="absolute inset-0 bg-zinc-950/20 dark:bg-black/60 backdrop-blur-[4px]"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                className="relative w-full max-w-[680px] bg-white dark:bg-[#1c1c1c] rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col"
              >
                {/* 0. Task Header (Name + Priority) */}
                <div className="p-8 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/30 dark:bg-zinc-900/20">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest px-1">Task Title</label>
                      <input
                        type="text"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        placeholder="e.g., Patient Rounds"
                        className="w-full bg-transparent border-none text-[28px] font-bold text-zinc-900 dark:text-white placeholder:text-zinc-200 dark:placeholder:text-zinc-800 focus:outline-none focus:ring-0 px-0"
                        autoFocus
                      />
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest px-1">Priority</label>
                        <div className="flex items-center gap-2">
                          {[
                            { label: "High", color: "bg-rose-500", text: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-500/10" },
                            { label: "Medium", color: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10" },
                            { label: "Low", color: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" }
                          ].map((p) => (
                            <button
                              key={p.label}
                              onClick={() => setPriority(p.label as any)}
                              className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all border",
                                priority === p.label
                                  ? `${p.bg} border-zinc-200 dark:border-zinc-700 shadow-sm scale-105`
                                  : "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-500 opacity-60 hover:opacity-100"
                              )}
                            >
                              <div className={cn("w-2 h-2 rounded-full", p.color)} />
                              <span className={priority === p.label ? p.text : ""}>{p.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 1. Invite Header */}
                <div className="p-5 border-b border-zinc-100 dark:border-zinc-800/50">
                  <div className="flex items-center gap-3 p-1 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                    <input
                      type="text"
                      value={inviteEmail}
                      onChange={(e) => {
                        const val = e.target.value;
                        setInviteEmail(val);
                        if (val.trim()) {
                          setFilteredSuggestions(SUGGESTIONS.filter(s =>
                            (s.name.toLowerCase().includes(val.toLowerCase()) ||
                              s.email.toLowerCase().includes(val.toLowerCase())) &&
                            !selectedPeople.find(p => p.email === s.email) &&
                            !peopleWithAccess.find(p => p.email === s.email)
                          ));
                        } else {
                          setFilteredSuggestions([]);
                        }
                      }}
                      placeholder="Search people to invite..."
                      className="flex-1 bg-transparent border-none text-[14px] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-0 pl-4 h-[44px]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && inviteEmail.trim()) {
                          const newPerson = {
                            name: inviteEmail.split("@")[0] || inviteEmail,
                            email: inviteEmail.includes("@") ? inviteEmail : `${inviteEmail}@hms.hospital`,
                            avatar: null
                          };
                          setSelectedPeople(prev => [...prev, newPerson]);
                          setInviteEmail("");
                          setFilteredSuggestions([]);
                        }
                      }}
                    />
                    <div className="h-6 w-[1px] bg-zinc-200 dark:bg-zinc-800" />
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                      can view
                      <CaretRight className="w-3.5 h-3.5 rotate-90" />
                    </button>
                    <button
                      onClick={() => {
                        if (selectedPeople.length > 0) {
                          setPeopleWithAccess(prev => [...prev, ...selectedPeople.map(p => ({ ...p, role: "can view" }))]);
                          setSelectedPeople([]);
                          setShowSuccessModal(true);
                        } else if (inviteEmail.trim()) {
                          const newPerson = {
                            name: inviteEmail.split("@")[0] || inviteEmail,
                            email: inviteEmail.includes("@") ? inviteEmail : `${inviteEmail}@hms.hospital`,
                            role: "can view",
                            avatar: null
                          };
                          setPeopleWithAccess(prev => [...prev, newPerson]);
                          setInviteEmail("");
                          setShowSuccessModal(true);
                        }
                      }}
                      className="px-6 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[14px] font-bold hover:opacity-90 transition-opacity mx-1"
                    >
                      Invite
                    </button>
                  </div>

                  {/* Suggestions Dropdown */}
                  <AnimatePresence>
                    {filteredSuggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-6 w-full max-w-[340px] mt-1 z-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden"
                      >
                        {filteredSuggestions.map((s, idx) => (
                          <button
                            key={s.email}
                            onClick={() => {
                              setSelectedPeople(prev => [...prev, s]);
                              setInviteEmail("");
                              setFilteredSuggestions([]);
                            }}
                            className="w-full flex items-center gap-3 p-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors text-left border-b border-zinc-100 dark:border-zinc-800/50 last:border-0"
                          >
                            <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
                              {s.avatar ? (
                                <img src={s.avatar} className="w-full h-full object-cover" />
                              ) : (
                                <UserCircle className="w-5 h-5 text-zinc-400" />
                              )}
                            </div>
                            <div>
                              <h5 className="text-[13px] font-semibold text-zinc-900 dark:text-white">{s.name}</h5>
                              <p className="text-[11px] text-zinc-400">{s.email}</p>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex-1 overflow-y-auto max-h-[380px] p-5 pt-2 space-y-6 custom-scrollbar">
                  {/* 1. General Access Section (Optional/Static) */}
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest px-1">General access</h4>
                    <div className="space-y-0.5">
                      <button className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors text-left group">
                        <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 group-hover:bg-white dark:group-hover:bg-zinc-700 transition-colors">
                          <Users className="w-4.5 h-4.5" weight="duotone" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">Only those invited</h5>
                          <p className="text-[11px] text-zinc-400 mt-0.5">{peopleWithAccess.length} people have access</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* 2. People with Access Section (Owner + Selected) */}
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest px-1">People with access</h4>
                    <div className="space-y-0.5">
                      {/* Render existing access (Owner) */}
                      {peopleWithAccess.map((person) => (
                        <div key={person.email} className="group relative flex items-center gap-3 p-2 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                          <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                            {person.avatar ? (
                              <img src={person.avatar} className="w-full h-full object-cover" />
                            ) : (
                              <UserCircle className="w-5 h-5 text-zinc-400" weight="duotone" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 truncate">{person.name}</h5>
                            <p className="text-[11px] text-zinc-400 truncate">{person.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {person.role === "owner" ? (
                              <div className="flex items-center gap-1.5 px-2 py-1 text-zinc-400 text-[12px] font-medium">
                                owner
                                <Globe className="w-3.5 h-3.5" weight="bold" />
                              </div>
                            ) : (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[12px] font-semibold transition-colors">
                                    {person.role}
                                    <CaretRight className="w-3 h-3 rotate-90" />
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent align="end" className="w-40 p-1 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl">
                                  {["can edit", "can view"].map(r => (
                                    <button
                                      key={r}
                                      onClick={() => {
                                        setPeopleWithAccess(prev => prev.map(p => p.email === person.email ? { ...p, role: r } : p));
                                      }}
                                      className={cn(
                                        "w-full text-left px-3 py-2 rounded-xl text-[12px] transition-colors",
                                        person.role === r ? "bg-zinc-50 dark:bg-zinc-800 font-bold text-zinc-900 dark:text-white" : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                      )}
                                    >
                                      {r}
                                    </button>
                                  ))}
                                  <div className="h-[1px] bg-zinc-100 dark:bg-zinc-800 my-1" />
                                  <button
                                    onClick={() => setPeopleWithAccess(prev => prev.filter(p => p.email !== person.email))}
                                    className="w-full text-left px-3 py-2 rounded-xl text-[12px] text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors font-medium"
                                  >
                                    Remove access
                                  </button>
                                </PopoverContent>
                              </Popover>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Render Selected (Pending) Invitations */}
                      <AnimatePresence>
                        {selectedPeople.map((person) => (
                          <motion.div
                            key={person.email}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="group relative flex items-center gap-3 p-2 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 transition-colors"
                          >
                            <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/30 overflow-hidden flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                              {person.avatar ? (
                                <img src={person.avatar} className="w-full h-full object-cover" />
                              ) : (
                                <UserCircle className="w-5 h-5 text-emerald-500" weight="duotone" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 truncate">{person.name}</h5>
                              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 truncate flex items-center gap-1.5">
                                {person.email}
                                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                                <span className="text-[10px] uppercase font-bold tracking-tight">Pending</span>
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedPeople(prev => prev.filter(x => x.email !== person.email))}
                                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" weight="bold" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* 4. Footer Link Section */}
                <div className="p-5 border-t border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/30">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 px-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-[12px] text-zinc-400 truncate">
                      https://hms.hospital/workspace/k373nH
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText("https://hms.hospital/workspace/k373nH");
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white text-[13px] font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors shrink-0"
                    >
                      <Link className="w-4 h-4" />
                      Copy link
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── INVITE SUCCESS MODAL ── */}
        <AnimatePresence>
          {showSuccessModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSuccessModal(false)}
                className="absolute inset-0 bg-zinc-950/20 dark:bg-black/60 backdrop-blur-[4px]"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                className="relative w-full max-w-[360px] bg-white dark:bg-[#1c1c1c] rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] p-8 text-center"
              >
                <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-emerald-500" weight="fill" />
                </div>
                <h3 className="text-[20px] font-bold text-zinc-900 dark:text-white tracking-tight">Invite Sent</h3>
                <p className="text-[14px] text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  The invitation has been sent successfully. They will receive an email to join the workspace.
                </p>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full mt-8 py-3.5 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-[14px] hover:opacity-90 transition-opacity"
                >
                  Great, thanks!
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}