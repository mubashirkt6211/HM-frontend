/* ================================================================
   CRM Flow Service & Central Store
   Manages Lead Sources (Meta, Instagram, WhatsApp, Web, LinkedIn),
   Pipeline Stages, Won Lead Conversions, and To Do Task Assignments.
   ================================================================ */

export type LeadSource = "Meta Ads" | "Instagram" | "WhatsApp" | "Web Form" | "LinkedIn";

export type CRMLead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: LeadSource;
  sourceColor: string;
  value: string;
  stage: "new" | "open" | "inprogress" | "opendeal" | "won";
  timeAgo: string;
  assignedTo: string;
  avatar?: string;
  initials?: string;
  initialsBg?: string;
  description: string;
};

export type CRMTask = {
  id: string;
  title: string;
  description: string;
  due: string;
  priority: "high" | "medium" | "low";
  milestoneDone: number;
  milestoneTotal: number;
  assignees: string[];
  attachments: number;
  comments: number;
  company?: string;
  contact?: string;
  owner?: string;
  avatar?: string;
  value?: string;
  source?: LeadSource;
  leadId?: string;
};

const STORAGE_KEY_PIPELINE = "leadwave_pipeline_leads";
const STORAGE_KEY_WON_LEADS = "leadwave_won_leads";
const STORAGE_KEY_TASKS = "leadwave_todo_tasks";

// Initial Demo Pipeline Leads with Sources
export const INITIAL_CRM_LEADS: CRMLead[] = [
  {
    id: "LEAD-101",
    name: "Esther Howard",
    email: "sanya.hill@example.com",
    phone: "(307) 555-0133",
    company: "Howard Logistics",
    source: "Meta Ads",
    sourceColor: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200",
    value: "$28,500",
    stage: "new",
    timeAgo: "4 min. ago",
    assignedTo: "Ari Parker",
    avatar: "https://i.pravatar.cc/96?img=1",
    description: "Inquired via Meta Facebook Ad for enterprise SaaS travel package.",
  },
  {
    id: "LEAD-102",
    name: "Cameron Williamson",
    email: "jackson.graham@example.com",
    phone: "(480) 555-0103",
    company: "Graham Travel",
    source: "Instagram",
    sourceColor: "bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300 border-pink-200",
    value: "$14,200",
    stage: "new",
    timeAgo: "4 min. ago",
    assignedTo: "Sam Rivera",
    avatar: "https://i.pravatar.cc/96?img=11",
    description: "DM inquiry from Instagram Luxury Resort Campaign.",
  },
  {
    id: "LEAD-103",
    name: "Darrell Steward",
    email: "georgia.young@example.com",
    phone: "(270) 555-0117",
    company: "Steward Ventures",
    source: "WhatsApp",
    sourceColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200",
    value: "$9,800",
    stage: "new",
    timeAgo: "4 min. ago",
    assignedTo: "Jordan Lee",
    initials: "LP",
    initialsBg: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
    description: "Direct WhatsApp chat message asking for villa availability.",
  },
  {
    id: "LEAD-104",
    name: "Marvin McKinney",
    email: "alma.lawson@example.com",
    phone: "(219) 555-0114",
    company: "McKinney Group",
    source: "Web Form",
    sourceColor: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200",
    value: "$22,400",
    stage: "open",
    timeAgo: "4 min. ago",
    assignedTo: "Maya Chen",
    avatar: "https://i.pravatar.cc/96?img=32",
    description: "Submitted web contact form on pricing page.",
  },
  {
    id: "LEAD-105",
    name: "Arlene McCoy",
    email: "sara.cruz@example.com",
    phone: "(319) 555-0115",
    company: "McCoy Enterprises",
    source: "LinkedIn",
    sourceColor: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border-sky-200",
    value: "$27,900",
    stage: "inprogress",
    timeAgo: "4 min. ago",
    assignedTo: "Ari Parker",
    avatar: "https://i.pravatar.cc/96?img=44",
    description: "Inbound message from LinkedIn B2B travel campaign.",
  },
  {
    id: "LEAD-106",
    name: "Kristin Watson",
    email: "kenzi.lawson@example.com",
    phone: "(607) 555-0101",
    company: "Watson Travel",
    source: "Meta Ads",
    sourceColor: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200",
    value: "$34,500",
    stage: "opendeal",
    timeAgo: "4 min. ago",
    assignedTo: "Sam Rivera",
    avatar: "https://i.pravatar.cc/96?img=36",
    description: "Contract sent to client for electronic signature.",
  },
];

// Helper to notify all active windows/components
export function triggerCRMFlowSync() {
  window.dispatchEvent(new Event("crm-flow-updated"));
}

// Get All Leads
export function getStoredPipelineLeads(): CRMLead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PIPELINE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read pipeline leads", e);
  }
  return INITIAL_CRM_LEADS;
}

// Save Leads
export function savePipelineLeads(leads: CRMLead[]) {
  try {
    localStorage.setItem(STORAGE_KEY_PIPELINE, JSON.stringify(leads));
    triggerCRMFlowSync();
  } catch (e) {
    console.error("Failed to save pipeline leads", e);
  }
}

// Convert Lead to Won (Moves to Leads Page & Creates Assigned To-Do Task)
export function markLeadAsWon(leadId: string): { lead: CRMLead; createdTask: CRMTask } | null {
  const currentLeads = getStoredPipelineLeads();
  const targetLead = currentLeads.find((l) => l.id === leadId);
  if (!targetLead) return null;

  // 1. Update Lead Stage to Won
  targetLead.stage = "won";
  savePipelineLeads(currentLeads);

  // 2. Add to Won Leads List (Leads Page)
  try {
    const existingWonRaw = localStorage.getItem(STORAGE_KEY_WON_LEADS);
    const existingWon: CRMLead[] = existingWonRaw ? JSON.parse(existingWonRaw) : [];
    if (!existingWon.some((l) => l.id === leadId)) {
      existingWon.unshift(targetLead);
      localStorage.setItem(STORAGE_KEY_WON_LEADS, JSON.stringify(existingWon));
    }
  } catch (e) {
    console.error("Failed to update won leads", e);
  }

  // 3. Create Assigned Task on To-Do Page
  const createdTask: CRMTask = {
    id: `TASK-WON-${Math.floor(100 + Math.random() * 900)}`,
    title: `Onboard Won Lead: ${targetLead.name}`,
    description: `[Source: ${targetLead.source}] ${targetLead.description} Contact: ${targetLead.email} | ${targetLead.phone}`,
    due: "Tomorrow",
    priority: "high",
    milestoneDone: 1,
    milestoneTotal: 5,
    assignees: [targetLead.avatar || "https://i.pravatar.cc/96?img=47"],
    attachments: 2,
    comments: 1,
    company: targetLead.company,
    contact: targetLead.name,
    owner: targetLead.assignedTo || "Ari Parker",
    avatar: targetLead.avatar,
    value: targetLead.value,
    source: targetLead.source,
    leadId: targetLead.id,
  };

  try {
    const existingTasksRaw = localStorage.getItem(STORAGE_KEY_TASKS);
    const existingTasks: Record<string, CRMTask[]> = existingTasksRaw ? JSON.parse(existingTasksRaw) : {};
    if (!existingTasks.on_process) existingTasks.on_process = [];
    if (!existingTasks.on_process.some((t) => t.leadId === leadId)) {
      existingTasks.on_process.unshift(createdTask);
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(existingTasks));
    }
  } catch (e) {
    console.error("Failed to add task to todo page", e);
  }

  triggerCRMFlowSync();
  return { lead: targetLead, createdTask };
}
