import { PanelLeft, UserCheck, Users, CreditCard, Settings, HelpCircle, LogOut, Plus, Zap, Home, ChevronRight, LayoutDashboard, Calendar, UserSquare, Stethoscope, Bell } from "lucide-react";

import { useSidebar } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

const PAGE_META: Record<string, { label: string; icon: React.ElementType }> = {
  dashboard: { label: "Dashboard", icon: LayoutDashboard },
  calender: { label: "Calendar", icon: Calendar },
  calendar: { label: "Calendar", icon: Calendar },
  patients: { label: "Patients", icon: Stethoscope },
  doctors: { label: "Team", icon: UserSquare },
  notifications: { label: "Notifications", icon: Bell },
};

export function SiteHeader({
  onTabChange,
  currentPage = "dashboard",
  activeTab,
}: {
  onTabChange?: (tab: string) => void;
  currentPage?: string;
  activeTab?: string;
}) {
  const { toggleSidebar } = useSidebar();
  const pageMeta = PAGE_META[currentPage] ?? { label: "Dashboard", icon: LayoutDashboard };

  return (
    <header className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md rounded-t-[20px] shrink-0 sticky top-0 z-10 w-full h-16 px-6 md:px-10 no-scrollbar">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors"
        >
          <PanelLeft className="w-5 h-5" />
        </button>
        <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1"></div>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm">
          <div className="flex items-center gap-1 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span className="text-[13px] font-medium">Home</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-700" />
          <div className="flex items-center gap-1.5 text-zinc-900 dark:text-zinc-100">
            <pageMeta.icon className="w-3.5 h-3.5" />
            <span className="text-[13px] font-semibold">{pageMeta.label}</span>
          </div>
          {/* {activeTab && activeTab !== pageMeta.label && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-700" />
              <span className="text-[13px] font-semibold text-zinc-600 dark:text-zinc-400">{activeTab}</span>
            </>
          )} */}
        </nav>

      </div>

      <div className="flex items-center gap-4">

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-9 w-9 cursor-pointer border-2 border-zinc-100 dark:border-zinc-800 hover:ring-4 hover:ring-zinc-50 dark:hover:ring-zinc-900/50 transition-all duration-300">
              <AvatarImage src="https://i.pinimg.com/1200x/39/86/91/398691f123726a5763e9c47980964fff.jpg" alt="@sophie" />
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">SB</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 p-1.5 rounded-[22px] border-zinc-200/50 dark:border-zinc-800/50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]" align="end" sideOffset={8}>
            <DropdownMenuLabel className="p-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Sophie Bennett</span>
                  <span className="text-[11px] font-medium text-zinc-400">sophie@ui.live</span>
                </div>
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 opacity-20 blur-sm"></div>
                  <Avatar className="h-10 w-10 border-2 border-white dark:border-zinc-900 shadow-sm relative">
                    <AvatarImage src="https://i.pinimg.com/1200x/39/86/91/398691f123726a5763e9c47980964fff.jpg" />
                  </Avatar>
                </div>
              </div>
            </DropdownMenuLabel>

            <div className="space-y-0.5">
              <DropdownMenuItem
                onClick={() => onTabChange?.("Profile")}
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-100 dark:border-zinc-800 group-hover:bg-white dark:group-hover:bg-zinc-800 transition-colors">
                  <UserCheck className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
                </div>
                <span className="text-[13px] font-semibold text-zinc-700 dark:text-zinc-300">Profile</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group">
                <div className="w-7 h-7 rounded-lg bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-100 dark:border-zinc-800 group-hover:bg-white dark:group-hover:bg-zinc-800 transition-colors">
                  <Users className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
                </div>
                <span className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400">Community</span>
                <div className="ml-auto w-4 h-4 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <Plus className="w-2.5 h-2.5 text-zinc-500" />
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group">
                <div className="w-7 h-7 rounded-lg bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-100 dark:border-zinc-800 group-hover:bg-white dark:group-hover:bg-zinc-800 transition-colors">
                  <CreditCard className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
                </div>
                <span className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400">Subscription</span>
                <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-none px-1.5 py-0 h-4 flex items-center gap-1 text-[9px] font-bold">
                  <Zap className="w-2 h-2 fill-current" />
                  PRO
                </Badge>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group">
                <div className="w-7 h-7 rounded-lg bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-100 dark:border-zinc-800 group-hover:bg-white dark:group-hover:bg-zinc-800 transition-colors">
                  <Settings className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
                </div>
                <span className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400">Settings</span>
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator className="my-1.5 bg-zinc-100/50 dark:bg-zinc-800/50" />

            <div className="space-y-0.5">
              <DropdownMenuItem className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group">
                <div className="w-7 h-7 rounded-lg bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-100 dark:border-zinc-800 group-hover:bg-white dark:group-hover:bg-zinc-800 transition-colors">
                  <HelpCircle className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
                </div>
                <span className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400">Help center</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group text-red-500 dark:text-red-400">
                <div className="w-7 h-7 rounded-lg bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-100 dark:border-zinc-800 group-hover:bg-white dark:group-hover:bg-zinc-800 transition-colors">
                  <LogOut className="w-3.5 h-3.5" />
                </div>
                <span className="text-[13px] font-medium">Sign out</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
