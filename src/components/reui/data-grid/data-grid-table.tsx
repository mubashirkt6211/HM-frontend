import { flexRender } from "@tanstack/react-table"
import { useDataGrid } from "./data-grid"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export function DataGridTable() {
  const { table, isLoading } = useDataGrid()

  return (
    <table className="w-full text-left border-collapse min-w-max">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="border-b border-zinc-100 dark:border-zinc-800">
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className="px-6 py-5"
                style={{ width: header.getSize() }}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
        {isLoading
          ? Array.from({ length: table.getState().pagination.pageSize }).map((_, i) => (
              <tr key={i}>
                {table.getAllColumns().map((column) => (
                  <td key={column.id} className="px-6 py-5">
                    {/* @ts-ignore */}
                    {column.columnDef.meta?.skeleton || <Skeleton className="h-4 w-full" />}
                  </td>
                ))}
              </tr>
            ))
          : table.getRowModel().rows.map((row) => (
              <tr 
                key={row.id} 
                className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer"
                onClick={() => {
                  // Profile view trigger logic could go here if handled by table meta
                  // For now, we manually handle it in the parent
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-5">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
      </tbody>
    </table>
  )
}
