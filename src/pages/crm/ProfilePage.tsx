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

const MINIMAL_TIMELINE = [
  {
    id: 1,
    type: "edit",
    title: 'Edited records in "Vehicles/Countries"',
    detail: "Added 2 records",
    date: "2026-08-08",
  },
  {
    id: 2,
    type: "comment",
    title: 'New comment in project "Vehicles"',
    comment: "Sorry, I thought you already added it.",
    user: "Clara Lefèvre",
    avatar: claraAvatar,
    date: "2026-08-07",
  },
  {
    id: 3,
    type: "project",
    title: 'New project created "World Geography"',
    detail: "It's time someone compiled a list of countries to use within a web application.",
    date: "2026-08-05",
  },
  {
    id: 4,
    type: "comment",
    title: 'New comment in project "Vehicles"',
    comment: "What you did, is so much better approach in my opinion. Can I start adding more data now?",
    user: "Dr. James Okafor",
    avatar: avatarJohnson,
    date: "2026-08-02",
  },
  {
    id: 5,
    type: "edit",
    title: 'Edited records in "Vehicles/Countries"',
    detail: "Added 2 records",
    date: "2026-07-28",
  },
  {
    id: 6,
    type: "edit",
    title: 'Edited records in "Vehicles/Countries"',
    detail: "Updated 12 records",
    date: "2026-07-20",
  },
  {
    id: 7,
    type: "project",
    title: 'Created new project "Vehicles"',
    detail: "Initial project setup for fleet management and telemetry",
    date: "2026-07-15",
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
}

export function ProfilePage({ onBack }: ProfilePageProps) {
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

  const [activeTab, setActiveTab] = useState<"activity" | "projects" | "teams">("activity");
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20 w-full px-4 md:px-12 lg:px-20 pt-8 transition-colors font-sans">
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
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-zinc-100 dark:border-zinc-900">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft weight="bold" size={14} />
          Dashboard
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsWizardOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 transition-all"
          >
            <Sliders size={14} weight="bold" />
            Setup Wizard
          </button>
        </div>
      </div>

      {/* ── MINIMAL 2-COLUMN SPLIT LAYOUT ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
        {/* ── LEFT COLUMN: Avatar, Name, About & Connect (4 cols) ── */}
        <div className="md:col-span-4 space-y-8">
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

        {/* ── RIGHT COLUMN: Minimal Tab Headers & Vertical Timeline Feed (8 cols) ── */}
        <div className="md:col-span-8 space-y-8">
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
          </div>

          <AnimatePresence mode="wait">
            {/* ── ACTIVITY TIMELINE FEED (Exact KgBase Minimal Timeline) ── */}
            {activeTab === "activity" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative pl-6 space-y-8 border-l border-zinc-200 dark:border-zinc-800"
              >
                {MINIMAL_TIMELINE.map((item) => (
                  <div key={item.id} className="relative group">
                    {/* Icon Node on Timeline Line */}
                    <div className="absolute -left-[31px] top-0.5 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 p-0.5 rounded-full">
                      {item.type === "edit" && <DiamondsFour size={14} weight="bold" />}
                      {item.type === "comment" && <ChatCircleDots size={14} weight="bold" />}
                      {item.type === "project" && <FolderSimple size={14} weight="bold" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-zinc-900 dark:text-white">{item.title}</span>
                        <span className="text-[11px] font-medium text-zinc-400">{item.date}</span>
                      </div>

                      {item.detail && (
                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{item.detail}</p>
                      )}

                      {item.comment && (
                        <div className="mt-2 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800/80 space-y-2">
                          <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed">{item.comment}</p>
                          <div className="flex items-center gap-2 pt-1">
                            <img src={item.avatar} alt={item.user} className="w-5 h-5 rounded-full object-cover" />
                            <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">{item.user}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
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
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              ✕
            </button>
          </div>

          <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full rounded-full transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }} />
          </div>

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
                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-xs"
                    : step > s.num
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                    : "bg-white dark:bg-zinc-900 text-zinc-400 border-zinc-200 dark:border-zinc-800"
                )}
              >
                <span className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0", step === s.num ? "bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white" : step > s.num ? "bg-emerald-500 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400")}>
                  {step > s.num ? <Check size={10} weight="bold" /> : s.num}
                </span>
                <span className="truncate hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar space-y-6">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">Step 1: Personal & Professional Identity</h3>
                <p className="text-xs font-bold text-zinc-400 mt-1">Configure staff name, official email, and designation</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase">Role / Designation</label>
                  <input type="text" value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold outline-none" />
                </div>
              </div>
            </motion.div>
          )}

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
                    <div key={rc.id} onClick={() => setSelectedRoleCard(rc.id)} className={cn("p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all", isSelected ? "bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-500 shadow-xs" : "bg-zinc-50/50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400")}>
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", isSelected ? "bg-indigo-600 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500")}>
                          <Icon size={20} weight="bold" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-zinc-900 dark:text-white">{rc.title}</p>
                          <p className="text-xs font-medium text-zinc-400 mt-0.5">{rc.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">Step 3: Security Verification</h3>
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
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">Step 4: Final Review</h3>
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
              </div>
            </motion.div>
          )}
        </div>

        <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/50">
          <button disabled={step === 1} onClick={() => setStep((s) => Math.max(1, s - 1) as any)} className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-extrabold text-zinc-600 dark:text-zinc-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <CaretLeft size={16} weight="bold" /> Previous
          </button>

          {step < 4 ? (
            <button onClick={() => setStep((s) => Math.min(4, s + 1) as any)} className="flex items-center gap-1.5 px-6 py-2.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-black rounded-xl shadow-xs hover:scale-105 transition-all">
              Next Step <ArrowRight size={14} weight="bold" />
            </button>
          ) : (
            <button onClick={handleComplete} className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 text-white text-xs font-black rounded-xl shadow-md hover:scale-105 transition-all">
              <CheckCircle size={16} weight="fill" /> Complete Onboarding
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