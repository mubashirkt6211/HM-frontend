import { useEffect, useMemo, useRef, useState } from "react";
import {
  Briefcase,
  CalendarBlank,
  CaretDown,
  CaretUp,
  Check,
  CheckCircle,
  Clock,
  DotsThreeVertical,
  Envelope,
  FileText,
  FunnelSimple,
  LinkedinLogo,
  MapPin,
  Paperclip,
  Phone,
  Plus,
  X,
  ArrowRight,
  Folders,
  ListChecks,
  ListBullets,
  SquaresFour,
  Table,
  MagnifyingGlass,
  ChatCircle,
  Flag,
  CalendarDots,
} from "@phosphor-icons/react";

import { Badge } from "@/components/reui/badge";
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanColumnHandle,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay,
} from "@/components/reui/kanban";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CalendarPage } from "@/pages/CalendarPage";
import { cn } from "@/lib/utils";

/* ================================================================
   Types
   ================================================================ */

type Priority = "high" | "medium" | "low";

type Task = {
  id: string;
  title: string;
  description: string;
  due: string;
  priority: Priority;
  milestoneDone: number;
  milestoneTotal: number;
  assignees: string[];
  attachments: number;
  comments: number;
  /* drawer compat */
  company?: string;
  contact?: string;
  owner?: string;
  avatar?: string;
  value?: string;
  updated?: string;
  notes?: string;
  projectCode?: string;
  pageCount?: number;
};

/* ================================================================
   Column config — Oripio-style board
   ================================================================ */

const COLUMN_TITLES: Record<string, string> = {
  todo: "To Do",
  on_process: "On Process",
  on_review: "On Review",
  completed: "Completed",
};

type StageKey = "todo" | "on_process" | "on_review" | "completed";

const COLUMN_META: Record<
  string,
  {
    accent: string;
    dotColor: string;
    bgColor: string;
    borderColor: string;
    badgeBg: string;
    badgeText: string;
    plusColor: string;
    subtitle: string;
  }
> = {
  todo: {
    accent: "bg-blue-500",
    dotColor: "bg-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-l-blue-500",
    badgeBg: "bg-blue-100 dark:bg-blue-900/40",
    badgeText: "text-blue-600 dark:text-blue-400",
    plusColor: "text-blue-400",
    subtitle: "Tasks waiting to begin",
  },
  on_process: {
    accent: "bg-amber-500",
    dotColor: "bg-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    borderColor: "border-l-amber-500",
    badgeBg: "bg-amber-100 dark:bg-amber-900/40",
    badgeText: "text-amber-600 dark:text-amber-400",
    plusColor: "text-amber-400",
    subtitle: "Work in progress",
  },
  on_review: {
    accent: "bg-pink-500",
    dotColor: "bg-pink-500",
    bgColor: "bg-pink-50 dark:bg-pink-950/20",
    borderColor: "border-l-pink-500",
    badgeBg: "bg-pink-100 dark:bg-pink-900/40",
    badgeText: "text-pink-600 dark:text-pink-400",
    plusColor: "text-pink-400",
    subtitle: "Awaiting approval",
  },
  completed: {
    accent: "bg-emerald-500",
    dotColor: "bg-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    borderColor: "border-l-emerald-500",
    badgeBg: "bg-emerald-100 dark:bg-emerald-900/40",
    badgeText: "text-emerald-600 dark:text-emerald-400",
    plusColor: "text-emerald-400",
    subtitle: "Successfully finished",
  },
};

const STAGE_STEPS = ["To Do", "On Process", "On Review", "Completed"];
const COLUMN_STAGE_INDEX: Record<string, number> = {
  todo: 0,
  on_process: 1,
  on_review: 2,
  completed: 3,
};

const PRIORITY_META: Record<Priority, { label: string; dot: string; tone: string }> = {
  high: {
    label: "High",
    dot: "bg-red-500",
    tone: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300",
  },
  medium: {
    label: "Medium",
    dot: "bg-orange-500",
    tone: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300",
  },
  low: {
    label: "Low",
    dot: "bg-blue-500",
    tone: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300",
  },
};

/* ================================================================
   Task data — HMS-context Kanban
   ================================================================ */

const INITIAL_COLUMNS: Record<string, Task[]> = {
  todo: [
    {
      id: "td-1",
      title: "Competitor Research Analysis",
      description: "Review industry competitors and identify feature gaps",
      due: "11 Dec, 2026",
      priority: "medium",
      milestoneDone: 0,
      milestoneTotal: 6,
      assignees: [
        "https://i.pravatar.cc/120?img=5",
        "https://i.pravatar.cc/120?img=12",
      ],
      attachments: 2,
      comments: 3,
      company: "Competitor Research Analysis",
      contact: "Sophie Bennett",
      owner: "Ari",
      avatar: "https://i.pravatar.cc/120?img=5",
      value: "$18K",
      updated: "2h ago",
      notes: "Review industry competitors and identify feature gaps in current HMS.",
      projectCode: "HMS-21",
      pageCount: 6,
    },
    {
      id: "td-2",
      title: "Multi-Language Support Planning",
      description: "Define localization requirements and translations",
      due: "10 Dec, 2026",
      priority: "high",
      milestoneDone: 0,
      milestoneTotal: 8,
      assignees: [
        "https://i.pravatar.cc/120?img=32",
        "https://i.pravatar.cc/120?img=45",
      ],
      attachments: 3,
      comments: 5,
      company: "Multi-Language Support Planning",
      contact: "Jordan Lee",
      owner: "Sam",
      avatar: "https://i.pravatar.cc/120?img=32",
      value: "$42K",
      updated: "4h ago",
      notes: "Define localization requirements and set up translation pipeline.",
      projectCode: "HMS-68",
      pageCount: 8,
    },
  ],
  on_process: [
    {
      id: "op-1",
      title: "Mobile Dashboard Development",
      description: "Building responsive dashboard components for mobile",
      due: "8 Dec, 2026",
      priority: "high",
      milestoneDone: 2,
      milestoneTotal: 8,
      assignees: [
        "https://i.pravatar.cc/120?img=45",
        "https://i.pravatar.cc/120?img=28",
        "https://i.pravatar.cc/120?img=19",
      ],
      attachments: 2,
      comments: 4,
      company: "Mobile Dashboard Development",
      contact: "Derek Wong",
      owner: "You",
      avatar: "https://i.pravatar.cc/120?img=45",
      value: "$64K",
      updated: "1h ago",
      notes: "Build responsive dashboard components for mobile HMS client.",
      projectCode: "HMS-28",
      pageCount: 16,
    },
    {
      id: "op-2",
      title: "User Onboarding Experience",
      description: "Designing onboarding screens to improve user adoption",
      due: "9 Dec, 2026",
      priority: "low",
      milestoneDone: 5,
      milestoneTotal: 8,
      assignees: [
        "https://i.pravatar.cc/120?img=15",
        "https://i.pravatar.cc/120?img=25",
      ],
      attachments: 1,
      comments: 5,
      company: "User Onboarding Experience",
      contact: "Emma Stone",
      owner: "You",
      avatar: "https://i.pravatar.cc/120?img=15",
      value: "$36K",
      updated: "3h ago",
      notes: "Design onboarding screens to improve new user adoption rate.",
      projectCode: "HMS-97",
      pageCount: 10,
    },
  ],
  on_review: [
    {
      id: "or-1",
      title: "Design System Update",
      description: "Reviewing updated components and accessibility standards",
      due: "5 Dec, 2026",
      priority: "medium",
      milestoneDone: 8,
      milestoneTotal: 8,
      assignees: [
        "https://i.pravatar.cc/120?img=39",
        "https://i.pravatar.cc/120?img=25",
      ],
      attachments: 3,
      comments: 7,
      company: "Design System Update",
      contact: "Lucas Brown",
      owner: "You",
      avatar: "https://i.pravatar.cc/120?img=39",
      value: "$96K",
      updated: "15m ago",
      notes: "Review updated design system components and accessibility compliance.",
      projectCode: "HMS-88",
      pageCount: 14,
    },
    {
      id: "or-2",
      title: "API Documentation",
      description: "Awaiting technical review and approval from engineering",
      due: "4 Dec, 2026",
      priority: "low",
      milestoneDone: 8,
      milestoneTotal: 8,
      assignees: [
        "https://i.pravatar.cc/120?img=8",
        "https://i.pravatar.cc/120?img=18",
      ],
      attachments: 2,
      comments: 4,
      company: "API Documentation",
      contact: "Ryan Cole",
      owner: "Mina",
      avatar: "https://i.pravatar.cc/120?img=8",
      value: "$22K",
      updated: "2h ago",
      notes: "API docs awaiting technical review and sign-off from engineering team.",
      projectCode: "HMS-12",
      pageCount: 28,
    },
    {
      id: "or-3",
      title: "Security Compliance Audit",
      description: "Final verification of security standards and records",
      due: "5 Dec, 2026",
      priority: "high",
      milestoneDone: 1,
      milestoneTotal: 8,
      assignees: [
        "https://i.pravatar.cc/120?img=33",
        "https://i.pravatar.cc/120?img=44",
      ],
      attachments: 2,
      comments: 4,
      company: "Security Compliance Audit",
      contact: "Alex Turner",
      owner: "Admin",
      avatar: "https://i.pravatar.cc/120?img=33",
      value: "$55K",
      updated: "5h ago",
      notes: "Final verification of security standards and regulatory records.",
      projectCode: "HMS-55",
      pageCount: 12,
    },
  ],
  completed: [
    {
      id: "cp-1",
      title: "Payment Gateway Integration",
      description: "Implemented seamless and secure payment processing",
      due: "15 Nov, 2026",
      priority: "low",
      milestoneDone: 10,
      milestoneTotal: 10,
      assignees: [
        "https://i.pravatar.cc/120?img=19",
        "https://i.pravatar.cc/120?img=15",
      ],
      attachments: 5,
      comments: 2,
      company: "Payment Gateway Integration",
      contact: "Emma Stone",
      owner: "You",
      avatar: "https://i.pravatar.cc/120?img=19",
      value: "$88K",
      updated: "45m ago",
      notes: "Payment gateway fully integrated with secure tokenization.",
      projectCode: "HMS-12",
      pageCount: 14,
    },
    {
      id: "cp-2",
      title: "User Profile Enhancement",
      description: "Added customizable user preferences and profile settings",
      due: "05 Dec, 2026",
      priority: "medium",
      milestoneDone: 6,
      milestoneTotal: 6,
      assignees: [
        "https://i.pravatar.cc/120?img=22",
        "https://i.pravatar.cc/120?img=11",
      ],
      attachments: 3,
      comments: 5,
      company: "User Profile Enhancement",
      contact: "Mia Chen",
      owner: "Sara",
      avatar: "https://i.pravatar.cc/120?img=22",
      value: "$28K",
      updated: "1d ago",
      notes: "Customizable user preferences and profile page enhancements shipped.",
      projectCode: "HMS-77",
      pageCount: 6,
    },
    {
      id: "cp-3",
      title: "Authentication Module",
      description: "Successfully launched secure login and account management",
      due: "15 Nov, 2026",
      priority: "high",
      milestoneDone: 8,
      milestoneTotal: 8,
      assignees: [
        "https://i.pravatar.cc/120?img=36",
        "https://i.pravatar.cc/120?img=47",
      ],
      attachments: 2,
      comments: 3,
      company: "Authentication Module",
      contact: "David Kim",
      owner: "You",
      avatar: "https://i.pravatar.cc/120?img=36",
      value: "$42K",
      updated: "2d ago",
      notes: "Secure login system with MFA launched successfully.",
      projectCode: "HMS-03",
      pageCount: 8,
    },
  ],
};

/* ================================================================
   Helpers
   ================================================================ */

function slug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function dealNumber(id: string) {
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) % 100000;
  return 190000 + hash;
}

function buildTaskDetails(task: Task, columnKey: string) {
  const firstName = (task.contact ?? task.title).split(" ")[0] ?? task.title;
  return {
    number: dealNumber(task.id),
    address: "—",
    email: `${slug(firstName)}@hms.hospital.com`,
    phone: "(555) 010-2847",
    source: "Internal",
    stageIndex: COLUMN_STAGE_INDEX[columnKey] ?? 0,
    activity: [
      {
        icon: Envelope,
        tone: "bg-emerald-100 text-emerald-600",
        title: `Update sent: ${task.notes || "Task updated"}`,
        meta: `Today · ${task.updated ?? "just now"}`,
      },
      {
        icon: CheckCircle,
        tone: "bg-blue-100 text-blue-600",
        title: `Status updated for task #${dealNumber(task.id)}`,
        meta: `Moved to ${COLUMN_TITLES[columnKey]} · ${task.updated ?? "just now"}`,
      },
    ],
    appointment: {
      title: `Review with ${task.contact ?? "Team"}`,
      date: task.due,
      time: "10:00 – 10:30 AM",
      location: "Video call",
      attendee: task.contact ?? "Team",
    },
    timeline: [
      {
        id: "timeline-1",
        icon: ChatCircle,
        tone: "bg-blue-100 text-blue-700",
        title: `${firstName} mentioned ${task.contact ?? "Progression Ventures"} in a comment.`,
        subtitle: "Friday, 4:16PM · Hiring · Dianne Russell",
        body: "...project with Progression Ventures is going to take a pair of extra hands to complete in time, we should look at getting Dianne onboard for a…",
      },
      {
        id: "timeline-2",
        icon: ChatCircle,
        tone: "bg-emerald-100 text-emerald-700",
        title: `${firstName} commented on ${task.contact ?? "Progression Ventures"}.`,
        subtitle: "Tuesday, 2:31PM · Clients",
        body: "We finalized Progression’s terms this morning. Everything is moving forward!",
      },
      {
        id: "timeline-3",
        icon: FileText,
        tone: "bg-zinc-100 text-zinc-700",
        title: `${task.contact ?? "Progression Ventures"} was merged into ${task.company ?? "Clients"}.`,
      },
      {
        id: "timeline-4",
        icon: Plus,
        tone: "bg-emerald-100 text-emerald-700",
        title: `${task.contact ?? "Progression Ventures"} was added to Clients.`,
      },
      {
        id: "timeline-5",
        icon: X,
        tone: "bg-rose-100 text-rose-700",
        title: `${task.contact ?? "Progression Ventures"} was removed from Inbound Deals.`,
      },
      {
        id: "timeline-6",
        icon: FileText,
        tone: "bg-cyan-100 text-cyan-700",
        title: `${firstName} mentioned ${task.contact ?? "Progression Ventures"} in the note Q2 Design Review.`,
        subtitle: "1 month ago · Clients · Stripe",
        body: "1.1.3. Similar Companies",
      },
    ],
    proposal: {
      id: dealNumber(task.id),
      name: task.title,
      amount: task.value ?? "—",
      sentDate: task.due,
      acceptedDate: "—",
      status:
        task.priority === "high"
          ? "Pending"
          : task.priority === "medium"
            ? "In review"
            : "Draft",
    },
  };
}

/* ================================================================
   Outside-click hook
   ================================================================ */

function useOutsideClick(ref: React.RefObject<HTMLElement>, onOutside: () => void) {
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [ref, onOutside]);
}

/* ================================================================
   Dropdown
   ================================================================ */

function Dropdown({
  trigger,
  children,
  align = "left",
  panelClassName,
}: {
  trigger: (open: boolean) => React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  panelClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{trigger(open)}</div>
      {open ? (
        <div
          className={cn(
            "absolute top-[calc(100%+8px)] z-30 min-w-[240px] rounded-2xl border border-zinc-200 bg-white p-3 shadow-lg dark:border-zinc-800 dark:bg-zinc-950",
            align === "right" ? "right-0" : "left-0",
            panelClassName,
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

/* ================================================================
   Filter Control
   ================================================================ */

function FilterControl({
  active,
  stageActive,
  onToggle,
  onStageToggle,
  onClear,
}: {
  active: Set<Priority>;
  stageActive: Set<StageKey>;
  onToggle: (p: Priority) => void;
  onStageToggle: (stage: StageKey) => void;
  onClear: () => void;
}) {
  const count = active.size + stageActive.size;
  return (
    <Dropdown
      trigger={(open) => (
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-1.5 rounded-lg border border-gray-100 font-medium text-sm text-gray-600 hover:bg-gray-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-950",
            count > 0 ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600" : "",
            open && "ring-2 ring-blue-300",
          )}
        >
          <FunnelSimple className="size-4" weight="bold" />
          Filters{count > 0 ? ` (${count})` : ""}
        </Button>
      )}
    >
      <div className="space-y-4">
        <div>
          <p className="mb-2 text-[12px] font-semibold text-zinc-700 dark:text-zinc-200">Priority</p>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(PRIORITY_META) as Priority[]).map((p) => {
              const meta = PRIORITY_META[p];
              const checked = active.has(p);
              return (
                <button
                  key={p}
                  onClick={() => onToggle(p)}
                  className={cn(
                    "rounded-2xl border px-3 py-2 text-left text-[13px] transition",
                    checked
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-zinc-700",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className={cn("size-2 rounded-full", meta.dot)} />
                    {meta.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[12px] font-semibold text-zinc-700 dark:text-zinc-200">Stage</p>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(COLUMN_TITLES) as [StageKey, string][]).map(([key, label]) => {
              const checked = stageActive.has(key);
              return (
                <button
                  key={key}
                  onClick={() => onStageToggle(key)}
                  className={cn(
                    "rounded-2xl border px-3 py-2 text-left text-[13px] transition",
                    checked
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-zinc-700",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={onClear}
          className="w-full rounded-2xl bg-zinc-100 px-3 py-2 text-[12px] font-semibold text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Clear all filters
        </button>
      </div>
    </Dropdown>
  );
}

/* ================================================================
   Milestone Progress Bar
   ================================================================ */

function MilestoneBar({
  done,
  total,
  columnKey,
}: {
  done: number;
  total: number;
  columnKey: string;
}) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const barColor =
    columnKey === "todo"
      ? "bg-blue-500"
      : columnKey === "on_process"
        ? done / total >= 0.6
          ? "bg-emerald-500"
          : "bg-amber-500"
        : columnKey === "on_review"
          ? pct === 100
            ? "bg-pink-500"
            : pct > 0
              ? "bg-blue-600"
              : "bg-red-600"
          : "bg-emerald-500";

  const labelColor =
    columnKey === "todo"
      ? "text-zinc-500"
      : columnKey === "on_process"
        ? done / total >= 0.6
          ? "text-emerald-500"
          : "text-amber-500"
        : columnKey === "on_review"
          ? pct === 100
            ? "text-pink-500"
            : pct > 0
              ? "text-blue-600"
              : "text-red-600"
          : "text-emerald-500";

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center text-[10px] mb-1.5">
        <span className={cn("flex items-center gap-1 font-medium", labelColor)}>
          <CheckCircle weight="fill" className="w-3 h-3" />
          Milestone
        </span>
        <span className="text-gray-400">
          {done}/{total}
        </span>
      </div>
      <div className="h-1.5 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ================================================================
   Task Card — Oripio style
   ================================================================ */

function TaskCard({
  task,
  columnKey,
  asHandle,
  isOverlay,
}: {
  task: Task;
  columnKey: string;
  asHandle?: boolean;
  isOverlay?: boolean;
}) {
  const priorityMeta = PRIORITY_META[task.priority];

  const content = (
    <article className="bg-white dark:bg-zinc-950 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 hover:shadow-md transition-shadow cursor-pointer group">
      {/* Due date row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
          <CalendarDots className="w-3 h-3" />
          Due: {task.due}
        </div>
        <button className="text-gray-300 dark:text-zinc-600 group-hover:text-gray-500 transition">
          <DotsThreeVertical className="w-4 h-4" weight="fill" />
        </button>
      </div>

      {/* Title + description */}
      <h3 className="font-bold text-sm mb-1 leading-tight text-zinc-900 dark:text-white">
        {task.title}
      </h3>
      <p className="text-xs text-gray-400 mb-3 line-clamp-2">{task.description}</p>

      {/* Milestone progress */}
      <MilestoneBar done={task.milestoneDone} total={task.milestoneTotal} columnKey={columnKey} />

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Assignees */}
        <div className="flex items-center -space-x-1.5">
          {task.assignees.slice(0, 3).map((src, i) => (
            <Avatar key={i} className="size-6 border-2 border-white dark:border-zinc-950">
              <AvatarImage src={src} />
              <AvatarFallback className="bg-zinc-100 text-[8px] font-bold text-zinc-600">
                {i + 1}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>

        {/* Priority badge + meta */}
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1",
              priorityMeta.tone,
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full", priorityMeta.dot)} />
            {priorityMeta.label}
          </span>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
            <span className="flex items-center gap-0.5">
              <Paperclip className="w-3 h-3" />
              {task.attachments}
            </span>
            <span className="flex items-center gap-0.5">
              <ChatCircle className="w-3 h-3" />
              {task.comments}
            </span>
          </div>
        </div>
      </div>
    </article>
  );

  return (
    <KanbanItem value={task.id}>
      {asHandle && !isOverlay ? <KanbanItemHandle>{content}</KanbanItemHandle> : content}
    </KanbanItem>
  );
}

/* ================================================================
   Pipeline Column — Oripio style
   ================================================================ */

function PipelineColumn({
  value,
  tasks,
  isOverlay,
  onTaskClick,
  draggable = true,
}: {
  value: string;
  tasks: Task[];
  isOverlay?: boolean;
  onTaskClick?: (task: Task) => void;
  draggable?: boolean;
}) {
  const meta = COLUMN_META[value];

  return (
    <KanbanColumn value={value} className="h-full">
      <div className="flex h-full flex-col">
        {/* Column header */}
        <div
          className={cn(
            "flex items-center justify-between mb-4 px-3 py-2 rounded-lg border-l-4",
            meta.bgColor,
            meta.borderColor,
          )}
        >
          <div className="flex items-center gap-2">
            <span className={cn("w-2 h-2 rounded-full", meta.dotColor)} />
            <span className="font-bold text-sm text-zinc-800 dark:text-zinc-100">
              {COLUMN_TITLES[value]}
            </span>
            <span
              className={cn(
                "text-xs px-1.5 py-0.5 rounded-md font-semibold",
                meta.badgeBg,
                meta.badgeText,
              )}
            >
              {tasks.length}
            </span>
          </div>
          <KanbanColumnHandle
            render={(props) => (
              <button {...props} className={cn("font-bold text-lg leading-none", meta.plusColor)}>
                +
              </button>
            )}
          />
        </div>

        {/* Cards */}
        <KanbanColumnContent value={value} className="flex-1 space-y-4 overflow-y-auto pb-4 no-scrollbar">
          {tasks.length === 0 ? (
            <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-gray-200 dark:border-zinc-800 text-[12px] text-gray-400">
              No tasks match your filter
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={`${value}-${task.id}`}
                onClick={() => onTaskClick?.(task)}
                className="cursor-pointer"
              >
                <TaskCard
                  task={task}
                  columnKey={value}
                  asHandle={!isOverlay && draggable}
                  isOverlay={isOverlay}
                />
              </div>
            ))
          )}
        </KanbanColumnContent>

        {/* Add task button */}
        <button className="mt-2 inline-flex items-center gap-2 rounded-xl border border-dashed border-gray-200 dark:border-zinc-700 px-4 py-2.5 text-[13px] font-medium text-gray-400 transition hover:border-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 w-full justify-center">
          <Plus className="size-4" />
          Add Task
        </button>
      </div>
    </KanbanColumn>
  );
}

/* ================================================================
   Deal/Task Drawer
   ================================================================ */

function TaskDrawer({
  task,
  columnKey,
  positionLabel,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  task: Task;
  columnKey: string;
  positionLabel: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  const [tab, setTab] = useState("Activity");
  const details = useMemo(() => buildTaskDetails(task, columnKey), [task, columnKey]);
  const tabs = ["Activity", "Timeline", "Appointments", "Proposals", "Invoices", "Notifications", "Notes", "Tasks"];
  const priorityMeta = PRIORITY_META[task.priority];
  const colMeta = COLUMN_META[columnKey];

  return (
    <SheetContent side="right" showCloseButton={false} className="w-full gap-0 overflow-hidden p-0 sm:max-w-[920px]">
      <SheetHeader className="sr-only">
        <SheetTitle>{task.title} task details</SheetTitle>
        <SheetDescription>Details drawer for the selected task</SheetDescription>
      </SheetHeader>

      <div className="flex h-full flex-col">
        {/* top bar */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-6 py-3">
          <div className="flex items-center gap-3 text-[13px] text-zinc-500">
            <div className="flex flex-col overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800">
              <button
                onClick={onPrev}
                disabled={!hasPrev}
                className="flex h-5 w-6 items-center justify-center text-zinc-400 hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-zinc-900"
              >
                <CaretUp className="size-3" />
              </button>
              <button
                onClick={onNext}
                disabled={!hasNext}
                className="flex h-5 w-6 items-center justify-center border-t border-zinc-200 text-zinc-400 hover:bg-zinc-100 disabled:opacity-30 dark:border-zinc-800 dark:hover:bg-zinc-900"
              >
                <CaretDown className="size-3" />
              </button>
            </div>
            <span>
              {positionLabel} in{" "}
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {COLUMN_TITLES[columnKey]}
              </span>{" "}
              Stage
            </span>
          </div>
          <SheetClose asChild>
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 text-[13px] font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            >
              Close
              <X className="size-3.5" />
            </button>
          </SheetClose>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* left column */}
          <div className="w-[300px] shrink-0 overflow-y-auto border-r border-zinc-200 dark:border-zinc-800 p-5">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge className={cn("border-none text-[10px] font-semibold", priorityMeta.tone)}>
                {priorityMeta.label} Priority
              </Badge>
              <Badge
                className={cn(
                  "border-none text-[10px] font-semibold",
                  colMeta.badgeBg,
                  colMeta.badgeText,
                )}
              >
                {COLUMN_TITLES[columnKey]}
              </Badge>
            </div>

            <p className="mt-3 text-[12px] text-zinc-400">Task #{details.number}</p>
            <h2 className="mt-1 text-[20px] font-semibold leading-6 text-zinc-950 dark:text-white">
              {task.title}
            </h2>
            <p className="mt-1 flex items-center gap-1 text-[12px] text-zinc-500">
              <MapPin className="size-3.5" />
              {details.address}
            </p>

            <div className="mt-4 flex items-center gap-2">
              <Button size="sm" className="flex-1 rounded-full bg-emerald-600 text-white hover:bg-emerald-700">
                Update Status
              </Button>
              <Button variant="outline" size="icon" className="size-9 rounded-full">
                <CalendarBlank className="size-4" />
              </Button>
              <Button variant="outline" size="icon" className="size-9 rounded-full">
                <DotsThreeVertical className="size-4" />
              </Button>
            </div>

            <div className="mt-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-3.5">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-medium text-zinc-500">{COLUMN_TITLES[columnKey]}</p>
                <button className="text-[12px] font-medium text-blue-600 hover:underline">View</button>
              </div>
              <p className="mt-1 text-[20px] font-semibold text-zinc-950 dark:text-white">
                {task.value ?? "—"}
              </p>
            </div>

            <div className="mt-5">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-zinc-400">
                Assignees
              </p>
              <div className="mt-3 flex -space-x-2">
                {task.assignees.map((src, i) => (
                  <Avatar key={i} className="size-8 border-2 border-white dark:border-zinc-950">
                    <AvatarImage src={src} />
                    <AvatarFallback className="bg-zinc-100 text-[10px] font-bold text-zinc-600">
                      {i + 1}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-zinc-400">
                Contact Details
              </p>
              <div className="mt-3 space-y-2.5 text-[13px]">
                <div className="flex items-start gap-2">
                  <Envelope className="mt-0.5 size-4 text-zinc-400" />
                  <div>
                    <p className="text-[11px] text-zinc-400">Email Address</p>
                    <p className="text-zinc-700 dark:text-zinc-200">{details.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="mt-0.5 size-4 text-zinc-400" />
                  <div>
                    <p className="text-[11px] text-zinc-400">Phone</p>
                    <p className="text-zinc-700 dark:text-zinc-200">{details.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <LinkedinLogo className="mt-0.5 size-4 text-zinc-400" />
                  <div>
                    <p className="text-[11px] text-zinc-400">Source</p>
                    <p className="text-zinc-700 dark:text-zinc-200">{details.source}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-zinc-400">Owner</p>
              <div className="mt-3 flex items-center gap-2">
                <Avatar className="size-8 border border-zinc-200 dark:border-zinc-800">
                  <AvatarFallback className="bg-zinc-100 text-[11px] font-semibold text-zinc-600">
                    {(task.owner ?? "U")[0]}
                  </AvatarFallback>
                </Avatar>
                <p className="text-[13px] font-medium text-zinc-800 dark:text-zinc-100">
                  {task.owner ?? "Unassigned"}
                </p>
              </div>
            </div>
          </div>

          {/* right column */}
          <div className="flex-1 overflow-y-auto p-5">
            <div className="flex items-center justify-between">
              <p className="text-[12px] text-zinc-500">
                Board:{" "}
                <span className="font-medium text-zinc-800 dark:text-zinc-200">HMS Task Board</span>
              </p>
              <p className="flex items-center gap-1.5 text-[12px] text-zinc-500">
                <Clock className="size-3.5" />
                Updated {task.updated ?? "recently"}
              </p>
            </div>

            {/* Stage progress */}
            <div className="mt-3 flex items-center gap-1 overflow-x-auto rounded-full bg-zinc-100 dark:bg-zinc-900 p-1">
              {STAGE_STEPS.map((step, i) => (
                <div
                  key={step}
                  className={cn(
                    "flex-1 whitespace-nowrap rounded-full px-3 py-1.5 text-center text-[11px] font-medium",
                    i === details.stageIndex
                      ? "bg-blue-600 text-white"
                      : i < details.stageIndex
                        ? "text-zinc-400 line-through"
                        : "text-zinc-500",
                  )}
                >
                  {step}
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="mt-5 flex items-center gap-5 overflow-x-auto border-b border-zinc-200 dark:border-zinc-800 text-[13px]">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "whitespace-nowrap pb-3 font-medium transition",
                    tab === t
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-zinc-500 hover:text-zinc-700",
                  )}
                >
                  {t}
                  {t === "Appointments" ? " · 1" : t === "Proposals" ? " · 1" : ""}
                </button>
              ))}
            </div>

            {tab === "Timeline" ? (
              <div className="mt-4">
                <p className="text-[12px] font-semibold uppercase tracking-wide text-zinc-400">
                  This Week
                </p>
                <div className="relative mt-4 pl-5">
                  <div className="absolute left-4 top-0 h-full w-px bg-zinc-200 dark:bg-zinc-800" />
                  <div className="space-y-6">
                    {details.timeline.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.id} className="relative flex gap-4 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                          <div className="relative">
                            <span
                              className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-full border border-white shadow-sm",
                                item.tone,
                              )}
                            >
                              <Icon className="size-5" />
                            </span>
                            {index < details.timeline.length - 1 ? (
                              <span className="absolute left-1/2 top-full mt-2 block h-12 w-px -translate-x-1/2 bg-zinc-200 dark:bg-zinc-800" />
                            ) : null}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                              {item.title}
                            </p>
                            {item.subtitle ? (
                              <p className="mt-1 text-[12px] text-zinc-400">{item.subtitle}</p>
                            ) : null}
                            {item.body ? (
                              <div className="mt-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                                {item.body}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : tab === "Activity" ? (
              <div className="mt-4">
                <p className="text-[12px] font-semibold uppercase tracking-wide text-zinc-400">
                  Latest Activity
                </p>
                <div className="mt-3 space-y-3">
                  {details.activity.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="flex items-start gap-3">
                        <div
                          className={cn(
                            "flex size-7 shrink-0 items-center justify-center rounded-full",
                            item.tone,
                          )}
                        >
                          <Icon className="size-3.5" weight="bold" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] text-zinc-800 dark:text-zinc-100">{item.title}</p>
                          <p className="text-[11px] text-zinc-400">{item.meta}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-semibold uppercase tracking-wide text-zinc-400">
                  Appointments
                </p>
                <button className="flex items-center gap-1 text-[12px] font-medium text-emerald-600 hover:underline">
                  <Plus className="size-3.5" />
                  Create appointment
                </button>
              </div>
              <div className="mt-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[13px] font-semibold text-zinc-900 dark:text-white">
                      {details.appointment.date}
                    </p>
                    <p className="mt-2 flex items-center gap-1.5 text-[13px] text-zinc-700 dark:text-zinc-200">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      {details.appointment.title}
                    </p>
                    <p className="mt-2 text-[12px] text-zinc-500">{details.appointment.time}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-[12px] text-zinc-500">
                      <MapPin className="size-3.5" />
                      {details.appointment.location}
                    </p>
                    <p className="mt-1 text-[12px] text-zinc-500">{details.appointment.attendee}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-semibold uppercase tracking-wide text-zinc-400">
                  Proposals
                </p>
                <button className="flex items-center gap-1 text-[12px] font-medium text-emerald-600 hover:underline">
                  <Plus className="size-3.5" />
                  Create proposal
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 dark:bg-zinc-900">
                    <FileText className="size-4" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-zinc-900 dark:text-white">
                      #{details.proposal.id} {details.proposal.name}
                    </p>
                    <p className="text-[11px] text-zinc-400">Sent date {details.proposal.sentDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-semibold text-zinc-900 dark:text-white">
                    {details.proposal.amount}
                  </p>
                  <Badge className="mt-1 border-none bg-amber-100 text-[10px] font-semibold text-amber-700">
                    {details.proposal.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SheetContent>
  );
}

/* ================================================================
   Timeline View
   ================================================================ */

function TimelineView({
  filteredColumns,
  onTaskClick,
}: {
  filteredColumns: Record<string, Task[]>;
  onTaskClick: (task: Task, columnKey: string) => void;
}) {
  const allTasks = useMemo(
    () =>
      Object.entries(filteredColumns).flatMap(([key, tasks]) =>
        tasks.map((t) => ({ ...t, columnKey: key })),
      ),
    [filteredColumns],
  );

  if (allTasks.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-gray-200 dark:border-zinc-800 text-[13px] text-zinc-500">
        No tasks found for timeline
      </div>
    );
  }

  return (
    <div className="relative pl-6 py-4 space-y-6 max-h-[600px] overflow-y-auto pr-4">
      <div className="absolute left-[11px] top-6 bottom-6 w-0.5 bg-gray-200 dark:bg-zinc-800" />
      {allTasks.map((task) => {
        const meta = COLUMN_META[task.columnKey];
        return (
          <div key={task.id} className="relative flex items-start gap-4">
            <div
              className={cn(
                "absolute -left-[26px] top-[22px] size-3 rounded-full border-2 border-white dark:border-zinc-950 z-10",
                meta.dotColor,
              )}
            />
            <div
              className="flex-1 max-w-sm cursor-pointer"
              onClick={() => onTaskClick(task, task.columnKey)}
            >
              <TaskCard task={task} columnKey={task.columnKey} asHandle={false} isOverlay={false} />
            </div>
            <div className="pt-5 text-[12px] font-medium text-zinc-500 shrink-0 w-24 text-right">
              {task.due}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================
   Main DashboardTab
   ================================================================ */

export function DashboardTab() {
  const [columns, setColumns] = useState(INITIAL_COLUMNS);
  const [priorityFilter, setPriorityFilter] = useState<Set<Priority>>(new Set());
  const [stageFilter, setStageFilter] = useState<Set<StageKey>>(new Set());
  const [selected, setSelected] = useState<{ task: Task; columnKey: string } | null>(null);
  const [showAiBanner, setShowAiBanner] = useState(true);
  const [activeView, setActiveView] = useState("Kanban");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("can view");

  const accessMembers = [
    {
      id: "juma",
      name: "Juma Omondi",
      email: "juma@alignui.com",
      access: "can view",
      avatar: "https://i.pravatar.cc/120?img=17",
    },
    {
      id: "arthur",
      name: "Arthur Taylor",
      email: "arthur@alignui.com",
      access: "can view",
      avatar: "https://i.pravatar.cc/120?img=18",
    },
    {
      id: "laura",
      name: "Laura Perez",
      email: "laura@alignui.com",
      access: "can view",
      avatar: "https://i.pravatar.cc/120?img=19",
    },
  ];

  const filteredColumns = useMemo(() => {
    const next: Record<string, Task[]> = {};

    for (const [key, tasks] of Object.entries(columns) as [StageKey, Task[]][]) {
      next[key] = tasks.filter((task) => {
        const matchesPriority = priorityFilter.size === 0 || priorityFilter.has(task.priority);
        const matchesStage = stageFilter.size === 0 || stageFilter.has(key);
        return matchesPriority && matchesStage;
      });
    }

    return next;
  }, [columns, priorityFilter, stageFilter]);

  const isFiltering = priorityFilter.size > 0 || stageFilter.size > 0;

  const togglePriority = (p: Priority) => {
    setPriorityFilter((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });
  };

  const openTask = (task: Task, columnKey: string) => setSelected({ task, columnKey });
  const closeTask = () => setSelected(null);

  useEffect(() => {
    if (!selected) return;
    const stillVisible = filteredColumns[selected.columnKey]?.some(
      (t) => t.id === selected.task.id,
    );
    if (!stillVisible) setSelected(null);
  }, [filteredColumns, selected]);

  const columnTasks = selected ? filteredColumns[selected.columnKey] ?? [] : [];
  const indexInColumn = selected ? columnTasks.findIndex((t) => t.id === selected.task.id) : -1;

  const goPrev = () => {
    if (!selected || indexInColumn <= 0) return;
    setSelected({ task: columnTasks[indexInColumn - 1], columnKey: selected.columnKey });
  };
  const goNext = () => {
    if (!selected || indexInColumn === -1 || indexInColumn >= columnTasks.length - 1) return;
    setSelected({ task: columnTasks[indexInColumn + 1], columnKey: selected.columnKey });
  };

  // View tab config
  const viewTabs = [
    { id: "Kanban", label: "Kanban View", icon: <SquaresFour className="size-4" /> },
    { id: "Calendar", label: "Calendar View", icon: <CalendarBlank className="size-4" /> },
  ];

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-full px-6 py-6 lg:px-10">

        {/* ── Welcome Banner ── */}
        <section>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Welcome Back, Admin!
          </h1>
          <p className="mt-2 text-[14px] text-zinc-500 dark:text-zinc-400">
            Monitor all of your tasks and track project progress here.
          </p>
        </section>       

        {/* ── Task Board Section ── */}
        <section className="mt-8">
          {/* Board header: title + member avatars */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              
              
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-2">
                {[5, 12, 19, 32].map((n) => (
                  <Avatar key={n} className="size-8 border-2 border-white dark:border-zinc-900">
                    <AvatarImage src={`https://i.pravatar.cc/120?img=${n}`} />
                    <AvatarFallback className="text-[10px]">{n}</AvatarFallback>
                  </Avatar>
                ))}
                <button className="size-8 rounded-full border-2 border-white dark:border-zinc-900 bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-zinc-300">
                  <Plus className="size-4" />
                </button>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-200 text-sm font-medium text-gray-600 rounded-md dark:border-zinc-700 dark:text-zinc-200"
                onClick={() => setIsInviteOpen(true)}
              >
                Invite
              </Button>
            </div>
          </div>

          {/* View tabs + actions */}
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3 mb-4">
            <div className="flex gap-6 text-sm font-medium">
              {viewTabs.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setActiveView(v.id)}
                  className={cn(
                    "pb-3 -mb-3 flex items-center gap-2 border-b-2 transition",
                    activeView === v.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-zinc-300",
                  )}
                >
                  <span className="text-base">{v.icon}</span>
                  {v.label}
                </button>
              ))}
            </div>

            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3 -mb-3">
              <div className="flex flex-wrap items-center gap-2">
                {isFiltering ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {[...priorityFilter].map((p) => (
                      <button
                        key={p}
                        onClick={() => togglePriority(p)}
                        className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200"
                      >
                        {PRIORITY_META[p].label}
                        <X className="size-3" />
                      </button>
                    ))}
                    {[...stageFilter].map((stage) => (
                      <button
                        key={stage}
                        onClick={() => {
                          setStageFilter((prev) => {
                            const next = new Set(prev);
                            next.delete(stage);
                            return next;
                          });
                        }}
                        className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-3 py-1 text-sm text-zinc-700 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                      >
                        {COLUMN_TITLES[stage]}
                        <X className="size-3" />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="flex items-center gap-3">
                {isFiltering && (
                  <button
                    onClick={() => {
                      setPriorityFilter(new Set());
                      setStageFilter(new Set());
                    }}
                    className="flex items-center gap-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1.5 text-[12px] font-medium text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                  >
                    <X className="size-3" />
                    Clear
                  </button>
                )}
                <FilterControl
                  active={priorityFilter}
                  stageActive={stageFilter}
                  onToggle={togglePriority}
                  onStageToggle={(stage) => {
                    setStageFilter((prev) => {
                      const next = new Set(prev);
                      if (next.has(stage)) next.delete(stage);
                      else next.add(stage);
                      return next;
                    });
                  }}
                  onClear={() => {
                    setPriorityFilter(new Set());
                    setStageFilter(new Set());
                  }}
                />
                <Button
                  size="lg"
                  className="group relative overflow-hidden rounded-lg border border-blue-800/40 bg-gradient-to-b from-blue-400 via-blue-600 to-blue-700 px-4 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_1px_rgba(0,0,0,0.15),0_4px_10px_-2px_rgba(37,99,235,0.55)] transition-all duration-150 hover:from-blue-400 hover:via-blue-500 hover:to-blue-600 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.55),inset_0_-1px_1px_rgba(0,0,0,0.15),0_6px_14px_-2px_rgba(37,99,235,0.65)] active:translate-y-px active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)] gap-1"
                >
                  {/* glossy top-half highlight */}
                  <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-lg bg-gradient-to-b from-white/40 to-white/0" />
                  {/* soft diagonal sheen sweep on hover */}
                  <span className="pointer-events-none absolute -inset-y-2 -left-1/2 w-1/3 -skew-x-12 bg-white/25 opacity-0 transition-all duration-500 group-hover:left-[120%] group-hover:opacity-100" />
                  <Plus className="relative z-10 size-4" />
                  <span className="relative z-10">Create Task</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Filter hint */}
          {isFiltering && (
            <p className="mb-3 text-[12px] text-zinc-400">
              Drag &amp; drop is paused while a filter is active — clear the filter to reorder cards.
            </p>
          )}

          {/* Kanban */}
          {activeView === "Kanban" && (
            <Kanban
              value={isFiltering ? filteredColumns : columns}
              onValueChange={(next) => {
                // Guard: while a filter/search is active, `filteredColumns` is a
                // partial view. Writing it straight back to `columns` would
                // silently delete every task that the current filter is hiding.
                // Only commit reorders when the full board is shown.
                if (!isFiltering) setColumns(next as Record<string, Task[]>);
              }}
              getItemValue={(item) => item.id}
              className="h-full"
            >
              <KanbanBoard className="grid h-full w-full auto-rows-fr grid-cols-1 gap-6 overflow-hidden md:grid-cols-2 xl:grid-cols-4">
                {Object.entries(filteredColumns).map(([columnValue, tasks]) => (
                  <PipelineColumn
                    key={columnValue}
                    value={columnValue}
                    tasks={tasks}
                    draggable={!isFiltering}
                    onTaskClick={(task) => openTask(task, columnValue)}
                  />
                ))}
              </KanbanBoard>
              <KanbanOverlay>
                {({ value, variant }) => {
                  if (variant === "column") {
                    return (
                      <PipelineColumn
                        value={value as string}
                        tasks={filteredColumns[value as string]}
                        isOverlay
                      />
                    );
                  }
                  const task = Object.values(filteredColumns)
                    .flat()
                    .find((t) => t.id === value);
                  const colKey =
                    Object.entries(filteredColumns).find(([, tasks]) =>
                      tasks.some((t) => t.id === value),
                    )?.[0] ?? "todo";
                  return task ? (
                    <TaskCard task={task} columnKey={colKey} isOverlay />
                  ) : null;
                }}
              </KanbanOverlay>
            </Kanban>
          )}

          {activeView === "Calendar" && (
            <div className="rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="px-6 py-6">
                <CalendarPage />
              </div>
            </div>
          )}
        </section>
      </div>

      {/* ── Drawer ── */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="w-full sm:max-w-md p-0 overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl bg-white dark:bg-zinc-950">
          <div className="space-y-4 px-6 pb-6 pt-6">
            <div className="flex items-center gap-4 rounded-3xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="grid h-12 w-12 place-items-center rounded-3xl bg-white text-zinc-700 shadow-sm dark:bg-zinc-950 dark:text-zinc-200">
                <Plus className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Invite to Project</h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Collaborate with members on this project.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-200">Invite Members</div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  id="invite-email"
                  type="email"
                  value={inviteEmail}
                  onChange={(event) => setInviteEmail(event.target.value)}
                  placeholder="hi@alignui.com"
                  className="h-11 rounded-2xl border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                />
                <div className="flex items-center gap-2">
                  <Select value={inviteRole} onValueChange={(value) => setInviteRole(value ?? "can view")}> 
                    <SelectTrigger className="h-11 min-w-[140px] rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white">
                      <SelectValue placeholder="can view" />
                    </SelectTrigger>
                    <SelectContent className="rounded-[22px] border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
                      <SelectItem value="can view">can view</SelectItem>
                      <SelectItem value="can edit">can edit</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    className="h-11 min-w-[96px] rounded-2xl px-4 text-sm font-semibold"
                    onClick={() => {
                      setIsInviteOpen(false);
                      setInviteEmail("");
                      setInviteRole("can view");
                    }}
                  >
                    Invite
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">Members with access</p>
                <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold uppercase text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                  {accessMembers.length}
                </span>
              </div>
              <div className="space-y-3">
                {accessMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between gap-4 rounded-3xl border border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-11">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-zinc-100 text-[10px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-200">
                          {member.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-white">{member.name}</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">{member.email}</p>
                      </div>
                    </div>
                    <div className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
                      {member.access}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Members who have the link have access to this project.
            </p>
          </div>
        </DialogContent>
      </Dialog>
      <Sheet open={!!selected} onOpenChange={(open) => !open && closeTask()}>
        {selected ? (
          <TaskDrawer
            task={selected.task}
            columnKey={selected.columnKey}
            positionLabel={`${indexInColumn + 1} of ${columnTasks.length}`}
            onClose={closeTask}
            onPrev={goPrev}
            onNext={goNext}
            hasPrev={indexInColumn > 0}
            hasNext={indexInColumn < columnTasks.length - 1}
          />
        ) : null}
      </Sheet>
    </div>
  );
}