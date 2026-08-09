import { useState } from "react";
import {
  FacebookLogo,
  InstagramLogo,
  WhatsappLogo,
  Globe,
  LinkedinLogo,
  ShieldCheck,
  Plug,
  BellRinging,
  CaretUp,
  CaretDown,
  Plus,
  Megaphone,
  User,
  Buildings,
  Clock,
  TrendUp,
  CurrencyDollar,
  UsersThree,
  CheckCircle,
  ArrowUpRight,
  ChartBar,
  Funnel,
  Sparkle,
  Sliders,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface CampaignsPageProps {
  onNavigate?: (page: string) => void;
}

export function CampaignsPage({ onNavigate }: CampaignsPageProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    meta: true,
    connectedApps: true,
    fallback: true,
    linkedin: true,
  });

  const toggleSection = (sec: string) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  const campaigns = [
    {
      id: "cmp-1",
      platform: "Meta Ads",
      title: "Enterprise Luxury Resort Campaign",
      icon: FacebookLogo,
      iconColor: "text-blue-600",
      badgeBg: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200",
      leads: 142,
      spend: "$2,400",
      ctr: "4.8%",
      cpa: "$16.90",
      owner: "Ari Mendoza",
      avatar: "https://i.pravatar.cc/96?img=47",
      status: "Active",
      desc: "Facebook feed & stories placement targeting corporate decision makers.",
    },
    {
      id: "cmp-2",
      platform: "Instagram",
      title: "Honeymoon & Villa Reels Campaign",
      icon: InstagramLogo,
      iconColor: "text-pink-600",
      badgeBg: "bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300 border-pink-200",
      leads: 98,
      spend: "$1,800",
      ctr: "5.1%",
      cpa: "$18.36",
      owner: "Sam Rivera",
      avatar: "https://i.pravatar.cc/96?img=11",
      status: "Active",
      desc: "High-engagement visual reels showcasing overwater villas and luxury tours.",
    },
    {
      id: "cmp-3",
      platform: "WhatsApp",
      title: "Instant VIP Concierge Chat Ads",
      icon: WhatsappLogo,
      iconColor: "text-emerald-600",
      badgeBg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200",
      leads: 76,
      spend: "$950",
      ctr: "6.4%",
      cpa: "$12.50",
      owner: "Jordan Lee",
      avatar: "https://i.pravatar.cc/96?img=33",
      status: "Active",
      desc: "Direct click-to-WhatsApp messaging funnel with under 2-minute auto-response.",
    },
    {
      id: "cmp-4",
      platform: "Web Form",
      title: "Inbound Web Consultation Portal",
      icon: Globe,
      iconColor: "text-indigo-600",
      badgeBg: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200",
      leads: 115,
      spend: "$1,200",
      ctr: "19.0%",
      cpa: "$10.43",
      owner: "Maya Chen",
      avatar: "https://i.pravatar.cc/96?img=32",
      status: "Active",
      desc: "Embedded custom quote request form on main web homepage.",
    },
    {
      id: "cmp-5",
      platform: "LinkedIn",
      title: "Executive B2B Corporate Offsite",
      icon: LinkedinLogo,
      iconColor: "text-sky-600",
      badgeBg: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border-sky-200",
      leads: 45,
      spend: "$3,100",
      ctr: "3.2%",
      cpa: "$68.88",
      owner: "Ari Parker",
      avatar: "https://i.pravatar.cc/96?img=44",
      status: "Active",
      desc: "InMail & Sponsored Content targeting Fortune 500 HR & Event VP executives.",
    },
  ];

  const filteredCampaigns = activeTab === "all"
    ? campaigns
    : campaigns.filter((c) => c.platform === activeTab);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 p-4 md:p-8 space-y-8">
      {/* ── TOP PAGE HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-pink-500/10 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400 flex items-center justify-center font-bold">
              <Megaphone className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                Marketing & Campaigns
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                Manage multi-channel acquisition funnels, review launch checklists, and configure app integrations.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onNavigate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate("pipeline")}
              className="text-xs font-bold rounded-xl border-zinc-200 dark:border-zinc-800"
            >
              <Funnel className="size-3.5 mr-1.5" />
              View Pipeline
            </Button>
          )}

          <Button
            size="sm"
            className="group relative overflow-hidden h-9 rounded-xl border border-blue-800/40 bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700 px-4 text-xs font-bold text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="size-4" weight="bold" />
            <span>Launch Campaign</span>
          </Button>
        </div>
      </div>

      {/* ── 4 STAT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Active Campaigns",
            value: "5 Channels",
            change: "+2 new",
            positive: true,
            icon: Megaphone,
            color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400",
          },
          {
            title: "Total Ad Spend",
            value: "$9,450",
            change: "+8.4%",
            positive: true,
            icon: CurrencyDollar,
            color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400",
          },
          {
            title: "Pipeline Leads",
            value: "476 Leads",
            change: "+19.2%",
            positive: true,
            icon: UsersThree,
            color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-400",
          },
          {
            title: "Avg Acquisition CPA",
            value: "$19.85",
            change: "-4.2% lower",
            positive: true,
            icon: TrendUp,
            color: "text-pink-600 bg-pink-50 dark:bg-pink-950/40 dark:text-pink-400",
          },
        ].map((stat, i) => {
          const IconComp = stat.icon;
          return (
            <div
              key={i}
              className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{stat.title}</span>
                <div className={cn("size-8 rounded-xl flex items-center justify-center", stat.color)}>
                  <IconComp className="size-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-xl font-extrabold text-zinc-900 dark:text-white">{stat.value}</span>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                  <ArrowUpRight className="size-3" />
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── PLATFORM TABS ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto border-b border-zinc-200 dark:border-zinc-800 pb-3">
          {[
            { id: "all", label: "All Campaigns", icon: Globe },
            { id: "Meta Ads", label: "Meta Ads", icon: FacebookLogo, color: "text-blue-600" },
            { id: "Instagram", label: "Instagram", icon: InstagramLogo, color: "text-pink-600" },
            { id: "WhatsApp", label: "WhatsApp", icon: WhatsappLogo, color: "text-emerald-600" },
            { id: "Web Form", label: "Web Form", icon: Globe, color: "text-indigo-600" },
            { id: "LinkedIn", label: "LinkedIn", icon: LinkedinLogo, color: "text-sky-600" },
          ].map((t) => {
            const IconComp = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0",
                  activeTab === t.id
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                )}
              >
                <IconComp className={cn("size-4", activeTab === t.id ? "" : t.color)} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── CAMPAIGNS CARDS GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCampaigns.map((cmp) => {
            const IconComp = cmp.icon;
            return (
              <div
                key={cmp.id}
                className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={cn("inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border shadow-2xs", cmp.badgeBg)}>
                      <IconComp className={cn("size-3.5", cmp.iconColor)} />
                      <span>{cmp.platform}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {cmp.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white">
                      {cmp.title}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                      {cmp.desc}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="grid grid-cols-3 gap-2 text-center bg-zinc-50 dark:bg-zinc-950 p-2.5 rounded-xl text-xs">
                    <div>
                      <p className="text-[10px] font-semibold text-zinc-400">Leads</p>
                      <p className="font-extrabold text-zinc-900 dark:text-zinc-100">{cmp.leads}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-zinc-400">Spend</p>
                      <p className="font-extrabold text-zinc-900 dark:text-zinc-100">{cmp.spend}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-zinc-400">CTR</p>
                      <p className="font-extrabold text-emerald-600 dark:text-emerald-400">{cmp.ctr}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 pt-1">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-6 border border-zinc-200 dark:border-zinc-700">
                        <AvatarImage src={cmp.avatar} />
                        <AvatarFallback>{cmp.owner.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">{cmp.owner}</span>
                    </div>
                    <span className="font-medium text-[11px]">CPA: {cmp.cpa}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── FULL LAUNCH CHECKLIST & ACCORDION CONFIGURATIONS ── */}
      <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <Sliders className="size-5 text-blue-600" />
            Launch Checklist & Routing Configurations
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Detailed operator settings, fallback rules, connected apps, and corporate retreat campaign controls.
          </p>
        </div>

        <div className="space-y-4">
          {/* Item 1: Ownership & cadence (Meta Facebook Ads) */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40 shadow-xs">
            <div
              onClick={() => toggleSection("meta")}
              className="flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300 shrink-0 font-bold">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Ownership & cadence</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Lock in primary operator, workspace alias, and weekly review window.</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                  In progress
                </span>
                {openSections.meta ? <CaretUp className="size-4 text-zinc-400" /> : <CaretDown className="size-4 text-zinc-400" />}
              </div>
            </div>

            {openSections.meta && (
              <div className="mt-4 rounded-xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/60 space-y-3">
                <div className="grid grid-cols-[160px_1fr] items-center text-xs">
                  <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 font-medium">
                    <User className="size-3.5" /> Launch owner
                  </span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">Ari Mendoza</span>
                </div>

                <div className="grid grid-cols-[160px_1fr] items-center text-xs">
                  <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 font-medium">
                    <Buildings className="size-3.5" /> Workspace alias
                  </span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">growth-command</span>
                </div>

                <div className="grid grid-cols-[160px_1fr] items-center text-xs">
                  <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 font-medium">
                    <Clock className="size-3.5" /> Review window
                  </span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">Tue, 10:00 UTC</span>
                </div>

                <div className="grid grid-cols-[160px_1fr] items-center text-xs border-t border-zinc-200/50 dark:border-zinc-800 pt-2.5">
                  <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 font-medium">
                    <FacebookLogo className="size-3.5 text-blue-600" /> Meta Campaign Metrics
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">142 Leads Generated ($2,400 Total Spend)</span>
                </div>
              </div>
            )}
          </div>

          {/* Item 2: Connected apps (Instagram & WhatsApp) */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40 shadow-xs">
            <div
              onClick={() => toggleSection("connectedApps")}
              className="flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300 shrink-0 font-bold">
                  <Plug className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Connected apps & API webhooks</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Choose tools that send events or receive rollout updates.</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-[11px] font-bold text-zinc-600 dark:text-zinc-300">
                  Active
                </span>
                {openSections.connectedApps ? <CaretUp className="size-4 text-zinc-400" /> : <CaretDown className="size-4 text-zinc-400" />}
              </div>
            </div>

            {openSections.connectedApps && (
              <div className="mt-4 rounded-xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/60 space-y-3">
                <div className="grid grid-cols-[160px_1fr] items-center text-xs">
                  <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 font-medium">
                    <InstagramLogo className="size-3.5 text-pink-600" /> Instagram Ads API
                  </span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">98 Leads (5.1% CTR, $1,800 Spend)</span>
                </div>

                <div className="grid grid-cols-[160px_1fr] items-center text-xs">
                  <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 font-medium">
                    <WhatsappLogo className="size-3.5 text-emerald-600" /> WhatsApp Business API
                  </span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">76 Direct Inquiries (&lt; 2m Response Time)</span>
                </div>
              </div>
            )}
          </div>

          {/* Item 3: Fallback rules (Inbound Web Form) */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40 shadow-xs">
            <div
              onClick={() => toggleSection("fallback")}
              className="flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300 shrink-0 font-bold">
                  <BellRinging className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Fallback rules & auto-assignment</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Set fallback notifications if primary representative is offline.</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-[11px] font-bold text-zinc-600 dark:text-zinc-300">
                  Configured
                </span>
                {openSections.fallback ? <CaretUp className="size-4 text-zinc-400" /> : <CaretDown className="size-4 text-zinc-400" />}
              </div>
            </div>

            {openSections.fallback && (
              <div className="mt-4 rounded-xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/60 space-y-3">
                <div className="grid grid-cols-[160px_1fr] items-center text-xs">
                  <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 font-medium">
                    <Globe className="size-3.5 text-indigo-600" /> Inbound Web Form
                  </span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">115 Form Submissions (19% Conversion)</span>
                </div>
              </div>
            )}
          </div>

          {/* Item 4: LinkedIn B2B Enterprise */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40 shadow-xs">
            <div
              onClick={() => toggleSection("linkedin")}
              className="flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-300 shrink-0 font-bold">
                  <LinkedinLogo className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">LinkedIn B2B Enterprise</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Corporate retreat and executive package campaigns.</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                  In progress
                </span>
                {openSections.linkedin ? <CaretUp className="size-4 text-zinc-400" /> : <CaretDown className="size-4 text-zinc-400" />}
              </div>
            </div>

            {openSections.linkedin && (
              <div className="mt-4 rounded-xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/60 space-y-3">
                <div className="grid grid-cols-[160px_1fr] items-center text-xs">
                  <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 font-medium">
                    <User className="size-3.5" /> Campaign Lead
                  </span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">Ari Parker</span>
                </div>

                <div className="grid grid-cols-[160px_1fr] items-center text-xs">
                  <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 font-medium">
                    <Buildings className="size-3.5" /> Workspace alias
                  </span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">linkedin-corporate</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
