import type { Graph } from '@/types'

interface GraphSwitcherModalProps {
  graphs: Graph[]
  onClose: () => void
  onSelect: (graph: Graph) => void
}

export function GraphSwitcherModal({ graphs, onClose, onSelect }: GraphSwitcherModalProps) {
  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Switch team"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[var(--border)] bg-[var(--bg-panel)] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <h2 className="text-sm font-semibold text-[var(--text)]">Switch team</h2>
          <button
            aria-label="Close modal"
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded text-[var(--text-dim)] hover:bg-[var(--bg-elev)] hover:text-[var(--text)] transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-2 max-h-[60vh] overflow-y-auto">
          {graphs.map((g) => (
            <button
              key={g.id}
              onClick={() => onSelect(g)}
              className="flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-[var(--bg-elev)]"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[var(--text)]">{g.name}</span>
                  <span className="font-mono text-[10px] text-[var(--text-dim)]">{g.version}</span>
                  {g.current && (
                    <span className="rounded bg-[var(--accent)]/10 px-1 py-0.5 font-mono text-[10px] text-[var(--accent)]">
                      active
                    </span>
                  )}
                </div>
                <div className="mt-0.5 truncate text-xs text-[var(--text-dim)]">{g.desc}</div>
              </div>
              <div className="shrink-0 text-right font-mono text-[10px] text-[var(--text-dim)]">
                {g.runs.toLocaleString()} runs
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
