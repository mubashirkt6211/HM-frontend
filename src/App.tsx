import { useState } from "react";
import { AppLayout } from "@/layouts/AppLayout"
import { Dashboard } from "@/pages/Dashboard"
import { CalendarPage } from "@/pages/CalendarPage"
import { MessagesPage } from "@/pages/MessagesPage"

type PageType = "dashboard" | "calender" | "calendar" | "notifications" | string;

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard");
  const [activeDashboardTab, setActiveDashboardTab] = useState("Dashboard");

  const isCalendar = currentPage === "calendar" || currentPage === "calender";

  return (
    <AppLayout
      currentPage={currentPage}
      onPageChange={(page) => setCurrentPage(page as PageType)}
      isFullPage={false}
      onTabChange={setActiveDashboardTab}
      activeTab={activeDashboardTab}
    >
      {isCalendar && <CalendarPage />}
      {currentPage === "notifications" && <MessagesPage />}
      {currentPage === "dashboard" && (
        <Dashboard activeTab={activeDashboardTab} onTabChange={setActiveDashboardTab} />
      )}
    </AppLayout>
  );
}

export default App
