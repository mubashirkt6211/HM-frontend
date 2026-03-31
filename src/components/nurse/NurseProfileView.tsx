"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
   CaretLeft,
   Globe,
   Camera,
   Star,
   Target, FileText, Quotes,
   Plus, FolderOpen
} from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Nurse } from "@/pages/NursePage";

interface NurseProfileViewProps {
   nurse: Nurse;
   onBack: () => void;
}

const PREVIOUS_HOSPITALS = [
   {
      role: "Charge Nurse",
      hospital: "City Medical Center",
      location: "New York, NY",
      period: "2019 – Present",
      desc: "Directly managing a team of 15 nursing staff in the Busy Surgical unit, overseeing patient safety and administrative operations.",
      logo: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=100&h=100&auto=format&fit=crop",
      tags: ["Leadership", "Critical Care", "Surgical"],
      achievements: [
         "Reduced patient wait times by 15% through workflow optimization.",
         "Implemented a new digital charting system across the department.",
         "Recipient of the 'Nursing Excellence Award' in 2022."
      ]
   },
   {
      role: "Registered Nurse",
      hospital: "St. Mary's Hospital",
      location: "Chicago, IL",
      period: "2015 – 2019",
      desc: "Provided high-acuity nursing care for patients in the emergency department, managing traumas and acute illnesses.",
      logo: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=100&h=100&auto=format&fit=crop",
      tags: ["Emergency Room", "Trauma", "Triage"],
      achievements: [
         "Managed an average of 45 patients per shift in a high-volume ER.",
         "Mentored and trained 10+ junior nurses and nursing students.",
      ]
   },
];


const EDUCATION = [
   {
      degree: "Bachelor of Science in Nursing (BSN)",
      institution: "University of Pennsylvania",
      location: "Philadelphia, PA",
      period: "2011 – 2015",
      desc: "Graduated with honors, specialized in critical care and advanced nursing practices.",
      logo: "https://plus.unsplash.com/premium_photo-1663047248106-1bc7d8969ca4?q=80&w=100&h=100&auto=format&fit=crop",
   },
];

export function NurseProfileView({ nurse, onBack }: NurseProfileViewProps) {
   const [activeTab, setActiveTab] = useState("objectives");

   const TABS = [
      { id: "infos", label: "Infos", icon: Globe },
      { id: "objectives", label: "Objectives", icon: Target },
      { id: "documents", label: "Documents", icon: FileText },
      { id: "reviews", label: "Reviews", icon: Quotes },
   ];

   return (
      <div className="flex flex-col min-h-screen bg-[#FDFDFD] dark:bg-zinc-950 p-6 md:p-12 animate-in fade-in duration-1000">

         {/* ── TOP HEADER ── */}
         <div className="max-w-[1000px] mx-auto w-full mb-12">
            <button
               onClick={onBack}
               className="flex items-center gap-2 text-[13px] font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group mb-8"
            >
               <CaretLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" weight="bold" />
               Back to Nurses
            </button>

            <div className="flex items-start justify-between">
               <div className="flex items-center gap-6">
                  <div className="relative group">
                     <div className="size-24 rounded-full overflow-hidden border-4 border-white dark:border-zinc-800 shadow-sm transition-transform hover:scale-105 duration-500">
                        <Avatar className="w-full h-full">
                           <AvatarImage src={nurse.avatar} className="object-cover" />
                           <AvatarFallback>{nurse.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                     </div>
                     <button className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-7 rounded-full bg-zinc-900 text-white flex items-center justify-center shadow-md border-2 border-white transition-all hover:bg-zinc-800">
                        <Camera className="size-3.5" weight="fill" />
                     </button>
                  </div>

                  <div className="space-y-1.5 pt-1">
                     <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                        {nurse.name}
                     </h1>
                     <div className="flex items-center gap-3 text-[14px]">
                        <span className="flex items-center gap-1.5 font-bold text-blue-500">
                           <span className="size-1.5 rounded-full bg-blue-500" />
                           {nurse.department}
                        </span>
                        <span className="font-bold text-zinc-400">{nurse.specialization}</span>
                        <div className="w-px h-4 bg-zinc-100 dark:bg-zinc-800" />
                        <div className="flex items-center gap-1.5">
                           <Star className="size-4 fill-amber-400 text-amber-400" weight="fill" />
                           <span className="font-black text-zinc-900 dark:text-zinc-100">{nurse.rating}</span>
                        </div>
                     </div>
                  </div>
               </div>

               <button className="px-6 py-2.5 h-11 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[13px] font-bold shadow-lg hover:shadow-zinc-200 transition-all">
                  Export Profile
               </button>
            </div>
         </div>

         {/* ── TABS NAVIGATION ── */}
         <div className="max-w-[1000px] mx-auto w-full mb-10 flex items-center gap-3">
            {TABS.map(tab => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                     "flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-bold transition-all border",
                     activeTab === tab.id
                        ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                        : "bg-transparent border-transparent text-zinc-400 hover:text-zinc-600"
                  )}
               >
                  <tab.icon className="size-4" weight={activeTab === tab.id ? "fill" : "bold"} />
                  {tab.label}
               </button>
            ))}
         </div>

         {/* ── METRIC CARDS GRID ── */}
         <div className="max-w-[1000px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center justify-between h-[180px] group transition-all hover:shadow-xl">
               <div className="flex flex-col justify-between h-full py-2">
                  <div>
                     <h4 className="text-[13px] font-black text-zinc-400 uppercase tracking-widest mb-1">Shift Completion</h4>
                     <p className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">94%</p>
                  </div>

                  <div className="flex flex-col gap-1">
                     <p className="text-[11px] font-bold text-zinc-400">Monthly Avg :</p>
                     <p className="text-[11px] font-black text-blue-500 uppercase tracking-tight leading-none">High Performance</p>
                  </div>
               </div>

               <div className="relative size-28 shrink-0">
                  <svg viewBox="0 0 100 100" className="size-full transform -rotate-90 overflow-visible">
                     <defs>
                        <filter id="nurse-glow" x="-20%" y="-20%" width="140%" height="140%">
                           <feGaussianBlur stdDeviation="3" result="blur" />
                           <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                     </defs>
                     <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="10" className="text-zinc-50 dark:text-zinc-800/50" />
                     <motion.circle
                        cx="50" cy="50" r="44"
                        fill="none" stroke="#6366f1" strokeWidth="12" strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 44}
                        initial={{ strokeDashoffset: 2 * Math.PI * 44 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 44 * (1 - 0.94) }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        filter="url(#nurse-glow)"
                     />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="size-10 rounded-full bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center border border-zinc-100 dark:border-zinc-700">
                        <Target className="size-5 text-indigo-500" weight="fill" />
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between h-[180px] group transition-all hover:shadow-xl">
               <div>
                  <h4 className="text-[13px] font-black text-zinc-400 uppercase tracking-widest mb-1">Overtime Hours</h4>
                  <p className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">
                     <span className="text-emerald-500">{nurse.overtime === '—' ? '0' : nurse.overtime}</span> <span className="text-zinc-300 font-bold ml-1">hrs</span>
                  </p>
               </div>

               <div className="flex items-center justify-between pt-4 border-t border-zinc-50 dark:border-zinc-800">
                  <p className="text-[14px] font-bold text-zinc-400">Assigned Patients</p>
                  <span className="px-3 py-1 bg-zinc-50 dark:bg-zinc-800 rounded-full text-[12px] font-black text-zinc-900 dark:text-zinc-100">{nurse.patientsAssigned} Patients</span>
               </div>
            </div>
         </div>

         {/* ── TAB CONTENT ── */}
         <div className="max-w-[1000px] mx-auto w-full">
            <AnimatePresence mode="wait">
               {activeTab === "objectives" && (
                  <motion.div
                     key="objectives"
                     initial={{ opacity: 0, scale: 0.98 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.98 }}
                     className="space-y-12"
                  >
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <div className="flex bg-zinc-50 dark:bg-zinc-900 rounded-xl p-1 border border-zinc-100 dark:border-zinc-800">
                              <button className="px-4 py-1.5 rounded-lg text-[13px] font-bold text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 shadow-sm">Monthly</button>
                              <button className="px-4 py-1.5 rounded-lg text-[13px] font-bold text-zinc-400">Quarterly</button>
                           </div>
                        </div>

                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl text-[13px] font-black text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 transition-all">
                           <Plus weight="bold" />
                           Add Goal
                        </button>
                     </div>

                     <div className="flex flex-col items-center justify-center py-20 bg-white/40 dark:bg-zinc-900/40 rounded-[40px] border border-dashed border-zinc-200 dark:border-zinc-800">
                        <div className="relative mb-8">
                           <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900 blur-3xl opacity-30 rounded-full" />
                           <div className="size-28 rounded-full bg-white dark:bg-zinc-800 shadow-2xl flex items-center justify-center relative">
                              <FolderOpen className="size-12 text-blue-500" weight="duotone" />
                           </div>
                        </div>
                        <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100 mb-2">No active objectives</h3>
                        <p className="text-zinc-400 font-medium text-[14px] max-w-sm text-center mb-8">
                           Keep track of your professional goals and performance milestones.
                        </p>
                        <button className="px-8 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[14px] font-black shadow-sm hover:shadow-md transition-all">
                           Create first objective
                        </button>
                     </div>
                  </motion.div>
               )}

               {activeTab === "infos" && (
                  <motion.div
                     key="infos"
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="space-y-16 pb-20"
                  >
                     <div className="space-y-10">
                        <h3 className="text-[17px] font-black text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-3">
                           Work history
                           <span className="h-px flex-1 bg-zinc-50 dark:bg-zinc-800" />
                        </h3>

                        <div className="relative pl-8 space-y-12">
                           <div className="absolute left-0 top-3 bottom-0 w-px border-l-2 border-dashed border-zinc-100 dark:border-zinc-800" />

                           {PREVIOUS_HOSPITALS.map((h, i) => {
                              const isPresent = h.period.toLowerCase().includes("present");
                              return (
                                 <div key={i} className="relative group">
                                    {/* Animated Node */}
                                    <div className={cn(
                                       "absolute -left-10 top-0 size-4 rounded-full bg-white dark:bg-zinc-900 border-4 z-10 transition-all group-hover:scale-125",
                                       isPresent
                                          ? "border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]"
                                          : "border-zinc-200 dark:border-zinc-700"
                                    )}>
                                       {isPresent && (
                                          <span className="absolute inset-0 rounded-full animate-ping bg-indigo-500/30 -z-10" />
                                       )}
                                    </div>

                                    <div className="flex gap-6">
                                       {h.logo && (
                                          <div className="shrink-0 size-16 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all group-hover:shadow-md group-hover:scale-105 bg-white dark:bg-zinc-900 p-1">
                                             <img src={h.logo} className="w-full h-full object-cover rounded-xl" alt="Hospital Logo" />
                                          </div>
                                       )}
                                       <div className="flex flex-col gap-2 flex-1 pb-12">
                                          <div className="flex items-center justify-between gap-4">
                                             <div className="flex flex-col">
                                                <h4 className="text-[18px] font-black text-zinc-900 dark:text-zinc-100 tracking-tight leading-none group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                   {h.role}
                                                </h4>
                                                <p className="text-[14px] font-bold text-zinc-400 mt-1">{h.hospital} • {h.location}</p>
                                             </div>
                                             <span className={cn(
                                                "px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider h-fit",
                                                isPresent ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                                             )}>
                                                {h.period}
                                             </span>
                                          </div>

                                          {/* Tags Pills */}
                                          {(h as any).tags && (
                                             <div className="flex flex-wrap gap-1.5 mt-1">
                                                {(h as any).tags.map((tag: string) => (
                                                   <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800">
                                                      {tag}
                                                   </span>
                                                ))}
                                             </div>
                                          )}

                                          <p className="text-[14px] font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed mt-2 max-w-2xl bg-zinc-50/50 dark:bg-zinc-900/30 p-3 rounded-xl border border-zinc-50 dark:border-zinc-800/50">
                                             {h.desc}
                                          </p>

                                          {/* Accomplishment List */}
                                          {(h as any).achievements && (
                                             <div className="mt-4 space-y-2">
                                                <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest leading-none">Key Accomplishments</p>
                                                <ul className="grid grid-cols-1 gap-2">
                                                   {(h as any).achievements.map((item: string, idx: number) => (
                                                      <li key={idx} className="flex items-start gap-2.5 text-[13px] font-semibold text-zinc-600 dark:text-zinc-300">
                                                         <span className="size-1.5 rounded-full bg-indigo-500/40 mt-1.5 shrink-0" />
                                                         {item}
                                                      </li>
                                                   ))}
                                                </ul>
                                             </div>
                                          )}
                                       </div>
                                    </div>
                                 </div>
                              )
                           })}

                        </div>
                     </div>

                     <div className="space-y-10">
                        <h3 className="text-[17px] font-black text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-3">
                           Educational background
                           <span className="h-px flex-1 bg-zinc-50 dark:bg-zinc-800" />
                        </h3>

                        <div className="relative pl-8 space-y-12">
                           <div className="absolute left-0 top-3 bottom-0 w-px border-l-2 border-dashed border-zinc-100 dark:border-zinc-800" />

                           {EDUCATION.map((e, i) => (
                              <div key={i} className="relative group">
                                 <div className="absolute -left-10 top-0 size-4 rounded-full bg-white dark:bg-zinc-900 border-4 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] z-10 transition-transform group-hover:scale-125" />
                                 <div className="flex gap-4">
                                    {e.logo && (
                                       <div className="shrink-0 size-12 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm transition-transform group-hover:scale-105">
                                          <img src={e.logo} className="w-full h-full object-cover" alt="Education Logo" />
                                       </div>
                                    )}
                                    <div className="flex flex-col gap-1 flex-1">
                                       <div className="flex items-center justify-between">
                                          <h4 className="text-[17px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{e.degree}</h4>
                                          <span className="px-3 py-1 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-[11px] font-black text-zinc-400 group-hover:text-emerald-500 transition-colors uppercase tracking-widest">{e.period}</span>
                                       </div>
                                       <p className="text-[14px] font-semibold text-emerald-500/80">{e.institution} • {e.location}</p>
                                       <p className="text-[14px] font-medium text-zinc-400 leading-relaxed mt-2 max-w-xl">
                                          {e.desc}
                                       </p>
                                    </div>
                                 </div>

                              </div>
                           ))}
                        </div>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>

      </div>
   );
}
