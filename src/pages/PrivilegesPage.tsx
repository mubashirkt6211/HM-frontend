"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import {
    MagnifyingGlass, Plus, DotsThree, UserCirclePlus,
    EnvelopeSimple, LockKey, ShieldCheck, Trash,
    CaretLeft, CaretRight, ArrowDown, X, Eye, EyeSlash,
    CheckCircle, Warning, Stethoscope, Heartbeat,
    Flask, Ambulance, Pill, UserGear, Buildings,
    ArrowsClockwise, Funnel
} from "@phosphor-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuTrigger,
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
}

// ─── Constants ────────────────────────────────────────────────
const DEPARTMENTS = ["Administration", "Cardiology", "Neurology", "Oncology", "Pathology", "Emergency", "Pharmacy", "Radiology", "Pediatrics", "Orthopedics"]

const ROLE_META: Record<UserRole, { label: string; icon: any; color: string; bg: string; border: string }> = {
    [UserRole.ADMIN]: { label: "Admin", icon: ShieldCheck, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-950/40", border: "border-rose-100 dark:border-rose-900/50" },
    [UserRole.DOCTOR]: { label: "Doctor", icon: Stethoscope, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40", border: "border-blue-100 dark:border-blue-900/50" },
    [UserRole.PATIENT]: { label: "Patient", icon: Heartbeat, color: "text-sky-600", bg: "bg-sky-50 dark:bg-sky-950/40", border: "border-sky-100 dark:border-sky-900/50" },
    [UserRole.RECEPTIONIST]: { label: "Receptionist", icon: Buildings, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40", border: "border-emerald-100 dark:border-emerald-900/50" },
    [UserRole.PHARMACIST]: { label: "Pharmacist", icon: Pill, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/40", border: "border-violet-100 dark:border-violet-900/50" },
    [UserRole.AMBULANCE_DRIVER]: { label: "Ambulance Driver", icon: Ambulance, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950/40", border: "border-orange-100 dark:border-orange-900/50" },
    [UserRole.MANAGER]: { label: "Manager", icon: UserGear, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40", border: "border-amber-100 dark:border-amber-900/50" },
    [UserRole.STAFF]: { label: "Lab Technician", icon: Flask, color: "text-teal-600", bg: "bg-teal-50 dark:bg-teal-950/40", border: "border-teal-100 dark:border-teal-900/50" },
    [UserRole.USER]: { label: "New User", icon: UserCirclePlus, color: "text-zinc-500", bg: "bg-zinc-100 dark:bg-zinc-800", border: "border-zinc-200 dark:border-zinc-700" },
}

const STATUS_META = {
    active: { label: "Active", dot: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
    pending: { label: "Pending", dot: "bg-amber-400 animate-pulse", text: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/40" },
    suspended: { label: "Suspended", dot: "bg-rose-500", text: "text-rose-700 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-950/40" },
}

// ─── Mock hospital staff ───────────────────────────────────────
const MOCK_STAFF: HospitalStaff[] = [
    { id: "1", firstName: "Dr. Jonathan", lastName: "Harker", email: "j.harker@hms.hospital", role: UserRole.ADMIN, department: "Administration", employeeId: "ADM-001", status: "active", avatar: "https://i.pravatar.cc/200?img=12", joinDate: "Jan 10, 2020", lastLogin: "Now", passwordSet: true },
    { id: "2", firstName: "Dr. Sarah", lastName: "Mitchell", email: "s.mitchell@hms.hospital", role: UserRole.DOCTOR, department: "Oncology", specialty: "Oncology", employeeId: "DOC-012", status: "active", avatar: "https://i.pravatar.cc/200?img=45", joinDate: "Mar 15, 2021", lastLogin: "2h ago", passwordSet: true },
    { id: "3", firstName: "Dr. Marcus", lastName: "Thompson", email: "m.thompson@hms.hospital", role: UserRole.DOCTOR, department: "Neurology", specialty: "Neurology", employeeId: "DOC-031", status: "active", avatar: "https://i.pravatar.cc/200?img=52", joinDate: "Jun 3, 2021", lastLogin: "Yesterday", passwordSet: true },
    { id: "4", firstName: "Elena", lastName: "Rodriguez", email: "e.rodriguez@hms.hospital", role: UserRole.RECEPTIONIST, department: "Emergency", employeeId: "REC-005", status: "active", avatar: "https://i.pravatar.cc/200?img=49", joinDate: "Feb 20, 2022", lastLogin: "30m ago", passwordSet: true },
    { id: "5", firstName: "Dr. James", lastName: "Wilson", email: "j.wilson@hms.hospital", role: UserRole.DOCTOR, department: "Cardiology", specialty: "Cardiology", employeeId: "DOC-008", status: "active", avatar: "https://i.pravatar.cc/200?img=14", joinDate: "Aug 5, 2020", lastLogin: "1h ago", passwordSet: true },
    { id: "6", firstName: "Lisa", lastName: "Wong", email: "l.wong@hms.hospital", role: UserRole.PHARMACIST, department: "Pharmacy", employeeId: "PHA-003", status: "suspended", avatar: "https://i.pravatar.cc/200?img=26", joinDate: "Nov 12, 2022", lastLogin: "Mar 10, 2024", passwordSet: true },
    { id: "7", firstName: "Carlos", lastName: "Mendez", email: "c.mendez@hms.hospital", role: UserRole.AMBULANCE_DRIVER, department: "Emergency", employeeId: "AMB-007", status: "active", avatar: "https://i.pravatar.cc/200?img=21", joinDate: "Sep 1, 2022", lastLogin: "4h ago", passwordSet: true },
    { id: "8", firstName: "Priya", lastName: "Sharma", email: "p.sharma@hms.hospital", role: UserRole.STAFF, department: "Pathology", specialty: "Lab Analysis", employeeId: "LAB-011", status: "active", avatar: "https://i.pravatar.cc/200?img=47", joinDate: "Jan 7, 2023", lastLogin: "Today", passwordSet: true },
    { id: "9", firstName: "Dr. Emma", lastName: "Clarke", email: "e.clarke@hms.hospital", role: UserRole.DOCTOR, department: "Radiology", specialty: "Radiology", employeeId: "DOC-022", status: "active", avatar: "https://i.pravatar.cc/200?img=44", joinDate: "Apr 18, 2021", lastLogin: "3h ago", passwordSet: true },
    { id: "10", firstName: "Robert", lastName: "Chen", email: "r.chen@hms.hospital", role: UserRole.MANAGER, department: "Administration", employeeId: "MGR-002", status: "active", avatar: "https://i.pravatar.cc/200?img=33", joinDate: "Dec 1, 2020", lastLogin: "Yesterday", passwordSet: true },
    // Pending new users (just registered)
    { id: "11", firstName: "Alex", lastName: "Thompson", email: "", role: UserRole.USER, department: "—", employeeId: "NEW-001", status: "pending", lastLogin: "Just now", joinDate: "Apr 8, 2024", passwordSet: false },
    { id: "12", firstName: "Natasha", lastName: "Rivera", email: "", role: UserRole.USER, department: "—", employeeId: "NEW-002", status: "pending", avatar: "https://i.pravatar.cc/200?img=29", lastLogin: "5m ago", joinDate: "Apr 8, 2024", passwordSet: false },
    { id: "13", firstName: "Omar", lastName: "Farooq", email: "", role: UserRole.USER, department: "—", employeeId: "NEW-003", status: "pending", lastLogin: "1h ago", joinDate: "Apr 7, 2024", passwordSet: false },
]

// ─── Setup Modal (for pending/new users) ──────────────────────
function SetupUserModal({ user, onClose, onSave }: {
    user: HospitalStaff
    onClose: () => void
    onSave: (id: string, data: { email: string; password: string; role: UserRole; department: string }) => void
}) {
    const [email, setEmail] = useState(user.email || "")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [role, setRole] = useState<UserRole>(user.role === UserRole.USER ? UserRole.DOCTOR : user.role)
    const [department, setDepartment] = useState(user.department === "—" ? "Cardiology" : user.department)

    const handleSave = () => {
        if (!email || !password) return
        onSave(user.id, { email, password, role, department })
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm" />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                className="relative w-full max-w-lg bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-900">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center">
                            <UserCirclePlus className="w-5 h-5 text-amber-500" weight="duotone" />
                        </div>
                        <div>
                            <h2 className="text-[16px] font-black text-zinc-900 dark:text-zinc-100 leading-none">Onboard New Staff</h2>
                            <p className="text-[12px] text-zinc-400 mt-0.5 font-medium">Set credentials & assign role for {user.firstName} {user.lastName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all">
                        <X className="w-5 h-5" weight="bold" />
                    </button>
                </div>

                {/* User identity strip */}
                <div className="mx-6 mt-5 flex items-center gap-3 px-4 py-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <Avatar className="size-10">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="font-black text-[13px] bg-zinc-200 dark:bg-zinc-800">{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-[14px] font-black text-zinc-900 dark:text-zinc-100">{user.firstName} {user.lastName}</p>
                        <p className="text-[12px] text-amber-500 font-bold flex items-center gap-1">
                            <Warning className="w-3.5 h-3.5" weight="fill" /> Awaiting credentials setup
                        </p>
                    </div>
                    <span className="ml-auto text-[11px] font-black text-zinc-400 bg-zinc-200 dark:bg-zinc-800 px-2.5 py-1 rounded-lg">{user.employeeId}</span>
                </div>

                {/* Form */}
                <div className="px-6 py-5 space-y-5">
                    {/* Role */}
                    <div className="space-y-1.5">
                        <label className="text-[12px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Assign Role</label>
                        <div className="grid grid-cols-3 gap-2">
                            {([UserRole.DOCTOR, UserRole.STAFF, UserRole.PHARMACIST, UserRole.RECEPTIONIST, UserRole.AMBULANCE_DRIVER, UserRole.MANAGER] as UserRole[]).map(r => {
                                const meta = ROLE_META[r]
                                const Icon = meta.icon
                                return (
                                    <button
                                        key={r}
                                        onClick={() => setRole(r)}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-[12px] font-black transition-all",
                                            role === r ? cn(meta.bg, meta.color, meta.border, "ring-2 ring-offset-1 ring-current/20") : "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                                        )}
                                    >
                                        <Icon className="w-4 h-4" weight="duotone" />
                                        {meta.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Department */}
                    <div className="space-y-1.5">
                        <label className="text-[12px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Department</label>
                        <select
                            value={department}
                            onChange={e => setDepartment(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-[14px] font-bold text-zinc-900 dark:text-zinc-100 outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all"
                        >
                            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-[12px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Hospital Email</label>
                        <div className="relative">
                            <EnvelopeSimple className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="firstname.lastname@hms.hospital"
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-[14px] font-bold outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all placeholder:text-zinc-400"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label className="text-[12px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Temporary Password</label>
                        <div className="relative">
                            <LockKey className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Min. 8 characters"
                                className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-[14px] font-bold outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all placeholder:text-zinc-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(p => !p)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                            >
                                {showPassword ? <EyeSlash className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                            </button>
                        </div>
                        <p className="text-[11px] text-zinc-400 font-medium ml-1">The user will be prompted to change this on first login.</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-end gap-3 rounded-b-2xl">
                    <button onClick={onClose} className="px-5 py-2 rounded-xl text-[13px] font-black text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!email || password.length < 8}
                        className="flex items-center gap-2 px-6 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[13px] font-black transition-all hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <CheckCircle className="w-4 h-4" weight="bold" /> Confirm & Activate
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

// ─── Edit Modal (for active staff) ────────────────────────────
function EditStaffModal({ user, onClose }: { user: HospitalStaff; onClose: () => void }) {
    const [showPassword, setShowPassword] = useState(false)
    const [activeTab, setActiveTab] = useState<"details" | "credentials">("details")
    const roleMeta = ROLE_META[user.role]
    const RoleIcon = roleMeta.icon

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm" />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                className="relative w-full max-w-lg bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800"
            >
                <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all z-10">
                    <X className="w-5 h-5" weight="bold" />
                </button>

                {/* Profile header */}
                <div className="flex flex-col items-center pt-8 pb-5 px-6 text-center">
                    <div className="relative mb-3">
                        <Avatar className="size-16 ring-4 ring-zinc-50 dark:ring-zinc-900">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="text-lg font-black bg-zinc-100 dark:bg-zinc-800">{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                        </Avatar>
                        <div className={cn("absolute -bottom-0.5 -right-0.5 size-5 rounded-full border-2 border-white dark:border-zinc-950", STATUS_META[user.status].dot.replace("animate-pulse", ""), "bg-current")} />
                    </div>
                    <h2 className="text-[18px] font-black text-zinc-900 dark:text-zinc-100">{user.firstName} {user.lastName}</h2>
                    <div className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black mt-2", roleMeta.bg, roleMeta.color)}>
                        <RoleIcon className="w-3.5 h-3.5" weight="duotone" />
                        {roleMeta.label} · {user.department}
                    </div>
                    <p className="text-[12px] text-zinc-400 font-medium mt-1.5">ID: {user.employeeId}</p>
                </div>

                {/* Tabs */}
                <div className="flex mx-6 bg-zinc-100 dark:bg-zinc-900 rounded-xl p-1 mb-5">
                    {(["details", "credentials"] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "flex-1 py-2 rounded-lg text-[13px] font-black capitalize transition-all",
                                activeTab === tab
                                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                                    : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                            )}
                        >
                            {tab === "credentials" ? "Login & Access" : "Staff Details"}
                        </button>
                    ))}
                </div>

                {activeTab === "details" && (
                    <div className="px-6 pb-4 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">First Name</label>
                                <input defaultValue={user.firstName.replace("Dr. ", "")} className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-[14px] font-bold outline-none focus:border-zinc-400 transition-all" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">Last Name</label>
                                <input defaultValue={user.lastName} className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-[14px] font-bold outline-none focus:border-zinc-400 transition-all" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">Assign Role</label>
                            <select defaultValue={user.role} className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-[14px] font-bold text-zinc-900 dark:text-zinc-100 outline-none focus:border-zinc-400 transition-all">
                                {Object.entries(ROLE_META).filter(([r]) => r !== UserRole.USER && r !== UserRole.PATIENT).map(([r, meta]) => (
                                    <option key={r} value={r}>{meta.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">Department</label>
                            <select defaultValue={user.department} className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-[14px] font-bold text-zinc-900 dark:text-zinc-100 outline-none focus:border-zinc-400 transition-all">
                                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>
                )}

                {activeTab === "credentials" && (
                    <div className="px-6 pb-4 space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">Hospital Email</label>
                            <div className="relative">
                                <EnvelopeSimple className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <input defaultValue={user.email} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-[14px] font-bold outline-none focus:border-zinc-400 transition-all" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">Reset Password</label>
                            <div className="relative">
                                <LockKey className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-[14px] font-bold outline-none focus:border-zinc-400 transition-all placeholder:text-zinc-400"
                                />
                                <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
                                    {showPassword ? <EyeSlash className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                                </button>
                            </div>
                            <p className="text-[11px] text-zinc-400 font-medium ml-1">Leave blank to keep current password.</p>
                        </div>
                        <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 space-y-2 text-[12px] font-bold">
                            <div className="flex justify-between"><span className="text-zinc-400">Last Login</span><span className="text-zinc-700 dark:text-zinc-200">{user.lastLogin}</span></div>
                            <div className="flex justify-between"><span className="text-zinc-400">Member Since</span><span className="text-zinc-700 dark:text-zinc-200">{user.joinDate}</span></div>
                            <div className="flex justify-between"><span className="text-zinc-400">Password Status</span><span className={user.passwordSet ? "text-emerald-600" : "text-amber-500"}>{user.passwordSet ? "Set" : "Not configured"}</span></div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between rounded-b-2xl">
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all">
                        <Trash className="w-4 h-4" weight="duotone" /> Remove Staff
                    </button>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-5 py-2 rounded-xl text-[13px] font-black text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all">Cancel</button>
                        <button className="px-6 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[13px] font-black shadow-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all">Save Changes</button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

// ─── Staff Row ────────────────────────────────────────────────
function StaffRow({ staff, onEdit, onSetup }: {
    staff: HospitalStaff
    onEdit: (s: HospitalStaff) => void
    onSetup: (s: HospitalStaff) => void
}) {
    const roleMeta = ROLE_META[staff.role]
    const statusMeta = STATUS_META[staff.status]
    const RoleIcon = roleMeta.icon
    const isPending = staff.status === "pending"

    return (
        <tr className={cn("group border-b border-zinc-100 dark:border-zinc-800/80 last:border-0 transition-all", isPending ? "bg-amber-50/50 dark:bg-amber-950/10 hover:bg-amber-50 dark:hover:bg-amber-950/20" : "hover:bg-zinc-50/80 dark:hover:bg-zinc-900/30")}>
            <td className="py-3.5 pl-5 w-10">
                <input type="checkbox" className="size-4 rounded-md border-zinc-300 dark:border-zinc-700 accent-zinc-900 dark:accent-zinc-100" />
            </td>
            {/* Staff Name */}
            <td className="py-3.5 px-4">
                <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                        <Avatar className="size-9">
                            <AvatarImage src={staff.avatar} />
                            <AvatarFallback className="text-[12px] font-black bg-zinc-100 dark:bg-zinc-800">{staff.firstName[0]}{staff.lastName[0]}</AvatarFallback>
                        </Avatar>
                        {isPending && (
                            <span className="absolute -top-1 -right-1 size-3.5 bg-amber-400 rounded-full border-2 border-white dark:border-zinc-950 animate-pulse" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="text-[14px] font-black text-zinc-900 dark:text-zinc-100 truncate">{staff.firstName} {staff.lastName}</span>
                            {isPending && <span className="text-[10px] font-black text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-md">NEW</span>}
                        </div>
                        <span className="text-[12px] text-zinc-400 font-medium">
                            {isPending ? <span className="text-amber-500 font-bold">Awaiting setup · {staff.employeeId}</span> : staff.email}
                        </span>
                    </div>
                </div>
            </td>
            {/* Role */}
            <td className="py-3.5 px-4">
                <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black", roleMeta.bg, roleMeta.color)}>
                    <RoleIcon className="w-3.5 h-3.5" weight="duotone" />
                    {roleMeta.label}
                </span>
            </td>
            {/* Department */}
            <td className="py-3.5 px-4">
                <span className="text-[13px] font-bold text-zinc-600 dark:text-zinc-400 whitespace-nowrap">{staff.department}</span>
                {staff.specialty && <span className="block text-[11px] text-zinc-400 font-medium">{staff.specialty}</span>}
            </td>
            {/* Status */}
            <td className="py-3.5 px-4">
                <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black", statusMeta.bg, statusMeta.text)}>
                    <span className={cn("size-1.5 rounded-full", statusMeta.dot)} />
                    {statusMeta.label}
                </span>
            </td>
            {/* Last Login */}
            <td className="py-3.5 px-4 whitespace-nowrap">
                <span className="text-[13px] font-bold text-zinc-600 dark:text-zinc-400">{staff.lastLogin}</span>
            </td>
            {/* Join Date */}
            <td className="py-3.5 px-4 whitespace-nowrap">
                <span className="text-[13px] font-bold text-zinc-500 dark:text-zinc-500">{staff.joinDate}</span>
            </td>
            {/* Actions */}
            <td className="py-3.5 pr-4 text-right">
                {isPending ? (
                    <button
                        onClick={() => onSetup(staff)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[12px] font-black transition-all shadow-sm"
                    >
                        <ArrowsClockwise className="w-3.5 h-3.5" weight="bold" /> Setup
                    </button>
                ) : (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
                                <DotsThree className="w-5 h-5" weight="bold" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl">
                            <DropdownMenuItem onClick={() => onEdit(staff)} className="text-[13px] font-black rounded-lg gap-2 cursor-pointer">
                                <UserGear weight="duotone" className="w-4 h-4 text-zinc-400" /> Edit Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-[13px] font-black rounded-lg gap-2 cursor-pointer">
                                <LockKey weight="duotone" className="w-4 h-4 text-zinc-400" /> Reset Password
                            </DropdownMenuItem>
                            <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1" />
                            <DropdownMenuItem className="text-[13px] font-black rounded-lg gap-2 cursor-pointer text-rose-500 focus:text-rose-500">
                                <Trash weight="duotone" className="w-4 h-4" /> Remove
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </td>
        </tr>
    )
}

// ─── Page ─────────────────────────────────────────────────────
export function PrivilegesPage() {
    const [staff, setStaff] = useState<HospitalStaff[]>(MOCK_STAFF)
    const [search, setSearch] = useState("")
    const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all")
    const [editingUser, setEditingUser] = useState<HospitalStaff | null>(null)
    const [setupUser, setSetupUser] = useState<HospitalStaff | null>(null)
    const [showPendingOnly, setShowPendingOnly] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const PAGE_SIZE = 10

    const pendingCount = staff.filter(s => s.status === "pending").length

    const filtered = staff.filter(s => {
        const matchSearch = `${s.firstName} ${s.lastName} ${s.email} ${s.department}`.toLowerCase().includes(search.toLowerCase())
        const matchRole = roleFilter === "all" || s.role === roleFilter
        const matchStatus = !showPendingOnly || s.status === "pending"
        return matchSearch && matchRole && matchStatus
    })

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

    const handleSetup = (id: string, data: { email: string; password: string; role: UserRole; department: string }) => {
        setStaff(prev => prev.map(s => s.id === id ? { ...s, email: data.email, role: data.role, department: data.department, status: "active", passwordSet: true } : s))
    }

    const QUICK_ROLES: { label: string; value: UserRole | "all" }[] = [
        { label: "All Staff", value: "all" },
        { label: "Doctors", value: UserRole.DOCTOR },
        { label: "Lab Tech", value: UserRole.STAFF },
        { label: "Pharmacist", value: UserRole.PHARMACIST },
        { label: "Reception", value: UserRole.RECEPTIONIST },
    ]

    return (
        <div className="flex flex-col h-full">
            {/* ── TOP BAR ── */}
            <div className="flex flex-col gap-1 px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-900">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-[26px] font-black text-zinc-900 dark:text-zinc-100 tracking-tight leading-none">Staff Access Control</h1>
                        <p className="text-[13px] text-zinc-500 dark:text-zinc-400 font-medium mt-1">Manage roles, credentials, and permissions for all hospital personnel.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Pending badge */}
                        <button
                            onClick={() => { setShowPendingOnly(p => !p); setCurrentPage(1) }}
                            className={cn(
                                "relative flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[13px] font-black transition-all shadow-sm whitespace-nowrap",
                                showPendingOnly
                                    ? "bg-amber-500 border-transparent text-white"
                                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                            )}
                        >
                            <UserCirclePlus className="w-4.5 h-4.5" weight={showPendingOnly ? "fill" : "duotone"} />
                            New Requests
                            {pendingCount > 0 && (
                                <span className={cn("absolute -top-2 -right-2 size-5 rounded-full text-[10px] font-black flex items-center justify-center border-2 border-white dark:border-zinc-950", showPendingOnly ? "bg-white text-amber-500" : "bg-amber-500 text-white")}>
                                    {pendingCount}
                                </span>
                            )}
                        </button>
                        <button className="flex items-center gap-1.5 px-4 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-[13px] font-black shadow-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all">
                            <Plus className="w-4 h-4" weight="bold" /> Add Staff
                        </button>
                    </div>
                </div>
            </div>

            {/* ── FILTERS ── */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-6 py-3 border-b border-zinc-100 dark:border-zinc-900 dark:bg-zinc-900/30">
                <div className="relative w-full sm:w-72">
                    <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                        placeholder="Search by name, email, department..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setCurrentPage(1) }}
                        className="w-full pl-10 pr-4 py-2 text-[13px] font-bold rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all placeholder:font-medium placeholder:text-zinc-400"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    <Funnel className="w-4 h-4 text-zinc-400 shrink-0" />
                    {QUICK_ROLES.map(r => (
                        <button
                            key={r.value}
                            onClick={() => { setRoleFilter(r.value); setCurrentPage(1) }}
                            className={cn(
                                "px-3.5 py-1.5 rounded-xl text-[12px] font-black whitespace-nowrap transition-all border",
                                roleFilter === r.value
                                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-transparent"
                                    : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700"
                            )}
                        >{r.label}</button>
                    ))}
                </div>
                <span className="ml-auto text-[12px] font-bold text-zinc-400 whitespace-nowrap hidden sm:block">
                    {filtered.length} staff member{filtered.length !== 1 ? "s" : ""}
                </span>
            </div>

            {/* ── TABLE CARD ── */}
            <div className="mt-4 mb-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="border-b border-zinc-100 dark:border-zinc-800 text-[11px] font-black text-zinc-400 uppercase tracking-widest bg-zinc-50/80 dark:bg-zinc-900/50">
                                <th className="py-3.5 pl-5 w-10"><input type="checkbox" className="size-4 rounded-md border-zinc-300 dark:border-zinc-700 accent-zinc-900" /></th>
                                <th className="py-3.5 px-4">Staff Member</th>
                                <th className="py-3.5 px-4">Role</th>
                                <th className="py-3.5 px-4">Department</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4"><div className="flex items-center gap-1">Last Login <ArrowDown className="w-3 h-3" weight="bold" /></div></th>
                                <th className="py-3.5 px-4">Join Date</th>
                                <th className="py-3.5 pr-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence mode="popLayout">
                                {paginated.length > 0 ? paginated.map(s => (
                                    <StaffRow key={s.id} staff={s} onEdit={setEditingUser} onSetup={setSetupUser} />
                                )) : (
                                    <tr>
                                        <td colSpan={8}>
                                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                                <div className="size-14 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                                                    <MagnifyingGlass className="w-7 h-7 text-zinc-300" weight="duotone" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-[16px] font-black text-zinc-900 dark:text-zinc-100">No staff found</p>
                                                    <p className="text-[13px] text-zinc-400 font-medium mt-1">Try adjusting your search or filters.</p>
                                                </div>
                                                <button onClick={() => { setSearch(""); setRoleFilter("all"); setShowPendingOnly(false) }} className="text-[13px] font-black text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 underline underline-offset-4">Clear filters</button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* ── PAGINATION ── */}
                <div className="flex items-center justify-between px-5 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
                    <span className="text-[13px] font-bold text-zinc-400">
                        Showing <span className="font-black text-zinc-700 dark:text-zinc-200">{(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)}</span> of <span className="font-black text-zinc-700 dark:text-zinc-200">{filtered.length}</span>
                    </span>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                            className="flex items-center gap-1.5 px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl text-[13px] font-black text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                            <CaretLeft className="w-4 h-4" /> Previous
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button key={p} onClick={() => setCurrentPage(p)}
                                    className={cn("size-9 flex items-center justify-center rounded-xl text-[13px] font-black transition-all",
                                        p === currentPage ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                                    )}>{p}</button>
                            ))}
                        </div>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                            className="flex items-center gap-1.5 px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl text-[13px] font-black text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                            Next <CaretRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── MODALS ── */}
            <AnimatePresence>
                {setupUser && <SetupUserModal user={setupUser} onClose={() => setSetupUser(null)} onSave={handleSetup} />}
                {editingUser && <EditStaffModal user={editingUser} onClose={() => setEditingUser(null)} />}
            </AnimatePresence>
        </div>
    )
}
