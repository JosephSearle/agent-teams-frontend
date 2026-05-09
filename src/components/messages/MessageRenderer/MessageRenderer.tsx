import { MarkdownRenderer } from '../MarkdownRenderer'
import { ToolCallCard } from '../ToolCallCard/ToolCallCard'
import { InterruptCard } from '../InterruptCard/InterruptCard'
import { cn } from '@/lib/utils'
import type { Message } from '@/types'

interface MessageRendererProps {
  message: Message
  idx: number
  onToggleTool: (msg: Message) => void
  onApprove: (msg: Message) => void
  onReject: (msg: Message) => void
  adminMode?: boolean
  langfuseBase?: string
  traceId?: string
}

const agentAvatarColour: Record<string, string> = {
  planner: 'bg-violet-500/20 text-violet-300',
  architect: 'bg-blue-500/20 text-blue-300',
  coder: 'bg-emerald-500/20 text-emerald-300',
  reviewer: 'bg-orange-500/20 text-orange-300',
  tester: 'bg-pink-500/20 text-pink-300',
  deployer: 'bg-sky-500/20 text-sky-300',
}

export function MessageRenderer({
  message: msg,
  idx,
  onToggleTool,
  onApprove,
  onReject,
  adminMode,
  langfuseBase,
  traceId,
}: MessageRendererProps) {
  if (msg.kind === 'system') {
    return (
      <div className="my-3 flex items-center gap-3 text-xs text-[var(--text-dim)]">
        <div className="h-px flex-1 bg-[var(--border)]" />
        <div className="flex items-center gap-1.5">
          <span>{msg.text}</span>
          {msg.from && msg.to && (
            <>
              <code className="font-mono text-[var(--text-muted)]">{msg.from}</code>
              <span className="text-[var(--accent)]">→</span>
              <code className="font-mono text-[var(--accent)]">{msg.to}</code>
            </>
          )}
          {msg.time && <span className="opacity-60">{msg.time}</span>}
        </div>
        <div className="h-px flex-1 bg-[var(--border)]" />
      </div>
    )
  }

  if (msg.kind === 'user') {
    return (
      <div className="flex gap-3 py-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[var(--accent)]/20 font-mono text-xs font-semibold text-[var(--accent)]">
          YO
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2 text-xs">
            <span className="font-semibold text-[var(--accent)]">{msg.from}</span>
            <span className="text-[var(--text-dim)]">{msg.time}</span>
          </div>
          <div className="rounded-lg bg-[var(--bg-elev)] px-3 py-2.5 text-sm text-[var(--text)]">
            {msg.text}
          </div>
        </div>
      </div>
    )
  }

  const obsId = `obs_${idx.toString(36).padStart(3, '0')}_${msg.agentId}`
  const avatarClass =
    agentAvatarColour[msg.agentId] ?? 'bg-[var(--bg-elev)] text-[var(--text-muted)]'

  return (
    <div className="flex gap-3 py-3">
      <div
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded font-mono text-xs font-semibold',
          avatarClass,
        )}
      >
        {msg.from[0]}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2 text-xs">
          <span className="font-semibold text-[var(--text)]">{msg.from}</span>
          <span className="text-[var(--text-dim)]">
            {msg.agentId}_agent · {msg.time}
          </span>
          {adminMode && langfuseBase && traceId && (
            <a
              href={`${langfuseBase}/trace/${traceId}?observation=${obsId}`}
              target="_blank"
              rel="noreferrer"
              className="ml-1 font-mono text-[10px] text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors"
            >
              ↗ {obsId}
            </a>
          )}
        </div>
        <div className="text-sm text-[var(--text-muted)]">
          <MarkdownRenderer content={msg.text} />
        </div>
        {msg.tool && <ToolCallCard tool={msg.tool} onToggle={() => onToggleTool(msg)} />}
        {msg.interrupt && (
          <InterruptCard
            data={msg.interrupt}
            resolved={msg.interruptResolved}
            onApprove={() => onApprove(msg)}
            onReject={() => onReject(msg)}
          />
        )}
      </div>
    </div>
  )
}
