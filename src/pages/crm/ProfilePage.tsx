/**
 * Profile Page – Minimal KgBase / Notion Inspired Executive Dossier
 * Features:
 * - Ultra-clean Minimalist 2-Column Split Interface
 * - Left Sidebar: Large Avatar, Bold Name, About Bio, Edit Buttons & Social/Connect Handles
 * - Right Column: Minimal Tabs (Activity, Projects & OKRs, Teams & Access Matrix)
 * - Timeline Feed: Vertical guide line with event nodes (Record Edits ◊, Comments 💬, Project Creations 📁)
 * - REUI Workspace Access Review Data Grid & 4-Step Application Setup Wizard
 */
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  TwitterLogo,
  LinkedinLogo,
  EnvelopeSimple,
  PencilSimple,
  ChatCircleDots,
  FolderSimple,
  Sliders,
  Plus,
  Trash,
  Check,
  CheckCircle,
  DotsThreeVertical,
  PushPin,
  PushPinSlash,
  MagnifyingGlass,
  DownloadSimple,
  ShieldCheck,
  CaretLeft,
  CaretRight,
  CaretDown,
  Star,
  Sparkle,
  UserCheck,
  Briefcase,
  ArrowRight,
  Camera,
  ArrowLeft,
  DiamondsFour,
  Gear,
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
  email: string;
  phone: string;
  location: string;
  website: string;
  twitter: string;
  linkedin: string;
  accessLevel: string;
  bio: string;
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
];

const REUI_CRM_TIMELINE = [
  {
    id: 1,
    date: "May 2026",
    title: "v2.5 Release Channels & FHIR Telemetry Integration",
    description: "Create staged release channels for beta clinical teams, enterprise hospital accounts, and internal QA cohorts. Added real-time vitals telemetry sync.",
    badges: [
      { text: "New", color: "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800" },
      { text: "Team Rollout", color: "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700" },
      { text: "Channel Permissions", color: "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800" },
      { text: "Scheduled Publishing", color: "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800" },
    ],
  },
  {
    id: 2,
    date: "Apr 2026",
    title: "v2.4 AI Assist & Patient Triage",
    description: "Added workspace summaries, prompt presets, faster doctor consultation note reviews, and automated patient intake triage suggestions.",
    badges: [
      { text: "New", color: "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800" },
      { text: "Faster Reviews", color: "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700" },
      { text: "Prompt Library", color: "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800" },
      { text: "Review Summaries", color: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" },
    ],
  },
  {
    id: 3,
    date: "Mar 2026",
    title: "v2.3 Theme Studio & HIPAA Audit Governance",
    description: "Introduced token previews, component states, Level IV HIPAA security governance, and one-click CSS & compliance report exports.",
    badges: [
      { text: "Improved", color: "bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800" },
      { text: "Design Systems", color: "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700" },
      { text: "Token Previews", color: "bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800" },
      { text: "CSS Export", color: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700" },
    ],
  },
  {
    id: 4,
    date: "Feb 2026",
    title: "v2.2 Live Collaborative Patient Charting",
    description: "Improved shared cursors, presence labels, multi-doctor chart editing, and conflict-safe draft recovery for emergency room logs.",
    badges: [
      { text: "Improved", color: "bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800" },
      { text: "Collaboration", color: "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700" },
      { text: "Presence Labels", color: "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800" },
      { text: "Draft Recovery", color: "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800" },
    ],
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

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PROFILE PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
interface ProfilePageProps {
  onBack: () => void;
  onNavigate?: (page: string) => void;
  initialWizardMode?: boolean;
}

export function ProfilePage({ onBack, onNavigate, initialWizardMode = false }: ProfilePageProps) {
  // Wizard Setup state: toggle between Initial Wizard vs Setup Complete Dossier
  const [isSetupCompleted, setIsSetupCompleted] = useState(!initialWizardMode);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(2);
  const [profile, setProfile] = useState<UserProfileData>({
    name: "Clara Lefèvre",
    role: "Senior Product Manager & HealthTech Lead",
    department: "Clinical R&D",
    email: "clara.lefevre@hms-health.com",
    phone: "+33 (0) 1 42 68 53 00",
    location: "Paris, France / San Francisco",
    website: "https://hms-health.com/clara",
    twitter: "@clara_health",
    linkedin: "in/clara-lefevre",
    accessLevel: "Level 4 (Executive Staff)",
    bio: "Just a designer & HealthTech lead. Born in Canada, raised in Slovakia. Currently crafting pixels and clinical CRM systems @HMS Systems.",
    avatar: claraAvatar,
  });

  const [activeTab, setActiveTab] = useState<"activity" | "projects" | "teams" | "attendance">("activity");
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20 w-full max-w-full min-w-0 px-2 sm:px-4 md:px-6 pt-4 transition-colors">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-zinc-700/50 dark:border-zinc-200"
          >
            <Sparkle size={18} weight="fill" className="text-amber-400 shrink-0" />
            <span className="text-xs font-bold tracking-wide">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-100 dark:border-zinc-900 w-full">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft weight="bold" size={14} />
          Dashboard
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate?.("todo")}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 transition-all border border-zinc-200/60 dark:border-zinc-700"
          >
            <CheckCircle size={14} weight="bold" className="text-emerald-500" />
            To Do
          </button>

          <button
            onClick={() => setIsSetupCompleted(false)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 transition-all border border-zinc-200/60 dark:border-zinc-700"
          >
            <Sliders size={14} weight="bold" className="text-indigo-500" />
            Profile Setup
          </button>
        </div>
      </div>

      {/* ── MINIMAL 2-COLUMN SPLIT LAYOUT (TAKES FULL AVAILABLE SPACE) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start w-full max-w-full min-w-0">
        {/* ── LEFT COLUMN: Avatar, Name, About & Connect (3 or 4 cols full width) ── */}
        <div className="lg:col-span-3 xl:col-span-3 space-y-8 w-full min-w-0">
          {/* Avatar & Name */}
          <div className="space-y-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm mx-auto md:mx-0 group cursor-pointer">
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
              <button
                onClick={() => setIsAvatarModalOpen(true)}
                className="absolute inset-0 bg-zinc-950/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
              >
                <Camera size={20} weight="bold" />
              </button>
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">{profile.name}</h1>
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">About</h3>
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {profile.bio}
            </p>

            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all mt-2"
            >
              <PencilSimple size={14} weight="bold" />
              Edit page
            </button>
          </div>

          {/* Connect Section */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Connect</h3>

            <div className="space-y-2.5 text-xs font-semibold">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 flex items-center gap-2">
                  <Globe size={14} className="text-sky-500" /> Website
                </span>
                <a href={profile.website} target="_blank" rel="noreferrer" className="text-sky-600 dark:text-sky-400 hover:underline truncate max-w-[150px]">
                  {profile.website}
                </a>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500 flex items-center gap-2">
                  <TwitterLogo size={14} className="text-sky-400" /> Twitter
                </span>
                <span className="text-sky-600 dark:text-sky-400">{profile.twitter}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500 flex items-center gap-2">
                  <LinkedinLogo size={14} className="text-blue-600" /> LinkedIn
                </span>
                <span className="text-sky-600 dark:text-sky-400">{profile.linkedin}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500 flex items-center gap-2">
                  <EnvelopeSimple size={14} className="text-indigo-500" /> Email
                </span>
                <span className="text-zinc-900 dark:text-zinc-200 truncate max-w-[150px]">{profile.email}</span>
              </div>
            </div>

            <button
              onClick={() => setIsWizardOpen(true)}
              className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all mt-2"
            >
              <PencilSimple size={14} weight="bold" />
              Edit services
            </button>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Minimal Tab Headers & Vertical Timeline Feed (9 cols) ── */}
        <div className="lg:col-span-9 xl:col-span-9 space-y-8 w-full min-w-0">
          {/* Tab Header: Activity | Projects | Teams */}
          <div className="flex items-center gap-8 border-b border-zinc-100 dark:border-zinc-900 pb-3">
            <button
              onClick={() => setActiveTab("activity")}
              className={cn(
                "text-xs font-bold transition-all pb-1 relative",
                activeTab === "activity"
                  ? "text-zinc-950 dark:text-white border-b-2 border-zinc-950 dark:border-white"
                  : "text-zinc-400 hover:text-zinc-600"
              )}
            >
              Activity
            </button>

            <button
              onClick={() => setActiveTab("projects")}
              className={cn(
                "text-xs font-bold transition-all pb-1 relative",
                activeTab === "projects"
                  ? "text-zinc-950 dark:text-white border-b-2 border-zinc-950 dark:border-white"
                  : "text-zinc-400 hover:text-zinc-600"
              )}
            >
              Projects
            </button>

            <button
              onClick={() => setActiveTab("teams")}
              className={cn(
                "text-xs font-bold transition-all pb-1 relative",
                activeTab === "teams"
                  ? "text-zinc-950 dark:text-white border-b-2 border-zinc-950 dark:border-white"
                  : "text-zinc-400 hover:text-zinc-600"
              )}
            >
              Teams & Access
            </button>

            <button
              onClick={() => setActiveTab("attendance")}
              className={cn(
                "text-xs font-bold transition-all pb-1 relative flex items-center gap-1.5",
                activeTab === "attendance"
                  ? "text-zinc-950 dark:text-white border-b-2 border-zinc-950 dark:border-white"
                  : "text-zinc-400 hover:text-zinc-600"
              )}
            >
              Attendance
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] font-black">
                Live
              </span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {/* ── REUI APPLICATION TIMELINE BLOCK (EXACT SPECIFICATION) ── */}
            {activeTab === "activity" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 pt-2"
              >
                <div>
                  <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
                    Release & Activity Changelog
                  </h3>
                  <p className="text-xs font-medium text-zinc-400 mt-1">
                    Recent releases, fixes, FHIR telemetry logs, and platform updates.
                  </p>
                </div>

                <div className="relative space-y-8 pt-4">
                  {/* Center Vertical Timeline Track Line */}
                  <div className="absolute left-[92px] top-6 bottom-4 w-px bg-zinc-200 dark:border-zinc-800" />

                  {REUI_CRM_TIMELINE.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 relative group">
                      {/* Left Date Column */}
                      <div className="w-20 shrink-0 text-right text-xs font-semibold text-zinc-400 pt-0.5">
                        {item.date}
                      </div>

                      {/* Center Node (Hollow Circle Ring) */}
                      <div className="w-4 h-4 rounded-full border-2 border-zinc-400 dark:border-zinc-500 bg-white dark:bg-zinc-950 shrink-0 relative z-10 mt-0.5" />

                      {/* Right Item Content & Pill Badges */}
                      <div className="flex-1 space-y-2 min-w-0">
                        <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white leading-snug">
                          {item.title}
                        </h4>

                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {item.badges.map((b, idx) => (
                            <span
                              key={idx}
                              className={cn(
                                "px-2.5 py-0.5 rounded-md text-[10px] font-extrabold border transition-all",
                                b.color
                              )}
                            >
                              {b.text}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── PROJECTS TAB ── */}
            {activeTab === "projects" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                <div className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 space-y-2">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Healthcare CRM 2.0 Architectural Review</h4>
                  <p className="text-xs text-zinc-400">FHIR data standard compliance and security audit phase</p>
                </div>
              </motion.div>
            )}

            {/* ── TEAMS & ACCESS MATRIX TAB (REUI Data Grid) ── */}
            {activeTab === "teams" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <OverviewTab profile={profile} showToast={showToast} />
              </motion.div>
            )}

            {/* ── HEALTHCARE STAFF ATTENDANCE TAB ── */}
            {activeTab === "attendance" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <AttendanceTab profile={profile} showToast={showToast} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

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
  const [npiNumber, setNpiNumber] = useState("NPI-8842-HMS");
  const [selectedRoleCard, setSelectedRoleCard] = useState("exec");
  const [accessLevel, setAccessLevel] = useState("Level 4 Executive");
  const [hipaaVerified, setHipaaVerified] = useState(true);
  const [fhirSyncEnabled, setFhirSyncEnabled] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);

  const roleCards = [
    {
      id: "exec",
      title: "Executive Director & Medical Admin",
      desc: "Full governance over patient records, FHIR standards, telemetry alarms, and staff privileges.",
      badge: "Level 4 Executive",
      icon: ShieldCheck,
    },
    {
      id: "clinical",
      title: "Attending Physician & Clinical Lead",
      desc: "Access to Electronic Health Records (EHR), patient charting, prescription writing, and lab orders.",
      badge: "Level 3 Clinical",
      icon: UserCheck,
    },
    {
      id: "ops",
      title: "Care Coordinator & Ward Lead",
      desc: "Bed occupancy management, nurse shift scheduling, biometric clock-in, and patient intake triage.",
      badge: "Level 2 Operations",
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
    showToast("Healthcare CRM Wizard Completed! Staff Profile & Permissions deployed!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Wizard Top Header */}
        <div className="p-6 md:p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Healthcare CRM Setup Wizard
              </span>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                Staff Onboarding & Clinical Access Matrix
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

          {/* Stepper Pills */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { num: 1, label: "Identity & NPI" },
              { num: 2, label: "Role Privileges" },
              { num: 3, label: "HIPAA & FHIR" },
              { num: 4, label: "Review & Deploy" },
            ].map((s) => (
              <button
                key={s.num}
                onClick={() => setStep(s.num as any)}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-xl text-xs font-black transition-all border",
                  step === s.num
                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-xs"
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

        {/* Wizard Body Steps */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar space-y-6">
          {/* STEP 1: IDENTITY & NPI CREDENTIALS */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">Step 1: Clinical Identity & Medical NPI Credentials</h3>
                <p className="text-xs font-bold text-zinc-400 mt-1">Configure staff name, medical license ID, and hospital department</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase">Staff Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase">Clinical Role / Specialty</label>
                  <input
                    type="text"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase">Hospital Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase">Medical License / NPI Number</label>
                  <input
                    type="text"
                    value={npiNumber}
                    onChange={(e) => setNpiNumber(e.target.value)}
                    className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: HEALTHCARE ROLE & PRIVILEGES */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">Step 2: Healthcare Role & Access Privileges</h3>
                <p className="text-xs font-bold text-zinc-400 mt-1">Select staff role template to assign EHR patient charting privileges</p>
              </div>

              <div className="space-y-3">
                {roleCards.map((rc) => {
                  const Icon = rc.icon;
                  const isSelected = selectedRoleCard === rc.id;
                  return (
                    <div
                      key={rc.id}
                      onClick={() => {
                        setSelectedRoleCard(rc.id);
                        setAccessLevel(rc.badge);
                      }}
                      className={cn(
                        "p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all",
                        isSelected
                          ? "bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-500 shadow-xs"
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

          {/* STEP 3: HIPAA, FHIR & BIOMETRICS */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">Step 3: HIPAA Compliance & FHIR Integration</h3>
                <p className="text-xs font-bold text-zinc-400 mt-1">Configure PHI privacy controls and automated telemetry feeds</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700">
                  <div>
                    <p className="text-xs font-black text-zinc-900 dark:text-white">HIPAA Level IV PHI Privacy Encryption</p>
                    <p className="text-[11px] font-bold text-zinc-400">Enforces 256-bit AES encryption on electronic medical records</p>
                  </div>
                  <button onClick={() => setHipaaVerified(!hipaaVerified)} className={cn("w-10 h-6 rounded-full transition-colors relative p-0.5", hipaaVerified ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700")}>
                    <div className={cn("w-5 h-5 rounded-full bg-white transition-transform shadow-xs", hipaaVerified && "translate-x-4")} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700">
                  <div>
                    <p className="text-xs font-black text-zinc-900 dark:text-white">FHIR R4 Telemetry Data Endpoint Sync</p>
                    <p className="text-[11px] font-bold text-zinc-400">Automated sync with hospital laboratory & ICU vitals feeds</p>
                  </div>
                  <button onClick={() => setFhirSyncEnabled(!fhirSyncEnabled)} className={cn("w-10 h-6 rounded-full transition-colors relative p-0.5", fhirSyncEnabled ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700")}>
                    <div className={cn("w-5 h-5 rounded-full bg-white transition-transform shadow-xs", fhirSyncEnabled && "translate-x-4")} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700">
                  <div>
                    <p className="text-xs font-black text-zinc-900 dark:text-white">Hardware Passkey / Biometric 2FA</p>
                    <p className="text-[11px] font-bold text-zinc-400">Enforces YubiKey / OTP login for medical staff</p>
                  </div>
                  <button onClick={() => setTwoFactor(!twoFactor)} className={cn("w-10 h-6 rounded-full transition-colors relative p-0.5", twoFactor ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700")}>
                    <div className={cn("w-5 h-5 rounded-full bg-white transition-transform shadow-xs", twoFactor && "translate-x-4")} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: REVIEW & DEPLOYMENT */}
          {step === 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">Step 4: Final Summary & Deployment</h3>
                <p className="text-xs font-bold text-zinc-400 mt-1">Review healthcare staff onboarding summary before deploying privileges</p>
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
                    <span className="text-[10px] font-black uppercase text-zinc-400">NPI License</span>
                    <p className="text-zinc-900 dark:text-zinc-100">{npiNumber}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-zinc-400">Clearance Level</span>
                    <p className="text-zinc-900 dark:text-zinc-100">{accessLevel}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-zinc-400">HIPAA Class IV</span>
                    <p className="text-emerald-600 font-black">Verified & Encrypted</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-zinc-400">FHIR R4 Sync</span>
                    <p className="text-indigo-600 font-black">Active Endpoint Sync</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer Actions */}
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
              className="flex items-center gap-1.5 px-6 py-2.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-black rounded-xl shadow-xs hover:scale-105 transition-all"
            >
              Next Step
              <ArrowRight size={14} weight="bold" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 text-white text-xs font-black rounded-xl shadow-md hover:scale-105 transition-all"
            >
              <CheckCircle size={16} weight="fill" />
              Deploy Healthcare Privileges
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA GRID VIEW (REUI WORKSPACE ACCESS MATRIX)
// ─────────────────────────────────────────────────────────────────────────────
function OverviewTab({
  profile,
  showToast,
}: {
  profile: UserProfileData;
  showToast: (msg: string) => void;
}) {
  const [members, setMembers] = useState<MemberAccessRow[]>(INITIAL_MEMBERS_GRID);
  const [roleFilter, setRoleFilter] = useState("All roles");
  const [searchQuery, setSearchQuery] = useState("");

  const togglePin = (id: string) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, isPinned: !m.isPinned } : m)));
    showToast("Updated pinned member rows!");
  };

  const toggleSettingPermission = (id: string, field: "settings" | "billing" | "users" | "permissions") => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: !m[field] } : m)));
    showToast("Permission updated!");
  };

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch = !searchQuery.trim() || m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [members, searchQuery]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Workspace Access Matrix</h3>
          <span className="text-xs text-zinc-400">{members.length} members configured</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-100 dark:border-zinc-800">
          <table className="w-full text-left text-xs font-semibold">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-950 text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
                <th className="py-2.5 px-3">Member</th>
                <th className="py-2.5 px-3 text-center">Settings</th>
                <th className="py-2.5 px-3 text-center">Billing</th>
                <th className="py-2.5 px-3 text-center">Users</th>
                <th className="py-2.5 px-3 text-center">Permissions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                  <td className="py-2.5 px-3 flex items-center gap-2.5">
                    <img src={m.avatar} alt={m.name} className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-zinc-100">{m.name}</p>
                      <p className="text-[10px] text-zinc-400">{m.role}</p>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button onClick={() => toggleSettingPermission(m.id, "settings")} className={cn("w-8 h-4.5 rounded-full transition-colors relative p-0.5 inline-block align-middle", m.settings ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-700")}>
                      <div className={cn("w-3.5 h-3.5 rounded-full bg-white transition-transform shadow-xs", m.settings && "translate-x-3.5")} />
                    </button>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button onClick={() => toggleSettingPermission(m.id, "billing")} className={cn("w-8 h-4.5 rounded-full transition-colors relative p-0.5 inline-block align-middle", m.billing ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-700")}>
                      <div className={cn("w-3.5 h-3.5 rounded-full bg-white transition-transform shadow-xs", m.billing && "translate-x-3.5")} />
                    </button>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button onClick={() => toggleSettingPermission(m.id, "users")} className={cn("w-8 h-4.5 rounded-full transition-colors relative p-0.5 inline-block align-middle", m.users ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-700")}>
                      <div className={cn("w-3.5 h-3.5 rounded-full bg-white transition-transform shadow-xs", m.users && "translate-x-3.5")} />
                    </button>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button onClick={() => toggleSettingPermission(m.id, "permissions")} className={cn("w-8 h-4.5 rounded-full transition-colors relative p-0.5 inline-block align-middle", m.permissions ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-700")}>
                      <div className={cn("w-3.5 h-3.5 rounded-full bg-white transition-transform shadow-xs", m.permissions && "translate-x-3.5")} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
          <h3 className="text-xl font-black text-zinc-900 dark:text-white">Edit Minimal Profile</h3>
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

// ─────────────────────────────────────────────────────────────────────────────
// ATTENDANCE TAB COMPONENT (HEALTHCARE STAFF SHIFT & BIOMETRIC LOGS)
// ─────────────────────────────────────────────────────────────────────────────
function AttendanceTab({
  profile,
  showToast,
}: {
  profile: UserProfileData;
  showToast: (msg: string) => void;
}) {
  const [clockedIn, setClockedIn] = useState(true);

  const attendanceLogs = [
    {
      id: "a1",
      date: "2026-08-08",
      shift: "Morning ICU Ward B",
      clockIn: "08:32 AM",
      clockOut: "In Progress",
      duration: "5h 46m",
      method: "Biometric YubiKey",
      status: "Present",
      statusColor: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    },
    {
      id: "a2",
      date: "2026-08-07",
      shift: "Clinical R&D Lab",
      clockIn: "08:45 AM",
      clockOut: "05:30 PM",
      duration: "8h 45m",
      method: "FaceID Kiosk #2",
      status: "On Time",
      statusColor: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    },
    {
      id: "a3",
      date: "2026-08-06",
      shift: "Night Emergency Duty",
      clockIn: "07:55 PM",
      clockOut: "04:15 AM",
      duration: "8h 20m",
      method: "Passkey Card #84",
      status: "Overtime (+2h)",
      statusColor: "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    },
    {
      id: "a4",
      date: "2026-08-05",
      shift: "Tele-health Consultation",
      clockIn: "09:00 AM",
      clockOut: "05:00 PM",
      duration: "8h 00m",
      method: "Remote OTP",
      status: "Remote",
      statusColor: "bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800",
    },
    {
      id: "a5",
      date: "2026-08-04",
      shift: "Morning ICU Ward B",
      clockIn: "09:18 AM",
      clockOut: "05:30 PM",
      duration: "8h 12m",
      method: "Biometric YubiKey",
      status: "Late (+18m)",
      statusColor: "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    },
  ];

  return (
    <div className="space-y-6 pt-2">
      {/* Live Clock-In Status Banner */}
      <div className="p-6 rounded-3xl bg-zinc-900 text-white dark:bg-zinc-900 border border-zinc-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
              {clockedIn ? "Currently Clocked In" : "Currently Off Duty"}
            </span>
          </div>
          <h3 className="text-xl font-black tracking-tight text-white">
            ICU Ward B & Telemetry Desk
          </h3>
          <p className="text-xs font-medium text-zinc-400">
            Clock-in verified at 08:32 AM • Biometric YubiKey #NPI-8842
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setClockedIn(!clockedIn);
              showToast(clockedIn ? "Clocked out successfully!" : "Clocked in successfully!");
            }}
            className={cn(
              "px-5 py-2.5 rounded-xl text-xs font-black transition-all shadow-xs flex items-center gap-2",
              clockedIn
                ? "bg-rose-600 hover:bg-rose-700 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            )}
          >
            {clockedIn ? "Clock Out" : "Clock In Duty"}
          </button>

          <button
            onClick={() => showToast("Shift swap request sent to Duty Director!")}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-all border border-zinc-700"
          >
            Request Shift Swap
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <span className="text-[10px] font-black uppercase text-zinc-400">Days Present</span>
          <p className="text-xl font-black text-zinc-900 dark:text-white">24 / 25</p>
          <p className="text-[11px] font-bold text-emerald-600">96.2% Punctuality</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <span className="text-[10px] font-black uppercase text-zinc-400">Total Shift Hours</span>
          <p className="text-xl font-black text-zinc-900 dark:text-white">184.5 Hrs</p>
          <p className="text-[11px] font-bold text-zinc-400">August 2026</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <span className="text-[10px] font-black uppercase text-zinc-400">Overtime Earned</span>
          <p className="text-xl font-black text-purple-600 dark:text-purple-400">14.5 Hrs</p>
          <p className="text-[11px] font-bold text-purple-600">+$435.00 Bonus</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <span className="text-[10px] font-black uppercase text-zinc-400">PTO Leave Balance</span>
          <p className="text-xl font-black text-sky-600 dark:text-sky-400">8 Days</p>
          <p className="text-[11px] font-bold text-sky-600">Paid Leave Avail.</p>
        </div>
      </div>

      {/* Daily Attendance Logs Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-zinc-900 dark:text-white">
              Biometric Attendance & Shift Logs
            </h3>
            <p className="text-xs font-medium text-zinc-400">
              Verified clinical clock-in logs and biometric timestamps
            </p>
          </div>

          <button
            onClick={() => showToast("Exporting monthly attendance log PDF...")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            <DownloadSimple size={14} weight="bold" />
            Export Log
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-100 dark:border-zinc-800">
          <table className="w-full text-left text-xs font-semibold">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-950 text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Shift / Ward</th>
                <th className="py-3 px-4">Clock In</th>
                <th className="py-3 px-4">Clock Out</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {attendanceLogs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">
                    {log.date}
                  </td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300 font-bold">
                    {log.shift}
                  </td>
                  <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                    {log.clockIn}
                  </td>
                  <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                    {log.clockOut}
                  </td>
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">
                    {log.duration}
                  </td>
                  <td className="py-3 px-4 text-zinc-400 font-medium">
                    {log.method}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-md text-[10px] font-extrabold border inline-block",
                        log.statusColor
                      )}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}