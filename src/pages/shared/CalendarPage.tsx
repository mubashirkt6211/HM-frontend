import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { addDays, format } from "date-fns";
import {
  CaretLeft, CaretRight, Plus, Clock, Users,
  X, Calendar as CalendarIcon, MapPin,
  ShieldCheck, Warning, Info, Check,
  File, Trash, CloudArrowUp, Flag, ArrowRight, ArrowLeft,
  CaretDown, Question, CheckCircle, BookmarkSimple, User, Buildings
} from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ─── Types ───────────────────────────────────────────────────────────
type CalendarEvent = {
  id: string;
  title: string;
  clientName?: string;
  patientName?: string;
  agent?: string;
  supportAgent?: string;
  nurse?: string;
  doctor?: string;
  attachments?: { name: string; size: string; type: string }[];
  dealNotes?: string;
  report?: string;
  time: string;
  endTime?: string;
  color: string;
  attendees?: number;
  location?: string;
  notes?: string;
  priority?: "Low" | "Medium" | "High";
  category?: "Shared" | "Public" | "Archived";
  assignees?: { name: string; avatar?: string; role: string }[];
};

type DayEvents = { [key: number]: CalendarEvent[] };

// ─── CRM Mock Data ───────────────────────────────────────────────────
const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MOCK_STAFF = [
  { name: "Ari Parker", avatar: "https://i.pravatar.cc/200?img=45", role: "Senior Sales Agent" },
  { name: "Sam Rivera", avatar: "https://i.pravatar.cc/200?img=52", role: "Travel Specialist" },
  { name: "Maya Chen", avatar: "https://i.pravatar.cc/200?img=49", role: "Account Executive" },
  { name: "Jordan Lee", avatar: "https://i.pravatar.cc/200?img=12", role: "Lead Qualifier" },
  { name: "Sam Nguyen", avatar: "https://i.pravatar.cc/200?img=33", role: "CRM Manager" },
];

const AGENT_OPTIONS = [
  { name: "Ari Parker", avatar: "https://i.pravatar.cc/200?img=45", role: "Senior Sales Agent" },
  { name: "Sam Rivera", avatar: "https://i.pravatar.cc/200?img=52", role: "Travel Specialist" },
  { name: "Maya Chen", avatar: "https://i.pravatar.cc/200?img=49", role: "Account Executive" },
  { name: "Jordan Lee", avatar: "https://i.pravatar.cc/200?img=12", role: "Lead Qualifier" },
  { name: "Sam Nguyen", avatar: "https://i.pravatar.cc/200?img=33", role: "CRM Manager" },
];

const SUPPORT_AGENT_OPTIONS = [
  { name: "Alex Vance", avatar: "https://i.pravatar.cc/200?img=11", role: "Customer Success" },
  { name: "Taylor Brooks", avatar: "https://i.pravatar.cc/200?img=20", role: "Operations Lead" },
  { name: "Morgan Ellis", avatar: "https://i.pravatar.cc/200?img=32", role: "Travel Coordinator" },
  { name: "Chris Logan", avatar: "https://i.pravatar.cc/200?img=47", role: "Booking Assistant" },
];

const PRIORITY_CONFIG = {
  High: { label: "High", icon: ShieldCheck, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10", border: "border-rose-200 dark:border-rose-800/50" },
  Medium: { label: "Medium", icon: Warning, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-200 dark:border-amber-800/50" },
  Low: { label: "Low", icon: Info, color: "text-sky-500", bg: "bg-sky-50 dark:bg-sky-500/10", border: "border-sky-200 dark:border-sky-800/50" },
};

function getEventCategory(event: CalendarEvent) {
  return event.category ?? (event.priority === "Low" ? "Archived" : event.priority === "Medium" ? "Public" : "Shared");
}

const EVENTS_BY_DAY: DayEvents = {
  1: [{ id: "e1", title: "Lead Discovery Call", time: "9:00 AM", color: "blue", category: "Shared" }],
  2: [
    { id: "e2", title: "Maldives Package Consultation", clientName: "Mia Reynolds", agent: "Ari Parker", dealNotes: "Review luxury villa options & honeymoon discounts.", time: "10:00 AM", color: "green", attendees: 2, priority: "High", category: "Public", assignees: [MOCK_STAFF[0], MOCK_STAFF[2]] },
    { id: "e3", title: "Switzerland Family Itinerary Review", clientName: "Noah Patel", agent: "Sam Rivera", dealNotes: "Finalize train passes and kid-friendly tours.", time: "4:00 PM", color: "purple", attendees: 5, priority: "Medium", category: "Shared", assignees: [MOCK_STAFF[1]] },
    { id: "e4", title: "Daily Sales Handoff Sync", time: "7:00 PM", color: "red", priority: "Low", category: "Archived" },
  ],
  3: [{ id: "e5", title: "Weekly Lead Pipeline Review", time: "9:00 AM", color: "blue", category: "Shared" }],
  5: [{ id: "e6", title: "Thailand Solo Travel Briefing", clientName: "Sofia Chen", agent: "Jordan Lee", dealNotes: "Solo traveler itinerary and hostel recommendations.", time: "9:00 AM", color: "blue", category: "Public" }],
  6: [
    { id: "e7", title: "Corporate Offsite Proposal", time: "10:30 AM", color: "orange", category: "Shared" },
    { id: "e8", title: "Santorini Wine Tour Booking", time: "2:30 PM", color: "green", category: "Public" },
  ],
  7: [{ id: "e9", title: "Tulum Wedding Package Consult", clientName: "Lucas Garcia", agent: "Ari Parker", dealNotes: "Group accommodation for 50 guests.", time: "9:00 AM", color: "blue", category: "Public" }],
  8: [
    { id: "e10", title: "Kenya Safari VIP Pitch", time: "11:00 AM", color: "green", category: "Public" },
    { id: "e11", title: "Swiss Alps Skiing Quote Review", time: "11:00 AM", color: "purple", category: "Shared" },
  ],
  9: [
    { id: "e12", title: "Q3 Campaign Lead Analysis", time: "9:00 AM", color: "slate", category: "Archived" },
    { id: "e13", title: "Kyoto Cherry Blossom Consultation", time: "1:30 PM", color: "teal", category: "Public" },
  ],
  10: [
    { id: "e14", title: "Amalfi Coast Offsite Briefing", time: "10:00 AM", color: "green", attendees: 30, priority: "Low", category: "Archived" },
    { id: "e15", title: "Lisbon Nomad Trip Planning", time: "10:00 AM", color: "pink", priority: "Medium", category: "Public", assignees: [MOCK_STAFF[0]] },
    { id: "e16", title: "High-Value Deal Closing Call", time: "1:30 PM", color: "blue", priority: "High", category: "Shared", assignees: [MOCK_STAFF[1], MOCK_STAFF[3]] },
  ],
  11: [
    { id: "e17", title: "Europe Multi-City Tour Review", time: "10:30 AM", color: "orange", category: "Shared" },
    { id: "e18", title: "Greek Islands Yacht Pitch", time: "1:00 PM", color: "pink", category: "Public" },
  ],
  14: [
    { id: "e19", title: "Peru Machu Picchu Trek Briefing", time: "3:30 PM", color: "purple", category: "Shared" },
  ],
  15: [
    { id: "e20", title: "Costa Rica Eco-Lodge Consult", time: "10:30 AM", color: "green", category: "Shared" },
    { id: "e21", title: "Weekly Agent Performance Check", time: "4:00 PM", color: "purple", category: "Shared" },
  ],
  16: [
    { id: "e22", title: "Hot Lead Follow-up Call", time: "7:00 AM", color: "red", category: "Public" },
    { id: "e23", title: "Partner Agency Conference", time: "9:30 AM", color: "green", category: "Shared" },
    { id: "e24", title: "Booking Confirmation Review", time: "3:30 PM", color: "blue", category: "Public" },
  ],
  21: [
    { id: "e25", title: "Monthly CRM Revenue Audit", time: "9:00 AM", color: "purple", category: "Archived" },
    { id: "e26", title: "Nutrition & Wellness Retreat Consult", time: "1:00 PM", color: "green", category: "Public" },
    { id: "e27", title: "Urgent Booking Escalation Briefing", time: "7:00 PM", color: "red", category: "Shared" },
  ],
  22: [
    { id: "e28", title: "Vendor & Resort Rates Audit", time: "9:00 AM", color: "slate", category: "Archived" },
    { id: "e29", title: "Luxury Spa Package Presentation", time: "2:30 PM", color: "blue", category: "Public" },
  ],
  30: [
    { id: "e30", title: "Weekend Lead Triage", time: "4:00 PM", color: "purple", category: "Shared" },
    { id: "e31", title: "CRM Onboarding & Sales Training", time: "6:30 PM", color: "red", category: "Archived" },
  ],
};

// ─── Color Map ────────────────────────────────────────────────────────
const COLOR_MAP: Record<string, { bg: string; text: string; dot: string }> = {
  blue: { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-300", dot: "bg-blue-500" },
  green: { bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-700 dark:text-green-300", dot: "bg-green-500" },
  purple: { bg: "bg-purple-50 dark:bg-purple-900/20", text: "text-purple-700 dark:text-purple-300", dot: "bg-purple-500" },
  red: { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-700 dark:text-red-300", dot: "bg-red-500" },
  orange: { bg: "bg-orange-50 dark:bg-orange-900/20", text: "text-orange-700 dark:text-orange-300", dot: "bg-orange-500" },
  slate: { bg: "bg-slate-100 dark:bg-slate-800/40", text: "text-slate-700 dark:text-slate-300", dot: "bg-slate-400" },
  teal: { bg: "bg-teal-50 dark:bg-teal-900/20", text: "text-teal-700 dark:text-teal-300", dot: "bg-teal-500" },
  pink: { bg: "bg-pink-50 dark:bg-pink-900/20", text: "text-pink-700 dark:text-pink-300", dot: "bg-pink-500" },
};

// ─── Helpers ─────────────────────────────────────────────────────────
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  // 0 = Sun, 1 = Mon … shift so Mon = 0
  return (new Date(year, month, 1).getDay() + 6) % 7;
}
function getWeekStartDate(date: Date) {
  const offset = (date.getDay() + 6) % 7;
  return addDays(date, -offset);
}
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// ─── Small Components ─────────────────────────────────────────────────
function EventPill({ event, isPast }: { event: CalendarEvent; isPast?: boolean }) {
  const c = COLOR_MAP[event.color] ?? COLOR_MAP.blue;
  const prio = event.priority ? PRIORITY_CONFIG[event.priority] : null;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn(
        "flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium cursor-pointer truncate border border-transparent",
        c.bg, c.text,
        prio && cn("border-l-2", prio.border)
      )}
    >
      <span className={cn(
        "w-1.5 h-1.5 rounded-full shrink-0",
        c.dot
      )} />
      <span className={cn("truncate", isPast && "line-through decoration-current")}>{event.title}</span>
      <span className="shrink-0 opacity-50">{event.time}</span>
    </motion.div>
  );
}

// ─── Custom Time Picker ──────────────────────────────────────────────
function TimePicker({ value, onChange, label, icon: Icon }: {
  value: string;
  onChange: (val: string) => void;
  label: string;
  icon?: React.ElementType;
}) {
  const [open, setOpen] = React.useState(false);

  // Parse HH:MM
  const [hStr, mStr] = value.split(":");
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const isPM = h >= 12;
  if (h > 12) h -= 12;
  if (h === 0) h = 12;

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

  function updateTime(newH: number, newM: number, newIsPm: boolean) {
    let hr = newH;
    if (newIsPm && hr < 12) hr += 12;
    if (!newIsPm && hr === 12) hr = 0;
    onChange(`${String(hr).padStart(2, "0")}:${String(newM).padStart(2, "0")}`);
    setOpen(false); // Close popover after selection
  }

  const fmt = `${h}:${String(m).padStart(2, "0")} ${isPM ? "PM" : "AM"}`;

  return (
    <div>
      <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 block flex items-center gap-1">
        {Icon && <Icon className="w-3 h-3" />} {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="w-full h-[38px] flex items-center justify-between bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
          >
            {fmt}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl" align="start">
          <div className="flex gap-2">
            {/* Hours */}
            <div className="flex flex-col gap-1 h-48 overflow-y-auto pr-2 no-scrollbar border-r border-zinc-100 dark:border-zinc-800">
              {hours.map(hour => (
                <button
                  key={`h-${hour}`}
                  onClick={() => updateTime(hour, m, isPM)}
                  className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors",
                    h === hour ? "bg-blue-600 text-white font-bold" : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  )}
                >
                  {hour}
                </button>
              ))}
            </div>
            {/* Minutes */}
            <div className="flex flex-col gap-1 h-48 overflow-y-auto pr-2 no-scrollbar border-r border-zinc-100 dark:border-zinc-800">
              {minutes.map(minStr => {
                const min = parseInt(minStr, 10);
                return (
                  <button
                    key={`m-${minStr}`}
                    onClick={() => updateTime(h, min, isPM)}
                    className={cn(
                      "w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors",
                      m === min ? "bg-blue-600 text-white font-bold" : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    )}
                  >
                    {minStr}
                  </button>
                );
              })}
            </div>
            {/* AM/PM */}
            <div className="flex flex-col gap-1">
              {["AM", "PM"].map(period => (
                <button
                  key={period}
                  onClick={() => updateTime(h, m, period === "PM")}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-md text-xs font-bold transition-colors",
                    (period === "PM") === isPM ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  )}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// ─── Add Event Modal (CRM Style matching LeadsPage) ──────────────────
const EVENT_COLORS = [
  { id: "blue", label: "Blue", dot: "bg-blue-500", ring: "ring-blue-400" },
  { id: "green", label: "Green", dot: "bg-green-500", ring: "ring-green-400" },
  { id: "purple", label: "Purple", dot: "bg-purple-500", ring: "ring-purple-400" },
  { id: "red", label: "Red", dot: "bg-red-500", ring: "ring-red-400" },
  { id: "orange", label: "Orange", dot: "bg-orange-500", ring: "ring-orange-400" },
  { id: "teal", label: "Teal", dot: "bg-teal-500", ring: "ring-teal-400" },
  { id: "pink", label: "Pink", dot: "bg-pink-500", ring: "ring-pink-400" },
];

function AddEventModal({ onClose, onAdd, defaultDay, defaultMonth, defaultYear }: {
  onClose: () => void;
  onAdd: (day: number, event: CalendarEvent) => void;
  defaultDay: number;
  defaultMonth: number;
  defaultYear: number;
}) {
  const [title, setTitle] = React.useState("");
  const [date, setDate] = React.useState<Date | undefined>(new Date(defaultYear, defaultMonth, defaultDay));
  const [dateOpen, setDateOpen] = React.useState(false);
  const [startTime, setStart] = React.useState("09:00");
  const [endTime, setEnd] = React.useState("10:00");
  const [color, setColor] = React.useState("blue");
  const [location, setLocation] = React.useState("");
  const [clientName, setClientName] = React.useState("");
  const [agent, setAgent] = React.useState("");
  const [supportAgent, setSupportAgent] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [priority, setPriority] = React.useState<CalendarEvent["priority"]>("Medium");
  const [category, setCategory] = React.useState<CalendarEvent["category"]>("Shared");
  const [attachments, setAttachments] = React.useState<{ name: string; size: string; type: string }[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !date) return;
    const day = date.getDate();
    const fmt = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      const period = h >= 12 ? "PM" : "AM";
      const hr = h % 12 || 12;
      return `${hr}:${String(m).padStart(2, "0")} ${period}`;
    };
    onAdd(day, {
      id: `ev-${Date.now()}`,
      title,
      clientName: clientName.trim() || undefined,
      agent: agent || undefined,
      supportAgent: supportAgent || undefined,
      attachments: attachments.length > 0 ? attachments : undefined,
      time: fmt(startTime),
      endTime: fmt(endTime),
      color,
      location: location || undefined,
      notes: notes.trim() || undefined,
      priority,
      category,
    });
    onClose();
  }

  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-2xl border border-zinc-200/80 dark:border-zinc-800 p-0 overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-zinc-950">
        <div className="p-6 sm:p-8 max-h-[82vh] overflow-y-auto sleek-scroll">

          {/* Top Banner / Header */}
          <div className="mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <DialogHeader className="text-left space-y-0.5">
              <DialogTitle className="text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                Create New Event
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                Configure CRM meetings, client consultations, agent assignments, and travel quotes.
              </DialogDescription>
            </DialogHeader>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Ready to publish
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Row 1: Event Category */}
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-start">
              <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 pt-2 flex items-center gap-1">
                Event Category
                <Question className="size-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer" />
              </label>
              <div className="flex-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-sm text-zinc-800 shadow-xs focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 flex items-center justify-between transition-all outline-none"
                    >
                      <span className="font-medium">{category} Event</span>
                      <CaretDown className="size-4 text-zinc-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64 rounded-xl border-zinc-200 p-1.5 shadow-xl dark:border-zinc-800 bg-white dark:bg-zinc-950 z-[60]">
                    {(["Shared", "Public", "Archived"] as const).map((cat) => (
                      <DropdownMenuItem
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        <span>{cat} Event</span>
                        {category === cat && <CheckCircle className="size-3.5 text-[#34C759]" weight="fill" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Row 2: Event Title */}
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-start">
              <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 pt-2">
                Event Title / Name
              </label>
              <div className="flex-1">
                <input
                  required
                  autoFocus
                  type="text"
                  placeholder="E.g. Maldives Consultation - Mia Reynolds"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-sm text-zinc-800 placeholder:text-zinc-400 shadow-xs outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:placeholder:text-zinc-500 transition-all"
                />
              </div>
            </div>

            {/* Row 3: Staff Assignment */}
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-start">
              <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 pt-2 flex items-center gap-1">
                Assigned Staff
                <Question className="size-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer" />
              </label>
              <div className="flex-1 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Lead Agent */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-sm text-zinc-800 shadow-xs focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 flex items-center justify-between transition-all outline-none"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <User className="size-4 text-zinc-400" />
                          <span className="font-medium truncate text-xs">{agent || "Assign Lead Agent"}</span>
                        </div>
                        <CaretDown className="size-4 text-zinc-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64 rounded-xl border-zinc-200 p-1.5 shadow-xl dark:border-zinc-800 bg-white dark:bg-zinc-950 z-[60]">
                      {AGENT_OPTIONS.map((ag) => (
                        <DropdownMenuItem
                          key={ag.name}
                          onClick={() => setAgent(ag.name)}
                          className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="size-5">
                              <AvatarImage src={ag.avatar} />
                              <AvatarFallback>{ag.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="text-left">
                              <p className="font-semibold text-zinc-900 dark:text-white">{ag.name}</p>
                              <p className="text-[10px] text-zinc-400">{ag.role}</p>
                            </div>
                          </div>
                          {agent === ag.name && <CheckCircle className="size-3.5 text-[#34C759]" weight="fill" />}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Support Agent */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-sm text-zinc-800 shadow-xs focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 flex items-center justify-between transition-all outline-none"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <User className="size-4 text-zinc-400" />
                          <span className="font-medium truncate text-xs">{supportAgent || "Assign Support Agent"}</span>
                        </div>
                        <CaretDown className="size-4 text-zinc-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64 rounded-xl border-zinc-200 p-1.5 shadow-xl dark:border-zinc-800 bg-white dark:bg-zinc-950 z-[60]">
                      {SUPPORT_AGENT_OPTIONS.map((sa) => (
                        <DropdownMenuItem
                          key={sa.name}
                          onClick={() => setSupportAgent(sa.name)}
                          className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="size-5">
                              <AvatarImage src={sa.avatar} />
                              <AvatarFallback>{sa.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="text-left">
                              <p className="font-semibold text-zinc-900 dark:text-white">{sa.name}</p>
                              <p className="text-[10px] text-zinc-400">{sa.role}</p>
                            </div>
                          </div>
                          {supportAgent === sa.name && <CheckCircle className="size-3.5 text-[#34C759]" weight="fill" />}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Row 4: Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-start">
              <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 pt-2 flex items-center gap-1">
                Schedule Timing
                <Question className="size-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer" />
              </label>
              <div className="flex-1 space-y-2.5">
                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-sm text-zinc-800 shadow-xs focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 flex items-center justify-between transition-all outline-none"
                    >
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="size-4 text-zinc-400" />
                        <span className="font-medium">{date ? format(date, "EEEE, MMMM d, yyyy") : "Pick a date"}</span>
                      </div>
                      <CaretDown className="size-4 text-zinc-400" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => { if (d) { setDate(d); setDateOpen(false); } }}
                      initialFocus
                      className="p-3"
                    />
                  </PopoverContent>
                </Popover>

                <div className="grid grid-cols-2 gap-3">
                  <TimePicker value={startTime} onChange={setStart} label="Start Time" icon={Clock} />
                  <TimePicker value={endTime} onChange={setEnd} label="End Time" icon={Clock} />
                </div>
              </div>
            </div>

            {/* Row 5: Location / Channel */}
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-start">
              <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 pt-2">
                Location / Channel
              </label>
              <div className="flex-1">
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="E.g. Google Meet, WhatsApp Call, Office HQ"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-10 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-3.5 text-sm text-zinc-800 placeholder:text-zinc-400 shadow-xs outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Row 6: Client / Lead Details */}
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-start">
              <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 pt-2">
                Client / Lead Details
              </label>
              <div className="flex-1">
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Client Name (e.g. Mia Reynolds, Noah Patel)"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="h-10 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-3.5 text-sm text-zinc-800 placeholder:text-zinc-400 shadow-xs outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Row 7: Priority Level */}
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-start">
              <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 pt-2">
                Priority Level
              </label>
              <div className="flex-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-sm text-zinc-800 shadow-xs focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 flex items-center justify-between transition-all outline-none"
                    >
                      <span className="font-medium">{priority} Priority</span>
                      <CaretDown className="size-4 text-zinc-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 rounded-xl border-zinc-200 p-1.5 shadow-xl dark:border-zinc-800 bg-white dark:bg-zinc-950 z-[60]">
                    {(["High", "Medium", "Low"] as const).map((st) => (
                      <DropdownMenuItem
                        key={st}
                        onClick={() => setPriority(st)}
                        className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        <span>{st} Priority</span>
                        {priority === st && <CheckCircle className="size-3.5 text-[#34C759]" weight="fill" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Row 8: Color Tag & Attachments */}
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-start">
              <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 pt-2">
                Color Tag &amp; Files
              </label>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2.5">
                  {EVENT_COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setColor(c.id)}
                      className={cn(
                        "size-7 rounded-full transition-all flex items-center justify-center cursor-pointer",
                        c.dot,
                        color === c.id ? cn("ring-2 ring-offset-2 dark:ring-offset-zinc-950 scale-110", c.ring) : "opacity-60 hover:opacity-100"
                      )}
                      title={c.label}
                    >
                      {color === c.id && <Check className="size-3.5 text-white stroke-[3]" />}
                    </button>
                  ))}
                </div>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files).map((f) => ({
                      name: f.name,
                      size: f.size > 1024 * 1024 ? `${(f.size / (1024 * 1024)).toFixed(1)} MB` : `${(f.size / 1024).toFixed(0)} KB`,
                      type: f.type,
                    }));
                    setAttachments((prev) => [...prev, ...files]);
                  }}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        const newFiles = Array.from(e.target.files).map((f) => ({
                          name: f.name,
                          size: f.size > 1024 * 1024 ? `${(f.size / (1024 * 1024)).toFixed(1)} MB` : `${(f.size / 1024).toFixed(0)} KB`,
                          type: f.type,
                        }));
                        setAttachments((prev) => [...prev, ...newFiles]);
                      }
                    }}
                  />
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                      <CloudArrowUp className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200">Upload proposals or quotes</p>
                      <p className="text-[10px] text-zinc-400">PDF, DOCX, PNG up to 50MB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 transition-colors shadow-xs flex items-center gap-1"
                  >
                    <Plus className="size-3.5" /> Add files
                  </button>
                </div>

                {attachments.length > 0 && (
                  <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                    {attachments.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <File className="size-3.5 text-zinc-400 shrink-0" />
                          <span className="truncate font-medium text-zinc-700 dark:text-zinc-300">{file.name}</span>
                          <span className="text-[10px] text-zinc-400">({file.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setAttachments((prev) => prev.filter((_, i) => i !== idx)); }}
                          className="text-zinc-400 hover:text-red-500 transition-colors"
                        >
                          <Trash className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Row 9: Meeting & Deal Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-start">
              <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 pt-2">
                Meeting &amp; Deal Notes
              </label>
              <div className="flex-1">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add meeting agenda, deal details, client preferences, or follow-up instructions..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 text-sm font-normal rounded-xl border border-zinc-200 bg-white text-zinc-800 placeholder:text-zinc-400 shadow-xs outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 transition-all resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 mt-8 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-400 dark:text-zinc-500">
                Draft stays private.
              </span>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-9 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-xs flex items-center gap-1.5 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                >
                  <BookmarkSimple className="size-3.5" />
                  Save draft
                </button>

                <button
                  type="submit"
                  className="h-9 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  Save Event
                </button>
              </div>
            </div>

          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CalendarPage({ onBack, onNavigate, pageHistory }: { onBack?: () => void; onNavigate?: (page: string) => void; pageHistory?: string[] } = {}) {
  const today = new Date();
  const [year, setYear] = React.useState(today.getFullYear());
  const [month, setMonth] = React.useState(today.getMonth());
  const [viewMode, setViewMode] = React.useState<"month" | "week" | "day">("month");
  const [activeFilter, setActiveFilter] = React.useState("All events");
  const [selectedDay, setSelectedDay] = React.useState<number | null>(today.getDate());
  const [showModal, setShowModal] = React.useState(false);
  const [detailModalDay, setDetailModalDay] = React.useState<number | null>(null);
  const [eventMap, setEventMap] = React.useState<DayEvents>({ ...EVENTS_BY_DAY });

  function handleAddEvent(day: number, event: CalendarEvent) {
    setEventMap(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), event],
    }));
  }

  const selectedDate = React.useMemo(() => new Date(year, month, selectedDay ?? 1), [year, month, selectedDay]);
  const weekStart = React.useMemo(() => getWeekStartDate(selectedDate), [selectedDate]);
  const weekDates = React.useMemo(() => Array.from({ length: 7 }, (_, idx) => addDays(weekStart, idx)), [weekStart]);

  const eventMatchesFilter = React.useCallback((event: CalendarEvent) => {
    return activeFilter === "All events" || getEventCategory(event) === activeFilter;
  }, [activeFilter]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIdx = getFirstDayOfMonth(year, month);   // 0 = Mon
  const totalCells = Math.ceil((firstDayIdx + daysInMonth) / 7) * 7;

  function updateSelectedDate(date: Date) {
    setYear(date.getFullYear());
    setMonth(date.getMonth());
    setSelectedDay(date.getDate());
  }

  function prevPeriod() {
    if (viewMode === "month") {
      const targetMonth = month === 0 ? 11 : month - 1;
      const targetYear = month === 0 ? year - 1 : year;
      setYear(targetYear);
      setMonth(targetMonth);
      setSelectedDay(prev => Math.min(prev ?? 1, getDaysInMonth(targetYear, targetMonth)));
      return;
    }
    const offset = viewMode === "week" ? -7 : -1;
    updateSelectedDate(addDays(selectedDate, offset));
  }

  function nextPeriod() {
    if (viewMode === "month") {
      const targetMonth = month === 11 ? 0 : month + 1;
      const targetYear = month === 11 ? year + 1 : year;
      setYear(targetYear);
      setMonth(targetMonth);
      setSelectedDay(prev => Math.min(prev ?? 1, getDaysInMonth(targetYear, targetMonth)));
      return;
    }
    const offset = viewMode === "week" ? 7 : 1;
    updateSelectedDate(addDays(selectedDate, offset));
  }

  function goToday() {
    updateSelectedDate(today);
  }

  const headerLabel = viewMode === "month"
    ? `${MONTHS[month]} ${year}`
    : viewMode === "week"
      ? `${format(weekDates[0], "MMM d")} - ${format(weekDates[6], "MMM d, yyyy")}`
      : format(selectedDate, "MMMM d, yyyy");

  const filters = ["All events", "Shared", "Public", "Archived"];
  const selectedEvents = selectedDay != null ? (eventMap[selectedDay] || []).filter(eventMatchesFilter) : [];

  return (
    <div className="flex flex-col gap-5 py-6">

      {/* ── Toolbar ─────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        {/* Left: title + filters */}
        <div className="flex flex-col gap-2">
          {pageHistory && pageHistory.length > 1 && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors w-fit mb-1 cursor-pointer"
            >
              <ArrowLeft weight="bold" size={14} />
              Back to {pageHistory[pageHistory.length - 2] === "dashboard" ? "Dashboard" : pageHistory[pageHistory.length - 2].charAt(0).toUpperCase() + pageHistory[pageHistory.length - 2].slice(1)}
            </button>
          )}
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Calendar</h2>
          <div className="flex items-center gap-1">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  "px-3 py-1 rounded-full text-[12px] font-medium transition-colors",
                  activeFilter === f
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                    : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Right: search + nav + today + view toggle + add */}
        <div className="flex items-center gap-2">
          {/* Period navigation */}
          <div className="flex items-center gap-0.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-0.5">
            <button onClick={prevPeriod} className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
              <CaretLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 px-2">{headerLabel}</span>
            <button onClick={nextPeriod} className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
              <CaretRight className="w-4 h-4" />
            </button>
          </div>

          {/* Today button */}
          <button onClick={goToday} className="px-3 py-1.5 text-xs font-medium border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            Today
          </button>

          {/* View toggle — pill tabs */}
          <div className="relative flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
            {(["Month", "Week", "Day"] as const).map((mode) => {
              const isActive = viewMode === mode.toLowerCase();
              return (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode.toLowerCase() as "month" | "week" | "day")}
                  className={cn(
                    "relative z-10 px-3 py-1 rounded-md text-xs font-semibold transition-all duration-200",
                    isActive
                      ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                  )}
                >
                  {mode}
                </button>
              );
            })}
          </div>

          {/* Add event */}
          <motion.button
            onClick={() => setShowModal(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-gray-700 text-white dark:text-black dark:bg-white dark:hover:bg-gray-200 rounded-md text-xs font-semibold shadow-md shadow-gray-200 dark:shadow-none transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add event
          </motion.button>
        </div>
      </div>

      {/* ── Calendar View ────────────────────────────────────── */}
      <div className="rounded-xl border border-zinc-100 dark:border-zinc-800/60 overflow-hidden">
        {viewMode === "month" && (
          <>
            {/* Day-of-week header */}
            <div className="grid grid-cols-7 border-b border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/80 dark:bg-zinc-900">
              {WEEK_DAYS.map(day => (
                <div key={day} className="py-3 text-center text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider border-r border-zinc-100 dark:border-zinc-800/60 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            {/* Month cells */}
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
                  const isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;
                  const isToday = isCurrentMonth && dayNum === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                  const isPast = isCurrentMonth && !isToday && (
                    year < today.getFullYear() ||
                    (year === today.getFullYear() && month < today.getMonth()) ||
                    (year === today.getFullYear() && month === today.getMonth() && dayNum < today.getDate())
                  );
                  const isSelected = isCurrentMonth && dayNum === selectedDay;
                  const events = (isCurrentMonth && eventMap[dayNum]?.filter(eventMatchesFilter)) || [];
                  const MAX_VISIBLE = 2;
                  const extra = events.length - MAX_VISIBLE;

                  return (
                    <div
                      key={idx}
                      onClick={() => isCurrentMonth && (setSelectedDay(dayNum), setDetailModalDay(dayNum))}
                      className={cn(
                        "min-h-[90px] border-b border-r border-zinc-100 dark:border-zinc-800/60 last:border-r-0 p-2 group cursor-pointer transition-colors",
                        !isCurrentMonth && "bg-zinc-50/60 dark:bg-zinc-900/30",
                        isCurrentMonth && "hover:bg-zinc-50 dark:hover:bg-zinc-900/30",
                        isSelected && !isToday && "bg-blue-50/40 dark:bg-blue-900/10",
                      )}
                    >
                      <div className="flex items-center justify-end mb-1.5">
                        <span className={cn(
                          "w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold transition-colors",
                          !isCurrentMonth && "text-zinc-300 dark:text-zinc-700",
                          isCurrentMonth && !isToday && "text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100",
                          isToday && "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900",
                        )}>
                          {dayNum > 0 && dayNum <= daysInMonth ? dayNum : (dayNum <= 0 ? getDaysInMonth(year, month - 1) + dayNum : dayNum - daysInMonth)}
                        </span>
                      </div>

                      {isCurrentMonth && (
                        <div className="flex flex-col gap-0.5">
                          {events.slice(0, MAX_VISIBLE).map(ev => (
                            <EventPill key={ev.id} event={ev} isPast={isPast} />
                          ))}
                          {extra > 0 && (
                            <div className="text-[10px] font-semibold text-zinc-400 pl-1.5 cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300">
                              {extra} more...
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </>
        )}

        {viewMode === "week" && (
          <div>
            <div className="grid grid-cols-7 border-b border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/80 dark:bg-zinc-900">
              {weekDates.map(date => (
                <div key={date.toISOString()} className="py-3 text-center text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider border-r border-zinc-100 dark:border-zinc-800/60 last:border-r-0">
                  <div>{WEEK_DAYS[(date.getDay() + 6) % 7]}</div>
                  <div className="mt-1 text-sm font-bold text-zinc-900 dark:text-zinc-100">{date.getDate()}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {weekDates.map(date => {
                const dayNum = date.getDate();
                const isCurrentMonth = date.getMonth() === month;
                const isSelected = date.toDateString() === selectedDate.toDateString();
                const events = (isCurrentMonth && eventMap[dayNum]?.filter(eventMatchesFilter)) || [];
                return (
                  <div
                    key={date.toISOString()}
                    onClick={() => {
                      updateSelectedDate(date);
                      setDetailModalDay(dayNum);
                    }}
                    className={cn(
                      "min-h-[160px] border-b border-r border-zinc-100 dark:border-zinc-800/60 p-3 cursor-pointer transition-colors",
                      !isCurrentMonth && "bg-zinc-50/60 dark:bg-zinc-900/30",
                      isSelected && "bg-blue-50/40 dark:bg-blue-900/10",
                      "hover:bg-zinc-50 dark:hover:bg-zinc-900/30"
                    )}
                  >
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">{format(date, "MMM d")}</div>
                    <div className="space-y-1">
                      {events.length > 0 ? (
                        events.map(ev => <EventPill key={ev.id} event={ev} isPast={date.toDateString() !== today.toDateString() && date < today} />)
                      ) : (
                        <div className="text-xs text-zinc-400">No events</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {viewMode === "day" && (
          <div className="p-6">
            <div className="mb-4 border-b border-zinc-100 dark:border-zinc-800/60 pb-3">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">{format(selectedDate, "EEEE")}</div>
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{format(selectedDate, "MMMM d, yyyy")}</div>
            </div>
            <div className="space-y-3">
              {((eventMap[selectedDate.getDate()] || []).filter(eventMatchesFilter)).length > 0 ? (
                ((eventMap[selectedDate.getDate()] || []).filter(eventMatchesFilter)).map(ev => {
                  const c = COLOR_MAP[ev.color] ?? COLOR_MAP.blue;
                  const prio = ev.priority ? PRIORITY_CONFIG[ev.priority] : null;
                  return (
                    <div key={ev.id} className={cn("rounded-3xl border p-4", c.bg, c.text, "border-transparent")}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold">{ev.title}</div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">{ev.time}</div>
                      </div>
                      {ev.location && <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-300">{ev.location}</div>}
                      {prio && (
                        <div className={cn("mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold", prio.bg, prio.color)}>
                          <prio.icon className="w-3 h-3" /> {prio.label}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  No events scheduled for this day.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Selected Day Panel (mini bottom bar) ─────────────── */}
      <AnimatePresence>
        {selectedDay != null && selectedEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="shrink-0 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800/60 px-6 py-3 flex items-center gap-6 overflow-x-auto no-scrollbar"
          >
            <div className="flex items-center gap-2 shrink-0">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                {MONTHS[month].slice(0, 3)} {selectedDay}
              </span>
            </div>
            {selectedEvents.map(ev => {
              const c = COLOR_MAP[ev.color] ?? COLOR_MAP.blue;
              const prio = ev.priority ? PRIORITY_CONFIG[ev.priority] : null;
              return (
                <div key={ev.id} className={cn("flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0", c.bg, c.text)}>
                  <span className={cn("w-2 h-2 rounded-full", c.dot)} />
                  <div className="flex flex-col">
                    <span>{ev.title}</span>
                    <div className="flex items-center gap-2 mt-0.5 opacity-70 text-[10px]">
                      <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{ev.time}</span>
                      {prio && (
                        <span className={cn("flex items-center gap-1 font-black uppercase tracking-widest", prio.color)}>
                          <prio.icon className="w-2.5 h-2.5" weight="bold" /> {prio.label}
                        </span>
                      )}
                    </div>
                  </div>

                  {ev.assignees && ev.assignees.length > 0 && (
                    <div className="flex -space-x-2 ml-1">
                      {ev.assignees.map((s, i) => (
                        <Avatar key={i} className="size-6 border-2 border-white dark:border-zinc-950 ring-1 ring-zinc-200/50 dark:ring-zinc-800/50">
                          <AvatarImage src={s.avatar} alt={s.name} />
                          <AvatarFallback className="text-[8px]">{s.name[0]}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <AddEventModal
            onClose={() => setShowModal(false)}
            onAdd={handleAddEvent}
            defaultDay={selectedDay || today.getDate()}
            defaultMonth={month}
            defaultYear={year}
          />
        )}
        {detailModalDay != null && (
          <DayDetailModal
            day={detailModalDay}
            month={month}
            year={year}
            events={(eventMap[detailModalDay] || []).filter(eventMatchesFilter)}
            onClose={() => setDetailModalDay(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function DayDetailModal({ day, month, year, events, onClose }: {
  day: number;
  month: number;
  year: number;
  events: CalendarEvent[];
  onClose: () => void;
}) {
  const [showAllEvents, setShowAllEvents] = React.useState(false);
  const selectedDate = new Date(year, month, day);
  const primaryEvent = events[0];
  const extraEvents = events.slice(1);

  const renderEventCard = (ev: CalendarEvent) => {
    const c = COLOR_MAP[ev.color] ?? COLOR_MAP.blue;
    const prio = ev.priority ? PRIORITY_CONFIG[ev.priority] : null;
    const badgeColor = ev.category === "Shared"
      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
      : ev.category === "Public"
        ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
        : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";

    return (
      <div key={ev.id} className={cn("rounded-3xl border p-5 shadow-sm", c.bg, c.text, "border-transparent")}>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 truncate">{ev.title}</p>
                <div className="mt-2 grid gap-2 text-sm text-zinc-600 dark:text-zinc-300 sm:grid-cols-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    <Clock className="w-3.5 h-3.5" /> {ev.time}{ev.endTime ? ` - ${ev.endTime}` : ""}
                  </span>
                  {ev.location && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      <MapPin className="w-3.5 h-3.5" /> {ev.location}
                    </span>
                  )}
                  {ev.patientName && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      Patient: {ev.patientName}
                    </span>
                  )}
                  {ev.nurse && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      Nurse: {ev.nurse}
                    </span>
                  )}
                  {ev.attendees != null && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      <Users className="w-3.5 h-3.5" /> {ev.attendees} attendee{ev.attendees === 1 ? "" : "s"}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]", badgeColor)}>{ev.category ?? "Shared"}</span>
                {prio && (
                  <span className={cn("inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold", prio.bg, prio.color)}>
                    <prio.icon className="w-3 h-3" /> {prio.label}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {ev.report && (
                <div className="rounded-3xl bg-white/80 dark:bg-zinc-950/80 p-4 border border-zinc-100 dark:border-zinc-800">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Report</p>
                  <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">{ev.report}</p>
                </div>
              )}
              {ev.notes && (
                <div className="rounded-3xl bg-white/80 dark:bg-zinc-950/80 p-4 border border-zinc-100 dark:border-zinc-800">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Notes</p>
                  <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">{ev.notes}</p>
                </div>
              )}
              {ev.assignees && ev.assignees.length > 0 && (
                <div className="rounded-3xl bg-white/80 dark:bg-zinc-950/80 p-4 border border-zinc-100 dark:border-zinc-800">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Assigned staff</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {ev.assignees.map((s, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-2xl bg-zinc-100 px-3 py-2 text-xs text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                        <Avatar className="size-6 border-2 border-white dark:border-zinc-950 ring-1 ring-zinc-200/50 dark:ring-zinc-800/50">
                          <AvatarImage src={s.avatar} alt={s.name} />
                          <AvatarFallback className="text-[8px]">{s.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-semibold truncate">{s.name}</p>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{s.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        className="relative z-10 w-full max-w-2xl rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 shadow-2xl overflow-hidden"
      >
        <div className="flex items-start justify-between gap-4 p-6 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">Day details</p>
            <h2 className="mt-2 text-xl font-bold text-zinc-900 dark:text-zinc-100">{format(selectedDate, "EEEE, MMMM d, yyyy")}</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{events.length} event{events.length === 1 ? "" : "s"}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {events.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 p-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
              No events scheduled for this day.
            </div>
          ) : (
            <>
              {events.length > 1 && (
                <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{events.length} events scheduled</p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Tap the button to expand the full event list.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAllEvents(prev => !prev)}
                      className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
                    >
                      {showAllEvents ? `Hide ${events.length} events` : `View all ${events.length} events`}
                    </button>
                  </div>
                </div>
              )}

              {primaryEvent && renderEventCard(primaryEvent)}

              {showAllEvents && extraEvents.length > 0 && (
                <div className="space-y-4">
                  {extraEvents.map(ev => renderEventCard(ev))}
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
