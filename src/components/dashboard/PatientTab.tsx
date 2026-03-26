import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  SquaresFour,
  List,
  MagnifyingGlass,
  Plus,
  ArrowSquareOut,
  Export,
  CaretRight,
  CaretLeft,
  Circle,
  FileText,
  Clock,
  User,
  ShieldCheck,
  TrendUp,
  Files,
  GoogleLogo,
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  DribbbleLogo,
  DotsThree,
  ArrowDown,
  Funnel,
  DownloadSimple,
  CaretDown,
  X,
  FunnelSimple,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Check, SlidersHorizontal } from "lucide-react";

interface PatientRecord {
  id: string;
  name: string;
  status: "Follow-up" | "Emergency" | "Checkup" | "Discharged" | "Scheduled";
  appointment: string;
  type: string;
  subject: string;
  lastActivity: string;
  source: "Google" | "Facebook" | "Instagram" | "LinkedIn" | "Dribbble" | "Direct";
  createdAt: string;
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
  {
    id: "P-4392", name: "Jean-Pierre Durand", status: "Follow-up", appointment: "Today, 10:30", type: "Cardiology", subject: "Routine heart checkup", lastActivity: "Sep 12 at 09:10 AM", source: "Dribbble", createdAt: "1 month ago", age: 54, gender: "M", heartRate: 78, temp: 36.8, bp: "128/82", avatarColor: "from-blue-400 to-blue-600", avatar: "https://i.pinimg.com/736x/3f/62/bc/3f62bc68065763b72220779aaa14232e.jpg",
    documents: [
      { id: "DOC-001", name: "Blood Test Results", type: "Lab Result", date: "Mar 10, 2026", size: "1.2 MB" },
      { id: "DOC-002", name: "Cardiac MRI Scan", type: "Scan", date: "Feb 28, 2026", size: "15.4 MB" },
    ]
  },
  {
    id: "P-8821", name: "Marie-Louise Petit", status: "Emergency", appointment: "Today, 11:45", type: "Pediatrics", subject: "Post-surgery observation", lastActivity: "Sep 12 at 10:15 AM", source: "Instagram", createdAt: "2 months ago", age: 8, gender: "F", heartRate: 110, temp: 38.4, bp: "100/65", avatarColor: "from-rose-400 to-rose-600", avatar: "https://i.pinimg.com/1200x/66/94/c8/6694c81d4c094d2b65094287e094d54a.jpg",
    documents: [
      { id: "DOC-003", name: "Vaccination Record", type: "Report", date: "Jan 15, 2026", size: "0.8 MB" },
    ]
  },
  {
    id: "P-1294", name: "Luc Moreau", status: "Checkup", appointment: "Tomorrow, 09:00", type: "General", subject: "Annual physical exam", lastActivity: "Sep 12 at 11:20 AM", source: "Google", createdAt: "3 months ago", age: 34, gender: "M", heartRate: 65, temp: 36.5, bp: "118/76", avatarColor: "from-violet-400 to-violet-600", avatar: "https://i.pinimg.com/1200x/bf/30/fb/bf30fb033dbb732339ff3029556fd62e.jpg",
    documents: [
      { id: "DOC-004", name: "General Checkup Summary", type: "Report", date: "Dec 12, 2025", size: "2.1 MB" },
    ]
  },
  {
    id: "P-7730", name: "Emma Dubois", status: "Discharged", appointment: "Done", type: "Neurology", subject: "Post-migraine follow-up", lastActivity: "Sep 12 at 12:25 PM", source: "Facebook", createdAt: "4 months ago", age: 41, gender: "F", heartRate: 72, temp: 36.7, bp: "122/80", avatarColor: "from-emerald-400 to-emerald-600", avatar: "https://i.pinimg.com/474x/7b/df/c8/7bdfc8165947551dadbcd9ac99513775.jpg",
    documents: [
      { id: "DOC-005", name: "Neurology Exam", type: "Scan", date: "Mar 05, 2026", size: "12.0 MB" },
    ]
  },
  {
    id: "P-3318", name: "Antoine Bernard", status: "Scheduled", appointment: "Mar 16, 14:00", type: "Orthopedics", subject: "Knee injury consultation", lastActivity: "Sep 12 at 01:30 PM", source: "LinkedIn", createdAt: "5 months ago", age: 62, gender: "M", heartRate: 68, temp: 36.6, bp: "135/88", avatarColor: "from-orange-400 to-orange-600", avatar: "https://i.pravatar.cc/100?img=57",
    documents: []
  },
  {
    id: "P-5577", name: "Sophia Leclerc", status: "Follow-up", appointment: "Mar 15, 09:30", type: "Dermatology", subject: "Skin irritation follow-up", lastActivity: "Sep 12 at 02:35 PM", source: "LinkedIn", createdAt: "6 months ago", age: 29, gender: "F", heartRate: 70, temp: 36.4, bp: "112/72", avatarColor: "from-pink-400 to-pink-600", avatar: "https://i.pravatar.cc/100?img=41",
    documents: []
  },
  {
    id: "P-6612", name: "Hugo Fontaine", status: "Checkup", appointment: "Mar 17, 10:00", type: "Cardiology", subject: "Blood pressure monitor", lastActivity: "Sep 12 at 03:40 PM", source: "Google", createdAt: "7 months ago", age: 47, gender: "M", heartRate: 74, temp: 36.9, bp: "130/84", avatarColor: "from-cyan-400 to-cyan-600", avatar: "https://i.pravatar.cc/100?img=12",
    documents: []
  },
  {
    id: "P-9901", name: "Camille Rousseau", status: "Scheduled", appointment: "Mar 18, 08:30", type: "Pediatrics", subject: "Childhood vaccination", lastActivity: "Sep 12 at 04:45 PM", source: "Instagram", createdAt: "8 months ago", age: 6, gender: "F", heartRate: 95, temp: 37.0, bp: "95/60", avatarColor: "from-amber-400 to-amber-600", avatar: "https://i.pravatar.cc/100?img=36",
    documents: []
  },
  {
    id: "P-9901", name: "Camille Rousseau", status: "Scheduled", appointment: "Mar 18, 08:30", type: "Pediatrics", subject: "Childhood vaccination", lastActivity: "Sep 12 at 04:45 PM", source: "Instagram", createdAt: "8 months ago", age: 6, gender: "F", heartRate: 95, temp: 37.0, bp: "95/60", avatarColor: "from-amber-400 to-amber-600", avatar: "https://i.pravatar.cc/100?img=36",
    documents: []
  },
  {
    id: "P-9901", name: "Ankara Messi", status: "Scheduled", appointment: "Mar 18, 08:30", type: "Pediatrics", subject: "Childhood vaccination", lastActivity: "Sep 12 at 04:45 PM", source: "Instagram", createdAt: "8 months ago", age: 6, gender: "F", heartRate: 95, temp: 37.0, bp: "95/60", avatarColor: "from-amber-400 to-amber-600", avatar: "https://i.pravatar.cc/100?img=36",
    documents: []
  },
];

const FILTERS = ["All", "Emergency", "Follow-up", "Checkup", "Scheduled", "Discharged"];

function initials(name: string) {
  return name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
}

function PatientGrid({ patients, onOpen }: { patients: PatientRecord[]; onOpen: (p: PatientRecord) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
      {patients.map((p, i) => {
        const cfg = STATUS_CONFIG[p.status];
        const SourceIcon = {
          Google: GoogleLogo,
          Facebook: FacebookLogo,
          Instagram: InstagramLogo,
          LinkedIn: LinkedinLogo,
          Dribbble: DribbbleLogo,
          Direct: User
        }[p.source] || User;

        return (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => onOpen(p)}
            className="group relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="relative w-12 h-12">
                <img
                  src={p.avatar}
                  alt={p.name}
                  className="w-full h-full rounded-2xl object-cover ring-2 ring-zinc-50 dark:ring-zinc-800"
                />
              </div>
              <div className={cn(
                "w-8 h-8 flex items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-800 transition-colors group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-zinc-100 dark:group-hover:text-zinc-900",
                p.source === 'Google' ? 'text-blue-500' :
                  p.source === 'Facebook' ? 'text-blue-600' :
                    p.source === 'Instagram' ? 'text-pink-500' :
                      p.source === 'LinkedIn' ? 'text-blue-700' :
                        p.source === 'Dribbble' ? 'text-pink-600' : 'text-zinc-400'
              )}>
                <SourceIcon weight="fill" className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-[15px] font-medium text-zinc-900 dark:text-zinc-100 truncate">{p.name}</h3>
              <p className="text-[13px] text-zinc-400 truncate">{p.subject}</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium",
                cfg.color
              )}>
                {p.status}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400">
                <Clock className="w-3.5 h-3.5" /> {p.createdAt}
              </span>
            </div>

            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <DotsThree size={20} className="text-zinc-400" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function PatientTable({ patients, onOpen }: { patients: PatientRecord[]; onOpen: (p: PatientRecord) => void }) {
  return (
    <div className="w-full overflow-hidden">
      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800">
              <th className="px-4 py-4 w-10">
                <div className="w-4 h-4 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex items-center justify-center cursor-pointer">
                  {/* Master Checkbox */}
                </div>
              </th>
              <th className="px-4 py-4 text-[12px] font-medium text-zinc-400 whitespace-nowrap">
                <div className="flex items-center gap-1 cursor-pointer hover:text-zinc-600 transition-colors">
                  Leads <ArrowDown className="w-3 h-3" />
                </div>
              </th>
              <th className="px-4 py-4 text-[12px] font-medium text-zinc-400 whitespace-nowrap">
                <div className="flex items-center gap-1 cursor-pointer hover:text-zinc-600 transition-colors">
                  Subject <ArrowDown className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                </div>
              </th>
              <th className="px-4 py-4 text-[12px] font-medium text-zinc-400 whitespace-nowrap">
                <div className="flex items-center gap-1 cursor-pointer hover:text-zinc-600 transition-colors">
                  Activities <ArrowDown className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                </div>
              </th>
              <th className="px-4 py-4 text-[12px] font-medium text-zinc-400 whitespace-nowrap">
                <div className="flex items-center gap-1 cursor-pointer hover:text-zinc-600 transition-colors">
                  Status <ArrowDown className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                </div>
              </th>
              <th className="px-4 py-4 text-[12px] font-medium text-zinc-400 whitespace-nowrap">
                <div className="flex items-center gap-1 cursor-pointer hover:text-zinc-600 transition-colors">
                  Created <ArrowDown className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                </div>
              </th>
              <th className="px-4 py-4 text-[12px] font-medium text-zinc-400 whitespace-nowrap">
                <div className="flex items-center gap-1 cursor-pointer hover:text-zinc-600 transition-colors">
                  Sources <ArrowDown className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
            {patients.map((p, i) => {
              const cfg = STATUS_CONFIG[p.status];
              const SourceIcon = {
                Google: GoogleLogo,
                Facebook: FacebookLogo,
                Instagram: InstagramLogo,
                LinkedIn: LinkedinLogo,
                Dribbble: DribbbleLogo,
                Direct: User
              }[p.source] || User;

              return (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer"
                  onClick={() => onOpen(p)}
                >
                  <td className="px-4 py-4">
                    <div className="w-4 h-4 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex items-center justify-center cursor-pointer group-hover:border-zinc-300 transition-colors" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 shrink-0">
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="w-full h-full rounded-full object-cover ring-1 ring-zinc-50 dark:ring-zinc-800"
                        />
                      </div>
                      <span className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100 truncate">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[13px] text-zinc-500 whitespace-nowrap">{p.subject}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Clock weight="light" className="w-4 h-4" />
                      <span className="text-[13px] whitespace-nowrap">{p.lastActivity}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium",
                      cfg.color
                    )}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Clock weight="light" className="w-4 h-4" />
                      <span className="text-[13px] whitespace-nowrap">{p.createdAt}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-5 h-5 flex items-center justify-center transition-colors",
                        p.source === 'Google' ? 'text-blue-500' :
                          p.source === 'Facebook' ? 'text-blue-600' :
                            p.source === 'Instagram' ? 'text-pink-500' :
                              p.source === 'LinkedIn' ? 'text-blue-700' :
                                p.source === 'Dribbble' ? 'text-pink-600' : 'text-zinc-400'
                      )}>
                        <SourceIcon weight="fill" className="w-4 h-4" />
                      </div>
                      <span className="text-[13px] text-zinc-500">{p.source}</span>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Renamed the export to match implementation
export function PatientTab() {
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>("All");
  const [itemsPerPageOpen, setItemsPerPageOpen] = useState(false);

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

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeFilter, selectedSpecialties, selectedGender, itemsPerPage]);

  const allSpecialties = Array.from(new Set(patients.map(p => p.type)));

  return (
    <div className="pb-10 min-h-[600px] flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <div className="relative w-64 ">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-[14px] text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-none transition shadow-sm"
            />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!selectedPatient ? (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* Toolbar */}
            <div className="flex items-center justify-between flex-wrap gap-4 px-2">
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all",
                    viewMode === "list"
                      ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  )}
                >
                  <List size={18} /> List
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all",
                    viewMode === "grid"
                      ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  )}
                >
                  <SquaresFour size={18} /> Grid
                </button>
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-md border border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-[13px] font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition shadow-sm",
                      (activeFilter !== "All" || selectedGender !== "All" || selectedSpecialties.length > 0) && "bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700"
                    )}>
                      <SlidersHorizontal size={18} /> Filter
                      {(activeFilter !== "All" || selectedGender !== "All" || selectedSpecialties.length > 0) && (
                        <span className="flex h-2 w-2 rounded-full bg-blue-500" />
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-2 bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center justify-between px-2 py-1.5 mb-1">
                      <span className="text-[12px] font-bold text-zinc-400 uppercase tracking-wider">Filters</span>
                      {(activeFilter !== "All" || selectedGender !== "All" || selectedSpecialties.length > 0) && (
                        <button
                          onClick={() => {
                            setActiveFilter("All");
                            setSelectedGender("All");
                            setSelectedSpecialties([]);
                          }}
                          className="text-[11px] font-medium text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    <DropdownMenuSeparator />

                    <DropdownMenuLabel className="text-[11px] font-medium text-zinc-400">Status</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={activeFilter} onValueChange={setActiveFilter}>
                      {FILTERS.map(f => (
                        <DropdownMenuRadioItem key={f} value={f} className="text-[13px]">
                          {f}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuLabel className="text-[11px] font-medium text-zinc-400">Gender</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={selectedGender} onValueChange={setSelectedGender}>
                      <DropdownMenuRadioItem value="All" className="text-[13px]">All Genders</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="M" className="text-[13px]">Male</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="F" className="text-[13px]">Female</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuLabel className="text-[11px] font-medium text-zinc-400">Specialty</DropdownMenuLabel>
                    <div className="max-h-[200px] overflow-y-auto scrollbar-none">
                      {allSpecialties.map(s => (
                        <DropdownMenuCheckboxItem
                          key={s}
                          checked={selectedSpecialties.includes(s)}
                          onCheckedChange={(checked) => {
                            if (checked) setSelectedSpecialties([...selectedSpecialties, s]);
                            else setSelectedSpecialties(selectedSpecialties.filter(item => item !== s));
                          }}
                          className="text-[13px]"
                        >
                          {s}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                <button className="flex items-center gap-2 px-4 py-2 rounded-md border border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-[13px] font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition shadow-sm">
                  <Export size={18} /> Export
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[13px] font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition shadow-md">
                  <Plus size={18} weight="bold" /> Add New Patient
                </button>
              </div>
            </div>

            {/* Content Area */}
            {paginatedItems.length === 0 ? (
              <div className="py-20 flex flex-col items-center gap-3 text-zinc-400">
                <Files weight="light" className="w-10 h-10 opacity-30" />
                <span className="text-sm font-medium">No patients match your search</span>
              </div>
            ) : viewMode === "list" ? (
              <div className="bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                <PatientTable patients={paginatedItems} onOpen={setSelectedPatient} />
              </div>
            ) : (
              <PatientGrid patients={paginatedItems} onOpen={setSelectedPatient} />
            )}

            {/* Pagination — Footer */}
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-800 px-2">
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-zinc-400">Show</span>
                <div className="relative">
                  <button
                    onClick={() => setItemsPerPageOpen(!itemsPerPageOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[13px] font-medium transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-sm"
                  >
                    {itemsPerPage} <CaretDown size={14} className={cn("text-zinc-400 transition-transform", itemsPerPageOpen && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {itemsPerPageOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setItemsPerPageOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute bottom-full left-0 mb-2 w-20 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden"
                        >
                          {[8, 12, 16, 24, 50].map(n => (
                            <button
                              key={n}
                              onClick={() => {
                                setItemsPerPage(n);
                                setItemsPerPageOpen(false);
                              }}
                              className={cn(
                                "w-full px-3 py-2 text-left text-[13px] transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800",
                                itemsPerPage === n ? "text-zinc-900 dark:text-zinc-100 font-bold bg-zinc-50/50 dark:bg-zinc-800/50" : "text-zinc-500"
                              )}
                            >
                              {n}
                            </button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
                <span className="text-[13px] text-zinc-400">Patients per page</span>
              </div>

              <div className="flex items-center gap-1 text-zinc-400">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <CaretLeft size={16} />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={cn(
                      "w-8 h-8 rounded-lg text-[13px] font-medium transition-all",
                      currentPage === i + 1
                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <CaretRight size={16} />
                </button>
              </div>
            </div>
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
                      className="flex items-center gap-2 text-[13px] font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
                    >
                      <ArrowSquareOut className="w-4 h-4" />
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
                        />
                      </div>
                      <h2 className="text-[24px] font-black text-zinc-900 dark:text-zinc-100 leading-tight">{p.name}</h2>
                      <p className="text-[13px] font-mono text-zinc-400 mt-1 uppercase tracking-tighter">{p.id}</p>

                      <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                        <span className={cn("inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black border", cfg.color, cfg.border)}>
                          <Circle size={8} weight="fill" />
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
                            { label: "Heart Rate", value: `${p.heartRate}`, unit: "bpm", icon: TrendUp, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/10" },
                            { label: "Temperature", value: `${p.temp}°`, unit: "Celsius", icon: TrendUp, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/10" },
                            { label: "Blood Pressure", value: p.bp, unit: "mmHg", icon: ShieldCheck, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/10" },
                          ].map(v => {
                            const Icon = v.icon;
                            return (
                              <div key={v.label} className={cn("rounded-3xl p-5 flex flex-col items-center gap-2 border border-transparent transition-all hover:border-zinc-100 dark:hover:border-zinc-800", v.bg)}>
                                <Icon weight="light" className={cn("w-6 h-6", v.color)} />
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
                              <SquaresFour weight="light" className="w-6 h-6 text-blue-500" />
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
                          <h4 className="text-[11px] font-medium text-zinc-400 uppercase tracking-[0.2em]">Documents & Reports</h4>
                          <button className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition">
                            <TrendUp className="w-3.5 h-3.5" /> Upload New
                          </button>
                        </div>

                        {p.documents.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {p.documents.map(doc => (
                              <div key={doc.id} className="group/doc flex items-center gap-3 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all">
                                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 group-hover/doc:bg-white dark:group-hover/doc:bg-zinc-900 transition-colors">
                                  {doc.type === 'Scan' ? (
                                    <Files weight="light" className="w-5 h-5 text-violet-500" />
                                  ) : (
                                    <FileText weight="light" className="w-5 h-5 text-blue-500" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100 truncate">{doc.name}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] font-medium text-zinc-400">{doc.type}</span>
                                    <span className="w-1 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                                    <span className="text-[10px] font-medium text-zinc-400">{doc.size}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover/doc:opacity-100 transition-opacity">
                                  <button title="View Document" className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition text-zinc-500 dark:text-zinc-400">
                                    <ArrowSquareOut className="w-4 h-4" />
                                  </button>
                                  <button title="Download" className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition text-zinc-500 dark:text-zinc-400">
                                    <DownloadSimple className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-8 px-4 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-3xl bg-zinc-50/50 dark:bg-zinc-800/20">
                            <FileText size={32} weight="light" className="text-zinc-300 mb-2" />
                            <p className="text-[12px] font-medium text-zinc-400">No documents found for this patient</p>
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
