"use client"

import { useMemo, useState, useRef, useEffect } from "react"
import {
  ArrowLeft,
  DotsThree,
  CaretDown,
  WhatsappLogo,
  Paperclip,
  Smiley,
  Microphone,
  Cube,
  MagnifyingGlass,
  User,
  InstagramLogo,
  MetaLogo,
  GlobeHemisphereWest,
  ArrowsClockwise,
  CheckSquareOffset,
  ClockCounterClockwise,
  ListDashes,
  Sparkle,
  PhoneCall,
  CheckCircle,
  FileText,
  XCircle,
  ArrowRight,
  SidebarSimple,
  ArrowFatUp,
  ArrowFatDown,
  Equals,
  Fire,
  ThermometerHot,
  Snowflake,
  ProhibitInset,
} from "@phosphor-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/reui/badge"
import { cn } from "@/lib/utils"

type Stage = "New" | "Contacted" | "Qualified" | "Proposal"
type SourceType = "WhatsApp" | "Instagram" | "Meta" | "Website"
type StatusType = "Hot" | "Warm" | "Cold" | "Lost"

type Lead = {
  id: string
  name: string
  company: string
  source: SourceType
  stage: Stage
  value: string
  status: StatusType
  assigned: string
  lastActivity: string
  email: string
  phone: string
  location: string
  note: string
}

const INITIAL_LEADS: Lead[] = [
  { id: "LD-001", name: "Mia Reynolds", company: "BrightPath Health", source: "WhatsApp", stage: "Qualified", value: "$29.5K", status: "Hot", assigned: "Ari Parker", lastActivity: "2h ago", email: "mia@brightpath.co", phone: "+1 (555) 123-8791", location: "Boston, MA", note: "Wants a demo and pricing for enterprise onboarding." },
  { id: "LD-002", name: "Noah Patel", company: "Everwell Labs", source: "Instagram", stage: "Proposal", value: "$14.2K", status: "Warm", assigned: "Sam Rivera", lastActivity: "1d ago", email: "noah@everwell.com", phone: "+1 (555) 420-7712", location: "Austin, TX", note: "Reviewing proposal, needs contract terms update." },
  { id: "LD-003", name: "Sofia Chen", company: "Nexa Care", source: "Meta", stage: "Contacted", value: "$7.4K", status: "Hot", assigned: "Jordan Lee", lastActivity: "3h ago", email: "sofia@nexa.care", phone: "+1 (555) 210-6640", location: "San Francisco, CA", note: "Waiting on follow-up message after initial qualification call." },
  { id: "LD-004", name: "Ethan Brooks", company: "PulsePoint", source: "WhatsApp", stage: "New", value: "$52K", status: "Warm", assigned: "Maya Chen", lastActivity: "5h ago", email: "ethan@pulsepoint.io", phone: "+1 (555) 310-8812", location: "New York, NY", note: "Inbound lead from campaign — needs product fit discussion." },
  { id: "LD-005", name: "Ava Thompson", company: "Atlas Commerce", source: "Website", stage: "Contacted", value: "$9.8K", status: "Cold", assigned: "Sam Nguyen", lastActivity: "Yesterday", email: "ava@atlascommerce.co", phone: "+1 (555) 892-3345", location: "Chicago, IL", note: "Website form request; scheduling product walkthrough." },
  { id: "LD-006", name: "Lucas Garcia", company: "Vertex Solutions", source: "Meta", stage: "New", value: "$18.5K", status: "Hot", assigned: "Ari Parker", lastActivity: "10m ago", email: "lucas.g@vertex.io", phone: "+1 (555) 773-9090", location: "Miami, FL", note: "Urgent request for Q3 deployment." },
  { id: "LD-007", name: "Emma Wright", company: "Pioneer Dynamics", source: "WhatsApp", stage: "Qualified", value: "$112K", status: "Warm", assigned: "Maya Chen", lastActivity: "4h ago", email: "ewright@pioneer.com", phone: "+1 (555) 221-4455", location: "Seattle, WA", note: "Enterprise tier interest. Requires custom SLA." },
  { id: "LD-008", name: "Oliver Scott", company: "Nexus Retail", source: "Instagram", stage: "Proposal", value: "$45K", status: "Hot", assigned: "Jordan Lee", lastActivity: "2d ago", email: "oliver@nexusretail.net", phone: "+1 (555) 334-1122", location: "Denver, CO", note: "Proposal sent, waiting for legal review." },
  { id: "LD-009", name: "Isabella Davis", company: "Crestview Media", source: "Website", stage: "Contacted", value: "$5.5K", status: "Lost", assigned: "Sam Rivera", lastActivity: "1w ago", email: "isabella@crestview.org", phone: "+1 (555) 998-0011", location: "Atlanta, GA", note: "Went with a competitor due to budget constraints." },
  { id: "LD-010", name: "Mason Rodriguez", company: "OmniTech", source: "WhatsApp", stage: "New", value: "$22K", status: "Cold", assigned: "Ari Parker", lastActivity: "3d ago", email: "mason@omnitech.io", phone: "+1 (555) 443-2299", location: "Dallas, TX", note: "Initial inquiry, hasn't responded to first outreach." },
  { id: "LD-011", name: "Harper White", company: "Stellar Logistics", source: "Meta", stage: "Qualified", value: "$85K", status: "Hot", assigned: "Maya Chen", lastActivity: "1h ago", email: "harper.w@stellar.co", phone: "+1 (555) 665-4433", location: "Houston, TX", note: "Very interested in the routing module. Setting up technical deep-dive." },
  { id: "LD-012", name: "Elijah Thomas", company: "Horizon Financial", source: "Website", stage: "Proposal", value: "$130K", status: "Warm", assigned: "Jordan Lee", lastActivity: "Yesterday", email: "ethomas@horizon.com", phone: "+1 (555) 112-9988", location: "Charlotte, NC", note: "Reviewing security compliance docs alongside proposal." },
  { id: "LD-013", name: "Charlotte Moore", company: "Aura Design", source: "Instagram", stage: "New", value: "$3.2K", status: "Hot", assigned: "Sam Nguyen", lastActivity: "15m ago", email: "charlotte@auradesign.studio", phone: "+1 (555) 776-5544", location: "Portland, OR", note: "Just DM'd asking about agency pricing." },
  { id: "LD-014", name: "Benjamin Taylor", company: "Summit Group", source: "WhatsApp", stage: "Contacted", value: "$65K", status: "Warm", assigned: "Ari Parker", lastActivity: "2h ago", email: "btaylor@summit.net", phone: "+1 (555) 990-2211", location: "Salt Lake City, UT", note: "Good initial call, needs a tailored presentation for the board." },
  { id: "LD-015", name: "Amelia Anderson", company: "Nova Health", source: "Meta", stage: "Qualified", value: "$41K", status: "Lost", assigned: "Maya Chen", lastActivity: "2w ago", email: "amelia@novahealth.org", phone: "+1 (555) 332-1100", location: "Phoenix, AZ", note: "Project put on hold until next fiscal year." },
  { id: "LD-016", name: "James Jackson", company: "Echo Systems", source: "Website", stage: "New", value: "$15K", status: "Cold", assigned: "Jordan Lee", lastActivity: "5d ago", email: "jjackson@echo.io", phone: "+1 (555) 554-3322", location: "Detroit, MI", note: "Downloaded the whitepaper, no response to emails." },
  { id: "LD-017", name: "Evelyn Martin", company: "Zenith Corp", source: "WhatsApp", stage: "Proposal", value: "$78K", status: "Hot", assigned: "Sam Rivera", lastActivity: "30m ago", email: "emartin@zenith.co", phone: "+1 (555) 887-6655", location: "Las Vegas, NV", note: "Ready to sign, just negotiating final discount." },
  { id: "LD-018", name: "Alexander Lee", company: "Vantage Point", source: "Instagram", stage: "Contacted", value: "$8.9K", status: "Warm", assigned: "Ari Parker", lastActivity: "1d ago", email: "alex@vantagepoint.com", phone: "+1 (555) 223-9988", location: "Orlando, FL", note: "Asking about integrations with their existing stack." },
  { id: "LD-019", name: "Abigail Perez", company: "Meridian Real Estate", source: "Meta", stage: "Qualified", value: "$25K", status: "Hot", assigned: "Maya Chen", lastActivity: "4h ago", email: "aperez@meridian.net", phone: "+1 (555) 110-3344", location: "San Diego, CA", note: "Loved the demo. Sending over the feature checklist." },
  { id: "LD-020", name: "Michael Thompson", company: "Apex Industries", source: "Website", stage: "Proposal", value: "$210K", status: "Lost", assigned: "Jordan Lee", lastActivity: "1mo ago", email: "mthompson@apex.com", phone: "+1 (555) 445-6677", location: "Cleveland, OH", note: "Lost to competitor X due to missing legacy support." },
]

const SOURCE_CONFIG: Record<SourceType, { icon: React.ElementType; color: string }> = {
  WhatsApp: { icon: WhatsappLogo, color: "text-emerald-500" },
  Instagram: { icon: InstagramLogo, color: "text-pink-500" },
  Meta: { icon: MetaLogo, color: "text-sky-500" },
  Website: { icon: GlobeHemisphereWest, color: "text-zinc-500" },
}

const STAGES: Stage[] = ["New", "Contacted", "Qualified", "Proposal"]

const STATUS_COLORS: Record<StatusType, string> = {
  Hot: "bg-rose-500",
  Warm: "bg-amber-500",
  Cold: "bg-zinc-400",
  Lost: "bg-zinc-800"
}

type Message = {
  id: string
  sender: "user" | "agent" | "system"
  text: string
  time: string
  via?: string
  sysEvent?: boolean
}

const generateInitialChats = (leads: Lead[]): Record<string, Message[]> => {
  const chats: Record<string, Message[]> = {}
  leads.forEach((lead) => {
    chats[lead.id] = [
      { id: "sys-1", sender: "system", text: `Ticket created via ${lead.source}`, time: "10:00 AM", sysEvent: true },
      { id: "usr-1", sender: "user", text: `Hi, I'm reaching out about ${lead.company}. ${lead.note}`, time: "10:05 AM", via: lead.source },
      { id: "agt-1", sender: "agent", text: `Hello ${lead.name.split(" ")[0]}! Thanks for contacting us. Let me look into that for you.`, time: "10:15 AM", via: lead.source },
    ]
  })
  return chats
}

type LeadTask = { id: string; title: string; done: boolean; priority: "High" | "Medium" | "Low" }
const INITIAL_TASKS: Record<string, LeadTask[]> = {}
INITIAL_LEADS.forEach(lead => {
  INITIAL_TASKS[lead.id] = [
     { id: "1", title: "Send follow-up email", done: false, priority: "High" },
     { id: "2", title: "Review proposal terms", done: true, priority: "Medium" },
     { id: "3", title: "Schedule demo call", done: false, priority: "Low" },
  ]
})

const SUBMIT_STATE_CONFIG = {
  Open: { label: "Submit as Open", color: "bg-blue-500 hover:bg-blue-600", divider: "bg-blue-600" },
  Pending: { label: "Submit as Pending", color: "bg-amber-500 hover:bg-amber-600", divider: "bg-amber-600" },
  Closed: { label: "Submit as Closed", color: "bg-emerald-500 hover:bg-emerald-600", divider: "bg-emerald-600" },
  Lost: { label: "Close Ticket", color: "bg-rose-500 hover:bg-rose-600", divider: "bg-rose-600" },
}

export function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS)
  const [activeTab, setActiveTab] = useState("Conversation")
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState<"All" | "Hot" | "New" | "Proposal" | "Lost">("All")
  const [selectedLeadId, setSelectedLeadId] = useState(INITIAL_LEADS[0].id)
  const [chats, setChats] = useState<Record<string, Message[]>>(() => generateInitialChats(INITIAL_LEADS))
  
  // View states
  const [draft, setDraft] = useState("")
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({})
  const [isSubmitDropdownOpen, setIsSubmitDropdownOpen] = useState(false)
  const [submitState, setSubmitState] = useState<"Open" | "Pending" | "Closed" | "Lost">("Closed")
  const [tasks, setTasks] = useState<Record<string, LeadTask[]>>(INITIAL_TASKS)
  const [newTaskDraft, setNewTaskDraft] = useState("")
  const [newTaskPriority, setNewTaskPriority] = useState<"High" | "Medium" | "Low">("Medium")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const filteredLeads = useMemo(() => {
    let result = leads
    
    // Apply Filter Chips
    if (activeFilter === "Hot") result = result.filter(l => l.status === "Hot")
    if (activeFilter === "New") result = result.filter(l => l.stage === "New")
    if (activeFilter === "Proposal") result = result.filter(l => l.stage === "Proposal")
    if (activeFilter === "Lost") result = result.filter(l => l.status === "Lost")

    // Apply Search
    if (search.trim()) {
      result = result.filter((lead) =>
        [lead.name, lead.company, lead.source, lead.stage, lead.status]
          .some((val) => val.toLowerCase().includes(search.toLowerCase()))
      )
    }
    
    return result
  }, [search, leads, activeFilter])

  const selectedLead = leads.find((l) => l.id === selectedLeadId) ?? leads[0]
  const currentChat = chats[selectedLead.id] || []

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (activeTab === "Conversation") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [currentChat, activeTab])

  const handleSend = () => {
    if (!draft.trim()) return
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "agent",
      text: draft,
      time,
      via: selectedLead.source
    }
    setChats(prev => ({
      ...prev,
      [selectedLead.id]: [...(prev[selectedLead.id] || []), newMessage]
    }))
    setDraft("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleUpdateStage = () => {
    const currentIdx = STAGES.indexOf(selectedLead.stage)
    if (currentIdx < STAGES.length - 1) {
      const nextStage = STAGES[currentIdx + 1]
      
      // Update lead state
      setLeads(prev => prev.map(l => 
        l.id === selectedLead.id ? { ...l, stage: nextStage } : l
      ))
      
      // Append system message
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      const sysMsg: Message = {
        id: Date.now().toString(),
        sender: "system",
        text: `Stage advanced to ${nextStage}`,
        time,
        sysEvent: true
      }
      setChats(prev => ({
        ...prev,
        [selectedLead.id]: [...(prev[selectedLead.id] || []), sysMsg]
      }))
    }
  }

  const handleMarkLost = () => {
    setLeads(prev => prev.map(l => 
      l.id === selectedLead.id ? { ...l, status: "Lost" } : l
    ))
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const sysMsg: Message = {
      id: Date.now().toString(),
      sender: "system",
      text: `Lead marked as Lost`,
      time,
      sysEvent: true
    }
    setChats(prev => ({
      ...prev,
      [selectedLead.id]: [...(prev[selectedLead.id] || []), sysMsg]
    }))
  }

  const SourceIcon = SOURCE_CONFIG[selectedLead.source].icon
  const sourceColor = SOURCE_CONFIG[selectedLead.source].color

  return (
    <div className="flex h-full w-full overflow-hidden bg-white dark:bg-zinc-950">
      
      {/* Inject sleek scrollbar CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        .sleek-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
        .sleek-scroll::-webkit-scrollbar-track { background: transparent; }
        .sleek-scroll::-webkit-scrollbar-thumb { background: #e4e4e7; border-radius: 4px; }
        .sleek-scroll:hover::-webkit-scrollbar-thumb { background: #d4d4d8; }
        .dark .sleek-scroll::-webkit-scrollbar-thumb { background: #27272a; }
        .dark .sleek-scroll:hover::-webkit-scrollbar-thumb { background: #3f3f46; }
      `}} />

      {/* Left Master List Sidebar */}
      <div className={cn(
        "flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-[#fafaf9] dark:bg-zinc-950 shrink-0 transition-all duration-300 overflow-hidden",
        sidebarOpen ? "w-[340px]" : "w-0"
      )}>
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-bold text-zinc-900 dark:text-white">Inbox</h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-bold text-[11px] rounded-md">{filteredLeads.length}</Badge>
              <button
                onClick={() => setSidebarOpen(false)}
                title="Close sidebar"
                className="size-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 dark:hover:text-zinc-200 transition-colors"
              >
                <SidebarSimple className="size-4" weight="bold" />
              </button>
            </div>
          </div>
          
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <Input 
              placeholder="Search leads..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 rounded-xl bg-zinc-50 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 text-[13px] shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto sleek-scroll pb-1">
            {["All", "Hot", "New", "Proposal", "Lost"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter as any)}
                className={cn(
                  "px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors",
                  activeFilter === filter 
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm" 
                    : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto sleek-scroll p-3 space-y-1.5 max-h-[550px]">
          {filteredLeads.map((lead) => {
            const LeadIcon = SOURCE_CONFIG[lead.source].icon
            return (
              <button
                key={lead.id}
                onClick={() => {
                  setSelectedLeadId(lead.id)
                  setActiveTab("Conversation")
                }}
                className={cn(
                  "w-full flex items-start gap-3 p-3 text-left rounded-xl transition-all duration-200 relative group",
                  selectedLeadId === lead.id
                    ? "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-700"
                    : "hover:bg-zinc-100/80 dark:hover:bg-zinc-900/50 hover:shadow-sm"
                )}
              >
                <div className="relative">
                  <Avatar className="size-11 rounded-[12px] border border-zinc-200 dark:border-zinc-800">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${lead.id}`} />
                    <AvatarFallback className="bg-zinc-100 font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {lead.name.split(" ").map(n=>n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1.5 -right-1.5 bg-white dark:bg-zinc-950 rounded-full p-0.5 shadow-sm">
                    <LeadIcon className={cn("size-3.5", SOURCE_CONFIG[lead.source].color)} weight="fill" />
                  </div>
                </div>
                <div className="flex-1 min-w-0 py-0.5">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[13px] font-bold text-zinc-900 dark:text-white truncate pr-2 group-hover:text-emerald-600 transition-colors">
                      {lead.name}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                      <span className="text-[10px] font-semibold text-zinc-400 whitespace-nowrap">{lead.lastActivity}</span>
                      <div title={`Status: ${lead.status}`} className={cn(
                        "flex items-center justify-center size-4 rounded-full",
                        lead.status === "Hot" ? "bg-rose-100 text-rose-500 dark:bg-rose-900/30"
                        : lead.status === "Warm" ? "bg-amber-100 text-amber-500 dark:bg-amber-900/30"
                        : lead.status === "Cold" ? "bg-sky-100 text-sky-400 dark:bg-sky-900/30"
                        : "bg-zinc-200 text-zinc-500 dark:bg-zinc-800"
                      )}>
                        {lead.status === "Hot" && <Fire className="size-2.5" weight="fill" />}
                        {lead.status === "Warm" && <ThermometerHot className="size-2.5" weight="fill" />}
                        {lead.status === "Cold" && <Snowflake className="size-2.5" weight="fill" />}
                        {lead.status === "Lost" && <ProhibitInset className="size-2.5" weight="fill" />}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[11px] font-semibold text-zinc-500 truncate">{lead.company}</p>
                    <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-1.5 rounded">{lead.value}</span>
                  </div>
                  <p className="text-[12px] text-zinc-500 truncate line-clamp-1 leading-snug">{lead.note}</p>
                </div>
              </button>
            )
          })}
          {filteredLeads.length === 0 && (
            <div className="text-center py-10 px-4">
              <p className="text-[13px] font-medium text-zinc-500">No leads found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Area (Header + Main + Details) */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-3 dark:border-zinc-800 dark:bg-zinc-950 shrink-0">
          <div className="flex items-center gap-4">
            {/* Sidebar toggle */}
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                title="Open sidebar"
                className="size-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-900 dark:hover:text-white transition-colors border border-zinc-200 dark:border-zinc-800"
              >
                <SidebarSimple className="size-4" weight="bold" />
              </button>
            )}
            <button className="flex items-center gap-1.5 text-[13px] font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition">
              <User className="size-4" weight="bold" />
              {selectedLead.assigned}
            </button>
            
            <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700" />
            
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold text-zinc-900 dark:text-white">#{selectedLead.id}</span>
              <span className="text-[14px] text-zinc-600 dark:text-zinc-300">Conversation with {selectedLead.name}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 relative">
            <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition">
              <DotsThree className="size-6" weight="bold" />
            </button>
            
            <div className="flex items-center overflow-hidden rounded-md shadow-sm">
              <button className={cn("px-4 py-2 text-[13px] font-bold text-white transition", SUBMIT_STATE_CONFIG[submitState].color)}>
                {SUBMIT_STATE_CONFIG[submitState].label}
              </button>
              <div className={cn("w-px", SUBMIT_STATE_CONFIG[submitState].divider)} />
              <button 
                onClick={() => setIsSubmitDropdownOpen(!isSubmitDropdownOpen)}
                className={cn("px-2 py-2 text-white transition", SUBMIT_STATE_CONFIG[submitState].color)}
              >
                <CaretDown className="size-4" weight="bold" />
              </button>
            </div>
            
            {isSubmitDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950 z-50 py-1 animate-in fade-in slide-in-from-top-2">
                <button 
                  onClick={() => { setSubmitState("Open"); setIsSubmitDropdownOpen(false) }}
                  className="w-full text-left px-4 py-2 text-[13px] font-semibold text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900 transition-colors"
                >
                  Submit as Open
                </button>
                <button 
                  onClick={() => { setSubmitState("Pending"); setIsSubmitDropdownOpen(false) }}
                  className="w-full text-left px-4 py-2 text-[13px] font-semibold text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900 transition-colors"
                >
                  Submit as Pending
                </button>
                <button 
                  onClick={() => { setSubmitState("Closed"); setIsSubmitDropdownOpen(false) }}
                  className="w-full text-left px-4 py-2 text-[13px] font-semibold text-emerald-600 hover:bg-emerald-50 dark:text-emerald-500 dark:hover:bg-emerald-950/50 transition-colors"
                >
                  Submit as Closed
                </button>
                <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800 my-1" />
                <button 
                  onClick={() => {
                    setSubmitState("Lost");
                    setIsSubmitDropdownOpen(false)
                    handleMarkLost()
                  }}
                  className="w-full text-left px-4 py-2 text-[13px] font-bold text-rose-600 hover:bg-rose-50 dark:text-rose-500 dark:hover:bg-rose-950/50 transition-colors"
                >
                  Close Ticket
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center border-b border-zinc-200 pt-3 dark:border-zinc-800 bg-white dark:bg-zinc-950 shrink-0">
          <div className="flex items-center gap-6 text-[13px] font-semibold">
            {["Conversation", "Task", "Activity Logs", "Notes"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "pb-3 transition-colors border-b-2",
                  activeTab === tab 
                    ? "border-emerald-500 text-emerald-600 dark:text-emerald-400" 
                    : "border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          
          {/* Main Middle Area (Contextual based on Tab) */}
          <div className="flex flex-1 flex-col overflow-hidden bg-[#fafaf9] dark:bg-zinc-900/50">
            
            {activeTab === "Conversation" && (
              <>
                <div className="flex-1 overflow-y-auto sleek-scroll p-6 space-y-6">
                  {/* Date Separator */}
                  <div className="flex items-center justify-center gap-4 animate-in fade-in duration-300">
                    <div className="h-px w-24 bg-zinc-200 dark:bg-zinc-800" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Today</span>
                    <div className="h-px w-24 bg-zinc-200 dark:bg-zinc-800" />
                  </div>

                  {currentChat.map((msg, idx) => {
                    if (msg.sender === "system") {
                      return (
                        <div key={msg.id} className="flex items-center gap-3 pl-14 animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                          <Avatar className="size-6 shrink-0 bg-zinc-200 dark:bg-zinc-800">
                            <AvatarFallback className="text-[8px] font-bold text-zinc-600 dark:text-zinc-400">SYS</AvatarFallback>
                          </Avatar>
                          <p className="text-[12px] font-medium text-zinc-500">
                            <span className="text-zinc-800 dark:text-zinc-200 font-bold">System</span> {msg.text} &bull; {msg.time}
                          </p>
                        </div>
                      )
                    }

                    const isAgent = msg.sender === "agent"
                    
                    return (
                      <div key={msg.id} className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                        {isAgent ? (
                          <Avatar className="size-10 shrink-0 bg-[#1d1b4b] text-white shadow-sm">
                            <AvatarFallback className="font-bold bg-[#1d1b4b] text-white text-[12px]">AGT</AvatarFallback>
                          </Avatar>
                        ) : (
                          <Avatar className="size-10 shrink-0 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                            <AvatarImage src={`https://i.pravatar.cc/150?u=${selectedLead.id}`} />
                            <AvatarFallback className="font-bold text-zinc-600 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300">
                              {selectedLead.name.split(" ").map(n=>n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] font-bold text-zinc-900 dark:text-white">
                              {isAgent ? "Support Agent" : selectedLead.name}
                            </span>
                            <span className="text-[12px] text-zinc-500">{msg.time}</span>
                            <span className="text-[12px] text-zinc-400">&bull;</span>
                            <span className="flex items-center gap-1 text-[12px] text-zinc-500">
                              Via <SourceIcon className={cn("size-3.5", sourceColor)} weight="fill" /> {msg.via}
                            </span>
                          </div>
                          <p className={cn(
                            "mt-1 text-[14px] leading-relaxed max-w-2xl p-3 rounded-2xl border shadow-sm",
                            isAgent 
                              ? "bg-emerald-100 text-emerald-900 border-emerald-200 rounded-tl-sm dark:bg-emerald-900/50 dark:text-emerald-100 dark:border-emerald-800"
                              : "bg-white text-zinc-700 border-zinc-200 rounded-tl-sm dark:bg-zinc-950 dark:text-zinc-300 dark:border-zinc-800"
                          )}>
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    )
                  })}

                  {currentChat.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-40 text-zinc-400">
                      <ListDashes className="size-8 mb-2 opacity-50" />
                      <p className="text-[13px] font-medium">No messages yet</p>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input Box */}
                <div className="p-4 bg-[#fafaf9] dark:bg-zinc-900/50 shrink-0">
                  <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden flex flex-col transition-all focus-within:border-zinc-400 dark:focus-within:border-zinc-600 focus-within:ring-2 ring-zinc-100 dark:ring-zinc-900">
                    
                    <div className="flex items-center gap-3 px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-1 text-[12px] font-medium text-zinc-500 bg-zinc-50 dark:bg-zinc-900 px-2 py-1 rounded-md">
                        Via <SourceIcon className={cn("size-3.5", sourceColor)} weight="fill" /> {selectedLead.source} <CaretDown className="size-3 ml-1" />
                      </div>
                      <span className="text-[12px] text-zinc-400">From</span>
                      <div className="flex items-center gap-1 text-[12px] font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900 px-2 py-1 rounded-md">
                        Support Agent <CaretDown className="size-3 ml-1" />
                      </div>
                      <div className="ml-auto flex items-center gap-1">
                        <button className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-900 transition">
                          <Microphone className="size-4" />
                        </button>
                      </div>
                    </div>

                    <textarea 
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full resize-none bg-transparent p-4 text-[14px] outline-none placeholder:text-zinc-400 min-h-[80px] sleek-scroll"
                      placeholder="Type a message or Type '/' for commands. Press Enter to send."
                    />

                    <div className="flex items-center justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-2 text-zinc-400">
                        <button className="p-1 hover:text-zinc-700 dark:hover:text-zinc-200 transition"><strong className="text-[14px] font-serif">A</strong></button>
                        <button className="p-1 hover:text-zinc-700 dark:hover:text-zinc-200 transition"><Smiley className="size-4" /></button>
                        <button className="p-1 hover:text-zinc-700 dark:hover:text-zinc-200 transition"><Paperclip className="size-4" /></button>
                        <button className="p-1 hover:text-zinc-700 dark:hover:text-zinc-200 flex items-center gap-1 text-[12px] ml-2 font-medium transition">
                          Macros <CaretDown className="size-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="text-[13px] font-semibold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white transition">
                          End Chat
                        </button>
                        <Button 
                          onClick={handleSend}
                          disabled={!draft.trim()}
                          className="rounded-xl bg-zinc-900 px-6 py-2 text-[13px] font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm transition"
                        >
                          Send
                        </Button>
                      </div>
                    </div>

                  </div>
                </div>
              </>
            )}

            {activeTab === "Notes" && (
              <div className="flex-1 overflow-y-auto p-6 animate-in fade-in duration-300">
                 <div className="max-w-2xl mx-auto space-y-4">
                   <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                      <TextAa className="size-5" /> Lead Notes
                   </h3>
                   <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 focus-within:border-zinc-400 dark:focus-within:border-zinc-600 transition-all">
                     <textarea 
                        value={noteDrafts[selectedLead.id] ?? selectedLead.note}
                        onChange={(e) => setNoteDrafts(prev => ({...prev, [selectedLead.id]: e.target.value}))}
                        className="w-full h-64 resize-none outline-none bg-transparent text-[14px] text-zinc-700 dark:text-zinc-300 sleek-scroll"
                        placeholder="Add some notes about this lead..."
                     />
                   </div>
                   <div className="flex justify-end">
                     <Button 
                        onClick={() => {
                          const val = noteDrafts[selectedLead.id]
                          if(val !== undefined) {
                            setLeads(prev => prev.map(l => l.id === selectedLead.id ? {...l, note: val} : l))
                          }
                        }}
                        className="rounded-xl"
                      >Save Notes</Button>
                   </div>
                 </div>
              </div>
            )}

            {activeTab === "Task" && (
              <div className="flex-1 overflow-y-auto sleek-scroll animate-in fade-in duration-300">
                <div className="max-w-2xl mx-auto p-6 space-y-6">

                  {/* Header with Stats */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-[18px] font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <CheckSquareOffset className="size-5 text-emerald-500" weight="fill" /> Tasks
                      </h3>
                      <p className="text-[12px] text-zinc-500 mt-0.5">
                        {(tasks[selectedLead.id] || []).filter(t => t.done).length} of {(tasks[selectedLead.id] || []).length} completed
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <p className="text-[20px] font-bold text-zinc-900 dark:text-white">{(tasks[selectedLead.id] || []).filter(t => !t.done).length}</p>
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide">Open</p>
                      </div>
                      <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800" />
                      <div className="text-center">
                        <p className="text-[20px] font-bold text-emerald-500">{(tasks[selectedLead.id] || []).filter(t => t.done).length}</p>
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide">Done</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {(tasks[selectedLead.id] || []).length > 0 && (
                    <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.round(((tasks[selectedLead.id] || []).filter(t => t.done).length / (tasks[selectedLead.id] || []).length) * 100)}%` }}
                      />
                    </div>
                  )}

                  {/* Add Task Input */}
                  <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-[12px] font-bold text-zinc-500 uppercase tracking-wide">Priority</span>
                      {(["High", "Medium", "Low"] as const).map(p => (
                        <button
                          key={p}
                          onClick={() => setNewTaskPriority(p)}
                          className={cn(
                            "flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-colors",
                            newTaskPriority === p
                              ? p === "High" ? "bg-rose-500 text-white"
                                : p === "Medium" ? "bg-amber-400 text-white"
                                : "bg-zinc-400 text-white"
                              : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-500 dark:hover:bg-zinc-700"
                          )}
                        >
                          {p === "High" && <ArrowFatUp className="size-2.5" weight="fill" />}
                          {p === "Medium" && <Equals className="size-2.5" weight="bold" />}
                          {p === "Low" && <ArrowFatDown className="size-2.5" weight="fill" />}
                          {p}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3">
                      <CheckSquareOffset className="size-5 text-zinc-300 dark:text-zinc-600 shrink-0" />
                      <input
                        className="flex-1 outline-none bg-transparent text-[14px] text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400"
                        placeholder="Add a new task and press Enter..."
                        value={newTaskDraft}
                        onChange={(e) => setNewTaskDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newTaskDraft.trim()) {
                            setTasks(prev => ({
                              ...prev,
                              [selectedLead.id]: [
                                { id: Date.now().toString(), title: newTaskDraft, done: false, priority: newTaskPriority },
                                ...(prev[selectedLead.id] || [])
                              ]
                            }))
                            setNewTaskDraft("")
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          if (newTaskDraft.trim()) {
                            setTasks(prev => ({
                              ...prev,
                              [selectedLead.id]: [
                                { id: Date.now().toString(), title: newTaskDraft, done: false, priority: newTaskPriority },
                                ...(prev[selectedLead.id] || [])
                              ]
                            }))
                            setNewTaskDraft("")
                          }
                        }}
                        className="px-4 py-1.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[12px] font-bold hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Task List */}
                  <div className="space-y-2">
                    {(tasks[selectedLead.id] || []).map((t, idx) => (
                      <div
                        key={t.id}
                        className={cn(
                          "group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200",
                          t.done
                            ? "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800/50 opacity-70"
                            : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                        )}
                      >
                        {/* Checkbox */}
                        <button
                          onClick={() => {
                            setTasks(prev => ({
                              ...prev,
                              [selectedLead.id]: prev[selectedLead.id].map(task =>
                                task.id === t.id ? { ...task, done: !task.done } : task
                              )
                            }))
                          }}
                          className={cn(
                            "size-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200",
                            t.done
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "border-zinc-300 dark:border-zinc-600 hover:border-emerald-400 hover:scale-110"
                          )}
                        >
                          {t.done && <CheckCircle weight="fill" className="size-4" />}
                        </button>

                        {/* Title */}
                        <p className={cn(
                          "flex-1 text-[14px] font-medium transition-all",
                          t.done ? "line-through text-zinc-400" : "text-zinc-900 dark:text-zinc-100"
                        )}>{t.title}</p>

                        {/* Priority badge */}
                        <span className={cn(
                          "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide shrink-0",
                          t.priority === "High" ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
                          : t.priority === "Medium" ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                        )}>
                          {t.priority === "High" && <ArrowFatUp className="size-2.5" weight="fill" />}
                          {t.priority === "Medium" && <Equals className="size-2.5" weight="bold" />}
                          {t.priority === "Low" && <ArrowFatDown className="size-2.5" weight="fill" />}
                          {t.priority}
                        </span>

                        {/* Delete button */}
                        <button
                          onClick={() => {
                            setTasks(prev => ({
                              ...prev,
                              [selectedLead.id]: prev[selectedLead.id].filter(task => task.id !== t.id)
                            }))
                          }}
                          className="opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-rose-500 dark:text-zinc-600 dark:hover:text-rose-400 transition-all duration-150"
                        >
                          <XCircle className="size-4" weight="fill" />
                        </button>
                      </div>
                    ))}

                    {/* Empty State */}
                    {(tasks[selectedLead.id] || []).length === 0 && (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="size-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mb-4">
                          <CheckSquareOffset className="size-8 text-emerald-300 dark:text-emerald-700" />
                        </div>
                        <p className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100 mb-1">All clear!</p>
                        <p className="text-[13px] text-zinc-400">Add a task above to get started.</p>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

            {activeTab === "Activity Logs" && (
              <div className="flex-1 overflow-y-auto p-6 animate-in fade-in duration-300">
                 <div className="max-w-2xl mx-auto space-y-6">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                       <ClockCounterClockwise className="size-5" /> Activity Timeline
                    </h3>
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 before:to-transparent dark:before:via-zinc-800">
                       {currentChat.filter(msg => msg.sysEvent).map((msg, i) => (
                         <div key={msg.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                           <div className="flex items-center justify-center size-10 rounded-full border border-white bg-zinc-100 text-zinc-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 dark:border-zinc-950 dark:bg-zinc-800">
                             <span className="text-[10px] font-bold">SYS</span>
                           </div>
                           <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                             <div className="flex items-center justify-between space-x-2 mb-1">
                               <div className="font-bold text-zinc-900 dark:text-zinc-100 text-[13px]">System Event</div>
                               <time className="font-medium text-zinc-400 text-[11px]">{msg.time}</time>
                             </div>
                             <div className="text-zinc-500 text-[12px]">{msg.text}</div>
                           </div>
                         </div>
                       ))}
                       {currentChat.filter(msg => msg.sysEvent).length === 0 && (
                         <p className="text-[13px] text-zinc-500 text-center py-10">No system events recorded yet.</p>
                       )}
                    </div>
                 </div>
              </div>
            )}

          </div>

          {/* Right Sidebar (Details Pane) - only visible on Conversation tab */}
          <div className={cn(
            "shrink-0 border-l border-zinc-200 bg-white overflow-y-auto sleek-scroll dark:border-zinc-800 dark:bg-zinc-950 flex flex-col transition-all duration-300 overflow-hidden",
            activeTab === "Conversation" ? "w-[340px] p-6 opacity-100" : "w-0 p-0 opacity-0 pointer-events-none border-l-0"
          )}>
            <button className="flex items-center gap-2 text-[13px] font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white mb-6 transition">
              <ArrowLeft className="size-4" weight="bold" />
              Company Info
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="size-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Cube className="size-4" weight="fill" />
              </div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{selectedLead.company}</h2>
            </div>

            <div className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800 shadow-sm space-y-6 bg-[#fafaf9] dark:bg-zinc-900/20">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-bold text-zinc-900 dark:text-white">Lead Details</h3>
                <Badge className={cn(
                  "px-2.5 py-0.5 font-bold uppercase tracking-wide text-[10px]",
                  selectedLead.status === "Hot" && "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
                  selectedLead.status === "Warm" && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                  selectedLead.status === "Cold" && "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
                  selectedLead.status === "Lost" && "bg-zinc-800 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900",
                )}>
                  {selectedLead.status}
                </Badge>
              </div>

              <div className="space-y-3 text-[13px]">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Contact</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{selectedLead.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Value</span>
                  <span className="font-bold text-zinc-900 dark:text-white text-[14px]">{selectedLead.value}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Source</span>
                  <span className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <SourceIcon className={cn("size-3.5", sourceColor)} weight="fill" /> {selectedLead.source}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[13px] font-semibold text-zinc-500 mb-3">CRM Stage</p>
                <div className="relative flex items-center justify-between mb-2">
                  <div className="absolute left-2 right-2 top-1.5 h-0.5 bg-zinc-200 dark:bg-zinc-800" />
                  
                  {/* Dynamic Progress Bar Fill */}
                  <div className={cn(
                    "absolute left-2 top-1.5 h-0.5 bg-emerald-500 transition-all duration-500",
                    selectedLead.stage === "New" ? "w-[0%]" :
                    selectedLead.stage === "Contacted" ? "w-[33%]" :
                    selectedLead.stage === "Qualified" ? "w-[66%]" :
                    "w-[100%]"
                  )} />
                  
                  {STAGES.map((stage, i) => {
                    const currentStageIdx = STAGES.indexOf(selectedLead.stage)
                    const isCompleted = i <= currentStageIdx
                    
                    const StageIcon = 
                      stage === "New" ? Sparkle :
                      stage === "Contacted" ? PhoneCall :
                      stage === "Qualified" ? CheckCircle : FileText;
                      
                    return (
                      <div key={stage} className="relative flex flex-col items-center gap-1.5 z-10">
                        <div className={cn(
                          "size-6 flex items-center justify-center rounded-full border-2 border-white dark:border-zinc-950 transition-colors duration-300",
                          isCompleted ? "bg-emerald-500 text-white" : "bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
                        )}>
                          <StageIcon className="size-3" weight={isCompleted ? "fill" : "bold"} />
                        </div>
                        <span className={cn(
                          "text-[10px] transition-colors duration-300",
                          isCompleted ? "font-bold text-zinc-900 dark:text-white" : "font-semibold text-zinc-400"
                        )}>
                          {stage}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>

            <div className="mt-6 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
              <p className="text-[12px] font-bold text-zinc-900 dark:text-white mb-3">Contact Information</p>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full border border-zinc-200 bg-zinc-50 p-1.5 dark:border-zinc-800 dark:bg-zinc-900">
                  <ArrowsClockwise className="size-3.5 text-zinc-500" />
                </div>
                <div className="text-[13px] font-medium text-zinc-700 leading-relaxed dark:text-zinc-300 space-y-0.5">
                  <p className="font-semibold text-zinc-900 dark:text-white">{selectedLead.email}</p>
                  <p>{selectedLead.phone}</p>
                  <p className="text-zinc-400">{selectedLead.location}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3 pb-8">
              <Button 
                variant="outline" 
                onClick={handleMarkLost}
                className="flex-1 rounded-xl text-[13px] font-bold shadow-sm border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 transition gap-1.5"
              >
                <XCircle className="size-4" weight="fill" />
                Mark Lost
              </Button>
              <Button 
                onClick={handleUpdateStage}
                disabled={selectedLead.stage === "Proposal"}
                className="flex-1 rounded-xl bg-zinc-900 text-[13px] font-bold text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm transition gap-1.5"
              >
                {selectedLead.stage === "Proposal" ? (
                  <>Completed <CheckCircle className="size-4" weight="bold" /></>
                ) : (
                  <>Advance Stage <ArrowRight className="size-4" weight="bold" /></>
                )}
              </Button>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}
