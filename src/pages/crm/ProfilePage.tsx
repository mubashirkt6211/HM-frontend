/**
 * Profile Page – Executive HMS Staff Profile & Dossier
 * Inspired by Attio / Linear Modern CRM Profile Interface:
 * - 2-Column Split Layout (Left Details & Actions Column + Right Overview, Activity & Email Feeds)
 * - Navigation Header: Record Counter (1 of 8,420 in Staff Records)
 * - Compose Email & Action Buttons Bar
 * - AI Description Capsule, Email Capsule, Company Badges, Lists & Rating Stars
 * - Highlights Card & Upcoming Events Carousel Cards
 * - Timeline Activity Feed with Avatars & Collapsible Interaction Logs
 * - Integrated REUI Workspace Access Review Data Grid
 * - Integrated REUI 4-Step Application Wizard Onboarding Modal
 */
import React, { useState, useMemo } from "react";
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
  DownloadSimple,
  Star,
  PencilSimple,
  Sparkle,
  Medal,
  ShareFat,
  Laptop,
  FilePdf,
  DotsThreeVertical,
  MagnifyingGlass,
  PushPin,
  PushPinSlash,
  CaretLeft,
  CaretRight,
  CaretDown,
  CaretUp,
  CircleWavyCheck,
  Sliders,
  CheckCircle,
  UserCheck,
  ArrowRight,
  ArrowsClockwise,
  UserPlus,
  LinkSimple,
  DotsThree,
  CalendarBlank,
  ChatCircleDots,
  UsersThree,
  TrendUp,
  Envelope,
  Sparkle as SparkleIcon,
  CheckCircle as CheckCircleIcon,
  House,
  MagnifyingGlassPlus,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import claraAvatar from "@/assets/clara_avatar.png";
import avatarJohnson from "@/assets/avatar-johnson.png";
import avatarKim from "@/assets/avatar-kim.png";
import avatarPatel from "@/assets/avatar-patel.png";
import avatarSingh from "@/assets/avatar-singh.png";

// ─────────────────────────────────────────────────────────────────────────────
// DATA TYPES
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
];

const PRESET_AVATARS = [
  claraAvatar,
  avatarJohnson,
  avatarKim,
  avatarPatel,
  avatarSingh,
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
];

const ACTIVITY_FEED = [
  {
    id: 1,
    user: "Sam Jackson",
    avatar: avatarJohnson,
    action: "made an outbound call regarding FHIR Integration",
    time: "2 hours ago",
    type: "call",
  },
  {
    id: 2,
    user: "Clara Lefèvre",
    avatar: claraAvatar,
    action: "attended an executive architecture review with Clinical R&D",
    time: "4 hours ago",
    type: "meeting",
  },
  {
    id: 3,
    user: "Ashley Lawson",
    avatar: avatarPatel,
    action: "attended an in-person product design workshop",
    time: "Yesterday, 3:45 PM",
    type: "event",
  },
  {
    id: 4,
    user: "Dr. James Okafor",
    avatar: avatarSingh,
    action: "approved HIPAA Class IV security compliance dossier",
    time: "2 days ago",
    type: "approval",
  },
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
    role: "Founder & HealthTech Lead at HMS Systems",
    department: "Clinical R&D & CRM Solutions",
    employeeId: "HMS-EMP-8842",
    email: "clara.lefevre@hms-health.com",
    phone: "+33 (0) 1 42 68 53 00",
    location: "San Francisco, CA",
    accessLevel: "Level 4 (Executive Staff)",
    bio: "Clara Lefèvre is Founder & HealthTech Lead at HMS Systems in the sustainability & healthcare space who just raised a Series B round.",
    emergencyContact: "Henri Lefèvre (Spouse) — +33 (0) 6 12 34 56 78",
    joiningDate: "January 15, 2022",
    manager: "Dr. James Okafor (Chief Medical Officer)",
    avatar: claraAvatar,
  });

  const [activeRightTab, setActiveRightTab] = useState<"overview" | "activity" | "emails" | "permissions">("overview");
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [isListsOpen, setIsListsOpen] = useState(true);
  const [showAllInteractions, setShowAllInteractions] = useState(false);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-zinc-50/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20 w-full px-4 md:px-8 lg:px-12 pt-4 transition-colors">
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

      {/* Top Pagination & Record Navigation Header */}
      <div className="flex items-center justify-between py-3 mb-6 border-b border-zinc-200/80 dark:border-zinc-800 text-xs font-semibold text-zinc-500">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Back"
          >
            ✕
          </button>
          <div className="flex items-center gap-1 text-zinc-400">
            <button className="p-1 hover:text-zinc-900 dark:hover:text-white">⌃</button>
            <button className="p-1 hover:text-zinc-900 dark:hover:text-white">⌄</button>
          </div>
          <span className="text-zinc-600 dark:text-zinc-300 font-bold">1,538 of 59,273 in People</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsWizardOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-black shadow-xs hover:scale-[1.02] transition-all"
          >
            <Sliders size={14} weight="bold" />
            Launch Setup Wizard
          </button>

          <button
            onClick={() => showToast("Added to favorites!")}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-500 transition-colors"
            title="Bookmark"
          >
            <Star size={16} weight="bold" />
          </button>
        </div>
      </div>

      {/* ── MAIN Split 2-Column Attio/Linear Executive Profile Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT COLUMN: Profile Header & Details Panel (5 cols) ── */}
        <div className="lg:col-span-5 space-y-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 md:p-8 shadow-xs">
          {/* Avatar & Title Header */}
          <div className="space-y-4">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-800 group shadow-md">
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
              <button
                onClick={() => setIsAvatarModalOpen(true)}
                className="absolute inset-0 bg-zinc-950/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
              >
                <Camera size={18} weight="bold" />
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">{profile.name}</h1>
                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  <PencilSimple size={16} weight="bold" />
                </button>
              </div>
              <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mt-1">{profile.role}</p>
            </div>

            {/* Action Bar: Compose email & Quick Icon Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={() => showToast("Opening email composer...")}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 text-xs font-black shadow-xs hover:scale-[1.02] transition-all"
              >
                <EnvelopeSimple size={14} weight="bold" />
                Compose email
              </button>

              <button onClick={() => showToast("Synced profile logs")} className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200">
                <ArrowsClockwise size={14} weight="bold" />
              </button>

              <button onClick={() => showToast("Tagged contact")} className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200">
                <UserCheck size={14} weight="bold" />
              </button>

              <button onClick={() => showToast("Added collaborator")} className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200">
                <UserPlus size={14} weight="bold" />
              </button>

              <button onClick={() => showToast("Copied link")} className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200">
                <LinkSimple size={14} weight="bold" />
              </button>

              <button onClick={() => showToast("More actions")} className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200">
                <DotsThree size={14} weight="bold" />
              </button>
            </div>
          </div>

          <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800" />

          {/* Details Collapsible Section */}
          <div className="space-y-4">
            <button
              onClick={() => setIsDetailsOpen(!isDetailsOpen)}
              className="flex items-center gap-2 text-xs font-black text-zinc-500 uppercase tracking-wider w-full justify-between"
            >
              <span className="flex items-center gap-1.5">
                {isDetailsOpen ? <CaretDown size={14} weight="bold" /> : <CaretRight size={14} weight="bold" />}
                Details
              </span>
            </button>

            {isDetailsOpen && (
              <div className="space-y-3 text-xs font-bold pt-1">
                <div className="grid grid-cols-12 gap-2 items-center">
                  <span className="col-span-4 text-zinc-400 font-semibold flex items-center gap-1.5">
                    <User size={14} /> Name
                  </span>
                  <span className="col-span-8 text-zinc-900 dark:text-zinc-100 font-black">{profile.name}</span>
                </div>

                <div className="grid grid-cols-12 gap-2 items-center">
                  <span className="col-span-4 text-zinc-400 font-semibold flex items-center gap-1.5">
                    <FileText size={14} /> Description
                    <span className="px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[9px] font-black uppercase">
                      AI
                    </span>
                  </span>
                  <span className="col-span-8 text-zinc-900 dark:text-zinc-100">{profile.role}</span>
                </div>

                <div className="grid grid-cols-12 gap-2 items-center">
                  <span className="col-span-4 text-zinc-400 font-semibold flex items-center gap-1.5">
                    <EnvelopeSimple size={14} /> Emails
                  </span>
                  <span className="col-span-8">
                    <span className="px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-[11px] font-extrabold inline-block">
                      {profile.email}
                    </span>
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-2 items-center">
                  <span className="col-span-4 text-zinc-400 font-semibold flex items-center gap-1.5">
                    <MapPin size={14} /> Location
                  </span>
                  <span className="col-span-8 text-zinc-900 dark:text-zinc-100">{profile.location}</span>
                </div>

                <div className="grid grid-cols-12 gap-2 items-center">
                  <span className="col-span-4 text-zinc-400 font-semibold flex items-center gap-1.5">
                    <Buildings size={14} /> Company
                  </span>
                  <span className="col-span-8 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="font-extrabold text-zinc-900 dark:text-zinc-100">HMS Global Health Systems</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800" />

          {/* Lists Collapsible Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsListsOpen(!isListsOpen)}
                className="flex items-center gap-2 text-xs font-black text-zinc-500 uppercase tracking-wider"
              >
                {isListsOpen ? <CaretDown size={14} weight="bold" /> : <CaretRight size={14} weight="bold" />}
                Lists
                <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] text-zinc-600 dark:text-zinc-400">
                  2
                </span>
              </button>

              <button className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white p-1">
                <Plus size={14} weight="bold" />
              </button>
            </div>

            {isListsOpen && (
              <div className="p-4 rounded-2xl bg-zinc-50/70 dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800/80 space-y-3 text-xs font-bold">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <Star size={14} weight="fill" />
                  <span>Community Members</span>
                </div>

                <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                  <Buildings size={14} />
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>GreenLeaf Systems</span>
                </div>

                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                  <Phone size={14} />
                  <span>{profile.phone}</span>
                </div>

                <div className="flex items-center gap-1 text-amber-400 pt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} weight="fill" />
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-200/60 dark:border-zinc-800">
                  <span className="hover:text-zinc-900 dark:hover:text-white cursor-pointer">Show all</span>
                  <span className="flex items-center gap-1">
                    <ChatCircleDots size={14} /> 34
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT COLUMN: Main Tabbed Overview, Activity Feed & Permissions Data Grid (7 cols) ── */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Pill Tabs */}
          <div className="flex items-center gap-6 border-b border-zinc-200/80 dark:border-zinc-800 pb-3">
            <button
              onClick={() => setActiveRightTab("overview")}
              className={cn(
                "flex items-center gap-2 text-sm font-black transition-all pb-1.5 relative",
                activeRightTab === "overview"
                  ? "text-zinc-950 dark:text-white border-b-2 border-zinc-950 dark:border-white"
                  : "text-zinc-400 hover:text-zinc-600"
              )}
            >
              <UsersThree size={16} weight="bold" />
              Overview
            </button>

            <button
              onClick={() => setActiveRightTab("activity")}
              className={cn(
                "flex items-center gap-2 text-sm font-black transition-all pb-1.5 relative",
                activeRightTab === "activity"
                  ? "text-zinc-950 dark:text-white border-b-2 border-zinc-950 dark:border-white"
                  : "text-zinc-400 hover:text-zinc-600"
              )}
            >
              <TrendUp size={16} weight="bold" />
              Activity
            </button>

            <button
              onClick={() => setActiveRightTab("emails")}
              className={cn(
                "flex items-center gap-2 text-sm font-black transition-all pb-1.5 relative",
                activeRightTab === "emails"
                  ? "text-zinc-950 dark:text-white border-b-2 border-zinc-950 dark:border-white"
                  : "text-zinc-400 hover:text-zinc-600"
              )}
            >
              <Envelope size={16} weight="bold" />
              Emails
              <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-extrabold text-zinc-600 dark:text-zinc-400">
                217
              </span>
            </button>

            <button
              onClick={() => setActiveRightTab("permissions")}
              className={cn(
                "flex items-center gap-2 text-sm font-black transition-all pb-1.5 relative",
                activeRightTab === "permissions"
                  ? "text-zinc-950 dark:text-white border-b-2 border-zinc-950 dark:border-white"
                  : "text-zinc-400 hover:text-zinc-600"
              )}
            >
              <ShieldCheck size={16} weight="bold" />
              Access Matrix
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeRightTab === "overview" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                {/* Highlights Card */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 md:p-8 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black text-zinc-500 uppercase tracking-wider">
                    <UsersThree size={16} className="text-indigo-500" />
                    Highlights
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase text-zinc-400">Summary</p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-relaxed">
                      {profile.bio}
                    </p>
                  </div>

                  {/* Upcoming Event Cards Carousel */}
                  <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-zinc-50/70 dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">Upcoming</span>
                        <h4 className="text-xs font-black text-zinc-900 dark:text-zinc-100 mt-1">AI Founders Summit</h4>
                        <p className="text-[11px] font-semibold text-zinc-400">Apr 29, 10:30 AM</p>
                      </div>

                      <div className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-center shadow-xs">
                        <span className="text-[9px] font-black uppercase text-zinc-400">THU</span>
                        <p className="text-sm font-black text-zinc-900 dark:text-white leading-none">29</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-zinc-50/70 dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">Upcoming</span>
                        <h4 className="text-xs font-black text-zinc-900 dark:text-zinc-100 mt-1">FHIR HealthTech Sync</h4>
                        <p className="text-[11px] font-semibold text-zinc-400">May 04, 02:00 PM</p>
                      </div>

                      <div className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-center shadow-xs">
                        <span className="text-[9px] font-black uppercase text-zinc-400">TUE</span>
                        <p className="text-sm font-black text-zinc-900 dark:text-white leading-none">04</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity Feed Section */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 md:p-8 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                      <TrendUp size={16} className="text-indigo-500" />
                      Activity & Interactions
                    </h3>
                    <CaretRight size={14} className="text-zinc-400" />
                  </div>

                  <div className="space-y-4 pt-2">
                    {ACTIVITY_FEED.map((act) => (
                      <div key={act.id} className="flex items-start gap-3 text-xs font-bold">
                        <img src={act.avatar} alt={act.user} className="w-8 h-8 rounded-full object-cover shrink-0 border border-zinc-200 dark:border-zinc-700" />
                        <div className="flex-1">
                          <p className="text-zinc-900 dark:text-zinc-100 leading-snug">
                            <span className="font-black">{act.user}</span> {act.action}
                          </p>
                          <span className="text-[10px] font-medium text-zinc-400">{act.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowAllInteractions(!showAllInteractions)}
                    className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white pt-2"
                  >
                    <CaretDown size={14} />
                    {showAllInteractions ? "Hide interactions" : "Show 26 more interactions"}
                  </button>
                </div>
              </motion.div>
            )}

            {activeRightTab === "activity" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 md:p-8 shadow-xs space-y-4">
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">Full Interaction Logs</h3>
                <p className="text-xs font-bold text-zinc-400">Complete historical timeline of calls, meetings, and system audits.</p>
              </motion.div>
            )}

            {activeRightTab === "emails" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 md:p-8 shadow-xs space-y-4">
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">Email Threads (217 Messages)</h3>
                <p className="text-xs font-bold text-zinc-400">Encrypted communication history with Clara Lefèvre.</p>
              </motion.div>
            )}

            {activeRightTab === "permissions" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <OverviewTab profile={profile} onEdit={() => setIsEditProfileOpen(true)} showToast={showToast} />
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
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden mb-6">
            <div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${(step / 4) * 100}%` }}
            />
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
// DATA GRID VIEW (REUI WORKSPACE ACCESS MATRIX)
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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs p-6 sm:p-8 space-y-6">
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
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-all border border-zinc-200 dark:border-zinc-700 shadow-xs"
          >
            <DownloadSimple size={15} weight="bold" />
            Export review
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
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
                <tr key={m.id} className={cn("hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors", m.isPinned && "bg-zinc-50/40 dark:bg-zinc-950/30")}>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => togglePin(m.id)} className={cn("p-1 rounded-md transition-colors", m.isPinned ? "text-zinc-950 dark:text-white" : "text-zinc-300 dark:text-zinc-700 hover:text-zinc-500")}>
                      <PushPin size={14} weight={m.isPinned ? "fill" : "bold"} className={cn(m.isPinned && "-rotate-45")} />
                    </button>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-700" />
                      <div>
                        <p className="font-extrabold text-zinc-900 dark:text-zinc-100 leading-snug">{m.name}</p>
                        <p className="text-[11px] font-semibold text-zinc-400 leading-snug">{m.role} • {m.statusText}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button onClick={() => toggleSettingPermission(m.id, "settings")} className={cn("w-9 h-5 rounded-full transition-colors relative p-0.5 inline-block align-middle", m.settings ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-700")}>
                      <div className={cn("w-4 h-4 rounded-full bg-white transition-transform shadow-xs", m.settings && "translate-x-4")} />
                    </button>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button onClick={() => toggleSettingPermission(m.id, "billing")} className={cn("w-9 h-5 rounded-full transition-colors relative p-0.5 inline-block align-middle", m.billing ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-700")}>
                      <div className={cn("w-4 h-4 rounded-full bg-white transition-transform shadow-xs", m.billing && "translate-x-4")} />
                    </button>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button onClick={() => toggleIntegrationPermission(m.id)} className={cn("w-9 h-5 rounded-full transition-colors relative p-0.5 inline-block align-middle", m.integrations === "on" ? "bg-emerald-500" : m.integrations === "warning" ? "bg-amber-500" : "bg-zinc-200 dark:bg-zinc-700")}>
                      <div className={cn("w-4 h-4 rounded-full bg-white transition-transform shadow-xs", m.integrations !== "off" && "translate-x-4")} />
                    </button>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button onClick={() => toggleSettingPermission(m.id, "users")} className={cn("w-9 h-5 rounded-full transition-colors relative p-0.5 inline-block align-middle", m.users ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-700")}>
                      <div className={cn("w-4 h-4 rounded-full bg-white transition-transform shadow-xs", m.users && "translate-x-4")} />
                    </button>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button onClick={() => toggleSettingPermission(m.id, "permissions")} className={cn("w-9 h-5 rounded-full transition-colors relative p-0.5 inline-block align-middle", m.permissions ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-700")}>
                      <div className={cn("w-4 h-4 rounded-full bg-white transition-transform shadow-xs", m.permissions && "translate-x-4")} />
                    </button>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button onClick={() => showToast(`Actions menu opened for ${m.name}`)} className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
                      <DotsThreeVertical size={16} weight="bold" />
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