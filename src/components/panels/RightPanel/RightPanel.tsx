import { cn } from '@/lib/utils'
import type { Task, Decision, Phase } from '@/types'

const PHASE_ORDER: Phase[] = [
  'Planning',
  'Architecture',
  'Implementation',
  'Review',
  'Testing',
  'Deployment',
]

interface TaskRowProps {
  task: Task
  onToggle: (id: string) => void
}

function TaskRow({ task, onToggle }: TaskRowProps) {
  const priorityColour = { hi: 'bg-red-400', med: 'bg-amber-400', lo: 'bg-[var(--text-dim)]' }
  return (
    <div
      className={cn(
        'flex items-start gap-2 px-2 py-1.5 rounded text-xs transition-colors',
        task.status === 'done' && 'opacity-50',
        task.status === 'blocked' && 'bg-red-500/5',
      )}
    >
      <div className={cn('mt-0.5 h-2 w-1 shrink-0 rounded-full', priorityColour[task.priority])} />
      <input
        type="checkbox"
        checked={task.status === 'done'}
        onChange={() => onToggle(task.id)}
        className="mt-0.5 h-3 w-3 shrink-0 cursor-pointer accent-[var(--accent)]"
        aria-label={task.title}
      />
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            'text-[var(--text)]',
            task.status === 'done' && 'line-through text-[var(--text-dim)]',
          )}
        >
          {task.title}
        </div>
        <div className="mt-0.5 flex items-center gap-1 text-[10px] text-[var(--text-dim)]">
          <span>{task.agent}</span>
          {task.note && (
            <>
              <span>·</span>
              <span className="text-[var(--accent)]">{task.note}</span>
            </>
          )}
          {task.warn && (
            <>
              <span>·</span>
              <span className="text-red-400">{task.warn}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

interface PhaseGroupProps {
  phase: string
  tasks: Task[]
  onToggle: (id: string) => void
}

function PhaseGroup({ phase, tasks, onToggle }: PhaseGroupProps) {
  const done = tasks.filter((t) => t.status === 'done').length
  return (
    <div className="mb-3">
      <div className="mb-1 flex items-center gap-2 px-2">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">
          {phase}
        </span>
        <span className="text-[10px] text-[var(--text-dim)]">
          {done}/{tasks.length}
        </span>
      </div>
      {tasks.map((t) => (
        <TaskRow key={t.id} task={t} onToggle={onToggle} />
      ))}
    </div>
  )
}

interface RightPanelProps {
  tasks: Task[]
  decisions: Decision[]
  onToggleTask: (id: string) => void
}

export function RightPanel({ tasks, decisions, onToggleTask }: RightPanelProps) {
  const byPhase = PHASE_ORDER.map((p) => ({
    phase: p,
    tasks: tasks.filter((t) => t.phase === p),
  })).filter((g) => g.tasks.length > 0)

  const activeCount = tasks.filter((t) => t.status === 'active' || t.status === 'blocked').length

  return (
    <aside className="flex flex-col border-l border-[var(--border)] bg-[var(--bg-panel)] overflow-hidden">
      <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
        <h3 className="text-sm font-semibold text-[var(--text)]">Tasks</h3>
        <span className="rounded bg-[var(--accent)]/10 px-1.5 py-0.5 font-mono text-[10px] text-[var(--accent)]">
          {activeCount} active
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {byPhase.map((g) => (
          <PhaseGroup key={g.phase} phase={g.phase} tasks={g.tasks} onToggle={onToggleTask} />
        ))}

        <div className="mt-4">
          <div className="mb-2 px-2">
            <h4 className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">
              Decisions log
            </h4>
          </div>
          <div className="space-y-2 px-2">
            {decisions.map((d, i) => (
              <div key={i} className="flex gap-2">
                <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--border)]" />
                <div>
                  <div className="text-xs text-[var(--text-muted)]">
                    <strong className="text-[var(--text)]">{d.agent}</strong> · {d.text}
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] text-[var(--text-dim)]">{d.t}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
