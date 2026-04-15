"use client"

import { useState, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import {
  MagnifyingGlass, Plus, X, DotsThree,
  Stethoscope, Heartbeat, Brain, Bandaids, Virus, Pill,
  Users, Funnel, SortDescending, CaretUp, CaretDown, CaretUpDown,
  CalendarBlank, Star, MapPin, Clock, Envelope, Phone as PhoneIcon,
  UserCircle, Trash, Copy, ArrowSquareOut, PencilSimple,
  GenderFemale, GenderMale,
} from "@phosphor-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

// ─── Types ────────────────────────────────────────────────────
export interface Doctor {
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
  age: number
  gender: "Male" | "Female"
  location: string
  joinDate: string
}

type SortField = "name" | "specialty" | "department" | "status" | "rating" | "patients" | "experience"
type SortDir = "asc" | "desc"

// ─── Status config ────────────────────────────────────────────
export const STATUS_CONFIG = {
  "available": { label: "Available", dot: "bg-emerald-500", ring: "ring-emerald-500/30", bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-800" },
  "in-surgery": { label: "In Surgery", dot: "bg-rose-500 animate-pulse", ring: "ring-rose-500/30", bg: "bg-rose-50 dark:bg-rose-950/40", text: "text-rose-700    dark:text-rose-300", border: "border-rose-200    dark:border-rose-800" },
  "on-leave": { label: "On Leave", dot: "bg-amber-400", ring: "ring-amber-400/30", bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-700  dark:text-amber-300", border: "border-amber-200  dark:border-amber-800" },
  "off-duty": { label: "Off Duty", dot: "bg-zinc-400", ring: "ring-zinc-400/30", bg: "bg-zinc-100 dark:bg-zinc-800", text: "text-zinc-500   dark:text-zinc-400", border: "border-zinc-200   dark:border-zinc-700" },
}

// ─── Data ────────────────────────────────────────────────────
const DOCTORS: Doctor[] = [
  { id: 1, name: "Dr. Alexandra Reed", specialty: "Cardiology", department: "Cardiac Care", email: "a.reed@hospital.com", phone: "+1 (555) 201-4420", avatar: "https://i.pravatar.cc/200?img=47", rating: 4.9, reviews: 218, patients: 142, experience: 14, status: "available", schedule: "Mon – Fri", shiftStart: "08:00 AM", shiftEnd: "04:00 PM", breakTime: "1:00 PM", overtime: "0h 00m", nextAvailable: "Today, 2:30 PM", specialtyIcon: Heartbeat, accentFrom: "from-rose-500", accentTo: "to-pink-600", age: 46, gender: "Female", location: "New York", joinDate: "Jan 10, 2020" },
  { id: 2, name: "Dr. Marcus Thompson", specialty: "Neurology", department: "Neuroscience", email: "m.thompson@hospital.com", phone: "+1 (555) 332-8801", avatar: "https://i.pravatar.cc/200?img=52", rating: 4.7, reviews: 134, patients: 98, experience: 10, status: "in-surgery", schedule: "Tue – Sat", shiftStart: "09:00 AM", shiftEnd: "05:00 PM", breakTime: "1:00 PM", overtime: "2h 10m", nextAvailable: "Tomorrow, 10:00 AM", specialtyIcon: Brain, accentFrom: "from-violet-500", accentTo: "to-purple-600", age: 39, gender: "Male", location: "London", joinDate: "Mar 15, 2021" },
  { id: 3, name: "Dr. Priya Sharma", specialty: "Pediatrics", department: "Child Health", email: "p.sharma@hospital.com", phone: "+1 (555) 419-7760", avatar: "https://i.pravatar.cc/200?img=44", rating: 4.8, reviews: 302, patients: 215, experience: 8, status: "available", schedule: "Mon – Fri", shiftStart: "07:00 AM", shiftEnd: "03:00 PM", breakTime: "12:00 PM", overtime: "1h 30m", nextAvailable: "Today, 4:00 PM", specialtyIcon: Bandaids, accentFrom: "from-sky-500", accentTo: "to-blue-600", age: 34, gender: "Female", location: "Mumbai", joinDate: "Jun 3, 2021" },
  { id: 4, name: "Dr. James Okafor", specialty: "Orthopedics", department: "Bone & Joint", email: "j.okafor@hospital.com", phone: "+1 (555) 687-2239", avatar: "https://i.pravatar.cc/200?img=68", rating: 4.6, reviews: 189, patients: 177, experience: 18, status: "off-duty", schedule: "Mon – Thu", shiftStart: "10:00 AM", shiftEnd: "06:00 PM", breakTime: "2:00 PM", overtime: "–", nextAvailable: "Wed, 10:00 AM", specialtyIcon: Stethoscope, accentFrom: "from-amber-500", accentTo: "to-orange-600", age: 52, gender: "Male", location: "Lagos", joinDate: "Aug 5, 2020" },
  { id: 5, name: "Dr. Sarah Mitchell", specialty: "Oncology", department: "Cancer Center", email: "s.mitchell@hospital.com", phone: "+1 (555) 524-9913", avatar: "https://i.pravatar.cc/200?img=45", rating: 4.9, reviews: 97, patients: 89, experience: 20, status: "on-leave", schedule: "Wed – Sun", shiftStart: "08:00 AM", shiftEnd: "04:00 PM", breakTime: "12:30 PM", overtime: "–", nextAvailable: "Next Mon", specialtyIcon: Virus, accentFrom: "from-emerald-500", accentTo: "to-teal-600", age: 48, gender: "Female", location: "Toronto", joinDate: "Nov 12, 2020" },
  { id: 6, name: "Dr. Chen Wei", specialty: "Dermatology", department: "Skin & Allergy", email: "c.wei@hospital.com", phone: "+1 (555) 741-3358", avatar: "https://i.pravatar.cc/200?img=15", rating: 4.7, reviews: 411, patients: 310, experience: 12, status: "available", schedule: "Mon – Fri", shiftStart: "09:00 AM", shiftEnd: "05:00 PM", breakTime: "1:00 PM", overtime: "0h 45m", nextAvailable: "Today, 3:15 PM", specialtyIcon: Pill, accentFrom: "from-indigo-500", accentTo: "to-blue-600", age: 41, gender: "Male", location: "Shanghai", joinDate: "Sep 1, 2021" },
  { id: 7, name: "Dr. Elena Vasquez", specialty: "Radiology", department: "Imaging", email: "e.vasquez@hospital.com", phone: "+1 (555) 882-1107", avatar: "https://i.pravatar.cc/200?img=49", rating: 4.5, reviews: 88, patients: 74, experience: 9, status: "available", schedule: "Mon – Fri", shiftStart: "08:30 AM", shiftEnd: "04:30 PM", breakTime: "1:00 PM", overtime: "1h 15m", nextAvailable: "Today, 11:00 AM", specialtyIcon: Heartbeat, accentFrom: "from-cyan-500", accentTo: "to-sky-600", age: 37, gender: "Female", location: "Madrid", joinDate: "Feb 20, 2022" },
  { id: 8, name: "Dr. Liam Foster", specialty: "Psychiatry", department: "Mental Health", email: "l.foster@hospital.com", phone: "+1 (555) 334-9902", avatar: "https://i.pravatar.cc/200?img=60", rating: 4.8, reviews: 162, patients: 130, experience: 11, status: "in-surgery", schedule: "Tue – Sat", shiftStart: "10:00 AM", shiftEnd: "06:00 PM", breakTime: "2:00 PM", overtime: "–", nextAvailable: "Tomorrow, 10:00 AM", specialtyIcon: Brain, accentFrom: "from-fuchsia-500", accentTo: "to-pink-600", age: 43, gender: "Male", location: "Sydney", joinDate: "Apr 18, 2022" },
]

// ─── Table columns ────────────────────────────────────────────
const TABLE_COLS: { key: SortField | ""; label: string; sortable?: boolean }[] = [
  { key: "name", label: "Doctor", sortable: true },
  { key: "specialty", label: "Specialty", sortable: true },
  { key: "department", label: "Department", sortable: true },
  { key: "rating", label: "Rating", sortable: true },
  { key: "patients", label: "Patients", sortable: true },
  { key: "experience", label: "Experience", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "", label: "Schedule", sortable: false },
  { key: "", label: "", sortable: false },
]

function SortIcon({ field, sort }: { field: string; sort: { field: SortField; dir: SortDir } }) {
  if (!field) return null
  if (sort.field !== field) return <CaretUpDown className="w-3 h-3 text-zinc-300 dark:text-zinc-700" />
  return sort.dir === "asc"
    ? <CaretUp weight="fill" className="w-3 h-3 text-zinc-700 dark:text-zinc-200" />
    : <CaretDown weight="fill" className="w-3 h-3 text-zinc-700 dark:text-zinc-200" />
}

// ─── Doctor Profile Modal ──────────────────────────────────────
function DoctorProfileModal({ doctor, onClose }: { doctor: Doctor; onClose: () => void }) {
  const sc = STATUS_CONFIG[doctor.status]
  const SpecialtyIcon = doctor.specialtyIcon
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(doctor.rating))

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-zinc-900/55 backdrop-blur-md"
      />

      {/* Modal */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.93, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 28 }}
        transition={{ type: "spring", damping: 26, stiffness: 270 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 pointer-events-none"
      >
        <div
          className="pointer-events-auto w-full max-w-[580px] bg-white dark:bg-zinc-950 rounded-3xl shadow-[0_40px_100px_-16px_rgba(0,0,0,0.35)] border border-white/10 overflow-hidden flex flex-col max-h-[92vh]"
          onClick={e => e.stopPropagation()}
        >
          {/* ── HERO ── */}
          <div className={`relative h-36 bg-gradient-to-br ${doctor.accentFrom} ${doctor.accentTo} shrink-0 overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle,white 1px,transparent 1px)", backgroundSize: "20px 20px" }} />
            <SpecialtyIcon weight="duotone" className="absolute -right-8 -bottom-8 w-40 h-40 text-white/10" />

            <span className="absolute top-3.5 left-4 z-10 flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full bg-black/25 text-white border border-white/20 backdrop-blur-sm">
              <span className={cn("size-1.5 rounded-full bg-white", doctor.status === "in-surgery" && "animate-pulse")} />
              {sc.label}
            </span>
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 p-2 rounded-xl bg-black/25 hover:bg-black/45 text-white transition-all"
            >
              <X className="w-4 h-4" weight="bold" />
            </button>
          </div>

          {/* ── AVATAR + IDENTITY ── */}
          <div className="px-6 shrink-0">
            <div className="-mt-12 mb-3 flex items-end justify-between">
              <Avatar className="size-24 ring-4 ring-white dark:ring-zinc-950 shadow-xl">
                <AvatarImage src={doctor.avatar} alt={doctor.name} />
                <AvatarFallback className="text-[22px] font-black bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200">
                  {doctor.name.split(" ").map(n => n[0]).slice(1).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-0.5 mb-2">
                {stars.map((filled, i) => (
                  <Star key={i} weight={filled ? "fill" : "regular"} className={cn("w-4 h-4", filled ? "text-amber-400" : "text-zinc-300 dark:text-zinc-700")} />
                ))}
                <span className="ml-1.5 text-[14px] font-black text-zinc-800 dark:text-white">{doctor.rating}</span>
                <span className="text-[12px] text-zinc-400 ml-0.5">({doctor.reviews})</span>
              </div>
            </div>

            <h2 className="text-[22px] font-black text-zinc-900 dark:text-white tracking-tight leading-none">{doctor.name}</h2>
            <div className="flex items-center gap-2 mt-2.5 mb-4 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-[12px] font-bold px-2.5 py-1 rounded-lg bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                <SpecialtyIcon weight="fill" className="w-3.5 h-3.5" />
                {doctor.specialty}
              </span>
              <span className="text-[12.5px] text-zinc-500 dark:text-zinc-400 font-medium">{doctor.department}</span>
              <span className="size-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <span className="flex items-center gap-1 text-[12.5px] text-zinc-400 font-medium">
                <MapPin weight="duotone" className="w-3.5 h-3.5" />{doctor.location}
              </span>
              <span className="size-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <span className="flex items-center gap-1 text-[12.5px] text-zinc-400 font-medium">
                {doctor.gender === "Female"
                  ? <GenderFemale weight="bold" className="w-3.5 h-3.5 text-pink-400" />
                  : <GenderMale weight="bold" className="w-3.5 h-3.5 text-blue-400" />}
                {doctor.gender}
              </span>
            </div>

            {/* Quick-stat bar */}
            <div className="grid grid-cols-3 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 mb-5">
              {[
                { label: "Patients",   value: `${doctor.patients}+`,            icon: Users },
                { label: "Experience", value: `${doctor.experience} yrs`,        icon: Clock },
                { label: "Available",  value: doctor.nextAvailable.split(",")[0], icon: CalendarBlank },
              ].map(({ label, value, icon: Icon }, i) => (
                <div key={label} className={cn(
                  "flex flex-col items-center py-4 bg-zinc-50 dark:bg-zinc-900/50",
                  i < 2 && "border-r border-zinc-100 dark:border-zinc-800"
                )}>
                  <Icon weight="duotone" className="w-4 h-4 text-zinc-400 mb-1.5" />
                  <span className="text-[16px] font-black text-zinc-900 dark:text-white tabular-nums leading-none">{value}</span>
                  <span className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-zinc-100 dark:bg-zinc-800 mx-6 shrink-0" />

          {/* ── SCROLLABLE BODY ── */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            <div className="grid grid-cols-2 gap-5">
              {/* Contact */}
              <div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.14em] mb-3">Contact</p>
                <div className="space-y-3">
                  {[
                    { icon: Envelope,  label: "Email",    value: doctor.email },
                    { icon: PhoneIcon, label: "Phone",    value: doctor.phone },
                    { icon: MapPin,    label: "Location", value: doctor.location },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center shrink-0">
                        <Icon weight="duotone" className="w-4 h-4 text-zinc-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-wide">{label}</p>
                        <p className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-200 truncate mt-0.5">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Schedule */}
              <div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.14em] mb-3">Schedule</p>
                <div className="space-y-3">
                  {[
                    { icon: CalendarBlank, label: "Days",         value: doctor.schedule },
                    { icon: Clock,         label: "Shift",        value: `${doctor.shiftStart} – ${doctor.shiftEnd}` },
                    { icon: UserCircle,    label: "Member Since",  value: doctor.joinDate },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center shrink-0">
                        <Icon weight="duotone" className="w-4 h-4 text-zinc-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-wide">{label}</p>
                        <p className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mini stats strip */}
            <div className="grid grid-cols-4 gap-2.5">
              {[
                { label: "Age",      value: `${doctor.age}` },
                { label: "Reviews",  value: `${doctor.reviews}` },
                { label: "Break",    value: doctor.breakTime },
                { label: "Overtime", value: doctor.overtime === "–" ? "None" : doctor.overtime },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 text-center">
                  <p className="text-[15px] font-black text-zinc-900 dark:text-white leading-none">{value}</p>
                  <p className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-wide mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── FOOTER ACTIONS ── */}
          <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex gap-3 shrink-0">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-[13px] font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
              <Envelope weight="duotone" className="w-4 h-4 text-zinc-400" />
              Send Message
            </button>
            <button className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r ${doctor.accentFrom} ${doctor.accentTo} text-white text-[13px] font-bold shadow-lg hover:opacity-90 active:scale-[0.98] transition-all`}>
              <CalendarBlank weight="bold" className="w-4 h-4" />
              Book Appointment
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}


// ─── Filter Panel ─────────────────────────────────────────────
function FilterPanel({
  statusFilter, specialtyFilter,
  onStatusChange, onSpecialtyChange,
  onClear, onClose,
}: {
  statusFilter: string
  specialtyFilter: string
  onStatusChange: (v: string) => void
  onSpecialtyChange: (v: string) => void
  onClear: () => void
  onClose: () => void
}) {
  const statuses = ["available", "in-surgery", "on-leave", "off-duty"]
  const specialties = ["Cardiology", "Neurology", "Pediatrics", "Orthopedics", "Oncology", "Dermatology", "Radiology", "Psychiatry"]

  const Chip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={cn(
        "px-2.5 py-1 rounded-lg text-[12px] font-medium border transition-all capitalize",
        active
          ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white"
          : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400"
      )}
    >
      {label.replace("-", " ")}
    </button>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className="absolute top-full right-0 mt-2 w-[320px] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl z-30 overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
        <p className="text-[13px] font-semibold text-zinc-900 dark:text-white">Filters</p>
        <div className="flex items-center gap-2">
          <button onClick={onClear} className="text-[12px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">Clear all</button>
          <button onClick={onClose} className="p-1 rounded-md text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900">
            <X className="w-3.5 h-3.5" weight="bold" />
          </button>
        </div>
      </div>
      <div className="p-4 space-y-4 max-h-[420px] overflow-y-auto">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</p>
          <div className="flex flex-wrap gap-1.5">
            <Chip label="All" active={statusFilter === "all"} onClick={() => onStatusChange("all")} />
            {statuses.map(s => (
              <Chip key={s} label={s} active={statusFilter === s} onClick={() => onStatusChange(s)} />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Specialty</p>
          <div className="flex flex-wrap gap-1.5">
            <Chip label="All" active={specialtyFilter === "all"} onClick={() => onSpecialtyChange("all")} />
            {specialties.map(s => (
              <Chip key={s} label={s} active={specialtyFilter === s} onClick={() => onSpecialtyChange(s)} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Add Doctor Modal (inline form) ──────────────────────────
const fieldCls = "w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-[13px] font-medium outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-400 dark:focus:border-zinc-600 transition-all placeholder:text-zinc-400 text-zinc-900 dark:text-zinc-100"
const labelCls = "block text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5"

function AddDoctorModal({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (d: Doctor) => void }) {
  const empty = { name: "", email: "", phone: "", specialty: "", department: "", schedule: "Mon – Fri", location: "New York", age: "35", gender: "Male" as "Male" | "Female" }
  const [form, setForm] = useState({ ...empty })
  const [errors, setErrors] = useState<Partial<typeof empty>>({})

  const set = (k: keyof typeof empty, v: string) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: "" }))
  }

  const validate = () => {
    const e: Partial<typeof empty> = {}
    if (!form.name.trim()) e.name = "Required"
    if (!form.email.trim()) e.email = "Required"
    if (!form.specialty.trim()) e.specialty = "Required"
    if (!form.department.trim()) e.department = "Required"
    return e
  }

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    const icons: React.ElementType[] = [Heartbeat, Brain, Bandaids, Virus, Pill, Stethoscope]
    const pick = Math.floor(Math.random() * icons.length)
    onAdd({
      id: Date.now(), name: form.name.trim(), email: form.email.trim(),
      phone: form.phone.trim() || "—", specialty: form.specialty.trim(),
      department: form.department.trim(), schedule: form.schedule, location: form.location,
      shiftStart: "09:00 AM", shiftEnd: "05:00 PM", breakTime: "1:00 PM", overtime: "—",
      status: "available", rating: 4.5, reviews: 0, patients: 0, experience: 0,
      nextAvailable: "Today", specialtyIcon: icons[pick],
      accentFrom: "from-zinc-500", accentTo: "to-zinc-600",
      avatar: `https://i.pravatar.cc/200?img=${Math.floor(Math.random() * 70) + 1}`,
      age: parseInt(form.age) || 35, gender: form.gender,
      joinDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    })
    setForm({ ...empty })
    setErrors({})
    onClose()
  }

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/30 backdrop-blur-[2px]"
        onClick={e => { if (e.target === e.currentTarget) { setForm({ ...empty }); setErrors({}); onClose() } }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-zinc-200 dark:border-zinc-800"
        >
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center shrink-0">
                <Stethoscope className="w-4.5 h-4.5 text-white dark:text-zinc-900" weight="duotone" />
              </div>
              <div>
                <p className="text-[16px] font-semibold text-zinc-900 dark:text-white">Add New Doctor</p>
                <p className="text-[12px] text-zinc-400 mt-0.5">Fill in details to register a new doctor.</p>
              </div>
            </div>
            <button onClick={() => { setForm({ ...empty }); setErrors({}); onClose() }} className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
              <X className="w-4 h-4" weight="bold" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-6 py-5 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
              <div>
                <label className={labelCls}>Full Name *</label>
                <input autoFocus value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Dr. Jane Smith" className={cn(fieldCls, errors.name && "border-rose-400")} />
                {errors.name && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.name}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Email *</label>
                  <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="doctor@hospital.com" className={cn(fieldCls, errors.email && "border-rose-400")} />
                  {errors.email && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.email}</p>}
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+1 (555) 000-0000" className={fieldCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Specialty *</label>
                  <input value={form.specialty} onChange={e => set("specialty", e.target.value)} placeholder="e.g. Cardiology" className={cn(fieldCls, errors.specialty && "border-rose-400")} />
                  {errors.specialty && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.specialty}</p>}
                </div>
                <div>
                  <label className={labelCls}>Department *</label>
                  <input value={form.department} onChange={e => set("department", e.target.value)} placeholder="e.g. Cardiac Care" className={cn(fieldCls, errors.department && "border-rose-400")} />
                  {errors.department && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.department}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Age</label>
                  <input type="number" value={form.age} onChange={e => set("age", e.target.value)} placeholder="35" className={fieldCls} />
                </div>
                <div>
                  <label className={labelCls}>Gender</label>
                  <select value={form.gender} onChange={e => set("gender", e.target.value)} className={fieldCls}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Location</label>
                  <input value={form.location} onChange={e => set("location", e.target.value)} placeholder="e.g. New York" className={fieldCls} />
                </div>
                <div>
                  <label className={labelCls}>Schedule</label>
                  <input value={form.schedule} onChange={e => set("schedule", e.target.value)} placeholder="Mon – Fri" className={fieldCls} />
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex gap-2">
              <button type="button" onClick={() => { setForm({ ...empty }); setErrors({}); onClose() }}
                className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-[13px] font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                Cancel
              </button>
              <button type="submit"
                className="flex-1 py-2.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-[13px] font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all flex items-center justify-center gap-1.5 shadow-sm">
                <Plus className="w-3.5 h-3.5" weight="bold" />
                Add Doctor
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ─── Main Page ────────────────────────────────────────────────
export function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>(DOCTORS)
  const [drawerDoctorId, setDrawerDoctorId] = useState<number | null>(null)
  const [search, setSearch] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [specialtyFilter, setSpecialtyFilter] = useState("all")
  const [sort, setSort] = useState<{ field: SortField; dir: SortDir }>({ field: "name", dir: "asc" })
  const [showAdd, setShowAdd] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)

  const drawerDoctor = drawerDoctorId != null ? doctors.find(d => d.id === drawerDoctorId) ?? null : null

  const activeFilterCount = [statusFilter !== "all" ? 1 : 0, specialtyFilter !== "all" ? 1 : 0].reduce((a, b) => a + b, 0)

  const filtered = useMemo(() => {
    let list = doctors
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        d.email.toLowerCase().includes(q) ||
        d.department.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== "all") list = list.filter(d => d.status === statusFilter)
    if (specialtyFilter !== "all") list = list.filter(d => d.specialty === specialtyFilter)

    return [...list].sort((a, b) => {
      const dir = sort.dir === "asc" ? 1 : -1
      switch (sort.field) {
        case "name": return dir * a.name.localeCompare(b.name)
        case "specialty": return dir * a.specialty.localeCompare(b.specialty)
        case "department": return dir * a.department.localeCompare(b.department)
        case "status": return dir * a.status.localeCompare(b.status)
        case "rating": return dir * (a.rating - b.rating)
        case "patients": return dir * (a.patients - b.patients)
        case "experience": return dir * (a.experience - b.experience)
        default: return 0
      }
    })
  }, [doctors, search, statusFilter, specialtyFilter, sort])

  const toggleSort = (field: SortField) => {
    setSort(prev => prev.field === field
      ? { field, dir: prev.dir === "asc" ? "desc" : "asc" }
      : { field, dir: "asc" }
    )
  }

  const handleAddDoctor = (doc: Doctor) => setDoctors(prev => [doc, ...prev])

  // Stats
  const total = doctors.length
  const available = doctors.filter(d => d.status === "available").length
  const inSurgery = doctors.filter(d => d.status === "in-surgery").length
  const onLeave = doctors.filter(d => d.status === "on-leave").length
  const offDuty = doctors.filter(d => d.status === "off-duty").length

  const STATS = [
    { label: "Total Doctors", value: total, cls: "text-zinc-900 dark:text-white" },
    { label: "Available", value: available, cls: "text-emerald-600" },
    { label: "In Surgery", value: inSurgery, cls: "text-rose-600" },
    { label: "On Leave", value: onLeave, cls: "text-amber-600" },
    { label: "Off Duty", value: offDuty, cls: "text-zinc-400" },
  ]

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 overflow-hidden">

      {/* ── TOP BAR ── */}
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-900 shrink-0">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-[20px] font-bold text-zinc-900 dark:text-white tracking-tight">Doctors Registry</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[12px] font-medium text-zinc-500">{total} registered doctors</span>
              {inSurgery > 0 && (
                <>
                  <span className="size-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
                  <span className="text-[12px] font-semibold text-rose-600">{inSurgery} in surgery</span>
                </>
              )}
            </div>
          </div>

          {/* Action bar */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div
              className={cn(
                "flex items-center gap-2 px-3 h-9 rounded-xl border transition-all",
                searchOpen
                  ? "w-56 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950"
                  : "w-9 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              )}
              onClick={() => !searchOpen && setSearchOpen(true)}
            >
              <MagnifyingGlass className={cn("w-4 h-4 shrink-0 transition-colors", searchOpen ? "text-zinc-600 dark:text-zinc-300" : "text-zinc-500")} />
              {searchOpen && (
                <input
                  autoFocus
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onBlur={() => { if (!search) setSearchOpen(false) }}
                  placeholder="Search doctors…"
                  className="flex-1 text-[13px] bg-transparent outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 font-medium"
                />
              )}
              {search && (
                <button onClick={e => { e.stopPropagation(); setSearch(""); setSearchOpen(false) }} className="text-zinc-400 hover:text-zinc-600">
                  <X className="w-3.5 h-3.5" weight="bold" />
                </button>
              )}
            </div>

            <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-800" />

            {/* Sort */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-[12.5px] font-medium text-zinc-500 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                  <SortDescending className="w-4 h-4" />
                  Sort
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-lg border-zinc-200 dark:border-zinc-800">
                {(["name", "specialty", "department", "status", "rating", "patients", "experience"] as SortField[]).map(f => (
                  <DropdownMenuItem key={f} onClick={() => toggleSort(f)} className="text-[12.5px] font-medium gap-2 capitalize">
                    {sort.field === f && <CaretDown className={cn("w-3 h-3", sort.dir === "asc" && "rotate-180")} />}
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filter */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setFilterOpen(p => !p)}
                className={cn(
                  "flex items-center gap-1.5 h-9 px-3 rounded-xl text-[12.5px] font-medium border transition-colors",
                  filterOpen || activeFilterCount > 0
                    ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white"
                    : "text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-700 dark:hover:text-zinc-300"
                )}
              >
                <Funnel className="w-4 h-4" weight={filterOpen || activeFilterCount > 0 ? "fill" : "regular"} />
                Filter
                {activeFilterCount > 0 && (
                  <span className="ml-0.5 size-5 rounded-full bg-white/20 dark:bg-zinc-950/20 text-[11px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {filterOpen && (
                  <FilterPanel
                    statusFilter={statusFilter}
                    specialtyFilter={specialtyFilter}
                    onStatusChange={v => setStatusFilter(v)}
                    onSpecialtyChange={v => setSpecialtyFilter(v)}
                    onClear={() => { setStatusFilter("all"); setSpecialtyFilter("all") }}
                    onClose={() => setFilterOpen(false)}
                  />
                )}
              </AnimatePresence>
            </div>

            <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-800" />

            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 h-9 px-4 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-[12.5px] font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 active:scale-95 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" weight="bold" />
              Add Doctor
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="flex items-center gap-4">
          {STATS.map(({ label, value, cls }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className={cn("text-[14px] font-bold tabular-nums", cls)}>{value}</span>
              <span className="text-[11.5px] text-zinc-400 font-medium">{label}</span>
              <span className="w-px h-3 bg-zinc-200 dark:bg-zinc-800 last:hidden ml-2" />
            </div>
          ))}

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="ml-auto flex items-center gap-1.5">
              {statusFilter !== "all" && (
                <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 capitalize">
                  {statusFilter.replace("-", " ")}
                  <button onClick={() => setStatusFilter("all")}><X className="w-2.5 h-2.5" weight="bold" /></button>
                </span>
              )}
              {specialtyFilter !== "all" && (
                <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  {specialtyFilter}
                  <button onClick={() => setSpecialtyFilter("all")}><X className="w-2.5 h-2.5" weight="bold" /></button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="flex-1 overflow-auto mt-4 px-6">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-zinc-50/90 dark:bg-zinc-900/90 backdrop-blur-sm">
            <TableRow className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-transparent">
              {TABLE_COLS.map(col => (
                <TableHead
                  key={col.label + col.key}
                  className={cn(
                    "py-3 px-4 text-[10.5px] font-semibold text-zinc-400 uppercase tracking-[0.12em] whitespace-nowrap first:pl-2 last:pr-2",
                    col.sortable && "cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300 select-none"
                  )}
                  onClick={() => col.sortable && col.key && toggleSort(col.key as SortField)}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && col.key && <SortIcon field={col.key} sort={sort} />}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow className="hover:bg-transparent border-0">
                <TableCell colSpan={9} className="py-24 text-center">
                  <MagnifyingGlass className="w-10 h-10 text-zinc-200 dark:text-zinc-800 mx-auto mb-3" />
                  <p className="text-[14px] font-semibold text-zinc-500">No doctors found</p>
                  <p className="text-[12.5px] text-zinc-400 mt-1">Try adjusting your search or filters</p>
                </TableCell>
              </TableRow>
            ) : filtered.map(d => {
              const sc = STATUS_CONFIG[d.status]
              const isSelected = drawerDoctorId === d.id

              return (
                <TableRow
                  key={d.id}
                  className={cn(
                    "group border-b border-zinc-100 dark:border-zinc-800 cursor-pointer transition-colors",
                    isSelected ? "bg-zinc-50 dark:bg-zinc-900/50" : "hover:bg-zinc-50 dark:hover:bg-zinc-900/30"
                  )}
                  onClick={() => setDrawerDoctorId(isSelected ? null : d.id)}
                >
                  {/* Doctor */}
                  <TableCell className="py-3.5 pl-2 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <Avatar className={cn("size-9 ring-2 ring-offset-1 dark:ring-offset-zinc-950", sc.ring)}>
                          <AvatarImage src={d.avatar} alt={d.name} />
                          <AvatarFallback className="text-[12px] font-semibold bg-zinc-100 dark:bg-zinc-800">
                            {d.name.split(" ").map(n => n[0]).slice(1).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className={cn("absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-zinc-950", sc.dot)} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[13.5px] font-semibold text-zinc-900 dark:text-white truncate block">{d.name}</span>
                        <p className="text-[12px] text-zinc-400 truncate mt-0.5">{d.email}</p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Specialty */}
                  <TableCell className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1 rounded-lg border bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/30 dark:text-violet-300 dark:border-violet-900">
                      <d.specialtyIcon weight="fill" className="w-3.5 h-3.5 shrink-0" />
                      {d.specialty}
                    </span>
                  </TableCell>

                  {/* Department */}
                  <TableCell className="py-3.5 px-4">
                    <p className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">{d.department}</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-1">
                      {d.gender === "Female" ? <GenderFemale className="w-3 h-3 text-pink-400" weight="bold" /> : <GenderMale className="w-3 h-3 text-blue-400" weight="bold" />}
                      {d.location}
                    </p>
                  </TableCell>

                  {/* Rating */}
                  <TableCell className="py-3.5 px-4">
                    <div className="flex items-center gap-1">
                      <Star weight="fill" className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-200">{d.rating}</span>
                      <span className="text-[11px] text-zinc-400">({d.reviews})</span>
                    </div>
                  </TableCell>

                  {/* Patients */}
                  <TableCell className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-zinc-400" weight="duotone" />
                      <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">{d.patients}</span>
                    </div>
                  </TableCell>

                  {/* Experience */}
                  <TableCell className="py-3.5 px-4">
                    <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">{d.experience} yrs</span>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-3.5 px-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border",
                      sc.bg, sc.text, sc.border
                    )}>
                      <span className={cn("size-1.5 rounded-full", sc.dot)} />
                      {sc.label}
                    </span>
                  </TableCell>

                  {/* Schedule */}
                  <TableCell className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" weight="duotone" />
                      <div>
                        <p className="text-[12.5px] font-medium text-zinc-700 dark:text-zinc-300">{d.schedule}</p>
                        <p className="text-[11px] text-zinc-400">{d.shiftStart} – {d.shiftEnd}</p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-3.5 pl-4 pr-2 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          onClick={e => e.stopPropagation()}
                          className="p-2 rounded-xl text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
                        >
                          <DotsThree className="w-5 h-5" weight="bold" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52 p-1.5 rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl">
                        <DropdownMenuItem
                          onClick={e => { e.stopPropagation(); setDrawerDoctorId(d.id) }}
                          className="text-[12.5px] font-medium rounded-xl gap-2.5 px-3 py-2.5 cursor-pointer"
                        >
                          <UserCircle weight="duotone" className="w-4 h-4 text-zinc-400" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[12.5px] font-medium rounded-xl gap-2.5 px-3 py-2.5 cursor-pointer">
                          <PencilSimple weight="duotone" className="w-4 h-4 text-zinc-400" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[12.5px] font-medium rounded-xl gap-2.5 px-3 py-2.5 cursor-pointer">
                          <Copy weight="duotone" className="w-4 h-4 text-zinc-400" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[12.5px] font-medium rounded-xl gap-2.5 px-3 py-2.5 cursor-pointer">
                          <ArrowSquareOut weight="duotone" className="w-4 h-4 text-zinc-400" />
                          Copy link
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-1" />
                        <DropdownMenuItem
                          onClick={e => { e.stopPropagation(); setDoctors(prev => prev.filter(x => x.id !== d.id)); if (drawerDoctorId === d.id) setDrawerDoctorId(null) }}
                          className="text-[12.5px] font-medium rounded-xl gap-2.5 px-3 py-2.5 cursor-pointer text-rose-500 focus:text-rose-500 focus:bg-rose-50 dark:focus:bg-rose-950/20"
                        >
                          <Trash weight="duotone" className="w-4 h-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* ── DOCTOR PROFILE MODAL ── */}
      {drawerDoctor && (
        <DoctorProfileModal
          doctor={drawerDoctor}
          onClose={() => setDrawerDoctorId(null)}
        />
      )}

      {/* ── ADD MODAL ── */}
      <AddDoctorModal open={showAdd} onClose={() => setShowAdd(false)} onAdd={handleAddDoctor} />
    </div>
  )
}
