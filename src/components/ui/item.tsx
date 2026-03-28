import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Item component family for rich list displays with titles and descriptions.
 */
function Item({ 
  className, 
  size = "md", 
  ...props 
}: React.ComponentProps<"div"> & { size?: "xs" | "sm" | "md" }) {
  return (
    <div
      data-slot="item"
      data-size={size}
      className={cn(
        "flex items-center gap-3 w-full",
        size === "xs" && "gap-2",
        className
      )}
      {...props}
    />
  )
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div 
      data-slot="item-content"
      className={cn("flex flex-col min-w-0 flex-1 leading-tight", className)} 
      {...props} 
    />
  )
}

function ItemTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span 
      data-slot="item-title"
      className={cn("text-[13px] font-bold text-zinc-900 dark:text-zinc-100", className)} 
      {...props} 
    />
  )
}

function ItemDescription({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span 
      data-slot="item-description"
      className={cn("text-[11px] font-medium text-zinc-500 truncate dark:text-zinc-400", className)} 
      {...props} 
    />
  )
}

export { Item, ItemContent, ItemTitle, ItemDescription }
