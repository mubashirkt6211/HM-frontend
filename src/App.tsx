import { useState } from "react";
import { AppLayout } from "@/layouts/AppLayout"
import { Dashboard } from "@/pages/Dashboard"
import { CalendarPage } from "@/pages/CalendarPage"

type PageType = "dashboard" | "calender" | string;

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
      {currentPage === "dashboard" && (
        <Dashboard activeTab={activeDashboardTab} onTabChange={setActiveDashboardTab} />
      )}
    </AppLayout>
  );
}

export default App
