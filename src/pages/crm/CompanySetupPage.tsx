"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User, Buildings, Handshake, Users, ShieldCheck, Bell,
  CreditCard, UploadSimple, X, Check, ArrowLeft, WarningCircle,
  Globe, CurrencyDollar, LockKey, CaretDown, Plugs, Key, Sparkle,
  CheckCircle
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CompanySetupPageProps {
  onBack?: () => void;
  onNavigate?: (page: string) => void;
  pageHistory?: string[];
}

const NAV_ITEMS = [
  { id: "profile", label: "My Profile", icon: User },
  { id: "company", label: "Company Details", icon: Buildings },
  { id: "crm", label: "CRM Defaults", icon: Handshake },
  { id: "team", label: "Team & Access", icon: Users },
  { id: "security", label: "Security & 2FA", icon: ShieldCheck },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing & Plans", icon: CreditCard },
] as const;

type NavId = (typeof NAV_ITEMS)[number]["id"];

export function CompanySetupPage({ onBack, onNavigate, pageHistory }: CompanySetupPageProps) {
  const [activeTab, setActiveTab] = useState<NavId>("profile");
  const [showBanner, setShowBanner] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState("Alex Morgan");
  const [email, setEmail] = useState("alex@acme.dev");
  const [username, setUsername] = useState("alexmorgan");
  const [role, setRole] = useState("Engineering Lead");

  // Company Form State
  const [companyName, setCompanyName] = useState("Acme Corporation");
  const [companyEmail, setCompanyEmail] = useState("contact@acme.com");
  const [domain, setDomain] = useState("acme.crm.io");
  const [industry, setIndustry] = useState("Enterprise B2B SaaS");
  const [currency, setCurrency] = useState("USD ($)");
  const [timezone, setTimezone] = useState("GMT+1 (EST)");

  // CRM Defaults State
  const [routing, setRouting] = useState("Round-Robin Auto Assign");
  const [winTarget, setWinTarget] = useState("38%");
  const [dealSla, setDealSla] = useState("14 Days");

  // Security State
  const [tfaEnabled, setTfaEnabled] = useState(true);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Settings updated successfully!");
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 overflow-y-auto sleek-scroll p-6 sm:p-10 space-y-8">

      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed top-4 right-8 z-50 p-3.5 rounded-2xl bg-zinc-900 text-white text-xs font-bold shadow-2xl flex items-center gap-2">
          <CheckCircle className="size-4 text-emerald-400" weight="fill" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="space-y-1">
        {pageHistory && pageHistory.length > 1 && (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors w-fit mb-2 cursor-pointer"
          >
            <ArrowLeft weight="bold" size={14} />
            <span>Back</span>
          </button>
        )}
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Account Settings
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-normal">
          Update your profile, access, notifications, and billing preferences.
        </p>
      </div>

      {/* Alert Banner (REUI Style Amber Box) */}
      {showBanner && (
        <div className="rounded-2xl border border-amber-200/90 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/20 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="size-9 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
              <User className="size-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-950 dark:text-amber-200">
                Complete your profile.
              </p>
              <p className="text-xs text-amber-800/80 dark:text-amber-400 font-medium">
                Add a photo and keep your role and timezone current.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setShowBanner(false)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-amber-900 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors cursor-pointer"
            >
              Dismiss
            </button>
            <button
              onClick={() => {
                setActiveTab("profile");
                showToast("Opening profile details...");
              }}
              className="px-4 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              Update
            </button>
          </div>
        </div>
      )}

      {/* Main Two-Column Settings Layout */}
      <div className="flex flex-col md:flex-row gap-8 items-start">

        {/* Left Sidebar Navigation Menu */}
        <div className="w-full md:w-56 shrink-0 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full px-3.5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 transition-all cursor-pointer text-left",
                  isActive
                    ? "bg-zinc-100 text-zinc-900 font-semibold dark:bg-zinc-800/90 dark:text-white"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                )}
              >
                <Icon className={cn("size-4", isActive ? "text-zinc-900 dark:text-white" : "text-zinc-400")} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Main Content Card Container */}
        <div className="flex-1 w-full border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xs">

          {/* TAB 1: MY PROFILE */}
          {activeTab === "profile" && (
            <form onSubmit={handleSave} className="space-y-8">
              {/* Section Header */}
              <div className="border-b border-zinc-100 dark:border-zinc-800/60 pb-4">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">My profile</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">
                  Public account details
                </p>
              </div>

              {/* Photo Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start border-b border-zinc-100 dark:border-zinc-800/60 pb-6">
                <div>
                  <label className="block text-sm font-semibold text-zinc-900 dark:text-white">Photo</label>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Shown in comments and mentions.</p>
                </div>
                <div className="sm:col-span-2 flex items-center gap-4">
                  <Avatar className="size-16 border border-zinc-200 dark:border-zinc-700">
                    <AvatarImage src="https://i.pravatar.cc/200?img=68" />
                    <AvatarFallback className="font-bold">AM</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => showToast("Photo change dialog opened")}
                      className="rounded-xl border-zinc-200 dark:border-zinc-800 text-xs font-semibold cursor-pointer h-9 px-3.5"
                    >
                      <UploadSimple className="size-3.5 mr-1.5" /> Change
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => showToast("Photo removed")}
                      className="rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white text-xs font-semibold cursor-pointer h-9 px-3"
                    >
                      <X className="size-3.5 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              </div>

              {/* Full Name Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center border-b border-zinc-100 dark:border-zinc-800/60 pb-6">
                <div>
                  <label className="block text-sm font-semibold text-zinc-900 dark:text-white">Full name</label>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Used across the workspace.</p>
                </div>
                <div className="sm:col-span-2">
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-10 rounded-xl border border-zinc-200 bg-white text-sm dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Email Address Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center border-b border-zinc-100 dark:border-zinc-800/60 pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <label className="block text-sm font-semibold text-zinc-900 dark:text-white">Email address</label>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 text-[11px] font-bold border border-emerald-200/60 dark:border-emerald-800">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Primary sign-in email.</p>
                </div>
                <div className="sm:col-span-2">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 rounded-xl border border-zinc-200 bg-white text-sm dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Username Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center border-b border-zinc-100 dark:border-zinc-800/60 pb-6">
                <div>
                  <label className="block text-sm font-semibold text-zinc-900 dark:text-white">Username</label>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Visible in mentions and links.</p>
                </div>
                <div className="sm:col-span-2">
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-zinc-400 font-semibold text-sm">@</span>
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="h-10 pl-8 rounded-xl border border-zinc-200 bg-white text-sm dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Profile Details & Role Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pb-2">
                <div>
                  <label className="block text-sm font-semibold text-zinc-900 dark:text-white">Role</label>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Public details shared across the workspace.</p>
                </div>
                <div className="sm:col-span-2">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full h-10 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 px-3 text-sm font-semibold text-zinc-900 dark:text-white outline-none"
                  >
                    <option value="Engineering Lead">Engineering Lead</option>
                    <option value="Sales Director">Sales Director</option>
                    <option value="Account Executive">Account Executive</option>
                    <option value="RevOps Manager">RevOps Manager</option>
                    <option value="Customer Success Lead">Customer Success Lead</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => showToast("Changes discarded")}
                  className="rounded-xl border-zinc-200 dark:border-zinc-800 text-xs font-semibold cursor-pointer h-9 px-4"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-xs font-bold cursor-pointer h-9 px-5 shadow-xs"
                >
                  Save changes
                </Button>
              </div>
            </form>
          )}

          {/* TAB 2: COMPANY DETAILS */}
          {activeTab === "company" && (
            <form onSubmit={handleSave} className="space-y-8">
              <div className="border-b border-zinc-100 dark:border-zinc-800/60 pb-4">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Company Details</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">
                  Organization branding and workspace settings
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center border-b border-zinc-100 dark:border-zinc-800/60 pb-6">
                <div>
                  <label className="block text-sm font-semibold text-zinc-900 dark:text-white">Company Name</label>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Legal entity title.</p>
                </div>
                <div className="sm:col-span-2">
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="h-10 rounded-xl border border-zinc-200 bg-white text-sm dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center border-b border-zinc-100 dark:border-zinc-800/60 pb-6">
                <div>
                  <label className="block text-sm font-semibold text-zinc-900 dark:text-white">Workspace Domain</label>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">CNAME &amp; portal link.</p>
                </div>
                <div className="sm:col-span-2">
                  <Input
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="h-10 rounded-xl border border-zinc-200 bg-white text-sm dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pb-2">
                <div>
                  <label className="block text-sm font-semibold text-zinc-900 dark:text-white">Industry &amp; Currency</label>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Default workspace metrics.</p>
                </div>
                <div className="sm:col-span-2 grid grid-cols-2 gap-3">
                  <Input
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="h-10 rounded-xl border border-zinc-200 bg-white text-sm dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="h-10 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 px-3 text-sm font-semibold text-zinc-900 dark:text-white outline-none"
                  >
                    <option value="USD ($)">USD ($)</option>
                    <option value="EUR (€)">EUR (€)</option>
                    <option value="GBP (£)">GBP (£)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <Button type="submit" size="sm" className="rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-xs font-bold cursor-pointer h-9 px-5 shadow-xs">
                  Save company details
                </Button>
              </div>
            </form>
          )}

          {/* TAB 3: CRM DEFAULTS */}
          {activeTab === "crm" && (
            <form onSubmit={handleSave} className="space-y-8">
              <div className="border-b border-zinc-100 dark:border-zinc-800/60 pb-4">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">CRM Defaults</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">
                  Pipeline SLAs and lead assignment rules
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center border-b border-zinc-100 dark:border-zinc-800/60 pb-6">
                <div>
                  <label className="block text-sm font-semibold text-zinc-900 dark:text-white">Auto Lead Routing</label>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">Inbound lead distribution engine.</p>
                </div>
                <div className="sm:col-span-2">
                  <select
                    value={routing}
                    onChange={(e) => setRouting(e.target.value)}
                    className="w-full h-10 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 px-3 text-sm font-semibold text-zinc-900 dark:text-white outline-none"
                  >
                    <option value="Round-Robin Auto Assign">Round-Robin Auto Assign</option>
                    <option value="Territory-Based Assignment">Territory-Based Assignment</option>
                    <option value="Manual Claim">Manual Claim</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pb-2">
                <div>
                  <label className="block text-sm font-semibold text-zinc-900 dark:text-white">Target Win Rate Benchmark</label>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">Pipeline performance KPI target.</p>
                </div>
                <div className="sm:col-span-2">
                  <Input
                    value={winTarget}
                    onChange={(e) => setWinTarget(e.target.value)}
                    className="h-10 rounded-xl border border-zinc-200 bg-white text-sm dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <Button type="submit" size="sm" className="rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-xs font-bold cursor-pointer h-9 px-5 shadow-xs">
                  Save CRM rules
                </Button>
              </div>
            </form>
          )}

          {/* TAB 4: TEAM & ACCESS */}
          {activeTab === "team" && (
            <div className="space-y-6">
              <div className="border-b border-zinc-100 dark:border-zinc-800/60 pb-4">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Team &amp; Access</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">
                  Allocated workspace seats and permissions
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">18 of 100 Seats Allocated</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Enterprise License Plan</p>
                </div>
                <Button size="sm" onClick={() => showToast("Seat invite modal opened")} className="rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 text-xs font-bold h-9">
                  Invite Member
                </Button>
              </div>
            </div>
          )}

          {/* TAB 5: SECURITY & 2FA */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="border-b border-zinc-100 dark:border-zinc-800/60 pb-4">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Security &amp; 2FA</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">
                  Authentication rules and IP policies
                </p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
                <div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">Enforce Two-Factor Auth (2FA)</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Require TOTP authenticator app verification upon login.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setTfaEnabled(!tfaEnabled)}
                  className={cn(
                    "w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center shrink-0",
                    tfaEnabled ? "bg-emerald-500 justify-end" : "bg-zinc-300 dark:bg-zinc-700 justify-start"
                  )}
                >
                  <motion.div layout className="size-4 rounded-full bg-white shadow-md" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="border-b border-zinc-100 dark:border-zinc-800/60 pb-4">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Notifications</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">
                  Email &amp; in-app alert preferences
                </p>
              </div>
              <p className="text-xs text-zinc-500">Alert triggers configured for deal updates and lead activity.</p>
            </div>
          )}

          {/* TAB 7: BILLING & PLANS */}
          {activeTab === "billing" && (
            <div className="space-y-6">
              <div className="border-b border-zinc-100 dark:border-zinc-800/60 pb-4">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Billing &amp; Plans</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">
                  Subscription plan details and invoices
                </p>
              </div>
              <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 space-y-1">
                <p className="text-sm font-bold text-zinc-900 dark:text-white">Enterprise Plan - $1,499/mo</p>
                <p className="text-xs text-zinc-500">Renews on Oct 1, 2026</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}