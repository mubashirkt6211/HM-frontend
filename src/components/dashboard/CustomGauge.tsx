import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

/**
 * CustomGauge - Premium radial gauge component.
 * Uses SVG + framer-motion for smooth animated stroke.
 * Props:
 *   label: Display name of metric.
 *   value: Formatted value string (e.g., "83%", "18 min").
 *   percent: 0‑100 number representing the filled portion.
 *   color: Hex color for the gauge stroke.
 *   changeText: Text indicating change (e.g., "+1.4%" or "-4m").
 *   changePositive: Whether the change is positive (affects color).
 *   active: Highlights the card when selected.
 *   onClick: Click handler.
 */
export function CustomGauge({
  label,
  value,
  percent,
  color = "#3b82f6",
  changeText = "",
  changePositive = true,
  active = false,
  onClick,
}: {
  label: string;
  value: string;
  percent: number;
  color?: string;
  changeText?: string;
  changePositive?: boolean;
  active?: boolean;
  onClick?: () => void;
}) {
  const radius = 28;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  // subtle pulse when active
  const [isHover, setHover] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn(
        "relative rounded-2xl p-4 cursor-pointer transition-all duration-300",
        active
 ? "bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 shadow-lg scale-105"
 : "bg-white/80 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 hover:bg-white/90 dark:hover:bg-zinc-900/90 shadow-sm"
      )}
    >
      {/* Glassy overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/30 to-white/10 dark:from-zinc-800/30 dark:to-zinc-800/10 backdrop-blur-sm" />

      <div className="flex flex-col items-center space-y-2">
        <p className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider">
          {label}
        </p>
        <svg width={70} height={70} className="overflow-visible">
          {/* background circle */}
          <circle
            cx={35}
            cy={35}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-zinc-200 dark:text-zinc-800"
          />
          {/* animated foreground */}
          <motion.circle
            cx={35}
            cy={35}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference, opacity: 0 }}
            animate={{ strokeDashoffset: offset, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <p className="text-2xl font-bold text-zinc-900 dark:text-white">{value}</p>
        {changeText && (
          <p
            className={cn(
              "text-xs font-medium",
              changePositive ? "text-emerald-500" : "text-rose-500"
            )}
          >
            {changePositive ? "+" : "-"}
            {changeText}
          </p>
        )}
      </div>
    </div>
  );
}
