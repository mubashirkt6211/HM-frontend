/**
 * Main Dashboard Page - Focused on the Overview (DashboardTab)
 */
import { DashboardTab } from "@/components/dashboard";

export function Dashboard({
  onProfileClick,
}: {
  onProfileClick?: () => void;
}) {
  void onProfileClick;

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <DashboardTab />
    </main>
  );
}

