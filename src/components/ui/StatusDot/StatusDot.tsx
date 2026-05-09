import { cn } from '@/lib/utils'
import type { AgentStatus } from '@/types'

interface StatusDotProps {
  status: AgentStatus
  className?: string
}

const statusColour: Record<AgentStatus, string> = {
  idle: 'bg-[var(--text-dim)]',
  running: 'bg-[var(--accent)] animate-pulse',
  waiting: 'bg-amber-400 animate-pulse',
  complete: 'bg-emerald-400',
  error: 'bg-red-400',
}

export function StatusDot({ status, className }: StatusDotProps) {
  return (
    <span
      role="img"
      aria-label={status}
      className={cn('inline-block h-2 w-2 rounded-full', statusColour[status], className)}
    />
  )
}
