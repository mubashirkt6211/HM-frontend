import type { Column } from "@tanstack/react-table"
import { CaretDown, CaretUp, ArrowsDownUp } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface DataGridColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataGridColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataGridColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn("text-[11px] font-black text-zinc-400 uppercase tracking-widest", className)}>{title}</div>
  }

  return (
    <div
      className={cn("flex items-center gap-1.5 cursor-pointer group/header", className)}
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest group-hover/header:text-zinc-900 dark:group-hover/header:text-zinc-100 transition-colors">
        {title}
      </span>
      <div className="flex flex-col text-zinc-300 dark:text-zinc-700 group-hover/header:text-zinc-500 transition-colors">
        {column.getIsSorted() === "desc" ? (
          <CaretDown weight="bold" size={10} />
        ) : column.getIsSorted() === "asc" ? (
          <CaretUp weight="bold" size={10} />
        ) : (
          <ArrowsDownUp weight="bold" size={10} />
        )}
      </div>
    </div>
  )
}
