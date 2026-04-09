import { motion } from "motion/react";
import * as React from "react";
import {
    House, CheckSquare, FileText, Envelope, ChartBar,
    Sparkle, TreeStructure, Star, Users, UserFocus, MagnifyingGlass, Command,
    CaretDown, User, CalendarCheck, Chats, ListChecks, CurrencyEur, Scales, UsersThree,
    StethoscopeIcon,
    CashRegisterIcon
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
import { Syringe, User2Icon } from "lucide-react";

import { UserRole } from "@/models/user";

interface NavItemConfig {
    icon?: React.ElementType;
    title: string;
    pageId?: string;
    badge?: string;
    iconColor?: string;
    iconFill?: boolean;
    roles?: UserRole[];
    subItems?: { title: string; pageId: string; icon?: React.ElementType; roles?: UserRole[] }[];
}

const mainNavigation: NavItemConfig[] = [
    {
        icon: House,
        title: "Dashboard",
        pageId: "dashboard",
        subItems: [
            { title: "Overview", pageId: "dashboard", icon: Scales },
            { title: "Patient", pageId: "patients", icon: User, roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST] },
            { title: "Revenue", pageId: "revenue", icon: CurrencyEur, roles: [UserRole.ADMIN, UserRole.MANAGER] },
        ]
    },
    { icon: Chats, title: "Messages", pageId: "messages", badge: "12" },
    { icon: CalendarCheck, title: "Calender", pageId: "calender" },
    { icon: UserFocus, title: "Privileges", pageId: "privillage", badge: "4" },
    { icon: ListChecks, title: "Tasks", pageId: "tasks" },
    {
        icon: UsersThree, title: "Team", pageId: "team",
        roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.DOCTOR, UserRole.RECEPTIONIST],
        subItems: [
            { title: "Doctors", pageId: "doctors", icon: StethoscopeIcon },
            { title: "Nurse", pageId: "nurse", icon: Syringe, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.DOCTOR] },
            { title: "Receptionist", pageId: "receptionist", icon: CashRegisterIcon, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.RECEPTIONIST] },
        ]
    },
    { icon: FileText, title: "Notes", pageId: "notes" },
    { icon: Envelope, title: "Emails", pageId: "emails", roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.RECEPTIONIST] },
    { icon: ChartBar, title: "Reports", pageId: "reports", roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.DOCTOR] },
    { icon: Sparkle, title: "Automations", pageId: "automations", roles: [UserRole.ADMIN] },
    { icon: TreeStructure, title: "Workflows", pageId: "workflows", roles: [UserRole.ADMIN] },
];

// const favoritesNavigation: NavItemConfig[] = [
//     { icon: Star, title: "UK & EU Companies", pageId: "uk-eu-companies", iconColor: "text-orange-400", roles: [UserRole.ADMIN, UserRole.MANAGER] },
//     { icon: Star, title: "B2B Relationship Building", pageId: "b2b-building", iconColor: "text-orange-400", roles: [UserRole.ADMIN, UserRole.MANAGER] },
//     { icon: Star, title: "Potential Partnership", pageId: "partnership", iconColor: "text-orange-400", roles: [UserRole.ADMIN, UserRole.MANAGER] },
//     { icon: Star, title: "CRM Meeting Template", pageId: "crm-template", iconColor: "text-orange-400", roles: [UserRole.ADMIN, UserRole.MANAGER] },
// ];

const recordsNavigation: NavItemConfig[] = [
    { icon: Users, title: "Clients", pageId: "clients", roles: [UserRole.ADMIN, UserRole.MANAGER] },
    { icon: UserFocus, title: "Contacts", pageId: "contacts", roles: [UserRole.ADMIN, UserRole.MANAGER] },
];

// const listNavigation: NavItemConfig[] = [
//     { icon: Star, title: "sales-navigator", pageId: "sales-navigator", iconColor: "text-pink-500", iconFill: true, roles: [UserRole.ADMIN] },
//     { icon: Star, title: "emails-marketing-agency", pageId: "emails-marketing-agency", iconColor: "text-pink-500", iconFill: true, roles: [UserRole.ADMIN] },
// ];

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

    const filteredMainNavigation = filterByRole(mainNavigation);
    // const filteredFavoritesNavigation = filterByRole(favoritesNavigation);
    const filteredRecordsNavigation = filterByRole(recordsNavigation);
    // const filteredListNavigation = filterByRole(listNavigation);

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
                            <img src={logog} alt="HMS Logo" className="w-12 h-12 object-contain shrink-0" />
                            {!isCollapsed && (
                                <span className="text-[17px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Leadwave</span>
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

                    {/* MAIN NAVIGATION */}
                    <SidebarGroup className="p-0">
                        <SidebarGroupContent>
                            <SidebarMenu className="gap-0.5">
                                {filteredMainNavigation.map((item) => (
                                    <NavItem
                                        key={item.title}

                                        icon={item.icon}
                                        title={item.title}
                                        isCollapsed={isCollapsed}
                                        isActive={item.pageId ? (currentPage === item.pageId || (item.subItems?.some(s => s.pageId === currentPage))) : false}
                                        onClick={item.pageId && !item.subItems ? () => onPageChange?.(item.pageId) : undefined}
                                        badge={item.badge}
                                        subItems={item.subItems}
                                        currentPage={currentPage}
                                        onPageChange={onPageChange}
                                    />
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    {/* FAVORITES */}
                    {/* {!isCollapsed && (
                        <SidebarGroup className="p-0 mt-6">
                            <div className="flex items-center justify-between px-3 mb-2">
                                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                                    <motion.span>Favorites</motion.span>
                                </div>
                            </div>
                            <SidebarGroupContent>
                                <SidebarMenu className="gap-0.5">
                                    {filteredFavoritesNavigation.map((item) => (
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
                    )} */}

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
                                    {filteredRecordsNavigation.map((item) => (
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
                    {/* {!isCollapsed && (
                        <SidebarGroup className="p-0 mt-6">
                            <div className="flex items-center justify-between px-3 mb-2">
                                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                                    <motion.span>List</motion.span>
                                </div>
                            </div>
                            <SidebarGroupContent>
                                <SidebarMenu className="gap-0.5">
                                    {filteredListNavigation.map((item) => (
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
                    )} */}

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
    subItems?: { title: string; pageId: string; icon?: React.ElementType }[]
    currentPage?: string
    onPageChange?: (page: string) => void
}) {
    const [isOpen, setIsOpen] = React.useState(false);


    const hasSubItems = subItems && subItems.length > 0;

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild={!onClick && !hasSubItems}
                tooltip={title}
                isActive={isActive && !hasSubItems}
                onClick={hasSubItems ? () => setIsOpen(!isOpen) : onClick}
                className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm transition-all relative group cursor-pointer h-9 mb-0.5",
                    isActive && !hasSubItems
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
