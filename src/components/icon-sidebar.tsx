import {
    Hexagon,
    MessageSquare,
    Calendar,
    Play,
    Folder,
    Settings,
    User
} from "lucide-react";
import { cn } from "@/lib/utils";

export function IconSidebar() {
    return (
        <div className="w-[60px] h-screen bg-[#F8F9FA] dark:bg-[#09090b] border-r border-zinc-200/50 dark:border-zinc-800/50 flex flex-col items-center py-4 shrink-0 transition-all z-10">
            {/* Abstract Logo */}
            <div className="mb-6 flex items-center justify-center">
                <Hexagon className="w-8 h-8 fill-black dark:fill-white text-black dark:text-white" />
            </div>

            {/* App Nav Icons */}
            <div className="flex flex-col gap-3 w-full items-center">
                <NavItem icon={Hexagon} bgColor="bg-amber-400" iconColor="text-white" />
                <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-zinc-200/50 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer">
                    <span className="text-lg leading-none">+</span>
                </div>
                <div className="w-6 border-b border-zinc-200 dark:border-zinc-800 my-1"></div>
                <NavItem icon={MessageSquare} bgColor="bg-rose-100" iconColor="text-rose-500" />
                <NavItem icon={Calendar} bgColor="bg-emerald-50" iconColor="text-emerald-500" />
                <NavItem icon={Play} bgColor="bg-blue-50" iconColor="text-blue-500" />
                <NavItem icon={Folder} bgColor="bg-amber-50" iconColor="text-amber-500" />
                <NavItem icon={User} bgColor="bg-zinc-200" iconColor="text-zinc-600" />
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto flex flex-col gap-4">
                <button className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                    <Settings className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

function NavItem({ icon: Icon, bgColor, iconColor, isActive }: { icon: any, bgColor: string, iconColor: string, isActive?: boolean }) {
    return (
        <button className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-sm",
            isActive ? "ring-2 ring-offset-2 ring-zinc-400" : "",
            bgColor,
            iconColor
        )}>
            <Icon className="w-5 h-5" fill="currentColor" />
        </button>
    );
}
