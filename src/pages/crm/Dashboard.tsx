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
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function ReuiCatalogHealthCard() {
  const [period, setPeriod] = useState<"Week" | "Month" | "Year">("Week");

  const metricsData = {
    Week: [
      {
        title: "Active Packages",
        value: "8,420",
        badgeText: "+3.4%",
        badgeType: "positive",
        subtext: "Rising",
        icon: AirplaneTilt,
        svgPath: "M2 14 Q 15 6, 25 18 T 50 10 T 75 14 T 100 6",
      },
      {
        title: "Pending Quotes",
        value: "1,245",
        badgeText: "-1.2%",
        badgeType: "negative",
        subtext: "Gaps easing",
        icon: FolderSimple,
        svgPath: "M2 6 Q 15 16, 25 8 T 50 16 T 75 10 T 100 18",
      },
      {
        title: "Confirmed Bookings",
        value: "640",
        badgeText: "+2.1%",
        badgeType: "positive",
        subtext: "Moving",
        icon: CheckCircle,
        svgPath: "M2 18 Q 20 14, 40 12 T 70 8 T 100 3",
      },
      {
        title: "Idle Inquiries",
        value: "1,105",
        badgeText: "0.0%",
        badgeType: "neutral",
        subtext: "Stable",
        icon: Clock,
        svgPath: "M2 11 Q 25 13, 50 9 T 75 12 T 100 10",
      },
    ],
    Month: [
      {
        title: "Active Packages",
        value: "34,890",
        badgeText: "+5.8%",
        badgeType: "positive",
        subtext: "Rising",
        icon: AirplaneTilt,
        svgPath: "M2 16 Q 15 4, 30 18 T 60 8 T 80 14 T 100 4",
      },
      {
        title: "Pending Quotes",
        value: "4,120",
        badgeText: "-2.4%",
        badgeType: "negative",
        subtext: "Gaps easing",
        icon: FolderSimple,
        svgPath: "M2 8 Q 20 18, 40 6 T 70 16 T 100 10",
      },
      {
        title: "Confirmed Bookings",
        value: "2,840",
        badgeText: "+4.3%",
        badgeType: "positive",
        subtext: "Moving",
        icon: CheckCircle,
        svgPath: "M2 16 Q 25 12, 50 10 T 80 6 T 100 2",
      },
      {
        title: "Idle Inquiries",
        value: "3,950",
        badgeText: "+0.2%",
        badgeType: "neutral",
        subtext: "Stable",
        icon: Clock,
        svgPath: "M2 10 Q 25 12, 50 10 T 75 11 T 100 10",
      },
    ],
    Year: [
      {
        title: "Active Packages",
        value: "412,600",
        badgeText: "+14.2%",
        badgeType: "positive",
        subtext: "Rising",
        icon: AirplaneTilt,
        svgPath: "M2 18 Q 15 2, 35 16 T 65 6 T 85 12 T 100 2",
      },
      {
        title: "Pending Quotes",
        value: "18,400",
        badgeText: "-8.1%",
        badgeType: "negative",
        subtext: "Gaps easing",
        icon: FolderSimple,
        svgPath: "M2 5 Q 25 18, 45 4 T 70 15 T 100 8",
      },
      {
        title: "Confirmed Bookings",
        value: "14,200",
        badgeText: "+11.5%",
        badgeType: "positive",
        subtext: "Moving",
        icon: CheckCircle,
        svgPath: "M2 18 Q 25 10, 50 8 T 80 4 T 100 1",
      },
      {
        title: "Idle Inquiries",
        value: "12,800",
        badgeText: "-0.5%",
        badgeType: "neutral",
        subtext: "Stable",
        icon: Clock,
        svgPath: "M2 10 Q 25 11, 50 10 T 75 10 T 100 10",
      },
    ],
  };

  const currentMetrics = metricsData[period];

  return (
    <article className="mb-6 rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 transition-all">
      {/* Header section matching screenshot */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Travel Pipeline Health
          </h2>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 font-medium">
            Package availability, inquiry velocity, and client conversion in one pass.
          </p>
        </div>

        {/* Time Period Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 text-xs font-bold text-zinc-800 shadow-xs hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 transition-all outline-none cursor-pointer"
            >
              <span>{period}</span>
              <CaretDown className="size-3.5 text-zinc-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36 rounded-xl border-zinc-200 p-1.5 shadow-xl dark:border-zinc-800 bg-white dark:bg-zinc-950 z-[60]">
            {(["Week", "Month", "Year"] as const).map((p) => (
              <DropdownMenuItem
                key={p}
                onClick={() => setPeriod(p)}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <span>{p}</span>
                {period === p && <CheckCircle className="size-3.5 text-[#34C759]" weight="fill" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 4 Metric Columns Grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border-y border-zinc-100 dark:border-zinc-800/80 py-6">
        {currentMetrics.map((item, idx) => {
          const IconComponent = item.icon;
          const strokeColor =
            item.badgeType === "positive"
              ? "#10b981"
              : item.badgeType === "negative"
              ? "#f43f5e"
              : "#f59e0b";

          return (
            <div key={idx} className="flex flex-col justify-between space-y-3">
              {/* Icon & Title */}
              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                <IconComponent className="size-4 text-zinc-600 dark:text-zinc-300" weight="regular" />
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{item.title}</span>
              </div>

              {/* Value & Sparkline Chart */}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                    {item.value}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span
                      className={cn(
                        "rounded-md px-1.5 py-0.5 text-[11px] font-extrabold tracking-tight",
                        item.badgeType === "positive"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                          : item.badgeType === "negative"
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                      )}
                    >
                      {item.badgeText}
                    </span>
                    <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                      {item.subtext}
                    </span>
                  </div>
                </div>

                {/* Mini Sparkline SVG */}
                <div className="h-9 w-24 shrink-0 overflow-hidden">
                  <svg className="h-full w-full" viewBox="0 0 102 22" fill="none">
                    <path
                      d={item.svgPath}
                      stroke={strokeColor}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info Row */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 font-medium">
          <span className="flex size-4 items-center justify-center rounded-full border border-zinc-300 text-[10px] font-bold text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            ⓘ
          </span>
          <span>12,845 travel inquiries tracked across 8 luxury destinations. 89.4% average client satisfaction rate.</span>
        </div>

        <button className="flex items-center gap-1.5 font-bold text-zinc-900 hover:text-emerald-600 dark:text-zinc-100 dark:hover:text-emerald-400 transition-colors cursor-pointer">
          <span>Show full travel analytics</span>
          <span className="text-sm">→</span>
        </button>
      </div>
    </article>
  );
}

const chart4Data = [
  { date: "Jan 1", val: 1500 },
  { date: "Jan 3", val: 3200 },
  { date: "Jan 5", val: 2800 },
  { date: "Jan 7", val: 4100 },
  { date: "Jan 9", val: 4700 },
  { date: "Jan 11", val: 4400 },
  { date: "Jan 13", val: 4100 },
  { date: "Jan 15", val: 3400 },
  { date: "Jan 17", val: 2900 },
  { date: "Jan 19", val: 3700 },
  { date: "Jan 21", val: 4200 },
  { date: "Jan 23", val: 4800 },
  { date: "Jan 25", val: 4700 },
  { date: "Jan 27", val: 5600 },
  { date: "Jan 29", val: 4600 },
  { date: "Mar 24", val: 3500 },
];

function ReuiChart4BalanceCard() {
  const [period, setPeriod] = useState<"Today" | "7 Days" | "30 Days" | "YTD">("30 Days");

  const periodDatasets = {
    Today: [
      { date: "00:00", val: 1200 },
      { date: "04:00", val: 1800 },
      { date: "08:00", val: 3400 },
      { date: "12:00", val: 5100 },
      { date: "16:00", val: 4600 },
      { date: "20:00", val: 5800 },
      { date: "23:59", val: 6200 },
    ],
    "7 Days": [
      { date: "Mon", val: 2400 },
      { date: "Tue", val: 3800 },
      { date: "Wed", val: 3100 },
      { date: "Thu", val: 4900 },
      { date: "Fri", val: 5600 },
      { date: "Sat", val: 4200 },
      { date: "Sun", val: 3900 },
    ],
    "30 Days": chart4Data,
    YTD: [
      { date: "Jan", val: 14500 },
      { date: "Feb", val: 18200 },
      { date: "Mar", val: 22400 },
      { date: "Apr", val: 28900 },
      { date: "May", val: 26100 },
      { date: "Jun", val: 34500 },
      { date: "Jul", val: 39800 },
      { date: "Aug", val: 44200 },
    ],
  };

  const activeData = periodDatasets[period];

  return (
    <article className="mb-6 rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 transition-all">
      {/* Header & Period Switch */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#34C759] animate-pulse" />
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 tracking-wide uppercase">
              Current Revenue Balance
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              $24,847.83
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <span className="text-sm">↗</span> +12.7% <span className="font-normal text-zinc-500 dark:text-zinc-400">vs previous period</span>
            </span>
          </div>
        </div>

        {/* Period Switcher */}
        <div className="flex items-center gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800">
          {(["Today", "7 Days", "30 Days", "YTD"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-bold transition-all cursor-pointer",
                period === p
                  ? "bg-[#34C759] text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Sub Header KPI Bar */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          <span>Today's Sales:</span>
          <span className="font-extrabold text-zinc-900 dark:text-white">$1,249</span>
          <span className="text-[#34C759] font-bold">(+8%)</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          <div>
            <span>High: </span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">2,900.08</span>
          </div>
          <div>
            <span>Low: </span>
            <span className="font-extrabold text-amber-600 dark:text-amber-400">850.42</span>
          </div>
          <div>
            <span>Change: </span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">+14.82%</span>
          </div>
        </div>
      </div>

      {/* Green Area Chart Canvas */}
      <div className="mt-6 h-[290px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <AreaChart data={activeData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34C759" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#34C759" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:[stroke:#27272a]" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#10b981", fontSize: 11, fontWeight: 600 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#10b981", fontSize: 11, fontWeight: 600 }}
              ticks={[0, 1500, 3000, 4500, 6000]}
              tickFormatter={(v) => `$${v.toLocaleString()}`}
              domain={[0, 6500]}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const val = Number(payload[0].value);
                return (
                  <div className="rounded-xl border border-emerald-200 bg-white p-3.5 text-xs shadow-xl dark:border-emerald-900/50 dark:bg-zinc-950 space-y-1">
                    <p className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-between gap-3">
                      <span>{label}</span>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700 font-extrabold dark:bg-emerald-950 dark:text-emerald-300">Verified</span>
                    </p>
                    <p className="text-base font-black text-emerald-600 dark:text-emerald-400">
                      ${val.toLocaleString()}.00
                    </p>
                    <div className="pt-1 text-[11px] text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 space-y-0.5">
                      <p>Resort Bookings: <span className="font-bold text-zinc-700 dark:text-zinc-300">${Math.round(val * 0.65).toLocaleString()}</span></p>
                      <p>Add-on Services: <span className="font-bold text-zinc-700 dark:text-zinc-300">${Math.round(val * 0.35).toLocaleString()}</span></p>
                    </div>
                  </div>
                );
              }}
            />
            <ReferenceLine x="Jan 17" stroke="#34C759" strokeDasharray="4 4" strokeWidth={1.5} />
            <Area
              type="monotone"
              dataKey="val"
              stroke="#34C759"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#emeraldGradient)"
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                if (payload && (payload.date === "Jan 1" || payload.date === "Jan 17" || payload.date === "Jan 27" || payload.date === "Fri" || payload.date === "May")) {
                  return (
                    <circle
                      key={payload.date}
                      cx={cx}
                      cy={cy}
                      r={5}
                      fill="#34C759"
                      stroke="#ffffff"
                      strokeWidth={3}
                      className="shadow-lg"
                    />
                  );
                }
                return <circle key={cx || Math.random()} cx={-10} cy={-10} r={0} />;
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Quick Stats Chips Under Chart */}
      <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
          <div className="size-9 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
            🏖️
          </div>
          <div>
            <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">Resort Packages</p>
            <p className="text-sm font-extrabold text-zinc-900 dark:text-white">$14,280.00 <span className="text-[10px] text-emerald-600 font-semibold">(57%)</span></p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
          <div className="size-9 rounded-lg bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400 font-extrabold text-sm">
            ✈️
          </div>
          <div>
            <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">Flight & Cruise Add-ons</p>
            <p className="text-sm font-extrabold text-zinc-900 dark:text-white">$6,420.00 <span className="text-[10px] text-sky-600 font-semibold">(26%)</span></p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
          <div className="size-9 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400 font-extrabold text-sm">
            🛡️
          </div>
          <div>
            <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">Insurance & Extras</p>
            <p className="text-sm font-extrabold text-zinc-900 dark:text-white">$4,147.83 <span className="text-[10px] text-amber-600 font-semibold">(17%)</span></p>
          </div>
        </div>
      </div>
    </article>
  );
}

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
          </header>

          {/* ReUI Catalog Health Analytics Card Block */}
          <ReuiCatalogHealthCard />

          {/* ReUI Chart 4 Balance Area Chart Block in Green */}
          <ReuiChart4BalanceCard />

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