import { motion } from "motion/react";
import * as React from "react";
import {
    LayoutDashboard, Bell, CheckSquare, StickyNote, Mail, BarChart3,
    Sparkles, Workflow, Star, Users, UserSquare, Search, Command,
    icons,
    Calendar
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from "@/components/ui/sidebar"

import { cn } from "@/lib/utils"

const mainNavigation = [
    { icon: LayoutDashboard, title: "Dashboard", pageId: "dashboard" },
    { icon: Bell, title: "Notifications", pageId: "notifications", badge: "12" },
    { icon: Calendar, title: "Calender", pageId: "calender" },
    { icon: CheckSquare, title: "Tasks", pageId: "tasks" },
    { icon: StickyNote, title: "Notes", pageId: "notes" },
    { icon: Mail, title: "Emails", pageId: "emails" },
    { icon: BarChart3, title: "Reports", pageId: "reports" },
    { icon: Sparkles, title: "Automations", pageId: "automations" },
    { icon: Workflow, title: "Workflows", pageId: "workflows" },
];

const favoritesNavigation = [
    { icon: Star, title: "UK & EU Companies", pageId: "uk-eu-companies", iconColor: "text-orange-400" },
    { icon: Star, title: "B2B Relationship Building", pageId: "b2b-building", iconColor: "text-orange-400" },
    { icon: Star, title: "Potential Partnership", pageId: "partnership", iconColor: "text-orange-400" },
    { icon: Star, title: "CRM Meeting Template", pageId: "crm-template", iconColor: "text-orange-400" },
];

const recordsNavigation = [
    { icon: Users, title: "Clients", pageId: "clients" },
    { icon: UserSquare, title: "Contacts", pageId: "contacts" },
];

const listNavigation = [
    { icon: Star, title: "sales-navigator", pageId: "sales-navigator", iconColor: "text-pink-500", iconFill: true },
    { icon: Star, title: "emails-marketing-agency", pageId: "emails-marketing-agency", iconColor: "text-pink-500", iconFill: true },
];

export function AppSidebar({ currentPage = "dashboard", onPageChange }: { currentPage?: string; onPageChange?: (page: string) => void }) {
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";

    return (
        <Sidebar
            variant="sidebar"
            collapsible="icon"
            className="border-none bg-transparent w-72"
        >
            <div className="h-full flex flex-col">

                {/* HEADER (Logo) */}
                <SidebarHeader className="p-6 pb-2 border-none flex flex-col items-start gap-4 sticky top-0 z-10 bg-[#f6f6f6]/80 dark:bg-zinc-900/80 backdrop-blur-md">
                    <div className={cn(
                        "flex items-center w-full",
                        isCollapsed ? "justify-center" : "justify-between"
                    )}>
                        <motion.div
                            className="flex items-center gap-2.5 group cursor-pointer"
                            onClick={() => onPageChange?.("dashboard")}
                        >
                            <div className="w-7 h-7 rounded-md bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center shrink-0">
                                <Sparkles className="w-4 h-4 text-white dark:text-zinc-900" />
                            </div>
                            {!isCollapsed && (
                                <span className="text-[17px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Leadwave</span>
                            )}
                        </motion.div>
                    </div>

                    {!isCollapsed && (
                        <div className="w-full relative group">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search anything"
                                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-1.5 pl-9 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-700 transition-all"
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-[10px] font-medium text-zinc-400 shadow-sm">
                                <Command className="w-2.5 h-2.5" />
                                <span>K</span>
                            </div>
                        </div>
                    )}
                </SidebarHeader>

                {/* CONTENT */}
                <SidebarContent className="px-4 py-2 flex-1 overflow-y-auto no-scrollbar">

                    {/* MAIN NAVIGATION */}
                    <SidebarGroup className="p-0">
                        <SidebarGroupContent>
                            <SidebarMenu className="gap-0.5">
                                {mainNavigation.map((item) => (
                                    <NavItem
                                        key={item.title}
                                        icon={item.icon}
                                        title={item.title}
                                        isCollapsed={isCollapsed}
                                        isActive={item.pageId ? currentPage === item.pageId : false}
                                        onClick={item.pageId ? () => onPageChange?.(item.pageId) : undefined}
                                        badge={item.badge}
                                    />
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    {/* FAVORITES */}
                    {!isCollapsed && (
                        <SidebarGroup className="p-0 mt-6">
                            <div className="flex items-center justify-between px-3 mb-2">
                                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                                    <motion.span>Favorites</motion.span>
                                </div>
                            </div>
                            <SidebarGroupContent>
                                <SidebarMenu className="gap-0.5">
                                    {favoritesNavigation.map((item) => (
                                        <NavItem
                                            key={item.title}
                                            icon={item.icon}
                                            iconColor={item.iconColor}
                                            title={item.title}
                                            isCollapsed={isCollapsed}
                                            isActive={currentPage === item.pageId}
                                            onClick={() => onPageChange?.(item.pageId)}
                                        />
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    )}

                    {/* RECORDS */}
                    {!isCollapsed && (
                        <SidebarGroup className="p-0 mt-6">
                            <div className="flex items-center justify-between px-3 mb-2">
                                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                                    <motion.span>Records</motion.span>
                                </div>
                            </div>
                            <SidebarGroupContent>
                                <SidebarMenu className="gap-0.5">
                                    {recordsNavigation.map((item) => (
                                        <NavItem
                                            key={item.title}
                                            icon={item.icon}
                                            title={item.title}
                                            isCollapsed={isCollapsed}
                                            isActive={currentPage === item.pageId}
                                            onClick={() => onPageChange?.(item.pageId)}
                                        />
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    )}

                    {/* LIST */}
                    {!isCollapsed && (
                        <SidebarGroup className="p-0 mt-6">
                            <div className="flex items-center justify-between px-3 mb-2">
                                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                                    <motion.span>List</motion.span>
                                </div>
                            </div>
                            <SidebarGroupContent>
                                <SidebarMenu className="gap-0.5">
                                    {listNavigation.map((item) => (
                                        <NavItem
                                            key={item.title}
                                            icon={item.icon}
                                            iconColor={item.iconColor}
                                            iconFill={item.iconFill}
                                            title={item.title}
                                            isCollapsed={isCollapsed}
                                            isActive={currentPage === item.pageId}
                                            onClick={() => onPageChange?.(item.pageId)}
                                        />
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    )}

                </SidebarContent>

            </div>
        </Sidebar>
    )
}

function NavItem({
    icon: Icon,
    title,
    isActive,
    isCollapsed,
    iconColor,
    iconFill,
    badge,
    onClick
}: {
    icon?: React.ElementType
    title: string
    isActive?: boolean
    isCollapsed?: boolean
    iconColor?: string
    iconFill?: boolean
    badge?: string
    onClick?: () => void
}) {
    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild={!onClick}
                tooltip={title}
                isActive={isActive}
                onClick={onClick}
                className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm transition-all relative group cursor-pointer h-9 mb-0.5",
                    isActive
                        ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold"
                        : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200",
                    isCollapsed && "justify-center px-0"
                )}
            >
                <div
                    className={cn(
                        "flex items-center gap-2.5 w-full",
                        isCollapsed ? "justify-center" : ""
                    )}
                >
                    {Icon && (
                        <Icon
                            className={cn(
                                "w-[18px] h-[18px] shrink-0 transition-all",
                                isActive ? "text-zinc-900 dark:text-zinc-100" : (iconColor || "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"),
                                iconFill && "fill-current"
                            )}
                        />
                    )}
                    {!isCollapsed && (
                        <span className="truncate flex-1 tracking-tight">
                            {title}
                        </span>
                    )}
                    {!isCollapsed && badge && (
                        <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-full shadow-xs">
                            {badge}
                        </span>
                    )}
                </div>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}
