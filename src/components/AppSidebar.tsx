import { motion } from "motion/react";
import logo from "@/assets/logo.png";

import { 
    LayoutGrid, FileText, Settings, HelpCircle, Bell, Package, TrendingUp, MessageSquare, Users, 
    Zap, FolderOpen, Lock, Smile, ChevronDown, CreditCard, Link as IntegrationIcon
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
    SidebarFooter,
    useSidebar
} from "@/components/ui/sidebar"

import { cn } from "@/lib/utils"

const navigationSections = [
    {
        label: "Main",
        items: [
            { icon: LayoutGrid, title: "Dashboard" },
            { icon: Package, title: "Products" },
            { icon: TrendingUp, title: "Transactions" },
            { icon: FileText, title: "Reports & Analytics" },
            { icon: MessageSquare, title: "Message" },
            { icon: Users, title: "Team Performance" },
            { icon: Zap, title: "Campaigns" },
            { icon: Smile, title: "Customers" },
            { icon: FolderOpen, title: "Channels" },
            { icon: CreditCard, title: "Order Management" },
        ]
    },
    {
        label: "Administration",
        items: [
            { icon: Lock, title: "Roles & Permissions" },
            { icon: CreditCard, title: "Billing & Subscription" },
            { icon: IntegrationIcon, title: "Integrations" },
        ]
    },
    {
        label: "Support",
        items: [
            { icon: HelpCircle, title: "Help Center" },
            { icon: MessageSquare, title: "Feedback" },
            { icon: Settings, title: "Settings" },
        ]
    }
];

export function AppSidebar() {
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";


    return (
        <Sidebar
            variant="sidebar"
            collapsible="icon"
            className="border-none bg-transparent w-65"
        >
            <div className="h-full flex flex-col">

                {/* HEADER (Logo + Bell) */}
                <SidebarHeader className="p-4 py-5 border-none bg-transparent flex flex-col items-center sticky top-0 z-10">
                    <div className={cn(
                        "flex items-center w-full",
                        isCollapsed ? "justify-center" : "justify-between"
                    )}>
                        <motion.div 
                            className="flex items-center gap-2 group"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        >
                            <img src={logo} alt="Coconut Logo" className={cn(
                                "object-contain transition-all group-hover:drop-shadow-lg",
                                isCollapsed ? "w-10 h-10" : "w-12 h-12"
                            )} />
                        </motion.div>
                        {!isCollapsed && (
                            <motion.div 
                                className="flex items-center gap-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <motion.button 
                                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors relative p-1.5 rounded-lg hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Bell className="w-5 h-5" />
                                    <motion.span 
                                        className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 border-2 border-white dark:border-zinc-900"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </motion.button>
                            </motion.div>
                        )}
                    </div>
                </SidebarHeader>

                {/* CONTENT */}
                <SidebarContent className="p-3 pt-0 bg-transparent flex-1 overflow-y-auto no-scrollbar">

                    {/* NAVIGATION SECTIONS */}
                    {navigationSections.map((section, idx) => (
                        <SidebarGroup key={section.label} className={cn("p-0", idx > 0 && "mt-8 pt-8 border-t border-zinc-100/50 dark:border-zinc-800/50")}>
                            {!isCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * idx }}
                                    className="text-[11px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest px-3 mb-3 opacity-60"
                                >
                                    {section.label}
                                </motion.div>
                            )}
                            <SidebarGroupContent>
                                <motion.div
                                    variants={{
                                        hidden: { opacity: 0 },
                                        show: {
                                            opacity: 1,
                                            transition: {
                                                staggerChildren: 0.04,
                                                delayChildren: 0.05 * idx
                                            }
                                        }
                                    }}
                                    initial="hidden"
                                    animate="show"
                                    className="gap-1 flex flex-col"
                                >
                                    {section.items.map((item) => (
                                        <motion.div
                                            key={item.title}
                                            variants={{
                                                hidden: { opacity: 0, x: -10 },
                                                show: { opacity: 1, x: 0 }
                                            }}
                                        >
                                            <NavItem icon={item.icon} title={item.title} isCollapsed={isCollapsed} />
                                        </motion.div>
                                    ))}
                                </motion.div>
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
                        <SidebarMenu className="gap-1">
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    className={cn(
                                        "flex items-center gap-3 rounded-xl p-2 text-left h-auto transition-all focus:ring-2 focus:ring-blue-500/20",
                                        "hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 relative group"
                                    )}
                                >
                                    <motion.div 
                                        className="w-8 h-8 rounded-md bg-linear-to-br from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center shrink-0"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <Smile className="w-5 h-5 text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors" />
                                    </motion.div>
                                    {!isCollapsed && (
                                        <motion.div 
                                            className="flex flex-col overflow-hidden flex-1"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.6 }}
                                        >
                                            <span className="text-[14px] font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                                                Avdey Design Inc.
                                            </span>
                                            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                                                alex@avdey.design
                                            </span>
                                        </motion.div>
                                    )}
                                    {!isCollapsed && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.7 }}
                                        >
                                            <ChevronDown className="w-4 h-4 text-zinc-400 ml-auto shrink-0 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
                                        </motion.div>
                                    )}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>

                        <SidebarMenu className="gap-0.5 pt-2">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.65, staggerChildren: 0.05 }}
                                className="flex flex-col gap-0.5"
                            >
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <NavItem icon={HelpCircle} title="Get help" isCollapsed={isCollapsed} />
                                </motion.div>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <NavItem icon={Settings} title="Settings" isCollapsed={isCollapsed} />
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
    className
}: {
    icon?: React.ElementType
    title: string
    isActive?: boolean
    isSubitem?: boolean
    isCollapsed?: boolean
    iconClassName?: string
    textClassName?: string
    className?: string
}) {
    return (
        <SidebarMenuItem className={className}>
            <SidebarMenuButton
                asChild
                tooltip={title}
                isActive={isActive}
                className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] transition-all relative overflow-hidden group",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                    isActive
                        ? "bg-zinc-100/80 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold shadow-sm"
                        : "text-zinc-600 hover:bg-zinc-100/60 dark:text-zinc-400 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100",
                    isSubitem ? "h-8 px-2 gap-2 text-[12px] ml-1" : "h-9",
                    isCollapsed && "justify-center px-0"
                )}
            >
                <motion.div
                    className={cn(
                        "flex items-center gap-3 relative w-full",
                        isCollapsed ? "justify-center" : ""
                    )}
                    whileHover={{ x: isCollapsed ? 0 : 2 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                    {/* Left border indicator for active state */}
                    {isActive && !isSubitem && (
                        <motion.div
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-zinc-900 dark:bg-zinc-100"
                            layoutId="activeIndicator"
                            transition={{ type: "spring", bounce: 0.2 }}
                        />
                    )}

                    {Icon ? (
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <Icon
                                className={cn(
                                    "w-4 h-4 shrink-0 transition-colors duration-200",
                                    isSubitem && "w-3.5 h-3.5",
                                    isActive && !isSubitem && "text-zinc-900 dark:text-zinc-100",
                                    isSubitem && isActive && "text-blue-600 dark:text-blue-400",
                                    iconClassName
                                )}
                            />
                        </motion.div>
                    ) : (
                        <div className={cn("w-4 h-4 shrink-0", isSubitem && "w-3.5 h-3.5")} />
                    )}
                    {!isCollapsed && (
                        <span className={cn(
                            "truncate transition-all duration-200 font-medium",
                            isActive ? "opacity-100" : "opacity-90 group-hover:opacity-100",
                            textClassName
                        )}>
                            {title}
                        </span>
                    )}
                </motion.div>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}