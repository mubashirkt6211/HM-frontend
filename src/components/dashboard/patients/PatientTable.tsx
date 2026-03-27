import { useMemo, useState } from "react"
import type {
  ColumnDef,
  SortingState,
} from "@tanstack/react-table"
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import type { PatientRecord } from "./types"
import { Badge } from "@/components/reui/badge"
import { DataGrid, DataGridContainer } from "@/components/reui/data-grid/data-grid"
import { DataGridTable } from "@/components/reui/data-grid/data-grid-table"
import { DataGridPagination } from "@/components/reui/data-grid/data-grid-pagination"
import { DataGridColumnHeader } from "@/components/reui/data-grid/data-grid-column-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface PatientTableProps {
  patients: PatientRecord[]
  onOpen: (p: PatientRecord) => void
  isLoading?: boolean
}

export function PatientTable({ patients, onOpen, isLoading }: PatientTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo<ColumnDef<PatientRecord>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => <DataGridColumnHeader title="Patient" column={column} />,
        cell: ({ row }) => (
          <div className="flex items-center gap-3" onClick={() => onOpen(row.original)}>
            <Avatar className="size-10 rounded-2xl shadow-sm ring-2 ring-zinc-50 dark:ring-zinc-900">
              <AvatarImage src={row.original.avatar} alt={row.original.name} className="object-cover" />
              <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 font-bold text-zinc-400">
                {row.original.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-zinc-900 dark:text-zinc-100">{row.original.name}</span>
              <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-tighter">ID: {row.original.id}</span>
            </div>
          </div>
        ),
        size: 220,
      },
      {
        accessorKey: "type",
        header: ({ column }) => <DataGridColumnHeader title="Specialty" column={column} />,
        cell: ({ row }) => <span className="text-[13px] font-semibold text-zinc-500">{row.original.type}</span>,
        size: 150,
      },
      {
        accessorKey: "status",
        header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
        cell: ({ row }) => {
          const status = row.original.status
          if (status === "Emergency") return <Badge variant="destructive-outline">Emergency</Badge>
          if (status === "Discharged") return <Badge variant="success-outline">Discharged</Badge>
          if (status === "Follow-up") return <Badge variant="default" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Follow-up</Badge>
          return <Badge variant="outline" className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">{status}</Badge>
        },
        size: 130,
      },
      {
        accessorKey: "heartRate",
        header: ({ column }) => <DataGridColumnHeader title="Vitals" column={column} />,
        cell: ({ row }) => (
          <div className="flex items-center gap-3 text-[13px]">
            <div className="flex flex-col">
              <span className="font-bold text-rose-500">{row.original.heartRate} <span className="text-[10px] text-zinc-400">bpm</span></span>
              <span className="font-bold text-blue-500">{row.original.bp} <span className="text-[10px] text-zinc-400">bp</span></span>
            </div>
          </div>
        ),
        size: 130,
      },
      {
        accessorKey: "appointment",
        header: ({ column }) => <DataGridColumnHeader title="Appointment" column={column} />,
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100">{row.original.appointment}</span>
            <span className="text-[11px] font-medium text-zinc-400 italic">Scheduled</span>
          </div>
        ),
        size: 160,
      },
      {
        accessorKey: "source",
        header: ({ column }) => <DataGridColumnHeader title="Enquiry" column={column} />,
        cell: ({ row }) => <span className="text-[13px] font-bold text-zinc-400">{row.original.source}</span>,
        size: 120,
      },
    ],
    [onOpen]
  )

  const table = useReactTable({
    data: patients,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  })

  return (
    <DataGrid
      table={table}
      isLoading={isLoading}
      recordCount={patients.length}
    >
      <DataGridContainer className="overflow-x-auto">
           <DataGridTable />
        <DataGridPagination />
      </DataGridContainer>
    </DataGrid>
  )
}
