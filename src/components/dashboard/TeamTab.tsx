/**
 * Team Tab - View and manage team members
 */
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  Plus,
  Stethoscope,
  HeartPulse,
  Users2,
  ChevronRight,
  Star,
  PhoneCallIcon,
  CalendarCheck2,
  MessageCircleDashed,
  MessageCircle,
  Calendar1,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Doctor {
  name: string;
  role: string;
  img: string;
  rating: string;
  reviews: string;
  dist: string;
  status: string;
  type: "Doctor" | "Nurse" | "Staff";
}

export function TeamTab() {
  const [filter, setFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState<"All" | "Doctor" | "Nurse" | "Staff">("All");
  const [activeView, setActiveView] = useState<"grid" | "placeholder_calendar" | "placeholder_add">("grid");
  const [addMemberType, setAddMemberType] = useState<"Doctor" | "Nurse" | "Staff" | "">("");

  const doctors: Doctor[] = [
    {
      name: "Dr. Peter Griffin",
      role: "Primary care doctor",
      img: "https://i.pinimg.com/736x/b4/1f/24/b41f248ea356a219e23847075cfccb46.jpg",
      rating: "4.85",
      reviews: "255",
      dist: "16.8km",
      status: "Present",
      type: "Doctor",
    },
    {
      name: "Dr. Sophie Dubreuil",
      role: "Cardiologist",
      img: "https://i.pinimg.com/736x/7c/c8/36/7cc8365ff96cd8f7df7222a1533f7013.jpg",
      rating: "4.92",
      reviews: "128",
      dist: "12.4km",
      status: "Present",
      type: "Doctor",
    },
    {
      name: "Dr. Marc Aubert",
      role: "Dermatologist",
      img: "https://i.pinimg.com/736x/d4/3e/40/d43e40f2623b9d3b72404a076f72d87a.jpg",
      rating: "4.70",
      reviews: "94",
      dist: "5.2km",
      status: "Leave",
      type: "Doctor",
    },
    {
      name: "Dr. Léonard Dubois",
      role: "Neurologist",
      img: "https://i.pinimg.com/1200x/97/ff/27/97ff275080abc0f08aade3026ab3dee2.jpg",
      rating: "4.98",
      reviews: "312",
      dist: "8.1km",
      status: "OP",
      type: "Doctor",
    },
    {
      name: "Dr. Léonard Junior",
      role: "Neurologist",
      img: "https://i.pinimg.com/736x/ff/07/64/ff07643efddfd768f66017b4e87ca785.jpg",
      rating: "4.98",
      reviews: "312",
      dist: "8.5km",
      status: "Leave",
      type: "Doctor",
    },
    {
      name: "Dr. Léonard Dubois",
      role: "Neurologist",
      img: "https://i.pinimg.com/1200x/e8/52/72/e852726f2346ce95973a91143816bd7b.jpg",
      rating: "4.98",
      reviews: "312",
      dist: "8.1km",
      status: "Present",
      type: "Doctor",
    },
    {
      name: "Sarah Mitchell",
      role: "Registered Nurse",
      img: "https://i.pinimg.com/736x/8f/a9/75/8fa975ef07e8b5f2f7f3b5c5b8e7f8c9.jpg",
      rating: "4.75",
      reviews: "186",
      dist: "7.3km",
      status: "Present",
      type: "Nurse",
    },
    {
      name: "Emma Johnson",
      role: "Nursing Assistant",
      img: "https://i.pinimg.com/1200x/0b/36/f8/0b36f83f83bee29f5d9089c6caffa996.jpg",
      rating: "4.65",
      reviews: "142",
      dist: "6.5km",
      status: "Present",
      type: "Nurse",
    },
    {
      name: "James Wilson",
      role: "Medical Administrator",
      img: "https://i.pinimg.com/1200x/7e/5d/4c/7e5d4cef07e8b5f2f7f3b5c5b8e7f8c9.jpg",
      rating: "4.80",
      reviews: "98",
      dist: "9.2km",
      status: "Present",
      type: "Staff",
    },
    {
      name: "Rachel Brown",
      role: "Receptionist",
      img: "https://i.pinimg.com/736x/5c/3b/2a/5c3b2aef07e8b5f2f7f3b5c5b8e7f8c9.jpg",
      rating: "4.85",
      reviews: "76",
      dist: "4.8km",
      status: "Present",
      type: "Staff",
    },
  ];

  const filteredDoctors =
    filter === "All" ?
      roleFilter === "All" ? doctors : doctors.filter((doc) => doc.type === roleFilter)
      :
      roleFilter === "All" ?
        doctors.filter((doc) => doc.status === filter)
        :
        doctors.filter((doc) => doc.status === filter && doc.type === roleFilter);



  return (
    <div className="space-y-8 pb-10">

      <div className="flex items-center justify-end gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-zinc-50 dark:bg-zinc-800/50 p-1 rounded-2xl border border-zinc-100 dark:border-zinc-700">
            {["All", "Present", "Leave"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                  filter === f
                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-zinc-200/50 dark:ring-zinc-600"
                    : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <Select
            value={roleFilter}
            onValueChange={(val) => setRoleFilter(val as "All" | "Doctor" | "Nurse" | "Staff")}
          >
            <SelectTrigger className="w-[130px] rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700 text-[11px] font-black uppercase tracking-widest text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 transition-all">
              <SelectValue placeholder="All Staff" />
            </SelectTrigger>
            <SelectContent className="rounded-[22px] border-zinc-200/50 dark:border-zinc-800/50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-1.5">
              <SelectItem value="All" className="rounded-xl text-[13px] font-semibold cursor-pointer">All Staff</SelectItem>
              <SelectItem value="Doctor" className="rounded-xl text-[13px] font-semibold cursor-pointer">Doctor</SelectItem>
              <SelectItem value="Nurse" className="rounded-xl text-[13px] font-semibold cursor-pointer">Nurse</SelectItem>
              <SelectItem value="Staff" className="rounded-xl text-[13px] font-semibold cursor-pointer">Other Staff</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black text-[13px] font-black shadow-sm hover:bg-zinc-900 dark:hover:bg-zinc-100 active:scale-95 transition-all">
                  <Plus className="w-3 h-3" />
                  Add
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60 p-2 rounded-[28px] border-zinc-200/50 dark:border-zinc-800/50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]" align="end" sideOffset={8}>
                <DropdownMenuItem
                  onClick={() => {
                    setAddMemberType("Doctor");
                    setActiveView("placeholder_add");
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center border bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100/50 dark:border-blue-800/50 group-hover:bg-white dark:group-hover:bg-zinc-800 transition-colors">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-zinc-800 dark:text-zinc-200">New Doctor</span>
                      <span className="text-[10px] text-zinc-400 font-medium">Add a specialist</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:translate-x-1 transition-transform" />
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    setAddMemberType("Nurse");
                    setActiveView("placeholder_add");
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center border bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-100/50 dark:border-indigo-800/50 group-hover:bg-white dark:group-hover:bg-zinc-800 transition-colors">
                      <HeartPulse className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-zinc-800 dark:text-zinc-200">New Nurse</span>
                      <span className="text-[10px] text-zinc-400 font-medium">Add a care provider</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:translate-x-1 transition-transform" />
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    setAddMemberType("Staff");
                    setActiveView("placeholder_add");
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center border bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-100/50 dark:border-purple-800/50 group-hover:bg-white dark:group-hover:bg-zinc-800 transition-colors">
                      <Users2 className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-zinc-800 dark:text-zinc-200">New Staff</span>
                      <span className="text-[10px] text-zinc-400 font-medium">Add a team member</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:translate-x-1 transition-transform" />
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1.5 bg-zinc-100/80 dark:bg-zinc-800/80 mx-2" />

                <DropdownMenuItem className="w-full p-3 rounded-2xl hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 text-zinc-500 text-[11px] font-black uppercase tracking-widest text-center transition-all cursor-pointer">
                  <div className="w-full text-center">Quick Attendance</div>
                </DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Dynamic Content Area */}
      {activeView === "placeholder_calendar" ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 bg-zinc-50/50 dark:bg-zinc-900/50">
          <CalendarCheck2 className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mb-6" />
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight text-center">
            Message work on it
          </h1>
          <p className="mt-2 text-zinc-500 font-medium text-center">
            This module is currently being built.
          </p>
          <button
            onClick={() => setActiveView("grid")}
            className="mt-8 px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-sm font-bold shadow-sm hover:scale-105 transition-transform"
          >
            Go Back
          </button>
        </div>
      ) : activeView === "placeholder_add" ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100 dark:border-blue-800/50">
            {addMemberType === "Doctor" ? <Stethoscope className="w-8 h-8" /> : addMemberType === "Nurse" ? <HeartPulse className="w-8 h-8" /> : <Users2 className="w-8 h-8" />}
          </div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight text-center">
            Add New {addMemberType}
          </h1>
          <p className="mt-2 text-zinc-500 font-medium text-center max-w-sm">
            The {addMemberType.toLowerCase()} onboarding and invitation form is currently being integrated into this section.
          </p>
          <button
            onClick={() => setActiveView("grid")}
            className="mt-8 px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-sm font-bold shadow-sm hover:scale-105 transition-transform"
          >
            Go Back to Grid
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 min-h-100">
          <AnimatePresence mode="popLayout">
            {filteredDoctors.map((doc) => (
              <motion.div
                key={doc.name}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <SpecialistCard doctor={doc} onActionClick={() => setActiveView("placeholder_calendar")} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function SpecialistCard({ doctor, onActionClick }: { doctor: Doctor; onActionClick?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] p-5 shadow-xl shadow-zinc-200/40 dark:shadow-none hover:shadow-2xl transition-all group"
    >
      <div className="flex flex-col gap-4">
        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-blue-50 dark:bg-blue-900/20 shrink-0 border border-zinc-100 dark:border-zinc-800 shadow-sm mx-auto sm:mx-0">
          <img
            src={doctor.img}
            alt={doctor.name}
            className="w-full h-full object-cover grayscale-10 group-hover:grayscale-0 transition-all duration-500"
          />
        </div>
        <div className="flex flex-col flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1">
            <div
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                doctor.status === "Present"
                  ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                  : "bg-zinc-300 dark:bg-zinc-600"
              )}
            />
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
              {doctor.status}
            </span>
          </div>
          <h3 className="text-[15px] font-black text-zinc-900 dark:text-zinc-100 leading-tight truncate">
            {doctor.name}
          </h3>
          <p className="text-[12px] text-zinc-500 font-bold truncate">
            {doctor.role}
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100">
                {doctor.rating}
              </span>
            </div>
            <span className="w-1 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <span className="text-[11px] text-zinc-400 font-bold">
              {doctor.dist}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onActionClick}
              className="flex items-center justify-center sm:justify-start gap-1 mt-3 text-blue-600 dark:text-blue-400 text-[11px] font-black uppercase tracking-tight hover:underline"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Message
            </button>
            <button
              onClick={onActionClick}
              className="flex items-center justify-center sm:justify-start gap-1 mt-3 text-blue-600 dark:text-blue-400 text-[11px] font-black uppercase tracking-tight hover:underline"
            >
              <Calendar className="w-3.5 h-3.5" />
              Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Appointments section hidden */}
    </motion.div>
  );
}
