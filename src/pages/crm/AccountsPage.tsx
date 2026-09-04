import { useState } from "react";
import {
  Briefcase,
  Plus,
  MagnifyingGlass,
  Funnel,
  Buildings,
  CurrencyDollar,
  Users,
  CheckCircle,
  TrendUp,
  ShieldCheck,
  Globe,
  PhoneCall,
  Envelope,
  DotsThreeVertical,
  XCircle,
  DownloadSimple,
  PencilSimple,
  Trash,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface CRMAccount {
  id: string;
  name: string;
  logo: string;
  domain: string;
  industry: string;
  tier: "Tier 1 Enterprise" | "Tier 2 Mid-Market" | "Tier 3 Growth";
  annualValue: number;
  healthScore: number;
  status: "Active" | "Renewal Due" | "Onboarding";
  ownerName: string;
  ownerAvatar: string;
  contactsCount: number;
  openDealsCount: number;
  phone: string;
  email: string;
  location: string;
  founded: string;
}

const INITIAL_ACCOUNTS: CRMAccount[] = [
  {
    id: "acc-1",
    name: "Nexus Cloud Technologies",
    logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=80",
    domain: "nexuscloud.io",
    industry: "SaaS & Enterprise Cloud",
    tier: "Tier 1 Enterprise",
    annualValue: 145000,
    healthScore: 98,
    status: "Active",
    ownerName: "Ari Parker",
    ownerAvatar: "https://i.pravatar.cc/96?img=47",
    contactsCount: 14,
    openDealsCount: 3,
    phone: "+1 (555) 234-5678",
    email: "enterprise@nexuscloud.io",
    location: "Boston, MA, USA",
    founded: "2015",
  },
  {
    id: "acc-2",
    name: "Vanguard Financial Systems",
    logo: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=100&auto=format&fit=crop&q=80",
    domain: "vanguardfin.com",
    industry: "Financial Services & FinTech",
    tier: "Tier 1 Enterprise",
    annualValue: 110000,
    healthScore: 92,
    status: "Active",
    ownerName: "Sam Rivera",
    ownerAvatar: "https://i.pravatar.cc/96?img=11",
    contactsCount: 9,
    openDealsCount: 2,
    phone: "+1 (555) 876-5432",
    email: "contact@vanguardfin.com",
    location: "New York, NY, USA",
    founded: "2012",
  },
  {
    id: "acc-3",
    name: "Apex Logistics Global",
    logo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=100&auto=format&fit=crop&q=80",
    domain: "apexlogistics.com",
    industry: "Supply Chain & Logistics",
    tier: "Tier 2 Mid-Market",
    annualValue: 75000,
    healthScore: 84,
    status: "Renewal Due",
    ownerName: "Maya Chen",
    ownerAvatar: "https://i.pravatar.cc/96?img=32",
    contactsCount: 6,
    openDealsCount: 1,
    phone: "+1 (555) 432-1098",
    email: "corporate@apexlogistics.com",
    location: "Chicago, IL, USA",
    founded: "2017",
  },
  {
    id: "acc-4",
    name: "OmniMedia Digital Group",
    logo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&auto=format&fit=crop&q=80",
    domain: "omnimediadigital.com",
    industry: "Digital Marketing & AI",
    tier: "Tier 3 Growth",
    annualValue: 48000,
    healthScore: 95,
    status: "Onboarding",
    ownerName: "Jordan Lee",
    ownerAvatar: "https://i.pravatar.cc/96?img=33",
    contactsCount: 4,
    openDealsCount: 2,
    phone: "+1 (555) 901-2345",
    email: "sales@omnimediadigital.com",
    location: "Austin, TX, USA",
    founded: "2020",
  },
];

interface AccountsPageProps {
  onNavigate?: (page: string) => void;
}

export function AccountsPage({ onNavigate }: AccountsPageProps) {
  const [accounts, setAccounts] = useState<CRMAccount[]>(INITIAL_ACCOUNTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [selectedAccount, setSelectedAccount] = useState<CRMAccount | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastBanner, setToastBanner] = useState<string | null>(null);

  // Form State for Adding Account
  const [newAccName, setNewAccName] = useState("");
  const [newAccDomain, setNewAccDomain] = useState("");
  const [newAccIndustry, setNewAccIndustry] = useState("SaaS & Enterprise Software");
  const [newAccTier, setNewAccTier] = useState<CRMAccount["tier"]>("Tier 1 Enterprise");
  const [newAccVal, setNewAccVal] = useState("65000");
  const [newAccOwner, setNewAccOwner] = useState("Ari Parker");

  // Filtering Logic
  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === "all" || acc.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  const totalACV = accounts.reduce((sum, a) => sum + a.annualValue, 0);
  const avgHealth = Math.round(accounts.reduce((sum, a) => sum + a.healthScore, 0) / accounts.length);

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName.trim()) return;

    const created: CRMAccount = {
      id: `acc-${Date.now()}`,
      name: newAccName,
      logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=80",
      domain: newAccDomain || `${newAccName.toLowerCase().replace(/\s+/g, "")}.io`,
      industry: newAccIndustry,
      tier: newAccTier,
      annualValue: Number(newAccVal) || 65000,
      healthScore: 96,
      status: "Active",
      ownerName: newAccOwner,
      ownerAvatar: "https://i.pravatar.cc/96?img=47",
      contactsCount: 4,
      openDealsCount: 1,
      phone: "+1 (555) 019-2834",
      email: `contact@${newAccDomain || "company.com"}`,
      location: "San Francisco, CA, USA",
      founded: "2022",
    };

    setAccounts([created, ...accounts]);
    setIsAddModalOpen(false);
    setNewAccName("");
    setNewAccDomain("");

    setToastBanner(`🏢 B2B Account "${created.name}" created successfully!`);
    setTimeout(() => setToastBanner(null), 4000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 p-4 md:p-8 space-y-8 relative">
      {/* Toast Banner */}
      {toastBanner && (
        <div className="fixed top-6 right-6 z-[120] max-w-md px-4 py-3 rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold shadow-2xl border border-zinc-800 animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <span>{toastBanner}</span>
        </div>
      )}

      {/* ── TOP HEADER (Title Left | Search & Actions Right) ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2.5">
            <Briefcase className="size-7 text-blue-600 dark:text-blue-400" />
            Accounts & Enterprise Portfolio
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Manage corporate client accounts, annual contract values (ACV), health scores, and assigned deal owners.
          </p>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2.5 flex-wrap justify-end">
          {/* Search Box */}
          <div className="relative w-64">
            <MagnifyingGlass className="absolute left-3 top-2.5 size-4 text-zinc-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search account name or domain..."
              className="pl-9 h-9 text-xs rounded-md border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-md text-xs font-bold text-zinc-500 border border-zinc-200/70 dark:border-zinc-800">
            {[
              { id: "all", label: "All Tiers" },
              { id: "Tier 1 Enterprise", label: "Tier 1" },
              { id: "Tier 2 Mid-Market", label: "Tier 2" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTierFilter(t.id)}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-all cursor-pointer font-bold text-[11px]",
                  tierFilter === t.id
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs"
                    : "hover:text-zinc-900 dark:hover:text-zinc-100"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Add Account Button */}
          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="h-9 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
          >
            <Plus className="size-4" weight="bold" />
            <span>Add Account</span>
          </Button>
        </div>
      </div>

      {/* ── 4 KPI METRIC CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Total B2B Accounts</span>
            <div className="size-8 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center">
              <Buildings className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xl font-extrabold text-zinc-900 dark:text-white">{accounts.length} Accounts</span>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">+2 this month</span>
          </div>
          <p className="text-[11px] text-zinc-400 font-medium">Active corporate client portfolio</p>
        </div>

        <div className="rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Annual Contract Value (ACV)</span>
            <div className="size-8 rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center">
              <CurrencyDollar className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">${totalACV.toLocaleString()}</span>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">+18.4% YoY</span>
          </div>
          <p className="text-[11px] text-zinc-400 font-medium">Total active recurring contract revenue</p>
        </div>

        <div className="rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Average Account Health</span>
            <div className="size-8 rounded-md bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 flex items-center justify-center">
              <ShieldCheck className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xl font-extrabold text-zinc-900 dark:text-white">{avgHealth}% Index</span>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">High Retention</span>
          </div>
          <p className="text-[11px] text-zinc-400 font-medium">Account engagement & satisfaction rating</p>
        </div>

        <div className="rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Enterprise Tier 1</span>
            <div className="size-8 rounded-md bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 flex items-center justify-center">
              <TrendUp className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xl font-extrabold text-zinc-900 dark:text-white">2 Accounts</span>
            <span className="text-[11px] font-bold text-zinc-500">$255k ACV</span>
          </div>
          <p className="text-[11px] text-zinc-400 font-medium">Strategic Tier 1 accounts</p>
        </div>
      </div>

      {/* ── ACCOUNTS TABLE CONTAINER ── */}
      <div className="rounded-md border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-extrabold text-zinc-900 dark:text-white">
              B2B Accounts Directory ({filteredAccounts.length})
            </h2>
          </div>
          <span className="text-xs text-zinc-400 font-medium">Click any row to open account sheet</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-400 font-bold">
                <th className="py-3 px-4">Account Name & Domain</th>
                <th className="py-3 px-4">Industry & Tier</th>
                <th className="py-3 px-4 text-right">Annual Value (ACV)</th>
                <th className="py-3 px-4 text-center">Health Score</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Account Owner</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {filteredAccounts.map((acc) => (
                <tr
                  key={acc.id}
                  onClick={() => setSelectedAccount(acc)}
                  className="hover:bg-zinc-50/70 dark:hover:bg-zinc-900/80 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={acc.logo}
                        alt={acc.name}
                        className="size-9 rounded-md object-cover border border-zinc-200 dark:border-zinc-800"
                      />
                      <div>
                        <p className="font-extrabold text-zinc-900 dark:text-white text-xs">{acc.name}</p>
                        <p className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
                          <Globe className="size-3" />
                          <span>{acc.domain}</span>
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-bold text-zinc-800 dark:text-zinc-200">{acc.industry}</p>
                    <span className="text-[10px] font-semibold text-zinc-400">{acc.tier}</span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                      ${acc.annualValue.toLocaleString()}
                    </span>
                    <p className="text-[10px] text-zinc-400 font-medium">{acc.openDealsCount} Open Deals</p>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-1.5">
                      <div className="w-16 h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${acc.healthScore}%` }}
                        />
                      </div>
                      <span className="font-extrabold text-zinc-800 dark:text-zinc-200">{acc.healthScore}%</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-md text-[10px] font-extrabold border inline-block",
                        acc.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                          : acc.status === "Renewal Due"
                          ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                          : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800"
                      )}
                    >
                      {acc.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-6 border border-zinc-200 dark:border-zinc-700">
                        <AvatarImage src={acc.ownerAvatar} />
                        <AvatarFallback>{acc.ownerName.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">{acc.ownerName}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAccount(acc);
                      }}
                      className="h-7 text-xs font-bold rounded-md"
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── ACCOUNT DETAILS SIDE DRAWER ── */}
      <Sheet open={!!selectedAccount} onOpenChange={() => setSelectedAccount(null)}>
        {selectedAccount && (
          <SheetContent className="sm:max-w-md border-l border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-950 space-y-6 sleek-scroll overflow-y-auto">
            <SheetHeader className="text-left space-y-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedAccount.logo}
                  alt={selectedAccount.name}
                  className="size-12 rounded-md object-cover border border-zinc-200 dark:border-zinc-800"
                />
                <div>
                  <SheetTitle className="text-lg font-extrabold text-zinc-900 dark:text-white">
                    {selectedAccount.name}
                  </SheetTitle>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                    <Globe className="size-3.5" />
                    <span>{selectedAccount.domain}</span>
                  </p>
                </div>
              </div>
            </SheetHeader>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
                <p className="text-[10px] font-bold text-zinc-400">Annual Contract Value</p>
                <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                  ${selectedAccount.annualValue.toLocaleString()}
                </p>
              </div>

              <div className="p-3 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
                <p className="text-[10px] font-bold text-zinc-400">Account Health</p>
                <p className="text-base font-extrabold text-zinc-900 dark:text-white">
                  {selectedAccount.healthScore}% Index
                </p>
              </div>
            </div>

            {/* Account Metadata List */}
            <div className="space-y-3 text-xs border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 font-semibold">Industry</span>
                <span className="font-extrabold text-zinc-900 dark:text-white">{selectedAccount.industry}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500 font-semibold">Account Tier</span>
                <span className="font-extrabold text-zinc-900 dark:text-white">{selectedAccount.tier}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500 font-semibold">Account Manager</span>
                <div className="flex items-center gap-1.5 font-extrabold text-zinc-900 dark:text-white">
                  <Avatar className="size-5">
                    <AvatarImage src={selectedAccount.ownerAvatar} />
                    <AvatarFallback>{selectedAccount.ownerName.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span>{selectedAccount.ownerName}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500 font-semibold">Headquarters</span>
                <span className="font-extrabold text-zinc-900 dark:text-white">{selectedAccount.location}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500 font-semibold">Primary Phone</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{selectedAccount.phone}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500 font-semibold">Corporate Email</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{selectedAccount.email}</span>
              </div>
            </div>

            {/* Associated Contacts */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-zinc-900 dark:text-white flex items-center justify-between">
                <span>Key Decision Makers ({selectedAccount.contactsCount})</span>
                <span className="text-[10px] text-zinc-400 font-semibold">Verified Contacts</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-zinc-900 dark:text-white">Alex Mercer</p>
                    <p className="text-[10px] text-zinc-400">Chief Technology Officer (CTO)</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <PhoneCall className="size-3.5 hover:text-blue-600 cursor-pointer" />
                    <Envelope className="size-3.5 hover:text-blue-600 cursor-pointer" />
                  </div>
                </div>

                <div className="p-3 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-zinc-900 dark:text-white">Rachel Sterling</p>
                    <p className="text-[10px] text-zinc-400">VP of Global Procurement</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <PhoneCall className="size-3.5 hover:text-blue-600 cursor-pointer" />
                    <Envelope className="size-3.5 hover:text-blue-600 cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        )}
      </Sheet>

      {/* ── ADD NEW ACCOUNT MODAL ── */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-md border border-zinc-200 dark:border-zinc-800 p-6 rounded-md shadow-2xl bg-white dark:bg-zinc-950 space-y-4">
          <DialogHeader className="text-left space-y-1 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <Buildings className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-extrabold text-zinc-900 dark:text-white">
                  Add New B2B Account
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                  Register a corporate client or partner organization in Leadwave CRM.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleCreateAccount} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-extrabold text-zinc-900 dark:text-white">Account Name *</label>
              <Input
                required
                value={newAccName}
                onChange={(e) => setNewAccName(e.target.value)}
                placeholder="e.g. Acme SaaS Systems Inc"
                className="h-9 text-xs rounded-md"
              />
            </div>

            <div className="space-y-1">
              <label className="font-extrabold text-zinc-900 dark:text-white">Domain Website</label>
              <Input
                value={newAccDomain}
                onChange={(e) => setNewAccDomain(e.target.value)}
                placeholder="acmesaassystems.com"
                className="h-9 text-xs rounded-md"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-extrabold text-zinc-900 dark:text-white">Industry</label>
                <select
                  value={newAccIndustry}
                  onChange={(e) => setNewAccIndustry(e.target.value)}
                  className="w-full h-9 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 text-xs font-semibold"
                >
                  <option>SaaS & Enterprise Software</option>
                  <option>Financial Services & FinTech</option>
                  <option>Supply Chain & Logistics</option>
                  <option>Digital Marketing & AI</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-zinc-900 dark:text-white">Account Tier</label>
                <select
                  value={newAccTier}
                  onChange={(e) => setNewAccTier(e.target.value as any)}
                  className="w-full h-9 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 text-xs font-semibold"
                >
                  <option value="Tier 1 Enterprise">Tier 1 Enterprise</option>
                  <option value="Tier 2 Mid-Market">Tier 2 Mid-Market</option>
                  <option value="Tier 3 Growth">Tier 3 Growth</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-extrabold text-zinc-900 dark:text-white">Annual Contract Value ($)</label>
                <Input
                  type="number"
                  value={newAccVal}
                  onChange={(e) => setNewAccVal(e.target.value)}
                  className="h-9 text-xs rounded-md"
                />
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-zinc-900 dark:text-white">Account Owner</label>
                <select
                  value={newAccOwner}
                  onChange={(e) => setNewAccOwner(e.target.value)}
                  className="w-full h-9 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 text-xs font-semibold"
                >
                  <option>Ari Parker</option>
                  <option>Sam Rivera</option>
                  <option>Maya Chen</option>
                  <option>Jordan Lee</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-md text-xs font-bold border-zinc-200 dark:border-zinc-800 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="rounded-md text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                Create Account
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
