"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  MagnifyingGlass, Plus,
  CalendarBlank, Users, CaretLeft, CaretRight, Funnel,
  ArrowUp, ArrowDown, Clock,
  Syringe,
  DotsThreeVertical,
  UserCircle, Envelope, Trash,
} from "@phosphor-icons/react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { NurseProfileView } from "@/components/nurse/NurseProfileView"

// ─── Types ────────────────────────────────────────────────────
export interface Nurse {
  id: number
  name: string
  specialization: string
  department: string
  email: string
  phone: string
  avatar: string
  rating: number
  reviews: number
  patientsAssigned: number
  experience: number
  status: "available" | "on-shift" | "on-leave" | "off-duty"
  schedule: string
  shiftStart: string
  shiftEnd: string
  breakTime: string
  overtime: string
  nextAvailableShift: string
}

// ─── Data ────────────────────────────────────────────────────
const NURSES: Nurse[] = [
  { id: 1, name: "Nurse Elena Gilbert", specialization: "ICU Specialist", department: "Critical Care", email: "e.gilbert@hospital.com", phone: "+1 (555) 102-3344", avatar: "https://i.pravatar.cc/200?img=48", rating: 4.9, reviews: 156, patientsAssigned: 4, experience: 8, status: "on-shift", schedule: "Mon – Fri", shiftStart: "07:00 AM", shiftEnd: "03:00 PM", breakTime: "11:30 AM", overtime: "1h 30m", nextAvailableShift: "Today" },
  { id: 2, name: "Nurse David Miller", specialization: "Emergency Care", department: "Emergency Room", email: "d.miller@hospital.com", phone: "+1 (555) 332-9901", avatar: "https://i.pravatar.cc/200?img=12", rating: 4.8, reviews: 92, patientsAssigned: 6, experience: 10, status: "available", schedule: "Tue – Sat", shiftStart: "03:00 PM", shiftEnd: "11:00 PM", breakTime: "7:00 PM", overtime: "0h 45m", nextAvailableShift: "Today, 3:00 PM" },
  { id: 3, name: "Nurse Sophia Williams", specialization: "Pediatric Nurse", department: "Child Health", email: "s.williams@hospital.com", phone: "+1 (555) 441-8877", avatar: "https://i.pravatar.cc/200?img=32", rating: 4.9, reviews: 204, patientsAssigned: 5, experience: 12, status: "on-leave", schedule: "Mon – Fri", shiftStart: "08:00 AM", shiftEnd: "04:00 PM", breakTime: "12:30 PM", overtime: "—", nextAvailableShift: "Next Mon" },
  { id: 4, name: "Nurse Michael Chen", specialization: "Surgical Nurse", department: "Surgery Dept", email: "m.chen@hospital.com", phone: "+1 (555) 556-2211", avatar: "https://i.pravatar.cc/200?img=11", rating: 4.7, reviews: 118, patientsAssigned: 3, experience: 6, status: "on-shift", schedule: "Wed – Sun", shiftStart: "07:00 AM", shiftEnd: "03:00 PM", breakTime: "11:00 AM", overtime: "2h 15m", nextAvailableShift: "Today" },
  { id: 5, name: "Nurse Olivia Taylor", specialization: "Neonatal Specialist", department: "Maternity", email: "o.taylor@hospital.com", phone: "+1 (555) 667-4433", avatar: "https://i.pravatar.cc/200?img=26", rating: 4.8, reviews: 145, patientsAssigned: 4, experience: 9, status: "available", schedule: "Mon – Fri", shiftStart: "09:00 AM", shiftEnd: "05:00 PM", breakTime: "1:00 PM", overtime: "0h 00m", nextAvailableShift: "Today" },
]

export const NURSE_STATUS_CONFIG = {
  "available": { label: "Available", dot: "bg-emerald-500", ring: "ring-emerald-500/30", bg: "bg-emerald-50 dark:bg-emerald-950/50", text: "text-emerald-700 dark:text-emerald-400" },
  "on-shift": { label: "On Shift", dot: "bg-blue-500 animate-pulse", ring: "ring-blue-500/30", bg: "bg-blue-50 dark:bg-blue-950/50", text: "text-blue-700 dark:text-blue-400" },
  "on-leave": { label: "On Leave", dot: "bg-amber-400", ring: "ring-amber-400/30", bg: "bg-amber-50 dark:bg-amber-950/50", text: "text-amber-700 dark:text-amber-400" },
  "off-duty": { label: "Off Duty", dot: "bg-zinc-400", ring: "ring-zinc-400/30", bg: "bg-zinc-100 dark:bg-zinc-800", text: "text-zinc-500 dark:text-zinc-400" },
}

const STATS = [
  { label: "Total Nurses", value: "48", sub: "+5.1% Last month", icon: Users, trend: "up" },
  { label: "On Duty", value: "32", sub: "+12.0% Last month", icon: Clock, trend: "up" },
  { label: "Available", value: "14", sub: "+8.2% Last month", icon: Syringe, trend: "up" },
  { label: "On Leave", value: "02", sub: "–2.1% Last month", icon: CalendarBlank, trend: "down" },
]

const COLS = [
  { key: "name", label: "Nurse Name", sortable: true },
  { key: "shiftStart", label: "Shift Timing", sortable: false },
  { key: "specialization", label: "Specialization", sortable: true },
  { key: "experience", label: "Exp (Yrs)", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "action", label: "Action", sortable: false },
]

const fieldCls = "w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-[13px] font-medium outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-400 dark:focus:border-zinc-600 transition-all placeholder:text-zinc-400"
const labelCls = "block text-[11px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5"

function AddNurseModal({
  open, onClose, onAdd,
}: {
  open: boolean
  onClose: () => void
  onAdd: (nurse: Nurse) => void
}) {
  const empty = { name: "", email: "", phone: "", specialization: "", department: "", schedule: "", shiftStart: "07:00 AM", shiftEnd: "03:00 PM", status: "available" as Nurse["status"] }
  const [form, setForm] = useState({ ...empty })
  const [errors, setErrors] = useState<Partial<typeof empty>>({})

  function set(field: keyof typeof empty, val: string) {
    setForm(f => ({ ...f, [field]: val }))
    setErrors(e => ({ ...e, [field]: "" }))
  }

  function validate() {
    const errs: Partial<typeof empty> = {}
    if (!form.name.trim()) errs.name = "Required"
    if (!form.email.trim()) errs.email = "Required"
    if (!form.specialization.trim()) errs.specialization = "Required"
    if (!form.department.trim()) errs.department = "Required"
    return errs
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    const avatarId = Math.floor(Math.random() * 70) + 1
    onAdd({
      id: Date.now(),
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || "—",
      specialization: form.specialization.trim(),
      department: form.department.trim(),
      schedule: form.schedule.trim() || "Mon – Fri",
      shiftStart: form.shiftStart,
      shiftEnd: form.shiftEnd,
      breakTime: "1:00 PM",
      overtime: "—",
      status: form.status,
      rating: 4.5,
      reviews: 0,
      patientsAssigned: 0,
      experience: 0,
      nextAvailableShift: "Next Shift",
      avatar: `https://i.pravatar.cc/200?img=${avatarId}`,
    })
    setForm({ ...empty })
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center shrink-0">
              <Syringe className="w-4.5 h-4.5 text-white dark:text-zinc-900" weight="duotone" />
            </div>
            <div>
              <DialogTitle className="text-[17px]">Add New Nurse</DialogTitle>
              <DialogDescription className="text-[12px] mt-0.5">Register a new nursing staff member.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
            <div>
              <label className={labelCls}>Full Name *</label>
              <input
                autoFocus
                value={form.name}
                onChange={e => set("name", e.target.value)}
                placeholder="e.g. Nurse Elena Gilbert"
                className={cn(fieldCls, errors.name && "border-rose-400")}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set("email", e.target.value)}
                  placeholder="nurse@hospital.com"
                  className={cn(fieldCls, errors.email && "border-rose-400")}
                />
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => set("phone", e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className={fieldCls}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Specialization *</label>
                <input
                  value={form.specialization}
                  onChange={e => set("specialization", e.target.value)}
                  placeholder="e.g. ICU Specialist"
                  className={cn(fieldCls, errors.specialization && "border-rose-400")}
                />
              </div>
              <div>
                <label className={labelCls}>Department *</label>
                <input
                  value={form.department}
                  onChange={e => set("department", e.target.value)}
                  placeholder="e.g. Critical Care"
                  className={cn(fieldCls, errors.department && "border-rose-400")}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 pb-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex-row gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-[13px] font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[13px] font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" weight="bold" />
              Add Nurse
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function NursePage() {
  const [nurses, setNurses] = useState<Nurse[]>(NURSES)
  const [showAdd, setShowAdd] = useState(false)
  const [view, setView] = useState<"list" | "profile">("list")
  const [profileNurse, setProfileNurse] = useState<Nurse | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [page, setPage] = useState(1)
  const perPage = 10

  function handleViewProfile(nurse: Nurse) {
    setProfileNurse(nurse)
    setView("profile")
  }

  function handleBackToList() {
    setView("list")
  }

  const filtered = nurses.filter(n => {
    const q = search.toLowerCase()
    const matchSearch = n.name.toLowerCase().includes(q) || n.specialization.toLowerCase().includes(q)
    const matchStatus = statusFilter === "all" || n.status === statusFilter
    return matchSearch && matchStatus
  })

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0
    let aVal: any = (a as any)[sortKey]
    let bVal: any = (b as any)[sortKey]
    if (aVal < bVal) return sortDir === "asc" ? -1 : 1
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1
    return 0
  })

  const pageDocs = sorted.slice((page - 1) * perPage, page * perPage)
  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage))

  function handleSort(key: string) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("asc") }
  }

  if (view === "profile" && profileNurse) {
    return (
      <NurseProfileView
        nurse={profileNurse}
        onBack={handleBackToList}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6 pt-6 pb-10 px-6 md:px-8 animate-in fade-in slide-in-from-bottom-3 duration-500">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h1 className="text-[32px] font-black text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
            Nurse Registry
          </h1>
          <p className="text-[14px] text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
            Manage your nursing staff, assignments, and schedules.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
        {STATS.map(stat => (
          <div key={stat.label} className="bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800 p-5 rounded-2xl shadow-sm transition-all hover:shadow-md group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <stat.icon className="w-5 h-5 text-zinc-600 dark:text-zinc-400" weight="duotone" />
              </div>
              <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", stat.trend === "up" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10" : "bg-rose-50 text-rose-600 dark:bg-rose-500/10")}>
                {stat.sub}
              </span>
            </div>
            <p className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-0.5 truncate">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-b border-zinc-100 dark:border-zinc-800/60">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[13px] font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                  <Funnel className="w-3.5 h-3.5" />
                  Filter
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {["all", "available", "on-shift", "on-leave", "off-duty"].map(s => (
                  <DropdownMenuItem
                    key={s}
                    onClick={() => { setStatusFilter(s); setPage(1) }}
                    className={cn("capitalize text-[13px]", statusFilter === s && "font-bold")}
                  >
                    {s === "all" ? "All statuses" : s.replace("-", " ")}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search nurses"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                className="w-44 pl-8 pr-3 py-1.5 text-[13px] font-medium rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
              />
            </div>
          </div>

          <Button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 h-auto rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[13px] font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" weight="bold" />
            Add New Nurse
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800/60">
                {COLS.map(col => (
                  <th
                    key={col.key}
                    className={cn(
                      "py-3 px-5 text-left text-[11px] font-black text-zinc-400 uppercase tracking-wider whitespace-nowrap",
                      col.sortable && "cursor-pointer select-none hover:text-zinc-600 transition-colors"
                    )}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {col.sortable && sortKey === col.key && (
                        sortDir === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageDocs.map(nurse => {
                const status = (NURSE_STATUS_CONFIG as any)[nurse.status]
                return (
                  <tr key={nurse.id} className="group border-b border-zinc-50 dark:border-zinc-800/40 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <Avatar className={cn("size-9 ring-2", status.ring)}>
                          <AvatarImage src={nurse.avatar} />
                          <AvatarFallback className="text-[12px] font-black bg-zinc-100 dark:bg-zinc-800">
                            {nurse.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100 truncate">{nurse.name}</p>
                          <p className="text-[11px] text-zinc-400 font-medium truncate">{nurse.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-1.5 text-[12px] font-semibold text-zinc-900 dark:text-zinc-100">
                        {nurse.shiftStart} <span className="text-zinc-300 dark:text-zinc-600">→</span> {nurse.shiftEnd}
                      </div>
                    </td>
                    <td className="py-3 px-5 text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
                      {nurse.specialization}
                    </td>
                    <td className="py-3 px-5 text-[13px] font-bold text-zinc-700 dark:text-zinc-300">
                      {nurse.experience}
                    </td>
                    <td className="py-3 px-5">
                      <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-black px-2.5 py-1 rounded-full", status.bg, status.text)}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", status.dot)} />
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3 px-5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                            <DotsThreeVertical className="w-4 h-4" weight="bold" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem
                            className="text-[13px] flex items-center gap-2"
                            onClick={() => handleViewProfile(nurse)}
                          >
                            <UserCircle className="w-4 h-4 text-zinc-400" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-[13px] flex items-center gap-2">
                            <Envelope className="w-4 h-4 text-zinc-400" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-[13px] flex items-center gap-2 text-rose-600 focus:text-rose-600">
                            <Trash className="w-4 h-4" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3.5 border-t border-zinc-100 dark:border-zinc-800/60">
          <p className="text-[12px] font-medium text-zinc-400">Showing {pageDocs.length} of {sorted.length} nurses</p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1 rounded-lg text-zinc-400 hover:bg-zinc-100 disabled:opacity-30 transition-colors"
            >
              <CaretLeft className="w-4 h-4" />
            </button>
            <span className="text-[12px] font-bold px-2">{page} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1 rounded-lg text-zinc-400 hover:bg-zinc-100 disabled:opacity-30 transition-colors"
            >
              <CaretRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <AddNurseModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={(n) => setNurses(prev => [n, ...prev])}
      />
    </div>
  )
}
