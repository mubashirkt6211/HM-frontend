import { useState } from "react";
import {
  TrendUp,
  CurrencyDollar,
  Target,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle,
  ChartBar,
  FilePdf,
  FileXls,
  FileCsv,
  FileImage,
  Clock,
  Info,
} from "@phosphor-icons/react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { IconDownload, IconPipeline } from "@tabler/icons-react";

interface ForecastPageProps {
  onNavigate?: (page: string) => void;
}

// Custom Slice Label for REUI Donut Chart (displays number inside slice)
const RADIAN = Math.PI / 180;
const renderSliceLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  value,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-[11px] font-extrabold"
    >
      {value}
    </text>
  );
};

// REUI Segmented Vertical Bar Capsule Meter Component (@reui/chart-14)
function SegmentedBarMeter({
  value,
  totalBars = 36,
  activeColorClass = "bg-emerald-500 dark:bg-emerald-400",
}: {
  value: number; // e.g. 76.2
  totalBars?: number;
  activeColorClass?: string;
}) {
  const activeCount = Math.min(totalBars, Math.max(1, Math.round((value / 100) * totalBars)));

  return (
    <div className="flex items-center gap-1.5 w-full py-4 overflow-hidden">
      {Array.from({ length: totalBars }).map((_, i) => {
        const isActive = i < activeCount;
        return (
          <div
            key={i}
            className={cn(
              "h-10 flex-1 rounded-full transition-all duration-300",
              isActive
                ? activeColorClass
                : "bg-zinc-100 dark:bg-zinc-800/80"
            )}
          />
        );
      })}
    </div>
  );
}

// Dynamic Quarter & Scenario Dataset
const QUARTER_DATA: Record<
  string,
  {
    gross: number;
    targetQuota: number;
    weighted: Record<
      "expected" | "best" | "conservative",
      { val: number; pctNum: number; pctLabel: string; change: string; barColor: string }
    >;
    coverage: string;
    commit: number;
    commitCount: number;
    stages: Array<{ stage: string; count: number; gross: number; prob: number; color: string; text: string }>;
    reps: Array<{ name: string; avatar: string; quota: number; closed: number; pipeline: number; probWeighted: number }>;
    donutData: Record<"5D" | "2W" | "1M", { total: number; slices: Array<{ name: string; value: number; fill: string }> }>;
  }
> = {
  "Q3-2026": {
    gross: 171500,
    targetQuota: 180000,
    weighted: {
      expected: { val: 87440, pctNum: 76.2, pctLabel: "76.2% Quota", change: "+14.2%", barColor: "bg-emerald-500 dark:bg-emerald-400" },
      best: { val: 124500, pctNum: 108.3, pctLabel: "108.3% Quota", change: "+24.8%", barColor: "bg-emerald-500 dark:bg-emerald-400" },
      conservative: { val: 61200, pctNum: 53.2, pctLabel: "53.2% Quota", change: "+5.1%", barColor: "bg-amber-500 dark:bg-amber-400" },
    },
    coverage: "2.84x",
    commit: 48600,
    commitCount: 2,
    stages: [
      { stage: "New Leads", count: 3, gross: 65700, prob: 20, color: "bg-sky-500", text: "text-sky-600 dark:text-sky-400" },
      { stage: "Open Discussion", count: 1, gross: 22400, prob: 40, color: "bg-violet-500", text: "text-violet-600 dark:text-violet-400" },
      { stage: "In-Progress", count: 1, gross: 27900, prob: 60, color: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
      { stage: "Open Deal", count: 1, gross: 34500, prob: 80, color: "bg-rose-500", text: "text-rose-600 dark:text-rose-400" },
      { stage: "Won Customer", count: 1, gross: 21000, prob: 100, color: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
    ],
    reps: [
      { name: "Ari Parker", avatar: "https://i.pravatar.cc/96?img=47", quota: 45000, closed: 28500, pipeline: 34500, probWeighted: 36200 },
      { name: "Sam Rivera", avatar: "https://i.pravatar.cc/96?img=11", quota: 40000, closed: 34500, pipeline: 14200, probWeighted: 37340 },
      { name: "Maya Chen", avatar: "https://i.pravatar.cc/96?img=32", quota: 40000, closed: 31000, pipeline: 22400, probWeighted: 39960 },
      { name: "Jordan Lee", avatar: "https://i.pravatar.cc/96?img=33", quota: 35000, closed: 22400, pipeline: 27900, probWeighted: 34140 },
    ],
    donutData: {
      "5D": {
        total: 925,
        slices: [
          { name: "New Leads", value: 275, fill: "#2563EB" },
          { name: "Open Discussion", value: 200, fill: "#0284C7" },
          { name: "In-Progress", value: 187, fill: "#F97316" },
          { name: "Open Deal", value: 173, fill: "#6366F1" },
          { name: "Won Customer", value: 90, fill: "#64748B" },
        ],
      },
      "2W": {
        total: 1450,
        slices: [
          { name: "New Leads", value: 420, fill: "#2563EB" },
          { name: "Open Discussion", value: 310, fill: "#0284C7" },
          { name: "In-Progress", value: 290, fill: "#F97316" },
          { name: "Open Deal", value: 260, fill: "#6366F1" },
          { name: "Won Customer", value: 170, fill: "#64748B" },
        ],
      },
      "1M": {
        total: 2180,
        slices: [
          { name: "New Leads", value: 680, fill: "#2563EB" },
          { name: "Open Discussion", value: 490, fill: "#0284C7" },
          { name: "In-Progress", value: 420, fill: "#F97316" },
          { name: "Open Deal", value: 360, fill: "#6366F1" },
          { name: "Won Customer", value: 230, fill: "#64748B" },
        ],
      },
    },
  },
  "Q4-2026": {
    gross: 215800,
    targetQuota: 240000,
    weighted: {
      expected: { val: 112300, pctNum: 89.8, pctLabel: "89.8% Quota", change: "+22.5%", barColor: "bg-emerald-500 dark:bg-emerald-400" },
      best: { val: 158000, pctNum: 126.4, pctLabel: "126.4% Quota", change: "+38.1%", barColor: "bg-emerald-500 dark:bg-emerald-400" },
      conservative: { val: 84000, pctNum: 67.2, pctLabel: "67.2% Quota", change: "+8.9%", barColor: "bg-amber-500 dark:bg-amber-400" },
    },
    coverage: "3.12x",
    commit: 64200,
    commitCount: 3,
    stages: [
      { stage: "New Leads", count: 5, gross: 84000, prob: 20, color: "bg-sky-500", text: "text-sky-600 dark:text-sky-400" },
      { stage: "Open Discussion", count: 3, gross: 41200, prob: 40, color: "bg-violet-500", text: "text-violet-600 dark:text-violet-400" },
      { stage: "In-Progress", count: 2, gross: 36000, prob: 60, color: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
      { stage: "Open Deal", count: 2, gross: 42600, prob: 80, color: "bg-rose-500", text: "text-rose-600 dark:text-rose-400" },
      { stage: "Won Customer", count: 2, gross: 32000, prob: 100, color: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
    ],
    reps: [
      { name: "Ari Parker", avatar: "https://i.pravatar.cc/96?img=47", quota: 55000, closed: 38000, pipeline: 44000, probWeighted: 49200 },
      { name: "Sam Rivera", avatar: "https://i.pravatar.cc/96?img=11", quota: 50000, closed: 42000, pipeline: 21000, probWeighted: 48600 },
      { name: "Maya Chen", avatar: "https://i.pravatar.cc/96?img=32", quota: 50000, closed: 39000, pipeline: 31000, probWeighted: 51200 },
      { name: "Jordan Lee", avatar: "https://i.pravatar.cc/96?img=33", quota: 45000, closed: 31000, pipeline: 38000, probWeighted: 44800 },
    ],
    donutData: {
      "5D": {
        total: 1240,
        slices: [
          { name: "New Leads", value: 380, fill: "#2563EB" },
          { name: "Open Discussion", value: 290, fill: "#0284C7" },
          { name: "In-Progress", value: 240, fill: "#F97316" },
          { name: "Open Deal", value: 210, fill: "#6366F1" },
          { name: "Won Customer", value: 120, fill: "#64748B" },
        ],
      },
      "2W": {
        total: 1820,
        slices: [
          { name: "New Leads", value: 540, fill: "#2563EB" },
          { name: "Open Discussion", value: 410, fill: "#0284C7" },
          { name: "In-Progress", value: 380, fill: "#F97316" },
          { name: "Open Deal", value: 310, fill: "#6366F1" },
          { name: "Won Customer", value: 180, fill: "#64748B" },
        ],
      },
      "1M": {
        total: 2950,
        slices: [
          { name: "New Leads", value: 890, fill: "#2563EB" },
          { name: "Open Discussion", value: 680, fill: "#0284C7" },
          { name: "In-Progress", value: 590, fill: "#F97316" },
          { name: "Open Deal", value: 520, fill: "#6366F1" },
          { name: "Won Customer", value: 270, fill: "#64748B" },
        ],
      },
    },
  },
};

export function ForecastPage({ onNavigate }: ForecastPageProps) {
  const [selectedQuarter, setSelectedQuarter] = useState<string>("Q3-2026");
  const [forecastScenario, setForecastScenario] = useState<"expected" | "best" | "conservative">("expected");
  const [donutTimeRange, setDonutTimeRange] = useState<"5D" | "2W" | "1M">("5D");
  const [toastBanner, setToastBanner] = useState<string | null>(null);

  // Export Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<"pdf" | "xlsx" | "csv" | "png">("pdf");
  const [includeRepLeaderboard, setIncludeRepLeaderboard] = useState(true);

  // Active Quarter Dataset & Metrics
  const currentData = QUARTER_DATA[selectedQuarter] || QUARTER_DATA["Q3-2026"];
  const scenarioWeighted = currentData.weighted[forecastScenario];
  const activeDonut = currentData.donutData[donutTimeRange];

  const handleConfirmExport = () => {
    setIsExportModalOpen(false);
    setToastBanner(`📥 ${selectedQuarter} Forecast (${forecastScenario.toUpperCase()}) exported as .${exportFormat} file!`);
    setTimeout(() => setToastBanner(null), 4000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 p-4 md:p-8 space-y-8 relative">
      {/* Toast Notification Banner */}
      {toastBanner && (
        <div className="fixed top-6 right-6 z-[120] max-w-md px-4 py-3 rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold shadow-2xl border border-zinc-800 animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <span>{toastBanner}</span>
        </div>
      )}

      {/* ── TOP HEADER (Title Left | Buttons Top Right, Quarter Tabs Underneath) ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Sales & Revenue Forecast
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Project quarterly revenue, probability-weighted deal pipelines, and team quota attainment.
          </p>
        </div>

        {/* Right Side Header Controls: Buttons Top, Tabs Underneath */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          {/* Top Row: Buttons */}
          <div className="flex items-center gap-2 justify-end">
            {/* Pipeline View Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (onNavigate) onNavigate("pipeline");
              }}
              className="h-8 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-3 text-xs font-extrabold shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shrink-0"
            >
              <IconPipeline className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Pipeline View</span>
            </Button>

            {/* Export Forecast Button */}
            <Button
              size="sm"
              onClick={() => setIsExportModalOpen(true)}
              className="group relative overflow-hidden h-8 rounded-md border border-emerald-800/40 bg-gradient-to-b from-emerald-500 via-emerald-600 to-emerald-700 px-3 text-xs font-bold text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
            >
              <IconDownload className="size-3.5" />
              <span>Export Forecast</span>
            </Button>
          </div>

          {/* Underneath: Quarter Selector Tabs */}
          <div className="flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-md text-[11px] font-extrabold text-zinc-500 border border-zinc-200/70 dark:border-zinc-800">
            {["Q3-2026", "Q4-2026"].map((q) => (
              <button
                key={q}
                onClick={() => setSelectedQuarter(q)}
                className={cn(
                  "px-3 py-1 rounded-md transition-all cursor-pointer select-none font-bold",
                  selectedQuarter === q
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs"
                    : "hover:text-zinc-900 dark:hover:text-zinc-100"
                )}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4 KPI SUMMARY METRICS (rounded-md styling) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
        <div className="rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Gross Pipeline Value</span>
            <div className="size-8 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center">
              <CurrencyDollar className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xl font-extrabold text-zinc-900 dark:text-white">${currentData.gross.toLocaleString()}</span>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight className="size-3" />
              {scenarioWeighted.change}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 font-medium">Unweighted open opportunities for {selectedQuarter}</p>
        </div>

        <div className="rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Weighted Forecast Value</span>
            <div className="size-8 rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center">
              <TrendUp className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">${scenarioWeighted.val.toLocaleString()}</span>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <ShieldCheck className="size-3" />
              {scenarioWeighted.pctLabel}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 font-medium">Probability-adjusted ({forecastScenario.toUpperCase()}) forecast</p>
        </div>

        <div className="rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Pipeline Coverage Ratio</span>
            <div className="size-8 rounded-md bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 flex items-center justify-center">
              <Target className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xl font-extrabold text-zinc-900 dark:text-white">{currentData.coverage}</span>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Healthy (&gt; 2.5x)</span>
          </div>
          <p className="text-[11px] text-zinc-400 font-medium">Pipeline volume vs remaining quota target</p>
        </div>

        <div className="rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Commit Forecast (&gt;80%)</span>
            <div className="size-8 rounded-md bg-pink-50 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400 flex items-center justify-center">
              <CheckCircle className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xl font-extrabold text-zinc-900 dark:text-white">${currentData.commit.toLocaleString()}</span>
            <span className="text-[11px] font-bold text-zinc-500">{currentData.commitCount} Deals Closing Soon</span>
          </div>
          <p className="text-[11px] text-zinc-400 font-medium">High confidence deals ready to sign</p>
        </div>
      </div>

      {/* ── 2-COLUMN CHARTS GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── REUI DONUT CHART CARD (@reui/chart-27 - CRM OPPORTUNITY SHARE) ── */}
        <div className="lg:col-span-5 rounded-md border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
                Pipeline Opportunity Share
              </h3>
              <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 font-extrabold px-2 py-0.5 rounded-full text-[11px]">
                <ArrowUpRight className="size-3" />
                +5.2%
              </span>
            </div>

            <button
              onClick={() => setIsExportModalOpen(true)}
              className="px-3 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Export
            </button>
          </div>

          <div className="border-t border-dashed border-zinc-200/80 dark:border-zinc-800/80 pt-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 font-bold shrink-0">
                <Clock className="size-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Active Deals & Opportunities</p>
                <p className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                  {activeDonut.total.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-950 p-1 rounded-md text-xs font-bold text-zinc-500 border border-zinc-200/70 dark:border-zinc-800 justify-between">
              {(["5D", "2W", "1M"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setDonutTimeRange(t)}
                  className={cn(
                    "flex-1 py-1.5 rounded-md transition-all cursor-pointer select-none font-bold text-center",
                    donutTimeRange === t
                      ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs"
                      : "hover:text-zinc-900 dark:hover:text-zinc-100"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activeDonut.slices}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={95}
                    paddingAngle={4}
                    cornerRadius={4}
                    label={renderSliceLabel}
                    labelLine={false}
                  >
                    {activeDonut.slices.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="rounded-md bg-zinc-900 text-white p-2.5 shadow-xl text-xs space-y-0.5 border border-zinc-800">
                            <p className="font-extrabold">{data.name}</p>
                            <p className="text-blue-400 font-bold">Count: {data.value}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium pt-1">
              <Info className="size-3.5 shrink-0 text-zinc-400" />
              <span>Opportunity distribution calculated from stage lead weight signatures.</span>
            </div>
          </div>
        </div>

        {/* ── REUI PORTFOLIO ALLOCATION SEGMENTED BAR METER CARD (@reui/chart-14 - EXACT MATCH TO SCREENSHOT) ── */}
        <div className="lg:col-span-7 rounded-md border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs flex flex-col justify-between space-y-5">
          {/* Header Row: Title + Info Icon + Scenario Selector Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
                Monthly Revenue Projection ({selectedQuarter})
              </h3>
              <Info className="size-4 text-zinc-400 cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors" />
            </div>

            {/* REUI Pill Tab Switcher (@reui/chart-14 exact match: Week | Month | Year) */}
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-950 p-1 rounded-md text-xs font-bold text-zinc-500 border border-zinc-200/70 dark:border-zinc-800">
              {[
                { id: "expected", label: "Week" },
                { id: "best", label: "Month" },
                { id: "conservative", label: "Year" },
              ].map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => setForecastScenario(sc.id as any)}
                  className={cn(
                    "px-3 py-1 rounded-md transition-all cursor-pointer select-none font-extrabold text-xs",
                    forecastScenario === sc.id
                      ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                  )}
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main KPI Stat Display */}
          <div className="space-y-1 pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                {scenarioWeighted.pctNum}%
              </span>
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                {scenarioWeighted.change}
              </span>
              <span className="text-xs text-zinc-400 font-medium">
                vs target quota (${(currentData.targetQuota / 1000).toFixed(0)}k)
              </span>
            </div>
          </div>

          {/* REUI Segmented Vertical Bar Capsule Meter (@reui/chart-14) */}
          <div className="py-2">
            <SegmentedBarMeter
              value={scenarioWeighted.pctNum}
              totalBars={36}
              activeColorClass={scenarioWeighted.barColor}
            />
          </div>

          {/* Footer Info Row: Exposure Value Left | Rep Avatars & Count Right */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
            <div className="font-semibold text-zinc-600 dark:text-zinc-400">
              Weighted Forecast: <span className="font-extrabold text-zinc-900 dark:text-white">${(scenarioWeighted.val / 1000).toFixed(1)}k</span>
            </div>

            <div className="flex items-center gap-2">
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
                  <AvatarImage src="https://i.pravatar.cc/96?img=32" />
                  <AvatarFallback className="text-[8px]">MC</AvatarFallback>
                </Avatar>
              </div>
              <span className="text-xs font-extrabold text-zinc-700 dark:text-zinc-300">
                4 Representatives
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── STAGE PROBABILITY WEIGHTED PIPELINE TABLE & REP LEADERBOARD (rounded-md styling) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
        <div className="lg:col-span-2 rounded-md border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
                Stage Probability Breakdown ({selectedQuarter})
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Gross vs probability-weighted value calculation per stage.
              </p>
            </div>
            <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
              Total Weighted: ${scenarioWeighted.val.toLocaleString()}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-bold">
                  <th className="pb-3">Stage</th>
                  <th className="pb-3 text-center">Deals</th>
                  <th className="pb-3 text-right">Gross Value</th>
                  <th className="pb-3 text-center">Probability</th>
                  <th className="pb-3 text-right">Weighted Forecast</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                {currentData.stages.map((stg) => {
                  const weighted = (stg.gross * stg.prob) / 100;
                  return (
                    <tr key={stg.stage} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                      <td className="py-3 font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                        <span className={cn("size-2.5 rounded-full shrink-0", stg.color)} />
                        <span>{stg.stage}</span>
                      </td>
                      <td className="py-3 text-center font-semibold text-zinc-600 dark:text-zinc-400">{stg.count}</td>
                      <td className="py-3 text-right font-bold text-zinc-800 dark:text-zinc-200">${stg.gross.toLocaleString()}</td>
                      <td className="py-3 text-center">
                        <span className={cn("px-2 py-0.5 rounded-md font-bold text-[10px]", stg.text, "bg-zinc-100 dark:bg-zinc-800")}>
                          {stg.prob}%
                        </span>
                      </td>
                      <td className="py-3 text-right font-extrabold text-zinc-900 dark:text-white">
                        ${Math.round(weighted).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── SALES REP QUOTA LEADERBOARD ── */}
        <div className="rounded-md border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
              Rep Quota Attainment ({selectedQuarter})
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Individual representative targets vs weighted forecast.
            </p>
          </div>

          <div className="space-y-4">
            {currentData.reps.map((rep) => {
              const pct = Math.round((rep.probWeighted / rep.quota) * 100);
              return (
                <div key={rep.name} className="space-y-1.5 p-3 rounded-md bg-zinc-50/70 dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-6 border border-zinc-200 dark:border-zinc-700">
                        <AvatarImage src={rep.avatar} />
                        <AvatarFallback>{rep.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="font-extrabold text-zinc-900 dark:text-white">{rep.name}</span>
                    </div>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{pct}% Attained</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full rounded-md bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full rounded-md bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold pt-0.5">
                    <span>Forecast: ${rep.probWeighted.toLocaleString()}</span>
                    <span>Quota: ${rep.quota.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── EXPORT FORECAST REPORT MODAL ── */}
      <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
        <DialogContent className="sm:max-w-md border border-zinc-200 dark:border-zinc-800 p-6 rounded-md shadow-2xl bg-white dark:bg-zinc-950 space-y-5">
          <DialogHeader className="text-left space-y-1 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <IconDownload className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-extrabold text-zinc-900 dark:text-white">
                  Export Forecast Report
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                  Select export format and configuration options for {selectedQuarter}.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Export Format Selector Options Grid */}
          <div className="space-y-2.5">
            <label className="text-xs font-extrabold text-zinc-900 dark:text-zinc-100 block">
              Select Export Format
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: "pdf", label: "PDF Document", ext: ".pdf", icon: FilePdf, color: "text-red-500 bg-red-50 dark:bg-red-950/40" },
                { id: "xlsx", label: "Excel Spreadsheet", ext: ".xlsx", icon: FileXls, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40" },
                { id: "csv", label: "CSV Dataset", ext: ".csv", icon: FileCsv, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40" },
                { id: "png", label: "Chart Image", ext: ".png", icon: FileImage, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40" },
              ].map((fmt) => {
                const IconComponent = fmt.icon;
                const isSelected = exportFormat === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    onClick={() => setExportFormat(fmt.id as any)}
                    className={cn(
                      "p-3 rounded-md border text-left transition-all flex items-center gap-3 cursor-pointer select-none",
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 dark:border-emerald-500 ring-1 ring-emerald-500"
                        : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900"
                    )}
                  >
                    <div className={cn("size-8 rounded-md flex items-center justify-center font-bold shrink-0", fmt.color)}>
                      <IconComponent className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{fmt.label}</p>
                      <p className="text-[10px] text-zinc-400 font-semibold">{fmt.ext}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Export Options & Details */}
          <div className="space-y-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-600 dark:text-zinc-400">Target Quarter:</span>
              <span className="font-extrabold text-zinc-900 dark:text-white">{selectedQuarter}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-600 dark:text-zinc-400">Forecast Scenario:</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 capitalize">{forecastScenario} Scenario</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="font-semibold text-zinc-600 dark:text-zinc-400">Include Rep Attainment Table:</span>
              <input
                type="checkbox"
                checked={includeRepLeaderboard}
                onChange={(e) => setIncludeRepLeaderboard(e.target.checked)}
                className="rounded-md border-zinc-300 text-emerald-600 focus:ring-emerald-500 size-4 cursor-pointer"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExportModalOpen(false)}
              className="rounded-md text-xs font-bold border-zinc-200 dark:border-zinc-800 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmExport}
              className="rounded-md text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer flex items-center gap-1.5"
            >
              <IconDownload className="size-4" />
              <span>Download {exportFormat.toUpperCase()}</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
