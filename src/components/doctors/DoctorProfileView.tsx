"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  CaretLeft,
  Globe,
  Camera,
  Star,
  Target, FileText, Quotes, CaretDown,
  Plus, FolderOpen
} from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Doctor } from "@/pages/DoctorsPage";

interface DoctorProfileViewProps {
  doctor: Doctor;
  onBack: () => void;
}

// ─── MOCK DATA ────────────────────────────────────────────────

const PREVIOUS_HOSPITALS = [
  {
    role: "Senior Cardiologist",
    hospital: "Mayo Clinic",
    location: "Rochester, MN",
    period: "2018 – Present",
    desc: "Lead physician for the advanced cardiac care unit, managing complex surgical cases.",
    logo: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=100&h=100&auto=format&fit=crop",
  },
  {
    role: "Resident Practitioner",
    hospital: "Cleveland Clinic",
    location: "Cleveland, OH",
    period: "2012 – 2018",
    desc: "Specialized in non-invasive diagnostic procedures.",
    logo: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=100&h=100&auto=format&fit=crop",
  },
];

const EDUCATION = [
  {
    degree: "Doctor of Medicine (MD)",
    institution: "Johns Hopkins University",
    location: "Baltimore, MD",
    period: "2006 – 2010",
    desc: "Graduated with top honors, specializing in cardiovascular research.",
    logo: "https://plus.unsplash.com/premium_photo-1663047248106-1bc7d8969ca4?q=80&w=100&h=100&auto=format&fit=crop",
  },
];

export function DoctorProfileView({ doctor, onBack }: DoctorProfileViewProps) {
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
          Back to Doctors
        </button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="size-24 rounded-full overflow-hidden border-4 border-white dark:border-zinc-800 shadow-sm transition-transform hover:scale-105 duration-500">
                 <img src={doctor.avatar} className="w-full h-full object-cover" alt="Doctor" />
              </div>
              <button className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-7 rounded-full bg-zinc-900 text-white flex items-center justify-center shadow-md border-2 border-white transition-all hover:bg-zinc-800">
                 <Camera className="size-3.5" weight="fill" />
              </button>
            </div>

            <div className="space-y-1.5 pt-1">
               <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                  {doctor.name}
               </h1>
               <div className="flex items-center gap-3 text-[14px]">
                  <span className="flex items-center gap-1.5 font-bold text-blue-500">
                     <span className="size-1.5 rounded-full bg-blue-500" />
                     R&D Product
                  </span>
                  <span className="font-bold text-zinc-400">Senior {doctor.specialty} Specialist</span>
                  <div className="w-px h-4 bg-zinc-100 dark:bg-zinc-800" />
                  <div className="flex items-center gap-1.5">
                     <Star className="size-4 fill-amber-400 text-amber-400" weight="fill" />
                     <span className="font-black text-zinc-900 dark:text-zinc-100">{doctor.rating}</span>
                  </div>
               </div>
            </div>
          </div>

          <button className="px-6 py-2.5 h-11 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[13px] font-bold shadow-lg hover:shadow-zinc-200 transition-all">
             Download PDF
          </button>
        </div>
      </div>

      {/* ── TABS NAVIGATION (Pill Style) ── */}
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
         {/* Achievement Progress Card */}
         <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center justify-between h-[180px] group transition-all hover:shadow-xl">
            <div className="flex flex-col justify-between h-full py-2">
               <div>
                 <h4 className="text-[13px] font-black text-zinc-400 uppercase tracking-widest mb-1">Achievement</h4>
                 <p className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">76%</p>
               </div>
               
               <div className="flex flex-col gap-1">
                 <p className="text-[11px] font-bold text-zinc-400">Last update :</p>
                 <p className="text-[11px] font-black text-blue-500 uppercase tracking-tight leading-none">Today at 5:56pm</p>
               </div>
            </div>

            {/* Radial Chart (REUI Matching Style) */}
            <div className="relative size-28 shrink-0">
               <svg viewBox="0 0 100 100" className="size-full transform -rotate-90 overflow-visible">
                  <defs>
                     <filter id="reui-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                     </filter>
                  </defs>
                  {/* Track */}
                  <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="10" className="text-zinc-50 dark:text-zinc-800/50" />
                  {/* Progress */}
                  <motion.circle 
                    cx="50" cy="50" r="44" 
                    fill="none" stroke="#3b82f6" strokeWidth="12" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 44}
                    initial={{ strokeDashoffset: 2 * Math.PI * 44 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 44 * (1 - 0.76) }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    filter="url(#reui-glow)"
                  />
               </svg>
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="size-10 rounded-full bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center border border-zinc-100 dark:border-zinc-700">
                     <Target className="size-5 text-blue-500" weight="fill" />
                  </div>
               </div>
            </div>
         </div>

         {/* Bonus Earned Card */}
         <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between h-[180px] group transition-all hover:shadow-xl">
            <div>
               <h4 className="text-[13px] font-black text-zinc-400 uppercase tracking-widest mb-1">Bonus Earned</h4>
               <p className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">
                  <span className="text-purple-500">€2,450</span> <span className="text-zinc-300 font-bold ml-1">/ 3200</span>
               </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-50 dark:border-zinc-800">
               <p className="text-[14px] font-bold text-zinc-400">Objectives Met</p>
               <span className="px-3 py-1 bg-zinc-50 dark:bg-zinc-800 rounded-full text-[12px] font-black text-zinc-900 dark:text-zinc-100">12 / 15</span>
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
                  {/* Filter / Action Bar */}
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="flex bg-zinc-50 dark:bg-zinc-900 rounded-xl p-1 border border-zinc-100 dark:border-zinc-800">
                           <button className="px-4 py-1.5 rounded-lg text-[13px] font-bold text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 shadow-sm">H1</button>
                           <button className="px-4 py-1.5 rounded-lg text-[13px] font-bold text-zinc-400">H2</button>
                        </div>
                        <div className="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 text-[13px] font-bold text-zinc-500">
                           Annual review
                        </div>
                        <button className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl text-[13px] font-bold">
                           2025 <CaretDown />
                        </button>
                     </div>

                     <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl text-[13px] font-black text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 transition-all">
                        <Plus weight="bold" />
                        Add objective
                     </button>
                  </div>

                  {/* Empty State */}
                  <div className="flex flex-col items-center justify-center py-20 bg-white/40 dark:bg-zinc-900/40 rounded-[40px] border border-dashed border-zinc-200 dark:border-zinc-800">
                     <div className="relative mb-8">
                        <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900 blur-3xl opacity-30 rounded-full" />
                        <div className="size-28 rounded-full bg-white dark:bg-zinc-800 shadow-2xl flex items-center justify-center relative">
                           <FolderOpen className="size-12 text-blue-500" weight="duotone" />
                        </div>
                     </div>
                     <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100 mb-2">No objectives established yet</h3>
                     <p className="text-zinc-400 font-medium text-[14px] max-w-sm text-center mb-8">
                        Create your first objective to align your team and track performance.
                     </p>
                     <button className="px-8 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[14px] font-black shadow-sm hover:shadow-md transition-all">
                        Create now!
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
                  {/* Experience Timeline */}
                  <div className="space-y-10">
                    <h3 className="text-[17px] font-black text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-3">
                       Work experience
                       <span className="h-px flex-1 bg-zinc-50 dark:bg-zinc-800" />
                    </h3>
                    
                    <div className="relative pl-8 space-y-12">
                      <div className="absolute left-0 top-3 bottom-0 w-px border-l-2 border-dashed border-zinc-100 dark:border-zinc-800" />
                      
                      {PREVIOUS_HOSPITALS.map((h, i) => (
                        <div key={i} className="relative group">
                          {/* Node */}
                          <div className="absolute -left-10 top-0 size-4 rounded-full bg-white dark:bg-zinc-900 border-4 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] z-10 transition-transform group-hover:scale-125" />
                          
                          <div className="flex flex-col gap-1">
                             <div className="flex items-center justify-between">
                               <h4 className="text-[17px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{h.role}</h4>
                               <span className="px-3 py-1 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-[11px] font-black text-zinc-400 group-hover:text-blue-500 transition-colors uppercase tracking-widest">{h.period}</span>
                             </div>
                             <p className="text-[14px] font-semibold text-blue-500/80">{h.hospital} • {h.location}</p>
                             <p className="text-[14px] font-medium text-zinc-400 leading-relaxed mt-2 max-w-xl">
                                {h.desc}
                             </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education Timeline */}
                  <div className="space-y-10">
                    <h3 className="text-[17px] font-black text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-3">
                       Education
                       <span className="h-px flex-1 bg-zinc-50 dark:bg-zinc-800" />
                    </h3>
                    
                    <div className="relative pl-8 space-y-12">
                      <div className="absolute left-0 top-3 bottom-0 w-px border-l-2 border-dashed border-zinc-100 dark:border-zinc-800" />
                      
                      {EDUCATION.map((e, i) => (
                        <div key={i} className="relative group">
                          {/* Node */}
                          <div className="absolute -left-10 top-0 size-4 rounded-full bg-white dark:bg-zinc-900 border-4 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] z-10 transition-transform group-hover:scale-125" />
                          
                          <div className="flex flex-col gap-1">
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
