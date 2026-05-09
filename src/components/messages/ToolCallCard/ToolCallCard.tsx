import { cn } from '@/lib/utils'
import type { ToolCall } from '@/types'

interface ToolCallCardProps {
  tool: ToolCall
  onToggle: () => void
}

export function ToolCallCard({ tool, onToggle }: ToolCallCardProps) {
  return (
    <div
      className={cn(
        'mt-2 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--bg-code)] text-xs',
      )}
    >
      <button
        aria-label="toggle tool"
        onClick={onToggle}
        className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-[var(--bg-elev)] transition-colors"
      >
        <span
          className={cn(
            'transition-transform text-[var(--text-dim)]',
            tool.open ? 'rotate-90' : 'rotate-0',
          )}
        >
          ›
        </span>
        <span className="rounded bg-[var(--bg-elev)] px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)]">
          tool
        </span>
        <span className="font-mono text-[var(--text-muted)]">{tool.name}</span>
        <span
          className={cn(
            'ml-auto font-mono text-[10px]',
            tool.status === 'streaming' ? 'animate-pulse text-amber-400' : 'text-[var(--text-dim)]',
          )}
        >
          {tool.status === 'streaming' ? 'running' : (tool.duration ?? tool.status)}
        </span>
      </button>

      <div
        data-testid="tool-body"
        className={cn('overflow-hidden transition-all duration-200', !tool.open && 'hidden')}
        aria-hidden={!tool.open}
      >
        <div className="border-t border-[var(--border)] p-3 space-y-3">
          <div>
            <div className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">
              Input
            </div>
            <pre className="overflow-x-auto rounded bg-[var(--bg)] p-2 text-[var(--text-muted)] text-[11px]">
              {tool.args}
            </pre>
          </div>
          {tool.result && (
            <div>
              <div className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                Output
              </div>
              <pre className="overflow-x-auto rounded bg-[var(--bg)] p-2 text-[var(--text-muted)] text-[11px]">
                {tool.result}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
