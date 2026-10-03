import * as React from "react"
import { cn } from "@/lib/utils"

export interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  position?: "top" | "bottom" | "left" | "right"
  className?: string
}

export function Tooltip({
  content,
  children,
  position = "top",
  className,
}: TooltipProps) {
  const [visible, setVisible] = React.useState(false)

  const positionClasses = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
  }

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && content && (
        <div
          role="tooltip"
          className={cn(
            "absolute z-50 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1 text-xs text-white shadow-md transition-opacity animate-in fade-in duration-150 dark:bg-slate-100 dark:text-slate-900",
            positionClasses[position],
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}
