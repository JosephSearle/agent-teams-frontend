import type { StateCreator } from 'zustand'
import { nowTime } from '@/lib/utils'
import type { Message, Task, Decision } from '@/types'

export type StreamStatus = 'idle' | 'streaming' | 'paused' | 'error'

export interface ThreadSlice {
  threadId: string | null
  runId: string | null
  messages: Message[]
  tasks: Task[]
  decisions: Decision[]
  streamStatus: StreamStatus
  setThreadId: (id: string) => void
  setRunId: (id: string | null) => void
  appendMessage: (msg: Message) => void
  updateMessage: (index: number, updater: (msg: Message) => Message) => void
  resolveInterrupt: (index: number, approved: boolean) => void
  toggleTool: (msg: Message) => void
  toggleTask: (id: string) => void
  setStreamStatus: (status: StreamStatus) => void
  addDecision: (decision: Decision) => void
}

export const createThreadSlice: StateCreator<
  ThreadSlice,
  [['zustand/devtools', never]],
  [],
  ThreadSlice
> = (set) => ({
  threadId: null,
  runId: null,
  messages: [],
  tasks: [],
  decisions: [],
  streamStatus: 'idle',

  setThreadId: (id) => set({ threadId: id }, undefined, 'thread/setThreadId'),
  setRunId: (id) => set({ runId: id }, undefined, 'thread/setRunId'),

  appendMessage: (msg) =>
    set((s) => ({ messages: [...s.messages, msg] }), undefined, 'thread/appendMessage'),

  updateMessage: (index, updater) =>
    set(
      (s) => ({
        messages: s.messages.map((m, i) => (i === index ? updater(m) : m)),
      }),
      undefined,
      'thread/updateMessage',
    ),

  resolveInterrupt: (index, approved) =>
    set(
      (s) => {
        const updated = s.messages.map((m, i) => {
          if (i !== index || m.kind !== 'agent') return m
          return {
            ...m,
            interruptResolved: true,
            interrupt: m.interrupt ? { ...m.interrupt, rejected: !approved } : m.interrupt,
          }
        })
        const resumeMsg: Message = {
          kind: 'system',
          text: approved ? 'Resumed ·' : 'Rejected · architect requesting alternative',
          time: nowTime(),
        }
        return { messages: [...updated, resumeMsg] }
      },
      undefined,
      'thread/resolveInterrupt',
    ),

  toggleTool: (msg) =>
    set(
      (s) => ({
        messages: s.messages.map((m) => {
          if (m !== msg || m.kind !== 'agent' || !m.tool) return m
          return { ...m, tool: { ...m.tool, open: !m.tool.open } }
        }),
      }),
      undefined,
      'thread/toggleTool',
    ),

  toggleTask: (id) =>
    set(
      (s) => ({
        tasks: s.tasks.map((t) =>
          t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t,
        ),
      }),
      undefined,
      'thread/toggleTask',
    ),

  setStreamStatus: (status) => set({ streamStatus: status }, undefined, 'thread/setStreamStatus'),

  addDecision: (decision) =>
    set((s) => ({ decisions: [...s.decisions, decision] }), undefined, 'thread/addDecision'),
})
