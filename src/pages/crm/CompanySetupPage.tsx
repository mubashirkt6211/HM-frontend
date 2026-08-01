import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Buildings,
  Users,
  Handshake,
  GearSix,
  ShieldCheck,
  MagnifyingGlass,
  BellSimple,
  CaretRight,
  DotsThreeVertical,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CompanySetupPageProps {
  onBack: () => void;
}

const NAV_ITEMS = [
  { id: "overview", label: "Profile", icon: Buildings, subtitle: "Company info" },
  { id: "crm", label: "CRM", icon: Handshake, subtitle: "Pipeline & leads" },
  { id: "team", label: "Team", icon: Users, subtitle: "Roles & access" },
  { id: "settings", label: "Settings", icon: GearSix, subtitle: "Integrations & policies" },
  { id: "security", label: "Security", icon: ShieldCheck, subtitle: "Access & rules" },
] as const;

type TabId = (typeof NAV_ITEMS)[number]["id"];

const STATS = [
  { label: "Active leads", value: "1,248" },
  { label: "Open deals", value: "62" },
  { label: "Team users", value: "18" },
  { label: "API connections", value: "12" },
];

export function CompanySetupPage({ onBack }: CompanySetupPageProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const activeItem = NAV_ITEMS.find((item) => item.id === activeTab)!;

  return (
    // Fills the available viewport exactly — sidebar stays put, only the
    // main panel scrolls internally. No page-level scroll.
    <div className="flex h-screen w-full overflow-hidden bg-zinc-50 dark:bg-[#07120e]">
      {/* ---------------- Sidebar ---------------- */}
      <aside className="flex h-full w-[280px] shrink-0 flex-col border-r border-zinc-200 bg-white dark:border-white/5 dark:bg-[#07120e]">
        {/* Back + brand */}
        <div className="flex items-center gap-3 border-b border-zinc-200 px-5 py-5 dark:border-white/5">
          <button
            onClick={onBack}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-white/10 dark:text-zinc-400 dark:hover:border-white/20 dark:hover:text-white"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={15} weight="bold" />
          </button>
          <div className="min-w-0">
            <p className="truncate font-['Instrument_Serif'] text-lg leading-tight text-zinc-950 dark:text-white">
              Acme Corporation
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-600 dark:text-sky-400">
              Company setup
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="px-5 pt-4">
          <div className="relative">
            <MagnifyingGlass
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <Input
              placeholder="Search settings"
              className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 pl-9 text-sm text-zinc-900 shadow-sm outline-none transition-colors focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-sky-400 dark:focus:ring-sky-500/20"
            />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500">
            Configuration
          </p>
          <div className="space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "group relative flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition duration-200",
                    isActive
                      ? "bg-sky-600 text-white shadow-[0_10px_30px_rgba(14,165,233,0.12)]"
                      : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/5",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-colors duration-200",
                      isActive
                        ? "bg-white/15 text-white"
                        : "bg-zinc-100 text-zinc-500 group-hover:text-sky-600 dark:bg-white/5 dark:text-zinc-500 dark:group-hover:text-sky-400",
                    )}
                  >
                    <Icon size={16} weight={isActive ? "fill" : "regular"} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{item.label}</span>
                    <span className={cn("block truncate text-[11px]", isActive ? "text-sky-100" : "text-zinc-400 dark:text-zinc-500")}>
                      {item.subtitle}
                    </span>
                  </span>
                  {isActive && <CaretRight size={13} weight="bold" className="shrink-0 text-white/80" />}
                </button>
              );
            })}
          </div>

          <div className="mt-6 rounded-3xl border border-sky-200/30 bg-sky-50/70 p-4 dark:border-sky-400/20 dark:bg-sky-500/10">
            <p className="text-xs font-semibold text-sky-700 dark:text-sky-200">CRM tip</p>
            <p className="mt-2 text-[12px] leading-5 text-zinc-600 dark:text-zinc-300">
              Keep your company profile current to improve lead routing and team collaboration.
            </p>
          </div>
        </nav>

        {/* Account footer */}
        <div className="flex items-center gap-3 border-t border-zinc-200 px-4 py-4 dark:border-white/5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-600 font-['Instrument_Serif'] text-base text-white">
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-zinc-950 dark:text-white">Admin workspace</p>
            <p className="truncate text-[11px] text-zinc-500 dark:text-zinc-500">contact@acme.com</p>
          </div>
          <button
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
            aria-label="Account options"
          >
            <DotsThreeVertical size={16} weight="bold" />
          </button>
        </div>
      </aside>

      {/* ---------------- Main panel (only this scrolls) ---------------- */}
      <main className="flex h-full min-w-0 flex-1 flex-col overflow-y-auto">
        {/* Sticky header inside the scroll area */}
        <header className="sticky top-0 z-10 flex flex-col gap-4 border-b border-zinc-200 bg-zinc-50/90 px-8 py-6 backdrop-blur dark:border-white/5 dark:bg-[#07120e]/90 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-600">
              {activeItem.subtitle}
            </p>
            <h1 className="font-['Instrument_Serif'] text-[28px] leading-tight text-zinc-950 dark:text-white">
              {activeItem.label}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-zinc-900 dark:border-white/10 dark:text-zinc-400 dark:hover:text-white"
              aria-label="Notifications"
            >
              <BellSimple size={17} />
            </button>
            <Button variant="outline" className="h-10 rounded-xl border-zinc-200 px-4 dark:border-white/10">
              Export settings
            </Button>
            <Button className="h-10 rounded-xl bg-[#0F6E56] px-4 hover:bg-[#0a3d2e]">Save changes</Button>
          </div>
        </header>

        <div className="flex-1 px-8 py-6">
          {/* Quick metrics strip — always visible for context */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-white/5 dark:bg-white/[0.03]"
              >
                <p className="text-xs text-zinc-400 dark:text-zinc-600">{stat.label}</p>
                <p className="mt-1.5 font-['Instrument_Serif'] text-2xl text-zinc-950 dark:text-white">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-white/[0.02]"
            >
              {activeTab === "overview" && (
                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">Business details</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Company name" value="Acme Corporation" />
                      <Field label="Company email" value="contact@acme.com" />
                      <Field label="Website" value="https://acme.com" />
                      <Field label="Industry" value="Healthcare SaaS" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Metric label="Customer lifetime value" value="$124.7K" />
                    <Metric label="Win rate" value="38%" />
                    <Metric label="Default currency" value="USD" />
                    <Metric label="Timezone" value="GMT+1" />
                  </div>
                </div>
              )}

              {activeTab === "crm" && (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Sales pipeline name" value="Enterprise Growth" />
                    <Field label="Lead source" value="Website form" />
                  </div>
                  <Metric
                    label="CRM automation"
                    value="Auto-assign inbound leads, route deals, and track follow-ups."
                  />
                </div>
              )}

              {activeTab === "team" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <Metric label="Team members" value="18 users" />
                  <Metric label="Access roles" value="Admin, Sales, Support" />
                </div>
              )}

              {activeTab === "settings" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <Metric label="Email templates" value="Enabled" />
                  <Metric label="Lead scoring" value="Configured" />
                </div>
              )}

              {activeTab === "security" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <Metric label="Two-factor authentication" value="Enabled" />
                  <Metric label="Session timeout" value="30 minutes" />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-zinc-400 dark:text-zinc-600">{label}</label>
      <Input
        defaultValue={value}
        className="h-11 rounded-xl border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-white/[0.03]"
      />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/5 dark:bg-white/[0.03]">
      <p className="text-sm text-zinc-400 dark:text-zinc-600">{label}</p>
      <p className="mt-2 text-base font-semibold text-zinc-950 dark:text-white">{value}</p>
    </div>
  );
}