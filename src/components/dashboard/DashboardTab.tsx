import { useMemo, useState } from "react";
import {
  Briefcase,
  CalendarBlank,
  CaretDown,
  CaretUp,
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
};

const COLUMN_TITLES: Record<string, string> = {
  lead: "Lead",
  qualified: "Qualified",
  proposal: "Proposal",
  negotiation: "Negotiation",
};

const COLUMN_META: Record<string, { accent: string; subtitle: string }> = {
  lead: { accent: "bg-cyan-500", subtitle: "New opportunities entering the funnel" },
  qualified: { accent: "bg-violet-500", subtitle: "Verified accounts with real intent" },
  proposal: { accent: "bg-amber-500", subtitle: "Quotes, scopes, and commercial review" },
  negotiation: { accent: "bg-emerald-500", subtitle: "Closing conversations and approvals" },
};

const STAGE_STEPS = ["New Leads", "Request Received", "In Draft", "Proposal Sent", "Approved", "Rejected"];
const COLUMN_STAGE_INDEX: Record<string, number> = {
  lead: 0,
  qualified: 1,
  proposal: 3,
  negotiation: 4,
};

const INITIAL_COLUMNS: Record<string, Deal[]> = {
  lead: [
    {
      id: "lead-1",
      company: "Northwind Labs",
      contact: "Maya Chen",
      owner: "Ari",
      avatar: "https://i.pravatar.cc/120?img=5",
      value: "$18K",
      due: "Today",
      updated: "2h ago",
      priority: "high",
      notes: "Inbound demo request from the product team.",
    },
    {
      id: "lead-2",
      company: "Atlas Commerce",
      contact: "Jordan Lee",
      owner: "Sam",
      avatar: "https://i.pravatar.cc/120?img=12",
      value: "$42K",
      due: "Tomorrow",
      updated: "4h ago",
      priority: "medium",
      notes: "Requested pricing and implementation timeline.",
    },
    {
      id: "lead-3",
      company: "BluePeak Studio",
      contact: "Nina Patel",
      owner: "You",
      avatar: "https://i.pravatar.cc/120?img=32",
      value: "$12K",
      due: "Thu",
      updated: "6h ago",
      priority: "low",
      notes: "Cold outreach response with follow-up interest.",
    },
  ],
  qualified: [
    {
      id: "qualified-1",
      company: "Futura Health",
      contact: "Derek Wong",
      owner: "You",
      avatar: "https://i.pravatar.cc/120?img=45",
      value: "$64K",
      due: "Today",
      updated: "1h ago",
      priority: "high",
      notes: "Discovery completed and budget confirmed.",
    },
    {
      id: "qualified-2",
      company: "Vertex Retail",
      contact: "Olivia Gomez",
      owner: "Mina",
      avatar: "https://i.pravatar.cc/120?img=28",
      value: "$28K",
      due: "Fri",
      updated: "3h ago",
      priority: "medium",
      notes: "Need stakeholder mapping before proposal.",
    },
  ],
  proposal: [
    {
      id: "proposal-1",
      company: "Summit Finance",
      contact: "Emma Stone",
      owner: "You",
      avatar: "https://i.pravatar.cc/120?img=19",
      value: "$88K",
      due: "Today",
      updated: "45m ago",
      priority: "high",
      notes: "Proposal sent; waiting for procurement feedback.",
    },
    {
      id: "proposal-2",
      company: "Luma Media",
      contact: "Ryan Cole",
      owner: "Mina",
      avatar: "https://i.pravatar.cc/120?img=15",
      value: "$36K",
      due: "Tomorrow",
      updated: "2h ago",
      priority: "medium",
      notes: "Pricing approved, scope refinements pending.",
    },
  ],
  negotiation: [
    {
      id: "negotiation-1",
      company: "Orion Systems",
      contact: "Lucas Brown",
      owner: "You",
      avatar: "https://i.pravatar.cc/120?img=39",
      value: "$96K",
      due: "Today",
      updated: "15m ago",
      priority: "high",
      notes: "Legal review and final signature steps.",
    },
    {
      id: "negotiation-2",
      company: "Canvas Group",
      contact: "Zoe Martin",
      owner: "Sam",
      avatar: "https://i.pravatar.cc/120?img=25",
      value: "$48K",
      due: "Thu",
      updated: "1h ago",
      priority: "medium",
      notes: "Discount approval requested by finance.",
    },
  ],
};

const QUICK_ACTIONS = [
  { label: "New lead", icon: Plus },
  { label: "Add company", icon: Briefcase },
  { label: "Schedule follow-up", icon: CalendarBlank },
];

const PRIORITY_TAG: Record<Priority, string> = {
  high: "Hot Leads",
  medium: "Warm Leads",
  low: "Repeat",
};

/* ---------- helpers to fabricate the drawer's detail content from a Deal ---------- */

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

/* ---------- deal card + column (unchanged board pieces) ---------- */

function DealCard({ deal, asHandle, isOverlay }: { deal: Deal; asHandle?: boolean; isOverlay?: boolean }) {
  const priorityTone = {
    high: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
    medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    low: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
  }[deal.priority];

  const content = (
    <Card className="border border-zinc-200/70 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm rounded-[24px]">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-zinc-950 dark:text-white">{deal.company}</p>
            <p className="mt-1 text-[12px] text-zinc-500">{deal.contact}</p>
          </div>
          <Badge className={cn("border-none text-[10px] font-semibold uppercase tracking-wider", priorityTone)}>{deal.priority}</Badge>
        </div>

        <p className="mt-3 line-clamp-3 text-[12px] leading-5 text-zinc-600 dark:text-zinc-400">{deal.notes}</p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Avatar className="size-7 border border-zinc-200 dark:border-zinc-800">
              <AvatarImage src={deal.avatar} />
              <AvatarFallback className="bg-zinc-100 text-[10px] font-semibold text-zinc-600">{deal.contact[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-[11px] font-medium text-zinc-500">Owner: {deal.owner}</p>
              <p className="text-[11px] text-zinc-400">{deal.updated}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[14px] font-semibold text-zinc-950 dark:text-white">{deal.value}</p>
            <p className="text-[11px] text-zinc-500">Due {deal.due}</p>
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
}: {
  value: string;
  deals: Deal[];
  isOverlay?: boolean;
  onDealClick?: (deal: Deal) => void;
}) {
  const meta = COLUMN_META[value];

  return (
    <KanbanColumn value={value} className="h-full">
      <div className="flex h-full flex-col rounded-[28px] border border-zinc-200/70 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 p-3">
        <div className="mb-3 flex items-start justify-between gap-3 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 p-3.5">
          <div className="flex min-w-0 items-start gap-3">
            <span className={cn("mt-1 size-2.5 rounded-full", meta.accent)} />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-zinc-950 dark:text-white">{COLUMN_TITLES[value]}</p>
              <p className="mt-1 text-[11px] leading-4 text-zinc-500">{meta.subtitle}</p>
            </div>
          </div>
          <KanbanColumnHandle
            render={(props) => (
              <Button {...props} variant="ghost" size="icon" className="size-8 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900">
                <DotsThreeVertical className="size-4 text-zinc-400" />
              </Button>
            )}
          />
        </div>

        <KanbanColumnContent value={value} className="flex-1 space-y-3 overflow-y-auto pb-1">
          {deals.map((deal) => (
            <div key={deal.id} onClick={() => onDealClick?.(deal)} className="cursor-pointer">
              <DealCard deal={deal} asHandle={!isOverlay} isOverlay={isOverlay} />
            </div>
          ))}
        </KanbanColumnContent>

        <button className="mt-3 inline-flex items-center gap-2 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300">
          <Plus className="size-4" />
          Add card
        </button>
      </div>
    </KanbanColumn>
  );
}

/* ---------- deal detail drawer ---------- */

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
    <SheetContent side="right" className="w-full gap-0 overflow-hidden p-0 sm:max-w-[920px]">
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

/* ---------- page ---------- */

export function DashboardTab() {
  const [columns, setColumns] = useState(INITIAL_COLUMNS);
  const [selected, setSelected] = useState<{ deal: Deal; columnKey: string } | null>(null);
  const totalCards = useMemo(() => Object.values(columns).flat().length, [columns]);

  const openDeal = (deal: Deal, columnKey: string) => setSelected({ deal, columnKey });
  const closeDeal = () => setSelected(null);

  const columnDeals = selected ? columns[selected.columnKey] : [];
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
      <div className="mx-auto max-w-400 px-6 py-8 lg:px-10">
        <section className="mt-8">
          <div className="rounded-[32px] border border-zinc-200/70 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/80 p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-zinc-500">Pipeline</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">Kanban stages</h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <FunnelSimple className="size-4" />
                {totalCards} cards
              </div>
            </div>

            <div className="mt-6 overflow-hidden">
              <div className="mb-4 flex items-center gap-6 border-b border-zinc-200/60 dark:border-zinc-800 px-1 pb-3 text-sm">
                <button className="font-medium text-zinc-500">List View</button>
                <button className="border-b-2 border-zinc-900 pb-3 font-semibold text-zinc-900 dark:border-zinc-100 dark:text-white -mb-3">Kanban</button>
                <button className="font-medium text-zinc-500">Calendar</button>
                <button className="font-medium text-zinc-500">+ Add View</button>
                <div className="ml-auto flex items-center gap-2">
                  <Button variant="outline" size="sm" className="rounded-full border-violet-200 bg-violet-600 text-white hover:bg-violet-700">
                    Filter (1)
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full">
                    + Add Task
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full">
                    Customize
                  </Button>
                </div>
              </div>
              <Kanban
                value={columns}
                onValueChange={setColumns}
                getItemValue={(item) => item.id}
                className="h-full"
              >
                <KanbanBoard className="grid h-full auto-rows-fr grid-cols-1 gap-4 overflow-hidden xl:grid-cols-4">
                  {Object.entries(columns).map(([columnValue, deals]) => (
                    <PipelineColumn
                      key={columnValue}
                      value={columnValue}
                      deals={deals}
                      onDealClick={(deal) => openDeal(deal, columnValue)}
                    />
                  ))}
                </KanbanBoard>
                <KanbanOverlay>
                  {({ value, variant }) => {
                    if (variant === "column") {
                      return <PipelineColumn value={value as string} deals={columns[value as string]} isOverlay />;
                    }

                    const deal = Object.values(columns).flat().find((item) => item.id === value);
                    return deal ? <DealCard deal={deal} isOverlay /> : null;
                  }}
                </KanbanOverlay>
              </Kanban>
            </div>
          </div>
        </section>
      </div>

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