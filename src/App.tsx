import { useState } from "react";
import { AppLayout } from "@/layouts/AppLayout"
import { Dashboard } from "@/pages/Dashboard"

type PageType = "dashboard" | "calendar";

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard");

  return (
    <AppLayout currentPage={currentPage} onPageChange={(page) => setCurrentPage(page as PageType)} isFullPage={currentPage === "calendar"}>
      {currentPage === "dashboard" && <Dashboard />}
    </AppLayout>
  );
}

export default App
