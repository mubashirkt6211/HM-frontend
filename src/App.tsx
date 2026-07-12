import { useState } from "react";
import { AppLayout } from "@/layouts/AppLayout"
import { Dashboard } from "@/pages/Dashboard"
import { CalendarPage } from "@/pages/CalendarPage"
import { MessagesPage } from "@/pages/MessagesPage"
import { PatientsPage } from "@/pages/PatientsPage"
import { LeadsPage } from "@/pages/LeadsPage"
import { TasksPage } from "@/pages/TasksPage"
import { DoctorsPage } from "@/pages/DoctorsPage"
import { RevenuePage } from "@/pages/RevenuePage"
import { ProfilePage } from "@/pages/ProfilePage"
import { NursePage } from "@/pages/NursePage"
import { PrivilegesPage } from "@/pages/PrivilegesPage"
import { ReportsPage } from "@/pages/ReportsPage"
import { ComingSoonPage } from "@/pages/ComingSoonPage"
import { EmailPage } from "@/pages/EmailPage"
import { Hammer, Tooth } from "@phosphor-icons/react"
import { UserRole } from "@/models/user";



type PageType = "dashboard" | "calender" | "calendar" | "messages" | "patients" | "analytics" | "tasks" | "doctors" | "nurse" | "revenue" | "profile" | "privillage" | "reports" | "orthopedics" | "orthodontics" | "emails" | string;


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
      {currentPage === "leads" && <LeadsPage />}
      {currentPage === "tasks" && <TasksPage />}
      {currentPage === "doctors" && <DoctorsPage />}
      {currentPage === "nurse" && <NursePage />}
      {currentPage === "revenue" && <RevenuePage />}
      {currentPage === "privillage" && <PrivilegesPage />}
      {currentPage === "reports" && <ReportsPage />}
      {currentPage === "emails" && <EmailPage />}
      {currentPage === "orthopedics" && <ComingSoonPage title="Orthopedics Registry" icon={Hammer} />}
      {currentPage === "orthopedicts" && <ComingSoonPage title="Orthopedics Registry" icon={Hammer} />}
      {currentPage === "orthodontics" && <ComingSoonPage title="Orthodontics Registry" icon={Tooth} />}

      {currentPage === "profile" && <ProfilePage onBack={() => setCurrentPage("dashboard")} />}
      {currentPage === "dashboard" && (
        <Dashboard
          onProfileClick={() => setCurrentPage("profile")}
        />
      )}
    </AppLayout>
  );
}

export default App
