import React, { useState } from "react";
import {
  PanelLeft,
  UserCheck,
  Users,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
  Zap,
  Home,
  ChevronRight,
  ChevronLeft,
  LayoutDashboard,
  Calendar,
  CalendarDays,
  ListTodo,
  UserSquare,
  Bell,
  CheckCircle2,
  Inbox,
  Layers,
  Archive,
  BellRing,
  MessageSquare,
  CheckSquare,
  BarChart2,
  ShieldCheck,
  User,
  DollarSign,
  Activity,
  Building2,
  Building2Icon,
  Mail,
  Target,
  Bone,
  Smile,
  Briefcase,
  Handshake,
  TrendingUp,
  UserPlus,
  Megaphone,
  Star,
  Workflow,
  ClipboardList,
} from "lucide-react";

import { useSidebar } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { UserRole } from "@/models/user"
import { MapTrifold } from "@phosphor-icons/react";
import { IconCalendarWeek } from "@tabler/icons-react";
import claraAvatar from "@/assets/clara_avatar.png";


const PAGE_META: Record<string, { label: string; icon: React.ElementType }> = {
  dashboard: { label: "Dashboard", icon: LayoutDashboard },
  analytics: { label: "Forecast", icon: TrendingUp },
  forecast: { label: "Sales Forecast", icon: TrendingUp },
  leads: { label: "Leads", icon: Target },
  todo: { label: "To Do", icon: CheckCircle2 },
  calendar: { label: "Calendar", icon: IconCalendarWeek },
  "itinerary-builder": { label: "Itinerary Builder", icon: MapTrifold },
  accounts: { label: "Accounts", icon: Briefcase },
  deals: { label: "Deals", icon: Handshake },
  "open-deals": { label: "Open Deals", icon: BarChart2 },
  "won-deals": { label: "Won Deals", icon: ShieldCheck },
  "lost-deals": { label: "Lost Deals", icon: Archive },
  notes: { label: "Prospects", icon: UserPlus },
  contacts: { label: "Contacts", icon: Users },
  clients: { label: "Companies", icon: Building2 },
  people: { label: "People", icon: Users },
  "uk-eu-companies": { label: "Hot Leads", icon: Star },
  "b2b-building": { label: "Priority Accounts", icon: Star },
  partnership: { label: "Partnerships", icon: Handshake },
  "crm-template": { label: "Meeting Template", icon: Star },
  "sales-navigator": { label: "Campaigns", icon: Megaphone },
  "emails-marketing-agency": { label: "Sequences", icon: ClipboardList },
  automations: { label: "Automations", icon: Zap },
  workflows: { label: "Workflows", icon: Workflow },
  patients: { label: "Patients", icon: Activity },
  doctors: { label: "Doctors", icon: UserSquare },
  messages: { label: "Messages", icon: MessageSquare },
  tasks: { label: "Tasks", icon: CheckSquare },
  emails: { label: "Emails", icon: Mail },
  reports: { label: "Reports", icon: BarChart2 },
  privileges: { label: "Privileges", icon: ShieldCheck },
  profile: { label: "Profile", icon: User },
  revenue: { label: "Revenue", icon: DollarSign },
  nurse: { label: "Nurses", icon: Activity },
  notifications: { label: "Notifications", icon: Bell },
  "company-setup": { label: "Company setup", icon: Building2Icon },
  orthopedics: { label: "Orthopedics", icon: Bone },
  orthodontics: { label: "Orthodontics", icon: Smile },
};

const CATEGORIES = [
  { id: 'all', label: 'All', icon: Inbox },
  { id: 'unread', label: 'Unread', icon: Bell },
  { id: 'crm', label: 'CRM & Leads', icon: Target },
  { id: 'system', label: 'System', icon: Layers },
] as const;

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    user: {
      name: "Polly Vance",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
    action: "assigned a new lead to you",
    target: "Esther Howard (Meta Ads)",
    time: "12 mins ago",
    project: "Leads",
    category: "crm",
    unread: true,
    pageId: "leads",
    hasActions: true,
  },
  {
    id: 2,
    user: {
      name: "Dr. Marcus Vance",
      avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
    },
    action: "updated deal status to",
    target: "Proposal Stage ($48,000)",
    time: "45 mins ago",
    project: "Pipeline",
    category: "crm",
    unread: true,
    pageId: "pipeline",
  },
  {
    id: 3,
    user: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    action: "commented on task",
    target: "Multi-Language Support Planning",
    time: "2 hours ago",
    project: "To Do",
    category: "crm",
    unread: false,
    pageId: "todo",
  },
  {
    id: 4,
    user: {
      name: "Leadwave System",
      avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    },
    action: "generated monthly revenue report",
    target: "July 2026 Summary",
    time: "4 hours ago",
    project: "Revenue",
    category: "system",
    unread: false,
    pageId: "revenue",
    attachment: "Revenue_July_2026.pdf"
  },
  {
    id: 5,
    user: {
      name: "James Wilson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    action: "scheduled a client meeting for",
    target: "Tomorrow at 10:30 AM",
    time: "1 day ago",
    project: "Calendar",
    category: "crm",
    unread: false,
    pageId: "calendar",
  }
];

const DEFAULT_NOTIFICATION_PREFERENCES = [
  { id: "lead_alerts", label: "New Lead Assignments", description: "Get immediate alerts when a new lead is assigned to you", checked: true, category: "CRM" },
  { id: "deal_updates", label: "Deal & Pipeline Updates", description: "Notify when deal stage or valuation changes", checked: true, category: "CRM" },
  { id: "task_reminders", label: "To Do & Task Reminders", description: "Alerts for upcoming, due today, and overdue tasks", checked: true, category: "Tasks" },
  { id: "email_digest", label: "Email Daily Summary", description: "Send a daily activity summary to your registered email", checked: false, category: "Email" },
  { id: "sound_effects", label: "Chime Audio Alerts", description: "Play a subtle chime sound on new inbound notification", checked: true, category: "System" },
  { id: "desktop_push", label: "Browser Push Notifications", description: "Show desktop popups when application is active", checked: true, category: "System" },
];

export function SiteHeader({
  onTabChange,
  currentPage = "dashboard",
  activeTab,
  onPageChange,
  userRole,
  setUserRole,
  pageHistory
}: {
  onTabChange?: (tab: string) => void;
  onPageChange?: (page: string) => void;
  currentPage?: string;
  activeTab?: string;
  userRole?: UserRole;
  setUserRole?: (role: UserRole) => void;
  pageHistory?: string[];
}) {

  const { toggleSidebar } = useSidebar();
  const pageMeta = PAGE_META[currentPage] ?? { label: "Dashboard", icon: LayoutDashboard };

  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState(DEFAULT_NOTIFICATION_PREFERENCES);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const togglePreference = (id: string) => {
    setPreferences(prev => prev.map(p => p.id === id ? { ...p, checked: !p.checked } : p));
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeCategory === "all") return true;
    if (activeCategory === "unread") return n.unread;
    return n.category === activeCategory;
  });

  const getCategoryCount = (catId: string) => {
    if (catId === "all") return notifications.length;
    if (catId === "unread") return notifications.filter(n => n.unread).length;
    return notifications.filter(n => n.category === catId).length;
  };

  const breadcrumbItems = (pageHistory && pageHistory.length > 0) ? pageHistory : [currentPage];

  return (
    <header className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md rounded-t-[20px] shrink-0 sticky top-0 z-10 w-full h-16 px-6 md:px-10 no-scrollbar">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors"
        >
          <PanelLeft className="w-5 h-5" />
        </button>
        <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1"></div>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm overflow-x-auto no-scrollbar py-1">
          {breadcrumbItems.map((pageId, idx, arr) => {
            const isLast = idx === arr.length - 1;
            const meta = pageId === "dashboard"
              ? { label: "Home", icon: Home }
              : (PAGE_META[pageId] ?? { label: pageId, icon: LayoutDashboard });
            const Icon = meta.icon;

            return (
              <div key={`${pageId}-${idx}`} className="flex items-center gap-1.5 shrink-0">
                {idx > 0 && (
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-700 shrink-0" />
                )}
                <button
                  type="button"
                  disabled={isLast}
                  onClick={() => onPageChange?.(pageId)}
                  className={`flex items-center gap-1.5 transition-colors shrink-0 ${isLast
                    ? "text-zinc-900 dark:text-zinc-100 font-semibold cursor-default"
                    : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 font-medium cursor-pointer"
                    }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[13px]">{meta.label}</span>
                </button>
              </div>
            );
          })}
        </nav>

      </div>

      <div className="flex items-center gap-4">

        {/* Notification Bell */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-[0_2px_12px_-3px_rgba(16,185,129,0.15)] transition-all duration-300 group outline-none cursor-pointer">
              <div className="absolute -inset-px rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 blur-[2px] transition-opacity duration-300" />
              <BellRing className="w-[18px] h-[18px] relative transition-transform group-hover:rotate-[15deg] duration-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 text-white">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-600 text-[9px] font-black items-center justify-center border border-white dark:border-zinc-950 leading-none">
                    {unreadCount}
                  </span>
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[420px] p-0 rounded-[24px] border-zinc-200/60 dark:border-zinc-800/60 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden" align="end" sideOffset={12}>
            {/* Header */}
            <div className="p-4 px-5 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40">
              {showSettings ? (
                <div className="flex items-center justify-between w-full">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="flex items-center gap-1.5 text-[13px] font-bold text-zinc-800 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 text-zinc-500" />
                    <span>Notification Settings</span>
                  </button>
                  <button
                    onClick={() => setPreferences(DEFAULT_NOTIFICATION_PREFERENCES)}
                    className="text-[11px] font-semibold text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                  >
                    Reset defaults
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2.5">
                    {unreadCount > 0 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); markAllAsRead(); }}
                        className="text-[12px] font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    )}
                    <button
                      onClick={() => setShowSettings(true)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                      title="Notification preferences"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>

            {showSettings ? (
              /* Settings View with Checkboxes / Toggle Switches */
              <div className="p-4 max-h-[440px] overflow-y-auto no-scrollbar space-y-2">
                <div className="px-1 pb-1">
                  <p className="text-[12px] font-medium text-zinc-500 dark:text-zinc-400">
                    Select your preferred notification triggers and channels.
                  </p>
                </div>
                {preferences.map((pref) => (
                  <label
                    key={pref.id}
                    className="flex items-start justify-between p-3 rounded-xl hover:bg-zinc-50/80 dark:hover:bg-zinc-900/60 transition-colors cursor-pointer border border-zinc-100 dark:border-zinc-800/80 group"
                  >
                    <div className="flex-1 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[12.5px] font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {pref.label}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                          {pref.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 leading-snug">
                        {pref.description}
                      </p>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        checked={pref.checked}
                        onChange={() => togglePreference(pref.id)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:after:border-zinc-600 peer-checked:bg-emerald-600"></div>
                    </div>
                  </label>
                ))}
                <div className="pt-2 px-1 text-center border-t border-zinc-100 dark:border-zinc-800/60 mt-3">
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Preferences updated automatically
                  </span>
                </div>
              </div>
            ) : (
              <>
                {/* Category Tabs */}
                <div className="px-3 pt-2.5 pb-2 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/20 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
                  <div className="flex items-center gap-1.5 w-full">
                    {CATEGORIES.map((cat) => {
                      const count = getCategoryCount(cat.id);
                      const isActive = activeCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setActiveCategory(cat.id)}
                          className={`px-3 py-1.5 rounded-xl text-[12px] transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                            isActive
                              ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-zinc-950 font-extrabold shadow-sm'
                              : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 font-semibold'
                          }`}
                        >
                          <cat.icon className={`w-3.5 h-3.5 ${isActive ? 'text-white dark:text-zinc-950' : 'text-zinc-400'}`} />
                          <span>{cat.label}</span>
                          {count > 0 && (
                            <span className={`px-1.5 py-0.2 rounded-full text-[9.5px] font-black ${
                              isActive
                                ? 'bg-white/20 dark:bg-zinc-950/20 text-white dark:text-zinc-950'
                                : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            }`}>
                              {count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* List */}
                <div className="max-h-[420px] overflow-y-auto no-scrollbar">
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => {
                          if (notification.unread) markAsRead(notification.id);
                          if (notification.pageId) onPageChange?.(notification.pageId);
                        }}
                        className={`relative flex items-start gap-3 p-3.5 transition-all cursor-pointer group border-b border-zinc-100/70 dark:border-zinc-900/60 last:border-none ${
                          notification.unread
                            ? 'bg-emerald-50/40 dark:bg-emerald-950/20 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/30 border-l-2 border-l-emerald-600 dark:border-l-emerald-500'
                            : 'hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40'
                        }`}
                      >
                        {/* Avatar */}
                        <div className="relative shrink-0 mt-0.5">
                          <Avatar className="h-9 w-9 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
                            <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-[10px] font-bold">
                              {notification.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {notification.unread && (
                            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-600 border-2 border-white dark:border-zinc-950 rounded-full" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-[12.5px] leading-snug text-zinc-900 dark:text-zinc-100">
                              <span className="font-bold">{notification.user.name}</span>{" "}
                              <span className="text-zinc-500 dark:text-zinc-400">{notification.action}</span>{" "}
                              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{notification.target}</span>
                            </p>
                            <span className="text-[10px] font-medium text-zinc-400 whitespace-nowrap shrink-0">
                              {notification.time}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                              {notification.project}
                            </span>
                            {notification.pageId && (
                              <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 group-hover:underline">
                                View details →
                              </span>
                            )}
                          </div>

                          {/* Attachment (if any) */}
                          {notification.attachment && (
                            <div className="mt-2 p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 flex items-center gap-2 max-w-fit shadow-2xs">
                              <Plus className="w-3 h-3 text-zinc-400 rotate-45" />
                              <span className="text-[10.5px] font-semibold text-zinc-700 dark:text-zinc-300">{notification.attachment}</span>
                            </div>
                          )}

                          {/* Inline Actions */}
                          {notification.unread && (
                            <div className="flex items-center gap-2 mt-2.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white dark:text-zinc-950 text-[10px] font-bold flex items-center gap-1.5 transition-all hover:bg-emerald-700 active:scale-95 cursor-pointer shadow-xs"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                Mark read
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-14 flex flex-col items-center justify-center text-center px-8">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mb-3 border border-emerald-100 dark:border-emerald-900/40">
                        <Bell className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h4 className="text-[14px] font-bold text-zinc-900 dark:text-zinc-100 mb-1">No notifications</h4>
                      <p className="text-[12px] text-zinc-400 max-w-[220px]">
                        {activeCategory === "unread" ? "You're all caught up! No unread notifications." : `No notifications in ${activeCategory}.`}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />



        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-9 w-9 cursor-pointer border-2 border-zinc-100 dark:border-zinc-800 hover:ring-4 hover:ring-zinc-50 dark:hover:ring-zinc-900/50 transition-all duration-300">
              <AvatarImage src={claraAvatar} alt="@clara" />
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">CL</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 p-1.5 rounded-[22px] border-zinc-200/50 dark:border-zinc-800/50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]" align="end" sideOffset={8}>
            <DropdownMenuLabel className="p-3 pt-2 cursor-pointer" onClick={() => onPageChange?.("profile")}>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">Clara Lefèvre</span>
                  <span className="text-[11px] font-medium text-zinc-400">clara.lefevre@hms-health.com</span>
                </div>
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 opacity-20 blur-sm"></div>
                  <Avatar className="h-12 w-12 border-2 border-white dark:border-zinc-900 shadow-sm relative">
                    <AvatarImage src={claraAvatar} />
                  </Avatar>
                </div>
              </div>
            </DropdownMenuLabel>

            <div className="space-y-0.5">
              {/* <DropdownMenuItem
                onClick={() => onPageChange?.("setup-wizard")}
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center border border-indigo-100 dark:border-indigo-800 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Zap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 group-hover:text-white" />
                </div>
                <span className="text-[13px] font-extrabold text-zinc-900 dark:text-zinc-100">Profile Setup</span>
              </DropdownMenuItem> */}

              <DropdownMenuItem
                onClick={() => onPageChange?.("profile")}
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-100 dark:border-zinc-800 group-hover:bg-white dark:group-hover:bg-zinc-800 transition-colors">
                  <UserCheck className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
                </div>
                <span className="text-[13px] font-semibold text-zinc-700 dark:text-zinc-300">Profile</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group">
                <div className="w-7 h-7 rounded-lg bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-100 dark:border-zinc-800 group-hover:bg-white dark:group-hover:bg-zinc-800 transition-colors">
                  <Users className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
                </div>
                <span className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400">Community</span>
                <div className="ml-auto w-4 h-4 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <Plus className="w-2.5 h-2.5 text-zinc-500" />
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group">
                <div className="w-7 h-7 rounded-lg bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-100 dark:border-zinc-800 group-hover:bg-white dark:group-hover:bg-zinc-800 transition-colors">
                  <CreditCard className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
                </div>
                <span className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400">Subscription</span>
                <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-none px-1.5 py-0 h-4 flex items-center gap-1 text-[9px] font-bold">
                  <Zap className="w-2 h-2 fill-current" />
                  PRO
                </Badge>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group">
                <div className="w-7 h-7 rounded-lg bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-100 dark:border-zinc-800 group-hover:bg-white dark:group-hover:bg-zinc-800 transition-colors">
                  <Settings className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
                </div>
                <span className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400">Settings</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onPageChange?.("company-setup")}
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-100 dark:border-zinc-800 group-hover:bg-white dark:group-hover:bg-zinc-800 transition-colors">
                  <Building2 className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
                </div>
                <span className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400">Company setup</span>
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator className="my-1.5 bg-zinc-100/50 dark:bg-zinc-800/50" />

            <div className="space-y-0.5">
              <DropdownMenuItem className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group">
                <div className="w-7 h-7 rounded-lg bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-100 dark:border-zinc-800 group-hover:bg-white dark:group-hover:bg-zinc-800 transition-colors">
                  <HelpCircle className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
                </div>
                <span className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400">Help center</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group text-red-500 dark:text-red-400">
                <div className="w-7 h-7 rounded-lg bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-100 dark:border-zinc-800 group-hover:bg-white dark:group-hover:bg-zinc-800 transition-colors">
                  <LogOut className="w-3.5 h-3.5" />
                </div>
                <span className="text-[13px] font-medium">Sign out</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
