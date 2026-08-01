/**
 * Todo Page - renamed from the old dashboard page.
 */
import { DashboardTab } from "@/components/dashboard";

export function TodoPage({
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

