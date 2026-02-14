import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import ProfileDropdown from "@/components/kokonutui/profile-dropdown"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/50 bg-zinc-50/50 backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-950/50">
      <div className="flex h-14 items-center justify-between px-6 py-3.5 max-w-[1400px] mx-auto w-full">
        {/* Left Side (Empty for center alignment) */}
        <div className="flex w-12 shrink-0 md:hidden" />

        {/* Search Bar - Precisely Centered */}
        <div className="flex flex-1 items-center justify-center">
          <div className="relative w-full max-w-sm group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-600 dark:group-focus-within:text-zinc-300 transition-colors" />
            <Input
              type="search"
              placeholder="Search"
              className="w-full pl-9 pr-14 h-9 text-[13px] rounded-lg bg-zinc-200/40 border-transparent focus:bg-white focus:border-zinc-200 dark:bg-zinc-800/40 dark:focus:bg-zinc-900 transition-all shadow-none"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded border border-zinc-200/60 bg-zinc-100/50 dark:border-zinc-700/60 dark:bg-zinc-800/50 text-[10px] font-medium text-zinc-400">
              <span className="text-[9px] lowercase opacity-70">ctrl</span>
              <span className="text-[11px] leading-none uppercase">K</span>
            </div>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center">
            <a
              href="#"
              className="bg-black dark:bg-white text-white dark:text-black h-8 px-4 flex items-center justify-center text-[13px] font-bold rounded-lg transition-all hover:opacity-90 active:scale-95"
            >
              $30 off with code WINTER30
            </a>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="md:block scale-90">
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

