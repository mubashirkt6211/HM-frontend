import { useState } from "react";
import { AppLayout } from "@/layouts/AppLayout"
import { Dashboard } from "@/pages/Dashboard"
import { CalendarPage } from "@/pages/CalendarPage"
import { MessagesPage } from "@/pages/MessagesPage"
import { PatientsPage } from "@/pages/PatientsPage"
import { TasksPage } from "@/pages/TasksPage"
import { DoctorsPage } from "@/pages/DoctorsPage"
import { RevenuePage } from "@/pages/RevenuePage"
import { ProfilePage } from "@/pages/ProfilePage"
import { NursePage } from "@/pages/NursePage"
import { PrivilegesPage } from "@/pages/PrivilegesPage"
import { UserRole } from "@/models/user";



type PageType = "dashboard" | "calender" | "calendar" | "messages" | "patients" | "tasks" | "doctors" | "nurse" | "revenue" | "profile" | "privillage" | string;


function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard");
  const [activeDashboardTab, setActiveDashboardTab] = useState("Dashboard");
  const [userRole, setUserRole] = useState<UserRole>(UserRole.ADMIN);


  const isCalendar = currentPage === "calendar" || currentPage === "calender";

  return (
    <AppLayout
      currentPage={currentPage}
      onPageChange={(page) => setCurrentPage(page as PageType)}
      isFullPage={false}
      onTabChange={setActiveDashboardTab}
      activeTab={activeDashboardTab}
      userRole={userRole}
      setUserRole={setUserRole}
    >

      {isCalendar && <CalendarPage />}
      {currentPage === "messages" && <MessagesPage />}
      {currentPage === "patients" && <PatientsPage />}
      {currentPage === "tasks" && <TasksPage />}
      {currentPage === "doctors" && <DoctorsPage />}
      {currentPage === "nurse" && <NursePage />}
      {currentPage === "revenue" && <RevenuePage />}
      {currentPage === "privillage" && <PrivilegesPage />}

      {currentPage === "profile" && <ProfilePage onBack={() => setCurrentPage("dashboard")} />}
      {currentPage === "dashboard" && (
        <Dashboard 
          activeTab={activeDashboardTab} 
          onTabChange={setActiveDashboardTab} 
          onProfileClick={() => setCurrentPage("profile")}
        />
      )}
    </AppLayout>
  );
}

export default App
