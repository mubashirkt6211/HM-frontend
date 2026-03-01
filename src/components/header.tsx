import { Search } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/50 bg-white/80 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-[#0a0a0a]/90 supports-[backdrop-filter]:dark:bg-[#0a0a0a]/60 h-14 md:h-16">
      <div className="flex h-full items-center justify-between px-4 md:px-6 w-full gap-2">
        {/* Mobile controls & Logo inline */}
        <div className="flex items-center md:hidden">
          <SidebarTrigger className="h-9 w-9 p-2 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 bg-transparent hover:bg-zinc-100/50 dark:hover:bg-zinc-800 transition-all border-none shadow-none -ml-1.5" />
          <a href="/" className="inline-flex items-center gap-2.5 font-semibold ml-2">
            <div className="flex items-center">
              <img src="/logo.svg" alt="KokonutUI" className="h-6 w-6 shrink-0 hidden dark:block" style={{ filter: 'invert(1)' }} />
              <img src="/logo.svg" alt="KokonutUI" className="h-6 w-6 shrink-0 block dark:hidden" />
              <span className="font-bold text-[18px] tracking-tight text-zinc-950 dark:text-zinc-50 ml-2">KokonutUI</span>
              <span className="ml-1.5 inline-flex h-[18px] items-center justify-center rounded-md bg-black px-1.5 font-medium text-[10px] text-white uppercase tracking-wider dark:bg-white dark:text-black">Pro</span>
            </div>
          </a>
        </div>

        {/* Search Bar - Left aligned on desktop */}
        <div className="hidden md:flex flex-1 items-center">
          <SidebarTrigger className="h-8 w-8 text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 bg-transparent hover:bg-zinc-100/50 dark:hover:bg-zinc-800 transition-all border-none shadow-none mr-2 data-[state=expanded]:hidden" />
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-800/50 p-1.5 ps-2 text-sm text-zinc-500 dark:text-zinc-400 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 w-full max-w-[240px] shadow-sm"
          >
            <Search className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">Search</span>
            <div className="ml-auto inline-flex gap-0.5">
              <kbd className="rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-1.5 font-sans text-[11px] leading-5 text-zinc-500 dark:text-zinc-400">⌘</kbd>
              <kbd className="rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-1.5 font-sans text-[11px] leading-5 text-zinc-500 dark:text-zinc-400">K</kbd>
            </div>
          </button>
        </div>

        {/* Search icon for mobile */}
        <div className="flex md:hidden items-center">
          <button type="button" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors p-2 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <Search className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* Right side actions */}
        <div className="flex items-center justify-end flex-1 md:flex-none gap-2">
          <div className="hidden lg:flex items-center mr-4">
            <a
              href="#"
              className="bg-black dark:bg-white text-white dark:text-black h-8 px-3 py-2 flex items-center justify-center text-sm font-medium rounded-lg transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200"
            >
              $30 off with code <span className="font-bold ml-1">WINTER30</span>
            </a>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}

