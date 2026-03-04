import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"

export function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-full bg-[#f6f6f6] dark:bg-zinc-900 overflow-hidden">
            <SidebarProvider className="flex-1 flex w-full h-full min-h-0">
                <AppSidebar />
                <SidebarInset className="bg-transparent flex-1 flex flex-col overflow-hidden p-2 pl-0 md:pl-0">
                    <main className="flex-1 overflow-hidden mt-4 bg-white dark:bg-zinc-950 rounded-[20px] shadow-sm ring-1 ring-zinc-200/50 dark:ring-zinc-800/50 flex flex-col relative">
                        <Header />
                        <div className="flex-1 overflow-y-auto w-full px-6 md:px-10 pb-10">
                            {children}
                        </div>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}

