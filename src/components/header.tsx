import { PanelLeft, ArrowLeft, ArrowRight, AlarmClock, Trophy, LayoutDashboard, List, Kanban, ChevronDown, MoreHorizontal } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="flex flex-col border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-t-[20px] shrink-0 sticky top-0 z-10 w-full pt-4 px-6 md:px-10 no-scrollbar">
      {/* Top Row: Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between h-8 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSidebar}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors"
          >
            <PanelLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 text-zinc-400">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors opacity-50 cursor-not-allowed">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1"></div>

          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
            <AlarmClock className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 ml-2 px-3 py-1.5 rounded-full bg-zinc-100/80 dark:bg-zinc-800/80 text-[13px] font-medium text-zinc-900 dark:text-zinc-100">
            <Trophy className="w-3.5 h-3.5 text-yellow-500" />
            <span>Goals '24</span>
            <button className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors ml-1">
              ✕
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-7 h-7 rounded-full bg-blue-100 border-2 border-white dark:border-zinc-950 z-20 flex items-center justify-center text-[10px] font-medium text-blue-700">A</div>
            <div className="w-7 h-7 rounded-full bg-indigo-100 border-2 border-white dark:border-zinc-950 -ml-3 z-10 flex items-center justify-center text-[10px] font-medium text-indigo-700">D</div>
            <button className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 border-2 border-white dark:border-zinc-950 -ml-3 z-0 flex items-center justify-center text-[10px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
              +2
            </button>
          </div>
          <button className="text-[13px] font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors px-2 py-1">
            Share
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1"></div>
          <ThemeToggle />
        </div>
      </div>

      {/* Bottom Row: Tabs */}
      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
        <Tab icon={LayoutDashboard} label="Dashboard" />
        <Tab icon={List} label="List" isActive />
        <Tab icon={Kanban} label="Board" />
        <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-2"></div>
        <button className="flex items-center gap-2 text-[13px] font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors pb-3 border-b-2 border-transparent">
          View
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  )
}

function Tab({ icon: Icon, label, isActive }: { icon: any, label: string, isActive?: boolean }) {
  return (
    <button className={cn(
      "flex items-center gap-2 text-[13px] font-medium pb-3 border-b-2 transition-colors",
      isActive
        ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100"
        : "border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
    )}>
      <Icon className="w-4 h-4" />
      {label}
    </button>
  )
}
