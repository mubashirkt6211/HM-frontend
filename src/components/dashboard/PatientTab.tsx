/**
 * Patient Tab - Manage patient records
 */
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Stethoscope,
  ArrowUpRight,
  Search,
  Heart,
  Activity,
  Thermometer,
  Clock,
  Plus,
  Filter,
  X,
  CalendarDays,
  FileText,
  File,
  Download,
  Eye,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PatientRecord {
  id: string;
  name: string;
  status: "Follow-up" | "Emergency" | "Checkup" | "Discharged" | "Scheduled";
  appointment: string;
  type: string;
  age: number;
  gender: "M" | "F";
  heartRate: number;
  temp: number;
  bp: string;
  avatarColor: string;
  avatar: string;
  documents: {
    id: string;
    name: string;
    type: "Report" | "Scan" | "Prescription" | "Lab Result";
    date: string;
    size: string;
  }[];
}

const STATUS_CONFIG = {
  Emergency: { color: "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400", dot: "bg-rose-500", border: "border-rose-200 dark:border-rose-800" },
  "Follow-up": { color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400", dot: "bg-blue-500", border: "border-blue-200 dark:border-blue-800" },
  Checkup: { color: "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400", dot: "bg-violet-500", border: "border-violet-200 dark:border-violet-800" },
  Discharged: { color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500", border: "border-emerald-200 dark:border-emerald-800" },
  Scheduled: { color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400", dot: "bg-orange-500", border: "border-orange-200 dark:border-orange-800" },
};

const patients: PatientRecord[] = [
  { id: "P-4392", name: "Jean-Pierre Durand", status: "Follow-up", appointment: "Today, 10:30", type: "Cardiology", age: 54, gender: "M", heartRate: 78, temp: 36.8, bp: "128/82", avatarColor: "from-blue-400 to-blue-600",    avatar: "https://i.pinimg.com/736x/3f/62/bc/3f62bc68065763b72220779aaa14232e.jpg",
    documents: [
      { id: "DOC-001", name: "Blood Test Results", type: "Lab Result", date: "Mar 10, 2026", size: "1.2 MB" },
      { id: "DOC-002", name: "Cardiac MRI Scan", type: "Scan", date: "Feb 28, 2026", size: "15.4 MB" },
    ]
  },
  { id: "P-8821", name: "Marie-Louise Petit", status: "Emergency", appointment: "Today, 11:45", type: "Pediatrics", age: 8, gender: "F", heartRate: 110, temp: 38.4, bp: "100/65", avatarColor: "from-rose-400 to-rose-600", avatar: "https://i.pinimg.com/1200x/66/94/c8/6694c81d4c094d2b65094287e094d54a.jpg",
    documents: [
      { id: "DOC-003", name: "Vaccination Record", type: "Report", date: "Jan 15, 2026", size: "0.8 MB" },
    ]
  },
  { id: "P-1294", name: "Luc Moreau", status: "Checkup", appointment: "Tomorrow, 09:00", type: "General", age: 34, gender: "M", heartRate: 65, temp: 36.5, bp: "118/76", avatarColor: "from-violet-400 to-violet-600", avatar: "https://i.pinimg.com/1200x/bf/30/fb/bf30fb033dbb732339ff3029556fd62e.jpg",
    documents: [
      { id: "DOC-004", name: "General Checkup Summary", type: "Report", date: "Dec 12, 2025", size: "2.1 MB" },
    ]
  },
  { id: "P-7730", name: "Emma Dubois", status: "Discharged", appointment: "Done", type: "Neurology", age: 41, gender: "F", heartRate: 72, temp: 36.7, bp: "122/80", avatarColor: "from-emerald-400 to-emerald-600", avatar: "https://i.pinimg.com/474x/7b/df/c8/7bdfc8165947551dadbcd9ac99513775.jpg",
    documents: [
      { id: "DOC-005", name: "Neurology Exam", type: "Scan", date: "Mar 05, 2026", size: "12.0 MB" },
    ]
  },
  { id: "P-3318", name: "Antoine Bernard", status: "Scheduled", appointment: "Mar 16, 14:00", type: "Orthopedics", age: 62, gender: "M", heartRate: 68, temp: 36.6, bp: "135/88", avatarColor: "from-orange-400 to-orange-600", avatar: "https://i.pravatar.cc/100?img=57",
    documents: []
  },
  { id: "P-5577", name: "Sophia Leclerc", status: "Follow-up", appointment: "Mar 15, 09:30", type: "Dermatology", age: 29, gender: "F", heartRate: 70, temp: 36.4, bp: "112/72", avatarColor: "from-pink-400 to-pink-600", avatar: "https://i.pravatar.cc/100?img=41",
    documents: []
  },
  { id: "P-6612", name: "Hugo Fontaine", status: "Checkup", appointment: "Mar 17, 10:00", type: "Cardiology", age: 47, gender: "M", heartRate: 74, temp: 36.9, bp: "130/84", avatarColor: "from-cyan-400 to-cyan-600", avatar: "https://i.pravatar.cc/100?img=12",
    documents: []
  },
  { id: "P-9901", name: "Camille Rousseau", status: "Scheduled", appointment: "Mar 18, 08:30", type: "Pediatrics", age: 6, gender: "F", heartRate: 95, temp: 37.0, bp: "95/60", avatarColor: "from-amber-400 to-amber-600", avatar: "https://i.pravatar.cc/100?img=36",
    documents: []
  },
];

const FILTERS = ["All", "Emergency", "Follow-up", "Checkup", "Scheduled", "Discharged"];

function initials(name: string) {
  return name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
}

function PatientCard({ patient, index, onOpen }: { patient: PatientRecord; index: number; onOpen: (p: PatientRecord) => void }) {
  const cfg = STATUS_CONFIG[patient.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
    >
      {/* Card top: photo + status */}
      <div className="relative p-3 pb-2 flex flex-col items-center text-center">
        {/* Status badge top-right */}
        <span className={cn(
          "absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black border",
          cfg.color, cfg.border
        )}>
          <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
          {patient.status}
        </span>

        {/* Avatar */}
        <div className="relative w-12 h-12 mb-2">
          <img
            src={patient.avatar}
            alt={patient.name}
            className="w-12 h-12 rounded-xl object-cover ring-2 ring-zinc-100 dark:ring-zinc-800"
            onError={e => {
              const t = e.currentTarget;
              t.style.display = "none";
              const fb = t.nextElementSibling as HTMLElement;
              if (fb) fb.style.display = "flex";
            }}
          />
          <div
            style={{ display: "none" }}
            className={cn(
              "absolute inset-0 w-12 h-12 rounded-xl bg-gradient-to-br items-center justify-center font-black text-white text-base",
              patient.avatarColor
            )}
          >
            {initials(patient.name)}
          </div>
        </div>

        {/* Name + meta */}
        <h4 className="font-black text-zinc-900 dark:text-zinc-100 text-[13px] leading-tight">{patient.name}</h4>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px] text-zinc-400 font-medium">{patient.type}</span>
          <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          <span className="text-[10px] text-zinc-400">{patient.gender}, {patient.age}y</span>
        </div>
        <span className="text-[9px] font-bold text-zinc-400 mt-0.5 font-mono">{patient.id}</span>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-zinc-100 dark:border-zinc-800" />

      {/* Appointment */}
      <div className="px-3 py-2 flex items-center gap-1.5">
        <Clock className="w-3 h-3 text-zinc-400 shrink-0" />
        <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 truncate">{patient.appointment}</span>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-zinc-100 dark:border-zinc-800" />

      {/* Vitals row */}
      <div className="grid grid-cols-3 divide-x divide-zinc-100 dark:divide-zinc-800">
        <div className="flex flex-col items-center py-2 gap-0.5">
          <Heart className="w-3 h-3 text-rose-400" />
          <span className="text-[12px] font-black text-zinc-900 dark:text-zinc-100">{patient.heartRate}</span>
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wide">BPM</span>
        </div>
        <div className="flex flex-col items-center py-2 gap-0.5">
          <Thermometer className="w-3 h-3 text-orange-400" />
          <span className="text-[12px] font-black text-zinc-900 dark:text-zinc-100">{patient.temp}°</span>
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wide">Temp</span>
        </div>
        <div className="flex flex-col items-center py-2 gap-0.5">
          <Activity className="w-3 h-3 text-blue-400" />
          <span className="text-[12px] font-black text-zinc-900 dark:text-zinc-100 leading-none">{patient.bp}</span>
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wide">BP</span>
        </div>
      </div>

      {/* Open Profile Button */}
      <div className="p-2">
        <button
          onClick={() => onOpen(patient)}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-900 dark:hover:bg-zinc-100 hover:text-white dark:hover:text-zinc-900 text-zinc-500 dark:text-zinc-400 text-[11px] font-black transition-all group-hover:bg-zinc-900 group-hover:dark:bg-zinc-100 group-hover:text-white group-hover:dark:text-zinc-900"
        >
          Open Profile <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}

export function PatientTab() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>("All");
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);

  const allSpecialties = Array.from(new Set(patients.map(p => p.type)));

  const toggleSpecialty = (s: string) =>
    setSelectedSpecialties(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );

  const activeFilterCount =
    (selectedSpecialties.length > 0 ? 1 : 0) +
    (selectedGender !== "All" ? 1 : 0);

  const filtered = patients.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.type.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = activeFilter === "All" || p.status === activeFilter;
    const matchesSpecialty = selectedSpecialties.length === 0 || selectedSpecialties.includes(p.type);
    const matchesGender = selectedGender === "All" || p.gender === selectedGender;
    return matchesSearch && matchesStatus && matchesSpecialty && matchesGender;
  });

  return (
    <div className="pb-10 min-h-[600px]">
      <AnimatePresence mode="wait">
        {!selectedPatient ? (
          <motion.div
            key="grid-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            {/* Toolbar */}
            <div className="flex flex-col gap-3">
              {/* Row 1: Search left, Add + Filter right */}
              <div className="flex items-center justify-end gap-2">
                {/* Search */}
                <div className="relative w-56">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search patients…"
                    className="w-full pl-8 pr-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[12px] text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400/30 focus:border-zinc-400 transition shadow-sm"
                  />
                </div>

                {/* Filter button + dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setFilterOpen(o => !o)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[12px] font-bold transition shadow-sm",
                      filterOpen || activeFilterCount > 0
                        ? "bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100 text-white dark:text-zinc-900"
                        : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    )}
                  >
                    <Filter className="w-3.5 h-3.5" />
                    Filter
                    {activeFilterCount > 0 && (
                      <span className="ml-0.5 w-4 h-4 rounded-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-[10px] font-black flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown panel */}
                  {filterOpen && (
                    <div className="absolute right-0 top-full mt-2 z-50 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-4 flex flex-col gap-4">

                      {/* Specialty */}
                      <div>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Specialty</p>
                        <div className="flex flex-wrap gap-1.5">
                          {allSpecialties.map(s => (
                            <button
                              key={s}
                              onClick={() => toggleSpecialty(s)}
                              className={cn(
                                "px-2.5 py-1 rounded-full text-[11px] font-bold transition-all",
                                selectedSpecialties.includes(s)
                                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                              )}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Gender */}
                      <div>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Gender</p>
                        <div className="flex gap-1.5">
                          {["All", "M", "F"].map(g => (
                            <button
                              key={g}
                              onClick={() => setSelectedGender(g)}
                              className={cn(
                                "px-3 py-1 rounded-full text-[11px] font-bold transition-all",
                                selectedGender === g
                                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                              )}
                            >
                              {g === "M" ? "Male" : g === "F" ? "Female" : "All"}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Clear */}
                      {activeFilterCount > 0 && (
                        <button
                          onClick={() => { setSelectedSpecialties([]); setSelectedGender("All"); }}
                          className="text-[11px] font-black text-rose-500 hover:text-rose-600 transition text-left"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Add — black */}
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-700 dark:hover:bg-zinc-300 text-white dark:text-zinc-900 text-[12px] font-bold transition shadow-sm">
                  <Plus className="w-3.5 h-3.5" /> New Patient
                </button>
              </div>

              {/* Row 2: Status filter pills */}
              <div className="flex items-center justify-end gap-2 flex-wrap w-full">
                {FILTERS.map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={cn(
                      "px-3 py-1 rounded-full text-[11px] font-black transition-all",
                      activeFilter === f
                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                    )}
                  >
                    {f}
                    {f !== "All" && (
                      <span className="ml-1 opacity-50">
                        {patients.filter(p => p.status === f).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Patient Grid — 4 columns */}
            {filtered.length === 0 ? (
              <div className="py-20 flex flex-col items-center gap-3 text-zinc-400">
                <Stethoscope className="w-10 h-10 opacity-30" />
                <span className="text-sm font-medium">No patients match your search</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((patient, i) => (
                  <PatientCard key={patient.id} patient={patient} index={i} onOpen={setSelectedPatient} />
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="profile-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm"
          >
            {(() => {
              const p = selectedPatient;
              const cfg = STATUS_CONFIG[p.status];
              return (
                <div className="flex flex-col">
                  {/* Header / Back Button */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
                    <button
                      onClick={() => setSelectedPatient(null)}
                      className="flex items-center gap-2 text-[13px] font-black text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
                    >
                      <X className="w-4 h-4 transition-transform hover:rotate-90" />
                      Back to Patients
                    </button>
                    <div className="flex items-center gap-2">
                      <button className="px-4 py-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[12px] font-black hover:bg-zinc-700 dark:hover:bg-zinc-300 transition">
                        Edit Record
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    {/* Left Side: Avatar & Basic Info */}
                    <div className="lg:col-span-4 border-r border-zinc-100 dark:border-zinc-800 p-8 flex flex-col items-center text-center">
                      <div className="relative w-32 h-32 mb-5">
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="w-32 h-32 rounded-3xl object-cover ring-4 ring-zinc-50 dark:ring-zinc-800 shadow-xl"
                          onError={e => {
                            const t = e.currentTarget;
                            t.style.display = "none";
                            const fb = t.nextElementSibling as HTMLElement;
                            if (fb) fb.style.display = "flex";
                          }}
                        />
                        <div
                          style={{ display: "none" }}
                          className={cn("absolute inset-0 w-32 h-32 rounded-3xl bg-gradient-to-br items-center justify-center font-black text-white text-3xl", p.avatarColor)}
                        >
                          {initials(p.name)}
                        </div>
                      </div>
                      <h2 className="text-[24px] font-black text-zinc-900 dark:text-zinc-100 leading-tight">{p.name}</h2>
                      <p className="text-[13px] font-mono text-zinc-400 mt-1 uppercase tracking-tighter">{p.id}</p>
                      
                      <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                        <span className={cn("inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black border", cfg.color, cfg.border)}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
                          {p.status}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[11px] font-bold">
                          {p.type}
                        </span>
                      </div>

                      {/* Summary stats below avatar */}
                      <div className="grid grid-cols-2 gap-4 w-full mt-8">
                        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4">
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Gender</p>
                          <p className="text-[15px] font-black text-zinc-900 dark:text-zinc-100">{p.gender === 'M' ? 'Male' : 'Female'}</p>
                        </div>
                        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4">
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Age</p>
                          <p className="text-[15px] font-black text-zinc-900 dark:text-zinc-100">{p.age} Yrs</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Details & Vitals */}
                    <div className="lg:col-span-8 p-8 space-y-8">
                      {/* Vitals Section */}
                      <div>
                        <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">Current Vitals</h4>
                        <div className="grid grid-cols-3 gap-6">
                        {[
                          { label: "Heart Rate", value: `${p.heartRate}`, unit: "bpm", icon: Heart, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/10" },
                          { label: "Temperature", value: `${p.temp}°`, unit: "Celsius", icon: Thermometer, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/10" },
                          { label: "Blood Pressure", value: p.bp, unit: "mmHg", icon: Activity, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/10" },
                        ].map(v => {
                          const Icon = v.icon;
                          return (
                            <div key={v.label} className={cn("rounded-3xl p-5 flex flex-col items-center gap-2 border border-transparent transition-all hover:border-zinc-100 dark:hover:border-zinc-800", v.bg)}>
                              <Icon className={cn("w-6 h-6", v.color)} />
                              <div className="text-center">
                                <p className="text-[20px] font-black text-zinc-900 dark:text-zinc-100 leading-none">{v.value}</p>
                                <p className="text-[10px] font-bold text-zinc-400 mt-1">{v.unit}</p>
                              </div>
                            </div>
                          );
                        })}
                        </div>
                      </div>

                      {/* Appointment & History */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">Upcoming Visit</h4>
                          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-3xl p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 flex items-center justify-center shadow-sm">
                              <CalendarDays className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-[15px] font-black text-blue-900 dark:text-blue-100">{p.appointment}</p>
                                <p className="text-[11px] font-bold text-blue-400">{p.type} Consultation</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">Clinical Notes</h4>
                          <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl p-6 min-h-[100px]">
                            <p className="text-[13px] text-zinc-400 italic leading-relaxed">
                              Patient reported slight fatigue during morning hours. Prescribed routine checkup and blood work for further analysis.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Documents Section */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Documents & Reports</h4>
                          <button className="flex items-center gap-1.5 text-[11px] font-black text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition">
                            <Upload className="w-3.5 h-3.5" /> Upload New
                          </button>
                        </div>
                        
                        {p.documents.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {p.documents.map(doc => (
                              <div key={doc.id} className="group/doc flex items-center gap-3 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all">
                                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 group-hover/doc:bg-white dark:group-hover/doc:bg-zinc-900 transition-colors">
                                  {doc.type === 'Scan' ? (
                                    <File className="w-5 h-5 text-violet-500" />
                                  ) : (
                                    <FileText className="w-5 h-5 text-blue-500" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[13px] font-black text-zinc-900 dark:text-zinc-100 truncate">{doc.name}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] font-bold text-zinc-400">{doc.type}</span>
                                    <span className="w-1 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                                    <span className="text-[10px] font-medium text-zinc-400">{doc.size}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover/doc:opacity-100 transition-opacity">
                                  <button title="View Document" className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition text-zinc-500 dark:text-zinc-400">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button title="Download" className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition text-zinc-500 dark:text-zinc-400">
                                    <Download className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-8 px-4 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-3xl bg-zinc-50/50 dark:bg-zinc-800/20">
                            <FileText className="w-8 h-8 text-zinc-300 mb-2" />
                            <p className="text-[12px] font-bold text-zinc-400">No documents found for this patient</p>
                          </div>
                        )}
                      </div>

                      {/* Action Bar */}
                      <div className="pt-4 flex items-center justify-end gap-3">
                         <button className="px-6 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-[13px] font-black hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">
                            Schedule Next Visit
                         </button>
                         <button className="px-8 py-3 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[13px] font-black hover:bg-zinc-700 dark:hover:bg-zinc-300 transition shadow-lg shadow-zinc-200 dark:shadow-none">
                            Generate Report
                         </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
