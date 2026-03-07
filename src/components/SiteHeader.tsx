import { Trophy, PanelLeft, Search } from "lucide-react";

import { useSidebar } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();

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

        {/* Search Bar Capsule */}
        <div className="hidden md:flex items-center gap-2 px-3 h-9 rounded-full bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 w-64 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer group">
          <Search className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
          <span className="text-[13px] text-zinc-500">Search</span>
          <div className="ml-auto flex items-center gap-1">
            <kbd className="text-[10px] font-medium text-zinc-400 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 rounded shadow-sm">Ctrl</kbd>
            <kbd className="text-[10px] font-medium text-zinc-400 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 rounded shadow-sm">K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100/80 dark:bg-zinc-800/80 text-[12px] font-medium text-zinc-900 dark:text-zinc-100 border border-zinc-200/50 dark:border-zinc-800/50">
          <Trophy className="w-3.5 h-3.5 text-yellow-500" />
          <span>Goals '24</span>
        </div>

        <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block"></div>

        <ThemeToggle />
        <Avatar className="h-8 w-8 cursor-pointer border border-zinc-200/50 dark:border-zinc-800/50 hover:ring-2 hover:ring-zinc-100 dark:hover:ring-zinc-800 transition-all">
          <AvatarImage src="https://i.pinimg.com/1200x/39/86/91/398691f123726a5763e9c47980964fff.jpg" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
