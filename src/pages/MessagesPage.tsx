import * as React from "react";
import {
  EllipsisVertical,
  MessageSquare,
  Mic,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Send,
  Smile,
  Settings,
  Users,
  Video,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type TabKey = "messages" | "groups";
type ConversationKind = "direct" | "group";
type MessageKind = "text" | "audio" | "divider";

type MessageReaction = {
  label: string;
  count: number;
};

type Message = {
  id: string;
  kind: MessageKind;
  sender: string;
  time: string;
  text?: string;
  duration?: string;
  avatar?: string;
  isOwn?: boolean;
  reactions?: MessageReaction[];
};

type Conversation = {
  id: string;
  kind: ConversationKind;
  name: string;
  avatar: string;
  preview: string;
  time: string;
  unread: number;
  online?: boolean;
  status: string;
  memberCount?: number;
  messages: Message[];
};

const DEFAULT_AUDIO_BARS = [11, 18, 9, 16, 22, 12, 8, 18, 14, 20, 10, 15, 9, 17];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatClock(date: Date) {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function createSeedConversations(): Conversation[] {
  return [
    {
      id: "marketing-team",
      kind: "group",
      name: "Marketing Team",
      avatar: "https://i.pinimg.com/1200x/24/a8/d6/24a8d67ab15d158c8190908f8bba3980.jpg",
      preview: "Campaign assets are ready for review.",
      time: "Just now",
      unread: 2,
      status: "24 members, 3 active",
      memberCount: 24,
      messages: [
        {
          id: "m-1",
          kind: "divider",
          sender: "",
          time: "Today",
        },
        {
          id: "m-2",
          kind: "text",
          sender: "Brooklyn Simmons",
          time: "8:05 AM",
          avatar: "https://i.pravatar.cc/150?u=brooklyn",
          text:
            "The creative brief is finalized. Please review the copy blocks before we send the campaign to production.",
        },
        {
          id: "m-3",
          kind: "text",
          sender: "Wade Warren",
          time: "8:12 AM",
          avatar: "https://i.pravatar.cc/150?u=wade",
          text: "Looks good. I only want one more pass on the banner line and CTA.",
        },
        {
          id: "m-4",
          kind: "text",
          sender: "You",
          time: "8:18 AM",
          isOwn: true,
          text: "I will update the banner line now and share the final exports in 15 minutes.",
          reactions: [
            { label: "👍", count: 2 },
            { label: "🥳", count: 1 },
          ],
        },
      ],
    },
    {
      id: "jerome-bell",
      kind: "direct",
      name: "Jerome Bell",
      avatar: "https://i.pinimg.com/736x/4e/ac/b6/4eacb68909814aa60fbfc6f0a7a00fe4.jpg",
      preview: "Can we move the call to 3:30 PM?",
      time: "1 min",
      unread: 0,
      online: true,
      status: "Online now",
      messages: [
        {
          id: "j-1",
          kind: "divider",
          sender: "",
          time: "Today",
        },
        {
          id: "j-2",
          kind: "text",
          sender: "Jerome Bell",
          time: "8:48 AM",
          avatar: "https://i.pinimg.com/736x/4e/ac/b6/4eacb68909814aa60fbfc6f0a7a00fe4.jpg",
          text: "Can we move the call to 3:30 PM?",
        },
        {
          id: "j-3",
          kind: "text",
          sender: "You",
          time: "8:51 AM",
          isOwn: true,
          text: "Yes, that works. I will update the calendar invite.",
        },
      ],
    },
    {
      id: "guy-hawkins",
      kind: "direct",
      name: "Guy Hawkins",
      avatar: "https://i.pinimg.com/736x/a4/2b/a3/a42ba39be7a0142a717634f795cf2357.jpg",
      preview: "Thanks! Looks great.",
      time: "3 mins",
      unread: 3,
      online: false,
      status: "Last seen 12 minutes ago",
      messages: [
        {
          id: "g-1",
          kind: "divider",
          sender: "",
          time: "Today",
        },
        {
          id: "g-2",
          kind: "text",
          sender: "Guy Hawkins",
          time: "9:10 AM",
          avatar: "https://i.pinimg.com/736x/a4/2b/a3/a42ba39be7a0142a717634f795cf2357.jpg",
          text: "Thanks! Looks great.",
          reactions: [
            { label: "🔥", count: 1 },
            { label: "👏", count: 2 },
          ],
        },
        {
          id: "g-3",
          kind: "audio",
          sender: "Guy Hawkins",
          time: "9:11 AM",
          avatar: "https://i.pinimg.com/736x/a4/2b/a3/a42ba39be7a0142a717634f795cf2357.jpg",
          duration: "0:34",
        },
      ],
    },
    {
      id: "marvin-mckinney",
      kind: "direct",
      name: "Marvin McKinney",
      avatar: "https://i.pinimg.com/736x/d0/37/5f/d0375f7eac46dfd8c2a0a1f7008d1b88.jpg",
      preview: "I will send the updated file shortly.",
      time: "15 mins",
      unread: 0,
      online: true,
      status: "Online now",
      messages: [
        {
          id: "m-1",
          kind: "divider",
          sender: "",
          time: "Today",
        },
        {
          id: "m-2",
          kind: "text",
          sender: "Marvin McKinney",
          time: "9:00 AM",
          avatar: "https://i.pinimg.com/736x/d0/37/5f/d0375f7eac46dfd8c2a0a1f7008d1b88.jpg",
          text: "I will send the updated file shortly.",
        },
        {
          id: "m-3",
          kind: "text",
          sender: "You",
          time: "9:04 AM",
          isOwn: true,
          text: "Perfect. I will keep the review open until then.",
        },
      ],
    },
    {
      id: "design-team",
      kind: "group",
      name: "Design Team",
      avatar: "https://i.pravatar.cc/150?u=design",
      preview: "The new layout is ready for handoff.",
      time: "1 day",
      unread: 1,
      status: "12 members, 5 active",
      memberCount: 12,
      messages: [
        {
          id: "d-1",
          kind: "divider",
          sender: "",
          time: "Today",
        },
        {
          id: "d-2",
          kind: "text",
          sender: "Clara",
          time: "Yesterday",
          avatar: "https://i.pravatar.cc/150?u=clara",
          text: "The new layout is ready for handoff.",
        },
        {
          id: "d-3",
          kind: "text",
          sender: "You",
          time: "Yesterday",
          isOwn: true,
          text: "Great. I will review the mobile spacing and send feedback today.",
        },
      ],
    },
  ];
}

function MessageBubble({ message }: { message: Message }) {
  const isOwn = Boolean(message.isOwn);

  if (message.kind === "divider") {
    return (
      <div className="flex items-center gap-4 py-2">
        <div className="h-px flex-1 bg-zinc-300 dark:bg-zinc-800" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
          {message.time}
        </span>
        <div className="h-px flex-1 bg-zinc-300 dark:bg-zinc-800" />
      </div>
    );
  }

  return (
    <div className={cn("flex max-w-[84%] flex-col", isOwn ? "ml-auto items-end" : "items-start")}>
      <div className={cn("mb-1 flex items-center gap-2 px-1", isOwn ? "justify-end" : "justify-start")}>
        {!isOwn && <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{message.sender}</span>}
        <span className="text-[10px] text-zinc-500 dark:text-zinc-400">{message.time}</span>
      </div>

      <div className="flex items-end gap-2">
        {!isOwn && message.avatar ? (
          <Avatar className="h-7 w-7 border border-zinc-200 dark:border-zinc-800">
            <AvatarImage src={message.avatar} alt={message.sender} />
            <AvatarFallback>{getInitials(message.sender)}</AvatarFallback>
          </Avatar>
        ) : null}

        <div
          className={cn(
            "relative rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed shadow-[0_1px_0.5px_rgba(0,0,0,0.13)]",
            isOwn
              ? "rounded-tr-sm bg-[#d9fdd3] text-zinc-900 dark:bg-[#005c4b] dark:text-zinc-100"
              : "rounded-tl-sm bg-white text-zinc-800 dark:bg-[#202c33] dark:text-zinc-200",
          )}
        >
          {message.kind === "audio" ? (
            <div className="flex w-52 items-center gap-3">
              <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00a884]/10 text-[#00a884] transition-colors hover:bg-[#00a884]/20 dark:bg-[#00a884]/20">
                <div className="ml-0.5 h-0 w-0 border-b-4 border-l-[6px] border-t-4 border-b-transparent border-l-current border-t-transparent" />
              </button>
              <div className="flex h-6 flex-1 items-end gap-0.5">
                {DEFAULT_AUDIO_BARS.map((height, index) => (
                  <div
                    key={`${message.id}-${index}`}
                    className="w-1 rounded-full bg-zinc-300 dark:bg-zinc-600"
                    style={{ height: `${height}px` }}
                  />
                ))}
              </div>
              <span className="shrink-0 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {message.duration}
              </span>
            </div>
          ) : (
            <div className="whitespace-pre-wrap">{message.text}</div>
          )}

          {message.reactions?.length ? (
            <div className={cn("absolute -bottom-3 flex items-center gap-1", isOwn ? "right-2" : "left-2")}>
              <div className="flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-[10px] shadow-sm dark:border-zinc-700/60 dark:bg-[#202c33]">
                {message.reactions.map((reaction) => (
                  <span key={`${message.id}-${reaction.label}`} className="inline-flex items-center gap-1">
                    <span>{reaction.label}</span>
                    <span>{reaction.count}</span>
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function MessagesPage() {
  const [activeTab, setActiveTab] = React.useState<TabKey>("messages");
  const [conversations, setConversations] = React.useState<Conversation[]>(() => createSeedConversations());
  const [selectedConversationId, setSelectedConversationId] = React.useState<string>("marketing-team");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [draftMessage, setDraftMessage] = React.useState("");
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  const filteredConversations = React.useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return conversations.filter((conversation) => {
      const matchesTab =
        activeTab === "messages" ? conversation.kind === "direct" : conversation.kind === "group";

      if (!matchesTab) return false;
      if (!normalizedQuery) return true;

      return (
        conversation.name.toLowerCase().includes(normalizedQuery) ||
        conversation.preview.toLowerCase().includes(normalizedQuery) ||
        conversation.status.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [activeTab, conversations, searchQuery]);

  const selectedConversation = React.useMemo(() => {
    return conversations.find((conversation) => conversation.id === selectedConversationId) ?? null;
  }, [conversations, selectedConversationId]);

  React.useEffect(() => {
    const nextConversation = filteredConversations[0];
    if (!nextConversation) {
      return;
    }

    if (!filteredConversations.some((conversation) => conversation.id === selectedConversationId)) {
      setSelectedConversationId(nextConversation.id);
    }
  }, [filteredConversations, selectedConversationId]);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [selectedConversation?.messages.length, selectedConversationId]);

  React.useEffect(() => {
    textareaRef.current?.focus();
  }, [selectedConversationId]);

  function handleSelectConversation(conversationId: string) {
    setSelectedConversationId(conversationId);
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId ? { ...conversation, unread: 0 } : conversation,
      ),
    );
  }

  function handleSendMessage() {
    const trimmed = draftMessage.trim();
    if (!trimmed || !selectedConversation) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      kind: "text",
      sender: "You",
      time: formatClock(new Date()),
      text: trimmed,
      isOwn: true,
    };

    setConversations((current) =>
      current.map((conversation) => {
        if (conversation.id !== selectedConversation.id) return conversation;

        return {
          ...conversation,
          preview: trimmed,
          time: "Just now",
          messages: [...conversation.messages, message],
        };
      }),
    );
    setDraftMessage("");
  }

  function handleCreateConversation(kind: ConversationKind) {
    const createdId = `${kind}-${Date.now()}`;
    const name = kind === "direct" ? "New Chat" : "New Group";
    const avatar = kind === "direct" ? "https://i.pravatar.cc/150?u=new-chat" : "https://i.pravatar.cc/150?u=new-group";

    setConversations((current) => [
      {
        id: createdId,
        kind,
        name,
        avatar,
        preview: kind === "direct" ? "Start a new conversation." : "Create the group thread.",
        time: "Just now",
        unread: 0,
        online: kind === "direct",
        status: kind === "direct" ? "Online now" : "0 members",
        memberCount: kind === "group" ? 0 : undefined,
        messages: [
          {
            id: `${createdId}-seed`,
            kind: "divider",
            sender: "",
            time: "Today",
          },
        ],
      },
      ...current,
    ]);

    setActiveTab(kind === "direct" ? "messages" : "groups");
    setSelectedConversationId(createdId);
    setIsCreateMenuOpen(false);
  }

  const unreadCount = conversations.reduce((count, conversation) => count + conversation.unread, 0);
  const groupCount = conversations.filter((conversation) => conversation.kind === "group").length;

  return (
    <div className="absolute inset-x-0 bottom-0 top-16 flex overflow-hidden border-t border-zinc-200 bg-white divide-x divide-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:divide-zinc-800">
      <div className="flex w-[320px] shrink-0 flex-col bg-zinc-50/50 dark:bg-zinc-900/20">
        <div className="flex h-[72px] shrink-0 items-center gap-2 border-b border-zinc-200 p-4 dark:border-zinc-800">
          {!isSearchOpen ? (
            <>
              <div className="flex flex-1 items-center rounded-full bg-zinc-100 p-1 dark:bg-zinc-900">
                <button
                  onClick={() => setActiveTab("messages")}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 text-sm font-semibold transition-all",
                    activeTab === "messages"
                      ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
                      : "text-zinc-500 hover:text-zinc-700",
                  )}
                >
                  <span>Chats</span>
                  <span
                    className={cn(
                      "flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                      activeTab === "messages"
                        ? "bg-[#25D366] text-white"
                        : "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500",
                    )}
                  >
                    {unreadCount}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("groups")}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-full py-1.5 text-sm font-semibold transition-all",
                    activeTab === "groups"
                      ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
                      : "text-zinc-500 hover:text-zinc-700",
                  )}
                >
                  <span>Groups</span>
                  <span
                    className={cn(
                      "flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold",
                      activeTab === "groups"
                        ? "bg-[#25D366] text-white"
                        : "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500",
                    )}
                  >
                    {groupCount}
                  </span>
                </button>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition-colors hover:text-zinc-900 dark:bg-zinc-900 dark:hover:text-zinc-100"
                  title="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
                    onBlur={() => setTimeout(() => setIsCreateMenuOpen(false), 200)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition-colors hover:text-zinc-900 dark:bg-zinc-900 dark:hover:text-zinc-100"
                    title="Create New"
                  >
                    <EllipsisVertical className="h-4 w-4" />
                  </button>
                  {isCreateMenuOpen ? (
                    <div className="absolute right-0 top-full z-50 mt-2 w-48 origin-top-right overflow-hidden rounded-2xl border border-zinc-200 bg-white py-1.5 shadow-lg transform dark:border-zinc-800 dark:bg-zinc-900">
                      <button
                        onClick={() => handleCreateConversation("direct")}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50"
                      >
                        <MessageSquare className="h-4 w-4 text-zinc-400" />
                        New Chat
                      </button>
                      <button
                        onClick={() => handleCreateConversation("group")}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50"
                      >
                        <Users className="h-4 w-4 text-zinc-400" />
                        New Group
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </>
          ) : (
            <div className="flex w-full items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search..."
                  className="w-full rounded-full border border-transparent bg-zinc-100 py-1.5 pl-9 pr-4 text-sm transition-all focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#00a884] dark:bg-zinc-900 dark:focus:bg-zinc-950"
                />
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="px-1 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="no-scrollbar flex-1 space-y-6 overflow-y-auto p-2">
          {activeTab === "messages" && (
            <div className="space-y-0.5">
              {filteredConversations.map((conversation, index) => (
                <button
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation.id)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-xl p-2.5 text-left transition-colors",
                    conversation.id === selectedConversationId
                      ? "bg-zinc-100 dark:bg-zinc-800/60"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                  )}
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.avatar} alt={conversation.name} />
                      <AvatarFallback>{getInitials(conversation.name)}</AvatarFallback>
                    </Avatar>
                    {conversation.online && index % 2 === 0 ? (
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500 dark:border-zinc-950" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex items-center justify-between">
                      <h4 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {conversation.name}
                      </h4>
                      <span className="shrink-0 text-[10px] text-zinc-400">{conversation.time}</span>
                    </div>
                    <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{conversation.preview}</p>
                  </div>
                  {conversation.unread > 0 ? (
                    <div className="mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-[10px] font-bold text-white shadow-sm">
                      {conversation.unread}
                    </div>
                  ) : null}
                </button>
              ))}
            </div>
          )}

          {activeTab === "groups" && (
            <div className="space-y-0.5">
              {filteredConversations.map((group) => (
                <button
                  key={group.id}
                  onClick={() => handleSelectConversation(group.id)}
                  className="flex w-full items-start gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={group.avatar} alt={group.name} />
                    <AvatarFallback>{getInitials(group.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex items-center justify-between">
                      <h4 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {group.name}
                      </h4>
                      <span className="shrink-0 text-[10px] text-zinc-400">{group.time}</span>
                    </div>
                    <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{group.preview}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex min-w-[400px] flex-1 flex-col bg-white dark:bg-zinc-950">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={selectedConversation?.avatar ?? ""} alt={selectedConversation?.name ?? ""} />
              <AvatarFallback>{getInitials(selectedConversation?.name ?? "Chat")}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100">
                {selectedConversation?.name ?? "Marketing Team"}
              </h2>
              <p className="text-xs text-zinc-500">
                {selectedConversation?.status ?? "24 members"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800">
              <Phone className="h-4 w-4" />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800">
              <Video className="h-4 w-4" />
            </button>
            <div className="mx-1 h-5 w-px bg-zinc-200 dark:bg-zinc-800" />
            <button className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <MoreHorizontal className="h-4 w-4" />
            </button>
            <button className="ml-1 flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-white transition-colors hover:bg-black dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="no-scrollbar flex-[1_1_0] min-h-0 overflow-y-auto bg-[#efeae2]/80 p-6 dark:bg-[#0b141a]/90 space-y-6">
          {selectedConversation?.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          <div className="flex items-center gap-2 pt-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src="https://i.pravatar.cc/150?u=robert" alt="Robert" />
              <AvatarFallback>R</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-xs text-zinc-500 shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] dark:bg-[#202c33]">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-300 dark:bg-zinc-500" style={{ animationDelay: "0ms" }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-300 dark:bg-zinc-500" style={{ animationDelay: "150ms" }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-300 dark:bg-zinc-500" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
          <div ref={endRef} />
        </div>

        <div className="shrink-0 border-t border-zinc-200 bg-[#f0f2f5] p-4 dark:border-zinc-800 dark:bg-[#202c33]">
          <div className="flex items-end gap-2 rounded-2xl bg-white p-2 shadow-sm transition-all focus-within:ring-1 focus-within:ring-[#00a884] dark:bg-[#2a3942]">
            <button className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:text-[#8696a0] dark:hover:bg-zinc-700 dark:hover:text-zinc-300">
              <Plus className="h-5 w-5" />
            </button>
            <textarea
              ref={textareaRef}
              value={draftMessage}
              onChange={(e) => setDraftMessage(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Aa"
              className="mx-2 min-h-[36px] max-h-32 flex-1 resize-none border-none bg-transparent py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
              rows={1}
            />
            <div className="mb-0.5 flex shrink-0 items-center gap-1">
              <button className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300">
                <Smile className="h-5 w-5" />
              </button>
              <button className="mr-1 flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300">
                <Mic className="h-5 w-5" />
              </button>
              <button
                onClick={handleSendMessage}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00a884] text-white shadow-sm transition-colors hover:bg-[#008f6f]"
              >
                <Send className="ml-0.5 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isCreateMenuOpen ? (
        <button
          aria-label="Close create menu"
          onClick={() => setIsCreateMenuOpen(false)}
          className="fixed inset-0 z-40 cursor-default"
        />
      ) : null}
    </div>
  );
}
