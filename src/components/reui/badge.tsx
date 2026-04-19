import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        "success-outline": "border-emerald-500/30 bg-emerald-50/50 text-emerald-600 dark:bg-emerald-900/10 dark:text-emerald-400",
        "destructive-outline": "border-destructive/30 bg-destructive/5 text-destructive",
        "warning-outline": "border-amber-500/30 bg-amber-50/50 text-amber-600 dark:bg-amber-900/10 dark:text-amber-400",
        "primary-light": "border-indigo-500/20 bg-indigo-50/50 text-indigo-600 dark:bg-indigo-900/10 dark:text-indigo-400",
        "destructive-light": "border-rose-500/20 bg-rose-50/50 text-rose-600 dark:bg-rose-900/10 dark:text-rose-400",
        "warning-light": "border-amber-500/20 bg-amber-50/50 text-amber-600 dark:bg-amber-900/10 dark:text-amber-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
