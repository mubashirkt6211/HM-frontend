"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import {
  MagnifyingGlass, Stethoscope, Plus, DotsThree,
  CalendarBlank, Heartbeat, Brain, Bandaids, Virus, Pill,
  Users, CaretLeft, CaretRight, Funnel,
  User, Envelope, Phone as PhoneIcon,
  Briefcase, Clock, UserCircle, Trash, X,
  MapPin, Medal, ChartBar,
  Chats,
  CheckCircle,
  GenderFemale,
  GenderMale,
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
import { DoctorProfileView } from "@/components/doctors/DoctorProfileView"

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
}

// ─── Data ────────────────────────────────────────────────────
const DOCTORS: Doctor[] = [
  { id: 1, name: "Dr. Alexandra Reed", specialty: "Cardiology", department: "Cardiac Care", email: "a.reed@hospital.com", phone: "+1 (555) 201-4420", avatar: "https://i.pravatar.cc/200?img=47", rating: 4.9, reviews: 218, patients: 142, experience: 14, status: "available", schedule: "Mon – Fri", shiftStart: "08:00 AM", shiftEnd: "04:00 PM", breakTime: "1:00 PM", overtime: "0h 00m", nextAvailable: "Today, 2:30 PM", specialtyIcon: Heartbeat, accentFrom: "from-rose-500", accentTo: "to-pink-600", age: 46, gender: "Female", location: "New York" },
  { id: 2, name: "Dr. Marcus Thompson", specialty: "Neurology", department: "Neuroscience", email: "m.thompson@hospital.com", phone: "+1 (555) 332-8801", avatar: "https://i.pravatar.cc/200?img=52", rating: 4.7, reviews: 134, patients: 98, experience: 10, status: "in-surgery", schedule: "Tue – Sat", shiftStart: "09:00 AM", shiftEnd: "05:00 PM", breakTime: "1:00 PM", overtime: "2h 10m", nextAvailable: "Tomorrow, 10:00 AM", specialtyIcon: Brain, accentFrom: "from-violet-500", accentTo: "to-purple-600", age: 39, gender: "Male", location: "London" },
  { id: 3, name: "Dr. Priya Sharma", specialty: "Pediatrics", department: "Child Health", email: "p.sharma@hospital.com", phone: "+1 (555) 419-7760", avatar: "https://i.pravatar.cc/200?img=44", rating: 4.8, reviews: 302, patients: 215, experience: 8, status: "available", schedule: "Mon – Fri", shiftStart: "07:00 AM", shiftEnd: "03:00 PM", breakTime: "12:00 PM", overtime: "1h 30m", nextAvailable: "Today, 4:00 PM", specialtyIcon: Bandaids, accentFrom: "from-sky-500", accentTo: "to-blue-600", age: 34, gender: "Female", location: "Mumbai" },
  { id: 4, name: "Dr. James Okafor", specialty: "Orthopedics", department: "Bone & Joint", email: "j.okafor@hospital.com", phone: "+1 (555) 687-2239", avatar: "https://i.pravatar.cc/200?img=68", rating: 4.6, reviews: 189, patients: 177, experience: 18, status: "off-duty", schedule: "Mon – Thu", shiftStart: "10:00 AM", shiftEnd: "06:00 PM", breakTime: "2:00 PM", overtime: "–", nextAvailable: "Wed, 10:00 AM", specialtyIcon: Stethoscope, accentFrom: "from-amber-500", accentTo: "to-orange-600", age: 52, gender: "Male", location: "Lagos" },
  { id: 5, name: "Dr. Sarah Mitchell", specialty: "Oncology", department: "Cancer Center", email: "s.mitchell@hospital.com", phone: "+1 (555) 524-9913", avatar: "https://i.pravatar.cc/200?img=45", rating: 4.9, reviews: 97, patients: 89, experience: 20, status: "on-leave", schedule: "Wed – Sun", shiftStart: "08:00 AM", shiftEnd: "04:00 PM", breakTime: "12:30 PM", overtime: "–", nextAvailable: "Next Mon", specialtyIcon: Virus, accentFrom: "from-emerald-500", accentTo: "to-teal-600", age: 48, gender: "Female", location: "Toronto" },
  { id: 6, name: "Dr. Chen Wei", specialty: "Dermatology", department: "Skin & Allergy", email: "c.wei@hospital.com", phone: "+1 (555) 741-3358", avatar: "https://i.pravatar.cc/200?img=15", rating: 4.7, reviews: 411, patients: 310, experience: 12, status: "available", schedule: "Mon – Fri", shiftStart: "09:00 AM", shiftEnd: "05:00 PM", breakTime: "1:00 PM", overtime: "0h 45m", nextAvailable: "Today, 3:15 PM", specialtyIcon: Pill, accentFrom: "from-indigo-500", accentTo: "to-blue-600", age: 41, gender: "Male", location: "Shanghai" },
  { id: 7, name: "Dr. Elena Vasquez", specialty: "Radiology", department: "Imaging", email: "e.vasquez@hospital.com", phone: "+1 (555) 882-1107", avatar: "https://i.pravatar.cc/200?img=49", rating: 4.5, reviews: 88, patients: 74, experience: 9, status: "available", schedule: "Mon – Fri", shiftStart: "08:30 AM", shiftEnd: "04:30 PM", breakTime: "1:00 PM", overtime: "1h 15m", nextAvailable: "Today, 11:00 AM", specialtyIcon: Heartbeat, accentFrom: "from-cyan-500", accentTo: "to-sky-600", age: 37, gender: "Female", location: "Madrid" },
  { id: 8, name: "Dr. Liam Foster", specialty: "Psychiatry", department: "Mental Health", email: "l.foster@hospital.com", phone: "+1 (555) 334-9902", avatar: "https://i.pravatar.cc/200?img=60", rating: 4.8, reviews: 162, patients: 130, experience: 11, status: "in-surgery", schedule: "Tue – Sat", shiftStart: "10:00 AM", shiftEnd: "06:00 PM", breakTime: "2:00 PM", overtime: "–", nextAvailable: "Tomorrow, 10:00 AM", specialtyIcon: Brain, accentFrom: "from-fuchsia-500", accentTo: "to-pink-600", age: 43, gender: "Male", location: "Sydney" },
]

export const STATUS_CONFIG = {
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
  const empty = { 
    name: "", email: "", phone: "", specialty: "", department: "", 
    schedule: "", shiftStart: "09:00 AM", shiftEnd: "05:00 PM", 
    status: "available" as Doctor["status"],
    age: "45", gender: "Male" as "Male" | "Female", location: "New York"
  }
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
      age: parseInt(form.age) || 45,
      gender: form.gender,
      location: form.location,
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
        <DialogHeader className="px-6 pt-6 pb-4">
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

            {/* Age + Gender */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Age *</label>
                <input
                  type="number"
                  value={form.age}
                  onChange={e => set("age", e.target.value)}
                  placeholder="45"
                  className={fieldCls}
                />
              </div>
              <div>
                <label className={labelCls}>Gender *</label>
                <Select value={form.gender} onValueChange={v => set("gender", v as "Male" | "Female")}>
                  <SelectTrigger className="h-[42px] text-[13px] rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male" className="text-[13px]">Male</SelectItem>
                    <SelectItem value="Female" className="text-[13px]">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className={labelCls}><MapPin className="inline w-3 h-3 mr-1" />Location *</label>
              <input
                value={form.location}
                onChange={e => set("location", e.target.value)}
                placeholder="e.g. New York, USA"
                className={fieldCls}
              />
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



// ─── Doctor Card ──────────────────────────────────────────
function DoctorCard({ doctor, onViewProfile }: { doctor: Doctor, onViewProfile: (d: Doctor) => void }) {
  const status = STATUS_CONFIG[doctor.status]
  
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-[24px] p-5 flex flex-col gap-5 relative group transition-all hover:shadow-xl hover:shadow-zinc-200/30 dark:hover:shadow-none hover:-translate-y-1">
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <Avatar className={cn("size-12 ring-2 ring-offset-2 dark:ring-offset-zinc-900 transition-all", status.ring)}>
              <AvatarImage src={doctor.avatar} alt={doctor.name} />
              <AvatarFallback className="text-[14px] font-black bg-zinc-100 dark:bg-zinc-800">
                {doctor.name.split(" ").map(n => n[0]).slice(1).join("")}
              </AvatarFallback>
            </Avatar>
            <span className={cn("absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-zinc-900", status.dot)} />
          </div>
          <div className="min-w-0">
            <h3 className="text-[15px] font-black text-zinc-900 dark:text-zinc-100 leading-tight truncate tracking-tight">{doctor.name}</h3>
            <p className="text-[12px] text-zinc-400 font-medium truncate">{doctor.email}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           <span className={cn(
            "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
            status.bg, status.text
          )}>
            <CheckCircle className="w-3.5 h-3.5" weight="bold" />
            {doctor.status === "available" ? "Active" : status.label}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-all">
                <DotsThree className="w-5 h-5" weight="bold" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-xl">
              <DropdownMenuItem className="text-[13px] font-bold rounded-lg flex items-center gap-2 cursor-pointer" onClick={() => onViewProfile(doctor)}>
                <UserCircle className="w-4.5 h-4.5 text-zinc-400" weight="duotone" /> View Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[13px] font-bold rounded-lg flex items-center gap-2 cursor-pointer">
                <Envelope className="w-4.5 h-4.5 text-zinc-400" weight="duotone" /> Send Message
              </DropdownMenuItem>
              <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1.5" />
              <DropdownMenuItem className="text-[13px] font-bold rounded-lg flex items-center gap-2 cursor-pointer text-rose-500 focus:text-rose-500">
                <Trash className="w-4.5 h-4.5" weight="duotone" /> Delete Member
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Date */}
      <div className="text-[11px] font-bold text-zinc-400 self-end -mt-3">
        Next: <span className="text-zinc-500 font-black">Jun 25, 2024</span>
      </div>
      
      {/* Tags */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-[11px] font-black tracking-tight">
          {doctor.specialty}
        </span>
        <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[11px] font-black tracking-tight">
          {doctor.department}
        </span>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-y-4 gap-x-2 py-4 px-5 bg-zinc-50/50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-100/50 dark:border-zinc-800/50">
        <div>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Age</p>
          <p className="text-[12px] font-black text-zinc-700 dark:text-zinc-200">{doctor.age} y/o</p>
        </div>
        <div>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Sex</p>
          <div className="flex items-center gap-1">
            {doctor.gender === "Female" ? <GenderFemale className="w-3.5 h-3.5 text-pink-500" weight="bold" /> : <GenderMale className="w-3.5 h-3.5 text-blue-500" weight="bold" />}
            <p className="text-[12px] font-black text-zinc-700 dark:text-zinc-200">{doctor.gender}</p>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Location</p>
          <p className="text-[12px] font-black text-zinc-700 dark:text-zinc-200 truncate">{doctor.location}</p>
        </div>
        <div className="col-span-2">
           <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Experience</p>
           <p className="text-[12px] font-black text-zinc-700 dark:text-zinc-200">8yr</p>
        </div>
        <div>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Status</p>
          <p className="text-[12px] font-black text-zinc-700 dark:text-zinc-200">Confirmed</p>
        </div>
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest"></span>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-[12px] font-black text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all">
            <CalendarBlank className="w-4 h-4 text-zinc-400" />
            Appointments
          </button>
          <button className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-[12px] font-black text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all">
            <Chats className="w-4 h-4 text-zinc-400" />
            Chat
            <span className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-black border-2 border-white dark:border-zinc-900 shadow-sm shadow-rose-500/20">2</span>
          </button>
        </div>
      </div>
    </div>
  )
}

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
    <div className="flex flex-col gap-8 pt-8 pb-12 px-6 md:px-10 lg:px-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* ── HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-[36px] font-black text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
            Doctors Registry
          </h1>
          <p className="text-[15px] text-zinc-500 dark:text-zinc-400 mt-1.5 font-medium">
            Manage your medical staff with high-fidelity analytics and performance tracking.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />
          <Button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-5 py-2.5 h-auto rounded-[14px] bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[13px] font-black hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-lg shadow-zinc-900/10 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" weight="bold" />
            Add New Member
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-0">
        
        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 flex flex-col gap-8">
          
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 border-b-2 border-zinc-900 dark:border-zinc-100 pb-2 px-1">
              <h2 className="text-[16px] font-black text-zinc-900 dark:text-zinc-100 tracking-tight">Members Assigned</h2>
              <span className="text-[11px] font-black text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-full h-5 px-2 flex items-center justify-center">
                {sorted.length}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1) }}
                  className="w-full sm:w-64 pl-10 pr-4 py-2.5 text-[13px] font-bold rounded-xl  dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all placeholder:text-zinc-400 shadow-sm"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer bg-white dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-800 text-[13px] font-black text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all shadow-sm">
                    <Funnel className="w-4 h-4" weight="bold" />
                    Filters
                    {statusFilter !== "all" && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-xl">
                  {["all", "available", "in-surgery", "on-leave", "off-duty"].map(s => (
                    <DropdownMenuItem
                      key={s}
                      onClick={() => { setStatusFilter(s); setPage(1) }}
                      className={cn("capitalize text-[13px] font-bold rounded-lg p-2.5 cursor-pointer", statusFilter === s && "bg-zinc-50 dark:bg-zinc-900")}
                    >
                      {s === "all" ? "Show All" : s.replace("-", " ")}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Grid View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pageDocs.length === 0 ? (
              <div className="col-span-full py-32 text-center bg-zinc-50/50 dark:bg-zinc-900/30 rounded-[32px] border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-[28px] bg-white dark:bg-zinc-900 flex items-center justify-center shadow-lg shadow-zinc-200/20 dark:shadow-none">
                    <Users className="w-10 h-10 text-zinc-300" weight="duotone" />
                  </div>
                  <div>
                    <p className="text-[18px] font-black text-zinc-900 dark:text-zinc-100">No members found</p>
                    <p className="text-[14px] font-medium text-zinc-400 mt-1">Try adjusting your search or filters.</p>
                  </div>
                  <button
                    onClick={() => { setSearch(""); setStatusFilter("all") }}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[13px] font-black transition-all hover:scale-105"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            ) : (
              pageDocs.map(doctor => (
                <DoctorCard 
                  key={doctor.id} 
                  doctor={doctor} 
                  onViewProfile={handleViewProfile} 
                />
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
            <div className="flex items-center gap-3 text-[13px] font-bold text-zinc-400">
              <span>Showing</span>
              <Select
                value={String(perPage)}
                onValueChange={v => { setPerPage(Number(v)); setPage(1) }}
              >
                <SelectTrigger className="h-10 w-20 text-[13px] font-black rounded-xl bg-white dark:bg-zinc-950 border-zinc-200/60 dark:border-zinc-800 shadow-sm focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {PER_PAGE_OPTIONS.map(o => (
                    <SelectItem key={o} value={o} className="text-[13px] font-bold">{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>members per page</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
              >
                <CaretLeft className="w-5 h-5" weight="bold" />
              </button>

              <div className="flex items-center gap-1.5 mx-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
                  const active = page === p
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={cn(
                        "size-10 flex items-center justify-center rounded-xl text-[13px] font-black transition-all shadow-sm",
                        active 
                          ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" 
                          : "bg-white dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 text-zinc-400 hover:text-zinc-900 hover:border-zinc-300 dark:hover:text-zinc-100"
                      )}
                    >
                      {p}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
              >
                <CaretRight className="w-5 h-5" weight="bold" />
              </button>
            </div>
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

