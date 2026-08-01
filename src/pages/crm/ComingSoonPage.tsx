import React from "react"
import { motion } from "motion/react"
import { Clock, Hammer, Sparkle, Tooth, Syringe } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface ComingSoonPageProps {
    title: string
    icon?: React.ElementType
}

export function ComingSoonPage({ title, icon: Icon = Clock }: ComingSoonPageProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md space-y-6"
            >
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />
                    <div className="relative flex items-center justify-center size-24 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl mb-8 mx-auto group">
                        <motion.div
                            animate={{ 
                                rotate: [0, 5, -5, 0],
                                scale: [1, 1.05, 0.95, 1]
                            }}
                            transition={{ 
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <Icon className="size-12 text-blue-600 group-hover:text-blue-500 transition-colors" weight="duotone" />
                        </motion.div>
                        <motion.div
                            className="absolute -top-1 -right-1"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Sparkle className="size-6 text-amber-400" weight="fill" />
                        </motion.div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
                        {title}
                    </h1>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[12px] font-bold uppercase tracking-wider">
                        <Clock className="w-4 h-4" weight="bold" />
                        Coming Soon
                    </div>
                </div>

                <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium">
                    We're building a specialized interface for this registry. 
                    The high-fidelity management system is currently under construction.
                </p>

                <div className="pt-8 flex flex-col items-center gap-4">
                    <div className="flex -space-x-3 overflow-hidden">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="inline-block size-10 rounded-full ring-2 ring-white dark:ring-zinc-950 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-zinc-400">DEV</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-[13px] text-zinc-400 font-medium">
                        Our engineering team is working hard to finalize this module.
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
