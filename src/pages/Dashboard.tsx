import {
    LayoutGrid,
    Users,
    Stethoscope,
    Star,
    ChevronDown,
    Plus,
    Camera,
    FolderOpen,
    Info,
    FileText
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { motion } from "motion/react"
import claraAvatar from "@/assets/clara_avatar.png"

export function Dashboard() {
    const [activeTab, setActiveTab] = useState("Dashboard");

    return (
        <article className="flex min-w-0 w-full flex-col gap-8 py-8 px-6 max-w-7xl mx-auto">

            {/* 1. Profile Header */}
            <div className="flex items-center gap-6">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full border-4 border-white dark:border-zinc-900 shadow-xl overflow-hidden ring-1 ring-zinc-200 dark:ring-zinc-800">
                        <img
                            src={claraAvatar}
                            alt="Clara Lefèvre"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <button className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center border-2 border-white dark:border-zinc-900 shadow-lg hover:scale-110 transition-transform">
                        <Camera className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Clara Lefèvre</h1>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50">
                            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">R&D Product</span>
                        </div>
                        <span className="text-[14px] font-medium text-zinc-500">Product Manager</span>
                    </div>
                </div>
            </div>

            {/* 2. Tab Navigation & Action */}
            <div className="flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800/60 pb-1">
                <div className="flex items-center gap-1">
                    <TabItem icon={Info} label="Infos" active={activeTab === "Infos"} onClick={() => setActiveTab("Infos")} />
                    <TabItem icon={LayoutGrid} label="Dashboard" active={activeTab === "Dashboard"} onClick={() => setActiveTab("Dashboard")} />
                    <TabItem icon={Users} label="Team" active={activeTab === "Team"} onClick={() => setActiveTab("Team")} />
                    <TabItem icon={Stethoscope} label="Patient" active={activeTab === "Patient"} onClick={() => setActiveTab("Patient")} />
                    <TabItem icon={FileText} label="Documents" active={activeTab === "Documents"} onClick={() => setActiveTab("Documents")} />
                    <TabItem icon={Star} label="Reviews" active={activeTab === "Reviews"} onClick={() => setActiveTab("Reviews")} />
                </div>
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[13px] font-bold shadow-xl shadow-zinc-200 dark:shadow-none hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-95">
                    Download PDF
                </button>
            </div>

            {/* 3. Performance Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Achievement Progress */}
                <Card title="Achievement Progress" trailing="0 %">
                    <div className="mt-4 flex flex-col gap-6">
                        <div className="relative h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center">
                            {/* Hash marks placeholder */}
                            <div className="absolute inset-0 flex justify-between px-1">
                                {[...Array(20)].map((_, i) => (
                                    <div key={i} className="w-[1px] h-3 -mt-0.5 bg-zinc-200 dark:bg-zinc-700" />
                                ))}
                            </div>
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-500 border-4 border-white dark:border-zinc-900 shadow-md ring-2 ring-blue-500/20" />
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
                            <span className="text-[12px] text-zinc-400">Last update : <span className="text-rose-500 font-medium">Today at 5:56pm</span></span>
                            <span className="text-lg">:(</span>
                        </div>
                    </div>
                </Card>

                {/* Bonus Earned */}
                <Card title="Bonus Earned" trailing={<span className="text-zinc-400">Objectives <span className="text-zinc-900 dark:text-zinc-100 ml-2">0 <span className="text-zinc-300 font-light">/ 0</span></span></span>}>
                    <div className="mt-2 flex flex-col gap-4">
                        <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                            € <span className="text-indigo-600 dark:text-indigo-400">0</span> <span className="text-zinc-300 dark:text-zinc-700 font-normal">/ 3200</span>
                        </div>
                        <div className="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800">
                            <span className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest">Objectives</span>
                            <div className="px-3 py-1 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700 text-[12px] font-bold text-zinc-400">0 / 0</div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* 4. Controls Bar */}
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                    <div className="flex rounded-xl bg-zinc-100/80 dark:bg-zinc-800/80 p-1 border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm">
                        <FilterBtn label="H1" />
                        <FilterBtn label="H2" />
                        <FilterBtn label="Annual review" active />
                    </div>
                    <button className="flex items-center gap-4 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm text-[13px] font-bold text-zinc-700 dark:text-zinc-300">
                        2025 <ChevronDown className="w-4 h-4 text-zinc-400" />
                    </button>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors text-[14px] font-medium">
                    <Plus className="w-4 h-4" />
                    Add objective
                </button>
            </div>

            {/* 5. Empty State */}
            <div className="flex-1 flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500">
                <div className="relative mb-8">
                    <div className="w-40 h-40 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-full blur-3xl absolute -inset-4" />
                    <div className="relative w-24 h-24 bg-gradient-to-tr from-zinc-200 to-zinc-50 dark:from-zinc-800 dark:to-zinc-700 rounded-[28px] shadow-2xl flex items-center justify-center ring-1 ring-zinc-900/5 rotate-12">
                        <FolderOpen className="w-10 h-10 text-zinc-400 -rotate-12" />
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 shadow-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-indigo-500" />
                        </div>
                    </div>
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">No objectives established yet</h3>
                    <p className="text-[14px] text-zinc-500 max-w-sm mx-auto">Create your first objective to align your team and track performance.</p>
                </div>
                <button className="mt-8 px-8 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none font-bold text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all hover:scale-105 active:scale-95">
                    Create now!
                </button>
            </div>

        </article>
    );
}

function TabItem({ icon: Icon, label, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-4 py-3 text-[13px] font-bold transition-all relative",
                active ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            )}
        >
            <Icon className={cn("w-4 h-4", active ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400")} />
            {label}
            {active && (
                <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-[-2px] left-0 right-0 h-0.5 bg-zinc-900 dark:bg-zinc-100 rounded-full"
                />
            )}
        </button>
    )
}

function FilterBtn({ label, active }: any) {
    return (
        <button className={cn(
            "px-4 py-1.5 rounded-lg text-[12px] font-bold transition-all",
            active
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
        )}>
            {label}
        </button>
    )
}

function Card({ title, trailing, children }: any) {
    return (
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 rounded-[32px] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{title}</span>
                <span className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100">{trailing}</span>
            </div>
            {children}
        </div>
    )
}
