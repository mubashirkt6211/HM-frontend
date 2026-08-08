/**
 * Profile Page – REUI Application Onboarding & Executive Dossier
 * Features:
 * - Initial Setup Mode (!isSetupCompleted): Renders exact REUI Application Onboarding block
 *   (Vertical Stepper Steps 1..6: Profile -> Role -> Source -> Workspace -> Goals -> Invite)
 * - Completed Setup Mode (isSetupCompleted): Displays Full Executive Profile Dossier,
 *   Minimal Activity Timeline, REUI Workspace Access Matrix & Healthcare Attendance Logs.
 */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  TwitterLogo,
  LinkedinLogo,
  EnvelopeSimple,
  PencilSimple,
  Sliders,
  Plus,
  Trash,
  Check,
  CheckCircle,
  Sparkle,
  UserCheck,
  Briefcase,
  ArrowRight,
  Camera,
  ArrowLeft,
  DownloadSimple,
  ShieldCheck,
  User,
  DotsThreeVertical,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import claraAvatar from "@/assets/clara_avatar.png";
import avatarJohnson from "@/assets/avatar-johnson.png";
import avatarKim from "@/assets/avatar-kim.png";
import avatarPatel from "@/assets/avatar-patel.png";

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
  npiNumber: string;
  timezone: string;
  workspaceName: string;
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
      { text: "Review Summaries", color: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" },
    ],
  },
];

const PRESET_AVATARS = [
  claraAvatar,
  avatarJohnson,
  avatarKim,
  avatarPatel,
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
  // Toggle Mode: Initial Profile Setup (!isSetupCompleted) vs Completed Profile Dossier (isSetupCompleted)
  const [isSetupCompleted, setIsSetupCompleted] = useState(!initialWizardMode);
  const [onboardingStep, setOnboardingStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Profile Form States
  const [profile, setProfile] = useState<UserProfileData>({
    name: "Clara Lefèvre",
    role: "Senior Product Manager & HealthTech Lead",
    department: "Clinical R&D",
    email: "clara.lefevre@hms-health.com",
    phone: "+33 (0) 1 42 68 53 00",
    location: "San Francisco, CA",
    website: "https://hms-health.com/clara",
    twitter: "@clara_health",
    linkedin: "in/clara-lefevre",
    npiNumber: "NPI-8842-HMS",
    timezone: "(GMT-5) New York",
    workspaceName: "HMS Global HealthTech",
    bio: "Just a designer & HealthTech lead. Born in Canada, raised in Slovakia. Currently crafting pixels and clinical CRM systems @HMS Systems.",
    avatar: claraAvatar,
  });

  const [sendUpdates, setSendUpdates] = useState(true);
  const [selectedRoleCard, setSelectedRoleCard] = useState("exec");
  const [activeTab, setActiveTab] = useState<"activity" | "projects" | "teams" | "attendance">("activity");
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCompleteSetup = () => {
    setIsSetupCompleted(true);
    showToast("Profile Setup Completed! Details deployed to dossier.");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20 w-full max-w-full min-w-0 px-4 sm:px-6 md:px-10 pt-6 transition-colors font-sans">
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

      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between pb-4 mb-8 border-b border-zinc-100 dark:border-zinc-900 w-full">
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

          {isSetupCompleted ? (
            <button
              onClick={() => setIsSetupCompleted(false)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 transition-all border border-zinc-200/60 dark:border-zinc-700"
            >
              <Sliders size={14} weight="bold" className="text-indigo-500" />
              Re-run Profile Setup
            </button>
          ) : (
            <button
              onClick={() => setIsSetupCompleted(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 transition-all"
            >
              <CheckCircle size={14} weight="bold" />
              Skip to Profile Dossier
            </button>
          )}
        </div>
      </div>

      {/* ── MODE A: REUI APPLICATION ONBOARDING BLOCK (Exact reui.io/blocks/application/onboarding) ── */}
      {!isSetupCompleted ? (
        <div className="max-w-5xl mx-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 shadow-sm p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Left Column: Vertical Stepper (Steps 1 to 6) */}
              <div className="md:col-span-4 space-y-6 pr-4 border-r border-zinc-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-black text-xs">
                    U
                  </div>
                  <span className="text-sm font-black tracking-tight text-zinc-900 dark:text-white">
                    ReUI Onboarding
                  </span>
                </div>

                <div className="space-y-4 pt-2">
                  {[
                    { num: 1, label: "Profile", sub: "Basic profile details." },
                    { num: 2, label: "Role", sub: "Tune starter views." },
                    { num: 3, label: "Credentials", sub: "NPI & Medical License." },
                    { num: 4, label: "Workspace", sub: "Name the workspace." },
                    { num: 5, label: "Goals", sub: "Pick first workflows." },
                    { num: 6, label: "Invite", sub: "Add teammates." },
                  ].map((s) => {
                    const isActive = onboardingStep === s.num;
                    const isDone = onboardingStep > s.num;
                    return (
                      <button
                        key={s.num}
                        onClick={() => setOnboardingStep(s.num as any)}
                        className="flex items-start gap-3 w-full text-left group"
                      >
                        <span
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-all mt-0.5",
                            isActive
                              ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                              : isDone
                              ? "bg-emerald-500 text-white"
                              : "border-2 border-zinc-300 dark:border-zinc-700 text-zinc-400"
                          )}
                        >
                          {isDone ? <Check size={12} weight="bold" /> : s.num}
                        </span>
                        <div>
                          <p className={cn("text-xs font-bold transition-colors", isActive ? "text-zinc-900 dark:text-white font-black" : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900")}>
                            {s.label}
                          </p>
                          <p className="text-[11px] font-medium text-zinc-400 leading-tight">
                            {s.sub}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Step Form Content */}
              <div className="md:col-span-8 space-y-6 md:pl-4">
                {/* STEP 1: SET UP YOUR PROFILE (Exact match to reui.io screenshot!) */}
                {onboardingStep === 1 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                        Set up your profile
                      </h2>
                      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">
                        Add the details teammates will see across the workspace.
                      </p>
                    </div>

                    {/* Upload Photo Row */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                          {profile.avatar ? (
                            <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <User size={28} className="text-zinc-400" />
                          )}
                        </div>

                        <button
                          onClick={() => setIsAvatarModalOpen(true)}
                          className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-2xs"
                        >
                          Upload photo
                        </button>
                      </div>
                      <p className="text-[11px] font-medium text-zinc-400">
                        PNG or JPG, at least 400 × 400 px, up to 10 MB.
                      </p>
                    </div>

                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-900 dark:text-white">
                        Full name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        placeholder="Sam Rivera"
                        className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs font-bold outline-none focus:border-zinc-900 dark:focus:border-white transition-all"
                      />
                    </div>

                    {/* Job Title */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-900 dark:text-white">
                        Job title
                      </label>
                      <input
                        type="text"
                        value={profile.role}
                        onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                        placeholder="Product Lead"
                        className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs font-bold outline-none focus:border-zinc-900 dark:focus:border-white transition-all"
                      />
                    </div>

                    {/* Timezone Select */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-900 dark:text-white">
                        Timezone
                      </label>
                      <select
                        value={profile.timezone}
                        onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                        className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs font-bold outline-none focus:border-zinc-900 dark:focus:border-white transition-all"
                      >
                        <option value="(GMT-5) New York">(GMT-5) New York</option>
                        <option value="(GMT+1) Paris">(GMT+1) Paris</option>
                        <option value="(GMT+5:30) India Standard Time">(GMT+5:30) India Standard Time</option>
                        <option value="(GMT-8) Pacific Time">(GMT-8) Pacific Time</option>
                      </select>
                    </div>

                    {/* Checkbox */}
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => setSendUpdates(!sendUpdates)}
                        className={cn(
                          "w-5 h-5 rounded-md flex items-center justify-center border shrink-0 transition-colors",
                          sendUpdates
                            ? "bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-950"
                            : "border-zinc-300 dark:border-zinc-700"
                        )}
                      >
                        {sendUpdates && <Check size={12} weight="bold" />}
                      </button>
                      <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Send me product updates and workspace tips.
                      </span>
                    </div>

                    {/* Step Action Buttons */}
                    <div className="flex justify-end pt-4">
                      <button
                        onClick={() => setOnboardingStep(2)}
                        className="px-6 py-2.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-xl text-xs font-black shadow-xs hover:scale-105 transition-all flex items-center gap-1.5"
                      >
                        Next: Select Role <ArrowRight size={14} weight="bold" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: ROLE */}
                {onboardingStep === 2 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                        Define your role
                      </h2>
                      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">
                        Select your primary clinical responsibility across the workspace.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {[
                        { id: "exec", title: "Executive Director & Medical Admin", desc: "Full governance over patient records, FHIR standards, and staff privileges.", badge: "Level 4 Access" },
                        { id: "clinical", title: "Attending Physician & Clinical Lead", desc: "Access to EHR charting, prescription writing, and telemetry alarms.", badge: "Level 3 Access" },
                        { id: "ops", title: "Care Coordinator & Ward Lead", desc: "Bed occupancy management, shift scheduling, and patient intake triage.", badge: "Level 2 Access" },
                      ].map((card) => (
                        <div
                          key={card.id}
                          onClick={() => setSelectedRoleCard(card.id)}
                          className={cn(
                            "p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all",
                            selectedRoleCard === card.id
                              ? "bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-500 shadow-xs"
                              : "bg-zinc-50/50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700"
                          )}
                        >
                          <div>
                            <p className="text-sm font-black text-zinc-900 dark:text-white">{card.title}</p>
                            <p className="text-xs font-medium text-zinc-400 mt-0.5">{card.desc}</p>
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-black uppercase shrink-0">
                            {card.badge}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <button onClick={() => setOnboardingStep(1)} className="text-xs font-bold text-zinc-500">
                        ← Back
                      </button>
                      <button onClick={() => setOnboardingStep(3)} className="px-6 py-2.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-xl text-xs font-black shadow-xs hover:scale-105 transition-all">
                        Next: Credentials →
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: CREDENTIALS */}
                {onboardingStep === 3 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                        Medical License & NPI
                      </h2>
                      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">
                        Optional medical discovery signal and credential verification.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-900 dark:text-white">NPI / License ID</label>
                        <input type="text" value={profile.npiNumber} onChange={(e) => setProfile({ ...profile, npiNumber: e.target.value })} className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold outline-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-900 dark:text-white">Department</label>
                        <input type="text" value={profile.department} onChange={(e) => setProfile({ ...profile, department: e.target.value })} className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold outline-none" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <button onClick={() => setOnboardingStep(2)} className="text-xs font-bold text-zinc-500">← Back</button>
                      <button onClick={() => setOnboardingStep(4)} className="px-6 py-2.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-xl text-xs font-black">Next: Workspace →</button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: WORKSPACE */}
                {onboardingStep === 4 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Name the workspace</h2>
                      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">Configure your primary organization workspace.</p>
                    </div>
                    <input type="text" value={profile.workspaceName} onChange={(e) => setProfile({ ...profile, workspaceName: e.target.value })} className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold outline-none" />

                    <div className="flex items-center justify-between pt-4">
                      <button onClick={() => setOnboardingStep(3)} className="text-xs font-bold text-zinc-500">← Back</button>
                      <button onClick={() => setOnboardingStep(5)} className="px-6 py-2.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-xl text-xs font-black">Next: Goals →</button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 5: GOALS */}
                {onboardingStep === 5 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Pick first workflows</h2>
                      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">Select the tools you'll use most often.</p>
                    </div>
                    <div className="space-y-2 text-xs font-bold">
                      <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-between"><span>Patient Intake & Telemetry</span><Check size={14} className="text-emerald-500" /></div>
                      <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-between"><span>Doctor Consultations & Appointments</span><Check size={14} className="text-emerald-500" /></div>
                      <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-between"><span>EHR Charting & Lab Ordering</span><Check size={14} className="text-emerald-500" /></div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <button onClick={() => setOnboardingStep(4)} className="text-xs font-bold text-zinc-500">← Back</button>
                      <button onClick={() => setOnboardingStep(6)} className="px-6 py-2.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-xl text-xs font-black">Next: Invite →</button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 6: INVITE & COMPLETE */}
                {onboardingStep === 6 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Invite teammates</h2>
                      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">Add colleagues to collaborate in your workspace.</p>
                    </div>
                    <input type="text" placeholder="colleague@hms-health.com" className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold outline-none" />

                    <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      <button onClick={() => setOnboardingStep(5)} className="text-xs font-bold text-zinc-500">← Back</button>
                      <button
                        onClick={handleCompleteSetup}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition-all"
                      >
                        <CheckCircle size={16} weight="fill" />
                        Complete Profile Setup & Save Details →
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── MODE B: COMPLETED PROFILE DOSSIER VIEW (KgBase Minimal View) ── */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start w-full max-w-full min-w-0">
          {/* Left Column: Avatar, Name, About & Connect */}
          <div className="lg:col-span-3 xl:col-span-3 space-y-8 w-full min-w-0">
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
                <p className="text-xs font-bold text-indigo-500 mt-1">{profile.role}</p>
                <p className="text-[11px] font-medium text-zinc-400">{profile.timezone}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">About</h3>
              <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed">{profile.bio}</p>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Connect</h3>
              <div className="space-y-2.5 text-xs font-semibold">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 flex items-center gap-2"><Globe size={14} className="text-sky-500" /> Website</span>
                  <a href={profile.website} target="_blank" rel="noreferrer" className="text-sky-600 dark:text-sky-400 hover:underline truncate max-w-[150px]">{profile.website}</a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 flex items-center gap-2"><EnvelopeSimple size={14} className="text-indigo-500" /> Email</span>
                  <span className="text-zinc-900 dark:text-zinc-200 truncate max-w-[150px]">{profile.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Activity Timeline, Access Matrix & Attendance */}
          <div className="lg:col-span-9 xl:col-span-9 space-y-8 w-full min-w-0">
            <div className="flex items-center gap-8 border-b border-zinc-100 dark:border-zinc-900 pb-3">
              <button onClick={() => setActiveTab("activity")} className={cn("text-xs font-bold transition-all pb-1 relative", activeTab === "activity" ? "text-zinc-950 dark:text-white border-b-2 border-zinc-950 dark:border-white" : "text-zinc-400 hover:text-zinc-600")}>
                Activity
              </button>
              <button onClick={() => setActiveTab("teams")} className={cn("text-xs font-bold transition-all pb-1 relative", activeTab === "teams" ? "text-zinc-950 dark:text-white border-b-2 border-zinc-950 dark:border-white" : "text-zinc-400 hover:text-zinc-600")}>
                Teams & Access
              </button>
              <button onClick={() => setActiveTab("attendance")} className={cn("text-xs font-bold transition-all pb-1 relative flex items-center gap-1.5", activeTab === "attendance" ? "text-zinc-950 dark:text-white border-b-2 border-zinc-950 dark:border-white" : "text-zinc-400 hover:text-zinc-600")}>
                Attendance
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] font-black">Live</span>
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "activity" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 pt-2">
                  <div>
                    <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Release & Activity Changelog</h3>
                    <p className="text-xs font-medium text-zinc-400 mt-1">Recent releases, fixes, FHIR telemetry logs, and platform updates.</p>
                  </div>

                  <div className="relative space-y-8 pt-4">
                    <div className="absolute left-[92px] top-6 bottom-4 w-px bg-zinc-200 dark:border-zinc-800" />
                    {REUI_CRM_TIMELINE.map((item) => (
                      <div key={item.id} className="flex items-start gap-4 relative group">
                        <div className="w-20 shrink-0 text-right text-xs font-semibold text-zinc-400 pt-0.5">{item.date}</div>
                        <div className="w-4 h-4 rounded-full border-2 border-zinc-400 dark:border-zinc-500 bg-white dark:bg-zinc-950 shrink-0 relative z-10 mt-0.5" />
                        <div className="flex-1 space-y-2 min-w-0">
                          <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white leading-snug">{item.title}</h4>
                          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.description}</p>
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {item.badges.map((b, idx) => (
                              <span key={idx} className={cn("px-2.5 py-0.5 rounded-md text-[10px] font-extrabold border transition-all", b.color)}>
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

              {activeTab === "teams" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <OverviewTab profile={profile} showToast={showToast} />
                </motion.div>
              )}

              {activeTab === "attendance" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <AttendanceTab profile={profile} showToast={showToast} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Avatar Selection Modal */}
      <AnimatePresence>
        {isAvatarModalOpen && (
          <AvatarModal
            currentAvatar={profile.avatar}
            onSelect={(av) => {
              setProfile({ ...profile, avatar: av });
              setIsAvatarModalOpen(false);
              showToast("Profile picture updated!");
            }}
            onClose={() => setIsAvatarModalOpen(false)}
          />
        )}
      </AnimatePresence>
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

  const toggleSettingPermission = (id: string, field: "settings" | "billing" | "users" | "permissions") => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: !m[field] } : m)));
    showToast("Permission updated!");
  };

  return (
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
            {members.map((m) => (
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
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ATTENDANCE TAB COMPONENT (EXACT REUI @reui/chart-9 CHART BLOCK)
// ─────────────────────────────────────────────────────────────────────────────
function RadialGauge({
  percentage,
  color = "emerald",
}: {
  percentage: number;
  color?: "emerald" | "rose" | "indigo";
}) {
  const strokeColor =
    color === "emerald"
      ? "stroke-emerald-500"
      : color === "rose"
      ? "stroke-rose-500"
      : "stroke-indigo-500";
  const strokeDash = `${(percentage / 100) * 113} 113`;

  return (
    <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
      <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
        <circle
          cx="22"
          cy="22"
          r="18"
          className="stroke-zinc-200 dark:stroke-zinc-800"
          strokeWidth="4"
          fill="none"
          strokeDasharray="3 2"
        />
        <circle
          cx="22"
          cy="22"
          r="18"
          className={cn("transition-all duration-1000", strokeColor)}
          strokeWidth="4"
          fill="none"
          strokeDasharray={strokeDash}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function AttendanceTab({
  profile,
  showToast,
}: {
  profile: UserProfileData;
  showToast: (msg: string) => void;
}) {
  return (
    <div className="w-full max-w-full min-w-0 pt-2 font-sans">
      {/* REUI @reui/chart-9 Radial Metric Chart Container (Takes Full Available Space) */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-100 dark:divide-zinc-800 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-xs overflow-hidden w-full max-w-full min-w-0">
        {/* Column 1: API Response Time */}
        <div className="p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400">
              API Response Time
            </span>
            <button onClick={() => showToast("Response time metrics options")} className="text-zinc-400 hover:text-zinc-600">
              <DotsThreeVertical size={18} weight="bold" />
            </button>
          </div>

          <div className="flex items-center gap-4 pt-1">
            <RadialGauge percentage={85} color="emerald" />
            <div className="space-y-1">
              <h3 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                132 ms
              </h3>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span>↗ up from</span> <span className="font-extrabold">148 ms</span>
              </p>
            </div>
          </div>
        </div>

        {/* Column 2: Error Rate */}
        <div className="p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400">
              Error Rate
            </span>
            <button onClick={() => showToast("Error rate metrics options")} className="text-zinc-400 hover:text-zinc-600">
              <DotsThreeVertical size={18} weight="bold" />
            </button>
          </div>

          <div className="flex items-center gap-4 pt-1">
            <RadialGauge percentage={40} color="rose" />
            <div className="space-y-1">
              <h3 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                1.4 %
              </h3>
              <p className="text-xs font-bold text-rose-500 dark:text-rose-400 flex items-center gap-1">
                <span>↘ down from</span> <span className="font-extrabold">2.1%</span>
              </p>
            </div>
          </div>
        </div>

        {/* Column 3: Request Throughput */}
        <div className="p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400">
              Request Throughput
            </span>
            <button onClick={() => showToast("Throughput metrics options")} className="text-zinc-400 hover:text-zinc-600">
              <DotsThreeVertical size={18} weight="bold" />
            </button>
          </div>

          <div className="flex items-center gap-4 pt-1">
            <RadialGauge percentage={92} color="emerald" />
            <div className="space-y-1">
              <h3 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                4.3k req/s
              </h3>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span>↗ up from</span> <span className="font-extrabold">3.9k req/s</span>
              </p>
            </div>
          </div>
        </div>
      </div>
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