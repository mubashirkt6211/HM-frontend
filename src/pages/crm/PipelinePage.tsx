import { useEffect, useMemo, useState } from "react";
import {
  DotsThreeVertical,
  Envelope,
  FacebookLogo,
  Globe,
  InstagramLogo,
  LinkedinLogo,
  Phone,
  Plus,
  UserCircle,
  WhatsappLogo,
  Paperclip,
  ChatCircle,
  ListDashes,
  XCircle,
  ChartBar,
  TrendUp,
  ArrowUpRight,
  Target,
  CurrencyDollar,
  UsersThree,
  ShieldCheck,
  Buildings,
  Clock,
  User,
  CaretUp,
  CaretDown,
  Plug,
  BellRinging,
} from "@phosphor-icons/react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanItem,
  KanbanOverlay,
} from "@/components/reui/kanban";
import { Filters, type Filter, type FilterFieldConfig } from "@/components/reui/filters";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { Task } from "@/components/dashboard/DashboardTab";
import { TaskDrawer } from "@/components/dashboard/DashboardTab";
import type { CRMLead, LeadSource } from "@/services/crmFlowService";
import {
  getStoredPipelineLeads,
  markLeadAsWon,
  savePipelineLeads,
} from "@/services/crmFlowService";

/* ================================================================
   Filllo / Oripio Stage & Source Configuration
   ================================================================ */

export type FillloStageKey = "new" | "open" | "inprogress" | "opendeal" | "won";

const COLUMN_META: Record<
  FillloStageKey,
  {
    title: string;
    accent: string;
    dotColor: string;
    bgColor: string;
    borderColor: string;
    badgeBg: string;
    badgeText: string;
    topBar: string;
    cardHoverBorder: string;
    cardValueColor: string;
  }
> = {
  new: {
    title: "New Leads",
    accent: "bg-sky-500",
    dotColor: "bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.7)] ring-2 ring-sky-400/30",
    bgColor: "bg-sky-50/80 dark:bg-sky-950/30",
    borderColor: "border-l-sky-500 dark:border-l-sky-400",
    badgeBg: "bg-sky-100/90 dark:bg-sky-900/60 border border-sky-200/80 dark:border-sky-800/60",
    badgeText: "text-sky-800 dark:text-sky-200 font-extrabold",
    topBar: "from-sky-400 via-sky-500 to-blue-600",
    cardHoverBorder: "hover:border-sky-300 dark:hover:border-sky-700/80 hover:shadow-sky-500/10",
    cardValueColor: "text-sky-600 dark:text-sky-400",
  },
  open: {
    title: "Open Discussion",
    accent: "bg-violet-500",
    dotColor: "bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.7)] ring-2 ring-violet-400/30",
    bgColor: "bg-violet-50/80 dark:bg-violet-950/30",
    borderColor: "border-l-violet-500 dark:border-l-violet-400",
    badgeBg: "bg-violet-100/90 dark:bg-violet-900/60 border border-violet-200/80 dark:border-violet-800/60",
    badgeText: "text-violet-800 dark:text-violet-200 font-extrabold",
    topBar: "from-violet-400 via-violet-500 to-purple-600",
    cardHoverBorder: "hover:border-violet-300 dark:hover:border-violet-700/80 hover:shadow-violet-500/10",
    cardValueColor: "text-violet-600 dark:text-violet-400",
  },
  inprogress: {
    title: "In-Progress",
    accent: "bg-amber-500",
    dotColor: "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.7)] ring-2 ring-amber-400/30",
    bgColor: "bg-amber-50/80 dark:bg-amber-950/30",
    borderColor: "border-l-amber-500 dark:border-l-amber-400",
    badgeBg: "bg-amber-100/90 dark:bg-amber-900/60 border border-amber-200/80 dark:border-amber-800/60",
    badgeText: "text-amber-900 dark:text-amber-200 font-extrabold",
    topBar: "from-amber-400 via-amber-500 to-orange-500",
    cardHoverBorder: "hover:border-amber-300 dark:hover:border-amber-700/80 hover:shadow-amber-500/10",
    cardValueColor: "text-amber-600 dark:text-amber-400",
  },
  opendeal: {
    title: "Open Deal",
    accent: "bg-rose-500",
    dotColor: "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.7)] ring-2 ring-rose-400/30",
    bgColor: "bg-rose-50/80 dark:bg-rose-950/30",
    borderColor: "border-l-rose-500 dark:border-l-rose-400",
    badgeBg: "bg-rose-100/90 dark:bg-rose-900/60 border border-rose-200/80 dark:border-rose-800/60",
    badgeText: "text-rose-800 dark:text-rose-200 font-extrabold",
    topBar: "from-fuchsia-500 via-rose-500 to-pink-600",
    cardHoverBorder: "hover:border-rose-300 dark:hover:border-rose-700/80 hover:shadow-rose-500/10",
    cardValueColor: "text-rose-600 dark:text-rose-400",
  },
  won: {
    title: "Won Customer",
    accent: "bg-emerald-500",
    dotColor: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.7)] ring-2 ring-emerald-400/30",
    bgColor: "bg-emerald-50/80 dark:bg-emerald-950/30",
    borderColor: "border-l-emerald-500 dark:border-l-emerald-400",
    badgeBg: "bg-emerald-100/90 dark:bg-emerald-900/60 border border-emerald-200/80 dark:border-emerald-800/60",
    badgeText: "text-emerald-800 dark:text-emerald-200 font-extrabold",
    topBar: "from-emerald-400 via-emerald-500 to-teal-600",
    cardHoverBorder: "hover:border-emerald-300 dark:hover:border-emerald-700/80 hover:shadow-emerald-500/10",
    cardValueColor: "text-emerald-600 dark:text-emerald-400",
  },
};

const SOURCE_ICON_MAP: Record<LeadSource, { icon: any; color: string; badgeBg: string }> = {
  "Meta Ads": { icon: FacebookLogo, color: "text-blue-600", badgeBg: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200" },
  Instagram: { icon: InstagramLogo, color: "text-pink-600", badgeBg: "bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300 border-pink-200" },
  WhatsApp: { icon: WhatsappLogo, color: "text-emerald-600", badgeBg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200" },
  "Web Form": { icon: Globe, color: "text-indigo-600", badgeBg: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200" },
  LinkedIn: { icon: LinkedinLogo, color: "text-sky-600", badgeBg: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border-sky-200" },
};

// Filter Config matching installed reui Filters component
const PIPELINE_FILTER_FIELDS: FilterFieldConfig[] = [
  {
    key: "source",
    label: "Lead source",
    icon: <Globe className="size-4" />,
    type: "select",
    options: [
      { value: "Meta Ads", label: "Meta Ads", icon: <FacebookLogo className="size-4 text-blue-600" /> },
      { value: "Instagram", label: "Instagram Ads", icon: <InstagramLogo className="size-4 text-pink-600" /> },
      { value: "WhatsApp", label: "WhatsApp Inquiry", icon: <WhatsappLogo className="size-4 text-emerald-600" /> },
      { value: "Web Form", label: "Inbound Web Form", icon: <Globe className="size-4 text-indigo-600" /> },
      { value: "LinkedIn", label: "LinkedIn Campaign", icon: <LinkedinLogo className="size-4 text-sky-600" /> },
    ],
  },
  {
    key: "stage",
    label: "Pipeline stage",
    icon: <ListDashes className="size-4" />,
    type: "select",
    options: [
      { value: "new", label: "New Leads", icon: <span className="size-2.5 rounded-full bg-sky-500 inline-block shadow-xs" /> },
      { value: "open", label: "Open Discussion", icon: <span className="size-2.5 rounded-full bg-violet-500 inline-block shadow-xs" /> },
      { value: "inprogress", label: "In-Progress", icon: <span className="size-2.5 rounded-full bg-amber-500 inline-block shadow-xs" /> },
      { value: "opendeal", label: "Open Deal", icon: <span className="size-2.5 rounded-full bg-rose-500 inline-block shadow-xs" /> },
      { value: "won", label: "Won Customer", icon: <span className="size-2.5 rounded-full bg-emerald-500 inline-block shadow-xs" /> },
    ],
  },
  {
    key: "assignedTo",
    label: "Assigned Representative",
    icon: <UserCircle className="size-4" />,
    type: "select",
    options: [
      { value: "Ari Parker", label: "Ari Parker" },
      { value: "Sam Rivera", label: "Sam Rivera" },
      { value: "Jordan Lee", label: "Jordan Lee" },
      { value: "Maya Chen", label: "Maya Chen" },
    ],
  },
];

/* ================================================================
   REUI Segmented Semi-Circle Radial Arch Gauge Chart
   ================================================================ */

function SemiCircleGauge({
  value,
  activeColor = "#22c55e",
  totalTicks = 42,
}: {
  value: number;
  activeColor?: string;
  totalTicks?: number;
}) {
  const cx = 85;
  const cy = 75;
  const innerR = 48;
  const outerR = 64;

  const ticks = Array.from({ length: totalTicks }, (_, i) => {
    const t = i / (totalTicks - 1);
    const angleRad = Math.PI * (1 - t);
    const x1 = cx + innerR * Math.cos(angleRad);
    const y1 = cy - innerR * Math.sin(angleRad);
    const x2 = cx + outerR * Math.cos(angleRad);
    const y2 = cy - outerR * Math.sin(angleRad);
    const isActive = t * 100 <= value;

    return { x1, y1, x2, y2, isActive };
  });

  return (
    <svg width="170" height="85" viewBox="0 0 170 85" className="overflow-visible">
      {ticks.map((tick, i) => (
        <line
          key={i}
          x1={tick.x1}
          y1={tick.y1}
          x2={tick.x2}
          y2={tick.y2}
          stroke={tick.isActive ? activeColor : "currentColor"}
          className={cn(
            "transition-all duration-300",
            tick.isActive ? "" : "text-zinc-200 dark:text-zinc-800"
          )}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

/* ================================================================
   Main Pipeline Page Component
   ================================================================ */

interface PipelinePageProps {
  onNavigate?: (page: string) => void;
}

export function PipelinePage({ onNavigate }: PipelinePageProps = {}) {
  const [leadsList, setLeadsList] = useState<CRMLead[]>(getStoredPipelineLeads());
  const [filters, setFilters] = useState<Filter[]>([]);
  const [isCampaignsModalOpen, setIsCampaignsModalOpen] = useState(false);
  const [toastBanner, setToastBanner] = useState<string | null>(null);


  // Selected Lead Drawer State
  const [activeDrawer, setActiveDrawer] = useState<{
    lead: CRMLead & Task;
    columnKey: FillloStageKey;
    index: number;
    totalInCol: number;
  } | null>(null);

  // Listen for CRM Flow Updates across tabs/components
  useEffect(() => {
    const sync = () => setLeadsList(getStoredPipelineLeads());
    window.addEventListener("crm-flow-updated", sync);
    return () => window.removeEventListener("crm-flow-updated", sync);
  }, []);

  const showSuccessToast = (msg: string) => {
    setToastBanner(msg);
    setTimeout(() => setToastBanner(null), 4500);
  };

  // Organize Leads by Stage into Columns Map
  const columns = useMemo(() => {
    const map: Record<FillloStageKey, (CRMLead & Task)[]> = {
      new: [],
      open: [],
      inprogress: [],
      opendeal: [],
      won: [],
    };

    leadsList.forEach((lead) => {
      const taskCompat: CRMLead & Task = {
        ...lead,
        title: lead.name,
        due: "Aug 30",
        priority: "high",
        milestoneDone: 2,
        milestoneTotal: 4,
        assignees: [lead.avatar || "https://i.pravatar.cc/96?img=47"],
        attachments: 3,
        comments: 4,
        contact: lead.name,
        owner: lead.assignedTo || "Ari Parker",
      };
      if (map[lead.stage]) {
        map[lead.stage].push(taskCompat);
      } else {
        map.new.push(taskCompat);
      }
    });

    return map;
  }, [leadsList]);

  // Filtered Columns using installed reui Filters Component
  const filteredColumns = useMemo(() => {
    const next: Record<string, (CRMLead & Task)[]> = {};
    for (const [key, list] of Object.entries(columns)) {
      next[key] = list.filter((lead) => {
        // Apply installed Filters
        for (const filter of filters) {
          if (!filter.values || filter.values.length === 0 || !filter.values[0]) continue;
          const val = String(filter.values[0]).toLowerCase();
          if (filter.field === "source" && lead.source.toLowerCase() !== val) {
            return false;
          }
          if (filter.field === "stage" && key.toLowerCase() !== val) {
            return false;
          }
          if (filter.field === "assignedTo" && (lead.assignedTo || "Ari Parker").toLowerCase() !== val) {
            return false;
          }
        }
        return true;
      });
    }
    return next;
  }, [columns, filters]);

  const isFiltering = filters.length > 0;

  // Handle Drag and Drop Column Value Updates
  const handleKanbanChange = (next: Record<string, (CRMLead & Task)[]>) => {
    if (isFiltering) return;

    let wonTriggered: CRMLead | null = null;
    const updatedFlat: CRMLead[] = [];

    for (const [stageKey, items] of Object.entries(next)) {
      items.forEach((item) => {
        const prevStage = item.stage;
        const newStage = stageKey as FillloStageKey;
        const updatedItem: CRMLead = { ...item, stage: newStage };
        updatedFlat.push(updatedItem);

        if (prevStage !== "won" && newStage === "won") {
          wonTriggered = updatedItem;
        }
      });
    }

    setLeadsList(updatedFlat);
    savePipelineLeads(updatedFlat);

    if (wonTriggered) {
      const res = markLeadAsWon((wonTriggered as CRMLead).id);
      if (res) {
        showSuccessToast(
          `🎉 Lead "${res.lead.name}" Won! Passed to Leads Page & Assigned Task created on To Do Page`
        );
      }
    }
  };

  const openDrawer = (lead: CRMLead & Task, colKey: FillloStageKey) => {
    const list = filteredColumns[colKey] || [];
    const idx = list.findIndex((t) => t.id === lead.id);
    setActiveDrawer({ lead, columnKey: colKey, index: idx, totalInCol: list.length });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 p-4 md:p-8 space-y-6 relative">
      {/* Sleek Custom Scrollbar CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .sleek-scroll::-webkit-scrollbar { width: 6px; height: 7px; }
        .sleek-scroll::-webkit-scrollbar-track { background: transparent; }
        .sleek-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
        .sleek-scroll:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
        .dark .sleek-scroll::-webkit-scrollbar-thumb { background: #334155; }
        .dark .sleek-scroll:hover::-webkit-scrollbar-thumb { background: #475569; }
      `}} />

      {/* Toast Banner for Automated Flow Feedback */}
      {toastBanner && (
        <div className="fixed top-6 right-6 z-[120] max-w-md px-4 py-3 rounded-2xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold shadow-2xl border border-zinc-800 animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <span>{toastBanner}</span>
        </div>
      )}

      {/* ── TOP HEADER (Title Left | Filters & Platform Campaign Analytics Right) ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Leads Pipeline
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Track multi-channel inquiries, manage deal stages, and auto-assign tasks.
          </p>
        </div>

        {/* Right Side: Filters Component + Reset + Campaign Analytics Button */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Installed Filters Component */}
          <Filters filters={filters} fields={PIPELINE_FILTER_FIELDS} onChange={setFilters} />

          {/* Reset Filters Button */}
          {filters.length > 0 && (
            <button
              onClick={() => setFilters([])}
              className="flex items-center gap-1 text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
            >
              <XCircle className="size-4" />
              <span>Reset</span>
            </button>
          )}

          {/* Campaign Analytics CTA Button (Exact Leads Page Glossy Button Style) */}
          <Button
            size="sm"
            onClick={() => setIsCampaignsModalOpen(true)}
            className="group relative overflow-hidden h-9 rounded-md border border-blue-800/40 bg-gradient-to-b from-blue-400 via-blue-600 to-blue-700 px-4 text-xs font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_1px_rgba(0,0,0,0.15),0_4px_10px_-2px_rgba(37,99,235,0.55)] transition-all duration-150 hover:from-blue-400 hover:via-blue-500 hover:to-blue-600 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.55),inset_0_-1px_1px_rgba(0,0,0,0.15),0_6px_14px_-2px_rgba(37,99,235,0.65)] active:translate-y-px active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)] flex items-center gap-1.5 cursor-pointer"
          >
            {/* glossy top-half highlight */}
            <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-md bg-gradient-to-b from-white/40 to-white/0" />
            {/* soft diagonal sheen sweep on hover */}
            <span className="pointer-events-none absolute -inset-y-2 -left-1/2 w-1/3 -skew-x-12 bg-white/25 opacity-0 transition-all duration-500 group-hover:left-[120%] group-hover:opacity-100" />
            <ChartBar className="relative z-10 size-4" weight="bold" />
            <span className="relative z-10">Analytics</span>
          </Button>
        </div>
      </div>

      {/* ── KANBAN BOARD WITH SLEEK HORIZONTAL & NATURAL FULL PAGE SCROLLBAR ── */}
      <section className="w-full overflow-x-auto pb-6 pt-2 sleek-scroll">
        <Kanban
          value={isFiltering ? filteredColumns : columns}
          onValueChange={(next) => handleKanbanChange(next as Record<string, (CRMLead & Task)[]>)}
          getItemValue={(item) => item.id}
        >
          <KanbanBoard className="flex gap-5 items-start min-w-max">
            {Object.keys(COLUMN_META).map((colKey) => {
              const stage = colKey as FillloStageKey;
              const meta = COLUMN_META[stage];
              const list = filteredColumns[stage] || [];

              return (
                <KanbanColumn
                  key={stage}
                  value={stage}
                  className="w-[285px] min-w-[285px] rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/60 p-3.5 flex flex-col gap-3.5 border border-zinc-200/70 dark:border-zinc-800/80 relative overflow-hidden transition-all duration-200 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700"
                >
                  {/* Stage Top Accent Bar */}
                  <div className={cn("h-1 w-full bg-gradient-to-r absolute top-0 left-0 right-0", meta.topBar)} />

                  {/* Oripio-style Column Header */}
                  <div
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-xl border-l-4 shadow-2xs mt-0.5 transition-all",
                      meta.bgColor,
                      meta.borderColor
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className={cn("size-2.5 rounded-full shrink-0", meta.dotColor)} />
                      <span className="font-extrabold text-xs text-zinc-900 dark:text-zinc-100">
                        {meta.title}
                      </span>
                      <span className={cn("text-[10px] px-2 py-0.5 rounded-md font-bold shadow-2xs", meta.badgeBg, meta.badgeText)}>
                        {list.length}
                      </span>
                    </div>

                    <button
                      onClick={() => setIsCampaignsModalOpen(true)}
                      className="p-1 text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer rounded-lg hover:bg-white/60 dark:hover:bg-zinc-800/60 transition-colors"
                      title="Add lead"
                    >
                      <Plus className="size-3.5" weight="bold" />
                    </button>
                  </div>

                  {/* Column Items Container - Natural height for full page scroll */}
                  <KanbanColumnContent value={stage} className="flex flex-col gap-3 flex-1 pb-2">
                    {list.map((lead) => {
                      const SourceIcon = SOURCE_ICON_MAP[lead.source]?.icon || Globe;
                      const sourceStyle = SOURCE_ICON_MAP[lead.source];

                      return (
                        <KanbanItem key={lead.id} value={lead.id}>
                          {/* ── Oripio Styled Task Card ── */}
                          <div
                            onClick={() => openDrawer(lead, stage)}
                            className={cn(
                              "rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group",
                              meta.cardHoverBorder
                            )}
                          >
                            {/* Header Row: Source Badge & Value */}
                            <div className="flex items-center justify-between">
                              <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs", sourceStyle?.badgeBg)}>
                                <SourceIcon className={cn("size-3", sourceStyle?.color)} />
                                <span>{lead.source}</span>
                              </span>
                              <span className={cn("text-[11px] font-extrabold", meta.cardValueColor)}>
                                {lead.value}
                              </span>
                            </div>

                            {/* Lead Name & Company */}
                            <div>
                              <h3 className="text-xs font-extrabold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                {lead.name}
                              </h3>
                              <p className="text-[11px] font-medium text-zinc-400 truncate mt-0.5">
                                {lead.company}
                              </p>
                            </div>

                            {/* Email & Phone Details */}
                            <div className="space-y-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
                              <div className="flex items-center gap-1.5 truncate">
                                <Envelope className="size-3 text-zinc-400 shrink-0" />
                                <span className="truncate">{lead.email}</span>
                              </div>
                              <div className="flex items-center gap-1.5 truncate">
                                <Phone className="size-3 text-zinc-400 shrink-0" />
                                <span className="truncate">{lead.phone}</span>
                              </div>
                            </div>

                            {/* Card Footer: Avatar, Milestones & Icons */}
                            <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800 text-zinc-400 text-[10px] font-bold">
                              <div className="flex items-center gap-1.5">
                                {lead.avatar ? (
                                  <Avatar className="size-6 rounded-full border border-zinc-200 dark:border-zinc-700">
                                    <AvatarImage src={lead.avatar} />
                                    <AvatarFallback className="text-[8px]">{lead.name.slice(0, 2)}</AvatarFallback>
                                  </Avatar>
                                ) : (
                                  <div className={cn("size-6 rounded-full flex items-center justify-center text-[9px] font-bold", lead.initialsBg || "bg-blue-100 text-blue-700")}>
                                    {lead.initials || lead.name.slice(0, 2)}
                                  </div>
                                )}
                                <span className="text-zinc-500 font-semibold">{lead.assignedTo || "Ari"}</span>
                              </div>

                              <div className="flex items-center gap-2.5 text-zinc-400">
                                <span className="flex items-center gap-0.5">
                                  <Paperclip className="size-3" />
                                  <span>3</span>
                                </span>
                                <span className="flex items-center gap-0.5">
                                  <ChatCircle className="size-3" />
                                  <span>4</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </KanbanItem>
                      );
                    })}

                    {list.length === 0 && (
                      <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 p-6 text-center text-zinc-400 min-h-[120px]">
                        <UserCircle className="size-7 text-zinc-300 dark:text-zinc-700 mb-1" />
                        <p className="text-xs font-semibold">No leads in stage</p>
                      </div>
                    )}
                  </KanbanColumnContent>
                </KanbanColumn>
              );
            })}
          </KanbanBoard>

          <KanbanOverlay>
            {({ value }) => {
              const lead = leadsList.find((d) => d.id === value);
              if (!lead) return null;
              const stageMeta = COLUMN_META[lead.stage] || COLUMN_META.new;
              return (
                <div className={cn("rounded-2xl border-2 bg-white dark:bg-zinc-900 p-4 shadow-2xl space-y-2 w-64 border-l-4", stageMeta.borderColor)}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-extrabold text-zinc-900 dark:text-white">{lead.name}</p>
                    <span className={cn("text-[9px] font-extrabold px-1.5 py-0.5 rounded-md", stageMeta.badgeBg, stageMeta.badgeText)}>
                      {stageMeta.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500">{lead.email}</p>
                </div>
              );
            }}
          </KanbanOverlay>
        </Kanban>
      </section>

      {/* ── Slide-Out Task & Lead Drawer (All 8 Tabs + Functional Controls) ── */}
      <Sheet open={!!activeDrawer} onOpenChange={(open) => !open && setActiveDrawer(null)}>
        {activeDrawer && (
          <TaskDrawer
            task={activeDrawer.lead}
            columnKey={activeDrawer.columnKey}
            positionLabel={`${activeDrawer.index + 1} of ${activeDrawer.totalInCol}`}
            onClose={() => setActiveDrawer(null)}
            onPrev={() => {
              if (activeDrawer.index > 0) {
                const list = filteredColumns[activeDrawer.columnKey];
                const prevItem = list[activeDrawer.index - 1];
                setActiveDrawer({ ...activeDrawer, lead: prevItem, index: activeDrawer.index - 1 });
              }
            }}
            onNext={() => {
              const list = filteredColumns[activeDrawer.columnKey];
              if (activeDrawer.index < list.length - 1) {
                const nextItem = list[activeDrawer.index + 1];
                setActiveDrawer({ ...activeDrawer, lead: nextItem, index: activeDrawer.index + 1 });
              }
            }}
            hasPrev={activeDrawer.index > 0}
            hasNext={activeDrawer.index < (filteredColumns[activeDrawer.columnKey]?.length || 0) - 1}
          />
        )}
      </Sheet>

      {/* ── ANALYTICS CHART & KEY DETAILS MODAL ── */}
      <Dialog open={isCampaignsModalOpen} onOpenChange={setIsCampaignsModalOpen}>
        <DialogContent className="sm:max-w-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-7 rounded-3xl shadow-2xl bg-white dark:bg-zinc-950 max-h-[90vh] overflow-y-auto sleek-scroll space-y-6">
          <DialogHeader className="text-left space-y-1 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <ChartBar className="size-5" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-white">
                    Pipeline Health & Performance Metrics
                  </DialogTitle>
                  <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Real-time velocity, code coverage, uptime, and qualification analytics.
                  </DialogDescription>
                </div>
              </div>

              {/* Period Selector Pills */}
              <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl text-[11px] font-bold text-zinc-500">
                <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs">30 Days</span>
                <span className="px-2.5 py-1 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer">90 Days</span>
              </div>
            </div>
          </DialogHeader>

          {/* ── REUI SEMI-CIRCULAR RADIAL GAUGE CARDS (Exact match to screenshot) ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: Performance Metrics */}
            <div className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/80 p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white">Performance Metrics</h3>
                <button
                  onClick={() => {
                    setIsCampaignsModalOpen(false);
                    if (onNavigate) onNavigate("sales-navigator");
                  }}
                  className="px-3 py-1 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Details
                </button>
              </div>

              <div className="flex items-end justify-between pt-1">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-base font-extrabold text-zinc-900 dark:text-white">Stable</h4>
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Server Uptime: <span className="font-extrabold text-zinc-900 dark:text-white">99.7%</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex -space-x-2">
                      <Avatar className="size-6 border-2 border-white dark:border-zinc-900">
                        <AvatarImage src="https://i.pravatar.cc/96?img=47" />
                        <AvatarFallback className="text-[8px]">AP</AvatarFallback>
                      </Avatar>
                      <Avatar className="size-6 border-2 border-white dark:border-zinc-900">
                        <AvatarImage src="https://i.pravatar.cc/96?img=11" />
                        <AvatarFallback className="text-[8px]">SR</AvatarFallback>
                      </Avatar>
                      <Avatar className="size-6 border-2 border-white dark:border-zinc-900">
                        <AvatarImage src="https://i.pravatar.cc/96?img=33" />
                        <AvatarFallback className="text-[8px]">JL</AvatarFallback>
                      </Avatar>
                    </div>
                    <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                      6 reviewers
                    </span>
                  </div>
                </div>

                <div className="shrink-0 pl-2">
                  <SemiCircleGauge value={99.7} activeColor="#22c55e" />
                </div>
              </div>
            </div>

            {/* Card 2: Quality Metrics */}
            <div className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/80 p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white">Quality Metrics</h3>
                <button
                  onClick={() => {
                    setIsCampaignsModalOpen(false);
                    if (onNavigate) onNavigate("sales-navigator");
                  }}
                  className="px-3 py-1 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Details
                </button>
              </div>

              <div className="flex items-end justify-between pt-1">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-base font-extrabold text-zinc-900 dark:text-white">In Review</h4>
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Code Coverage: <span className="font-extrabold text-zinc-900 dark:text-white">48.2%</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex -space-x-2">
                      <Avatar className="size-6 border-2 border-white dark:border-zinc-900">
                        <AvatarImage src="https://i.pravatar.cc/96?img=32" />
                        <AvatarFallback className="text-[8px]">MC</AvatarFallback>
                      </Avatar>
                      <Avatar className="size-6 border-2 border-white dark:border-zinc-900">
                        <AvatarImage src="https://i.pravatar.cc/96?img=44" />
                        <AvatarFallback className="text-[8px]">AM</AvatarFallback>
                      </Avatar>
                      <Avatar className="size-6 border-2 border-white dark:border-zinc-900">
                        <AvatarImage src="https://i.pravatar.cc/96?img=1" />
                        <AvatarFallback className="text-[8px]">EH</AvatarFallback>
                      </Avatar>
                    </div>
                    <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                      9 testers
                    </span>
                  </div>
                </div>

                <div className="shrink-0 pl-2">
                  <SemiCircleGauge value={48.2} activeColor="#eab308" />
                </div>
              </div>
            </div>
          </div>

          {/* ── DETAILS BREAKDOWN SECTION ── */}
          <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-zinc-900 dark:text-white">
                Active Lead Acquisition Share
              </span>
              <span className="text-[10px] text-zinc-400 font-semibold">5 Primary Channels</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800 space-y-1">
                <div className="flex items-center gap-1.5 text-blue-600 font-bold">
                  <FacebookLogo className="size-4" />
                  <span>Meta Ads</span>
                </div>
                <p className="text-sm font-extrabold text-zinc-900 dark:text-white">$63,000</p>
                <p className="text-[10px] text-zinc-400">2 Leads (46%)</p>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800 space-y-1">
                <div className="flex items-center gap-1.5 text-sky-600 font-bold">
                  <LinkedinLogo className="size-4" />
                  <span>LinkedIn</span>
                </div>
                <p className="text-sm font-extrabold text-zinc-900 dark:text-white">$27,900</p>
                <p className="text-[10px] text-zinc-400">1 Lead (20%)</p>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800 space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-600 font-bold">
                  <Globe className="size-4" />
                  <span>Web Form</span>
                </div>
                <p className="text-sm font-extrabold text-zinc-900 dark:text-white">$22,400</p>
                <p className="text-[10px] text-zinc-400">1 Lead (16%)</p>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800 space-y-1">
                <div className="flex items-center gap-1.5 text-pink-600 font-bold">
                  <InstagramLogo className="size-4" />
                  <span>Instagram</span>
                </div>
                <p className="text-sm font-extrabold text-zinc-900 dark:text-white">$14,200</p>
                <p className="text-[10px] text-zinc-400">1 Lead (10%)</p>
              </div>
            </div>
          </div>

          {/* ── FOOTER CTA TO CAMPAIGNS PAGE ── */}
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Review launch checklists, connected apps & fallbacks
            </p>
            <Button
              size="sm"
              onClick={() => {
                setIsCampaignsModalOpen(false);
                if (onNavigate) onNavigate("sales-navigator");
              }}
              className="rounded-xl text-xs font-bold bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 cursor-pointer flex items-center gap-1.5"
            >
              <span>View Campaigns Page</span>
              <ArrowUpRight className="size-3.5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}