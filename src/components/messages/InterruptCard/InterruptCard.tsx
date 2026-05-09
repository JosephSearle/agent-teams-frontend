import { Button } from '@/components/ui/Button/Button'
import type { Interrupt } from '@/types'
import { cn } from '@/lib/utils'

interface InterruptCardProps {
  data: Interrupt
  onApprove: () => void
  onReject: () => void
  resolved?: boolean
}

export function InterruptCard({ data, onApprove, onReject, resolved }: InterruptCardProps) {
  return (
    <div
      className={cn(
        'mt-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4',
        resolved && 'opacity-70',
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="text-amber-400">✋</span>
        <span className="text-xs font-medium text-[var(--text-muted)]">
          Human-in-the-loop · {resolved ? 'resolved' : 'awaiting input'}
        </span>
        <span className="ml-auto font-mono text-[10px] text-[var(--text-dim)]">
          from <span className="text-emerald-400">{data.from}</span>
        </span>
      </div>

      <div className="mb-1 text-sm font-semibold text-[var(--text)]">{data.title}</div>
      <div className="mb-3 text-xs text-[var(--text-muted)]">{data.prompt}</div>

      <pre className="mb-4 overflow-x-auto rounded bg-[var(--bg-code)] p-3 font-mono text-[11px] text-[var(--text-muted)]">
        {data.payload}
      </pre>

      <div className="flex items-center gap-2">
        {resolved ? (
          <span
            className={cn('font-mono text-xs', data.rejected ? 'text-red-400' : 'text-emerald-400')}
          >
            {data.rejected ? '✗ Rejected · redesigning' : '✓ Approved · graph resumed'}
          </span>
        ) : (
          <>
            <Button variant="sage" onClick={onApprove}>
              ✓ Approve &amp; continue
            </Button>
            <Button variant="ghost" onClick={onApprove}>
              ✎ Edit &amp; approve
            </Button>
            <Button variant="danger" onClick={onReject}>
              ✗ Reject
            </Button>
            <span className="ml-auto font-mono text-[10px] text-[var(--text-dim)]">
              graph paused
            </span>
          </>
        )}
      </div>
    </div>
  )
}
