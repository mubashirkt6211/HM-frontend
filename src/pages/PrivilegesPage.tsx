"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import {
    MagnifyingGlass, Plus, X, Eye, EyeSlash, DotsThree,
    CheckCircle, Warning, XCircle, Stethoscope, Heartbeat,
    Flask, Ambulance, Pill, UserGear, Buildings, ShieldCheck,
    UserCirclePlus, EnvelopeSimple, LockKey, Trash, ArrowsClockwise,
    Funnel, SortDescending, CaretUp, CaretDown, CaretUpDown,
    IdentificationCard, DeviceMobile, Clock, CalendarBlank,
    ArrowSquareOut, Copy, ShieldWarning, LockLaminated,
    SignIn, UserMinus, UserCheck, Key, Sliders, FunnelSimple, ArrowsDownUp, ListDashes,
} from "@phosphor-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Frame } from "@/components/ui/frame"
import { UserRole } from "@/models/user"

// ─── Types ────────────────────────────────────────────────────
interface HospitalStaff {
    id: string
    firstName: string
    lastName: string
    email: string
    role: UserRole
    department: string
    specialty?: string
    employeeId: string
    status: "active" | "pending" | "suspended"
    avatar?: string
    joinDate: string
    lastLogin: string
    passwordSet: boolean
    emailVerified: boolean
    twoFactorEnabled: boolean
    passwordLastChanged: string
    loginCount: number
    phone?: string
    ipAddress?: string
    sessionActive: boolean
}

type SortField = "name" | "role" | "department" | "status" | "lastLogin" | "joinDate"
type SortDir = "asc" | "desc"



// ─── Constants ────────────────────────────────────────────────
const DEPARTMENTS = [
    "Administration", "Cardiology", "Neurology", "Oncology",
    "Pathology", "Emergency", "Pharmacy", "Radiology", "Pediatrics", "Orthopedics",
]

const ROLE_META: Record<UserRole, { label: string; shortLabel: string; icon: any; bg: string; text: string; border: string }> = {
    [UserRole.ADMIN]: { label: "Admin", shortLabel: "Admin", icon: ShieldCheck, bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
    [UserRole.DOCTOR]: { label: "Doctor", shortLabel: "Doctor", icon: Stethoscope, bg: "#eff6ff", text: "#2563eb", border: "#bfdbfe" },
    [UserRole.PATIENT]: { label: "Patient", shortLabel: "Patient", icon: Heartbeat, bg: "#f0f9ff", text: "#0284c7", border: "#bae6fd" },
    [UserRole.RECEPTIONIST]: { label: "Receptionist", shortLabel: "Reception", icon: Buildings, bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" },
    [UserRole.PHARMACIST]: { label: "Pharmacist", shortLabel: "Pharmacy", icon: Pill, bg: "#faf5ff", text: "#9333ea", border: "#e9d5ff" },
    [UserRole.AMBULANCE_DRIVER]: { label: "Ambulance Driver", shortLabel: "Ambulance", icon: Ambulance, bg: "#fff7ed", text: "#ea580c", border: "#fed7aa" },
    [UserRole.MANAGER]: { label: "Manager", shortLabel: "Manager", icon: UserGear, bg: "#fffbeb", text: "#d97706", border: "#fde68a" },
    [UserRole.STAFF]: { label: "Lab Technician", shortLabel: "Lab Tech", icon: Flask, bg: "#f0fdfa", text: "#0d9488", border: "#99f6e4" },
    [UserRole.USER]: { label: "New User", shortLabel: "New User", icon: UserCirclePlus, bg: "#f9fafb", text: "#6b7280", border: "#e5e7eb" },
}

// ─── Mock data ────────────────────────────────────────────────
const MOCK_STAFF: HospitalStaff[] = [
    { id: "1", firstName: "Dr. Jonathan", lastName: "Harker", email: "j.harker@hms.hospital", role: UserRole.ADMIN, department: "Administration", employeeId: "ADM-001", status: "active", avatar: "https://i.pravatar.cc/200?img=12", joinDate: "Jan 10, 2020", lastLogin: "Just now", passwordSet: true, emailVerified: true, twoFactorEnabled: true, passwordLastChanged: "Feb 1, 2025", loginCount: 420, phone: "+1(555)001-0001", ipAddress: "192.168.1.1", sessionActive: true },
    { id: "2", firstName: "Dr. Sarah", lastName: "Mitchell", email: "s.mitchell@hms.hospital", role: UserRole.DOCTOR, department: "Oncology", employeeId: "DOC-012", status: "active", avatar: "https://i.pravatar.cc/200?img=45", joinDate: "Mar 15, 2021", lastLogin: "2h ago", passwordSet: true, emailVerified: true, twoFactorEnabled: true, passwordLastChanged: "Jan 20, 2025", loginCount: 310, phone: "+1(555)001-0002", ipAddress: "192.168.1.5", sessionActive: false },
    { id: "3", firstName: "Dr. Marcus", lastName: "Thompson", email: "m.thompson@hms.hospital", role: UserRole.DOCTOR, department: "Neurology", employeeId: "DOC-031", status: "active", avatar: "https://i.pravatar.cc/200?img=52", joinDate: "Jun 3, 2021", lastLogin: "Yesterday", passwordSet: true, emailVerified: true, twoFactorEnabled: false, passwordLastChanged: "Sep 10, 2024", loginCount: 198, phone: "+1(555)001-0003", ipAddress: "192.168.2.3", sessionActive: false },
    { id: "4", firstName: "Elena", lastName: "Rodriguez", email: "e.rodriguez@hms.hospital", role: UserRole.RECEPTIONIST, department: "Emergency", employeeId: "REC-005", status: "active", avatar: "https://i.pravatar.cc/200?img=49", joinDate: "Feb 20, 2022", lastLogin: "30m ago", passwordSet: true, emailVerified: true, twoFactorEnabled: false, passwordLastChanged: "Dec 5, 2024", loginCount: 553, phone: "+1(555)001-0004", ipAddress: "192.168.1.8", sessionActive: true },
    { id: "5", firstName: "Dr. James", lastName: "Wilson", email: "j.wilson@hms.hospital", role: UserRole.DOCTOR, department: "Cardiology", employeeId: "DOC-008", status: "active", avatar: "https://i.pravatar.cc/200?img=14", joinDate: "Aug 5, 2020", lastLogin: "1h ago", passwordSet: true, emailVerified: true, twoFactorEnabled: true, passwordLastChanged: "Mar 3, 2025", loginCount: 389, phone: "+1(555)001-0005", ipAddress: "10.0.0.12", sessionActive: true },
    { id: "6", firstName: "Lisa", lastName: "Wong", email: "l.wong@hms.hospital", role: UserRole.PHARMACIST, department: "Pharmacy", employeeId: "PHA-003", status: "suspended", avatar: "https://i.pravatar.cc/200?img=26", joinDate: "Nov 12, 2022", lastLogin: "Mar 10, 2024", passwordSet: true, emailVerified: true, twoFactorEnabled: false, passwordLastChanged: "Mar 10, 2024", loginCount: 102, phone: "+1(555)001-0006", ipAddress: "—", sessionActive: false },
    { id: "7", firstName: "Carlos", lastName: "Mendez", email: "c.mendez@hms.hospital", role: UserRole.AMBULANCE_DRIVER, department: "Emergency", employeeId: "AMB-007", status: "active", avatar: "https://i.pravatar.cc/200?img=21", joinDate: "Sep 1, 2022", lastLogin: "4h ago", passwordSet: true, emailVerified: true, twoFactorEnabled: false, passwordLastChanged: "Nov 14, 2024", loginCount: 276, phone: "+1(555)001-0007", ipAddress: "192.168.3.7", sessionActive: false },
    { id: "8", firstName: "Priya", lastName: "Sharma", email: "p.sharma@hms.hospital", role: UserRole.STAFF, department: "Pathology", employeeId: "LAB-011", status: "active", avatar: "https://i.pravatar.cc/200?img=47", joinDate: "Jan 7, 2023", lastLogin: "Today", passwordSet: true, emailVerified: false, twoFactorEnabled: false, passwordLastChanged: "Jan 7, 2023", loginCount: 88, phone: "+1(555)001-0008", ipAddress: "192.168.1.22", sessionActive: true },
    { id: "9", firstName: "Dr. Emma", lastName: "Clarke", email: "e.clarke@hms.hospital", role: UserRole.DOCTOR, department: "Radiology", employeeId: "DOC-022", status: "active", avatar: "https://i.pravatar.cc/200?img=44", joinDate: "Apr 18, 2021", lastLogin: "3h ago", passwordSet: true, emailVerified: true, twoFactorEnabled: true, passwordLastChanged: "Feb 28, 2025", loginCount: 445, phone: "+1(555)001-0009", ipAddress: "10.0.0.8", sessionActive: false },
    { id: "10", firstName: "Robert", lastName: "Chen", email: "r.chen@hms.hospital", role: UserRole.MANAGER, department: "Administration", employeeId: "MGR-002", status: "active", avatar: "https://i.pravatar.cc/200?img=33", joinDate: "Dec 1, 2020", lastLogin: "Yesterday", passwordSet: true, emailVerified: true, twoFactorEnabled: true, passwordLastChanged: "Mar 1, 2025", loginCount: 305, phone: "+1(555)001-0010", ipAddress: "10.0.0.3", sessionActive: false },
    { id: "11", firstName: "Alex", lastName: "Thompson", email: "", role: UserRole.USER, department: "—", employeeId: "NEW-001", status: "pending", joinDate: "Apr 8, 2024", lastLogin: "Just now", passwordSet: false, emailVerified: false, twoFactorEnabled: false, passwordLastChanged: "—", loginCount: 0, sessionActive: false },
    { id: "12", firstName: "Natasha", lastName: "Rivera", email: "", role: UserRole.USER, department: "—", employeeId: "NEW-002", status: "pending", avatar: "https://i.pravatar.cc/200?img=29", joinDate: "Apr 8, 2024", lastLogin: "5m ago", passwordSet: false, emailVerified: false, twoFactorEnabled: false, passwordLastChanged: "—", loginCount: 0, sessionActive: false },
    { id: "13", firstName: "Omar", lastName: "Farooq", email: "", role: UserRole.USER, department: "—", employeeId: "NEW-003", status: "pending", joinDate: "Apr 7, 2024", lastLogin: "1h ago", passwordSet: false, emailVerified: false, twoFactorEnabled: false, passwordLastChanged: "—", loginCount: 0, sessionActive: false },
]

// ─── Helpers ──────────────────────────────────────────────────
const AVATAR_COLORS = [
    { bg: "#dbeafe", tx: "#1e40af" }, { bg: "#dcfce7", tx: "#166534" },
    { bg: "#fce7f3", tx: "#9d174d" }, { bg: "#fef3c7", tx: "#92400e" },
    { bg: "#ede9fe", tx: "#6d28d9" }, { bg: "#ffedd5", tx: "#9a3412" },
    { bg: "#cffafe", tx: "#155e75" }, { bg: "#fdf4ff", tx: "#86198f" },
]
const avatarColor = (name: string) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
const initials = (s: HospitalStaff) => {
    const parts = `${s.firstName} ${s.lastName}`.split(" ")
    return (parts[0][0] + (parts[parts.length - 1][0] || "")).toUpperCase().replace("D", "").slice(0, 2) || parts[0][0]
}

function credHealth(s: HospitalStaff): "healthy" | "at_risk" | "critical" {
    if (s.status === "pending") return "critical"
    if (s.status === "suspended") return "critical"
    if (!s.twoFactorEnabled) return "at_risk"
    if (!s.emailVerified) return "at_risk"
    return "healthy"
}

const HEALTH_META = {
    healthy: { label: "Healthy", icon: CheckCircle, cls: "text-emerald-600 bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
    at_risk: { label: "At Risk", icon: ShieldWarning, cls: "text-amber-600   bg-amber-50   border-amber-200", dot: "bg-amber-400 animate-pulse" },
    critical: { label: "Critical", icon: XCircle, cls: "text-rose-600    bg-rose-50    border-rose-200", dot: "bg-rose-500" },
}

// ─── Credential Drawer ────────────────────────────────────────
function CredentialDrawer({
    staff, onClose, onUpdate,
}: {
    staff: HospitalStaff
    onClose: () => void
    onUpdate: (id: string, patch: Partial<HospitalStaff>) => void
}) {
    const [tab, setTab] = useState<"overview" | "credentials" | "sessions">("overview")
    const [showPwd, setShowPwd] = useState(false)
    const [newPwd, setNewPwd] = useState("")
    const [email, setEmail] = useState(staff.email)
    const [saving, setSaving] = useState(false)
    const rm = ROLE_META[staff.role]
    const RoleIcon = rm.icon
    const health = credHealth(staff)
    const hm = HEALTH_META[health]
    const ac = avatarColor(`${staff.firstName} ${staff.lastName}`)

    const handleSave = async () => {
        setSaving(true)
        await new Promise(r => setTimeout(r, 600))
        onUpdate(staff.id, { email, ...(newPwd ? { passwordSet: true } : {}) })
        setSaving(false)
        setNewPwd("")
    }

    return (
        <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed inset-y-0 right-0 z-40 w-[420px] bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col"
        >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
                <Avatar className="size-10">
                    <AvatarImage src={staff.avatar} />
                    <AvatarFallback className="text-[13px] font-semibold" style={{ background: ac.bg, color: ac.tx }}>
                        {initials(staff)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-zinc-900 dark:text-white leading-none truncate">
                        {staff.firstName} {staff.lastName}
                    </p>
                    <p className="text-[12px] text-zinc-400 mt-0.5 truncate">{staff.employeeId} · {staff.department}</p>
                </div>
                <span className={cn("flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full border", hm.cls)}>
                    <hm.icon weight="fill" className="w-3 h-3" />
                    {hm.label}
                </span>
                <button onClick={onClose} className="ml-1 p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                    <X className="w-4 h-4" weight="bold" />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-0 border-b border-zinc-100 dark:border-zinc-800 shrink-0 px-5">
                {(["overview", "credentials", "sessions"] as const).map(t => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={cn(
                            "py-3 px-1 mr-5 text-[12.5px] font-medium border-b-2 transition-all capitalize",
                            tab === t
                                ? "border-zinc-900 dark:border-white text-zinc-900 dark:text-white"
                                : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                        )}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* ── OVERVIEW ── */}
                {tab === "overview" && (
                    <div className="p-5 space-y-5">
                        {/* Role & Status row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
                                <p className="text-[10.5px] font-medium text-zinc-400 uppercase tracking-wider mb-2">Role</p>
                                <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-lg" style={{ background: rm.bg, color: rm.text }}>
                                    <RoleIcon weight="fill" className="w-3.5 h-3.5" />
                                    {rm.label}
                                </span>
                            </div>
                            <div className="p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
                                <p className="text-[10.5px] font-medium text-zinc-400 uppercase tracking-wider mb-2">Status</p>
                                <span className={cn(
                                    "inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-lg border",
                                    staff.status === "active" ? "bg-emerald-50  text-emerald-700 border-emerald-200" :
                                        staff.status === "pending" ? "bg-amber-50    text-amber-700   border-amber-200" :
                                            "bg-rose-50     text-rose-700    border-rose-200"
                                )}>
                                    <span className={cn("size-1.5 rounded-full", staff.status === "active" ? "bg-emerald-500" : staff.status === "pending" ? "bg-amber-400 animate-pulse" : "bg-rose-500")} />
                                    {staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}
                                </span>
                            </div>
                        </div>

                        {/* Credential health breakdown */}
                        <div>
                            <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2.5">Security Checklist</p>
                            <div className="space-y-2">
                                {[
                                    { label: "Password configured", ok: staff.passwordSet, fix: "Set password" },
                                    { label: "Email verified", ok: staff.emailVerified, fix: "Send verification" },
                                    { label: "2FA enabled", ok: staff.twoFactorEnabled, fix: "Enable 2FA" },
                                    { label: "Account active", ok: staff.status === "active", fix: "Activate account" },
                                ].map(({ label, ok, fix }) => (
                                    <div key={label} className="flex items-center justify-between py-2 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                                        <div className="flex items-center gap-2.5">
                                            {ok
                                                ? <CheckCircle weight="fill" className="w-4 h-4 text-emerald-500 shrink-0" />
                                                : <XCircle weight="fill" className="w-4 h-4 text-rose-400    shrink-0" />
                                            }
                                            <span className="text-[12.5px] font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
                                        </div>
                                        {!ok && (
                                            <button
                                                onClick={() => setTab("credentials")}
                                                className="text-[11px] font-semibold text-blue-600 hover:underline"
                                            >
                                                {fix} →
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Details */}
                        <div>
                            <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2.5">Details</p>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: "Employee ID", value: staff.employeeId },
                                    { label: "Department", value: staff.department },
                                    { label: "Joined", value: staff.joinDate },
                                    { label: "Last Login", value: staff.lastLogin },
                                    { label: "Login Count", value: String(staff.loginCount) },
                                    { label: "Pwd Changed", value: staff.passwordLastChanged },
                                ].map(({ label, value }) => (
                                    <div key={label}>
                                        <p className="text-[10.5px] text-zinc-400 mb-0.5">{label}</p>
                                        <p className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">{value || "—"}</p>
                                    </div>
                                ))}
                            </div>
                            {staff.phone && (
                                <div className="mt-3">
                                    <p className="text-[10.5px] text-zinc-400 mb-0.5">Phone</p>
                                    <p className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">{staff.phone}</p>
                                </div>
                            )}
                        </div>

                        {/* Quick actions */}
                        <div className="flex gap-2 pt-1">
                            <button
                                onClick={() => onUpdate(staff.id, { status: staff.status === "suspended" ? "active" : "suspended" })}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12.5px] font-medium border transition-colors",
                                    staff.status === "suspended"
                                        ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                        : "border-rose-200 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/10"
                                )}
                            >
                                {staff.status === "suspended" ? <UserCheck weight="fill" className="w-4 h-4" /> : <UserMinus weight="fill" className="w-4 h-4" />}
                                {staff.status === "suspended" ? "Reinstate" : "Suspend"}
                            </button>
                            <button
                                onClick={() => setTab("credentials")}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12.5px] font-medium bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
                            >
                                <Key weight="fill" className="w-4 h-4" />
                                Manage Credentials
                            </button>
                        </div>
                    </div>
                )}

                {/* ── CREDENTIALS ── */}
                {tab === "credentials" && (
                    <div className="p-5 space-y-5">
                        {staff.status === "pending" && (
                            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-[12.5px] text-amber-800 dark:text-amber-300">
                                <Warning weight="fill" className="w-4 h-4 mt-0.5 shrink-0" />
                                <span>This user hasn't been provisioned yet. Set credentials to activate their account.</span>
                            </div>
                        )}

                        {/* Email */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Hospital Email</label>
                                {staff.emailVerified
                                    ? <span className="text-[10.5px] font-semibold text-emerald-600 flex items-center gap-1"><CheckCircle weight="fill" className="w-3 h-3" />Verified</span>
                                    : <span className="text-[10.5px] font-semibold text-amber-500 flex items-center gap-1"><Warning weight="fill" className="w-3 h-3" />Unverified</span>
                                }
                            </div>
                            <div className="relative">
                                <EnvelopeSimple className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <input
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="firstname.lastname@hms.hospital"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-[13.5px] font-medium outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all placeholder:text-zinc-400 text-zinc-900 dark:text-zinc-100"
                                />
                            </div>
                            {!staff.emailVerified && email && (
                                <button className="text-[11.5px] font-semibold text-blue-600 hover:underline mt-0.5">
                                    → Send verification email
                                </button>
                            )}
                        </div>

                        {/* Role */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Role</label>
                            <select
                                defaultValue={staff.role}
                                onChange={e => onUpdate(staff.id, { role: e.target.value as UserRole })}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-[13.5px] font-medium text-zinc-900 dark:text-zinc-100 outline-none focus:border-zinc-400 transition-all"
                            >
                                {Object.entries(ROLE_META)
                                    .filter(([r]) => r !== UserRole.USER && r !== UserRole.PATIENT)
                                    .map(([r, m]) => <option key={r} value={r}>{m.label}</option>)
                                }
                            </select>
                        </div>

                        {/* Department */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Department</label>
                            <select
                                defaultValue={staff.department}
                                onChange={e => onUpdate(staff.id, { department: e.target.value })}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-[13.5px] font-medium text-zinc-900 dark:text-zinc-100 outline-none focus:border-zinc-400 transition-all"
                            >
                                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                    {staff.passwordSet ? "Reset Password" : "Set Password"}
                                </label>
                                {staff.passwordSet && (
                                    <span className="text-[10.5px] text-zinc-400">Last changed: {staff.passwordLastChanged}</span>
                                )}
                            </div>
                            <div className="relative">
                                <LockKey className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <input
                                    type={showPwd ? "text" : "password"}
                                    value={newPwd}
                                    onChange={e => setNewPwd(e.target.value)}
                                    placeholder={staff.passwordSet ? "Enter new password to reset…" : "Set initial password…"}
                                    className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-[13.5px] font-medium outline-none focus:border-zinc-400 transition-all placeholder:text-zinc-400 text-zinc-900 dark:text-zinc-100"
                                />
                                <button type="button" onClick={() => setShowPwd(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                                    {showPwd ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {newPwd && newPwd.length < 8 && (
                                <p className="text-[11px] text-amber-500">Password must be at least 8 characters</p>
                            )}
                        </div>

                        {/* 2FA */}
                        <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                            <div className="flex items-center gap-2.5">
                                <DeviceMobile weight="duotone" className={cn("w-5 h-5", staff.twoFactorEnabled ? "text-emerald-600" : "text-zinc-400")} />
                                <div>
                                    <p className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-200">Two-factor authentication</p>
                                    <p className="text-[11px] text-zinc-400">{staff.twoFactorEnabled ? "Enabled — TOTP app linked" : "Not configured"}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => onUpdate(staff.id, { twoFactorEnabled: !staff.twoFactorEnabled })}
                                className={cn(
                                    "text-[11.5px] font-semibold px-3 py-1.5 rounded-lg border transition-colors",
                                    staff.twoFactorEnabled
                                        ? "border-rose-200 text-rose-600 hover:bg-rose-50"
                                        : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                )}
                            >
                                {staff.twoFactorEnabled ? "Revoke" : "Enable"}
                            </button>
                        </div>

                        {/* Save */}
                        <div className="flex gap-2 pt-1">
                            <button
                                onClick={handleSave}
                                disabled={saving || (!email && !newPwd)}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold transition-all",
                                    saving || (!email && !newPwd)
                                        ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                                        : "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100"
                                )}
                            >
                                {saving ? <ArrowsClockwise className="w-4 h-4 animate-spin" /> : <CheckCircle weight="fill" className="w-4 h-4" />}
                                {saving ? "Saving…" : staff.status === "pending" ? "Provision & Activate" : "Save Changes"}
                            </button>
                        </div>
                    </div>
                )}

                {/* ── SESSIONS ── */}
                {tab === "sessions" && (
                    <div className="p-5 space-y-4">
                        <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-200">Current Session</p>
                                {staff.sessionActive
                                    ? <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />Online
                                    </span>
                                    : <span className="text-[11px] font-medium text-zinc-400">Offline</span>
                                }
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-[12px]">
                                <div><p className="text-zinc-400 mb-0.5">IP Address</p><p className="font-medium text-zinc-700 dark:text-zinc-300 font-mono">{staff.ipAddress || "—"}</p></div>
                                <div><p className="text-zinc-400 mb-0.5">Last Seen</p><p className="font-medium text-zinc-700 dark:text-zinc-300">{staff.lastLogin}</p></div>
                                <div><p className="text-zinc-400 mb-0.5">Total Logins</p><p className="font-medium text-zinc-700 dark:text-zinc-300">{staff.loginCount}</p></div>
                                <div><p className="text-zinc-400 mb-0.5">Join Date</p><p className="font-medium text-zinc-700 dark:text-zinc-300">{staff.joinDate}</p></div>
                            </div>
                        </div>
                        {staff.sessionActive && (
                            <button
                                onClick={() => onUpdate(staff.id, { sessionActive: false })}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold border border-rose-200 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/10 transition-colors"
                            >
                                <SignIn weight="fill" className="w-4 h-4" />
                                Terminate Active Session
                            </button>
                        )}
                        <div className="p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800 text-center space-y-1.5">
                            <p className="text-[12px] text-zinc-400">Audit log coming soon</p>
                            <p className="text-[11px] text-zinc-300 dark:text-zinc-600">Full login history & activity trail</p>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    )
}



// ─── Table ────────────────────────────────────────────────────
const TABLE_COLS: { key: SortField | ""; label: string; width: string; sortable?: boolean }[] = [
    { key: "name", label: "Personnel", width: "minmax(220px,1fr)", sortable: true },
    { key: "role", label: "Role", width: "160px", sortable: true },
    { key: "department", label: "Department", width: "150px", sortable: true },
    { key: "", label: "Credentials", width: "160px" },
    { key: "status", label: "Status", width: "120px", sortable: true },
    { key: "lastLogin", label: "Last Login", width: "120px", sortable: true },
    { key: "joinDate", label: "Joined", width: "110px", sortable: true },
    { key: "", label: "", width: "80px" },
]

function SortIcon({ isSorted }: { isSorted: false | "asc" | "desc" }) {
    if (!isSorted) return <CaretUpDown className="w-3 h-3 text-zinc-300 dark:text-zinc-700" />
    return isSorted === "asc"
        ? <CaretUp weight="fill" className="w-3 h-3 text-zinc-700 dark:text-zinc-200" />
        : <CaretDown weight="fill" className="w-3 h-3 text-zinc-700 dark:text-zinc-200" />
}

const getColumns = (
    onUpdate: (id: string, patch: Partial<HospitalStaff>) => void,
    onViewCredentials: (id: string) => void,
    onOnboard: (id: string) => void
): ColumnDef<HospitalStaff>[] => [
        {
            accessorKey: "name",
            header: "Personnel",
            filterFn: (row, id, value) => {
                const s = row.original
                const q = value.toLowerCase()
                return `${s.firstName} ${s.lastName} ${s.email} ${s.employeeId}`.toLowerCase().includes(q)
            },
            cell: ({ row }) => {
                const s = row.original
                const ac = avatarColor(`${s.firstName} ${s.lastName}`)
                const isPending = s.status === "pending"
                return (
                    <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                            <Avatar className="size-8">
                                <AvatarImage src={s.avatar} />
                                <AvatarFallback className="text-[11px] font-semibold" style={{ background: ac.bg, color: ac.tx }}>
                                    {initials(s)}
                                </AvatarFallback>
                            </Avatar>
                            {isPending && <span className="absolute -top-0.5 -right-0.5 size-2 bg-amber-400 rounded-full border-2 border-white dark:border-zinc-950 animate-pulse" />}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100 truncate">
                                    {s.firstName} {s.lastName}
                                </span>
                                {isPending && (
                                    <span className="text-[9px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-900/50 uppercase tracking-wider shrink-0">
                                        New
                                    </span>
                                )}
                            </div>
                            <span className="text-[11px] text-zinc-400 truncate">
                                {isPending ? "Provisioning required" : s.email}
                            </span>
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: "role",
            header: "Role",
            filterFn: "arrIncludesSome",
            cell: ({ row }) => {
                const rm = ROLE_META[row.original.role]
                const RIcon = rm.icon
                return (
                    <span
                        className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1 rounded-md"
                        style={{ background: rm.bg, color: rm.text }}
                    >
                        <RIcon weight="fill" className="w-3.5 h-3.5 shrink-0" />
                        {rm.shortLabel}
                    </span>
                )
            },
        },
        {
            accessorKey: "department",
            header: "Department",
            filterFn: "arrIncludesSome",
            cell: ({ row }) => <span className="text-[13px] text-zinc-700 dark:text-zinc-300">{row.original.department}</span>,
        },
        {
            id: "credentials",
            header: "Credentials",
            cell: ({ row }) => {
                const s = row.original
                return (
                    <div className="flex items-center gap-1.5">
                        <span title={s.passwordSet ? "Password set" : "No password"} className={cn(
                            "inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded",
                            s.passwordSet
                                ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30"
                                : "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30"
                        )}>
                            {s.passwordSet ? <span className="text-emerald-500">✓</span> : <span className="text-rose-500">✕</span>}
                            Pwd
                        </span>
                        <span title={s.twoFactorEnabled ? "2FA enabled" : "No 2FA"} className={cn(
                            "inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded",
                            s.twoFactorEnabled
                                ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30"
                                : "text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800"
                        )}>
                            {s.twoFactorEnabled ? <span className="text-emerald-500">✓</span> : <span className="text-zinc-400">✕</span>}
                            2FA
                        </span>
                    </div>
                )
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            filterFn: "arrIncludesSome",
            cell: ({ row }) => {
                const s = row.original
                return (
                    <span className={cn(
                        "inline-flex items-center gap-1 text-[12px] font-medium px-2 py-0.5 rounded",
                        s.status === "active" && "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30",
                        s.status === "pending" && "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30",
                        s.status === "suspended" && "text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800",
                    )}>
                        {s.status === "active" && <span className="text-emerald-500">✓</span>}
                        {s.status === "pending" && <span className="text-amber-500">•</span>}
                        {s.status === "suspended" && <span className="text-zinc-400">✕</span>}
                        {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                    </span>
                )
            },
        },
        {
            accessorKey: "lastLogin",
            header: "Last Login",
            cell: ({ row }) => {
                const s = row.original
                return (
                    <div className="flex flex-col">
                        <span className="text-[13px] text-zinc-700 dark:text-zinc-300">{s.lastLogin}</span>
                        {s.sessionActive && (
                            <span className="text-[11px] text-emerald-600 flex items-center gap-1 mt-0.5">
                                <span className="size-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />Online
                            </span>
                        )}
                    </div>
                )
            },
        },
        {
            accessorKey: "joinDate",
            header: "Joined",
            cell: ({ row }) => <span className="text-[13px] text-zinc-500 dark:text-zinc-400">{row.original.joinDate}</span>,
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const s = row.original
                const isPending = s.status === "pending"
                return (
                    <div className="text-right">
                        {isPending ? (
                            <button
                                onClick={e => { e.stopPropagation(); onOnboard(s.id) }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-lg text-[12px] font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-95"
                            >
                                <UserCirclePlus weight="fill" className="w-3.5 h-3.5" />
                                Onboard
                            </button>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        onClick={e => e.stopPropagation()}
                                        className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <DotsThree className="w-4 h-4" weight="bold" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 p-1 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-lg">
                                    <DropdownMenuItem
                                        onClick={e => { e.stopPropagation(); onViewCredentials(s.id) }}
                                        className="text-[12px] font-medium rounded-lg gap-2 px-2.5 py-2 cursor-pointer"
                                    >
                                        <IdentificationCard weight="duotone" className="w-4 h-4 text-zinc-400" />
                                        View Credentials
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={e => { e.stopPropagation(); onViewCredentials(s.id) }}
                                        className="text-[12px] font-medium rounded-lg gap-2 px-2.5 py-2 cursor-pointer"
                                    >
                                        <LockLaminated weight="duotone" className="w-4 h-4 text-zinc-400" />
                                        Reset Password
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-[12px] font-medium rounded-lg gap-2 px-2.5 py-2 cursor-pointer">
                                        <ShieldCheck weight="duotone" className="w-4 h-4 text-zinc-400" />
                                        Audit Logs
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="my-0.5" />
                                    <DropdownMenuItem
                                        onClick={e => { e.stopPropagation(); onUpdate(s.id, { status: s.status === "suspended" ? "active" : "suspended" }) }}
                                        className="text-[12px] font-medium rounded-lg gap-2 px-2.5 py-2 cursor-pointer text-amber-600 focus:text-amber-600 focus:bg-amber-50 dark:focus:bg-amber-950/20"
                                    >
                                        {s.status === "suspended" ? <UserCheck weight="duotone" className="w-4 h-4" /> : <UserMinus weight="duotone" className="w-4 h-4" />}
                                        {s.status === "suspended" ? "Reinstate" : "Suspend"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-[12px] font-medium rounded-lg gap-2 px-2.5 py-2 cursor-pointer text-rose-500 focus:text-rose-500 focus:bg-rose-50 dark:focus:bg-rose-950/20">
                                        <Trash weight="duotone" className="w-4 h-4" />
                                        Terminate Access
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                )
            },
        },
    ]

// ─── Page ─────────────────────────────────────────────────────
export function PrivilegesPage() {
    const [staff, setStaff] = useState<HospitalStaff[]>(MOCK_STAFF)
    const [drawerStaffId, setDrawerId] = useState<string | null>(null)
    const [search, setSearch] = useState("")
    const [showSearch, setShowSearch] = useState(false)
    const [filterOpen, setFilterOpen] = useState(false)
    const [roleOpen, setRoleOpen] = useState(false)
    const [deptOpen, setDeptOpen] = useState(false)
    const [sortOpen, setSortOpen] = useState(false)
    const [statusFilter, setStatusFilter] = useState("all")
    const [roleFilter, setRoleFilter] = useState("all")
    const [deptFilter, setDeptFilter] = useState("all")
    const [sort, setSort] = useState<{ field: SortField; dir: SortDir }>({ field: "name", dir: "asc" })
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)

    const TABLE_COLS: { key: SortField | ""; label: string; width: string; sortable?: boolean }[] = [
        { key: "name", label: "Personnel", width: "minmax(220px,1fr)", sortable: true },
        { key: "role", label: "Role", width: "160px", sortable: true },
        { key: "department", label: "Department", width: "150px", sortable: true },
        { key: "", label: "Credentials", width: "160px" },
        { key: "status", label: "Status", width: "120px", sortable: true },
        { key: "lastLogin", label: "Last Login", width: "120px", sortable: true },
        { key: "joinDate", label: "Joined", width: "110px", sortable: true },
        { key: "", label: "", width: "80px" },
    ]
    const drawerStaff = drawerStaffId ? staff.find(s => s.id === drawerStaffId) ?? null : null
    const activeFilterCount = [statusFilter !== "all" ? 1 : 0, roleFilter !== "all" ? 1 : 0, deptFilter !== "all" ? 1 : 0].reduce((a, b) => a + b, 0)

    // Reset to page 1 on filter or items per page change
    useEffect(() => {
        setCurrentPage(1)
    }, [search, statusFilter, roleFilter, deptFilter, sort, itemsPerPage])

    const filtered = useMemo(() => {
        let list = staff
        if (search) {
            const q = search.toLowerCase()
            list = list.filter(s =>
                `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
                s.email.toLowerCase().includes(q) ||
                s.employeeId.toLowerCase().includes(q) ||
                s.department.toLowerCase().includes(q)
            )
        }
        if (statusFilter !== "all") list = list.filter(s => s.status === statusFilter)
        if (roleFilter !== "all") list = list.filter(s => s.role === roleFilter)
        if (deptFilter !== "all") list = list.filter(s => s.department === deptFilter)

        return [...list].sort((a, b) => {
            const dir = sort.dir === "asc" ? 1 : -1
            const nameA = `${a.firstName} ${a.lastName}`
            const nameB = `${b.firstName} ${b.lastName}`
            switch (sort.field) {
                case "name": return dir * nameA.localeCompare(nameB)
                case "role": return dir * a.role.localeCompare(b.role)
                case "department": return dir * a.department.localeCompare(b.department)
                case "status": return dir * a.status.localeCompare(b.status)
                case "lastLogin": return dir * a.lastLogin.localeCompare(b.lastLogin)
                case "joinDate": return dir * a.joinDate.localeCompare(b.joinDate)
                default: return 0
            }
        })
    }, [staff, search, statusFilter, roleFilter, deptFilter, sort])

    const paginatedStaff = useMemo(() => {
        return filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    }, [filtered, currentPage, itemsPerPage])
    const totalPages = Math.ceil(filtered.length / itemsPerPage)

    const updateStaff = (id: string, patch: Partial<HospitalStaff>) => {
        setStaff(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))
    }

    const handleOnboard = (id: string) => {
        setDrawerId(id)
    }



    return (
        <div className="flex flex-col h-full bg-white dark:bg-zinc-950 overflow-hidden">

            {/* ── HEADER ── */}
            <div className="px-8 pt-6 pb-0 shrink-0">
                <h1 className="text-[26px] font-bold text-zinc-900 dark:text-white tracking-tight">
                    Personnel Registry
                </h1>
                <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-1">
                    Manage staff credentials, roles, access levels, and account security.
                </p>

                {/* ── Actions row ── */}
                <div className="flex items-center justify-end mt-5">
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 mr-2">
                            {/* Status Filter */}
                            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                                <PopoverTrigger asChild>
                                    <button className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors", statusFilter !== "all" ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50")}>
                                        <FunnelSimple className="w-3.5 h-3.5" weight="bold" />
                                        {statusFilter === "all" ? "Status" : statusFilter.replace("-", " ")}
                                        {statusFilter !== "all" && (
                                            <span
                                                role="button"
                                                onClick={(e) => { e.stopPropagation(); setStatusFilter("all"); }}
                                                className="ml-0.5 p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </span>
                                        )}
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent align="start" className="w-44 p-1 bg-white dark:bg-[#232323] border-zinc-200 dark:border-zinc-700">
                                    <p className="px-2 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Filter Status</p>
                                    {[
                                        { id: "all", label: "All" },
                                        { id: "active", label: "Active" },
                                        { id: "pending", label: "Pending" },
                                        { id: "suspended", label: "Suspended" }
                                    ].map(s => (
                                        <button
                                            key={s.id}
                                            onClick={() => { setStatusFilter(s.id); setFilterOpen(false); }}
                                            className={cn(
                                                "w-full text-left px-2 py-1.5 rounded-sm text-[13px] transition-colors flex items-center gap-2 capitalize",
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

                            {/* Role Filter */}
                            <Popover open={roleOpen} onOpenChange={setRoleOpen}>
                                <PopoverTrigger asChild>
                                    <button className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors", roleFilter !== "all" ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50")}>
                                        <UserGear className="w-3.5 h-3.5" weight="bold" />
                                        {roleFilter === "all" ? "Role" : ROLE_META[roleFilter as UserRole]?.label || roleFilter}
                                        {roleFilter !== "all" && (
                                            <span
                                                role="button"
                                                onClick={(e) => { e.stopPropagation(); setRoleFilter("all"); }}
                                                className="ml-0.5 p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </span>
                                        )}
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent align="start" className="w-48 p-1 bg-white dark:bg-[#232323] border-zinc-200 dark:border-zinc-700">
                                    <p className="px-2 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Filter Role</p>
                                    <button
                                        onClick={() => { setRoleFilter("all"); setRoleOpen(false); }}
                                        className={cn(
                                            "w-full text-left px-2 py-1.5 rounded-sm text-[13px] transition-colors",
                                            roleFilter === "all"
                                                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium"
                                                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                        )}
                                    >
                                        All Roles
                                    </button>
                                    <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-1" />
                                    {Object.entries(ROLE_META)
                                        .filter(([r]) => r !== UserRole.USER && r !== UserRole.PATIENT)
                                        .map(([r, m]) => (
                                            <button
                                                key={r}
                                                onClick={() => { setRoleFilter(r); setRoleOpen(false); }}
                                                className={cn(
                                                    "w-full text-left px-2 py-1.5 rounded-sm text-[13px] transition-colors flex items-center gap-2",
                                                    roleFilter === r
                                                        ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium"
                                                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                                )}
                                            >
                                                <m.icon weight="fill" className="w-3.5 h-3.5" style={{ color: m.text }} />
                                                {m.label}
                                            </button>
                                        ))
                                    }
                                </PopoverContent>
                            </Popover>

                            {/* Department Filter */}
                            <Popover open={deptOpen} onOpenChange={setDeptOpen}>
                                <PopoverTrigger asChild>
                                    <button className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors", deptFilter !== "all" ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50")}>
                                        <Buildings className="w-3.5 h-3.5" weight="bold" />
                                        {deptFilter === "all" ? "Department" : deptFilter}
                                        {deptFilter !== "all" && (
                                            <span
                                                role="button"
                                                onClick={(e) => { e.stopPropagation(); setDeptFilter("all"); }}
                                                className="ml-0.5 p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </span>
                                        )}
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent align="start" className="w-56 p-1 bg-white dark:bg-[#232323] border-zinc-200 dark:border-zinc-700 max-h-[320px] overflow-y-auto">
                                    <p className="px-2 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Filter Department</p>
                                    <button
                                        onClick={() => { setDeptFilter("all"); setDeptOpen(false); }}
                                        className={cn(
                                            "w-full text-left px-2 py-1.5 rounded-sm text-[13px] transition-colors",
                                            deptFilter === "all"
                                                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium"
                                                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                        )}
                                    >
                                        All Departments
                                    </button>
                                    <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-1" />
                                    {DEPARTMENTS.sort().map(dept => (
                                        <button
                                            key={dept}
                                            onClick={() => { setDeptFilter(dept); setDeptOpen(false); }}
                                            className={cn(
                                                "w-full text-left px-2 py-1.5 rounded-sm text-[13px] transition-colors",
                                                deptFilter === dept
                                                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium"
                                                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                            )}
                                        >
                                            {dept}
                                        </button>
                                    ))}
                                </PopoverContent>
                            </Popover>

                            {/* Sort */}
                            <Popover open={sortOpen} onOpenChange={setSortOpen}>
                                <PopoverTrigger asChild>
                                    <button className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors", sort.field !== "name" || sort.dir !== "asc" ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50")}>
                                        <ArrowsDownUp className="w-3.5 h-3.5" weight="bold" />
                                        Sort
                                        {(sort.field !== "name" || sort.dir !== "asc") && (
                                            <span
                                                role="button"
                                                onClick={(e) => { e.stopPropagation(); setSort({ field: "name", dir: "asc" }); }}
                                                className="ml-0.5 p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
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
                                        { field: "joinDate", dir: "desc", label: "Newest Members", icon: CalendarBlank },
                                        { field: "lastLogin", dir: "desc", label: "Last Active", icon: Clock },
                                        { field: "role", dir: "asc", label: "Role Type", icon: ShieldCheck },
                                    ].map(opt => (
                                        <button
                                            key={opt.field + opt.dir}
                                            onClick={() => { setSort({ field: opt.field as SortField, dir: opt.dir as SortDir }); setSortOpen(false); }}
                                            className={cn(
                                                "w-full text-left px-2 py-1.5 rounded-sm text-[13px] transition-colors flex items-center gap-2",
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
                                    className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors", search ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50")}
                                >
                                    <MagnifyingGlass className="w-3.5 h-3.5" weight="bold" /> Search
                                    {search && (
                                        <span
                                            role="button"
                                            onClick={(e) => { e.stopPropagation(); setSearch(""); }}
                                            className="ml-0.5 p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
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
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search staff..."
                                        autoFocus
                                        onBlur={() => { if (!search) setShowSearch(false); }}
                                        onKeyDown={(e) => { if (e.key === "Escape") { setShowSearch(false); setSearch(""); } }}
                                        className="pl-8 pr-8 h-[30px] bg-zinc-100 dark:bg-zinc-800 border-transparent focus-visible:border-zinc-300 dark:focus-visible:border-zinc-600 text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400 text-[13px] rounded-md w-full shadow-none focus-visible:ring-0"
                                    />
                                    <button
                                        onMouseDown={(e) => { e.preventDefault(); setSearch(""); setShowSearch(false); }}
                                        className="absolute right-1.5 p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </motion.div>
                            )}
                        </div>

                        <button
                            className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[12px] font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 active:scale-[0.97] transition-all"
                        >
                            <Plus className="w-3.5 h-3.5" weight="bold" />
                            Add Staff
                        </button>
                    </div>
                </div>
            </div>

            {/* ── TABLE ── */}
            <div className="flex-1 overflow-auto mt-4 px-8 pb-8 flex flex-col">
                <Frame className="flex-1 flex flex-col overflow-hidden">
                    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden flex flex-col flex-1 min-w-[1100px]">
                        {/* Header */}
                        <div
                            className="grid items-center bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 px-4 shrink-0"
                            style={{ gridTemplateColumns: "minmax(220px, 1fr) 160px 150px 160px 120px 120px 110px 80px" }}
                        >
                            {TABLE_COLS.map((col, idx) => (
                                <div
                                    key={col.label + idx}
                                    className={cn(
                                        "py-2 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider",
                                        col.label === "" ? "text-right" : ""
                                    )}
                                >
                                    {col.label}
                                </div>
                            ))}
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto">
                            {filtered.length === 0 ? (
                                <div className="py-20 text-center">
                                    <MagnifyingGlass className="w-8 h-8 text-zinc-200 dark:text-zinc-800 mx-auto mb-2" />
                                    <p className="text-[13px] font-medium text-zinc-500">No staff members found</p>
                                    <p className="text-[12px] text-zinc-400 mt-0.5">Try adjusting your search or filters</p>
                                </div>
                            ) : paginatedStaff.map((s, i) => {
                                const rm = ROLE_META[s.role]
                                const RIcon = rm.icon
                                const ac = avatarColor(`${s.firstName} ${s.lastName}`)
                                const isSelected = drawerStaffId === s.id
                                const isPending = s.status === "pending"

                                return (
                                    <motion.div
                                        key={s.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.02, duration: 0.2 }}
                                        className={cn(
                                            "group grid items-center border-b border-zinc-100 dark:border-zinc-800 last:border-0 transition-colors px-4 cursor-pointer",
                                            isSelected ? "bg-blue-50/60 dark:bg-blue-950/20" :
                                                isPending ? "bg-amber-50/30 dark:bg-amber-950/10 hover:bg-amber-50/60" :
                                                    "hover:bg-zinc-50 dark:hover:bg-zinc-900/30"
                                        )}
                                        style={{ gridTemplateColumns: "minmax(220px, 1fr) 160px 150px 160px 120px 120px 110px 80px" }}
                                        onClick={() => setDrawerId(isSelected ? null : s.id)}
                                    >
                                        {/* Personnel */}
                                        <div className="py-3 flex items-center gap-3 pr-4">
                                            <div className="relative shrink-0">
                                                <Avatar className="size-8">
                                                    <AvatarImage src={s.avatar} />
                                                    <AvatarFallback className="text-[11px] font-semibold" style={{ background: ac.bg, color: ac.tx }}>
                                                        {initials(s)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                {isPending && <span className="absolute -top-0.5 -right-0.5 size-2 bg-amber-400 rounded-full border-2 border-white dark:border-zinc-950 animate-pulse" />}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100 truncate">
                                                        {s.firstName} {s.lastName}
                                                    </span>
                                                    {isPending && (
                                                        <span className="text-[9px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-900/50 uppercase tracking-wider shrink-0">
                                                            New
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[11px] text-zinc-400 truncate">
                                                    {isPending ? "Provisioning required" : s.email}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Role */}
                                        <div className="py-3">
                                            <span
                                                className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1 rounded-md"
                                                style={{ background: rm.bg, color: rm.text }}
                                            >
                                                <RIcon weight="fill" className="w-3.5 h-3.5 shrink-0" />
                                                {rm.shortLabel}
                                            </span>
                                        </div>

                                        {/* Department */}
                                        <div className="py-3 text-[13px] text-zinc-600 dark:text-zinc-400 truncate">
                                            {s.department}
                                        </div>

                                        {/* Credentials */}
                                        <div className="py-3 flex items-center gap-1.5">
                                            <span title={s.passwordSet ? "Password set" : "No password"} className={cn(
                                                "inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-tight",
                                                s.passwordSet
                                                    ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30"
                                                    : "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30"
                                            )}>
                                                {s.passwordSet ? <CheckCircle weight="fill" className="w-3 h-3" /> : <XCircle weight="fill" className="w-3 h-3" />}
                                                Pwd
                                            </span>
                                            <span title={s.twoFactorEnabled ? "2FA enabled" : "No 2FA"} className={cn(
                                                "inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-tight",
                                                s.twoFactorEnabled
                                                    ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30"
                                                    : "text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800"
                                            )}>
                                                {s.twoFactorEnabled ? <CheckCircle weight="fill" className="w-3 h-3" /> : <ShieldWarning weight="fill" className="w-3 h-3" />}
                                                2FA
                                            </span>
                                        </div>

                                        {/* Status */}
                                        <div className="py-3">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 text-[12px] font-medium px-2 py-0.5 rounded",
                                                s.status === "active" && "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30",
                                                s.status === "pending" && "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30",
                                                s.status === "suspended" && "text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800",
                                            )}>
                                                <span className={cn("size-1.5 rounded-full", s.status === "active" ? "bg-emerald-500" : s.status === "pending" ? "bg-amber-400 animate-pulse" : "bg-zinc-400")} />
                                                {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                                            </span>
                                        </div>

                                        {/* Last Login */}
                                        <div className="py-3 text-[12px] text-zinc-500 dark:text-zinc-400">
                                            {s.lastLogin}
                                        </div>

                                        {/* Joined */}
                                        <div className="py-3 text-[12px] text-zinc-400">
                                            {s.joinDate}
                                        </div>

                                        {/* Actions */}
                                        <div className="py-3 flex justify-end pr-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button
                                                        onClick={e => e.stopPropagation()}
                                                        className="p-1.5 rounded-lg text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <DotsThree weight="bold" className="w-5 h-5" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 p-1 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl">
                                                    <DropdownMenuItem
                                                        onClick={e => { e.stopPropagation(); setDrawerId(s.id) }}
                                                        className="text-[12px] font-medium rounded-lg gap-2 px-2.5 py-2 cursor-pointer"
                                                    >
                                                        <IdentificationCard weight="duotone" className="w-4 h-4 text-zinc-400" />
                                                        View Credentials
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-[12px] font-medium rounded-lg gap-2 px-2.5 py-2 cursor-pointer">
                                                        <ShieldCheck weight="duotone" className="w-4 h-4 text-zinc-400" />
                                                        Audit Logs
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="my-0.5" />
                                                    <DropdownMenuItem
                                                        onClick={e => { e.stopPropagation(); updateStaff(s.id, { status: s.status === "suspended" ? "active" : "suspended" }) }}
                                                        className="text-[12px] font-medium rounded-lg gap-2 px-2.5 py-2 cursor-pointer text-amber-600 focus:text-amber-600 focus:bg-amber-50 dark:focus:bg-amber-950/20"
                                                    >
                                                        {s.status === "suspended" ? <UserCheck weight="duotone" className="w-4 h-4" /> : <UserMinus weight="duotone" className="w-4 h-4" />}
                                                        {s.status === "suspended" ? "Reinstate" : "Suspend"}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-[12px] font-medium rounded-lg gap-2 px-2.5 py-2 cursor-pointer text-rose-500 focus:text-rose-500 focus:bg-rose-50 dark:focus:bg-rose-950/20">
                                                        <Trash weight="duotone" className="w-4 h-4" />
                                                        Terminate Access
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
                                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} members
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                className="px-2.5 py-1.5 rounded-md text-[13px] font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                            >
                                Previous
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setCurrentPage(p)}
                                        className={cn(
                                            "w-7 h-7 rounded-md text-[13px] font-medium flex items-center justify-center transition-colors",
                                            currentPage === p
                                                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                                                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                        )}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                className="px-2.5 py-1.5 rounded-md text-[13px] font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── CREDENTIAL DRAWER BACKDROP ── */}
            <AnimatePresence>
                {drawerStaff && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDrawerId(null)}
                            className="fixed inset-0 z-30 bg-zinc-900/20 dark:bg-zinc-950/50 backdrop-blur-[2px]"
                        />
                        <CredentialDrawer
                            staff={drawerStaff}
                            onClose={() => setDrawerId(null)}
                            onUpdate={updateStaff}
                        />
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}