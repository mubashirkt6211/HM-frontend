import { Moon, Sun, Monitor } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark" | "system">("system")

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme") as "light" | "dark" | "system" | null
        const currentTheme = storedTheme || "system"
        setTheme(currentTheme)
        applyTheme(currentTheme)
    }, [])

    const applyTheme = (t: "light" | "dark" | "system") => {
        const root = document.documentElement
        if (t === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
            root.classList.toggle("dark", systemTheme === "dark")
        } else {
            root.classList.toggle("dark", t === "dark")
        }
    }

    const handleThemeChange = (t: "light" | "dark" | "system") => {
        setTheme(t)
        applyTheme(t)
        localStorage.setItem("theme", t)
    }

    const ThemeButton = ({ mode, icon: Icon }: { mode: "light" | "dark" | "system", icon: any }) => (
        <button
            onClick={() => handleThemeChange(mode)}
            className={cn(
                "p-1.5 rounded-md transition-all flex items-center justify-center",
                theme === mode
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            )}
            title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode`}
        >
            <Icon className="w-3.5 h-3.5" />
        </button>
    )

    return (
        <div className="flex items-center gap-0.5 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <ThemeButton mode="light" icon={Sun} />
            <ThemeButton mode="dark" icon={Moon} />
            <ThemeButton mode="system" icon={Monitor} />
        </div>
    )
}
