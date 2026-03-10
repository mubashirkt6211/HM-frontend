/**
 * Documents Tab - Manage files and documents
 */
import {
  FolderOpen,
  FileText,
  Plus,
  LayoutGrid,
  Filter,
  File,
  Download,
  Trash2,
  Info,
  TrendingUp,
  HardDrive,
  Clock,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Card } from "./components.tsx";

interface Document {
  name: string;
  size: string;
  date: string;
  type: string;
  color: string;
}

export function DocumentsTab() {


  const docStats = [
    { label: "Total Documents", value: "1,420", icon: FileText, color: "blue", change: "+124" },
    { label: "Storage Used", value: "68%", icon: HardDrive, color: "emerald", change: "45.2 GB" },
    { label: "Recent Files", value: "24", icon: TrendingUp, color: "orange", change: "This week" },
    { label: "Last Updated", value: "Today", icon: Clock, color: "purple", change: "5:30 PM" },
  ];

  return (
    <div className="space-y-8">
      {/* Document Statistics */}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
              <p className="text-[12px] text-zinc-400 mt-1">
                Your most recently accessed documents
              </p>
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
              <div
                key={i}
                className="flex items-center justify-between group p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-all border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800"
              >
                <div className="flex items-center gap-5">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                      doc.color
                    )}
                  >
                    <File className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100">
                      {doc.name}
                    </h5>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[12px] text-zinc-400 font-medium">
                        {doc.size}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                      <span className="text-[12px] text-zinc-400">
                        {doc.date}
                      </span>
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
                className="h-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full shadow-[0_0_12px_rgba(79,70,229,0.3)]"
              />
            </div>
            <div className="flex items-center justify-between mt-5">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                  Used
                </span>
                <span className="text-[15px] font-black text-zinc-900 dark:text-zinc-100">
                  12.4 GB
                </span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                  Total
                </span>
                <span className="text-[15px] font-bold text-zinc-500">
                  20 GB
                </span>
              </div>
            </div>
            <button className="w-full mt-8 py-3.5 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-[13px] hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-zinc-200 dark:shadow-none">
              Upgrade Storage
            </button>
          </div>
        </Card>
        <div className="p-8 rounded-[40px] bg-linear-to-tr from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-100/50 dark:border-amber-900/20 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-5">
              <Info className="w-5 h-5 text-amber-600" />
            </div>
            <h5 className="font-bold text-amber-900 dark:text-amber-400 text-[16px] tracking-tight">
              Security & Tips
            </h5>
            <p className="text-[13px] text-amber-700/80 dark:text-amber-500/80 mt-2 leading-relaxed font-medium">
              Keep your medical files encrypted. Automatic end-to-end backups are
              enabled for all Premium users.
            </p>
            <button className="mt-6 text-[12px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest hover:underline">
              Learn More
            </button>
          </div>
          <Info className="absolute -right-5 -bottom-5 w-32 h-32 text-amber-500/5 group-hover:scale-110 transition-transform" />
        </div>
      </div>
    </div>
    </div>
  );
}