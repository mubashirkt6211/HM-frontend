import * as React from "react"
import { X, Check, FunnelSimple } from "@phosphor-icons/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export interface Filter {
  field: string
  operator: string
  values: any[]
}

export interface FilterFieldConfig {
  key: string
  label: string
  icon: React.ReactNode
  type: "text" | "select" | "number" | "date"
  className?: string
  placeholder?: string
  searchable?: boolean
  options?: { value: string; label: string; icon?: React.ReactNode }[]
}

export function createFilter(field: string, operator: string, values: any[]): Filter {
  return { field, operator, values }
}

interface FiltersProps {
  filters: Filter[]
  fields: FilterFieldConfig[]
  onChange: (filters: Filter[]) => void
  size?: "sm" | "md"
  trigger?: React.ReactNode
}

export function Filters({ filters, fields, onChange, trigger }: FiltersProps) {
  const addFilter = (field: string) => {
    const config = fields.find(f => f.key === field)
    const newFilter = createFilter(field, config?.type === 'select' ? 'is' : 'contains', [])
    onChange([...filters, newFilter])
  }

  const removeFilter = (index: number) => {
    onChange(filters.filter((_, i) => i !== index))
  }

  const updateFilter = (index: number, updates: Partial<Filter>) => {
    const newFilters = [...filters]
    newFilters[index] = { ...newFilters[index], ...updates }
    onChange(newFilters)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {trigger ? (
            <span>{trigger}</span>
          ) : (
            <Button variant="outline" size="sm" className="h-9 rounded-lg border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800">
              <FunnelSimple className="w-3.5 h-3.5 mr-2 text-violet-600 dark:text-violet-300" />
              Filters
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52 rounded-xl border-zinc-200 p-2 shadow-xl dark:border-zinc-800">
          <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Filter by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {fields.map(field => (
            <DropdownMenuItem
              key={field.key}
              onClick={() => addFilter(field.key)}
              className="cursor-pointer rounded-lg"
            >
              <div className="flex items-center gap-2">
                {field.icon}
                <span className="text-[13px] font-medium">{field.label}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {filters.map((filter, idx) => {
        const fieldConfig = fields.find(f => f.key === filter.field)
        if (!fieldConfig) return null

        return (
          <div key={idx} className="flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white py-1 pr-1 pl-3 shadow-sm animate-in fade-in zoom-in-95 duration-200 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="mr-1 flex items-center gap-2 text-zinc-500">
              {fieldConfig.icon}
              <span className="text-[12px] font-bold">{fieldConfig.label}</span>
            </div>

            {/* Text Filter Input */}
            {fieldConfig.type === 'text' && (
              <input
                className="w-32 border-none bg-transparent text-[12px] font-medium placeholder:text-zinc-400 focus:ring-0"
                placeholder={fieldConfig.placeholder || "Value..."}
                value={filter.values[0] || ''}
                onChange={(e) => updateFilter(idx, { values: [e.target.value] })}
              />
            )}

            {/* Select Filter */}
            {fieldConfig.type === 'select' && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-md bg-zinc-100 px-2 py-1 text-[12px] font-bold text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700">
                    {filter.values.length > 0
                      ? fieldConfig.options?.find(o => o.value === filter.values[0])?.label || filter.values[0]
                      : "Any"}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-1.5 rounded-2xl min-w-[140px]">
                  {fieldConfig.options?.map(opt => (
                    <DropdownMenuItem
                      key={opt.value}
                      onClick={() => updateFilter(idx, { values: [opt.value] })}
                      className="flex items-center justify-between rounded-xl cursor-pointer py-2 px-3"
                    >
                      <div className="flex items-center gap-2">
                        {opt.icon}
                        <span className="text-[13px] font-medium">{opt.label}</span>
                      </div>
                      {filter.values.includes(opt.value) && <Check className="w-3.5 h-3.5 text-indigo-500" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <button
              onClick={() => removeFilter(idx)}
              className="p-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-rose-500 transition-colors"
            >
              <X size={14} weight="bold" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
