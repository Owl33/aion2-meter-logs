import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface Props {
  children: ReactNode
  className?: string
}

export default function TransitionContent({ children, className }: Props) {
  return (
    <div className={cn("mt-2 animate-in duration-400 fade-in", className)}>
      {children}
    </div>
  )
}
