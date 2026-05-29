"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import {
  MagnifyingGlass, Plus, X, FunnelSimple, ArrowsDownUp, ListDashes,
  CaretDown, DotsThree, UserCircle, Envelope, Trash,
  User, CalendarBlank, Phone, MapPin, Heartbeat, Drop, Thermometer, Pill,
  ArrowLeft, Clock, Bed
} from "@phosphor-icons/react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

import pdfIcon from "@/assets/pdf.png"

// ─── Types ────────────────────────────────────────────────────
export interface Patient {
  id: number
  name: string
  age: number
  gender: string
  bloodGroup: string
  contact: string
  email: string
  avatar: string
  status: "admitted" | "discharged" | "observation" | "critical"
  department: string
  doctor: string
  room: string
  admissionDate: string
  diagnosis: string
  reportName?: string
  reportSize?: string
}

// ─── Data ────────────────────────────────────────────────────
const PATIENTS: Patient[] = [
  { id: 1, name: "Eleanor Pena", age: 45, gender: "Female", bloodGroup: "O+", contact: "+1 (555) 123-4567", email: "eleanor@example.com", avatar: "https://i.pravatar.cc/200?img=1", status: "admitted", department: "Cardiology", doctor: "Dr. Alexandra Reed", room: "Ward A - 102", admissionDate: "May 15, 2024", diagnosis: "Hypertension", reportName: "Blood Test Results.pdf", reportSize: "1.2 MB" },
  { id: 2, name: "Jacob Jones", age: 32, gender: "Male", bloodGroup: "A-", contact: "+1 (555) 234-5678", email: "jacob@example.com", avatar: "https://i.pravatar.cc/200?img=11", status: "observation", department: "Neurology", doctor: "Dr. Marcus Thompson", room: "Obs - 05", admissionDate: "May 16, 2024", diagnosis: "Migraine", reportName: "MRI Scan Summary.pdf", reportSize: "3.8 MB" },
  { id: 3, name: "Kathryn Murphy", age: 28, gender: "Female", bloodGroup: "B+", contact: "+1 (555) 345-6789", email: "kathryn@example.com", avatar: "https://i.pravatar.cc/200?img=5", status: "discharged", department: "Orthopedics", doctor: "Dr. James Okafor", room: "—", admissionDate: "May 10, 2024", diagnosis: "Fracture", reportName: "Discharge Summary.pdf", reportSize: "0.9 MB" },
  { id: 4, name: "Cameron Williamson", age: 54, gender: "Male", bloodGroup: "AB+", contact: "+1 (555) 456-7890", email: "cameron@example.com", avatar: "https://i.pravatar.cc/200?img=13", status: "critical", department: "ICU", doctor: "Dr. Alexandra Reed", room: "ICU - 02", admissionDate: "May 14, 2024", diagnosis: "Heart Failure", reportName: "ICU Care Notes.pdf", reportSize: "2.6 MB" },
  { id: 5, name: "Cody Fisher", age: 19, gender: "Male", bloodGroup: "O-", contact: "+1 (555) 567-8901", email: "cody@example.com", avatar: "https://i.pravatar.cc/200?img=14", status: "admitted", department: "Pediatrics", doctor: "Dr. Priya Sharma", room: "Ward B - 204", admissionDate: "May 17, 2024", diagnosis: "Asthma", reportName: "Pediatric Consultation.pdf", reportSize: "1.4 MB" },
  { id: 6, name: "Jane Cooper", age: 41, gender: "Female", bloodGroup: "A+", contact: "+1 (555) 678-9012", email: "jane@example.com", avatar: "https://i.pravatar.cc/200?img=9", status: "observation", department: "Dermatology", doctor: "Dr. Chen Wei", room: "Obs - 01", admissionDate: "May 17, 2024", diagnosis: "Allergic Reaction", reportName: "Skin Allergy Report.pdf", reportSize: "1.1 MB" },
  { id: 7, name: "Robert Fox", age: 62, gender: "Male", bloodGroup: "B-", contact: "+1 (555) 789-0123", email: "robert@example.com", avatar: "https://i.pravatar.cc/200?img=15", status: "admitted", department: "Oncology", doctor: "Dr. Sarah Mitchell", room: "Ward C - 305", admissionDate: "May 12, 2024", diagnosis: "Chemotherapy", reportName: "Oncology Treatment Plan.pdf", reportSize: "2.9 MB" },
  { id: 8, name: "Esther Howard", age: 29, gender: "Female", bloodGroup: "O+", contact: "+1 (555) 890-1234", email: "esther@example.com", avatar: "https://i.pravatar.cc/200?img=20", status: "discharged", department: "Radiology", doctor: "Dr. Elena Vasquez", room: "—", admissionDate: "May 13, 2024", diagnosis: "MRI Scan", reportName: "MRI Report.pdf", reportSize: "2.2 MB" },
]

export const PATIENT_STATUS_CONFIG = {
  "admitted": { label: "Admitted", dot: "bg-blue-500", ring: "ring-blue-500/30", bg: "bg-blue-50 dark:bg-blue-950/50", text: "text-blue-700 dark:text-blue-400" },
  "observation": { label: "Observation", dot: "bg-amber-400", ring: "ring-amber-400/30", bg: "bg-amber-50 dark:bg-amber-950/50", text: "text-amber-700 dark:text-amber-400" },
  "critical": { label: "Critical", dot: "bg-rose-500 animate-pulse", ring: "ring-rose-500/30", bg: "bg-rose-50 dark:bg-rose-950/50", text: "text-rose-700 dark:text-rose-400" },
  "discharged": { label: "Discharged", dot: "bg-emerald-500", ring: "ring-emerald-500/30", bg: "bg-emerald-50 dark:bg-emerald-950/50", text: "text-emerald-700 dark:text-emerald-400" },
}

const DEPT_BADGE: Record<string, { dot: string; text: string; bg: string }> = {
  "Cardiology": { dot: "bg-red-500", text: "text-red-700 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30" },
  "Neurology": { dot: "bg-purple-500", text: "text-purple-700 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950/30" },
  "Orthopedics": { dot: "bg-amber-500", text: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30" },
  "ICU": { dot: "bg-rose-500", text: "text-rose-700 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-950/30" },
  "Pediatrics": { dot: "bg-blue-500", text: "text-blue-700 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30" },
  "Dermatology": { dot: "bg-indigo-500", text: "text-indigo-700 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/30" },
  "Oncology": { dot: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
}
const DEFAULT_DEPT_BADGE = { dot: "bg-zinc-400", text: "text-zinc-600 dark:text-zinc-400", bg: "bg-zinc-100 dark:bg-zinc-800" }

const COLS = [
  { key: "name", label: "Patient Name", width: "minmax(180px, 1fr)", sortable: true },
  { key: "status", label: "Status", width: "110px", sortable: true },
  { key: "department", label: "Department", width: "120px", sortable: true },
  { key: "doctor", label: "Doctor", width: "140px", sortable: true },
  { key: "report", label: "Report", width: "70px", sortable: false },
  { key: "diagnosis", label: "Diagnosis", width: "130px", sortable: true },
  { key: "room", label: "Room", width: "90px", sortable: true },
  { key: "admissionDate", label: "Admitted", width: "90px", sortable: true },
  { key: "action", label: "", width: "40px", sortable: false },
]

const fieldCls = "w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-[13px] font-medium outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-400 dark:focus:border-zinc-600 transition-all placeholder:text-zinc-400 text-zinc-900 dark:text-zinc-100"
const labelCls = "block text-[11px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5"

// ─── Add Patient Modal ───────────────────────────────────────
function AddPatientModal({
  open, onClose, onAdd,
}: {
  open: boolean
  onClose: () => void
  onAdd: (patient: Patient) => void
}) {
  const empty = { name: "", email: "", phone: "", age: "", gender: "Female", bloodGroup: "A+", department: "", doctor: "", diagnosis: "", status: "admitted" as Patient["status"] }
  const [form, setForm] = useState({ ...empty })
  const [errors, setErrors] = useState<Partial<typeof empty>>({})

  function set(field: keyof typeof empty, val: string) {
    setForm(f => ({ ...f, [field]: val }))
    setErrors(e => ({ ...e, [field]: "" }))
  }

  function validate() {
    const errs: Partial<typeof empty> = {}
    if (!form.name.trim()) errs.name = "Required"
    if (!form.department.trim()) errs.department = "Required"
    if (!form.doctor.trim()) errs.doctor = "Required"
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
      email: form.email.trim() || "—",
      contact: form.phone.trim() || "—",
      age: parseInt(form.age) || 30,
      gender: form.gender,
      bloodGroup: form.bloodGroup,
      department: form.department.trim(),
      doctor: form.doctor.trim(),
      diagnosis: form.diagnosis.trim() || "Pending",
      status: form.status,
      room: "TBD",
      admissionDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      avatar: `https://i.pravatar.cc/200?img=${avatarId}`,
    })
    setForm({ ...empty })
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-xl p-0 gap-0 overflow-hidden bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center shrink-0">
              <User className="w-4.5 h-4.5 text-white dark:text-zinc-900" weight="duotone" />
            </div>
            <div>
              <DialogTitle className="text-[17px] text-zinc-900 dark:text-white">Admit New Patient</DialogTitle>
              <DialogDescription className="text-[12px] mt-0.5 text-zinc-500">Register a new patient into the system.</DialogDescription>
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
                placeholder="e.g. Jane Doe"
                className={cn(fieldCls, errors.name && "border-rose-400")}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Age</label>
                <input type="number" value={form.age} onChange={e => set("age", e.target.value)} placeholder="30" className={fieldCls} />
              </div>
              <div>
                <label className={labelCls}>Gender</label>
                <select value={form.gender} onChange={e => set("gender", e.target.value)} className={fieldCls}>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Phone</label>
                <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+1 (555) 000-0000" className={fieldCls} />
              </div>
              <div>
                <label className={labelCls}>Blood Group</label>
                <select value={form.bloodGroup} onChange={e => set("bloodGroup", e.target.value)} className={fieldCls}>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Department *</label>
                <input value={form.department} onChange={e => set("department", e.target.value)} placeholder="e.g. Cardiology" className={cn(fieldCls, errors.department && "border-rose-400")} />
              </div>
              <div>
                <label className={labelCls}>Assigned Doctor *</label>
                <input value={form.doctor} onChange={e => set("doctor", e.target.value)} placeholder="e.g. Dr. Smith" className={cn(fieldCls, errors.doctor && "border-rose-400")} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Diagnosis</label>
                <input value={form.diagnosis} onChange={e => set("diagnosis", e.target.value)} placeholder="e.g. Hypertension" className={fieldCls} />
              </div>
              <div>
                <label className={labelCls}>Status</label>
                <select value={form.status} onChange={e => set("status", e.target.value)} className={fieldCls}>
                  <option value="admitted">Admitted</option>
                  <option value="observation">Observation</option>
                  <option value="critical">Critical</option>
                  <option value="discharged">Discharged</option>
                </select>
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
              Add Patient
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Patient Profile Side Panel ──────────────────────────────
function PatientProfileSidePanel({ patient, onClose }: { patient: Patient; onClose: () => void }) {
  const sc = PATIENT_STATUS_CONFIG[patient.status]

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-zinc-900/20 dark:bg-black/40 backdrop-blur-[2px] z-40"
      />
      <motion.div
        initial={{ x: "100%", opacity: 0.5 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0.5 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed top-2 right-2 bottom-2 w-full max-w-[540px] bg-white dark:bg-[#1c1c1c] rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 z-50 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800/50">
          <div className="flex items-center gap-3">
            <h2 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100">Patient Preview</h2>
            <div className="flex items-center gap-1 text-zinc-400">
              <button className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"><CaretDown className="w-3.5 h-3.5 rotate-180" /></button>
              <button className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"><CaretDown className="w-3.5 h-3.5" /></button>
            </div>
            <span className="text-[11px] text-zinc-400 font-medium ml-1">4 of 342</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-[11px] font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              View Full Details
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <X className="w-4 h-4" weight="bold" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {/* Profile Header */}
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="size-14 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <AvatarImage src={patient.avatar} />
              <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-bold">{patient.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[20px] font-bold text-zinc-900 dark:text-white leading-tight">{patient.name}</h3>
                <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                </span>
                <span className="text-[11px] text-zinc-400 font-medium">Admitted {patient.admissionDate}</span>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="w-4 h-4 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">H</div>
                <span className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400">General Hospital</span>
              </div>
            </div>
          </div>

          {/* Stats Strip */}
          <div className="grid grid-cols-4 gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800/50">
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Status</p>
              <p className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100">{sc.label}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Department</p>
              <p className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100 truncate">{patient.department}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Blood Group</p>
              <div className="flex items-center gap-1">
                <p className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100">{patient.bloodGroup}</p>
                <span className="text-[10px] font-bold text-emerald-500">Match</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Age / Sex</p>
              <p className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100">{patient.age} / {patient.gender[0]}</p>
            </div>
          </div>

          {/* Patient Details */}
          <div className="py-6 border-b border-zinc-100 dark:border-zinc-800/50">
            <h4 className="text-[13px] font-bold text-zinc-900 dark:text-white mb-4">Patient Details</h4>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-zinc-500">Source</span>
                <span className="text-[12px] font-medium text-zinc-900 dark:text-zinc-100">Emergency Room</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-zinc-500">Room/Ward</span>
                <span className="text-[12px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-1.5 py-0.5 rounded flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> {patient.room}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-zinc-500">Phone Number</span>
                <span className="text-[12px] font-medium text-blue-500">{patient.contact}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-zinc-500">Assigned Doctor</span>
                <span className="text-[12px] font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5"><Avatar className="w-4 h-4"><AvatarFallback className="text-[8px] bg-zinc-200 text-zinc-600">{patient.doctor[4]}</AvatarFallback></Avatar> {patient.doctor}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-zinc-500">Email</span>
                <div className="flex flex-col items-end">
                  <span className="text-[12px] font-medium text-blue-500">{patient.email}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-zinc-500">Description</span>
                <span className="text-[12px] font-medium text-zinc-400 border-b border-dashed border-zinc-300 dark:border-zinc-700 cursor-pointer">Add Description</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-zinc-500">Location</span>
                <span className="text-[12px] font-medium text-zinc-900 dark:text-zinc-100">New York, USA</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-zinc-500">Language Spoken</span>
                <span className="text-[12px] font-medium text-zinc-900 dark:text-zinc-100">English, Spanish</span>
              </div>
            </div>
          </div>

          {/* Active Treatment */}
          <div className="py-6 border-b border-zinc-100 dark:border-zinc-800/50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[13px] font-bold text-zinc-900 dark:text-white">Active Treatment</h4>
              <span className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 cursor-pointer hover:underline">View More Treatment</span>
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[14px] font-bold text-zinc-900 dark:text-zinc-100">#TR-196 <span className="font-medium ml-1 text-zinc-600 dark:text-zinc-300">{patient.diagnosis} Treatment Plan</span></p>
                <span className="text-[10px] font-bold text-white bg-blue-500 px-2 py-0.5 rounded-full">Open</span>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] font-medium text-zinc-400 mb-1">Treatment Type</p>
                  <p className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1"><UserCircle className="w-3.5 h-3.5" /> Inpatient</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-zinc-400 mb-1">Priority</p>
                  <p className="text-[11px] font-semibold text-amber-600 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Medium</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-zinc-400 mb-1">Assigned to</p>
                  <p className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5"><Avatar className="w-3.5 h-3.5"><AvatarFallback className="text-[8px] bg-zinc-200">D</AvatarFallback></Avatar> {patient.doctor}</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-zinc-400 mb-1">Request Date</p>
                  <p className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">{patient.admissionDate}, 09:00AM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity */}
          <div className="py-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[13px] font-bold text-zinc-900 dark:text-white">Activity</h4>
              <span className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 cursor-pointer hover:underline">View More Activity</span>
            </div>

            <div className="space-y-4 pl-1">
              <div className="relative pl-6">
                <div className="absolute left-[3px] top-1.5 bottom-[-16px] w-[2px] bg-zinc-100 dark:bg-zinc-800" />
                <div className="absolute left-0 top-1 w-2 h-2 rounded-full border-2 border-emerald-500 bg-white dark:bg-zinc-950 z-10" />
                <p className="text-[12px] text-zinc-800 dark:text-zinc-200">
                  <span className="font-bold">{patient.name}</span> was moved to <span className="font-bold">{patient.room}</span>
                </p>
                <p className="text-[10px] text-zinc-400 mt-0.5">11:12 AM - Today</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute left-0 top-1 w-2 h-2 rounded-full border-2 border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-950 z-10" />
                <p className="text-[12px] text-zinc-800 dark:text-zinc-200">
                  <span className="font-bold">{patient.name}</span> was admitted by <span className="font-bold">Reception</span>
                </p>
                <p className="text-[10px] text-zinc-400 mt-0.5">09:00 AM - {patient.admissionDate}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}


// ─── Main Page ────────────────────────────────────────────────
export function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>(PATIENTS)
  const [showAdd, setShowAdd] = useState(false)
  const [view, setView] = useState<"list" | "profile">("list")
  const [profilePatient, setProfilePatient] = useState<Patient | null>(null)
  const [search, setSearch] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [filterOpen, setFilterOpen] = useState(false)

  const [sort, setSort] = useState<{ field: string, dir: "asc" | "desc" }>({ field: "name", dir: "asc" })
  const [sortOpen, setSortOpen] = useState(false)

  const [page, setPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  function handleViewProfile(patient: Patient) {
    setProfilePatient(patient)
    setView("profile")
  }

  const filtered = patients.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = p.name.toLowerCase().includes(q) || p.diagnosis.toLowerCase().includes(q) || p.doctor.toLowerCase().includes(q)
    const matchStatus = statusFilter === "all" || p.status === statusFilter
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

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 overflow-hidden relative">
      {/* ── HEADER ── */}
      <div className="px-8 pt-6 pb-0 shrink-0">
        <h1 className="text-[26px] font-bold text-zinc-900 dark:text-white tracking-tight">
          Patient Registry
        </h1>
        <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-1">
          Manage patient records, admissions, and clinical assignments.
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
                  { id: "admitted", label: "Admitted" },
                  { id: "observation", label: "Observation" },
                  { id: "critical", label: "Critical" },
                  { id: "discharged", label: "Discharged" }
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
                  { field: "admissionDate", dir: "desc", label: "Admission Date", icon: CalendarBlank },
                  { field: "department", dir: "asc", label: "Department", icon: Heartbeat },
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
                  placeholder="Search patients..."
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
              Admit Patient
            </button>
          </div>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="flex-1 mt-4 px-8 pb-8">
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
            <div className="flex-1">
              {filtered.length === 0 ? (
                <div className="py-20 text-center">
                  <MagnifyingGlass className="w-8 h-8 text-zinc-200 dark:text-zinc-800 mx-auto mb-2" />
                  <p className="text-[13px] font-medium text-zinc-500">No patients found</p>
                  <p className="text-[12px] text-zinc-400 mt-0.5">Try adjusting your search or filters</p>
                </div>
              ) : pageDocs.map((patient, i) => {
                const status = (PATIENT_STATUS_CONFIG as any)[patient.status]
                const dept = DEPT_BADGE[patient.department] ?? DEFAULT_DEPT_BADGE

                return (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02, duration: 0.2 }}
                    className="group grid items-center border-b border-zinc-100 dark:border-zinc-800 last:border-0 transition-colors px-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 cursor-pointer"
                    style={{ gridTemplateColumns: COLS.map(c => c.width).join(" ") }}
                    onClick={() => handleViewProfile(patient)}
                  >
                    {/* Name */}
                    <div className="py-3 flex items-center gap-3 pr-4">
                      <Avatar className={cn("size-8 ring-1", status.ring)}>
                        <AvatarImage src={patient.avatar} />
                        <AvatarFallback className="text-[11px] font-black bg-zinc-100 dark:bg-zinc-800">
                          {patient.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100 truncate">
                          {patient.name}
                        </span>
                        <span className="text-[11px] text-zinc-400 truncate">
                          {patient.age}y/o • {patient.gender}
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="py-3">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded",
                        status.bg, status.text
                      )}>
                        <span className={cn("size-1.5 rounded-full", status.dot)} />
                        {status.label}
                      </span>
                    </div>

                    {/* Department */}
                    <div className="py-3">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg border shadow-sm",
                        dept.bg, dept.text, "border-zinc-200/50 dark:border-zinc-700/50"
                      )}>
                        <span className={cn("size-1.5 rounded-full", dept.dot)} />
                        {patient.department}
                      </span>
                    </div>

                    {/* Assigned Doctor */}
                    <div className="py-3">
                      <span className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
                        {patient.doctor}
                      </span>
                    </div>

                    {/* Report */}
                    <div className="py-3 flex items-center justify-center">
                      <div className="relative group">
                        <img
                          src={pdfIcon}
                          alt={patient.reportName ? `Report: ${patient.reportName}` : "Report icon"}
                          className="w-11 h-11 object-contain"
                        />
                        <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 rounded-full bg-zinc-900 px-2 py-1 text-[11px] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 whitespace-nowrap">
                          {patient.reportName ?? "No report"}
                        </span>
                      </div>
                    </div>

                    {/* Diagnosis */}
                    <div className="py-3">
                      <span className="text-[13px] text-zinc-600 dark:text-zinc-400 truncate pr-2 block">
                        {patient.diagnosis}
                      </span>
                    </div>

                    {/* Room/Ward */}
                    <div className="py-3">
                      <span className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
                        {patient.room}
                      </span>
                    </div>

                    {/* Admission Date */}
                    <div className="py-3">
                      <span className="text-[12px] text-zinc-500 dark:text-zinc-400">
                        {patient.admissionDate}
                      </span>
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
                            onClick={(e) => { e.stopPropagation(); handleViewProfile(patient); }}
                            className="text-[12px] font-medium rounded-lg gap-2 px-2.5 py-2 cursor-pointer"
                          >
                            <UserCircle className="w-4 h-4 text-zinc-400" />
                            View Record
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-[12px] font-medium rounded-lg gap-2 px-2.5 py-2 cursor-pointer">
                            <Envelope className="w-4 h-4 text-zinc-400" />
                            Message Family
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-0.5" />
                          <DropdownMenuItem className="text-[12px] font-medium rounded-lg gap-2 px-2.5 py-2 cursor-pointer text-rose-500 focus:text-rose-500 focus:bg-rose-50 dark:focus:bg-rose-950/20">
                            <Trash className="w-4 h-4" />
                            Discharge
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
                Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filtered.length)} of {filtered.length} patients
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

      <AddPatientModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={(p) => setPatients(prev => [p, ...prev])}
      />

      {/* Side Panel Overlay */}
      <AnimatePresence>
        {view === "profile" && profilePatient && (
          <PatientProfileSidePanel patient={profilePatient} onClose={() => setView("list")} />
        )}
      </AnimatePresence>
    </div>
  )
}
