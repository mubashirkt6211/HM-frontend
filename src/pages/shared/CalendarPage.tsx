import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { addDays, format } from "date-fns";
import {
  CaretLeft, CaretRight, Plus, Clock, Users,
  X, Calendar as CalendarIcon, MapPin,
  ShieldCheck, Warning, Info, Check,
  File, Trash, CloudArrowUp, Flag, ArrowRight, ArrowLeft,
  CaretDown, Question, CheckCircle, BookmarkSimple, User, Buildings,
  VideoCamera, Phone, Envelope, LinkSimple, Paperclip, CurrencyDollar, TrendUp, WarningDiamond
} from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
import { Button } from "@/components/ui/button";

// ─── Types ───────────────────────────────────────────────────────────
type CalendarEvent = {
  id: string;
  title: string;
  clientName?: string;
  companyName?: string;
  dealValue?: number;
  dealStage?: string;
  agent?: string;
  supportAgent?: string;
  meetingMode?: "Video Call" | "In-Person" | "Phone Call";
  meetingUrl?: string;
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
  assignees?: { name: string; avatar?: string; role: string; rsvp?: "Accepted" | "Pending" | "Declined" }[];
};

type DayEvents = { [key: number]: CalendarEvent[] };

// ─── CRM Mock Data ───────────────────────────────────────────────────
const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MOCK_STAFF = [
  { name: "Ari Parker", avatar: "https://i.pravatar.cc/200?img=45", role: "Senior Sales Agent", rsvp: "Accepted" as const },
  { name: "Sam Rivera", avatar: "https://i.pravatar.cc/200?img=52", role: "Account Specialist", rsvp: "Accepted" as const },
  { name: "Maya Chen", avatar: "https://i.pravatar.cc/200?img=49", role: "Account Executive", rsvp: "Pending" as const },
  { name: "Jordan Lee", avatar: "https://i.pravatar.cc/200?img=12", role: "Lead Qualifier", rsvp: "Accepted" as const },
  { name: "Sam Nguyen", avatar: "https://i.pravatar.cc/200?img=33", role: "CRM Manager", rsvp: "Accepted" as const },
];

const AGENT_OPTIONS = [
  { name: "Ari Parker", avatar: "https://i.pravatar.cc/200?img=45", role: "Senior Sales Agent" },
  { name: "Sam Rivera", avatar: "https://i.pravatar.cc/200?img=52", role: "Account Specialist" },
  { name: "Maya Chen", avatar: "https://i.pravatar.cc/200?img=49", role: "Account Executive" },
  { name: "Jordan Lee", avatar: "https://i.pravatar.cc/200?img=12", role: "Lead Qualifier" },
  { name: "Sam Nguyen", avatar: "https://i.pravatar.cc/200?img=33", role: "CRM Manager" },
];

const SUPPORT_AGENT_OPTIONS = [
  { name: "Alex Vance", avatar: "https://i.pravatar.cc/200?img=11", role: "Customer Success Lead" },
  { name: "Taylor Brooks", avatar: "https://i.pravatar.cc/200?img=20", role: "Operations Lead" },
  { name: "Morgan Ellis", avatar: "https://i.pravatar.cc/200?img=32", role: "Solutions Engineer" },
  { name: "Chris Logan", avatar: "https://i.pravatar.cc/200?img=47", role: "Technical Specialist" },
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
  1: [
    {
      id: "e1",
      title: "Discovery Call - Nexus Cloud",
      clientName: "Alex Mercer (CTO)",
      companyName: "Nexus Cloud Technologies",
      dealValue: 145000,
      dealStage: "New Leads",
      agent: "Ari Parker",
      supportAgent: "Alex Vance",
      meetingMode: "Video Call",
      meetingUrl: "https://meet.google.com/crm-nexus-discovery",
      time: "9:00 AM",
      endTime: "9:45 AM",
      color: "blue",
      category: "Shared",
      priority: "High",
      dealNotes: "Discuss enterprise multi-tenant setup, security compliance (SOC2), and custom API integration requirements.",
      assignees: [
        { name: "Ari Parker", avatar: "https://i.pravatar.cc/200?img=45", role: "Senior Sales Agent", rsvp: "Accepted" },
        { name: "Alex Mercer", avatar: "https://i.pravatar.cc/200?img=60", role: "Client CTO", rsvp: "Accepted" },
      ],
      attachments: [
        { name: "Nexus_Discovery_Agenda.pdf", size: "1.4 MB", type: "pdf" },
        { name: "Enterprise_SaaS_Architecture.png", size: "3.2 MB", type: "png" },
      ],
    },
  ],
  2: [
    {
      id: "e2",
      title: "Vanguard FinTech Consultation",
      clientName: "Rachel Sterling (VP Procurement)",
      companyName: "Vanguard Financial Systems",
      dealValue: 110000,
      dealStage: "Open Discussion",
      agent: "Ari Parker",
      supportAgent: "Maya Chen",
      meetingMode: "Video Call",
      meetingUrl: "https://meet.google.com/crm-vanguard-pitch",
      time: "10:00 AM",
      endTime: "11:00 AM",
      color: "green",
      attendees: 3,
      priority: "High",
      category: "Public",
      dealNotes: "Review security compliance certificates, SLA guarantees, and enterprise volume discount structure.",
      assignees: [MOCK_STAFF[0], MOCK_STAFF[2]],
      attachments: [
        { name: "Vanguard_Enterprise_SLA_Quote.pdf", size: "2.1 MB", type: "pdf" },
      ],
    },
    {
      id: "e3",
      title: "Apex Logistics Contract Review",
      clientName: "Marcus Vance (COO)",
      companyName: "Apex Logistics Global",
      dealValue: 75000,
      dealStage: "In-Progress",
      agent: "Sam Rivera",
      supportAgent: "Taylor Brooks",
      meetingMode: "In-Person",
      location: "Apex HQ, Chicago IL",
      time: "4:00 PM",
      endTime: "5:00 PM",
      color: "purple",
      attendees: 4,
      priority: "Medium",
      category: "Shared",
      dealNotes: "Finalize annual contract terms, SLA commitments, and onboarding timelines for 200 supply chain users.",
      assignees: [MOCK_STAFF[1]],
    },
    {
      id: "e4",
      title: "Daily Sales Handoff Sync",
      time: "7:00 PM",
      color: "red",
      priority: "Low",
      category: "Archived",
    },
  ],
  3: [{ id: "e5", title: "Weekly Lead Pipeline Review", time: "9:00 AM", color: "blue", category: "Shared" }],
  5: [{ id: "e6", title: "OmniMedia AI Strategy Session", clientName: "Elena Rostova", companyName: "OmniMedia Digital", dealValue: 48000, dealStage: "Open Deal", agent: "Jordan Lee", time: "9:00 AM", color: "blue", category: "Public" }],
  6: [
    { id: "e7", title: "Corporate Software Expansion Proposal", time: "10:30 AM", color: "orange", category: "Shared" },
    { id: "e8", title: "Quarterly Account Review", time: "2:30 PM", color: "green", category: "Public" },
  ],
  7: [{ id: "e9", title: "Enterprise SLA Negotiation", clientName: "Lucas Garcia", agent: "Ari Parker", dealNotes: "Group license onboarding for 150 team members.", time: "9:00 AM", color: "blue", category: "Public" }],
  8: [
    { id: "e10", title: "FinTech Security Pitch", time: "11:00 AM", color: "green", category: "Public" },
    { id: "e11", title: "Cloud Infrastructure Quote Review", time: "11:00 AM", color: "purple", category: "Shared" },
  ],
  10: [
    { id: "e16", title: "High-Value Deal Closing Call", clientName: "David Sterling", companyName: "Vanguard FinTech", dealValue: 110000, dealStage: "Won Customer", agent: "Ari Parker", time: "1:30 PM", color: "blue", priority: "High", category: "Shared", assignees: [MOCK_STAFF[1], MOCK_STAFF[3]] },
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

const EVENT_COLORS = [
  { id: "blue", label: "Blue", dot: "bg-blue-500", ring: "ring-blue-400" },
  { id: "green", label: "Green", dot: "bg-green-500", ring: "ring-green-400" },
  { id: "purple", label: "Purple", dot: "bg-purple-500", ring: "ring-purple-400" },
  { id: "red", label: "Red", dot: "bg-red-500", ring: "ring-red-400" },
  { id: "orange", label: "Orange", dot: "bg-orange-500", ring: "ring-orange-400" },
  { id: "teal", label: "Teal", dot: "bg-teal-500", ring: "ring-teal-400" },
  { id: "pink", label: "Pink", dot: "bg-pink-500", ring: "ring-pink-400" },
];

// ─── Helpers ─────────────────────────────────────────────────────────
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return (new Date(year, month, 1).getDay() + 6) % 7;
}
function getWeekStartDate(date: Date) {
  const offset = (date.getDay() + 6) % 7;
  return addDays(date, -offset);
}
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// ─── Custom Time Picker Component ─────────────────────────────────────
function TimePicker({ value, onChange, label, icon: Icon }: {
  value: string;
  onChange: (val: string) => void;
  label: string;
  icon?: React.ElementType;
}) {
  const [open, setOpen] = React.useState(false);

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
    setOpen(false);
  }

  const fmt = `${h}:${String(m).padStart(2, "0")} ${isPM ? "PM" : "AM"}`;

  return (
    <div>
      <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 flex items-center gap-1">
        {Icon && <Icon className="w-3 h-3" />} {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="w-full h-[38px] flex items-center justify-between bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 cursor-pointer"
          >
            {fmt}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl" align="start">
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 h-48 overflow-y-auto pr-2 no-scrollbar border-r border-zinc-100 dark:border-zinc-800">
              {hours.map(hour => (
                <button
                  key={`h-${hour}`}
                  onClick={() => updateTime(hour, m, isPM)}
                  className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors cursor-pointer",
                    h === hour ? "bg-blue-600 text-white font-bold" : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  )}
                >
                  {hour}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-1 h-48 overflow-y-auto pr-2 no-scrollbar border-r border-zinc-100 dark:border-zinc-800">
              {minutes.map(minStr => {
                const min = parseInt(minStr, 10);
                return (
                  <button
                    key={`m-${minStr}`}
                    onClick={() => updateTime(h, min, isPM)}
                    className={cn(
                      "w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors cursor-pointer",
                      m === min ? "bg-blue-600 text-white font-bold" : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    )}
                  >
                    {minStr}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-col gap-1">
              {["AM", "PM"].map(period => (
                <button
                  key={period}
                  onClick={() => updateTime(h, m, period === "PM")}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-md text-xs font-bold transition-colors cursor-pointer",
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

// ─── Small Components ─────────────────────────────────────────────────
function EventPill({ event, isPast }: { event: CalendarEvent; isPast?: boolean }) {
  const c = COLOR_MAP[event.color] ?? COLOR_MAP.blue;
  const prio = event.priority ? PRIORITY_CONFIG[event.priority] : null;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn(
        "flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium cursor-pointer truncate border border-transparent hover:shadow-xs transition-all",
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

// ─── ORIGINAL FULL-FEATURED ADD EVENT MODAL (RESTORED OLD STYLE) ──────
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
        <div className="p-6 sm:p-8 max-h-[82vh] overflow-y-auto sleek-scroll space-y-6">

          {/* Top Banner Header */}
          <div className="pb-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <DialogHeader className="text-left space-y-0.5">
              <DialogTitle className="text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                Create New Event
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                Configure CRM meetings, client consultations, agent assignments, and proposals.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-2 pr-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Ready to publish
              </span>
            </div>
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
                      className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-sm text-zinc-800 shadow-xs focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 flex items-center justify-between transition-all outline-none cursor-pointer"
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
                  className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-sm text-zinc-800 placeholder:text-zinc-400 shadow-xs outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 transition-all"
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-sm text-zinc-800 shadow-xs focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 flex items-center justify-between transition-all outline-none cursor-pointer"
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

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-sm text-zinc-800 shadow-xs focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 flex items-center justify-between transition-all outline-none cursor-pointer"
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
                      className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-sm text-zinc-800 shadow-xs focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 flex items-center justify-between transition-all outline-none cursor-pointer"
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

            {/* Row 5: Priority Level & Color Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-start">
              <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 pt-2">
                Priority &amp; Color Tag
              </label>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  {(["High", "Medium", "Low"] as const).map((p) => {
                    const cfg = PRIORITY_CONFIG[p];
                    const isSel = priority === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border",
                          isSel
                            ? cn(cfg.bg, cfg.color, cfg.border, "shadow-xs")
                            : "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                        )}
                      >
                        <cfg.icon className="size-3.5" />
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {EVENT_COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setColor(c.id)}
                      className={cn(
                        "size-6 rounded-full transition-transform cursor-pointer flex items-center justify-center",
                        c.dot,
                        color === c.id && cn("ring-2 ring-offset-2 dark:ring-offset-zinc-950 scale-110", c.ring)
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Row 6: Location */}
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-start">
              <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 pt-2">
                Location / Link
              </label>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3.5 top-3 size-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="E.g. Conference Room A / Zoom Link"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-10 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-3.5 text-sm text-zinc-800 placeholder:text-zinc-400 shadow-xs outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 transition-all"
                />
              </div>
            </div>

            {/* Row 7: Proposal & Attachments Uploader */}
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-start">
              <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 pt-2">
                Proposals &amp; Documents
              </label>
              <div className="flex-1 space-y-3">
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
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 transition-colors shadow-xs flex items-center gap-1 cursor-pointer"
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
                          className="text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <Trash className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Row 8: Meeting & Deal Notes */}
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

            {/* Footer Buttons */}
            <div className="pt-6 mt-8 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-400 dark:text-zinc-500">
                Draft stays private.
              </span>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-9 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-xs flex items-center gap-1.5 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
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

// ─── RICH CRM SINGLE EVENT DETAILS MODAL ───
function SingleEventDetailModal({
  event,
  onClose,
  onDelete,
}: {
  event: CalendarEvent;
  onClose: () => void;
  onDelete: (eventId: string) => void;
}) {
  const [toastMsg, setToastMsg] = React.useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false);
  const c = COLOR_MAP[event.color] ?? COLOR_MAP.blue;
  const prio = event.priority ? PRIORITY_CONFIG[event.priority] : null;

  const handleSendReminder = () => {
    setToastMsg(`📧 Meeting reminder & Google Calendar invite dispatched to attendees!`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  return (
    <>
      <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
        <DialogContent className="sm:max-w-xl border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-2xl bg-white dark:bg-zinc-950 space-y-4 max-h-[88vh] overflow-y-auto sleek-scroll">
          
          {/* Toast Feedback */}
          {toastMsg && (
            <div className="p-2.5 rounded-lg bg-zinc-900 text-white text-xs font-bold shadow-xl flex items-center gap-2">
              <span>{toastMsg}</span>
            </div>
          )}

          <DialogHeader className="text-left space-y-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider", c.bg, c.text)}>
                  {event.category ?? "Shared"} Event
                </span>
                {event.meetingMode && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    {event.meetingMode === "Video Call" ? <VideoCamera className="size-3 text-emerald-500" /> : <Phone className="size-3 text-blue-500" />}
                    {event.meetingMode}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 pr-6">
                {prio && (
                  <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold", prio.bg, prio.color)}>
                    <prio.icon className="size-3" />
                    {prio.label} Priority
                  </span>
                )}
              </div>
            </div>

            <div>
              <DialogTitle className="text-xl font-extrabold text-zinc-900 dark:text-white">
                {event.title}
              </DialogTitle>
              {event.companyName && (
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5 flex items-center gap-1">
                  <Buildings className="size-3.5" />
                  <span>{event.companyName}</span>
                </p>
              )}
            </div>
          </DialogHeader>

          {/* Dynamic CRM Info Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-0.5">
              <p className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
                <Clock className="size-3 text-zinc-500" /> Time Schedule
              </p>
              <p className="font-extrabold text-xs text-zinc-900 dark:text-white">
                {event.time} {event.endTime ? `- ${event.endTime}` : ""}
              </p>
            </div>

            {event.dealValue ? (
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-0.5">
                <p className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
                  <CurrencyDollar className="size-3 text-emerald-500" /> Deal Value (ACV)
                </p>
                <p className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400">
                  ${event.dealValue.toLocaleString()}
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-0.5">
                <p className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
                  <Users className="size-3 text-blue-500" /> Total Attendees
                </p>
                <p className="font-extrabold text-xs text-zinc-900 dark:text-white">
                  {event.attendees ?? (event.assignees?.length || 2)} Confirmed
                </p>
              </div>
            )}

            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-0.5 col-span-2 sm:col-span-1">
              <p className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
                <TrendUp className="size-3 text-purple-500" /> Pipeline Stage
              </p>
              <p className="font-extrabold text-xs text-zinc-900 dark:text-white">
                {event.dealStage || "Open Deal"}
              </p>
            </div>
          </div>

          {/* Client & Assigned Staff Roster */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-extrabold text-zinc-900 dark:text-white flex items-center justify-between">
              <span>Meeting Participants & RSVPs</span>
              <span className="text-[10px] text-zinc-400 font-semibold">Verified CRM Contacts</span>
            </h4>

            <div className="space-y-2">
              {event.clientName && (
                <div className="p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/70 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                      <User className="size-4" />
                    </div>
                    <div>
                      <p className="font-extrabold text-zinc-900 dark:text-white">{event.clientName}</p>
                      <p className="text-[10px] text-zinc-400 font-semibold">Client Representative</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                    Accepted
                  </span>
                </div>
              )}

              {event.agent && (
                <div className="p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/70 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-8 border border-zinc-200 dark:border-zinc-700">
                      <AvatarImage src="https://i.pravatar.cc/200?img=45" />
                      <AvatarFallback>AP</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-extrabold text-zinc-900 dark:text-white">{event.agent}</p>
                      <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">Lead Sales Representative</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                    Organizer
                  </span>
                </div>
              )}

              {event.supportAgent && (
                <div className="p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/70 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-8 border border-zinc-200 dark:border-zinc-700">
                      <AvatarImage src="https://i.pravatar.cc/200?img=11" />
                      <AvatarFallback>AV</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-extrabold text-zinc-900 dark:text-white">{event.supportAgent}</p>
                      <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">Support Coordinator</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                    Accepted
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Deal Briefing & Meeting Notes */}
          {(event.notes || event.dealNotes) && (
            <div className="space-y-1.5 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-xs">
              <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">Meeting Agenda &amp; Notes</p>
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                {event.notes || event.dealNotes}
              </p>
            </div>
          )}

          {/* Attachments Section */}
          {event.attachments && event.attachments.length > 0 && (
            <div className="space-y-2 text-xs">
              <p className="font-extrabold text-zinc-900 dark:text-white flex items-center justify-between">
                <span>Attached Proposals &amp; Docs ({event.attachments.length})</span>
              </p>
              <div className="space-y-1.5">
                {event.attachments.map((att, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2 min-w-0">
                      <File className="size-4 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span className="font-bold text-zinc-900 dark:text-white truncate">{att.name}</span>
                      <span className="text-[10px] text-zinc-400">({att.size})</span>
                    </div>
                    <button className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Quick Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800 gap-2 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowConfirmDelete(true)}
              className="text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl cursor-pointer"
            >
              <Trash className="size-3.5 mr-1" />
              Delete Event
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSendReminder}
                className="text-xs font-bold border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer"
              >
                <Envelope className="size-3.5 mr-1 text-zinc-500" />
                Send Reminder
              </Button>

              {event.meetingUrl ? (
                <Button
                  size="sm"
                  onClick={() => window.open(event.meetingUrl, "_blank")}
                  className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <VideoCamera className="size-4" />
                  <span>Join Call</span>
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={onClose}
                  className="text-xs font-bold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 rounded-xl px-4 cursor-pointer"
                >
                  Close
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── POSTMAN-STYLE DELETE CONFIRMATION MODAL ── */}
      <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
        <DialogContent className="sm:max-w-md border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-2xl bg-white dark:bg-zinc-950 space-y-4">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center font-bold shrink-0">
              <WarningDiamond className="size-5" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-base font-extrabold text-zinc-900 dark:text-white">
                Delete Event Confirmation
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                Are you sure you want to delete <span className="font-extrabold text-zinc-900 dark:text-zinc-100">"{event.title}"</span>? This action cannot be undone.
              </DialogDescription>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs space-y-1">
            <p className="font-extrabold text-zinc-900 dark:text-white">{event.title}</p>
            <p className="text-zinc-500 dark:text-zinc-400 text-[11px] font-semibold">
              {event.time} {event.endTime ? `- ${event.endTime}` : ""} • {event.companyName || event.clientName || "CRM Meeting"}
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfirmDelete(false)}
              className="rounded-xl text-xs font-bold border-zinc-200 dark:border-zinc-800 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                onDelete(event.id);
                setShowConfirmDelete(false);
                onClose();
              }}
              className="rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-md"
            >
              Yes, Delete Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
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
  const [selectedEvent, setSelectedEvent] = React.useState<CalendarEvent | null>(null);
  const [eventMap, setEventMap] = React.useState<DayEvents>({ ...EVENTS_BY_DAY });

  function handleAddEvent(day: number, event: CalendarEvent) {
    setEventMap(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), event],
    }));
  }

  function handleDeleteEvent(eventId: string) {
    setEventMap(prev => {
      const updated: DayEvents = {};
      Object.keys(prev).forEach(dayStr => {
        const dayNum = Number(dayStr);
        updated[dayNum] = (prev[dayNum] || []).filter(e => e.id !== eventId);
      });
      return updated;
    });
  }

  const selectedDate = React.useMemo(() => new Date(year, month, selectedDay ?? 1), [year, month, selectedDay]);
  const weekStart = React.useMemo(() => getWeekStartDate(selectedDate), [selectedDate]);
  const weekDates = React.useMemo(() => Array.from({ length: 7 }, (_, idx) => addDays(weekStart, idx)), [weekStart]);

  const eventMatchesFilter = React.useCallback((event: CalendarEvent) => {
    return activeFilter === "All events" || getEventCategory(event) === activeFilter;
  }, [activeFilter]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIdx = getFirstDayOfMonth(year, month);
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
                  "px-3 py-1 rounded-full text-[12px] font-medium transition-colors cursor-pointer",
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

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-0.5">
            <button onClick={prevPeriod} className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors cursor-pointer">
              <CaretLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 px-2">{headerLabel}</span>
            <button onClick={nextPeriod} className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors cursor-pointer">
              <CaretRight className="w-4 h-4" />
            </button>
          </div>

          <button onClick={goToday} className="px-3 py-1.5 text-xs font-medium border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
            Today
          </button>

          <div className="relative flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
            {(["Month", "Week", "Day"] as const).map((mode) => {
              const isActive = viewMode === mode.toLowerCase();
              return (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode.toLowerCase() as "month" | "week" | "day")}
                  className={cn(
                    "relative z-10 px-3 py-1 rounded-md text-xs font-semibold transition-all duration-200 cursor-pointer",
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

          <motion.button
            onClick={() => setShowModal(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-gray-700 text-white dark:text-black dark:bg-white dark:hover:bg-gray-200 rounded-md text-xs font-semibold shadow-md cursor-pointer transition-colors"
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
            <div className="grid grid-cols-7 border-b border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/80 dark:bg-zinc-900">
              {WEEK_DAYS.map(day => (
                <div key={day} className="py-3 text-center text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider border-r border-zinc-100 dark:border-zinc-800/60 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

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
                            <div
                              key={ev.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(ev);
                              }}
                            >
                              <EventPill event={ev} isPast={isPast} />
                            </div>
                          ))}
                          {extra > 0 && (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDay(dayNum);
                                setDetailModalDay(dayNum);
                              }}
                              className="text-[10px] font-semibold text-zinc-400 pl-1.5 cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300"
                            >
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
                        events.map(ev => (
                          <div
                            key={ev.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(ev);
                            }}
                          >
                            <EventPill event={ev} isPast={date.toDateString() !== today.toDateString() && date < today} />
                          </div>
                        ))
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
                    <div
                      key={ev.id}
                      onClick={() => setSelectedEvent(ev)}
                      className={cn("rounded-3xl border p-4 cursor-pointer hover:opacity-90 transition-opacity", c.bg, c.text, "border-transparent")}
                    >
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

      {/* ── Mini Bottom Bar ── */}
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
                <div
                  key={ev.id}
                  onClick={() => setSelectedEvent(ev)}
                  className={cn("flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 cursor-pointer hover:opacity-90 transition-all", c.bg, c.text)}
                >
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

      {/* Modals */}
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
        {selectedEvent && (
          <SingleEventDetailModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onDelete={handleDeleteEvent}
          />
        )}
        {detailModalDay != null && !selectedEvent && (
          <DayDetailModal
            day={detailModalDay}
            month={month}
            year={year}
            events={(eventMap[detailModalDay] || []).filter(eventMatchesFilter)}
            onClose={() => setDetailModalDay(null)}
            onSelectEvent={(ev) => setSelectedEvent(ev)}
            onOpenAddEvent={() => {
              setSelectedDay(detailModalDay);
              setDetailModalDay(null);
              setShowModal(true);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function DayDetailModal({ day, month, year, events, onClose, onSelectEvent, onOpenAddEvent }: {
  day: number;
  month: number;
  year: number;
  events: CalendarEvent[];
  onClose: () => void;
  onSelectEvent: (event: CalendarEvent) => void;
  onOpenAddEvent: () => void;
}) {
  const selectedDate = new Date(year, month, day);

  const renderEventCard = (ev: CalendarEvent) => {
    const c = COLOR_MAP[ev.color] ?? COLOR_MAP.blue;
    const prio = ev.priority ? PRIORITY_CONFIG[ev.priority] : null;
    const badgeColor = ev.category === "Shared"
      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
      : ev.category === "Public"
        ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
        : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";

    return (
      <div
        key={ev.id}
        onClick={() => {
          onClose();
          onSelectEvent(ev);
        }}
        className={cn("rounded-3xl border p-5 shadow-sm cursor-pointer hover:shadow-md transition-all", c.bg, c.text, "border-transparent")}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 truncate">{ev.title}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                  <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    <Clock className="w-3.5 h-3.5" /> {ev.time}{ev.endTime ? ` - ${ev.endTime}` : ""}
                  </span>
                  {ev.location && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      <MapPin className="w-3.5 h-3.5" /> {ev.location}
                    </span>
                  )}
                  {ev.companyName && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                      <Buildings className="w-3.5 h-3.5" /> {ev.companyName}
                    </span>
                  )}
                  {ev.dealValue && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                      ${ev.dealValue.toLocaleString()} ACV
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider", badgeColor)}>{ev.category ?? "Shared"}</span>
                {prio && (
                  <span className={cn("inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-extrabold", prio.bg, prio.color)}>
                    <prio.icon className="w-3 h-3" /> {prio.label}
                  </span>
                )}
              </div>
            </div>
            {(ev.dealNotes || ev.notes) && (
              <div className="mt-3 rounded-2xl bg-white/80 dark:bg-zinc-950/80 p-3 border border-zinc-100 dark:border-zinc-800 text-xs">
                <p className="font-bold text-zinc-500 dark:text-zinc-400">Meeting Agenda &amp; Notes:</p>
                <p className="mt-1 text-zinc-700 dark:text-zinc-200 font-medium">{ev.dealNotes || ev.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-2xl border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-2xl bg-white dark:bg-zinc-950 space-y-4 max-h-[88vh] overflow-y-auto sleek-scroll">
        <DialogHeader className="text-left space-y-1 pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Day Schedule</p>
              <DialogTitle className="mt-0.5 text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
                {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </DialogTitle>
              <DialogDescription className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                {events.length} event{events.length === 1 ? "" : "s"} scheduled
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2 pr-6">
              <Button
                size="sm"
                onClick={() => {
                  onClose();
                  onOpenAddEvent();
                }}
                className="h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Plus className="size-3.5" />
                <span>Add Event</span>
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {events.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 p-10 text-center text-sm text-zinc-500 dark:text-zinc-400 space-y-3">
              <p className="font-semibold">No events scheduled for this day.</p>
              <Button
                size="sm"
                onClick={() => {
                  onClose();
                  onOpenAddEvent();
                }}
                className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
              >
                + Schedule New Event
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {events.length > 1 && (
                <div className="px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-extrabold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
                  <span>Showing all {events.length} events for this date</span>
                  <span className="text-[10px] text-zinc-400 font-semibold">Click any event for full details</span>
                </div>
              )}
              {events.map((ev) => renderEventCard(ev))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
