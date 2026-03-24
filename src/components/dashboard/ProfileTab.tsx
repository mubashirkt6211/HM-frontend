/**
 * Profile Tab - View and manage user profile
 */
import { motion } from "motion/react";
import { 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  Trophy, 
  Settings, 
  Award,
  BookOpen,
  PieChart,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import claraAvatar from "@/assets/clara_avatar.png";

export function ProfileTab() {
  const stats = [
    { label: "Cases Managed", value: "1,284", icon: ShieldCheck, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/10" },
    { label: "Patients Seen", value: "542", icon: User, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/10" },
    { label: "Success Rate", value: "98.2%", icon: Trophy, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/10" },
    { label: "Avg. Duration", value: "18m", icon: Clock, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-900/10" },
  ];

  const credentials = [
    { title: "Senior Product Strategist", org: "Coconut HMS Solutions", period: "2022 - Present", icon: Award },
    { title: "Clinical Informatics Master", org: "Stanford Medicine", period: "2018 - 2020", icon: BookOpen },
    { title: "Product Management Lead", org: "MedTech Global", period: "2015 - 2018", icon: PieChart },
  ];

  return (
    <div className="pb-10 space-y-8 max-w-5xl mx-auto">
      {/* 1. Header Hero Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[40px] bg-zinc-900 dark:bg-zinc-900 p-8 md:p-12 text-white shadow-2xl"
      >
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/0 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-gradient-to-tr from-pink-500/10 to-orange-500/0 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 text-center md:text-left">
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[35px] border-4 border-white/10 overflow-hidden shadow-2xl ring-2 ring-white/5 transition-transform group-hover:scale-105 duration-500">
              <img src={claraAvatar} alt="Clara Lefèvre" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-1">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">Clara Lefèvre</h1>
              <p className="text-zinc-400 font-bold text-lg md:text-xl">Senior Product Manager • HMS Architecture</p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[13px] font-bold">
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                clara@coconut.health
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[13px] font-bold">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                Paris, France
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[13px] font-bold">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                Joined March 2022
              </div>
            </div>

            <div className="pt-4 flex items-center justify-center md:justify-start gap-3">
              <button className="px-6 py-2.5 rounded-2xl bg-white text-black text-[13px] font-black hover:bg-zinc-200 transition-all active:scale-95">
                Edit Profile
              </button>
              <button className="w-11 h-11 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-[32px] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm"
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform hover:rotate-12", s.bg)}>
                <Icon className={cn("w-5 h-5", s.color)} />
              </div>
              <p className="text-[24px] font-black text-zinc-900 dark:text-zinc-100 leading-none">{s.value}</p>
              <p className="text-[12px] font-bold text-zinc-400 mt-2 tracking-wide uppercase">{s.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* 3. Main Content: Experience & Credentials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-[20px] font-black text-zinc-900 dark:text-zinc-100 px-2 flex items-center gap-3">
            Professional Credentials 
            <span className="w-8 h-px bg-zinc-200 dark:bg-zinc-800 flex-1" />
          </h2>
          
          <div className="space-y-4">
            {credentials.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div 
                  key={c.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className="group flex gap-5 p-6 rounded-[32px] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-blue-200 dark:hover:border-blue-900/50 transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/10 transition-colors">
                    <Icon className="w-6 h-6 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-[17px] font-black text-zinc-900 dark:text-zinc-100 leading-tight">{c.title}</h3>
                    <p className="text-[14px] font-bold text-zinc-500">{c.org}</p>
                    <p className="text-[12px] font-medium text-zinc-400">{c.period}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-[20px] font-black text-zinc-900 dark:text-zinc-100 px-2">Recent Reports</h2>
          <div className="rounded-[32px] bg-zinc-50 dark:bg-zinc-900/50 border border-dashed border-zinc-200 dark:border-zinc-800 p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center shadow-lg mb-6">
              <PieChart className="w-7 h-7 text-indigo-500" />
            </div>
            <p className="text-[15px] font-black text-zinc-900 dark:text-zinc-100">Analytics Export</p>
            <p className="text-[12px] font-medium text-zinc-500 mt-2 mb-6">The patient outcome report for Q1 2026 is ready to review.</p>
            <button className="w-full py-3 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[13px] font-black hover:scale-105 transition-transform">
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
