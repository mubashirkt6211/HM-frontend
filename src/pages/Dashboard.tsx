import { Trophy, ChevronDown, Search, MoreHorizontal, Plus, Type, User2, MessageSquare, CheckCircle2, Circle } from "lucide-react"

export function Dashboard() {
    return (
        <article className="flex min-w-0 w-full flex-col gap-6 pt-10 px-2 lg:max-w-4xl max-w-full">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center border border-amber-100 dark:border-amber-500/20 shadow-sm mb-2">
                <Trophy className="w-8 h-8 text-amber-500" />
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Goals '24</h1>
                <div className="flex items-center gap-3 text-[13px] text-zinc-500">
                    <span>June 17, 2024 10:31 PM</span>
                    <span className="flex items-center gap-1.5 rounded-md bg-yellow-100 dark:bg-yellow-500/20 px-2 py-0.5 text-yellow-800 dark:text-yellow-500 font-medium">
                        In progress
                    </span>
                    <span className="flex items-center gap-1.5 rounded-md bg-indigo-100 dark:bg-indigo-500/20 px-2 py-0.5 text-indigo-800 dark:text-indigo-400 font-medium">
                        Improvements
                    </span>
                    <span className="text-zinc-400">+1</span>
                </div>
            </div>

            <section className="mt-8 space-y-4">
                <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Tasks</h2>

                <div className="w-full flex flex-col border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900/50">
                    {/* Table Header */}
                    <div className="grid grid-cols-[40px_1fr_120px_120px_120px] items-center border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 px-4 py-2 text-[13px] font-medium text-zinc-500">
                        <div></div>
                        <div className="flex items-center gap-2">
                            <Type className="w-4 h-4" />
                            Task Name
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            Status
                        </div>
                        <div className="flex items-center gap-2">
                            <User2 className="w-4 h-4" />
                            Assignee
                        </div>
                        <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Comments
                        </div>
                    </div>

                    {/* Task Row 1 */}
                    <div className="grid grid-cols-[40px_1fr_120px_120px_120px] items-center border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-[14px]">
                        <button className="text-zinc-300 hover:text-zinc-400 dark:text-zinc-700 transition-colors">
                            <Circle className="w-4 h-4" />
                        </button>
                        <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate pr-4">Doing the research</div>
                        <div>
                            <span className="inline-flex items-center rounded-md bg-emerald-100 dark:bg-emerald-500/20 px-2 py-0.5 text-[12px] font-medium text-emerald-800 dark:text-emerald-400">
                                Done
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <img src="https://i.pravatar.cc/150?img=33" alt="David" className="w-5 h-5 rounded-full" />
                            <span className="text-zinc-600 dark:text-zinc-400 text-[13px]">David</span>
                        </div>
                        <div className="text-zinc-400 text-[13px]">3</div>
                    </div>

                    {/* Task Row 2 */}
                    <div className="grid grid-cols-[40px_1fr_120px_120px_120px] items-center border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-[14px]">
                        <button className="text-zinc-300 hover:text-zinc-400 dark:text-zinc-700 transition-colors">
                            <Circle className="w-4 h-4" />
                        </button>
                        <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate pr-4">Mapping the Factory</div>
                        <div>
                            <span className="inline-flex items-center rounded-md bg-rose-100 dark:bg-rose-500/20 px-2 py-0.5 text-[12px] font-medium text-rose-800 dark:text-rose-400">
                                Not done
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="You" className="w-5 h-5 rounded-full" />
                            <span className="text-zinc-600 dark:text-zinc-400 text-[13px]">You</span>
                        </div>
                        <div className="text-zinc-400 text-[13px]">0</div>
                    </div>

                    {/* Add Row Action */}
                    <div className="px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800">
                        <button className="flex items-center gap-2 text-[13px] font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
                            <Plus className="w-4 h-4" />
                            Add Row
                        </button>
                    </div>
                </div>
            </section>

            <section className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-6 h-6 rounded-full" />
                    <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 border-l border-zinc-900 dark:border-zinc-100 pl-1 ml-0.5 h-6 leading-6">Project Planning & Res|</h2>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 text-[13px] font-medium text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 shadow-sm">
                        Show All
                        <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                    </button>
                    <button className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors p-1.5">
                        <ArrowDownUp className="w-4 h-4" />
                    </button>
                    <button className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors p-1.5">
                        <Search className="w-4 h-4" />
                    </button>
                    <button className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors p-1.5">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </section>
        </article>
    );
}

function ArrowDownUp(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m3 16 4 4 4-4" />
            <path d="M7 20V4" />
            <path d="m21 8-4-4-4 4" />
            <path d="M17 4v16" />
        </svg>
    )
}
