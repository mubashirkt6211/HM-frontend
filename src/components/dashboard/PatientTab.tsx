import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  SquaresFour,
  List,
  MagnifyingGlass,
  Plus,
  Export,
  CaretRight,
  CaretLeft,
  Files,
  CaretDown,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { SlidersHorizontal } from "lucide-react";

// Modular Components
// Modular Components
import type { PatientRecord } from "./patients/types";
import { FILTERS, STATUS_CONFIG } from "./patients/constants";
import { patients } from "./patients/data";
import { PatientGrid } from "./patients/PatientGrid";
import { PatientTable } from "./patients/PatientTable";
import { PatientProfile } from "./patients/PatientProfile";
import { PatientInsights } from "./patients/PatientInsights";

export function PatientTab() {
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
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
              placeholder="Search patients..."
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
            {/* NEW: Patient Insights Section (REUI Charts) */}
            <PatientInsights />

            {/* Toolbar */}
            <div className="flex items-center justify-between flex-wrap gap-4 px-2">
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all",
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
          <PatientProfile
            patient={selectedPatient}
            onBack={() => setSelectedPatient(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
