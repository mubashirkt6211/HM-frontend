import React, { useState } from "react";
import { PanelLeft, UserCheck, Users, CreditCard, Settings, HelpCircle, LogOut, Plus, Zap, Home, ChevronRight, LayoutDashboard, Calendar, UserSquare, Stethoscope, Bell, CheckCircle2, Inbox, Layers, Archive } from "lucide-react";

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


const PAGE_META: Record<string, { label: string; icon: React.ElementType }> = {
  dashboard: { label: "Dashboard", icon: LayoutDashboard },
  calender: { label: "Calendar", icon: Calendar },
  calendar: { label: "Calendar", icon: Calendar },
  patients: { label: "Patients", icon: Stethoscope },
  doctors: { label: "Team", icon: UserSquare },
  notifications: { label: "Notifications", icon: Bell },
};

const CATEGORIES = [
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'general', label: 'General', icon: Layers },
  { id: 'archived', label: 'Archived', icon: Archive },
] as const;

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    user: {
      name: "Polly",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Polly",
    },
    action: "edited",
    target: "Contact page",
    time: "36 mins ago",
    project: "Craftwork Design",
    category: "inbox",
    unread: true,
  },
  {
    id: 2,
    user: {
      name: "James",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    },
    action: "left a comment on",
    target: "ACME 2.1",
    time: "2 hours ago",
    project: "ACME",
    category: "inbox",
    unread: true,
  },
  {
    id: 3,
    user: {
      name: "Mary",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mary",
    },
    action: "shared the file",
    target: "Isometric 2.0 with you",
    time: "3 hours ago",
    project: "Craftwork Design",
    category: "inbox",
    unread: false,
    hasActions: true,
  },
  {
    id: 4,
    user: {
      name: "Dima Phizeg",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dima",
    },
    action: "edited",
    target: "ACME 2.1",
    time: "3 hours ago",
    project: "ACME",
    category: "general",
    unread: false,
    attachment: "ACME_guideline.pdf"
  },
  {
    id: 5,
    user: {
      name: "James",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James2",
    },
    action: "created",
    target: "Changelog page for Blank",
    time: "1 day ago",
    project: "Blank",
    category: "archived",
    unread: false,
  }
];

export function SiteHeader({
  onTabChange,
  currentPage = "dashboard",
  activeTab,
  onPageChange,
  userRole,
  setUserRole
}: {
  onTabChange?: (tab: string) => void;
  onPageChange?: (page: string) => void;
  currentPage?: string;
  activeTab?: string;
  userRole?: UserRole;
  setUserRole?: (role: UserRole) => void;
}) {

  const { toggleSidebar } = useSidebar();
  const pageMeta = PAGE_META[currentPage] ?? { label: "Dashboard", icon: LayoutDashboard };

  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [activeCategory, setActiveCategory] = useState("inbox");
  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const filteredNotifications = notifications.filter(n => n.category === activeCategory);
  const getCategoryCount = (cat: string) => notifications.filter(n => n.category === cat).length;

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
        <nav className="flex items-center gap-1.5 text-sm">
          <div className="flex items-center gap-1 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span className="text-[13px] font-medium">Home</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-700" />
          <div className="flex items-center gap-1.5 text-zinc-900 dark:text-zinc-100">
            <pageMeta.icon className="w-3.5 h-3.5" />
            <span className="text-[13px] font-semibold">{pageMeta.label}</span>
          </div>
          {/* {activeTab && activeTab !== pageMeta.label && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-700" />
                <span className="text-[13px] font-semibold text-zinc-600 dark:text-zinc-400">{activeTab}</span>
              </>
            )} */}
        </nav>

      </div>

      <div className="flex items-center gap-4">

        {/* Role Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[12px] font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all">
              <UserCheck className="w-3.5 h-3.5" />
              <span className="uppercase tracking-wider">{userRole}</span>
              <ChevronRight className="w-3 h-3 rotate-90 opacity-50" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 p-1.5 rounded-xl bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-zinc-200/50 dark:border-zinc-800/50 shadow-xl" align="end">
            <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Switch Role</DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1 bg-zinc-100 dark:bg-zinc-800" />
            <DropdownMenuRadioGroup value={userRole} onValueChange={(v) => setUserRole?.(v as UserRole)}>
              {Object.values(UserRole).map((role) => (
                <DropdownMenuRadioItem
                  key={role}
                  value={role}
                  className="px-2 py-1.5 rounded-lg text-[13px] font-medium cursor-pointer focus:bg-zinc-100 dark:focus:bg-zinc-900 transition-colors"
                >
                  {role.replace("_", " ")}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notification Bell */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-zinc-800 transition-all duration-300 shadow-sm hover:shadow-md group outline-none">
              <Bell className="w-4 h-4 transition-transform group-hover:rotate-12" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 text-white">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 text-[9px] font-black items-center justify-center border border-white dark:border-zinc-950 leading-none">
                    {unreadCount}
                  </span>
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[380px] p-0 rounded-[24px] border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden" align="end" sideOffset={12}>
            {/* Header */}
            <div className="p-5 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100">Notifications</h3>
              <button
                onClick={(e) => { e.stopPropagation(); markAllAsRead(); }}
                className="text-[12px] font-medium text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                Mark all as read
              </button>
            </div>

            {/* Tabs */}
            <div className="px-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex gap-5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`pb-3 text-[12.5px] font-bold relative transition-colors ${activeCategory === cat.id ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 hover:text-zinc-600'}`}
                  >
                    <div className="flex items-center gap-1.5">
                      <cat.icon className={`w-3.5 h-3.5 ${activeCategory === cat.id ? 'opacity-100' : 'opacity-50'}`} />
                      {cat.label}
                      {getCategoryCount(cat.id) > 0 && (
                        <span className={`${activeCategory === cat.id ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'} rounded-full px-1.5 py-0.5 text-[9px] font-black min-w-[18px] flex items-center justify-center`}>
                          {getCategoryCount(cat.id)}
                        </span>
                      )}
                    </div>
                    {activeCategory === cat.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-zinc-100 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
              <button className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="max-h-[500px] overflow-y-auto no-scrollbar">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`relative flex items-start gap-2.5 p-3.5 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer group border-b border-zinc-50 dark:border-zinc-900/50 last:border-none`}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <Avatar className="h-9 w-9 border border-zinc-200 dark:border-zinc-800">
                        <AvatarImage src={notification.user.avatar} />
                        <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-[10px]">{notification.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {notification.unread && (
                        <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-white dark:border-zinc-950 rounded-full" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-[12.5px] leading-tight text-zinc-900 dark:text-zinc-100">
                            <span className="font-bold">{notification.user.name}</span>{" "}
                            <span className="text-zinc-500">{notification.action}</span>{" "}
                            <span className="font-bold">{notification.target}</span>
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-zinc-400">{notification.time}</span>
                            <span className="text-[9px] text-zinc-400">•</span>
                            <span className="text-[10px] text-zinc-400">{notification.project}</span>
                          </div>

                          {/* Attachment (if any) */}
                          {notification.attachment && (
                            <div className="mt-1.5 p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center gap-1.5 max-w-fit">
                              <Plus className="w-3 h-3 text-zinc-400 rotate-45" />
                              <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">{notification.attachment}</span>
                            </div>
                          )}

                          {/* Inline Actions (if any) */}
                          {notification.hasActions && !notification.unread && (
                            <div className="flex items-center gap-2 mt-2.5">
                              <button className="px-3 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                                Decline
                              </button>
                              <button className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-bold hover:bg-indigo-700 transition-colors">
                                Accept
                              </button>
                            </div>
                          )}

                          {/* Hover Mark as Read Button */}
                          {notification.unread && (
                            <div className="flex items-center gap-1.5 mt-2.5 overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0">
                              <button
                                onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                                className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-bold flex items-center gap-1.5 hover:bg-indigo-700 transition-all active:scale-95"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                Mark as read
                              </button>
                              {notification.hasActions && (
                                <>
                                  <button className="px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                                    Decline
                                  </button>
                                  <button className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-bold hover:bg-indigo-700 transition-colors">
                                    Accept
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Unread Indicator Dot */}
                        {notification.unread && (
                          <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center px-10">
                  <div className="w-16 h-16 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center mb-4">
                    <Bell className="w-6 h-6 text-zinc-300 dark:text-zinc-700" />
                  </div>
                  <h4 className="text-[14px] font-bold text-zinc-900 dark:text-zinc-100 mb-1">No notifications</h4>
                  <p className="text-[12px] text-zinc-400">Everything looks clear in {activeCategory}.</p>
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />



        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-9 w-9 cursor-pointer border-2 border-zinc-100 dark:border-zinc-800 hover:ring-4 hover:ring-zinc-50 dark:hover:ring-zinc-900/50 transition-all duration-300">
              <AvatarImage src="https://i.pinimg.com/1200x/39/86/91/398691f123726a5763e9c47980964fff.jpg" alt="@sophie" />
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">SB</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 p-1.5 rounded-[22px] border-zinc-200/50 dark:border-zinc-800/50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]" align="end" sideOffset={8}>
            <DropdownMenuLabel className="p-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Sophie Bennett</span>
                  <span className="text-[11px] font-medium text-zinc-400">sophie@ui.live</span>
                </div>
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 opacity-20 blur-sm"></div>
                  <Avatar className="h-10 w-10 border-2 border-white dark:border-zinc-900 shadow-sm relative">
                    <AvatarImage src="https://i.pinimg.com/1200x/39/86/91/398691f123726a5763e9c47980964fff.jpg" />
                  </Avatar>
                </div>
              </div>
            </DropdownMenuLabel>

            <div className="space-y-0.5">
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
