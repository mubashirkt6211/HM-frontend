/**
 * Main Dashboard Page - Orchestrates all dashboard tabs
 */
import { motion, AnimatePresence } from "motion/react";
import {
  SquaresFour,
  Users,
  Stethoscope,
  Star,
  FileText,
  DownloadSimple,
  Camera,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  DashboardTab,
  TeamTab,
  PatientTab,
  DocumentsTab,
  ReviewsTab,
  TabItem,
} from "@/components/dashboard";
import claraAvatar from "@/assets/clara_avatar.png";

const TABS = [
  { icon: SquaresFour, label: "Dashboard" },
  { icon: Users, label: "Team" },
  { icon: Stethoscope, label: "Patient" },
  { icon: FileText, label: "Documents" },
  { icon: Star, label: "Reviews" },
];

export function Dashboard({
  activeTab,
  onTabChange,
  onProfileClick
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onProfileClick: () => void;
}) {
  const renderTabContent = () => {
    switch (activeTab) {
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
        <div
          className="relative group cursor-pointer"
          onClick={onProfileClick}
        >
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
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Clara Lefèvre
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                R&D Product
              </span>
            </div>
            <span className="text-[14px] font-medium text-zinc-500">
              Product Manager
            </span>
          </div>
        </div>
      </div>

      {/* 2. Tab Navigation & Action */}
      <div className="flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800/60 pb-1">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <TabItem
              key={tab.label}
              icon={tab.icon}
              label={tab.label}
              active={activeTab === tab.label}
              onClick={() => onTabChange(tab.label)}
            />
          ))}
        </div>
        <Button className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[13px] font-bold shadow-xl shadow-zinc-200 dark:shadow-none hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-95">
          Download PDF <DownloadSimple />
        </Button>
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
