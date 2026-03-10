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
  TrendingUp,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Doctor {
  name: string;
  role: string;
  img: string;
  rating: string;
  reviews: string;
  dist: string;
  status: string;
}

export function TeamTab() {
  const [filter, setFilter] = useState("All");
  const [showAddMenu, setShowAddMenu] = useState(false);

  const doctors: Doctor[] = [
    {
      name: "Dr. Peter Griffin",
      role: "Primary care doctor",
      img: "https://i.pinimg.com/736x/b4/1f/24/b41f248ea356a219e23847075cfccb46.jpg",
      rating: "4.85",
      reviews: "255",
      dist: "16.8km",
      status: "Present",
    },
    {
      name: "Dr. Sophie Dubreuil",
      role: "Cardiologist",
      img: "https://i.pinimg.com/736x/7c/c8/36/7cc8365ff96cd8f7df7222a1533f7013.jpg",
      rating: "4.92",
      reviews: "128",
      dist: "12.4km",
      status: "Present",
    },
    {
      name: "Dr. Marc Aubert",
      role: "Dermatologist",
      img: "https://i.pinimg.com/736x/d4/3e/40/d43e40f2623b9d3b72404a076f72d87a.jpg",
      rating: "4.70",
      reviews: "94",
      dist: "5.2km",
      status: "Leave",
    },
    {
      name: "Dr. Léonard Dubois",
      role: "Neurologist",
      img: "https://i.pinimg.com/1200x/97/ff/27/97ff275080abc0f08aade3026ab3dee2.jpg",
      rating: "4.98",
      reviews: "312",
      dist: "8.1km",
      status: "OP",
    },
    {
      name: "Dr. Léonard Junior",
      role: "Neurologist",
      img: "https://i.pinimg.com/736x/ff/07/64/ff07643efddfd768f66017b4e87ca785.jpg",
      rating: "4.98",
      reviews: "312",
      dist: "8.5km",
      status: "Leave",
    },
    {
      name: "Dr. Léonard Dubois",
      role: "Neurologist",
      img: "https://i.pinimg.com/1200x/e8/52/72/e852726f2346ce95973a91143816bd7b.jpg",
      rating: "4.98",
      reviews: "312",
      dist: "8.1km",
      status: "Present",
    },
  ];

  const filteredDoctors =
    filter === "All" ? doctors : doctors.filter((doc) => doc.status === filter);



  return (
    <div className="space-y-8 pb-10">

      <div className="flex items-center justify-between gap-4">
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

        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black text-[13px] font-black shadow-xl shadow-zinc-200/50 dark:shadow-none hover:bg-zinc-800 dark:hover:bg-zinc-100 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 transition-transform duration-300",
                showAddMenu && "rotate-180"
              )}
            />
          </button>

          <AnimatePresence>
            {showAddMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-60 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-2 z-50 overflow-hidden"
              >
                <div className="p-1 space-y-1">
                  <MenuButton
                    icon={Stethoscope}
                    title="New Doctor"
                    desc="Add a specialist"
                    bgColor="bg-blue-50 dark:bg-blue-900/30"
                    iconColor="text-blue-600 dark:text-blue-400"
                    borderColor="border-blue-100/50 dark:border-blue-800/50"
                  />
                  <MenuButton
                    icon={HeartPulse}
                    title="New Nurse"
                    desc="Add a care provider"
                    bgColor="bg-indigo-50 dark:bg-indigo-900/30"
                    iconColor="text-indigo-600 dark:text-indigo-400"
                    borderColor="border-indigo-100/50 dark:border-indigo-800/50"
                  />
                  <MenuButton
                    icon={Users2}
                    title="New Staff"
                    desc="Add a team member"
                    bgColor="bg-purple-50 dark:bg-purple-900/30"
                    iconColor="text-purple-600 dark:text-purple-400"
                    borderColor="border-purple-100/50 dark:border-purple-800/50"
                  />
                </div>
                <div className="h-px bg-zinc-100/80 dark:bg-zinc-800/80 my-1 mx-2" />
                <div className="p-1">
                  <button className="w-full p-3 rounded-2xl hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 text-zinc-500 text-[11px] font-black uppercase tracking-widest text-center transition-all">
                    Quick Attendance
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Doctors Grid */}
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
              <SpecialistCard doctor={doc} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function MenuButton({
  icon: Icon,
  title,
  desc,
  bgColor,
  iconColor,
  borderColor,
}: {
  icon: any;
  title: string;
  desc: string;
  bgColor: string;
  iconColor: string;
  borderColor: string;
}) {
  return (
    <button className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all text-left group">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center border group-hover:bg-white dark:group-hover:bg-zinc-800 transition-colors",
            bgColor,
            iconColor,
            borderColor
          )}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-[13px] font-bold text-zinc-800 dark:text-zinc-200">
            {title}
          </span>
          <span className="text-[10px] text-zinc-400 font-medium">{desc}</span>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:translate-x-1 transition-transform" />
    </button>
  );
}

function SpecialistCard({ doctor }: { doctor: Doctor }) {
  const appointments = [
    { date: "05 Dec", count: "12 appts", active: false },
    { date: "06 Dec", count: "0 appts", active: true },
    { date: "07 Dec", count: "15 appts", active: false },
    { date: "08 Dec", count: "8 appts", active: false },
  ];

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
            <button className="flex items-center justify-center sm:justify-start gap-1 mt-3 text-blue-600 dark:text-blue-400 text-[11px] font-black uppercase tracking-tight hover:underline">
              <PhoneCallIcon className="w-3.5 h-3.5" />
              Phone
            </button>
            <button className="flex items-center justify-center sm:justify-start gap-1 mt-3 text-blue-600 dark:text-blue-400 text-[11px] font-black uppercase tracking-tight hover:underline">
              <CalendarCheck2 className="w-3.5 h-3.5" />
              Calendar
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 flex gap-1.5">
        {appointments.map((item, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 py-2 px-1 rounded-xl text-center border transition-all cursor-pointer",
              item.active
                ? "bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100"
                : "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
            )}
          >
            <div
              className={cn(
                "text-[8px] font-bold uppercase tracking-tight mb-0.5 opacity-60",
                item.active ? "text-zinc-400" : "text-zinc-400"
              )}
            >
              {item.date.split(" ")[0]}
            </div>
            <div
              className={cn(
                "text-[10px] font-black leading-tight",
                item.active
                  ? "text-white dark:text-zinc-900"
                  : "text-zinc-900 dark:text-zinc-100"
              )}
            >
              {item.count.split(" ")[0]}{" "}
              <span className="opacity-40 text-[6px]">
                {item.count.split(" ")[1].slice(0, 3)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
