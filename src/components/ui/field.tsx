import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Field component for consistent spacing and layout of form elements.
 */
function Field({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div 
      className={cn("flex flex-col gap-2 w-full", className)} 
      {...props} 
    />
  )
}

export { Field }
