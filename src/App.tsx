import { useState } from "react";
import { AppLayout } from "@/layouts/AppLayout"
import { Dashboard } from "@/pages/Dashboard"

type PageType = "dashboard" | "calendar";

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard");
  const [activeDashboardTab, setActiveDashboardTab] = useState("Dashboard");

  return (
    <AppLayout 
      currentPage={currentPage} 
      onPageChange={(page) => setCurrentPage(page as PageType)} 
      isFullPage={currentPage === "calendar"}
      onTabChange={setActiveDashboardTab}
    >
      {currentPage === "dashboard" && (
        <Dashboard activeTab={activeDashboardTab} onTabChange={setActiveDashboardTab} />
      )}
    </AppLayout>
  );
}

export default App
