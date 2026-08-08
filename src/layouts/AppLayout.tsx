import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { SiteHeader } from "@/components/SiteHeader"
import { UserRole } from "@/models/user"


export function AppLayout({
    children,
    currentPage = "dashboard",
    onPageChange,
    onTabChange,
    activeTab,
    isFullPage = false,
    userRole,
    setUserRole
}: {
    children: React.ReactNode;
    currentPage?: string;
    onPageChange?: (page: string) => void;
    onTabChange?: (tab: string) => void;
    activeTab?: string;
    isFullPage?: boolean;
    userRole?: UserRole;
    setUserRole?: (role: UserRole) => void;
}) {

    // Full page layout for calendar
    if (isFullPage) {
        return (
            <div className="flex min-h-screen w-full max-w-full overflow-x-hidden bg-[#f6f6f6] dark:bg-zinc-900">
                <SidebarProvider className="flex w-full min-h-0 min-w-0 max-w-full overflow-x-hidden">
                    <AppSidebar currentPage={currentPage} onPageChange={onPageChange} userRole={userRole} />
                    <SidebarInset className="bg-transparent flex-1 flex flex-col p-0 min-w-0 max-w-full overflow-x-hidden">

                        {children}
                    </SidebarInset>
                </SidebarProvider>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen w-full max-w-full overflow-x-hidden bg-[#f6f6f6] dark:bg-zinc-900">
            <SidebarProvider className="flex w-full min-h-0 min-w-0 max-w-full overflow-x-hidden">
                <AppSidebar currentPage={currentPage} onPageChange={onPageChange} userRole={userRole} />
                <SidebarInset className="bg-transparent flex-1 flex flex-col p-2 pl-0 md:pl-0 min-w-0 max-w-full overflow-x-hidden">

                    <main className="flex-1 mt-4 bg-white dark:bg-zinc-950 rounded-4xl shadow-sm ring-1 ring-zinc-200/50 dark:ring-zinc-800/50 flex flex-col relative min-w-0 max-w-full overflow-x-hidden">
                        <SiteHeader
                            onPageChange={onPageChange}
                            onTabChange={onTabChange}
                            currentPage={currentPage}
                            activeTab={activeTab}
                            userRole={userRole}
                            setUserRole={setUserRole}
                        />

                        <div className={`flex-1 w-full min-w-0 max-w-full overflow-x-hidden ${["dashboard", "doctors", "privileges", "emails", "leads"].includes(currentPage) ? "px-0 pb-6" : "px-6 md:px-10 pb-10"}`}>
                            {children}
                        </div>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}
