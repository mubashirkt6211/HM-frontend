import { motion } from "motion/react";
import {
    Users, UserPlus, Activity, Heart, TrendingUp,
    Search, Filter, MoreHorizontal, ArrowUpRight,
    ArrowDownRight, Calendar, Phone, Mail
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Dummy Data ──────────────────────────────────────────────────────────
const STATS = [
    { label: "Total Patients", value: "12,482", change: "+14%", isUp: true, icon: Users, color: "blue" },
    { label: "New Admissions", value: "245", change: "+8%", isUp: true, icon: UserPlus, color: "green" },
    { label: "Critical Care", value: "42", change: "-12%", isUp: false, icon: Activity, color: "red" },
    { label: "Recovery Rate", value: "94.2%", change: "+2%", isUp: true, icon: Heart, color: "purple" },
];

const RECENT_PATIENTS = [
    { id: "P001", name: "Brooklyn Simmons", age: 28, gender: "Female", condition: "Healthy", status: "Checked Out", avatar: "https://i.pravatar.cc/150?u=brooklyn" },
    { id: "P002", name: "Kristin Watson", age: 34, gender: "Female", condition: "Fever", status: "In Treatment", avatar: "https://i.pravatar.cc/150?u=kristin" },
    { id: "P003", name: "Guy Hawkins", age: 45, gender: "Male", condition: "Injury", status: "Emergency", avatar: "https://i.pravatar.cc/150?u=guy" },
    { id: "P004", name: "Jane Cooper", age: 19, gender: "Female", condition: "Healthy", status: "Checked Out", avatar: "https://i.pravatar.cc/150?u=jane" },
    { id: "P005", name: "Robert Fox", age: 52, gender: "Male", condition: "Flu", status: "In Treatment", avatar: "https://i.pravatar.cc/150?u=robert" },
];

// ─── Chart Mockup ────────────────────────────────────────────────────────
function SimpleAreaChart() {
    return (
        <div className="relative w-full h-48 mt-4 overflow-hidden rounded-xl bg-white dark:bg-zinc-900/50 p-4 border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Patient Admissions</h3>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[10px] font-medium text-zinc-500">
                        <span className="w-2 h-2 rounded-full bg-blue-500" /> This Week
                    </span>
                </div>
            </div>
            <svg viewBox="0 0 400 120" className="w-full h-32 transform translate-y-2">
                <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path
                    d="M0,100 Q40,40 80,70 T160,30 T240,60 T320,20 T400,50 L400,120 L0,120 Z"
                    fill="url(#gradient)"
                />
                <path
                    d="M0,100 Q40,40 80,70 T160,30 T240,60 T320,20 T400,50"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                />
                {/* Dots on peak points */}
                <circle cx="80" cy="70" r="3" fill="#3b82f6" />
                <circle cx="160" cy="30" r="3" fill="#3b82f6" />
                <circle cx="240" cy="60" r="3" fill="#3b82f6" />
                <circle cx="320" cy="20" r="3" fill="#3b82f6" />
            </svg>
            <div className="flex justify-between mt-2 px-1 text-[10px] text-zinc-400 font-medium">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
        </div>
    );
}

// ─── Page Component ──────────────────────────────────────────────────────
export function PatientsPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6 py-6"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Patient Directory</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage and monitor all hospital patients in one place.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl text-sm font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                        <UserPlus className="w-4 h-4" />
                        Add Patient
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center",
                                stat.color === "blue" && "bg-blue-50 dark:bg-blue-900/20 text-blue-600",
                                stat.color === "green" && "bg-green-50 dark:bg-green-900/20 text-green-600",
                                stat.color === "red" && "bg-red-50 dark:bg-red-900/20 text-red-600",
                                stat.color === "purple" && "bg-purple-50 dark:bg-purple-900/20 text-purple-600",
                            )}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div className={cn(
                                "flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold",
                                stat.isUp ? "bg-green-50 dark:bg-green-900/30 text-green-600" : "bg-red-50 dark:bg-red-900/30 text-red-600"
                            )}>
                                {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {stat.change}
                            </div>
                        </div>
                        <h3 className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1">{stat.label}</h3>
                        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Content Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Patient List */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Recent Patients</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <input
                                    placeholder="Search patients..."
                                    className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 py-1.5 pl-10 pr-4 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-zinc-100 dark:border-zinc-800">
                                        <th className="text-left py-3 px-2 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Patient</th>
                                        <th className="text-left py-3 px-2 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Age/Gender</th>
                                        <th className="text-left py-3 px-2 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Condition</th>
                                        <th className="text-left py-3 px-2 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Status</th>
                                        <th className="text-right py-3 px-2 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                                    {RECENT_PATIENTS.map((patient) => (
                                        <tr key={patient.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                                            <td className="py-4 px-2">
                                                <div className="flex items-center gap-3">
                                                    <img src={patient.avatar} alt={patient.name} className="w-9 h-9 rounded-xl object-cover" />
                                                    <div>
                                                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{patient.name}</p>
                                                        <p className="text-[10px] text-zinc-400 font-medium">ID: {patient.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-2 text-sm text-zinc-600 dark:text-zinc-400">
                                                {patient.age}y / {patient.gender}
                                            </td>
                                            <td className="py-4 px-2">
                                                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{patient.condition}</span>
                                            </td>
                                            <td className="py-4 px-2">
                                                <div className={cn(
                                                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold",
                                                    patient.status === "In Treatment" && "bg-blue-50 dark:bg-blue-900/30 text-blue-600",
                                                    patient.status === "Checked Out" && "bg-zinc-100 dark:bg-zinc-800 text-zinc-500",
                                                    patient.status === "Emergency" && "bg-red-50 dark:bg-red-900/30 text-red-600",
                                                )}>
                                                    <div className={cn(
                                                        "w-1.5 h-1.5 rounded-full",
                                                        patient.status === "In Treatment" && "bg-blue-500",
                                                        patient.status === "Checked Out" && "bg-zinc-400",
                                                        patient.status === "Emergency" && "bg-red-500 animate-pulse",
                                                    )} />
                                                    {patient.status}
                                                </div>
                                            </td>
                                            <td className="py-4 px-2 text-right">
                                                <button className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <button className="w-full mt-6 py-2.5 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:border-zinc-300 transition-all">
                            View All Patients
                        </button>
                    </div>
                </div>

                {/* Right: Charts & Info */}
                <div className="flex flex-col gap-6">
                    {/* Activity Chart */}
                    <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-sm">
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">Hospital Activity</h2>
                        <p className="text-xs text-zinc-500 mb-6">Real-time analysis of weekly admissions.</p>

                        <SimpleAreaChart />

                        <div className="mt-6 flex flex-col gap-3">
                            <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 flex items-center justify-center">
                                        <TrendingUp className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Peak Capacity</span>
                                </div>
                                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">84%</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Avg. Stay Rate</span>
                                </div>
                                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">4.2 Days</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Contact */}
                    <div className="p-6 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/20 text-white overflow-hidden relative">
                        <div className="relative z-10">
                            <h2 className="text-lg font-bold mb-2">Need Help?</h2>
                            <p className="text-blue-100 text-xs mb-6 opacity-80 leading-relaxed">Access instant support for emergency cases and hospital administration.</p>

                            <div className="flex flex-col gap-3">
                                <button className="flex items-center gap-3 w-full bg-white/10 hover:bg-white/20 p-2.5 rounded-xl transition-all border border-white/10">
                                    <Phone className="w-4 h-4" />
                                    <span className="text-xs font-medium">Emergency Line</span>
                                </button>
                                <button className="flex items-center gap-3 w-full bg-white/10 hover:bg-white/20 p-2.5 rounded-xl transition-all border border-white/10">
                                    <Mail className="w-4 h-4" />
                                    <span className="text-xs font-medium">Email Support</span>
                                </button>
                            </div>
                        </div>
                        {/* Decorative Circle */}
                        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="absolute -left-8 -top-8 w-24 h-24 bg-blue-400/20 rounded-full blur-xl pointer-events-none" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
