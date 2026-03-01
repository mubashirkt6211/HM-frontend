import logo from "@/assets/logo-black.svg"
import {
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
            { title: "Daily Orders", url: "#", icon: Calendar1Icon }
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

    return (
        <Sidebar
            variant="sidebar"
            collapsible="icon"
            className="border-r border-zinc-200/50 bg-white dark:border-zinc-800/50 dark:bg-[#09090b]"
        >
            <SidebarHeader className="p-4 pb-2 border-b border-transparent">
                <div className="flex items-center justify-between relative">
                    <a href="/" className="inline-flex items-center gap-2.5 overflow-hidden">
                        <img src={logo} alt="Kokonut UI" className="h-6 w-6 shrink-0 hidden dark:block" />
                        <img src={logo} alt="Kokonut UI" className="h-6 w-6 shrink-0 block dark:hidden" />
                        {!collapsed && (
                            <div className="flex items-center transition-all duration-200">
                                <span className="font-bold text-[18px] tracking-tight text-zinc-950 dark:text-zinc-50">KokonutUI</span>
                                <span className="ml-1.5 inline-flex h-[18px] items-center justify-center rounded-md bg-black px-1.5 font-medium text-[10px] text-white uppercase tracking-wider dark:bg-white dark:text-black">Pro</span>
                            </div>
                        )}
                    </a>
                </div>
            </SidebarHeader>

            <SidebarContent className="p-4 pt-0">
                {!collapsed && (
                    <div className="lg:hidden mb-4 mt-2">
                        <div className="flex justify-start">
                            <div>
                                <a className="inline-block rounded-lg bg-black px-3 py-2 text-center font-medium text-sm text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200" href="#">
                                    $30 off with code <span className="font-bold">WINTER30</span>
                                </a>
                            </div>
                        </div>
                    </div>
                )}
                {sidebarData.map((section, index) => (
                    <SidebarGroup key={section.key} className="p-0">
                        <SidebarGroupLabel
                            className={cn(
                                "flex h-auto shrink-0 items-center px-2 mb-1.5 text-sm font-normal text-zinc-500 dark:text-zinc-400 outline-hidden transition-all duration-200",
                                index > 0 && "mt-6"
                            )}
                        >
                            <span>{collapsed ? "•••" : section.label}</span>
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu className="gap-0">
                                {section.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={'isActive' in item && item.isActive}
                                            tooltip={item.title}
                                            className={cn(
                                                "relative flex flex-row items-center gap-2 rounded-lg p-2 ps-4 text-start overflow-wrap-anywhere transition-colors hover:transition-none h-auto",
                                                'isActive' in item && item.isActive
                                                    ? "bg-zinc-100/50 text-zinc-900 dark:bg-zinc-800/40 dark:text-zinc-100 font-medium"
                                                    : "text-zinc-500 hover:bg-zinc-100/50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/40 dark:hover:text-zinc-100 hover:opacity-80 font-normal"
                                            )}
                                        >
                                            <a href={item.url} className="flex items-center justify-between w-full">
                                                <div className="flex items-center gap-2">
                                                    <item.icon className="h-4 w-4 shrink-0 transition-colors" />
                                                    {!collapsed && <span className="tracking-tight">{item.title}</span>}
                                                </div>
                                                {!collapsed && item.hasChildren && (
                                                    <ChevronRight className="h-4 w-4 shrink-0 transition-transform -rotate-90 opacity-50" />
                                                )}
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter className="p-0 h-0 border-none" />
        </Sidebar>
    )
}
