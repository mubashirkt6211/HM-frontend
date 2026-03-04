import {
    Search,
    ChevronDown,
    LayoutGrid,
    Bookmark,
    Calendar,
    Sparkles,
    Trophy,
    CheckSquare,
    FileText,
    List,
    Box,
    Clock,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"

import { cn } from "@/lib/utils"

export function AppSidebar() {
    const { state, isMobile } = useSidebar()
    const collapsed = state === "collapsed" && !isMobile

    return (
        <Sidebar
            variant="sidebar"
            collapsible="icon"
            className="border-none bg-transparent w-[260px]"
        >
            <div className="h-full">

                <SidebarHeader className="p-4 border-none bg-transparent">
                    {!collapsed && (
                        <div className="flex flex-col gap-5">

                            {/* USER */}
                            <div className="flex items-center gap-2 px-1 cursor-pointer">
                                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                                    AM
                                </div>

                                <span className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100">
                                    Andrew Mial...
                                </span>

                                <ChevronDown className="w-4 h-4 text-zinc-500 ml-auto" />
                            </div>

                            {/* SEARCH */}
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />

                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full h-9 pl-9 pr-10 rounded-xl bg-white/80 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[13px] outline-none shadow-sm placeholder:text-zinc-400"
                                />

                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                                    <kbd className="text-[10px] text-zinc-400 bg-zinc-100 dark:bg-zinc-700 px-1 py-0.5 rounded">
                                        ⌘
                                    </kbd>
                                    <kbd className="text-[10px] text-zinc-400 bg-zinc-100 dark:bg-zinc-700 px-1 py-0.5 rounded">
                                        F
                                    </kbd>
                                </div>
                            </div>
                        </div>
                    )}
                </SidebarHeader>

                <SidebarContent className="p-3 pt-0 bg-transparent">

                    {/* MAIN */}
                    <SidebarGroup className="p-0 mb-6">
                        <SidebarGroupContent>
                            <SidebarMenu className="gap-1">

                                <NavItem icon={LayoutGrid} title="Dashboard" isActive />

                                <NavItem icon={Bookmark} title="Saved" />

                                <NavItem icon={Calendar} title="Calendar" />

                                <NavItem icon={Sparkles} title="AI Assistant" />

                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    {/* PRIVATE */}
                    <SidebarGroup className="p-0 mb-6">

                        <SidebarGroupLabel className="px-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                            Private Space
                        </SidebarGroupLabel>

                        <SidebarGroupContent>
                            <SidebarMenu className="gap-1">

                                <NavItem
                                    icon={Trophy}
                                    title="Goals '24"
                                    iconClassName="text-yellow-500"
                                />

                                <div className="ml-[20px] border-l border-zinc-200 dark:border-zinc-800 pl-3 my-1 flex flex-col gap-1">

                                    <NavItem icon={CheckSquare} title="Tasks" isSubitem />

                                    <NavItem icon={FileText} title="Code Snippet" isSubitem />

                                </div>

                                <NavItem icon={List} title="List" />

                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    {/* SHARED */}
                    <SidebarGroup className="p-0">

                        <SidebarGroupLabel className="px-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                            Shared with you
                        </SidebarGroupLabel>

                        <SidebarGroupContent>
                            <SidebarMenu className="gap-1">

                                <NavItem icon={FileText} title="Q2 2024" />

                                <NavItem icon={Box} title="Archive" />

                                <NavItem icon={Clock} title="Critical" iconClassName="text-rose-500" />

                            </SidebarMenu>
                        </SidebarGroupContent>

                    </SidebarGroup>

                </SidebarContent>
            </div>
        </Sidebar>
    )
}

function NavItem({
    icon: Icon,
    title,
    isActive,
    isSubitem,
    iconClassName,
}: {
    icon: any
    title: string
    isActive?: boolean
    isSubitem?: boolean
    iconClassName?: string
}) {
    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                tooltip={title}
                isActive={isActive}
                className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-[14px] transition-all h-9",
                    isActive
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-black shadow-sm"
                        : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white",
                    isSubitem && "h-8 text-[13px] gap-2 rounded-lg px-3"
                )}
            >
                <a href="#">
                    <Icon
                        className={cn(
                            "w-[18px] h-[18px] shrink-0",
                            isSubitem && "w-4 h-4",
                            iconClassName
                        )}
                    />
                    <span className="truncate">{title}</span>
                </a>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}