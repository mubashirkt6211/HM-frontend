import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { addDays, format } from "date-fns";
import {
    CaretLeft, CaretRight, Plus, Clock, Users,
    X, Calendar as CalendarIcon, MapPin,
    ShieldCheck, Warning, Info, Check,
    File, Trash, CloudArrowUp, Flag, ArrowRight, ArrowLeft
} from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ─── Types ───────────────────────────────────────────────────────────
type CalendarEvent = {
    id: string;
    title: string;
    patientName?: string;
    nurse?: string;
    doctor?: string;
    attachments?: { name: string; size: string; type: string }[];
    report?: string;
    time: string;
    endTime?: string;
    color: string;
    attendees?: number;
    location?: string;
    notes?: string;
    priority?: "Low" | "Medium" | "High";
    category?: "Shared" | "Public" | "Archived";
    assignees?: { name: string; avatar?: string; role: string }[];
};

type DayEvents = { [key: number]: CalendarEvent[] };

// ─── Mock Data ────────────────────────────────────────────────────────
const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MOCK_STAFF = [
    { name: "Dr. Sarah Mitchell", avatar: "https://i.pravatar.cc/200?img=45", role: "Oncology" },
    { name: "Dr. Marcus Thompson", avatar: "https://i.pravatar.cc/200?img=52", role: "Neurology" },
    { name: "Nurse Elena", avatar: "https://i.pravatar.cc/200?img=49", role: "ER" },
    { name: "Jonathan Harker", avatar: "https://i.pravatar.cc/200?img=12", role: "Admin" },
];

const PRIORITY_CONFIG = {
    High: { label: "High", icon: ShieldCheck, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10", border: "border-rose-200 dark:border-rose-800/50" },
    Medium: { label: "Medium", icon: Warning, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-200 dark:border-amber-800/50" },
    Low: { label: "Low", icon: Info, color: "text-sky-500", bg: "bg-sky-50 dark:bg-sky-500/10", border: "border-sky-200 dark:border-sky-800/50" },
};

function getEventCategory(event: CalendarEvent) {
    return event.category ?? (event.priority === "Low" ? "Archived" : event.priority === "Medium" ? "Public" : "Shared");
}

const EVENTS_BY_DAY: DayEvents = {
    1: [{ id: "e1", title: "ER triage briefing", time: "9:00 AM", color: "blue", category: "Shared" }],
    2: [
        { id: "e2", title: "Patient consultation", patientName: "John Doe", nurse: "Nurse Elena", report: "Review CT results and discharge plan.", time: "10:00 AM", color: "green", attendees: 2, priority: "High", category: "Public", assignees: [MOCK_STAFF[0], MOCK_STAFF[2]] },
        { id: "e3", title: "Surgery planning meeting", patientName: "Maria Santos", nurse: "Nurse Elena", report: "Finalize OR schedule for Tuesday.", time: "4:00 PM", color: "purple", attendees: 12, priority: "Medium", category: "Shared", assignees: [MOCK_STAFF[1]] },
        { id: "e4", title: "Night shift handover", time: "7:00 PM", color: "red", priority: "Low", category: "Archived" },
    ],
    3: [{ id: "e5", title: "Ward rounds", time: "9:00 AM", color: "blue", category: "Shared" }],
    5: [{ id: "e6", title: "Pediatric checkup", patientName: "Amelia Hayes", nurse: "Nurse Elena", report: "Vaccination follow-up and growth assessment.", time: "9:00 AM", color: "blue", category: "Public" }],
    6: [
        { id: "e7", title: "Pre-op briefing", time: "10:30 AM", color: "orange", category: "Shared" },
        { id: "e8", title: "Radiology review", time: "2:30 PM", color: "green", category: "Public" },
    ],
    7: [{ id: "e9", title: "Post-op assessment", patientName: "Samuel Kim", nurse: "Nurse Elena", report: "Check wound healing and pain control.", time: "9:00 AM", color: "blue", category: "Public" }],
    8: [
        { id: "e10", title: "Cardiology consult", time: "11:00 AM", color: "green", category: "Public" },
        { id: "e11", title: "Clinical case review", time: "11:00 AM", color: "purple", category: "Shared" },
    ],
    9: [
        { id: "e12", title: "Lab sample analysis", time: "9:00 AM", color: "slate", category: "Archived" },
        { id: "e13", title: "Vaccination clinic", time: "1:30 PM", color: "teal", category: "Public" },
    ],
    10: [
        { id: "e14", title: "Patient discharge review", time: "10:00 AM", color: "green", attendees: 3, priority: "Low", category: "Archived" },
        { id: "e15", title: "Orthopedic follow-up", time: "10:00 AM", color: "pink", priority: "Medium", category: "Public", assignees: [MOCK_STAFF[0]] },
        { id: "e16", title: "Emergency surgery prep", time: "1:30 PM", color: "blue", priority: "High", category: "Shared", assignees: [MOCK_STAFF[1], MOCK_STAFF[3]] },
    ],
    11: [
        { id: "e17", title: "ICU check-in", time: "10:30 AM", color: "orange", category: "Shared" },
        { id: "e18", title: "Patient family update", time: "1:00 PM", color: "pink", category: "Public" },
    ],
    14: [
        { id: "e19", title: "Surgical briefing", time: "3:30 PM", color: "purple", category: "Shared" },
    ],
    15: [
        { id: "e20", title: "Nurse triage review", time: "10:30 AM", color: "green", category: "Shared" },
        { id: "e21", title: "Provider check-in", time: "4:00 PM", color: "purple", category: "Shared" },
    ],
    16: [
        { id: "e22", title: "Outpatient consult", time: "7:00 AM", color: "red", category: "Public" },
        { id: "e23", title: "Case conference", time: "9:30 AM", color: "green", category: "Shared" },
        { id: "e24", title: "Medication review", time: "3:30 PM", color: "blue", category: "Public" },
    ],
    21: [
        { id: "e25", title: "Clinical audit", time: "9:00 AM", color: "purple", category: "Archived" },
        { id: "e26", title: "Nutrition consult", time: "1:00 PM", color: "green", category: "Public" },
        { id: "e27", title: "Trauma team briefing", time: "7:00 PM", color: "red", category: "Shared" },
    ],
    22: [
        { id: "e28", title: "Pharmacy inventory", time: "9:00 AM", color: "slate", category: "Archived" },
        { id: "e29", title: "Therapy session", time: "2:30 PM", color: "blue", category: "Public" },
    ],
    23: [
        { id: "e30", title: "Patient transportation", time: "10:00 AM", color: "green", category: "Shared" },
        { id: "e31", title: "Facility safety review", time: "4:00 PM", color: "purple", category: "Shared" },
    ],
    28: [
        { id: "e32", title: "Surgery follow-up", time: "11:00 AM", color: "purple", category: "Public" },
        { id: "e33", title: "Immunization clinic", time: "12:45 PM", color: "green", category: "Public" },
    ],
    29: [
        { id: "e34", title: "Wound care visit", time: "3:30 PM", color: "purple", category: "Public" },
    ],
    30: [
        { id: "e35", title: "Weekend triage", time: "4:00 PM", color: "purple", category: "Shared" },
        { id: "e36", title: "Medical education session", time: "6:30 PM", color: "red", category: "Archived" },
    ],
};

// ─── Color Map ────────────────────────────────────────────────────────
const COLOR_MAP: Record<string, { bg: string; text: string; dot: string }> = {
    blue: { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-300", dot: "bg-blue-500" },
    green: { bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-700 dark:text-green-300", dot: "bg-green-500" },
    purple: { bg: "bg-purple-50 dark:bg-purple-900/20", text: "text-purple-700 dark:text-purple-300", dot: "bg-purple-500" },
    red: { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-700 dark:text-red-300", dot: "bg-red-500" },
    orange: { bg: "bg-orange-50 dark:bg-orange-900/20", text: "text-orange-700 dark:text-orange-300", dot: "bg-orange-500" },
    slate: { bg: "bg-slate-100 dark:bg-slate-800/40", text: "text-slate-700 dark:text-slate-300", dot: "bg-slate-400" },
    teal: { bg: "bg-teal-50 dark:bg-teal-900/20", text: "text-teal-700 dark:text-teal-300", dot: "bg-teal-500" },
    pink: { bg: "bg-pink-50 dark:bg-pink-900/20", text: "text-pink-700 dark:text-pink-300", dot: "bg-pink-500" },
};

// ─── Helpers ─────────────────────────────────────────────────────────
function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
    // 0 = Sun, 1 = Mon … shift so Mon = 0
    return (new Date(year, month, 1).getDay() + 6) % 7;
}
function getWeekStartDate(date: Date) {
    const offset = (date.getDay() + 6) % 7;
    return addDays(date, -offset);
}
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// ─── Small Components ─────────────────────────────────────────────────
function EventPill({ event, isPast }: { event: CalendarEvent; isPast?: boolean }) {
    const c = COLOR_MAP[event.color] ?? COLOR_MAP.blue;
    const prio = event.priority ? PRIORITY_CONFIG[event.priority] : null;

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={cn(
                "flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium cursor-pointer truncate border border-transparent",
                c.bg, c.text,
                prio && cn("border-l-2", prio.border)
            )}
        >
            <span className={cn(
                "w-1.5 h-1.5 rounded-full shrink-0",
                c.dot
            )} />
            <span className={cn("truncate", isPast && "line-through decoration-current")}>{event.title}</span>
            <span className="shrink-0 opacity-50">{event.time}</span>
        </motion.div>
    );
}

// ─── Custom Time Picker ──────────────────────────────────────────────
function TimePicker({ value, onChange, label, icon: Icon }: {
    value: string;
    onChange: (val: string) => void;
    label: string;
    icon?: React.ElementType;
}) {
    const [open, setOpen] = React.useState(false);

    // Parse HH:MM
    const [hStr, mStr] = value.split(":");
    let h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    const isPM = h >= 12;
    if (h > 12) h -= 12;
    if (h === 0) h = 12;

    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const minutes = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

    function updateTime(newH: number, newM: number, newIsPm: boolean) {
        let hr = newH;
        if (newIsPm && hr < 12) hr += 12;
        if (!newIsPm && hr === 12) hr = 0;
        onChange(`${String(hr).padStart(2, "0")}:${String(newM).padStart(2, "0")}`);
        setOpen(false); // Close popover after selection
    }

    const fmt = `${h}:${String(m).padStart(2, "0")} ${isPM ? "PM" : "AM"}`;

    return (
        <div>
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 block flex items-center gap-1">
                {Icon && <Icon className="w-3 h-3" />} {label}
            </label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className="w-full h-[38px] flex items-center justify-between bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                    >
                        {fmt}
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl" align="start">
                    <div className="flex gap-2">
                        {/* Hours */}
                        <div className="flex flex-col gap-1 h-48 overflow-y-auto pr-2 no-scrollbar border-r border-zinc-100 dark:border-zinc-800">
                            {hours.map(hour => (
                                <button
                                    key={`h-${hour}`}
                                    onClick={() => updateTime(hour, m, isPM)}
                                    className={cn(
                                        "w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors",
                                        h === hour ? "bg-blue-600 text-white font-bold" : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                    )}
                                >
                                    {hour}
                                </button>
                            ))}
                        </div>
                        {/* Minutes */}
                        <div className="flex flex-col gap-1 h-48 overflow-y-auto pr-2 no-scrollbar border-r border-zinc-100 dark:border-zinc-800">
                            {minutes.map(minStr => {
                                const min = parseInt(minStr, 10);
                                return (
                                    <button
                                        key={`m-${minStr}`}
                                        onClick={() => updateTime(h, min, isPM)}
                                        className={cn(
                                            "w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors",
                                            m === min ? "bg-blue-600 text-white font-bold" : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                        )}
                                    >
                                        {minStr}
                                    </button>
                                );
                            })}
                        </div>
                        {/* AM/PM */}
                        <div className="flex flex-col gap-1">
                            {["AM", "PM"].map(period => (
                                <button
                                    key={period}
                                    onClick={() => updateTime(h, m, period === "PM")}
                                    className={cn(
                                        "w-10 h-10 flex items-center justify-center rounded-md text-xs font-bold transition-colors",
                                        (period === "PM") === isPM ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                    )}
                                >
                                    {period}
                                </button>
                            ))}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}

// ─── Add Event Modal ─────────────────────────────────────────────────
const EVENT_COLORS = [
    { id: "blue", label: "Blue", dot: "bg-blue-500" },
    { id: "green", label: "Green", dot: "bg-green-500" },
    { id: "purple", label: "Purple", dot: "bg-purple-500" },
    { id: "red", label: "Red", dot: "bg-red-500" },
    { id: "orange", label: "Orange", dot: "bg-orange-500" },
];
const DOCTOR_OPTIONS = [
    { name: "Dr. Sarah Mitchell", avatar: "https://i.pravatar.cc/200?img=45", role: "Oncology" },
    { name: "Dr. Marcus Thompson", avatar: "https://i.pravatar.cc/200?img=52", role: "Neurology" },
    { name: "Dr. Alexandra Reed", avatar: "https://i.pravatar.cc/200?img=47", role: "Cardiology" },
    { name: "Dr. Priya Sharma", avatar: "https://i.pravatar.cc/200?img=44", role: "Pediatrics" },
];

const NURSE_OPTIONS = [
    { name: "Nurse Elena Gilbert", avatar: "https://i.pravatar.cc/200?img=49", role: "Critical Care" },
    { name: "Nurse David Miller", avatar: "https://i.pravatar.cc/200?img=12", role: "Emergency" },
    { name: "Nurse Sophia Williams", avatar: "https://i.pravatar.cc/200?img=32", role: "Pediatrics" },
    { name: "Nurse Michael Chen", avatar: "https://i.pravatar.cc/200?img=11", role: "Surgery" },
];

function AddEventModal({ onClose, onAdd, defaultDay, defaultMonth, defaultYear }: {
    onClose: () => void;
    onAdd: (day: number, event: CalendarEvent) => void;
    defaultDay: number;
    defaultMonth: number;
    defaultYear: number;
}) {
    const [step, setStep] = React.useState<1 | 2>(1);
    const [direction, setDirection] = React.useState<-1 | 1>(1);

    const [title, setTitle] = React.useState("");
    const [date, setDate] = React.useState<Date | undefined>(new Date(defaultYear, defaultMonth, defaultDay));
    const [dateOpen, setDateOpen] = React.useState(false);
    const [startTime, setStart] = React.useState("09:00");
    const [endTime, setEnd] = React.useState("10:00");
    const [color, setColor] = React.useState("blue");
    const [location, setLocation] = React.useState("");
    const [patientName, setPatientName] = React.useState("");
    const [doctor, setDoctor] = React.useState("");
    const [nurse, setNurse] = React.useState("");
    const [notes, setNotes] = React.useState("");
    const [priority, setPriority] = React.useState<CalendarEvent["priority"]>("Medium");
    const [category, setCategory] = React.useState<CalendarEvent["category"]>("Shared");
    const [attachments, setAttachments] = React.useState<{ name: string; size: string; type: string }[]>([]);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const isNextDisabled = !title.trim() || !date;
    const handleNext = () => { if (!isNextDisabled) { setDirection(1); setStep(2); } };
    const handleBack = () => { setDirection(-1); setStep(1); };

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (step === 1) { handleNext(); return; }
        if (!title.trim() || !date) return;
        const day = date.getDate();
        const fmt = (t: string) => {
            const [h, m] = t.split(":").map(Number);
            const period = h >= 12 ? "PM" : "AM";
            const hr = h % 12 || 12;
            return `${hr}:${String(m).padStart(2, "0")} ${period}`;
        };
        onAdd(day, {
            id: `ev-${Date.now()}`,
            title,
            patientName: patientName.trim() || undefined,
            doctor: doctor || undefined,
            nurse: nurse || undefined,
            attachments: attachments.length > 0 ? attachments : undefined,
            time: fmt(startTime),
            endTime: fmt(endTime),
            color,
            location: location || undefined,
            notes: notes.trim() || undefined,
            priority,
            category,
        });
        onClose();
    }

    const slideVariants = {
        enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
    };

    const inputCls = "w-full h-[38px] border border-zinc-200 rounded-lg px-3 text-[13px] font-medium bg-white text-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-400/30 hover:border-zinc-300 transition-all placeholder:text-zinc-400";
    const blackButtonCls = "inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-zinc-800";
    const blackButtonMutedCls = "inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-black";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ type: "spring", stiffness: 340, damping: 28 }}
                className="relative z-10 w-full max-w-[640px] mx-4 bg-white flex flex-col max-h-[92vh] overflow-hidden"
                style={{ borderRadius: 18, boxShadow: "0 24px 64px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.06)" }}
            >
                {/* Progress bar */}
                <div style={{ height: 3, background: "#f0eff8" }}>
                    <motion.div
                        style={{ height: 3, background: "linear-gradient(90deg,#7c73f1,#5048e5)", borderRadius: 2 }}
                        animate={{ width: step === 1 ? "50%" : "100%" }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    />
                </div>

                {/* Header */}
                <div className="flex items-start gap-3 px-6 pt-5 pb-4">
                    <div className="flex items-center justify-center shrink-0 rounded-xl" style={{ width: 40, height: 40, background: "#f0eeff" }}>
                        <Flag className="w-4 h-4" style={{ color: "#6c63ff" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-[15px] font-bold text-zinc-900" style={{ letterSpacing: "-0.01em" }}>
                            {step === 1 ? "Add New Event" : "Assign Staff & Documents"}
                        </h2>
                        <p className="text-xs mt-0.5" style={{ color: "#9896b8" }}>
                            {step === 1 ? "Fill in the event details below" : "Assign team members and attach medical files"}
                        </p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center border border-zinc-200 text-zinc-700 transition-colors hover:bg-black hover:text-white shrink-0">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div style={{ height: 1, background: "#f2f1f8", margin: "0 24px" }} />

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <AnimatePresence mode="wait" initial={false} custom={direction}>
                        {step === 1 ? (
                            <motion.div key="step1" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2, ease: "easeInOut" }} className="px-6 py-5 flex flex-col gap-4">
                                {/* Event Title */}
                                <div>
                                    <label className="block text-[12px] font-semibold text-zinc-700 mb-1.5">Event Title</label>
                                    <input autoFocus value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Patient Consultation" className={inputCls} required />
                                </div>

                                {/* Date + Location */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[12px] font-semibold text-zinc-700 mb-1.5">Start Date</label>
                                        <Popover open={dateOpen} onOpenChange={setDateOpen}>
                                            <PopoverTrigger asChild>
                                                <button type="button" className="w-full h-[38px] flex items-center gap-2 border border-zinc-200 rounded-lg px-3 text-[13px] font-medium bg-white hover:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-violet-400/30 transition-all">
                                                    <CalendarIcon className="w-3.5 h-3.5 shrink-0" style={{ color: "#6c63ff" }} />
                                                    <span className={date ? "text-zinc-800" : "text-zinc-400"}>{date ? format(date, "d MMM yyyy") : "Pick date"}</span>
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 rounded-xl border border-zinc-200 bg-white shadow-xl" align="start">
                                                <Calendar mode="single" selected={date} onSelect={d => { if (d) { setDate(d); setDateOpen(false); } }} initialFocus className="p-3" classNames={{ day_selected: "bg-violet-600 text-white hover:bg-violet-600", day_today: "bg-violet-50 text-violet-700" }} />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-semibold text-zinc-700 mb-1.5">Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#6c63ff" }} />
                                            <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Ward / Room No." className={cn(inputCls, "pl-9")} />
                                        </div>
                                    </div>
                                </div>

                                {/* Times */}
                                <div className="grid grid-cols-2 gap-3">
                                    <TimePicker value={startTime} onChange={setStart} label="Start Time" icon={Clock} />
                                    <TimePicker value={endTime} onChange={setEnd} label="End Time" icon={Clock} />
                                </div>

                                {/* Color tag */}
                                <div>
                                    <label className="block text-[12px] font-semibold text-zinc-700 mb-2">Color Tag</label>
                                    <div className="flex items-center gap-2">
                                        {EVENT_COLORS.map(c => (
                                            <button key={c.id} type="button" onClick={() => setColor(c.id)} className={cn("w-6 h-6 rounded-full transition-all", c.dot, color === c.id ? "ring-2 ring-offset-2 ring-zinc-400 scale-110" : "opacity-45 hover:opacity-90 hover:scale-105")} title={c.label} />
                                        ))}
                                    </div>
                                </div>

                                <div style={{ height: 1, background: "#f2f1f8" }} className="mt-1" />
                                <div className="flex items-center gap-2">
                                    <button type="button" onClick={onClose} className={blackButtonMutedCls}>Cancel</button>
                                    <div className="flex-1" />
                                    <motion.button
                                        whileHover={{ scale: isNextDisabled ? 1 : 1.02 }} whileTap={{ scale: isNextDisabled ? 1 : 0.97 }}
                                        type="button" onClick={handleNext} disabled={isNextDisabled}
                                        className={cn(blackButtonCls, isNextDisabled && "cursor-not-allowed bg-zinc-300 text-zinc-500 hover:bg-zinc-300")}
                                    >
                                        Next Step <ArrowRight className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="step2" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2, ease: "easeInOut" }} className="px-6 py-5 flex flex-col gap-4">
                                {/* Doctor + Nurse */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[12px] font-semibold text-zinc-700 mb-1.5">Assign Doctor</label>
                                        <Select value={doctor} onValueChange={(value) => setDoctor(value ?? "")}>
                                            <SelectTrigger className="h-[38px] text-[13px] rounded-lg bg-white border border-zinc-200 hover:border-zinc-300">
                                                {doctor ? <div className="flex items-center gap-2"><Avatar className="size-5 shrink-0"><AvatarImage src={DOCTOR_OPTIONS.find(d => d.name === doctor)?.avatar} /><AvatarFallback>{doctor[0]}</AvatarFallback></Avatar><span className="text-[12px] font-medium truncate">{doctor.replace("Dr. ", "")}</span></div> : <SelectValue placeholder="Select doctor" />}
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl bg-white border border-zinc-200 shadow-xl">
                                                {DOCTOR_OPTIONS.map(doc => (
                                                    <SelectItem key={doc.name} value={doc.name} className="py-2">
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="size-6 shrink-0"><AvatarImage src={doc.avatar} /><AvatarFallback>{doc.name[0]}</AvatarFallback></Avatar>
                                                            <div className="text-left leading-tight"><p className="text-[12px] font-semibold text-zinc-900">{doc.name}</p><p className="text-[10px] text-zinc-400">{doc.role}</p></div>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-semibold text-zinc-700 mb-1.5">Assign Nurse</label>
                                        <Select value={nurse} onValueChange={(value) => setNurse(value ?? "")}>
                                            <SelectTrigger className="h-[38px] text-[13px] rounded-lg bg-white border border-zinc-200 hover:border-zinc-300">
                                                {nurse ? <div className="flex items-center gap-2"><Avatar className="size-5 shrink-0"><AvatarImage src={NURSE_OPTIONS.find(n => n.name === nurse)?.avatar} /><AvatarFallback>{nurse[0]}</AvatarFallback></Avatar><span className="text-[12px] font-medium truncate">{nurse.replace("Nurse ", "")}</span></div> : <SelectValue placeholder="Select nurse" />}
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl bg-white border border-zinc-200 shadow-xl">
                                                {NURSE_OPTIONS.map(ns => (
                                                    <SelectItem key={ns.name} value={ns.name} className="py-2">
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="size-6 shrink-0"><AvatarImage src={ns.avatar} /><AvatarFallback>{ns.name[0]}</AvatarFallback></Avatar>
                                                            <div className="text-left leading-tight"><p className="text-[12px] font-semibold text-zinc-900">{ns.name}</p><p className="text-[10px] text-zinc-400">{ns.role}</p></div>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Patient Name + Priority */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[12px] font-semibold text-zinc-700 mb-1.5">Patient Name</label>
                                        <input value={patientName} onChange={e => setPatientName(e.target.value)} placeholder="e.g. John Doe" className={inputCls} />
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-semibold text-zinc-700 mb-1.5">Priority</label>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(["High", "Medium", "Low"] as const).map(p => {
                                                const isActive = priority === p;
                                                return (
                                                    <button key={p} type="button" onClick={() => setPriority(p)} className={cn("flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all", isActive ? "border-black bg-black text-white" : "border-zinc-300 bg-zinc-100 text-zinc-700 hover:border-black hover:bg-zinc-200")}>
                                                        {isActive && <Check className="w-2.5 h-2.5" weight="bold" />}{p}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Category tags */}
                                <div>
                                    <label className="block text-[12px] font-semibold text-zinc-700 mb-1.5">Category</label>
                                    <div className="flex items-center gap-2">
                                        {(["Shared", "Public", "Archived"] as const).map(cat => {
                                            const isActive = category === cat;
                                            return (
                                                <button key={cat} type="button" onClick={() => setCategory(cat)} className={cn("flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold border transition-all", isActive ? "border-black bg-black text-white" : "border-zinc-300 bg-zinc-100 text-zinc-700 hover:border-black hover:bg-zinc-200")}>
                                                    {isActive && <Check className="w-2.5 h-2.5" weight="bold" />}{cat}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Upload Document */}
                                <div>
                                    <label className="block text-[12px] font-semibold text-zinc-700 mb-0.5">Upload Document</label>
                                    <p className="text-[11px] mb-2" style={{ color: "#9896b8" }}>Drag and drop to upload medical reports</p>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        onDragOver={e => e.preventDefault()}
                                        onDrop={e => {
                                            e.preventDefault();
                                            const files = Array.from(e.dataTransfer.files).map(f => ({ name: f.name, size: f.size > 1024 * 1024 ? `${(f.size / (1024 * 1024)).toFixed(1)} MB` : `${(f.size / 1024).toFixed(0)} KB`, type: f.type }));
                                            setAttachments(prev => [...prev, ...files]);
                                        }}
                                        className="flex flex-col items-center justify-center gap-2 py-7 px-4 cursor-pointer rounded-xl transition-all group"
                                        style={{ border: "2px dashed #d4d0f7", background: "#faf9ff" }}
                                    >
                                        <input type="file" ref={fileInputRef} className="hidden" multiple onChange={e => { if (e.target.files) { const newFiles = Array.from(e.target.files).map(f => ({ name: f.name, size: f.size > 1024 * 1024 ? `${(f.size / (1024 * 1024)).toFixed(1)} MB` : `${(f.size / 1024).toFixed(0)} KB`, type: f.type })); setAttachments(prev => [...prev, ...newFiles]); } }} />
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform" style={{ background: "#ede9ff" }}>
                                            <CloudArrowUp className="w-6 h-6" style={{ color: "#6c63ff" }} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[13px] font-semibold text-zinc-700">Choose a file or drag &amp; drop it here.</p>
                                            <p className="text-[11px] mt-0.5" style={{ color: "#9896b8" }}>PDF, DOCX, PNG, JPEG, XLSX – Up to 50MB</p>
                                        </div>
                                        <button type="button" onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }} className="mt-1 rounded-lg bg-black px-4 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-zinc-800">
                                            Browse files
                                        </button>
                                    </div>
                                    {attachments.length > 0 && (
                                        <div className="mt-2 space-y-1.5 max-h-28 overflow-y-auto">
                                            {attachments.map((file, idx) => (
                                                <div key={idx} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: "#f5f3ff", border: "1px solid #e6e3ff" }}>
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <File className="w-3.5 h-3.5 shrink-0" style={{ color: "#6c63ff" }} />
                                                        <span className="truncate text-[12px] text-zinc-700 font-medium">{file.name}</span>
                                                        <span className="text-[10px] shrink-0" style={{ color: "#9896b8" }}>({file.size})</span>
                                                    </div>
                                                    <button type="button" onClick={e => { e.stopPropagation(); setAttachments(prev => prev.filter((_, i) => i !== idx)); }} className="ml-2 p-0.5 rounded text-zinc-300 hover:text-red-400 transition-colors">
                                                        <Trash className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-[12px] font-semibold text-zinc-700 mb-1.5">Description</label>
                                    <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Describe the event or add clinical notes here!" rows={3} className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-[13px] bg-white text-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-400/30 hover:border-zinc-300 transition-all placeholder:text-zinc-400 resize-none" />
                                </div>

                                {/* 3-button footer */}
                                <div style={{ height: 1, background: "#f2f1f8" }} className="mt-1" />
                                <div className="flex items-center gap-2">
                                    <button type="button" onClick={onClose} className={blackButtonMutedCls}>Cancel</button>
                                    <button type="button" onClick={() => { setPatientName(""); setDoctor(""); setNurse(""); setNotes(""); setAttachments([]); setPriority("Medium"); setCategory("Shared"); }} className={blackButtonMutedCls}>Reset Data</button>
                                    <div className="flex-1" />
                                    <button type="button" onClick={handleBack} className={blackButtonMutedCls}>
                                        <ArrowLeft className="w-3.5 h-3.5" /> Back
                                    </button>
                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit" className={blackButtonCls}>
                                        <Plus className="w-4 h-4" /> Save Event
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </motion.div>
        </div>
    );
}

export function CalendarPage() {
    const today = new Date();
    const [year, setYear] = React.useState(today.getFullYear());
    const [month, setMonth] = React.useState(today.getMonth());
    const [viewMode, setViewMode] = React.useState<"month" | "week" | "day">("month");
    const [activeFilter, setActiveFilter] = React.useState("All events");
    const [selectedDay, setSelectedDay] = React.useState<number | null>(today.getDate());
    const [showModal, setShowModal] = React.useState(false);
    const [detailModalDay, setDetailModalDay] = React.useState<number | null>(null);
    const [eventMap, setEventMap] = React.useState<DayEvents>({ ...EVENTS_BY_DAY });

    function handleAddEvent(day: number, event: CalendarEvent) {
        setEventMap(prev => ({
            ...prev,
            [day]: [...(prev[day] || []), event],
        }));
    }

    const selectedDate = React.useMemo(() => new Date(year, month, selectedDay ?? 1), [year, month, selectedDay]);
    const weekStart = React.useMemo(() => getWeekStartDate(selectedDate), [selectedDate]);
    const weekDates = React.useMemo(() => Array.from({ length: 7 }, (_, idx) => addDays(weekStart, idx)), [weekStart]);

    const eventMatchesFilter = React.useCallback((event: CalendarEvent) => {
        return activeFilter === "All events" || getEventCategory(event) === activeFilter;
    }, [activeFilter]);

    const daysInMonth = getDaysInMonth(year, month);
    const firstDayIdx = getFirstDayOfMonth(year, month);   // 0 = Mon
    const totalCells = Math.ceil((firstDayIdx + daysInMonth) / 7) * 7;

    function updateSelectedDate(date: Date) {
        setYear(date.getFullYear());
        setMonth(date.getMonth());
        setSelectedDay(date.getDate());
    }

    function prevPeriod() {
        if (viewMode === "month") {
            const targetMonth = month === 0 ? 11 : month - 1;
            const targetYear = month === 0 ? year - 1 : year;
            setYear(targetYear);
            setMonth(targetMonth);
            setSelectedDay(prev => Math.min(prev ?? 1, getDaysInMonth(targetYear, targetMonth)));
            return;
        }
        const offset = viewMode === "week" ? -7 : -1;
        updateSelectedDate(addDays(selectedDate, offset));
    }

    function nextPeriod() {
        if (viewMode === "month") {
            const targetMonth = month === 11 ? 0 : month + 1;
            const targetYear = month === 11 ? year + 1 : year;
            setYear(targetYear);
            setMonth(targetMonth);
            setSelectedDay(prev => Math.min(prev ?? 1, getDaysInMonth(targetYear, targetMonth)));
            return;
        }
        const offset = viewMode === "week" ? 7 : 1;
        updateSelectedDate(addDays(selectedDate, offset));
    }

    function goToday() {
        updateSelectedDate(today);
    }

    const headerLabel = viewMode === "month"
        ? `${MONTHS[month]} ${year}`
        : viewMode === "week"
            ? `${format(weekDates[0], "MMM d")} - ${format(weekDates[6], "MMM d, yyyy")}`
            : format(selectedDate, "MMMM d, yyyy");

    const filters = ["All events", "Shared", "Public", "Archived"];
    const selectedEvents = selectedDay != null ? (eventMap[selectedDay] || []).filter(eventMatchesFilter) : [];

    return (
        <div className="flex flex-col gap-5 py-6">

            {/* ── Toolbar ─────────────────────────────────────── */}
            <div className="flex items-start justify-between">
                {/* Left: title + filters */}
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Calendar</h2>
                    <div className="flex items-center gap-1">
                        {filters.map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={cn(
                                    "px-3 py-1 rounded-full text-[12px] font-medium transition-colors",
                                    activeFilter === f
                                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                                        : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: search + nav + today + view toggle + add */}
                <div className="flex items-center gap-2">
                    {/* Period navigation */}
                    <div className="flex items-center gap-0.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-0.5">
                        <button onClick={prevPeriod} className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
                            <CaretLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 px-2">{headerLabel}</span>
                        <button onClick={nextPeriod} className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
                            <CaretRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Today button */}
                    <button onClick={goToday} className="px-3 py-1.5 text-xs font-medium border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                        Today
                    </button>

                    {/* View toggle — pill tabs */}
                    <div className="relative flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
                        {(["Month", "Week", "Day"] as const).map((mode) => {
                            const isActive = viewMode === mode.toLowerCase();
                            return (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode.toLowerCase() as "month" | "week" | "day")}
                                    className={cn(
                                        "relative z-10 px-3 py-1 rounded-md text-xs font-semibold transition-all duration-200",
                                        isActive
                                            ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                                            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                                    )}
                                >
                                    {mode}
                                </button>
                            );
                        })}
                    </div>

                    {/* Add event */}
                    <motion.button
                        onClick={() => setShowModal(true)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-gray-700 text-white dark:text-black dark:bg-white dark:hover:bg-gray-200 rounded-md text-xs font-semibold shadow-md shadow-gray-200 dark:shadow-none transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add event
                    </motion.button>
                </div>
            </div>

            {/* ── Calendar View ────────────────────────────────────── */}
            <div className="rounded-xl border border-zinc-100 dark:border-zinc-800/60 overflow-hidden">
                {viewMode === "month" && (
                    <>
                        {/* Day-of-week header */}
                        <div className="grid grid-cols-7 border-b border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/80 dark:bg-zinc-900">
                            {WEEK_DAYS.map(day => (
                                <div key={day} className="py-3 text-center text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider border-r border-zinc-100 dark:border-zinc-800/60 last:border-r-0">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Month cells */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${year}-${month}`}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.18 }}
                                className="grid grid-cols-7"
                            >
                                {Array.from({ length: totalCells }).map((_, idx) => {
                                    const dayNum = idx - firstDayIdx + 1;
                                    const isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;
                                    const isToday = isCurrentMonth && dayNum === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                                    const isPast = isCurrentMonth && !isToday && (
                                        year < today.getFullYear() ||
                                        (year === today.getFullYear() && month < today.getMonth()) ||
                                        (year === today.getFullYear() && month === today.getMonth() && dayNum < today.getDate())
                                    );
                                    const isSelected = isCurrentMonth && dayNum === selectedDay;
                                    const events = (isCurrentMonth && eventMap[dayNum]?.filter(eventMatchesFilter)) || [];
                                    const MAX_VISIBLE = 2;
                                    const extra = events.length - MAX_VISIBLE;

                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => isCurrentMonth && (setSelectedDay(dayNum), setDetailModalDay(dayNum))}
                                            className={cn(
                                                "min-h-[90px] border-b border-r border-zinc-100 dark:border-zinc-800/60 last:border-r-0 p-2 group cursor-pointer transition-colors",
                                                !isCurrentMonth && "bg-zinc-50/60 dark:bg-zinc-900/30",
                                                isCurrentMonth && "hover:bg-zinc-50 dark:hover:bg-zinc-900/30",
                                                isSelected && !isToday && "bg-blue-50/40 dark:bg-blue-900/10",
                                            )}
                                        >
                                            <div className="flex items-center justify-end mb-1.5">
                                                <span className={cn(
                                                    "w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold transition-colors",
                                                    !isCurrentMonth && "text-zinc-300 dark:text-zinc-700",
                                                    isCurrentMonth && !isToday && "text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100",
                                                    isToday && "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900",
                                                )}>
                                                    {dayNum > 0 && dayNum <= daysInMonth ? dayNum : (dayNum <= 0 ? getDaysInMonth(year, month - 1) + dayNum : dayNum - daysInMonth)}
                                                </span>
                                            </div>

                                            {isCurrentMonth && (
                                                <div className="flex flex-col gap-0.5">
                                                    {events.slice(0, MAX_VISIBLE).map(ev => (
                                                        <EventPill key={ev.id} event={ev} isPast={isPast} />
                                                    ))}
                                                    {extra > 0 && (
                                                        <div className="text-[10px] font-semibold text-zinc-400 pl-1.5 cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300">
                                                            {extra} more...
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </motion.div>
                        </AnimatePresence>
                    </>
                )}

                {viewMode === "week" && (
                    <div>
                        <div className="grid grid-cols-7 border-b border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/80 dark:bg-zinc-900">
                            {weekDates.map(date => (
                                <div key={date.toISOString()} className="py-3 text-center text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider border-r border-zinc-100 dark:border-zinc-800/60 last:border-r-0">
                                    <div>{WEEK_DAYS[(date.getDay() + 6) % 7]}</div>
                                    <div className="mt-1 text-sm font-bold text-zinc-900 dark:text-zinc-100">{date.getDate()}</div>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7">
                            {weekDates.map(date => {
                                const dayNum = date.getDate();
                                const isCurrentMonth = date.getMonth() === month;
                                const isSelected = date.toDateString() === selectedDate.toDateString();
                                const events = (isCurrentMonth && eventMap[dayNum]?.filter(eventMatchesFilter)) || [];
                                return (
                                    <div
                                        key={date.toISOString()}
                                        onClick={() => {
                                            updateSelectedDate(date);
                                            setDetailModalDay(dayNum);
                                        }}
                                        className={cn(
                                            "min-h-[160px] border-b border-r border-zinc-100 dark:border-zinc-800/60 p-3 cursor-pointer transition-colors",
                                            !isCurrentMonth && "bg-zinc-50/60 dark:bg-zinc-900/30",
                                            isSelected && "bg-blue-50/40 dark:bg-blue-900/10",
                                            "hover:bg-zinc-50 dark:hover:bg-zinc-900/30"
                                        )}
                                    >
                                        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">{format(date, "MMM d")}</div>
                                        <div className="space-y-1">
                                            {events.length > 0 ? (
                                                events.map(ev => <EventPill key={ev.id} event={ev} isPast={date.toDateString() !== today.toDateString() && date < today} />)
                                            ) : (
                                                <div className="text-xs text-zinc-400">No events</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {viewMode === "day" && (
                    <div className="p-6">
                        <div className="mb-4 border-b border-zinc-100 dark:border-zinc-800/60 pb-3">
                            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">{format(selectedDate, "EEEE")}</div>
                            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{format(selectedDate, "MMMM d, yyyy")}</div>
                        </div>
                        <div className="space-y-3">
                            {((eventMap[selectedDate.getDate()] || []).filter(eventMatchesFilter)).length > 0 ? (
                                ((eventMap[selectedDate.getDate()] || []).filter(eventMatchesFilter)).map(ev => {
                                    const c = COLOR_MAP[ev.color] ?? COLOR_MAP.blue;
                                    const prio = ev.priority ? PRIORITY_CONFIG[ev.priority] : null;
                                    return (
                                        <div key={ev.id} className={cn("rounded-3xl border p-4", c.bg, c.text, "border-transparent")}> 
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="text-sm font-semibold">{ev.title}</div>
                                                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">{ev.time}</div>
                                            </div>
                                            {ev.location && <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-300">{ev.location}</div>}
                                            {prio && (
                                                <div className={cn("mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold", prio.bg, prio.color)}>
                                                    <prio.icon className="w-3 h-3" /> {prio.label}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                                    No events scheduled for this day.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Selected Day Panel (mini bottom bar) ─────────────── */}
            <AnimatePresence>
                {selectedDay != null && selectedEvents.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="shrink-0 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800/60 px-6 py-3 flex items-center gap-6 overflow-x-auto no-scrollbar"
                    >
                        <div className="flex items-center gap-2 shrink-0">
                            <Clock className="w-3.5 h-3.5 text-zinc-400" />
                            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                                {MONTHS[month].slice(0, 3)} {selectedDay}
                            </span>
                        </div>
                        {selectedEvents.map(ev => {
                            const c = COLOR_MAP[ev.color] ?? COLOR_MAP.blue;
                            const prio = ev.priority ? PRIORITY_CONFIG[ev.priority] : null;
                            return (
                                <div key={ev.id} className={cn("flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0", c.bg, c.text)}>
                                    <span className={cn("w-2 h-2 rounded-full", c.dot)} />
                                    <div className="flex flex-col">
                                        <span>{ev.title}</span>
                                        <div className="flex items-center gap-2 mt-0.5 opacity-70 text-[10px]">
                                            <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{ev.time}</span>
                                            {prio && (
                                                <span className={cn("flex items-center gap-1 font-black uppercase tracking-widest", prio.color)}>
                                                    <prio.icon className="w-2.5 h-2.5" weight="bold" /> {prio.label}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {ev.assignees && ev.assignees.length > 0 && (
                                        <div className="flex -space-x-2 ml-1">
                                            {ev.assignees.map((s, i) => (
                                                <Avatar key={i} className="size-6 border-2 border-white dark:border-zinc-950 ring-1 ring-zinc-200/50 dark:ring-zinc-800/50">
                                                    <AvatarImage src={s.avatar} alt={s.name} />
                                                    <AvatarFallback className="text-[8px]">{s.name[0]}</AvatarFallback>
                                                </Avatar>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <AddEventModal
                        onClose={() => setShowModal(false)}
                        onAdd={handleAddEvent}
                        defaultDay={selectedDay || today.getDate()}
                        defaultMonth={month}
                        defaultYear={year}
                    />
                )}
                {detailModalDay != null && (
                    <DayDetailModal
                        day={detailModalDay}
                        month={month}
                        year={year}
                        events={(eventMap[detailModalDay] || []).filter(eventMatchesFilter)}
                        onClose={() => setDetailModalDay(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function DayDetailModal({ day, month, year, events, onClose }: {
    day: number;
    month: number;
    year: number;
    events: CalendarEvent[];
    onClose: () => void;
}) {
    const [showAllEvents, setShowAllEvents] = React.useState(false);
    const selectedDate = new Date(year, month, day);
    const primaryEvent = events[0];
    const extraEvents = events.slice(1);

    const renderEventCard = (ev: CalendarEvent) => {
        const c = COLOR_MAP[ev.color] ?? COLOR_MAP.blue;
        const prio = ev.priority ? PRIORITY_CONFIG[ev.priority] : null;
        const badgeColor = ev.category === "Shared"
            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
            : ev.category === "Public"
                ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";

        return (
            <div key={ev.id} className={cn("rounded-3xl border p-5 shadow-sm", c.bg, c.text, "border-transparent")}> 
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 truncate">{ev.title}</p>
                                <div className="mt-2 grid gap-2 text-sm text-zinc-600 dark:text-zinc-300 sm:grid-cols-2">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                        <Clock className="w-3.5 h-3.5" /> {ev.time}{ev.endTime ? ` - ${ev.endTime}` : ""}
                                    </span>
                                    {ev.location && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                            <MapPin className="w-3.5 h-3.5" /> {ev.location}
                                        </span>
                                    )}
                                    {ev.patientName && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                            Patient: {ev.patientName}
                                        </span>
                                    )}
                                    {ev.nurse && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                            Nurse: {ev.nurse}
                                        </span>
                                    )}
                                    {ev.attendees != null && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                            <Users className="w-3.5 h-3.5" /> {ev.attendees} attendee{ev.attendees === 1 ? "" : "s"}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]", badgeColor)}>{ev.category ?? "Shared"}</span>
                                {prio && (
                                    <span className={cn("inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold", prio.bg, prio.color)}>
                                        <prio.icon className="w-3 h-3" /> {prio.label}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            {ev.report && (
                                <div className="rounded-3xl bg-white/80 dark:bg-zinc-950/80 p-4 border border-zinc-100 dark:border-zinc-800">
                                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Report</p>
                                    <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">{ev.report}</p>
                                </div>
                            )}
                            {ev.notes && (
                                <div className="rounded-3xl bg-white/80 dark:bg-zinc-950/80 p-4 border border-zinc-100 dark:border-zinc-800">
                                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Notes</p>
                                    <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">{ev.notes}</p>
                                </div>
                            )}
                            {ev.assignees && ev.assignees.length > 0 && (
                                <div className="rounded-3xl bg-white/80 dark:bg-zinc-950/80 p-4 border border-zinc-100 dark:border-zinc-800">
                                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Assigned staff</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {ev.assignees.map((s, i) => (
                                            <div key={i} className="flex items-center gap-2 rounded-2xl bg-zinc-100 px-3 py-2 text-xs text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                                                <Avatar className="size-6 border-2 border-white dark:border-zinc-950 ring-1 ring-zinc-200/50 dark:ring-zinc-800/50">
                                                    <AvatarImage src={s.avatar} alt={s.name} />
                                                    <AvatarFallback className="text-[8px]">{s.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0">
                                                    <p className="font-semibold truncate">{s.name}</p>
                                                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{s.role}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            );
        };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                className="relative z-10 w-full max-w-2xl rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 shadow-2xl overflow-hidden"
            >
                <div className="flex items-start justify-between gap-4 p-6 border-b border-zinc-100 dark:border-zinc-800">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">Day details</p>
                        <h2 className="mt-2 text-xl font-bold text-zinc-900 dark:text-zinc-100">{format(selectedDate, "EEEE, MMMM d, yyyy")}</h2>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{events.length} event{events.length === 1 ? "" : "s"}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-300 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    {events.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 p-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
                            No events scheduled for this day.
                        </div>
                    ) : (
                        <>
                            {events.length > 1 && (
                                <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-4">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{events.length} events scheduled</p>
                                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Tap the button to expand the full event list.</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowAllEvents(prev => !prev)}
                                            className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
                                        >
                                            {showAllEvents ? `Hide ${events.length} events` : `View all ${events.length} events`}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {primaryEvent && renderEventCard(primaryEvent)}

                            {showAllEvents && extraEvents.length > 0 && (
                                <div className="space-y-4">
                                    {extraEvents.map(ev => renderEventCard(ev))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
