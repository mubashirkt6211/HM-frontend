/**
 * Dashboard Tab - Main statistics and performance overview
 */
import { useState } from "react";
import { motion } from "motion/react";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  VisualChart,
  FilterBtn,
} from "./components.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DashboardTab() {
  const [selectedPeriod, setSelectedPeriod] = useState("M");
  const [selectedTab, setSelectedTab] = useState("Annual review");
  const [selectedYear, setSelectedYear] = useState(2025);

  const years = [2023, 2024, 2025, 2026];
  const tabs = ["Weekly", "Monthly", "Annual review"];



  return (
    <div className="space-y-6">
  

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card
            title="Performance Overview"
            trailing={
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />{" "}
                Live
              </div>
            }
          >
            <div className="flex flex-col h-full">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                    Total Achievements
                  </div>
                  <div className="text-4xl font-black text-zinc-900 dark:text-zinc-100 flex items-baseline gap-2">
                    24,580
                    <span className="text-emerald-500 text-sm font-bold">+12.5%</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  {["D", "W", "M", "Y"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedPeriod(t)}
                      className={cn(
                        "w-8 h-8 rounded-lg text-[10px] font-black flex items-center justify-center transition-all",
                        selectedPeriod === t
                          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                          : "text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <VisualChart />

              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">
                    Target
                  </span>
                  <span className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100">
                    € 32,000
                  </span>
                  <span className="text-xs text-zinc-400 mt-1">Goal for this {selectedPeriod === 'D' ? 'day' : selectedPeriod === 'W' ? 'week' : selectedPeriod === 'M' ? 'month' : 'year'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">
                    Achieved
                  </span>
                  <span className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100">
                    € 24,450
                  </span>
                  <span className="text-xs text-zinc-400 mt-1">76.4% completed</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-200 dark:bg-zinc-800 overflow-hidden hover:scale-110 transition-transform"
                    >
                      <img
                        src={`https://i.pravatar.cc/100?img=${i + 20}`}
                        alt=""
                      />
                    </div>
                  ))}
                </div>
                <span className="text-xs font-bold text-zinc-400">
                  15 team members tracking
                </span>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card title="Achievement Progress" trailing="76 %">
            <div className="mt-4 flex flex-col gap-6">
              <div className="relative h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-md flex items-center">
                <div className="absolute inset-0 flex justify-between px-1">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="w-px h-3 -mt-0.5 bg-zinc-200 dark:bg-zinc-700"
                    />
                  ))}
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "76%" }}
                  className="absolute left-0 h-full bg-blue-500 rounded-md shadow-lg"
                />
                <motion.div
                  initial={{ left: 0 }}
                  animate={{ left: "76%" }}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-700 border-4 border-white dark:border-zinc-900 shadow-md ring-2 ring-blue-500/20"
                />
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-[12px] text-zinc-400">
                  Last update:{" "}
                  <span className="text-blue-700 font-medium">Today at 5:56pm</span>
                </span>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
          </Card>

          <Card
            title="Status Overview"
            trailing={
              <span className="text-xs text-zinc-400">
                <span className="text-zinc-900 dark:text-zinc-100 font-bold">
                  8 <span className="text-zinc-300 font-light">/ 10</span>
                </span>
              </span>
            }
          >
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Completed Tasks</span>
                </div>
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">124</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">In Progress</span>
                </div>
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">24</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Pending</span>
                </div>
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">8</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-zinc-100/80 dark:bg-zinc-800/80 p-1 border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm">
            {tabs.map((tab) => (
              <FilterBtn 
                key={tab}
                label={tab} 
                active={selectedTab === tab}
                onClick={() => setSelectedTab(tab)}
              />
            ))}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="flex items-center gap-4 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm text-[13px] font-bold text-zinc-700 dark:text-zinc-300"
              >
                {selectedYear} <ChevronDown className="w-4 h-4 text-zinc-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-24 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg">
              {years.map((year) => (
                <DropdownMenuItem
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={cn(
                    "cursor-pointer w-full text-left px-4 py-2 text-sm transition-colors",
                    selectedYear === year
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold"
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  )}
                >
                  {year}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors text-[14px] font-medium">
          <Plus className="w-4 h-4" />
          Add objective
        </button>
      </div>


      {/* Year-Specific Charts Section */}
      <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mb-6">
          Year {selectedYear} Performance Analytics
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card
            title="Annual Revenue"
            trailing={` ${selectedYear}`}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <div className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                    Total Revenue
                  </div>
                  <div className="text-3xl font-black text-zinc-900 dark:text-zinc-100 flex items-baseline gap-2">
                    €{(selectedYear === 2023 ? 128 : selectedYear === 2024 ? 156 : selectedYear === 2025 ? 189 : 220)}k
                    <span className={cn(
                      "text-sm font-bold",
                      selectedYear > 2023 ? "text-emerald-500" : "text-rose-500"
                    )}>
                      {selectedYear === 2023 ? "baseline" : selectedYear === 2024 ? "+22%" : selectedYear === 2025 ? "+21%" : "+16%"}
                    </span>
                  </div>
                </div>
              </div>

              <svg className="w-full h-40" viewBox="0 0 400 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="yearGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.3 }} />
                    <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0 }} />
                  </linearGradient>
                </defs>
                <motion.polyline
                  points={selectedYear === 2023 ? "0,80 50,70 100,75 150,60 200,50 250,55 300,40 350,45 400,35" : 
                           selectedYear === 2024 ? "0,75 50,65 100,70 150,55 200,45 250,48 300,35 350,38 400,25" : 
                           selectedYear === 2025 ? "0,70 50,60 100,65 150,50 200,40 250,42 300,30 350,32 400,20" : 
                           "0,65 50,55 100,60 150,45 200,35 250,37 300,25 350,27 400,12"}
                  fill="url(#yearGradient)"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </svg>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">
                    Avg Monthly
                  </span>
                  <span className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100">
                    €{Math.round((selectedYear === 2023 ? 128 : selectedYear === 2024 ? 156 : selectedYear === 2025 ? 189 : 220) / 12)}k
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">
                    Q4 Peak
                  </span>
                  <span className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100">
                    €{Math.round((selectedYear === 2023 ? 128 : selectedYear === 2024 ? 156 : selectedYear === 2025 ? 189 : 220) * 0.28)}k
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Growth Metrics Chart */}
          <Card
            title="Growth Metrics"
            trailing={`${selectedYear}`}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <div className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                    Year-over-Year Growth
                  </div>
                  <div className="text-3xl font-black text-zinc-900 dark:text-zinc-100 flex items-baseline gap-2">
                    {selectedYear === 2023 ? "18" : selectedYear === 2024 ? "22" : selectedYear === 2025 ? "21" : "16"}%
                    <span className="text-sm font-bold text-emerald-500">
                      {selectedYear === 2024 ? "+4.2%" : selectedYear === 2025 ? "-1.2%" : selectedYear === 2026 ? "-4.8%" : "baseline"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center p-4 mt-2">
                {(() => {
                  const acq = selectedYear === 2023 ? 65 : selectedYear === 2024 ? 78 : selectedYear === 2025 ? 85 : 88;
                  const mkt = selectedYear === 2023 ? 42 : selectedYear === 2024 ? 54 : selectedYear === 2025 ? 62 : 71;
                  const adp = selectedYear === 2023 ? 58 : selectedYear === 2024 ? 68 : selectedYear === 2025 ? 76 : 82;
                  const avg = Math.round((acq + mkt + adp) / 3);

                  return (
                    <div className="flex w-full items-center justify-between">
                      <div className="relative w-40 h-40 shrink-0">
                        <svg className="w-full h-full transform -rotate-90 filter drop-shadow-md" viewBox="0 0 200 200">
                          {/* Acquisition */}
                          <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="14" fill="none" className="text-zinc-100 dark:text-zinc-800" />
                          <motion.circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="14" fill="none" strokeDasharray={2 * Math.PI * 80} strokeLinecap="round" className="text-blue-500"
                            initial={{ strokeDashoffset: 2 * Math.PI * 80 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 80 * (1 - acq / 100) }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          />
                          
                          {/* Market Share */}
                          <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="14" fill="none" className="text-zinc-100 dark:text-zinc-800" />
                          <motion.circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="14" fill="none" strokeDasharray={2 * Math.PI * 60} strokeLinecap="round" className="text-emerald-500"
                            initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 60 * (1 - mkt / 100) }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.1 }}
                          />

                          {/* Adoption */}
                          <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="14" fill="none" className="text-zinc-100 dark:text-zinc-800" />
                          <motion.circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="14" fill="none" strokeDasharray={2 * Math.PI * 40} strokeLinecap="round" className="text-purple-500"
                            initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - adp / 100) }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                          />
                        </svg>
                        
                        {/* Center Value */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">Avg</span>
                          <span className="text-3xl font-black text-zinc-900 dark:text-zinc-100 mt-1 tracking-tighter">{avg}</span>
                        </div>
                      </div>

                      <div className="flex flex-col justify-center space-y-4 pr-2 pl-4">
                        {[
                          { label: "Acquisition", value: acq, color: "bg-blue-500", text: "text-blue-500" },
                          { label: "Market Share", value: mkt, color: "bg-emerald-500", text: "text-emerald-500" },
                          { label: "Adoption", value: adp, color: "bg-purple-500", text: "text-purple-500" },
                        ].map(m => (
                          <div key={m.label} className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                              <div className={cn("w-2.5 h-2.5 rounded-full shadow-sm", m.color)} />
                              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">{m.label}</span>
                            </div>
                            <span className={cn("text-lg font-black leading-none ml-[18px]", m.text)}>{m.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-medium italic">
                  {selectedYear === 2023 ? "Baseline" : selectedYear === 2024 ? "Strong Momentum" : selectedYear === 2025 ? "Stable Growth" : "Solid Performance"}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
