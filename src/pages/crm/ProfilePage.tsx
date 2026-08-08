/**
 * Profile Page – Executive HMS Staff Profile & Dossier
 * Features:
 * - Glassmorphic Hero Banner & Interactive Avatar Switcher
 * - REUI Data Grid: "Workspace Access Review" (Permissions Matrix with Pinning, Toggles, Search & Role Filtering)
 * - REUI Application Wizard Block: "Staff Onboarding & Access Setup Wizard" (4-Step Stepper with Identity, Role Cards, Security, & Summary Review)
 * - KPI Metrics Bar (Attendance, Performance, Tasks, Security Clearance)
 * - 6 Comprehensive Tabs (Overview, Objectives, Attendance, Documents, Performance, Settings)
 */
import React, { useState, useMemo } from "react";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  EnvelopeSimple,
  MapPin,
  ShieldCheck,
  Phone,
  Briefcase,
  Buildings,
  ArrowLeft,
  Camera,
  FileText,
  Target,
  User,
  Plus,
  Trash,
  Clock,
  Flag,
  CalendarCheck,
  Check,
  Gear,
  LockKey,
  DownloadSimple,
  Eye,
  Star,
  UploadSimple,
  PencilSimple,
  BellRinging,
  Sparkle,
  Medal,
  IdentificationCard,
  ShareFat,
  Laptop,
  Fingerprint,
  FilePdf,
  DotsThreeVertical,
  MagnifyingGlass,
  PushPin,
  PushPinSlash,
  CaretLeft,
  CaretRight,
  CaretDown,
  CircleWavyCheck,
  Sliders,
  CheckCircle,
  UserCheck,
  CloudArrowUp,
  ArrowRight,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import claraAvatar from "@/assets/clara_avatar.png";
import avatarJohnson from "@/assets/avatar-johnson.png";
import avatarKim from "@/assets/avatar-kim.png";
import avatarPatel from "@/assets/avatar-patel.png";
import avatarSingh from "@/assets/avatar-singh.png";

// ─────────────────────────────────────────────────────────────────────────────
// DATA TYPES & PRESETS
// ─────────────────────────────────────────────────────────────────────────────
interface UserProfileData {
  name: string;
  role: string;
  department: string;
  employeeId: string;
  email: string;
  phone: string;
  location: string;
  accessLevel: string;
  bio: string;
  emergencyContact: string;
  joiningDate: string;
  manager: string;
  avatar: string;
}

interface MemberAccessRow {
  id: string;
  name: string;
  role: string;
  statusText: string;
  isOnline: boolean;
  avatar: string;
  isPinned: boolean;
  settings: boolean;
  billing: boolean;
  integrations: "on" | "off" | "warning";
  users: boolean;
  permissions: boolean;
}

const INITIAL_MEMBERS_GRID: MemberAccessRow[] = [
  {
    id: "m1",
    name: "Leila Cole",
    role: "Workspace owner",
    statusText: "Online",
    isOnline: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    isPinned: true,
    settings: true,
    billing: true,
    integrations: "on",
    users: true,
    permissions: true,
  },
  {
    id: "m2",
    name: "Aiden Brooks",
    role: "Platform admin",
    statusText: "Last active 3m ago",
    isOnline: false,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    isPinned: true,
    settings: true,
    billing: true,
    integrations: "on",
    users: false,
    permissions: false,
  },
  {
    id: "m3",
    name: "Jonah Voss",
    role: "Integrations lead",
    statusText: "Online",
    isOnline: true,
    avatar: avatarKim,
    isPinned: false,
    settings: true,
    billing: true,
    integrations: "warning",
    users: false,
    permissions: false,
  },
  {
    id: "m4",
    name: "Kira Santos",
    role: "Growth ops lead",
    statusText: "Online",
    isOnline: true,
    avatar: avatarPatel,
    isPinned: false,
    settings: true,
    billing: true,
    integrations: "off",
    users: true,
    permissions: false,
  },
  {
    id: "m5",
    name: "Kris Owens",
    role: "Support lead",
    statusText: "Last active 2d ago",
    isOnline: false,
    avatar: avatarJohnson,
    isPinned: false,
    settings: true,
    billing: false,
    integrations: "off",
    users: false,
    permissions: false,
  },
  {
    id: "m6",
    name: "Clara Lefèvre",
    role: "Senior Product Manager",
    statusText: "Online",
    isOnline: true,
    avatar: claraAvatar,
    isPinned: false,
    settings: true,
    billing: true,
    integrations: "on",
    users: true,
    permissions: true,
  },
  {
    id: "m7",
    name: "Dr. Sarah Mitchell",
    role: "Chief Oncologist",
    statusText: "Online",
    isOnline: true,
    avatar: avatarSingh,
    isPinned: false,
    settings: true,
    billing: false,
    integrations: "on",
    users: true,
    permissions: false,
  },
];

const PRESET_AVATARS = [
  claraAvatar,
  avatarJohnson,
  avatarKim,
  avatarPatel,
  avatarSingh,
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
];

const TEAM_USERS = [
  { id: 1, name: "Clara Lefèvre", avatar: claraAvatar, role: "Lead Product Manager" },
  { id: 2, name: "Dr. James Okafor", avatar: avatarJohnson, role: "Chief Medical Officer" },
  { id: 3, name: "Priya Nair", avatar: avatarPatel, role: "Senior UX Researcher" },
  { id: 4, name: "Lucas Meyer", avatar: avatarKim, role: "Fullstack Architect" },
  { id: 5, name: "Amina Diallo", avatar: avatarSingh, role: "Clinical Data Analyst" },
];

const INITIAL_OBJECTIVES = [
  {
    id: 1,
    title: "Review Healthcare CRM Architecture 2.0",
    description: "C-level architectural compliance and security review phase",
    category: "Architecture",
    priority: "High",
    completed: false,
    dueDate: "Tomorrow",
    progress: 85,
    assignees: [1, 2, 4],
    commentList: [
      { id: 1, userId: 2, text: "FHIR standard mapping looks solid. Ready for security audit.", time: "2h ago" },
    ],
  },
  {
    id: 2,
    title: "Optimize Doctor & Nurse Telemetry Dashboard",
    description: "Refactor WebSocket real-time vitals feed and alerts",
    category: "Dashboard",
    priority: "Normal",
    completed: false,
    dueDate: "25 Aug",
    progress: 40,
    assignees: [1, 3],
    commentList: [],
  },
];

const INITIAL_DOCUMENTS = [
  {
    id: "doc-1",
    title: "Executive Employment Agreement 2026.pdf",
    category: "Contracts",
    size: "2.4 MB",
    uploadedDate: "Jan 12, 2026",
    status: "Verified",
    type: "pdf",
  },
  {
    id: "doc-2",
    title: "HIPAA Security Certification_ClassIV.pdf",
    category: "Certifications",
    size: "1.8 MB",
    uploadedDate: "Feb 04, 2026",
    status: "Verified",
    type: "pdf",
  },
];

const INITIAL_REVIEWS = {
  overallScore: 4.9,
  totalReviews: 14,
  percentile: "Top 2% Staff",
  competencies: [
    { name: "Clinical System Architecture", score: 98 },
    { name: "HIPAA & Data Privacy Governance", score: 100 },
    { name: "Cross-Functional Leadership", score: 96 },
    { name: "Product Delivery Speed", score: 94 },
  ],
  managerFeedback: [
    {
      id: 1,
      period: "Annual Performance Review 2025",
      reviewer: "Dr. James Okafor (Chief Medical Officer)",
      rating: 5.0,
      quote: "Clara has revolutionized our R&D workflow. Her attention to FHIR standards and UI design has elevated staff productivity.",
      date: "Dec 20, 2025",
    },
  ],
  endorsements: [
    { id: 1, user: TEAM_USERS[1], skill: "FHIR Data Architecture", date: "2 weeks ago" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PROFILE PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
interface ProfilePageProps {
  onBack: () => void;
}

export function ProfilePage({ onBack }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState("Infos");
  const [profile, setProfile] = useState<UserProfileData>({
    name: "Clara Lefèvre",
    role: "Senior Product Manager & HealthTech Lead",
    department: "Clinical R&D & CRM Solutions",
    employeeId: "HMS-EMP-8842",
    email: "clara.lefevre@hms-health.com",
    phone: "+33 (0) 1 42 68 53 00",
    location: "Paris HQ — R&D Wing B",
    accessLevel: "Level 4 (Executive Staff)",
    bio: "Passionate HealthTech leader specializing in clinical workflow automation, FHIR interoperability standards, and high-performance hospital CRM systems.",
    emergencyContact: "Henri Lefèvre (Spouse) — +33 (0) 6 12 34 56 78",
    joiningDate: "January 15, 2022",
    manager: "Dr. James Okafor (Chief Medical Officer)",
    avatar: claraAvatar,
  });

  const [objectives, setObjectives] = useState(INITIAL_OBJECTIVES);
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const tabs = [
    { id: "Infos", label: "Overview & Access Review", icon: User },
    { id: "Objectives", label: "Objectives & OKRs", icon: Target },
    { id: "Attendance", label: "Attendance & Shifts", icon: CalendarCheck },
    { id: "Documents", label: "Document Vault", icon: FileText },
    { id: "Reviews", label: "Performance", icon: Star },
    { id: "Settings", label: "Security & Settings", icon: Gear },
  ];

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20 w-full px-4 md:px-8 lg:px-12 pt-6 transition-colors">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-zinc-700/50 dark:border-zinc-200"
          >
            <Sparkle size={18} weight="fill" className="text-amber-400 shrink-0" />
            <span className="text-xs font-extrabold tracking-wide">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Navigation Bar */}
      <div className="flex items-center justify-between py-4 mb-6 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-extrabold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors group px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm"
        >
          <ArrowLeft weight="bold" size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="flex items-center gap-2">
          {/* Launch Wizard Button */}
          <button
            onClick={() => setIsWizardOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-black shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Sliders size={14} weight="bold" />
            Launch Application Wizard
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              showToast("Profile link copied to clipboard!");
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
          >
            <ShareFat size={14} weight="bold" />
            Share Profile
          </button>

          <button
            onClick={() => showToast("Exporting Workspace Access Review PDF...")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 text-xs font-extrabold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <DownloadSimple size={14} weight="bold" />
            Export Review
          </button>
        </div>
      </div>

      {/* Hero Cover Card & Banner */}
      <div className="relative rounded-[2.5rem] bg-gradient-to-r from-zinc-900 via-indigo-950 to-slate-900 p-6 md:p-10 text-white shadow-2xl overflow-hidden mb-8 border border-zinc-800/80">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative group shrink-0">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-3xl overflow-hidden border-4 border-white/20 dark:border-zinc-800 shadow-2xl ring-2 ring-white/10 relative bg-zinc-800">
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
              <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-emerald-500 border-2 border-zinc-900 animate-pulse" title="Online & Active" />
            </div>

            <button
              onClick={() => setIsAvatarModalOpen(true)}
              className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-white text-zinc-950 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all border-2 border-zinc-900 font-bold"
              title="Change Profile Avatar"
            >
              <Camera weight="bold" size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Active Duty • Shift A
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-white/90 border border-white/10 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck size={12} weight="fill" className="text-indigo-400" />
                {profile.accessLevel}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">{profile.name}</h1>
                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 transition-all border border-white/10"
                  title="Edit Profile"
                >
                  <PencilSimple size={16} weight="bold" />
                </button>
              </div>
              <p className="text-sm md:text-base font-bold text-indigo-200 mt-1">{profile.role}</p>
              <p className="text-xs font-semibold text-zinc-400 mt-1">{profile.department} • {profile.location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Segmented Control */}
      <div className="flex items-center justify-start overflow-x-auto custom-scrollbar p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl mb-8 shadow-sm">
        <div className="flex items-center gap-1.5 w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all shrink-0 relative",
                  isActive
                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-md scale-[1.02]"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                )}
              >
                <Icon size={16} weight={isActive ? "fill" : "bold"} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      <AnimatePresence mode="wait">
        {activeTab === "Infos" && (
          <OverviewTab key="infos" profile={profile} onEdit={() => setIsEditProfileOpen(true)} showToast={showToast} />
        )}
        {activeTab === "Objectives" && (
          <ObjectivesTab key="objectives" objectives={objectives} setObjectives={setObjectives} />
        )}
        {activeTab === "Attendance" && <AttendanceTab key="attendance" />}
        {activeTab === "Documents" && (
          <DocumentsTab key="documents" documents={documents} setDocuments={setDocuments} showToast={showToast} />
        )}
        {activeTab === "Reviews" && <ReviewsTab key="reviews" reviews={INITIAL_REVIEWS} />}
        {activeTab === "Settings" && <SettingsTab key="settings" showToast={showToast} />}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditProfileOpen && (
          <EditProfileModal
            profile={profile}
            setProfile={setProfile}
            onClose={() => setIsEditProfileOpen(false)}
            showToast={showToast}
          />
        )}
      </AnimatePresence>

      {/* Avatar Change Modal */}
      <AnimatePresence>
        {isAvatarModalOpen && (
          <AvatarModal
            currentAvatar={profile.avatar}
            onSelect={(newAvatar) => {
              setProfile((p) => ({ ...p, avatar: newAvatar }));
              setIsAvatarModalOpen(false);
              showToast("Profile picture updated!");
            }}
            onClose={() => setIsAvatarModalOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* REUI Application Wizard Modal */}
      <AnimatePresence>
        {isWizardOpen && (
          <ApplicationWizardModal
            profile={profile}
            setProfile={setProfile}
            onClose={() => setIsWizardOpen(false)}
            showToast={showToast}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REUI BLOCK: APPLICATION WIZARD MODAL (4-STEP STEPPER)
// ─────────────────────────────────────────────────────────────────────────────
function ApplicationWizardModal({
  profile,
  setProfile,
  onClose,
  showToast,
}: {
  profile: UserProfileData;
  setProfile: React.Dispatch<React.SetStateAction<UserProfileData>>;
  onClose: () => void;
  showToast: (msg: string) => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [name, setName] = useState(profile.name);
  const [roleTitle, setRoleTitle] = useState(profile.role);
  const [department, setDepartment] = useState(profile.department);
  const [email, setEmail] = useState(profile.email);
  const [selectedRoleCard, setSelectedRoleCard] = useState("exec");
  const [accessLevel, setAccessLevel] = useState(profile.accessLevel);
  const [hipaaVerified, setHipaaVerified] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);

  const roleCards = [
    {
      id: "exec",
      title: "Executive Staff Admin",
      desc: "Full administrative governance, patient data access & system security privileges.",
      badge: "Level 4 Access",
      icon: ShieldCheck,
    },
    {
      id: "clinical",
      title: "Clinical R&D Specialist",
      desc: "FHIR interoperability management, patient telemetry monitoring & research logs.",
      badge: "Level 3 Access",
      icon: UserCheck,
    },
    {
      id: "ops",
      title: "Care & Operations Lead",
      desc: "Hospital staff shift scheduling, biometric attendance oversight & resource allocation.",
      badge: "Level 2 Access",
      icon: Briefcase,
    },
  ];

  const handleComplete = () => {
    setProfile((prev) => ({
      ...prev,
      name,
      role: roleTitle,
      department,
      email,
      accessLevel,
    }));
    onClose();
    showToast("Application Wizard Completed! Staff Profile & Permissions updated!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Wizard Top Header & Progress */}
        <div className="p-6 md:p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                REUI Application Wizard Block
              </span>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                Staff Onboarding & Permissions Setup
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Stepper Progress Bar */}
          <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden mb-6">
            <div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>

          {/* Stepper Navigation Pills */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { num: 1, label: "Identity" },
              { num: 2, label: "Role & Access" },
              { num: 3, label: "Security" },
              { num: 4, label: "Review" },
            ].map((s) => (
              <button
                key={s.num}
                onClick={() => setStep(s.num as any)}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-xl text-xs font-black transition-all border",
                  step === s.num
                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-sm"
                    : step > s.num
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                    : "bg-white dark:bg-zinc-900 text-zinc-400 border-zinc-200 dark:border-zinc-800"
                )}
              >
                <span
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0",
                    step === s.num
                      ? "bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white"
                      : step > s.num
                      ? "bg-emerald-500 text-white"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                  )}
                >
                  {step > s.num ? <Check size={10} weight="bold" /> : s.num}
                </span>
                <span className="truncate hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Wizard Step Body */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar space-y-6">
          {/* STEP 1: IDENTITY & PROFILE DETAILS */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">Step 1: Personal & Professional Identity</h3>
                <p className="text-xs font-bold text-zinc-400 mt-1">Configure staff name, official email, and designation</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase">Role / Designation</label>
                  <input
                    type="text"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase">Official Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: ROLE & PERMISSIONS ALLOCATION */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">Step 2: Workspace Role & Access Level</h3>
                <p className="text-xs font-bold text-zinc-400 mt-1">Select staff role template and security clearance</p>
              </div>

              <div className="space-y-3">
                {roleCards.map((rc) => {
                  const Icon = rc.icon;
                  const isSelected = selectedRoleCard === rc.id;
                  return (
                    <div
                      key={rc.id}
                      onClick={() => setSelectedRoleCard(rc.id)}
                      className={cn(
                        "p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all",
                        isSelected
                          ? "bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-500 shadow-sm"
                          : "bg-zinc-50/50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", isSelected ? "bg-indigo-600 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500")}>
                          <Icon size={20} weight="bold" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-zinc-900 dark:text-white">{rc.title}</p>
                          <p className="text-xs font-medium text-zinc-400 mt-0.5">{rc.desc}</p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-black uppercase shrink-0">
                        {rc.badge}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 3: SECURITY & COMPLIANCE VERIFICATION */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">Step 3: Security & Regulatory Compliance</h3>
                <p className="text-xs font-bold text-zinc-400 mt-1">Enable 2FA authentication and HIPAA privacy verification</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700">
                  <div>
                    <p className="text-xs font-black text-zinc-900 dark:text-white">HIPAA Privacy Compliance Verified</p>
                    <p className="text-[11px] font-bold text-zinc-400">Audited for Level IV medical record governance</p>
                  </div>
                  <button onClick={() => setHipaaVerified(!hipaaVerified)} className={cn("w-10 h-6 rounded-full transition-colors relative p-0.5", hipaaVerified ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700")}>
                    <div className={cn("w-5 h-5 rounded-full bg-white transition-transform", hipaaVerified && "translate-x-4")} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700">
                  <div>
                    <p className="text-xs font-black text-zinc-900 dark:text-white">Two-Factor Authentication (2FA)</p>
                    <p className="text-[11px] font-bold text-zinc-400">Enforce biometrics & authenticator passcode</p>
                  </div>
                  <button onClick={() => setTwoFactor(!twoFactor)} className={cn("w-10 h-6 rounded-full transition-colors relative p-0.5", twoFactor ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700")}>
                    <div className={cn("w-5 h-5 rounded-full bg-white transition-transform", twoFactor && "translate-x-4")} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: REVIEW & CONFIRMATION SUMMARY */}
          {step === 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">Step 4: Final Review & Confirmation</h3>
                <p className="text-xs font-bold text-zinc-400 mt-1">Review onboarding summary before applying permissions</p>
              </div>

              <div className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                  <img src={profile.avatar} alt="Avatar" className="w-12 h-12 rounded-2xl object-cover" />
                  <div>
                    <h4 className="text-base font-black text-zinc-900 dark:text-white">{name}</h4>
                    <p className="text-xs font-bold text-indigo-500">{roleTitle} • {department}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-bold">
                  <div>
                    <span className="text-[10px] font-black uppercase text-zinc-400">Email</span>
                    <p className="text-zinc-900 dark:text-zinc-100">{email}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-zinc-400">Security Clearance</span>
                    <p className="text-zinc-900 dark:text-zinc-100">{accessLevel}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/50">
          <button
            disabled={step === 1}
            onClick={() => setStep((s) => Math.max(1, s - 1) as any)}
            className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-extrabold text-zinc-600 dark:text-zinc-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <CaretLeft size={16} weight="bold" />
            Previous
          </button>

          {step < 4 ? (
            <button
              onClick={() => setStep((s) => Math.min(4, s + 1) as any)}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-black rounded-xl shadow hover:scale-105 transition-all"
            >
              Next Step
              <ArrowRight size={14} weight="bold" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 text-white text-xs font-black rounded-xl shadow-lg hover:scale-105 transition-all"
            >
              <CheckCircle size={16} weight="fill" />
              Complete Onboarding
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 1: OVERVIEW & WORKSPACE ACCESS REVIEW DATA GRID
// ─────────────────────────────────────────────────────────────────────────────
function OverviewTab({
  profile,
  onEdit,
  showToast,
}: {
  profile: UserProfileData;
  onEdit: () => void;
  showToast: (msg: string) => void;
}) {
  const [members, setMembers] = useState<MemberAccessRow[]>(INITIAL_MEMBERS_GRID);
  const [subTab, setSubTab] = useState<"general" | "tags" | "permissions">("permissions");
  const [roleFilter, setRoleFilter] = useState("All roles");
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);

  const togglePin = (id: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isPinned: !m.isPinned } : m))
    );
    showToast("Updated pinned member rows!");
  };

  const unpinAll = () => {
    setMembers((prev) => prev.map((m) => ({ ...m, isPinned: false })));
    showToast("Unpinned all rows!");
  };

  const toggleSettingPermission = (id: string, field: "settings" | "billing" | "users" | "permissions") => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: !m[field] } : m))
    );
    showToast("Permission updated!");
  };

  const toggleIntegrationPermission = (id: string) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const next = m.integrations === "on" ? "warning" : m.integrations === "warning" ? "off" : "on";
          return { ...m, integrations: next };
        }
        return m;
      })
    );
    showToast("Integration toggle updated!");
  };

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        !searchQuery.trim() ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole =
        roleFilter === "All roles" ||
        (roleFilter === "Owners" && m.role.toLowerCase().includes("owner")) ||
        (roleFilter === "Admins" && m.role.toLowerCase().includes("admin")) ||
        (roleFilter === "Leads" && m.role.toLowerCase().includes("lead"));

      return matchesSearch && matchesRole;
    });
  }, [members, searchQuery, roleFilter]);

  const sortedMembers = useMemo(() => {
    return [...filteredMembers].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
  }, [filteredMembers]);

  const pinnedCount = useMemo(() => members.filter((m) => m.isPinned).length, [members]);
  const onlineCount = useMemo(() => members.filter((m) => m.isOnline).length, [members]);

  const totalPages = Math.ceil(sortedMembers.length / rowsPerPage) || 1;
  const paginatedMembers = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sortedMembers.slice(start, start + rowsPerPage);
  }, [sortedMembers, page, rowsPerPage]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      {/* ── REUI BLOCK: WORKSPACE ACCESS REVIEW ── */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Workspace Access Review
            </h3>
            <p className="text-xs font-semibold text-zinc-400 mt-1">
              {members.length} members • {onlineCount} online • {members.filter((m) => m.permissions).length} with review access
            </p>
          </div>

          <button
            onClick={() => showToast("Exporting Workspace Access Review report...")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-all border border-zinc-200 dark:border-zinc-700 shadow-sm"
          >
            <DownloadSimple size={15} weight="bold" />
            Export review
          </button>
        </div>

        <div className="flex items-center gap-6 border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <button
            onClick={() => setSubTab("general")}
            className={cn(
              "flex items-center gap-2 text-xs font-black transition-all pb-1 relative",
              subTab === "general"
                ? "text-zinc-950 dark:text-white border-b-2 border-zinc-950 dark:border-white"
                : "text-zinc-400 hover:text-zinc-600"
            )}
          >
            General
            <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-extrabold text-zinc-600 dark:text-zinc-400">
              5
            </span>
          </button>

          <button
            onClick={() => setSubTab("tags")}
            className={cn(
              "flex items-center gap-2 text-xs font-black transition-all pb-1 relative",
              subTab === "tags"
                ? "text-zinc-950 dark:text-white border-b-2 border-zinc-950 dark:border-white"
                : "text-zinc-400 hover:text-zinc-600"
            )}
          >
            Tags
            <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-extrabold text-zinc-600 dark:text-zinc-400">
              6
            </span>
          </button>

          <button
            onClick={() => setSubTab("permissions")}
            className={cn(
              "flex items-center gap-2 text-xs font-black transition-all pb-1 relative",
              subTab === "permissions"
                ? "text-zinc-950 dark:text-white border-b-2 border-zinc-950 dark:border-white"
                : "text-zinc-400 hover:text-zinc-600"
            )}
          >
            Permissions
            <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-extrabold text-zinc-600 dark:text-zinc-400">
              5
            </span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-800 dark:text-zinc-200 outline-none pr-8 cursor-pointer appearance-none"
              >
                <option>All roles</option>
                <option>Owners</option>
                <option>Admins</option>
                <option>Leads</option>
              </select>
              <CaretDown size={12} weight="bold" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>

            <div className="relative flex-1 max-w-xs">
              <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search members"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 justify-end">
            <button
              onClick={unpinAll}
              className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
            >
              <PushPinSlash size={14} weight="bold" />
              Unpin all
            </button>
            <span className="px-3 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-xs font-extrabold">
              {pinnedCount} rows pinned
            </span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-zinc-50/70 dark:bg-zinc-950/60 border-b border-zinc-200/80 dark:border-zinc-800 text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center"></th>
                <th className="py-3 px-4 font-black">Member ↑</th>
                <th className="py-3 px-4 font-black text-center">Settings ↕</th>
                <th className="py-3 px-4 font-black text-center">Billing ↕</th>
                <th className="py-3 px-4 font-black text-center">Integrations ↕</th>
                <th className="py-3 px-4 font-black text-center">Users ↕</th>
                <th className="py-3 px-4 font-black text-center">Permissions ↕</th>
                <th className="py-3 px-4 w-12 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-xs font-bold">
              {paginatedMembers.map((m) => (
                <tr
                  key={m.id}
                  className={cn(
                    "hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors",
                    m.isPinned && "bg-zinc-50/40 dark:bg-zinc-950/30"
                  )}
                >
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => togglePin(m.id)}
                      className={cn(
                        "p-1 rounded-md transition-colors",
                        m.isPinned ? "text-zinc-950 dark:text-white" : "text-zinc-300 dark:text-zinc-700 hover:text-zinc-500"
                      )}
                      title={m.isPinned ? "Unpin row" : "Pin row to top"}
                    >
                      <PushPin size={14} weight={m.isPinned ? "fill" : "bold"} className={cn(m.isPinned && "-rotate-45")} />
                    </button>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-700" />
                        {m.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900" />
                        )}
                      </div>
                      <div>
                        <p className="font-extrabold text-zinc-900 dark:text-zinc-100 leading-snug">{m.name}</p>
                        <p className="text-[11px] font-semibold text-zinc-400 leading-snug">
                          {m.role} • {m.statusText}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleSettingPermission(m.id, "settings")}
                      className={cn(
                        "w-9 h-5 rounded-full transition-colors relative p-0.5 inline-block align-middle",
                        m.settings ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-700"
                      )}
                    >
                      <div className={cn("w-4 h-4 rounded-full bg-white transition-transform shadow-xs", m.settings && "translate-x-4")} />
                    </button>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleSettingPermission(m.id, "billing")}
                      className={cn(
                        "w-9 h-5 rounded-full transition-colors relative p-0.5 inline-block align-middle",
                        m.billing ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-700"
                      )}
                    >
                      <div className={cn("w-4 h-4 rounded-full bg-white transition-transform shadow-xs", m.billing && "translate-x-4")} />
                    </button>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleIntegrationPermission(m.id)}
                      className={cn(
                        "w-9 h-5 rounded-full transition-colors relative p-0.5 inline-block align-middle",
                        m.integrations === "on"
                          ? "bg-emerald-500"
                          : m.integrations === "warning"
                          ? "bg-amber-500"
                          : "bg-zinc-200 dark:bg-zinc-700"
                      )}
                    >
                      <div className={cn("w-4 h-4 rounded-full bg-white transition-transform shadow-xs", m.integrations !== "off" && "translate-x-4")} />
                    </button>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleSettingPermission(m.id, "users")}
                      className={cn(
                        "w-9 h-5 rounded-full transition-colors relative p-0.5 inline-block align-middle",
                        m.users ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-700"
                      )}
                    >
                      <div className={cn("w-4 h-4 rounded-full bg-white transition-transform shadow-xs", m.users && "translate-x-4")} />
                    </button>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleSettingPermission(m.id, "permissions")}
                      className={cn(
                        "w-9 h-5 rounded-full transition-colors relative p-0.5 inline-block align-middle",
                        m.permissions ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-700"
                      )}
                    >
                      <div className={cn("w-4 h-4 rounded-full bg-white transition-transform shadow-xs", m.permissions && "translate-x-4")} />
                    </button>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => showToast(`Actions menu opened for ${m.name}`)}
                      className="p-1 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    >
                      <DotsThreeVertical size={16} weight="bold" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs font-bold text-zinc-500">
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="px-2 py-1 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-800 dark:text-zinc-200 outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <span>
              {sortedMembers.length === 0
                ? "0 of 0"
                : `${(page - 1) * rowsPerPage + 1} - ${Math.min(page * rowsPerPage, sortedMembers.length)} of ${sortedMembers.length}`}
            </span>

            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <CaretLeft size={14} weight="bold" />
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={cn(
                    "w-7 h-7 rounded-lg text-xs font-extrabold transition-all",
                    page === i + 1
                      ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                      : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  )}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <CaretRight size={14} weight="bold" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Administrative Dossier & Licenses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">Administrative Dossier</h3>
                <p className="text-xs font-bold text-zinc-400 mt-1">Official verified credentials and system registry details</p>
              </div>
              <button
                onClick={onEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
              >
                <PencilSimple size={14} weight="bold" />
                Edit Info
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Official Email", value: profile.email, icon: EnvelopeSimple },
                { label: "Direct Telephone", value: profile.phone, icon: Phone },
                { label: "Office Location", value: profile.location, icon: MapPin },
                { label: "Department / Team", value: profile.department, icon: Buildings },
                { label: "Reporting Manager", value: profile.manager, icon: User },
                { label: "Access Privilege", value: profile.accessLevel, icon: ShieldCheck },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-zinc-50/70 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800/80 space-y-1">
                    <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-black uppercase tracking-wider">
                      <Icon size={14} weight="bold" className="text-indigo-500" />
                      <span>{item.label}</span>
                    </div>
                    <p className="text-sm font-black text-zinc-900 dark:text-zinc-100 truncate">{item.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <h3 className="text-base font-black tracking-tight text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
              <Medal size={18} weight="fill" className="text-amber-500" />
              Verified Badges & Licenses
            </h3>

            <div className="space-y-3">
              {[
                { title: "HIPAA Security Certified", desc: "Level IV Governance", color: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" },
                { title: "HL7 FHIR Interoperability", desc: "Master Practitioner", color: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800" },
              ].map((badge, idx) => (
                <div key={idx} className={cn("p-3.5 rounded-2xl border flex items-center justify-between", badge.color)}>
                  <div>
                    <p className="text-xs font-black">{badge.title}</p>
                    <p className="text-[10px] font-bold opacity-80 mt-0.5">{badge.desc}</p>
                  </div>
                  <CircleWavyCheck size={18} weight="fill" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OTHER TABS & MODALS
// ─────────────────────────────────────────────────────────────────────────────
function ObjectivesTab({ objectives, setObjectives }: any) {
  const [filter, setFilter] = useState("All");
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const toggleObjective = (id: number) => {
    setObjectives((prev: any[]) =>
      prev.map((obj) => (obj.id === id ? { ...obj, completed: !obj.completed, progress: !obj.completed ? 100 : 0 } : obj))
    );
  };

  const filtered = useMemo(() => {
    if (filter === "Pending") return objectives.filter((o: any) => !o.completed);
    if (filter === "Completed") return objectives.filter((o: any) => o.completed);
    return objectives;
  }, [objectives, filter]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Staff OKRs & Key Tasks</h3>
          <p className="text-xs font-bold text-zinc-400 mt-1">Track strategic quarterly deliverables and collaborative actions</p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-black shadow hover:bg-indigo-700 transition-all"
        >
          <Plus size={14} weight="bold" />
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((obj: any) => (
          <div key={obj.id} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[10px] font-black uppercase">
                {obj.category}
              </span>
              <button onClick={() => toggleObjective(obj.id)} className="p-1 rounded bg-zinc-100 dark:bg-zinc-800">
                <Check size={14} />
              </button>
            </div>
            <h4 className="text-base font-black text-zinc-900 dark:text-zinc-100">{obj.title}</h4>
            <p className="text-xs font-medium text-zinc-400">{obj.description}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function AttendanceTab() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-lg font-black text-zinc-900 dark:text-white">Attendance Registry</h3>
      <p className="text-xs font-bold text-zinc-400 mt-1">Logged Biometric shift entries and active clock-in records.</p>
    </motion.div>
  );
}

function DocumentsTab({ documents, setDocuments, showToast }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <h3 className="text-xl font-black text-zinc-900 dark:text-white">Encrypted Document Vault</h3>
        <p className="text-xs font-bold text-zinc-400 mt-1">Verified contracts, licenses, and tax documents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documents.map((doc: any) => (
          <div key={doc.id} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FilePdf size={24} className="text-rose-500" />
              <div>
                <h4 className="text-xs font-black text-zinc-900 dark:text-zinc-100">{doc.title}</h4>
                <p className="text-[10px] font-bold text-zinc-400">{doc.category} • {doc.size}</p>
              </div>
            </div>
            <button onClick={() => showToast(`Downloading ${doc.title}...`)} className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800">
              <DownloadSimple size={16} />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ReviewsTab({ reviews }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <div className="bg-gradient-to-br from-indigo-900 to-zinc-900 rounded-3xl p-8 text-white shadow-lg space-y-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Executive Assessment</span>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-black">{reviews.overallScore}</span>
          <span className="text-xl font-bold text-zinc-400">/ 5.0</span>
        </div>
        <p className="text-xs font-bold text-indigo-200">{reviews.percentile}</p>
      </div>
    </motion.div>
  );
}

function SettingsTab({ showToast }: { showToast: (msg: string) => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 max-w-2xl">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <h3 className="text-lg font-black text-zinc-900 dark:text-white">Security & Password</h3>
        <input type="password" placeholder="Current Password" className="w-full p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold outline-none" />
        <input type="password" placeholder="New Password" className="w-full p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold outline-none" />
        <button onClick={() => showToast("Password updated!")} className="px-5 py-2 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-black rounded-xl">
          Update Password
        </button>
      </div>
    </motion.div>
  );
}

function EditProfileModal({
  profile,
  setProfile,
  onClose,
  showToast,
}: {
  profile: UserProfileData;
  setProfile: React.Dispatch<React.SetStateAction<UserProfileData>>;
  onClose: () => void;
  showToast: (msg: string) => void;
}) {
  const [formData, setFormData] = useState({ ...profile });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 w-full max-w-xl space-y-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <h3 className="text-xl font-black text-zinc-900 dark:text-white">Edit Profile Details</h3>
          <button onClick={onClose} className="p-2 text-zinc-400">✕</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-400 uppercase">Full Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-400 uppercase">Role</label>
            <input type="text" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold outline-none" />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-zinc-500">Cancel</button>
          <button
            onClick={() => {
              setProfile(formData);
              onClose();
              showToast("Profile details updated!");
            }}
            className="px-6 py-2.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-black rounded-xl"
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function AvatarModal({
  currentAvatar,
  onSelect,
  onClose,
}: {
  currentAvatar: string;
  onSelect: (avatar: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 w-full max-w-md space-y-6 shadow-2xl">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
          <h3 className="text-lg font-black text-zinc-900 dark:text-white">Choose Profile Picture</h3>
          <button onClick={onClose} className="p-1 text-zinc-400">✕</button>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {PRESET_AVATARS.map((av, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(av)}
              className={cn(
                "w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all hover:scale-105",
                currentAvatar === av ? "border-indigo-600" : "border-zinc-200 dark:border-zinc-800"
              )}
            >
              <img src={av} alt="Preset" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}