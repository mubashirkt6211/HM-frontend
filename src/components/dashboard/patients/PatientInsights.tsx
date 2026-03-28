import { motion } from "motion/react";
import { Users, ChartPieSlice } from "@phosphor-icons/react";



function AreaChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  const height = 100;
  const width = 300;

  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((d - min) / range) * height
  }));

  const pathContent = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaContent = `${pathContent} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className="relative w-full h-48 mt-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          d={pathContent}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <motion.path
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          d={areaContent}
          fill="url(#gradient)"
        />
        <motion.circle
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r="4"
          fill={color}
          className="shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        />
      </svg>
    </div>
  );
}

function StatusDistribution() {
  const statuses = [
    { label: "Discharged", value: 432, total: 635, color: "#10b981", shadow: "rgba(16, 185, 129, 0.4)" },
    { label: "Emergency", value: 156, total: 635, color: "#f43f5e", shadow: "rgba(244, 63, 94, 0.4)" },
    { label: "Follow-up", value: 47, total: 635, color: "#6366f1", shadow: "rgba(99, 102, 241, 0.4)" },
  ];

  const total = statuses.reduce((acc, s) => acc + s.value, 0);
  const r = 50;
  const circ = 2 * Math.PI * r;
  let currentOffset = 0;

  return (
    <div className="flex flex-col xl:flex-row items-center gap-6 py-2">
      <div className="relative w-32 h-32 xl:w-40 xl:h-40 shrink-0 group">
        <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90 filter drop-shadow-xl overflow-visible">
          <circle cx="60" cy="60" r={r} fill="none" stroke="currentColor" strokeWidth="8" className="text-zinc-100 dark:text-zinc-800/50" />
          {statuses.map((s, i) => {
            const pct = s.value / total;
            const strokeDasharray = `${pct * circ} ${circ * (1 - pct)}`;
            const strokeDashoffset = -currentOffset;
            currentOffset += pct * circ;

            return (
              <motion.circle
                key={s.label}
                cx="60"
                cy="60"
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth="12"
                strokeDasharray={strokeDasharray}
                initial={{ strokeDashoffset: circ, opacity: 0 }}
                animate={{ strokeDashoffset, opacity: 1 }}
                transition={{ duration: 1.5, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                strokeLinecap="round"
                className="cursor-pointer transition-all duration-300 hover:stroke-[16px]"
                style={{ filter: `drop-shadow(0 0 6px ${s.shadow})` }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <motion.span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Total</motion.span>
          <motion.span className="text-xl xl:text-2xl font-black text-zinc-900 dark:text-white">{total}</motion.span>
        </div>
      </div>

      <div className="grid grid-cols-1 w-full gap-2">
        {statuses.map((s, i) => (
          <motion.div 
            key={s.label}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/50 dark:bg-zinc-800/30 border border-zinc-800/50 group/item hover:bg-zinc-900 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color, boxShadow: `0 0 8px ${s.color}` }} />
              <div className="flex flex-col">
                 <span className="text-[11px] font-bold text-zinc-100">{s.label}</span>
                 <span className="text-[9px] font-medium text-zinc-500">{Math.round((s.value/total)*100)}%</span>
              </div>
            </div>
            <span className="text-[12px] font-black text-zinc-100">{s.value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function PatientInsights() {
  const trafficData = [45, 52, 48, 70, 65, 85, 78];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-2 mb-8">
      {/* Total Patients & Growth */}
      <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-100 dark:border-zinc-800 p-8 shadow-sm overflow-hidden relative group">
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Patient Traffic</h4>
              <p className="text-[32px] font-black text-zinc-900 dark:text-zinc-100 mt-1">1,284 <span className="text-[14px] text-emerald-500 font-bold ml-1">+12.5%</span></p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
              <Users weight="duotone" className="w-6 h-6 text-indigo-500" />
            </div>
          </div>
          
          <div className="flex-1 mt-4">
             <AreaChart data={trafficData} color="#6366f1" />
          </div>

          <div className="flex items-center justify-between mt-6 pt-6 border-t border-zinc-50 dark:border-zinc-800">
            <div className="flex gap-8">
              <div>
                <p className="text-[11px] font-bold text-zinc-400 uppercase">New</p>
                <p className="text-[18px] font-black text-zinc-900 dark:text-zinc-100">432</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-zinc-400 uppercase">Returning</p>
                <p className="text-[18px] font-black text-zinc-900 dark:text-zinc-100">852</p>
              </div>
            </div>
            <button className="text-[12px] font-bold text-indigo-500 hover:underline">View Report</button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full -mr-20 -mt-20 group-hover:bg-indigo-500/10 transition-all" />
      </div>

      {/* Distribution & Capacity */}
      <div className="bg-zinc-950 dark:bg-zinc-900 rounded-[32px] p-8 text-white shadow-2xl shadow-zinc-200 dark:shadow-none relative overflow-hidden group">
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Status Distribution</h4>
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700">
              <ChartPieSlice weight="duotone" className="w-5 h-5 text-emerald-400" />
            </div>
          </div>

          <div className="flex-1 px-1 overflow-visible">
            <StatusDistribution />
          </div>

          <div className="mt-8 space-y-4">
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-bold text-zinc-400">Bed Capacity</span>
                <span className="text-[13px] font-black text-emerald-400">82%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "82%" }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                />
              </div>
            </div>
            <p className="text-[12px] text-zinc-500 text-center font-medium">Auto-refreshing in 5m</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full -ml-10 -mb-10 group-hover:bg-emerald-500/20 transition-all" />
      </div>
    </div>
  );
}
