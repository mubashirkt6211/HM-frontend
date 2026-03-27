import { motion } from "motion/react";
import { ArrowSquareOut, Circle, SquaresFour, TrendUp, ShieldCheck, Files, FileText, DownloadSimple } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { PatientRecord } from "./types";
import { STATUS_CONFIG } from "./constants";

interface PatientProfileProps {
  patient: PatientRecord;
  onBack: () => void;
}

export function PatientProfile({ patient: p, onBack }: PatientProfileProps) {
  const cfg = STATUS_CONFIG[p.status];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm pt-6"
    >
      <div className="flex flex-col">
        {/* Header / Back Button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[13px] font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
          >
            <ArrowSquareOut className="w-4 h-4" />
            Back to Patients
          </button>
          <div className="flex items-center gap-2">
            <button className="px-4 py-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[12px] font-black hover:bg-zinc-700 dark:hover:bg-zinc-300 transition">
              Edit Record
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Side: Avatar & Basic Info */}
          <div className="lg:col-span-4 border-r border-zinc-100 dark:border-zinc-800 p-8 flex flex-col items-center text-center">
            <div className="relative w-32 h-32 mb-5">
              <img
                src={p.avatar}
                alt={p.name}
                className="w-32 h-32 rounded-3xl object-cover ring-4 ring-zinc-50 dark:ring-zinc-800 shadow-xl"
              />
            </div>
            <h2 className="text-[24px] font-black text-zinc-900 dark:text-zinc-100 leading-tight">{p.name}</h2>
            <p className="text-[13px] font-mono text-zinc-400 mt-1 uppercase tracking-tighter">{p.id}</p>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className={cn("inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black border", cfg.color, cfg.border)}>
                <Circle size={8} weight="fill" />
                {p.status}
              </span>
              <span className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[11px] font-bold">
                {p.type}
              </span>
            </div>

            {/* Summary stats below avatar */}
            <div className="grid grid-cols-2 gap-4 w-full mt-8">
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Gender</p>
                <p className="text-[15px] font-black text-zinc-900 dark:text-zinc-100">{p.gender === 'M' ? 'Male' : 'Female'}</p>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Age</p>
                <p className="text-[15px] font-black text-zinc-900 dark:text-zinc-100">{p.age} Yrs</p>
              </div>
            </div>
          </div>

          {/* Right Side: Details & Vitals */}
          <div className="lg:col-span-8 p-8 space-y-8">
            {/* Vitals Section */}
            <div>
              <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">Current Vitals</h4>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { label: "Heart Rate", value: `${p.heartRate}`, unit: "bpm", icon: TrendUp, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/10" },
                  { label: "Temperature", value: `${p.temp}°`, unit: "Celsius", icon: TrendUp, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/10" },
                  { label: "Blood Pressure", value: p.bp, unit: "mmHg", icon: ShieldCheck, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/10" },
                ].map(v => {
                  const Icon = v.icon;
                  return (
                    <div key={v.label} className={cn("rounded-3xl p-5 flex flex-col items-center gap-2 border border-transparent transition-all hover:border-zinc-100 dark:hover:border-zinc-800", v.bg)}>
                      <Icon weight="light" className={cn("w-6 h-6", v.color)} />
                      <div className="text-center">
                        <p className="text-[20px] font-black text-zinc-900 dark:text-zinc-100 leading-none">{v.value}</p>
                        <p className="text-[10px] font-bold text-zinc-400 mt-1">{v.unit}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Appointment & History */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">Upcoming Visit</h4>
                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-3xl p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 flex items-center justify-center shadow-sm">
                    <SquaresFour weight="light" className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[15px] font-black text-blue-900 dark:text-blue-100">{p.appointment}</p>
                    <p className="text-[11px] font-bold text-blue-400">{p.type} Consultation</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">Clinical Notes</h4>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl p-6 min-h-[100px]">
                  <p className="text-[13px] text-zinc-400 italic leading-relaxed">
                    Patient reported slight fatigue during morning hours. Prescribed routine checkup and blood work for further analysis.
                  </p>
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[11px] font-medium text-zinc-400 uppercase tracking-[0.2em]">Documents & Reports</h4>
                <button className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition">
                  <TrendUp className="w-3.5 h-3.5" /> Upload New
                </button>
              </div>

              {p.documents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {p.documents.map(doc => (
                    <div key={doc.id} className="group/doc flex items-center gap-3 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 group-hover/doc:bg-white dark:group-hover/doc:bg-zinc-900 transition-colors">
                        {doc.type === 'Scan' ? (
                          <Files weight="light" className="w-5 h-5 text-violet-500" />
                        ) : (
                          <FileText weight="light" className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100 truncate">{doc.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-medium text-zinc-400">{doc.type}</span>
                          <span className="w-1 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                          <span className="text-[10px] font-medium text-zinc-400">{doc.size}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover/doc:opacity-100 transition-opacity">
                        <button title="View Document" className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition text-zinc-500 dark:text-zinc-400">
                          <ArrowSquareOut className="w-4 h-4" />
                        </button>
                        <button title="Download" className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition text-zinc-500 dark:text-zinc-400">
                          <DownloadSimple className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 px-4 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-3xl bg-zinc-50/50 dark:bg-zinc-800/20">
                  <FileText size={32} weight="light" className="text-zinc-300 mb-2" />
                  <p className="text-[12px] font-medium text-zinc-400">No documents found for this patient</p>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="pt-4 flex items-center justify-end gap-3">
              <button className="px-6 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-[13px] font-black hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">
                Schedule Next Visit
              </button>
              <button className="px-8 py-3 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[13px] font-black hover:bg-zinc-700 dark:hover:bg-zinc-300 transition shadow-lg shadow-zinc-200 dark:shadow-none">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
