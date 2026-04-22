/**
 * Shared Dashboard Components
 * Reusable components used across dashboard tabs
 */
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

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
    <div className={cn("bg-white dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 rounded-[40px] p-8 shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group", className)}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[14px] font-black text-zinc-900 dark:text-zinc-100 tracking-widest uppercase opacity-40 group-hover:opacity-100 transition-opacity">
          {title}
        </span>
        <div className="text-[14px] font-black text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 px-3 py-1 rounded-xl group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-zinc-100 dark:group-hover:text-zinc-900 transition-all">
          {trailing}
        </div>
      </div>
      {children}
    </div>
  );
}

/**
 * Visual Chart Component - SVG-based line chart
 */
export function VisualChart() {
  const data = [45, 52, 48, 70, 65, 85, 78, 92, 88, 100];
  const height = 100;
  const width = 400;
  const max = 100;
  const stepX = width / (data.length - 1);

  const points = data.map((d, i) => ({
    x: i * stepX,
    y: height - (d / max) * height,
  }));

  const pathData = points.reduce((acc, point, i) => {
    return i === 0 ? `M ${point.x},${point.y}` : `${acc} L ${point.x},${point.y}`;
  }, "");

  const areaData = `${pathData} L ${points[points.length - 1].x},${height} L 0,${height} Z`;

  return (
    <div className="relative w-full h-48 mt-8 group">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Grid Lines */}
        {[0, 25, 50, 75, 100].map((tick) => (
          <line
            key={tick}
            x1="0"
            y1={height - (tick / max) * height}
            x2={width}
            y2={height - (tick / max) * height}
            stroke="currentColor"
            className="text-zinc-100 dark:text-zinc-800/50"
            strokeWidth="1"
          />
        ))}

        <motion.path
          d={areaData}
          fill="url(#chartGradient)"
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          style={{ transformOrigin: "bottom" }}
          transition={{ duration: 1, delay: 0.2 }}
        />

        <motion.path
          d={pathData}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          filter="url(#glow)"
        />

        {points.map((p, i) => (
          <motion.g key={i}>
            <motion.circle
              cx={p.x}
              cy={p.y}
              r="4"
              fill="#3b82f6"
              stroke="white"
              strokeWidth="2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + i * 0.05 }}
              className="cursor-pointer"
            />
            <motion.text
              x={p.x}
              y={p.y - 12}
              textAnchor="middle"
              className="text-[6px] font-black fill-blue-600 dark:fill-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {data[i]}%
            </motion.text>
          </motion.g>
        ))}
      </svg>

      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-0 bottom-0 w-px bg-blue-500/20 left-1/2 -translate-x-1/2" />
      </motion.div>
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
        "px-5 py-2 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all",
        active
          ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-md ring-1 ring-zinc-200/50 dark:ring-zinc-600"
          : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800"
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
    Critical: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    Normal: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    High: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    Low: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  };

  const current = styles[status as keyof typeof styles] || "bg-zinc-500/10 text-zinc-600 border-zinc-500/20";

  return (
    <span className={cn("px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border", current)}>
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
