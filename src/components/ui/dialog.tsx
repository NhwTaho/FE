import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  title?: string
  description?: string
  maxWidth?: string
}

export function Dialog({
  open,
  onOpenChange,
  children,
  title,
  description,
  maxWidth = "max-w-lg",
}: DialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={cn(
          "relative w-full rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-in zoom-in-95 duration-200",
          maxWidth
        )}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none dark:ring-offset-slate-950 dark:focus:ring-slate-300"
          aria-label="Đóng"
        >
          <X className="h-4 w-4" />
        </button>

        {title && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
            {description && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
            )}
          </div>
        )}

        {children}
      </div>
    </div>
  )
}
