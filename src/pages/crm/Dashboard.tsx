import { useMemo, useState } from "react";
import {
  AirplaneTilt,
  ArrowsLeftRight,
  Bell,
  CaretDown,
  CaretRight,
  CaretUpDown,
  ChartBar,
  CheckCircle,
  ChatCircleDots,
  Clock,
  Compass,
  Cube,
  DotsThree,
  DotsSixVertical,
  Envelope,
  FolderSimple,
  Funnel,
  Gear,
  Globe,
  Image,
  MagnifyingGlass,
  MapPin,
  SquaresFour,
  Tray,
  TrendUp,
  UsersThree,
  Wrench,
  XCircle,
} from "@phosphor-icons/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ReportPeriod = "Last 7 days" | "Last 30 days" | "Last 3 months" | "Last 12 months";

const reportPeriods: ReportPeriod[] = ["Last 7 days", "Last 30 days", "Last 3 months", "Last 12 months"];

type ChartPeriod = "Week" | "Month" | "Quarter" | "Year";
const chartPeriods: ChartPeriod[] = ["Week", "Month", "Quarter", "Year"];

const chartDatasets: Record<ChartPeriod, { label: string; sales: number }[]> = {
  Week: [
    { label: "Mon", sales: 310 },
    { label: "Tue", sales: 520 },
    { label: "Wed", sales: 480 },
    { label: "Thu", sales: 640 },
    { label: "Fri", sales: 720 },
    { label: "Sat", sales: 390 },
    { label: "Sun", sales: 210 },
  ],
  Month: [
    { label: "Jan", sales: 420 },
    { label: "Feb", sales: 280 },
    { label: "Mar", sales: 520 },
    { label: "Apr", sales: 760 },
    { label: "May", sales: 610 },
    { label: "Jun", sales: 480 },
    { label: "Jul", sales: 700 },
    { label: "Aug", sales: 560 },
  ],
  Quarter: [
    { label: "Q1", sales: 640 },
    { label: "Q2", sales: 820 },
    { label: "Q3", sales: 750 },
    { label: "Q4", sales: 490 },
  ],
  Year: [
    { label: "2021", sales: 340 },
    { label: "2022", sales: 510 },
    { label: "2023", sales: 620 },
    { label: "2024", sales: 740 },
    { label: "2025", sales: 810 },
  ],
};

const chartHighlight: Record<ChartPeriod, string> = {
  Week: "Fri",
  Month: "Apr",
  Quarter: "Q2",
  Year: "2025",
};

const orders = [
  { product: "Bali Luxury Resort Package", orderId: "#TRV-719018", date: "15 Aug 2026", customer: "Soke Bahtera", status: "Confirmed", items: "2 Travelers", price: "$2,450.00", avatar: "https://i.pravatar.cc/96?img=47" },
  { product: "Swiss Alps Ski Expedition", orderId: "#TRV-A24E2C", date: "20 Sep 2026", customer: "Paradila Djarwa", status: "Confirmed", items: "3 Travelers", price: "$4,800.00", avatar: "https://i.pravatar.cc/96?img=32" },
  { product: "Kyoto Cherry Blossom Tour", orderId: "#TRV-710175", date: "10 Oct 2026", customer: "Stevandio Vanu", status: "Pending", items: "2 Travelers", price: "$3,150.00", avatar: "https://i.pravatar.cc/96?img=12" },
  { product: "Amalfi Coast Villa Escape", orderId: "#TRV-710162", date: "05 Nov 2026", customer: "Mia Chen", status: "Confirmed", items: "4 Travelers", price: "$5,200.00", avatar: "https://i.pravatar.cc/96?img=5" },
  { product: "Kenya Safari Adventure", orderId: "#TRV-882190", date: "12 Dec 2026", customer: "Alex Rivera", status: "Cancelled", items: "2 Travelers", price: "$6,400.00", avatar: "https://i.pravatar.cc/96?img=60" },
];

const kpis = [
  { label: "Booked Itineraries", value: "1,458", change: "13.4%", context: "vs. 1,285 last month", icon: AirplaneTilt, tone: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400" },
  { label: "Travel Inquiries", value: "2,370", change: "12.6%", context: "312 new leads this month", icon: TrendUp, tone: "bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400" },
  { label: "Booking Conversion", value: "28.5%", change: "9.7%", context: "healthy conversion trend", icon: Compass, tone: "bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400" },
  { label: "Repeat Travelers", value: "2,096", change: "12.4%", context: "active loyal clients", icon: UsersThree, tone: "bg-orange-50 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400" },
];

const primaryNav = [
  { label: "Overview", icon: SquaresFour, active: true },
  { label: "Itineraries", icon: MapPin, badge: 8 },
  { label: "Travelers", icon: UsersThree },
  { label: "Bookings", icon: Tray },
  { label: "Transactions", icon: ArrowsLeftRight, badge: 32 },
  { label: "Analytics", icon: ChartBar },
];

const pinnedFiles = [
  { label: "Bali Luxury Gateway.pdf", tone: "bg-amber-400" },
  { label: "Swiss Alps Itinerary.pdf", tone: "bg-sky-400" },
  { label: "Kyoto Blossom Guide.pdf", tone: "bg-violet-400" },
  { label: "Amalfi Villa Package.pdf", tone: "bg-rose-400" },
];

const railIcons = [SquaresFour, ChartBar, Clock, Wrench, FolderSimple, ChatCircleDots, Image, Tray, Envelope];

function IconRail() {
  return (
    <div className="hidden w-14 shrink-0 flex-col items-center gap-1 border-r border-zinc-200 bg-zinc-950 py-4 sm:flex">
      <div className="mb-4 grid size-7 place-items-center rounded-lg bg-white/10 text-white">
        <SquaresFour className="size-4" weight="fill" />
      </div>
      {railIcons.map((Icon, index) => (
        <button
          key={index}
          className={`grid size-9 place-items-center rounded-xl transition ${index === 0 ? "bg-white/15 text-white" : "text-zinc-500 hover:bg-white/10 hover:text-zinc-200"
            }`}
        >
          <Icon className="size-4" weight={index === 0 ? "fill" : "regular"} />
        </button>
      ))}
    </div>
  );
}

function SidebarPanel() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-zinc-200 bg-white px-3 py-4 dark:border-zinc-800 dark:bg-zinc-950 lg:flex">
      <button className="flex items-center justify-between rounded-xl border border-zinc-200 px-3 py-2.5 text-left dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="grid size-8 place-items-center rounded-lg bg-emerald-500 text-white">
            <span className="text-xs font-bold">T</span>
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-400">Agency</p>
            <p className="text-xs font-semibold text-zinc-900 dark:text-white">Wanderlust Travel CRM</p>
          </div>
        </div>
        <CaretUpDown className="size-3.5 text-zinc-400" />
      </button>

      <nav className="mt-5 flex flex-col gap-0.5">
        {primaryNav.map(({ label, icon: Icon, active, badge }) => (
          <button
            key={label}
            className={`flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition ${active
              ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white"
              : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 dark:hover:bg-zinc-900"
              }`}
          >
            <span className="flex items-center gap-2.5">
              <Icon className="size-4" weight={active ? "fill" : "regular"} />
              {label}
            </span>
            {badge ? (
              <span className="rounded-full bg-zinc-200 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                {badge}
              </span>
            ) : null}
          </button>
        ))}
        <button className="mt-1 flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-600">
          <DotsThree className="size-4" />
          Show More
        </button>
      </nav>

      <p className="mb-1.5 mt-6 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Chat</p>
      <button className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900">
        <span className="flex items-center gap-2.5">
          <ChatCircleDots className="size-4" />
          Travel Desk
        </span>
        <span className="rounded-full bg-zinc-200 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">73</span>
      </button>

      <p className="mb-1.5 mt-6 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Pinned Packages</p>
      <div className="flex flex-col gap-0.5">
        {pinnedFiles.map((file) => (
          <button
            key={file.label}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            <DotsSixVertical className="size-3.5 text-zinc-300" />
            <span className={`size-2.5 shrink-0 rounded-sm ${file.tone}`} />
            {file.label}
          </button>
        ))}
      </div>

      <div className="mt-auto flex items-center gap-2.5 rounded-xl border border-zinc-200 px-2.5 py-2.5 dark:border-zinc-800">
        <Avatar className="size-8">
          <AvatarImage src="https://i.pravatar.cc/96?img=47" />
          <AvatarFallback>E</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-zinc-800 dark:text-white">Emore Adaeze</p>
          <p className="truncate text-[10px] text-zinc-400">emore@wanderlust.io</p>
        </div>
      </div>
    </aside>
  );
}

function KpiCard({ label, value, change, context, icon: Icon, tone }: (typeof kpis)[number]) {
  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-3 p-4">
        <div className={`grid size-10 shrink-0 place-items-center rounded-xl ${tone}`}>
          <Icon className="size-5" weight="duotone" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
          <p className="mt-1 text-xl font-bold tracking-tight text-zinc-900 dark:text-white">{value}</p>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/70 px-4 py-2.5 text-[11px] dark:border-zinc-800 dark:bg-zinc-950/40">
        <span className="truncate text-zinc-500">{context}</span>
        <span className="font-semibold text-emerald-600">↑ {change}</span>
      </div>
    </article>
  );
}

function SalesOverview() {
  const [activeTab, setActiveTab] = useState<"Top Location" | "Gender" | "Age Range">("Top Location");

  const tabData = {
    "Top Location": {
      percentage: "68%",
      growth: "+5.4%",
      orders: "14.2K",
      target: "88%",
      badgeIcon: "🇮🇩",
      title: "Indonesia",
      subtitle: "Audience 412,560",
      change: "+4.9%",
      dashArray: "68 100",
    },
    Gender: {
      percentage: "54%",
      growth: "+3.2%",
      orders: "9.8K",
      target: "76%",
      badgeIcon: "👩",
      title: "Female Segment",
      subtitle: "Audience 328,100",
      change: "+6.1%",
      dashArray: "54 100",
    },
    "Age Range": {
      percentage: "72%",
      growth: "+8.1%",
      orders: "16.5K",
      target: "91%",
      badgeIcon: "🎯",
      title: "25-34 Age Group",
      subtitle: "Audience 510,400",
      change: "+7.8%",
      dashArray: "72 100",
    },
  };

  const current = tabData[activeTab];

  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Sales Overview <span className="text-zinc-400">ⓘ</span></h2>
        <button className="grid size-8 place-items-center rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-50 outline-none focus:outline-none focus-visible:outline-none dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800" aria-label="Sales overview options">
          <DotsThree className="size-4" />
        </button>
      </div>

      <div className="relative mx-auto mt-4 h-32 w-64">
        <svg viewBox="0 0 200 110" className="h-full w-full overflow-visible">
          {/* background track */}
          <path
            d="M14 100 A86 86 0 0 1 186 100"
            fill="none"
            stroke="currentColor"
            className="text-zinc-100 dark:text-zinc-800"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* light green background segment */}
          <path
            d="M14 100 A86 86 0 0 1 186 100"
            fill="none"
            stroke="#a7f3d0"
            className="dark:stroke-emerald-950/80"
            strokeWidth="14"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray="100 100"
            strokeDashoffset="0"
          />
          {/* main green active segment */}
          <path
            d="M14 100 A86 86 0 0 1 186 100"
            fill="none"
            stroke="#10b981"
            strokeWidth="14"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={`${current.dashArray}`}
            strokeDashoffset="0"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-x-0 bottom-1 text-center">
          <p className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">{current.percentage}</p>
          <p className="mx-auto mt-1 w-fit rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">Sales Growth</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-2 flex items-center justify-center gap-1 rounded-full border border-zinc-200 p-1 text-[11px] dark:border-zinc-800 dark:bg-zinc-950/50">
        {(["Top Location", "Gender", "Age Range"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-3 py-1 font-semibold transition-all outline-none focus:outline-none ${activeTab === tab
                ? "bg-zinc-900 text-white dark:bg-emerald-600 dark:text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Key Metrics Grid */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-emerald-50/70 px-2 py-2 dark:bg-emerald-950/30">
          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{current.growth}</p>
          <p className="mt-0.5 text-[10px] text-zinc-500 dark:text-zinc-400">Growth</p>
        </div>
        <div className="rounded-xl bg-zinc-50 px-2 py-2 dark:bg-zinc-800/60">
          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{current.orders}</p>
          <p className="mt-0.5 text-[10px] text-zinc-500 dark:text-zinc-400">Orders</p>
        </div>
        <div className="rounded-xl bg-emerald-50/70 px-2 py-2 dark:bg-emerald-950/30">
          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{current.target}</p>
          <p className="mt-0.5 text-[10px] text-zinc-500 dark:text-zinc-400">Target</p>
        </div>
      </div>

      {/* Country / Demographics Detail Card */}
      <div className="mt-3 flex items-center justify-between rounded-xl border border-zinc-200 px-3 py-2.5 dark:border-zinc-800 dark:bg-zinc-950/40">
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-full bg-zinc-100 text-sm dark:bg-zinc-800">{current.badgeIcon}</span>
          <div>
            <p className="text-xs font-semibold text-zinc-800 dark:text-white">{current.title}</p>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500">{current.subtitle}</p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">{current.change}</span>
      </div>
    </article>
  );
}

const columns: { label: string; align?: "right" }[] = [
  { label: "Product info" },
  { label: "Order ID" },
  { label: "Date" },
  { label: "Customer name" },
  { label: "Status" },
  { label: "Items" },
  { label: "Price", align: "right" },
];

export function Dashboard() {
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>("Last 12 months");
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("Month");
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const filteredOrders = useMemo(
    () => orders.filter((order) => `${order.product} ${order.customer} ${order.orderId}`.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery],
  );

  const toggleSelected = (orderId: string) => {
    setSelected((current) => (current.includes(orderId) ? current.filter((id) => id !== orderId) : [...current, orderId]));
  };

  return (
    <div className="flex min-h-screen dark:bg-zinc-950">


      <main className="min-h-full flex-1 text-zinc-900 dark:text-zinc-100">
        <div className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
          <div className="mb-1 flex items-center gap-1.5 text-xs text-zinc-400">

          </div>

          <header className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">Welcome back, Emore.</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden text-xs text-zinc-400 sm:inline">Edited 13m ago</span>
              <div className="flex -space-x-2">
                {[5, 12, 32, 45].map((avatarId) => <Avatar key={avatarId} className="size-8 border-2 border-[#f7f8fa] dark:border-zinc-950"><AvatarImage src={`https://i.pravatar.cc/96?img=${avatarId}`} /><AvatarFallback>U</AvatarFallback></Avatar>)}
              </div>

            </div>
          </header>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{kpis.map((kpi) => <KpiCard key={kpi.label} {...kpi} />)}</section>

          <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.8fr)_minmax(300px,0.8fr)]">
            <article className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><div className="flex items-center gap-2"><h2 className="text-base font-semibold text-zinc-900 dark:text-white">Performance Overview</h2><span className="text-zinc-400">ⓘ</span></div><div className="mt-3 flex items-end gap-2"><p className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">$1,920,000.00</p><span className="mb-1 text-[11px] font-semibold text-emerald-600">vs last month +6.8%</span></div></div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="inline-flex h-9 items-center gap-2 rounded-xl border border-zinc-200 px-3 text-xs font-semibold outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 dark:border-zinc-700">
                        {chartPeriod} <CaretDown className="size-3 text-zinc-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl border-zinc-200 dark:border-zinc-800">
                      <DropdownMenuRadioGroup value={chartPeriod} onValueChange={(v) => setChartPeriod(v as ChartPeriod)}>
                        {chartPeriods.map((p) => (
                          <DropdownMenuRadioItem key={p} value={p}>{p}</DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <button className="grid size-9 place-items-center rounded-xl border border-zinc-200 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 dark:border-zinc-700"><DotsThree className="size-4" /></button>
                </div>
              </div>
              <div className="mt-4 h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartDatasets[chartPeriod]} barCategoryGap="20%" margin={{ top: 8, right: 4, left: -8, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#eceef1" className="dark:[stroke:#27272a]" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 11 }} dy={8} />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9ca3af", fontSize: 10 }}
                      ticks={[0, 200, 400, 600, 800]}
                      tickFormatter={(value) => `$${value}`}
                      domain={[0, 900]}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(120, 120, 120, 0.08)" }}
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null;
                        return (
                          <div className="rounded-xl border border-zinc-200 bg-zinc-900 px-3 py-2 text-xs text-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
                            <p className="mb-1 font-semibold">{label} 2025</p>
                            <div className="flex items-center gap-1.5 text-zinc-200">
                              <span className="size-1.5 rounded-full bg-emerald-400" />
                              Sales
                              <span className="ml-auto font-semibold">${payload[0]?.value}.00</span>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="sales" radius={[6, 6, 2, 2]} maxBarSize={44}>
                      {chartDatasets[chartPeriod].map((entry) => (
                        <Cell
                          key={entry.label}
                          fill={entry.label === chartHighlight[chartPeriod] ? "#10b981" : "rgba(16, 185, 129, 0.25)"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-emerald-500" />Booking volume</span>
                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-emerald-500/25 dark:bg-emerald-500/30" />Previous period</span>
                <span className="ml-auto font-medium text-zinc-400 dark:text-zinc-500">Updated 13 minutes ago</span>
              </div>
            </article>
            <SalesOverview />
          </section>

          <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Recent Travel Bookings</h2>
                <p className="mt-1 text-xs text-zinc-400">Keep track of your latest client travel itineraries.</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative hidden sm:block">
                  <MagnifyingGlass className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-zinc-400" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search..."
                    className="h-9 w-48 rounded-xl border border-zinc-200 pl-8 pr-3 text-xs outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-emerald-500"
                  />
                </div>
                <button className="grid size-9 place-items-center rounded-xl border border-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-800"><Funnel className="size-4 text-zinc-500 dark:text-zinc-400" /></button>
                <button className="grid size-9 place-items-center rounded-xl border border-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-800"><DotsThree className="size-4 text-zinc-500 dark:text-zinc-400" /></button>
              </div>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[820px] text-left">
                <thead className="border-y border-zinc-100 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
                  <tr>
                    <th className="w-10 px-3 py-3">
                      <input
                        type="checkbox"
                        className="size-3.5 rounded border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900"
                        checked={selected.length === filteredOrders.length && filteredOrders.length > 0}
                        onChange={() =>
                          setSelected(selected.length === filteredOrders.length ? [] : filteredOrders.map((order) => order.orderId))
                        }
                      />
                    </th>
                    {columns.map((column) => (
                      <th key={column.label} className={`px-3 py-3 ${column.align === "right" ? "text-right" : ""}`}>
                        <span className={`inline-flex items-center gap-1 ${column.align === "right" ? "flex-row-reverse" : ""}`}>
                          {column.label}
                          <CaretUpDown className="size-3 text-zinc-300 dark:text-zinc-600" />
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredOrders.map((order) => (
                    <tr key={order.orderId} className="text-xs transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <td className="px-3 py-3.5">
                        <input
                          type="checkbox"
                          className="size-3.5 rounded border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900"
                          checked={selected.includes(order.orderId)}
                          onChange={() => toggleSelected(order.orderId)}
                        />
                      </td>
                      <td className="px-3 py-3.5 font-semibold text-zinc-800 dark:text-zinc-100">{order.product}</td>
                      <td className="px-3 py-3.5 text-zinc-500 dark:text-zinc-400">{order.orderId}</td>
                      <td className="px-3 py-3.5 text-zinc-500 dark:text-zinc-400">{order.date}</td>
                      <td className="px-3 py-3.5"><div className="flex items-center gap-2"><Avatar className="size-6"><AvatarImage src={order.avatar} /><AvatarFallback>{order.customer[0]}</AvatarFallback></Avatar><span className="font-medium dark:text-zinc-200">{order.customer}</span></div></td>
                      <td className="px-3 py-3.5">
                        {(() => {
                          let badgeStyle = "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400";
                          let IconComponent = CheckCircle;

                          if (order.status === "Pending") {
                            badgeStyle = "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400";
                            IconComponent = Clock;
                          } else if (order.status === "Cancelled") {
                            badgeStyle = "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400";
                            IconComponent = XCircle;
                          }

                          return (
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${badgeStyle}`}>
                              <IconComponent className="size-3" />
                              {order.status}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-3 py-3.5 text-zinc-500 dark:text-zinc-400">{order.items}</td>
                      <td className="px-3 py-3.5 text-right font-semibold dark:text-zinc-200">{order.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}