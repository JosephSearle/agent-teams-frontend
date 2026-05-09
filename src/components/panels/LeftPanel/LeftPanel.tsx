import { StatusDot } from '@/components/ui/StatusDot/StatusDot'
import { Badge } from '@/components/ui/Badge/Badge'
import { cn } from '@/lib/utils'
import type { AgentNode, Graph } from '@/types'
import type { StreamStatus } from '@/stores/slices/threadSlice'

interface LeftPanelProps {
  nodes: AgentNode[]
  graph: Graph | null
  streamStatus?: StreamStatus
  onSwitchGraph: () => void
}

function ConnectionStatus({ status }: { readonly status: StreamStatus }) {
  if (status === 'error') {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="h-2 w-2 rounded-full bg-red-500" />
        <span className="text-red-400">Error</span>
      </div>
    )
  }
  if (status === 'streaming') {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="text-[var(--text-muted)]">Connected · streaming</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="h-2 w-2 rounded-full bg-emerald-500" />
      <span className="text-[var(--text-muted)]">Connected</span>
    </div>
  )
}

export function LeftPanel({ nodes, graph, streamStatus = 'idle', onSwitchGraph }: LeftPanelProps) {
  return (
    <aside className="flex flex-col border-r border-[var(--border)] bg-[var(--bg-panel)] overflow-hidden">
      <div className="p-4 border-b border-[var(--border)]">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-[var(--accent)] font-serif text-xs font-bold text-[var(--bg)]">
            L
          </div>
          <span className="text-sm font-semibold text-[var(--text)]">Agent Teams</span>
        </div>

        {graph ? (
          <>
            <div className="mb-2">
              <div className="text-sm font-medium text-[var(--text)]">{graph.name}</div>
              <div className="font-mono text-[10px] text-[var(--text-dim)]">
                {graph.version} · {graph.id}
              </div>
            </div>
            <ConnectionStatus status={streamStatus} />
          </>
        ) : (
          <div className="text-xs text-[var(--text-dim)]">No team selected</div>
        )}
      </div>

      <div className="px-3 pt-3 pb-1 flex items-center justify-between">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">
          Team members
        </span>
        <Badge
          label={String(nodes.length)}
          className="bg-[var(--bg-elev)] text-[var(--text-dim)]"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1 pb-2">
        {nodes.map((n) => (
          <div
            key={n.id}
            className={cn(
              'flex items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors',
              n.status === 'running' || n.status === 'waiting'
                ? 'bg-[var(--bg-elev)]'
                : 'hover:bg-[var(--bg-elev)]/50',
            )}
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[var(--bg-elev)] font-mono text-xs font-semibold text-[var(--text-muted)]">
              {n.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium text-[var(--text)] text-xs">{n.name}</div>
              {n.desc && (
                <div className="truncate text-[10px] text-[var(--text-dim)]">{n.desc}</div>
              )}
            </div>
            <StatusDot status={n.status} />
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--border)] p-3">
        <button
          onClick={onSwitchGraph}
          aria-label="Switch team"
          className="flex w-full items-center justify-center gap-2 rounded border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text)]"
        >
          ⇄ Switch team
        </button>
      </div>
    </aside>
  )
}
