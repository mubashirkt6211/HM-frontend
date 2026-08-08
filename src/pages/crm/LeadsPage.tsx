"use client"

import { useMemo, useState, useRef, type KeyboardEvent, type ElementType } from "react"
import {
  CaretDown,
  WhatsappLogo,
  Paperclip,
  Smiley,
  Microphone,
  User,
  InstagramLogo,
  MetaLogo,
  GlobeHemisphereWest,
  CheckSquareOffset,
  ClockCounterClockwise,
  ListDashes,
  Sparkle,
  PhoneCall,
  CheckCircle,
  FileText,
  XCircle,
  ArrowFatUp,
  ArrowFatDown,
  Equals,
  MapPin,
  AirplaneTilt,
  UsersThree,
  EnvelopeSimple,
  Plus,
  ChatCircleDots,
  Chat,
  CheckSquare,
  CurrencyDollar,
  Fire,
  ThermometerHot,
  Snowflake,
  ProhibitInset,
  PaperPlaneTilt,
  Buildings,
  Tag,
  FunnelSimple,
  IdentificationBadge,
  NotePencil,
  MagnifyingGlass,
  Question,
  Link,
  BookmarkSimple,
  ShieldCheck,
  ShareNetwork,
  Bell,
  CaretUp,
  Clock,
  X,
} from "@phosphor-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Filters, type Filter, type FilterFieldConfig } from "@/components/reui/filters"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────────────────────────
   Types & Travel CRM Lead Data
   ───────────────────────────────────────────────────────────────── */

type Stage = "New" | "Contacted" | "Qualified" | "Proposal" | "Won" | "RNR" | "Junk"
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
  destination: string
  travelType: string
  travelers: number
}

const INITIAL_LEADS: Lead[] = [
  { id: "LD-001", name: "Mia Reynolds", company: "Honeymoon Bliss", source: "WhatsApp", stage: "Qualified", value: "$12,500", status: "Hot", assigned: "Ari Parker", lastActivity: "2h ago", email: "mia@gmail.com", phone: "+1 (555) 123-8791", location: "Boston, MA", note: "Looking for a luxury Maldives honeymoon package with overwater villa.", destination: "Maldives", travelType: "Honeymoon", travelers: 2 },
  { id: "LD-002", name: "Noah Patel", company: "Patel Family Tours", source: "Instagram", stage: "Proposal", value: "$8,400", status: "Warm", assigned: "Sam Rivera", lastActivity: "1d ago", email: "noah.patel@outlook.com", phone: "+1 (555) 420-7712", location: "Austin, TX", note: "Family vacation to Switzerland. Needs kid-friendly itinerary.", destination: "Switzerland", travelType: "Family", travelers: 5 },
  { id: "LD-003", name: "Sofia Chen", company: "Chen Adventures", source: "Meta", stage: "Contacted", value: "$6,200", status: "Hot", assigned: "Jordan Lee", lastActivity: "3h ago", email: "sofia.chen@yahoo.com", phone: "+1 (555) 210-6640", location: "San Francisco, CA", note: "Solo backpacking trip through Southeast Asia. Budget-conscious.", destination: "Thailand", travelType: "Adventure", travelers: 1 },
  { id: "LD-004", name: "Ethan Brooks", company: "Brooks Corp Travel", source: "WhatsApp", stage: "New", value: "$22,000", status: "Warm", assigned: "Maya Chen", lastActivity: "5h ago", email: "ethan@brookscorp.com", phone: "+1 (555) 310-8812", location: "New York, NY", note: "Corporate retreat for 20 people in Bali. Needs conference facilities.", destination: "Bali, Indonesia", travelType: "Corporate", travelers: 20 },
  { id: "LD-005", name: "Ava Thompson", company: "Thompson Travels", source: "Website", stage: "Contacted", value: "$4,800", status: "Cold", assigned: "Sam Nguyen", lastActivity: "Yesterday", email: "ava.t@gmail.com", phone: "+1 (555) 892-3345", location: "Chicago, IL", note: "Couple's anniversary trip to Santorini. Interested in wine tours.", destination: "Santorini, Greece", travelType: "Romantic", travelers: 2 },
  { id: "LD-006", name: "Lucas Garcia", company: "Garcia Events", source: "Meta", stage: "New", value: "$18,500", status: "Hot", assigned: "Ari Parker", lastActivity: "10m ago", email: "lucas.g@garciaevents.com", phone: "+1 (555) 773-9090", location: "Miami, FL", note: "Destination wedding in Tulum, Mexico for 50 guests.", destination: "Tulum, Mexico", travelType: "Wedding", travelers: 50 },
  { id: "LD-007", name: "Emma Wright", company: "Wright & Co.", source: "WhatsApp", stage: "Qualified", value: "$35,000", status: "Warm", assigned: "Maya Chen", lastActivity: "4h ago", email: "emma@wrightco.com", phone: "+1 (555) 221-4455", location: "Seattle, WA", note: "Luxury safari in Kenya with private lodge. Celebrating retirement.", destination: "Kenya", travelType: "Safari", travelers: 4 },
  { id: "LD-008", name: "Oliver Scott", company: "Scott Adventures", source: "Instagram", stage: "Proposal", value: "$15,200", status: "Hot", assigned: "Jordan Lee", lastActivity: "2d ago", email: "oliver@scottadv.com", phone: "+1 (555) 334-1122", location: "Denver, CO", note: "Ski holiday in the Swiss Alps. Wants chalet accommodation.", destination: "Swiss Alps", travelType: "Skiing", travelers: 6 },
  { id: "LD-009", name: "Isabella Davis", company: "Davis Family", source: "Website", stage: "Contacted", value: "$3,200", status: "Lost", assigned: "Sam Rivera", lastActivity: "1w ago", email: "isabella.d@gmail.com", phone: "+1 (555) 998-0011", location: "Atlanta, GA", note: "Was interested in a Cruise trip but went with another agency.", destination: "Caribbean", travelType: "Cruise", travelers: 3 },
  { id: "LD-010", name: "Mason Rodriguez", company: "Rodriguez LLC", source: "WhatsApp", stage: "New", value: "$7,800", status: "Cold", assigned: "Ari Parker", lastActivity: "3d ago", email: "mason@rodriguezllc.com", phone: "+1 (555) 443-2299", location: "Dallas, TX", note: "Group hiking trip to Patagonia. Waiting on passport renewal.", destination: "Patagonia", travelType: "Adventure", travelers: 8 },
  { id: "LD-011", name: "Harper White", company: "White Luxe Travel", source: "Meta", stage: "Qualified", value: "$28,000", status: "Hot", assigned: "Maya Chen", lastActivity: "1h ago", email: "harper@whiteluxe.com", phone: "+1 (555) 665-4433", location: "Houston, TX", note: "VIP Kyoto cherry blossom tour with ryokan stays and tea ceremonies.", destination: "Kyoto, Japan", travelType: "Cultural", travelers: 2 },
  { id: "LD-012", name: "Elijah Thomas", company: "Thomas Enterprises", source: "Website", stage: "Proposal", value: "$45,000", status: "Warm", assigned: "Jordan Lee", lastActivity: "Yesterday", email: "ethomas@thomasent.com", phone: "+1 (555) 112-9988", location: "Charlotte, NC", note: "Annual company offsite to Amalfi Coast. 30 employees, team building.", destination: "Amalfi Coast, Italy", travelType: "Corporate", travelers: 30 },
  { id: "LD-013", name: "Charlotte Moore", company: "Solo Wanderer", source: "Instagram", stage: "New", value: "$2,800", status: "Hot", assigned: "Sam Nguyen", lastActivity: "15m ago", email: "charlotte.m@gmail.com", phone: "+1 (555) 776-5544", location: "Portland, OR", note: "Solo digital nomad trip to Lisbon. Needs coworking space recommendations.", destination: "Lisbon, Portugal", travelType: "Solo", travelers: 1 },
  { id: "LD-014", name: "Benjamin Taylor", company: "Taylor Holdings", source: "WhatsApp", stage: "Contacted", value: "$19,500", status: "Warm", assigned: "Ari Parker", lastActivity: "2h ago", email: "btaylor@taylorhold.com", phone: "+1 (555) 990-2211", location: "Salt Lake City, UT", note: "Multi-city European tour: Paris → Rome → Barcelona over 3 weeks.", destination: "Europe Multi-City", travelType: "Touring", travelers: 2 },
  { id: "LD-015", name: "Amelia Anderson", company: "Anderson Group", source: "Meta", stage: "Qualified", value: "$11,000", status: "Lost", assigned: "Maya Chen", lastActivity: "2w ago", email: "amelia@andersongrp.com", phone: "+1 (555) 332-1100", location: "Phoenix, AZ", note: "Wanted a Dubai luxury package but postponed indefinitely.", destination: "Dubai", travelType: "Luxury", travelers: 2 },
  { id: "LD-016", name: "James Jackson", company: "Jackson Corp", source: "Website", stage: "New", value: "$5,500", status: "Cold", assigned: "Jordan Lee", lastActivity: "5d ago", email: "jjackson@jacksoncorp.com", phone: "+1 (555) 554-3322", location: "Detroit, MI", note: "Interested in Iceland Northern Lights trip but hasn't responded.", destination: "Iceland", travelType: "Adventure", travelers: 2 },
  { id: "LD-017", name: "Evelyn Martin", company: "Martin Luxe", source: "WhatsApp", stage: "Proposal", value: "$32,000", status: "Hot", assigned: "Sam Rivera", lastActivity: "30m ago", email: "emartin@martinluxe.com", phone: "+1 (555) 887-6655", location: "Las Vegas, NV", note: "Private yacht charter in the Greek Islands. Ready to finalize.", destination: "Greek Islands", travelType: "Luxury", travelers: 8 },
  { id: "LD-018", name: "Alexander Lee", company: "Lee Ventures", source: "Instagram", stage: "Contacted", value: "$6,900", status: "Warm", assigned: "Ari Parker", lastActivity: "1d ago", email: "alex@leeventures.com", phone: "+1 (555) 223-9988", location: "Orlando, FL", note: "Asking about Machu Picchu trek with luxury Belmond train add-on.", destination: "Peru", travelType: "Adventure", travelers: 2 },
  { id: "LD-019", name: "Abigail Perez", company: "Perez Family", source: "Meta", stage: "Qualified", value: "$9,200", status: "Hot", assigned: "Maya Chen", lastActivity: "4h ago", email: "aperez@gmail.com", phone: "+1 (555) 110-3344", location: "San Diego, CA", note: "Family trip to Costa Rica. Wants eco-lodge and zip-lining.", destination: "Costa Rica", travelType: "Family", travelers: 4 },
  { id: "LD-020", name: "Michael Thompson", company: "Thompson Inc", source: "Website", stage: "Proposal", value: "$55,000", status: "Lost", assigned: "Jordan Lee", lastActivity: "1mo ago", email: "mthompson@thompsoninc.com", phone: "+1 (555) 445-6677", location: "Cleveland, OH", note: "Lost mega-deal for a New Zealand 3-week expedition.", destination: "New Zealand", travelType: "Expedition", travelers: 12 },
  { id: "LD-021", name: "Nina Brooks", company: "Oceanview Travel", source: "WhatsApp", stage: "Won", value: "$21,000", status: "Hot", assigned: "Maya Chen", lastActivity: "1h ago", email: "nina.brooks@oceanview.com", phone: "+1 (555) 872-4532", location: "San Diego, CA", note: "Signed contract for the Maldives package.", destination: "Maldives", travelType: "Romantic", travelers: 2 },
  { id: "LD-022", name: "Arjun Singh", company: "Singh Explorers", source: "Meta", stage: "RNR", value: "$12,700", status: "Warm", assigned: "Sam Rivera", lastActivity: "2d ago", email: "arjun.singh@singhexplorers.com", phone: "+1 (555) 332-1010", location: "Houston, TX", note: "Call back after the client returns from city tour.", destination: "Tokyo", travelType: "Adventure", travelers: 1 },
  { id: "LD-023", name: "Maria Lopez", company: "Lopez Getaways", source: "Website", stage: "Junk", value: "$1,200", status: "Cold", assigned: "Jordan Lee", lastActivity: "3w ago", email: "maria.lopez@getaways.com", phone: "+1 (555) 121-7788", location: "Tampa, FL", note: "No longer interested, marked junk.", destination: "Cairo", travelType: "Cultural", travelers: 2 },
]

const SOURCE_CONFIG: Record<SourceType, { icon: ElementType; color: string; bg: string }> = {
  WhatsApp: { icon: WhatsappLogo, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
  Instagram: { icon: InstagramLogo, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-950/40" },
  Meta: { icon: MetaLogo, color: "text-sky-500", bg: "bg-sky-50 dark:bg-sky-950/40" },
  Website: { icon: GlobeHemisphereWest, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/40" },
}

const TRAVEL_TYPE_COLORS: Record<string, string> = {
  Honeymoon: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  Family: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
  Adventure: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  Corporate: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  Romantic: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  Wedding: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300",
  Safari: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  Skiing: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  Cruise: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  Cultural: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  Solo: "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300",
  Touring: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  Luxury: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  Expedition: "bg-stone-100 text-stone-700 dark:bg-stone-900/30 dark:text-stone-300",
}

const LEADS_FILTER_FIELDS: FilterFieldConfig[] = [
  {
    key: "source",
    label: "Source",
    icon: <GlobeHemisphereWest className="size-4" />,
    type: "select",
    options: [
      { value: "WhatsApp", label: "WhatsApp", icon: <WhatsappLogo className="size-4" /> },
      { value: "Instagram", label: "Instagram", icon: <InstagramLogo className="size-4" /> },
      { value: "Meta", label: "Meta", icon: <MetaLogo className="size-4" /> },
      { value: "Website", label: "Website", icon: <GlobeHemisphereWest className="size-4" /> },
    ],
  },
  {
    key: "status",
    label: "Status",
    icon: <Sparkle className="size-4" />,
    type: "select",
    options: [
      { value: "Hot", label: "Hot" },
      { value: "Warm", label: "Warm" },
      { value: "Cold", label: "Cold" },
      { value: "Lost", label: "Lost" },
    ],
  },
  {
    key: "stage",
    label: "Stage",
    icon: <ListDashes className="size-4" />,
    type: "select",
    options: [
      { value: "New", label: "New" },
      { value: "Contacted", label: "Contacted" },
      { value: "Qualified", label: "Qualified" },
      { value: "Proposal", label: "Proposal" },
      { value: "Won", label: "Won" },
      { value: "RNR", label: "RNR" },
      { value: "Junk", label: "Junk" },
    ],
  },
  {
    key: "travelType",
    label: "Travel type",
    icon: <AirplaneTilt className="size-4" />,
    type: "select",
    options: [
      { value: "Honeymoon", label: "Honeymoon" },
      { value: "Family", label: "Family" },
      { value: "Adventure", label: "Adventure" },
      { value: "Corporate", label: "Corporate" },
      { value: "Romantic", label: "Romantic" },
      { value: "Wedding", label: "Wedding" },
      { value: "Safari", label: "Safari" },
      { value: "Skiing", label: "Skiing" },
      { value: "Cruise", label: "Cruise" },
      { value: "Cultural", label: "Cultural" },
      { value: "Solo", label: "Solo" },
      { value: "Touring", label: "Touring" },
      { value: "Luxury", label: "Luxury" },
      { value: "Expedition", label: "Expedition" },
    ],
  },
  {
    key: "assigned",
    label: "Assigned",
    icon: <User className="size-4" />,
    type: "text",
    placeholder: "Agent name...",
  },
  {
    key: "destination",
    label: "Destination",
    icon: <MapPin className="size-4" />,
    type: "text",
    placeholder: "Destination...",
  },
]

const STAGES: Stage[] = ["New", "Contacted", "Qualified", "Proposal", "Won", "RNR", "Junk"]

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
      { id: "sys-1", sender: "system", text: `Travel inquiry received via ${lead.source}`, time: "10:00 AM", sysEvent: true },
      { id: "usr-1", sender: "user", text: `Hi, I'm interested in a ${lead.travelType.toLowerCase()} trip to ${lead.destination}. ${lead.note}`, time: "10:05 AM", via: lead.source },
      { id: "agt-1", sender: "agent", text: `Hello ${lead.name.split(" ")[0]}! Thank you for reaching out to Wanderlust Travel. I'd love to help you plan the perfect ${lead.destination} experience. Let me prepare some options for you.`, time: "10:15 AM", via: lead.source },
    ]
  })
  return chats
}

const parseRelativeActivityDate = (value: string) => {
  const now = new Date()
  const normalized = value.trim().toLowerCase()
  if (normalized === "yesterday") {
    const date = new Date(now)
    date.setDate(now.getDate() - 1)
    return date
  }
  if (normalized.endsWith("ago")) {
    const [amount, unit] = normalized.replace("ago", "").trim().split(" ")
    const count = Number(amount)
    if (Number.isNaN(count)) return null
    const date = new Date(now)
    if (unit.startsWith("h")) date.setHours(now.getHours() - count)
    else if (unit.startsWith("m")) date.setMinutes(now.getMinutes() - count)
    else if (unit.startsWith("d")) date.setDate(now.getDate() - count)
    else if (unit.startsWith("w")) date.setDate(now.getDate() - count * 7)
    else if (unit.startsWith("mo")) date.setMonth(now.getMonth() - count)
    return date
  }
  return null
}

type LeadTask = { id: string; title: string; done: boolean; priority: "High" | "Medium" | "Low" }
const INITIAL_TASKS: Record<string, LeadTask[]> = {}
INITIAL_LEADS.forEach(lead => {
  INITIAL_TASKS[lead.id] = [
    { id: "1", title: `Send ${lead.destination} itinerary proposal`, done: false, priority: "High" },
    { id: "2", title: "Confirm passport & visa requirements", done: true, priority: "Medium" },
    { id: "3", title: "Schedule travel consultation call", done: false, priority: "Low" },
  ]
})

const STATUS_CONFIG: Record<StatusType, { icon: ElementType; tone: string; iconColor: string }> = {
  Hot: { icon: Fire, tone: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400", iconColor: "text-rose-500" },
  Warm: { icon: ThermometerHot, tone: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", iconColor: "text-amber-500" },
  Cold: { icon: Snowflake, tone: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400", iconColor: "text-sky-500" },
  Lost: { icon: ProhibitInset, tone: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300", iconColor: "text-zinc-500" },
}

function LeadDetailsDrawer({
  lead,
  messages,
  tasks,
  onSendMessage,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onSaveNote,
  onClose,
}: {
  lead: Lead
  messages: Message[]
  tasks: LeadTask[]
  onSendMessage: (leadId: string, text: string) => void
  onToggleTask: (leadId: string, taskId: string) => void
  onAddTask: (leadId: string, title: string, priority: "High" | "Medium" | "Low") => void
  onDeleteTask: (leadId: string, taskId: string) => void
  onSaveNote: (leadId: string, note: string) => void
  onClose?: () => void
}) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    ownership: true,
    connectedApps: true,
    timeline: true,
  })

  const [activeTab, setActiveTab] = useState<"Overview" | "Timeline" | "Chat" | "Notes">("Overview")
  const [chatDraft, setChatDraft] = useState("")
  const [taskDraft, setTaskDraft] = useState("")
  const [noteDraft, setNoteDraft] = useState(lead.note)

  const toggleSection = (sec: string) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }))
  }

  const SourceIcon = SOURCE_CONFIG[lead.source].icon
  const sourceColor = SOURCE_CONFIG[lead.source].color

  return (
    <SheetContent side="right" className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-[560px] bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl">
      <SheetHeader className="sr-only">
        <SheetTitle>{lead.name} details</SheetTitle>
        <SheetDescription>Inquiry details and timeline</SheetDescription>
      </SheetHeader>

      {/* Header matching screenshot reui.io/blocks/application/dialog */}
      <div className="shrink-0 p-6 sm:p-7 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              {lead.name}
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/70 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                {lead.stage}
              </span>
            </h2>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {lead.company} &bull; {lead.destination} ({lead.travelType})
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/60">
          {(["Overview", "Timeline", "Chat", "Notes"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                activeTab === t
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              )}
            >
              {t}
              {t === "Chat" && messages.filter((m) => !m.sysEvent).length > 0 && (
                <span className="ml-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.2 text-[9px] font-bold">
                  {messages.filter((m) => !m.sysEvent).length}
                </span>
              )}
              {t === "Timeline" && (
                <span className="ml-1.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 px-1.5 py-0.2 text-[9px] font-bold">
                  Timeline 06
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto sleek-scroll p-6 sm:p-7 space-y-4">

        {activeTab === "Overview" && (
          <div className="space-y-4">

            {/* Section 1: Ownership & Cadence (ReUI Dialog screenshot style) */}
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/40 shadow-xs">
              <div
                onClick={() => toggleSection("ownership")}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Ownership & cadence</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Lock in the primary operator, workspace alias, and review window.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                    In progress
                  </span>
                  {openSections.ownership ? (
                    <CaretUp className="size-4 text-zinc-400" />
                  ) : (
                    <CaretDown className="size-4 text-zinc-400" />
                  )}
                </div>
              </div>

              {openSections.ownership && (
                <div className="mt-4 rounded-xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/60 space-y-3 animate-in fade-in duration-200">
                  <div className="grid grid-cols-[130px_1fr] items-center text-xs">
                    <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                      <User className="size-3.5" /> Launch owner
                    </span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">{lead.assigned}</span>
                  </div>

                  <div className="grid grid-cols-[130px_1fr] items-center text-xs">
                    <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                      <Buildings className="size-3.5" /> Workspace alias
                    </span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">{lead.company || "growth-command"}</span>
                  </div>

                  <div className="grid grid-cols-[130px_1fr] items-center text-xs">
                    <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                      <Clock className="size-3.5" /> Review window
                    </span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">{lead.lastActivity}</span>
                  </div>

                  <div className="grid grid-cols-[130px_1fr] items-center text-xs">
                    <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                      <EnvelopeSimple className="size-3.5" /> Email
                    </span>
                    <a href={`mailto:${lead.email}`} className="font-semibold text-blue-600 hover:underline dark:text-blue-400 truncate">
                      {lead.email}
                    </a>
                  </div>

                  <div className="grid grid-cols-[130px_1fr] items-center text-xs">
                    <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                      <PhoneCall className="size-3.5" /> Contact Phone
                    </span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">{lead.phone}</span>
                  </div>

                  <div className="grid grid-cols-[130px_1fr] items-center text-xs">
                    <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                      <MapPin className="size-3.5" /> Destination
                    </span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">{lead.destination} ({lead.travelers} travelers)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Connected apps */}
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/40 shadow-xs">
              <div
                onClick={() => toggleSection("connectedApps")}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    <ShareNetwork className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Connected apps</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Choose the tools that can send events or receive rollout updates.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
                    Pending
                  </span>
                  {openSections.connectedApps ? (
                    <CaretUp className="size-4 text-zinc-400" />
                  ) : (
                    <CaretDown className="size-4 text-zinc-400" />
                  )}
                </div>
              </div>

              {openSections.connectedApps && (
                <div className="mt-4 space-y-2 animate-in fade-in duration-200">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
                      <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-zinc-800 dark:text-zinc-200 select-none">
                        <span
                          onClick={() => onToggleTask(lead.id, task.id)}
                          className={cn(
                            "flex size-4 shrink-0 items-center justify-center rounded-[5px] border transition-all cursor-pointer",
                            task.done
                              ? "border-[#34C759] bg-[#34C759] text-white shadow-xs"
                              : "border-zinc-300 bg-white hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
                          )}
                        >
                          {task.done && (
                            <svg className="size-3 stroke-white" fill="none" viewBox="0 0 24 24" strokeWidth="3.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          )}
                        </span>
                        <span className={cn(task.done && "line-through text-zinc-400")}>{task.title}</span>
                      </label>
                      <button onClick={() => onDeleteTask(lead.id, task.id)} className="text-zinc-300 hover:text-rose-500 dark:text-zinc-600">
                        <XCircle className="size-4" weight="fill" />
                      </button>
                    </div>
                  ))}

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      value={taskDraft}
                      onChange={(e) => setTaskDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && taskDraft.trim()) {
                          onAddTask(lead.id, taskDraft, "Medium")
                          setTaskDraft("")
                        }
                      }}
                      placeholder="Add connected task..."
                      className="flex-1 h-9 rounded-xl border border-zinc-200 bg-white px-3 text-xs text-zinc-800 placeholder:text-zinc-400 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (taskDraft.trim()) {
                          onAddTask(lead.id, taskDraft, "Medium")
                          setTaskDraft("")
                        }
                      }}
                      className="h-9 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="size-3.5" weight="bold" /> Add
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Fallback rules */}
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/40 shadow-xs">
              <div
                onClick={() => toggleSection("timeline")}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    <Bell className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1">
                      Fallback rules
                      <Question className="size-3.5 text-zinc-400" />
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Set where alerts and digests land if the primary flow is paused.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
                    Pending
                  </span>
                  {openSections.timeline ? (
                    <CaretUp className="size-4 text-zinc-400" />
                  ) : (
                    <CaretDown className="size-4 text-zinc-400" />
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Timeline 06 Tab / View */}
        {(activeTab === "Timeline" || (activeTab === "Overview" && openSections.timeline)) && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <ClockCounterClockwise className="size-3.5 text-emerald-500" />
                ReUI Activity Timeline 06
              </h4>
              <span className="text-[10px] font-bold text-zinc-400">Real-time sync</span>
            </div>

            {/* ReUI Timeline 06 Component */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-800">
              
              {/* Timeline Item 1 */}
              <div className="relative">
                <span className="absolute -left-6 top-0 flex size-5 items-center justify-center rounded-full bg-[#34C759] text-white shadow-xs ring-4 ring-white dark:ring-zinc-950">
                  <CheckCircle className="size-3" weight="bold" />
                </span>
                <div className="rounded-2xl border border-zinc-200/80 bg-white p-3.5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900 dark:text-white">Ownership & Cadence Locked</span>
                    <span className="text-[10px] font-medium text-zinc-400">Today, 2:45 PM</span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
                    Assigned operator <span className="font-semibold text-zinc-800 dark:text-zinc-200">{lead.assigned}</span> and locked review window.
                  </p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <Avatar className="size-5">
                      <AvatarImage src="https://i.pravatar.cc/64?u=ari" />
                      <AvatarFallback className="text-[8px]">AP</AvatarFallback>
                    </Avatar>
                    <span className="text-[10px] font-semibold text-zinc-500">Ari Parker &bull; Primary Operator</span>
                  </div>
                </div>
              </div>

              {/* Timeline Item 2 */}
              <div className="relative">
                <span className="absolute -left-6 top-0 flex size-5 items-center justify-center rounded-full bg-blue-500 text-white shadow-xs ring-4 ring-white dark:ring-zinc-950">
                  <PaperPlaneTilt className="size-3" weight="bold" />
                </span>
                <div className="rounded-2xl border border-zinc-200/80 bg-white p-3.5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900 dark:text-white">Proposal Sent to Client</span>
                    <span className="text-[10px] font-medium text-zinc-400">Yesterday, 4:15 PM</span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
                    Dispatched luxury honeymoon package details for <span className="font-semibold text-zinc-800 dark:text-zinc-200">{lead.destination}</span>.
                  </p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 px-2 py-0.5 text-[9px] font-bold flex items-center gap-1">
                      <SourceIcon className={cn("size-3", sourceColor)} weight="fill" /> {lead.source} Connected
                    </span>
                  </div>
                </div>
              </div>

              {/* System Event Items */}
              {messages.filter((m) => m.sysEvent).map((msg) => (
                <div key={msg.id} className="relative">
                  <span className="absolute -left-6 top-0 flex size-5 items-center justify-center rounded-full bg-purple-500 text-white shadow-xs ring-4 ring-white dark:ring-zinc-950">
                    <Clock className="size-3" weight="bold" />
                  </span>
                  <div className="rounded-2xl border border-zinc-200/80 bg-white p-3.5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900 dark:text-white">{msg.text}</span>
                      <span className="text-[10px] font-medium text-zinc-400">{msg.time}</span>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        )}

        {/* Chat tab */}
        {activeTab === "Chat" && (
          <div className="space-y-4">
            <div className="space-y-3 max-h-[350px] overflow-y-auto sleek-scroll pr-1">
              {messages.map((message) => {
                const isAgent = message.sender === "agent"
                return (
                  <div key={message.id} className={cn("flex items-start gap-2.5", isAgent && "flex-row-reverse")}>
                    <Avatar className="size-7 shrink-0">
                      <AvatarImage src={isAgent ? "https://i.pravatar.cc/64?u=agent" : `https://i.pravatar.cc/64?u=${lead.id}`} />
                      <AvatarFallback className="text-[9px]">{isAgent ? "AG" : lead.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className={cn("max-w-[80%]", isAgent && "flex flex-col items-end")}>
                      <span className="text-[10px] font-semibold text-zinc-400 mb-0.5 block">{message.time}</span>
                      <div className={cn(
                        "rounded-2xl p-3 text-xs leading-relaxed shadow-xs",
                        isAgent
                          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 rounded-tr-xs"
                          : "bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 rounded-tl-xs border border-zinc-200 dark:border-zinc-800"
                      )}>
                        {message.text}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <input
                value={chatDraft}
                onChange={(e) => setChatDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && chatDraft.trim()) {
                    onSendMessage(lead.id, chatDraft)
                    setChatDraft("")
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 h-9 rounded-xl border border-zinc-200 bg-white px-3 text-xs text-zinc-800 placeholder:text-zinc-400 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
              />
              <button
                type="button"
                onClick={() => {
                  if (chatDraft.trim()) {
                    onSendMessage(lead.id, chatDraft)
                    setChatDraft("")
                  }
                }}
                className="h-9 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 text-xs font-bold transition-colors cursor-pointer"
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* Notes tab */}
        {activeTab === "Notes" && (
          <div className="space-y-3">
            <textarea
              rows={6}
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              placeholder="Inquiry notes..."
              className="w-full rounded-2xl border border-zinc-200 bg-white p-3.5 text-xs text-zinc-800 placeholder:text-zinc-400 shadow-xs outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 resize-none"
            />
            <button
              type="button"
              onClick={() => onSaveNote(lead.id, noteDraft)}
              className="h-9 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-bold transition-colors cursor-pointer"
            >
              Save notes
            </button>
          </div>
        )}

      </div>

      {/* Footer Bar matching screenshot (Cancel / Save buttons) */}
      <div className="shrink-0 p-4 sm:p-5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-2.5 bg-white dark:bg-zinc-950">
        <button
          type="button"
          onClick={onClose}
          className="h-9 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            onSaveNote(lead.id, noteDraft)
            onClose?.()
          }}
          className="h-9 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          Save
        </button>
      </div>
    </SheetContent>
  )
}

/* ─────────────────────────────────────────────────────────────────
   Main Leads Page Component
   ───────────────────────────────────────────────────────────────── */

export function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS)
  const [filters, setFilters] = useState<Filter[]>([])
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedLeadId, setSelectedLeadId] = useState(INITIAL_LEADS[0].id)
  const [drawerLeadId, setDrawerLeadId] = useState<string | null>(null)
  const [chats, setChats] = useState<Record<string, Message[]>>(() => generateInitialChats(INITIAL_LEADS))

  // View states
  const [tasks, setTasks] = useState<Record<string, LeadTask[]>>(INITIAL_TASKS)
  const [searchQuery, setSearchQuery] = useState("")

  // Add Lead Modal State
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false)
  const [showCompanyField, setShowCompanyField] = useState(false)
  const INITIAL_FORM_DATA = {
    name: "",
    company: "",
    email: "",
    phone: "",
    destination: "",
    travelers: 2,
    travelType: "Honeymoon",
    value: "$12,500",
    source: "Website" as SourceType,
    status: "Hot" as StatusType,
    stage: "New" as Stage,
    assigned: "Ari Parker",
    assignedList: ["Ari Parker"],
    location: "",
    note: "",
    collectName: true,
    collectEmail: true,
    collectPhone: false,
    runScoring: true,
    autoAssign: false,
    sendReceipt: true,
    allowFollowup: false,
  }
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)

  const handleFormChange = (field: string, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }))
  }

  const toggleAssignee = (agent: string) => {
    setFormData((prev) => {
      const current = prev.assignedList || [prev.assigned]
      const updated = current.includes(agent)
        ? current.filter((a) => a !== agent)
        : [...current, agent]
      const finalAgents = updated.length > 0 ? updated : [agent]
      return {
        ...prev,
        assignedList: finalAgents,
        assigned: finalAgents.join(", "),
      }
    })
  }

  const handleAddLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.destination.trim()) return

    const newId = `LD-${String(leads.length + 1).padStart(3, "0")}`
    const newLead: Lead = {
      id: newId,
      name: formData.name.trim(),
      company: formData.company.trim() || `${formData.name.trim().split(" ")[0]} Travels`,
      source: formData.source,
      stage: formData.stage,
      value: formData.value.trim() || "$5,000",
      status: formData.status,
      assigned: formData.assigned,
      lastActivity: "Just now",
      email: formData.email.trim() || `${formData.name.trim().toLowerCase().replace(/\s+/g, ".")}@example.com`,
      phone: formData.phone.trim() || "+1 (555) 000-1234",
      location: formData.location.trim() || "New York, NY",
      note: formData.note.trim() || `Inquiry for ${formData.destination.trim()} (${formData.travelType})`,
      destination: formData.destination.trim(),
      travelType: formData.travelType,
      travelers: Number(formData.travelers) || 2,
    }

    setLeads((prev) => [newLead, ...prev])
    setChats((prev) => ({
      ...prev,
      [newId]: [
        { id: "sys-1", sender: "system", text: `Travel inquiry received via ${formData.source}`, time: "Just now", sysEvent: true },
      ]
    }))
    setTasks((prev) => ({
      ...prev,
      [newId]: [
        { id: "1", title: `Send ${formData.destination.trim()} itinerary proposal`, done: false, priority: "High" }
      ]
    }))

    setFormData(INITIAL_FORM_DATA)
    setIsAddLeadOpen(false)
  }

  const filteredLeads = useMemo(() => {
    let result = leads

    // Apply advanced filters set with the reusable Filters component
    filters.forEach((filter) => {
      if (!filter.values.length || !filter.values[0]) return
      const filterValue = String(filter.values[0]).toLowerCase()
      result = result.filter((lead) => {
        switch (filter.field) {
          case "source":
            return lead.source.toLowerCase() === filterValue
          case "status":
            return lead.status.toLowerCase() === filterValue
          case "stage":
            return lead.stage.toLowerCase() === filterValue
          case "travelType":
            return lead.travelType.toLowerCase() === filterValue
          case "assigned":
            return lead.assigned.toLowerCase().includes(filterValue)
          case "destination":
            return lead.destination.toLowerCase().includes(filterValue)
          default:
            return true
        }
      })
    })

    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : null
      const end = endDate ? new Date(endDate) : null
      result = result.filter((lead) => {
        const leadDate = parseRelativeActivityDate(lead.lastActivity)
        if (!leadDate) return true
        if (start && leadDate < start) return false
        if (end) {
          const endOfDay = new Date(end)
          endOfDay.setHours(23, 59, 59, 999)
          if (leadDate > endOfDay) return false
        }
        return true
      })
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase()
      result = result.filter((lead) =>
        lead.name.toLowerCase().includes(query) ||
        lead.company.toLowerCase().includes(query) ||
        lead.destination.toLowerCase().includes(query) ||
        lead.assigned.toLowerCase().includes(query) ||
        lead.id.toLowerCase().includes(query) ||
        lead.travelType.toLowerCase().includes(query)
      )
    }

    return result
  }, [leads, filters, startDate, endDate, searchQuery])

  const drawerLead = drawerLeadId ? leads.find((lead) => lead.id === drawerLeadId) ?? null : null

  const handleClearFilters = () => {
    setFilters([])
    setSearchQuery("")
  }

  const handleDrawerSendMessage = (leadId: string, text: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const lead = leads.find((l) => l.id === leadId)
    const newMessage: Message = { id: Date.now().toString(), sender: "agent", text, time, via: lead?.source }
    setChats(prev => ({ ...prev, [leadId]: [...(prev[leadId] || []), newMessage] }))
  }

  const handleToggleTask = (leadId: string, taskId: string) => {
    setTasks(prev => ({
      ...prev,
      [leadId]: (prev[leadId] || []).map(task => task.id === taskId ? { ...task, done: !task.done } : task)
    }))
  }

  const handleAddTask = (leadId: string, title: string, priority: "High" | "Medium" | "Low") => {
    setTasks(prev => ({
      ...prev,
      [leadId]: [{ id: Date.now().toString(), title, done: false, priority }, ...(prev[leadId] || [])]
    }))
  }

  const handleDeleteTask = (leadId: string, taskId: string) => {
    setTasks(prev => ({ ...prev, [leadId]: (prev[leadId] || []).filter(task => task.id !== taskId) }))
  }

  const handleSaveNote = (leadId: string, note: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, note } : l))
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
  const greetingEmoji = hour < 12 ? "🌞" : hour < 18 ? "🌤️" : "🌙"

  return (
    <>
      <div className="flex w-full max-w-full min-w-0 flex-col overflow-x-hidden dark:bg-zinc-950">

        <style dangerouslySetInnerHTML={{
          __html: `
          .sleek-scroll::-webkit-scrollbar { width: 5px; height: 6px; }
          .sleek-scroll::-webkit-scrollbar-track { background: transparent; }
          .sleek-scroll::-webkit-scrollbar-thumb { background: #e4e4e7; border-radius: 6px; }
          .sleek-scroll:hover::-webkit-scrollbar-thumb { background: #d4d4d8; }
          .dark .sleek-scroll::-webkit-scrollbar-thumb { background: #27272a; }
          .dark .sleek-scroll:hover::-webkit-scrollbar-thumb { background: #3f3f46; }
        `}} />

        <div className="flex flex-col gap-0">
          {/* Top bar: title left | filter right */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-8 pr-6 py-6 border-b border-zinc-100 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm">
            {/* Left: greeting heading & subheading */}
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-none">
                  {greeting}&nbsp;<span role="img" aria-label="greeting emoji">{greetingEmoji}</span>
                </h1>
                <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-bold text-zinc-600 dark:text-zinc-300">
                  {leads.length} Leads
                </span>
              </div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Track, assign, and manage incoming travel inquiries across pipeline stages.
              </p>
            </div>

            {/* Right: search + filters inline + add lead button */}
            <div className="flex items-center gap-2.5 flex-wrap justify-end">
              <div className="relative min-w-[220px] sm:min-w-[260px]">
                <MagnifyingGlass className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search leads, destination, or company..."
                  className="h-9 w-full rounded-xl border border-zinc-200 bg-zinc-50/80 pl-10 pr-3 text-xs text-zinc-800 placeholder:text-zinc-400 outline-none focus:border-zinc-400 focus:bg-white focus:ring-2 focus:ring-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600 dark:focus:ring-zinc-800 transition-all"
                />
              </div>
              <Filters filters={filters} fields={LEADS_FILTER_FIELDS} onChange={setFilters} />
              {(filters.length > 0 || searchQuery.trim()) && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-500 shadow-xs transition hover:bg-zinc-50 hover:text-rose-500 hover:border-rose-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Clear all
                </button>
              )}

              <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="group relative overflow-hidden h-9 rounded-xl border border-blue-800/40 bg-gradient-to-b from-blue-400 via-blue-600 to-blue-700 px-4 text-xs font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_1px_rgba(0,0,0,0.15),0_4px_10px_-2px_rgba(37,99,235,0.55)] transition-all duration-150 hover:from-blue-400 hover:via-blue-500 hover:to-blue-600 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.55),inset_0_-1px_1px_rgba(0,0,0,0.15),0_6px_14px_-2px_rgba(37,99,235,0.65)] active:translate-y-px active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)] flex items-center gap-1.5 cursor-pointer"
                  >
                    {/* glossy top-half highlight */}
                    <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-xl bg-gradient-to-b from-white/40 to-white/0" />
                    {/* soft diagonal sheen sweep on hover */}
                    <span className="pointer-events-none absolute -inset-y-2 -left-1/2 w-1/3 -skew-x-12 bg-white/25 opacity-0 transition-all duration-500 group-hover:left-[120%] group-hover:opacity-100" />
                    <Plus className="relative z-10 size-4" weight="bold" />
                    <span className="relative z-10">Add Lead</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl border border-zinc-200/80 dark:border-zinc-800 p-0 overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-zinc-950">
                  <div className="p-6 sm:p-8 max-h-[82vh] overflow-y-auto sleek-scroll">
                    
                    {/* Top Banner / Header properly using DialogHeader, DialogTitle, and DialogDescription */}
                    <div className="mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                      <DialogHeader className="text-left space-y-0.5">
                        <DialogTitle className="text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                          Create New Lead
                        </DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                          Configure inquiry category, assignee rules, and automated workflow.
                        </DialogDescription>
                      </DialogHeader>

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Ready to publish
                      </span>
                    </div>

                    <form onSubmit={handleAddLeadSubmit} className="space-y-6">
                      
                      {/* Row 1: Lead Category */}
                      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-start">
                        <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 pt-2 flex items-center gap-1">
                          Lead Category
                          <Question className="size-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer" />
                        </label>
                        <div className="flex-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-sm text-zinc-800 shadow-xs focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 flex items-center justify-between transition-all outline-none"
                              >
                                <span className="font-medium">{formData.travelType} Package</span>
                                <CaretDown className="size-4 text-zinc-400" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-64 rounded-xl border-zinc-200 p-1.5 shadow-xl dark:border-zinc-800 bg-white dark:bg-zinc-950 max-h-60 overflow-y-auto sleek-scroll z-[60]">
                              {["Honeymoon", "Family", "Adventure", "Corporate", "Romantic", "Wedding", "Safari", "Skiing", "Luxury", "Solo"].map((t) => (
                                <DropdownMenuItem
                                  key={t}
                                  onClick={() => handleFormChange("travelType", t)}
                                  className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                >
                                  <span>{t} Package</span>
                                  {formData.travelType === t && <CheckCircle className="size-3.5 text-[#34C759]" weight="fill" />}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Row 2: Lead Name & Title */}
                      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-start">
                        <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 pt-2">
                          Lead Title / Name
                        </label>
                        <div className="flex-1 space-y-2">
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                            <input
                              required
                              type="text"
                              placeholder="E.g. Sarah Jenkins - Maldives trip"
                              value={formData.name}
                              onChange={(e) => handleFormChange("name", e.target.value)}
                              className="h-10 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-3.5 text-sm text-zinc-800 placeholder:text-zinc-400 shadow-xs outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:placeholder:text-zinc-500 transition-all"
                            />
                          </div>
                          
                          {showCompanyField ? (
                            <div className="relative animate-in fade-in duration-200">
                              <Buildings className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                              <input
                                type="text"
                                placeholder="Company / Organization name..."
                                value={formData.company}
                                onChange={(e) => handleFormChange("company", e.target.value)}
                                className="h-10 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-3.5 text-sm text-zinc-800 placeholder:text-zinc-400 shadow-xs outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 transition-all"
                              />
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setShowCompanyField(true)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-xs hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                            >
                              <Plus className="size-3.5" weight="bold" />
                              Add company details
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Row 3: Assignee Selecting (Multi-Select) */}
                      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-start">
                        <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 pt-2 flex items-center gap-1">
                          Assignee Selecting
                          <Question className="size-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer" />
                        </label>
                        <div className="flex-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-sm text-zinc-800 shadow-xs focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 flex items-center justify-between transition-all outline-none"
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <User className="size-4 text-zinc-400" />
                                  <span className="font-medium truncate">
                                    {(formData.assignedList || []).length === 1
                                      ? (formData.assignedList || [])[0]
                                      : `${(formData.assignedList || []).length} Assignees (${(formData.assignedList || []).join(", ")})`}
                                  </span>
                                </div>
                                <CaretDown className="size-4 text-zinc-400" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-64 rounded-xl border-zinc-200 p-1.5 shadow-xl dark:border-zinc-800 bg-white dark:bg-zinc-950 z-[60]">
                              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Select Multiple Assignees</div>
                              {["Ari Parker", "Sam Rivera", "Maya Chen", "Jordan Lee", "Sam Nguyen"].map((agent) => {
                                const isSelected = (formData.assignedList || []).includes(agent)
                                return (
                                  <DropdownMenuItem
                                    key={agent}
                                    onSelect={(e) => e.preventDefault()}
                                    onClick={() => toggleAssignee(agent)}
                                    className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                  >
                                    <div className="flex items-center gap-2.5">
                                      <span
                                        className={cn(
                                          "flex size-4 shrink-0 items-center justify-center rounded-[5px] border transition-all",
                                          isSelected
                                            ? "border-[#34C759] bg-[#34C759] text-white shadow-xs"
                                            : "border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900"
                                        )}
                                      >
                                        {isSelected && (
                                          <svg className="size-3 stroke-white" fill="none" viewBox="0 0 24 24" strokeWidth="3.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                          </svg>
                                        )}
                                      </span>
                                      <Avatar className="size-5">
                                        <AvatarImage src={`https://i.pravatar.cc/64?u=${agent}`} />
                                        <AvatarFallback className="text-[8px]">{agent[0]}</AvatarFallback>
                                      </Avatar>
                                      <span>{agent}</span>
                                    </div>
                                  </DropdownMenuItem>
                                )
                              })}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Row 4: Source Channel Dropdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-start">
                        <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 pt-2 flex items-center gap-1">
                          Source Channel
                          <Question className="size-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer" />
                        </label>
                        <div className="flex-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-sm text-zinc-800 shadow-xs focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 flex items-center justify-between transition-all outline-none"
                              >
                                <div className="flex items-center gap-2 truncate">
                                  {(() => {
                                    const SrcIcon = SOURCE_CONFIG[formData.source].icon
                                    return <SrcIcon className={cn("size-4", SOURCE_CONFIG[formData.source].color)} weight="fill" />
                                  })()}
                                  <span className="font-medium">{formData.source}</span>
                                </div>
                                <CaretDown className="size-4 text-zinc-400" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56 rounded-xl border-zinc-200 p-1.5 shadow-xl dark:border-zinc-800 bg-white dark:bg-zinc-950 z-[60]">
                              {(["WhatsApp", "Instagram", "Meta", "Website"] as SourceType[]).map((src) => {
                                const SrcIcon = SOURCE_CONFIG[src].icon
                                return (
                                  <DropdownMenuItem
                                    key={src}
                                    onClick={() => handleFormChange("source", src)}
                                    className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                  >
                                    <div className="flex items-center gap-2.5">
                                      <SrcIcon className={cn("size-4", SOURCE_CONFIG[src].color)} weight="fill" />
                                      <span>{src}</span>
                                    </div>
                                    {formData.source === src && <CheckCircle className="size-3.5 text-[#34C759]" weight="fill" />}
                                  </DropdownMenuItem>
                                )
                              })}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Row 4: Customer Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-start">
                        <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 pt-0.5">
                          Customer Details
                        </label>
                        <div className="flex-1 space-y-2.5">
                          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-zinc-700 dark:text-zinc-300 select-none">
                            <span
                              onClick={() => handleFormChange("collectName", !formData.collectName)}
                              className={cn(
                                "flex size-4 shrink-0 items-center justify-center rounded-[5px] border transition-all",
                                formData.collectName
                                  ? "border-[#34C759] bg-[#34C759] text-white shadow-xs"
                                  : "border-zinc-300 bg-white hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
                              )}
                            >
                              {formData.collectName && (
                                <svg className="size-3 stroke-white" fill="none" viewBox="0 0 24 24" strokeWidth="3.5" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              )}
                            </span>
                            Collect customer name
                          </label>
                          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-zinc-700 dark:text-zinc-300 select-none">
                            <span
                              onClick={() => handleFormChange("collectEmail", !formData.collectEmail)}
                              className={cn(
                                "flex size-4 shrink-0 items-center justify-center rounded-[5px] border transition-all",
                                formData.collectEmail
                                  ? "border-[#34C759] bg-[#34C759] text-white shadow-xs"
                                  : "border-zinc-300 bg-white hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
                              )}
                            >
                              {formData.collectEmail && (
                                <svg className="size-3 stroke-white" fill="none" viewBox="0 0 24 24" strokeWidth="3.5" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              )}
                            </span>
                            Ask for company name
                          </label>
                          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-zinc-700 dark:text-zinc-300 select-none">
                            <span
                              onClick={() => handleFormChange("collectPhone", !formData.collectPhone)}
                              className={cn(
                                "flex size-4 shrink-0 items-center justify-center rounded-[5px] border transition-all",
                                formData.collectPhone
                                  ? "border-[#34C759] bg-[#34C759] text-white shadow-xs"
                                  : "border-zinc-300 bg-white hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
                              )}
                            >
                              {formData.collectPhone && (
                                <svg className="size-3 stroke-white" fill="none" viewBox="0 0 24 24" strokeWidth="3.5" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              )}
                            </span>
                            Collect delivery address
                          </label>
                        </div>
                      </div>

                      {/* Row 5: Automation Rules */}
                      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-start">
                        <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 pt-0.5">
                          Automation Rules
                        </label>
                        <div className="flex-1 space-y-2.5">
                          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-zinc-700 dark:text-zinc-300 select-none">
                            <button
                              type="button"
                              role="switch"
                              aria-checked={formData.runScoring}
                              onClick={() => handleFormChange("runScoring", !formData.runScoring)}
                              className={cn(
                                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                                formData.runScoring ? "bg-[#34C759]" : "bg-zinc-200 dark:bg-zinc-800"
                              )}
                            >
                              <span
                                className={cn(
                                  "pointer-events-none inline-block size-4 rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
                                  formData.runScoring ? "translate-x-4" : "translate-x-0"
                                )}
                              />
                            </button>
                            <span className="flex items-center gap-1.5">
                              Run AI lead scoring
                              <Question className="size-3 text-zinc-400" />
                              <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">Live</span>
                            </span>
                          </label>
                          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-zinc-700 dark:text-zinc-300 select-none">
                            <button
                              type="button"
                              role="switch"
                              aria-checked={formData.autoAssign}
                              onClick={() => handleFormChange("autoAssign", !formData.autoAssign)}
                              className={cn(
                                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                                formData.autoAssign ? "bg-[#34C759]" : "bg-zinc-200 dark:bg-zinc-800"
                              )}
                            >
                              <span
                                className={cn(
                                  "pointer-events-none inline-block size-4 rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
                                  formData.autoAssign ? "translate-x-4" : "translate-x-0"
                                )}
                              />
                            </button>
                            Auto-assign to available agent
                          </label>
                          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-zinc-700 dark:text-zinc-300 select-none">
                            <button
                              type="button"
                              role="switch"
                              aria-checked={false}
                              className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-zinc-200 dark:bg-zinc-800"
                            >
                              <span className="pointer-events-none inline-block size-4 rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out translate-x-0" />
                            </button>
                            Send instant WhatsApp greeting
                          </label>
                        </div>
                      </div>

                      {/* Row 6: Priority Level */}
                      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-start">
                        <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 pt-2">
                          Priority Level
                        </label>
                        <div className="flex-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-sm text-zinc-800 shadow-xs focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 flex items-center justify-between transition-all outline-none"
                              >
                                <span className="font-medium">{formData.status} Priority</span>
                                <CaretDown className="size-4 text-zinc-400" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56 rounded-xl border-zinc-200 p-1.5 shadow-xl dark:border-zinc-800 bg-white dark:bg-zinc-950 z-[60]">
                              {(["Hot", "Warm", "Cold", "Lost"] as StatusType[]).map((st) => (
                                <DropdownMenuItem
                                  key={st}
                                  onClick={() => handleFormChange("status", st)}
                                  className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                >
                                  <span>{st} Priority</span>
                                  {formData.status === st && <CheckCircle className="size-3.5 text-[#34C759]" weight="fill" />}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Row 7: CRM Stage */}
                      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-start">
                        <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 pt-2">
                          CRM Stage
                        </label>
                        <div className="flex-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-sm text-zinc-800 shadow-xs focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 flex items-center justify-between transition-all outline-none"
                              >
                                <span className="font-medium">{formData.stage} Stage</span>
                                <CaretDown className="size-4 text-zinc-400" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56 rounded-xl border-zinc-200 p-1.5 shadow-xl dark:border-zinc-800 bg-white dark:bg-zinc-950 z-[60]">
                              {STAGES.map((stg) => (
                                <DropdownMenuItem
                                  key={stg}
                                  onClick={() => handleFormChange("stage", stg)}
                                  className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                >
                                  <span>{stg} Stage</span>
                                  {formData.stage === stg && <CheckCircle className="size-3.5 text-[#34C759]" weight="fill" />}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Row 8: Target Destination */}
                      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-start">
                        <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 pt-2 flex items-center gap-1">
                          Target Destination
                          <Question className="size-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer" />
                        </label>
                        <div className="flex-1 relative">
                          <MapPin className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                          <input
                            required
                            type="text"
                            placeholder="E.g. Maldives overwater villa"
                            value={formData.destination}
                            onChange={(e) => handleFormChange("destination", e.target.value)}
                            className="h-10 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-3.5 text-sm text-zinc-800 placeholder:text-zinc-400 shadow-xs outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:placeholder:text-zinc-500 transition-all"
                          />
                        </div>
                      </div>

                      {/* Row 9: Notification & Receipt */}
                      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-start">
                        <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 pt-0.5">
                          Notification Rules
                        </label>
                        <div className="flex-1 space-y-2.5">
                          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-zinc-700 dark:text-zinc-300 select-none">
                            <span
                              onClick={() => handleFormChange("sendReceipt", !formData.sendReceipt)}
                              className={cn(
                                "flex size-4 shrink-0 items-center justify-center rounded-[5px] border transition-all",
                                formData.sendReceipt
                                  ? "border-[#34C759] bg-[#34C759] text-white shadow-xs"
                                  : "border-zinc-300 bg-white hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
                              )}
                            >
                              {formData.sendReceipt && (
                                <svg className="size-3 stroke-white" fill="none" viewBox="0 0 24 24" strokeWidth="3.5" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              )}
                            </span>
                            Send branded itinerary receipt
                          </label>
                          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-zinc-700 dark:text-zinc-300 select-none">
                            <span
                              onClick={() => handleFormChange("allowFollowup", !formData.allowFollowup)}
                              className={cn(
                                "flex size-4 shrink-0 items-center justify-center rounded-[5px] border transition-all",
                                formData.allowFollowup
                                  ? "border-[#34C759] bg-[#34C759] text-white shadow-xs"
                                  : "border-zinc-300 bg-white hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
                              )}
                            >
                              {formData.allowFollowup && (
                                <svg className="size-3 stroke-white" fill="none" viewBox="0 0 24 24" strokeWidth="3.5" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              )}
                            </span>
                            Allow follow-up promotional offers
                          </label>
                          <label className="flex items-center gap-2.5 cursor-not-allowed text-xs font-medium text-zinc-400 dark:text-zinc-500 select-none">
                            <span className="flex size-4 shrink-0 items-center justify-center rounded-[5px] border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900" />
                            <span className="flex items-center gap-1">
                              Require terms acceptance
                              <Question className="size-3 text-zinc-400" />
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Footer matching screenshot */}
                      <div className="pt-6 mt-8 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                        <span className="text-xs text-zinc-400 dark:text-zinc-500">
                          Draft stays private.
                        </span>

                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => setIsAddLeadOpen(false)}
                            className="h-9 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-xs flex items-center gap-1.5 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                          >
                            <BookmarkSimple className="size-3.5" />
                            Save draft
                          </button>
                          
                          <button
                            type="submit"
                            className="h-9 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            Create Lead
                          </button>
                        </div>
                      </div>

                    </form>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Kanban board — horizontal scroll only here */}
        <div className="flex gap-4 overflow-x-auto sleek-scroll py-5 px-5 w-full max-w-full min-w-0">
          {STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((lead) => lead.stage === stage)
            const meta =
              stage === "New" ? { dot: "bg-blue-500", bg: "bg-blue-50/70 dark:bg-blue-950/20", border: "border-blue-200/60 dark:border-blue-900/40", badgeBg: "bg-blue-100 dark:bg-blue-900/40", badgeText: "text-blue-600 dark:text-blue-400" } :
                stage === "Contacted" ? { dot: "bg-amber-500", bg: "bg-amber-50/70 dark:bg-amber-950/20", border: "border-amber-200/60 dark:border-amber-900/40", badgeBg: "bg-amber-100 dark:bg-amber-900/40", badgeText: "text-amber-600 dark:text-amber-400" } :
                  stage === "Qualified" ? { dot: "bg-sky-500", bg: "bg-sky-50/70 dark:bg-sky-950/20", border: "border-sky-200/60 dark:border-sky-900/40", badgeBg: "bg-sky-100 dark:bg-sky-900/40", badgeText: "text-sky-600 dark:text-sky-400" } :
                    stage === "Proposal" ? { dot: "bg-purple-500", bg: "bg-purple-50/70 dark:bg-purple-950/20", border: "border-purple-200/60 dark:border-purple-900/40", badgeBg: "bg-purple-100 dark:bg-purple-900/40", badgeText: "text-purple-600 dark:text-purple-400" } :
                      stage === "Won" ? { dot: "bg-emerald-500", bg: "bg-emerald-50/70 dark:bg-emerald-950/20", border: "border-emerald-200/60 dark:border-emerald-900/40", badgeBg: "bg-emerald-100 dark:bg-emerald-900/40", badgeText: "text-emerald-600 dark:text-emerald-400" } :
                        stage === "RNR" ? { dot: "bg-pink-500", bg: "bg-pink-50/70 dark:bg-pink-950/20", border: "border-pink-200/60 dark:border-pink-900/40", badgeBg: "bg-pink-100 dark:bg-pink-900/40", badgeText: "text-pink-600 dark:text-pink-400" } :
                          { dot: "bg-zinc-400", bg: "bg-zinc-100/70 dark:bg-zinc-900/40", border: "border-zinc-200 dark:border-zinc-800", badgeBg: "bg-zinc-200 dark:bg-zinc-800", badgeText: "text-zinc-600 dark:text-zinc-400" };

            return (
              <section key={stage} className={cn("flex w-[280px] min-w-[280px] shrink-0 flex-col rounded-2xl p-3 border shadow-xs transition-colors", meta.bg, meta.border)}>
                <div className="mb-2.5 flex items-center justify-between px-1 py-0.5">
                  <div className="flex items-center gap-2">
                    <span className={cn("size-2 rounded-full", meta.dot)} />
                    <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{stage}</h3>
                  </div>
                  <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-bold shadow-xs", meta.badgeBg, meta.badgeText)}>
                    {stageLeads.length}
                  </span>
                </div>
                <div className="flex flex-col gap-2.5 overflow-y-auto sleek-scroll pr-1 max-h-[calc(100vh-14rem)]">
                  {stageLeads.map((lead) => {
                    const LeadIcon = SOURCE_CONFIG[lead.source].icon
                    const leadTasks = tasks[lead.id] || []
                    const doneCount = leadTasks.filter(t => t.done).length
                    // deterministic small "team" avatar cluster so cards feel populated, like the reference board
                    const teamSeeds = [lead.id, `${lead.id}-b`, `${lead.id}-c`].slice(0, lead.travelers > 4 ? 3 : 2)
                    return (
                      <button
                        key={lead.id}
                        onClick={() => {
                          setSelectedLeadId(lead.id)
                          setDrawerLeadId(lead.id)
                        }}
                        className={cn(
                          "rounded-2xl border bg-white p-3.5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-zinc-950",
                          selectedLeadId === lead.id ? "border-emerald-400 ring-2 ring-emerald-100 dark:ring-emerald-950" : "border-zinc-200/80 dark:border-zinc-800"
                        )}
                      >
                        {/* Tag pills */}
                        <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
                          <span className={cn("rounded-md px-1.5 py-0.5 text-[9px] font-bold", TRAVEL_TYPE_COLORS[lead.travelType] || "bg-zinc-100 text-zinc-600")}>{lead.travelType}</span>
                          <span className={cn("flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-bold", SOURCE_CONFIG[lead.source].bg, SOURCE_CONFIG[lead.source].color)}>
                            <LeadIcon className="size-2.5" weight="fill" />{lead.source}
                          </span>
                        </div>

                        <p className="truncate text-[13px] font-bold text-zinc-900 dark:text-white leading-snug">{lead.destination}</p>
                        <p className="mt-0.5 truncate text-[11px] text-zinc-400">{lead.name} &bull; {lead.travelers} traveler{lead.travelers > 1 ? "s" : ""}</p>

                        {/* Mini checklist preview */}
                        <div className="mt-2.5 space-y-1">
                          {leadTasks.slice(0, 2).map((t) => (
                            <div key={t.id} className="flex items-center gap-1.5">
                              {t.done ? (
                                <CheckSquare className="size-3 text-emerald-500 shrink-0" weight="fill" />
                              ) : (
                                <span className="size-3 rounded-[3px] border border-zinc-300 dark:border-zinc-700 shrink-0" />
                              )}
                              <span className={cn("truncate text-[10px]", t.done ? "text-zinc-400 line-through" : "text-zinc-500 dark:text-zinc-400")}>{t.title}</span>
                            </div>
                          ))}
                        </div>

                        {/* Footer: avatar cluster + counts + value */}
                        <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-2.5 dark:border-zinc-800">
                          <div className="flex items-center -space-x-2">
                            {teamSeeds.map((seed) => (
                              <Avatar key={seed} className="size-5 rounded-full border-2 border-white dark:border-zinc-950">
                                <AvatarImage src={`https://i.pravatar.cc/64?u=${seed}`} />
                                <AvatarFallback className="text-[7px] font-bold bg-zinc-100 text-zinc-500 dark:bg-zinc-800">{lead.name[0]}</AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          <div className="flex items-center gap-2.5 text-zinc-400">
                            <span className="flex items-center gap-1 text-[10px] font-semibold">
                              <ChatCircleDots className="size-3.5" />{(chats[lead.id] || []).length}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] font-semibold">
                              <CheckSquareOffset className="size-3.5" />{doneCount}/{leadTasks.length}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-600">{lead.value}</span>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                  <button
                    onClick={() => {
                      handleFormChange("stage", stage)
                      setIsAddLeadOpen(true)
                    }}
                    className="flex items-center justify-center gap-1 rounded-xl border border-dashed border-zinc-300 py-2 text-[10px] font-semibold text-zinc-400 hover:border-zinc-400 hover:text-zinc-700 dark:border-zinc-700 dark:hover:text-zinc-200 transition-colors"
                  >
                    <Plus className="size-3" weight="bold" /> Add lead
                  </button>
                </div>
              </section>
            )
          })}
        </div>{/* end kanban board */}

      </div>{/* end page wrapper */}

      <Sheet open={!!drawerLead} onOpenChange={(open) => !open && setDrawerLeadId(null)}>
        {drawerLead && (
          <LeadDetailsDrawer
            key={drawerLead.id}
            lead={drawerLead}
            messages={chats[drawerLead.id] || []}
            tasks={tasks[drawerLead.id] || []}
            onSendMessage={handleDrawerSendMessage}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onSaveNote={handleSaveNote}
            onClose={() => setDrawerLeadId(null)}
          />
        )}
      </Sheet>
    </>
  )
}
