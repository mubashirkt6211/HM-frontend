import { motion } from "motion/react";

import {
    SquaresFour, FileText, Gear, Question, Bell, Package, ChatTeardropText, Users,
    CaretDown, CreditCard, CalendarBlank,
    Stethoscope, Flask, Pill, FirstAid, Hospital, Bed, Ambulance, Drop, Receipt, ShieldCheck, TrendDown, Warehouse, Truck, ClipboardText, FirstAidKit
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
    SidebarFooter,
    useSidebar
} from "@/components/ui/sidebar"

import { cn } from "@/lib/utils"

const navigationSections = [
    {
        label: "Core",
        items: [
            { icon: SquaresFour, title: "Dashboard", pageId: "dashboard" },
            { icon: Users, title: "Patients", pageId: "patients" },
            { icon: Stethoscope, title: "Doctors & Staff", pageId: "doctors" },
            { icon: CalendarBlank, title: "Appointments", pageId: "appointments" },
        ]
    },
    {
        label: "Clinical",
        items: [
            { icon: FirstAid, title: "OPD (Outpatient)", pageId: "opd" },
            { icon: Hospital, title: "IPD (Inpatient)", pageId: "ipd" },
            { icon: Flask, title: "Laboratory", pageId: "lab" },
            { icon: ClipboardText, title: "Radiology", pageId: "radiology" },
            { icon: Pill, title: "Pharmacy", pageId: "pharmacy" },
            { icon: Receipt, title: "Prescriptions", pageId: "prescriptions" },
        ]
    },
    {
        label: "Hospital Services",
        items: [
            { icon: Bed, title: "Ward / Bed Management", pageId: "wards" },
            { icon: FirstAidKit, title: "Operation Theatre (OT)", pageId: "ot" },
            { icon: Ambulance, title: "Ambulance", pageId: "ambulance" },
            { icon: Drop, title: "Blood Bank", pageId: "bloodbank" },
        ]
    },
    {
        label: "Finance",
        items: [
            { icon: Receipt, title: "Billing & Invoices", pageId: "billing" },
            { icon: CreditCard, title: "Payments", pageId: "payments" },
            { icon: ShieldCheck, title: "Insurance / Claims", pageId: "insurance" },
            { icon: TrendDown, title: "Expenses", pageId: "expenses" },
        ]
    },
    {
        label: "Inventory",
        items: [
            { icon: Warehouse, title: "Inventory / Stock", pageId: "inventory" },
            { icon: Truck, title: "Suppliers", pageId: "suppliers" },
            { icon: ClipboardText, title: "Purchase Orders", pageId: "purchases" },
        ]
    },
    {
        label: "Reports",
        items: [
            { icon: FileText, title: "Reports", pageId: "reports" },
            { icon: SquaresFour, title: "Analytics", pageId: "analytics" },
        ]
    },
    {
        label: "System",
        items: [
            { icon: CalendarBlank, title: "Calendar", pageId: "calendar" },
            { icon: Bell, title: "Notifications", pageId: "notifications" },
        ]
    },
    {
        label: "Support",
        items: [
            { icon: Question, title: "Help Center", pageId: "help" },
            { icon: ChatTeardropText, title: "Feedback", pageId: "feedback" },
            { icon: Gear, title: "Settings", pageId: "settings" },
        ]
    }
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
                <SidebarHeader className="p-6 pb-4 border-none bg-transparent flex flex-col items-start sticky top-0 z-10">
                    <div className={cn(
                        "flex items-center w-full",
                        isCollapsed ? "justify-center" : "justify-between"
                    )}>
                        <motion.div
                            className="flex items-center gap-3 group cursor-pointer"
                            onClick={() => onPageChange?.("dashboard")}
                        >
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                                <Stethoscope className="w-5 h-5 text-white" />
                            </div>
                            {!isCollapsed && (
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-none">Coconut</span>
                                    <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-wider">HMS Dashboard</span>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </SidebarHeader>

                {/* CONTENT */}
                <SidebarContent className="px-4 py-2 bg-transparent flex-1 overflow-y-auto no-scrollbar">

                    {/* NAVIGATION SECTIONS */}
                    {navigationSections.map((section, idx) => (
                        <SidebarGroup key={section.label} className={cn("p-0", idx > 0 && "mt-2 pt-2 border-t border-zinc-100/50 dark:border-zinc-800/50")}>
                            {!isCollapsed && (
                                <div className="text-[12px] font-semibold text-zinc-400 dark:text-zinc-500 px-3 py-2 mb-1">
                                    {section.label}
                                </div>
                            )}
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {section.items.map((item) => (
                                        <NavItem
                                            key={item.title}
                                            icon={item.icon}
                                            title={item.title}
                                            isCollapsed={isCollapsed}
                                            isActive={item.pageId ? currentPage === item.pageId : false}
                                            onClick={item.pageId ? () => onPageChange?.(item.pageId) : undefined}
                                        />
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ))}

                </SidebarContent>

                {/* FOOTER */}
                <SidebarFooter className="p-3 border-none bg-transparent border-t border-zinc-100/50 dark:border-zinc-800/50 mt-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                        className="space-y-4"
                    >

                        <SidebarMenu className="gap-0.5 pt-2">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.65, staggerChildren: 0.05 }}
                                className="flex flex-col gap-0.5"
                            >
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <NavItem icon={Question} title="Get help" isCollapsed={isCollapsed} />
                                </motion.div>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <NavItem icon={Gear} title="Settings" isCollapsed={isCollapsed} />
                                </motion.div>
                            </motion.div>
                        </SidebarMenu>
                    </motion.div>
                </SidebarFooter>

            </div>
        </Sidebar>
    )
}

function NavItem({
    icon: Icon,
    title,
    isActive,
    isSubitem,
    isCollapsed,
    iconClassName,
    textClassName,
    className,
    onClick
}: {
    icon?: React.ElementType
    title: string
    isActive?: boolean
    isSubitem?: boolean
    isCollapsed?: boolean
    iconClassName?: string
    textClassName?: string
    className?: string
    onClick?: () => void
}) {
    return (
        <SidebarMenuItem className={className}>
            <SidebarMenuButton
                asChild={!onClick}
                tooltip={title}
                isActive={isActive}
                onClick={onClick}
                className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-[15px] transition-colors relative group cursor-pointer h-10",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    isActive
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium"
                        : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100",
                    isSubitem ? "pl-10 text-[14px]" : "",
                    isCollapsed && "justify-center px-0"
                )}
            >
                <div
                    className={cn(
                        "flex items-center gap-3 w-full",
                        isCollapsed ? "justify-center" : ""
                    )}
                >
                    {Icon && (
                        <Icon
                            weight="light"
                            className={cn(
                                "w-5 h-5 shrink-0 transition-all duration-300",
                                isActive ? "text-blue-600 dark:text-blue-400" : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300",
                                iconClassName
                            )}
                        />
                    )}
                    {!isCollapsed && (
                        <span className={cn(
                            "truncate transition-colors",
                            textClassName
                        )}>
                            {title}
                        </span>
                    )}
                </div>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}