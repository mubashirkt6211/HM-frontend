import { useState } from "react";
import {
  TrendUp,
  TrendDown,
  ArrowUpRight,
  ChartLineUp,
  CreditCard,
  Bank,
  Wallet,
  CheckCircle,
  WarningCircle,
  XCircle,
  Calendar as CalendarIcon,
  CaretDown,
  Receipt,
  Printer,
  DownloadSimple,
  EnvelopeSimple,
  DotsThreeVertical,
  PaypalLogo,
  FileText,
  ShieldCheck,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import {
  Card,
  VisualChart,
} from "@/components/dashboard/components";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

// Import Assets
import doctor1 from "@/assets/avatars/doctor_1.png";
import doctor2 from "@/assets/avatars/doctor_2.png";
import doctor3 from "@/assets/avatars/doctor_3.png";

const REVENUE_STATS = [
  { label: "Total Revenue", value: "€ 248,500.00", trend: "+12.4%", trendUp: true, icon: Wallet, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { label: "AVG. Monthly", value: "€ 18,450.00", trend: "+8.2%", trendUp: true, icon: ChartLineUp, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  { label: "Insurance Claims", value: "€ 84,200.00", trend: "-2.1%", trendUp: false, icon: Bank, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
  { label: "Net Profit", value: "€ 62,100.00", trend: "+14.8%", trendUp: true, icon: CreditCard, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
];


const BILLS_DATA = [
  { id: "BIL-1029", patient: "Alice Cooper", date: "Oct 28, 2025", type: "Sent", category: "Equipment", generatedBy: "Dr. Sarah Johnson", avatar: doctor1, description: "Payment for surgical grade equipment", amount: 150.00, subAmount: "162.30 USD", status: "Success", method: "Credit Card", methodDetails: "**** 6969" },
  { id: "BIL-1030", patient: "Bob Marley", date: "Oct 27, 2025", type: "Received", category: "Consultation", generatedBy: "Dr. Robert Smith", avatar: doctor2, description: "General health checkup fees", amount: 245.50, subAmount: "265.40 USD", status: "Success", method: "Bank Transfer", methodDetails: "TRX-9830" },
  { id: "BIL-1031", patient: "Charlie Chaplin", date: "Oct 26, 2025", type: "Received", category: "Pharmacy", generatedBy: "Dr. Emily Taylor", avatar: doctor3, description: "Prescription medication - Batch B2", amount: 45.00, subAmount: "48.60 USD", status: "Incomplete", method: "PayPal", methodDetails: "@claristaj" },
  { id: "BIL-1032", patient: "David Bowie", date: "Oct 25, 2025", type: "Sent", category: "Refund", generatedBy: "Dr. David Tennant", avatar: doctor2, description: "Refund for cancelled MRI scan", amount: 890.00, subAmount: "962.30 USD", status: "Failed", method: "Credit Card", methodDetails: "**** 2833" },
  { id: "BIL-1033", patient: "Elton John", date: "Oct 24, 2025", type: "Received", category: "Inpatient", generatedBy: "Dr. Elton John", avatar: doctor1, description: "Hospitalization and room charges", amount: 4500.00, subAmount: "4,865.00 USD", status: "Success", method: "Insurance", methodDetails: "POL-0034" },
  { id: "BIL-1034", patient: "Freddie Mercury", date: "Oct 23, 2025", type: "Converted", category: "Currency", generatedBy: "Dr. Brian May", avatar: doctor2, description: "EUR to USD conversion for lab funds", amount: 120.00, subAmount: "130.00 USD", status: "Success", method: "Internal", methodDetails: "Wallet-A" },
  { id: "BIL-1035", patient: "George Michael", date: "Oct 22, 2025", type: "Received", category: "Therapy", generatedBy: "Dr. Lisa Cuddy", avatar: doctor3, description: "Mental health therapy session pack", amount: 350.00, subAmount: "378.50 USD", status: "Success", method: "Credit Card", methodDetails: "**** 3298" },
];

function PaymentVisual({ method }: { method: string }) {
  const containerClasses = "w-full aspect-[1.6/1] rounded-[24px] p-6 relative shadow-2xl overflow-hidden group border mb-8 flex flex-col justify-between";

  switch (method) {
    case "Credit Card":
      return (
        <motion.div
          initial={{ rotateY: -10, rotateX: 5, opacity: 0 }}
          animate={{ rotateY: 0, rotateX: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className={cn(containerClasses, "bg-gradient-to-br from-zinc-700 to-zinc-900 border-zinc-700/50 text-white")}
        >
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          <div className="w-10 h-8 rounded-lg bg-gradient-to-br from-yellow-400/30 to-yellow-600/50 border border-yellow-500/20 relative">
            <div className="absolute inset-2 border-t border-b border-yellow-500/20" />
            <div className="absolute inset-2 border-l border-r border-yellow-500/20" />
          </div>
          <div className="space-y-4">
            <div className="text-[12px] font-black tracking-[0.3em] text-zinc-500 opacity-60 uppercase">Platinum Member</div>
            <div className="flex gap-3 text-[18px] font-black tracking-[0.1em] text-white/90">
              <span>••••</span> <span>••••</span> <span>••••</span> <span className="text-[14px]">8492</span>
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div className="space-y-0.5">
              <div className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Exp. Date</div>
              <div className="text-[11px] font-bold text-white/70">12/28</div>
            </div>
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-rose-500/80 backdrop-blur-sm border border-white/10" />
              <div className="w-8 h-8 rounded-full bg-amber-500/80 backdrop-blur-sm border border-white/10" />
            </div>
          </div>
        </motion.div>
      );

    case "PayPal":
      return (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={cn(containerClasses, "bg-gradient-to-br from-blue-600 to-blue-800 border-blue-500/30 text-white")}
        >
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="flex justify-between items-start">
            <PaypalLogo size={32} weight="fill" className="text-white/90" />
            <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
              Verified
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-widest text-blue-200/50">Linked Account</div>
            <div className="text-[16px] font-bold tracking-tight">c.chaplin@icloud.com</div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-200/50">
            <ShieldCheck weight="fill" className="text-emerald-400" /> Instant Digital Settlement
          </div>
        </motion.div>
      );

    case "Bank Transfer":
      return (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(containerClasses, "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100")}
        >
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(to right, #888 1px, transparent 1px), linear-gradient(to bottom, #888 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="flex justify-between items-start relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
              <Bank size={24} weight="duotone" className="text-zinc-500" />
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Network</div>
              <div className="text-[12px] font-bold">SWIFT / SEPA</div>
            </div>
          </div>
          <div className="relative z-10">
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Transaction Ref</div>
            <div className="text-[15px] font-black tracking-widest font-mono">TRX-9830-X82L</div>
          </div>
          <div className="relative z-10 flex items-center gap-2 py-1.5 px-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-100 dark:border-emerald-800/50 w-fit">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Processed Securely</span>
          </div>
        </motion.div>
      );

    case "Insurance":
      return (
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={cn(containerClasses, "bg-gradient-to-br from-emerald-600 to-emerald-800 border-emerald-500/30 text-white")}
        >
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <FileText size={20} weight="bold" />
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-200/60">Policy Type</div>
              <div className="text-[13px] font-bold">Full Medical Coverage</div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-200/60 font-mono">Certificate No</div>
            <div className="text-[18px] font-black tracking-[0.2em] font-mono leading-none">POL-0034-88A</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-emerald-400/20 rounded-lg text-[10px] font-black tracking-widest uppercase border border-emerald-400/30">
              Verified Claims Provider
            </div>
          </div>
        </motion.div>
      );

    default: // Internal / Wallet
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(containerClasses, "bg-gradient-to-br from-indigo-600 to-indigo-800 border-indigo-500/30 text-white")}
        >
          <div className="absolute right-0 bottom-0 opacity-10">
            <Wallet size={120} weight="fill" />
          </div>
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/40 border border-indigo-400/30 flex items-center justify-center">
              <Wallet size={20} weight="bold" />
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black uppercase tracking-widest text-indigo-200/60">Balance Source</div>
              <div className="text-[13px] font-bold">In-Hospital Credit</div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-widest text-indigo-200/60 font-mono">Wallet ID</div>
            <div className="text-[18px] font-black tracking-tight leading-none uppercase">Hospital-A-662</div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-200/80">
            <div className="w-2 h-2 rounded-full bg-indigo-400" /> Internal Distribution Account
          </div>
        </motion.div>
      );
  }
}

export function RevenuePage() {
  const [activeTab, setActiveTab] = useState<"analytics" | "bills" | "invoices">("analytics");

  const tabs = [
    { id: "analytics", label: "Revenue Analytics", icon: ChartLineUp },
    { id: "bills", label: "Bills", icon: Receipt },
    { id: "invoices", label: "Invoices", icon: Wallet },
  ] as const;

  return (
    <div className="flex flex-col gap-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row mt-4 md:items-center justify-between gap-6 px-2">
        <div className="flex flex-col">
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
            Finance Hub
          </h1>
          <p className="text-[14px] text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
            A comprehensive view of your medical facility's financial health.
          </p>
        </div>

        {/* Tab Controls (Calendar Style) */}
        <div className="flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl p-1 md:ml-auto shadow-sm ring-1 ring-zinc-200/50 dark:ring-zinc-700/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all relative",
                activeTab === tab.id
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              )}
            >
              <tab.icon
                className={cn("w-4 h-4", activeTab === tab.id ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500")}
                weight={activeTab === tab.id ? "fill" : "bold"}
              />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabState"
                  className="absolute inset-0 bg-white dark:bg-zinc-700 rounded-lg -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="px-2"
        >
          {activeTab === "analytics" && <RevenueAnalyticsView />}
          {activeTab === "bills" && <BillsView />}
          {activeTab === "invoices" && (
            <div className="flex flex-col items-center justify-center p-20 bg-white dark:bg-zinc-900/50 rounded-[40px] border-2 border-dashed border-zinc-200 dark:border-zinc-800">
              <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                <Wallet className="w-8 h-8 text-zinc-400" />
              </div>
              <h3 className="text-lg font-black text-zinc-400 uppercase tracking-widest">Invoices Section</h3>
              <p className="text-zinc-400 font-medium">Coming soon: Advanced invoicing and payout management.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function RevenueAnalyticsView() {
  const [selectedPeriod, setSelectedPeriod] = useState("M");

  return (
    <div className="flex flex-col gap-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {REVENUE_STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg)}>
                  <stat.icon className={cn("w-5 h-5", stat.color)} weight="duotone" />
                </div>
                <div className={cn(
                  "flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-black",
                  stat.trendUp ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400" : "bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400"
                )}>
                  {stat.trendUp ? <TrendUp className="w-3 h-3" /> : <TrendDown className="w-3 h-3" />}
                  {stat.trend}
                </div>
              </div>
              <div>
                <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest leading-none">
                  {stat.label}
                </span>
                <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-1 tracking-tight">
                  {stat.value}
                </div>
              </div>
            </div>
            {/* Background design elements */}
            <div className={cn("absolute -bottom-4 -right-4 w-20 h-20 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity", stat.bg)} />
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card
            title="Revenue Performance"
            trailing={
              <div className="flex gap-1">
                {["D", "W", "M", "Y"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedPeriod(t)}
                    className={cn(
                      "w-7 h-7 rounded-lg text-[10px] font-black flex items-center justify-center transition-all",
                      selectedPeriod === t
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                        : "text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            }
          >
            <div className="flex flex-col pt-4">
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">€48,250.00</span>
                <span className="text-emerald-500 text-sm font-bold flex items-center gap-0.5">
                  <ArrowUpRight className="w-4 h-4" /> 12.5%
                </span>
              </div>
              <div className="h-[300px] w-full mt-4">
                <VisualChart />
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card title="Revenue Distribution" trailing={null}>
            <RevenueDonutChart />
          </Card>
        </div>
      </div>
    </div>
  );
}

function BillsView() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [filteredBills, setFilteredBills] = useState(BILLS_DATA);
  const [selectedBill, setSelectedBill] = useState<typeof BILLS_DATA[0] | null>(null);

  const filterOptions = [
    { label: "All", count: 35 },
    { label: "Received", count: 15 },
    { label: "Sent", count: 5 },
    { label: "Convert", count: 10 },
  ];

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    if (filter === "All") {
      setFilteredBills(BILLS_DATA);
    } else {
      setFilteredBills(BILLS_DATA.filter(b => b.type === filter || (filter === "Convert" && b.type === "Converted")));
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Dialog open={!!selectedBill} onOpenChange={(open) => !open && setSelectedBill(null)}>
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 px-1">
          {/* Period Dropdowns */}
          <button className="flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-colors shadow-sm">
            Last 7 days <CaretDown className="w-3 h-3 text-zinc-400" />
          </button>
          <button className="flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-colors shadow-sm">
            <CalendarIcon className="w-3.5 h-3.5 text-zinc-400" /> 15 Mar – 22 Mar <CaretDown className="w-3 h-3 text-zinc-400" />
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700 mx-1" />

          {/* Segmented Control */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl border border-zinc-200/60 dark:border-zinc-700/50 shadow-inner">
            {filterOptions.map((opt) => (
              <button
                key={opt.label}
                onClick={() => handleFilterClick(opt.label)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                  activeFilter === opt.label
                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                )}
              >
                {opt.label}
                <span className={cn(
                  "text-[10px] font-black tabular-nums",
                  activeFilter === opt.label ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-400 dark:text-zinc-600"
                )}>
                  {opt.count}
                </span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700 mx-1" />

          <button className="flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-colors shadow-sm">
            Currency <CaretDown className="w-3 h-3 text-zinc-400" />
          </button>
        </div>

        <div className="bg-white dark:bg-zinc-900/40 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800/50">
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Generated By</th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Payment Method</th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50/50 dark:divide-zinc-800/20">
                {filteredBills.map((bill, i) => (
                  <motion.tr
                    key={bill.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedBill(bill)}
                    className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all cursor-pointer"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9 border border-zinc-100 dark:border-zinc-800 transition-transform group-hover:scale-110">
                          <AvatarImage src={bill.avatar} alt={bill.generatedBy} />
                          <AvatarFallback className="text-[10px] font-bold">
                            {bill.generatedBy.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100">{bill.generatedBy}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100">{bill.date}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-[14px] font-black text-zinc-900 dark:text-zinc-100">
                          {bill.type === "Sent" ? "-" : "+"} {bill.amount.toFixed(2)} EUR
                        </span>
                        <span className="text-[11px] font-bold text-zinc-400">{bill.subAmount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-zinc-800 dark:text-zinc-200">{bill.method}</span>
                        <span className="text-[11px] font-black text-zinc-400 uppercase tracking-tighter opacity-70">
                          {bill.methodDetails}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-full ring-1 ring-inset transition-colors",
                        bill.status === "Success" ? "bg-emerald-50 text-emerald-600 ring-emerald-100 dark:bg-emerald-950/20 dark:ring-emerald-800/40" :
                          bill.status === "Incomplete" ? "bg-zinc-100 text-zinc-600 ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-700" :
                            "bg-rose-50 text-rose-600 ring-rose-100 dark:bg-rose-950/20 dark:ring-rose-800/40"
                      )}>
                        {bill.status === "Success" ? <CheckCircle className="w-3.5 h-3.5" /> :
                          bill.status === "Incomplete" ? <WarningCircle className="w-3.5 h-3.5" /> :
                            <XCircle className="w-3.5 h-3.5" />}
                        {bill.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                        {bill.description}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-[32px]">
          {selectedBill && (
            <div className="flex flex-col md:flex-row h-full min-h-[400px]">
              {/* Left Side: Receipt Brand & Main Info */}
              <div className="md:w-[320px] bg-zinc-900 dark:bg-zinc-800 text-white p-8 flex flex-col relative overflow-hidden">
                <div className="relative z-10 flex flex-col h-full">
                  <div className="mb-10">
                    <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-500 mb-2">Invoice Details</h2>
                    <div className="text-4xl font-black tracking-tighter">#{selectedBill.id}</div>
                  </div>

                  <div className="space-y-6 flex-1">
                    <PaymentVisual method={selectedBill.method} />

                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Total Amount</div>
                      <div className="text-3xl font-black tracking-tighter">€{selectedBill.amount.toFixed(2)}</div>
                      <div className="text-[12px] font-bold text-zinc-400 mt-1 opacity-80">{selectedBill.subAmount}</div>
                    </div>

                    <div className={cn(
                      "inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                      selectedBill.status === "Success" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                        selectedBill.status === "Incomplete" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" :
                          "bg-rose-500/20 text-rose-400 border-rose-500/30"
                    )}>
                      {selectedBill.status}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-zinc-700/50 mt-auto">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Issued On</span>
                      <span className="text-sm font-bold">{selectedBill.date}</span>
                    </div>
                  </div>
                </div>

                {/* ZigZag Divider effect (visual only, rotated for horizontal layout) */}
                <div className="hidden md:block absolute top-0 right-0 bottom-0 w-4 bg-white dark:bg-zinc-900 z-20" style={{ clipPath: "polygon(100% 0, 0 5%, 100% 10%, 0 15%, 100% 20%, 0 25%, 100% 30%, 0 35%, 100% 40%, 0 45%, 100% 50%, 0 55%, 100% 60%, 0 65%, 100% 70%, 0 75%, 100% 80%, 0 85%, 100% 90%, 0 95%, 100% 100%)" }} />
              </div>

              {/* Right Side: Detailed Breakdown & Actions */}
              <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900 overflow-hidden">
                <div className="p-10 space-y-10">
                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Patient Details</span>
                        <p className="text-lg font-black text-zinc-900 dark:text-zinc-100">{selectedBill.patient}</p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Activity / Description</span>
                        <p className="text-[14px] font-bold text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          {selectedBill.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border border-zinc-100 dark:border-zinc-700">
                          <AvatarImage src={selectedBill.avatar} alt={selectedBill.generatedBy} />
                          <AvatarFallback className="text-xs font-bold">
                            {selectedBill.generatedBy.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Generated By</div>
                          <div className="text-[14px] font-bold">{selectedBill.generatedBy}</div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Billing Method</span>
                        <div className="flex items-center gap-2">
                          <CreditCard weight="bold" className="text-zinc-400" />
                          <span className="text-[14px] font-bold">{selectedBill.method}</span>
                        </div>
                        <span className="text-[11px] font-black text-zinc-400 uppercase tracking-tighter">{selectedBill.methodDetails}</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-[32px] p-8 border border-zinc-100 dark:border-zinc-800/50 relative overflow-hidden group">
                    <div className="flex justify-between items-center relative z-10">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Service Category</span>
                        <p className="text-xl font-black text-zinc-900 dark:text-white mt-1">{selectedBill.category}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Net Amount</span>
                        <p className="text-3xl font-black text-zinc-900 dark:text-white mt-1 tracking-tighter">€{selectedBill.amount.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-auto p-10 bg-zinc-50/50 dark:bg-zinc-800/20 border-t border-zinc-100 dark:border-zinc-800/50 flex items-center gap-4">
                  <button className="flex-1 flex items-center justify-center gap-2 h-14 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-[20px] text-[14px] font-bold shadow-xl shadow-zinc-200 dark:shadow-none hover:scale-[1.02] transition-transform active:scale-95">
                    <DownloadSimple weight="bold" size={20} /> Download Invoice PDF
                  </button>
                  <div className="flex gap-2">
                    <button className="w-14 h-14 flex items-center justify-center rounded-[20px] bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-colors shadow-sm">
                      <Printer weight="bold" size={22} />
                    </button>
                    <button className="w-14 h-14 flex items-center justify-center rounded-[20px] bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-colors shadow-sm">
                      <EnvelopeSimple weight="bold" size={22} />
                    </button>
                    <button className="w-14 h-14 flex items-center justify-center rounded-[20px] bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-colors shadow-sm">
                      <DotsThreeVertical weight="bold" size={22} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RevenueDonutChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const departments = [
    { label: "Cardiology", value: 35, color: "bg-blue-500", stroke: "#3b82f6" },
    { label: "Radiology", value: 25, color: "bg-purple-500", stroke: "#a855f7" },
    { label: "Pediatrics", value: 20, color: "bg-emerald-500", stroke: "#10b981" },
    { label: "Others", value: 20, color: "bg-zinc-400", stroke: "#a1a1aa" },
  ];

  const radius = 42;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  return (
    <div className="flex flex-col gap-8 pt-6">
      <div className="flex justify-center mb-4">
        <div className="relative w-[220px] h-[220px]">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full -rotate-90"
          >
            {/* Background Ring */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-zinc-50 dark:text-zinc-800/50"
            />

            {departments.map((d, i) => {
              const percentage = d.value / 100;
              const segmentLength = percentage * circumference;
              const offset = currentOffset;
              currentOffset += segmentLength;

              const isHovered = hoveredIndex === i;

              return (
                <motion.circle
                  key={d.label}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke={d.stroke}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={`${segmentLength - 2} ${circumference - (segmentLength - 2)}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="round"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  initial={{ strokeDashoffset: -offset, opacity: 0, scale: 0.95 }}
                  animate={{
                    strokeDashoffset: -offset,
                    opacity: 1,
                    scale: isHovered ? 1.05 : 1,
                  }}
                  transition={{
                    opacity: { duration: 1, delay: i * 0.1 },
                    scale: { type: "spring", stiffness: 300, damping: 15 },
                    strokeWidth: { duration: 0.2 },
                  }}
                  className="cursor-pointer transition-all duration-300"
                  style={{ transformOrigin: "center" }}
                />
              );
            })}
          </svg>

          {/* Center Info */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <motion.span
              key={hoveredIndex ?? "total"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1"
            >
              {hoveredIndex !== null ? departments[hoveredIndex].label : "Total Revenue"}
            </motion.span>
            <motion.span
              key={hoveredIndex !== null ? "val-" + hoveredIndex : "val-total"}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-2xl font-black text-zinc-900 dark:text-zinc-100 leading-none tracking-tighter"
            >
              {hoveredIndex !== null ? `${departments[hoveredIndex].value}%` : "€48,250"}
            </motion.span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        {departments.map((d, i) => (
          <motion.div
            key={d.label}
            className={cn(
              "flex items-center justify-between p-2 rounded-xl transition-all border border-transparent",
              hoveredIndex === i ? "bg-zinc-50 dark:bg-zinc-800 border-zinc-200/50 dark:border-zinc-700/50" : ""
            )}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn("w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]", d.color)}
                style={{ backgroundColor: d.stroke }}
              />
              <span className="text-[13px] font-bold text-zinc-600 dark:text-zinc-300">
                {d.label}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[14px] font-black text-zinc-900 dark:text-zinc-100">
                €{Math.round(48250 * (d.value / 100)).toLocaleString()}
              </span>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">
                {d.value}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
