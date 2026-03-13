import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { SiteHeader } from "@/components/SiteHeader"

export function AppLayout({ 
  children,
  currentPage = "dashboard",
  onPageChange,
  isFullPage = false
}: { 
  children: React.ReactNode;
  currentPage?: string;
  onPageChange?: (page: string) => void;
  isFullPage?: boolean;
}) {
    // Full page layout for calendar
    if (isFullPage) {
        return (
            <div className="flex min-h-screen w-full bg-[#f6f6f6] dark:bg-zinc-900">
                <SidebarProvider className="flex w-full min-h-0">
                    <AppSidebar currentPage={currentPage} onPageChange={onPageChange} />
                    <SidebarInset className="bg-transparent flex-1 flex flex-col p-0">
                        {children}
                    </SidebarInset>
                </SidebarProvider>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen w-full bg-[#f6f6f6] dark:bg-zinc-900">
            <SidebarProvider className="flex w-full min-h-0">
                <AppSidebar currentPage={currentPage} onPageChange={onPageChange} />
                <SidebarInset className="bg-transparent flex-1 flex flex-col p-2 pl-0 md:pl-0">
                    <main className="flex-1 mt-4 bg-white dark:bg-zinc-950 rounded-4xl shadow-sm ring-1 ring-zinc-200/50 dark:ring-zinc-800/50 flex flex-col relative">
                        <SiteHeader />
                        <div className="flex-1 w-full px-6 md:px-10 pb-10">
                            {children}
                        </div>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}

