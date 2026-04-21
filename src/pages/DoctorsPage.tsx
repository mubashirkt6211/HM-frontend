"use client"

import { useState, useMemo, useRef } from "react"
import React from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import {
  MagnifyingGlass, Plus, X, DotsThree,
  Stethoscope, Heartbeat, Brain, Bandaids, Virus, Pill,
  Users, Funnel, SortDescending, CaretUp, CaretDown, CaretUpDown,
  CalendarBlank, Star, MapPin, Clock, Envelope, Phone as PhoneIcon,
  UserCircle, Trash, Copy, ArrowSquareOut, PencilSimple,
  GenderFemale, GenderMale, ArrowLeft,
} from "@phosphor-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Frame } from "@/components/ui/frame"

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

// ─── Specialty badge styles (Notion-style) ───────────────────────────
const SPECIALTY_BADGE: Record<string, { dot: string; text: string; bg: string }> = {
  Cardiology: { dot: "bg-red-500", text: "text-red-700 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30" },
  Neurology: { dot: "bg-purple-500", text: "text-purple-700 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950/30" },
  Pediatrics: { dot: "bg-blue-500", text: "text-blue-700 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30" },
  Orthopedics: { dot: "bg-amber-500", text: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30" },
  Oncology: { dot: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
  Dermatology: { dot: "bg-indigo-500", text: "text-indigo-700 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/30" },
  Radiology: { dot: "bg-cyan-500", text: "text-cyan-700 dark:text-cyan-400", bg: "bg-cyan-50 dark:bg-cyan-950/30" },
  Psychiatry: { dot: "bg-pink-500", text: "text-pink-700 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-950/30" },
}
const DEFAULT_SPEC_BADGE = { dot: "bg-zinc-400", text: "text-zinc-600 dark:text-zinc-400", bg: "bg-zinc-100 dark:bg-zinc-800" }

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

// ─── Table columns (Notion-style) ────────────────────────────────
const TABLE_COLS: { key: SortField | ""; label: string; sortable?: boolean }[] = [
  { key: "name", label: "Doctor", sortable: true },
  { key: "specialty", label: "Specialty", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "department", label: "Department", sortable: true },
  { key: "rating", label: "Rating", sortable: true },
  { key: "patients", label: "Patients", sortable: true },
  { key: "experience", label: "Experience", sortable: true },
  { key: "", label: "Join Date", sortable: false },
  { key: "", label: "", sortable: false },
]

function SortIcon({ field, sort }: { field: string; sort: { field: SortField; dir: SortDir } }) {
  if (!field) return null
  if (sort.field !== field) return <CaretUpDown className="w-3 h-3 text-zinc-300 dark:text-zinc-700" />
  return sort.dir === "asc"
    ? <CaretUp weight="fill" className="w-3 h-3 text-zinc-700 dark:text-zinc-200" />
    : <CaretDown weight="fill" className="w-3 h-3 text-zinc-700 dark:text-zinc-200" />
}

// ─── Doctor Schedule Modal ─────────────────────────────────────
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

// Seed-based pseudo-random for stable appointment counts
function seededRand(seed: number) { return ((seed * 9301 + 49297) % 233280) / 233280 }

type SlotType = "consultation" | "surgery" | "break" | "free"
type TimeSlot = { time: string; type: SlotType; patients?: number; note?: string }
type DaySchedule = { day: string; slots: TimeSlot[] }

const SLOT_NOTES: Record<string, string[]> = {
  consultation: ["Follow-up", "New patient", "Review", "Check-up", "Telehealth", "Lab review"],
  surgery: ["OR-1", "OR-2", "Assisted", "Primary"],
}

// Parse "08:00 AM" / "04:00 PM" / "12:30 PM" → 24h integer
function parseHour(t: string): number {
  const parts = t.trim().split(" ")
  const [hStr] = parts[0].split(":")
  let h = parseInt(hStr, 10)
  const period = (parts[1] ?? "").toUpperCase()
  if (period === "PM" && h !== 12) h += 12
  if (period === "AM" && h === 12) h = 0
  return h
}

// Parse break time "1:00 PM" → "13:00" (to match HOURS strings)
function breakToHour(t: string): string {
  const h = parseHour(t)
  return String(h).padStart(2, "0") + ":00"
}

function generateSchedule(doctor: Doctor): DaySchedule[] {
  const workDayMap: Record<string, string[]> = {
    "Mon – Fri": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "Tue – Sat": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "Mon – Thu": ["Monday", "Tuesday", "Wednesday", "Thursday"],
    "Wed – Sun": ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  }
  const workDays = workDayMap[doctor.schedule]
    ?? (doctor.schedule.includes("Mon") ? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] : ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"])

  const shiftStart = parseHour(doctor.shiftStart)  // e.g. 8
  const shiftEnd = parseHour(doctor.shiftEnd)    // e.g. 16
  const breakSlot = breakToHour(doctor.breakTime ?? "12:00 PM") // e.g. "13:00"

  return DAYS.map((day, di) => ({
    day,
    slots: HOURS.map((time, hi) => {
      if (!workDays.includes(day)) return { time, type: "free" as SlotType }
      if (time === breakSlot) return { time, type: "break" as SlotType, note: "Lunch break" }
      const h = parseInt(time, 10)   // HOURS are "08:00" format → safe
      if (h < shiftStart || h >= shiftEnd) return { time, type: "free" as SlotType }
      if (doctor.status === "in-surgery" && (h === 10 || h === 11)) {
        return { time, type: "surgery" as SlotType, note: SLOT_NOTES.surgery[(di + hi) % SLOT_NOTES.surgery.length] }
      }
      const r = seededRand(doctor.id * 100 + di * 10 + hi)
      const patients = Math.floor(r * 4) + 1
      return { time, type: "consultation" as SlotType, patients, note: SLOT_NOTES.consultation[(di + hi) % SLOT_NOTES.consultation.length] }
    }),
  }))
}

const SLOT_STYLES: Record<SlotType, string> = {
  consultation: "bg-violet-100 dark:bg-violet-900/40 text-violet-800 dark:text-violet-200 border border-violet-300 dark:border-violet-700",
  surgery: "bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-700",
  break: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700",
  free: "bg-zinc-100 dark:bg-zinc-800/50 text-zinc-400 dark:text-zinc-600 border border-zinc-200 dark:border-zinc-700",
}

function DoctorScheduleModal({ doctor, onClose, onBack }: { doctor: Doctor; onClose: () => void; onBack: () => void }) {
  const schedule = generateSchedule(doctor)
  const SpecialtyIcon = doctor.specialtyIcon
  const [selectedDay, setSelectedDay] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<"all" | SlotType>("all")

  // Compute per-day totals
  const dayTotals = schedule.map(({ slots }) => ({
    consult: slots.filter(s => s.type === "consultation").reduce((a, s) => a + (s.patients ?? 0), 0),
    surgery: slots.filter(s => s.type === "surgery").length,
  }))

  const totalPatients = dayTotals.reduce((a, d) => a + d.consult, 0)
  const totalSurgeries = dayTotals.reduce((a, d) => a + d.surgery, 0)
  const workSlots = schedule[0]?.slots.filter(s => s.type === "consultation" || s.type === "surgery").length ?? 0

  // Filtered schedule columns
  const visibleSchedule = selectedDay === "all" ? schedule : schedule.filter(d => d.day === selectedDay)

  const apptSlots = visibleSchedule.flatMap(({ day, slots }) =>
    slots
      .filter(s => (s.type === "consultation" || s.type === "surgery") && (typeFilter === "all" || s.type === typeFilter))
      .map(s => ({ ...s, day }))
  )

  return (
    <AnimatePresence>
      <motion.div
        key="sched-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-zinc-900/55 backdrop-blur-md"
      />
      <motion.div
        key="sched-modal"
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 pointer-events-none"
      >
        <div
          className="pointer-events-auto w-full max-w-[860px] bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[92vh]"
          onClick={e => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                <ArrowLeft className="w-4 h-4" weight="bold" />
              </button>
              <Avatar className="size-9 ring-2 ring-zinc-100 dark:ring-zinc-800">
                <AvatarImage src={doctor.avatar} alt={doctor.name} />
                <AvatarFallback className="text-[12px] font-bold bg-zinc-100 dark:bg-zinc-800">
                  {doctor.name.split(" ").map(n => n[0]).slice(1).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-[15px] font-semibold text-zinc-900 dark:text-white">Weekly Schedule</p>
                <p className="text-[12px] text-zinc-400 mt-0.5">{doctor.name} · {doctor.specialty} · {doctor.shiftStart} – {doctor.shiftEnd}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
              <X className="w-4 h-4" weight="bold" />
            </button>
          </div>

          {/* ── Stats banner ── */}
          <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-100 dark:border-zinc-800 shrink-0 flex items-center gap-5 flex-wrap">
            {[
              { label: "Weekly Patients", value: totalPatients, icon: Users, color: "text-violet-600 dark:text-violet-400" },
              { label: "Surgeries / week", value: totalSurgeries, icon: Stethoscope, color: "text-rose-600   dark:text-rose-400" },
              { label: "Hrs active / day", value: `${workSlots}h`, icon: Clock, color: "text-emerald-600 dark:text-emerald-400" },
              { label: "Break", value: doctor.breakTime, icon: CalendarBlank, color: "text-amber-600  dark:text-amber-400" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon weight="duotone" className={cn("w-4 h-4 shrink-0", color)} />
                <span className={cn("text-[13.5px] font-bold tabular-nums", color)}>{value}</span>
                <span className="text-[11px] text-zinc-400 font-medium">{label}</span>
              </div>
            ))}
            {/* Legend */}
            <div className="ml-auto flex items-center gap-3">
              {(["consultation", "surgery", "break", "free"] as const).map(t => (
                <div key={t} className="flex items-center gap-1.5">
                  <span className={cn("w-2.5 h-2.5 rounded border",
                    t === "consultation" ? "bg-violet-200 border-violet-400 dark:bg-violet-700 dark:border-violet-500" :
                      t === "surgery" ? "bg-rose-200   border-rose-400   dark:bg-rose-700   dark:border-rose-500" :
                        t === "break" ? "bg-amber-200  border-amber-400  dark:bg-amber-700  dark:border-amber-500" :
                          "bg-zinc-200 border-zinc-300 dark:bg-zinc-700 dark:border-zinc-600"
                  )} />
                  <span className="text-[10.5px] font-semibold text-zinc-500 dark:text-zinc-400 capitalize">{t === "free" ? "Off" : t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Day filter + type filter ── */}
          <div className="px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 shrink-0 flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mr-1">Day:</span>
            {["all", ...DAYS].map(d => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[12px] font-semibold border transition-all capitalize",
                  selectedDay === d
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white"
                    : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"
                )}
              >
                {d === "all" ? "All" : d.slice(0, 3)}
              </button>
            ))}
            <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1" />
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mr-1">Type:</span>
            {(["all", "consultation", "surgery"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t as "all" | SlotType)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[12px] font-semibold border transition-all",
                  typeFilter === t
                    ? t === "consultation" ? "bg-violet-600 text-white border-violet-600"
                      : t === "surgery" ? "bg-rose-600 text-white border-rose-600"
                        : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900"
                    : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"
                )}
              >
                {t === "all" ? "All types" : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* ── Scrollable body ── */}
          <div className="flex-1 overflow-auto">

            {/* Grid */}
            <div className="p-5 pb-2">
              <div
                className="grid gap-1.5"
                style={{ gridTemplateColumns: `58px repeat(${visibleSchedule.length}, 1fr)` }}
              >
                {/* Day header row */}
                <div />
                {visibleSchedule.map(({ day }, di) => {
                  const tot = dayTotals[schedule.findIndex(s => s.day === day)]
                  const isWorkDay = tot.consult > 0 || tot.surgery > 0
                  return (
                    <div key={day} className="text-center pb-2 border-b border-zinc-100 dark:border-zinc-800">
                      <p className={cn("text-[12px] font-bold uppercase tracking-wider", isWorkDay ? "text-zinc-800 dark:text-zinc-100" : "text-zinc-300 dark:text-zinc-700")}>
                        {day.slice(0, 3)}
                      </p>
                      <p className="text-[10px] mt-0.5 h-3">
                        {isWorkDay && <>
                          {tot.consult > 0 && <span className="text-violet-500 font-bold">{tot.consult}p </span>}
                          {tot.surgery > 0 && <span className="text-rose-500 font-bold">{tot.surgery}sx</span>}
                        </>}
                      </p>
                    </div>
                  )
                })}

                {/* Time rows */}
                {HOURS.map((hour) => (
                  <React.Fragment key={hour}>
                    <div className="flex items-center justify-end pr-2 h-12">
                      <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">{hour}</span>
                    </div>
                    {visibleSchedule.map(({ day, slots }) => {
                      const slot = slots.find(s => s.time === hour)!
                      const dimmed = typeFilter !== "all" && slot.type !== typeFilter && slot.type !== "break" && slot.type !== "free"
                      return (
                        <div
                          key={day + hour}
                          title={slot.note ?? ""}
                          className={cn(
                            "rounded-xl h-12 flex flex-col items-center justify-center transition-all px-1.5 gap-0.5 cursor-default",
                            dimmed ? "opacity-30" : "",
                            SLOT_STYLES[slot.type]
                          )}
                        >
                          {slot.type === "consultation" && (
                            <>
                              <span className="text-[11px] font-bold leading-tight text-center w-full truncate px-1">{slot.note}</span>
                              <span className="text-[10px] font-semibold opacity-80">{slot.patients} pt{(slot.patients ?? 0) > 1 ? "s" : ""}</span>
                            </>
                          )}
                          {slot.type === "surgery" && (
                            <>
                              <span className="text-[11px] font-bold leading-tight">Surgery</span>
                              <span className="text-[10px] font-semibold opacity-80">{slot.note}</span>
                            </>
                          )}
                          {slot.type === "break" && <span className="text-[11px] font-bold">Break</span>}
                          {slot.type === "free" && <span className="text-[11px] text-zinc-400">—</span>}
                        </div>
                      )
                    })}
                  </React.Fragment>
                ))}

                {/* Totals row */}
                <div className="flex items-center justify-end pr-2 pt-3">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Total</span>
                </div>
                {visibleSchedule.map(({ day }) => {
                  const tot = dayTotals[schedule.findIndex(s => s.day === day)]
                  return (
                    <div key={day} className="pt-3 flex flex-col items-center gap-0.5">
                      {tot.consult > 0 && <span className="text-[10.5px] font-bold text-violet-700 dark:text-violet-300">{tot.consult} pts</span>}
                      {tot.surgery > 0 && <span className="text-[10.5px] font-bold text-rose-600 dark:text-rose-400">{tot.surgery} sx</span>}
                      {tot.consult === 0 && tot.surgery === 0 && <span className="text-[11px] text-zinc-300 dark:text-zinc-700">—</span>}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ── Appointment List ── */}
            <div className="px-5 pb-5">
              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.14em]">
                    {selectedDay === "all" ? "All Appointments" : `${selectedDay} Appointments`}
                    <span className="ml-2 text-zinc-300 dark:text-zinc-700 font-bold">{apptSlots.length}</span>
                  </p>
                </div>
                {apptSlots.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2">
                    {apptSlots.map((slot, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl border",
                          slot.type === "consultation"
                            ? "bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800"
                            : "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800"
                        )}
                      >
                        <div className={cn(
                          "w-1 self-stretch rounded-full shrink-0",
                          slot.type === "consultation" ? "bg-violet-400" : "bg-rose-500"
                        )} />
                        <div className="flex flex-col shrink-0 w-14">
                          <span className="text-[12px] font-bold text-zinc-700 dark:text-zinc-200">{slot.time}</span>
                          {selectedDay === "all" && <span className="text-[10px] text-zinc-400 font-medium">{(slot as any).day?.slice(0, 3)}</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "text-[13px] font-semibold leading-tight",
                            slot.type === "consultation" ? "text-violet-800 dark:text-violet-200" : "text-rose-800 dark:text-rose-200"
                          )}>
                            {slot.type === "consultation" ? slot.note : `Surgery – ${slot.note}`}
                          </p>
                          {slot.type === "consultation" && (
                            <p className="text-[11px] text-zinc-400 mt-0.5">{slot.patients} patient{(slot.patients ?? 0) > 1 ? "s" : ""} scheduled</p>
                          )}
                          {slot.type === "surgery" && (
                            <p className="text-[11px] text-zinc-400 mt-0.5">Operating room assigned</p>
                          )}
                        </div>
                        <span className={cn(
                          "text-[10.5px] font-bold px-2.5 py-1 rounded-full shrink-0",
                          slot.type === "consultation"
                            ? "bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300"
                            : "bg-rose-100   dark:bg-rose-900/60   text-rose-700   dark:text-rose-300"
                        )}>
                          {slot.type === "consultation" ? "Consult" : "Surgery"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarBlank className="w-8 h-8 text-zinc-200 dark:text-zinc-800 mx-auto mb-2" weight="duotone" />
                    <p className="text-[13px] font-medium text-zinc-400">No appointments match the filter</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <SpecialtyIcon weight="duotone" className="w-4 h-4 text-zinc-400" />
              <span className="text-[12px] text-zinc-500 font-medium">{doctor.schedule} · {doctor.shiftStart} – {doctor.shiftEnd} · Break @ {doctor.breakTime}</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-[12.5px] font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// ─── Doctor Profile Modal ──────────────────────────────────────
function DoctorProfileModal({ doctor, onClose, onViewSchedule }: { doctor: Doctor; onClose: () => void; onViewSchedule: () => void }) {
  const sc = STATUS_CONFIG[doctor.status]
  const sb = SPECIALTY_BADGE[doctor.specialty] ?? DEFAULT_SPEC_BADGE

  // Robust initials: skip "Dr." if present, take first 2
  const nameParts = doctor.name.split(" ").filter(p => !p.toLowerCase().includes("dr"))
  const initials = nameParts.length > 0
    ? nameParts.map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : doctor.name[0].toUpperCase()

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop (cleaner Arto-style) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-zinc-900/30 backdrop-blur-[2px]"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          className="relative w-full max-w-xl bg-white dark:bg-zinc-950 rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] border border-zinc-100 dark:border-zinc-800/50 overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Internal Padding Wrapper to match image spacing */}
          <div className="p-10">

            {/* Header: Avatar + Info + Right Status */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="size-16 rounded-[22px] border-4 border-white dark:border-zinc-950 shadow-sm">
                    <AvatarImage src={doctor.avatar} alt={doctor.name} />
                    <AvatarFallback className="bg-zinc-50 dark:bg-zinc-900 text-zinc-400 font-bold">{initials}</AvatarFallback>
                  </Avatar>
                  <span className={cn("absolute -top-0.5 -right-0.5 size-4 rounded-full border-[3px] border-white dark:border-zinc-950 shadow-sm", sc.dot)} />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-[20px] font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">{doctor.name}</h2>
                  <span className="text-[14px] text-zinc-400 dark:text-zinc-500 mt-0.5">{doctor.email}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[12px] font-semibold">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                  <button className="p-1.5 rounded-lg text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all">
                    <DotsThree className="size-5" weight="bold" />
                  </button>
                </div>
                <span className="text-[11px] font-medium text-zinc-300 dark:text-zinc-600">Next: {doctor.nextAvailable}</span>
              </div>
            </div>

            {/* Tags Section */}
            <div className="flex items-center gap-3 mt-6">
              <span className={cn("px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors cursor-default", sb.bg, sb.text)}>
                {doctor.specialty}
              </span>
              <span className="px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-[13px] font-medium transition-colors cursor-default">
                {doctor.department}
              </span>
            </div>

            {/* Stats Grid (Horizontal like in image) */}
            <div className="mt-8 bg-zinc-50/60 dark:bg-zinc-900/40 rounded-2xl p-6 flex items-center justify-between border border-zinc-100/50 dark:border-zinc-800/20">
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-medium text-zinc-400 dark:text-zinc-500">Age</span>
                <span className="text-[14px] font-semibold text-zinc-800 dark:text-zinc-200">{doctor.age} y/o</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-medium text-zinc-400 dark:text-zinc-500">Sex</span>
                <span className="text-[14px] font-semibold text-zinc-800 dark:text-zinc-200">{doctor.gender}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-medium text-zinc-400 dark:text-zinc-500">Location</span>
                <span className="text-[14px] font-semibold text-zinc-800 dark:text-zinc-200">{doctor.location}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-medium text-zinc-400 dark:text-zinc-500">Experience</span>
                <span className="text-[14px] font-semibold text-zinc-800 dark:text-zinc-200">{doctor.experience} yrs</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-medium text-zinc-400 dark:text-zinc-500">Status</span>
                <span className="text-[14px] font-semibold text-zinc-800 dark:text-zinc-200">Confirmed</span>
              </div>
            </div>

            {/* Footer: Quick Actions */}
            <div className="mt-10 flex items-center justify-between">
              <span className="text-[13px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">Quick Actions</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={onViewSchedule}
                  className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[14px] font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all shadow-md active:scale-[0.98]"
                >
                  <CalendarBlank className="size-4" weight="bold" />
                  Appointments
                </button>
                <div className="relative">
                  <button className="flex items-center gap-3 px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-[14px] font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all shadow-sm">
                    <Envelope className="size-4 text-zinc-300" />
                    Chat
                  </button>
                  <span className="absolute -top-1.5 -right-1.5 size-5 flex items-center justify-center bg-rose-500 text-white text-[10px] font-bold rounded-full border-2 border-white dark:border-zinc-950">
                    2
                  </span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
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
  const [scheduleDoctor, setScheduleDoctor] = useState<Doctor | null>(null)
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

  // Tabs
  const [activeTab, setActiveTab] = useState("doctors")
  const TABS = [
    { id: "doctors", label: "All Doctors" },
    { id: "departments", label: "Departments" },
    { id: "specialties", label: "Specialties" },
    { id: "schedule", label: "Schedule" },
  ]

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 overflow-hidden">

      {/* ── HEADER ── */}
      <div className="px-8 pt-6 pb-0 shrink-0">
        <h1 className="text-[26px] font-bold text-zinc-900 dark:text-white tracking-tight">
          Doctors Registry
        </h1>
        <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-1">
          Comprehensive doctor management system tracking specialties, schedules, and availability.
        </p>

        {/* ── Tabs + Actions row ── */}
        <div className="flex items-center justify-between mt-5">
          {/* Tabs */}
          <div className="flex items-center border-b border-zinc-200 dark:border-zinc-800">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 -mb-px",
                  activeTab === tab.id
                    ? "border-zinc-900 dark:border-white text-zinc-900 dark:text-white"
                    : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div
              className={cn(
                "flex items-center gap-2 px-3 h-8 rounded-lg border transition-all",
                searchOpen
                  ? "w-52 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950"
                  : "w-8 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              )}
              onClick={() => !searchOpen && setSearchOpen(true)}
            >
              <MagnifyingGlass className={cn("w-3.5 h-3.5 shrink-0 transition-colors", searchOpen ? "text-zinc-600 dark:text-zinc-300" : "text-zinc-400")} />
              {searchOpen && (
                <input
                  autoFocus
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onBlur={() => { if (!search) setSearchOpen(false) }}
                  placeholder="Search doctors…"
                  className="flex-1 text-[13px] bg-transparent outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                />
              )}
              {search && (
                <button onClick={e => { e.stopPropagation(); setSearch(""); setSearchOpen(false) }} className="text-zinc-400 hover:text-zinc-600">
                  <X className="w-3 h-3" weight="bold" />
                </button>
              )}
            </div>

            {/* Filter */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setFilterOpen(p => !p)}
                className={cn(
                  "flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-medium border transition-colors",
                  filterOpen || activeFilterCount > 0
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white"
                    : "text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                )}
              >
                <Funnel className="w-3.5 h-3.5" weight={filterOpen || activeFilterCount > 0 ? "fill" : "regular"} />
                Filter
                {activeFilterCount > 0 && (
                  <span className="ml-0.5 size-4 rounded-full bg-white/20 dark:bg-zinc-900/20 text-[10px] font-bold flex items-center justify-center">
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

            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[12px] font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 active:scale-[0.97] transition-all"
            >
              <Plus className="w-3.5 h-3.5" weight="bold" />
              Add Doctor
            </button>
          </div>
        </div>

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-1.5 mt-3">
            {statusFilter !== "all" && (
              <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 capitalize">
                {statusFilter.replace("-", " ")}
                <button onClick={() => setStatusFilter("all")}><X className="w-2.5 h-2.5" weight="bold" /></button>
              </span>
            )}
            {specialtyFilter !== "all" && (
              <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                {specialtyFilter}
                <button onClick={() => setSpecialtyFilter("all")}><X className="w-2.5 h-2.5" weight="bold" /></button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── INLINE FILTERS (Arto-style) ── */}
      <div className="px-8 py-3 flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
        {/* Status pills */}
        <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/60 rounded-lg p-0.5 gap-0.5">
          {([
            { key: "all" as const, label: "All", count: total },
            { key: "available" as const, label: "Available", count: available },
            { key: "in-surgery" as const, label: "In Surgery", count: inSurgery },
            { key: "on-leave" as const, label: "On Leave", count: onLeave },
            { key: "off-duty" as const, label: "Off Duty", count: offDuty },
          ]).map(pill => (
            <button
              key={pill.key}
              onClick={() => setStatusFilter(pill.key)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all",
                statusFilter === pill.key
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
              )}
            >
              {pill.label}
              <span className={cn(
                "text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center",
                statusFilter === pill.key
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                  : "bg-zinc-200/70 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400"
              )}>
                {pill.count}
              </span>
            </button>
          ))}
        </div>

        {/* Specialty dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors",
              specialtyFilter !== "all"
                ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white"
                : "text-zinc-500 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            )}>
              {specialtyFilter === "all" ? "Specialty" : specialtyFilter}
              <CaretDown className="w-3 h-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 p-1 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-lg">
            <DropdownMenuItem
              onClick={() => setSpecialtyFilter("all")}
              className={cn("text-[12px] font-medium rounded-lg gap-2 px-2.5 py-2 cursor-pointer", specialtyFilter === "all" && "bg-zinc-100 dark:bg-zinc-800")}
            >
              All Specialties
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-0.5" />
            {Object.keys(SPECIALTY_BADGE).map(spec => (
              <DropdownMenuItem
                key={spec}
                onClick={() => setSpecialtyFilter(spec)}
                className={cn("text-[12px] font-medium rounded-lg gap-2 px-2.5 py-2 cursor-pointer", specialtyFilter === spec && "bg-zinc-100 dark:bg-zinc-800")}
              >
                <span className={cn("size-2 rounded-full", SPECIALTY_BADGE[spec].dot)} />
                {spec}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Department dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-zinc-500 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              Department
              <CaretDown className="w-3 h-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44 p-1 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-lg">
            {[...new Set(doctors.map(d => d.department))].sort().map(dept => (
              <DropdownMenuItem key={dept} className="text-[12px] font-medium rounded-lg px-2.5 py-2 cursor-pointer">
                {dept}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ── TABLE ── */}
      <div className="flex-1 overflow-auto">
        <Frame className="w-full">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-white dark:bg-zinc-950">
              <TableRow className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-transparent">
                {TABLE_COLS.map(col => (
                  <TableHead
                    key={col.label + col.key}
                    className={cn(
                      "py-2 px-4 text-[12px] font-medium text-zinc-500 dark:text-zinc-400 whitespace-nowrap first:pl-8 last:pr-8",
                      col.sortable && "cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-200 select-none"
                    )}
                    onClick={() => col.sortable && col.key && toggleSort(col.key as SortField)}
                  >
                    <span className="inline-flex items-center gap-1">
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
                  <TableCell colSpan={9} className="py-20 text-center">
                    <MagnifyingGlass className="w-8 h-8 text-zinc-200 dark:text-zinc-800 mx-auto mb-2" />
                    <p className="text-[13px] font-medium text-zinc-500">No doctors found</p>
                    <p className="text-[12px] text-zinc-400 mt-0.5">Try adjusting your search or filters</p>
                  </TableCell>
                </TableRow>
              ) : filtered.map(d => {
                const sc = STATUS_CONFIG[d.status]
                const isSelected = drawerDoctorId === d.id

                return (
                  <TableRow
                    key={d.id}
                    className={cn(
                      "group border-b border-zinc-100 dark:border-zinc-800/60 transition-colors",
                      isSelected ? "bg-blue-50/60 dark:bg-blue-950/20" : "hover:bg-zinc-50 dark:hover:bg-zinc-900/30"
                    )}
                  >
                    {/* Doctor */}
                    <TableCell className="py-2.5 pl-8 pr-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarImage src={d.avatar} alt={d.name} />
                          <AvatarFallback className="text-[11px] font-semibold bg-zinc-100 dark:bg-zinc-800">
                            {d.name.split(" ").map(n => n[0]).slice(1).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100 truncate">{d.name}</span>
                          <span className="text-[11px] text-zinc-400 truncate">{d.email}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Specialty badge */}
                    <TableCell className="py-2.5 px-4">
                      {(() => {
                        const sb = SPECIALTY_BADGE[d.specialty] ?? DEFAULT_SPEC_BADGE
                        return (
                          <span className={cn("inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1 rounded-md", sb.bg, sb.text)}>
                            <span className={cn("size-1.5 rounded-full", sb.dot)} />
                            {d.specialty}
                          </span>
                        )
                      })()}
                    </TableCell>

                    {/* Status (✓ Active / ✕ Inactive style) */}
                    <TableCell className="py-2.5 px-4">
                      <span className={cn(
                        "inline-flex items-center gap-1 text-[12px] font-medium px-2 py-0.5 rounded",
                        d.status === "available" && "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30",
                        d.status === "in-surgery" && "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30",
                        d.status === "on-leave" && "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30",
                        d.status === "off-duty" && "text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800",
                      )}>
                        {d.status === "available" && <span className="text-emerald-500">✓</span>}
                        {d.status === "in-surgery" && <span className="text-rose-500">•</span>}
                        {d.status === "on-leave" && <span className="text-amber-500">✕</span>}
                        {d.status === "off-duty" && <span className="text-zinc-400">✕</span>}
                        {sc.label}
                      </span>
                    </TableCell>

                    {/* Department */}
                    <TableCell className="py-2.5 px-4">
                      <span className="text-[13px] text-zinc-700 dark:text-zinc-300">{d.department}</span>
                    </TableCell>

                    {/* Rating */}
                    <TableCell className="py-2.5 px-4">
                      <div className="flex items-center gap-1">
                        <Star weight="fill" className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">{d.rating}</span>
                        <span className="text-[11px] text-zinc-400">({d.reviews})</span>
                      </div>
                    </TableCell>

                    {/* Patients */}
                    <TableCell className="py-2.5 px-4">
                      <span className="text-[13px] text-zinc-700 dark:text-zinc-300">{d.patients}</span>
                    </TableCell>

                    {/* Experience */}
                    <TableCell className="py-2.5 px-4">
                      <span className="text-[13px] text-zinc-700 dark:text-zinc-300">{d.experience} yrs</span>
                    </TableCell>

                    {/* Join Date */}
                    <TableCell className="py-2.5 px-4">
                      <span className="text-[13px] text-zinc-500 dark:text-zinc-400">{d.joinDate}</span>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-2.5 pl-4 pr-8 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            onClick={e => e.stopPropagation()}
                            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <DotsThree className="w-4 h-4" weight="bold" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-1 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-lg">
                          <DropdownMenuItem
                            onClick={e => { e.stopPropagation(); setDrawerDoctorId(d.id) }}
                            className="text-[12px] font-medium rounded-lg gap-2 px-2.5 py-2 cursor-pointer"
                          >
                            <UserCircle weight="duotone" className="w-4 h-4 text-zinc-400" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-[12px] font-medium rounded-lg gap-2 px-2.5 py-2 cursor-pointer">
                            <PencilSimple weight="duotone" className="w-4 h-4 text-zinc-400" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-[12px] font-medium rounded-lg gap-2 px-2.5 py-2 cursor-pointer">
                            <Copy weight="duotone" className="w-4 h-4 text-zinc-400" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-[12px] font-medium rounded-lg gap-2 px-2.5 py-2 cursor-pointer">
                            <ArrowSquareOut weight="duotone" className="w-4 h-4 text-zinc-400" />
                            Copy link
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-0.5" />
                          <DropdownMenuItem
                            onClick={e => { e.stopPropagation(); setDoctors(prev => prev.filter(x => x.id !== d.id)); if (drawerDoctorId === d.id) setDrawerDoctorId(null) }}
                            className="text-[12px] font-medium rounded-lg gap-2 px-2.5 py-2 cursor-pointer text-rose-500 focus:text-rose-500 focus:bg-rose-50 dark:focus:bg-rose-950/20"
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
        </Frame>
      </div>

      {/* ── DOCTOR PROFILE MODAL ── */}
      {drawerDoctor && !scheduleDoctor && (
        <DoctorProfileModal
          doctor={drawerDoctor}
          onClose={() => setDrawerDoctorId(null)}
          onViewSchedule={() => setScheduleDoctor(drawerDoctor)}
        />
      )}

      {/* ── DOCTOR SCHEDULE MODAL ── */}
      {scheduleDoctor && (
        <DoctorScheduleModal
          doctor={scheduleDoctor}
          onClose={() => { setScheduleDoctor(null); setDrawerDoctorId(null) }}
          onBack={() => setScheduleDoctor(null)}
        />
      )}

      {/* ── ADD MODAL ── */}
      <AddDoctorModal open={showAdd} onClose={() => setShowAdd(false)} onAdd={handleAddDoctor} />
    </div>
  )
}
