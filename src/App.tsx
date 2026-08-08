import { useState } from "react";
import { AppLayout } from "@/layouts/AppLayout";
import { Dashboard } from "@/pages/crm/Dashboard";
import { TodoPage } from "@/pages/crm/TodoPage";
import { CalendarPage } from "@/pages/shared/CalendarPage";
import { MessagesPage } from "@/pages/crm/MessagesPage";
import { PatientsPage } from "@/pages/healthcare/PatientsPage";
import { LeadsPage } from "@/pages/crm/LeadsPage";
import { PipelinePage } from "@/pages/crm/PipelinePage";
import { TasksPage } from "@/pages/crm/TasksPage";
import { DoctorsPage } from "@/pages/healthcare/DoctorsPage";
import { RevenuePage } from "@/pages/crm/RevenuePage";
import { ProfilePage } from "@/pages/crm/ProfilePage";
import { CompanySetupPage } from "@/pages/crm/CompanySetupPage";
import { NursePage } from "@/pages/healthcare/NursePage";
import { PrivilegesPage } from "@/pages/crm/PrivilegesPage";
import { ReportsPage } from "@/pages/crm/ReportsPage";
import { ComingSoonPage } from "@/pages/crm/ComingSoonPage";
import { EmailPage } from "@/pages/crm/EmailPage";
import { ItineraryBuilderPage } from "@/pages/crm/ItineraryBuilderPage";
import { ServiceSetupPage } from "@/pages/crm/ServiceSetupPage";
import { CrmConfigPage } from "@/pages/crm/CrmConfigPage";
import { Hammer, Tooth, Sparkle, TreeStructure, User, Users, Star, Megaphone, ClipboardText, Funnel, Buildings, Briefcase, Handshake, ChartLineUp, ShieldCheck, ClockClockwise } from "@phosphor-icons/react";
import { UserRole } from "@/models/user";

type PageType = "dashboard" | "todo" | "calendar" | "itinerary-builder" | "messages" | "patients" | "analytics" | "tasks" | "doctors" | "nurse" | "revenue" | "profile" | "company-setup" | "privileges" | "reports" | "service-setup" | "crm-config" | string;

const normalizePageId = (page: string): PageType => {
  switch (page) {
    case "calender":
      return "calendar";
    case "privillage":
      return "privileges";
    case "orthopedicts":
      return "orthopedics";
    default:
      return page as PageType;
  }
};

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard");
  const [activeDashboardTab, setActiveDashboardTab] = useState("Dashboard");
  const [userRole, setUserRole] = useState<UserRole>(UserRole.ADMIN);

  const normalizedCurrentPage = normalizePageId(currentPage);

  const renderPage = () => {
    switch (normalizedCurrentPage) {
      case "dashboard":
        return <Dashboard />;
      case "messages":
        return <MessagesPage />;
      case "patients":
        return <PatientsPage />;
      case "leads":
        return <LeadsPage />;
      case "pipeline":
        return <PipelinePage />;
      case "tasks":
        return <TasksPage />;
      case "doctors":
        return <DoctorsPage />;
      case "nurse":
        return <NursePage />;
      case "revenue":
        return <RevenuePage />;
      case "privileges":
        return <PrivilegesPage />;
      case "reports":
        return <ReportsPage />;
      case "service-setup":
        return <ServiceSetupPage />;
      case "crm-config":
        return <CrmConfigPage />;
      case "emails":
        return <EmailPage />;
      case "profile":
        return <ProfilePage onBack={() => setCurrentPage("dashboard")} />;
      case "company-setup":
        return <CompanySetupPage onBack={() => setCurrentPage("dashboard")} />;
      case "todo":
        return <TodoPage />;
      case "analytics":
        return <ComingSoonPage title="Forecast" icon={Funnel} />;
      case "accounts":
        return <ComingSoonPage title="Accounts" icon={Briefcase} />;
      case "deals":
        return <ComingSoonPage title="Deals" icon={Handshake} />;
      case "open-deals":
        return <ComingSoonPage title="Open Deals" icon={ChartLineUp} />;
      case "won-deals":
        return <ComingSoonPage title="Won Deals" icon={ShieldCheck} />;
      case "lost-deals":
        return <ComingSoonPage title="Lost Deals" icon={ClockClockwise} />;
      case "team":
        return <ComingSoonPage title="Contacts" icon={Users} />;
      case "notes":
        return <ComingSoonPage title="Prospects" icon={Sparkle} />;
      case "receptionist":
        return <ComingSoonPage title="Receptionist" icon={User} />;
      case "uk-eu-companies":
        return <ComingSoonPage title="Hot Leads" icon={Star} />;
      case "b2b-building":
        return <ComingSoonPage title="Priority Accounts" icon={Star} />;
      case "partnership":
        return <ComingSoonPage title="Partnerships" icon={Star} />;
      case "crm-template":
        return <ComingSoonPage title="Meeting Template" icon={Star} />;
      case "clients":
        return <ComingSoonPage title="Companies" icon={Buildings} />;
      case "contacts":
        return <ComingSoonPage title="Contacts" icon={Users} />;
      case "people":
        return <ComingSoonPage title="People" icon={Users} />;
      case "sales-navigator":
        return <ComingSoonPage title="Campaigns" icon={Megaphone} />;
      case "emails-marketing-agency":
        return <ComingSoonPage title="Sequences" icon={ClipboardText} />;
      case "automations":
        return <ComingSoonPage title="Automations" icon={Sparkle} />;
      case "workflows":
        return <ComingSoonPage title="Workflows" icon={TreeStructure} />;
      case "orthopedics":
        return <ComingSoonPage title="Orthopedics Registry" icon={Hammer} />;
      case "orthodontics":
        return <ComingSoonPage title="Orthodontics Registry" icon={Tooth} />;
      case "calendar":
        return <CalendarPage />;
      case "itinerary-builder":
        return <ItineraryBuilderPage />;
      default:
        return <ComingSoonPage title="Coming Soon" />;
    }
  };

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
      {renderPage()}
    </AppLayout>
  );
}

export default App;
