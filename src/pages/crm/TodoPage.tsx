/**
 * Todo Page - renamed from the old dashboard page.
 */
import { DashboardTab } from "@/components/dashboard";
import { ArrowLeft } from "@phosphor-icons/react";

export function TodoPage({
  onProfileClick,
  onBack,
  onNavigate,
  pageHistory,
}: {
  onProfileClick?: () => void;
  onBack?: () => void;
  onNavigate?: (page: string) => void;
  pageHistory?: string[];
}) {
  void onProfileClick;
  void onNavigate;

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      {pageHistory && pageHistory.length > 1 && (
        <div className="pt-4 px-6 md:px-10">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors w-fit cursor-pointer"
          >
            <ArrowLeft weight="bold" size={14} />
            Back to {pageHistory[pageHistory.length - 2] === "dashboard" ? "Dashboard" : pageHistory[pageHistory.length - 2].charAt(0).toUpperCase() + pageHistory[pageHistory.length - 2].slice(1)}
          </button>
        </div>
      )}
      <DashboardTab />
    </main>
  );
}

