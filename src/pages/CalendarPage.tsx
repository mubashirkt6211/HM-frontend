import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { format } from "date-fns";
import {
    CaretLeft, CaretRight, Plus, Clock, Users,
    X, Calendar as CalendarIcon, MapPin, TextAlignLeft,
    ShieldCheck, Warning, Info, CheckCircle
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
    time: string;
    endTime?: string;
    color: string;
    attendees?: number;
    location?: string;
    priority?: "Low" | "Medium" | "High";
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
    High: { label: "High", icon: ShieldCheck, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/50", border: "border-rose-200 dark:border-rose-800/50" },
    Medium: { label: "Medium", icon: Warning, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/50", border: "border-amber-200 dark:border-amber-800/50" },
    Low: { label: "Low", icon: Info, color: "text-sky-500", bg: "bg-sky-50 dark:bg-sky-950/50", border: "border-sky-200 dark:border-sky-800/50" },
};

const EVENTS_BY_DAY: DayEvents = {
    1: [{ id: "e1", title: "Monday standup", time: "9:00 AM", color: "blue" }],
    2: [
        { id: "e2", title: "One-on-one w/...", time: "10:00 AM", color: "green", attendees: 2, priority: "High", assignees: [MOCK_STAFF[0], MOCK_STAFF[2]] },
        { id: "e3", title: "All-hands meeti...", time: "4:00 PM", color: "purple", attendees: 12, priority: "Medium", assignees: [MOCK_STAFF[1]] },
        { id: "e4", title: "Dinner with C...", time: "7:00 PM", color: "red", priority: "Low" },
    ],
    3: [{ id: "e5", title: "Monday standup", time: "9:00 AM", color: "blue" }],
    5: [{ id: "e6", title: "Friday standup", time: "9:00 AM", color: "blue" }],
    6: [
        { id: "e7", title: "House inspe...", time: "10:30 AM", color: "orange" },
        { id: "e8", title: "Marketing site...", time: "2:30 PM", color: "green" },
    ],
    7: [{ id: "e9", title: "Monday standup", time: "9:00 AM", color: "blue" }],
    8: [
        { id: "e10", title: "One-on-one w/...", time: "11:00 AM", color: "green" },
        { id: "e11", title: "Content planni...", time: "11:00 AM", color: "purple" },
    ],
    9: [
        { id: "e12", title: "Deep work", time: "9:00 AM", color: "slate" },
        { id: "e13", title: "SEO planning", time: "1:30 PM", color: "teal" },
    ],
    10: [
        { id: "e14", title: "Lunch with...", time: "10:00 PM", color: "green", attendees: 3, priority: "Low" },
        { id: "e15", title: "Olivia x Riley", time: "10:00 AM", color: "pink", priority: "Medium", assignees: [MOCK_STAFF[0]] },
        { id: "e16", title: "Product demo", time: "1:30 PM", color: "blue", priority: "High", assignees: [MOCK_STAFF[1], MOCK_STAFF[3]] },
    ],
    11: [
        { id: "e17", title: "House inspe...", time: "10:30 AM", color: "orange" },
        { id: "e18", title: "Ava's engage...", time: "1:00 PM", color: "pink" },
    ],
    14: [
        { id: "e19", title: "Product planni...", time: "3:30 PM", color: "purple" },
    ],
    15: [
        { id: "e20", title: "Amelie's first...", time: "10:30 AM", color: "green" },
        { id: "e21", title: "All-hands meeti...", time: "4:00 PM", color: "purple" },
    ],
    16: [
        { id: "e22", title: "Half-marathon...", time: "7:00 AM", color: "red" },
        { id: "e23", title: "Coffees w/ Amelie", time: "9:30 AM", color: "green" },
        { id: "e24", title: "Design feedback...", time: "3:30 PM", color: "blue" },
    ],
    21: [
        { id: "e25", title: "Quarterly review", time: "9:00 AM", color: "purple" },
        { id: "e26", title: "Lunch with Zahra", time: "1:00 PM", color: "green" },
        { id: "e27", title: "Dinner with G...", time: "7:00 PM", color: "red" },
    ],
    22: [
        { id: "e28", title: "Deep work", time: "9:00 AM", color: "slate" },
        { id: "e29", title: "Design sync", time: "2:30 PM", color: "blue" },
    ],
    23: [
        { id: "e30", title: "Amillie coffee", time: "10:00 AM", color: "green" },
        { id: "e31", title: "All-hands meeti...", time: "4:00 PM", color: "purple" },
    ],
    28: [
        { id: "e32", title: "Content planni...", time: "11:00 AM", color: "purple" },
        { id: "e33", title: "Lunch with Alixa", time: "12:45 PM", color: "green" },
    ],
    29: [
        { id: "e34", title: "Product planni...", time: "3:30 PM", color: "purple" },
    ],
    30: [
        { id: "e35", title: "All-hands meeti...", time: "4:00 PM", color: "purple" },
        { id: "e36", title: "Team dinner", time: "6:30 PM", color: "red" },
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
    { id: "teal", label: "Teal", dot: "bg-teal-500" },
    { id: "pink", label: "Pink", dot: "bg-pink-500" },
];

function AddEventModal({ onClose, onAdd, defaultDay, defaultMonth, defaultYear }: {
    onClose: () => void;
    onAdd: (day: number, event: CalendarEvent) => void;
    defaultDay: number;
    defaultMonth: number;
    defaultYear: number;
}) {
    const [title, setTitle] = React.useState("");
    const [date, setDate] = React.useState<Date | undefined>(
        new Date(defaultYear, defaultMonth, defaultDay)
    );
    const [dateOpen, setDateOpen] = React.useState(false);
    const [startTime, setStart] = React.useState("09:00");
    const [endTime, setEnd] = React.useState("10:00");
    const [color, setColor] = React.useState("blue");
    const [location, setLocation] = React.useState("");
    const [notes, setNotes] = React.useState("");
    const [priority, setPriority] = React.useState<CalendarEvent["priority"]>("Medium");
    const [selectedStaff, setSelectedStaff] = React.useState<string[]>([]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
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
            time: fmt(startTime),
            endTime: fmt(endTime),
            color,
            location: location || undefined,
            priority,
            assignees: MOCK_STAFF.filter(s => selectedStaff.includes(s.name)),
        });
        onClose();
    }

    const inputCls = "w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all placeholder:text-zinc-400";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            />
            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative z-10 bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-100 dark:border-zinc-800 w-full max-w-md mx-4"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                            <CalendarIcon className="w-4 h-4 text-blue-600" />
                        </div>
                        <h2 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100"> Add New Event</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    {/* Title */}
                    <div>
                        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 block">Event title *</label>
                        <input
                            autoFocus
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="e.g. Team standup"
                            className={inputCls}
                            required
                        />
                    </div>

                    {/* Date + Times */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Date Picker */}
                        <div className="col-span-1">
                            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 block flex items-center gap-1">
                                <CalendarIcon className="w-3 h-3" /> Date
                            </label>
                            <Popover open={dateOpen} onOpenChange={setDateOpen}>
                                <PopoverTrigger asChild>
                                    <button
                                        type="button"
                                        className={cn(
                                            "w-full flex items-center justify-between bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-left font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400",
                                            !date && "text-zinc-400"
                                        )}
                                    >
                                        {date ? format(date, "MMM d, yyyy") : <span>Pick a date</span>}
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={(newDate) => {
                                            if (newDate) {
                                                setDate(newDate);
                                                setDateOpen(false);
                                            }
                                        }}
                                        initialFocus
                                        className="p-3"
                                        classNames={{
                                            day_selected: "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white",
                                            day_today: "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100",
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Times */}
                        <div className="grid grid-cols-2 gap-2">
                            <TimePicker value={startTime} onChange={setStart} label="Start" icon={Clock} />
                            <TimePicker value={endTime} onChange={setEnd} label="End" />
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 block flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> Location
                        </label>
                        <input
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            placeholder="Add location (optional)"
                            className={inputCls}
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 block flex items-center gap-1">
                            <TextAlignLeft className="w-3 h-3" /> Notes
                        </label>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Add notes (optional)"
                            rows={2}
                            className={cn(inputCls, "resize-none")}
                        />
                    </div>

                    {/* Priority + Staff Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 block">Priority</label>
                            <Select value={priority} onValueChange={(v: string) => setPriority(v as any)}>
                                <SelectTrigger className="h-9 text-xs rounded-lg bg-zinc-50 dark:bg-zinc-900">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl">
                                    {(["High", "Medium", "Low"] as const).map(p => (
                                        <SelectItem key={p} value={p} className="text-xs">
                                            <div className="flex items-center gap-2">
                                                <span className={cn("w-2 h-2 rounded-full", PRIORITY_CONFIG[p].color.replace("text-", "bg-"))} />
                                                {p}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 block">Assign Staff</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button
                                        type="button"
                                        className="w-full h-9 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 text-xs font-medium"
                                    >
                                        <span className="truncate">{selectedStaff.length > 0 ? `${selectedStaff.length} selected` : "Select staff"}</span>
                                        <Users className="w-3.5 h-3.5 text-zinc-400" />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-56 p-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl" align="end">
                                    <div className="flex flex-col gap-1">
                                        {MOCK_STAFF.map(s => (
                                            <button
                                                key={s.name}
                                                type="button"
                                                onClick={() => setSelectedStaff(prev => prev.includes(s.name) ? prev.filter(x => x !== s.name) : [...prev, s.name])}
                                                className={cn(
                                                    "flex items-center gap-2 w-full p-1.5 rounded-lg text-xs font-bold transition-all",
                                                    selectedStaff.includes(s.name) ? "bg-zinc-100 dark:bg-zinc-800" : "hover:bg-zinc-50 dark:hover:bg-zinc-900"
                                                )}
                                            >
                                                <Avatar className="size-5 shrink-0">
                                                    <AvatarImage src={s.avatar} />
                                                    <AvatarFallback>{s.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 text-left min-w-0">
                                                    <p className="truncate text-zinc-900 dark:text-zinc-100">{s.name}</p>
                                                    <p className="text-[9px] text-zinc-400 font-medium">{s.role}</p>
                                                </div>
                                                {selectedStaff.includes(s.name) && <CheckCircle className="w-3.5 h-3.5 text-blue-500" weight="fill" />}
                                            </button>
                                        ))}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* Color */}
                    <div>
                        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 block">Color</label>
                        <div className="flex items-center gap-2">
                            {EVENT_COLORS.map(c => (
                                <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => setColor(c.id)}
                                    className={cn(
                                        "w-6 h-6 rounded-full transition-all",
                                        c.dot,
                                        color === c.id
                                            ? "ring-2 ring-offset-2 ring-zinc-400 dark:ring-offset-zinc-950 scale-110"
                                            : "opacity-60 hover:opacity-100 hover:scale-105"
                                    )}
                                    title={c.label}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm shadow-blue-200 dark:shadow-none transition-colors flex items-center justify-center gap-1.5"
                        >
                            <Plus className="w-4 h-4" />
                            Add Event
                        </motion.button>
                    </div>
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
    const [eventMap, setEventMap] = React.useState<DayEvents>({ ...EVENTS_BY_DAY });

    function handleAddEvent(day: number, event: CalendarEvent) {
        setEventMap(prev => ({
            ...prev,
            [day]: [...(prev[day] || []), event],
        }));
    }

    const daysInMonth = getDaysInMonth(year, month);
    const firstDayIdx = getFirstDayOfMonth(year, month);   // 0 = Mon
    const totalCells = Math.ceil((firstDayIdx + daysInMonth) / 7) * 7;

    function prevMonth() {
        if (month === 0) { setYear(y => y - 1); setMonth(11); }
        else setMonth(m => m - 1);
    }
    function nextMonth() {
        if (month === 11) { setYear(y => y + 1); setMonth(0); }
        else setMonth(m => m + 1);
    }
    function goToday() {
        setYear(today.getFullYear());
        setMonth(today.getMonth());
        setSelectedDay(today.getDate());
    }

    const filters = ["All events", "Shared", "Public", "Archived"];

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
                    {/* Month navigation */}
                    <div className="flex items-center gap-0.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-0.5">
                        <button onClick={prevMonth} className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
                            <CaretLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 px-2">{MONTHS[month]} {year}</span>
                        <button onClick={nextMonth} className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
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

            {/* ── Calendar Grid ────────────────────────────────────── */}
            <div className="rounded-xl border border-zinc-100 dark:border-zinc-800/60 overflow-hidden">
                {/* Day-of-week header */}
                <div className="grid grid-cols-7 border-b border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/80 dark:bg-zinc-900">
                    {WEEK_DAYS.map(day => (
                        <div key={day} className="py-3 text-center text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider border-r border-zinc-100 dark:border-zinc-800/60 last:border-r-0">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Cells */}
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
                            const events = (isCurrentMonth && eventMap[dayNum]) || [];
                            const MAX_VISIBLE = 2;
                            const extra = events.length - MAX_VISIBLE;

                            return (
                                <div
                                    key={idx}
                                    onClick={() => isCurrentMonth && setSelectedDay(dayNum)}
                                    className={cn(
                                        "min-h-[90px] border-b border-r border-zinc-100 dark:border-zinc-800/60 last:border-r-0 p-2 group cursor-pointer transition-colors",
                                        !isCurrentMonth && "bg-zinc-50/60 dark:bg-zinc-900/30",
                                        isCurrentMonth && "hover:bg-zinc-50 dark:hover:bg-zinc-900/30",
                                        isSelected && !isToday && "bg-blue-50/40 dark:bg-blue-900/10",
                                    )}
                                >
                                    {/* Day number */}
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

                                    {/* Events */}
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
            </div>

            {/* ── Selected Day Panel (mini bottom bar) ─────────────── */}
            <AnimatePresence>
                {selectedDay && EVENTS_BY_DAY[selectedDay] && (
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
                        {(eventMap[selectedDay] || []).map(ev => {
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
            </AnimatePresence>
        </div>
    );
}
