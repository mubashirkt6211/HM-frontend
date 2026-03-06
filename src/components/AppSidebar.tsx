import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import logo from "@/assets/logo.png";

import { ChevronDown, LayoutGrid, Heart, CreditCard, Clock, Smile, Link2, ArrowRightLeft, FileText, Settings, HelpCircle, Bell } from "lucide-react";

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

export function AppSidebar() {
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";


    const [paymentsOpen, setPaymentsOpen] = useState(true);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        show: { opacity: 1, x: 0 }
    };


    return (
        <Sidebar
            variant="sidebar"
            collapsible="icon"
            className="border-none bg-transparent w-[260px]"
        >
            <div className="h-full flex flex-col">

                {/* HEADER (Logo + Bell) */}
                <SidebarHeader className="p-4 py-5 border-none bg-transparent flex flex-col items-center">
                    <div className={cn(
                        "flex items-center w-full",
                        isCollapsed ? "justify-center" : "justify-between"
                    )}>
                        <div className="flex items-center gap-2">
                            <img src={logo} alt="Coconut Logo" className={cn(
                                "object-contain transition-all",
                                isCollapsed ? "w-10 h-10" : "w-12 h-12"
                            )} />
                        </div>
                        {!isCollapsed && (
                            <div className="flex items-center gap-2">
                                <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors relative">
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-rose-500 border-2 border-white dark:border-zinc-900"></span>
                                </button>
                            </div>
                        )}
                    </div>
                </SidebarHeader>

                {/* CONTENT */}
                <SidebarContent className="p-3 pt-0 bg-transparent flex-1">

                    {/* PRIMARY NAVIGATION */}
                    <SidebarGroup className="p-0 mb-6">
                        <SidebarGroupContent>
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                className="gap-0.5 flex flex-col"
                            >


                                <motion.div variants={itemVariants}>
                                    <NavItem icon={LayoutGrid} title="Overview" isCollapsed={isCollapsed} />
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <NavItem icon={Heart} title="Services" isCollapsed={isCollapsed} />
                                </motion.div>

                                <motion.div variants={itemVariants} className="flex flex-col">
                                    <button
                                        onClick={() => !isCollapsed && setPaymentsOpen(!paymentsOpen)}
                                        className={cn(
                                            "w-full flex items-center justify-between transition-colors focus:outline-none relative",
                                            isCollapsed && "cursor-default"
                                        )}
                                    >
                                        <NavItem icon={CreditCard} title="Payments" isActive className="flex-1 pointer-events-none" isCollapsed={isCollapsed} />
                                        {!isCollapsed && (
                                            <div className="absolute right-3 p-1">
                                                <motion.div
                                                    animate={{ rotate: paymentsOpen ? 0 : -90 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <ChevronDown className="w-4 h-4 text-zinc-400" />
                                                </motion.div>
                                            </div>
                                        )}
                                    </button>

                                    <AnimatePresence>
                                        {paymentsOpen && !isCollapsed && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                                className="overflow-hidden"
                                            >
                                                <div className="ml-5 border-l border-zinc-200 dark:border-zinc-800 pl-3 my-1 flex flex-col gap-0.5">
                                                    <NavItem icon={Link2} title="Payment links" isSubitem textClassName="text-zinc-900 dark:text-zinc-100 font-medium" isCollapsed={isCollapsed} />
                                                    <NavItem icon={ArrowRightLeft} title="Transactions" isSubitem isCollapsed={isCollapsed} />
                                                    <NavItem icon={FileText} title="Statements" isSubitem isCollapsed={isCollapsed} />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <NavItem icon={Clock} title="Schedule" />
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <NavItem icon={Smile} title="Customers" />
                                </motion.div>
                            </motion.div>
                        </SidebarGroupContent>
                    </SidebarGroup>

                </SidebarContent>

                {/* FOOTER */}
                <SidebarFooter className="p-3 border-none bg-transparent">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.4 }}
                    >
                        <SidebarMenu className="gap-1 mb-4">
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    className="flex items-center gap-2 rounded-xl p-2 text-left h-auto hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                                        <Smile className="w-5 h-5 text-zinc-500" />
                                    </div>
                                    {!isCollapsed && (
                                        <>
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                                                    Avdey Design Inc.
                                                </span>
                                                <span className="text-[11px] text-zinc-500 truncate mt-0.5">
                                                    alex@avdey.design
                                                </span>
                                            </div>
                                            <ChevronDown className="w-4 h-4 text-zinc-400 ml-auto shrink-0" />
                                        </>
                                    )}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>

                        <SidebarMenu className="gap-0.5">
                            <NavItem icon={HelpCircle} title="Get help" isCollapsed={isCollapsed} />
                            <NavItem icon={Settings} title="Settings" isCollapsed={isCollapsed} />
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
                    isActive
                        ? "bg-zinc-100/80 dark:bg-zinc-800 text-zinc-900 dark:white font-medium"
                        : "text-zinc-600 hover:bg-zinc-100/50 dark:text-zinc-400 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100",
                    isSubitem ? "h-8 px-2 gap-2 text-[12px]" : "h-9",
                    isCollapsed && "justify-center px-0"
                )}
            >
                <motion.div
                    className={cn(
                        "flex items-center gap-3",
                        isCollapsed ? "justify-center w-auto" : "w-full"
                    )}
                    whileHover={{ x: isCollapsed ? 0 : 2 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {Icon ? (
                        <Icon
                            className={cn(
                                "w-4 h-4 shrink-0",
                                isSubitem && "w-3.5 h-3.5 text-zinc-400",
                                isActive && !isSubitem && "text-zinc-900 dark:text-zinc-100",
                                iconClassName
                            )}
                        />
                    ) : (
                        <div className={cn("w-4 h-4 shrink-0", isSubitem && "w-3.5 h-3.5")} />
                    )}
                    {!isCollapsed && (
                        <span className={cn("truncate transition-all duration-200", textClassName)}>
                            {title}
                        </span>
                    )}
                </motion.div>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}