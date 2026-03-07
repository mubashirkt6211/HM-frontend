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
    FileText,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Award,
    Filter,
    MoreVertical,
    Clock,
    File,
    Download,
    Trash2,
    ThumbsUp,
    MessageSquare,
    ExternalLink,
    ArrowUpRight,
    Bell,
    Video,
    Users2,
    ChevronRight,
    Search,
    Activity,
    HeartPulse
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import claraAvatar from "@/assets/clara_avatar.png"

export function Dashboard() {
    const [activeTab, setActiveTab] = useState("Dashboard");

    const renderTabContent = () => {
        switch (activeTab) {
            case "Infos":
                return <InfosTab />;
            case "Dashboard":
                return <DashboardTab />;
            case "Team":
                return <TeamTab />;
            case "Patient":
                return <PatientTab />;
            case "Documents":
                return <DocumentsTab />;
            case "Reviews":
                return <ReviewsTab />;
            default:
                return <DashboardTab />;
        }
    };

    return (
        <article className="flex min-w-0 w-full flex-col gap-8 py-8 px-6 max-w-7xl mx-auto min-h-screen">

            {/* 1. Profile Header */}
            <div className="flex items-center gap-6">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full border-4 border-white dark:border-zinc-900 shadow-xl overflow-hidden ring-1 ring-zinc-200 dark:ring-zinc-800 transition-transform group-hover:scale-105 duration-300">
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
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                    <TabItem icon={Info} label="Infos" active={activeTab === "Infos"} onClick={() => setActiveTab("Infos")} />
                    <TabItem icon={LayoutGrid} label="Dashboard" active={activeTab === "Dashboard"} onClick={() => setActiveTab("Dashboard")} />
                    <TabItem icon={Users} label="Team" active={activeTab === "Team"} onClick={() => setActiveTab("Team")} />
                    <TabItem icon={Stethoscope} label="Patient" active={activeTab === "Patient"} onClick={() => setActiveTab("Patient")} />
                    <TabItem icon={FileText} label="Documents" active={activeTab === "Documents"} onClick={() => setActiveTab("Documents")} />
                    <TabItem icon={Star} label="Reviews" active={activeTab === "Reviews"} onClick={() => setActiveTab("Reviews")} />
                </div>
                <button className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[13px] font-bold shadow-xl shadow-zinc-200 dark:shadow-none hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-95">
                    Download PDF
                </button>
            </div>

            {/* 3. Dynamic Tab Content */}
            <div className="flex-1">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {renderTabContent()}
                    </motion.div>
                </AnimatePresence>
            </div>

        </article>
    );
}

// --- Tab Content Components ---

function InfosTab() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card title="Personal Information" trailing={<Info className="w-4 h-4 text-zinc-400" />}>
                <div className="mt-4 space-y-4">
                    <InfoRow icon={Mail} label="Email" value="clara.lefevre@coconut.io" />
                    <InfoRow icon={Phone} label="Phone" value="+33 6 12 34 56 78" />
                    <InfoRow icon={MapPin} label="Location" value="Paris, France" />
                    <InfoRow icon={Calendar} label="Joined" value="Jan 2023" />
                </div>
            </Card>
            <Card title="Professional Summary" trailing={<Award className="w-4 h-4 text-zinc-400" />}>
                <div className="mt-4">
                    <p className="text-[14px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        Experienced Product Manager with a strong background in R&D and health-tech.
                        Focused on building intuitive patient-centric solutions and fostering cross-functional team collaboration.
                    </p>
                    <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                        <span className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest">Key Skills</span>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {["Product Strategy", "User Research", "Agile", "HealthTech"].map(skill => (
                                <span key={skill} className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-[11px] font-bold border border-zinc-200/50 dark:border-zinc-700/50">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>
            <Card title="Recent Activity" trailing={<Clock className="w-4 h-4 text-zinc-400" />}>
                <div className="mt-4 space-y-4">
                    <ActivityItem label="Created new patient portal" time="2h ago" />
                    <ActivityItem label="Updated team roadmaps" time="5h ago" />
                    <ActivityItem label="Reviewing user feedback" time="Yesterday" />
                    <ActivityItem label="Approved Q2 budget" time="2 days ago" />
                </div>
            </Card>
        </div>
    );
}

function DashboardTab() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Achievement Progress" trailing="76 %">
                    <div className="mt-4 flex flex-col gap-6">
                        <div className="relative h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center">
                            <div className="absolute inset-0 flex justify-between px-1">
                                {[...Array(20)].map((_, i) => (
                                    <div key={i} className="w-[1px] h-3 -mt-0.5 bg-zinc-200 dark:bg-zinc-700" />
                                ))}
                            </div>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "76%" }}
                                className="absolute left-0 h-full bg-blue-500 rounded-full shadow-lg"
                            />
                            <motion.div
                                initial={{ left: 0 }}
                                animate={{ left: "76%" }}
                                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-500 border-4 border-white dark:border-zinc-900 shadow-md ring-2 ring-blue-500/20"
                            />
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
                            <span className="text-[12px] text-zinc-400">Last update : <span className="text-blue-500 font-medium">Today at 5:56pm</span></span>
                            <span className="text-lg">:)</span>
                        </div>
                    </div>
                </Card>

                <Card title="Bonus Earned" trailing={<span className="text-zinc-400">Objectives <span className="text-zinc-900 dark:text-zinc-100 ml-2">12 <span className="text-zinc-300 font-light">/ 15</span></span></span>}>
                    <div className="mt-2 flex flex-col gap-4">
                        <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                            € <span className="text-indigo-600 dark:text-indigo-400">2,450</span> <span className="text-zinc-300 dark:text-zinc-700 font-normal">/ 3200</span>
                        </div>
                        <div className="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800">
                            <span className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest">Efficiency Rate</span>
                            <div className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 text-[12px] font-bold text-emerald-600 dark:text-emerald-400">+12%</div>
                        </div>
                    </div>
                </Card>
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "User Retention", value: "94.2%", trend: "+2.4%", status: "On Track" },
                    { title: "Project Velocity", value: "18.5 pts", trend: "-1.2%", status: "At Risk" },
                    { title: "Budget Usage", value: "€14.2k", trend: "+5.1%", status: "Budgeted" },
                ].map((stat, i) => (
                    <Card key={i} title={stat.title} trailing={stat.value}>
                        <div className="mt-4 flex items-center justify-between">
                            <span className={cn(
                                "text-[12px] font-bold",
                                stat.trend.startsWith('+') ? "text-emerald-500" : "text-rose-500"
                            )}>{stat.trend} this month</span>
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-medium italic">
                                {stat.status}
                            </span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function TeamTab() {
    const [filter, setFilter] = useState("All");
    const [showAddMenu, setShowAddMenu] = useState(false);

    const doctors = [
        {
            name: "Dr. Peter Griffin",
            role: "Primary care doctor",
            img: "https://i.pinimg.com/736x/b4/1f/24/b41f248ea356a219e23847075cfccb46.jpg",
            rating: "4.85",
            reviews: "255",
            dist: "16.8km",
            status: "Present"
        },
        {
            name: "Dr. Sophie Dubreuil",
            role: "Cardiologist",
            img: "https://i.pinimg.com/736x/7c/c8/36/7cc8365ff96cd8f7df7222a1533f7013.jpg",
            rating: "4.92",
            reviews: "128",
            dist: "12.4km",
            status: "Present"
        },
        {
            name: "Dr. Marc Aubert",
            role: "Dermatologist",
            img: "https://i.pinimg.com/736x/d4/3e/40/d43e40f2623b9d3b72404a076f72d87a.jpg",
            rating: "4.70",
            reviews: "94",
            dist: "5.2km",
            status: "Leave"
        },
        {
            name: "Dr. Léonard Dubois",
            role: "Neurologist",
            img: "https://i.pinimg.com/1200x/97/ff/27/97ff275080abc0f08aade3026ab3dee2.jpg",
            rating: "4.98",
            reviews: "312",
            dist: "8.1km",
            status: "Present"
        },
        {
            name: "Dr. Léonard Dubois",
            role: "Neurologist",
            img: "https://i.pinimg.com/736x/ff/07/64/ff07643efddfd768f66017b4e87ca785.jpg",
            rating: "4.98",
            reviews: "312",
            dist: "8.1km",
            status: "Present"
        },
        {
            name: "Dr. Léonard Dubois",
            role: "Neurologist",
            img: "https://i.pinimg.com/1200x/e8/52/72/e852726f2346ce95973a91143816bd7b.jpg",
            rating: "4.98",
            reviews: "312",
            dist: "8.1km",
            status: "Present"
        },
    ];

    const filteredDoctors = filter === "All"
        ? doctors
        : doctors.filter(doc => doc.status === filter);

    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center bg-zinc-50 dark:bg-zinc-800/50 p-1 rounded-2xl border border-zinc-100 dark:border-zinc-700">
                    {["All", "Present", "Leave"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                                filter === f
                                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-zinc-200/50 dark:ring-zinc-600"
                                    : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowAddMenu(!showAddMenu)}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black text-[13px] font-black shadow-xl shadow-zinc-200/50 dark:shadow-none hover:bg-zinc-800 dark:hover:bg-zinc-100 active:scale-95 transition-all"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Add
                        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-300", showAddMenu && "rotate-180")} />
                    </button>

                    <AnimatePresence>
                        {showAddMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-3 w-60 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-2 z-50 overflow-hidden"
                            >
                                <div className="p-1 space-y-1">
                                    <button className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all text-left group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-800/50 group-hover:bg-white dark:group-hover:bg-zinc-800 transition-colors">
                                                <Stethoscope className="w-4 h-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[13px] font-bold text-zinc-800 dark:text-zinc-200">New Doctor</span>
                                                <span className="text-[10px] text-zinc-400 font-medium">Add a specialist</span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <button className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all text-left group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-800/50 group-hover:bg-white dark:group-hover:bg-zinc-800 transition-colors">
                                                <HeartPulse className="w-4 h-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[13px] font-bold text-zinc-800 dark:text-zinc-200">New Nurse</span>
                                                <span className="text-[10px] text-zinc-400 font-medium">Add a care provider</span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <button className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all text-left group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 border border-purple-100/50 dark:border-purple-800/50 group-hover:bg-white dark:group-hover:bg-zinc-800 transition-colors">
                                                <Users2 className="w-4 h-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[13px] font-bold text-zinc-800 dark:text-zinc-200">New Staff</span>
                                                <span className="text-[10px] text-zinc-400 font-medium">Add a team member</span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                                <div className="h-[1px] bg-zinc-100/80 dark:bg-zinc-800/80 my-1 mx-2" />
                                <div className="p-1">
                                    <button className="w-full p-3 rounded-2xl hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 text-zinc-500 text-[11px] font-black uppercase tracking-widest text-center transition-all">
                                        Quick Attendance
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 min-h-[400px]">
                <AnimatePresence mode="popLayout">
                    {filteredDoctors.map((doc) => (
                        <motion.div
                            key={doc.name}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                        >
                            <SmallSpecialistCard doctor={doc} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div >
    );
}

function PatientTab() {
    const patients = [
        { id: "P-4392", name: "Jean-Pierre Durand", status: "Follow-up", appointment: "Today, 10:30", type: "Cardiology" },
        { id: "P-8821", name: "Marie-Louise Petit", status: "Emergency", appointment: "Today, 11:45", type: "Pediatrics" },
        { id: "P-1294", name: "Luc Moreau", status: "Checkup", appointment: "Tomorrow, 09:00", type: "General" },
        { id: "P-7730", name: "Emma Dubois", status: "Discharged", appointment: "Done", type: "Neurology" },
    ];

    return (
        <div className="space-y-10 pb-10">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-200 dark:shadow-none">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-3 tracking-tight">Patient Records Portal</h2>
                    <p className="text-blue-100 text-[15px] max-w-lg leading-relaxed opacity-90">Manage your patient visits, medical history, and treatment plans in one unified professional portal.</p>
                </div>
                <div className="absolute right-[-40px] bottom-[-40px] opacity-10 rotate-12">
                    <Stethoscope className="w-64 h-64" />
                </div>
                <div className="absolute top-1/2 right-12 -translate-y-1/2 flex gap-4">
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 text-center min-w-[110px] border border-white/10">
                        <div className="text-3xl font-bold">12</div>
                        <div className="text-[11px] font-bold uppercase tracking-widest opacity-70 mt-1">Today</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 text-center min-w-[110px] border border-white/10">
                        <div className="text-3xl font-bold">156</div>
                        <div className="text-[11px] font-bold uppercase tracking-widest opacity-70 mt-1">Active</div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[32px] overflow-hidden shadow-sm">
                <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/20">
                    <span className="text-[14px] font-bold px-1">Recent Patients Activity</span>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
                        View Full List <ExternalLink className="w-3 h-3" />
                    </button>
                </div>
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {patients.map((p, i) => (
                        <div key={i} className="flex items-center justify-between p-5 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors group cursor-pointer">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-[13px] text-zinc-400 group-hover:bg-white dark:group-hover:bg-zinc-700 transition-colors border border-zinc-100/50 dark:border-zinc-700/50">
                                    {p.id.split('-')[1]}
                                </div>
                                <div>
                                    <h5 className="font-bold text-zinc-900 dark:text-zinc-100 text-[15px]">{p.name}</h5>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[12px] text-zinc-400">{p.type}</span>
                                        <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                                        <span className="text-[12px] text-zinc-400 font-medium">ID: {p.id}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-10">
                                <div className="text-right">
                                    <div className="text-[13px] font-bold text-zinc-800 dark:text-zinc-200">{p.appointment}</div>
                                    <div className={cn(
                                        "text-[11px] font-black uppercase tracking-widest mt-0.5",
                                        p.status === "Emergency" ? "text-rose-500" :
                                            p.status === "Follow-up" ? "text-blue-500" : "text-emerald-500"
                                    )}>{p.status}</div>
                                </div>
                                <button className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 opacity-0 group-hover:opacity-100 hover:bg-zinc-900 dark:hover:bg-zinc-100 hover:text-white dark:hover:text-zinc-900 transition-all shadow-sm">
                                    <ArrowUpRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function SmallSpecialistCard({ doctor }: any) {
    const appointments = [
        { date: "05 Dec", count: "12 appts", active: false },
        { date: "06 Dec", count: "0 appts", active: true },
        { date: "07 Dec", count: "15 appts", active: false },
        { date: "08 Dec", count: "8 appts", active: false },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] p-5 shadow-xl shadow-zinc-200/40 dark:shadow-none hover:shadow-2xl transition-all group"
        >
            <div className="flex flex-col gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-blue-50 dark:bg-blue-900/20 shrink-0 border border-zinc-100 dark:border-zinc-800 shadow-sm mx-auto sm:mx-0">
                    <img
                        src={doctor.img}
                        alt={doctor.name}
                        className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-500"
                    />
                </div>
                <div className="flex flex-col flex-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1">
                        <div className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            doctor.status === "Present" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-zinc-300 dark:bg-zinc-600"
                        )} />
                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{doctor.status}</span>
                    </div>
                    <h3 className="text-[15px] font-black text-zinc-900 dark:text-zinc-100 leading-tight truncate">{doctor.name}</h3>
                    <p className="text-[12px] text-zinc-500 font-bold truncate">{doctor.role}</p>

                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                        <div className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100">{doctor.rating}</span>
                        </div>
                        <span className="w-1 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                        <span className="text-[11px] text-zinc-400 font-bold">{doctor.dist}</span>
                    </div>

                    <button className="flex items-center justify-center sm:justify-start gap-1 mt-3 text-blue-600 dark:text-blue-400 text-[11px] font-black uppercase tracking-tight hover:underline">
                        <Video className="w-3.5 h-3.5" />
                        Video
                    </button>
                </div>
            </div>

            <div className="mt-5 flex gap-1.5">
                {appointments.map((item, i) => (
                    <div
                        key={i}
                        className={cn(
                            "flex-1 py-2 px-1 rounded-xl text-center border transition-all cursor-pointer",
                            item.active
                                ? "bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100"
                                : "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                        )}
                    >
                        <div className={cn(
                            "text-[8px] font-bold uppercase tracking-tight mb-0.5 opacity-60",
                            item.active ? "text-zinc-400" : "text-zinc-400"
                        )}>{item.date.split(' ')[0]}</div>
                        <div className={cn(
                            "text-[10px] font-black leading-tight",
                            item.active ? "text-white dark:text-zinc-900" : "text-zinc-900 dark:text-zinc-100"
                        )}>{item.count.split(' ')[0]} <span className="opacity-40 text-[6px]">{item.count.split(' ')[1].slice(0, 3)}</span></div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

function DocumentsTab() {
    const docs = [
        { name: "Annual_Report_2024.pdf", size: "2.4 MB", date: "Mar 12, 2024", type: "PDF", color: "text-rose-500 bg-rose-50 dark:bg-rose-900/20" },
        { name: "Patient_Feedback_Survey.xlsx", size: "1.1 MB", date: "Mar 10, 2024", type: "XLS", color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" },
        { name: "Team_Roadmap_Q2.fig", size: "12.8 MB", date: "Mar 05, 2024", type: "FIG", color: "text-purple-500 bg-purple-50 dark:bg-purple-900/20" },
        { name: "Product_Strategy_v2.docx", size: "450 KB", date: "Feb 28, 2024", type: "DOC", color: "text-blue-500 bg-blue-50 dark:bg-blue-900/20" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-zinc-900 p-8 rounded-[40px] text-white shadow-2xl shadow-zinc-200 dark:shadow-none group cursor-pointer border border-zinc-800/50">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mb-6 border border-zinc-700 group-hover:scale-110 transition-transform">
                            <FolderOpen className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h4 className="font-bold text-lg">Medical Records</h4>
                        <p className="text-[13px] opacity-50 mt-1">1,240 items • 2.4 GB</p>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[40px] text-zinc-900 dark:text-zinc-100 shadow-sm border border-zinc-200 dark:border-zinc-800 group cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6 text-blue-500" />
                        </div>
                        <h4 className="font-bold text-lg">Research Papers</h4>
                        <p className="text-[13px] text-zinc-400 mt-1">86 items • 450 MB</p>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-800/30 p-8 rounded-[40px] text-zinc-500 border border-dashed border-zinc-200 dark:border-zinc-700 group cursor-pointer flex flex-col items-center justify-center text-center hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all">
                        <Plus className="w-8 h-8 mb-4 group-hover:rotate-90 transition-transform text-zinc-300" />
                        <h4 className="font-bold text-[15px]">Create Folder</h4>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[32px] p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h4 className="font-bold text-xl tracking-tight">Recent Files</h4>
                            <p className="text-[12px] text-zinc-400 mt-1">Your most recently accessed documents</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800">
                                <LayoutGrid className="w-4 h-4 text-zinc-400" />
                            </button>
                            <button className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 transition-colors border border-zinc-100 dark:border-zinc-800">
                                <Filter className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                            </button>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {docs.map((doc, i) => (
                            <div key={i} className="flex items-center justify-between group p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-all border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800">
                                <div className="flex items-center gap-5">
                                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", doc.color)}>
                                        <File className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h5 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100">{doc.name}</h5>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[12px] text-zinc-400 font-medium">{doc.size}</span>
                                            <span className="w-1 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                                            <span className="text-[12px] text-zinc-400">{doc.date}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                    <button className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700 hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-900 transition-all">
                                        <Download className="w-4 h-4" />
                                    </button>
                                    <button className="p-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/30 group/del transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-900/50">
                                        <Trash2 className="w-4 h-4 text-rose-400 group-hover/del:text-rose-600" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                <Card title="Cloud Storage" trailing="68 %">
                    <div className="mt-6">
                        <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "68%" }}
                                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full shadow-[0_0_12px_rgba(79,70,229,0.3)]"
                            />
                        </div>
                        <div className="flex items-center justify-between mt-5">
                            <div className="flex flex-col">
                                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Used</span>
                                <span className="text-[15px] font-black text-zinc-900 dark:text-zinc-100">12.4 GB</span>
                            </div>
                            <div className="flex flex-col text-right">
                                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Total</span>
                                <span className="text-[15px] font-bold text-zinc-500">20 GB</span>
                            </div>
                        </div>
                        <button className="w-full mt-8 py-3.5 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-[13px] hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-zinc-200 dark:shadow-none">
                            Upgrade Storage
                        </button>
                    </div>
                </Card>
                <div className="p-8 rounded-[40px] bg-gradient-to-tr from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-100/50 dark:border-amber-900/20 relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-5">
                            <Info className="w-5 h-5 text-amber-600" />
                        </div>
                        <h5 className="font-bold text-amber-900 dark:text-amber-400 text-[16px] tracking-tight">Security & Tips</h5>
                        <p className="text-[13px] text-amber-700/80 dark:text-amber-500/80 mt-2 leading-relaxed font-medium">
                            Keep your medical files encrypted. Automatic end-to-end backups are enabled for all Premium users.
                        </p>
                        <button className="mt-6 text-[12px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest hover:underline">Learn More</button>
                    </div>
                    <Info className="absolute right-[-20px] bottom-[-20px] w-32 h-32 text-amber-500/5 group-hover:scale-110 transition-transform" />
                </div>
            </div>
        </div>
    );
}

function ReviewsTab() {
    const reviews = [
        { name: "Alice Thompson", rating: 5, date: "2 days ago", comment: "The patient portal is incredibly intuitive. Significant improvement in our daily workflow. Highly recommended for any R&D team.", tags: ["UX", "Efficiency"], color: "bg-blue-100 text-blue-600" },
        { name: "Roberto Rossi", rating: 4, date: "1 week ago", comment: "Great tool, though I'd like to see more automation in document generation. The UI is very polished though!", tags: ["Feature Request"], color: "bg-purple-100 text-purple-600" },
        { name: "Elena Gilbert", rating: 5, date: "2 weeks ago", comment: "The best medical R&D platform I've used. The team is very responsive to feedback and updates are frequent.", tags: ["Support", "UI"], color: "bg-emerald-100 text-emerald-600" },
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card title="Average Rating" trailing="4.8 / 5.0">
                    <div className="mt-4 flex flex-col items-center justify-center py-6">
                        <div className="flex items-center gap-1.5 mb-3">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={cn("w-7 h-7 fill-current transition-transform hover:scale-110", i < 4 ? "text-amber-400" : "text-zinc-200 dark:text-zinc-700 shadow-sm")} />
                            ))}
                        </div>
                        <p className="text-[13px] font-bold text-zinc-400">Based on <span className="text-zinc-900 dark:text-zinc-100">124 reviews</span></p>
                    </div>
                </Card>
                <Card title="Client Satisfaction" trailing="94%">
                    <div className="mt-4 flex flex-col items-center justify-center py-6 text-emerald-500 capitalize">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-3">
                            <ThumbsUp className="w-7 h-7" />
                        </div>
                        <span className="font-black text-xl tracking-tight">Excellent</span>
                    </div>
                </Card>
                <Card title="Active Discussions" trailing="12 New">
                    <div className="mt-4 flex flex-col items-center justify-center py-6 text-indigo-500">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-3">
                            <MessageSquare className="w-7 h-7" />
                        </div>
                        <span className="font-black text-xl tracking-tight">Daily</span>
                    </div>
                </Card>
                <div className="p-8 rounded-[40px] bg-zinc-900 dark:bg-zinc-100 flex flex-col items-center justify-center text-center shadow-2xl shadow-zinc-200 dark:shadow-none group cursor-pointer overflow-hidden relative">
                    <div className="relative z-10">
                        <h4 className="text-white dark:text-zinc-900 font-bold text-lg mb-2">Want to help?</h4>
                        <p className="text-zinc-400 dark:text-zinc-500 text-[12px] mb-8 max-w-[120px] mx-auto leading-tight">Your feedback helps us evolve the platform.</p>
                        <button className="px-8 py-3 rounded-2xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-black text-[13px] hover:scale-105 active:scale-95 transition-all shadow-xl">Write Review</button>
                    </div>
                    <Star className="absolute right-[-20px] top-[-20px] w-24 h-24 text-white/5 dark:text-black/5 rotate-12 group-hover:scale-125 transition-transform" />
                </div>
            </div>

            <div className="space-y-5">
                {reviews.map((review, i) => (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[40px] p-8 shadow-sm hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group cursor-pointer"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className={cn("w-14 h-14 rounded-full flex items-center justify-center font-black text-[14px] shadow-inner", review.color)}>
                                    {review.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <h5 className="font-bold text-zinc-900 dark:text-zinc-100 text-[16px] tracking-tight">{review.name}</h5>
                                    <div className="flex items-center gap-3 mt-1">
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, j) => (
                                                <Star key={j} className={cn("w-3.5 h-3.5 fill-current", j < review.rating ? "text-amber-400" : "text-zinc-200 dark:text-zinc-700")} />
                                            ))}
                                        </div>
                                        <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                                        <span className="text-[12px] text-zinc-400 font-medium">{review.date}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="p-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                                <MoreVertical className="w-5 h-5 text-zinc-400" />
                            </button>
                        </div>
                        <p className="text-[15px] text-zinc-600 dark:text-zinc-400 mt-6 leading-relaxed font-medium italic">"{review.comment}"</p>
                        <div className="flex items-center gap-3 mt-8">
                            {review.tags.map(tag => (
                                <span key={tag} className="px-4 py-1.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 text-[11px] font-black uppercase tracking-widest border border-zinc-100 dark:border-zinc-700 group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-zinc-100 dark:group-hover:text-zinc-900 transition-all">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
            <button className="w-full py-8 text-[14px] font-black text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors uppercase tracking-widest opacity-50 hover:opacity-100">Load more reviews...</button>
        </div>
    );
}

// --- Shared Components ---

function InfoRow({ icon: Icon, label, value }: any) {
    return (
        <div className="flex items-center gap-5 group">
            <div className="w-11 h-11 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center border border-zinc-100 dark:border-zinc-700 transition-all group-hover:bg-zinc-900 dark:group-hover:bg-zinc-100 group-hover:scale-110 shadow-sm">
                <Icon className="w-5 h-5 text-zinc-400 group-hover:text-white dark:group-hover:text-zinc-900 transition-colors" />
            </div>
            <div className="flex flex-col">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1.5">{label}</span>
                <span className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{value}</span>
            </div>
        </div>
    );
}

function ActivityItem({ label, time }: any) {
    return (
        <div className="flex items-start gap-5 p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group">
            <div className="mt-2 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] group-hover:scale-125 transition-transform" />
            <div className="flex flex-col">
                <span className="text-[14px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight mb-1">{label}</span>
                <span className="text-[12px] text-zinc-400">{time}</span>
            </div>
        </div>
    );
}

function TabItem({ icon: Icon, label, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2.5 px-5 py-4 text-[14px] font-bold transition-all relative whitespace-nowrap",
                active ? "text-zinc-900 dark:text-zinc-100 mt-[-2px]" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            )}
        >
            <Icon className={cn("w-4.5 h-4.5", active ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400")} />
            {label}
            {active && (
                <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-zinc-900 dark:bg-zinc-100 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
        </button>
    )
}

function FilterBtn({ label, active }: any) {
    return (
        <button className={cn(
            "px-5 py-2 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all",
            active
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-md ring-1 ring-zinc-200/50 dark:ring-zinc-600"
                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800"
        )}>
            {label}
        </button>
    )
}

function Card({ title, trailing, children }: any) {
    return (
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 rounded-[40px] p-8 shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group">
            <div className="flex items-center justify-between mb-4">
                <span className="text-[14px] font-black text-zinc-900 dark:text-zinc-100 tracking-widest uppercase opacity-40 group-hover:opacity-100 transition-opacity">{title}</span>
                <div className="text-[14px] font-black text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 px-3 py-1 rounded-xl group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-zinc-100 dark:group-hover:text-zinc-900 transition-all">{trailing}</div>
            </div>
            {children}
        </div>
    )
}
