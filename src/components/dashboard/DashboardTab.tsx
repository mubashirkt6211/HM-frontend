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
  Phone,
  Plus,
  X,
  ArrowRight,
  Users,
  Folders,
  ListChecks,
  ChartPieSlice,
  Flag,
  CalendarDots,
  UserCircle,
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

/* ================================================================
   Types — Deal type kept for drawer compatibility
   ================================================================ */

type Priority = "high" | "medium" | "low";

type Deal = {
  id: string;
  company: string;
  contact: string;
  owner: string;
  avatar?: string;
  value: string;
  due: string;
  updated: string;
  priority: Priority;
  notes: string;
  /* extra task-card fields */
  projectCode?: string;
  pageCount?: number;
  assignees?: string[];
};

/* ================================================================
   Column config — Taskify-style task board
   ================================================================ */

const COLUMN_TITLES: Record<string, string> = {
  not_started: "Not Started",
  pending: "Pending",
  completed: "Completed",
  under_review: "Under Review",
};

const COLUMN_META: Record<string, { accent: string; dotColor: string; subtitle: string }> = {
  not_started: { accent: "bg-zinc-400", dotColor: "bg-zinc-400", subtitle: "Tasks waiting to begin" },
  pending: { accent: "bg-amber-500", dotColor: "bg-amber-500", subtitle: "Work in progress" },
  completed: { accent: "bg-emerald-500", dotColor: "bg-emerald-500", subtitle: "Successfully finished" },
  under_review: { accent: "bg-violet-500", dotColor: "bg-violet-500", subtitle: "Awaiting approval" },
};

/* Drawer stage steps — kept for DealDrawer compatibility */
const STAGE_STEPS = ["New Leads", "Request Received", "In Draft", "Proposal Sent", "Approved", "Rejected"];
const COLUMN_STAGE_INDEX: Record<string, number> = {
  not_started: 0,
  pending: 1,
  completed: 4,
  under_review: 3,
};

const PRIORITY_META: Record<Priority, { label: string; dot: string; tone: string }> = {
  high: { label: "Urgent", dot: "bg-rose-500", tone: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300" },
  medium: { label: "Medium", dot: "bg-amber-500", tone: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
  low: { label: "Low", dot: "bg-emerald-500", tone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
};

const PRIORITY_TAG: Record<Priority, string> = {
  high: "Hot Leads",
  medium: "Warm Leads",
  low: "Repeat",
};

/* ================================================================
   Task data — matches the Taskify reference image
   ================================================================ */

const INITIAL_COLUMNS: Record<string, Deal[]> = {
  not_started: [
    {
      id: "ns-1",
      company: "Partone Consultancy Website",
      contact: "Sophie Bennett",
      owner: "Ari",
      avatar: "https://i.pravatar.cc/120?img=5",
      value: "$18K",
      due: "March 21, 25",
      updated: "2h ago",
      priority: "high",
      notes: "New Homepage — rebuild landing page with modern design system.",
      projectCode: "WEB - 21",
      pageCount: 13,
      assignees: ["https://i.pravatar.cc/120?img=5", "https://i.pravatar.cc/120?img=12"],
    },
    {
      id: "ns-2",
      company: "Design Wireframes - Homepage",
      contact: "Jordan Lee",
      owner: "Sam",
      avatar: "https://i.pravatar.cc/120?img=12",
      value: "$42K",
      due: "Jan 12, 25",
      updated: "4h ago",
      priority: "medium",
      notes: "New Homepage — create wireframes for the redesigned homepage.",
      projectCode: "WEB - 68",
      pageCount: 8,
      assignees: ["https://i.pravatar.cc/120?img=12", "https://i.pravatar.cc/120?img=32"],
    },
  ],
  pending: [
    {
      id: "pd-1",
      company: "Modify Content for Homepage",
      contact: "Derek Wong",
      owner: "You",
      avatar: "https://i.pravatar.cc/120?img=45",
      value: "$64K",
      due: "May 23, 25",
      updated: "1h ago",
      priority: "high",
      notes: "New Homepage — update hero copy, feature descriptions, and CTA text.",
      projectCode: "WEB - 28",
      pageCount: 16,
      assignees: ["https://i.pravatar.cc/120?img=45", "https://i.pravatar.cc/120?img=28"],
    },
  ],
  completed: [
    {
      id: "cp-1",
      company: "MTC Design Approval",
      contact: "Emma Stone",
      owner: "You",
      avatar: "https://i.pravatar.cc/120?img=19",
      value: "$88K",
      due: "March 10, 25",
      updated: "45m ago",
      priority: "low",
      notes: "New Homepage — final design approval from stakeholders.",
      projectCode: "WEB - 12",
      pageCount: 14,
      assignees: ["https://i.pravatar.cc/120?img=19", "https://i.pravatar.cc/120?img=15"],
    },
    {
      id: "cp-2",
      company: "Nexa Components Revision",
      contact: "Ryan Cole",
      owner: "Mina",
      avatar: "https://i.pravatar.cc/120?img=15",
      value: "$36K",
      due: "March 29, 25",
      updated: "2h ago",
      priority: "medium",
      notes: "UI - Design System — revise component library for consistency.",
      projectCode: "WEB - 97",
      pageCount: 28,
      assignees: ["https://i.pravatar.cc/120?img=15", "https://i.pravatar.cc/120?img=25"],
    },
  ],
  under_review: [
    {
      id: "ur-1",
      company: "V01 Components Design System",
      contact: "Lucas Brown",
      owner: "You",
      avatar: "https://i.pravatar.cc/120?img=39",
      value: "$96K",
      due: "March 20, 25",
      updated: "15m ago",
      priority: "high",
      notes: "Components & Elements — design system v0.1 for review.",
      projectCode: "WEB - 88",
      pageCount: 14,
      assignees: ["https://i.pravatar.cc/120?img=39", "https://i.pravatar.cc/120?img=25"],
    },
  ],
};

const QUICK_ACTIONS = [
  { label: "New lead", icon: Plus },
  { label: "Add company", icon: Briefcase },
  { label: "Schedule follow-up", icon: CalendarBlank },
];

/* ================================================================
   Helpers for drawer detail content (UNCHANGED from original)
   ================================================================ */

function slug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function dealNumber(id: string) {
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) % 100000;
  return 190000 + hash;
}

function buildDealDetails(deal: Deal, columnKey: string) {
  const firstName = deal.contact.split(" ")[0] ?? deal.contact;
  return {
    number: dealNumber(deal.id),
    address: "—",
    email: `${slug(firstName)}@${slug(deal.company)}.com`,
    phone: "(555) 010-2847",
    source: "LinkedIn",
    stageIndex: COLUMN_STAGE_INDEX[columnKey] ?? 0,
    activity: [
      {
        icon: Envelope,
        tone: "bg-emerald-100 text-emerald-600",
        title: `Email delivered: ${deal.notes || "Follow-up sent"}`,
        meta: `Today · ${deal.updated}`,
      },
      {
        icon: CheckCircle,
        tone: "bg-blue-100 text-blue-600",
        title: `Stage updated for deal #${dealNumber(deal.id)}`,
        meta: `Moved to ${COLUMN_TITLES[columnKey]} · ${deal.updated}`,
      },
    ],
    appointment: {
      title: `Call with ${deal.contact}`,
      date: deal.due,
      time: "10:00 – 10:30 AM",
      location: "Video call",
      attendee: deal.contact,
    },
    proposal: {
      id: dealNumber(deal.id),
      name: deal.company,
      amount: deal.value,
      sentDate: deal.due,
      acceptedDate: "—",
      status: deal.priority === "high" ? "Pending" : deal.priority === "medium" ? "In review" : "Draft",
    },
  };
}

/* ================================================================
   Small outside-click aware dropdown shell (UNCHANGED)
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

function FilterControl({
  active,
  onToggle,
  onClear,
}: {
  active: Set<Priority>;
  onToggle: (p: Priority) => void;
  onClear: () => void;
}) {
  const count = active.size;
  return (
    <Dropdown
      trigger={(open) => (
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-1.5 rounded-full border-none font-medium",
            count > 0
              ? "bg-violet-600 text-white hover:bg-violet-700"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-200",
            open && "ring-2 ring-violet-300",
          )}
        >
          <FunnelSimple className="size-3.5" weight="bold" />
          Filter{count > 0 ? ` (${count})` : ""}
        </Button>
      )}
    >
      <div className="flex items-center justify-between px-1 pb-2">
        <p className="text-[12px] font-semibold text-zinc-700 dark:text-zinc-200">Priority</p>
        {count > 0 ? (
          <button onClick={onClear} className="text-[11px] font-medium text-violet-600 hover:underline">
            Clear all
          </button>
        ) : null}
      </div>
      <div className="space-y-1">
        {(Object.keys(PRIORITY_META) as Priority[]).map((p) => {
          const meta = PRIORITY_META[p];
          const checked = active.has(p);
          return (
            <button
              key={p}
              onClick={() => onToggle(p)}
              className="flex w-full items-center justify-between gap-2 rounded-xl px-2 py-1.5 text-left text-[13px] text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              <span className="flex items-center gap-2">
                <span className={cn("size-2 rounded-full", meta.dot)} />
                {meta.label} priority
              </span>
              <span
                className={cn(
                  "flex size-4 items-center justify-center rounded-[5px] border",
                  checked ? "border-violet-600 bg-violet-600" : "border-zinc-300 dark:border-zinc-700",
                )}
              >
                {checked ? <Check className="size-3 text-white" weight="bold" /> : null}
              </span>
            </button>
          );
        })}
      </div>
    </Dropdown>
  );
}

/* ================================================================
   Stat Card Component
   ================================================================ */

function StatCard({
  icon: Icon,
  iconBg,
  value,
  label,
}: {
  icon: React.ElementType;
  iconBg: string;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[#e8e0d8]/60 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", iconBg)}>
          <Icon className="size-5 text-white" weight="bold" />
        </div>
        <button className="flex items-center gap-1 text-[12px] font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition">
          View Details <ArrowRight className="size-3" />
        </button>
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{value}</p>
        <p className="mt-1 text-[13px] font-medium text-zinc-500">{label}</p>
      </div>
    </div>
  );
}

/* ================================================================
   Task card + column — Taskify style
   ================================================================ */

function TaskCard({ deal, asHandle, isOverlay }: { deal: Deal; asHandle?: boolean; isOverlay?: boolean }) {
  const priorityMeta = PRIORITY_META[deal.priority];

  const content = (
    <Card className="w-full border border-[#e8e0d8]/50 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm rounded-2xl hover:shadow-md transition-shadow cursor-pointer group">
      <CardContent className="p-4">
        {/* Project code + priority */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 tracking-wide">{deal.projectCode}</span>
          <Badge className={cn("border-none text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md", priorityMeta.tone)}>
            <Flag className="size-2.5 mr-1" weight="fill" />
            {priorityMeta.label}
          </Badge>
        </div>

        {/* Title + subtitle */}
        <p className="text-[13px] font-semibold text-zinc-900 dark:text-white leading-snug">{deal.company}</p>
        <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">{deal.notes?.split("—")[0]?.trim()}</p>

        {/* Due date */}
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-500">
          <CalendarDots className="size-3.5 text-zinc-400" />
          <span>Due to: {deal.due}</span>
        </div>

        {/* Footer: assignees + page count */}
        <div className="mt-3 flex items-center justify-between pt-3 border-t border-[#ece5de]/60 dark:border-zinc-800">
          <div className="flex -space-x-2">
            {(deal.assignees ?? [deal.avatar]).map((src, i) => (
              <Avatar key={i} className="size-6 border-2 border-white dark:border-zinc-950">
                <AvatarImage src={src} />
                <AvatarFallback className="bg-zinc-100 text-[8px] font-bold text-zinc-600">{deal.contact?.[0]}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-zinc-400">
            {deal.pageCount != null && (
              <span className="flex items-center gap-1">
                <FileText className="size-3" /> {deal.pageCount}
              </span>
            )}
            <span className="text-[10px]">{deal.updated?.includes("ago") ? deal.updated.replace(" ago", "") : deal.due?.split(",")[0]}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <KanbanItem value={deal.id}>
      {asHandle && !isOverlay ? <KanbanItemHandle>{content}</KanbanItemHandle> : content}
    </KanbanItem>
  );
}

function PipelineColumn({
  value,
  deals,
  isOverlay,
  onDealClick,
  draggable = true,
}: {
  value: string;
  deals: Deal[];
  isOverlay?: boolean;
  onDealClick?: (deal: Deal) => void;
  draggable?: boolean;
}) {
  const meta = COLUMN_META[value];

  return (
    <KanbanColumn value={value} className="h-full">
      <div className="flex h-full flex-col rounded-2xl bg-[#f8f4f0]/60 dark:bg-zinc-900/40 p-3">
        {/* Column header */}
        <div className="mb-3 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className={cn("size-2 rounded-full", meta.dotColor)} />
            <p className="text-[13px] font-semibold text-zinc-800 dark:text-white">{COLUMN_TITLES[value]}</p>
            <span className="rounded-full bg-[#ece5de] px-2 py-0.5 text-[10px] font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {deals.length}
            </span>
          </div>
          <KanbanColumnHandle
            render={(props) => (
              <Button {...props} variant="ghost" size="icon" className="size-7 rounded-lg hover:bg-[#ece5de] dark:hover:bg-zinc-800">
                <DotsThreeVertical className="size-4 text-zinc-400" />
              </Button>
            )}
          />
        </div>

        {/* Cards */}
        <KanbanColumnContent value={value} className="flex-1 space-y-3 overflow-y-auto pb-1">
          {deals.length === 0 ? (
            <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-[#ddd4ca] text-[12px] text-zinc-400 dark:border-zinc-800">
              No tasks match your filter
            </div>
          ) : (
            deals.map((deal) => (
              <div key={deal.id} onClick={() => onDealClick?.(deal)} className="cursor-pointer">
                <TaskCard deal={deal} asHandle={!isOverlay && draggable} isOverlay={isOverlay} />
              </div>
            ))
          )}
        </KanbanColumnContent>

        <button className="mt-3 inline-flex items-center gap-2 rounded-xl border border-dashed border-[#ddd4ca] dark:border-zinc-700 px-4 py-2.5 text-[13px] font-medium text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 w-full justify-center">
          <Plus className="size-4" />
          New Page
        </button>
      </div>
    </KanbanColumn>
  );
}

/* ================================================================
   Deal detail drawer — COMPLETELY UNCHANGED from original
   ================================================================ */

function DealDrawer({
  deal,
  columnKey,
  positionLabel,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  deal: Deal;
  columnKey: string;
  positionLabel: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  const [tab, setTab] = useState("Activity");
  const details = useMemo(() => buildDealDetails(deal, columnKey), [deal, columnKey]);
  const tabs = ["Activity", "Appointments", "Proposals", "Invoices", "Notifications", "Notes", "Tasks"];

  return (
    <SheetContent side="right" showCloseButton={false} className="w-full gap-0 overflow-hidden p-0 sm:max-w-[920px]">
      <SheetHeader className="sr-only">
        <SheetTitle>{deal.company} deal details</SheetTitle>
        <SheetDescription>Details drawer for the selected deal</SheetDescription>
      </SheetHeader>

      <div className="flex h-full flex-col">
        {/* top bar */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-3 dark:border-zinc-800">
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
              {positionLabel} in <span className="font-medium text-zinc-700 dark:text-zinc-300">{COLUMN_TITLES[columnKey]}</span> Stage
            </span>
          </div>
          <SheetClose asChild>
            <button onClick={onClose} className="flex items-center gap-1.5 text-[13px] font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
              Close
              <X className="size-3.5" />
            </button>
          </SheetClose>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* left column */}
          <div className="w-[300px] shrink-0 overflow-y-auto border-r border-zinc-200 p-5 dark:border-zinc-800">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge className="border-none bg-rose-100 text-[10px] font-semibold text-rose-600">{PRIORITY_TAG[deal.priority]}</Badge>
              <Badge className="border-none bg-zinc-100 text-[10px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                {COLUMN_TITLES[columnKey]}
              </Badge>
            </div>

            <p className="mt-3 text-[12px] text-zinc-400">Deal #{details.number}</p>
            <h2 className="mt-1 text-[20px] font-semibold leading-6 text-zinc-950 dark:text-white">{deal.company}</h2>
            <p className="mt-1 flex items-center gap-1 text-[12px] text-zinc-500">
              <MapPin className="size-3.5" />
              {details.address}
            </p>

            <div className="mt-4 flex items-center gap-2">
              <Button size="sm" className="flex-1 rounded-full bg-emerald-600 text-white hover:bg-emerald-700">
                New Proposal
              </Button>
              <Button variant="outline" size="icon" className="size-9 rounded-full">
                <CalendarBlank className="size-4" />
              </Button>
              <Button variant="outline" size="icon" className="size-9 rounded-full">
                <DotsThreeVertical className="size-4" />
              </Button>
            </div>

            <div className="mt-4 rounded-2xl border border-zinc-200 p-3.5 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-medium text-zinc-500">{COLUMN_TITLES[columnKey]}</p>
                <button className="text-[12px] font-medium text-violet-600 hover:underline">View</button>
              </div>
              <p className="mt-1 text-[20px] font-semibold text-zinc-950 dark:text-white">{deal.value}</p>
            </div>

            <div className="mt-5">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-zinc-400">Contact Details</p>
              <div className="mt-3 flex items-center gap-3">
                <Avatar className="size-10 border border-zinc-200 dark:border-zinc-800">
                  <AvatarImage src={deal.avatar} />
                  <AvatarFallback className="bg-zinc-100 text-[12px] font-semibold text-zinc-600">{deal.contact[0]}</AvatarFallback>
                </Avatar>
                <p className="text-[13px] font-semibold text-zinc-900 dark:text-white">{deal.contact}</p>
              </div>

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
              <p className="text-[12px] font-semibold uppercase tracking-wide text-zinc-400">Salesperson</p>
              <div className="mt-3 flex items-center gap-2">
                <Avatar className="size-8 border border-zinc-200 dark:border-zinc-800">
                  <AvatarFallback className="bg-zinc-100 text-[11px] font-semibold text-zinc-600">{deal.owner[0]}</AvatarFallback>
                </Avatar>
                <p className="text-[13px] font-medium text-zinc-800 dark:text-zinc-100">{deal.owner}</p>
              </div>
            </div>
          </div>

          {/* right column */}
          <div className="flex-1 overflow-y-auto p-5">
            <div className="flex items-center justify-between">
              <p className="text-[12px] text-zinc-500">
                Pipeline: <span className="font-medium text-zinc-800 dark:text-zinc-200">Deals Pipeline</span>
              </p>
              <p className="flex items-center gap-1.5 text-[12px] text-zinc-500">
                <Clock className="size-3.5" />
                Been in this stage for {deal.updated}
              </p>
            </div>

            <div className="mt-3 flex items-center gap-1 overflow-x-auto rounded-full bg-zinc-100 p-1 dark:bg-zinc-900">
              {STAGE_STEPS.map((step, i) => (
                <div
                  key={step}
                  className={cn(
                    "flex-1 whitespace-nowrap rounded-full px-3 py-1.5 text-center text-[11px] font-medium",
                    i === details.stageIndex
                      ? "bg-violet-600 text-white"
                      : i < details.stageIndex
                        ? "text-zinc-400 line-through"
                        : "text-zinc-500",
                  )}
                >
                  {step}
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-5 overflow-x-auto border-b border-zinc-200 text-[13px] dark:border-zinc-800">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "whitespace-nowrap pb-3 font-medium transition",
                    tab === t ? "border-b-2 border-zinc-900 text-zinc-900 dark:border-white dark:text-white" : "text-zinc-500",
                  )}
                >
                  {t}
                  {t === "Appointments" ? " · 1" : t === "Proposals" ? " · 1" : ""}
                </button>
              ))}
            </div>

            {tab === "Activity" ? (
              <div className="mt-4">
                <p className="text-[12px] font-semibold uppercase tracking-wide text-zinc-400">Latest Activity</p>
                <div className="mt-3 space-y-3">
                  {details.activity.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="flex items-start gap-3">
                        <div className={cn("flex size-7 shrink-0 items-center justify-center rounded-full", item.tone)}>
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
                <p className="text-[12px] font-semibold uppercase tracking-wide text-zinc-400">Appointments</p>
                <button className="flex items-center gap-1 text-[12px] font-medium text-emerald-600 hover:underline">
                  <Plus className="size-3.5" />
                  Create appointment
                </button>
              </div>
              <div className="mt-3 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[13px] font-semibold text-zinc-900 dark:text-white">{details.appointment.date}</p>
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
                <p className="text-[12px] font-semibold uppercase tracking-wide text-zinc-400">Proposals</p>
                <button className="flex items-center gap-1 text-[12px] font-medium text-emerald-600 hover:underline">
                  <Plus className="size-3.5" />
                  Create proposal
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
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
                  <p className="text-[13px] font-semibold text-zinc-900 dark:text-white">{details.proposal.amount}</p>
                  <Badge className="mt-1 border-none bg-amber-100 text-[10px] font-semibold text-amber-700">{details.proposal.status}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SheetContent>
  );
}

function TimelineView({
  filteredColumns,
  onDealClick,
}: {
  filteredColumns: Record<string, Deal[]>;
  onDealClick: (deal: Deal, columnKey: string) => void;
}) {
  const allTasks = useMemo(() => {
    return Object.entries(filteredColumns).flatMap(([key, deals]) =>
      deals.map((d) => ({ ...d, columnKey: key }))
    );
  }, [filteredColumns]);

  if (allTasks.length === 0) {
    return (
       <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-[#ddd4ca] text-[13px] text-zinc-500 dark:border-zinc-800">
         No tasks found for timeline
       </div>
    );
  }

  return (
    <div className="relative pl-6 py-4 space-y-6 max-h-[600px] overflow-y-auto pr-4">
      <div className="absolute left-[11px] top-6 bottom-6 w-0.5 bg-[#e8e0d8] dark:bg-zinc-800" />
      {allTasks.map((task) => {
        const meta = COLUMN_META[task.columnKey];
        return (
          <div key={task.id} className="relative flex items-start gap-4">
            <div className={cn("absolute -left-[26px] top-[22px] size-3 rounded-full border-2 border-white dark:border-zinc-950 z-10", meta.dotColor)} />
            <div className="flex-1 max-w-sm cursor-pointer" onClick={() => onDealClick(task, task.columnKey)}>
              <TaskCard deal={task} asHandle={false} isOverlay={false} />
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

function SpreadsheetView({
  filteredColumns,
  onDealClick,
}: {
  filteredColumns: Record<string, Deal[]>;
  onDealClick: (deal: Deal, columnKey: string) => void;
}) {
  const allTasks = useMemo(() => {
    return Object.entries(filteredColumns).flatMap(([key, deals]) =>
      deals.map((d) => ({ ...d, columnKey: key }))
    );
  }, [filteredColumns]);

  if (allTasks.length === 0) {
    return (
       <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-[#ddd4ca] text-[13px] text-zinc-500 dark:border-zinc-800">
         No tasks found for spreadsheet
       </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[#e8e0d8]/60 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm mt-4">
      <table className="w-full text-left text-[13px]">
        <thead>
          <tr className="border-b border-[#e8e0d8]/60 bg-[#f8f4f0]/60 dark:border-zinc-800 dark:bg-zinc-900/40 text-zinc-500">
            <th className="px-4 py-3 font-medium whitespace-nowrap">Task Name</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Code</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Status</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Priority</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Due Date</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Assignees</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e8e0d8]/60 dark:divide-zinc-800">
          {allTasks.map((task) => {
            const meta = COLUMN_META[task.columnKey];
            const priorityMeta = PRIORITY_META[task.priority];
            return (
              <tr 
                key={task.id} 
                className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer transition-colors"
                onClick={() => onDealClick(task, task.columnKey)}
              >
                <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100 max-w-[200px] truncate">
                  {task.company}
                </td>
                <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">
                  {task.projectCode}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className={cn("size-2 rounded-full shrink-0", meta.dotColor)} />
                    <span className="text-zinc-700 dark:text-zinc-300 font-medium">{COLUMN_TITLES[task.columnKey]}</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Badge className={cn("border-none text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md", priorityMeta.tone)}>
                    {priorityMeta.label}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">
                  {task.due}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex -space-x-2">
                    {(task.assignees ?? [task.avatar]).map((src, i) => (
                      <Avatar key={i} className="size-6 border-2 border-white dark:border-zinc-950">
                        <AvatarImage src={src} />
                        <AvatarFallback className="bg-zinc-100 text-[8px] font-bold text-zinc-600">{task.contact?.[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ================================================================
   Main DashboardTab — Taskify Overview
   ================================================================ */

export function DashboardTab() {
  const [columns, setColumns] = useState(INITIAL_COLUMNS);
  const [priorityFilter, setPriorityFilter] = useState<Set<Priority>>(new Set());
  const [selected, setSelected] = useState<{ deal: Deal; columnKey: string } | null>(null);
  const [showAiBanner, setShowAiBanner] = useState(true);
  const [activeView, setActiveView] = useState("Kanban");

  const totalCards = useMemo(() => Object.values(columns).flat().length, [columns]);

  const filteredColumns = useMemo(() => {
    if (priorityFilter.size === 0) return columns;
    const next: Record<string, Deal[]> = {};
    for (const [key, deals] of Object.entries(columns)) {
      next[key] = deals.filter((d) => priorityFilter.has(d.priority));
    }
    return next;
  }, [columns, priorityFilter]);

  const visibleCount = useMemo(() => Object.values(filteredColumns).flat().length, [filteredColumns]);
  const isFiltering = priorityFilter.size > 0;

  const togglePriority = (p: Priority) => {
    setPriorityFilter((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });
  };

  const openDeal = (deal: Deal, columnKey: string) => setSelected({ deal, columnKey });
  const closeDeal = () => setSelected(null);

  // If the currently-open deal gets filtered out from under the drawer, close it.
  useEffect(() => {
    if (!selected) return;
    const stillVisible = filteredColumns[selected.columnKey]?.some((d) => d.id === selected.deal.id);
    if (!stillVisible) setSelected(null);
  }, [filteredColumns, selected]);

  const columnDeals = selected ? filteredColumns[selected.columnKey] ?? [] : [];
  const indexInColumn = selected ? columnDeals.findIndex((d) => d.id === selected.deal.id) : -1;

  const goPrev = () => {
    if (!selected || indexInColumn <= 0) return;
    setSelected({ deal: columnDeals[indexInColumn - 1], columnKey: selected.columnKey });
  };
  const goNext = () => {
    if (!selected || indexInColumn === -1 || indexInColumn >= columnDeals.length - 1) return;
    setSelected({ deal: columnDeals[indexInColumn + 1], columnKey: selected.columnKey });
  };

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-full px-6 py-6 lg:px-10">

        {/* ── Welcome Banner ── */}
        <section>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Welcome Back David..!
          </h1>
          <p className="mt-2 text-[14px] text-zinc-500 dark:text-zinc-400">
            Stay on top of your tasks, monitor progress, and track status.
          </p>
        </section>

        {/* ── AI Notification Banner ── */}
        {showAiBanner && (
          <section className="mt-5">
            <div className="flex items-center justify-between rounded-2xl border border-[#e8e0d8]/60 bg-gradient-to-r from-[#faf7f4] via-white to-[#faf7f4] px-5 py-3.5 shadow-sm dark:border-zinc-800 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30">
                  <ListChecks className="size-4 text-violet-600" weight="bold" />
                </div>
                <p className="text-[13px] text-zinc-700 dark:text-zinc-300">
                  <span className="font-semibold text-zinc-900 dark:text-white">Taskify AI is now available.</span>{" "}
                  Access your activity and timeline right away on all new dashboard
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-[#e0d8d0] text-[12px] font-semibold text-zinc-700 hover:bg-[#f5f0eb] dark:border-zinc-700 dark:text-zinc-300"
                >
                  View Details
                </Button>
                <button onClick={() => setShowAiBanner(false)} className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition">
                  <X className="size-4" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ── Stat Cards ── */}
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Users} iconBg="bg-[#c2b5a8]" value="216" label="Active Employees" />
          <StatCard icon={Folders} iconBg="bg-[#a8b5c2]" value="312" label="Active Projects" />
          <StatCard icon={ListChecks} iconBg="bg-[#b5c2a8]" value="184" label="Number of Task" />
          <StatCard icon={ChartPieSlice} iconBg="bg-[#c2a8b5]" value="84.12%" label="Target Percentage Completed" />
        </section>

        {/* ── Kanban Board Section ── */}
        <section className="mt-8">
          <div className="rounded-2xl border border-[#e8e0d8]/40 bg-[#faf7f4]/50 dark:border-zinc-800 dark:bg-zinc-950/50 p-4 shadow-sm">
            {/* View tabs & toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#ece5de]/60 dark:border-zinc-800 pb-3 mb-4">
              <div className="flex items-center gap-1 bg-[#f0ebe5] dark:bg-zinc-900 rounded-xl p-1">
                {["Kanban", "Timeline", "Spreadsheet", "Calendar"].map((view) => (
                  <button
                    key={view}
                    onClick={() => setActiveView(view)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all",
                      activeView === view
                        ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                        : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                    )}
                  >
                    {view === "Kanban" && <span className="mr-1.5">📋</span>}
                    {view === "Timeline" && <span className="mr-1.5">📈</span>}
                    {view === "Spreadsheet" && <span className="mr-1.5">📊</span>}
                    {view === "Calendar" && <span className="mr-1.5">📅</span>}
                    {view}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {isFiltering ? (
                  <button
                    onClick={() => setPriorityFilter(new Set())}
                    className="flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1.5 text-[12px] font-medium text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-900"
                  >
                    <X className="size-3" />
                    Reset
                  </button>
                ) : null}
                <FilterControl active={priorityFilter} onToggle={togglePriority} onClear={() => setPriorityFilter(new Set())} />
                <Button size="sm" className="rounded-xl bg-zinc-900 text-white text-[12px] font-semibold hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 gap-1.5 px-4">
                  New <CaretDown className="size-3 opacity-60" />
                </Button>
              </div>
            </div>

            {isFiltering ? (
              <p className="mb-3 px-1 text-[12px] text-zinc-400">
                Drag &amp; drop is paused while a filter is active — clear the filter to reorder cards.
              </p>
            ) : null}

            {activeView === "Kanban" && (
              <Kanban
                value={filteredColumns}
                onValueChange={setColumns}
                getItemValue={(item) => item.id}
                className="h-full"
              >
                <KanbanBoard className="grid h-full w-full auto-rows-fr grid-cols-1 gap-4 overflow-hidden md:grid-cols-2 xl:grid-cols-4">
                  {Object.entries(filteredColumns).map(([columnValue, deals]) => (
                    <PipelineColumn
                      key={columnValue}
                      value={columnValue}
                      deals={deals}
                      draggable={!isFiltering}
                      onDealClick={(deal) => openDeal(deal, columnValue)}
                    />
                  ))}
                </KanbanBoard>
                <KanbanOverlay>
                  {({ value, variant }) => {
                    if (variant === "column") {
                      return <PipelineColumn value={value as string} deals={filteredColumns[value as string]} isOverlay />;
                    }

                    const deal = Object.values(filteredColumns).flat().find((item) => item.id === value);
                    return deal ? <TaskCard deal={deal} isOverlay /> : null;
                  }}
                </KanbanOverlay>
              </Kanban>
            )}

            {activeView === "Timeline" && (
              <TimelineView filteredColumns={filteredColumns} onDealClick={openDeal} />
            )}

            {activeView === "Spreadsheet" && (
              <SpreadsheetView filteredColumns={filteredColumns} onDealClick={openDeal} />
            )}

            {(activeView === "Calendar") && (
              <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-[#ddd4ca] text-[13px] text-zinc-500 dark:border-zinc-800">
                {activeView} view is coming soon.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ── Drawer (Sheet) — UNCHANGED LOGIC ── */}
      <Sheet open={!!selected} onOpenChange={(open) => !open && closeDeal()}>
        {selected ? (
          <DealDrawer
            deal={selected.deal}
            columnKey={selected.columnKey}
            positionLabel={`${indexInColumn + 1} of ${columnDeals.length}`}
            onClose={closeDeal}
            onPrev={goPrev}
            onNext={goNext}
            hasPrev={indexInColumn > 0}
            hasNext={indexInColumn < columnDeals.length - 1}
          />
        ) : null}
      </Sheet>
    </div>
  );
}