import logo from "@/assets/logo-black.svg"
import { useState } from "react"
import {
    ChevronDown,
    ChevronRight,
    LayoutGrid,
    List,
    Home,
    LogIn,
    HelpCircle,
    Columns,
    Star,
    DollarSign,
    File,
    MessageSquare,
    Calendar1Icon,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

interface SidebarItem {
    title: string;
    url: string;
    icon: any;
    isActive?: boolean;
    badge?: string;
    hasChildren?: boolean;
}

interface SidebarCategory {
    label: string;
    key: string;
    items: SidebarItem[];
}

const sidebarData: SidebarCategory[] = [
    {
        label: "Daily Activities",
        key: "futur",
        items: [
            { title: "Introduction", url: "#", icon: Home },
              { title: "Login", url: "#", icon: LogIn },
            { title: "Features", url: "#", icon: LayoutGrid },
            { title: "FAQs", url: "#", icon: HelpCircle },
            { title: "Footers", url: "#", icon: Columns },
            { title: "Heroes", url: "#", icon: Star },
            { title: "Pricings", url: "#", icon: DollarSign },
            { title :"Daily Orders" , url :"#", icon :Calendar1Icon}
        ],
    },
    {
        label: "Postly",
        key: "postly",
        items: [
            { title: "Installation", url: "#", icon: List },
        ],
    },
    {
        label: "Startup",
        key: "startup",
        items: [
            { title: "Overview", url: "#", icon: LayoutGrid },
        ],
    },
    {
        label: "Blocks & Sections",
        key: "blocks",
        items: [
            { title: "Login", url: "#", icon: LogIn },
            { title: "Features", url: "#", icon: LayoutGrid },
            { title: "FAQs", url: "#", icon: HelpCircle },
            { title: "Footers", url: "#", icon: Columns },
            { title: "Heroes", url: "#", icon: Star },
            { title: "Pricings", url: "#", icon: DollarSign },
            { title: "Pages", url: "#", icon: File, hasChildren: true },
            { title: "Testimonials", url: "#", icon: MessageSquare, hasChildren: true },
        ],
    },
    {
        label: "Components",
        key: "components",
        items: [
            { title: "Cards", url: "#", icon: List },
            { title: "Headline", url: "#", icon: List },
            { title: "Banners", url: "#", icon: List },
            { title: "Buttons", url: "#", icon: List },
            { title: "Forms", url: "#", icon: List },
        ],
    },
]

export function AppSidebar() {
    const { state, isMobile } = useSidebar()
    const collapsed = state === "collapsed" && !isMobile

    const [openState, setOpenState] = useState<Record<string, boolean>>({
        futur: true,
        postly: true,
        startup: true,
        blocks: true,
        components: true,
    })

    const toggle = (key: string) =>
        setOpenState((prev: Record<string, boolean>) => ({ ...prev, [key]: !prev[key] }))

    return (
        <Sidebar
            variant="sidebar"
            collapsible="icon"
            className="border-r border-zinc-200/50 bg-white dark:border-zinc-800/50 dark:bg-zinc-950"
        >
            <SidebarHeader className="p-4 pb-2 border-b border-transparent">
                <div className="flex items-center justify-between relative">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                        <img src={logo} alt="Kokonut UI" className="h-6 w-6 shrink-0" />
                        {!collapsed && (
                            <div className="flex items-center gap-2 transition-all duration-200">
                                <span className="font-bold text-[18px] tracking-tight text-zinc-950 dark:text-zinc-50">KokonutUI</span>
                                <span className="text-[10px] font-bold bg-black dark:bg-white text-white dark:text-black px-1.5 py-0.5 rounded-sm h-[18px] flex items-center leading-none">PRO</span>
                            </div>
                        )}
                    </div>
                    {!collapsed && (
                        <SidebarTrigger className="h-8 w-8 text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 bg-transparent hover:bg-zinc-100/50 dark:hover:bg-zinc-800 transition-all border-none shadow-none" />
                    )}
                </div>
            </SidebarHeader>

            <SidebarContent className="p-4 pt-4">
                {sidebarData.map((section) => (
                    <SidebarGroup key={section.key} className="p-0 mt-4 first:mt-0">
                        <SidebarGroupLabel
                            onClick={() => !collapsed && toggle(section.key)}
                            className={cn(
                                "flex h-auto shrink-0 items-center rounded-lg px-2 py-1.5 mb-1 text-[11px] font-bold uppercase text-zinc-400 outline-hidden transition-all duration-200 tracking-[0.08em]",
                                !collapsed && "cursor-pointer hover:text-zinc-600"
                            )}
                        >
                            <span>{collapsed ? "•••" : section.label}</span>
                            {!collapsed && (
                                <ChevronDown
                                    className={cn(
                                        "ml-auto h-3 w-3 transition-transform duration-200 opacity-40",
                                        !openState[section.key] && "-rotate-90"
                                    )}
                                />
                            )}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <div
                                className={cn(
                                    "overflow-hidden transition-all duration-300 ease-in-out",
                                    collapsed || openState[section.key] ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                                )}
                            >
                                <SidebarMenu className="gap-0.5">
                                    {section.items.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={'isActive' in item && item.isActive}
                                                tooltip={item.title}
                                                className={cn(
                                                    "h-9 text-[13px] px-2 py-2 font-medium transition-all duration-150 rounded-lg group/item",
                                                    'isActive' in item && item.isActive
                                                        ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                                                        : "text-black hover:bg-zinc-100/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-50"
                                                )}
                                            >
                                                <a href={item.url} className="flex items-center justify-between w-full">
                                                    <div className="flex items-center gap-2">
                                                        <item.icon className={cn(
                                                            "h-4 w-4 shrink-0 transition-colors opacity-60",
                                                            'isActive' in item && item.isActive ? "opacity-100 text-zinc-950" : "group-hover/item:opacity-100 group-hover/item:text-zinc-950"
                                                        )} />
                                                        {!collapsed && <span className="tracking-tight">{item.title}</span>}
                                                    </div>
                                                    {!collapsed && item.hasChildren && (
                                                        <ChevronRight className="h-3.5 w-3.5 text-zinc-400 opacity-60" />
                                                    )}
                                                </a>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </div>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter className="p-0 h-0 border-none" />
        </Sidebar>
    )
}
