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
    SignIn, UserMinus, UserCheck, Key, Sliders,
} from "@phosphor-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

interface FilterState {
    roles: UserRole[]
    departments: string[]
    statuses: ("active" | "pending" | "suspended")[]
    credentialHealth: ("healthy" | "at_risk" | "critical")[]
    lastLoginRange: "any" | "today" | "week" | "month" | "never"
    passwordStatus: "any" | "set" | "not_set"
    twoFactor: "any" | "enabled" | "disabled"
}

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

// ─── Filter Panel ─────────────────────────────────────────────
function FilterPanel({
    filters, onChange, onClear, onClose
}: {
    filters: FilterState
    onChange: (f: Partial<FilterState>) => void
    onClear: () => void
    onClose: () => void
}) {
    const toggleArr = <T,>(arr: T[], val: T): T[] =>
        arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]

    const ChipGroup = <T extends string>({
        label, options, active, onToggle,
    }: {
        label: string
        options: { value: T; label: string; color?: string }[]
        active: T[]
        onToggle: (v: T) => void
    }) => (
        <div className="space-y-2">
            <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{label}</p>
            <div className="flex flex-wrap gap-1.5">
                {options.map(({ value, label: lbl, color }) => (
                    <button
                        key={value}
                        onClick={() => onToggle(value)}
                        className={cn(
                            "px-2.5 py-1 rounded-lg text-[12px] font-medium border transition-all",
                            active.includes(value)
                                ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white"
                                : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600"
                        )}
                    >
                        {lbl}
                    </button>
                ))}
            </div>
        </div>
    )

    const RadioGroup = <T extends string>({
        label, options, active, onChange: onCh,
    }: {
        label: string
        options: { value: T; label: string }[]
        active: T
        onChange: (v: T) => void
    }) => (
        <div className="space-y-2">
            <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{label}</p>
            <div className="flex flex-wrap gap-1.5">
                {options.map(({ value, label: lbl }) => (
                    <button
                        key={value}
                        onClick={() => onCh(value)}
                        className={cn(
                            "px-2.5 py-1 rounded-lg text-[12px] font-medium border transition-all",
                            active === value
                                ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white"
                                : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400"
                        )}
                    >
                        {lbl}
                    </button>
                ))}
            </div>
        </div>
    )

    return (
        <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-[360px] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl z-30 overflow-hidden"
        >
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                <p className="text-[13px] font-semibold text-zinc-900 dark:text-white">Filters</p>
                <div className="flex items-center gap-2">
                    <button onClick={onClear} className="text-[12px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">Clear all</button>
                    <button onClick={onClose} className="p-1 rounded-md text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900">
                        <X className="w-3.5 h-3.5" weight="bold" />
                    </button>
                </div>
            </div>
            <div className="p-4 space-y-4 max-h-[480px] overflow-y-auto">
                <ChipGroup
                    label="Status"
                    options={[
                        { value: "active", label: "Active" },
                        { value: "pending", label: "Pending" },
                        { value: "suspended", label: "Suspended" },
                    ] as { value: "active" | "pending" | "suspended"; label: string }[]}
                    active={filters.statuses}
                    onToggle={v => onChange({ statuses: toggleArr(filters.statuses, v) })}
                />
                <ChipGroup
                    label="Credential Health"
                    options={[
                        { value: "healthy", label: "Healthy" },
                        { value: "at_risk", label: "At Risk" },
                        { value: "critical", label: "Critical" },
                    ] as { value: "healthy" | "at_risk" | "critical"; label: string }[]}
                    active={filters.credentialHealth}
                    onToggle={v => onChange({ credentialHealth: toggleArr(filters.credentialHealth, v) })}
                />
                <ChipGroup
                    label="Role"
                    options={[
                        { value: UserRole.ADMIN, label: "Admin" },
                        { value: UserRole.DOCTOR, label: "Doctor" },
                        { value: UserRole.RECEPTIONIST, label: "Reception" },
                        { value: UserRole.PHARMACIST, label: "Pharmacy" },
                        { value: UserRole.AMBULANCE_DRIVER, label: "Ambulance" },
                        { value: UserRole.MANAGER, label: "Manager" },
                        { value: UserRole.STAFF, label: "Lab Tech" },
                        { value: UserRole.USER, label: "New User" },
                    ]}
                    active={filters.roles}
                    onToggle={v => onChange({ roles: toggleArr(filters.roles, v) })}
                />
                <ChipGroup
                    label="Department"
                    options={DEPARTMENTS.map(d => ({ value: d, label: d }))}
                    active={filters.departments}
                    onToggle={v => onChange({ departments: toggleArr(filters.departments, v) })}
                />
                <RadioGroup
                    label="Password Status"
                    options={[
                        { value: "any", label: "Any" },
                        { value: "set", label: "Set" },
                        { value: "not_set", label: "Not Set" },
                    ] as { value: "any" | "set" | "not_set"; label: string }[]}
                    active={filters.passwordStatus}
                    onChange={v => onChange({ passwordStatus: v })}
                />
                <RadioGroup
                    label="2FA"
                    options={[
                        { value: "any", label: "Any" },
                        { value: "enabled", label: "Enabled" },
                        { value: "disabled", label: "Disabled" },
                    ] as { value: "any" | "enabled" | "disabled"; label: string }[]}
                    active={filters.twoFactor}
                    onChange={v => onChange({ twoFactor: v })}
                />
                <RadioGroup
                    label="Last Login"
                    options={[
                        { value: "any", label: "Any time" },
                        { value: "today", label: "Today" },
                        { value: "week", label: "This week" },
                        { value: "month", label: "This month" },
                        { value: "never", label: "Never" },
                    ] as { value: "any" | "today" | "week" | "month" | "never"; label: string }[]}
                    active={filters.lastLoginRange}
                    onChange={v => onChange({ lastLoginRange: v })}
                />
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

function SortIcon({ field, sort }: { field: string; sort: { field: SortField; dir: SortDir } }) {
    if (!field) return null
    if (sort.field !== field) return <CaretUpDown className="w-3 h-3 text-zinc-300 dark:text-zinc-700" />
    return sort.dir === "asc"
        ? <CaretUp weight="fill" className="w-3 h-3 text-zinc-700 dark:text-zinc-200" />
        : <CaretDown weight="fill" className="w-3 h-3 text-zinc-700 dark:text-zinc-200" />
}

// ─── Page ─────────────────────────────────────────────────────
export function PrivilegesPage() {
    const [staff, setStaff] = useState<HospitalStaff[]>(MOCK_STAFF)
    const [drawerStaffId, setDrawerId] = useState<string | null>(null)
    const [search, setSearch] = useState("")
    const [searchOpen, setSearchOpen] = useState(false)
    const [filterOpen, setFilterOpen] = useState(false)
    const [sort, setSort] = useState<{ field: SortField; dir: SortDir }>({ field: "name", dir: "asc" })
    const [filters, setFilters] = useState<FilterState>({
        roles: [], departments: [], statuses: [],
        credentialHealth: [],
        lastLoginRange: "any", passwordStatus: "any", twoFactor: "any",
    })

    const filterRef = useRef<HTMLDivElement>(null)
    const drawerStaff = drawerStaffId ? staff.find(s => s.id === drawerStaffId) ?? null : null

    const activeFilterCount = [
        filters.roles.length,
        filters.departments.length,
        filters.statuses.length,
        filters.credentialHealth.length,
        filters.lastLoginRange !== "any" ? 1 : 0,
        filters.passwordStatus !== "any" ? 1 : 0,
        filters.twoFactor !== "any" ? 1 : 0,
    ].reduce((a, b) => a + b, 0)

    const filtered = useMemo(() => {
        let list = staff
        if (search) {
            const q = search.toLowerCase()
            list = list.filter(s =>
                `${s.firstName} ${s.lastName} ${s.email} ${s.department} ${s.employeeId}`.toLowerCase().includes(q)
            )
        }
        if (filters.statuses.length) list = list.filter(s => filters.statuses.includes(s.status))
        if (filters.roles.length) list = list.filter(s => filters.roles.includes(s.role))
        if (filters.departments.length) list = list.filter(s => filters.departments.includes(s.department))
        if (filters.credentialHealth.length) list = list.filter(s => filters.credentialHealth.includes(credHealth(s)))
        if (filters.passwordStatus === "set") list = list.filter(s => s.passwordSet)
        if (filters.passwordStatus === "not_set") list = list.filter(s => !s.passwordSet)
        if (filters.twoFactor === "enabled") list = list.filter(s => s.twoFactorEnabled)
        if (filters.twoFactor === "disabled") list = list.filter(s => !s.twoFactorEnabled)

        return [...list].sort((a, b) => {
            const dir = sort.dir === "asc" ? 1 : -1
            switch (sort.field) {
                case "name": return dir * (`${a.firstName} ${a.lastName}`).localeCompare(`${b.firstName} ${b.lastName}`)
                case "role": return dir * a.role.localeCompare(b.role)
                case "department": return dir * a.department.localeCompare(b.department)
                case "status": return dir * a.status.localeCompare(b.status)
                case "lastLogin": return dir * a.lastLogin.localeCompare(b.lastLogin)
                case "joinDate": return dir * a.joinDate.localeCompare(b.joinDate)
                default: return 0
            }
        })
    }, [staff, search, filters, sort])

    const toggleSort = (field: SortField) => {
        setSort(prev => prev.field === field
            ? { field, dir: prev.dir === "asc" ? "desc" : "asc" }
            : { field, dir: "asc" }
        )
    }

    const updateStaff = (id: string, patch: Partial<HospitalStaff>) => {
        setStaff(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))
        if (patch.status === "active" && drawerStaffId === id) {
            // keep drawer open after provisioning
        }
    }

    const handleOnboard = (id: string) => {
        setDrawerId(id)
    }

    // Stats
    const total = staff.length
    const active = staff.filter(s => s.status === "active").length
    const pending = staff.filter(s => s.status === "pending").length
    const suspended = staff.filter(s => s.status === "suspended").length
    const atRisk = staff.filter(s => credHealth(s) === "at_risk").length
    const critical = staff.filter(s => credHealth(s) === "critical").length

    const STATS = [
        { label: "Total Staff", value: total, cls: "text-zinc-900 dark:text-white" },
        { label: "Active", value: active, cls: "text-emerald-600" },
        { label: "Pending", value: pending, cls: "text-amber-600" },
        { label: "Suspended", value: suspended, cls: "text-rose-600" },
        { label: "At Risk", value: atRisk, cls: "text-amber-600" },
        { label: "Needs Action", value: critical, cls: "text-rose-600" },
    ]

    return (
        <div className="flex flex-col h-full bg-white dark:bg-zinc-950 overflow-hidden">

            {/* ── TOP BAR ── */}
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-900 shrink-0">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-[20px] font-bold text-zinc-900 dark:text-white tracking-tight">Personnel Registry</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[12px] font-medium text-zinc-500">{total} members registry</span>
                            <span className="size-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
                            {pending > 0 && (
                                <span className="text-[12px] font-semibold text-amber-600">{pending} pending onboarding</span>
                            )}
                        </div>
                    </div>

                    {/* Action bar */}
                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <div className={cn(
                            "flex items-center gap-2 px-3 h-9 rounded-xl border transition-all",
                            searchOpen
                                ? "w-56 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950"
                                : "w-9 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                        )}
                            onClick={() => !searchOpen && setSearchOpen(true)}
                        >
                            <MagnifyingGlass className={cn("w-4 h-4 shrink-0 transition-colors", searchOpen ? "text-zinc-600 dark:text-zinc-300" : "text-zinc-500")} />
                            {searchOpen && (
                                <input
                                    autoFocus
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    onBlur={() => { if (!search) setSearchOpen(false) }}
                                    placeholder="Search registry…"
                                    className="flex-1 text-[13px] bg-transparent outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 font-medium"
                                />
                            )}
                            {search && (
                                <button onClick={e => { e.stopPropagation(); setSearch(""); setSearchOpen(false) }} className="text-zinc-400 hover:text-zinc-600">
                                    <X className="w-3.5 h-3.5" weight="bold" />
                                </button>
                            )}
                        </div>

                        <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-800" />

                        {/* Sort */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-[12.5px] font-medium text-zinc-500 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                                    <SortDescending className="w-4 h-4" />
                                    Sort
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-lg border-zinc-200 dark:border-zinc-800">
                                {(["name", "role", "department", "status", "lastLogin", "joinDate"] as SortField[]).map(f => (
                                    <DropdownMenuItem key={f} onClick={() => toggleSort(f)} className="text-[12.5px] font-medium gap-2 capitalize">
                                        {sort.field === f && <CaretDown className={cn("w-3 h-3", sort.dir === "asc" && "rotate-180")} />}
                                        {f === "lastLogin" ? "Last Login" : f === "joinDate" ? "Join Date" : f.charAt(0).toUpperCase() + f.slice(1)}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Filter */}
                        <div className="relative" ref={filterRef}>
                            <button
                                onClick={() => setFilterOpen(p => !p)}
                                className={cn(
                                    "flex items-center gap-1.5 h-9 px-3 rounded-xl text-[12.5px] font-medium border transition-colors",
                                    filterOpen || activeFilterCount > 0
                                        ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white"
                                        : "text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-700 dark:hover:text-zinc-300"
                                )}
                            >
                                <Funnel className="w-4 h-4" weight={filterOpen || activeFilterCount > 0 ? "fill" : "regular"} />
                                Filter
                                {activeFilterCount > 0 && (
                                    <span className="ml-0.5 size-5 rounded-full bg-white/20 dark:bg-zinc-950/20 text-[11px] font-bold flex items-center justify-center">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>
                            <AnimatePresence>
                                {filterOpen && (
                                    <FilterPanel
                                        filters={filters}
                                        onChange={patch => setFilters(prev => ({ ...prev, ...patch }))}
                                        onClear={() => setFilters({ roles: [], departments: [], statuses: [], credentialHealth: [], lastLoginRange: "any", passwordStatus: "any", twoFactor: "any" })}
                                        onClose={() => setFilterOpen(false)}
                                    />
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-800" />

                        <button className="flex items-center gap-2 h-9 px-4 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-[12.5px] font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 active:scale-95 transition-all shadow-sm">
                            <Plus className="w-3.5 h-3.5" weight="bold" />
                            Add Staff
                        </button>
                    </div>
                </div>

                {/* Stats strip */}
                <div className="flex items-center gap-4">
                    {STATS.map(({ label, value, cls }) => (
                        <div key={label} className="flex items-center gap-1.5">
                            <span className={cn("text-[14px] font-bold tabular-nums", cls)}>{value}</span>
                            <span className="text-[11.5px] text-zinc-400 font-medium">{label}</span>
                            <span className="w-px h-3 bg-zinc-200 dark:bg-zinc-800 last:hidden ml-2" />
                        </div>
                    ))}

                    {/* Active filter chips */}
                    {activeFilterCount > 0 && (
                        <div className="ml-auto flex items-center gap-1.5">
                            {filters.statuses.map(s => (
                                <span key={s} className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                                    {s} <button onClick={() => setFilters(p => ({ ...p, statuses: p.statuses.filter(x => x !== s) }))}><X className="w-2.5 h-2.5" weight="bold" /></button>
                                </span>
                            ))}
                            {filters.roles.map(r => (
                                <span key={r} className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                                    {ROLE_META[r].shortLabel} <button onClick={() => setFilters(p => ({ ...p, roles: p.roles.filter(x => x !== r) }))}><X className="w-2.5 h-2.5" weight="bold" /></button>
                                </span>
                            ))}
                            {filters.twoFactor !== "any" && (
                                <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                                    2FA: {filters.twoFactor} <button onClick={() => setFilters(p => ({ ...p, twoFactor: "any" }))}><X className="w-2.5 h-2.5" weight="bold" /></button>
                                </span>
                            )}
                            {filters.passwordStatus !== "any" && (
                                <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                                    Pwd: {filters.passwordStatus} <button onClick={() => setFilters(p => ({ ...p, passwordStatus: "any" }))}><X className="w-2.5 h-2.5" weight="bold" /></button>
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ── TABLE ── */}
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse min-w-[1100px]">
                    <thead className="sticky top-0 z-10 bg-zinc-50/90 dark:bg-zinc-900/90 backdrop-blur-sm">
                        <tr className="border-b border-zinc-100 dark:border-zinc-800">
                            {TABLE_COLS.map(col => (
                                <th
                                    key={col.label + col.key}
                                    className={cn(
                                        "py-3 px-4 text-[10.5px] font-semibold text-zinc-400 uppercase tracking-[0.12em] whitespace-nowrap first:pl-6 last:pr-6",
                                        col.sortable && "cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300 select-none"
                                    )}
                                    onClick={() => col.sortable && col.key && toggleSort(col.key as SortField)}
                                >
                                    <span className="inline-flex items-center gap-1.5">
                                        {col.label}
                                        {col.sortable && col.key && <SortIcon field={col.key} sort={sort} />}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="py-24 text-center">
                                    <MagnifyingGlass className="w-10 h-10 text-zinc-200 dark:text-zinc-800 mx-auto mb-3" />
                                    <p className="text-[14px] font-semibold text-zinc-500">No results found</p>
                                    <p className="text-[12.5px] text-zinc-400 mt-1">Try adjusting your search or filters</p>
                                </td>
                            </tr>
                        ) : filtered.map(s => {
                            const rm = ROLE_META[s.role]
                            const RIcon = rm.icon
                            const ac = avatarColor(`${s.firstName} ${s.lastName}`)
                            const health = credHealth(s)
                            const hm = HEALTH_META[health]
                            const isPending = s.status === "pending"
                            const isSelected = drawerStaffId === s.id

                            return (
                                <tr
                                    key={s.id}
                                    className={cn(
                                        "group border-b border-zinc-50 dark:border-zinc-900 last:border-0 cursor-pointer transition-colors",
                                        isSelected ? "bg-zinc-50 dark:bg-zinc-900/50" :
                                            isPending ? "bg-amber-50/30 dark:bg-amber-950/10 hover:bg-amber-50/50" :
                                                "hover:bg-zinc-50/60 dark:hover:bg-zinc-900/20"
                                    )}
                                    onClick={() => setDrawerId(isSelected ? null : s.id)}
                                >
                                    {/* Personnel */}
                                    <td className="py-3.5 pl-6 pr-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative shrink-0">
                                                <Avatar className="size-9">
                                                    <AvatarImage src={s.avatar} />
                                                    <AvatarFallback className="text-[12px] font-semibold" style={{ background: ac.bg, color: ac.tx }}>
                                                        {initials(s)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                {isPending && <span className="absolute -top-0.5 -right-0.5 size-2.5 bg-amber-400 rounded-full border-2 border-white dark:border-zinc-950 animate-pulse" />}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[13.5px] font-semibold text-zinc-900 dark:text-white truncate">
                                                        {s.firstName} {s.lastName}
                                                    </span>
                                                    {isPending && (
                                                        <span className="text-[9.5px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-900/50 uppercase tracking-wider shrink-0">
                                                            New Entry
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[12px] text-zinc-400 truncate mt-0.5">
                                                    {isPending ? "System provisioning required" : s.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Role */}
                                    <td className="py-3.5 px-4">
                                        <span
                                            className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1 rounded-lg border"
                                            style={{ background: rm.bg, color: rm.text, borderColor: rm.border }}
                                        >
                                            <RIcon weight="fill" className="w-3.5 h-3.5 shrink-0" />
                                            {rm.shortLabel}
                                        </span>
                                    </td>

                                    {/* Department */}
                                    <td className="py-3.5 px-4">
                                        <p className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">{s.department}</p>
                                        <p className="text-[11px] text-zinc-400 mt-0.5 uppercase tracking-wide">{s.specialty || "General Duty"}</p>
                                    </td>

                                    {/* Credentials */}
                                    <td className="py-3.5 px-4">
                                        <div className="flex items-center gap-1.5">
                                            {/* Password */}
                                            <span title={s.passwordSet ? "Password set" : "No password"} className={cn(
                                                "flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 rounded-md border",
                                                s.passwordSet
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                    : "bg-rose-50 text-rose-600 border-rose-200"
                                            )}>
                                                <LockKey weight="fill" className="w-3 h-3" />
                                                {s.passwordSet ? "Set" : "None"}
                                            </span>
                                            {/* 2FA */}
                                            <span title={s.twoFactorEnabled ? "2FA enabled" : "No 2FA"} className={cn(
                                                "flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 rounded-md border",
                                                s.twoFactorEnabled
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                    : "bg-zinc-50 text-zinc-500 border-zinc-200"
                                            )}>
                                                <DeviceMobile weight="fill" className="w-3 h-3" />
                                                2FA
                                            </span>
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="py-3.5 px-4">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border",
                                            s.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                                s.status === "pending" ? "bg-amber-50   text-amber-700   border-amber-200" :
                                                    "bg-rose-50    text-rose-700    border-rose-200"
                                        )}>
                                            <span className={cn("size-1.5 rounded-full", s.status === "active" ? "bg-emerald-500" : s.status === "pending" ? "bg-amber-400 animate-pulse" : "bg-rose-500")} />
                                            {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                                        </span>
                                    </td>

                                    {/* Last Login */}
                                    <td className="py-3.5 px-4">
                                        <p className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">{s.lastLogin}</p>
                                        <p className="text-[11px] text-zinc-400 mt-0.5">
                                            {s.sessionActive
                                                ? <span className="flex items-center gap-1 text-emerald-600"><span className="size-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />Online</span>
                                                : "Offline"
                                            }
                                        </p>
                                    </td>

                                    {/* Join Date */}
                                    <td className="py-3.5 px-4">
                                        <p className="text-[12.5px] text-zinc-400 tabular-nums">{s.joinDate}</p>
                                    </td>

                                    {/* Actions */}
                                    <td className="py-3.5 pl-4 pr-6 text-right">
                                        {isPending ? (
                                            <button
                                                onClick={e => { e.stopPropagation(); handleOnboard(s.id) }}
                                                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-xl text-[12px] font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-95 shadow-sm"
                                            >
                                                <UserCirclePlus weight="fill" className="w-3.5 h-3.5" />
                                                Onboard
                                            </button>
                                        ) : (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button
                                                        onClick={e => e.stopPropagation()}
                                                        className="p-2 rounded-xl text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
                                                    >
                                                        <DotsThree className="w-5 h-5" weight="bold" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-52 p-1.5 rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl">
                                                    <DropdownMenuItem
                                                        onClick={e => { e.stopPropagation(); setDrawerId(s.id) }}
                                                        className="text-[12.5px] font-medium rounded-xl gap-2.5 px-3 py-2.5 cursor-pointer"
                                                    >
                                                        <IdentificationCard weight="duotone" className="w-4 h-4 text-zinc-400" />
                                                        View Credentials
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={e => { e.stopPropagation(); setDrawerId(s.id) }}
                                                        className="text-[12.5px] font-medium rounded-xl gap-2.5 px-3 py-2.5 cursor-pointer"
                                                    >
                                                        <LockLaminated weight="duotone" className="w-4 h-4 text-zinc-400" />
                                                        Reset Password
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-[12.5px] font-medium rounded-xl gap-2.5 px-3 py-2.5 cursor-pointer">
                                                        <ShieldCheck weight="duotone" className="w-4 h-4 text-zinc-400" />
                                                        Audit Logs
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="my-1" />
                                                    <DropdownMenuItem
                                                        onClick={e => { e.stopPropagation(); updateStaff(s.id, { status: s.status === "suspended" ? "active" : "suspended" }) }}
                                                        className="text-[12.5px] font-medium rounded-xl gap-2.5 px-3 py-2.5 cursor-pointer text-amber-600 focus:text-amber-600 focus:bg-amber-50 dark:focus:bg-amber-950/20"
                                                    >
                                                        {s.status === "suspended" ? <UserCheck weight="duotone" className="w-4 h-4" /> : <UserMinus weight="duotone" className="w-4 h-4" />}
                                                        {s.status === "suspended" ? "Reinstate" : "Suspend"}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-[12.5px] font-medium rounded-xl gap-2.5 px-3 py-2.5 cursor-pointer text-rose-500 focus:text-rose-500 focus:bg-rose-50 dark:focus:bg-rose-950/20">
                                                        <Trash weight="duotone" className="w-4 h-4" />
                                                        Terminate Access
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
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