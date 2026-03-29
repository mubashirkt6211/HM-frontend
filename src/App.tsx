import { useState } from "react";
import { AppLayout } from "@/layouts/AppLayout"
import { Dashboard } from "@/pages/Dashboard"
import { CalendarPage } from "@/pages/CalendarPage"
import { MessagesPage } from "@/pages/MessagesPage"
import { PatientsPage } from "@/pages/PatientsPage"
import { TasksPage } from "@/pages/TasksPage"
import { DoctorsPage } from "@/pages/DoctorsPage"
import { RevenuePage } from "@/pages/RevenuePage"

type PageType = "dashboard" | "calender" | "calendar" | "messages" | "patients" | "tasks" | "doctors" | "revenue" | string;

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
      {currentPage === "messages" && <MessagesPage />}
      {currentPage === "patients" && <PatientsPage />}
      {currentPage === "tasks" && <TasksPage />}
      {currentPage === "doctors" && <DoctorsPage />}
      {currentPage === "revenue" && <RevenuePage />}
      {currentPage === "dashboard" && (
        <Dashboard activeTab={activeDashboardTab} onTabChange={setActiveDashboardTab} />
      )}
    </AppLayout>
  );
}

export default App
