import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ChartLineUp,
  User,
  Envelope,
  CursorClick,
  MagnifyingGlass,
  Calendar,
  Funnel,
  CaretDown,
  CaretRight,
  DotsThreeVertical,
  ArrowUpRight,
  ArrowDownRight,
  UsersThree,
  Clock,
  House
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// ── DATA CONSTANTS ──

const STATS = [
  {
    label: "Active Contacts",
    value: "1,234",
    change: "+12.5% (+152)",
    positive: true,
    icon: User,
  },
  {
    label: "Emails Opened",
    value: "842",
    change: "+5.2% (+42)",
    positive: true,
    icon: Envelope,
  },
  {
    label: "Click Rate",
    value: "26.2%",
    change: "-2.3% (-8.1%)",
    positive: false,
    icon: CursorClick,
  }
];

const REVENUE_DATA = [
  { month: "Jan", value: 45 }, { month: "Jan", value: 52 }, { month: "Jan", value: 48 },
  { month: "Feb", value: 120 }, { month: "Feb", value: 110 }, { month: "Feb", value: 135 },
  { month: "Mar", value: 85 }, { month: "Mar", value: 95 }, { month: "Mar", value: 78 },
  { month: "Apr", value: 180 }, { month: "Apr", value: 165 }, { month: "Apr", value: 195 },
  { month: "May", value: 140 }, { month: "May", value: 155 }, { month: "May", value: 130 },
  { month: "Jun", value: 250 }, { month: "Jun", value: 230 }, { month: "Jun", value: 270 },
  { month: "Jul", value: 210 }, { month: "Jul", value: 225 }, { month: "Jul", value: 190 },
  { month: "Aug", value: 420 }, { month: "Aug", value: 390 }, { month: "Aug", value: 450 },
  { month: "Sep", value: 350 }, { month: "Sep", value: 370 }, { month: "Sep", value: 330 },
  { month: "Oct", value: 520 }, { month: "Oct", value: 490 }, { month: "Oct", value: 550 },
  { month: "Nov", value: 450 }, { month: "Nov", value: 470 }, { month: "Nov", value: 430 },
  { month: "Dec", value: 600 }, { month: "Dec", value: 580 }, { month: "Dec", value: 640 },
];

const APPOINTMENT_DATA = [
  { day: "Mon", count: 42 },
  { day: "Tue", count: 58 },
  { day: "Wed", count: 45 },
  { day: "Thu", count: 72 },
  { day: "Fri", count: 65 },
  { day: "Sat", count: 32 },
  { day: "Sun", count: 18 },
];

const DEPARTMENT_DISTRIBUTION = [
  { name: "Cardiology", count: 145, color: "bg-zinc-900 dark:bg-white" },
  { name: "Neurology", count: 98, color: "bg-zinc-600 dark:bg-zinc-400" },
  { name: "Pediatrics", count: 120, color: "bg-zinc-400 dark:bg-zinc-600" },
  { name: "General", count: 185, color: "bg-zinc-200 dark:bg-zinc-800" },
];

const TRANSACTIONS = [
  { id: "#001", customer: "Sarah Mitchell", date: "Jan 12, 2024", amount: "$1,250.00", status: "Completed", type: "Inpatient" },
  { id: "#002", customer: "Robert Johnson", date: "Jan 11, 2024", amount: "$450.00", status: "Pending", type: "Outpatient" },
  { id: "#003", customer: "Amanda Blake", date: "Jan 10, 2024", amount: "$890.00", status: "Failed", type: "Surgery" },
  { id: "#004", customer: "David Wilson", date: "Jan 09, 2024", amount: "$2,100.00", status: "Completed", type: "Insurance" },
  { id: "#005", customer: "Elena Rodriguez", date: "Jan 08, 2024", amount: "$150.00", status: "Completed", type: "Lab Test" },
];

import { Tabs, TabsList, TabsTab, TabsPanel } from "@/components/ui/tabs";

export function ReportsPage() {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const TABS = [
    { id: "overview", label: "Overview", icon: House },
    { id: "patients", label: "Patients", icon: UsersThree },
    { id: "appointments", label: "Appointments", icon: Clock },
    { id: "financials", label: "Financials", icon: ChartLineUp },
  ];

  const generatePath = (data: { value: number }[]) => {
    const max = Math.max(...data.map(d => d.value));
    const width = 800;
    const height = 240;
    const step = width / (data.length - 1);

    return data.map((d, i) => {
      const x = i * step;
      const y = height - (d.value / (max * 1.1)) * height;
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');
  };

  const generateAreaPath = (data: { value: number }[]) => {
    const path = generatePath(data);
    const width = 800;
    const height = 240;
    return `${path} L ${width},${height} L 0,${height} Z`;
  };

  return (
    <div className="w-full text-zinc-900 dark:text-zinc-100 pb-20">
      <div className="max-w-[1200px] mx-auto px-6 py-12">

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-end justify-between"
        >
          <div>
            <h1 className="text-[40px] font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">
              Reports
            </h1>
            <p className="text-[15px] text-zinc-500 dark:text-zinc-400">
              Deep dive into hospital analytics and financial performance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-[14px] font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
              <Calendar className="w-4 h-4" />
              Last 12 Months
              <CaretDown className="w-3 h-3" />
            </button>
            <button className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[14px] font-bold hover:opacity-90 transition-opacity">
              Export PDF
            </button>
          </div>
        </motion.div>

        {/* ── TABS ── */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-12 bg-transparent p-0 gap-8 border-b border-zinc-100 dark:border-zinc-800 rounded-none w-full justify-start">
            {TABS.map((tab) => (
              <TabsTab
                key={tab.id}
                value={tab.id}
                className="pb-4 px-0 rounded-none bg-transparent dark:bg-transparent shadow-none"
              >
                <tab.icon className="w-4 h-4" weight="bold" />
                {tab.label}
              </TabsTab>
            ))}
          </TabsList>

          <TabsPanel value="overview" className="mt-0">
            <div className="space-y-12">
              {/* STATS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {STATS.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-6 rounded-2xl bg-white dark:bg-[#1f1f1f] border border-zinc-200 dark:border-zinc-800 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                        </div>
                        <div className={cn(
                          "px-2 py-1 rounded text-[12px] font-bold",
                          stat.positive ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "bg-rose-50 dark:bg-rose-900/20 text-rose-600"
                        )}>
                          {stat.change}
                        </div>
                      </div>
                      <h3 className="text-[13px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                        {stat.label}
                      </h3>
                      <p className="text-[32px] font-black text-zinc-900 dark:text-white tracking-tight">
                        {stat.value}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-8 rounded-3xl bg-zinc-900 text-white overflow-hidden relative">
                  <div className="relative z-10">
                    <p className="text-zinc-400 text-[13px] font-bold mb-1">Weekly Performance</p>
                    <h3 className="text-[28px] font-black mb-4">+$12,430.00</h3>
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 rounded bg-white/10 text-[11px] font-bold">12 New Patients</span>
                      <span className="px-2 py-0.5 rounded bg-white/10 text-[11px] font-bold">48 Appts</span>
                    </div>
                  </div>
                  <div className="absolute right-[-20px] bottom-[-20px] opacity-20">
                    <ChartLineUp size={160} weight="fill" />
                  </div>
                </div>

                <div className="p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1f1f1f]">
                  <h3 className="text-[18px] font-black mb-4">System Health</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-bold text-zinc-500">API Latency</span>
                      <span className="text-[13px] font-black text-emerald-500">24ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-bold text-zinc-500">Database Load</span>
                      <span className="text-[13px] font-black text-amber-500">42%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-bold text-zinc-500">Active Sessions</span>
                      <span className="text-[13px] font-black">152</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsPanel>

          <TabsPanel value="financials" className="mt-0">
            <div className="space-y-8">
              <div className="p-8 rounded-[32px] bg-white dark:bg-[#121212] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <p className="text-[13px] font-bold text-zinc-400 mb-1">Total Revenue</p>
                    <h2 className="text-[32px] font-black text-zinc-900 dark:text-white tracking-tighter leading-none">
                      $1,856,231,212
                    </h2>
                    <p className="text-[13px] font-bold text-emerald-500 mt-2 flex items-center gap-1">
                      +22,325 (12.2%) <span className="text-zinc-400 ml-1 font-medium">· last 12 months</span>
                    </p>
                  </div>
                </div>

                <div className="relative h-[380px] w-full mt-4">
                  <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.07]"
                    style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                  <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-[11px] font-bold text-zinc-400 py-2">
                    <span>$1B</span><span>$100M</span><span>$50M</span><span>$10M</span><span>$1M</span>
                  </div>
                  <div className="ml-14 h-full relative">
                    <svg viewBox="0 0 800 300" className="w-full h-full overflow-visible relative z-10" onMouseMove={(e) => { const rect = e.currentTarget.getBoundingClientRect(); const x = e.clientX - rect.left; const index = Math.round((x / rect.width) * (REVENUE_DATA.length - 1)); setHoveredPoint(Math.max(0, Math.min(index, REVENUE_DATA.length - 1))); }} onMouseLeave={() => setHoveredPoint(null)} >
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.12" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <motion.path initial={{ opacity: 0 }} animate={{ opacity: 1 }} d={`${generatePath(REVENUE_DATA).replace(/240/g, '300')} L 800,300 L 0,300 Z`} fill="url(#revenueGradient)" />
                      <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }} d={generatePath(REVENUE_DATA).replace(/240/g, '300')} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      {hoveredPoint !== null && (
                        <g>
                          <line x1={(hoveredPoint / (REVENUE_DATA.length - 1)) * 800} y1="0" x2={(hoveredPoint / (REVENUE_DATA.length - 1)) * 800} y2="300" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4" className="opacity-40" />
                          <circle cx={(hoveredPoint / (REVENUE_DATA.length - 1)) * 800} cy={300 - (REVENUE_DATA[hoveredPoint].value / (Math.max(...REVENUE_DATA.map(d => d.value)) * 1.1)) * 300} r="6" fill="white" stroke="#3b82f6" strokeWidth="3" className="drop-shadow-md" />
                        </g>
                      )}
                    </svg>
                    {hoveredPoint !== null && (
                      <div className="absolute p-3 rounded-xl bg-zinc-900 text-white shadow-2xl pointer-events-none z-20 transition-all duration-200" style={{ left: `${(hoveredPoint / (REVENUE_DATA.length - 1)) * 100}%`, top: `calc(${300 - (REVENUE_DATA[hoveredPoint].value / (Math.max(...REVENUE_DATA.map(d => d.value)) * 1.1)) * 300}px - 80px)`, transform: 'translateX(-50%)' }}>
                        <p className="text-[11px] font-bold text-zinc-400 mb-1">{REVENUE_DATA[hoveredPoint].month}, 2024</p>
                        <p className="text-[13px] font-bold">Cumulative: <span className="text-white">${REVENUE_DATA[hoveredPoint].value * 2.1}M</span></p>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-900 rotate-45" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between mt-8 ml-14">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
                    <span key={i} className="text-[11px] font-bold text-zinc-400">{m}</span>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-white dark:bg-[#1f1f1f] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <h2 className="text-[20px] font-black text-zinc-900 dark:text-white mb-1">Recent Transactions</h2>
                    <p className="text-[13px] text-zinc-500 dark:text-zinc-400">Manage and track your latest hospital billings</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-zinc-50/50 dark:bg-zinc-900/50">
                        <th className="px-8 py-4 text-[12px] font-bold text-zinc-400 uppercase tracking-wider">ID</th>
                        <th className="px-8 py-4 text-[12px] font-bold text-zinc-400 uppercase tracking-wider">Customer</th>
                        <th className="px-8 py-4 text-[12px] font-bold text-zinc-400 uppercase tracking-wider">Date</th>
                        <th className="px-8 py-4 text-[12px] font-bold text-zinc-400 uppercase tracking-wider">Amount</th>
                        <th className="px-8 py-4 text-[12px] font-bold text-zinc-400 uppercase tracking-wider text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {TRANSACTIONS.map((tx) => (
                        <tr key={tx.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                          <td className="px-8 py-5 text-[14px] font-bold">{tx.id}</td>
                          <td className="px-8 py-5 text-[14px] font-bold">{tx.customer}</td>
                          <td className="px-8 py-5 text-[14px] text-zinc-500">{tx.date}</td>
                          <td className="px-8 py-5 text-[14px] font-black">{tx.amount}</td>
                          <td className="px-8 py-5 text-right">
                            <span className={cn("text-[13px] font-bold", tx.status === "Completed" ? "text-emerald-500" : "text-amber-500")}>{tx.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsPanel>

          <TabsPanel value="appointments" className="mt-0">
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-white dark:bg-[#1f1f1f] border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-[18px] font-black text-zinc-900 dark:text-white mb-1">Appointment Trends</h2>
                    <p className="text-[13px] text-zinc-500 dark:text-zinc-400">Weekly patient visits summary</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-zinc-400" />
                  </div>
                </div>
                <div className="h-64 w-full relative">
                  <svg viewBox="0 0 800 120" className="w-full h-full overflow-visible">
                    <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }} d={generatePath(APPOINTMENT_DATA.map(d => ({ value: d.count }))).replace(/240/g, '120')} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-zinc-900 dark:text-white" />
                  </svg>
                  <div className="flex justify-between mt-4">
                    {APPOINTMENT_DATA.map(d => (
                      <span key={d.day} className="text-[11px] font-bold text-zinc-400">{d.day}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1f1f1f]">
                  <h4 className="text-[14px] font-bold text-zinc-400 uppercase mb-4">Upcoming This Week</h4>
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                          <div>
                            <p className="text-[13px] font-bold">Patient #{i}042</p>
                            <p className="text-[11px] text-zinc-500">Scheduled for 10:30 AM</p>
                          </div>
                        </div>
                        <CaretRight className="text-zinc-400" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1f1f1f]">
                  <h4 className="text-[14px] font-bold text-zinc-400 uppercase mb-4">Cancellations</h4>
                  <div className="flex flex-col items-center justify-center h-48 text-zinc-400">
                    <Clock size={32} className="mb-2 opacity-20" />
                    <p className="text-[13px] font-medium">No cancellations today</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsPanel>

          <TabsPanel value="patients" className="mt-0">
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-white dark:bg-[#1f1f1f] border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-[18px] font-black text-zinc-900 dark:text-white mb-1">Patient Distribution</h2>
                    <p className="text-[13px] text-zinc-500 dark:text-zinc-400">By hospital department</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
                    <UsersThree className="w-5 h-5 text-zinc-400" />
                  </div>
                </div>
                <div className="space-y-6">
                  {DEPARTMENT_DISTRIBUTION.map((dept, i) => (
                    <div key={dept.name}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[14px] font-bold text-zinc-900 dark:text-100">{dept.name}</span>
                        <span className="text-[14px] font-black text-zinc-900 dark:text-white">{dept.count} patients</span>
                      </div>
                      <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(dept.count / 200) * 100}%` }} transition={{ duration: 1, delay: i * 0.1 }} className={cn("h-full rounded-full", dept.color)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-emerald-500 text-white">
                  <p className="text-[13px] font-bold opacity-80 uppercase">Retention Rate</p>
                  <h3 className="text-[28px] font-black">94.2%</h3>
                </div>
                <div className="p-6 rounded-2xl bg-zinc-100 dark:bg-zinc-900">
                  <p className="text-[13px] font-bold text-zinc-400 uppercase">Avg Visit Time</p>
                  <h3 className="text-[28px] font-black">42m</h3>
                </div>
                <div className="p-6 rounded-2xl bg-zinc-100 dark:bg-zinc-900">
                  <p className="text-[13px] font-bold text-zinc-400 uppercase">Growth</p>
                  <h3 className="text-[28px] font-black text-emerald-500">+12%</h3>
                </div>
              </div>
            </div>
          </TabsPanel>
        </Tabs>

      </div>
    </div>
  );
}
