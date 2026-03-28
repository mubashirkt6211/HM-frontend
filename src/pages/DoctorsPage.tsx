"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  MagnifyingGlass, Stethoscope, Plus, DotsThree,
  CalendarBlank, Heartbeat, Brain, Bandaids, Virus, Pill,
  Users, CaretLeft, CaretRight, Funnel, Star,
  ArrowUp, ArrowDown, User, Envelope, Phone as PhoneIcon,
  Briefcase, Clock, UserCircle, Trash, X,
  MapPin, Medal, ChartBar,
} from "@phosphor-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import {
  Sheet, SheetContent,
} from "@/components/ui/sheet"

// ─── Types ────────────────────────────────────────────────────
interface Doctor {
  id: number
  name: string
  specialty: string
  department: string
  email: string
  phone: string
  avatar: string
  rating: number
  reviews: number
  patients: number
  experience: number
  status: "available" | "in-surgery" | "on-leave" | "off-duty"
  schedule: string
  shiftStart: string
  shiftEnd: string
  breakTime: string
  overtime: string
  nextAvailable: string
  specialtyIcon: React.ElementType
  accentFrom: string
  accentTo: string
}

// ─── Data ────────────────────────────────────────────────────
const DOCTORS: Doctor[] = [
  { id: 1, name: "Dr. Alexandra Reed", specialty: "Cardiology", department: "Cardiac Care", email: "a.reed@hospital.com", phone: "+1 (555) 201-4420", avatar: "https://i.pravatar.cc/200?img=47", rating: 4.9, reviews: 218, patients: 142, experience: 14, status: "available", schedule: "Mon – Fri", shiftStart: "08:00 AM", shiftEnd: "04:00 PM", breakTime: "1:00 PM", overtime: "0h 00m", nextAvailable: "Today, 2:30 PM", specialtyIcon: Heartbeat, accentFrom: "from-rose-500", accentTo: "to-pink-600" },
  { id: 2, name: "Dr. Marcus Thompson", specialty: "Neurology", department: "Neuroscience", email: "m.thompson@hospital.com", phone: "+1 (555) 332-8801", avatar: "https://i.pravatar.cc/200?img=52", rating: 4.7, reviews: 134, patients: 98, experience: 10, status: "in-surgery", schedule: "Tue – Sat", shiftStart: "09:00 AM", shiftEnd: "05:00 PM", breakTime: "1:00 PM", overtime: "2h 10m", nextAvailable: "Tomorrow, 10:00 AM", specialtyIcon: Brain, accentFrom: "from-violet-500", accentTo: "to-purple-600" },
  { id: 3, name: "Dr. Priya Sharma", specialty: "Pediatrics", department: "Child Health", email: "p.sharma@hospital.com", phone: "+1 (555) 419-7760", avatar: "https://i.pravatar.cc/200?img=44", rating: 4.8, reviews: 302, patients: 215, experience: 8, status: "available", schedule: "Mon – Fri", shiftStart: "07:00 AM", shiftEnd: "03:00 PM", breakTime: "12:00 PM", overtime: "1h 30m", nextAvailable: "Today, 4:00 PM", specialtyIcon: Bandaids, accentFrom: "from-sky-500", accentTo: "to-blue-600" },
  { id: 4, name: "Dr. James Okafor", specialty: "Orthopedics", department: "Bone & Joint", email: "j.okafor@hospital.com", phone: "+1 (555) 687-2239", avatar: "https://i.pravatar.cc/200?img=68", rating: 4.6, reviews: 189, patients: 177, experience: 18, status: "off-duty", schedule: "Mon – Thu", shiftStart: "10:00 AM", shiftEnd: "06:00 PM", breakTime: "2:00 PM", overtime: "–", nextAvailable: "Wed, 10:00 AM", specialtyIcon: Stethoscope, accentFrom: "from-amber-500", accentTo: "to-orange-600" },
  { id: 5, name: "Dr. Sarah Mitchell", specialty: "Oncology", department: "Cancer Center", email: "s.mitchell@hospital.com", phone: "+1 (555) 524-9913", avatar: "https://i.pravatar.cc/200?img=45", rating: 4.9, reviews: 97, patients: 89, experience: 20, status: "on-leave", schedule: "Wed – Sun", shiftStart: "08:00 AM", shiftEnd: "04:00 PM", breakTime: "12:30 PM", overtime: "–", nextAvailable: "Next Mon", specialtyIcon: Virus, accentFrom: "from-emerald-500", accentTo: "to-teal-600" },
  { id: 6, name: "Dr. Chen Wei", specialty: "Dermatology", department: "Skin & Allergy", email: "c.wei@hospital.com", phone: "+1 (555) 741-3358", avatar: "https://i.pravatar.cc/200?img=15", rating: 4.7, reviews: 411, patients: 310, experience: 12, status: "available", schedule: "Mon – Fri", shiftStart: "09:00 AM", shiftEnd: "05:00 PM", breakTime: "1:00 PM", overtime: "0h 45m", nextAvailable: "Today, 3:15 PM", specialtyIcon: Pill, accentFrom: "from-indigo-500", accentTo: "to-blue-600" },
  { id: 7, name: "Dr. Elena Vasquez", specialty: "Radiology", department: "Imaging", email: "e.vasquez@hospital.com", phone: "+1 (555) 882-1107", avatar: "https://i.pravatar.cc/200?img=49", rating: 4.5, reviews: 88, patients: 74, experience: 9, status: "available", schedule: "Mon – Fri", shiftStart: "08:30 AM", shiftEnd: "04:30 PM", breakTime: "1:00 PM", overtime: "1h 15m", nextAvailable: "Today, 11:00 AM", specialtyIcon: Heartbeat, accentFrom: "from-cyan-500", accentTo: "to-sky-600" },
  { id: 8, name: "Dr. Liam Foster", specialty: "Psychiatry", department: "Mental Health", email: "l.foster@hospital.com", phone: "+1 (555) 334-9902", avatar: "https://i.pravatar.cc/200?img=60", rating: 4.8, reviews: 162, patients: 130, experience: 11, status: "in-surgery", schedule: "Tue – Sat", shiftStart: "10:00 AM", shiftEnd: "06:00 PM", breakTime: "2:00 PM", overtime: "–", nextAvailable: "Tomorrow, 10:00 AM", specialtyIcon: Brain, accentFrom: "from-fuchsia-500", accentTo: "to-pink-600" },
]

const STATUS_CONFIG = {
  "available": { label: "On time", dot: "bg-emerald-500", ring: "ring-emerald-500/30", bg: "bg-emerald-50 dark:bg-emerald-950/50", text: "text-emerald-700 dark:text-emerald-400" },
  "in-surgery": { label: "In Surgery", dot: "bg-rose-500 animate-pulse", ring: "ring-rose-500/30", bg: "bg-rose-50 dark:bg-rose-950/50", text: "text-rose-700 dark:text-rose-400" },
  "on-leave": { label: "On Leave", dot: "bg-amber-400", ring: "ring-amber-400/30", bg: "bg-amber-50 dark:bg-amber-950/50", text: "text-amber-700 dark:text-amber-400" },
  "off-duty": { label: "Off Duty", dot: "bg-zinc-400", ring: "ring-zinc-400/30", bg: "bg-zinc-100 dark:bg-zinc-800", text: "text-zinc-500 dark:text-zinc-400" },
}



const STATS = [
  { label: "Total Doctors", value: "32", sub: "+12.04% Last 30 days", icon: Users, trend: "up" },
  { label: "Available Now", value: "19", sub: "+28.00% Last 30 days", icon: Heartbeat, trend: "up" },
  { label: "In Surgery", value: "05", sub: "+14.11% Last 30 days", icon: Stethoscope, trend: "up" },
  { label: "On Leave", value: "08", sub: "–4.06% Last 30 days", icon: CalendarBlank, trend: "down" },
]

const COLS = [
  { key: "name", label: "Doctor name", sortable: true },
  { key: "shiftStart", label: "Clock-in & Out", sortable: false },
  { key: "breakTime", label: "Break time", sortable: false },
  { key: "overtime", label: "Overtime", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "action", label: "Action", sortable: false },
]

const PER_PAGE_OPTIONS = ["5", "10", "15", "20"]

// ─── Field helper style ────────────────────────────────────────
const fieldCls = "w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-[13px] font-medium outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-400 dark:focus:border-zinc-600 transition-all placeholder:text-zinc-400"
const labelCls = "block text-[11px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5"

// ─── Add Doctor Modal ─────────────────────────────────────────
function AddDoctorModal({
  open, onClose, onAdd,
}: {
  open: boolean
  onClose: () => void
  onAdd: (doctor: Doctor) => void
}) {
  const empty = { name: "", email: "", phone: "", specialty: "", department: "", schedule: "", shiftStart: "09:00 AM", shiftEnd: "05:00 PM", status: "available" as Doctor["status"] }
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
    if (!form.specialty.trim()) errs.specialty = "Required"
    if (!form.department.trim()) errs.department = "Required"
    if (!form.schedule.trim()) errs.schedule = "Required"
    return errs
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    const avatarId = Math.floor(Math.random() * 70) + 1
    const icons: React.ElementType[] = [Heartbeat, Brain, Bandaids, Virus, Pill, Stethoscope]
    const accents = [
      { from: "from-rose-500", to: "to-pink-600" },
      { from: "from-violet-500", to: "to-purple-600" },
      { from: "from-sky-500", to: "to-blue-600" },
      { from: "from-amber-500", to: "to-orange-600" },
      { from: "from-emerald-500", to: "to-teal-600" },
      { from: "from-indigo-500", to: "to-blue-600" },
    ]
    const pick = Math.floor(Math.random() * icons.length)
    const accent = accents[pick]
    onAdd({
      id: Date.now(),
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || "—",
      specialty: form.specialty.trim(),
      department: form.department.trim(),
      schedule: form.schedule.trim(),
      shiftStart: form.shiftStart || "09:00 AM",
      shiftEnd: form.shiftEnd || "05:00 PM",
      breakTime: "1:00 PM",
      overtime: "—",
      status: form.status,
      rating: 4.5,
      reviews: 0,
      patients: 0,
      experience: 0,
      nextAvailable: "Today",
      specialtyIcon: icons[pick],
      accentFrom: accent.from,
      accentTo: accent.to,
      avatar: `https://i.pravatar.cc/200?img=${avatarId}`,
    })
    setForm({ ...empty })
    setErrors({})
    onClose()
  }

  function handleClose() {
    setForm({ ...empty })
    setErrors({})
    onClose()
  }

  const SPECIALTIES = ["Cardiology", "Neurology", "Pediatrics", "Orthopedics", "Oncology", "Dermatology", "Radiology", "Psychiatry", "General Surgery", "Internal Medicine", "Emergency Medicine", "Anesthesiology"]
  const STATUSES: { value: Doctor["status"]; label: string }[] = [
    { value: "available", label: "Available" },
    { value: "in-surgery", label: "In Surgery" },
    { value: "on-leave", label: "On Leave" },
    { value: "off-duty", label: "Off Duty" },
  ]

  return (
    <Dialog open={open} onOpenChange={v => !v && handleClose()}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center shrink-0">
              <Stethoscope className="w-4.5 h-4.5 text-white dark:text-zinc-900" weight="duotone" />
            </div>
            <div>
              <DialogTitle className="text-[17px]">Add New Doctor</DialogTitle>
              <DialogDescription className="text-[12px] mt-0.5">Fill in the details to register a new doctor.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">

            {/* Full Name */}
            <div>
              <label className={labelCls}><User className="inline w-3 h-3 mr-1" />Full Name *</label>
              <input
                autoFocus
                value={form.name}
                onChange={e => set("name", e.target.value)}
                placeholder="e.g. Dr. Jane Smith"
                className={cn(fieldCls, errors.name && "border-rose-400 focus:border-rose-400")}
              />
              {errors.name && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.name}</p>}
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}><Envelope className="inline w-3 h-3 mr-1" />Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set("email", e.target.value)}
                  placeholder="doctor@hospital.com"
                  className={cn(fieldCls, errors.email && "border-rose-400 focus:border-rose-400")}
                />
                {errors.email && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.email}</p>}
              </div>
              <div>
                <label className={labelCls}><PhoneIcon className="inline w-3 h-3 mr-1" />Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => set("phone", e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className={fieldCls}
                />
              </div>
            </div>

            {/* Specialty + Department */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}><Briefcase className="inline w-3 h-3 mr-1" />Specialty *</label>
                <Select value={form.specialty} onValueChange={v => set("specialty", v)}>
                  <SelectTrigger className={cn("h-[42px] text-[13px] rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800", errors.specialty && "border-rose-400")}>
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIALTIES.map(s => <SelectItem key={s} value={s} className="text-[13px]">{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.specialty && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.specialty}</p>}
              </div>
              <div>
                <label className={labelCls}>Department *</label>
                <input
                  value={form.department}
                  onChange={e => set("department", e.target.value)}
                  placeholder="e.g. Cardiac Care"
                  className={cn(fieldCls, errors.department && "border-rose-400 focus:border-rose-400")}
                />
                {errors.department && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.department}</p>}
              </div>
            </div>

            {/* Schedule */}
            <div>
              <label className={labelCls}><Clock className="inline w-3 h-3 mr-1" />Schedule *</label>
              <input
                value={form.schedule}
                onChange={e => set("schedule", e.target.value)}
                placeholder="e.g. Mon – Fri"
                className={cn(fieldCls, errors.schedule && "border-rose-400 focus:border-rose-400")}
              />
              {errors.schedule && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.schedule}</p>}
            </div>

            {/* Shift Start + End */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Shift Start</label>
                <input
                  value={form.shiftStart}
                  onChange={e => set("shiftStart", e.target.value)}
                  placeholder="09:00 AM"
                  className={fieldCls}
                />
              </div>
              <div>
                <label className={labelCls}>Shift End</label>
                <input
                  value={form.shiftEnd}
                  onChange={e => set("shiftEnd", e.target.value)}
                  placeholder="05:00 PM"
                  className={fieldCls}
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className={labelCls}>Initial Status</label>
              <div className="flex items-center gap-2 flex-wrap">
                {STATUSES.map(s => {
                  const cfg = STATUS_CONFIG[s.value]
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => set("status", s.value)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold border transition-all",
                        form.status === s.value
                          ? cn("border-transparent", cfg.bg, cfg.text)
                          : "border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-zinc-400"
                      )}
                    >
                      <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
                      {s.label}
                    </button>
                  )
                })}
              </div>
            </div>

          </div>

          {/* Footer */}
          <DialogFooter className="px-6 pb-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex-row gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-[13px] font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[13px] font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" weight="bold" />
              Add Doctor
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}



// ─── Component ───────────────────────────────────────────────
export function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>(DOCTORS)
  const [showAdd, setShowAdd] = useState(false)
  const [view, setView] = useState<"list" | "profile">("list")
  const [profileDoctor, setProfileDoctor] = useState<Doctor | null>(null)

  function handleAddDoctor(doc: Doctor) {
    setDoctors(prev => [doc, ...prev])
  }

  function handleViewProfile(doc: Doctor) {
    setProfileDoctor(doc)
    setView("profile")
  }

  function handleBackToList() {
    setView("list")
  }

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [selected, setSelected] = useState<number[]>([])

  // filter
  const filtered = doctors.filter(d => {
    const q = search.toLowerCase()
    const matchSearch = d.name.toLowerCase().includes(q)
      || d.specialty.toLowerCase().includes(q)
      || d.email.toLowerCase().includes(q)
    const matchStatus = statusFilter === "all" || d.status === statusFilter
    return matchSearch && matchStatus
  })

  // sort
  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0
    let aVal: string | number = (a as never)[sortKey]
    let bVal: string | number = (b as never)[sortKey]
    if (typeof aVal === "string") aVal = aVal.toLowerCase()
    if (typeof bVal === "string") bVal = bVal.toLowerCase()
    if (aVal < bVal) return sortDir === "asc" ? -1 : 1
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1
    return 0
  })

  // paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage))
  const pageDocs = sorted.slice((page - 1) * perPage, page * perPage)

  function handleSort(key: string) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("asc") }
  }

  function toggleRow(id: number) {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  }

  function toggleAll() {
    const ids = pageDocs.map(d => d.id)
    const allSelected = ids.every(id => selected.includes(id))
    setSelected(allSelected ? selected.filter(id => !ids.includes(id)) : [...new Set([...selected, ...ids])])
  }

  const allOnPage = pageDocs.every(d => selected.includes(d.id))

  if (view === "profile" && profileDoctor) {
    return (
      <DoctorProfileView
        doctor={profileDoctor}
        onBack={handleBackToList}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6 pt-6 pb-10 px-6 md:px-8 animate-in fade-in slide-in-from-bottom-3 duration-500">




      {/* ── TABLE CARD ── */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-zinc-100 dark:border-zinc-800/60">
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-black text-zinc-900 dark:text-zinc-100">Doctors</h2>
            <span className="text-[11px] font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-full px-2 py-0.5">
              {sorted.length}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                className="w-44 pl-8 pr-3 py-1.5 text-[13px] font-medium rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors placeholder:text-zinc-400"
              />
            </div>

            {/* Filter dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[13px] font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                  <Funnel className="w-3.5 h-3.5" />
                  Filter
                  {statusFilter !== "all" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 ml-0.5" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {["all", "available", "in-surgery", "on-leave", "off-duty"].map(s => (
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

            {/* Add button */}
            <Button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 h-auto rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[13px] font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" weight="bold" />
              Add New Doctor
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800/60">
                {/* Checkbox */}
                <th className="w-10 pl-5 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allOnPage && pageDocs.length > 0}
                    onChange={toggleAll}
                    className="w-3.5 h-3.5 rounded border-zinc-300 accent-zinc-900 cursor-pointer"
                  />
                </th>
                {COLS.map(col => (
                  <th
                    key={col.key}
                    className={cn(
                      "py-3 pr-4 text-left text-[11px] font-black text-zinc-400 uppercase tracking-wider whitespace-nowrap",
                      col.sortable && "cursor-pointer select-none hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                    )}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {col.sortable && sortKey === col.key && (
                        sortDir === "asc"
                          ? <ArrowUp className="w-3 h-3" weight="bold" />
                          : <ArrowDown className="w-3 h-3" weight="bold" />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {pageDocs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        <Stethoscope className="w-7 h-7 text-zinc-400" weight="duotone" />
                      </div>
                      <p className="text-[14px] font-bold text-zinc-500">No doctors found</p>
                      <button
                        onClick={() => { setSearch(""); setStatusFilter("all") }}
                        className="text-[12px] font-semibold text-blue-600 hover:underline"
                      >
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                pageDocs.map((doctor, idx) => {
                  const status = STATUS_CONFIG[doctor.status]
                  const isSelected = selected.includes(doctor.id)
                  return (
                    <tr
                      key={doctor.id}
                      className={cn(
                        "group border-b border-zinc-50 dark:border-zinc-800/40 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors",
                        isSelected && "bg-blue-50/40 dark:bg-blue-900/10",
                        idx === pageDocs.length - 1 && "border-b-0"
                      )}
                    >
                      {/* Checkbox */}
                      <td className="pl-5 py-3.5 w-10">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRow(doctor.id)}
                          className="w-3.5 h-3.5 rounded border-zinc-300 accent-zinc-900 cursor-pointer"
                        />
                      </td>

                      {/* Doctor name */}
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <Avatar className={cn("size-9 ring-2", status.ring)}>
                              <AvatarImage src={doctor.avatar} alt={doctor.name} />
                              <AvatarFallback className="text-[12px] font-black bg-zinc-100 dark:bg-zinc-800">
                                {doctor.name.split(" ").map(n => n[0]).slice(1).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className={cn("absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-[1.5px] border-white dark:border-zinc-900", status.dot)} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight truncate">{doctor.name}</p>
                            <p className="text-[11px] text-zinc-400 font-medium truncate">{doctor.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Clock-in & Out */}
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-1.5 text-[12px] font-semibold">
                          <span className="text-zinc-900 dark:text-zinc-100">{doctor.shiftStart}</span>
                          <span className="text-zinc-300 dark:text-zinc-600">→</span>
                          <span className="text-zinc-500 dark:text-zinc-400">{doctor.shiftEnd}</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5 font-medium">{doctor.specialty} · {doctor.department}</p>
                      </td>

                      {/* Break time */}
                      <td className="py-3.5 pr-4">
                        <span className="text-[13px] font-semibold text-zinc-700 dark:text-zinc-300">{doctor.breakTime}</span>
                      </td>

                      {/* Overtime */}
                      <td className="py-3.5 pr-4">
                        <span className={cn(
                          "text-[13px] font-bold",
                          doctor.overtime === "–" ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-700 dark:text-zinc-300"
                        )}>
                          {doctor.overtime}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 pr-4">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 text-[11px] font-black px-2.5 py-1 rounded-full",
                          status.bg, status.text
                        )}>
                          <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", status.dot)} />
                          {status.label}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 pr-5">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                              <DotsThree className="w-4 h-4" weight="bold" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem
                              className="text-[13px] flex items-center gap-2"
                              onClick={() => handleViewProfile(doctor)}
                            >
                              <UserCircle className="w-4 h-4 text-zinc-400" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-[13px] flex items-center gap-2">
                              <Envelope className="w-4 h-4 text-zinc-400" />
                              <a href={`mailto:${doctor.email}`} className="w-full">Send Email</a>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-[13px] flex items-center gap-2">
                              <PhoneIcon className="w-4 h-4 text-zinc-400" />
                              <a href={`tel:${doctor.phone}`} className="w-full">Call</a>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-[13px] flex items-center gap-2 text-rose-600 dark:text-rose-400 focus:text-rose-600">
                              <Trash className="w-4 h-4" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-zinc-100 dark:border-zinc-800/60">
          {/* Per page */}
          <div className="flex items-center gap-2 text-[13px] font-medium text-zinc-500">
            <span>Show</span>
            <Select
              value={String(perPage)}
              onValueChange={v => { setPerPage(Number(v)); setPage(1) }}
            >
              <SelectTrigger className="h-7 w-16 text-[12px] font-bold rounded-lg border-zinc-200 dark:border-zinc-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PER_PAGE_OPTIONS.map(o => (
                  <SelectItem key={o} value={o} className="text-[13px]">{o}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>Doctors per page</span>
          </div>

          {/* Page buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <CaretLeft className="w-3.5 h-3.5" weight="bold" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
              const show = p === 1 || p === totalPages || Math.abs(p - page) <= 1
              if (!show && (p === 2 || p === totalPages - 1)) {
                return <span key={p} className="w-7 h-7 flex items-center justify-center text-zinc-400 text-[12px]">…</span>
              }
              if (!show) return null
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "w-7 h-7 flex items-center justify-center rounded-lg text-[12px] font-bold transition-all",
                    page === p
                      ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                      : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  )}
                >
                  {p}
                </button>
              )
            })}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <CaretRight className="w-3.5 h-3.5" weight="bold" />
            </button>
          </div>
        </div>
      </div>

      {/* ── ADD DOCTOR MODAL ── */}
      <AddDoctorModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={handleAddDoctor}
      />
    </div>
  )
}

// ─── Doctor Profile View ──────────────────────────────────────
function DoctorProfileView({
  doctor,
  onBack
}: {
  doctor: Doctor,
  onBack: () => void
}) {
  const status = STATUS_CONFIG[doctor.status]
  const Icon = doctor.specialtyIcon

  return (
    <div className="flex flex-col gap-8 pt-6 pb-16 px-6 md:px-10 animate-in fade-in slide-in-from-right-4 duration-500">

      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="group flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <CaretLeft className="w-4 h-4 text-zinc-900 dark:text-zinc-100" weight="bold" />
          </div>
          <span className="text-[13px] font-black text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 uppercase tracking-wider">Back to Directory</span>
        </button>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl h-9 border-zinc-200 dark:border-zinc-800 text-[13px] font-bold">Edit Profile</Button>
          <Button className={cn("rounded-xl h-9 text-[13px] font-bold text-white", doctor.accentFrom, doctor.accentTo, "bg-gradient-to-r")}>Print Records</Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left: Identity & Key Stats */}
        <div className="lg:col-span-4 flex flex-col gap-6">

          {/* Identity Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center">
            <div className="relative mb-6">
              <Avatar className={cn("size-32 border-4 border-white dark:border-zinc-950 shadow-2xl ring-4", status.ring)}>
                <AvatarImage src={doctor.avatar} alt={doctor.name} />
                <AvatarFallback className="text-3xl font-black bg-zinc-100 dark:bg-zinc-800">
                  {doctor.name.split(" ").map(n => n[0]).slice(1).join("")}
                </AvatarFallback>
              </Avatar>
              <span className={cn("absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white dark:border-zinc-950 shadow-lg", status.dot)} />
            </div>

            <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 leading-tight mb-2">{doctor.name}</h1>
            <div className="flex items-center gap-2 py-1 px-3 rounded-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 mb-6">
              <div className={cn("w-5 h-5 rounded-md flex items-center justify-center bg-gradient-to-br", doctor.accentFrom, doctor.accentTo)}>
                <Icon className="w-3 h-3 text-white" weight="bold" />
              </div>
              <span className="text-[13px] font-bold text-zinc-600 dark:text-zinc-300">{doctor.specialty}</span>
            </div>

            <span className={cn("text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest transition-all", status.bg, status.text)}>
              {status.label}
            </span>

            <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800/60 my-8" />

            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="text-center">
                <p className="text-xl font-black text-zinc-900 dark:text-zinc-100">{doctor.experience}</p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Exp. Years</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-black text-zinc-900 dark:text-zinc-100">{doctor.rating}</p>
                <div className="flex items-center justify-center gap-0.5 mt-1">
                  <Star className="w-2.5 h-2.5 text-yellow-500" weight="fill" />
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Contact */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest mb-4">Direct Contact</h3>
            <div className="flex flex-col gap-3">
              <a href={`mailto:${doctor.email}`} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <Envelope className="w-4 h-4 text-blue-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase">Email Address</p>
                  <p className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100 truncate">{doctor.email}</p>
                </div>
              </a>
              <a href={`tel:${doctor.phone}`} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                  <PhoneIcon className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase">Phone Number</p>
                  <p className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100 truncate">{doctor.phone}</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Right: Detailed Info */}
        <div className="lg:col-span-8 flex flex-col gap-8">

          {/* Working Schedule */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-[17px] font-black text-zinc-900 dark:text-zinc-100">Professional Schedule</h3>
                <p className="text-[12px] text-zinc-400 font-medium">Standard working hours and availability.</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
                <Clock className="w-5 h-5 text-zinc-400" weight="duotone" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Shift Schedule</p>
                <p className="text-[15px] font-black text-zinc-900 dark:text-zinc-100">{doctor.schedule}</p>
                <p className="text-[11px] text-zinc-400 font-medium mt-1">Mon - Fri preferred</p>
              </div>
              <div className="p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Daily Hours</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[15px] font-black text-zinc-900 dark:text-zinc-100">{doctor.shiftStart}</span>
                  <span className="text-zinc-300">→</span>
                  <span className="text-[15px] font-black text-zinc-900 dark:text-zinc-100">{doctor.shiftEnd}</span>
                </div>
                <p className="text-[11px] text-zinc-400 font-medium mt-1">Excl. {doctor.breakTime} Break</p>
              </div>
              <div className="p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Next Availability</p>
                <p className="text-[15px] font-black text-emerald-600 dark:text-emerald-500">{doctor.nextAvailable}</p>
                <p className="text-[11px] text-zinc-400 font-medium mt-1">Subject to changes</p>
              </div>
            </div>
          </div>

          {/* About / Bio Placeholder */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
            <h3 className="text-[17px] font-black text-zinc-900 dark:text-zinc-100 mb-6">Professional Biography</h3>
            <div className="space-y-4">
              <p className="text-[13px] leading-relaxed text-zinc-500 font-medium italic">
                "A specialized {doctor.specialty} with over {doctor.experience} years of clinical experience in {doctor.department}.
                Dedicated to providing high-quality patient care and implementing innovative surgical techniques."
              </p>
              <p className="text-[13px] leading-relaxed text-zinc-500 font-medium">
                Current focus includes clinical trials and managing complex {doctor.specialty.toLowerCase()} cases.
                Highly regarded for excellence in patient communication and multidisciplinary collaboration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
              <div>
                <h4 className="text-[11px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Key Stats
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-bold text-zinc-400">Total Patients Treated</span>
                    <span className="font-black text-zinc-900 dark:text-zinc-100">{doctor.patients}</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-bold text-zinc-400">Patient Satisfaction</span>
                    <span className="font-black text-emerald-500">{(doctor.rating * 20).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-bold text-zinc-400">Staff Collaboration</span>
                    <span className="font-black text-violet-500">9.4/10</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-[11px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Specializations
                </h4>
                <div className="flex flex-wrap gap-2">
                  {["Clinical Care", "Surgery", "Diagnostics", "Research"].map(s => (
                    <span key={s} className="px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-[12px] font-bold text-zinc-500 ">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
