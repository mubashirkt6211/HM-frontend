import * as React from "react"
import type { Table } from "@tanstack/react-table"
import { cn } from "@/lib/utils"

interface DataGridContextValue {
  table: Table<any>
  isLoading?: boolean
  loadingMode?: "skeleton" | "spinner"
  recordCount: number
}

const DataGridContext = React.createContext<DataGridContextValue | null>(null)

export function useDataGrid() {
  const context = React.useContext(DataGridContext)
  if (!context) {
    throw new Error("useDataGrid must be used within a DataGrid")
  }
  return context
}

export function DataGrid({
  table,
  isLoading,
  loadingMode = "skeleton",
  recordCount,
  children,
  className,
}: {
  table: Table<any>
  isLoading?: boolean
  loadingMode?: "skeleton" | "spinner"
  recordCount: number
  children: React.ReactNode
  className?: string
  tableLayout?: {
    dense?: boolean
    columnsMovable?: boolean
  }
}) {
  return (
    <DataGridContext.Provider value={{ table, isLoading, loadingMode, recordCount }}>
      <div className={cn("w-full h-full flex flex-col", className)}>
        {children}
      </div>
    </DataGridContext.Provider>
  )
}

export function DataGridContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative rounded-[24px] border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden", className)}>
      {children}
    </div>
  )
}
