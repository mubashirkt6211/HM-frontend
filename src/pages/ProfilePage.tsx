/**
 * Profile Page - Standalone Profile View with Tabbed Card-Based Todo Tracker
 */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  EnvelopeSimple, 
  MapPin, 
  ShieldCheck, 
  Phone, 
  Briefcase, 
  Buildings,
  ArrowLeft,
  Camera,
  FileText,
  Target,
  ChatCircleText,
  Check,
  X,
  User,
  Plus,
  Trash,
  CheckCircle,
  Clock,
  Flag,
  Monitor,
  Layout,
  ChatDots,
  Circle
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import claraAvatar from "@/assets/clara_avatar.png";

// Initial Mock Data for Objectives with Rich Metadata
const INITIAL_OBJECTIVES = [
  { 
    id: 1, 
    title: "Review Website Design 2.0", 
    description: "C-level review phase",
    category: "Website",
    priority: "High",
    completed: false, 
    dueDate: "Tomorrow",
    comments: 5,
    progress: 20
  },
  { 
    id: 2, 
    title: "Review React Components", 
    description: "New react components code review",
    category: "Dashboard",
    priority: "Normal",
    completed: false, 
    dueDate: "25 April",
    comments: 5,
    progress: 0
  },
  { 
    id: 3, 
    title: "Mentor 3 junior designers", 
    description: "Bi-weekly sync and portfolio review",
    category: "Team",
    priority: "Normal",
    completed: true, 
    dueDate: "Completed",
    comments: 12,
    progress: 100
  },
  { 
    id: 4, 
    title: "High-Resolution Analytics Dashboard", 
    description: "Finalize SVG charting logic",
    category: "Clinical",
    priority: "High",
    completed: false, 
    dueDate: "Monday",
    comments: 8,
    progress: 45
  },
];

interface ProfilePageProps {
  onBack: () => void;
}

export function ProfilePage({ onBack }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState("Objectives");
  
  // 1. Centralized State for Objectives
  const [objectives, setObjectives] = useState(INITIAL_OBJECTIVES);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const tabs = [
    { id: "Infos", icon: UserIcon },
    { id: "Objectives", icon: Target },
    { id: "Documents", icon: FileText },
    { id: "Reviews", icon: ChatCircleText },
  ];

  // 2. Actions
  const toggleObjective = (id: number) => {
    setObjectives(prev => prev.map(obj => 
      obj.id === id ? { ...obj, completed: !obj.completed, progress: !obj.completed ? 100 : 0 } : obj
    ));
  };

  const deleteObjective = (id: number) => {
    setObjectives(prev => prev.filter(obj => obj.id !== id));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newTask = {
      id: Date.now(),
      title: newTitle,
      description: "Quickly added task",
      category: "Personal",
      priority: "Normal",
      completed: false,
      dueDate: "Today",
      comments: 0,
      progress: 0
    };
    setObjectives(prev => [...prev, newTask]);
    setNewTitle("");
    setIsAdding(false);
  };

  return (
    <div className="pb-24 max-w-5xl mx-auto px-4 md:px-0 min-h-screen">
      {/* 1. Top Navigation */}
      <div className="flex items-center justify-start py-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[13px] font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors group"
        >
          <ArrowLeft weight="bold" size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Dashboard
        </button>
      </div>

      {/* 2. Reference Header */}
      <div className="flex flex-col items-center justify-center space-y-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="relative group">
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white dark:border-zinc-900 shadow-xl ring-1 ring-zinc-200 dark:ring-zinc-800">
            <img src={claraAvatar} alt="Clara Lefèvre" className="w-full h-full object-cover" />
          </div>
          <button className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center shadow-lg hover:scale-110 transition-transform border-4 border-white dark:border-zinc-900">
            <Camera weight="fill" size={18} />
          </button>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">Clara Lefèvre</h1>
          <div className="flex items-center justify-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[11px] font-black uppercase tracking-wider border border-blue-100 dark:border-blue-800/50">R&D Product</span>
            <span className="text-[13px] font-bold text-zinc-400 dark:text-zinc-500">Product Manager</span>
          </div>
        </div>
      </div>

      {/* 3. Tab bar */}
      <div className="flex items-center justify-center mb-10 animate-in fade-in duration-1000">
        <div className="flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1.5 rounded-2xl shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-xl text-[13px] font-bold transition-all",
                activeTab === tab.id 
                  ? "bg-zinc-100/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white shadow-inner" 
                  : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
              )}
            >
              <tab.icon weight={activeTab === tab.id ? "fill" : "bold"} size={16} />
              {tab.id}
            </button>
          ))}
        </div>
        
        <div className="ml-8 hidden md:block">
           <button className="px-5 py-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-[13px] font-black flex items-center gap-2 hover:scale-105 transition-all shadow-md">
             Download PDF
           </button>
        </div>
      </div>

      {/* 4. Tab Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === "Objectives" && (
          <ObjectivesView 
            key="objectives" 
            objectives={objectives} 
            onToggle={toggleObjective}
            onDelete={deleteObjective}
            isAdding={isAdding}
            setIsAdding={setIsAdding}
            newTitle={newTitle}
            setNewTitle={setNewTitle}
            onAdd={handleAddTask}
          />
        )}
        {activeTab === "Infos" && <InfosView key="infos" />}
      </AnimatePresence>
    </div>
  );
}

// --------------------------------------------------------------------------------
// OBJECTIVES VIEW (TABBED CARD TRACKER)
// --------------------------------------------------------------------------------
function ObjectivesView({ 
  objectives, 
  onToggle, 
  onDelete,
  isAdding,
  setIsAdding,
  newTitle,
  setNewTitle,
  onAdd
}: any) {
  const [filterTab, setFilterTab] = useState("Pending");

  // 3. Reactive Logic
  const filteredObjectives = useMemo(() => {
    if (filterTab === "Pending") return objectives.filter((o: any) => !o.completed);
    if (filterTab === "Completed") return objectives.filter((o: any) => o.completed);
    return objectives;
  }, [objectives, filterTab]);

  const stats = useMemo(() => {
    const total = objectives.length;
    const completedCount = objectives.filter((o: any) => o.completed).length;
    const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;
    return { percentage, completedCount, total };
  }, [objectives]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-10 pb-20 max-w-5xl mx-auto"
    >
      {/* achievement Progress (Minimal) */}
      <div className="flex items-center justify-between px-2">
         <div className="space-y-1">
            <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight leading-none">To-do <span className="text-zinc-400 ml-1">{stats.total}</span></h3>
            <p className="text-[12px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Global Progress: {stats.percentage}%</p>
         </div>
         <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-all">
               <DotsThree size={24} weight="bold" />
            </button>
            <button 
              onClick={() => setIsAdding(true)}
              className="w-9 h-9 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center hover:scale-105 transition-all shadow-lg active:scale-95"
            >
               <Plus size={20} weight="bold" />
            </button>
         </div>
      </div>

      {/* Internal Tabs (Pending / Completed) */}
      <div className="flex items-center gap-1.5 p-1 bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl w-fit">
         {["All", "Pending", "Completed"].map(tab => (
           <button 
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={cn(
              "px-5 py-1.5 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all",
              filterTab === tab ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm" : "text-zinc-400 hover:text-zinc-600"
            )}
           >
             {tab}
           </button>
         ))}
      </div>

      {/* Task List (Grid) */}
      <div className="min-h-[400px] space-y-6">
        {isAdding && (
          <motion.form 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onSubmit={onAdd}
            className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] border-2 border-dashed border-indigo-200 dark:border-indigo-900/50 space-y-4"
          >
            <input 
              autoFocus
              className="w-full bg-transparent text-lg font-black text-zinc-950 dark:text-white outline-none placeholder:text-zinc-300"
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <div className="flex justify-end gap-2">
               <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 rounded-xl text-zinc-400 text-[12px] font-bold">Cancel</button>
               <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-[12px] font-black shadow-lg">Create Task</button>
            </div>
          </motion.form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredObjectives.map((obj: any) => (
              <TaskCard key={obj.id} obj={obj} onToggle={onToggle} onDelete={onDelete} />
            ))}
          </AnimatePresence>
        </div>

        {filteredObjectives.length === 0 && !isAdding && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
             <div className="w-16 h-16 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-300">
                <Target size={32} />
             </div>
             <p className="text-sm font-bold text-zinc-400">No tasks found in this category.</p>
          </div>
        )}
      </div>

      {/* Add Task Trigger (Minimal) */}
      {!isAdding && (
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full py-6 flex items-center justify-center gap-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 font-black text-sm group transition-all"
        >
          <Plus weight="bold" size={20} className="group-hover:rotate-90 transition-transform duration-500" />
          Add Task
        </button>
      )}
    </motion.div>
  );
}

// --------------------------------------------------------------------------------
// TASK CARD COMPONENT (REFERENCE STYLE)
// --------------------------------------------------------------------------------
function TaskCard({ obj, onToggle, onDelete }: any) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={cn(
        "group bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all relative overflow-hidden",
        obj.completed && "opacity-60 bg-zinc-50/50 dark:bg-zinc-950/20"
      )}
    >
      {/* 1. Header Badges */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 text-[10px] font-black uppercase tracking-widest border border-zinc-100 dark:border-zinc-700">
             <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" /> To do
          </div>
          
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
            obj.priority === "High" 
              ? "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800/50" 
              : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/50"
          )}>
             <Flag weight="fill" size={10} /> {obj.priority}
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-50 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-widest border border-zinc-100 dark:border-zinc-800">
             {obj.category === "Website" ? <Monitor weight="fill" size={10} /> : <Layout weight="fill" size={10} />} {obj.category}
          </div>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
           <button 
             onClick={() => onToggle(obj.id)}
             className={cn(
               "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
               obj.completed ? "bg-emerald-500 text-white" : "bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:text-emerald-500"
             )}
           >
             <Check weight="bold" size={14} />
           </button>
           <button 
             onClick={() => onDelete(obj.id)}
             className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-rose-500 transition-all"
           >
             <Trash weight="bold" size={14} />
           </button>
        </div>
      </div>

      {/* 2. Content */}
      <div className="space-y-2 mb-6 pointer-events-none">
        <h4 className={cn(
          "text-[18px] font-black text-zinc-950 dark:text-white tracking-tight leading-tight",
          obj.completed && "line-through text-zinc-400 dark:text-zinc-600"
        )}>
          {obj.title}
        </h4>
        <p className="text-[14px] font-bold text-zinc-400 dark:text-zinc-500 italic flex items-start gap-1.5">
           <span className="mt-1 leading-none text-zinc-300 dark:text-zinc-700">↳</span> {obj.description}
        </p>
      </div>

      {/* 3. Footer Metadata */}
      <div className="flex items-center justify-between pt-5 border-t border-zinc-50 dark:border-zinc-800/50">
         <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
               {[...Array(3)].map((_, i) => (
                 <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-200 dark:bg-zinc-800 overflow-hidden ring-1 ring-zinc-50 dark:ring-zinc-800">
                    <img src={`https://i.pravatar.cc/100?u=${obj.id + i}`} className="w-full h-full object-cover" />
                 </div>
               ))}
            </div>
            <div className="flex items-center gap-3 text-zinc-400 dark:text-zinc-600">
               <div className="flex items-center gap-1.5 text-[11px] font-black tracking-widest">
                  <ChatDots size={16} weight="bold" /> {obj.comments}
               </div>
               <div className={cn(
                 "flex items-center gap-1.5 text-[11px] font-black tracking-widest",
                 obj.dueDate === "Tomorrow" ? "text-orange-500 dark:text-orange-400" : "text-zinc-400 dark:text-zinc-600"
               )}>
                  <Clock size={16} weight="bold" /> {obj.dueDate}
               </div>
            </div>
         </div>

         <div className="flex items-center gap-2">
            <div className="relative w-5 h-5">
               <svg className="w-5 h-5 -rotate-90">
                  <circle 
                    cx="10" 
                    cy="10" 
                    r="8" 
                    className="stroke-zinc-100 dark:stroke-zinc-800" 
                    strokeWidth="2.5" 
                    fill="none" 
                  />
                  <motion.circle 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: obj.progress / 100 }}
                    cx="10" 
                    cy="10" 
                    r="8" 
                    className={cn(
                      obj.progress === 100 ? "stroke-emerald-500" : "stroke-zinc-300 dark:stroke-zinc-500"
                    )}
                    strokeWidth="2.5" 
                    fill="none" 
                    strokeDasharray="50 50"
                  />
               </svg>
            </div>
            <span className="text-[12px] font-black text-zinc-900 dark:text-white tracking-widest">{obj.progress}%</span>
         </div>
      </div>
    </motion.div>
  );
}

// --------------------------------------------------------------------------------
// INFOS VIEW
// --------------------------------------------------------------------------------
function InfosView() {
  const details = [
    { label: "Email Address", value: "clara@coconut.health", icon: EnvelopeSimple },
    { label: "Phone", value: "+33 (0) 1 42 68 53 00", icon: Phone },
    { label: "Location", value: "Paris - HQ-04", icon: MapPin },
    { label: "Department", value: "Product R&D", icon: Buildings },
    { label: "Access Level", value: "Level 4 (Admin)", icon: ShieldCheck },
    { label: "Role", value: "Senior Product Manager", icon: Briefcase },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white dark:bg-zinc-900 rounded-[42px] border border-zinc-200 dark:border-zinc-800 shadow-sm p-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {details.map((d) => (
          <div key={d.label} className="space-y-3">
             <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 text-[11px] font-black uppercase tracking-[0.2em]">
                <d.icon weight="fill" size={14} />
                {d.label}
             </div>
             <p className="text-[17px] font-black text-zinc-900 dark:text-white tracking-tight">{d.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 pt-16 border-t border-zinc-100 dark:border-zinc-800">
        <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-8 leading-none">Administrative Credentials</h3>
        <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-[15px] font-medium max-w-3xl">
          Clara Lefèvre is a Senior staff member within the HMS Product Architecture team. 
          She oversees the end-to-end design lifecycle of multi-regional medical hubs with a focus on high-fidelity clinical analytics and seamless patient-provider workflows.
        </p>
      </div>
    </motion.div>
  );
}

function UserIcon(props: any) {
  return <User {...props} weight="bold" />;
}

function DotsThree(props: any) {
  return (
    <svg viewBox="0 0 256 256" {...props}>
      <path d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM204,116a12,12,0,1,0,12,12A12,12,0,0,0,204,116ZM52,116a12,12,0,1,0,12,12A12,12,0,0,0,52,116Z" />
    </svg>
  );
}
