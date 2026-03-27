import * as React from "react";

import {
  Search, Settings, Phone, Video, MoreHorizontal,
  Smile, Send, Mic, Plus,
  EllipsisVertical, MessageSquare, Users
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Dummy Data ──────────────────────────────────────────────────────────
const CHATS = [
  { id: 1, name: "Marketing Team", type: "group", unread: 2, time: "Just Now", avatar: "https://i.pinimg.com/1200x/24/a8/d6/24a8d67ab15d158c8190908f8bba3980.jpg" },
  { id: 2, name: "Jerome Bell", type: "direct", unread: 0, time: "1 min", avatar: "https://i.pinimg.com/736x/4e/ac/b6/4eacb68909814aa60fbfc6f0a7a00fe4.jpg" },
  { id: 3, name: "Guy Hawkins", type: "direct", unread: 3, time: "3 mins", avatar: "https://i.pinimg.com/736x/a4/2b/a3/a42ba39be7a0142a717634f795cf2357.jpg" },
  { id: 4, name: "Marvin McKinney", type: "direct", unread: 0, time: "15 mins", avatar: "https://i.pinimg.com/736x/d0/37/5f/d0375f7eac46dfd8c2a0a1f7008d1b88.jpg" },
  { id: 5, name: "Marketing Team", type: "group", unread: 2, time: "Just Now", avatar: "https://i.pinimg.com/1200x/24/a8/d6/24a8d67ab15d158c8190908f8bba3980.jpg" },
  { id: 6, name: "Jerome Bell", type: "direct", unread: 0, time: "1 min", avatar: "https://i.pinimg.com/736x/4e/ac/b6/4eacb68909814aa60fbfc6f0a7a00fe4.jpg" },
  { id: 7, name: "Guy Hawkins", type: "direct", unread: 3, time: "3 mins", avatar: "https://i.pinimg.com/736x/a4/2b/a3/a42ba39be7a0142a717634f795cf2357.jpg" },
  { id: 8, name: "Marvin McKinney", type: "direct", unread: 0, time: "15 mins", avatar: "https://i.pinimg.com/736x/d0/37/5f/d0375f7eac46dfd8c2a0a1f7008d1b88.jpg" },
  { id: 9, name: "Marketing Team", type: "group", unread: 2, time: "Just Now", avatar: "https://i.pinimg.com/1200x/24/a8/d6/24a8d67ab15d158c8190908f8bba3980.jpg" },
  { id: 10, name: "Jerome Bell", type: "direct", unread: 0, time: "1 min", avatar: "https://i.pinimg.com/736x/4e/ac/b6/4eacb68909814aa60fbfc6f0a7a00fe4.jpg" },
  { id: 11, name: "Guy Hawkins", type: "direct", unread: 3, time: "3 mins", avatar: "https://i.pinimg.com/736x/a4/2b/a3/a42ba39be7a0142a717634f795cf2357.jpg" },
  { id: 12, name: "Marvin McKinney", type: "direct", unread: 0, time: "15 mins", avatar: "https://i.pinimg.com/736x/d0/37/5f/d0375f7eac46dfd8c2a0a1f7008d1b88.jpg" },
  { id: 13, name: "Marketing Team", type: "group", unread: 2, time: "Just Now", avatar: "https://i.pinimg.com/1200x/24/a8/d6/24a8d67ab15d158c8190908f8bba3980.jpg" },
  { id: 14, name: "Jerome Bell", type: "direct", unread: 0, time: "1 min", avatar: "https://i.pinimg.com/736x/4e/ac/b6/4eacb68909814aa60fbfc6f0a7a00fe4.jpg" },
  { id: 15, name: "Guy Hawkins", type: "direct", unread: 3, time: "3 mins", avatar: "https://i.pinimg.com/736x/a4/2b/a3/a42ba39be7a0142a717634f795cf2357.jpg" },
];

const GROUPS = [
  { id: "g1", name: "Design Team", time: "1 day", avatar: "https://i.pravatar.cc/150?u=design" },
  { id: "g2", name: "Human Resource", time: "2 days", avatar: "https://i.pravatar.cc/150?u=hr" },
  { id: "g3", name: "Campaigns", time: "5 days", avatar: "https://i.pravatar.cc/150?u=campaign" },
];

const MESSAGES = [
  { id: "m1", sender: "Brooklyn Simmons", time: "Thursday 5:23pm", type: "audio", duration: "15:00", avatar: "https://i.pinimg.com/1200x/96/e7/b2/96e7b2cdf3e73d036c74ffc1c4b849d5.jpg", reactions: ["🥳 2", "😯 4", "👍 2"] },
  { id: "divider1", type: "divider", text: "Today" },
  { id: "m2", sender: "Jacob Jones", time: "Friday 8:05am", type: "text", text: "A creative brief is a short document that sums up marketing, advertising, or design project mission, goals, challenges, demographics, messaging, and other key details. It's often created by a consultant or a creative project manager.", avatar: "https://i.pravatar.cc/150?u=jacob" },
  { id: "m3", sender: "Wade Warren", time: "Friday 9:00am", type: "text", text: "Sound interesting!\nWhat should we do to start", avatar: "https://i.pravatar.cc/150?u=wade" },
  { id: "m4", sender: "You", time: "Friday 4:10pm", type: "text", text: "Step 1. The teams who need assistance from the creative team will retrieve the creative brief template from a repository like OneDrive, Google Drive, or an online form.", isOwn: true, reactions: ["🥳 2", "😯 4", "👍 2"] },
  { id: "divider2", type: "divider", text: "Unread" },
  { id: "m5", sender: "Cameron Williamson", time: "Friday 4:30pm", type: "text", text: "Hello, how are you doing\nWhy don't we go out somewhere?", avatar: "https://i.pravatar.cc/150?u=cameron", reactions: ["🥳 2", "😯 4", "👍 2"] },
];

// ─── Helper Components ──────────────────────────────────────────────────
function Avatar({ src, alt, size = "md", online = false }: { src: string, alt: string, size?: "sm" | "md" | "lg" | "xl", online?: boolean }) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };
  return (
    <div className="relative shrink-0">
      <img src={src} alt={alt} className={cn("rounded-full object-cover border border-zinc-200 dark:border-zinc-800", sizeClasses[size])} />
      {online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-zinc-950 rounded-full" />
      )}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────
export function MessagesPage() {
  const [activeTab, setActiveTab] = React.useState<"messages" | "groups">("messages");
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [inputText, setInputText] = React.useState("");
  const [isCreateMenuOpen, setIsCreateMenuOpen] = React.useState(false);

  return (
    <div className="absolute inset-x-0 bottom-0 top-16 flex bg-white dark:bg-zinc-950 overflow-hidden divide-x divide-zinc-200 dark:divide-zinc-800 border-t border-zinc-200 dark:border-zinc-800">

      {/* 1. LEFT PANE - CHAT LIST */}
      <div className="w-[320px] shrink-0 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/20">
        {/* Header Tabs & Search Toggle */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0 flex items-center gap-2 h-[72px]">
          {!isSearchOpen ? (
            <>
              <div className="flex-1 flex items-center p-1 bg-zinc-100 dark:bg-zinc-900 rounded-full">
                <button
                  onClick={() => setActiveTab("messages")}
                  className={cn("flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-full text-sm font-semibold transition-all", activeTab === "messages" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm" : "text-zinc-500 hover:text-zinc-700")}
                >
                  <span>Chats</span>
                  <span className={cn("flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full text-[10px] font-bold", activeTab === "messages" ? "bg-[#25D366] text-white" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500")}>24</span>
                </button>
                <button
                  onClick={() => setActiveTab("groups")}
                  className={cn("flex-1 flex items-center justify-center gap-2 py-1.5 rounded-full text-sm font-semibold transition-all", activeTab === "groups" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm" : "text-zinc-500 hover:text-zinc-700")}
                >
                  <span>Groups</span>
                  <span className={cn("flex items-center justify-center h-5 min-w-[20px] px-1 rounded-full text-[10px] font-bold", activeTab === "groups" ? "bg-[#25D366] text-white" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500")}>3</span>
                </button>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="w-9 h-9 shrink-0 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  title="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
                    onBlur={() => setTimeout(() => setIsCreateMenuOpen(false), 200)}
                    className="w-9 h-9 shrink-0 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    title="Create New"
                  >
                    <EllipsisVertical className="w-4 h-4" />
                  </button>

                  {isCreateMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 py-1.5 z-50 overflow-hidden transform origin-top-right transition-all animate-in fade-in zoom-in-95">
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                        <MessageSquare className="w-4 h-4 text-zinc-400" />
                        New Chat
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                        <Users className="w-4 h-4 text-zinc-400" />
                        New Group
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="w-full flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  autoFocus
                  placeholder="Search..."
                  className="w-full bg-zinc-100 dark:bg-zinc-900 border border-transparent rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#00a884] focus:bg-white dark:focus:bg-zinc-950 transition-all"
                />
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 px-1"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-6">


          {/* Chats / Groups rendered based on activeTab */}
          {activeTab === "messages" && (
            <div className="space-y-0.5">
              {CHATS.map((chat, i) => (
                <div key={chat.id} className={cn("flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-colors", i === 3 ? "bg-zinc-100 dark:bg-zinc-800/60" : "hover:bg-zinc-100 dark:hover:bg-zinc-800")}>
                  <Avatar src={chat.avatar} alt={chat.name} online={i % 2 === 0} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{chat.name}</h4>
                      <span className="text-[10px] text-zinc-400 shrink-0">{chat.time}</span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                      {i === 2 ? "Thanks! Looks great" : "Hello, how are you?"}
                    </p>
                  </div>
                  {chat.unread > 0 && (
                    <div className="w-5 h-5 rounded-full bg-[#25D366] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-2 shadow-sm">
                      {chat.unread}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === "groups" && (
            <div className="space-y-0.5">
              {GROUPS.map((group) => (
                <div key={group.id} className="flex items-start gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                  <Avatar src={group.avatar} alt={group.name} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{group.name}</h4>
                      <span className="text-[10px] text-zinc-400 shrink-0">{group.time}</span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                      Will have a look today
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. CENTER PANE - ACTIVE CHAT */}
      <div className="flex-1 flex flex-col bg-white dark:bg-zinc-950 min-w-[400px]">
        {/* Header */}
        <div className="h-16 border-b border-zinc-200 dark:border-zinc-800 px-6 flex items-center justify-between shrink-0 bg-white dark:bg-zinc-950 z-10">
          <div className="flex items-center gap-3">
            <Avatar src="https://i.pinimg.com/736x/11/d8/26/11d8260b95a3754612a11c8eb0586054.jpg" alt="Marketing Team" />
            <div>
              <h2 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100">Marketing Team</h2>
              <p className="text-xs text-zinc-500">24 members</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              <Phone className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              <Video className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-800 mx-1"></div>
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-black dark:hover:bg-white transition-colors ml-1">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Flow */}
        <div className="flex-[1_1_0] min-h-0 overflow-y-auto no-scrollbar p-6 space-y-6 bg-[#efeae2]/80 dark:bg-[#0b141a]/90">
          {MESSAGES.map((msg) => {
            if (msg.type === "divider") {
              return (
                <div key={msg.id} className="flex items-center gap-4 py-2">
                  <div className="flex-1 h-px bg-zinc-300 dark:bg-zinc-800"></div>
                  <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{msg.text}</span>
                  <div className="flex-1 h-px bg-zinc-300 dark:bg-zinc-800"></div>
                </div>
              );
            }

            const isOwn = msg.isOwn;

            return (
              <div key={msg.id} className={cn("flex flex-col max-w-[80%]", isOwn ? "items-end self-end ml-auto" : "items-start")}>

                {!isOwn && msg.sender && (
                  <div className="flex items-center gap-2 mb-1.5 ml-1">
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{msg.sender}</span>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400">{msg.time}</span>
                  </div>
                )}
                {isOwn && (
                  <div className="flex items-center justify-end gap-2 mb-1.5 mr-1">
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400">{msg.time}</span>
                  </div>
                )}

                <div className="flex items-end gap-2">
                  {!isOwn && msg.avatar && <Avatar src={msg.avatar} alt={msg.sender || ""} size="sm" />}

                  <div className={cn(
                    "relative px-4 py-2.5 text-[14px] leading-relaxed shadow-[0_1px_0.5px_rgba(0,0,0,0.13)]",
                    isOwn
                      ? "bg-[#d9fdd3] dark:bg-[#005c4b] text-zinc-900 dark:text-zinc-100 rounded-2xl rounded-tr-sm"
                      : "bg-white dark:bg-[#202c33] text-zinc-800 dark:text-zinc-200 rounded-2xl rounded-tl-sm"
                  )}>
                    {msg.type === "audio" ? (
                      <div className="flex items-center gap-3 w-48">
                        <button className="w-8 h-8 rounded-full bg-[#00a884]/10 dark:bg-[#00a884]/20 text-[#00a884] flex items-center justify-center shrink-0 hover:bg-[#00a884]/20 transition-colors">
                          <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-current border-b-4 border-b-transparent ml-0.5"></div>
                        </button>
                        <div className="flex-1 flex items-center gap-0.5 h-6">
                          {/* Fake audio waveform */}
                          {Array.from({ length: 15 }).map((_, i) => (
                            <div key={i} className="w-1 bg-zinc-300 dark:bg-zinc-600 rounded-full" style={{ height: Math.max(10, Math.random() * 24) + 'px' }}></div>
                          ))}
                        </div>
                        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 shrink-0">{msg.duration}</span>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    )}

                    {/* Reactions */}
                    {msg.reactions && (
                      <div className={cn("absolute -bottom-3 flex items-center gap-1", isOwn ? "right-2" : "left-2")}>
                        <div className="flex items-center bg-white dark:bg-[#202c33] border border-zinc-200 dark:border-zinc-700/50 rounded-full py-0.5 px-1.5 text-[10px] shadow-sm transform hover:scale-105 transition-transform cursor-pointer">
                          {msg.reactions.join("  ")}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          <div className="flex items-center gap-2 pt-2">
            <Avatar src="https://i.pravatar.cc/150?u=robert" alt="Robert" size="sm" />
            <div className="bg-white dark:bg-[#202c33] shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] px-3 py-2 rounded-2xl rounded-tl-sm text-xs text-zinc-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-500 animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-500 animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-500 animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-[#f0f2f5] dark:bg-[#202c33] border-t border-zinc-200 dark:border-zinc-800 shrink-0">
          <div className="flex items-end gap-2 bg-white dark:bg-[#2a3942] rounded-2xl p-2 focus-within:ring-1 focus-within:ring-[#00a884] transition-all shadow-sm">
            <button className="w-9 h-9 rounded-full flex flex-shrink-0 items-center justify-center text-zinc-500 dark:text-[#8696a0] hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Aa"
              className="flex-1 max-h-32 min-h-[36px] bg-transparent border-none focus:outline-none resize-none mx-2 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
              rows={1}
            />
            <div className="flex items-center gap-1 mb-0.5 shrink-0">
              <button className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                <Smile className="w-5 h-5" />
              </button>
              <button className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors mr-1">
                <Mic className="w-5 h-5" />
              </button>
              <button className="w-9 h-9 rounded-full bg-[#00a884] hover:bg-[#008f6f] text-white flex items-center justify-center transition-colors shadow-sm">
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
