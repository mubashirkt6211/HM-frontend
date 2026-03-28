import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  CalendarDays,
  Clock,
  Plus,
  Search,
  Settings,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Users,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Timer,
  Download,
  RefreshCw,
  Activity,
  LayoutGrid,
} from "lucide-react"
import { format, startOfWeek, addDays, isSameDay } from "date-fns"
import { cn } from "@/lib/utils"

interface Doctor {
  id: number
  name: string
  specialization: string
  department: string
}

interface Appointment {
  id: number
  doctorId: number
  patientName: string
  patientPhone: string
  appointmentType: string
  date: string
  time: string
  duration: number
  status: "scheduled" | "confirmed" | "in-progress" | "completed" | "cancelled" | "no-show"
  notes: string
  location: string
  priority: "low" | "medium" | "high" | "urgent"
}

const DOCTORS: Doctor[] = [
  { id: 1, name: "Dr. Sarah Johnson",   specialization: "Cardiology",       department: "Cardiology" },
  { id: 2, name: "Dr. Robert Chen",     specialization: "Neurology",        department: "Neurology" },
  { id: 3, name: "Dr. Emily Rodriguez", specialization: "Pediatrics",       department: "Pediatrics" },
  { id: 4, name: "Dr. Michael Brown",   specialization: "Orthopedics",      department: "Orthopedics" },
  { id: 5, name: "Dr. Lisa Thompson",   specialization: "Dermatology",      department: "Dermatology" },
  { id: 6, name: "Dr. David Wilson",    specialization: "General Medicine", department: "General Medicine" },
]

function makeAppts(): Appointment[] {
  const today = format(new Date(), "yyyy-MM-dd")
  const d1    = format(addDays(new Date(), 1), "yyyy-MM-dd")
  const d2    = format(addDays(new Date(), 2), "yyyy-MM-dd")
  const d3    = format(addDays(new Date(), 3), "yyyy-MM-dd")
  const d4    = format(addDays(new Date(), 4), "yyyy-MM-dd")
  const d5    = format(addDays(new Date(), 5), "yyyy-MM-dd")
  const d6    = format(addDays(new Date(), 6), "yyyy-MM-dd")

  return [
    { id: 1,  doctorId: 1, patientName: "John Smith",     patientPhone: "+1 555-1234", appointmentType: "Consultation", date: today, time: "09:00", duration: 30, status: "confirmed",   notes: "Regular checkup",              location: "Room 101", priority: "medium" },
    { id: 2,  doctorId: 1, patientName: "Mary Johnson",   patientPhone: "+1 555-2345", appointmentType: "Follow-up",    date: today, time: "10:00", duration: 45, status: "scheduled",   notes: "Post-surgery follow-up",       location: "Room 101", priority: "high" },
    { id: 3,  doctorId: 2, patientName: "David Wilson",   patientPhone: "+1 555-3456", appointmentType: "Consultation", date: today, time: "14:00", duration: 60, status: "in-progress", notes: "Neurological examination",      location: "Room 205", priority: "high" },
    { id: 4,  doctorId: 3, patientName: "Emma Davis",     patientPhone: "+1 555-4567", appointmentType: "Vaccination",  date: today, time: "11:00", duration: 15, status: "completed",   notes: "Annual vaccination",           location: "Room 302", priority: "low" },
    { id: 5,  doctorId: 1, patientName: "Robert Brown",   patientPhone: "+1 555-5678", appointmentType: "Checkup",      date: today, time: "15:00", duration: 30, status: "confirmed",   notes: "Annual physical",              location: "Room 101", priority: "medium" },
    { id: 6,  doctorId: 2, patientName: "Lisa Anderson",  patientPhone: "+1 555-6789", appointmentType: "Follow-up",    date: today, time: "16:00", duration: 45, status: "scheduled",   notes: "Post-treatment review",        location: "Room 205", priority: "medium" },
    { id: 7,  doctorId: 3, patientName: "Michael Green",  patientPhone: "+1 555-7890", appointmentType: "Consultation", date: d1,    time: "09:00", duration: 30, status: "confirmed",   notes: "Pediatric consultation",       location: "Room 302", priority: "high" },
    { id: 8,  doctorId: 4, patientName: "Sarah Wilson",   patientPhone: "+1 555-8901", appointmentType: "Surgery",      date: d1,    time: "10:00", duration: 90, status: "scheduled",   notes: "Knee surgery",                 location: "OR 1",     priority: "urgent" },
    { id: 9,  doctorId: 1, patientName: "James Miller",   patientPhone: "+1 555-9012", appointmentType: "Consultation", date: d1,    time: "14:00", duration: 45, status: "confirmed",   notes: "Cardiac evaluation",           location: "Room 101", priority: "high" },
    { id: 10, doctorId: 5, patientName: "Jennifer Lee",   patientPhone: "+1 555-0123", appointmentType: "Skin Exam",    date: d2,    time: "08:00", duration: 30, status: "confirmed",   notes: "Skin examination",             location: "Room 401", priority: "medium" },
    { id: 11, doctorId: 2, patientName: "Kevin Zhang",    patientPhone: "+1 555-1234", appointmentType: "Consultation", date: d2,    time: "11:00", duration: 60, status: "scheduled",   notes: "Neurological assessment",      location: "Room 205", priority: "high" },
    { id: 12, doctorId: 6, patientName: "Amanda Taylor",  patientPhone: "+1 555-2345", appointmentType: "Checkup",      date: d2,    time: "15:00", duration: 30, status: "confirmed",   notes: "General health check",         location: "Room 501", priority: "low" },
    { id: 13, doctorId: 4, patientName: "Thomas Clark",   patientPhone: "+1 555-3456", appointmentType: "Follow-up",    date: d3,    time: "09:00", duration: 45, status: "scheduled",   notes: "Post-operative check",         location: "Room 201", priority: "medium" },
    { id: 14, doctorId: 3, patientName: "Sophie Martinez",patientPhone: "+1 555-4567", appointmentType: "Vaccination",  date: d3,    time: "10:00", duration: 15, status: "confirmed",   notes: "Childhood immunization",       location: "Room 302", priority: "medium" },
    { id: 15, doctorId: 5, patientName: "Daniel Rodriguez",patientPhone:"+1 555-5678", appointmentType: "Consultation", date: d4,    time: "13:00", duration: 30, status: "scheduled",   notes: "Dermatology consultation",     location: "Room 401", priority: "low" },
    { id: 16, doctorId: 6, patientName: "Rachel Kim",     patientPhone: "+1 555-6789", appointmentType: "Checkup",      date: d4,    time: "16:00", duration: 45, status: "confirmed",   notes: "Annual physical exam",         location: "Room 501", priority: "medium" },
    { id: 17, doctorId: 1, patientName: "William Johnson",patientPhone: "+1 555-7890", appointmentType: "Emergency",    date: d5,    time: "10:00", duration: 60, status: "in-progress", notes: "Emergency cardiac evaluation", location: "ER",       priority: "urgent" },
    { id: 18, doctorId: 2, patientName: "Helen Walker",   patientPhone: "+1 555-8901", appointmentType: "Consultation", date: d6,    time: "14:00", duration: 45, status: "scheduled",   notes: "Neurological consultation",    location: "Room 205", priority: "medium" },
  ]
}

const PRIORITY_STYLES: Record<string, string> = {
  urgent: "bg-gradient-to-br from-red-50 to-red-100 border-red-400 dark:from-red-950/60 dark:to-red-900/40 dark:border-red-700",
  high:   "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-400 dark:from-orange-950/60 dark:to-orange-900/40 dark:border-orange-700",
  medium: "bg-gradient-to-br from-amber-50 to-yellow-100 border-amber-400 dark:from-amber-950/60 dark:to-amber-900/40 dark:border-amber-700",
  low:    "bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-400 dark:from-emerald-950/60 dark:to-emerald-900/40 dark:border-emerald-700",
}

const STATUS_STYLES: Record<string, { label: string; cls: string }> = {
  scheduled:   { label: "Scheduled",   cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" },
  confirmed:   { label: "Confirmed",   cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300" },
  "in-progress":{ label: "In Progress", cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300" },
  completed:   { label: "Completed",   cls: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400" },
  cancelled:   { label: "Cancelled",   cls: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300" },
  "no-show":   { label: "No Show",     cls: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300" },
}

const PRIORITY_BADGE: Record<string, string> = {
  urgent: "bg-red-500 text-white",
  high:   "bg-orange-500 text-white",
  medium: "bg-amber-400 text-white",
  low:    "bg-emerald-500 text-white",
}

interface DoctorScheduleProps {
  doctorId?: number | null
  onBack?: () => void
}

export function DoctorSchedule({ doctorId = null, onBack }: DoctorScheduleProps = {}) {
  const [appointments] = useState<Appointment[]>(makeAppts)
  const [selectedDate, setSelectedDate]   = useState(new Date())
  const [viewMode, setViewMode]           = useState<"day" | "week" | "month">("week")
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [selectedAppt, setSelectedAppt]   = useState<Appointment | null>(null)
  const [searchTerm, setSearchTerm]       = useState("")
  const [statusFilter, setStatusFilter]   = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [activeTab, setActiveTab]         = useState("schedule")
  const activeDoctor = doctorId ? DOCTORS.find(d => d.id === doctorId) : null

  const departments = [...new Set(DOCTORS.map(d => d.department))]

  const filtered = appointments.filter(apt => {
    if (doctorId && apt.doctorId !== doctorId) return false
    if (statusFilter !== "all" && apt.status !== statusFilter) return false
    if (priorityFilter !== "all" && apt.priority !== priorityFilter) return false
    if (departmentFilter !== "all" && DOCTORS.find(d => d.id === apt.doctorId)?.department !== departmentFilter) return false
    if (searchTerm && !apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) && !apt.appointmentType.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const todayStr  = format(new Date(), "yyyy-MM-dd")
  const todayApts = appointments.filter(a => a.date === todayStr)

  const stats = {
    total:      appointments.length,
    today:      todayApts.length,
    confirmed:  appointments.filter(a => a.status === "confirmed").length,
    inProgress: appointments.filter(a => a.status === "in-progress").length,
  }

  const navigateDate = (dir: "prev" | "next") => {
    const d = new Date(selectedDate)
    const delta = dir === "next" ? 1 : -1
    if (viewMode === "day")   d.setDate(d.getDate() + delta)
    else if (viewMode === "week") d.setDate(d.getDate() + delta * 7)
    else d.setMonth(d.getMonth() + delta)
    setSelectedDate(d)
  }

  const TABS = [
    { id: "schedule", label: "Schedule", icon: CalendarDays, count: stats.total, countCls: "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300" },
    { id: "today",    label: "Today",    icon: Clock,        count: stats.today,  countCls: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300" },
    { id: "confirmed",label: "Confirmed",icon: CheckCircle2, count: stats.confirmed, countCls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300" },
    { id: "progress", label: "In Progress",icon: Timer,      count: stats.inProgress, countCls: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300" },
  ]

  const HOURS = Array.from({ length: 12 }, (_, i) => 8 + i)
  const WEEK  = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(selectedDate), i))

  return (
    <div className="flex flex-col gap-0 animate-in fade-in slide-in-from-bottom-4 duration-700 -mx-6 -mt-6">

      {/* ── TOP HEADER BAR ── */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-5">
        {/* Row 1 */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-5">
          <div>
            {activeDoctor ? (
              <>
                {onBack && (
                  <button onClick={onBack} className="flex items-center gap-1.5 text-[12px] font-bold text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 mb-3 transition-colors group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back to all doctors
                  </button>
                )}
                <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">{activeDoctor.name}</h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-[14px] font-medium mt-0.5">
                  {activeDoctor.specialization} · {activeDoctor.department}
                </p>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">Doctor Schedule</h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-[14px] font-medium mt-0.5">
                  Manage appointments, availability, and weekly schedules in one place.
                </p>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            {/* View toggle */}
            <div className="flex items-center gap-0.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
              {([["day", CalendarDays], ["week", LayoutGrid], ["month", CalendarIcon]] as const).map(([mode, Icon]) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    "p-2 rounded-lg transition-all text-[12px] font-bold capitalize flex items-center gap-1.5",
                    viewMode === mode
                      ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1 lg:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-[13px] font-medium outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Row 2 — Tabs + Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1">
            {TABS.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-3.5 py-2 rounded-lg text-[13px] font-bold transition-all flex items-center gap-2",
                    activeTab === tab.id
                      ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow border border-zinc-200 dark:border-zinc-700"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className={cn("px-1.5 py-0.5 rounded-full text-[10px] font-black", tab.countCls)}>
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-40 h-9 text-[12px] font-bold rounded-xl border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-zinc-400" />
                  <SelectValue placeholder="Department" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 h-9 text-[12px] font-bold rounded-xl border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-zinc-400" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-36 h-9 text-[12px] font-bold rounded-xl border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-zinc-400" />
                  <SelectValue placeholder="Priority" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ── ACTION BAR ── */}
      <div className="flex items-center justify-between gap-3 px-6 py-4 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <Button className="h-9 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 text-white font-bold shadow text-[13px]">
            <Plus className="h-4 w-4 mr-1.5" />
            New Appointment
          </Button>

          <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-9 rounded-xl border-zinc-200 dark:border-zinc-700 font-bold text-[13px]">
                <Settings className="h-4 w-4 mr-1.5" />
                Manage Schedule
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[440px] rounded-2xl border-zinc-200 dark:border-zinc-800">
              <DialogHeader>
                <DialogTitle className="font-black text-xl">Manage Schedule</DialogTitle>
                <DialogDescription>Set working hours and availability for a doctor.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Doctor</Label>
                  <Select>
                    <SelectTrigger className="w-full rounded-xl">
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {DOCTORS.map(d => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Day</Label>
                  <Select>
                    <SelectTrigger className="w-full rounded-xl">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(d => (
                        <SelectItem key={d} value={d.toLowerCase()}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Start</Label>
                    <Input type="time" className="rounded-xl h-10" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">End</Label>
                    <Input type="time" className="rounded-xl h-10" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setIsScheduleDialogOpen(false)} className="rounded-xl font-bold bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900">
                  Save Schedule
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-9 rounded-xl border-zinc-200 dark:border-zinc-700 font-bold text-[13px]">
            <Download className="h-4 w-4 mr-1.5" />
            Export
          </Button>
          <Button variant="outline" className="h-9 rounded-xl border-zinc-200 dark:border-zinc-700 font-bold text-[13px]">
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Refresh
          </Button>
        </div>
      </div>

      {/* ── CALENDAR NAV ── */}
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100">
            {viewMode === "week" ? "Weekly Schedule" : viewMode === "day" ? "Daily Schedule" : "Monthly Schedule"}
          </h2>
          <p className="text-[13px] font-medium text-zinc-400 mt-0.5">
            {format(startOfWeek(selectedDate), "MMMM yyyy")} · {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigateDate("prev")} className="rounded-xl border-zinc-200 dark:border-zinc-700">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Prev
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())} className="rounded-xl border-zinc-200 dark:border-zinc-700 font-bold">
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigateDate("next")} className="rounded-xl border-zinc-200 dark:border-zinc-700">
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* ── CALENDAR GRID ── */}
      <div className="px-6 pb-8">
        <Card className="overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-[900px]">

                {/* Day headers */}
                <div className="grid grid-cols-8 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 sticky top-0 z-10">
                  <div className="p-4 border-r border-zinc-200 dark:border-zinc-800 text-right text-[11px] font-black text-zinc-400 uppercase tracking-widest">Time</div>
                  {WEEK.map((day, i) => {
                    const isToday = isSameDay(day, new Date())
                    return (
                      <div key={i} className={cn(
                        "p-4 border-r border-zinc-200 dark:border-zinc-800 text-center transition-colors",
                        isToday ? "bg-zinc-900 dark:bg-zinc-100" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      )}>
                        <div className={cn("text-[11px] font-black uppercase tracking-widest", isToday ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-400")}>{format(day, "EEE")}</div>
                        <div className={cn("text-xl font-black mt-0.5", isToday ? "text-white dark:text-zinc-900" : "text-zinc-900 dark:text-zinc-100")}>{format(day, "d")}</div>
                        <div className={cn("text-[10px] font-medium", isToday ? "text-zinc-400 dark:text-zinc-500" : "text-zinc-400")}>{format(day, "MMM")}</div>
                      </div>
                    )
                  })}
                </div>

                {/* Time rows */}
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {HOURS.map(hour => (
                    <div key={hour} className="grid grid-cols-8">
                      {/* Hour label */}
                      <div className="border-r border-zinc-200 dark:border-zinc-800 flex items-center justify-end pr-4 text-[12px] font-black text-zinc-400 bg-zinc-50 dark:bg-zinc-900/40 min-h-[88px]">
                        {hour}:00
                      </div>

                      {/* Day cells */}
                      {WEEK.map((day, di) => {
                        const timeStr = `${String(hour).padStart(2, "0")}:00`
                        const dayAppts = filtered.filter(a => isSameDay(new Date(a.date), day) && a.time === timeStr)
                        const isToday  = isSameDay(day, new Date())
                        return (
                          <div key={di} className={cn(
                            "border-r border-zinc-100 dark:border-zinc-800 p-2 min-h-[88px] group relative transition-colors",
                            isToday ? "bg-zinc-50/60 dark:bg-zinc-800/20" : "hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
                          )}>
                            {dayAppts.map(appt => (
                              <button
                                key={appt.id}
                                onClick={() => setSelectedAppt(appt)}
                                className={cn(
                                  "w-full text-left rounded-xl p-2.5 mb-1.5 border-2 text-xs hover:scale-[1.02] transition-all duration-150 shadow-sm hover:shadow-md",
                                  PRIORITY_STYLES[appt.priority]
                                )}
                              >
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <span className="font-black text-zinc-900 dark:text-zinc-100 truncate text-[11px]">{appt.appointmentType}</span>
                                  <span className={cn("shrink-0 text-[9px] font-black px-1.5 py-0.5 rounded-full", PRIORITY_BADGE[appt.priority])}>
                                    {appt.priority}
                                  </span>
                                </div>
                                <p className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 truncate">{appt.patientName}</p>
                                <p className="text-[10px] font-medium text-zinc-400">{appt.time} · {appt.duration}m</p>
                                <span className={cn("inline-block mt-1 text-[9px] font-black px-1.5 py-0.5 rounded-lg", STATUS_STYLES[appt.status]?.cls)}>
                                  {STATUS_STYLES[appt.status]?.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── APPOINTMENT DETAIL MODAL ── */}
      <Dialog open={!!selectedAppt} onOpenChange={open => !open && setSelectedAppt(null)}>
        <DialogContent className="sm:max-w-[480px] rounded-2xl border-zinc-200 dark:border-zinc-800 p-0 overflow-hidden">
          {selectedAppt && (() => {
            const s = STATUS_STYLES[selectedAppt.status]
            const doctor = DOCTORS.find(d => d.id === selectedAppt.doctorId)
            return (
              <>
                {/* Header band */}
                <div className={cn("px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800", PRIORITY_STYLES[selectedAppt.priority])}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-1">Appointment Details</p>
                      <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100">{selectedAppt.patientName}</h2>
                      <p className="text-[13px] font-semibold text-zinc-500 mt-0.5">{selectedAppt.appointmentType}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={cn("text-[11px] font-black px-2.5 py-1 rounded-lg", s.cls)}>{s.label}</span>
                      <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-full", PRIORITY_BADGE[selectedAppt.priority])}>
                        {selectedAppt.priority}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-5 space-y-5">
                  {/* Info grid */}
                  <div className="grid grid-cols-2 gap-4 text-[13px]">
                    {[
                      { label: "Doctor",   value: doctor?.name || "—" },
                      { label: "Dept",     value: doctor?.department || "—" },
                      { label: "Date",     value: new Date(selectedAppt.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
                      { label: "Time",     value: `${selectedAppt.time} (${selectedAppt.duration}m)` },
                      { label: "Location", value: selectedAppt.location },
                      { label: "Phone",    value: selectedAppt.patientPhone },
                    ].map(r => (
                      <div key={r.label}>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">{r.label}</p>
                        <p className="font-bold text-zinc-900 dark:text-zinc-100">{r.value}</p>
                      </div>
                    ))}
                  </div>

                  {selectedAppt.notes && (
                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Notes</p>
                      <p className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">{selectedAppt.notes}</p>
                    </div>
                  )}

                  {/* Status actions */}
                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Update Status</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedAppt.status !== "confirmed" && (
                        <Button size="sm" onClick={() => setSelectedAppt(null)} className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[12px]">
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Confirm
                        </Button>
                      )}
                      {selectedAppt.status === "confirmed" && (
                        <Button size="sm" onClick={() => setSelectedAppt(null)} className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-[12px]">
                          <Timer className="h-3.5 w-3.5 mr-1" /> Start
                        </Button>
                      )}
                      {selectedAppt.status === "in-progress" && (
                        <Button size="sm" onClick={() => setSelectedAppt(null)} className="rounded-xl bg-zinc-700 hover:bg-zinc-800 text-white font-bold text-[12px]">
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Complete
                        </Button>
                      )}
                      {selectedAppt.status !== "cancelled" && (
                        <Button size="sm" variant="destructive" onClick={() => setSelectedAppt(null)} className="rounded-xl font-bold text-[12px]">
                          <XCircle className="h-3.5 w-3.5 mr-1" /> Cancel
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => setSelectedAppt(null)} className="rounded-xl border-zinc-200 dark:border-zinc-700 font-bold text-[12px]">
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
