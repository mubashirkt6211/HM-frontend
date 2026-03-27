import { useDataGrid } from "./data-grid"
import { CaretLeft, CaretRight } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

export function DataGridPagination() {
  const { table, recordCount } = useDataGrid()
  const { pageIndex, pageSize } = table.getState().pagination
  const pageCount = table.getPageCount()

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-bold text-zinc-400">
          Showing <span className="text-zinc-900 dark:text-zinc-100">{pageIndex * pageSize + 1}</span> to <span className="text-zinc-900 dark:text-zinc-100">{Math.min((pageIndex + 1) * pageSize, recordCount)}</span> of <span className="text-zinc-900 dark:text-zinc-100">{recordCount}</span>
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <CaretLeft weight="bold" size={18} />
        </button>
        <div className="flex items-center gap-1 mx-2">
          {Array.from({ length: Math.min(pageCount, 5) }).map((_, i) => (
             <button
                key={i}
                onClick={() => table.setPageIndex(i)}
                className={cn(
                  "w-9 h-9 flex items-center justify-center rounded-xl text-[13px] font-black transition-all",
                  pageIndex === i 
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg" 
                    : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                )}
             >
               {i + 1}
             </button>
          ))}
        </div>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <CaretRight weight="bold" size={18} />
        </button>
      </div>
    </div>
  )
}
