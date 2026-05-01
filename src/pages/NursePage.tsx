"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import {
  MagnifyingGlass, Plus, X, FunnelSimple, ArrowsDownUp, ListDashes,
  CalendarBlank, Users, CaretLeft, CaretRight, Funnel,
  ArrowUp, ArrowDown, Clock, CaretDown,
  Syringe,
  DotsThree, DotsThreeVertical,
  UserCircle, Envelope, Trash, Star,
} from "@phosphor-icons/react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Frame } from "@/components/ui/frame"
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
  joinDate: string
}

// ─── Data ────────────────────────────────────────────────────
const NURSES: Nurse[] = [
  { id: 1, name: "Nurse Elena Gilbert", specialization: "ICU Specialist", department: "Critical Care", email: "e.gilbert@hospital.com", phone: "+1 (555) 102-3344", avatar: "https://i.pravatar.cc/200?img=48", rating: 4.9, reviews: 156, patientsAssigned: 4, experience: 8, status: "on-shift", schedule: "Mon – Fri", shiftStart: "07:00 AM", shiftEnd: "03:00 PM", breakTime: "11:30 AM", overtime: "1h 30m", nextAvailableShift: "Today", joinDate: "Jan 10, 2020" },
  { id: 2, name: "Nurse David Miller", specialization: "Emergency Care", department: "Emergency Room", email: "d.miller@hospital.com", phone: "+1 (555) 332-9901", avatar: "https://i.pravatar.cc/200?img=12", rating: 4.8, reviews: 92, patientsAssigned: 6, experience: 10, status: "available", schedule: "Tue – Sat", shiftStart: "03:00 PM", shiftEnd: "11:00 PM", breakTime: "7:00 PM", overtime: "0h 45m", nextAvailableShift: "Today, 3:00 PM", joinDate: "Mar 15, 2021" },
  { id: 3, name: "Nurse Sophia Williams", specialization: "Pediatric Nurse", department: "Child Health", email: "s.williams@hospital.com", phone: "+1 (555) 441-8877", avatar: "https://i.pravatar.cc/200?img=32", rating: 4.9, reviews: 204, patientsAssigned: 5, experience: 12, status: "on-leave", schedule: "Mon – Fri", shiftStart: "08:00 AM", shiftEnd: "04:00 PM", breakTime: "12:30 PM", overtime: "—", nextAvailableShift: "Next Mon", joinDate: "Jun 3, 2021" },
  { id: 4, name: "Nurse Michael Chen", specialization: "Surgical Nurse", department: "Surgery Dept", email: "m.chen@hospital.com", phone: "+1 (555) 556-2211", avatar: "https://i.pravatar.cc/200?img=11", rating: 4.7, reviews: 118, patientsAssigned: 3, experience: 6, status: "on-shift", schedule: "Wed – Sun", shiftStart: "07:00 AM", shiftEnd: "03:00 PM", breakTime: "11:00 AM", overtime: "2h 15m", nextAvailableShift: "Today", joinDate: "Aug 5, 2020" },
  { id: 5, name: "Nurse Olivia Taylor", specialization: "Neonatal Specialist", department: "Maternity", email: "o.taylor@hospital.com", phone: "+1 (555) 667-4433", avatar: "https://i.pravatar.cc/200?img=26", rating: 4.8, reviews: 145, patientsAssigned: 4, experience: 9, status: "available", schedule: "Mon – Fri", shiftStart: "09:00 AM", shiftEnd: "05:00 PM", breakTime: "1:00 PM", overtime: "0h 00m", nextAvailableShift: "Today", joinDate: "Nov 12, 2020" },
  { id: 6, name: "Nurse Kamile Jane", specialization: "Mental Health", department: "Psychiatry", email: "k.jane@hospital.com", phone: "+1 (555) 778-1122", avatar: "https://i.pravatar.cc/200?img=21", rating: 4.6, reviews: 88, patientsAssigned: 3, experience: 7, status: "available", schedule: "Mon – Thu", shiftStart: "10:00 AM", shiftEnd: "06:00 PM", breakTime: "2:00 PM", overtime: "0h 20m", nextAvailableShift: "Today", joinDate: "Feb 20, 2022" },
  { id: 7, name: "Nurse Daniel Brown", specialization: "Cardiac Nurse", department: "Cardiology", email: "d.brown@hospital.com", phone: "+1 (555) 889-3344", avatar: "https://i.pravatar.cc/200?img=33", rating: 4.7, reviews: 134, patientsAssigned: 5, experience: 9, status: "on-shift", schedule: "Mon – Fri", shiftStart: "06:00 AM", shiftEnd: "02:00 PM", breakTime: "10:30 AM", overtime: "1h 10m", nextAvailableShift: "Today", joinDate: "Jul 18, 2019" },
  { id: 8, name: "Nurse Emma Johnson", specialization: "Orthopedic Nurse", department: "Orthopedics", email: "e.johnson@hospital.com", phone: "+1 (555) 990-2233", avatar: "https://i.pravatar.cc/200?img=45", rating: 4.8, reviews: 101, patientsAssigned: 4, experience: 8, status: "available", schedule: "Tue – Sat", shiftStart: "08:00 AM", shiftEnd: "04:00 PM", breakTime: "12:00 PM", overtime: "0h 30m", nextAvailableShift: "Today", joinDate: "Apr 10, 2021" },
  { id: 9, name: "Nurse Liam Davis", specialization: "Trauma Care", department: "Emergency Room", email: "l.davis@hospital.com", phone: "+1 (555) 111-4455", avatar: "https://i.pravatar.cc/200?img=14", rating: 4.9, reviews: 167, patientsAssigned: 6, experience: 11, status: "on-shift", schedule: "Wed – Sun", shiftStart: "02:00 PM", shiftEnd: "10:00 PM", breakTime: "6:00 PM", overtime: "1h 00m", nextAvailableShift: "Today", joinDate: "Jan 5, 2018" },
  { id: 10, name: "Nurse Ava Martinez", specialization: "Oncology Nurse", department: "Cancer Care", email: "a.martinez@hospital.com", phone: "+1 (555) 222-5566", avatar: "https://i.pravatar.cc/200?img=19", rating: 4.8, reviews: 142, patientsAssigned: 4, experience: 10, status: "available", schedule: "Mon – Fri", shiftStart: "09:00 AM", shiftEnd: "05:00 PM", breakTime: "1:00 PM", overtime: "0h 50m", nextAvailableShift: "Today", joinDate: "Sep 12, 2020" },
  { id: 11, name: "Nurse Noah Wilson", specialization: "ICU Specialist", department: "Critical Care", email: "n.wilson@hospital.com", phone: "+1 (555) 333-6677", avatar: "https://i.pravatar.cc/200?img=8", rating: 4.7, reviews: 110, patientsAssigned: 5, experience: 7, status: "on-shift", schedule: "Mon – Thu", shiftStart: "07:00 AM", shiftEnd: "03:00 PM", breakTime: "11:30 AM", overtime: "1h 05m", nextAvailableShift: "Today", joinDate: "Dec 2, 2021" },
  { id: 12, name: "Nurse Isabella Moore", specialization: "Dermatology Nurse", department: "Skin Care", email: "i.moore@hospital.com", phone: "+1 (555) 444-7788", avatar: "https://i.pravatar.cc/200?img=36", rating: 4.6, reviews: 76, patientsAssigned: 3, experience: 6, status: "available", schedule: "Tue – Sat", shiftStart: "10:00 AM", shiftEnd: "06:00 PM", breakTime: "2:30 PM", overtime: "0h 15m", nextAvailableShift: "Today", joinDate: "May 22, 2022" },
  { id: 13, name: "Nurse Ethan Anderson", specialization: "Neurology Nurse", department: "Neurology", email: "e.anderson@hospital.com", phone: "+1 (555) 555-8899", avatar: "https://i.pravatar.cc/200?img=17", rating: 4.9, reviews: 158, patientsAssigned: 4, experience: 11, status: "on-leave", schedule: "Mon – Fri", shiftStart: "08:00 AM", shiftEnd: "04:00 PM", breakTime: "12:30 PM", overtime: "—", nextAvailableShift: "Next Tue", joinDate: "Oct 30, 2019" },
  { id: 14, name: "Nurse Mia Thomas", specialization: "General Nurse", department: "General Ward", email: "m.thomas@hospital.com", phone: "+1 (555) 666-9900", avatar: "https://i.pravatar.cc/200?img=28", rating: 4.7, reviews: 120, patientsAssigned: 5, experience: 8, status: "available", schedule: "Mon – Fri", shiftStart: "09:00 AM", shiftEnd: "05:00 PM", breakTime: "1:30 PM", overtime: "0h 40m", nextAvailableShift: "Today", joinDate: "Jun 14, 2021" },
  { id: 15, name: "Nurse James White", specialization: "Geriatric Nurse", department: "Elder Care", email: "j.white@hospital.com", phone: "+1 (555) 777-2233", avatar: "https://i.pravatar.cc/200?img=5", rating: 4.8, reviews: 139, patientsAssigned: 4, experience: 10, status: "on-shift", schedule: "Wed – Sun", shiftStart: "07:00 AM", shiftEnd: "03:00 PM", breakTime: "11:00 AM", overtime: "1h 25m", nextAvailableShift: "Today", joinDate: "Mar 8, 2020" }
]

export const NURSE_STATUS_CONFIG = {
  "available": { label: "Available", dot: "bg-emerald-500", ring: "ring-emerald-500/30", bg: "bg-emerald-50 dark:bg-emerald-950/50", text: "text-emerald-700 dark:text-emerald-400" },
  "on-shift": { label: "On Shift", dot: "bg-blue-500 animate-pulse", ring: "ring-blue-500/30", bg: "bg-blue-50 dark:bg-blue-950/50", text: "text-blue-700 dark:text-blue-400" },
  "on-leave": { label: "On Leave", dot: "bg-amber-400", ring: "ring-amber-400/30", bg: "bg-amber-50 dark:bg-amber-950/50", text: "text-amber-700 dark:text-amber-400" },
  "off-duty": { label: "Off Duty", dot: "bg-zinc-400", ring: "ring-zinc-400/30", bg: "bg-zinc-100 dark:bg-zinc-800", text: "text-zinc-500 dark:text-zinc-400" },
}

// ─── Specialty badge styles (Notion-style) ───────────────────────────
const SPECIALTY_BADGE: Record<string, { dot: string; text: string; bg: string }> = {
  "ICU Specialist": { dot: "bg-red-500", text: "text-red-700 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30" },
  "Emergency Care": { dot: "bg-purple-500", text: "text-purple-700 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950/30" },
  "Pediatric Nurse": { dot: "bg-blue-500", text: "text-blue-700 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30" },
  "Surgical Nurse": { dot: "bg-amber-500", text: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30" },
  "Neonatal Specialist": { dot: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
}
const DEFAULT_SPEC_BADGE = { dot: "bg-zinc-400", text: "text-zinc-600 dark:text-zinc-400", bg: "bg-zinc-100 dark:bg-zinc-800" }

const COLS = [
  { key: "name", label: "Nurse Name", width: "minmax(200px, 1fr)", sortable: true },
  { key: "specialization", label: "Specialization", width: "130px", sortable: true },
  { key: "status", label: "Status", width: "120px", sortable: true },
  { key: "department", label: "Department", width: "130px", sortable: true },
  { key: "rating", label: "Rating", width: "90px", sortable: true },
  { key: "patientsAssigned", label: "Patients", width: "80px", sortable: true },
  { key: "experience", label: "Experience", width: "90px", sortable: true },
  { key: "joinDate", label: "Join Date", width: "100px", sortable: true },
  { key: "action", label: "", width: "40px", sortable: false },
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
      joinDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
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
  const [showSearch, setShowSearch] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [filterOpen, setFilterOpen] = useState(false)

  const [sort, setSort] = useState<{ field: string, dir: "asc" | "desc" }>({ field: "name", dir: "asc" })
  const [sortOpen, setSortOpen] = useState(false)

  const [page, setPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

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
    let aVal: any = (a as any)[sort.field]
    let bVal: any = (b as any)[sort.field]
    if (aVal < bVal) return sort.dir === "asc" ? -1 : 1
    if (aVal > bVal) return sort.dir === "asc" ? 1 : -1
    return 0
  })

  const pageDocs = sorted.slice((page - 1) * itemsPerPage, page * itemsPerPage)
  const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage))

  if (view === "profile" && profileNurse) {
    return (
      <NurseProfileView
        nurse={profileNurse}
        onBack={handleBackToList}
      />
    )
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 overflow-hidden">

      {/* ── HEADER ── */}
      <div className="px-8 pt-6 pb-0 shrink-0">
        <h1 className="text-[26px] font-bold text-zinc-900 dark:text-white tracking-tight">
          Nurse Registry
        </h1>
        <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-1">
          Manage your nursing staff, assignments, and schedules.
        </p>

        {/* ── Actions row ── */}
        <div className="flex items-center justify-end mt-5">
          <div className="flex items-center gap-2">
            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <button className={cn(
                  "flex items-center gap-1.5 h-8 px-3 rounded-lg border transition-all shadow-sm active:scale-95 text-[12px] font-medium",
                  statusFilter !== "all"
                    ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white"
                    : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                )}>
                  <FunnelSimple className="w-3.5 h-3.5" weight="bold" />
                  {statusFilter === "all" ? "Status" : statusFilter.replace("-", " ")}
                  {statusFilter !== "all" && (
                    <span
                      role="button"
                      onClick={(e) => { e.stopPropagation(); setStatusFilter("all"); setPage(1); }}
                      className="ml-1 p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-44 p-1 bg-white dark:bg-[#232323] border-zinc-200 dark:border-zinc-700">
                <p className="px-2 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Filter Status</p>
                {[
                  { id: "all", label: "All Statuses" },
                  { id: "available", label: "Available" },
                  { id: "on-shift", label: "On Shift" },
                  { id: "on-leave", label: "On Leave" },
                  { id: "off-duty", label: "Off Duty" }
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => { setStatusFilter(s.id); setPage(1); setFilterOpen(false); }}
                    className={cn(
                      "w-full text-left px-2 py-1.5 rounded-sm text-[12px] transition-colors flex items-center gap-2 capitalize",
                      statusFilter === s.id
                        ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </PopoverContent>
            </Popover>

            <Popover open={sortOpen} onOpenChange={setSortOpen}>
              <PopoverTrigger asChild>
                <button className={cn(
                  "flex items-center gap-1.5 h-8 px-3 rounded-lg border transition-all shadow-sm active:scale-95 text-[12px] font-medium",
                  (sort.field !== "name" || sort.dir !== "asc")
                    ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white"
                    : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                )}>
                  <ArrowsDownUp className="w-3.5 h-3.5" weight="bold" />
                  Sort
                  {(sort.field !== "name" || sort.dir !== "asc") && (
                    <span
                      role="button"
                      onClick={(e) => { e.stopPropagation(); setSort({ field: "name", dir: "asc" }); setPage(1); }}
                      className="ml-1 p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-44 p-1 bg-white dark:bg-[#232323] border-zinc-200 dark:border-zinc-700">
                <p className="px-2 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Sort by</p>
                {[
                  { field: "name", dir: "asc", label: "Name (A-Z)", icon: ListDashes },
                  { field: "experience", dir: "desc", label: "Experience", icon: Clock },
                  { field: "specialization", dir: "asc", label: "Specialty", icon: Syringe },
                ].map(opt => (
                  <button
                    key={opt.field + opt.dir}
                    onClick={() => { setSort({ field: opt.field, dir: opt.dir as "asc" | "desc" }); setSortOpen(false); setPage(1); }}
                    className={cn(
                      "w-full text-left px-2 py-1.5 rounded-sm text-[12px] transition-colors flex items-center gap-2",
                      sort.field === opt.field && sort.dir === opt.dir
                        ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    )}
                  >
                    <opt.icon className="w-4 h-4" />
                    {opt.label}
                  </button>
                ))}
              </PopoverContent>
            </Popover>

            {/* Search */}
            {!showSearch ? (
              <button
                onClick={() => setShowSearch(true)}
                className={cn(
                  "flex items-center gap-1.5 h-8 px-3 rounded-lg border transition-all shadow-sm active:scale-95 text-[12px] font-medium",
                  search
                    ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white"
                    : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                )}
              >
                <MagnifyingGlass className="w-3.5 h-3.5" weight="bold" /> Search
                {search && (
                  <span
                    role="button"
                    onClick={(e) => { e.stopPropagation(); setSearch(""); setPage(1); }}
                    className="ml-1 p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </span>
                )}
              </button>
            ) : (
              <motion.div
                initial={{ width: 80, opacity: 0 }}
                animate={{ width: 220, opacity: 1 }}
                className="relative overflow-hidden flex items-center"
              >
                <MagnifyingGlass className="absolute left-2.5 w-3.5 h-3.5 text-zinc-400" />
                <Input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search nurses..."
                  autoFocus
                  onBlur={() => { if (!search) setShowSearch(false); }}
                  onKeyDown={(e) => { if (e.key === "Escape") { setShowSearch(false); setSearch(""); setPage(1); } }}
                  className="pl-8 pr-8 h-[30px] bg-zinc-100 dark:bg-zinc-800 border-transparent focus-visible:border-zinc-300 dark:focus-visible:border-zinc-600 text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400 text-[12px] rounded-md w-full shadow-none focus-visible:ring-0"
                />
                <button
                  onMouseDown={(e) => { e.preventDefault(); setSearch(""); setShowSearch(false); setPage(1); }}
                  className="absolute right-1.5 p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}

            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[12px] font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 active:scale-[0.97] transition-all"
            >
              <Plus className="w-3.5 h-3.5" weight="bold" />
              Add Nurse
            </button>
          </div>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="flex-1 overflow-auto mt-4 px-8 pb-8">
        <Frame className="w-full">
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden min-w-[880px]">
            {/* Header */}
            <div
              className="grid items-center bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 px-4 shrink-0"
              style={{ gridTemplateColumns: COLS.map(c => c.width).join(" ") }}
            >
              {COLS.map((col, idx) => (
                <div
                  key={col.label + idx}
                  className={cn(
                    "py-2 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider",
                    col.label === "" ? "text-right" : ""
                  )}
                >
                  <span className={cn("inline-flex items-center gap-1", col.label === "" && "justify-end w-full")}>
                    {col.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="py-20 text-center">
                  <MagnifyingGlass className="w-8 h-8 text-zinc-200 dark:text-zinc-800 mx-auto mb-2" />
                  <p className="text-[13px] font-medium text-zinc-500">No nurses found</p>
                  <p className="text-[12px] text-zinc-400 mt-0.5">Try adjusting your search or filters</p>
                </div>
              ) : pageDocs.map((nurse, i) => {
                const status = (NURSE_STATUS_CONFIG as any)[nurse.status]

                return (
                  <motion.div
                    key={nurse.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02, duration: 0.2 }}
                    className="group grid items-center border-b border-zinc-100 dark:border-zinc-800 last:border-0 transition-colors px-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 cursor-pointer"
                    style={{ gridTemplateColumns: COLS.map(c => c.width).join(" ") }}
                    onClick={() => handleViewProfile(nurse)}
                  >
                    {/* Name */}
                    <div className="py-3 flex items-center gap-3 pr-4">
                      <Avatar className={cn("size-8 ring-1", status.ring)}>
                        <AvatarImage src={nurse.avatar} />
                        <AvatarFallback className="text-[11px] font-black bg-zinc-100 dark:bg-zinc-800">
                          {nurse.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100 truncate">
                          {nurse.name}
                        </span>
                        <span className="text-[11px] text-zinc-400 truncate">
                          {nurse.email}
                        </span>
                      </div>
                    </div>

                    {/* Specialization */}
                    <div className="py-3">
                      {(() => {
                        const sb = SPECIALTY_BADGE[nurse.specialization] ?? DEFAULT_SPEC_BADGE
                        return (
                          <button
                            type="button"
                            onClick={e => e.stopPropagation()}
                            className={cn(
                              "inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-lg border shadow-sm transition-all hover:brightness-95 active:scale-95 cursor-pointer",
                              sb.bg, sb.text, "border-zinc-200/50 dark:border-zinc-700/50"
                            )}
                          >
                            <span className={cn("size-1.5 rounded-full", sb.dot)} />
                            {nurse.specialization}
                          </button>
                        )
                      })()}
                    </div>

                    {/* Status */}
                    <div className="py-3">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 text-[12px] font-medium px-2 py-0.5 rounded",
                        status.bg, status.text
                      )}>
                        <span className={cn("size-1.5 rounded-full", status.dot)} />
                        {status.label}
                      </span>
                    </div>

                    {/* Department */}
                    <div className="py-3">
                      <span className="text-[13px] text-zinc-700 dark:text-zinc-300">
                        {nurse.department}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="py-3">
                      <div className="flex items-center gap-1">
                        <Star weight="fill" className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">{nurse.rating}</span>
                        <span className="text-[11px] text-zinc-400">({nurse.reviews})</span>
                      </div>
                    </div>

                    {/* Patients */}
                    <div className="py-3">
                      <span className="text-[13px] text-zinc-700 dark:text-zinc-300">{nurse.patientsAssigned}</span>
                    </div>

                    {/* Experience */}
                    <div className="py-3">
                      <span className="text-[13px] text-zinc-700 dark:text-zinc-300">{nurse.experience} yrs</span>
                    </div>

                    {/* Join Date */}
                    <div className="py-3">
                      <span className="text-[12px] text-zinc-500 dark:text-zinc-400">{nurse.joinDate}</span>
                    </div>

                    {/* Actions */}
                    <div className="py-3 flex items-center justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            onClick={e => e.stopPropagation()}
                            className="p-1.5 rounded-lg text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-all opacity-0 group-hover:opacity-100"
                          >
                            <DotsThree weight="bold" className="w-5 h-5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 p-1 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl">
                          <DropdownMenuItem
                            onClick={(e) => { e.stopPropagation(); handleViewProfile(nurse); }}
                            className="text-[12px] font-medium rounded-lg gap-2 px-2.5 py-2 cursor-pointer"
                          >
                            <UserCircle className="w-4 h-4 text-zinc-400" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-[12px] font-medium rounded-lg gap-2 px-2.5 py-2 cursor-pointer">
                            <Envelope className="w-4 h-4 text-zinc-400" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-0.5" />
                          <DropdownMenuItem className="text-[12px] font-medium rounded-lg gap-2 px-2.5 py-2 cursor-pointer text-rose-500 focus:text-rose-500 focus:bg-rose-50 dark:focus:bg-rose-950/20">
                            <Trash className="w-4 h-4" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </Frame>

        {/* Pagination Controls */}
        {filtered.length > 0 && (
          <div className="mt-4 flex items-center justify-between px-1 shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-zinc-500 dark:text-zinc-400">Rows per page</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white text-[12px] font-medium transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700">
                      {itemsPerPage}
                      <CaretDown className="w-3 h-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-[60px] p-1 bg-white dark:bg-[#232323] border-zinc-200 dark:border-zinc-700">
                    {[10, 20, 30, 50].map(val => (
                      <DropdownMenuItem
                        key={val}
                        onClick={() => setItemsPerPage(val)}
                        className={cn(
                          "rounded-sm text-[12px] px-2 py-1.5 cursor-pointer transition-colors",
                          itemsPerPage === val ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                        )}
                      >
                        {val}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-[12px] text-zinc-500 dark:text-zinc-400">
                Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filtered.length)} of {filtered.length} nurses
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-2.5 py-1.5 rounded-md text-[13px] font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      "w-7 h-7 rounded-md text-[13px] font-medium flex items-center justify-center transition-colors",
                      page === p
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1.5 rounded-md text-[13px] font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <AddNurseModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={(n) => setNurses(prev => [n, ...prev])}
      />
    </div>
  )
}
