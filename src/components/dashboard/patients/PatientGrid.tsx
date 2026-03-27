import { motion } from "motion/react";
import { Clock, DotsThree } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { PatientRecord } from "./types";
import { STATUS_CONFIG, SOURCE_ICONS } from "./constants";

interface PatientGridProps {
  patients: PatientRecord[];
  onOpen: (p: PatientRecord) => void;
}

export function PatientGrid({ patients, onOpen }: PatientGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
      {patients.map((p, i) => {
        const cfg = STATUS_CONFIG[p.status];
        const SourceIcon = SOURCE_ICONS[p.source] || SOURCE_ICONS.Direct;

        return (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => onOpen(p)}
            className="group relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="relative w-12 h-12">
                <img
                  src={p.avatar}
                  alt={p.name}
                  className="w-full h-full rounded-2xl object-cover ring-2 ring-zinc-50 dark:ring-zinc-800"
                />
              </div>
              <div className={cn(
                "w-8 h-8 flex items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-800 transition-colors group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-zinc-100 dark:group-hover:text-zinc-900",
                p.source === 'Google' ? 'text-blue-500' :
                  p.source === 'Facebook' ? 'text-blue-600' :
                    p.source === 'Instagram' ? 'text-pink-500' :
                      p.source === 'LinkedIn' ? 'text-blue-700' :
                        p.source === 'Dribbble' ? 'text-pink-600' : 'text-zinc-400'
              )}>
                <SourceIcon weight="fill" className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-[15px] font-medium text-zinc-900 dark:text-zinc-100 truncate">{p.name}</h3>
              <p className="text-[13px] text-zinc-400 truncate">{p.subject}</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium",
                cfg.color
              )}>
                {p.status}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400">
                <Clock className="w-3.5 h-3.5" /> {p.createdAt}
              </span>
            </div>

            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <DotsThree size={20} className="text-zinc-400" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
