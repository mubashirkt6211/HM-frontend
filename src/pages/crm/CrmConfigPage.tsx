import React, { useState } from "react";
import {
  Gear,
  Key,
  Copy,
  Eye,
  EyeSlash,
  ArrowsClockwise,
  Trash,
  Plus,
  Check,
  CheckCircle,
  X,
  Globe,
  EnvelopeSimple,
  ChatCircleDots,
  DeviceMobile,
  Sliders,
  PaperPlaneTilt,
  ShieldCheck,
  Clock,
  Calendar,
  Info,
  LockKey,
  Lightning,
  Sparkle,
  CaretDown,
  Terminal,
  Code,
  WarningCircle,
  Warning
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/reui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ConfigKeyItem {
  id: string;
  name: string;
  category: string;
  environment: string;
  stack: string;
  status: "Active" | "Rotating" | "Restricted";
  keyValue: string;
  fullSecret: string;
  createdDate: string;
  createdBy: string;
  expiresIn: string;
  expirationDate: string;
  scopes: string[];
  allowedOrigins: string[];
  lastUsed: string;
  totalCalls: string;
  successRate: string;
  type: "meta" | "mail" | "whatsapp" | "webhook";
}

const INITIAL_KEYS: ConfigKeyItem[] = [
  {
    id: "k1",
    name: "Meta Ads & Lead Sync",
    category: "Meta Platform",
    environment: "Production",
    stack: "Webhook Listener",
    status: "Active",
    keyValue: "pk_demo_u17xM9...Qd2a",
    fullSecret: "pk_demo_u17xM9a8b7c6d5e4f3g2h1i0Qd2a",
    createdDate: "Jan 15, 2026",
    createdBy: "Sarah Connor (Admin)",
    expiresIn: "142 days remaining",
    expirationDate: "Dec 31, 2026",
    scopes: ["read:leads", "write:messages", "public:search"],
    allowedOrigins: ["https://app.leadwave.com", "https://*.facebook.com"],
    lastUsed: "Last used 4m ago",
    totalCalls: "128,450 API calls",
    successRate: "99.9% Uptime",
    type: "meta",
  },
  {
    id: "k2",
    name: "SendGrid Mail Gateway",
    category: "Core API",
    environment: "Production",
    stack: "SMTP Gateway",
    status: "Active",
    keyValue: "sk_demo_9182739182379182371",
    fullSecret: "sk_demo_9182739182379182371a2b3c4d5",
    createdDate: "Feb 01, 2026",
    createdBy: "System Automation",
    expiresIn: "65 days remaining",
    expirationDate: "Oct 15, 2026",
    scopes: ["admin:full", "write:leads", "trigger:workflows", "export:reports"],
    allowedOrigins: ["192.168.1.1/24", "Internal Mail Gateway"],
    lastUsed: "Last used 11m ago",
    totalCalls: "450,210 API calls",
    successRate: "99.8% Uptime",
    type: "mail",
  },
  {
    id: "k3",
    name: "WhatsApp Cloud API",
    category: "Data Jobs",
    environment: "Production",
    stack: "WhatsApp Messaging",
    status: "Rotating",
    keyValue: "sk_demo_worker_82371928371928",
    fullSecret: "sk_demo_worker_82371928371928x9y8z7w6",
    createdDate: "Mar 10, 2026",
    createdBy: "DevOps Bot",
    expiresIn: "Scheduled rotation in 3 days",
    expirationDate: "Aug 11, 2026",
    scopes: ["sync:whatsapp", "write:chat", "read:contacts"],
    allowedOrigins: ["worker.leadwave.internal"],
    lastUsed: "Last used 22m ago",
    totalCalls: "89,120 API calls",
    successRate: "100% Uptime",
    type: "whatsapp",
  },
  {
    id: "k4",
    name: "Zapier & Webhook Verifier",
    category: "Integrations",
    environment: "Production",
    stack: "Inbound Automation",
    status: "Restricted",
    keyValue: "rk_demo_wh_secret_918237192",
    fullSecret: "rk_demo_wh_secret_918237192m1n2o3p4",
    createdDate: "May 20, 2026",
    createdBy: "Security Officer",
    expiresIn: "210 days remaining",
    expirationDate: "Mar 05, 2027",
    scopes: ["verify:webhooks", "read:events"],
    allowedOrigins: ["*.zapier.com", "*.make.com", "*.facebook.com"],
    lastUsed: "Last used 2h ago",
    totalCalls: "14,890 API calls",
    successRate: "99.7% Uptime",
    type: "webhook",
  },
];

const STACK_CODE_SNIPPETS: Record<string, { lines: string[]; rawText: string; description: string }> = {
  "Meta Facebook Ads Sync": {
    description: "Copy Webhook URL & Verify Secret into Meta Business Manager to capture Facebook/Instagram Lead Forms.",
    lines: [
      "WEBHOOK_URL=https://api.leadwave.com/v1/leads/webhook/meta-ads",
      "VERIFY_TOKEN=leadwave_meta_verify_secret_2026",
      "META_APP_ID=9182739182371",
    ],
    rawText: `WEBHOOK_URL=https://api.leadwave.com/v1/leads/webhook/meta-ads\nVERIFY_TOKEN=leadwave_meta_verify_secret_2026\nMETA_APP_ID=9182739182371`,
  },
  "WhatsApp Business API": {
    description: "Paste Callback URL and Token into Meta WhatsApp Cloud API developer portal.",
    lines: [
      "WHATSAPP_CALLBACK_URL=https://api.leadwave.com/v1/whatsapp/webhook",
      "WHATSAPP_VERIFY_TOKEN=leadwave_secret_webhook_verify",
      "WABA_ACCOUNT_ID=109283719283",
    ],
    rawText: `WHATSAPP_CALLBACK_URL=https://api.leadwave.com/v1/whatsapp/webhook\nWHATSAPP_VERIFY_TOKEN=leadwave_secret_webhook_verify\nWABA_ACCOUNT_ID=109283719283`,
  },
  "Zapier & Make.com Automation": {
    description: "Connect Google Sheets, Typeform, and Calendly to CRM using Zapier Webhook trigger.",
    lines: [
      "ZAPIER_INBOUND_HOOK=https://api.leadwave.com/v1/zapier/incoming-leads",
      "API_SECRET_KEY=sk_demo_9182739182379182371",
      "DEFAULT_LEAD_SOURCE=Zapier Integration",
    ],
    rawText: `ZAPIER_INBOUND_HOOK=https://api.leadwave.com/v1/zapier/incoming-leads\nAPI_SECRET_KEY=sk_demo_9182739182379182371\nDEFAULT_LEAD_SOURCE=Zapier Integration`,
  },
  "Website Lead Form & Pixel": {
    description: "Copy tracking pixel and embed form API key for your company website.",
    lines: [
      "LEAD_FORM_ENDPOINT=https://api.leadwave.com/v1/forms/submit",
      "FORM_PUBLIC_KEY=pk_demo_u17xM9a8b7c6d5e4f3g2h1i0Qd2a",
      "TRACKING_PIXEL_ID=px_102938102938",
    ],
    rawText: `LEAD_FORM_ENDPOINT=https://api.leadwave.com/v1/forms/submit\nFORM_PUBLIC_KEY=pk_demo_u17xM9a8b7c6d5e4f3g2h1i0Qd2a\nTRACKING_PIXEL_ID=px_102938102938`,
  },
};

interface PostmanResponseModal {
  isOpen: boolean;
  actionTitle: string;
  statusCode: number;
  statusText: string;
  time: string;
  size: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  jsonPayload: any;
}

export function CrmConfigPage() {
  const [activeTab, setActiveTab] = useState<"keys" | "meta" | "email" | "whatsapp" | "sms" | "scoring">("keys");
  const [keysList, setKeysList] = useState<ConfigKeyItem[]>(INITIAL_KEYS);
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});
  const [stackSelect, setStackSelect] = useState("Meta Facebook Ads Sync");

  // Selected Key Detail Modal State
  const [selectedKeyDetails, setSelectedKeyDetails] = useState<ConfigKeyItem | null>(null);

  // Postman Confirmation Modal State
  const [deleteConfirmKey, setDeleteConfirmKey] = useState<ConfigKeyItem | null>(null);

  // Postman Response Dialog State
  const [postmanModal, setPostmanModal] = useState<PostmanResponseModal>({
    isOpen: false,
    actionTitle: "Response",
    statusCode: 200,
    statusText: "OK",
    time: "14 ms",
    size: "340 B",
    endpoint: "/v1/api/keys",
    method: "POST",
    jsonPayload: null,
  });

  // Email Config State
  const [emailConfig, setEmailConfig] = useState({
    smtpHost: "smtp.sendgrid.net",
    smtpPort: "587",
    security: "TLS",
    username: "apikey",
    senderName: "Leadwave CRM Concierge",
    senderEmail: "concierge@leadwave.com",
    apiKey: "SG.x98127391823791823.91283719823",
  });

  // Meta Ads State
  const [metaConfig, setMetaConfig] = useState({
    appId: "9182739182371",
    appSecret: "sec_meta_912837192837192",
    webhookVerifyToken: "leadwave_verify_secret_2026",
    pixelId: "px_102938102938",
  });

  // WhatsApp Config State
  const [whatsappConfig, setWhatsappConfig] = useState({
    wabaId: "109283719283",
    phoneNumberId: "10592837192",
    accessToken: "EAAG91827391823791823791823",
    verifyToken: "leadwave_secret_webhook_verify",
    status: "Connected (Verified)",
  });

  // SMS Config State
  const [smsConfig, setSmsConfig] = useState({
    provider: "Twilio",
    accountSid: "AC192837192837192837",
    authToken: "912837192837192837",
    senderNumber: "+1 (888) 928-1122",
  });

  // Scoring Rules State
  const [scoringRules, setScoringRules] = useState([
    { event: "Email Link Clicked", points: 5, enabled: true },
    { event: "Inbound WhatsApp Message", points: 10, enabled: true },
    { event: "Web Form Lead Submitted", points: 15, enabled: true },
    { event: "Itinerary Proposal Viewed", points: 20, enabled: true },
    { event: "Booking Deal Created", points: 50, enabled: true },
  ]);

  // Create Key Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyCategory, setNewKeyCategory] = useState("Frontend Platform");
  const [newKeyStatus, setNewKeyStatus] = useState<"Active" | "Rotating" | "Restricted">("Active");

  // Postman Response Opener Helper
  const triggerPostmanResponse = (
    title: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    endpoint: string,
    statusCode: number,
    statusText: string,
    payload: any
  ) => {
    setPostmanModal({
      isOpen: true,
      actionTitle: title,
      statusCode,
      statusText,
      time: `${Math.floor(Math.random() * 15) + 12} ms`,
      size: `${(JSON.stringify(payload).length / 1024).toFixed(2)} KB`,
      endpoint,
      method,
      jsonPayload: payload,
    });
  };

  const handleCopyKey = (val: string, name: string) => {
    navigator.clipboard?.writeText(val);
    triggerPostmanResponse(
      `Copied Credentials: ${name}`,
      "POST",
      "https://api.leadwave.com/v1/credentials/copy",
      200,
      "OK",
      {
        status: "success",
        message: `${name} copied to system clipboard`,
        timestamp: new Date().toISOString(),
        copied_bytes: val.length,
        copied_value: val,
      }
    );
  };

  const toggleReveal = (id: string) => {
    setRevealedKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const secretVal = `pk_demo_${Math.random().toString(36).substring(2, 14)}`;
    const newKey: ConfigKeyItem = {
      id: `k${Date.now()}`,
      name: newKeyName.trim(),
      category: newKeyCategory,
      environment: "Production",
      stack: stackSelect,
      status: newKeyStatus,
      keyValue: secretVal.substring(0, 15) + "...",
      fullSecret: secretVal,
      createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      createdBy: "Leadwave Administrator",
      expiresIn: "365 days remaining",
      expirationDate: "Aug 08, 2027",
      scopes: ["read:leads", "write:messages", "trigger:workflows"],
      allowedOrigins: ["https://*.leadwave.com"],
      lastUsed: "Just created",
      totalCalls: "0 calls",
      successRate: "100% Uptime",
      type: "meta",
    };

    setKeysList([newKey, ...keysList]);
    setIsCreateModalOpen(false);
    setNewKeyName("");

    triggerPostmanResponse(
      `Created API Key: ${newKey.name}`,
      "POST",
      "https://api.leadwave.com/v1/keys/generate",
      201,
      "Created",
      {
        status: "created",
        key_id: newKey.id,
        name: newKey.name,
        category: newKey.category,
        status_flag: newKey.status,
        secret_token: newKey.fullSecret,
        expires_at: newKey.expirationDate,
        scopes_granted: newKey.scopes,
      }
    );
  };

  // Perform Delete after confirmation
  const confirmDeleteAction = () => {
    if (!deleteConfirmKey) return;
    const target = deleteConfirmKey;
    setKeysList((prev) => prev.filter((k) => k.id !== target.id));
    setDeleteConfirmKey(null);

    triggerPostmanResponse(
      `Revoked Key: ${target.name}`,
      "DELETE",
      `https://api.leadwave.com/v1/keys/${target.id}`,
      200,
      "OK",
      {
        status: "revoked",
        key_id: target.id,
        name: target.name,
        revoked_at: new Date().toISOString(),
        message: `API Key '${target.name}' permanently deactivated.`,
      }
    );
  };

  return (
    <div className="w-full min-h-screen dark:bg-zinc-950 p-6 lg:p-10 text-zinc-900 dark:text-zinc-100">

      <div className="max-w-5xl mx-auto space-y-8">

        {/* ── Page Header Banner ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                <Gear className="size-5" />
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">API Keys &amp; System Configuration</h1>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Manage API credentials, Meta Ads integration, SendGrid SMTP, WhatsApp Cloud API, and stack environment variables.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/50 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Gateway
            </span>

            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="group relative overflow-hidden h-9 rounded-xl border border-blue-800/40 bg-gradient-to-b from-blue-400 via-blue-600 to-blue-700 px-4 text-xs font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_1px_rgba(0,0,0,0.15),0_4px_10px_-2px_rgba(37,99,235,0.55)] transition-all duration-150 hover:from-blue-400 hover:via-blue-500 hover:to-blue-600 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="size-3.5" />
              Create Key
            </Button>
          </div>
        </div>

        {/* ── Navigation Tabs ── */}
        <div className="flex items-center gap-1.5 bg-zinc-100/80 dark:bg-zinc-900/80 p-1.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 overflow-x-auto sleek-scroll">

          <button
            onClick={() => setActiveTab("keys")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs transition-all cursor-pointer shrink-0 select-none",
              activeTab === "keys"
                ? "bg-white text-zinc-900 shadow-xs border border-zinc-200/80 dark:bg-zinc-800 dark:text-white dark:border-zinc-700 font-bold"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 font-semibold"
            )}
          >
            <Key className={cn("size-4", activeTab === "keys" ? "text-blue-600 dark:text-blue-400" : "text-zinc-400")} />
            API Keys ({keysList.length})
          </button>

          <button
            onClick={() => setActiveTab("meta")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs transition-all cursor-pointer shrink-0 select-none",
              activeTab === "meta"
                ? "bg-white text-zinc-900 shadow-xs border border-zinc-200/80 dark:bg-zinc-800 dark:text-white dark:border-zinc-700 font-bold"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 font-semibold"
            )}
          >
            <Globe className={cn("size-4", activeTab === "meta" ? "text-blue-500" : "text-zinc-400")} />
            Meta Ads &amp; Webhooks
          </button>

          <button
            onClick={() => setActiveTab("email")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs transition-all cursor-pointer shrink-0 select-none",
              activeTab === "email"
                ? "bg-white text-zinc-900 shadow-xs border border-zinc-200/80 dark:bg-zinc-800 dark:text-white dark:border-zinc-700 font-bold"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 font-semibold"
            )}
          >
            <EnvelopeSimple className={cn("size-4", activeTab === "email" ? "text-indigo-500" : "text-zinc-400")} />
            Mail Gateway (SMTP)
          </button>

          <button
            onClick={() => setActiveTab("whatsapp")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs transition-all cursor-pointer shrink-0 select-none",
              activeTab === "whatsapp"
                ? "bg-white text-zinc-900 shadow-xs border border-zinc-200/80 dark:bg-zinc-800 dark:text-white dark:border-zinc-700 font-bold"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 font-semibold"
            )}
          >
            <ChatCircleDots className={cn("size-4", activeTab === "whatsapp" ? "text-emerald-500" : "text-zinc-400")} />
            WhatsApp Cloud API
          </button>

          <button
            onClick={() => setActiveTab("sms")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs transition-all cursor-pointer shrink-0 select-none",
              activeTab === "sms"
                ? "bg-white text-zinc-900 shadow-xs border border-zinc-200/80 dark:bg-zinc-800 dark:text-white dark:border-zinc-700 font-bold"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 font-semibold"
            )}
          >
            <DeviceMobile className={cn("size-4", activeTab === "sms" ? "text-purple-500" : "text-zinc-400")} />
            SMS Gateway
          </button>

          <button
            onClick={() => setActiveTab("scoring")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs transition-all cursor-pointer shrink-0 select-none",
              activeTab === "scoring"
                ? "bg-white text-zinc-900 shadow-xs border border-zinc-200/80 dark:bg-zinc-800 dark:text-white dark:border-zinc-700 font-bold"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 font-semibold"
            )}
          >
            <Sliders className={cn("size-4", activeTab === "scoring" ? "text-amber-500" : "text-zinc-400")} />
            Lead Scoring Rules
          </button>

        </div>

        {/* ── TAB 1: REUI API KEYS & QUICK COPY ── */}
        {activeTab === "keys" && (
          <div className="space-y-8">

            {/* Quick Copy Box (ReUI Code Block) */}
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Quick Integration Copy</h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {STACK_CODE_SNIPPETS[stackSelect]?.description || "Select a CRM integration stack to copy webhook endpoint URLs and environment secrets."}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="h-8 px-3 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                      >
                        <span>{stackSelect}</span>
                        <CaretDown className="size-3.5 text-zinc-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-xl border border-zinc-200 p-1.5 shadow-xl dark:border-zinc-800 bg-white dark:bg-zinc-950 z-[100]">
                      {Object.keys(STACK_CODE_SNIPPETS).map((stack) => (
                        <DropdownMenuItem
                          key={stack}
                          onClick={() => setStackSelect(stack)}
                          className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          <span>{stack}</span>
                          {stackSelect === stack && <CheckCircle className="size-3.5 text-[#34C759]" weight="fill" />}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <button
                    onClick={() => handleCopyKey(
                      STACK_CODE_SNIPPETS[stackSelect]?.rawText || STACK_CODE_SNIPPETS["Meta Facebook Ads Sync"].rawText,
                      `${stackSelect} Integration Credentials`
                    )}
                    className="h-8 px-3 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-xs flex items-center gap-1.5 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <Copy className="size-3.5" />
                    Copy
                  </button>
                </div>
              </div>

              {/* Dynamic Code Box */}
              <div className="rounded-xl bg-zinc-950 p-4 font-mono text-xs text-emerald-400 leading-relaxed overflow-x-auto border border-zinc-800/80 shadow-inner">
                {(STACK_CODE_SNIPPETS[stackSelect] || STACK_CODE_SNIPPETS["Meta Facebook Ads Sync"]).lines.map((line, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-zinc-600 select-none shrink-0">{idx + 1}</span>
                    <span className="whitespace-pre">{line}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Keys List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Keys</h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Copy, reveal, rotate, or revoke workspace keys. Click any key for full audit details.</p>
                </div>

                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="h-8 px-3 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-xs flex items-center gap-1.5 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  Add Key
                </button>
              </div>

              <div className="space-y-3">
                {keysList.map((item) => {
                  const isRevealed = !!revealedKeys[item.id];
                  const maskedVal = isRevealed
                    ? item.keyValue
                    : `${item.keyValue.substring(0, 7)}................`;

                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
                    >
                      <div
                        onClick={() => setSelectedKeyDetails(item)}
                        className="space-y-1 cursor-pointer flex-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-900 dark:text-white hover:underline">{item.name}</span>
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-bold border",
                              item.status === "Active" && "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
                              item.status === "Rotating" && "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
                              item.status === "Restricted" && "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800"
                            )}
                          >
                            {item.status}
                          </span>
                        </div>

                        <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                          {item.category} • {item.environment} • {item.stack}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <div className="flex items-center gap-2">
                          <span className="rounded-xl bg-zinc-100 dark:bg-zinc-800/80 px-3 py-1.5 font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200 border border-zinc-200/60 dark:border-zinc-700/60">
                            {maskedVal}
                          </span>

                          <div className="flex items-center gap-1 text-zinc-400">
                            <button
                              onClick={() => setSelectedKeyDetails(item)}
                              className="p-1.5 rounded-lg hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                              title="View full details"
                            >
                              <Info className="size-4 text-blue-500" />
                            </button>

                            <button
                              onClick={() => handleCopyKey(item.fullSecret || item.keyValue, item.name)}
                              className="p-1.5 rounded-lg hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                              title="Copy key"
                            >
                              <Copy className="size-4" />
                            </button>

                            <button
                              onClick={() => toggleReveal(item.id)}
                              className="p-1.5 rounded-lg hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                              title={isRevealed ? "Hide key" : "Reveal key"}
                            >
                              {isRevealed ? <EyeSlash className="size-4 text-emerald-600" /> : <Eye className="size-4" />}
                            </button>

                            <button
                              onClick={() => triggerPostmanResponse(
                                `Key Rotation: ${item.name}`,
                                "POST",
                                `https://api.leadwave.com/v1/keys/${item.id}/rotate`,
                                200,
                                "OK",
                                {
                                  status: "scheduled",
                                  key_id: item.id,
                                  name: item.name,
                                  new_token_scheduled: "Next 24h",
                                  message: "Rotation queued successfully."
                                }
                              )}
                              className="p-1.5 rounded-lg hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                              title="Rotate key"
                            >
                              <ArrowsClockwise className="size-4" />
                            </button>

                            <button
                              onClick={() => setDeleteConfirmKey(item)}
                              className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-400 hover:text-rose-600 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                              title="Revoke / Delete key"
                            >
                              <Trash className="size-4" />
                            </button>
                          </div>
                        </div>

                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                          {item.lastUsed}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ── TAB 2: META ADS & WEBHOOKS ── */}
        {activeTab === "meta" && (
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-6">
            <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">Meta / Facebook Ads Lead Sync</h2>
              <p className="text-xs text-zinc-500">Configure Webhook listener for auto-ingesting incoming leads from Facebook &amp; Instagram Lead Forms.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">Meta App ID</label>
                <input
                  type="text"
                  value={metaConfig.appId}
                  onChange={(e) => setMetaConfig({ ...metaConfig, appId: e.target.value })}
                  className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-xs text-zinc-800 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Meta App Secret</label>
                <input
                  type="password"
                  value={metaConfig.appSecret}
                  onChange={(e) => setMetaConfig({ ...metaConfig, appSecret: e.target.value })}
                  className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-xs text-zinc-800 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="font-semibold block mb-1">Inbound Webhook Endpoint URL</label>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  type="text"
                  value="https://api.leadwave.com/v1/leads/webhook/meta-ads"
                  className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-100 px-3.5 text-xs font-mono text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
                />
                <button
                  onClick={() => handleCopyKey("https://api.leadwave.com/v1/leads/webhook/meta-ads", "Meta Webhook URL")}
                  className="h-10 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold shrink-0 cursor-pointer dark:bg-zinc-100 dark:text-zinc-950"
                >
                  Copy URL
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
              <button
                onClick={() => triggerPostmanResponse(
                  "Saved Meta Ads Configuration",
                  "PUT",
                  "https://api.leadwave.com/v1/config/meta-ads",
                  200,
                  "OK",
                  {
                    status: "saved",
                    meta_app_id: metaConfig.appId,
                    webhook_listener: "active",
                    pixel_id: metaConfig.pixelId,
                    updated_at: new Date().toISOString(),
                  }
                )}
                className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                Save Meta Config
              </button>
            </div>
          </div>
        )}

        {/* ── TAB 3: EMAIL SMTP ── */}
        {activeTab === "email" && (
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-6">
            <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">Email Gateway Settings (SendGrid SMTP)</h2>
              <p className="text-xs text-zinc-500">Configure outbound email delivery for sending client proposals and notifications.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">SMTP Host Server</label>
                <input
                  type="text"
                  value={emailConfig.smtpHost}
                  onChange={(e) => setEmailConfig({ ...emailConfig, smtpHost: e.target.value })}
                  className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-xs text-zinc-800 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Port</label>
                <input
                  type="text"
                  value={emailConfig.smtpPort}
                  onChange={(e) => setEmailConfig({ ...emailConfig, smtpPort: e.target.value })}
                  className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-xs text-zinc-800 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">Sender Display Name</label>
                <input
                  type="text"
                  value={emailConfig.senderName}
                  onChange={(e) => setEmailConfig({ ...emailConfig, senderName: e.target.value })}
                  className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-xs text-zinc-800 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Sender Email Address</label>
                <input
                  type="email"
                  value={emailConfig.senderEmail}
                  onChange={(e) => setEmailConfig({ ...emailConfig, senderEmail: e.target.value })}
                  className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-xs text-zinc-800 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <button
                onClick={() => triggerPostmanResponse(
                  "Dispatched Test Email",
                  "POST",
                  "https://api.leadwave.com/v1/email/test",
                  200,
                  "OK",
                  {
                    status: "sent",
                    recipient: emailConfig.senderEmail,
                    smtp_host: emailConfig.smtpHost,
                    delivery_status: "250 OK 172938102938 mailer",
                    time_ms: 340,
                  }
                )}
                className="h-9 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-xs flex items-center gap-1.5 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 transition-colors"
              >
                <PaperPlaneTilt className="size-3.5" />
                Send Test Email
              </button>

              <button
                onClick={() => triggerPostmanResponse(
                  "Saved Email Gateway Config",
                  "PUT",
                  "https://api.leadwave.com/v1/config/email",
                  200,
                  "OK",
                  {
                    status: "saved",
                    smtp_host: emailConfig.smtpHost,
                    smtp_port: emailConfig.smtpPort,
                    sender_email: emailConfig.senderEmail,
                    updated_at: new Date().toISOString(),
                  }
                )}
                className="h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                Save Email Config
              </button>
            </div>
          </div>
        )}

        {/* ── TAB 4: WHATSAPP API ── */}
        {activeTab === "whatsapp" && (
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-6">
            <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-white">WhatsApp Business Cloud API</h2>
                <p className="text-xs text-zinc-500">Connect Meta WhatsApp Business API account for automated instant messaging.</p>
              </div>
              <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 px-3 py-1 text-[11px] font-bold">
                {whatsappConfig.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">WhatsApp Business Account ID (WABA)</label>
                <input
                  type="text"
                  value={whatsappConfig.wabaId}
                  onChange={(e) => setWhatsappConfig({ ...whatsappConfig, wabaId: e.target.value })}
                  className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-xs text-zinc-800 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Phone Number ID</label>
                <input
                  type="text"
                  value={whatsappConfig.phoneNumberId}
                  onChange={(e) => setWhatsappConfig({ ...whatsappConfig, phoneNumberId: e.target.value })}
                  className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-xs text-zinc-800 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
              <button
                onClick={() => triggerPostmanResponse(
                  "Saved WhatsApp API Config",
                  "PUT",
                  "https://api.leadwave.com/v1/config/whatsapp",
                  200,
                  "OK",
                  {
                    status: "connected",
                    waba_id: whatsappConfig.wabaId,
                    phone_number_id: whatsappConfig.phoneNumberId,
                    webhook_verified: true,
                  }
                )}
                className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                Save WhatsApp Config
              </button>
            </div>
          </div>
        )}

        {/* ── TAB 5: SMS GATEWAY ── */}
        {activeTab === "sms" && (
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-6">
            <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">Twilio Telephony &amp; SMS Gateway</h2>
              <p className="text-xs text-zinc-500">Configure SMS notification alerts and click-to-call gateway.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">Twilio Account SID</label>
                <input
                  type="text"
                  value={smsConfig.accountSid}
                  onChange={(e) => setSmsConfig({ ...smsConfig, accountSid: e.target.value })}
                  className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-xs text-zinc-800 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Sender Phone Number</label>
                <input
                  type="text"
                  value={smsConfig.senderNumber}
                  onChange={(e) => setSmsConfig({ ...smsConfig, senderNumber: e.target.value })}
                  className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-xs text-zinc-800 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
              <button
                onClick={() => triggerPostmanResponse(
                  "Saved SMS Gateway Credentials",
                  "PUT",
                  "https://api.leadwave.com/v1/config/sms",
                  200,
                  "OK",
                  {
                    status: "connected",
                    provider: smsConfig.provider,
                    account_sid: smsConfig.accountSid,
                    sender_number: smsConfig.senderNumber,
                  }
                )}
                className="h-9 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                Save SMS Config
              </button>
            </div>
          </div>
        )}

        {/* ── TAB 6: LEAD SCORING ── */}
        {activeTab === "scoring" && (
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-6">
            <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">Lead Scoring &amp; Qualification Rules</h2>
              <p className="text-xs text-zinc-500">Automatically qualify incoming leads based on customer engagement points.</p>
            </div>

            <div className="space-y-3">
              {scoringRules.map((rule, idx) => (
                <div
                  key={rule.event}
                  className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-950/50 text-xs"
                >
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{rule.event}</span>
                  <div className="flex items-center gap-3">
                    <span className="rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 px-2.5 py-1 font-bold">
                      +{rule.points} pts
                    </span>
                    <button
                      onClick={() => {
                        const next = [...scoringRules];
                        next[idx].enabled = !next[idx].enabled;
                        setScoringRules(next);
                      }}
                      className={cn(
                        "px-3 py-1 rounded-lg font-bold text-[11px] cursor-pointer transition-colors",
                        rule.enabled ? "bg-emerald-600 text-white" : "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      )}
                    >
                      {rule.enabled ? "Active" : "Disabled"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
              <button
                onClick={() => triggerPostmanResponse(
                  "Updated Lead Scoring Matrix",
                  "PUT",
                  "https://api.leadwave.com/v1/config/scoring-rules",
                  200,
                  "OK",
                  {
                    status: "updated",
                    total_rules: scoringRules.length,
                    active_rules: scoringRules.filter((r) => r.enabled).length,
                    updated_at: new Date().toISOString(),
                  }
                )}
                className="h-9 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                Save Scoring Rules
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ── POSTMAN STYLE CONFIRMATION DELETE DIALOG ── */}
      <Dialog open={!!deleteConfirmKey} onOpenChange={(open) => !open && setDeleteConfirmKey(null)}>
        {deleteConfirmKey && (
          <DialogContent className="sm:max-w-md border border-zinc-800 p-0 overflow-hidden rounded-2xl shadow-2xl bg-[#1E1E24] text-zinc-100">

            {/* Header */}
            <div className="bg-[#18181C] px-5 py-3.5 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-600 text-white">
                  DELETE
                </span>
                <span className="font-mono text-xs font-semibold text-zinc-300">
                  /v1/keys/{deleteConfirmKey.id}
                </span>
              </div>
              <span className="text-[11px] font-mono text-rose-400 bg-rose-950/60 border border-rose-900 px-2 py-0.5 rounded font-bold">
                Confirmation Required
              </span>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-rose-950/70 border border-rose-900 text-rose-400 shrink-0">
                  <Warning className="size-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">Revoke API Key?</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Are you sure you want to permanently revoke key <strong className="text-zinc-200">"{deleteConfirmKey.name}"</strong>? This will immediately block incoming requests.
                  </p>
                </div>
              </div>

              {/* JSON Payload Preview Box */}
              <div className="rounded-xl bg-[#141417] p-3.5 font-mono text-xs text-rose-300 leading-relaxed border border-zinc-800/80">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify({
                    action: "CONFIRM_KEY_REVOCATION",
                    target_key_id: deleteConfirmKey.id,
                    key_name: deleteConfirmKey.name,
                    impact: "Incoming webhooks using this token will fail with 401 Unauthorized",
                    status: "AWAITING_USER_APPROVAL"
                  }, null, 2)}
                </pre>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="px-6 py-4 bg-[#18181C] border-t border-zinc-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmKey(null)}
                className="h-9 px-4 rounded-xl border border-zinc-800 bg-[#23232A] text-xs font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAction}
                className="h-9 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-sm"
              >
                Yes, Revoke Key
              </button>
            </div>

          </DialogContent>
        )}
      </Dialog>

      {/* ── POSTMAN STYLE RESPONSE DIALOG ── */}
      <Dialog open={postmanModal.isOpen} onOpenChange={(open) => setPostmanModal((prev) => ({ ...prev, isOpen: open }))}>
        {postmanModal.jsonPayload && (
          <DialogContent className="sm:max-w-2xl border border-zinc-800 p-0 overflow-hidden rounded-2xl shadow-2xl bg-[#1E1E24] text-zinc-100">

            {/* Postman Top Header */}
            <div className="bg-[#18181C] px-5 py-3.5 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-600 text-white">
                  {postmanModal.method}
                </span>
                <span className="font-mono text-xs font-semibold text-zinc-300">
                  {postmanModal.endpoint}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold flex items-center gap-1">
                  <CheckCircle className="size-3 text-emerald-400" weight="fill" />
                  {postmanModal.statusCode} {postmanModal.statusText}
                </span>

                <span className="text-zinc-400">{postmanModal.time}</span>
                <span className="text-zinc-400">{postmanModal.size}</span>
              </div>
            </div>

            {/* Postman Action Bar */}
            <div className="px-5 py-3 bg-[#23232A] border-b border-zinc-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                  <Terminal className="size-4 text-emerald-400" />
                  {postmanModal.actionTitle}
                </span>
                <span className="text-[11px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded font-mono">JSON Response</span>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(JSON.stringify(postmanModal.jsonPayload, null, 2));
                  setPostmanModal((prev) => ({ ...prev, actionTitle: "Copied JSON to Clipboard!" }));
                }}
                className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy className="size-3.5 text-zinc-400" />
                Copy JSON
              </button>
            </div>

            {/* Postman Dark Terminal Body */}
            <div className="p-5 bg-[#141417] max-h-80 overflow-y-auto font-mono text-xs text-[#A6E22E] leading-relaxed border-b border-zinc-800 sleek-scroll">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(postmanModal.jsonPayload, null, 2)}
              </pre>
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#18181C] flex justify-end">
              <button
                onClick={() => setPostmanModal((prev) => ({ ...prev, isOpen: false }))}
                className="h-8 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors"
              >
                Done
              </button>
            </div>

          </DialogContent>
        )}
      </Dialog>

      {/* ── FULL KEY DETAILS MODAL ── */}
      <Dialog open={!!selectedKeyDetails} onOpenChange={(open) => !open && setSelectedKeyDetails(null)}>
        {selectedKeyDetails && (
          <DialogContent className="sm:max-w-xl border border-zinc-200/80 dark:border-zinc-800 p-0 overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-zinc-950">
            <div className="p-6 sm:p-7 space-y-6">

              {/* Header */}
              <div className="flex items-start justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <DialogTitle className="text-base font-extrabold text-zinc-900 dark:text-white">
                      {selectedKeyDetails.name}
                    </DialogTitle>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10px] font-bold border",
                        selectedKeyDetails.status === "Active" && "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
                        selectedKeyDetails.status === "Rotating" && "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
                        selectedKeyDetails.status === "Restricted" && "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800"
                      )}
                    >
                      {selectedKeyDetails.status}
                    </span>
                  </div>
                  <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                    {selectedKeyDetails.category} • {selectedKeyDetails.environment} • {selectedKeyDetails.stack}
                  </DialogDescription>
                </div>
              </div>

              {/* Token Display Box */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Key Token Secret
                </label>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    type="text"
                    value={selectedKeyDetails.fullSecret || selectedKeyDetails.keyValue}
                    className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 text-xs font-mono font-bold text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                  />
                  <button
                    onClick={() => handleCopyKey(selectedKeyDetails.fullSecret || selectedKeyDetails.keyValue, selectedKeyDetails.name)}
                    className="h-10 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shrink-0 cursor-pointer dark:bg-zinc-100 dark:text-zinc-950 flex items-center gap-1.5"
                  >
                    <Copy className="size-3.5" />
                    Copy
                  </button>
                </div>
              </div>

              {/* Expiration & Created Grid */}
              <div className="grid grid-cols-2 gap-4 rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 text-xs">
                <div>
                  <span className="text-zinc-400 dark:text-zinc-500 block mb-1 flex items-center gap-1">
                    <Clock className="size-3.5" /> Expiration Status
                  </span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">{selectedKeyDetails.expiresIn}</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Expires on {selectedKeyDetails.expirationDate}</p>
                </div>

                <div>
                  <span className="text-zinc-400 dark:text-zinc-500 block mb-1 flex items-center gap-1">
                    <Calendar className="size-3.5" /> Created Info
                  </span>
                  <p className="font-bold text-zinc-900 dark:text-white">{selectedKeyDetails.createdDate}</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">By {selectedKeyDetails.createdBy}</p>
                </div>
              </div>

              {/* Scopes & Permissions */}
              <div className="space-y-2 text-xs">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">Granted Scope Permissions</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedKeyDetails.scopes.map((scope) => (
                    <span
                      key={scope}
                      className="rounded-lg bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 px-2.5 py-1 text-[11px] font-mono font-bold"
                    >
                      {scope}
                    </span>
                  ))}
                </div>
              </div>

              {/* Allowed Origins */}
              <div className="space-y-2 text-xs">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">Domain &amp; IP Origin Restrictions</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedKeyDetails.allowedOrigins.map((origin) => (
                    <span
                      key={origin}
                      className="rounded-lg bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 px-2.5 py-1 text-[11px] font-mono"
                    >
                      {origin}
                    </span>
                  ))}
                </div>
              </div>

              {/* Usage & Health Stats */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-100 dark:border-zinc-800 text-zinc-500">
                <span>{selectedKeyDetails.totalCalls}</span>
                <span className="font-bold text-emerald-600">{selectedKeyDetails.successRate}</span>
                <span>{selectedKeyDetails.lastUsed}</span>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => setSelectedKeyDetails(null)}
                  className="h-9 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 cursor-pointer"
                >
                  Close
                </button>
              </div>

            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* ── CREATE KEY MODAL ── */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md border border-zinc-200/80 dark:border-zinc-800 p-6 rounded-2xl shadow-2xl bg-white dark:bg-zinc-950">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-base font-bold text-zinc-900 dark:text-white">
              Create API Key
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Generate a new workspace credential for Meta, Mail, WhatsApp or Webhooks.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateKey} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold block mb-1">Key Name</label>
              <input
                required
                type="text"
                placeholder="E.g. Meta Ads & Lead Sync"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-xs text-zinc-800 placeholder:text-zinc-400 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Category</label>
              <select
                value={newKeyCategory}
                onChange={(e) => setNewKeyCategory(e.target.value)}
                className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-xs text-zinc-800 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
              >
                <option value="Meta Platform">Meta Platform (Ads &amp; Webhooks)</option>
                <option value="Core API">Core API (SendGrid / SMTP)</option>
                <option value="Data Jobs">Data Jobs (WhatsApp Cloud API)</option>
                <option value="Integrations">Integrations (Zapier / Webhooks)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1">Access Status</label>
              <select
                value={newKeyStatus}
                onChange={(e) => setNewKeyStatus(e.target.value as any)}
                className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-xs text-zinc-800 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
              >
                <option value="Active">Active</option>
                <option value="Rotating">Rotating</option>
                <option value="Restricted">Restricted</option>
              </select>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="h-9 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-9 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold dark:bg-zinc-100 dark:text-zinc-950 cursor-pointer"
              >
                Generate Key
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
