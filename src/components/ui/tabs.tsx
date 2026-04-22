"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface TabsContextProps {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextProps | undefined>(undefined)

export function Tabs({
  children,
  defaultValue,
  className,
  onValueChange
}: {
  children: React.ReactNode
  defaultValue: string
  className?: string
  onValueChange?: (value: string) => void
}) {
  const [value, setValue] = React.useState(defaultValue)

  const handleValueChange = React.useCallback((newValue: string) => {
    setValue(newValue)
    onValueChange?.(newValue)
  }, [onValueChange])

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={cn("flex flex-col", className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("flex items-center gap-1 p-1 bg-zinc-100/50 dark:bg-zinc-900/50 rounded-xl w-fit", className)}>
      {children}
    </div>
  )
}

export function TabsTab({
  children,
  value,
  className,
  "aria-label": ariaLabel
}: {
  children: React.ReactNode
  value: string
  className?: string
  "aria-label"?: string
}) {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error("TabsTab must be used within Tabs")

  const isActive = context.value === value

  return (
    <button
      onClick={() => context.onValueChange(value)}
      aria-label={ariaLabel}
      className={cn(
        "relative px-4 py-2 text-[13px] font-bold transition-all rounded-lg outline-none",
        isActive
          ? "text-zinc-900 dark:text-white"
          : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200",
        className
      )}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {isActive && (
        <motion.div
          layoutId="activeTabBackground"
          className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-lg shadow-sm"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </button>
  )
}

export function TabsPanel({ children, value, className }: { children: React.ReactNode, value: string, className?: string }) {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error("TabsPanel must be used within Tabs")

  if (context.value !== value) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn("mt-4", className)}
    >
      {children}
    </motion.div>
  )
}
