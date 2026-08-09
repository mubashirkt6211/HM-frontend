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
  Question,
  BookmarkSimple,
  Tag,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CalendarPage } from "@/pages/shared/CalendarPage";
import { cn } from "@/lib/utils";
import { CalendarCheckIcon } from "@phosphor-icons/react/dist/ssr";
import { CalendarCogIcon, User } from "lucide-react";
import { Filters, type Filter, type FilterFieldConfig } from "@/components/reui/filters";
import { IconCalendarMonth, IconDotsVertical } from "@tabler/icons-react";

/* ================================================================
   Types
   ================================================================ */

export type Priority = "high" | "medium" | "low";

export type Task = {
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
  new: "New",
  open: "Open",
  inprogress: "In-progress",
  opendeal: "Open-deal",
  won: "Won",
  inquiry: "Inquiry",
  contacted: "Contacted",
  itinerary: "Itinerary Sent",
  negotiation: "Negotiation",
  confirmed: "Confirmed",
};

type StageKey = "todo" | "on_process" | "on_review" | "completed" | "new" | "open" | "inprogress" | "opendeal" | "won";

const DEFAULT_COL_META = {
  accent: "bg-blue-500",
  dotColor: "bg-blue-500",
  bgColor: "bg-blue-50 dark:bg-blue-950/20",
  borderColor: "border-l-blue-500",
  badgeBg: "bg-blue-100 dark:bg-blue-900/40",
  badgeText: "text-blue-600 dark:text-blue-400",
  plusColor: "text-blue-400",
  subtitle: "Active stage",
};

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
  new: {
    accent: "bg-sky-500",
    dotColor: "bg-sky-500",
    bgColor: "bg-sky-50 dark:bg-sky-950/20",
    borderColor: "border-l-sky-500",
    badgeBg: "bg-sky-100 dark:bg-sky-900/40",
    badgeText: "text-sky-700 dark:text-sky-300",
    plusColor: "text-sky-400",
    subtitle: "New lead inquiries",
  },
  open: {
    accent: "bg-violet-500",
    dotColor: "bg-violet-500",
    bgColor: "bg-violet-50 dark:bg-violet-950/20",
    borderColor: "border-l-violet-500",
    badgeBg: "bg-violet-100 dark:bg-violet-900/40",
    badgeText: "text-violet-700 dark:text-violet-300",
    plusColor: "text-violet-400",
    subtitle: "Active lead discussion",
  },
  inprogress: {
    accent: "bg-amber-500",
    dotColor: "bg-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    borderColor: "border-l-amber-500",
    badgeBg: "bg-amber-100 dark:bg-amber-900/40",
    badgeText: "text-amber-800 dark:text-amber-300",
    plusColor: "text-amber-400",
    subtitle: "Deal in progress",
  },
  opendeal: {
    accent: "bg-rose-500",
    dotColor: "bg-rose-500",
    bgColor: "bg-rose-50 dark:bg-rose-950/20",
    borderColor: "border-l-rose-500",
    badgeBg: "bg-rose-100 dark:bg-rose-900/40",
    badgeText: "text-rose-700 dark:text-rose-300",
    plusColor: "text-rose-400",
    subtitle: "Open opportunity",
  },
  won: {
    accent: "bg-emerald-500",
    dotColor: "bg-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    borderColor: "border-l-emerald-500",
    badgeBg: "bg-emerald-100 dark:bg-emerald-900/40",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    plusColor: "text-emerald-400",
    subtitle: "Closed & won",
  },
};

const STAGE_STEPS = ["To Do", "On Process", "On Review", "Completed"];
const COLUMN_STAGE_INDEX: Record<string, number> = {
  todo: 0,
  on_process: 1,
  on_review: 2,
  completed: 3,
  new: 0,
  open: 1,
  inprogress: 2,
  opendeal: 3,
  won: 4,
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

const TODO_FILTER_FIELDS: FilterFieldConfig[] = [
  {
    key: "priority",
    label: "Priority",
    icon: <Flag className="size-4 text-amber-500" />,
    type: "select",
    options: [
      { value: "high", label: "High" },
      { value: "medium", label: "Medium" },
      { value: "low", label: "Low" },
    ],
  },
  {
    key: "stage",
    label: "Stage",
    icon: <Folders className="size-4 text-blue-500" />,
    type: "select",
    options: [
      { value: "todo", label: "To Do" },
      { value: "on_process", label: "On Process" },
      { value: "on_review", label: "On Review" },
      { value: "completed", label: "Completed" },
    ],
  },
  {
    key: "title",
    label: "Title / Search",
    icon: <MagnifyingGlass className="size-4 text-violet-500" />,
    type: "text",
    placeholder: "Task title...",
  },
];

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
  useOutsideClick(ref as React.RefObject<HTMLElement>, () => setOpen(false));

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
        <KanbanColumnContent value={value} className="flex-1 space-y-4 overflow-y-auto sleek-scroll pr-1 pb-4">
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

export function TaskDrawer({
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
  const [activeStage, setActiveStage] = useState(columnKey);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [followUpDate, setFollowUpDate] = useState("2026-08-15");
  const [followUpTime, setFollowUpTime] = useState("10:00");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Interactive milestone checkboxes for Timeline
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({
    "m-1": true,
    "m-2": true,
    "m-3": false,
    "m-4": false,
  });

  const toggleMilestone = (id: string) => {
    setCompletedMilestones((prev) => {
      const nextState = !prev[id];
      showToast(nextState ? "Milestone marked as complete ✓" : "Milestone reopened");
      return { ...prev, [id]: nextState };
    });
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const details = useMemo(() => buildTaskDetails(task, activeStage), [task, activeStage]);
  const tabs = ["Activity", "Timeline", "Appointments", "Proposals", "Invoices", "Notifications", "Notes", "Tasks"];
  const priorityMeta = PRIORITY_META[task.priority] || { label: "Medium", dot: "bg-amber-500", tone: "bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-950/50 dark:text-amber-300" };
  const colMeta = COLUMN_META[activeStage] || COLUMN_META[columnKey] || DEFAULT_COL_META;

  return (
    <SheetContent side="right" showCloseButton={false} className="w-full gap-0 overflow-hidden p-0 sm:max-w-[960px] border-l border-zinc-200 dark:border-zinc-800 shadow-2xl bg-white dark:bg-zinc-950">
      <SheetHeader className="sr-only">
        <SheetTitle>{task.title} task details</SheetTitle>
        <SheetDescription>Details drawer for the selected task</SheetDescription>
      </SheetHeader>

      <div className="flex h-full flex-col max-h-screen relative">
        {/* Toast Notification Banner */}
        {toastMsg && (
          <div className="absolute top-14 right-6 z-50 px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold shadow-xl border border-zinc-800 animate-in fade-in slide-in-from-top-2">
            {toastMsg}
          </div>
        )}

        {/* top bar */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-6 py-3 shrink-0 bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-xs">
          <div className="flex items-center gap-3 text-[13px] text-zinc-500">
            <div className="flex overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-xs">
              <button
                onClick={onPrev}
                disabled={!hasPrev}
                className="flex h-7 w-7 items-center justify-center text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <CaretUp className="size-3.5" />
              </button>
              <button
                onClick={onNext}
                disabled={!hasNext}
                className="flex h-7 w-7 items-center justify-center border-l border-zinc-200 text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <CaretDown className="size-3.5" />
              </button>
            </div>
            <span className="font-semibold text-zinc-600 dark:text-zinc-300">
              {positionLabel} in{" "}
              <span className="font-bold text-zinc-900 dark:text-white">
                {COLUMN_TITLES[activeStage] || COLUMN_TITLES[columnKey]}
              </span>{" "}
              Stage
            </span>
          </div>
          <SheetClose asChild>
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer p-1"
            >
              <span>Close</span>
              <X className="size-4" />
            </button>
          </SheetClose>
        </div>

        <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
          {/* left column */}
          <div className="w-full md:w-[320px] shrink-0 overflow-y-auto border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 p-6 space-y-5 bg-zinc-50/40 dark:bg-zinc-900/20 scrollbar-thin relative">
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
                {COLUMN_TITLES[activeStage] || COLUMN_TITLES[columnKey]}
              </Badge>
            </div>

            <p className="mt-3 text-[12px] text-zinc-400">CRM Lead #{details.number}</p>
            <h2 className="mt-1 text-[20px] font-semibold leading-6 text-zinc-950 dark:text-white">
              {task.title}
            </h2>
            <p className="mt-1 flex items-center gap-1 text-[12px] text-zinc-500">
              <MapPin className="size-3.5 text-zinc-400" />
              {details.address}
            </p>

            {/* ACTION BUTTONS (Update Status, Calendar, 3 Dots) */}
            <div className="mt-4 flex items-center gap-2">
              {/* Update Status DropdownMenu (Portaled, zero clipping) */}
              <div className="flex-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      className="w-full rounded-full bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold cursor-pointer flex items-center justify-between"
                    >
                      <span>Update Status</span>
                      <CaretDown className="size-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48 rounded-2xl border-zinc-200 dark:border-zinc-800 p-1.5 shadow-xl bg-white dark:bg-zinc-950 z-[100]">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-2.5 py-1">Select Stage</div>
                    {Object.keys(COLUMN_TITLES).map((key) => (
                      <DropdownMenuItem
                        key={key}
                        onClick={() => {
                          setActiveStage(key);
                          showToast(`Moved to ${COLUMN_TITLES[key]} stage`);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer transition-colors",
                          activeStage === key
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                            : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        )}
                      >
                        <span>{COLUMN_TITLES[key]}</span>
                        {activeStage === key && <Check className="size-3 text-emerald-600" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Calendar Button (Opens Calendar Schedule Dialog) */}
              <div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsCalendarOpen(true)}
                  className="size-10 rounded-full cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <IconCalendarMonth className="size-4" />
                </Button>
              </div>

              {/* 3 Dots Action Menu (Portaled, zero clipping) */}
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-10 rounded-full cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <IconDotsVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-2xl border-zinc-200 dark:border-zinc-800 p-1.5 shadow-xl bg-white dark:bg-zinc-950 z-[100]">
                    <DropdownMenuItem
                      onClick={() => showToast("Opened Lead Edit Form")}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                    >
                      ✏️ Edit Lead Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => showToast("PDF Summary Generated")}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                    >
                      📄 Export PDF Summary
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => showToast("Lead Duplicated")}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                    >
                      📋 Duplicate Lead
                    </DropdownMenuItem>
                    <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />
                    <DropdownMenuItem
                      onClick={() => showToast("Lead Archived")}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 cursor-pointer"
                    >
                      📦 Archive Lead
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => { showToast("Lead Deleted"); onClose(); }}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                    >
                      🗑️ Delete Lead
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-3.5 bg-white dark:bg-zinc-900">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-medium text-zinc-500">Deal Value ({COLUMN_TITLES[columnKey]})</p>
                <button className="text-[12px] font-medium text-emerald-600 hover:underline">View Deal</button>
              </div>
              <p className="mt-1 text-[20px] font-bold text-zinc-950 dark:text-white">
                {task.value ?? "$45,000"}
              </p>
            </div>

            <div className="mt-5">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-zinc-400">
                Lead Assignees
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
                CRM Contact Details
              </p>
              <div className="mt-3 space-y-2.5 text-[13px]">
                <div className="flex items-start gap-2">
                  <Envelope className="mt-0.5 size-4 text-zinc-400" />
                  <div>
                    <p className="text-[11px] text-zinc-400">Email Address</p>
                    <p className="text-zinc-700 dark:text-zinc-200 font-medium">{details.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="mt-0.5 size-4 text-zinc-400" />
                  <div>
                    <p className="text-[11px] text-zinc-400">Phone</p>
                    <p className="text-zinc-700 dark:text-zinc-200 font-medium">{details.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <LinkedinLogo className="mt-0.5 size-4 text-zinc-400" />
                  <div>
                    <p className="text-[11px] text-zinc-400">Lead Source</p>
                    <p className="text-zinc-700 dark:text-zinc-200 font-medium">{details.source}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-zinc-400">Lead Owner</p>
              <div className="mt-3 flex items-center gap-2">
                <Avatar className="size-8 border border-zinc-200 dark:border-zinc-800">
                  <AvatarFallback className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-[11px] font-bold">
                    {(task.owner ?? "A")[0]}
                  </AvatarFallback>
                </Avatar>
                <p className="text-[13px] font-bold text-zinc-800 dark:text-zinc-100">
                  {task.owner ?? "Alex Morgan (Sales Director)"}
                </p>
              </div>
            </div>
          </div>

          {/* right column */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            <div className="flex items-center justify-between">
              <p className="text-[12px] text-zinc-500">
                Board:{" "}
                <span className="font-bold text-zinc-800 dark:text-zinc-200">CRM Pipeline & To-Do Board</span>
              </p>
              <p className="flex items-center gap-1.5 text-[12px] text-zinc-500">
                <Clock className="size-3.5" />
                Updated {task.updated ?? "recently"}
              </p>
            </div>

            {/* Stage progress bar */}
            <div className="flex items-center gap-1 overflow-x-auto rounded-full bg-zinc-100 dark:bg-zinc-900 p-1 no-scrollbar">
              {STAGE_STEPS.map((step, i) => (
                <div
                  key={step}
                  className={cn(
                    "flex-1 whitespace-nowrap rounded-full px-3 py-1.5 text-center text-[11px] font-bold cursor-pointer transition-all",
                    i === details.stageIndex
                      ? "bg-emerald-600 text-white shadow-xs"
                      : i < details.stageIndex
                        ? "text-zinc-400 dark:text-zinc-500 line-through"
                        : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200",
                  )}
                >
                  {step}
                </div>
              ))}
            </div>

            {/* Tabs Bar */}
            <div className="flex items-center gap-4 overflow-x-auto border-b border-zinc-200 dark:border-zinc-800 text-[13px] no-scrollbar">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "whitespace-nowrap pb-2.5 font-bold transition-all relative cursor-pointer",
                    tab === t
                      ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400"
                      : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300",
                  )}
                >
                  {t}
                  {t === "Appointments" ? " · 1" : t === "Proposals" ? " · 1" : t === "Tasks" ? " · 3" : ""}
                </button>
              ))}
            </div>

            {/* TAB CONTENT BRANCHES */}
            {tab === "Timeline" && (
              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between px-1">
                  <p className="text-[12px] font-extrabold uppercase tracking-wide text-zinc-400">
                    Activity Timeline 06
                  </p>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800">
                    Interactive Milestones
                  </span>
                </div>

                {/* Timeline 06 Component with Checkboxes */}
                <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-800">
                  {details.timeline.map((item, index) => {
                    const isChecked = !!completedMilestones[`m-${index + 1}`];
                    return (
                      <div key={item.id || index} className="relative">
                        <span
                          className={cn(
                            "absolute -left-6 top-1 flex size-5 items-center justify-center rounded-full text-white shadow-xs ring-4 ring-white dark:ring-zinc-950 transition-all",
                            isChecked ? "bg-emerald-500" : "bg-blue-500"
                          )}
                        >
                          {isChecked ? <Check className="size-3" /> : <Clock className="size-3" />}
                        </span>

                        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <input
                                type="checkbox"
                                id={`m-${index + 1}`}
                                checked={isChecked}
                                onChange={() => toggleMilestone(`m-${index + 1}`)}
                                className="size-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                              />
                              <label
                                htmlFor={`m-${index + 1}`}
                                className={cn(
                                  "text-xs font-bold cursor-pointer select-none transition-all",
                                  isChecked ? "text-zinc-400 dark:text-zinc-500 line-through" : "text-zinc-900 dark:text-white"
                                )}
                              >
                                {item.title}
                              </label>
                            </div>
                            <span className="text-[10px] font-medium text-zinc-400">{item.subtitle || "Recent"}</span>
                          </div>

                          {item.body && (
                            <p className={cn("text-xs text-zinc-600 dark:text-zinc-300 pl-6", isChecked && "line-through opacity-60")}>
                              {item.body}
                            </p>
                          )}

                          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[10px] font-semibold text-zinc-500">
                            <div className="flex items-center gap-1.5">
                              <Avatar className="size-5">
                                <AvatarFallback className="bg-zinc-900 text-white text-[8px]">AP</AvatarFallback>
                              </Avatar>
                              <span>Ari Parker &bull; Primary Operator</span>
                            </div>
                            <span className={cn("px-2 py-0.5 rounded-full font-bold", isChecked ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" : "bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400")}>
                              {isChecked ? "Completed" : "In Progress"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {tab === "Activity" && (
              <div className="space-y-6">
                {/* Activity Comment Input */}
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-3">
                  <textarea
                    placeholder="Write an activity comment or log update..."
                    className="w-full text-xs bg-transparent outline-none resize-none min-h-[60px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                  />
                  <div className="flex items-center justify-between border-t border-zinc-200/60 dark:border-zinc-800/80 pt-2">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <button className="p-1 hover:text-zinc-700 dark:hover:text-zinc-200"><Paperclip className="size-3.5" /></button>
                      <button className="p-1 hover:text-zinc-700 dark:hover:text-zinc-200"><CalendarBlank className="size-3.5" /></button>
                    </div>
                    <button className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer">
                      Post Comment
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[12px] font-bold uppercase tracking-wide text-zinc-400">
                    Latest Stream
                  </p>
                  <div className="space-y-3">
                    {details.activity.map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/70">
                          <div
                            className={cn(
                              "flex size-7 shrink-0 items-center justify-center rounded-full mt-0.5",
                              item.tone,
                            )}
                          >
                            <Icon className="size-3.5" weight="bold" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-zinc-800 dark:text-zinc-100">{item.title}</p>
                            <p className="text-[11px] text-zinc-400 mt-0.5">{item.meta}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {tab === "Appointments" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-bold uppercase tracking-wide text-zinc-400">
                    Scheduled Appointments
                  </p>
                  <button className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">
                    <Plus className="size-3.5" />
                    New Appointment
                  </button>
                </div>
                <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-extrabold text-zinc-900 dark:text-white">
                      {details.appointment.date}
                    </p>
                    <span className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800">
                      Confirmed
                    </span>
                  </div>
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    {details.appointment.title}
                  </p>
                  <p className="text-xs text-zinc-500">{details.appointment.time}</p>
                  <p className="text-xs text-zinc-500 flex items-center gap-1">
                    <MapPin className="size-3.5 text-zinc-400" />
                    {details.appointment.location}
                  </p>
                </div>
              </div>
            )}

            {tab === "Proposals" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-bold uppercase tracking-wide text-zinc-400">
                    Proposals & Estimates
                  </p>
                  <button className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">
                    <Plus className="size-3.5" />
                    Create Proposal
                  </button>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
                      <FileText className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900 dark:text-white">
                        #{details.proposal.id} {details.proposal.name}
                      </p>
                      <p className="text-[11px] text-zinc-400">Sent date {details.proposal.sentDate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-extrabold text-zinc-900 dark:text-white">
                      {details.proposal.amount}
                    </p>
                    <Badge className="mt-1 border-none bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 text-[10px] font-extrabold">
                      {details.proposal.status}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {tab === "Invoices" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-bold uppercase tracking-wide text-zinc-400">
                    Invoices & Billing
                  </p>
                  <button className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">
                    <Plus className="size-3.5" />
                    Generate Invoice
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
                        <FileText className="size-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-900 dark:text-white">
                          #INV-9824 Service Fee
                        </p>
                        <p className="text-[11px] text-zinc-400">Due April 30, 2025</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-extrabold text-zinc-900 dark:text-white">$1,250.00</p>
                      <Badge className="mt-1 border-none bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 text-[10px] font-extrabold">
                        Paid
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === "Notifications" && (
              <div className="space-y-4">
                <p className="text-[12px] font-bold uppercase tracking-wide text-zinc-400">
                  Task Notifications
                </p>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900 dark:text-white">Reminder Alert</span>
                      <span className="text-[10px] text-zinc-400">10m ago</span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300">Follow up scheduled for tomorrow morning at 10:00 AM.</p>
                  </div>
                </div>
              </div>
            )}

            {tab === "Notes" && (
              <div className="space-y-4">
                <p className="text-[12px] font-bold uppercase tracking-wide text-zinc-400">
                  Internal Team Notes
                </p>
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-3 bg-white dark:bg-zinc-900 space-y-3">
                  <textarea
                    placeholder="Add an internal note..."
                    className="w-full text-xs bg-transparent outline-none resize-none min-h-[50px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                  />
                  <div className="flex justify-end">
                    <button className="px-3 py-1 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold cursor-pointer">
                      Save Note
                    </button>
                  </div>
                </div>
              </div>
            )}

            {tab === "Tasks" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-bold uppercase tracking-wide text-zinc-400">
                    Sub-tasks Checklist
                  </p>
                  <button className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">
                    <Plus className="size-3.5" />
                    Add Sub-task
                  </button>
                </div>
                <div className="space-y-2.5">
                  {["Verify contact email & phone", "Send proposal draft to management", "Schedule onboarding call"].map((sub, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
                      <input type="checkbox" className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500" />
                      <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">{sub}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── SCHEDULE FOLLOW-UP & TASK MODAL (EXACT CALENDAR PAGE SPECIFICATION) ── */}
      <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <DialogContent className="sm:max-w-xl border border-zinc-200/80 dark:border-zinc-800 p-0 overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-zinc-950">
          <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto sleek-scroll space-y-6">

            {/* Top Banner / Header */}
            <div className="pb-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <DialogHeader className="text-left space-y-0.5">
                <DialogTitle className="text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                  <CalendarBlank className="size-5 text-emerald-600 dark:text-emerald-400" />
                  Schedule Task & Follow-up
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                  Set follow-up date, meeting time, priority, and reminders for this CRM lead.
                </DialogDescription>
              </DialogHeader>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Calendar Sync
              </span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsCalendarOpen(false);
                showToast(`Follow-up "${task.title}" scheduled for ${followUpDate} at ${followUpTime}`);
              }}
              className="space-y-5"
            >
              {/* Task Title Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
                  Task / Event Title
                </label>
                <input
                  type="text"
                  required
                  defaultValue={`Follow-up: ${task.title}`}
                  className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-medium text-zinc-900 dark:text-white outline-none focus:border-emerald-500 transition-all"
                />
              </div>

              {/* Date & Time Picker Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                    <CalendarBlank className="size-3.5 text-zinc-400" /> Date
                  </label>
                  <input
                    type="date"
                    required
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-bold text-zinc-900 dark:text-white outline-none focus:border-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                    <Clock className="size-3.5 text-zinc-400" /> Time
                  </label>
                  <input
                    type="time"
                    required
                    value={followUpTime}
                    onChange={(e) => setFollowUpTime(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-bold text-zinc-900 dark:text-white outline-none focus:border-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Category & Priority Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
                    Event Type
                  </label>
                  <select className="w-full h-10 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-medium text-zinc-800 dark:text-zinc-200 outline-none cursor-pointer">
                    <option value="followup">Follow-up Call</option>
                    <option value="demo">Product Demo</option>
                    <option value="proposal">Proposal Review</option>
                    <option value="onboarding">Client Onboarding</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
                    Priority Level
                  </label>
                  <select className="w-full h-10 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-medium text-zinc-800 dark:text-zinc-200 outline-none cursor-pointer">
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              {/* Notes / Agenda */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
                  Follow-up Notes & Agenda
                </label>
                <textarea
                  rows={3}
                  placeholder="Add specific details or agenda notes for this scheduled follow-up..."
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white outline-none focus:border-emerald-500 resize-none placeholder:text-zinc-400"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCalendarOpen(false)}
                  className="h-9 px-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="h-9 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-1.5"
                >
                  <CalendarBlank className="size-4" />
                  <span>Schedule Task</span>
                </button>
              </div>
            </form>

          </div>
        </DialogContent>
      </Dialog>
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

  useEffect(() => {
    const syncTasks = () => {
      try {
        const raw = localStorage.getItem("leadwave_todo_tasks");
        if (raw) {
          const stored = JSON.parse(raw);
          setColumns((prev) => ({
            ...prev,
            on_process: [...(stored.on_process || []), ...prev.on_process.filter((t: any) => !stored.on_process?.some((st: any) => st.id === t.id))],
          }));
        }
      } catch (e) {
        console.error("Failed to sync tasks", e);
      }
    };
    syncTasks();
    window.addEventListener("crm-flow-updated", syncTasks);
    return () => window.removeEventListener("crm-flow-updated", syncTasks);
  }, []);

  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  const [selected, setSelected] = useState<{ task: Task; columnKey: string } | null>(null);
  const [showAiBanner, setShowAiBanner] = useState(true);
  const [activeView, setActiveView] = useState("Kanban");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("can view");

  const [accessMembers, setAccessMembers] = useState([
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
  ]);

  const [accessRules, setAccessRules] = useState({
    viewAnalytics: true,
    inviteOthers: false,
    require2FA: false,
  });

  const [automationRules, setAutomationRules] = useState({
    onboardingEmail: true,
    autoAssignTasks: false,
  });

  const [notificationRules, setNotificationRules] = useState({
    weeklyDigest: true,
    taskAssignments: true,
  });

  const [teamTags, setTeamTags] = useState<string[]>(["Growth Team", "Designers"]);
  const [newTagInput, setNewTagInput] = useState("");
  const [showAddTagInput, setShowAddTagInput] = useState(false);

  const [inviteToast, setInviteToast] = useState<string | null>(null);

  const handleInvite = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (inviteEmail.trim()) {
      const emailTrimmed = inviteEmail.trim();
      const nameParts = emailTrimmed.split("@")[0].split(/[._-]/);
      const formattedName = nameParts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");

      const newMember = {
        id: Date.now().toString(),
        name: formattedName || "New Member",
        email: emailTrimmed,
        access: inviteRole,
        avatar: `https://i.pravatar.cc/120?u=${emailTrimmed}`,
      };

      setAccessMembers((prev) => [newMember, ...prev]);
      setInviteToast(`Invitation successfully sent to ${emailTrimmed}!`);
    } else {
      setInviteToast("Workspace invite configuration updated successfully!");
    }

    setInviteEmail("");
    setIsInviteOpen(false);

    setTimeout(() => {
      setInviteToast(null);
    }, 4000);
  };

  const filteredColumns = useMemo(() => {
    const next: Record<string, Task[]> = {};

    for (const [key, tasks] of Object.entries(columns) as [StageKey, Task[]][]) {
      next[key] = tasks.filter((task) => {
        for (const filter of activeFilters) {
          if (!filter.values || filter.values.length === 0 || !filter.values[0]) continue;
          const val = String(filter.values[0]).toLowerCase();
          if (filter.field === "priority" && task.priority.toLowerCase() !== val) {
            return false;
          }
          if (filter.field === "stage" && key.toLowerCase() !== val) {
            return false;
          }
          if (filter.field === "title") {
            const matches =
              task.title.toLowerCase().includes(val) ||
              task.description.toLowerCase().includes(val);
            if (!matches) return false;
          }
        }
        return true;
      });
    }

    return next;
  }, [columns, activeFilters]);

  const isFiltering = activeFilters.length > 0;

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
    { id: "Calendar", label: "Calendar View", icon: <CalendarCogIcon className="size-4" /> },
  ];

  return (
    <div className="w-full relative">
      <style dangerouslySetInnerHTML={{
        __html: `
        .sleek-scroll::-webkit-scrollbar { width: 5px; height: 6px; }
        .sleek-scroll::-webkit-scrollbar-track { background: transparent; }
        .sleek-scroll::-webkit-scrollbar-thumb { background: #e4e4e7; border-radius: 6px; }
        .sleek-scroll:hover::-webkit-scrollbar-thumb { background: #d4d4d8; }
        .dark .sleek-scroll::-webkit-scrollbar-thumb { background: #27272a; }
        .dark .sleek-scroll:hover::-webkit-scrollbar-thumb { background: #3f3f46; }
      `}} />
      {inviteToast && (
        <div className="fixed top-5 right-5 z-[100] flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-800 shadow-xl dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle className="size-4 text-emerald-500 shrink-0" weight="fill" />
          <span>{inviteToast}</span>
          <button onClick={() => setInviteToast(null)} className="ml-2 text-emerald-500 hover:text-emerald-700">
            <X className="size-3.5" />
          </button>
        </div>
      )}
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

            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end pb-3 -mb-3">
              <div className="flex items-center gap-2.5">
                <Filters
                  filters={activeFilters}
                  fields={TODO_FILTER_FIELDS}
                  onChange={setActiveFilters}
                />
                {activeFilters.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveFilters([])}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-500 shadow-xs transition hover:bg-zinc-50 hover:text-rose-500 hover:border-rose-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
                  >
                    <X className="size-3" />
                    Clear all
                  </button>
                )}
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
              <KanbanBoard className="grid h-full w-full auto-rows-fr grid-cols-1 gap-6 overflow-x-auto sleek-scroll pb-4 md:grid-cols-2 xl:grid-cols-4">
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

      {/* ── Invite Modal matching ReUI Form Block ── */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="sm:max-w-2xl border border-zinc-200/80 dark:border-zinc-800 p-0 overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-zinc-950">
          <div className="p-6 sm:p-8 max-h-[82vh] overflow-y-auto sleek-scroll">

            {/* Top Banner / Header */}
            <div className="mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <DialogHeader className="text-left space-y-0.5">
                <DialogTitle className="text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                  Invite Member Setup
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                  Configure member role permissions, access rules, and automated workflow.
                </DialogDescription>
              </DialogHeader>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Ready to publish
              </span>
            </div>

            <form onSubmit={handleInvite} className="space-y-6">

              {/* Row 1: Role Type */}
              <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-start">
                <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 pt-2 flex items-center gap-1">
                  Role Type
                  <Question className="size-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer" />
                </label>
                <div className="flex-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-sm text-zinc-800 shadow-xs focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 flex items-center justify-between transition-all outline-none cursor-pointer"
                      >
                        <span className="font-medium">{inviteRole}</span>
                        <CaretDown className="size-4 text-zinc-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64 rounded-xl border-zinc-200 p-1.5 shadow-xl dark:border-zinc-800 bg-white dark:bg-zinc-950 z-[100]">
                      {["Can View (Read-Only)", "Can Edit (Full Access)", "Workspace Admin"].map((role) => (
                        <DropdownMenuItem
                          key={role}
                          onClick={() => setInviteRole(role)}
                          className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          <span>{role}</span>
                          {inviteRole === role && <CheckCircle className="size-3.5 text-[#34C759]" weight="fill" />}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Row 2: Member Email & Team Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-start">
                <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 pt-2">
                  Member Email
                </label>
                <div className="flex-1 space-y-2.5">
                  <div className="relative">
                    <Envelope className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                    <input
                      required
                      type="email"
                      placeholder="E.g. colleague@northstar.studio"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="h-10 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-3.5 text-sm text-zinc-800 placeholder:text-zinc-400 shadow-xs outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:placeholder:text-zinc-500 transition-all"
                    />
                  </div>

                  {/* Team Tags */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {teamTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-100/80 px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                      >
                        <Tag className="size-3 text-zinc-400" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => setTeamTags((prev) => prev.filter((t) => t !== tag))}
                          className="text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}

                    {showAddTagInput ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          autoFocus
                          type="text"
                          placeholder="Tag name..."
                          value={newTagInput}
                          onChange={(e) => setNewTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && newTagInput.trim()) {
                              e.preventDefault();
                              setTeamTags((prev) => [...prev, newTagInput.trim()]);
                              setNewTagInput("");
                              setShowAddTagInput(false);
                            }
                          }}
                          className="h-7 w-28 rounded-md border border-zinc-300 bg-white px-2 text-xs text-zinc-800 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newTagInput.trim()) {
                              setTeamTags((prev) => [...prev, newTagInput.trim()]);
                              setNewTagInput("");
                            }
                            setShowAddTagInput(false);
                          }}
                          className="h-7 px-2 rounded-md bg-zinc-900 text-white text-[11px] font-bold dark:bg-zinc-100 dark:text-zinc-950 cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowAddTagInput(true)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-700 shadow-xs hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                      >
                        <Plus className="size-3.5" />
                        Add team tag
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 3: Access Rules */}
              <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-start">
                <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 pt-0.5">
                  Access Rules
                </label>
                <div className="flex-1 space-y-2.5">
                  <label
                    onClick={() => setAccessRules((prev) => ({ ...prev, viewAnalytics: !prev.viewAnalytics }))}
                    className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-zinc-700 dark:text-zinc-300 select-none"
                  >
                    <span
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-[5px] border transition-all",
                        accessRules.viewAnalytics
                          ? "border-[#34C759] bg-[#34C759] text-white shadow-xs"
                          : "border-zinc-300 bg-white hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
                      )}
                    >
                      {accessRules.viewAnalytics && (
                        <svg className="size-3 stroke-white" fill="none" viewBox="0 0 24 24" strokeWidth="3.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </span>
                    Allow viewing project analytics
                  </label>
                  <label
                    onClick={() => setAccessRules((prev) => ({ ...prev, inviteOthers: !prev.inviteOthers }))}
                    className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-zinc-700 dark:text-zinc-300 select-none"
                  >
                    <span
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-[5px] border transition-all",
                        accessRules.inviteOthers
                          ? "border-[#34C759] bg-[#34C759] text-white shadow-xs"
                          : "border-zinc-300 bg-white hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
                      )}
                    >
                      {accessRules.inviteOthers && (
                        <svg className="size-3 stroke-white" fill="none" viewBox="0 0 24 24" strokeWidth="3.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </span>
                    Allow inviting other members
                  </label>
                  <label
                    onClick={() => setAccessRules((prev) => ({ ...prev, require2FA: !prev.require2FA }))}
                    className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-zinc-700 dark:text-zinc-300 select-none"
                  >
                    <span
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-[5px] border transition-all",
                        accessRules.require2FA
                          ? "border-[#34C759] bg-[#34C759] text-white shadow-xs"
                          : "border-zinc-300 bg-white hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
                      )}
                    >
                      {accessRules.require2FA && (
                        <svg className="size-3 stroke-white" fill="none" viewBox="0 0 24 24" strokeWidth="3.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </span>
                    Require two-factor authentication
                  </label>
                </div>
              </div>

              {/* Row 4: Automation Rules */}
              <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-start">
                <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 pt-0.5">
                  Automation Rules
                </label>
                <div className="flex-1 space-y-2.5">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-zinc-700 dark:text-zinc-300 select-none">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={automationRules.onboardingEmail}
                      onClick={() => setAutomationRules((prev) => ({ ...prev, onboardingEmail: !prev.onboardingEmail }))}
                      className={cn(
                        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                        automationRules.onboardingEmail ? "bg-[#34C759]" : "bg-zinc-200 dark:bg-zinc-800"
                      )}
                    >
                      <span
                        className={cn(
                          "pointer-events-none inline-block size-4 rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
                          automationRules.onboardingEmail ? "translate-x-4" : "translate-x-0"
                        )}
                      />
                    </button>
                    <span className="flex items-center gap-1.5">
                      Send welcome onboarding email
                      <Question className="size-3 text-zinc-400" />
                      <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">Live</span>
                    </span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-zinc-700 dark:text-zinc-300 select-none">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={automationRules.autoAssignTasks}
                      onClick={() => setAutomationRules((prev) => ({ ...prev, autoAssignTasks: !prev.autoAssignTasks }))}
                      className={cn(
                        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                        automationRules.autoAssignTasks ? "bg-[#34C759]" : "bg-zinc-200 dark:bg-zinc-800"
                      )}
                    >
                      <span
                        className={cn(
                          "pointer-events-none inline-block size-4 rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
                          automationRules.autoAssignTasks ? "translate-x-4" : "translate-x-0"
                        )}
                      />
                    </button>
                    Auto-assign incoming project tasks
                  </label>
                </div>
              </div>

              {/* Row 5: Current Members */}
              <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-start">
                <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 pt-1 flex items-center gap-2">
                  Active Members
                  <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-600 dark:text-zinc-300">
                    {accessMembers.length}
                  </span>
                </label>
                <div className="flex-1 space-y-2 max-h-48 overflow-y-auto sleek-scroll pr-1">
                  {accessMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200/80 bg-white p-3 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/50"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="size-8 shrink-0">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-zinc-200 text-[9px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                            {member.name
                              .split(" ")
                              .map((p) => p[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{member.name}</p>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="rounded-lg bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-[10px] font-bold text-zinc-700 dark:text-zinc-300">
                          {member.access}
                        </span>
                        <button
                          type="button"
                          onClick={() => setAccessMembers((prev) => prev.filter((m) => m.id !== member.id))}
                          className="p-1 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="Remove access"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 6: Notification Rules */}
              <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-start">
                <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 pt-0.5">
                  Notification Rules
                </label>
                <div className="flex-1 space-y-2.5">
                  <label
                    onClick={() => setNotificationRules((prev) => ({ ...prev, weeklyDigest: !prev.weeklyDigest }))}
                    className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-zinc-700 dark:text-zinc-300 select-none"
                  >
                    <span
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-[5px] border transition-all",
                        notificationRules.weeklyDigest
                          ? "border-[#34C759] bg-[#34C759] text-white shadow-xs"
                          : "border-zinc-300 bg-white hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
                      )}
                    >
                      {notificationRules.weeklyDigest && (
                        <svg className="size-3 stroke-white" fill="none" viewBox="0 0 24 24" strokeWidth="3.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </span>
                    Send weekly activity digest
                  </label>
                  <label
                    onClick={() => setNotificationRules((prev) => ({ ...prev, taskAssignments: !prev.taskAssignments }))}
                    className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-zinc-700 dark:text-zinc-300 select-none"
                  >
                    <span
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-[5px] border transition-all",
                        notificationRules.taskAssignments
                          ? "border-[#34C759] bg-[#34C759] text-white shadow-xs"
                          : "border-zinc-300 bg-white hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
                      )}
                    >
                      {notificationRules.taskAssignments && (
                        <svg className="size-3 stroke-white" fill="none" viewBox="0 0 24 24" strokeWidth="3.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </span>
                    Notify on task assignments
                  </label>
                  <label className="flex items-center gap-2.5 cursor-not-allowed text-xs font-medium text-zinc-400 dark:text-zinc-500 select-none">
                    <span className="flex size-4 shrink-0 items-center justify-center rounded-[5px] border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900" />
                    <span className="flex items-center gap-1">
                      Require terms acceptance
                      <Question className="size-3 text-zinc-400" />
                    </span>
                  </label>
                </div>
              </div>

              {/* Footer matching ReUI image */}
              <div className="pt-6 mt-8 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                  Draft stays private.
                </span>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsInviteOpen(false)}
                    className="h-9 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-xs flex items-center gap-1.5 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <BookmarkSimple className="size-3.5" />
                    Save draft
                  </button>

                  <button
                    type="submit"
                    className="h-9 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    Publish invite
                  </button>
                </div>
              </div>

            </form>
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
