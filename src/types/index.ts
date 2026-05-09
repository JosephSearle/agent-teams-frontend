// ── Agent nodes ────────────────────────────────────────────────────────────
export type AgentStatus = 'idle' | 'running' | 'waiting' | 'complete' | 'error'

export interface AgentNode {
  id: string
  name: string
  icon: string
  status: AgentStatus
  desc?: string
}

// ── Graphs / assistants ────────────────────────────────────────────────────
export interface Graph {
  id: string
  name: string
  version: string
  desc: string
  nodes: number
  runs: number
  current?: boolean
}

// ── Tool calls ─────────────────────────────────────────────────────────────
export type ToolCallStatus = 'streaming' | 'complete' | 'error'

export interface ToolCall {
  name: string
  status: ToolCallStatus
  args: string
  result?: string
  duration?: string
  open: boolean
}

// ── Human-in-the-loop interrupt ────────────────────────────────────────────
export interface Interrupt {
  title: string
  from: string
  prompt: string
  payload: string
  rejected?: boolean
}

// ── Messages ───────────────────────────────────────────────────────────────
export interface UserMessage {
  kind: 'user'
  from: string
  time: string
  text: string
}

export interface AgentMessage {
  kind: 'agent'
  agentId: string
  from: string
  time: string
  text: string
  tool?: ToolCall
  interrupt?: Interrupt
  interruptResolved?: boolean
}

export interface SystemMessage {
  kind: 'system'
  text: string
  from?: string
  to?: string
  time: string
}

export type Message = UserMessage | AgentMessage | SystemMessage

// ── Tasks ──────────────────────────────────────────────────────────────────
export type Phase =
  | 'Planning'
  | 'Architecture'
  | 'Implementation'
  | 'Review'
  | 'Testing'
  | 'Deployment'

export type Priority = 'hi' | 'med' | 'lo'

export type TaskStatus = 'todo' | 'active' | 'blocked' | 'done'

export interface Task {
  id: string
  title: string
  phase: Phase
  agent: string
  priority: Priority
  status: TaskStatus
  note?: string
  warn?: string
}

// ── Decision log ───────────────────────────────────────────────────────────
export interface Decision {
  t: string
  agent: string
  text: string
}

// ── UI ─────────────────────────────────────────────────────────────────────
export type Layout = 'three-panel' | 'two-panel'
