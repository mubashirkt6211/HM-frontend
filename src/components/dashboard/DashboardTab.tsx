/**
 * Dashboard Tab - Main statistics and performance overview
 */
import { motion } from "motion/react";
import {
  TrendingUp,
  Users,
  Target,
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

export function DashboardTab() {


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
                      className={cn(
                        "w-8 h-8 rounded-lg text-[10px] font-black flex items-center justify-center transition-all",
                        t === "M"
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
                  <span className="text-xs text-zinc-400 mt-1">Goal for this quarter</span>
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
            <FilterBtn label="Weekly" />
            <FilterBtn label="Monthly" />
            <FilterBtn label="Annual review" active />
          </div>
          <button className="flex items-center gap-4 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm text-[13px] font-bold text-zinc-700 dark:text-zinc-300">
            2025 <ChevronDown className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors text-[14px] font-medium">
          <Plus className="w-4 h-4" />
          Add objective
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "User Retention",
            value: "94.2%",
            trend: "+2.4%",
            status: "On Track",
          },
          {
            title: "Project Velocity",
            value: "18.5 pts",
            trend: "-1.2%",
            status: "At Risk",
          },
          {
            title: "Budget Usage",
            value: "€14.2k",
            trend: "+5.1%",
            status: "Budgeted",
          },
        ].map((stat, i) => (
          <Card key={i} title={stat.title} trailing={stat.value}>
            <div className="mt-4 flex items-center justify-between">
              <span
                className={cn(
                  "text-[12px] font-bold",
                  stat.trend.startsWith("+")
                    ? "text-emerald-500"
                    : "text-rose-500"
                )}
              >
                {stat.trend} this month
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-medium italic">
                {stat.status}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
