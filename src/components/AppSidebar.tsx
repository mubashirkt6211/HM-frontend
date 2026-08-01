import { motion } from "motion/react";
import * as React from "react";
import {
    MagnifyingGlass,
    Command,
    CaretDown,
} from "@phosphor-icons/react";

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
import logog from "@/assets/logog.png"

import { sidebarNavigationSections, type NavItemConfig, type NavSubItemConfig } from "@/config/navigation";
import { UserRole } from "@/models/user";

export function AppSidebar({
    currentPage = "dashboard",
    onPageChange,
    userRole = UserRole.ADMIN
}: {
    currentPage?: string;
    onPageChange?: (page: string) => void;
    userRole?: UserRole;
}) {
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";

    const filterByRole = (items: NavItemConfig[]) => {
        return items.filter(item => {
            if (item.roles && !item.roles.includes(userRole)) return false;
            return true;
        }).map(item => ({
            ...item,
            subItems: item.subItems?.filter(sub => !sub.roles || sub.roles.includes(userRole))
        }));
    };

    const filteredNavigationSections = sidebarNavigationSections
        .map((section) => ({
            ...section,
            items: filterByRole(section.items),
        }))
        .filter((section) => section.items.length > 0);

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
                            <img src={logog} alt="CRM Logo" className="w-12 h-12 object-contain shrink-0" />
                            {!isCollapsed && (
                                <span className="text-[17px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Leadwave CRM</span>
                            )}
                        </motion.div>
                    </div>

                    {!isCollapsed && (
                        <div className="w-full relative group">
                            <MagnifyingGlass className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
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
                    {filteredNavigationSections.map((section, sectionIndex) => {
                        if (isCollapsed && section.title) return null;

                        return (
                            <SidebarGroup
                                key={section.title ?? "main"}
                                className={cn("p-0", sectionIndex > 0 && "mt-6")}
                            >
                                {section.title && (
                                    <div className="flex items-center justify-between px-3 mb-2">
                                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                                            <motion.span>{section.title}</motion.span>
                                        </div>
                                    </div>
                                )}
                                <SidebarGroupContent>
                                    <SidebarMenu className="gap-0.5">
                                        {section.items.map((item) => (
                                            <NavItem
                                                key={`${section.title ?? "main"}-${item.title}`}
                                                icon={item.icon}
                                                iconColor={item.iconColor}
                                                iconFill={item.iconFill}
                                                title={item.title}
                                                isCollapsed={isCollapsed}
                                                isActive={item.pageId ? (currentPage === item.pageId || (item.subItems?.some(s => s.pageId === currentPage))) : false}
                                                onClick={item.pageId ? () => onPageChange?.(item.pageId as string) : undefined}
                                                badge={item.badge}
                                                subItems={item.subItems}
                                                currentPage={currentPage}
                                                onPageChange={onPageChange}
                                            />
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        );
                    })}

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
    onClick,
    subItems,
    currentPage,
    onPageChange
}: {
    icon?: React.ElementType
    title: string
    isActive?: boolean
    isCollapsed?: boolean
    iconColor?: string
    iconFill?: boolean
    badge?: string
    onClick?: () => void
    subItems?: NavSubItemConfig[]
    currentPage?: string
    onPageChange?: (page: string) => void
}) {
    const hasSubItems = subItems && subItems.length > 0;
    const hasActiveSubItem = !!subItems?.some((sub) => sub.pageId === currentPage);
    const [isOpen, setIsOpen] = React.useState(hasActiveSubItem);

    React.useEffect(() => {
        if (hasActiveSubItem) {
            setIsOpen(true);
        }
    }, [hasActiveSubItem]);

    const handleClick = () => {
        if (hasSubItems) {
            setIsOpen((open) => !open);
        }
        onClick?.();
    };

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild={!onClick && !hasSubItems}
                tooltip={title}
                isActive={isActive}
                onClick={handleClick}
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
                    {!isCollapsed && hasSubItems && (
                        <CaretDown className={cn(
                            "w-3.5 h-3.5 text-zinc-400 transition-transform duration-200",
                            isOpen && "rotate-180"
                        )} />
                    )}
                </div>
            </SidebarMenuButton>

            {!isCollapsed && hasSubItems && isOpen && (
                <div className="ml-7 mt-0.5 mb-1 flex flex-col gap-0.5 border-l border-zinc-200 dark:border-zinc-800">
                    {subItems.map((sub) => (
                        <button
                            key={sub.pageId}
                            onClick={() => onPageChange?.(sub.pageId)}
                            className={cn(
                                "flex items-center gap-2.5 px-3.5 py-1.5 text-[13px] rounded-r-lg transition-all text-left",
                                currentPage === sub.pageId
                                    ? "text-zinc-900 dark:text-zinc-100 font-medium bg-zinc-100/50 dark:bg-zinc-800/50"
                                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                            )}
                        >
                            {sub.icon && (
                                <sub.icon className={cn(
                                    "w-3.5 h-3.5 shrink-0 transition-colors",
                                    currentPage === sub.pageId ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                                )} />
                            )}
                            <span className="truncate flex-1 tracking-tight">
                                {sub.title}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </SidebarMenuItem>
    )
}
