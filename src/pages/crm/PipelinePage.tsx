import { useState } from "react";
import {
  AirplaneTilt,
  CalendarCheck,
  CheckCircle,
  CurrencyDollar,
  Kanban,
  MagnifyingGlass,
  MapPin,
  Plus,
  TrendUp,
  UserCircle,
  X,
} from "@phosphor-icons/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

/* ================================================================
   Types & Travel CRM Pipeline Data
   ================================================================ */

export type PipelineStage = "Inquiry" | "Contacted" | "Itinerary Sent" | "Negotiation" | "Confirmed";

export type TravelDeal = {
  id: string;
  name: string;
  client: string;
  destination: string;
  value: number;
  stage: PipelineStage;
  probability: number;
  owner: string;
  closeDate: string;
  priority: "High" | "Medium" | "Low";
  guests: string;
  avatar: string;
};

const STAGES: PipelineStage[] = ["Inquiry", "Contacted", "Itinerary Sent", "Negotiation", "Confirmed"];

const INITIAL_DEALS: TravelDeal[] = [
  { id: "TRV-1048", name: "Bali Tropical Villa Package", client: "BrightPath Travel", destination: "Bali, Indonesia", value: 4850, stage: "Itinerary Sent", probability: 75, owner: "Ari Parker", closeDate: "Aug 15", priority: "High", guests: "2 Guests", avatar: "https://i.pravatar.cc/96?img=11" },
  { id: "TRV-1049", name: "Swiss Alps Ski Expedition", client: "Everwell Group", destination: "Zermatt, Switzerland", value: 9200, stage: "Negotiation", probability: 85, owner: "Sam Rivera", closeDate: "Aug 20", priority: "Medium", guests: "4 Guests", avatar: "https://i.pravatar.cc/96?img=32" },
  { id: "TRV-1050", name: "Kyoto Blossom Tour", client: "Nexa Corporate", destination: "Kyoto, Japan", value: 6400, stage: "Contacted", probability: 40, owner: "Jordan Lee", closeDate: "Aug 28", priority: "High", guests: "2 Guests", avatar: "https://i.pravatar.cc/96?img=47" },
  { id: "TRV-1051", name: "Amalfi Coast Escapes", client: "Pulse Point Travel", destination: "Amalfi, Italy", value: 12500, stage: "Inquiry", probability: 25, owner: "Maya Chen", closeDate: "Sep 05", priority: "Medium", guests: "6 Guests", avatar: "https://i.pravatar.cc/96?img=5" },
  { id: "TRV-1052", name: "Maldives Overwater Suite", client: "Atlas Leisure", destination: "Male, Maldives", value: 15800, stage: "Contacted", probability: 50, owner: "Sam Nguyen", closeDate: "Sep 12", priority: "Low", guests: "2 Guests", avatar: "https://i.pravatar.cc/96?img=12" },
  { id: "TRV-1053", name: "Kenya Safari Adventure", client: "Vertex Tours", destination: "Nairobi, Kenya", value: 8400, stage: "Inquiry", probability: 30, owner: "Ari Parker", closeDate: "Aug 25", priority: "High", guests: "3 Guests", avatar: "https://i.pravatar.cc/96?img=45" },
  { id: "TRV-1054", name: "Paris & Riviera Package", client: "Pioneer Expeditions", destination: "Paris, France", value: 18200, stage: "Itinerary Sent", probability: 70, owner: "Maya Chen", closeDate: "Sep 18", priority: "High", guests: "4 Guests", avatar: "https://i.pravatar.cc/96?img=25" },
  { id: "TRV-1055", name: "Santorini Sunset Cruise", client: "Nexus Luxury", destination: "Santorini, Greece", value: 7600, stage: "Negotiation", probability: 80, owner: "Jordan Lee", closeDate: "Aug 30", priority: "Medium", guests: "2 Guests", avatar: "https://i.pravatar.cc/96?img=56" },
  { id: "TRV-1056", name: "Iceland Northern Lights", client: "Zenith Travel Club", destination: "Reykjavik, Iceland", value: 11400, stage: "Confirmed", probability: 100, owner: "Sam Rivera", closeDate: "Aug 10", priority: "High", guests: "2 Guests", avatar: "https://i.pravatar.cc/96?img=63" },
];

const STAGE_META: Record<PipelineStage, { dot: string; header: string; badge: string }> = {
  Inquiry: { dot: "bg-sky-500", header: "bg-sky-50/70 border-sky-100 dark:bg-sky-950/40 dark:border-sky-900/40", badge: "bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300" },
  Contacted: { dot: "bg-violet-500", header: "bg-violet-50/70 border-violet-100 dark:bg-violet-950/40 dark:border-violet-900/40", badge: "bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300" },
  "Itinerary Sent": { dot: "bg-amber-500", header: "bg-amber-50/70 border-amber-100 dark:bg-amber-950/40 dark:border-amber-900/40", badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300" },
  Negotiation: { dot: "bg-blue-500", header: "bg-blue-50/70 border-blue-100 dark:bg-blue-950/40 dark:border-blue-900/40", badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300" },
  Confirmed: { dot: "bg-emerald-500", header: "bg-emerald-50/70 border-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-900/40", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300" },
};

const PRIORITY_CLASSES = {
  High: "bg-rose-50 text-rose-700 border border-rose-200/60 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/40",
  Medium: "bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/40",
  Low: "bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
};

const PROB_BAR: Record<PipelineStage, string> = {
  Inquiry: "bg-sky-500",
  Contacted: "bg-violet-500",
  "Itinerary Sent": "bg-amber-500",
  Negotiation: "bg-blue-500",
  Confirmed: "bg-emerald-500",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

/* ================================================================
   Main Travel Pipeline Page Component
   ================================================================ */

export function PipelinePage() {
  const [deals, setDeals] = useState<TravelDeal[]>(INITIAL_DEALS);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<"All" | "High" | "Medium" | "Low">("All");
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<TravelDeal | null>(null);

  // New Deal Form State
  const [newDeal, setNewDeal] = useState({
    name: "",
    client: "",
    destination: "",
    value: "",
    stage: "Inquiry" as PipelineStage,
    priority: "High" as "High" | "Medium" | "Low",
    guests: "2 Guests",
  });

  const totalValue = deals.reduce((s, d) => s + d.value, 0);
  const weightedValue = deals.reduce((s, d) => s + (d.value * d.probability) / 100, 0);
  const confirmedValue = deals.filter((d) => d.stage === "Confirmed").reduce((s, d) => s + d.value, 0);
  const activeBookings = deals.filter((d) => d.stage !== "Confirmed").length;

  const filteredDeals = deals.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.client.toLowerCase().includes(search.toLowerCase()) ||
      d.destination.toLowerCase().includes(search.toLowerCase()) ||
      d.owner.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = priorityFilter === "All" || d.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeal.name || !newDeal.value) return;

    const created: TravelDeal = {
      id: `TRV-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newDeal.name,
      client: newDeal.client || "Walk-in Client",
      destination: newDeal.destination || "Tropical Package",
      value: parseFloat(newDeal.value) || 3500,
      stage: newDeal.stage,
      probability: newDeal.stage === "Confirmed" ? 100 : newDeal.stage === "Itinerary Sent" ? 70 : 40,
      owner: "Emore Adaeze",
      closeDate: "Aug 30",
      priority: newDeal.priority,
      guests: newDeal.guests,
      avatar: "https://i.pravatar.cc/96?img=47",
    };

    setDeals([created, ...deals]);
    setIsNewModalOpen(false);
    setNewDeal({ name: "", client: "", destination: "", value: "", stage: "Inquiry", priority: "High", guests: "2 Guests" });
  };

  const handleMoveStage = (dealId: string, nextStage: PipelineStage) => {
    setDeals((prev) =>
      prev.map((d) =>
        d.id === dealId
          ? {
              ...d,
              stage: nextStage,
              probability: nextStage === "Confirmed" ? 100 : nextStage === "Itinerary Sent" ? 75 : 50,
            }
          : d
      )
    );
    if (selectedDeal && selectedDeal.id === dealId) {
      setSelectedDeal((prev) => (prev ? { ...prev, stage: nextStage } : null));
    }
  };

  const KPI_CARDS = [
    { label: "Total Pipeline Value", value: formatCurrency(totalValue), icon: CurrencyDollar, iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/60 dark:border-emerald-900/50", meta: "+14.2% this month", metaColor: "text-emerald-600 dark:text-emerald-400" },
    { label: "Weighted Forecast", value: formatCurrency(weightedValue), icon: TrendUp, iconBg: "bg-sky-50 text-sky-600 border-sky-100 dark:bg-sky-950/60 dark:border-sky-900/50", meta: "72% avg confidence", metaColor: "text-sky-600 dark:text-sky-400" },
    { label: "Confirmed Bookings", value: formatCurrency(confirmedValue), icon: CheckCircle, iconBg: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/60 dark:border-emerald-900/50", meta: "High conversion", metaColor: "text-emerald-600 dark:text-emerald-400" },
    { label: "Active Itineraries", value: String(activeBookings), icon: AirplaneTilt, iconBg: "bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-950/60 dark:border-violet-900/50", meta: "Requires follow-up", metaColor: "text-amber-600 dark:text-amber-400" },
  ];

  return (
    <main className="w-full max-w-full overflow-x-hidden pb-10 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="w-full max-w-full overflow-x-hidden px-4 py-5 sm:px-6 lg:px-8">

        {/* ── Page Header ── */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="grid size-7 place-items-center rounded-lg bg-emerald-600 text-white shadow-sm flex-shrink-0">
                <Kanban className="size-4" weight="bold" />
              </span>
              <span className="text-xs font-semibold tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
                Wanderlust Travel CRM
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-zinc-900 dark:text-white">
              Itinerary & Booking Pipeline
            </h1>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Track client inquiries, itinerary proposals, negotiations, and confirmed trip bookings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white shadow-md transition hover:bg-emerald-500 outline-none focus:outline-none"
            >
              <Plus className="size-4" weight="bold" />
              New Travel Deal
            </button>
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6 w-full">
          {KPI_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <article
                key={card.label}
                className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className={cn("size-9 rounded-xl flex items-center justify-center border shrink-0", card.iconBg)}>
                    <Icon className="size-4.5" weight="bold" />
                  </div>
                  <span className={cn("text-[11px] font-semibold truncate", card.metaColor)}>{card.meta}</span>
                </div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 truncate">{card.label}</p>
                <p className="mt-1 text-xl font-bold tracking-tight text-zinc-900 dark:text-white truncate">
                  {card.value}
                </p>
              </article>
            );
          })}
        </section>

        {/* ── Search & Filter Bar ── */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200/80 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 w-full">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <MagnifyingGlass className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-xs text-zinc-800 placeholder-zinc-400 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:focus:border-emerald-500"
              placeholder="Search destination, client, or package..."
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap shrink-0">
            <span className="text-xs text-zinc-400 font-medium mr-1">Priority:</span>
            {(["All", "High", "Medium", "Low"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold transition outline-none focus:outline-none",
                  priorityFilter === p
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* ── Kanban Board Container (Only cards scroll) ── */}
        <section className="w-full max-w-full overflow-x-auto pb-4 pt-1 rounded-2xl border border-zinc-200/80 bg-zinc-50/40 p-3 dark:border-zinc-800 dark:bg-zinc-900/30">
          <div className="flex gap-3.5 min-w-max">
            {STAGES.map((stage) => {
              const meta = STAGE_META[stage];
              const stageDeals = filteredDeals.filter((d) => d.stage === stage);
              const stageValue = stageDeals.reduce((s, d) => s + d.value, 0);

              return (
                <div
                  key={stage}
                  className="flex w-[265px] min-w-[265px] flex-none flex-col rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                >
                  {/* Column Header */}
                  <div className={cn("flex items-center justify-between gap-2 rounded-t-2xl border-b px-4 py-3", meta.header)}>
                    <div className="flex items-center gap-2">
                      <span className={cn("size-2.5 rounded-full", meta.dot)} />
                      <div>
                        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{stage}</p>
                        <p className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
                          {formatCurrency(stageValue)}
                        </p>
                      </div>
                    </div>
                    <span className={cn("rounded-lg px-2 py-0.5 text-xs font-bold", meta.badge)}>
                      {stageDeals.length}
                    </span>
                  </div>

                  {/* Deal Cards Container */}
                  <div className="flex flex-col gap-3 p-3 min-h-[140px]">
                    {stageDeals.map((deal) => (
                      <article
                        key={deal.id}
                        onClick={() => setSelectedDeal(deal)}
                        className="rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 cursor-pointer"
                      >
                        {/* Package Title & Location */}
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold leading-tight truncate text-zinc-900 dark:text-zinc-100">
                              {deal.name}
                            </p>
                            <p className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 truncate">
                              <MapPin className="size-3 flex-shrink-0" />
                              {deal.destination}
                            </p>
                          </div>
                          <span className={cn("rounded-md px-1.5 py-0.5 text-[9px] font-bold shrink-0", PRIORITY_CLASSES[deal.priority])}>
                            {deal.priority}
                          </span>
                        </div>

                        {/* Price + Guests */}
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <span className="text-sm font-extrabold tabular-nums text-zinc-900 dark:text-zinc-100">
                            {formatCurrency(deal.value)}
                          </span>
                          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                            {deal.guests}
                          </span>
                        </div>

                        {/* Probability Progress */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-medium text-zinc-400">
                            <span>Confidence</span>
                            <span className="font-bold text-zinc-600 dark:text-zinc-300">{deal.probability}%</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                            <div
                              className={cn("h-full rounded-full transition-all", PROB_BAR[deal.stage])}
                              style={{ width: `${deal.probability}%` }}
                            />
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="mt-3 flex items-center justify-between gap-2 border-t border-zinc-100 pt-2.5 dark:border-zinc-800/80">
                          <div className="flex items-center gap-2">
                            <Avatar className="size-5.5 border border-zinc-200 dark:border-zinc-700">
                              <AvatarImage src={deal.avatar} alt={deal.owner} />
                              <AvatarFallback className="text-[9px] font-bold">
                                {deal.owner.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-300 truncate max-w-[85px]">
                              {deal.client}
                            </span>
                          </div>
                          <span className="text-[10px] font-medium text-zinc-400 flex items-center gap-1 shrink-0">
                            <CalendarCheck className="size-3" />
                            {deal.closeDate}
                          </span>
                        </div>
                      </article>
                    ))}

                    {stageDeals.length === 0 && (
                      <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-white/60 p-6 text-center dark:border-zinc-800 dark:bg-zinc-950/40">
                        <UserCircle className="mb-1.5 size-7 text-zinc-300 dark:text-zinc-700" weight="bold" />
                        <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">No deals in this stage</p>
                      </div>
                    )}

                    {/* Add deal button per stage */}
                    <button
                      onClick={() => {
                        setNewDeal((prev) => ({ ...prev, stage }));
                        setIsNewModalOpen(true);
                      }}
                      className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-zinc-200 bg-white/40 px-3 py-2 text-xs font-semibold text-zinc-500 hover:border-emerald-500 hover:text-emerald-600 dark:border-zinc-800 dark:bg-transparent dark:hover:border-emerald-500 dark:hover:text-emerald-400 transition"
                    >
                      <Plus className="size-3.5" weight="bold" />
                      Add Deal
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── New Deal Modal ── */}
        {isNewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Create New Travel Deal</h3>
                <button
                  onClick={() => setIsNewModalOpen(false)}
                  className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={handleAddDeal} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Package Name</label>
                  <input
                    required
                    value={newDeal.name}
                    onChange={(e) => setNewDeal({ ...newDeal, name: e.target.value })}
                    placeholder="e.g. Maldives Luxury Suite Package"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Client Name</label>
                    <input
                      value={newDeal.client}
                      onChange={(e) => setNewDeal({ ...newDeal, client: e.target.value })}
                      placeholder="Client or Group"
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Destination</label>
                    <input
                      value={newDeal.destination}
                      onChange={(e) => setNewDeal({ ...newDeal, destination: e.target.value })}
                      placeholder="e.g. Male, Maldives"
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Value ($)</label>
                    <input
                      required
                      type="number"
                      value={newDeal.value}
                      onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })}
                      placeholder="4500"
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Stage</label>
                    <select
                      value={newDeal.stage}
                      onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value as PipelineStage })}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                    >
                      {STAGES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsNewModalOpen(false)}
                    className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
                  >
                    Save Deal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Deal Detail Drawer/Modal ── */}
        {selectedDeal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between mb-3">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                  {selectedDeal.id}
                </span>
                <button
                  onClick={() => setSelectedDeal(null)}
                  className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <X className="size-5" />
                </button>
              </div>

              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">{selectedDeal.name}</h2>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-4 flex items-center gap-1">
                <MapPin className="size-3.5" />
                {selectedDeal.destination} • {selectedDeal.client}
              </p>

              <div className="grid grid-cols-3 gap-2 text-center mb-5 rounded-xl bg-zinc-50 p-3 dark:bg-zinc-950">
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-semibold">Value</p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">{formatCurrency(selectedDeal.value)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-semibold">Stage</p>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{selectedDeal.stage}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-semibold">Guests</p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">{selectedDeal.guests}</p>
                </div>
              </div>

              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Move Stage:</p>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {STAGES.map((stg) => (
                  <button
                    key={stg}
                    onClick={() => handleMoveStage(selectedDeal.id, stg)}
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-xs font-semibold transition outline-none",
                      selectedDeal.stage === stg
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
                    )}
                  >
                    {stg}
                  </button>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedDeal(null)}
                  className="rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}