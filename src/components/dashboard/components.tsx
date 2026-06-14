/**
 * Shared Dashboard Components
 * Reusable components used across dashboard tabs
 */
import { motion, AnimatePresence } from "motion/react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area } from "recharts";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Helper function to calculate a smooth bezier curve path for SVG
function getBezierPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cpX1 = p0.x + (p1.x - p0.x) / 3;
    const cpY1 = p0.y;
    const cpX2 = p0.x + 2 * (p1.x - p0.x) / 3;
    const cpY2 = p1.y;
    d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
  }
  return d;
}

/**
 * Card Component - Reusable card container
 */
export function Card({
  title,
  trailing,
  children,
  className,
}: {
  title: string;
  trailing?: any;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("bg-white dark:bg-[#191919] border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 transition-all flex flex-col", className)}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[14px] font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">
          {title}
        </h3>
        {trailing && (
          <div className="text-[12px] font-medium text-zinc-500 dark:text-zinc-400">
            {trailing}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

/**
 * Visual Chart Component - Recharts implementation for smooth line chart with area gradient.
 */
export function VisualChart({
  data = [45, 52, 48, 70, 65, 85, 78, 92, 88, 100],
  labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"],
  color = "#3b82f6",
  gradientColors = ["#3b82f6", "#1d4ed8"],
  height = 180,
  valueSuffix = "",
}: {
  data?: number[] | { label: string; value: number }[];
  labels?: string[];
  color?: string;
  gradientColors?: string[];
  height?: number;
  valueSuffix?: string;
}) {
  // Standardize data format for Recharts
  const chartData = (Array.isArray(data) ? data : []).map((d, i) => {
    const val = typeof d === "number" ? d : d.value;
    const label = typeof d === "object" && d.label ? d.label : labels[i] || `Point ${i + 1}`;
    return { label, value: val };
  });

  // Gradient definition (id unique per component instance)
  const gradientId = `gradient-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <ResponsiveContainer width="100%" height={height} className="mt-4">
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={gradientColors[0]} stopOpacity={0.4} />
            <stop offset="95%" stopColor={gradientColors[1] || gradientColors[0]} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="#9ca3af" />
        <YAxis hide={true} domain={['dataMin', 'dataMax']} />
        <Tooltip
  contentStyle={{ background: "rgba(0,0,0,0.6)", border: "none", borderRadius: 4, color: "#fff", padding: "4px 8px", fontSize: "11px", backdropFilter: "blur(8px)" }}
  formatter={(value: any) => `${value}${valueSuffix}`}
/>
        <Area type="monotone" dataKey="value" stroke={color} fillOpacity={1} fill={`url(#${gradientId})`} />
        <Line type="monotone" dataKey="value" stroke={color} dot={false} strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}

/**
 * Shared Mini Bar Chart Component - Interactive SVG-style columns
 */
export function MiniBarChart({
  data,
  color = "from-zinc-900 to-zinc-500 dark:from-zinc-100 dark:to-zinc-400",
  hoverColor = "from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300",
  valueSuffix = "",
}: {
  data: { label: string; value: number }[];
  color?: string;
  hoverColor?: string;
  valueSuffix?: string;
}) {
  const max = Math.max(...data.map((item) => item.value), 1);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="relative flex items-end gap-3 w-full pt-6">
      {data.map((item, i) => {
        const isHovered = hoveredIndex === i;
        return (
          <div
            key={item.label}
            className="flex min-w-0 flex-1 flex-col items-center gap-2 cursor-pointer group"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="relative flex h-36 w-full items-end justify-center rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/40 px-2 shadow-inner transition-colors hover:bg-zinc-100/50 dark:hover:bg-zinc-900/80">
              {/* Popover Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                    animate={{ opacity: 1, y: -4, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    className="absolute -top-10 z-30 pointer-events-none bg-zinc-950/95 dark:bg-zinc-900/95 text-white rounded-lg px-2.5 py-1 text-[11px] font-bold shadow-xl border border-zinc-850 dark:border-zinc-800 backdrop-blur-md whitespace-nowrap"
                  >
                    {item.value}
                    {valueSuffix}
                    <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-zinc-950 dark:bg-zinc-900 border-r border-b border-zinc-850 dark:border-zinc-800" />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(item.value / max) * 100}%` }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className={cn(
                  "w-full max-w-10 rounded-t-xl bg-gradient-to-t shadow-[0_-2px_10px_rgba(0,0,0,0.05)] transition-all duration-300",
                  isHovered ? hoverColor : color
                )}
              />
            </div>
            <div className="text-center transition-colors">
              <p className={cn("text-[11px] font-semibold text-zinc-400 dark:text-zinc-500", isHovered && "text-zinc-600 dark:text-zinc-350")}>
                {item.label}
              </p>
              <p className={cn("text-[12px] font-black text-zinc-900 dark:text-zinc-100", isHovered && "text-blue-600 dark:text-blue-400")}>
                {item.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}


/**
 * Filter Button Component
 */
export function FilterBtn({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded text-[13px] font-medium transition-all",
        active
          ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
          : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
      )}
    >
      {label}
    </button>
  );
}

/**
 * Tab Item Component
 */
export function TabItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 px-5 py-4 text-[14px] font-bold transition-all relative whitespace-nowrap",
        active
          ? "text-zinc-900 dark:text-zinc-100 -mt-0.5"
          : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
      )}
    >
      <Icon
        className={cn(
          "w-4.5 h-4.5",
          active
            ? "text-zinc-900 dark:text-zinc-100"
            : "text-zinc-400"
        )}
      />
      {label}
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute -bottom-px left-0 right-0 h-0.75 bg-zinc-900 dark:bg-zinc-100 rounded-full"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </button>
  );
}

/**
 * Info Row Component
 */
export function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-5 group">
      <div className="w-11 h-11 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center border border-zinc-100 dark:border-zinc-700 transition-all group-hover:bg-zinc-900 dark:group-hover:bg-zinc-100 group-hover:scale-110 shadow-sm">
        <Icon className="w-5 h-5 text-zinc-400 group-hover:text-white dark:group-hover:text-zinc-900 transition-colors" />
      </div>
      <div className="flex flex-col">
        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1.5">
          {label}
        </span>
        <span className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          {value}
        </span>
      </div>
    </div>
  );
}

/**
 * Activity Item Component
 */
export function ActivityItem({ label, time }: { label: string; time: string }) {
  return (
    <div className="flex items-start gap-5 p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group">
      <div className="mt-2 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] group-hover:scale-125 transition-transform" />
      <div className="flex flex-col">
        <span className="text-[14px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight mb-1">
          {label}
        </span>
        <span className="text-[12px] text-zinc-400">{time}</span>
      </div>
    </div>
  );
}
/**
 * CossTable - Premium High-fidelity Table for Medical Data
 */
export function CossTable({
  columns,
  data,
  className
}: {
  columns: { key: string; label: string; width?: string; align?: "left" | "center" | "right" }[];
  data: any[];
  className?: string;
}) {
  return (
    <div className={cn("w-full overflow-x-auto no-scrollbar", className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-zinc-100 dark:border-zinc-800/50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "pb-4 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] text-left px-4 first:pl-0 last:pr-0",
                  col.align === "center" && "text-center",
                  col.align === "right" && "text-right"
                )}
                style={{ width: col.width }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/30">
          {data.map((row, i) => (
            <motion.tr
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group/row hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "py-4 px-4 text-[13px] font-medium text-zinc-600 dark:text-zinc-400 first:pl-0 last:pr-0",
                    col.align === "center" && "text-center",
                    col.align === "right" && "text-right"
                  )}
                >
                  {row[col.key]}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles = {
    Critical: "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400",
    Normal: "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300",
    Pending: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    High: "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400",
    Low: "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300",
  };

  const current = styles[status as keyof typeof styles] || "bg-zinc-100 dark:bg-zinc-800 text-zinc-600";

  return (
    <span className={cn("px-2 py-0.5 rounded text-[11px] font-medium", current)}>
      {status}
    </span>
  );
}

/**
 * HeroBanner - Swiggy-style promotional banner
 */
export function HeroBanner({
  title,
  subtitle,
  image,
  ctaText
}: {
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full h-[280px] rounded-[40px] overflow-hidden group shadow-2xl"
    >
      <img src={image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/90 via-zinc-900/40 to-transparent flex flex-col justify-center p-12">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="inline-block px-3 py-1 rounded-full bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest mb-4">
            Exclusive
          </span>
          <h2 className="text-4xl font-black text-white mb-3 tracking-tighter leading-tight max-w-md">
            {title}
          </h2>
          <p className="text-zinc-200 text-lg font-medium mb-8 max-w-sm leading-relaxed">
            {subtitle}
          </p>
          <button className="px-8 py-3.5 rounded-2xl bg-white text-zinc-900 font-black uppercase tracking-widest text-xs hover:bg-blue-500 hover:text-white transition-all shadow-xl active:scale-95">
            {ctaText}
          </button>
        </motion.div>
      </div>

      {/* Glossy overlay */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-gradient-to-tr from-white/5 to-transparent opacity-50" />
    </motion.div>
  );
}

export function CategoryCard({
  label,
  image,
  color
}: {
  label: string;
  image: string;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="flex flex-col items-center gap-4 group cursor-pointer"
    >
      <div className={cn(
        "w-28 h-28 rounded-[35px] overflow-hidden p-6 transition-all shadow-xl group-hover:shadow-2xl group-hover:rotate-3 backdrop-blur-xl border border-white/20 dark:border-white/10",
        color.replace('bg-', 'bg-opacity-40 bg-')
      )}>
        <img
          src={image}
          className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform group-hover:scale-125 drop-shadow-sm"
        />
      </div>
      <span className="text-[14px] font-black text-zinc-600 dark:text-zinc-400 uppercase tracking-widest text-center group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
        {label}
      </span>
    </motion.div>
  );
}

/**
 * Shared Interactive Donut Chart Component
 */
export function DonutChart({
  data,
  totalLabel = "Total",
  totalValue = "",
}: {
  data: { label: string; value: number; color: string; stroke: string }[];
  totalLabel?: string;
  totalValue?: string;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const radius = 42;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  return (
    <div className="flex flex-col gap-6 pt-4">
      <div className="flex justify-center mb-2">
        <div className="relative w-[190px] h-[190px]">
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
              className="text-zinc-100 dark:text-zinc-900/40"
            />

            {data.map((d, i) => {
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
                  strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
                  strokeDasharray={`${segmentLength - 1.5} ${circumference - (segmentLength - 1.5)}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="round"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  initial={{ strokeDashoffset: -offset, opacity: 0, scale: 0.95 }}
                  animate={{
                    strokeDashoffset: -offset,
                    opacity: 1,
                    scale: isHovered ? 1.04 : 1,
                  }}
                  transition={{
                    opacity: { duration: 1, delay: i * 0.08 },
                    scale: { type: "spring", stiffness: 300, damping: 15 },
                    strokeWidth: { duration: 0.15 },
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
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none mb-1.5"
            >
              {hoveredIndex !== null ? data[hoveredIndex].label : totalLabel}
            </motion.span>
            <motion.span
              key={hoveredIndex !== null ? "val-" + hoveredIndex : "val-total"}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xl font-black text-zinc-900 dark:text-zinc-100 leading-none tracking-tighter"
            >
              {hoveredIndex !== null ? `${data[hoveredIndex].value}%` : totalValue}
            </motion.span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-2">
        {data.map((d, i) => (
          <motion.div
            key={d.label}
            className={cn(
              "flex items-center justify-between p-2 rounded-xl transition-all border border-transparent",
              hoveredIndex === i ? "bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200/50 dark:border-zinc-800/40 shadow-sm" : ""
            )}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm", d.color)}
                style={{ backgroundColor: d.stroke }}
              />
              <span className="text-[12px] font-bold text-zinc-600 dark:text-zinc-350 truncate">
                {d.label}
              </span>
            </div>
            <span className="text-[12px] font-black text-zinc-900 dark:text-zinc-100 pl-1">
              {d.value}%
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
