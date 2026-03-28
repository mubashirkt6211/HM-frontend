import * as React from "react"
import { Combobox as BaseCombobox } from "@base-ui/react/combobox"
import { cn } from "@/lib/utils"


/**
 * ReUI-inspired Combobox component wrapping @base-ui/react primitives.
 */

const Combobox = BaseCombobox.Root
const ComboboxTrigger = BaseCombobox.Trigger
const ComboboxList = BaseCombobox.List
const ComboboxItem = BaseCombobox.Item


const ComboboxValue = ({ children, ...props }: any) => {
  return (
    <span data-slot="combobox-value" {...props}>
      {children}
    </span>
  );
};


const ComboboxContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Popup>
>(({ className, children, ...props }, ref) => (
  <BaseCombobox.Portal>
    <BaseCombobox.Positioner sideOffset={8}>
      <BaseCombobox.Popup
        ref={ref}
        className={cn(
          "z-50 min-w-[var(--anchor-width)] overflow-hidden rounded-xl border border-zinc-200 bg-white p-1 text-zinc-950 shadow-xl outline-none animate-in fade-in zoom-in-95 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50",
          className
        )}
        {...props}
      >
        {children}
      </BaseCombobox.Popup>
    </BaseCombobox.Positioner>
  </BaseCombobox.Portal>
))
ComboboxContent.displayName = "ComboboxContent"

const ComboboxEmpty = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("py-6 text-center text-sm text-zinc-500 dark:text-zinc-400", className)}
    {...props}
  />
))
ComboboxEmpty.displayName = "ComboboxEmpty"

// Extend BaseCombobox components with styling
const StyledComboboxInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Input> & { showTrigger?: boolean }
>(({ className, showTrigger, ...props }, ref) => (
  <div className="flex items-center border-b border-zinc-100 px-3 dark:border-zinc-800">
    <BaseCombobox.Input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-50",
        className
      )}
      {...props}
    />
  </div>
))
StyledComboboxInput.displayName = "ComboboxInput"

export {
  Combobox,
  ComboboxTrigger,
  StyledComboboxInput as ComboboxInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxList,
  ComboboxItem,
  ComboboxValue,
}

