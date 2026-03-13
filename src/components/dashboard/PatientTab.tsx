/**
 * Patient Tab - Manage patient records
 */
import { Stethoscope, ExternalLink, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PatientRecord {
  id: string;
  name: string;
  status: string;
  appointment: string;
  type: string;
}

export function PatientTab() {
  const patients: PatientRecord[] = [
    {
      id: "P-4392",
      name: "Jean-Pierre Durand",
      status: "Follow-up",
      appointment: "Today, 10:30",
      type: "Cardiology",
    },
    {
      id: "P-8821",
      name: "Marie-Louise Petit",
      status: "Emergency",
      appointment: "Today, 11:45",
      type: "Pediatrics",
    },
    {
      id: "P-1294",
      name: "Luc Moreau",
      status: "Checkup",
      appointment: "Tomorrow, 09:00",
      type: "General",
    },
    {
      id: "P-7730",
      name: "Emma Dubois",
      status: "Discharged",
      appointment: "Done",
      type: "Neurology",
    },
  ];

  return (
    <div className="space-y-10 pb-10">


      {/* Hero Section */}
      <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-200 dark:shadow-none">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-3 tracking-tight">
            Patient Records Portal
          </h2>
          <p className="text-blue-100 text-[15px] max-w-lg leading-relaxed opacity-90">
            Manage your patient visits, medical history, and treatment plans in
            one unified professional portal.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12">
          <Stethoscope className="w-64 h-64" />
        </div>
        <div className="absolute top-1/2 right-12 -translate-y-1/2 flex gap-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 text-center min-w-28 border border-white/10">
            <div className="text-3xl font-bold">12</div>
            <div className="text-[11px] font-bold uppercase tracking-widest opacity-70 mt-1">
              Today
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 text-center min-w-28 border border-white/10">
            <div className="text-3xl font-bold">156</div>
            <div className="text-[11px] font-bold uppercase tracking-widest opacity-70 mt-1">
              Active
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[32px] overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/20">
          <span className="text-[14px] font-bold px-1">
            Recent Patients Activity
          </span>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
            View Full List <ExternalLink className="w-3 h-3" />
          </button>
        </div>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {patients.map((patient, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-5 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-[13px] text-zinc-400 group-hover:bg-white dark:group-hover:bg-zinc-700 transition-colors border border-zinc-100/50 dark:border-zinc-700/50">
                  {patient.id.split("-")[1]}
                </div>
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 text-[15px]">
                    {patient.name}
                  </h5>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[12px] text-zinc-400">
                      {patient.type}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                    <span className="text-[12px] text-zinc-400 font-medium">
                      ID: {patient.id}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-10">
                <div className="text-right">
                  <div className="text-[13px] font-bold text-zinc-800 dark:text-zinc-200">
                    {patient.appointment}
                  </div>
                  <div
                    className={cn(
                      "text-[11px] font-black uppercase tracking-widest mt-0.5",
                      patient.status === "Emergency"
                        ? "text-rose-500"
                        : patient.status === "Follow-up"
                          ? "text-blue-500"
                          : "text-emerald-500"
                    )}
                  >
                    {patient.status}
                  </div>
                </div>
                <button className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 opacity-0 group-hover:opacity-100 hover:bg-zinc-900 dark:hover:bg-zinc-100 hover:text-white dark:hover:text-zinc-900 transition-all shadow-sm">
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
