import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"

function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950">
          <div className="max-w-5xl mx-auto h-full flex flex-col">
            <article className="flex min-w-0 w-full flex-col gap-4 pt-8 px-4 md:px-6">
              <h1 className="text-[1.75em] font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight">Installation</h1>
              <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-8 tracking-tight">Getting started with Kokonut UI - PRO.</p>

              <section className="space-y-12">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Installation</h2>
                  <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 dark:bg-orange-950/20 dark:border-orange-900/30">
                    <div className="flex gap-3">
                      <div className="text-orange-600 dark:text-orange-500 mt-0.5 whitespace-nowrap font-medium text-sm">⚠️ Access to KokonutUI - PRO</div>
                      <p className="text-[13px] text-orange-900/80 dark:text-orange-200/60 leading-relaxed font-normal">
                        All components require to be a paid user to access the code. For free components please visit, <a href="https://kokonutui.com/" className="underline underline-offset-4 decoration-orange-500/30 hover:decoration-orange-500 transition-colors">https://kokonutui.com/</a> which is open-source version.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">1. Configure namespace</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-[14px] leading-relaxed">The components.json file holds configuration for your project, and allow easy installation of any components.</p>

                  <div className="p-6 rounded-2xl bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1 tracking-tight">Note: The `components.json` file is optional</p>
                    <p className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed">It is only required if you're using the CLI to add components to your project. If you're using the copy and paste method, you don't need this file.</p>
                  </div>
                </div>
              </section>
            </article>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App
