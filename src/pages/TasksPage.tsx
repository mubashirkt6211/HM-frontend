"use client"

import { type ComponentProps, useState, useMemo } from "react"
import { Badge } from "@/components/reui/badge"
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanColumnHandle,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay,
} from "@/components/reui/kanban"
import {
  Filters,
  type Filter,
  type FilterFieldConfig,
} from "@/components/reui/filters"
import { User, Tag } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ListFilterPlusIcon } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { DotsSixVertical, Plus } from "@phosphor-icons/react"

const USERS = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
    initials: "AJ",
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah@example.com",
    avatar: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
    initials: "SC",
  },
  {
    id: "3",
    name: "Michael Rodriguez",
    email: "michael@example.com",
    avatar: "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=96&h=96&dpr=2&q=80",
    initials: "MR",
  },
  {
    id: "4",
    name: "Emma Wilson",
    email: "emma@example.com",
    avatar: "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80",
    initials: "EW",
  },
  {
    id: "5",
    name: "David Kim",
    email: "david@example.com",
    avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=96&h=96&dpr=2&q=80",
    initials: "DK",
  },
  {
    id: "6",
    name: "Aron Thompson",
    email: "lisa@example.com",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=96&h=96&dpr=2&q=80",
    initials: "LT",
  },
  {
    id: "7",
    name: "James Brown",
    email: "james@example.com",
    avatar: "https://images.unsplash.com/photo-1543299750-19d1d6297053?w=96&h=96&dpr=2&q=80",
    initials: "JB",
  },
  {
    id: "8",
    name: "Maria Garcia",
    email: "maria@example.com",
    avatar: "https://images.unsplash.com/photo-1620075225255-8c2051b6c015?w=96&h=96&dpr=2&q=80",
    initials: "MG",
  },
  {
    id: "9",
    name: "Nick Johnson",
    email: "nick@example.com",
    avatar: "https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?w=96&h=96&dpr=2&q=80",
    initials: "NJ",
  },
  {
    id: "10",
    name: "Liam Thompson",
    email: "liam@example.com",
    avatar: "https://images.unsplash.com/photo-1542595913-85d69b0edbaf?w=96&h=96&dpr=2&q=80",
    initials: "LT",
  },
]

const MEMBERS = USERS.map((user, index) => ({
  ...user,
  position: [
    "Software Engineer",
    "Product Manager",
    "UX Designer",
    "Technical Lead",
    "CTO",
  ][index % 5],
}))


interface Task {
  id: string
  title: string
  priority: "low" | "medium" | "high"
  description?: string
  assignee?: string
  assigneeAvatar?: string
  dueDate?: string
}

const COLUMN_TITLES: Record<string, string> = {
  backlog: "Backlog",
  inProgress: "In Progress",
  review: "Review",
  done: "Done",
}

interface TaskCardProps extends Omit<
  ComponentProps<typeof KanbanItem>,
  "value" | "children"
> {
  task: Task
  asHandle?: boolean
  isOverlay?: boolean
}

function TaskCard({ task, asHandle, isOverlay, ...props }: TaskCardProps) {
  const cardContent = (
    <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="line-clamp-1 text-[14px] font-bold text-zinc-900 dark:text-zinc-100">{task.title}</span>
          <Badge
            variant={
              task.priority === "high"
                ? "destructive-light"
                : task.priority === "medium"
                  ? "primary-light"
                  : "warning-light"
            }
            className="pointer-events-none h-5 shrink-0 rounded-md px-2 text-[10px] font-black uppercase tracking-wider"
          >
            {task.priority}
          </Badge>
        </div>
        <div className="flex items-center justify-between mt-4">
          {task.assignee && (
            <div className="flex items-center gap-2">
              <Avatar className="size-6 border-2 border-white dark:border-zinc-800 shadow-sm">
                <AvatarImage src={task.assigneeAvatar} />
                <AvatarFallback className="text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800">{task.assignee.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">{task.assignee}</span>
            </div>
          )}
          {task.dueDate && (
            <time className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight tabular-nums bg-zinc-50 dark:bg-zinc-800/50 px-2 py-0.5 rounded-md">
              {task.dueDate}
            </time>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <KanbanItem value={task.id} {...props}>
      {asHandle && !isOverlay ? (
        <KanbanItemHandle>{cardContent}</KanbanItemHandle>
      ) : (
        cardContent
      )}
    </KanbanItem>
  )
}

interface TaskColumnProps extends Omit<
  ComponentProps<typeof KanbanColumn>,
  "children"
> {
  tasks: Task[]
  isOverlay?: boolean
}

function TaskColumn({ value, tasks, isOverlay, ...props }: TaskColumnProps) {
  return (
    <KanbanColumn value={value} {...props} className="h-full">
      <div className="flex flex-col h-full bg-zinc-50/50 dark:bg-zinc-900/30 rounded-[28px] p-2 border border-zinc-200/50 dark:border-zinc-800/50">
        <div className="flex items-center justify-between p-4 mb-2">
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">
              {COLUMN_TITLES[value]}
            </span>
            <span className="flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-white dark:bg-zinc-800 text-[10px] font-black text-zinc-500 shadow-sm ring-1 ring-zinc-200/50 dark:ring-zinc-700/50">
              {tasks.length}
            </span>
          </div>
          <KanbanColumnHandle
            render={(props) => (
              <Button {...props} size="icon" variant="ghost" className="h-8 w-8 hover:bg-white dark:hover:bg-zinc-800 rounded-xl">
                <DotsSixVertical className="w-4 h-4 text-zinc-400" />
              </Button>
            )}
          />
        </div>
        <KanbanColumnContent value={value} className="flex-1 flex flex-col gap-3 px-2 overflow-y-auto no-scrollbar pb-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              asHandle={!isOverlay}
              isOverlay={isOverlay}
            />
          ))}
        </KanbanColumnContent>
      </div>
    </KanbanColumn>
  )
}

export function TasksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<Filter[]>([])
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskPriority, setNewTaskPriority] = useState<Task["priority"]>("medium")
  const [selectedMemberId, setSelectedMemberId] = useState<string>(MEMBERS[0].id)

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return

    const member = MEMBERS.find(m => m.id === selectedMemberId) || MEMBERS[0]
    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTaskTitle,
      priority: newTaskPriority,
      assignee: member.name,
      assigneeAvatar: member.avatar,
      dueDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    }

    setColumns(prev => ({
      ...prev,
      backlog: [task, ...prev.backlog]
    }))

    setNewTaskTitle("")
    setNewTaskPriority("medium")
    setSelectedMemberId(MEMBERS[0].id)
    setIsAddTaskModalOpen(false)
  }

  const FILTER_FIELDS: FilterFieldConfig[] = [
    {
      key: "priority",
      label: "Priority",
      icon: <Tag className="w-4 h-4" />,
      type: "select",
      options: [
        { value: "high", label: "High" },
        { value: "medium", label: "Medium" },
        { value: "low", label: "Low" },
      ],
    },
    {
      key: "assignee",
      label: "Assignee",
      icon: <User className="w-4 h-4" />,
      type: "text",
      placeholder: "Filter by name...",
    },
  ]

  const [columns, setColumns] = useState<Record<string, Task[]>>({
    backlog: [
      {
        id: "1",
        title: "Patient follow-up for Sarah",
        priority: "high",
        assignee: "Dr. Alex Johnson",
        assigneeAvatar: "https://i.pravatar.cc/100?img=1",
        dueDate: "Jan 10, 2025",
      },
      {
        id: "2",
        title: "Review laboratory results",
        priority: "medium",
        assignee: "Sarah Chen",
        assigneeAvatar: "https://i.pravatar.cc/100?img=5",
        dueDate: "Jan 15, 2025",
      },
      {
        id: "3",
        title: "Update medical equipment list",
        priority: "low",
        assignee: "Michael Rodriguez",
        assigneeAvatar: "https://i.pravatar.cc/100?img=8",
        dueDate: "Jan 20, 2025",
      },
    ],
    inProgress: [
      {
        id: "4",
        title: "Surgical ward rotation plan",
        priority: "high",
        assignee: "Emma Wilson",
        assigneeAvatar: "https://i.pravatar.cc/100?img=11",
        dueDate: "Aug 25, 2025",
      },
      {
        id: "5",
        title: "Implement new billing system",
        priority: "medium",
        assignee: "David Kim",
        assigneeAvatar: "https://i.pravatar.cc/100?img=15",
        dueDate: "Aug 25, 2025",
      },
    ],
    done: [
      {
        id: "7",
        title: "Monthly staff meeting",
        priority: "high",
        assignee: "Aron Thompson",
        assigneeAvatar: "https://i.pravatar.cc/100?img=18",
        dueDate: "Sep 25, 2025",
      },
      {
        id: "8",
        title: "Initial patient intake form",
        priority: "low",
        assignee: "James Brown",
        assigneeAvatar: "https://i.pravatar.cc/100?img=22",
        dueDate: "Sep 20, 2025",
      },
    ],
  })

  const filteredColumns = useMemo(() => {
    const result: Record<string, Task[]> = {}
    Object.entries(columns).forEach(([key, tasks]) => {
      result[key] = tasks.filter(task => {
        const matchesSearch = !searchQuery || task.title.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilters = activeFilters.every(f => {
          if (f.field === 'priority') return f.values.length === 0 || f.values.includes(task.priority)
          if (f.field === 'assignee') return !f.values[0] || task.assignee?.toLowerCase().includes(f.values[0].toLowerCase())
          return true
        })
        return matchesSearch && matchesFilters
      })
    })
    return result
  }, [columns, searchQuery, activeFilters])

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-700">


      <div className="mb-6 flex items-center justify-end gap-3 mt-5">
        <Filters
          filters={activeFilters}
          fields={FILTER_FIELDS}
          onChange={setActiveFilters}
          trigger={
            <Button
              variant="outline"
              size="sm"
              className="rounded-md border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900 shadow-sm transition-all"
            >
              <ListFilterPlusIcon className="w-4 h-4 mr-2" />
              Filter
            </Button>
          }
        />

        <Dialog open={isAddTaskModalOpen} onOpenChange={setIsAddTaskModalOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="rounded-md bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 shadow-md font-bold px-4 transition-all"
            >
              <Plus className="w-4 h-4 mr-1.5" weight="bold" />
              Add Kanban
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm border border-zinc-200 dark:border-zinc-800 p-0 overflow-hidden">
            <DialogHeader className="p-8 pb-4">
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new task to the system backlog.
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 px-8 py-6 space-y-8 overflow-y-auto no-scrollbar">
              <div className="space-y-2.5">
                <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest pl-1">Task Title</label>
                <input
                  placeholder="E.g. Schedule recurring maintenance..."
                  className="w-full h-12 px-4 rounded-md bg-zinc-50 dark:bg-zinc-900  transition-all text-[14px] font-bold"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2.5">
                <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest pl-1">Priority Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {["low", "medium", "high"].map((p) => {
                    const priorityColors: Record<string, string> = {
                      low: "bg-emerald-600 border-emerald-600",
                      medium: "bg-amber-500 border-amber-500",
                      high: "bg-rose-600 border-rose-600",
                    }
                    const shadowColors: Record<string, string> = {
                      low: "shadow-emerald-500/20",
                      medium: "shadow-amber-500/20",
                      high: "shadow-rose-500/20",
                    }

                    return (
                      <button
                        key={p}
                        onClick={() => setNewTaskPriority(p as Task["priority"])}
                        className={cn(
                          "h-11 rounded-md border text-[12px] font-black uppercase tracking-wider transition-all",
                          newTaskPriority === p
                            ? `${priorityColors[p]} text-white shadow-lg ${shadowColors[p]}`
                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-black/5 dark:hover:border-white/10"
                        )}
                      >
                        {p}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest pl-1">Assignee</label>
                <div className="relative">
                  <select
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                    className="w-full h-12 px-4 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 transition-all text-[13px] font-bold text-zinc-900 dark:text-zinc-100 appearance-none cursor-pointer"
                  >
                    {MEMBERS.map(m => (
                      <option key={m.id} value={m.id}>{m.name} — {m.position}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                    <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="p-8 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
              <DialogClose asChild>
                <Button variant="ghost" className="rounded-xl font-bold">Cancel</Button>
              </DialogClose>
              <Button
                onClick={handleAddTask}
                className="rounded-xl bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 shadow-xl font-bold px-8 transition-all"
              >
                Create Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info banner */}
      <div className="flex items-center gap-3 mt-2 px-4 py-2.5 mb-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/40 text-amber-800 dark:text-amber-300">
        <svg className="w-4 h-4 shrink-0 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
        </svg>
        <p className="text-[12px] font-semibold flex-1">
          Completed tasks are automatically removed after <span className="font-black">7 days</span> to keep the board clean.
        </p>
      </div>

      <div className="flex-1 min-h-0">
        <Kanban
          value={filteredColumns}
          onValueChange={setColumns}
          getItemValue={(item) => item.id}
          className="h-full"
        >
          <KanbanBoard className="grid h-full auto-rows-fr grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden pb-4">
            {Object.entries(filteredColumns).map(([columnValue, tasks]) => (
              <TaskColumn key={columnValue} value={columnValue} tasks={tasks} />
            ))}
          </KanbanBoard>
          <KanbanOverlay>
            {({ value, variant }) => {
              if (variant === "column") {
                return <TaskColumn value={value as string} tasks={columns[value as string]} isOverlay />
              }

              const task = Object.values(columns).flat().find(t => t.id === value)
              return task ? <TaskCard task={task} isOverlay /> : null
            }}
          </KanbanOverlay>
        </Kanban>
      </div>
    </div >
  )
}
