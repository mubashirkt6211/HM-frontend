import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    SquaresFour,
    List,
    User,
    Funnel,
    Pulse,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Modular Components
import type { PatientRecord } from "@/components/dashboard/patients/types";
import { patients } from "@/components/dashboard/patients/data";
import { PatientGrid } from "@/components/dashboard/patients/PatientGrid";
import { PatientTable } from "@/components/dashboard/patients/PatientTable";
import { PatientProfile } from "@/components/dashboard/patients/PatientProfile";
import { PatientInsights } from "@/components/dashboard/patients/PatientInsights";

// ReUI Components
import { Filters, type Filter, type FilterFieldConfig } from "@/components/reui/filters";
import { Alert, AlertTitle } from "@/components/reui/alert";

const filterFields: FilterFieldConfig[] = [
    {
        key: "name",
        label: "Patient Name",
        icon: <User className="size-3.5" />,
        type: "text",
        placeholder: "Search name...",
    },
    {
        key: "type",
        label: "Specialty",
        icon: <Pulse className="size-3.5" />,
        type: "select",
        options: [
            { value: "Cardiology", label: "Cardiology" },
            { value: "Pediatrics", label: "Pediatrics" },
            { value: "Neurology", label: "Neurology" },
            { value: "Dermatology", label: "Dermatology" },
            { value: "Orthopedics", label: "Orthopedics" },
            { value: "General", label: "General" },
        ],
    },
    {
        key: "status",
        label: "Status",
        icon: <Pulse className="size-3.5" />,
        type: "select",
        options: [
            { value: "Emergency", label: "Emergency", icon: <div className="size-2 rounded-full bg-rose-500" /> },
            { value: "Follow-up", label: "Follow-up", icon: <div className="size-2 rounded-full bg-blue-500" /> },
            { value: "Checkup", label: "Checkup", icon: <div className="size-2 rounded-full bg-violet-500" /> },
            { value: "Discharged", label: "Discharged", icon: <div className="size-2 rounded-full bg-emerald-500" /> },
            { value: "Scheduled", label: "Scheduled", icon: <div className="size-2 rounded-full bg-orange-500" /> },
        ],
    },
];

export function PatientsPage() {
    const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");
    const [filters, setFilters] = useState<Filter[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filteredData, setFilteredData] = useState<PatientRecord[]>(patients);

    // Advanced Filtering Logic
    const applyFilters = useCallback((newFilters: Filter[]) => {
        let result = [...patients];

        newFilters.forEach(f => {
            const val = f.values[0]?.toLowerCase() || "";
            if (val) {
                result = result.filter(p => {
                    const fieldVal = String(p[f.field as keyof PatientRecord]).toLowerCase();
                    if (f.operator === 'contains') return fieldVal.includes(val);
                    if (f.operator === 'is') return fieldVal === val;
                    return true;
                });
            }
        });

        return result;
    }, []);

    const handleFiltersChange = (newFilters: Filter[]) => {
        setFilters(newFilters);
        setIsLoading(true);
        // Simulate API delay like the ReUI pattern
        setTimeout(() => {
            setFilteredData(applyFilters(newFilters));
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="flex flex-col gap-8 py-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div>
                    <h1 className="text-[32px] font-black text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
                        Patient Registry
                    </h1>
                    <p className="text-[14px] text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
                        Advanced management with real-time analytics and smart filtering.
                    </p>
                </div>


            </div>

            <AnimatePresence mode="wait">
                {!selectedPatient ? (
                    <motion.div
                        key="list-view"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex flex-col gap-8"
                    >
                        {/* Insights Section with REUI Charts */}
                        <PatientInsights />

                        {/* ReUI Filter Section */}
                        <div className="flex items-center justify-between flex-wrap gap-4 px-2">
                            <div className="flex-1 min-w-[300px]">
                                <Filters
                                    filters={filters}
                                    fields={filterFields}
                                    onChange={handleFiltersChange}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                {filters.length > 0 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleFiltersChange([])}
                                        className="rounded-xl"
                                    >
                                        <Funnel className="mr-2" size={16} /> Clear All
                                    </Button>
                                )}
                                <div className="h-10 w-[1px] bg-zinc-100 dark:bg-zinc-800 mx-2" />
                                <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-xl">
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={cn(
                                            "p-2 rounded-lg transition-all",
                                            viewMode === "list" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm" : "text-zinc-400"
                                        )}
                                    >
                                        <List size={20} weight="bold" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={cn(
                                            "p-2 rounded-lg transition-all",
                                            viewMode === "grid" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm" : "text-zinc-400"
                                        )}
                                    >
                                        <SquaresFour size={20} weight="bold" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Table or Grid */}
                        <div className="px-2">
                            {viewMode === "list" ? (
                                <PatientTable
                                    patients={filteredData}
                                    onOpen={setSelectedPatient}
                                    isLoading={isLoading}
                                />
                            ) : (
                                <div className={cn(isLoading && "opacity-50 pointer-events-none grayscale transition-all")}>
                                    <PatientGrid patients={filteredData} onOpen={setSelectedPatient} />
                                </div>
                            )}
                        </div>

                        {/* Async Info Alert */}
                        <Alert variant="success" className="mx-2 mt-4 bg-indigo-50/30 dark:bg-indigo-900/5 border-indigo-500/20">
                            <Pulse className="size-4 animate-pulse text-indigo-500" weight="bold" />
                            <AlertTitle className="text-indigo-600 dark:text-indigo-400">
                                Advanced Mode: Real-time filtering with simulated latency for data integrity.
                            </AlertTitle>
                        </Alert>
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
