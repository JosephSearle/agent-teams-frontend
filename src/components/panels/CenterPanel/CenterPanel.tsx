import { useState, useRef, useEffect, useMemo } from 'react'
import { MessageRenderer } from '@/components/messages/MessageRenderer/MessageRenderer'
import { IconButton } from '@/components/ui/IconButton/IconButton'
import { formatTokenCount } from '@/lib/utils'
import type { Message } from '@/types'

interface ContextWidgetProps {
  messages: Message[]
}

function ContextWidget({ messages }: ContextWidgetProps) {
  const used = useMemo(() => {
    let n = 12400
    messages.forEach((m) => {
      if (m.kind === 'user') n += 80 + m.text.length / 3.5
      else if (m.kind === 'agent') n += 220 + (m.tool ? 480 : 0) + (m.interrupt ? 320 : 0)
      else n += 24
    })
    return Math.round(n)
  }, [messages])

  const max = 200000
  const pct = Math.min(100, (used / max) * 100)
  const fillClass = pct > 80 ? 'bg-red-400' : pct > 60 ? 'bg-amber-400' : 'bg-[var(--accent)]'

  return (
    <div
      className="flex flex-col gap-0.5 text-[10px]"
      title={`${used.toLocaleString()} / ${max.toLocaleString()} tokens`}
    >
      <div className="flex items-center justify-between gap-3 text-[var(--text-dim)]">
        <span>Context</span>
        <span>{pct.toFixed(1)}%</span>
      </div>
      <div className="h-1 w-24 overflow-hidden rounded-full bg-[var(--bg-elev)]">
        <div
          className={`h-full rounded-full transition-all ${fillClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-[var(--text-dim)]">
        <span>
          {formatTokenCount(used)} / {formatTokenCount(max)}
        </span>
        <span className="font-mono">sonnet-4 · 200k</span>
      </div>
    </div>
  )
}

interface CenterPanelProps {
  title: string
  messages: Message[]
  onToggleTool: (msg: Message) => void
  onApprove: (msg: Message) => void
  onReject: (msg: Message) => void
  onSend: (text: string) => void
  onInterruptGraph: () => void
  adminMode: boolean
  onToggleAdmin: () => void
  langfuseBase?: string
  runId?: string | null
  disabled?: boolean
}

export function CenterPanel({
  title,
  messages,
  onToggleTool,
  onApprove,
  onReject,
  onSend,
  onInterruptGraph,
  adminMode,
  onToggleAdmin,
  langfuseBase,
  runId,
  disabled,
}: CenterPanelProps) {
  const [val, setVal] = useState('')
  const taRef = useRef<HTMLTextAreaElement>(null)
  const threadRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight
    }
  }, [messages.length])

  const send = () => {
    if (!val.trim() || disabled) return
    onSend(val.trim())
    setVal('')
    if (taRef.current) taRef.current.style.height = 'auto'
  }

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const onInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setVal(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(160, e.target.scrollHeight)}px`
  }

  return (
    <main className="flex flex-col overflow-hidden bg-[var(--bg)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <div>
          {title && <div className="text-sm font-semibold text-[var(--text)]">{title}</div>}
        </div>
        <div className="flex items-center gap-3">
          <ContextWidget messages={messages} />
          {runId && <span className="font-mono text-[10px] text-[var(--text-dim)]">{runId}</span>}
          <button
            onClick={onToggleAdmin}
            className={`rounded border px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider transition-colors ${
              adminMode
                ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                : 'border-amber-500/30 text-amber-500/70 hover:border-amber-500/50'
            }`}
          >
            <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current" />
            Admin {adminMode ? 'on' : 'off'}
          </button>
        </div>
      </div>

      <div ref={threadRef} className="flex-1 overflow-y-auto px-4">
        <div className="mx-auto max-w-3xl py-4">
          {messages.map((m, i) => (
            <MessageRenderer
              key={i}
              message={m}
              idx={i}
              onToggleTool={onToggleTool}
              onApprove={onApprove}
              onReject={onReject}
              adminMode={adminMode}
              langfuseBase={langfuseBase}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-[var(--border)] bg-[var(--bg-panel)] p-3">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] transition-colors focus-within:border-[var(--accent)]/50">
            <textarea
              ref={taRef}
              className="w-full resize-none bg-transparent px-3 pt-3 pb-1 text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={
                disabled
                  ? 'Select a team to start chatting…'
                  : 'Send a message to the graph…  (⏎ to send, ⇧⏎ for newline)'
              }
              value={val}
              onChange={onInput}
              onKeyDown={onKey}
              disabled={disabled}
              rows={1}
            />
            <div className="flex items-center gap-1 px-2 pb-2">
              <IconButton title="Attach file">📎</IconButton>
              <IconButton title="Stop run" onClick={onInterruptGraph}>
                ⏹
              </IconButton>
              <div className="flex-1" />
              <span className="font-mono text-[10px] text-[var(--text-dim)]">
                claude-sonnet-4 · temp 0.2
              </span>
              <button
                aria-label="Send message"
                disabled={!val.trim() || disabled}
                onClick={send}
                className="ml-2 flex h-7 w-7 items-center justify-center rounded bg-[var(--accent)] text-[var(--bg)] transition-opacity disabled:pointer-events-none disabled:opacity-30 hover:opacity-90"
              >
                ↑
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
